export const NUTRIENTS = [
  ['kcal', 'Calories', 'kcal'],
  ['protein', 'Protein', 'g'],
  ['carbs', 'Carbohydrates', 'g'],
  ['fat', 'Fat', 'g'],
  ['fiber', 'Fiber', 'g'],
  ['sugar', 'Sugar', 'g'],
  ['sodium', 'Sodium', 'mg'],
  ['potassium', 'Potassium', 'mg'],
  ['calcium', 'Calcium', 'mg'],
  ['iron', 'Iron', 'mg'],
  ['vitaminA', 'Vitamin A', 'mcg'],
  ['vitaminC', 'Vitamin C', 'mg'],
  ['vitaminD', 'Vitamin D', 'mcg'],
  ['vitaminB12', 'Vitamin B12', 'mcg'],
]

export const FOOD_PRESETS = [
  { id: 'chicken', name: 'Chicken breast, cooked', kcal: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, sugar: 0, sodium: 74, potassium: 256, calcium: 15, iron: 1, vitaminA: 13, vitaminC: 0, vitaminD: 0.1, vitaminB12: 0.3 },
  { id: 'egg', name: 'Whole egg, cooked', kcal: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0, sugar: 1.1, sodium: 124, potassium: 126, calcium: 50, iron: 1.2, vitaminA: 160, vitaminC: 0, vitaminD: 2, vitaminB12: 1.1 },
  { id: 'greek-yogurt', name: 'Greek yogurt, plain 2%', kcal: 73, protein: 10, carbs: 3.9, fat: 2, fiber: 0, sugar: 3.6, sodium: 34, potassium: 141, calcium: 115, iron: 0.1, vitaminA: 27, vitaminC: 0, vitaminD: 0.1, vitaminB12: 0.5 },
  { id: 'rice', name: 'White rice, cooked', kcal: 130, protein: 2.7, carbs: 28.2, fat: 0.3, fiber: 0.4, sugar: 0.1, sodium: 1, potassium: 35, calcium: 10, iron: 0.2, vitaminA: 0, vitaminC: 0, vitaminD: 0, vitaminB12: 0 },
  { id: 'oats', name: 'Rolled oats, dry', kcal: 379, protein: 13.2, carbs: 67.7, fat: 6.5, fiber: 10.1, sugar: 0.9, sodium: 2, potassium: 362, calcium: 52, iron: 4.3, vitaminA: 0, vitaminC: 0, vitaminD: 0, vitaminB12: 0 },
  { id: 'banana', name: 'Banana, raw', kcal: 89, protein: 1.1, carbs: 22.8, fat: 0.3, fiber: 2.6, sugar: 12.2, sodium: 1, potassium: 358, calcium: 5, iron: 0.3, vitaminA: 3, vitaminC: 8.7, vitaminD: 0, vitaminB12: 0 },
  { id: 'salmon', name: 'Salmon, cooked', kcal: 206, protein: 22.1, carbs: 0, fat: 12.4, fiber: 0, sugar: 0, sodium: 61, potassium: 384, calcium: 9, iron: 0.3, vitaminA: 12, vitaminC: 0, vitaminD: 11, vitaminB12: 3.2 },
  { id: 'broccoli', name: 'Broccoli, cooked', kcal: 35, protein: 2.4, carbs: 7.2, fat: 0.4, fiber: 3.3, sugar: 1.4, sodium: 41, potassium: 293, calcium: 40, iron: 0.7, vitaminA: 77, vitaminC: 64.9, vitaminD: 0, vitaminB12: 0 },
  { id: 'avocado', name: 'Avocado, raw', kcal: 160, protein: 2, carbs: 8.5, fat: 14.7, fiber: 6.7, sugar: 0.7, sodium: 7, potassium: 485, calcium: 12, iron: 0.6, vitaminA: 7, vitaminC: 10, vitaminD: 0, vitaminB12: 0 },
  { id: 'milk', name: 'Milk, 2%', kcal: 50, protein: 3.3, carbs: 4.8, fat: 2, fiber: 0, sugar: 5.1, sodium: 44, potassium: 150, calcium: 120, iron: 0, vitaminA: 55, vitaminC: 0, vitaminD: 1.2, vitaminB12: 0.5 },
  { id: 'bread', name: 'Whole-wheat bread', kcal: 247, protein: 13, carbs: 41, fat: 4.2, fiber: 7, sugar: 6, sodium: 400, potassium: 230, calcium: 107, iron: 2.5, vitaminA: 0, vitaminC: 0, vitaminD: 0, vitaminB12: 0 },
]

