# UseItUp

**Love your food. Waste less.**

UseItUp is a responsive, browser-based household food manager. Track what you have, keep an eye on expiry dates, find recipes that use your ingredients, and make a shopping list for what is missing.

## Run locally

No build step, package installation, or backend is required. From the project folder, start a local static server:

```powershell
py -m http.server 4173
```

Then open [http://localhost:4173](http://localhost:4173). If `py` is not available, use `python -m http.server 4173` instead. Keep the server running while using the app.

## Features

- Dashboard summaries, category breakdown, recently added food, and items needing attention.
- Inventory creation, editing, deletion, search, category filtering, and sorting.
- Expiry statuses calculated from local calendar dates: Fresh, Use soon, Expiring soon, Use today, and Expired.
- Dismissible in-app expiry alerts and optional browser notifications.
- A built-in recipe collection ranked by matching available, non-expired ingredients, with ingredient lists and instructions.
- Recipe diet and meal filters, saved favourites, and direct shopping-list actions for missing ingredients.
- Shopping list items can be added, checked off, restored, or removed.
- Statistics and monthly usage trends calculated from recorded food activity.
- Household preferences, sample-data removal, and an option to clear and restore all app data.

## Data and privacy

Inventory, shopping items, favourites, activity history, and preferences are saved in the browser's `localStorage` for this site. Data stays in that browser profile on that device; it is not synced or sent to a server. Clearing browser site data will remove it. Use **Kitchen settings → Clear all data** to reset the app and restore its sample kitchen.

Recipe matching compares normalized recipe ingredient names with names in the current inventory; expired items are excluded. It is a deterministic match against the recipe list in `app.js`, not an AI service or an external recipe API.

Statistics reflect recorded app activity. The waste rate is the share of recorded used-or-expired items that expired; it does not estimate weight, cost, or environmental impact. The initial sample inventory contributes to the total items-added count.

## Notifications

In-app expiry alerts are available while using the app. Browser notifications are optional and require permission from the browser. They are checked when the app is opened; this static app does not run a background service to send reminders while it is closed. Notifications require a supported browser and a secure context; `localhost` is supported for local development.

## Technology

- HTML5 and CSS3
- AngularJS 1.8.3
- JavaScript and browser `localStorage`
- Font Awesome icons, Google Fonts, and AngularJS are loaded from CDNs, so an internet connection is needed for those assets.

## Project files

- `index.html` — application structure and views
- `app.js` — AngularJS controller, recipe data, expiry calculations, and persistence
- `styles.css` — responsive layout and visual styling

---

# Authors

Kura Harshitha - [@kuraharshitha05](https://github.com/kuraharshitha05)
Kausar Jehan - [@kausar-296](https://github.com/kausar-296)
Mariam Fatima - [@MariamF35](https://github.com/MariamF35)

---
