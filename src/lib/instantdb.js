import { init, id } from '@instantdb/react';

// Initialize InstantDB
// Get your app ID from https://instantdb.com/dash
const APP_ID = 'b477dd47-3e85-42e2-a24c-d6feb041ec3a';

// Initialize without schema - InstantDB is schemaless and will infer types
export const db = init({
  appId: APP_ID
});

// Export the id function for generating unique IDs
export { id };

// Default meal structure
export const DEFAULT_MEALS = ['breakfast', 'snack1', 'lunch', 'snack2', 'dinner'];

// Days of the week
export const DAYS_OF_WEEK = [
  'monday',
  'tuesday', 
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday'
];

// Helper to capitalize first letter
export const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

// Helper to format meal type for display
export const formatMealType = (mealType) => {
  if (mealType.startsWith('snack')) {
    return `Snack ${mealType.slice(-1)}`;
  }
  return capitalize(mealType);
};

// Helper to get start of current week (Monday)
export const getWeekStartDate = () => {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  const monday = new Date(now.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday.toISOString().split('T')[0];
};
