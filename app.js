const STORAGE_KEY = 'daywell-state-v1';
const DAY_MS = 24 * 60 * 60 * 1000;
const NUTRIENTS = [
  { key: 'calories', label: 'Calories', unit: 'kcal', decimals: 0 },
  { key: 'protein', label: 'Protein', unit: 'g', decimals: 1 },
  { key: 'carbs', label: 'Carbs', unit: 'g', decimals: 1 },
  { key: 'fat', label: 'Fat', unit: 'g', decimals: 1 },
  { key: 'fiber', label: 'Fiber', unit: 'g', decimals: 1 },
  { key: 'sugar', label: 'Sugar', unit: 'g', decimals: 1 },
  { key: 'sodium', label: 'Sodium', unit: 'mg', decimals: 0 },
  { key: 'potassium', label: 'Potassium', unit: 'mg', decimals: 0 },
  { key: 'calcium', label: 'Calcium', unit: 'mg', decimals: 0 },
  { key: 'iron', label: 'Iron', unit: 'mg', decimals: 1 },
  { key: 'magnesium', label: 'Magnesium', unit: 'mg', decimals: 0 },
  { key: 'zinc', label: 'Zinc', unit: 'mg', decimals: 1 },
  { key: 'vitaminA', label: 'Vitamin A', unit: 'µg', decimals: 0 },
  { key: 'vitaminC', label: 'Vitamin C', unit: 'mg', decimals: 1 },
  { key: 'vitaminD', label: 'Vitamin D', unit: 'µg', decimals: 1 },
  { key: 'vitaminE', label: 'Vitamin E', unit: 'mg', decimals: 1 },
  { key: 'vitaminK', label: 'Vitamin K', unit: 'µg', decimals: 1 },
  { key: 'vitaminB12', label: 'Vitamin B12', unit: 'µg', decimals: 2 },
  { key: 'folate', label: 'Folate', unit: 'µg', decimals: 0 }
];
const FOOD_PROFILES = [
  { name: 'Banana', calories: 89, protein: 1.1, carbs: 22.8, fat: .3, fiber: 2.6, sugar: 12.2, sodium: 1, potassium: 358, calcium: 5, iron: .3, magnesium: 27, zinc: .2, vitaminA: 3, vitaminC: 8.7, vitaminB12: 0, folate: 20 },
  { name: 'Chicken breast, cooked', calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, sugar: 0, sodium: 74, potassium: 256, calcium: 15, iron: 1, magnesium: 29, zinc: 1, vitaminA: 6, vitaminC: 0, vitaminB12: .3, folate: 4 },
  { name: 'White rice, cooked', calories: 130, protein: 2.7, carbs: 28.2, fat: .3, fiber: .4, sugar: 0, sodium: 1, potassium: 35, calcium: 10, iron: .2, magnesium: 12, zinc: .5, vitaminA: 0, vitaminC: 0, vitaminB12: 0, folate: 58 },
  { name: 'Egg, whole', calories: 143, protein: 12.6, carbs: .7, fat: 9.5, fiber: 0, sugar: .4, sodium: 142, potassium: 138, calcium: 56, iron: 1.8, magnesium: 12, zinc: 1.3, vitaminA: 160, vitaminD: 2, vitaminB12: 1.1, folate: 47 },
  { name: 'Avocado', calories: 160, protein: 2, carbs: 8.5, fat: 14.7, fiber: 6.7, sugar: .7, sodium: 7, potassium: 485, calcium: 12, iron: .6, magnesium: 29, zinc: .6, vitaminA: 7, vitaminC: 10, vitaminE: 2.1, vitaminK: 21, folate: 81 },
  { name: 'Spinach, raw', calories: 23, protein: 2.9, carbs: 3.6, fat: .4, fiber: 2.2, sugar: .4, sodium: 79, potassium: 558, calcium: 99, iron: 2.7, magnesium: 79, zinc: .5, vitaminA: 469, vitaminC: 28, vitaminE: 2, vitaminK: 483, folate: 194 },
  { name: 'Greek yogurt, plain', calories: 97, protein: 9, carbs: 3.9, fat: 5, fiber: 0, sugar: 3.2, sodium: 35, potassium: 141, calcium: 100, iron: 0, magnesium: 11, zinc: .5, vitaminA: 27, vitaminB12: .8, folate: 7 },
  { name: 'Salmon, cooked', calories: 206, protein: 22.1, carbs: 0, fat: 12.4, fiber: 0, sugar: 0, sodium: 61, potassium: 384, calcium: 9, iron: .3, magnesium: 30, zinc: .4, vitaminA: 12, vitaminD: 13, vitaminB12: 3.2, folate: 25 },
  { name: 'Oats, dry', calories: 389, protein: 16.9, carbs: 66.3, fat: 6.9, fiber: 10.6, sugar: 0, sodium: 2, potassium: 429, calcium: 54, iron: 4.7, magnesium: 177, zinc: 4, vitaminA: 0, vitaminC: 0, vitaminE: .4, folate: 56 },
  { name: 'Olive oil', calories: 884, protein: 0, carbs: 0, fat: 100, fiber: 0, sugar: 0, sodium: 2, potassium: 1, calcium: 1, iron: .6, magnesium: 0, zinc: 0, vitaminA: 0, vitaminE: 14, vitaminK: 60 },
  { name: 'Apple with skin', calories: 52, protein: .3, carbs: 13.8, fat: .2, fiber: 2.4, sugar: 10.4, sodium: 1, potassium: 107, calcium: 6, iron: .1, magnesium: 5, zinc: 0, vitaminA: 3, vitaminC: 4.6, vitaminK: 2.2, folate: 3 },
  { name: 'Almonds', calories: 579, protein: 21.2, carbs: 21.6, fat: 49.9, fiber: 12.5, sugar: 4.4, sodium: 1, potassium: 733, calcium: 269, iron: 3.7, magnesium: 270, zinc: 3.1, vitaminA: 0, vitaminE: 25.6, folate: 44 }
];
const ACTIVITY_TYPES = {
  workout: { name: 'Gym workout', met: 5 },
  walking: { name: 'Walking', met: 3.5 },
  dishwashing: { name: 'Loading / unloading the dishwasher', met: 2 },
  bathroom: { name: 'Cleaning the bathroom', met: 3.5 },
  sweeping: { name: 'Sweeping', met: 3.3 },
  mopping: { name: 'Mopping floors', met: 3.5 },
  custom: { name: 'Other activity', met: 3 }
};
const ACTIVITY_FACTORS = { sedentary: 1.2, light: 1.375, moderate: 1.55 };

