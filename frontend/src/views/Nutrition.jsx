import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CardHead from '../components/CardHead.jsx'
import Icon from '../components/Icon.jsx'
import { Button, NumberField } from '../components/ui.jsx'
import { fmtDate, fmtNum, todayISO } from '../lib/format.js'
import { t } from '../lib/i18n.js'
import { lastBW } from '../lib/history.js'
import {
  ACTIVITY_PRESETS, FOOD_PRESETS, NUTRIENTS, activityCalories, mealNutrients,
  averageLoggedDeficit, nutritionEntriesOn, nutritionTotalsFor, requiredDailyDeficit,
} from '../lib/nutrition.js'
import { compressNutritionPhoto, loadNutritionPhoto, removeNutritionPhoto, saveNutritionPhoto } from '../lib/nutrition-photos.js'
import { useStore } from '../store/useStore.js'
import './Nutrition.css'

const newId = () => globalThis.crypto?.randomUUID?.() || `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`
const emptyCustom = () => Object.fromEntries(NUTRIENTS.map(([key]) => [key, '']))
const newIngredient = () => ({ id: newId(), foodId: FOOD_PRESETS[0].id, grams: 100, customName: '', custom: emptyCustom() })
const showValue = value => fmtNum(Math.round((Number(value) || 0) * 10) / 10)

function NutrientGrid({ values, compact = false }) {
  return <div className={compact ? 'nutrition-nutrients compact' : 'nutrition-nutrients'}>
    {NUTRIENTS.map(([key, label, unit]) => (
      <div className="nutrition-nutrient" key={key}>
        <span>{t(label)}</span><b>{showValue(values[key])} <small>{unit}</small></b>
      </div>
    ))}
  </div>
}

