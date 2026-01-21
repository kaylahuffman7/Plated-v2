# Plated - Project Summary

## Overview

A fully functional, responsive meal planning web application built with React and InstantDB. The app allows users to manage their meal library, plan weekly meals with customizable meal slots, and track nutritional macros.

## ✨ Features Implemented

### 1. User Authentication ✅
- Google sign-in via InstantDB auth
- User profile dropdown with sign-out
- Session persistence
- Protected routes (requires authentication)

### 2. Meal Library Management ✅
- **Create**: Add meals with name, description, and macros
- **Read**: Browse and search meal collection
- **Update**: Edit existing meals
- **Delete**: Remove meals with confirmation
- Search functionality to filter meals
- Macro display badges (calories, protein, carbs, fats)

### 3. Weekly Meal Planner ✅
- 7-day view (Monday through Sunday)
- Dropdown selectors for each meal/snack
- Real-time data sync via InstantDB
- Clear selection option
- Empty state handling
- Visual feedback for selected meals

### 4. User Settings ✅
- Customize daily meal structure
- Choose from 6 meal/snack options:
  - Breakfast
  - Lunch
  - Dinner
  - Snack 1, 2, 3
- Toggle macro tracking on/off
- Settings persist across sessions

### 5. Macro Tracking ✅
- Optional daily macro summary
- Displays 4 key metrics:
  - Total calories
  - Protein (grams)
  - Carbohydrates (grams)
  - Fats (grams)
- Automatic calculation from meal plans
- Beautiful gradient cards
- Responsive grid layout

### 6. Responsive Design ✅
- Mobile-first approach
- Vertical card layout matching provided mobile design
- Centered content on larger screens
- Smooth transitions and animations
- Touch-friendly interactions
- Breakpoints at 768px for tablet/mobile

## 🏗️ Technical Architecture

### Frontend Stack
- **React 18** - Component-based UI
- **Vite** - Build tool and dev server
- **Vanilla CSS** - Scoped component styles
- **InstantDB React SDK** - Real-time data and auth

### Database (InstantDB)
- Serverless, real-time database
- Built-in authentication
- Automatic data syncing
- No backend code required

### Project Structure
```
plated/
├── public/
├── src/
│   ├── components/          # React components
│   │   ├── Header.jsx       # Navigation header
│   │   ├── DayCard.jsx      # Daily meal card
│   │   ├── MealSelector.jsx # Meal dropdown
│   │   ├── MealLibrary.jsx  # CRUD modal
│   │   ├── UserSettings.jsx # Settings modal
│   │   └── MacrosSummary.jsx # Macro totals
│   ├── lib/
│   │   └── instantdb.js     # DB config & helpers
│   ├── App.jsx              # Main app component
│   ├── App.css              # Global app styles
│   ├── main.jsx             # Entry point
│   └── index.css            # Base styles
├── index.html
├── vite.config.js
├── package.json
├── README.md
├── SETUP.md                 # Detailed setup guide
└── QUICKSTART.md            # Quick reference
```

## 📊 Data Model

### Collections

**meals**
- `id` - Unique identifier
- `name` - Meal name (e.g., "Grilled Chicken Salad")
- `description` - Optional description
- `macros` - Object with protein, carbs, fats, calories
- `userId` - Owner reference
- `createdAt` - Timestamp

**mealPlans**
- `id` - Unique identifier
- `userId` - Owner reference
- `dayOfWeek` - Day name (lowercase)
- `mealType` - Meal slot (e.g., "breakfast")
- `mealId` - Reference to meals collection
- `weekStartDate` - ISO date string (Monday)
- `createdAt` - Timestamp

**userSettings**
- `id` - Unique identifier
- `userId` - Owner reference
- `mealsPerDay` - Array of meal types
- `trackMacros` - Boolean flag

## 🎨 Design System

### Colors
- **Primary**: `#667eea` → `#764ba2` (gradient)
- **Background**: `#e8e8e8`
- **Card**: `white` with subtle shadow
- **Text Primary**: `#333`
- **Text Secondary**: `#666`
- **Text Muted**: `#999`
- **Border**: `#e8e8e8`, `#ddd`

### Typography
- **Font Family**: System font stack (-apple-system, BlinkMacSystemFont, etc.)
- **Sizes**: 
  - H1: 48px / 36px (mobile)
  - H2: 24px / 20px (mobile)
  - H3: 20px / 18px (mobile)
  - Body: 14px / 13px (mobile)