let state = loadState();
let pendingIngredients = [];
let selectedPhoto = '';
let toastTimer;

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const dateKey = (date = new Date()) => {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
};
const number = (value) => Number.isFinite(Number(value)) ? Number(value) : 0;
const round = (value, places = 0) => {
  const scale = 10 ** places;
  return Math.round((number(value) + Number.EPSILON) * scale) / scale;
};
const formatNumber = (value) => Math.round(number(value)).toLocaleString();
const emptyNutrients = () => Object.fromEntries(NUTRIENTS.map((item) => [item.key, 0]));

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return {
      profile: saved.profile && typeof saved.profile === 'object' ? saved.profile : null,
      meals: Array.isArray(saved.meals) ? saved.meals : [],
      activities: Array.isArray(saved.activities) ? saved.activities : []
    };
  } catch (error) {
    console.error('Unable to read saved Daywell data.', error);
    return { profile: null, meals: [], activities: [] };
  }
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch (error) {
    console.error('Unable to save Daywell data.', error);
    showToast('Could not save your changes. Your browser storage may be full; try removing an old photo.');
    return false;
  }
}

function todayMeals() {
  return state.meals.filter((meal) => meal.date === dateKey());
}

function todayActivities() {
  return state.activities.filter((item) => item.date === dateKey());
}

function totalNutrients(meals = todayMeals()) {
  return meals.reduce((total, meal) => {
    NUTRIENTS.forEach(({ key }) => { total[key] += number(meal.nutrients?.[key]); });
    return total;
  }, emptyNutrients());
}

function baseEnergy() {
  const profile = state.profile;
  if (!profile) return null;
  const weight = number(profile.currentWeight);
  const height = number(profile.height);
  const age = number(profile.age);
  if (!weight || !height || !age) return null;
  const sexAdjust = profile.sex === 'female' ? -161 : profile.sex === 'male' ? 5 : -78;
  const bmr = (10 * weight) + (6.25 * height) - (5 * age) + sexAdjust;
  return Math.round(bmr * (ACTIVITY_FACTORS[profile.activityLevel] || ACTIVITY_FACTORS.sedentary));
}

function requiredDailyDeficit() {
  const profile = state.profile;
  if (!profile) return null;
  const difference = number(profile.currentWeight) - number(profile.targetWeight);
  const days = number(profile.goalWeeks) * 7;
  if (!difference || !days) return null;
  return (difference * 7700) / days;
}

function caloriesFromActivity(type, minutes, weight) {
  const met = ACTIVITY_TYPES[type]?.met || ACTIVITY_TYPES.custom.met;
  return Math.round(met * 3.5 * number(weight) / 200 * number(minutes));
}

