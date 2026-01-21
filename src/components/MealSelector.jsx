import { useState, useRef, useEffect } from 'react';
import { db, id, formatMealType } from '../lib/instantdb';
import './MealSelector.css';

function MealSelector({ 
  mealType, 
  dayOfWeek, 
  meals, 
  selectedMealId, 
  mealPlanId,
  userId,
  weekStartDate
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedMeal = meals.find(m => m.id === selectedMealId);

  // Filter meals based on meal type tags
  const getMealTag = (type) => {
    if (type.startsWith('snack')) return 'snack';
    return type; // breakfast, lunch, dinner
  };

  const filteredMeals = meals.filter(meal => {
    // If meal has no tags, show it everywhere (backwards compatibility)
    if (!meal.tags || meal.tags.length === 0) return true;
    // Otherwise, only show if it has the matching tag
    return meal.tags.includes(getMealTag(mealType));
  });

  const handleSelectMeal = async (mealId) => {
    const dbToUse = window.__demoDb || db;
    
    if (mealPlanId) {
      // Update existing meal plan
      if (mealId === null) {
        // Remove meal plan
        if (window.__demoDb) {
          // Demo mode: dispatch custom event
          window.dispatchEvent(new CustomEvent('demo-delete-plan', { detail: { id: mealPlanId } }));
        } else {
          await db.transact([
            db.tx.mealPlans[mealPlanId].delete()
          ]);
        }
      } else {
        if (window.__demoDb) {
          window.dispatchEvent(new CustomEvent('demo-update-plan', { detail: { id: mealPlanId, mealId } }));
        } else {
          await db.transact([
            db.tx.mealPlans[mealPlanId].update({
              mealId
            })
          ]);
        }
      }
    } else if (mealId !== null) {
      // Create new meal plan
      if (window.__demoDb) {
        window.dispatchEvent(new CustomEvent('demo-create-plan', { 
          detail: { 
            userId,
            dayOfWeek,
            mealType,
            mealId,
            weekStartDate,
            createdAt: Date.now()
          } 
        }));
      } else {
        await db.transact([
          db.tx.mealPlans[id()].update({
            userId,
            dayOfWeek,
            mealType,
            mealId,
            weekStartDate,
            createdAt: Date.now()
          })
        ]);
      }
    }
    
    setIsOpen(false);
  };

  return (
    <div className="meal-selector" ref={dropdownRef}>
      <label className="meal-label">{formatMealType(mealType)}:</label>
      
      <button 
        className="meal-dropdown-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="meal-name">
          {selectedMeal ? selectedMeal.name : 'Select a meal'}
        </span>
        <svg 
          className={`chevron ${isOpen ? 'open' : ''}`}
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      {isOpen && (
        <div className="meal-dropdown-menu">
          {selectedMeal && (
            <>
              <button
                className="meal-dropdown-item clear"
                onClick={() => handleSelectMeal(null)}
              >
                Clear selection
              </button>
              <div className="dropdown-divider"></div>
            </>
          )}
          
          {filteredMeals.length === 0 ? (
            <div className="empty-dropdown">
              <p>No {formatMealType(mealType).toLowerCase()} meals</p>
              <p className="empty-hint">Add meals tagged for {formatMealType(mealType).toLowerCase()} in the meal library</p>
            </div>
          ) : (
            filteredMeals.map(meal => (
              <button
                key={meal.id}
                className={`meal-dropdown-item ${selectedMeal?.id === meal.id ? 'selected' : ''}`}
                onClick={() => handleSelectMeal(meal.id)}
              >
                <span className="item-name">{meal.name}</span>
                {meal.macros?.calories > 0 && (
                  <span className="item-calories">{meal.macros.calories} cal</span>
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default MealSelector;
