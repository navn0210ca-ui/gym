import { describe, expect, it } from 'vitest'
import {
  activityCalories, averageLoggedDeficit, ingredientNutrients, mealNutrients, mergeAppleActiveEnergy,
  nutritionTotalsFor, requiredDailyDeficit,
} from './nutrition.js'

describe('nutrition calculations', () => {
  it('scales a selected food from its per-100 g values', () => {
    expect(ingredientNutrients({ foodId: 'chicken', grams: 150 }).kcal).toBeCloseTo(247.5)
    expect(ingredientNutrients({ foodId: 'chicken', grams: 150 }).protein).toBeCloseTo(46.5)
  })

  it('sums the nutrients of a meal and its ingredients', () => {
    const values = mealNutrients({ ingredients: [
      { foodId: 'egg', grams: 50 },
      { foodId: 'banana', grams: 100 },
    ] })
    expect(values.kcal).toBeCloseTo(166.5)
    expect(values.protein).toBeCloseTo(7.6)
    expect(values.potassium).toBeCloseTo(421)
  })

  it('totals meals and activities for one day without counting removed entries', () => {
    const result = nutritionTotalsFor({ nutritionEntries: {
      meal: { type: 'meal', d: '2026-01-02', ingredients: [{ foodId: 'rice', grams: 200 }] },
      activity: { type: 'activity', d: '2026-01-02', kcal: 250 },
      removed: { type: 'activity', d: '2026-01-02', kcal: 999, _deleted: true },
      otherDay: { type: 'meal', d: '2026-01-01', ingredients: [{ foodId: 'rice', grams: 100 }] },
    } }, '2026-01-02')
    expect(result.kcal).toBeCloseTo(260)
    expect(result.activityKcal).toBe(250)
    expect(result.entries).toHaveLength(2)
  })

  it('imports daily Apple Health totals into a replaceable activity entry', () => {
    const S = { nutritionEntries: {} }
    expect(mergeAppleActiveEnergy(S, [{ d: '2026-01-02', kcal: 421.4 }], 10)).toBe(true)
    expect(nutritionTotalsFor(S, '2026-01-02').activityKcal).toBe(421)
    expect(mergeAppleActiveEnergy(S, [{ d: '2026-01-02', kcal: 421.4 }], 20)).toBe(false)
    expect(mergeAppleActiveEnergy(S, [{ d: '2026-01-02', kcal: 510 }], 30)).toBe(true)
    expect(nutritionTotalsFor(S, '2026-01-02').activityKcal).toBe(510)
    expect(Object.keys(S.nutritionEntries)).toHaveLength(1)
  })

  it('ignores invalid and user-deleted Apple Health totals', () => {
    const S = { nutritionEntries: {
      'apple-health-active-energy-2026-01-02': { d: '2026-01-02', kcal: 421, type: 'activity', _deleted: true },
    } }
    expect(mergeAppleActiveEnergy(S, [
      { d: '2026-01-02', kcal: 500 },
      { d: 'not-a-date', kcal: 100 },
      { d: '2026-01-03', kcal: -2 },
    ])).toBe(false)
    expect(S.nutritionEntries['apple-health-active-energy-2026-01-02']._deleted).toBe(true)
  })

  it('estimates activity calories from MET, body weight, and duration', () => {
    expect(activityCalories(3.3, 70, 60)).toBe(161)
    expect(activityCalories(0, 70, 60)).toBe(0)
  })

  it('projects from logged days only, with the baseline and activity calories included', () => {
    const result = averageLoggedDeficit({
      nutritionEntries: {
        meal: { type: 'meal', d: '2026-01-02', ingredients: [{ foodId: 'egg', grams: 100 }] },
        activity: { type: 'activity', d: '2026-01-02', kcal: 200 },
      },
    }, 2000, new Date(2026, 0, 2), 7)
    expect(result).toEqual({ average: 2045, loggedDays: 1 })
    expect(averageLoggedDeficit({ nutritionEntries: {} }, 2000, new Date(2026, 0, 2))).toBeNull()
  })

  it('calculates the daily energy gap to a weight goal in either profile unit', () => {
    const start = new Date(2026, 0, 1)
    expect(requiredDailyDeficit(80, 70, 'kg', '2026-01-11', start)).toEqual({
      days: 10, dailyCalories: 7700, direction: 'lose',
    })
    expect(requiredDailyDeficit(200, 190, 'lb', '2026-01-11', start).dailyCalories).toBeCloseTo(3492.7, 0)
    expect(requiredDailyDeficit(80, 70, 'kg', '2025-12-31', start)).toBeNull()
  })
})