function plannedFoodTarget() {
  const maintenance = baseEnergy();
  const deficit = requiredDailyDeficit();
  if (maintenance === null || deficit === null) return null;
  const activeEnergy = todayActivities().reduce((sum, item) => sum + number(item.calories), 0);
  return Math.round(maintenance + activeEnergy - deficit);
}

function validDateForLog(entry) {
  return entry.date === dateKey();
}

function showToast(message) {
  const toast = $('#toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3500);
}

function render() {
  const profile = state.profile;
  const meals = todayMeals();
  const activities = todayActivities();
  const nutrients = totalNutrients(meals);
  const activeEnergy = activities.reduce((sum, item) => sum + number(item.calories), 0);
  const baseline = baseEnergy();
  const intake = nutrients.calories;
  const totalBurn = baseline === null ? null : baseline + activeEnergy;
  const deficit = totalBurn === null || !meals.length ? null : totalBurn - intake;
  const target = plannedFoodTarget();
  const goalDeficit = requiredDailyDeficit();
  const goalNeedsReview = (target !== null && target < 1200) || (goalDeficit !== null && goalDeficit > 1000);

  $('#today-label').textContent = new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date());
  $('#greeting').textContent = `${new Intl.DateTimeFormat(undefined, { hour: 'numeric' }).format(new Date()).toLowerCase().includes('pm') ? 'YOUR EVENING' : 'YOUR DAY'}, IN BALANCE`;
  $('#intake-value').textContent = formatNumber(intake);
  $('#intake-subtitle').textContent = meals.length ? `${meals.length} ${meals.length === 1 ? 'meal' : 'meals'} logged today` : 'Log a meal to get started';
  $('#food-target').textContent = target === null ? 'Set your goal' : goalNeedsReview ? 'Review goal' : `${formatNumber(target)} kcal`;
  $('#intake-progress').style.width = target >= 1200 && !goalNeedsReview ? `${Math.min(100, intake / target * 100)}%` : '0%';
  $('#burn-value').textContent = totalBurn === null ? '—' : formatNumber(totalBurn);
  $('#baseline-value').textContent = baseline === null ? 'Set up profile' : `${formatNumber(baseline)} kcal`;
  $('#deficit-value').textContent = deficit === null ? '—' : `${deficit < 0 ? '−' : ''}${formatNumber(Math.abs(deficit))}`;
  $('#deficit-subtitle').textContent = deficit === null
    ? baseline === null ? 'Add your profile and log food to estimate' : 'Log food to estimate your daily balance'
    : 'Baseline + movement − food logged';
  $('#goal-pace').textContent = goalDeficit === null ? 'Set your goal' : `${goalDeficit < 0 ? 'Surplus' : 'Deficit'} ${formatNumber(Math.abs(goalDeficit))} kcal / day`;
  $('#setup-notice').classList.toggle('hidden', Boolean(profile));
  $('#active-energy-total').textContent = `${formatNumber(activeEnergy)} kcal active energy`;
  $('#goal-empty').classList.toggle('hidden', Boolean(profile));
  $('#goal-progress').classList.toggle('hidden', !profile);
  if (profile) {
    $('#current-weight-display').textContent = `${number(profile.currentWeight).toFixed(1)} kg`;
    $('#target-weight-display').textContent = `${number(profile.targetWeight).toFixed(1)} kg`;
    const difference = number(profile.currentWeight) - number(profile.targetWeight);
    const progress = difference > 0
      ? Math.min(94, Math.max(4, (difference / number(profile.currentWeight)) * 100))
      : difference < 0 ? Math.min(94, Math.max(4, (Math.abs(difference) / number(profile.currentWeight)) * 100)) : 100;
    $('#weight-progress-fill').style.width = `${progress}%`;
    const average = recentAverageDeficit();
    const remaining = Math.abs(difference) * 7700;
    if (average === null || average <= 0) {
      $('#projection-text').textContent = 'Log a few days for an estimate';
    } else {
      const days = Math.ceil(remaining / average);
      const eta = new Date();
      eta.setDate(eta.getDate() + days);
      $('#projection-text').textContent = `${days} days · around ${new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(eta)}`;
    }
  }
  renderMeals(meals);
  renderNutrients(nutrients);
  renderActivities(activities);
  renderWeek();
  renderProfilePreview();
  updateActivityEstimate();
  $('#today-chip').textContent = new Intl.DateTimeFormat(undefined, { weekday: 'long' }).format(new Date());
}

function recentAverageDeficit() {
  const baseline = baseEnergy();
  if (baseline === null) return null;
  const dailyValues = [];
  for (let offset = 0; offset < 7; offset += 1) {
    const date = dateKey(new Date(Date.now() - offset * DAY_MS));
    const meals = state.meals.filter((entry) => entry.date === date);
    if (!meals.length) continue;
    const intake = totalNutrients(meals).calories;
    const activity = state.activities.filter((entry) => entry.date === date).reduce((sum, entry) => sum + number(entry.calories), 0);
    dailyValues.push(baseline + activity - intake);
  }
  return dailyValues.length ? dailyValues.reduce((sum, value) => sum + value, 0) / dailyValues.length : null;
}

