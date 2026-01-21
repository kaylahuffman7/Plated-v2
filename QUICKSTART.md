# Quick Start Guide

## 🚀 Get Started in 3 Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up InstantDB

1. Go to [instantdb.com](https://instantdb.com) and create a free account
2. Create a new app and copy your App ID
3. Create a `.env` file in the project root:

```bash
# .env
VITE_INSTANT_APP_ID=your_app_id_here
```

### 3. Run the App

```bash
npm run dev
```

Visit `http://localhost:5173` and sign in with Google!

## 📱 What You Built

A responsive meal planning web application with:

### ✅ Core Features
- **User Authentication** - Sign in with Google (via InstantDB)
- **Meal Library** - Create, edit, delete, and search your meals
- **Weekly Planner** - Plan meals for Monday-Sunday
- **Macro Tracking** - Optional calorie and macro totals
- **User Settings** - Customize daily meal structure
- **Responsive Design** - Works great on mobile and desktop

### 🎨 Design
- Vertical card layout (matching your mobile design)
- Clean, minimal interface
- Smooth dropdowns and transitions
- Profile dropdown with avatar
- Centered content on larger screens

### 🏗️ Architecture

**Frontend**: React 18 + Vite
**Database**: InstantDB (real-time, serverless)
**Styling**: Vanilla CSS with responsive breakpoints

**Key Components**:
- `Header` - Navigation with meal library and settings
- `DayCard` - Individual day containers
- `MealSelector` - Dropdown for meal selection
- `MealLibrary` - CRUD modal for meals
- `UserSettings` - Customize meals per day
- `MacrosSummary` - Daily nutritional totals

### 📊 Data Structure

**meals** - Your saved recipes/meals
```js
{
  name, description,
  macros: { protein, carbs, fats, calories },
  userId, createdAt
}
```

**mealPlans** - Weekly meal assignments
```js
{
  userId, dayOfWeek, mealType,
  mealId, weekStartDate, createdAt
}
```

**userSettings** - User preferences
```js
{
  userId,
  mealsPerDay: ['breakfast', 'lunch', 'dinner'],
  trackMacros: boolean
}
```

## 🎯 How to Use

1. **Sign In** - Click "Sign in with Google"
2. **Add Meals** - Click the grid icon → "+ Add Meal"
3. **Plan Your Week** - Select meals from dropdowns
4. **Customize** - Click the gear icon to adjust settings
5. **Track Macros** - Enable in settings to see daily totals

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 📝 Key Features Explained

### Meal Library Management
- Add new meals with name, description, and macros
- Edit existing meals
- Delete meals (with confirmation)
- Search through your collection

### Weekly Planning
- 7-day view (Monday-Sunday)
- Customizable meal slots per day
- Easy dropdown selection
- Clear individual selections

### Settings Panel
- Choose which meals/snacks to track
- Options: Breakfast, Lunch, Dinner, Snack 1-3
- Toggle macro tracking on/off
- Changes apply immediately

### Macro Tracking
- Automatic calculation from meal plans
- Displays: Calories, Protein, Carbs, Fats
- Beautiful gradient cards
- Shows per-day totals

## 🎨 Customization

### Colors
Edit the CSS files in `src/components/` to change colors:
- Primary: `#667eea` (purple/blue)
- Background: `#e8e8e8` (light gray)
- Cards: `white`

### Meal Options
Edit `DEFAULT_MEALS` in `src/lib/instantdb.js` to change default meal structure.

### Add More Features
Some ideas for enhancement:
- Week navigation (previous/next week)
- Duplicate meals across days
- Grocery list generation
- Meal categories/tags
- Export meal plan to PDF
- Meal prep notes

## 📚 Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [InstantDB Documentation](https://instantdb.com/docs)

## 🐛 Troubleshooting

**Can't sign in?**
- Check browser console for errors
- Allow pop-ups for Google sign-in
- Verify your InstantDB App ID in `.env`

**Meals not saving?**
- Check that you're signed in
- Verify InstantDB connection
- Check browser console for errors

**Styling issues?**
- Clear browser cache
- Hard refresh (Cmd+Shift+R / Ctrl+Shift+R)

---

**Built with ❤️ using React, Vite, and InstantDB**

Enjoy your meal planning! 🍽️
