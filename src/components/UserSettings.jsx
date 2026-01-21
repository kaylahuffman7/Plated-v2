import { useState } from 'react';
import { db, id, DEFAULT_MEALS, formatMealType } from '../lib/instantdb';
import './UserSettings.css';

const MEAL_OPTIONS = [
  { id: 'breakfast', label: 'Breakfast' },
  { id: 'snack1', label: 'Snack 1' },
  { id: 'lunch', label: 'Lunch' },
  { id: 'snack2', label: 'Snack 2' },
  { id: 'dinner', label: 'Dinner' },
  { id: 'snack3', label: 'Snack 3' }
];

function UserSettings({ userSettings, userId, onClose }) {
  const [mealsPerDay, setMealsPerDay] = useState(
    userSettings?.mealsPerDay || DEFAULT_MEALS
  );
  const [trackMacros, setTrackMacros] = useState(
    userSettings?.trackMacros ?? false
  );

  const handleToggleMeal = (mealId) => {
    if (mealsPerDay.includes(mealId)) {
      // Remove meal if it exists
      setMealsPerDay(mealsPerDay.filter(m => m !== mealId));
    } else {
      // Add meal in the correct order based on MEAL_OPTIONS
      const newMeals = [...mealsPerDay, mealId].sort((a, b) => {
        const aIndex = MEAL_OPTIONS.findIndex(opt => opt.id === a);
        const bIndex = MEAL_OPTIONS.findIndex(opt => opt.id === b);
        return aIndex - bIndex;
      });
      setMealsPerDay(newMeals);
    }
  };

  const handleSave = async () => {
    if (mealsPerDay.length === 0) {
      alert('Please select at least one meal or snack.');
      return;
    }

    if (window.__demoDb) {
      window.dispatchEvent(new CustomEvent('demo-update-settings', { 
        detail: { mealsPerDay, trackMacros } 
      }));
    } else {
      if (userSettings?.id) {
        // Update existing settings
        await db.transact([
          db.tx.userSettings[userSettings.id].update({
            mealsPerDay,
            trackMacros
          })
        ]);
      } else {
        // Create new settings
        await db.transact([
          db.tx.userSettings[id()].update({
            userId,
            mealsPerDay,
            trackMacros
          })
        ]);
      }
    }

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content settings-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Settings</h2>
          <button className="close-button" onClick={onClose} aria-label="Close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="modal-body">
          <div className="settings-section">
            <h3>Daily Meal Structure</h3>
            <p className="section-description">Select which meals and snacks you want to track each day</p>
            
            <div className="meal-options">
              {MEAL_OPTIONS.map(option => (
                <label key={option.id} className="meal-option">
                  <input
                    type="checkbox"
                    checked={mealsPerDay.includes(option.id)}
                    onChange={() => handleToggleMeal(option.id)}
                  />
                  <span className="meal-option-label">{formatMealType(option.id)}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="settings-section">
            <h3>Macro Tracking</h3>
            <label className="toggle-option">
              <input
                type="checkbox"
                checked={trackMacros}
                onChange={(e) => setTrackMacros(e.target.checked)}
              />
              <span className="toggle-label">Show daily macro totals</span>
            </label>
            <p className="section-hint">Display a summary of calories, protein, carbs, and fats</p>
          </div>

          <div className="form-actions">
            <button type="button" className="button-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="button" className="button-primary" onClick={handleSave}>
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserSettings;
