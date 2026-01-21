# Plated - Meal Planning App

A responsive web application for meal planning with customizable meals, snacks, and macro tracking.

## Tech Stack

- React 18
- Vite
- InstantDB (database & authentication)

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up InstantDB:
   - Create an account at [instantdb.com](https://instantdb.com)
   - Create a new app and copy your App ID
   - Create a `.env` file based on `.env.example`
   - Add your InstantDB App ID to the `.env` file

3. Run the development server:
```bash
npm run dev
```

## Features

- User authentication
- Meal library management (CRUD operations)
- Weekly meal planner with customizable meals/snacks per day
- Optional macro tracking
- Responsive design (mobile-first, scales to web)

## Project Structure

```
src/
├── components/        # React components
├── hooks/            # Custom hooks
├── App.jsx           # Main app component
└── main.jsx          # App entry point
```
