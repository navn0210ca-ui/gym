# Nutrition and calorie tracking

The **Food & calories** card on Home opens the nutrition journal. Choose a day, log meals with
optional photos, and add ingredients by weight. Included foods show approximate values per 100 g;
use **Custom food** to enter the values from a product label. The journal calculates calories,
protein, carbohydrates, fat, fiber, sugar, sodium, potassium, calcium, iron, and vitamins A, C, D,
and B12 from the ingredient amounts.

The activity logger includes workouts, walking, loading or unloading a dishwasher, bathroom
cleaning, sweeping, and mopping. For activities with an intensity preset, calories are estimated
from duration, MET, and body weight; the estimate can be overridden. Use the watch/device option to
enter active calories reported by Apple Health or another tracker.

Set a baseline daily calorie burn (excluding separately logged activities), target weight, and
target date to see the approximate daily energy gap and a food budget. The weight projection uses
a simplified 7,700 kcal per kg conversion. It is an estimate, not a medical recommendation.
Food entries use representative values, not a laboratory analysis. A meal photo is stored for
reference only; this version does not recognize food from a photo or connect to a live food
database.

## Data and device support

The GitHub Pages build is a static, local demo. Nutrition entries and goals are saved in the
openGym profile in that browser; meal photos are saved in that browser's IndexedDB. They do not
sync between browsers in the Pages demo, and clearing browser site data removes them. The public
site cannot access HealthKit or Apple Watch directly. The native iPhone app has openGym's existing
Apple Health integration for its supported workout and body data, but this nutrition journal does
not automatically import active calories. Enter calories shown by a watch or tracker manually.

When self-hosting openGym, nutrition records participate in the profile's per-entry sync. Meal
photos remain in the browser that took them in this version. The original openGym workout, planning,
exercise-library, progress, and account features are otherwise retained.
