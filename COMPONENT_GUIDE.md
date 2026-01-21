# Component Guide

A visual guide to understanding how the Plated components work together.

## 🗂️ Component Hierarchy

```
App.jsx
├── Header
│   ├── Logo/Title
│   ├── Meal Library Button → opens MealLibrary
│   ├── Settings Button → opens UserSettings
│   └── Profile Dropdown
│       └── Sign Out
│
├── MacrosSummary (conditional: if trackMacros enabled)
│   └── 4 Macro Cards (Calories, Protein, Carbs, Fats)
│
├── DayCard (x7 - one per day)
│   ├── Day Title (Monday, Tuesday, etc.)
│   └── MealSelector (x N - based on mealsPerDay)
│       └── Dropdown Menu
│           ├── Clear Selection
│           └── Meal Options (from library)
│
├── MealLibrary (modal)
│   ├── Search Bar
│   ├── Add Meal Button
│   ├── Meal List
│   │   └── Meal Item
│   │       ├── Name & Description
│   │       ├── Macro Badges
│   │       └── Edit/Delete Buttons
│   └── Meal Form (when adding/editing)
│       ├── Name Input
│       ├── Description Input
│       ├── Macro Inputs (x4)
│       └── Save/Cancel Buttons
│
└── UserSettings (modal)
    ├── Daily Meal Structure
    │   └── Checkboxes (Breakfast, Lunch, Dinner, Snacks)
    ├── Macro Tracking Toggle
    └── Save/Cancel Buttons
```

## 📋 Component Descriptions

### `App.jsx`
**Purpose**: Main application container and data orchestration  
**Key Responsibilities**:
- InstantDB authentication and queries
- Modal state management
- Pass data to child components
- Handle auth flow (sign-in screen vs main app)

**Key State**:
- `showMealLibrary` - Controls meal library modal
- `showSettings` - Controls settings modal
- `currentWeekStart` - Tracks current week for meal plans

**Data Queries**:
- `meals` - User's meal library
- `mealPlans` - Weekly meal assignments
- `userSettings` - User preferences

---

### `Header.jsx`
**Purpose**: Navigation bar and user controls  
**Props**: `user`, `onSignOut`, `onOpenMealLibrary`, `onOpenSettings`  
**Features**:
- Displays app title "Plated"
- Meal library access button (grid icon)
- Settings access button (gear icon)
- Profile dropdown with user info and sign out

**Interactions**:
- Click meal library icon → Opens MealLibrary modal
- Click settings icon → Opens UserSettings modal
- Click profile → Show/hide dropdown
- Click outside → Close dropdown

---

### `DayCard.jsx`
**Purpose**: Container for a single day's meals  
**Props**: `day`, `meals`, `mealPlans`, `mealsPerDay`, `userId`, `weekStartDate`  
**Features**:
- Displays day name (capitalized)
- Renders MealSelector for each meal type
- Passes relevant data to selectors

**Layout**:
- White card with rounded corners
- Day title at top
- Vertical list of meal selectors

---

### `MealSelector.jsx`
**Purpose**: Dropdown for selecting a meal for a specific time slot  
**Props**: `mealType`, `dayOfWeek`, `meals`, `selectedMealId`, `mealPlanId`, `userId`, `weekStartDate`  
**Features**:
- Label showing meal type (e.g., "Breakfast:")
- Dropdown button with current selection
- Dropdown menu with meal options
- Clear selection option

**CRUD Operations**:
- **Create**: Add new meal plan when meal selected
- **Update**: Change meal in existing plan
- **Delete**: Remove meal plan when cleared

**Interactions**:
- Click button → Open/close dropdown
- Click meal → Select and save to database
- Click "Clear selection" → Remove meal plan
- Click outside → Close dropdown

---

### `MealLibrary.jsx`
**Purpose**: Modal for managing meal collection  
**Props**: `meals`, `userId`, `onClose`  
**Features**:
- Search/filter meals by name or description
- Add new meals via form
- Edit existing meals
- Delete meals with confirmation
- Display meal macros as badges

**Two Modes**:
1. **List Mode** (default):
   - Search bar
   - "Add Meal" button
   - List of meals with edit/delete actions

2. **Form Mode** (when adding/editing):
   - Name input (required)
   - Description textarea
   - 4 macro inputs (calories, protein, carbs, fats)
   - Save/Cancel buttons

**CRUD Operations**:
- **Create**: Add new meal to library
- **Read**: Display and search meals
- **Update**: Edit existing meal
- **Delete**: Remove meal from library

---

### `MacrosSummary.jsx`
**Purpose**: Display daily nutritional totals  
**Props**: `meals`, `mealPlans`, `mealsPerDay`  
**Features**:
- Calculates totals from selected meals
- 4 gradient cards showing metrics
- Responsive grid layout (4 cols desktop, 2 cols mobile)

**Calculations**:
- Sums macros from all meals in meal plans
- Rounds to 1 decimal place
- Updates in real-time as meals change

---

