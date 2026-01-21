# Plated Setup Guide

Welcome to Plated! This guide will help you get your meal planning app up and running.

## Prerequisites

Before you begin, make sure you have:
- Node.js (version 16 or higher)
- npm or yarn package manager

### Installing Node.js

If you don't have Node.js installed:

1. **macOS**: 
   - Using Homebrew: `brew install node`
   - Or download from [nodejs.org](https://nodejs.org/)

2. **Verify installation**:
   ```bash
   node --version
   npm --version
   ```

## Installation Steps

### 1. Install Dependencies

Open your terminal, navigate to the project directory, and run:

```bash
cd "/Users/kaylahuffman/Documents/Plated try 2"
npm install
```

This will install all required packages including:
- React
- Vite
- InstantDB SDK

### 2. Set Up InstantDB

InstantDB is a real-time database that powers your meal planning data.

1. **Create an InstantDB account**:
   - Go to [instantdb.com](https://instantdb.com)
   - Sign up for a free account
   - Click "Create App" to create a new application

2. **Get your App ID**:
   - After creating your app, you'll see your App ID on the dashboard
   - Copy this ID (it looks like: `abc123-def456-ghi789`)

3. **Configure your environment**:
   - Create a `.env` file in the project root:
     ```bash
     cp .env.example .env
     ```
   - Open `.env` and replace the placeholder with your App ID:
     ```
     VITE_INSTANT_APP_ID=your_actual_app_id_here
     ```

### 3. Run the Development Server

Start the app:

```bash
npm run dev
```

The app will open at `http://localhost:5173` (or another port if 5173 is busy).

## First-Time Usage

1. **Sign In**: Click "Sign in with Google" to authenticate
2. **Add Meals**: Click the grid icon in the header to open your Meal Library
3. **Create Your First Meal**:
   - Click "+ Add Meal"
   - Enter the meal name (e.g., "Grilled Chicken Salad")
   - Optionally add description and macros
   - Click "Add Meal"
4. **Plan Your Week**: 
   - Select meals from the dropdowns for each day
   - Customize your daily meal structure in Settings (gear icon)

## Features

### Meal Library
- Add, edit, and delete saved meals
- Store nutritional information (calories, protein, carbs, fats)
- Search through your meal collection

### Weekly Planning
- Plan meals for 7 days (Monday - Sunday)
- Dropdown selectors for each meal/snack
- Clear meal selections easily

### User Settings
- Customize your daily meal structure
- Choose which meals and snacks to track
- Enable/disable macro tracking

### Macro Tracking
- View daily totals for calories, protein, carbs, and fats
- Automatically calculated from your meal plan
- Toggle on/off in settings

## Building for Production

When you're ready to deploy:

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

## Troubleshooting

### "npm: command not found"
- Node.js is not installed. Follow the Prerequisites section above.

### App ID not working
- Make sure you've created a `.env` file (not `.env.example`)
- Verify your App ID is correct in InstantDB dashboard
- Restart the dev server after changing `.env`

### Authentication issues
- Check your browser console for errors
- Ensure pop-ups are allowed for Google sign-in
- Try using an incognito/private window

## Support

For InstantDB specific issues, check:
- [InstantDB Documentation](https://instantdb.com/docs)
- [InstantDB Discord](https://discord.gg/instantdb)

## Next Steps

Consider adding:
- Week navigation to view/plan future weeks
- Meal categories and tags
- Grocery list generation
- Meal duplication across days
- Import/export meal plans

Enjoy planning your meals with Plated! 🍽️