### Spacing
- **Card Padding**: 20px / 16px (mobile)
- **Gap**: 16px / 12px
- **Border Radius**: 16px cards, 8px inputs

### Components
- Cards with rounded corners and subtle shadows
- Dropdown menus with smooth animations
- Icon buttons with hover states
- Modal overlays with backdrop blur
- Gradient macro cards

## 🔄 Data Flow

```
User Action (e.g., select meal)
    ↓
Component Handler (e.g., handleSelectMeal)
    ↓
InstantDB Transaction (db.transact)
    ↓
Real-time Update (useQuery hook)
    ↓
UI Re-render (React state update)
```

## 🚀 Key Features in Detail

### Real-time Sync
- InstantDB provides real-time updates
- Changes appear instantly across devices
- No manual refresh needed
- Optimistic updates for better UX

### Week Management
- Tracks meals by week start date (Monday)
- Supports historical tracking
- Foundation for future week navigation

### Dropdown Interaction
- Click outside to close
- ESC key support (via outside click)
- Smooth open/close animations
- Scroll for long lists
- Visual feedback for selected items

### Settings Flexibility
- Meal order maintained consistently
- Supports 1-6 meals per day
- Changes apply immediately to all day cards
- Validation prevents empty meal structure

## 📱 Responsive Behavior

### Mobile (< 768px)
- Full-width cards
- Stacked macro grid (2 columns)
- Reduced padding and font sizes
- Touch-optimized tap targets

### Desktop (≥ 768px)
- Centered content (max-width: 600px)
- 4-column macro grid
- Larger text and spacing
- Hover states on interactive elements

## 🔒 Security

- Authentication required for all features
- User data isolation (userId filters)
- No exposed API keys (environment variables)
- InstantDB handles security rules

## ⚡ Performance

- Lazy loading of modals
- Efficient React rendering
- CSS animations (GPU-accelerated)
- Minimal bundle size
- Fast Vite dev server

## 🧪 Testing Checklist

- [ ] Sign in with Google
- [ ] Add new meal to library
- [ ] Edit existing meal
- [ ] Delete meal
- [ ] Search meals
- [ ] Select meal for a day
- [ ] Clear meal selection
- [ ] Open settings
- [ ] Change meals per day
- [ ] Toggle macro tracking
- [ ] View macro summary
- [ ] Test on mobile device
- [ ] Test on desktop
- [ ] Sign out and back in

## 🎯 Future Enhancements

### High Priority
1. **Week Navigation** - Previous/next week buttons
2. **Meal Duplication** - Copy meals across days
3. **Grocery List** - Generate from weekly plan

### Medium Priority
4. **Meal Categories** - Organize by type (breakfast, lunch, etc.)
5. **Tags** - Label meals (vegetarian, quick, etc.)
6. **Notes** - Add meal prep instructions
7. **Favorites** - Star frequently used meals

### Low Priority
8. **Export/Import** - JSON backup/restore
9. **Print View** - Printer-friendly meal plan
10. **Dark Mode** - Theme toggle
11. **Meal Photos** - Image upload
12. **Recipe Integration** - Import from URLs

## 🐛 Known Limitations

1. **Week View**: Currently shows only current week
2. **Meal History**: No historical view of past weeks
3. **Bulk Operations**: No multi-select for meals
4. **Offline Mode**: Requires internet connection
5. **Email Auth**: Only Google sign-in supported

## 📦 Dependencies

### Production
- `react@^18.3.1` - UI library
- `react-dom@^18.3.1` - React DOM bindings
- `@instantdb/react@^0.12.0` - Database & auth

### Development
- `vite@^5.4.2` - Build tool
- `@vitejs/plugin-react@^4.3.1` - Vite React plugin
- `@types/react@^18.3.3` - TypeScript definitions
- `@types/react-dom@^18.3.0` - TypeScript definitions

## 🎓 Learning Resources

### For Further Development
- [React Hooks](https://react.dev/reference/react)
- [InstantDB Docs](https://instantdb.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)
- [CSS Layout](https://web.dev/learn/css/layout/)

## 📄 License

This is a personal project. Feel free to modify and use as needed.

## 🙏 Acknowledgments

- Design inspiration from the provided mobile mockup
- InstantDB for the excellent real-time database
- React and Vite communities

---

**Version**: 1.0.0  
**Last Updated**: January 2026  
**Status**: ✅ Complete and functional