### `UserSettings.jsx`
**Purpose**: Modal for customizing app preferences  
**Props**: `userSettings`, `userId`, `onClose`  
**Features**:
- Customize daily meal structure (checkboxes)
- Toggle macro tracking on/off
- Save changes to database

**Settings**:
1. **Daily Meal Structure**:
   - Choose from 6 options (Breakfast, Lunch, Dinner, Snack 1-3)
   - Must select at least one
   - Order maintained automatically

2. **Macro Tracking**:
   - Toggle to show/hide MacrosSummary
   - Boolean preference

**Validation**:
- Prevents saving with no meals selected
- Creates settings if don't exist
- Updates existing settings

---

## 🔄 Data Flow Examples

### Example 1: Selecting a Meal

```
User clicks "Grilled Chicken" in Monday's Lunch dropdown
    ↓
MealSelector.handleSelectMeal()
    ↓
db.transact([create new mealPlan])
    ↓
InstantDB real-time update
    ↓
App.jsx useQuery receives new data
    ↓
DayCard re-renders with new mealPlans
    ↓
MealSelector shows "Grilled Chicken" as selected
```

### Example 2: Adding a New Meal

```
User clicks "+ Add Meal" in library
    ↓
MealLibrary sets isAdding = true
    ↓
Form appears
    ↓
User fills name, macros, clicks "Add Meal"
    ↓
MealLibrary.handleSubmit()
    ↓
db.transact([create new meal])
    ↓
InstantDB real-time update
    ↓
App.jsx useQuery receives new meal
    ↓
MealLibrary list updates
    ↓
All MealSelector dropdowns now include new meal
```

### Example 3: Toggling Macro Tracking

```
User clicks Settings icon
    ↓
UserSettings modal opens
    ↓
User toggles "Show daily macro totals"
    ↓
User clicks "Save Settings"
    ↓
db.transact([update userSettings])
    ↓
InstantDB real-time update
    ↓
App.jsx useQuery receives updated settings
    ↓
App.jsx conditionally renders MacrosSummary
    ↓
Macro cards appear/disappear
```

## 🎨 Styling Architecture

Each component has its own CSS file with scoped class names:

```
Header.css       → .header, .profile-dropdown, etc.
DayCard.css      → .day-card, .day-title, etc.
MealSelector.css → .meal-selector, .meal-dropdown-menu, etc.
MealLibrary.css  → .modal-overlay, .meal-form, etc.
...
```

**Shared Patterns**:
- `.modal-overlay` - Full-screen backdrop
- `.modal-content` - Centered modal container
- `.button-primary` - Blue action buttons
- `.button-secondary` - Gray cancel buttons
- `.icon-button` - Small icon-only buttons

**Responsive Breakpoint**: `@media (max-width: 768px)`

## 🔧 Utility Functions (`lib/instantdb.js`)

### `capitalize(str)`
Capitalizes first letter of a string.
```js
capitalize('monday') // → 'Monday'
```

### `formatMealType(mealType)`
Formats meal type for display.
```js
formatMealType('snack1') // → 'Snack 1'
formatMealType('breakfast') // → 'Breakfast'
```

### `getWeekStartDate()`
Returns ISO date string for Monday of current week.
```js
getWeekStartDate() // → '2026-01-20'
```

## 📊 Constants

### `DEFAULT_MEALS`
```js
['breakfast', 'snack1', 'lunch', 'snack2', 'dinner']
```
Default meal structure for new users.

### `DAYS_OF_WEEK`
```js
['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
```
All days in order.

## 🎯 Component State Management

### Local State (useState)
- Modal visibility (App.jsx)
- Dropdown open/close (MealSelector, Header)
- Form data (MealLibrary, UserSettings)
- Search terms (MealLibrary)

### Server State (InstantDB useQuery)
- meals - Synced meal library
- mealPlans - Synced weekly plans
- userSettings - Synced preferences

### Derived State (useMemo)
- Macro totals (MacrosSummary)
- Filtered meals (MealLibrary)
- Current user settings with defaults (App)

## 🚀 Performance Optimizations

1. **Modal Lazy Rendering**: Modals only render when open
2. **Memoized Calculations**: MacrosSummary uses useMemo
3. **Event Delegation**: Click outside handlers use single listener
4. **CSS Transforms**: Animations use GPU-accelerated properties
5. **Scoped Queries**: InstantDB queries filtered by userId

## 📝 Quick Reference

### Adding a New Meal Type

1. Add to `MEAL_OPTIONS` in `UserSettings.jsx`
2. Update defaults in `lib/instantdb.js` if needed
3. No other changes required!

### Changing Colors

1. Find component CSS file
2. Search for color hex codes
3. Replace with your colors
4. Consider updating `App.css` for global colors

### Adding a New Setting

1. Add to schema in `lib/instantdb.js`
2. Add UI in `UserSettings.jsx`
3. Update save handler
4. Use in `App.jsx` as needed

---

**Need Help?** Check `SETUP.md` for installation or `QUICKSTART.md` for usage!