export const ACTIVITY_PRESETS = [
  { id: 'gym', name: 'Gym workout', met: 5 },
  { id: 'dishwasher', name: 'Loading / unloading dishwasher', met: 2.3 },
  { id: 'bathroom', name: 'Cleaning a bathroom', met: 3.5 },
  { id: 'sweeping', name: 'Sweeping floors', met: 3.3 },
  { id: 'mopping', name: 'Mopping floors', met: 3.5 },
  { id: 'walking', name: 'Walking', met: 3.3 },
  { id: 'watch', name: 'Apple Watch / other device calories', met: null },
  { id: 'other', name: 'Other activity (enter calories)', met: null },
]

const number = value => {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0
}

export function ingredientNutrients(ingredient) {
  const preset = FOOD_PRESETS.find(food => food.id === ingredient?.foodId)
  const source = preset || ingredient?.custom || {}
  const factor = number(ingredient?.grams) / 100
  return Object.fromEntries(NUTRIENTS.map(([key]) => [key, number(source[key]) * factor]))
}

export function mealNutrients(meal) {
  const totals = Object.fromEntries(NUTRIENTS.map(([key]) => [key, 0]))
  for (const ingredient of Array.isArray(meal?.ingredients) ? meal.ingredients : []) {
    const values = ingredientNutrients(ingredient)
    for (const [key] of NUTRIENTS) totals[key] += values[key]
  }
  return totals
}

export function nutritionEntriesOn(S, date) {
  const map = S?.nutritionEntries && typeof S.nutritionEntries === 'object' && !Array.isArray(S.nutritionEntries)
    ? S.nutritionEntries
    : {}
  return Object.entries(map)
    .filter(([, entry]) => entry && entry._deleted !== true && entry.d === date)
    .map(([id, entry]) => ({ ...entry, id }))
    .sort((a, b) => (Number(a.at) || 0) - (Number(b.at) || 0))
}

export function nutritionTotalsFor(S, date) {
  const totals = Object.fromEntries(NUTRIENTS.map(([key]) => [key, 0]))
  let activityKcal = 0
  const entries = nutritionEntriesOn(S, date)
  for (const entry of entries) {
    if (entry.type === 'meal') {
      const values = mealNutrients(entry)
      for (const [key] of NUTRIENTS) totals[key] += values[key]
    } else if (entry.type === 'activity') {
      activityKcal += number(entry.kcal)
    }
  }
  return { ...totals, activityKcal, entries }
}

export function averageLoggedDeficit(S, baselineKcal, now = new Date(), days = 7) {
  const baseline = Number(baselineKcal)
  if (!Number.isFinite(baseline) || baseline <= 0 || !Number.isInteger(days) || days < 1) return null
  let total = 0, loggedDays = 0
  for (let offset = 0; offset < days; offset++) {
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - offset)
    const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    const daily = nutritionTotalsFor(S, iso)
    if (!daily.entries.some(entry => entry.type === 'meal')) continue
    total += baseline + daily.activityKcal - daily.kcal
    loggedDays++
  }
  return loggedDays ? { average: total / loggedDays, loggedDays } : null
}

export function requiredDailyDeficit(currentWeight, targetWeight, unit, targetDate, today = new Date()) {
  const current = Number(currentWeight)
  const target = Number(targetWeight)
  const targetDay = Date.parse(`${targetDate}T00:00:00Z`)
  if (!Number.isFinite(current) || !Number.isFinite(target) || current <= 0 || target <= 0 || !Number.isFinite(targetDay)) return null
  const todayDay = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
  const days = Math.ceil((targetDay - todayDay) / 86400000)
  if (days < 1) return null
  const kgPerUnit = unit === 'lb' ? 0.45359237 : 1
  const dailyCalories = Math.abs(current - target) * kgPerUnit * 7700 / days
  return { days, dailyCalories, direction: target < current ? 'lose' : target > current ? 'gain' : 'hold' }
}

export function activityCalories(met, weightKg, minutes) {
  const m = Number(met), weight = Number(weightKg), duration = Number(minutes)
  if (!Number.isFinite(m) || !Number.isFinite(weight) || !Number.isFinite(duration) || m <= 1 || weight <= 0 || duration <= 0) return 0
  return Math.round((m - 1) * weight * duration / 60)
}