function renderMeals(meals) {
  const list = $('#meal-list');
  if (!meals.length) {
    list.innerHTML = '<div class="empty-state"><span class="empty-illustration" aria-hidden="true">◒</span><div><strong>No meals logged yet</strong><p>Add what you ate and get a clearer picture of today’s nourishment.</p></div></div>';
    return;
  }
  list.innerHTML = meals.slice().reverse().map((meal) => {
    const ingredients = Array.isArray(meal.ingredients) ? meal.ingredients : [];
    const description = ingredients.map((item) => `${item.name} · ${formatNumber(item.grams)} g`).join(' / ') || 'Food entry';
    const thumb = meal.photo
      ? `<span class="log-thumb"><img src="${meal.photo}" alt=""></span>`
      : '<span class="log-thumb" aria-hidden="true">◒</span>';
    return `<article class="log-item"><span>${thumb}</span><div class="log-item-main"><strong>${escapeHtml(meal.name)}</strong><p>${escapeHtml(description)}</p></div><div class="log-item-side"><span class="log-kcal">${formatNumber(meal.nutrients?.calories)} <small>kcal</small></span><button class="delete-entry" type="button" data-remove-meal="${escapeAttribute(meal.id)}" aria-label="Remove ${escapeAttribute(meal.name)}">×</button></div></article>`;
  }).join('');
}

function renderNutrients(nutrients) {
  const showKeys = ['protein', 'carbs', 'fat', 'fiber', 'sugar', 'sodium', 'potassium', 'calcium', 'iron', 'magnesium', 'zinc', 'vitaminA', 'vitaminC', 'vitaminD', 'vitaminE', 'vitaminK', 'vitaminB12', 'folate'];
  $('#nutrient-grid').innerHTML = showKeys.map((key) => {
    const item = NUTRIENTS.find((entry) => entry.key === key);
    return `<div class="nutrient-tile"><span>${item.label}</span><strong>${round(nutrients[key], item.decimals).toLocaleString()}</strong><small>${item.unit}</small></div>`;
  }).join('');
}

function renderActivities(activities) {
  const list = $('#activity-list');
  if (!activities.length) {
    list.innerHTML = '<div class="empty-state"><span class="empty-illustration movement-illustration" aria-hidden="true">↗</span><div><strong>No movement added yet</strong><p>Log a workout, a walk, or those dishes you just took care of.</p></div></div>';
    return;
  }
  list.innerHTML = activities.slice().reverse().map((item) => `<article class="log-item"><span class="log-thumb" aria-hidden="true">↗</span><div class="log-item-main"><strong>${escapeHtml(item.name)}</strong><p>${item.minutes ? `${formatNumber(item.minutes)} min · ` : ''}${item.source === 'health-import' ? 'Imported energy' : 'Active energy estimate'}</p></div><div class="log-item-side"><span class="log-kcal">${formatNumber(item.calories)} <small>kcal</small></span><button class="delete-entry" type="button" data-remove-activity="${escapeAttribute(item.id)}" aria-label="Remove ${escapeAttribute(item.name)}">×</button></div></article>`).join('');
}

function renderWeek() {
  const baseline = baseEnergy();
  const days = [];
  for (let offset = 6; offset >= 0; offset -= 1) {
    const date = new Date(Date.now() - offset * DAY_MS);
    const key = dateKey(date);
    const meals = state.meals.filter((entry) => entry.date === key);
    const activity = state.activities.filter((entry) => entry.date === key).reduce((sum, entry) => sum + number(entry.calories), 0);
    const energy = baseline === null || !meals.length ? null : baseline + activity - totalNutrients(meals).calories;
    days.push({ key, label: new Intl.DateTimeFormat(undefined, { weekday: 'short' }).format(date).slice(0, 2), energy });
  }
  const tracked = days.filter((day) => day.energy !== null);
  const largest = Math.max(1, ...tracked.map((day) => Math.abs(day.energy)));
  $('#week-chart').innerHTML = tracked.length
    ? days.map((day) => {
      const height = day.energy === null ? 3 : Math.max(6, Math.min(72, Math.abs(day.energy) / largest * 70));
      const color = day.energy !== null && day.energy < 0 ? '#e5c7bd' : '';
      return `<div class="chart-day ${day.key === dateKey() ? 'today' : ''}"><div class="chart-bar-track">${day.energy === null ? '<span class="chart-bar" style="height:3px;opacity:.38"></span>' : `<span class="chart-bar" style="height:${height}px;${color ? `background:${color}` : ''}" title="${formatNumber(day.energy)} kcal"></span>`}</div><span class="chart-day-label">${day.label}</span></div>`;
    }).join('')
    : '<div class="chart-empty">Your daily balance will appear here as you log.</div>';
  const average = tracked.length ? tracked.reduce((sum, day) => sum + day.energy, 0) / tracked.length : null;
  $('#week-summary').textContent = average === null ? 'Your week will take shape as you log.' : `${tracked.length}-day logged average · ${formatNumber(Math.abs(average))} kcal ${average >= 0 ? 'deficit' : 'surplus'} / day`;
}

