# Daywell

Daywell is an original, browser-based prototype for tracking meals, activity, and a personal weight goal. It is not a copy or a fork of openGym.

## Run locally

Open `index.html` in a recent browser, or serve this folder over HTTP:

```powershell
python -m http.server 8000
```

Then visit http://localhost:8000.

## Publish on GitHub Pages

The included workflow deploys the static site whenever a commit is pushed to `main`. Enable **Settings → Pages → GitHub Actions** if Pages is not already enabled. The site should then be available at https://navn0210ca-ui.github.io/gym/.

## Features

- Add a meal photo, select ingredients, set amounts, and total estimated calories, macros, and a broad set of vitamins and minerals.
- Use generic food profiles or enter nutrition-label values per 100 g for custom ingredients.
- Add workouts and household activities with duration-based estimates or calories from a watch.
- Set current and target weight and a time horizon to see an estimated daily calorie target and projection based on recent logged days. Separately logged movement is included in the food target.
- Keep data in this browser, export a JSON backup, import a compatible activity-energy CSV, and clear locally stored data.

## Limitations

This static prototype stores data only in the current browser. It has no accounts, cloud sync, nutrition database/API, AI image recognition, or direct Apple Health/Watch access. A compatible activity CSV must contain `date` and `active_energy_kcal` columns. Direct HealthKit access requires a native iOS app and user permission. Calorie, activity, and weight projections are estimates, not medical advice.

## Upstream project

The requested upstream project is [DuarteSantos8/openGym](https://github.com/DuarteSantos8/openGym), licensed under AGPL-3.0. No upstream source files were copied into this prototype. Reusing or modifying openGym requires preserving its license and notices, and offering corresponding source code when running a modified version as a network service.
# gym