function MealForm({ date, onSaved }) {
  const [name, setName] = useState('')
  const [ingredients, setIngredients] = useState([newIngredient()])
  const [photo, setPhoto] = useState(null)
  const [preview, setPreview] = useState(null)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const photoInput = useRef(null)
  const totals = useMemo(() => mealNutrients({ ingredients }), [ingredients])

  useEffect(() => {
    if (!photo) { setPreview(null); return }
    const url = URL.createObjectURL(photo)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [photo])

  const changeIngredient = (id, patch) => setIngredients(current => current.map(item => item.id === id ? { ...item, ...patch } : item))
  const save = async event => {
    event.preventDefault()
    setError('')
    if (!name.trim()) { setError(t('Enter a meal name.')); return }
    if (!ingredients.length || ingredients.some(item => !(Number(item.grams) > 0) || (item.foodId === 'custom' && !item.customName.trim()))) {
      setError(t('Add a food name and a positive amount for every ingredient.'))
      return
    }
    setSaving(true)
    let photoId = null
    try {
      if (photo) {
        photoId = newId()
        await saveNutritionPhoto(photoId, await compressNutritionPhoto(photo))
      }
      const id = newId()
      const entry = {
        id, type: 'meal', d: date, at: Date.now(), name: name.trim().slice(0, 100),
        ingredients: ingredients.map(item => ({
          foodId: item.foodId,
          name: item.foodId === 'custom' ? item.customName.trim() : FOOD_PRESETS.find(food => food.id === item.foodId)?.name,
          grams: Number(item.grams),
          ...(item.foodId === 'custom' ? { custom: Object.fromEntries(NUTRIENTS.map(([key]) => [key, Number(item.custom[key]) || 0])) } : {}),
        })),
        ...(photoId ? { photoId } : {}),
        _ts: Date.now(),
      }
      useStore.getState().update(state => {
        state.nutritionEntries = { ...(state.nutritionEntries || {}), [id]: entry }
      })
      setName('')
      setIngredients([newIngredient()])
      setPhoto(null)
      if (photoInput.current) photoInput.current.value = ''
      onSaved()
    } catch (reason) {
      let message = reason instanceof Error ? reason.message : t('Could not save this meal.')
      if (photoId) {
        try {
          await removeNutritionPhoto(photoId)
        } catch (cleanupError) {
          const detail = cleanupError instanceof Error ? cleanupError.message : t('Unknown storage error')
          message += ` ${t('Photo cleanup also failed: {0}', detail)}`
        }
      }
      setError(message)
    } finally {
      setSaving(false)
    }
  }

  return <form className="card nutrition-form" onSubmit={save}>
    <CardHead icon="camera" tint="var(--teal)" title={t('Log food')} sub={t('Add a meal photo, then choose ingredients to estimate its nutrients.')} />
    <label className="nutrition-field">
      <span>{t('Meal name')}</span>
      <input value={name} onChange={event => setName(event.target.value)} maxLength={100} placeholder={t('e.g. Lunch')} required />
    </label>
    <div className="nutrition-form-heading">
      <h3>{t('Ingredients')}</h3>
      <Button type="button" size="sm" variant="ghost" icon="plus" onClick={() => setIngredients(current => [...current, newIngredient()])}>{t('Add ingredient')}</Button>
    </div>
    <div className="nutrition-ingredient-list">
      {ingredients.map((item, index) => (
        <div className="nutrition-ingredient" key={item.id}>
          <label className="nutrition-field">
            <span>{t('Food')}</span>
            <select value={item.foodId} onChange={event => changeIngredient(item.id, { foodId: event.target.value })}>
              {FOOD_PRESETS.map(food => <option value={food.id} key={food.id}>{t(food.name)}</option>)}
              <option value="custom">{t('Custom food')}</option>
            </select>
          </label>
          {item.foodId === 'custom' && <label className="nutrition-field">
            <span>{t('Food name')}</span>
            <input value={item.customName} onChange={event => changeIngredient(item.id, { customName: event.target.value })} maxLength={80} required />
          </label>}
          <label className="nutrition-field nutrition-grams">
            <span>{t('Amount (g)')}</span>
            <input type="number" min="0.1" max="10000" step="0.1" value={item.grams}
              onChange={event => changeIngredient(item.id, { grams: event.target.value })} required />
          </label>
          {item.foodId === 'custom' && <details className="nutrition-custom">
            <summary>{t('Nutrition per 100 g')}</summary>
            <div className="nutrition-custom-grid">
              {NUTRIENTS.map(([key, label, unit]) => <label className="nutrition-field" key={key}>
                <span>{t(label)} ({unit})</span>
                <input type="number" min="0" max="100000" step="any" value={item.custom[key]}
                  onChange={event => changeIngredient(item.id, { custom: { ...item.custom, [key]: event.target.value } })} />
              </label>)}
            </div>
          </details>}
          {ingredients.length > 1 && <button type="button" className="iconbtn nutrition-remove" onClick={() => setIngredients(current => current.filter(value => value.id !== item.id))}
            aria-label={t('Remove ingredient {0}', index + 1)}><Icon name="trash" /></button>}
        </div>
      ))}
    </div>
    <details className="nutrition-preview">
      <summary>{t('Estimated nutrients for this meal')}</summary>
      <NutrientGrid values={totals} compact />
    </details>
    <label className="nutrition-field nutrition-photo-pick">
      <span>{t('Meal photo (optional)')}</span>
      <input ref={photoInput} type="file" accept="image/*" capture="environment" onChange={event => setPhoto(event.target.files?.[0] || null)} />
    </label>
    {preview && <img className="nutrition-photo-preview" src={preview} alt={t('Meal photo preview')} />}
    <div className="nutrition-note">{t('Typical food values are estimates per 100 g. For packaged or unlisted foods, select Custom food and enter the label values.')}</div>
    {error && <div className="nutrition-error" role="alert">{error}</div>}
    <Button type="submit" variant="primary" icon="check" disabled={saving}>{saving ? t('Saving…') : t('Save meal')}</Button>
  </form>
}

function ActivityForm({ date, currentWeightKg, onSaved }) {
  const [activityId, setActivityId] = useState('gym')
  const [minutes, setMinutes] = useState('45')
  const [weightKg, setWeightKg] = useState(String(currentWeightKg || 70))
  const [manualKcal, setManualKcal] = useState('')
  const [title, setTitle] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  useEffect(() => setWeightKg(String(currentWeightKg || 70)), [currentWeightKg])
  const preset = ACTIVITY_PRESETS.find(activity => activity.id === activityId) || ACTIVITY_PRESETS[0]
  const estimated = preset.met ? activityCalories(preset.met, weightKg, minutes) : 0
  const calories = manualKcal === '' ? estimated : Number(manualKcal)

  const save = event => {
    event.preventDefault()
    setError('')
    if (!(Number(minutes) > 0 && Number(minutes) <= 1440)) { setError(t('Enter activity time from 1 to 1440 minutes.')); return }
    if (!(calories > 0)) { setError(t('Enter the calories from your device or a positive estimate.')); return }
    setSaving(true)
    try {
      const id = newId()
      const entry = {
        id, type: 'activity', d: date, at: Date.now(), activityId, minutes: Number(minutes),
        kcal: Math.round(calories),
        title: (title.trim() || preset.name).slice(0, 100),
        ...(preset.met ? { met: preset.met, weightKg: Number(weightKg) } : {}),
        _ts: Date.now(),
      }
      useStore.getState().update(state => {
        state.nutritionEntries = { ...(state.nutritionEntries || {}), [id]: entry }
      })
      setManualKcal('')
      setTitle('')
      onSaved()
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : t('Could not save this activity.'))
    } finally {
      setSaving(false)
    }
  }

  return <form className="card nutrition-form" onSubmit={save}>
    <CardHead icon="figureRun" tint="var(--orange)" title={t('Log activity')} sub={t('Record workouts, house chores, or calories from a watch.')} />
    <label className="nutrition-field">
      <span>{t('Activity')}</span>
      <select value={activityId} onChange={event => { setActivityId(event.target.value); setManualKcal('') }}>
        {ACTIVITY_PRESETS.map(activity => <option value={activity.id} key={activity.id}>{t(activity.name)}</option>)}
      </select>
    </label>
    <div className="nutrition-fields-row">
      <label className="nutrition-field">
        <span>{t('Duration (min)')}</span>
        <input type="number" min="1" max="1440" step="1" value={minutes} onChange={event => setMinutes(event.target.value)} required />
      </label>
      {preset.met && <label className="nutrition-field">
        <span>{t('Body weight (kg)')}</span>
        <input type="number" min="1" max="500" step="0.1" value={weightKg} onChange={event => setWeightKg(event.target.value)} required />
      </label>}
    </div>
    <label className="nutrition-field">
      <span>{t('Activity name (optional)')}</span>
      <input value={title} onChange={event => setTitle(event.target.value)} maxLength={100} placeholder={t(preset.name)} />
    </label>
    <label className="nutrition-field">
      <span>{preset.met ? t('Calories override (optional)') : t('Calories burned')}</span>
      <input type="number" min="1" max="20000" step="1" value={manualKcal}
        onChange={event => setManualKcal(event.target.value)} placeholder={estimated ? String(estimated) : ''} required={!preset.met} />
    </label>
    <div className="nutrition-note">
      {preset.met
        ? t('Estimated about {0} kcal from activity intensity, duration, and body weight. This is a rough estimate; you can enter your watch value instead.', estimated)
        : t('Enter active calories shown by Apple Health, your watch, or another tracker.')}
    </div>
    {error && <div className="nutrition-error" role="alert">{error}</div>}
    <Button type="submit" variant="primary" icon="plus" disabled={saving}>{saving ? t('Saving…') : t('Save activity')}</Button>
  </form>
}