function renderProfilePreview() {
  const values = {
    currentWeight: $('#current-weight').value,
    targetWeight: $('#target-weight').value,
    height: $('#height').value,
    age: $('#age').value,
    goalWeeks: $('#goal-weeks').value,
    sex: $('#sex').value,
    activityLevel: $('#activity-level').value
  };
  const valid = ['currentWeight', 'targetWeight', 'height', 'age', 'goalWeeks'].every((key) => number(values[key]) > 0);
  const box = $('#target-preview');
  box.classList.remove('target-warning');
  if (!valid) {
    box.innerHTML = '<span class="preview-symbol" aria-hidden="true">✳</span><p>Enter your details to see a gentle, approximate daily target.</p>';
    return;
  }
  const difference = number(values.currentWeight) - number(values.targetWeight);
  const bmr = 10 * number(values.currentWeight) + 6.25 * number(values.height) - 5 * number(values.age) + (values.sex === 'female' ? -161 : values.sex === 'male' ? 5 : -78);
  const maintenance = bmr * (ACTIVITY_FACTORS[values.activityLevel] || 1.2);
  const deficit = difference * 7700 / (number(values.goalWeeks) * 7);
  const foodTarget = maintenance - deficit;
  const perWeek = difference / number(values.goalWeeks);
  if (deficit > 1000 || foodTarget < 1200) {
    box.classList.add('target-warning');
    box.innerHTML = `<span class="preview-symbol" aria-hidden="true">!</span><p>This pace requires about <strong>${formatNumber(deficit)} kcal/day ${deficit >= 0 ? 'deficit' : 'surplus'}</strong>. That may be too aggressive. Consider a longer timeline and ask a health professional.</p>`;
  } else if (difference < 0) {
    box.innerHTML = `<span class="preview-symbol" aria-hidden="true">✳</span><p>About <strong>${formatNumber(Math.abs(deficit))} kcal/day surplus</strong> · estimated food target <strong>${formatNumber(foodTarget)} kcal/day</strong>. Approx. ${round(Math.abs(perWeek), 1)} kg gain per week.</p>`;
  } else if (difference === 0) {
    box.innerHTML = `<span class="preview-symbol" aria-hidden="true">✳</span><p>Your weights match. Estimated maintenance is <strong>${formatNumber(maintenance)} kcal/day</strong>.</p>`;
  } else {
    box.innerHTML = `<span class="preview-symbol" aria-hidden="true">✳</span><p>About <strong>${formatNumber(deficit)} kcal/day deficit</strong> · estimated food target <strong>${formatNumber(Math.max(0, foodTarget))} kcal/day</strong>. Approx. ${round(perWeek, 1)} kg loss per week.</p>`;
  }
}

function updateActivityEstimate() {
  const type = $('#activity-type').value;
  const minutes = number($('#activity-minutes').value);
  const manual = number($('#manual-calories').value);
  const weight = number(state.profile?.currentWeight);
  const estimate = weight && minutes ? caloriesFromActivity(type, minutes, weight) : null;
  const output = $('#activity-estimate');
  if (manual) {
    output.innerHTML = `<span class="preview-symbol" aria-hidden="true">↗</span><span>Will log <strong>${formatNumber(manual)} kcal</strong> from your device.</span>`;
  } else if (estimate !== null) {
    output.innerHTML = `<span class="preview-symbol" aria-hidden="true">↗</span><span>Estimated burn: <strong>${formatNumber(estimate)} kcal</strong> for ${formatNumber(minutes)} minutes. Add device calories above to use its value instead.</span>`;
  } else {
    output.innerHTML = '<span class="preview-symbol" aria-hidden="true">↗</span><span>Save a profile to estimate calories from duration, or enter calories from your device.</span>';
  }
}

