import { capitalize } from '../lib/instantdb';
import MealSelector from './MealSelector';
import './DayCard.css';

function DayCard({ day, meals, mealPlans, mealsPerDay, userId, weekStartDate, dailyGoals }) {
  // Calculate daily macro totals
  const calculateDailyMacros = () => {
    let totals = {
      protein: 0,
      carbs: 0,
      fats: 0,
      calories: 0
    };

    mealPlans.forEach(mealPlan => {
      const meal = meals.find(m => m.id === mealPlan.mealId);
      if (meal?.macros) {
        totals.protein += meal.macros.protein || 0;
        totals.carbs += meal.macros.carbs || 0;
        totals.fats += meal.macros.fats || 0;
        totals.calories += meal.macros.calories || 0;
      }
    });

    return totals;
  };

  const dailyMacros = calculateDailyMacros();
  const hasMacros = dailyMacros.calories > 0;

  // Default goals if not provided
  const goals = dailyGoals || {
    calories: 2000,
    protein: 150,
    carbs: 250,
    fats: 65
  };

  // Calculate percentages
  const getPercentage = (current, goal) => {
    return Math.min(Math.round((current / goal) * 100), 100);
  };

  const getProgressColor = (percentage) => {
    if (percentage < 50) return '#ff9800'; // Orange
    if (percentage < 80) return '#2196f3'; // Blue
    return '#4caf50'; // Green
  };

  return (
    <div className="day-card">
      <h2 className="day-title">{capitalize(day)}</h2>

      {hasMacros && (
        <div className="day-macros">
          <div className="macro-item">
            <div className="macro-header">
              <span className="macro-label">Calories</span>
              <span className="macro-value">{Math.round(dailyMacros.calories)} / {goals.calories}</span>
            </div>
            <div className="macro-progress">
              <div 
                className="macro-progress-bar" 
                style={{ 
                  width: `${getPercentage(dailyMacros.calories, goals.calories)}%`,
                  backgroundColor: getProgressColor(getPercentage(dailyMacros.calories, goals.calories))
                }}
              ></div>
            </div>
          </div>
          <div className="macro-item">
            <div className="macro-header">
              <span className="macro-label">Protein</span>
              <span className="macro-value">{Math.round(dailyMacros.protein)}g / {goals.protein}g</span>
            </div>
            <div className="macro-progress">
              <div 
                className="macro-progress-bar" 
                style={{ 
                  width: `${getPercentage(dailyMacros.protein, goals.protein)}%`,
                  backgroundColor: getProgressColor(getPercentage(dailyMacros.protein, goals.protein))
                }}
              ></div>
            </div>
          </div>
          <div className="macro-item">
            <div className="macro-header">
              <span className="macro-label">Carbs</span>
              <span className="macro-value">{Math.round(dailyMacros.carbs)}g / {goals.carbs}g</span>
            </div>
            <div className="macro-progress">
              <div 
                className="macro-progress-bar" 
                style={{ 
                  width: `${getPercentage(dailyMacros.carbs, goals.carbs)}%`,
                  backgroundColor: getProgressColor(getPercentage(dailyMacros.carbs, goals.carbs))
                }}
              ></div>
            </div>
          </div>
          <div className="macro-item">
            <div className="macro-header">
              <span className="macro-label">Fats</span>
              <span className="macro-value">{Math.round(dailyMacros.fats)}g / {goals.fats}g</span>
            </div>
            <div className="macro-progress">
              <div 
                className="macro-progress-bar" 
                style={{ 
                  width: `${getPercentage(dailyMacros.fats, goals.fats)}%`,
                  backgroundColor: getProgressColor(getPercentage(dailyMacros.fats, goals.fats))
                }}
              ></div>
            </div>
          </div>
        </div>
      )}
      
      <div className="meals-list">
        {mealsPerDay.map(mealType => {
          const mealPlan = mealPlans.find(mp => mp.mealType === mealType);
          
          return (
            <MealSelector
              key={mealType}
              mealType={mealType}
              dayOfWeek={day}
              meals={meals}
              selectedMealId={mealPlan?.mealId}
              mealPlanId={mealPlan?.id}
              userId={userId}
              weekStartDate={weekStartDate}
            />
          );
        })}
      </div>
    </div>
  );
}

export default DayCard;
