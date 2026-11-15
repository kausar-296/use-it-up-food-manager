(function () {
  'use strict';

  var app = angular.module('useItUpApp', []);
  var STORAGE_KEY = 'useitup.data.v1';
  var categories = ['Fruits', 'Vegetables', 'Dairy', 'Meat & Seafood', 'Grains & Cereals', 'Snacks', 'Beverages', 'Others'];
  var recipes = [
    { id: 'banana-pancakes', title: 'Banana oat pancakes', description: 'Soft, golden pancakes with ripe banana and a little cinnamon.', emoji: '🥞', color: 'yellow', meal: 'Breakfast', diet: 'vegetarian', time: 20, difficulty: 'Easy', ingredients: ['banana', 'eggs', 'oats', 'milk', 'cinnamon'], instructions: ['Mash the banana in a bowl, then whisk in the eggs and milk.', 'Fold in the oats and cinnamon. Rest the batter for 5 minutes.', 'Cook small pancakes in a lightly oiled pan over medium heat, 2–3 minutes per side.', 'Serve warm with any extra fruit you have.'] },
    { id: 'tomato-egg-toast', title: 'Tomato & egg toast', description: 'A quick, savory breakfast for bread that deserves a good topping.', emoji: '🍳', color: 'peach', meal: 'Breakfast', diet: 'vegetarian', time: 15, difficulty: 'Easy', ingredients: ['eggs', 'tomatoes', 'bread', 'olive oil'], instructions: ['Toast the bread until crisp.', 'Warm olive oil in a pan and cook the chopped tomatoes until soft.', 'Fry or scramble the eggs to your liking.', 'Pile the tomatoes and eggs onto toast.'] },
    { id: 'garden-pasta', title: 'Whatever’s-in-the-fridge pasta', description: 'A flexible, bright pasta that makes odds and ends feel planned.', emoji: '🍝', color: 'green', meal: 'Dinner', diet: 'vegetarian', time: 25, difficulty: 'Easy', ingredients: ['pasta', 'tomatoes', 'spinach', 'onion', 'cheese'], instructions: ['Cook the pasta in salted water; save a mug of pasta water.', 'Soften chopped onion in olive oil, then add tomatoes and cook until saucy.', 'Stir in spinach until just wilted.', 'Toss with pasta, a splash of pasta water, and grated cheese.'] },
    { id: 'chicken-rice-bowl', title: 'Chicken & veggie rice bowl', description: 'A comforting bowl that turns leftover vegetables into dinner.', emoji: '🍚', color: 'mint', meal: 'Dinner', diet: 'non-vegetarian', time: 30, difficulty: 'Easy', ingredients: ['chicken', 'rice', 'carrots', 'broccoli', 'soy sauce'], instructions: ['Cook the rice according to the package directions.', 'Cut chicken into bite-size pieces and cook through in a hot pan.', 'Add chopped carrots and broccoli with a splash of water; cover until tender-crisp.', 'Stir in soy sauce and serve over rice.'] },
    { id: 'apple-crumble', title: 'Simple apple crumble', description: 'A cozy way to give soft apples a delicious second act.', emoji: '🍎', color: 'rose', meal: 'Snacks', diet: 'vegetarian', time: 40, difficulty: 'Easy', ingredients: ['apples', 'oats', 'flour', 'butter', 'brown sugar'], instructions: ['Heat the oven to 180°C / 350°F. Slice apples into a small baking dish.', 'Rub oats, flour, butter, and brown sugar together until crumbly.', 'Scatter the crumble over the apples.', 'Bake for 30 minutes, until bubbling and golden.'] },
    { id: 'spinach-feta-omelet', title: 'Spinach & cheese omelet', description: 'A fast, satisfying lunch for greens that need using soon.', emoji: '🥬', color: 'green', meal: 'Lunch', diet: 'vegetarian', time: 12, difficulty: 'Easy', ingredients: ['eggs', 'spinach', 'cheese', 'milk'], instructions: ['Whisk eggs with a splash of milk and a pinch of salt.', 'Wilt spinach in a warm, lightly buttered pan.', 'Pour in the eggs and cook gently, lifting the edges as they set.', 'Add cheese, fold the omelet, and cook until just set.'] },
    { id: 'yogurt-fruit-bowl', title: 'Yogurt & fruit bowl', description: 'A no-cook breakfast or snack that makes ripe fruit shine.', emoji: '🍓', color: 'pink', meal: 'Quick meals', diet: 'vegetarian', time: 5, difficulty: 'Easy', ingredients: ['yogurt', 'banana', 'berries', 'honey', 'oats'], instructions: ['Spoon yogurt into a bowl.', 'Slice banana and add it with the berries.', 'Finish with oats and a drizzle of honey.'] },
    { id: 'tuna-cucumber-sandwich', title: 'Tuna cucumber sandwich', description: 'Crisp, creamy and ready in minutes for a low-fuss lunch.', emoji: '🥪', color: 'mint', meal: 'Lunch', diet: 'non-vegetarian', time: 10, difficulty: 'Easy', ingredients: ['tuna', 'bread', 'cucumber', 'yogurt', 'lemon'], instructions: ['Drain the tuna and mix with yogurt and a squeeze of lemon.', 'Slice the cucumber thinly.', 'Layer tuna and cucumber between slices of bread.', 'Cut in half and serve.'] }
  ];

  function localDate(offset) {
    var date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + (offset || 0));
    return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
  }
  function makeDemoData() {
    var rows = [['Strawberries', 'Fruits', 1, 'packets', 2, 'Fridge', 'Wash just before eating.'], ['Spinach', 'Vegetables', 1, 'packets', 1, 'Fridge', 'Great in an omelet or pasta.'], ['Milk', 'Dairy', 1, 'L', 5, 'Fridge', ''], ['Bananas', 'Fruits', 4, 'pieces', 8, 'Pantry', ''], ['Pasta', 'Grains & Cereals', 1, 'packets', 150, 'Pantry', '']];
    return rows.map(function (row, index) { return { id: 'demo-' + (index + 1), name: row[0], category: row[1], quantity: row[2], unit: row[3], purchaseDate: localDate(-2), expiryDate: localDate(row[4]), location: row[5], notes: row[6], createdAt: Date.now() - index * 60000, demo: true, expiredLogged: false }; });
  }

  app.factory('KitchenStorage', function () {
    function initialState() { return { items: makeDemoData(), shopping: [], favorites: [], history: [], totalAdded: 5, demoCount: 5, preferences: { household: 'My kitchen', initials: 'U', reminders: true }, dismissedAlerts: [], notificationKeys: [] }; }
    var state;
    try { state = JSON.parse(localStorage.getItem(STORAGE_KEY), function (key, value) { return key === '$$hashKey' ? undefined : value; }); } catch (error) { state = null; }
    if (!state || !Array.isArray(state.items)) state = initialState();
    state.shopping = Array.isArray(state.shopping) ? state.shopping : [];
    state.favorites = Array.isArray(state.favorites) ? state.favorites : [];
    state.history = Array.isArray(state.history) ? state.history : [];
    state.dismissedAlerts = Array.isArray(state.dismissedAlerts) ? state.dismissedAlerts : [];
    state.notificationKeys = Array.isArray(state.notificationKeys) ? state.notificationKeys : [];
    state.demoCount = Number.isFinite(Number(state.demoCount)) ? Number(state.demoCount) : state.items.filter(function (item) { return item.demo; }).length;
    state.preferences = angular.extend({ household: 'My kitchen', initials: 'U', reminders: true }, state.preferences || {});
    state.totalAdded = Number(state.totalAdded) || state.items.length;
    return { state: state, save: function () { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state, function (key, value) { return key === '$$hashKey' ? undefined : value; })); return true; } catch (error) { return false; } }, reset: function () { state = initialState(); this.state = state; this.save(); } };
  });

  app.filter('foodStatus', function () { return function (items, daysUntil) { return (items || []).filter(function (item) { return daysUntil(item) <= 3; }); }; });

  app.controller('AppController', function ($scope, $interval, KitchenStorage) {
    var vm = this;
    var store = KitchenStorage;
    vm.data = store.state;
    vm.items = vm.data.items;
    vm.preferences = vm.data.preferences;
    vm.categories = categories;
    vm.units = ['kg', 'g', 'L', 'ml', 'pieces', 'packets'];
    vm.recipes = recipes;
    vm.navigation = [{ id: 'dashboard', label: 'Dashboard', icon: 'fa-house' }, { id: 'inventory', label: 'My inventory', icon: 'fa-box-open' }, { id: 'expiry', label: 'Expiry tracker', icon: 'fa-clock' }, { id: 'recipes', label: 'Recipe finder', icon: 'fa-book-open' }, { id: 'shopping', label: 'Shopping list', icon: 'fa-basket-shopping' }, { id: 'stats', label: 'Little wins', icon: 'fa-chart-simple' }];
    vm.page = 'dashboard';
    vm.inventoryCategory = '';
    vm.inventorySort = 'expiry';
    vm.expiryFilter = 'all';
    vm.recipeDiet = 'all';
    vm.recipeMeal = 'all';
    vm.todayLabel = new Intl.DateTimeFormat(undefined, { weekday: 'short', month: 'short', day: 'numeric' }).format(new Date());
    vm.greeting = new Date().getHours() < 12 ? 'Good morning,' : (new Date().getHours() < 18 ? 'Good afternoon,' : 'Good evening,');
    vm.notificationLabel = ('Notification' in window && Notification.permission === 'granted') ? 'Notifications on' : 'Turn on alerts';

    function save() { if (!store.save()) notify('Could not save. Your browser storage may be full.'); }
    function notify(message) { vm.toastMessage = message; if (vm.toastTimer) $interval.cancel(vm.toastTimer); vm.toastTimer = $interval(function () { vm.toastMessage = ''; }, 2800, 1); }
    function parseDate(value) {
      if (!value) return null;
      if (value instanceof Date) return new Date(value.getFullYear(), value.getMonth(), value.getDate());
      var parts = String(value).split('-');
      return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    }
    function dateValue(value) {
      var date = parseDate(value);
      return date ? date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0') : '';
    }
    function daysUntil(item) { var expiry = parseDate(item.expiryDate); var today = parseDate(localDate(0)); if (!expiry || isNaN(expiry.getTime())) return 99999; return Math.round((expiry - today) / 86400000); }
    function status(item) { var days = daysUntil(item); if (days < 0) return 'expired'; if (days === 0) return 'today'; if (days <= 3) return 'soon'; if (days <= 7) return 'use-soon'; return 'fresh'; }
    function recordExpiredItems() {
      var changed = false;
      vm.items.forEach(function (item) { if (daysUntil(item) < 0 && !item.expiredLogged) { item.expiredLogged = true; vm.data.history.push({ id: 'history-' + item.id, type: 'expired', name: item.name, date: item.expiryDate, quantity: item.quantity, unit: item.unit, demo: !!item.demo }); changed = true; } });
      if (changed) save();
    }
    vm.go = function (page) { vm.page = page; window.scrollTo(0, 0); };
    vm.pageTitle = function () { var found = vm.navigation.find(function (item) { return item.id === vm.page; }); return found ? found.label : 'Kitchen settings'; };
    vm.statusClass = function (item) { return 'status-' + status(item); };
    vm.statusText = function (item) { return { expired: 'Expired', today: 'Use today', soon: 'Expiring soon', 'use-soon': 'Use soon', fresh: 'Fresh' }[status(item)]; };
    vm.daysLabel = function (item) { var days = daysUntil(item); if (days < 0) return Math.abs(days) + ' ' + (Math.abs(days) === 1 ? 'day' : 'days') + ' ago'; if (days === 0) return 'Today'; return days + ' ' + (days === 1 ? 'day' : 'days'); };
    vm.formatDate = function (value) { var date = parseDate(value); return date && !isNaN(date.getTime()) ? new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).format(date) : '—'; };
    vm.emojiFor = function (category) { return { Fruits: '🍊', Vegetables: '🥬', Dairy: '🥛', 'Meat & Seafood': '🐟', 'Grains & Cereals': '🍞', Snacks: '🥨', Beverages: '🧃', Others: '🫙' }[category] || '🥫'; };
    vm.locationIcon = function (location) { return location === 'Freezer' ? 'fa-snowflake' : (location === 'Pantry' || location === 'Counter' ? 'fa-box' : 'fa-temperature-low'); };
    vm.openAdd = function () { vm.editingItem = null; vm.formSubmitted = false; vm.dateError = false; vm.itemDraft = { name: '', category: '', quantity: 1, unit: 'pieces', purchaseDate: parseDate(localDate(0)), expiryDate: parseDate(localDate(7)), location: 'Fridge', notes: '' }; vm.itemModalOpen = true; };
    vm.openEdit = function (item) { vm.editingItem = item; vm.formSubmitted = false; vm.dateError = false; vm.itemDraft = angular.copy(item); vm.itemDraft.purchaseDate = parseDate(item.purchaseDate); vm.itemDraft.expiryDate = parseDate(item.expiryDate); vm.itemModalOpen = true; };
    vm.closeItemModal = function (event) { if (event.target === event.currentTarget) vm.itemModalOpen = false; };
    vm.saveItem = function (form) {
      vm.formSubmitted = true;
      vm.dateError = !!(vm.itemDraft.purchaseDate && vm.itemDraft.expiryDate && vm.itemDraft.expiryDate < vm.itemDraft.purchaseDate);
      if (form.$invalid || vm.dateError || !vm.itemDraft.category) return;
      var draft = angular.copy(vm.itemDraft); draft.name = draft.name.trim(); draft.quantity = Number(draft.quantity); draft.purchaseDate = dateValue(draft.purchaseDate); draft.expiryDate = dateValue(draft.expiryDate);
      if (!draft.name || draft.quantity <= 0) return;
      if (vm.editingItem) { var wasExpiredLogged = vm.editingItem.expiryDate === draft.expiryDate ? vm.editingItem.expiredLogged : false; angular.extend(vm.editingItem, draft); vm.editingItem.expiredLogged = wasExpiredLogged; notify(draft.name + ' updated.'); }
      else { draft.id = 'food-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7); draft.createdAt = Date.now(); draft.demo = false; draft.expiredLogged = false; vm.items.push(draft); vm.data.totalAdded += 1; notify(draft.name + ' added to your kitchen.'); }
      vm.itemModalOpen = false; recordExpiredItems(); save(); refreshStats();
    };
    vm.deleteItem = function (item) { if (!window.confirm('Delete ' + item.name + ' from your inventory?')) return; vm.data.items = vm.items.filter(function (candidate) { return candidate.id !== item.id; }); vm.items = vm.data.items; vm.data.dismissedAlerts = vm.data.dismissedAlerts.filter(function (id) { return id !== item.id; }); save(); refreshStats(); notify(item.name + ' removed.'); };
    vm.useItem = function (item) { var type = daysUntil(item) < 0 ? 'expired' : 'used'; if (!window.confirm('Mark ' + item.name + ' as ' + (type === 'used' ? 'used' : 'expired') + ' and remove it from your inventory?')) return; if (type === 'used' || !item.expiredLogged) vm.data.history.push({ id: 'history-' + Date.now(), type: type, name: item.name, date: localDate(0), quantity: item.quantity, unit: item.unit, demo: !!item.demo }); vm.data.items = vm.items.filter(function (candidate) { return candidate.id !== item.id; }); vm.items = vm.data.items; save(); refreshStats(); notify(type === 'used' ? 'Lovely. One less thing wasted!' : 'Expired item logged.'); };
    vm.filteredInventory = function () { var query = (vm.inventorySearch || '').toLowerCase().trim(); return vm.items.filter(function (item) { return (!query || (item.name + ' ' + (item.notes || '')).toLowerCase().indexOf(query) !== -1) && (!vm.inventoryCategory || item.category === vm.inventoryCategory); }).slice().sort(function (a, b) { if (vm.inventorySort === 'name') return a.name.localeCompare(b.name); if (vm.inventorySort === 'recent') return b.createdAt - a.createdAt; return daysUntil(a) - daysUntil(b); }); };
    vm.expiryItems = function () { return vm.items.filter(function (item) { var days = daysUntil(item); if (vm.expiryFilter === 'urgent') return days <= 3; if (vm.expiryFilter === 'fresh') return days > 7; return true; }).slice().sort(function (a, b) { return daysUntil(a) - daysUntil(b); }); };
    vm.alertMessage = function (item) { var days = daysUntil(item); if (days < 0) return 'is past its expiry date.'; if (days === 0) return 'is best used today.'; return 'expires in ' + days + ' ' + (days === 1 ? 'day' : 'days') + '.'; };
    vm.visibleAlerts = function () { if (!vm.preferences.reminders) return []; return vm.items.filter(function (item) { return daysUntil(item) <= 3 && vm.data.dismissedAlerts.indexOf(item.id) === -1; }).sort(function (a, b) { return daysUntil(a) - daysUntil(b); }); };
    vm.dismissAlert = function (item) { vm.data.dismissedAlerts.push(item.id); save(); };
    vm.requestNotifications = function () {
      if (!('Notification' in window)) { notify('This browser does not support desktop notifications.'); return; }
      if (Notification.permission === 'granted') { vm.notificationLabel = 'Notifications on'; notify('Expiry notifications are already on.'); return; }
      Notification.requestPermission().then(function (permission) { $scope.$applyAsync(function () { vm.notificationLabel = permission === 'granted' ? 'Notifications on' : 'Turn on alerts'; if (permission === 'granted') sendBrowserNotifications(); else notify('Notifications were not enabled. In-app alerts still work.'); }); });
    };
    function sendBrowserNotifications() {
      if (!('Notification' in window) || Notification.permission !== 'granted') return;
      vm.items.filter(function (item) { return daysUntil(item) <= 3 && daysUntil(item) >= 0; }).forEach(function (item) { var key = item.id + ':' + localDate(0); if (vm.data.notificationKeys.indexOf(key) !== -1) return; new Notification('UseItUp: ' + item.name, { body: daysUntil(item) === 0 ? 'Use it today if you can.' : 'Expires in ' + daysUntil(item) + ' days.' }); vm.data.notificationKeys.push(key); }); save();
    }

    function canonical(value) { return (value || '').toLowerCase().replace(/[^a-z0-9 ]/g, '').trim().replace(/\s+/g, ' ').replace(/s$/, ''); }
    vm.isIngredientAvailable = function (ingredient) { var wanted = canonical(ingredient); return vm.items.some(function (item) { if (daysUntil(item) < 0) return false; var name = canonical(item.name); return name === wanted || name.indexOf(wanted) !== -1 || wanted.indexOf(name) !== -1; }); };
    vm.matchFor = function (recipe) { var have = recipe.ingredients.filter(function (ingredient) { return vm.isIngredientAvailable(ingredient); }); return { have: have, missing: recipe.ingredients.filter(function (ingredient) { return have.indexOf(ingredient) === -1; }), percent: Math.round(have.length / recipe.ingredients.length * 100) }; };
    vm.filteredRecipes = function () { return vm.recipes.filter(function (recipe) { var query = (vm.recipeSearch || '').toLowerCase().trim(); var searchMatch = !query || (recipe.title + ' ' + recipe.ingredients.join(' ')).toLowerCase().indexOf(query) !== -1; var dietMatch = vm.recipeDiet === 'all' || recipe.diet === vm.recipeDiet; var mealMatch = vm.recipeMeal === 'all' || (vm.recipeMeal === 'Quick meals' ? recipe.time <= 20 : recipe.meal === vm.recipeMeal); return searchMatch && dietMatch && mealMatch; }).slice().sort(function (a, b) { return vm.matchFor(b).percent - vm.matchFor(a).percent || a.time - b.time; }); };
    vm.clearRecipeFilters = function () { vm.recipeSearch = ''; vm.recipeDiet = 'all'; vm.recipeMeal = 'all'; };
    vm.openRecipe = function (recipe) { vm.recipeModal = recipe; };
    vm.isFavorite = function (id) { return vm.data.favorites.indexOf(id) !== -1; };
    vm.toggleFavorite = function (id) { var index = vm.data.favorites.indexOf(id); if (index === -1) { vm.data.favorites.push(id); notify('Recipe saved to favorites.'); } else { vm.data.favorites.splice(index, 1); notify('Recipe removed from favorites.'); } save(); };
    vm.addMissingIngredient = function (ingredient, recipeName) { if (vm.data.shopping.some(function (item) { return canonical(item.name) === canonical(ingredient) && !item.purchased; })) { notify(ingredient + ' is already on your list.'); return; } vm.data.shopping.push({ id: 'shop-' + Date.now() + '-' + Math.random().toString(36).slice(2, 5), name: ingredient, purchased: false, source: recipeName }); save(); refreshStats(); notify(ingredient + ' added to your list.'); };
    vm.addAllMissing = function (recipe) { var missing = vm.matchFor(recipe).missing; var added = 0; missing.forEach(function (ingredient) { if (!vm.data.shopping.some(function (item) { return canonical(item.name) === canonical(ingredient) && !item.purchased; })) { vm.data.shopping.push({ id: 'shop-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6), name: ingredient, purchased: false, source: recipe.title }); added += 1; } }); save(); refreshStats(); notify(added ? added + ' missing ' + (added === 1 ? 'ingredient' : 'ingredients') + ' added.' : 'Everything missing is already on your list.'); };
    vm.addShoppingItem = function () { var name = (vm.newShoppingName || '').trim(); if (!name) return; if (vm.data.shopping.some(function (item) { return canonical(item.name) === canonical(name) && !item.purchased; })) { notify(name + ' is already on your list.'); return; } vm.data.shopping.push({ id: 'shop-' + Date.now(), name: name, purchased: false, source: '' }); vm.newShoppingName = ''; save(); refreshStats(); notify(name + ' added to your list.'); };
    vm.pendingShopping = function () { return vm.data.shopping.filter(function (item) { return !item.purchased; }); };
    vm.purchasedShopping = function () { return vm.data.shopping.filter(function (item) { return item.purchased; }); };
    vm.togglePurchased = function (item) { item.purchased = !item.purchased; save(); refreshStats(); };
    vm.removeShoppingItem = function (item) { vm.data.shopping = vm.data.shopping.filter(function (candidate) { return candidate.id !== item.id; }); save(); refreshStats(); };
    vm.clearPurchased = function () { vm.data.shopping = vm.pendingShopping(); save(); refreshStats(); };
    vm.savePreferences = function () { vm.preferences.household = (vm.preferences.household || '').trim() || 'My kitchen'; vm.preferences.initials = (vm.preferences.initials || 'U').trim().slice(0, 3).toUpperCase(); save(); notify('Kitchen settings saved.'); };
    vm.clearDemoData = function () { var count = vm.items.filter(function (item) { return item.demo; }).length; if (!count || !window.confirm('Remove the ' + count + ' sample ' + (count === 1 ? 'item' : 'items') + '? Your own food will stay.')) return; vm.items = vm.data.items = vm.items.filter(function (item) { return !item.demo; }); vm.data.history = vm.data.history.filter(function (entry) { return !entry.demo; }); vm.data.totalAdded = Math.max(0, vm.data.totalAdded - vm.data.demoCount); vm.data.demoCount = 0; save(); refreshStats(); notify('Sample food removed.'); };
    vm.clearAllData = function () { if (!window.confirm('Clear all UseItUp data from this browser? This cannot be undone.')) return; store.reset(); vm.data = store.state; vm.items = vm.data.items; vm.preferences = vm.data.preferences; vm.go('dashboard'); refreshStats(); notify('Your sample kitchen is ready again.'); };

    vm.categoryBreakdown = []; vm.recentItems = []; vm.attentionItems = []; vm.expiringCount = 0; vm.todayCount = 0; vm.expiredCount = 0; vm.expiredHistoryCount = 0; vm.usedCount = 0; vm.totalAdded = 0; vm.categoryCount = 0; vm.demoItemCount = 0; vm.pendingShoppingCount = 0; vm.wasteLessPercent = 0; vm.wastePercent = 0; vm.monthlyUsage = []; vm.recentHistory = [];
    function refreshStats() {
      vm.expiringCount = vm.items.filter(function (item) { return daysUntil(item) >= 1 && daysUntil(item) <= 3; }).length;
      vm.todayCount = vm.items.filter(function (item) { return daysUntil(item) === 0; }).length;
      vm.expiredCount = vm.items.filter(function (item) { return daysUntil(item) < 0; }).length;
      vm.attentionItems = vm.items.filter(function (item) { return daysUntil(item) <= 3; }).sort(function (a, b) { return daysUntil(a) - daysUntil(b); });
      vm.recentItems = vm.items.slice().sort(function (a, b) { return b.createdAt - a.createdAt; }).slice(0, 4);
      vm.categoryBreakdown = categories.map(function (name) { var count = vm.items.filter(function (item) { return item.category === name; }).length; return { name: name, count: count, percent: vm.items.length ? count / vm.items.length * 100 : 0 }; }).filter(function (category) { return category.count > 0; }).sort(function (a, b) { return b.count - a.count; });
      vm.categoryCount = vm.categoryBreakdown.length;
      vm.demoItemCount = vm.items.filter(function (item) { return item.demo; }).length;
      vm.usedCount = vm.data.history.filter(function (entry) { return entry.type === 'used'; }).length;
      vm.expiredHistoryCount = vm.data.history.filter(function (entry) { return entry.type === 'expired'; }).length;
      vm.totalAdded = vm.data.totalAdded;
      vm.pendingShoppingCount = vm.pendingShopping().length;
      var resolved = vm.usedCount + vm.expiredHistoryCount;
      vm.wastePercent = resolved ? Math.round(vm.expiredHistoryCount / resolved * 100) : 0;
      vm.wasteLessPercent = resolved ? Math.round(vm.usedCount / resolved * 100) : 0;
      var current = new Date(); var months = [];
      for (var index = 5; index >= 0; index -= 1) { var date = new Date(current.getFullYear(), current.getMonth() - index, 1); var key = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0'); var count = vm.data.history.filter(function (entry) { return entry.type === 'used' && entry.date && entry.date.slice(0, 7) === key; }).length; months.push({ label: new Intl.DateTimeFormat(undefined, { month: 'short' }).format(date), count: count, height: count ? Math.max(12, Math.min(100, count / 6 * 100)) : 3 }); }
      vm.monthlyUsage = months;
      vm.recentHistory = vm.data.history.slice().sort(function (a, b) { return b.date.localeCompare(a.date); }).slice(0, 8);
    }
    recordExpiredItems(); refreshStats(); sendBrowserNotifications();
    var refreshTimer = $interval(function () { recordExpiredItems(); refreshStats(); }, 60000);
    $scope.$on('$destroy', function () { $interval.cancel(refreshTimer); if (vm.toastTimer) $interval.cancel(vm.toastTimer); });
  });
}());