function initFoodProfiles() {
  $('#food-options').innerHTML = FOOD_PROFILES.map((food) => `<option value="${escapeAttribute(food.name)}"></option>`).join('');
  const customFields = NUTRIENTS.filter((item) => item.key !== 'calories').map((item) => `<label>${item.label}<input type="number" min="0" step="any" data-custom-nutrient="${item.key}" placeholder="0 ${item.unit}" aria-label="${item.label} per 100 grams"></label>`).join('');
  $('#custom-nutrients').innerHTML = `<p>Unknown food: enter values per 100 g from the label. Values left blank count as zero.</p><div class="custom-nutrients-grid"><label>Calories<input type="number" min="0" step="any" data-custom-nutrient="calories" placeholder="kcal per 100 g" aria-label="Calories per 100 grams"></label>${customFields}</div>`;
}

function selectedFood() {
  const name = $('#ingredient-name').value.trim();
  return FOOD_PROFILES.find((food) => food.name.toLowerCase() === name.toLowerCase()) || null;
}

function syncCustomNutrients() {
  const food = selectedFood();
  const container = $('#custom-nutrients');
  container.classList.toggle('hidden', Boolean(food) || !$('#ingredient-name').value.trim());
}

function pendingNutrientTotals() {
  return pendingIngredients.reduce((sum, item) => {
    NUTRIENTS.forEach(({ key }) => { sum[key] += number(item.nutrients[key]); });
    return sum;
  }, emptyNutrients());
}

function renderIngredientBuilder() {
  $('#ingredient-count').textContent = `${pendingIngredients.length} ${pendingIngredients.length === 1 ? 'added' : 'added'}`;
  const container = $('#ingredient-list');
  container.innerHTML = pendingIngredients.map((item, index) => `<div class="ingredient-row"><div><strong>${escapeHtml(item.name)}</strong><br><span>${formatNumber(item.grams)} g · ${formatNumber(item.nutrients.calories)} kcal</span></div><button class="ingredient-remove" type="button" data-remove-ingredient="${index}" aria-label="Remove ${escapeAttribute(item.name)}">×</button></div>`).join('');
  $('#meal-total').innerHTML = `<span>Meal estimate</span><strong>${formatNumber(pendingNutrientTotals().calories)} kcal</strong>`;
}

function nutrientFromForm(name, grams) {
  const profile = selectedFood();
  const scale = number(grams) / 100;
  if (profile) {
    const values = emptyNutrients();
    NUTRIENTS.forEach(({ key }) => { values[key] = round(number(profile[key]) * scale, 2); });
    return values;
  }
  const customCalories = $('[data-custom-nutrient="calories"]');
  if (!customCalories || customCalories.value === '') return null;
  const values = emptyNutrients();
  NUTRIENTS.forEach(({ key }) => {
    const field = $(`[data-custom-nutrient="${key}"]`);
    values[key] = round(number(field?.value) * scale, 2);
  });
  return values;
}

function fileToPhoto(file) {
  return new Promise((resolve, reject) => {
    if (!file) return resolve('');
    if (!file.type.startsWith('image/')) return reject(new Error('Please choose an image file.'));
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('The photo could not be read.'));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error('The selected photo could not be opened.'));
      image.onload = () => {
        const maxSide = 1000;
        const ratio = Math.min(1, maxSide / Math.max(image.width, image.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(image.width * ratio));
        canvas.height = Math.max(1, Math.round(image.height * ratio));
        const context = canvas.getContext('2d');
        if (!context) return reject(new Error('Photo processing is not available in this browser.'));
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.72));
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
}

function escapeAttribute(value) {
  return escapeHtml(value).replace(/`/g, '&#96;');
}

function openDialog(id) {
  const dialog = $(`#${id}`);
  if (dialog && typeof dialog.showModal === 'function') dialog.showModal();
  else showToast('This browser does not support the entry dialog.');
}

function resetFoodForm() {
  $('#food-form').reset();
  pendingIngredients = [];
  selectedPhoto = '';
  $('#photo-preview').innerHTML = '';
  $('#photo-preview').classList.add('hidden');
  $('#custom-nutrients').classList.add('hidden');
  $('#ingredient-grams').value = '100';
  renderIngredientBuilder();
}

function parseCsvRow(line) {
  const result = [];
  let value = '';
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (character === '"' && line[index + 1] === '"' && quoted) {
      value += '"';
      index += 1;
    } else if (character === '"') {
      quoted = !quoted;
    } else if (character === ',' && !quoted) {
      result.push(value);
      value = '';
    } else {
      value += character;
    }
  }
  result.push(value);
  return result;
}

