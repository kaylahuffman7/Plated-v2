import { useMemo } from 'react';
import './MacrosSummary.css';

function MacrosSummary({ meals, mealPlans, mealsPerDay }) {
  const dailyTotals = useMemo(() => {
    const totals = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0
    };

    mealPlans.forEach(plan => {
      const meal = meals.find(m => m.id === plan.mealId);
      if (meal?.macros) {
        totals.calories += meal.macros.calories || 0;
        totals.protein += meal.macros.protein || 0;
        totals.carbs += meal.macros.carbs || 0;
        totals.fats += meal.macros.fats || 0;
      }
    });

    return totals;
  }, [meals, mealPlans]);

  const formatNumber = (num) => {
    return Math.round(num * 10) / 10;
  };

  return (
    <div className="macros-summary">
      <h3 className="macros-title">Daily Totals</h3>
      <div className="macros-grid">
        <div className="macro-card">
          <div className="macro-value">{formatNumber(dailyTotals.calories)}</div>
          <div className="macro-label">Calories</div>
        </div>
        <div className="macro-card">
          <div className="macro-value">{formatNumber(dailyTotals.protein)}g</div>
          <div className="macro-label">Protein</div>
        </div>
        <div className="macro-card">
          <div className="macro-value">{formatNumber(dailyTotals.carbs)}g</div>
          <div className="macro-label">Carbs</div>
        </div>
        <div className="macro-card">
          <div className="macro-value">{formatNumber(dailyTotals.fats)}g</div>
          <div className="macro-label">Fats</div>
        </div>
      </div>
    </div>
  );
}

export default MacrosSummary;