export default function Nutrition() {
  const nav = useNavigate()
  const S = useStore(state => state.S)
  const update = useStore(state => state.update)
  const [selectedDate, setSelectedDate] = useState(todayISO())
  const [maintenance, setMaintenance] = useState(S.nutritionMaintenanceKcal == null ? '' : String(S.nutritionMaintenanceKcal))
  const [targetWeight, setTargetWeight] = useState(S.targetW == null ? '' : String(S.targetW))
  const [targetDate, setTargetDate] = useState(S.nutritionGoalDate || '')
  const [goalError, setGoalError] = useState('')
  const [photoUrls, setPhotoUrls] = useState({})
  const [pageError, setPageError] = useState('')
  const totals = useMemo(() => nutritionTotalsFor(S, selectedDate), [S, selectedDate])
  const entries = useMemo(() => nutritionEntriesOn(S, selectedDate), [S.nutritionEntries, selectedDate])
  const currentWeight = lastBW(S)?.w
  const currentWeightKg = currentWeight == null ? null : currentWeight * (S.unit === 'lb' ? 0.45359237 : 1)
  const target = requiredDailyDeficit(currentWeight, targetWeight, S.unit, targetDate)
  const baseKcal = Number(S.nutritionMaintenanceKcal) > 0 ? Number(S.nutritionMaintenanceKcal) : null
  const balance = baseKcal == null || !totals.entries.some(entry => entry.type === 'meal')
    ? null
    : Math.round(baseKcal + totals.activityKcal - totals.kcal)
  const actualRate = averageLoggedDeficit(S, baseKcal)
  const remainingKcal = currentWeight == null || targetWeight === '' || !Number.isFinite(Number(targetWeight)) ? null
    : Math.abs(currentWeight - Number(targetWeight)) * (S.unit === 'lb' ? 0.45359237 : 1) * 7700

  useEffect(() => {
    let active = true
    const urls = []
    setPhotoUrls({})
    Promise.all(entries.filter(entry => entry.type === 'meal' && entry.photoId).map(async entry => {
      const blob = await loadNutritionPhoto(entry.photoId)
      if (blob) return [entry.id, URL.createObjectURL(blob)]
      return null
    })).then(results => {
      if (!active) {
        for (const result of results) if (result) URL.revokeObjectURL(result[1])
        return
      }
      const next = Object.fromEntries(results.filter(Boolean))
      urls.push(...Object.values(next))
      setPhotoUrls(next)
    }).catch(reason => {
      if (active) setPageError(reason instanceof Error ? reason.message : t('Could not load meal photos.'))
    })
    return () => {
      active = false
      for (const url of urls) URL.revokeObjectURL(url)
    }
  }, [entries])

  const saveGoal = event => {
    event.preventDefault()
    setGoalError('')
    if (maintenance !== '' && (!(Number(maintenance) > 0) || Number(maintenance) > 10000)) {
      setGoalError(t('Enter a baseline daily burn from 1 to 10000 kcal.'))
      return
    }
    if (targetWeight !== '' && (!(Number(targetWeight) > 0) || Number(targetWeight) > 1000)) {
      setGoalError(t('Enter a positive target weight.'))
      return
    }
    try {
      update(state => {
        state.nutritionMaintenanceKcal = maintenance === '' ? null : Math.round(Number(maintenance))
        state.targetW = targetWeight === '' ? null : Number(targetWeight)
        state.nutritionGoalDate = targetDate || null
      })
    } catch (reason) {
      setGoalError(reason instanceof Error ? reason.message : t('Could not save your calorie goal.'))
    }
  }

  const removeEntry = async entry => {
    setPageError('')
    try {
      update(state => {
        state.nutritionEntries = {
          ...(state.nutritionEntries || {}),
          [entry.id]: { ...state.nutritionEntries[entry.id], _deleted: true, _ts: Date.now() },
        }
      })
      if (entry.photoId) await removeNutritionPhoto(entry.photoId)
    } catch (reason) {
      setPageError(reason instanceof Error ? reason.message : t('Could not remove this log entry.'))
    }
  }

  return <div className="narrow nutrition-page">
    <div className="hdr">
      <button className="iconbtn" data-back="/home" onClick={() => nav('/home')} aria-label={t('Home')}><Icon name="chevronLeft" /></button>
      <div style={{ flex: 1, marginInlineStart: 12 }}>
        <h1>{t('Food & calories')}</h1>
        <div className="sub">{t('Meals, nutrients, activity, and your weight goal')}</div>
      </div>
      <label className="nutrition-date"><span>{t('Day')}</span><input type="date" value={selectedDate} onChange={event => setSelectedDate(event.target.value)} /></label>
    </div>

    <section className="card nutrition-summary" aria-label={t('Daily calorie summary')}>
      <CardHead icon="flame" tint="var(--orange)" eyebrow={fmtDate(selectedDate, true, true)} title={t('Daily balance')} />
      <div className="nutrition-summary-grid">
        <div><span>{t('Eaten')}</span><strong>{showValue(totals.kcal)} <small>kcal</small></strong></div>
        <div><span>{t('Activity')}</span><strong>{showValue(totals.activityKcal)} <small>kcal</small></strong></div>
        <div className={balance == null ? '' : balance >= 0 ? 'positive' : 'negative'}>
          <span>{t('Estimated deficit')}</span>
          <strong>{balance == null ? '—' : `${balance > 0 ? '+' : ''}${showValue(balance)} kcal`}</strong>
        </div>
      </div>
      {balance == null && <div className="nutrition-note">{baseKcal == null
        ? t('Set your baseline daily burn below to estimate a calorie deficit or surplus.')
        : t('Log food or activity to see an estimated daily calorie balance.')}</div>}
      <div className="nutrition-macro-row">
        {['protein', 'carbs', 'fat'].map(key => {
          const item = NUTRIENTS.find(([id]) => id === key)
          return <span key={key}>{t(item[1])} <b>{showValue(totals[key])} g</b></span>
        })}
      </div>
    </section>

    <section className="card">
      <CardHead icon="scale" tint="var(--teal)" title={t('Weight goal & calorie target')}
        sub={t('Set an estimated baseline burn and a target date to calculate the daily deficit needed.')} />
      <form className="nutrition-goal-form" onSubmit={saveGoal}>
        <label className="nutrition-field">
          <span>{t('Baseline daily burn (kcal, excluding logged activity)')}</span>
          <input type="number" min="1" max="10000" step="1" value={maintenance}
            onChange={event => setMaintenance(event.target.value)} placeholder={t('Enter your estimate')} />
        </label>
        <div className="nutrition-fields-row">
          <label className="nutrition-field">
            <span>{t('Target weight')} ({S.unit})</span>
            <input type="number" min="1" max="1000" step="0.1" value={targetWeight}
              onChange={event => setTargetWeight(event.target.value)} placeholder={currentWeight == null ? t('Log a weigh-in first') : ''} />
          </label>
          <label className="nutrition-field">
            <span>{t('Target date')}</span>
            <input type="date" value={targetDate} onChange={event => setTargetDate(event.target.value)} />
          </label>
        </div>
        {target && <div className="nutrition-goal-result">
          <b>{t('About {0} kcal/day {1}', showValue(target.dailyCalories), target.direction === 'lose' ? t('deficit') : target.direction === 'gain' ? t('surplus') : t('to maintain'))}</b>
          <span>{t('{0} days at your planned pace', target.days)}</span>
          {baseKcal != null && target.direction === 'lose' && <span>{t('Suggested food budget before extra activity: about {0} kcal/day.', showValue(baseKcal - target.dailyCalories))}</span>}
          {target.dailyCalories > 1000 && target.direction === 'lose' && <span className="nutrition-warning">{t('This is an aggressive estimated deficit. Consider a slower timeline and seek professional advice.')}</span>}
          {target.direction === 'lose' && actualRate && actualRate.average > 0 && remainingKcal != null && <span>
            {t("At your last 7 days' logged average ({0} days), the target is about {1} days away.", actualRate.loggedDays, showValue(remainingKcal / actualRate.average))}
          </span>}
          {target.direction === 'lose' && actualRate && actualRate.average <= 0 && <span>
            {t("Your last 7 days' logged average shows no calorie deficit, so a weight-loss date cannot be projected yet.")}
          </span>}
        </div>}
        {currentWeight == null && targetWeight !== '' && <div className="nutrition-note">{t('Log a weigh-in in openGym to calculate the timeline for your goal.')}</div>}
        {currentWeight != null && targetWeight !== '' && targetDate && !target && <div className="nutrition-note">{t('Choose a future target date to calculate the required daily energy gap.')}</div>}
        {goalError && <div className="nutrition-error" role="alert">{goalError}</div>}
        <Button type="submit" variant="tinted" icon="check">{t('Save goal')}</Button>
      </form>
      <div className="nutrition-disclaimer">{t('Weight-change projections use a simplified 7,700 kcal per kg estimate. Actual results vary; calorie numbers are not medical advice.')}</div>
    </section>

    <MealForm date={selectedDate} onSaved={() => setPageError('')} />
    <ActivityForm date={selectedDate} currentWeightKg={currentWeightKg} onSaved={() => setPageError('')} />

    <section className="card">
      <CardHead icon="heart" tint="var(--pink)" title={t('Nutrients for {0}', fmtDate(selectedDate, true, true))} />
      <NutrientGrid values={totals} />
    </section>

    <div className="nutrition-list-heading">
      <h2>{t('Food & activity log')}</h2><span>{t('{0} entries', entries.length)}</span>
    </div>
    {pageError && <div className="nutrition-error" role="alert">{pageError}</div>}
    {entries.length === 0 ? <div className="empty small">{t('No meals or activities logged for this day yet.')}</div>
      : <div className="nutrition-entry-list">{entries.map(entry => {
        const isMeal = entry.type === 'meal'
        const nutrients = isMeal ? mealNutrients(entry) : null
        return <article className="card nutrition-entry" key={entry.id}>
          <div className="nutrition-entry-main">
            {photoUrls[entry.id] && <img className="nutrition-entry-photo" src={photoUrls[entry.id]} alt={t('Meal photo')} />}
            <div className="nutrition-entry-copy">
              <b>{entry.name || entry.title}</b>
              <span className="muted small">{isMeal
                ? (entry.ingredients || []).map(item => `${item.name} ${showValue(item.grams)} g`).join(' · ')
                : `${showValue(entry.minutes)} min · ${showValue(entry.kcal)} kcal`}</span>
              {isMeal && <span className="small">{showValue(nutrients.kcal)} kcal · {t('Protein')} {showValue(nutrients.protein)} g</span>}
            </div>
            <button type="button" className="iconbtn nutrition-entry-delete" onClick={() => removeEntry(entry)}
              aria-label={t('Delete {0}', entry.name || entry.title)}><Icon name="trash" /></button>
          </div>
          {isMeal && <details className="nutrition-entry-details">
            <summary>{t('View nutrients')}</summary>
            <NutrientGrid values={nutrients} compact />
          </details>}
        </article>
      })}</div>}

    <div className="nutrition-device-note">
      <Icon name="info" />
      <span>{t('This GitHub Pages demo stores nutrition entries in this browser. Meal photos stay on this device. The native iPhone app has its existing Apple Health integration, but this nutrition journal does not automatically import active calories. A website cannot directly access Apple Watch or HealthKit, so enter watch calories above.')}</span>
    </div>
  </div>
}