function importHealthCsv(file) {
  const reader = new FileReader();
  reader.onerror = () => showToast('Unable to read that CSV file.');
  reader.onload = () => {
    const lines = String(reader.result || '').split(/\r?\n/).filter((line) => line.trim());
    if (lines.length < 2) {
      showToast('This CSV has no activity rows.');
      return;
    }
    const header = parseCsvRow(lines[0]).map((value) => value.trim().toLowerCase());
    const dateIndex = header.indexOf('date');
    const energyIndex = header.indexOf('active_energy_kcal');
    if (dateIndex < 0 || energyIndex < 0) {
      showToast('Add date and active_energy_kcal columns, then import again.');
      return;
    }
    let imported = 0;
    for (const line of lines.slice(1)) {
      const row = parseCsvRow(line);
      const rawDate = String(row[dateIndex] || '').trim();
      const date = new Date(/^\d{4}-\d{2}-\d{2}$/.test(rawDate) ? `${rawDate}T00:00:00` : rawDate);
      const calories = Number(row[energyIndex]);
      if (Number.isNaN(date.getTime()) || !Number.isFinite(calories) || calories <= 0) continue;
      const normalizedDate = dateKey(date);
      const exists = state.activities.some((item) => item.importKey === `${normalizedDate}-${round(calories, 1)}`);
      if (exists) continue;
      state.activities.push({
        id: crypto.randomUUID(),
        date: normalizedDate,
        name: 'Health export energy',
        calories: Math.round(calories),
        minutes: 0,
        source: 'health-import',
        importKey: `${normalizedDate}-${round(calories, 1)}`
      });
      imported += 1;
    }
    if (!imported) {
      showToast('No new valid energy rows found in that file.');
      return;
    }
    if (persist()) {
      render();
      showToast(`${imported} health-export ${imported === 1 ? 'entry' : 'entries'} imported.`);
    }
  };
  reader.readAsText(file);
}

