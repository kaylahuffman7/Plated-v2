import { useState } from 'react';
import { db, id } from '../lib/instantdb';
import './MealLibrary.css';

function MealLibrary({ meals, userId, onClose }) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    protein: '',
    carbs: '',
    fats: '',
    calories: '',
    tags: []
  });

  const MEAL_TAGS = ['breakfast', 'lunch', 'dinner', 'snack'];

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      protein: '',
      carbs: '',
      fats: '',
      calories: '',
      tags: []
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const toggleTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const mealData = {
      name: formData.name,
      description: formData.description,
      tags: formData.tags,
      macros: {
        protein: parseFloat(formData.protein) || 0,
        carbs: parseFloat(formData.carbs) || 0,
        fats: parseFloat(formData.fats) || 0,
        calories: parseFloat(formData.calories) || 0
      },
      userId,
      createdAt: Date.now()
    };

    if (window.__demoDb) {
      if (editingId) {
        window.dispatchEvent(new CustomEvent('demo-update-meal', { detail: { id: editingId, updates: mealData } }));
      } else {
        window.dispatchEvent(new CustomEvent('demo-create-meal', { detail: mealData }));
      }
    } else {
      if (editingId) {
        await db.transact([
          db.tx.meals[editingId].update(mealData)
        ]);
      } else {
        await db.transact([
          db.tx.meals[id()].update(mealData)
        ]);
      }
    }

    resetForm();
  };

  const handleEdit = (meal) => {
    setFormData({
      name: meal.name,
      description: meal.description || '',
      tags: meal.tags || [],
      protein: meal.macros?.protein?.toString() || '',
      carbs: meal.macros?.carbs?.toString() || '',
      fats: meal.macros?.fats?.toString() || '',
      calories: meal.macros?.calories?.toString() || ''
    });
    setEditingId(meal.id);
    setIsAdding(true);
  };

  const handleDelete = async (mealId) => {
    if (confirm('Are you sure you want to delete this meal?')) {
      if (window.__demoDb) {
        window.dispatchEvent(new CustomEvent('demo-delete-meal', { detail: { id: mealId } }));
      } else {
        await db.transact([
          db.tx.meals[mealId].delete()
        ]);
      }
    }
  };

  const filteredMeals = meals
    .filter(meal =>
      meal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (meal.description || '').toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Meal Library</h2>
          <button className="close-button" onClick={onClose} aria-label="Close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="modal-body">
          {!isAdding ? (
            <>
              <div className="library-actions">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search meals..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button 
                  className="add-meal-button"
                  onClick={() => setIsAdding(true)}
                >
                  + Add Meal
                </button>
              </div>

              <div className="meals-list">
                {filteredMeals.length === 0 ? (
                  <div className="empty-state">
                    <p>No meals found. Add your first meal to get started!</p>
                  </div>
                ) : (
                  filteredMeals.map(meal => (
                    <div key={meal.id} className="meal-item">
                      <div className="meal-info">
                        <h3>{meal.name}</h3>
                        {meal.description && (
                          <p className="meal-description">{meal.description}</p>
                        )}
                        {meal.tags && meal.tags.length > 0 && (
                          <div className="meal-tags">
                            {meal.tags.map(tag => (
                              <span key={tag} className="tag-badge">
                                {tag.charAt(0).toUpperCase() + tag.slice(1)}
                              </span>
                            ))}
                          </div>
                        )}
                        {meal.macros && (
                          <div className="meal-macros">
                            {meal.macros.calories > 0 && (
                              <span className="macro-badge">{meal.macros.calories} cal</span>
                            )}
                            {meal.macros.protein > 0 && (
                              <span className="macro-badge">P: {meal.macros.protein}g</span>
                            )}
                            {meal.macros.carbs > 0 && (
                              <span className="macro-badge">C: {meal.macros.carbs}g</span>
                            )}
                            {meal.macros.fats > 0 && (
                              <span className="macro-badge">F: {meal.macros.fats}g</span>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="meal-actions">
                        <button 
                          className="icon-button"
                          onClick={() => handleEdit(meal)}
                          title="Edit"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </button>
                        <button 
                          className="icon-button delete"
                          onClick={() => handleDelete(meal.id)}
                          title="Delete"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          ) : (
            <form className="meal-form" onSubmit={handleSubmit}>
              <h3>{editingId ? 'Edit Meal' : 'Add New Meal'}</h3>
              
              <div className="form-group">
                <label htmlFor="name">Meal Name *</label>
                <input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Grilled Chicken Salad"
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Optional description..."
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Meal Type Tags</label>
                <div className="tags-selector">
                  {MEAL_TAGS.map(tag => (
                    <label key={tag} className="tag-checkbox">
                      <input
                        type="checkbox"
                        checked={formData.tags.includes(tag)}
                        onChange={() => toggleTag(tag)}
                      />
                      <span className="tag-label">{tag.charAt(0).toUpperCase() + tag.slice(1)}</span>
                    </label>
                  ))}
                </div>
                <small style={{ color: '#666', fontSize: '12px' }}>
                  Select which meal types this can be used for
                </small>
              </div>

              <div className="macros-grid">
                <div className="form-group">
                  <label htmlFor="calories">Calories</label>
                  <input
                    id="calories"
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.calories}
                    onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                    placeholder="0"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="protein">Protein (g)</label>
                  <input
                    id="protein"
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.protein}
                    onChange={(e) => setFormData({ ...formData, protein: e.target.value })}
                    placeholder="0"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="carbs">Carbs (g)</label>
                  <input
                    id="carbs"
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.carbs}
                    onChange={(e) => setFormData({ ...formData, carbs: e.target.value })}
                    placeholder="0"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="fats">Fats (g)</label>
                  <input
                    id="fats"
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.fats}
                    onChange={(e) => setFormData({ ...formData, fats: e.target.value })}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="button-secondary" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="button-primary">
                  {editingId ? 'Update Meal' : 'Add Meal'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default MealLibrary;