function downloadData() {
  const payload = {
    exportedAt: new Date().toISOString(),
    format: 'Daywell local data export',
    profile: state.profile,
    meals: state.meals,
    activities: state.activities
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `daywell-export-${dateKey()}.json`;
  link.click();
  URL.revokeObjectURL(url);
  showToast('Your local data export is ready.');
}

function bindEvents() {
  $$('[data-open]').forEach((button) => button.addEventListener('click', () => {
    if (button.dataset.open === 'food-dialog') {
      resetFoodForm();
    } else if (button.dataset.open === 'activity-dialog') {
      $('#activity-form').reset();
      $('#activity-name').value = ACTIVITY_TYPES[$('#activity-type').value].name;
      updateActivityEstimate();
    }
    openDialog(button.dataset.open);
  }));
  $$('[data-close]').forEach((button) => button.addEventListener('click', () => button.closest('dialog').close()));
  $$('[data-scroll]').forEach((button) => button.addEventListener('click', () => {
    document.getElementById(button.dataset.scroll)?.scrollIntoView({ behavior: 'smooth' });
  }));
  $$('.side-nav a, .mobile-nav a').forEach((link) => link.addEventListener('click', () => {
    $$('.side-nav a, .mobile-nav a').forEach((item) => item.classList.toggle('active', item.getAttribute('href') === link.getAttribute('href')));
  }));
  $('#profile-form').addEventListener('input', renderProfilePreview);
  $('#profile-form').addEventListener('change', renderProfilePreview);
  $('#profile-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const profile = {
      currentWeight: number(form.get('currentWeight')),
      targetWeight: number(form.get('targetWeight')),
      height: number(form.get('height')),
      age: number(form.get('age')),
      goalWeeks: number(form.get('goalWeeks')),
      sex: String(form.get('sex')),
      activityLevel: String(form.get('activityLevel'))
    };
    if (profile.currentWeight < 25 || profile.targetWeight < 25 || profile.height < 120 || profile.age < 16 || profile.goalWeeks < 2) {
      showToast('Check the values and enter realistic profile details.');
      return;
    }
    state.profile = profile;
    if (persist()) {
      render();
      showToast('Your goals are saved on this device.');
      $('#overview').scrollIntoView({ behavior: 'smooth' });
    }
  });
  $('#ingredient-name').addEventListener('input', syncCustomNutrients);
  $('#ingredient-name').addEventListener('change', syncCustomNutrients);
  $('#add-ingredient').addEventListener('click', () => {
    const name = $('#ingredient-name').value.trim();
    const grams = number($('#ingredient-grams').value);
    if (!name || grams < 1 || grams > 3000) {
      showToast('Add an ingredient name and a valid gram amount.');
      return;
    }
    const nutrients = nutrientFromForm(name, grams);
    if (!nutrients) {
      showToast('Enter calories per 100 g for this custom ingredient.');
      $('[data-custom-nutrient="calories"]').focus();
      return;
    }
    pendingIngredients.push({ name, grams, nutrients });
    $('#ingredient-name').value = '';
    $('#ingredient-grams').value = '100';
    $('#custom-nutrients').classList.add('hidden');
    $$('[data-custom-nutrient]').forEach((field) => { field.value = ''; });
    renderIngredientBuilder();
  });
  $('#ingredient-list').addEventListener('click', (event) => {
    const button = event.target.closest('[data-remove-ingredient]');
    if (!button) return;
    pendingIngredients.splice(Number(button.dataset.removeIngredient), 1);
    renderIngredientBuilder();
  });
  $('#meal-photo').addEventListener('change', async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      selectedPhoto = await fileToPhoto(file);
      $('#photo-preview').innerHTML = `<img src="${selectedPhoto}" alt="Preview of meal photo"><button class="remove-photo" type="button">Remove photo</button>`;
      $('#photo-preview').classList.remove('hidden');
      $('#photo-preview .remove-photo').addEventListener('click', () => {
        selectedPhoto = '';
        $('#meal-photo').value = '';
        $('#photo-preview').innerHTML = '';
        $('#photo-preview').classList.add('hidden');
      });
    } catch (error) {
      showToast(error.message || 'The photo could not be added.');
    }
  });
  $('#food-form').addEventListener('submit', (event) => {
    event.preventDefault();
    if (!pendingIngredients.length) {
      showToast('Add at least one ingredient to calculate this meal.');
      return;
    }
    const meal = {
      id: crypto.randomUUID(),
      date: dateKey(),
      name: $('#meal-name').value.trim(),
      photo: selectedPhoto,
      ingredients: pendingIngredients,
      nutrients: pendingNutrientTotals(),
      createdAt: new Date().toISOString()
    };
    state.meals.push(meal);
    if (persist()) {
      $('#food-dialog').close();
      resetFoodForm();
      render();
      showToast('Meal saved. Your nutrient totals are updated.');
    } else {
      state.meals.pop();
    }
  });
  $('#activity-type').addEventListener('change', () => {
    $('#activity-name').value = ACTIVITY_TYPES[$('#activity-type').value].name;
    updateActivityEstimate();
  });
  ['activity-minutes', 'manual-calories'].forEach((id) => $(`#${id}`).addEventListener('input', updateActivityEstimate));
  $('#activity-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const type = $('#activity-type').value;
    const minutes = number($('#activity-minutes').value);
    const manualCalories = number($('#manual-calories').value);
    const name = $('#activity-name').value.trim();
    if (!name || minutes < 1 || minutes > 1440) {
      showToast('Add an activity name and a valid duration.');
      return;
    }
    if (!manualCalories && !number(state.profile?.currentWeight)) {
      showToast('Add a current weight to estimate calories, or enter calories from your watch.');
      return;
    }
    const activity = {
      id: crypto.randomUUID(),
      date: dateKey(),
      name,
      minutes,
      calories: manualCalories || caloriesFromActivity(type, minutes, number(state.profile.currentWeight)),
      source: manualCalories ? 'manual-device' : 'met-estimate',
      createdAt: new Date().toISOString()
    };
    state.activities.push(activity);
    if (persist()) {
      $('#activity-dialog').close();
      render();
      showToast('Movement saved to today.');
    } else {
      state.activities.pop();
    }
  });
  $('#meal-list').addEventListener('click', (event) => {
    const button = event.target.closest('[data-remove-meal]');
    if (!button) return;
    state.meals = state.meals.filter((item) => item.id !== button.dataset.removeMeal);
    if (persist()) render();
  });
  $('#activity-list').addEventListener('click', (event) => {
    const button = event.target.closest('[data-remove-activity]');
    if (!button) return;
    state.activities = state.activities.filter((item) => item.id !== button.dataset.removeActivity);
    if (persist()) render();
  });
  $('#import-toggle').addEventListener('click', () => $('#import-panel').classList.toggle('hidden'));
  $('#health-import').addEventListener('change', (event) => {
    const file = event.target.files?.[0];
    if (file) importHealthCsv(file);
    event.target.value = '';
  });
  $('#export-data').addEventListener('click', downloadData);
  $('#clear-data').addEventListener('click', () => {
    if (!window.confirm('Clear your profile, meals, and activity from this browser? This cannot be undone.')) return;
    state = { profile: null, meals: [], activities: [] };
    localStorage.removeItem(STORAGE_KEY);
    $('#profile-form').reset();
    render();
    showToast('Your local Daywell data has been cleared.');
  });
}

function loadProfileForm() {
  const profile = state.profile;
  if (!profile) return;
  $('#current-weight').value = profile.currentWeight;
  $('#target-weight').value = profile.targetWeight;
  $('#height').value = profile.height;
  $('#age').value = profile.age;
  $('#goal-weeks').value = profile.goalWeeks;
  $('#sex').value = profile.sex || 'female';
  $('#activity-level').value = profile.activityLevel || 'sedentary';
}

initFoodProfiles();
loadProfileForm();
renderIngredientBuilder();
bindEvents();
render();
