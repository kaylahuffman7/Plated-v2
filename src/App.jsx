import { useState, useEffect } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { db, id, DEFAULT_MEALS, DAYS_OF_WEEK, getWeekStartDate } from './lib/instantdb';
import Header from './components/Header';
import DayCard from './components/DayCard';
import MealLibrary from './components/MealLibrary';
import UserSettings from './components/UserSettings';
import './App.css';

const GOOGLE_CLIENT_ID = '592748543795-0boi4koa460hoina7sv9pg9ddlbbqiok.apps.googleusercontent.com';

// Sample meals with macros for demo
const SAMPLE_MEALS = [
  // Breakfast
  { id: 'meal-1', name: 'Oatmeal with Berries', description: 'Steel cut oats with mixed berries and honey', tags: ['breakfast'], macros: { protein: 12, carbs: 54, fats: 8, calories: 320 }, userId: 'demo-user', createdAt: Date.now() },
  { id: 'meal-2', name: 'Scrambled Eggs & Toast', description: '3 eggs with whole wheat toast', tags: ['breakfast'], macros: { protein: 24, carbs: 32, fats: 18, calories: 380 }, userId: 'demo-user', createdAt: Date.now() },
  { id: 'meal-3', name: 'Greek Yogurt Parfait', description: 'Greek yogurt with granola and fruit', tags: ['breakfast', 'snack'], macros: { protein: 20, carbs: 45, fats: 12, calories: 350 }, userId: 'demo-user', createdAt: Date.now() },
  { id: 'meal-4', name: 'Protein Smoothie Bowl', description: 'Banana, protein powder, almond milk, topped with granola', tags: ['breakfast', 'snack'], macros: { protein: 32, carbs: 48, fats: 14, calories: 420 }, userId: 'demo-user', createdAt: Date.now() },
  
  // Lunch
  { id: 'meal-5', name: 'Grilled Chicken Salad', description: 'Mixed greens with grilled chicken, avocado, and balsamic', tags: ['lunch', 'dinner'], macros: { protein: 35, carbs: 18, fats: 22, calories: 400 }, userId: 'demo-user', createdAt: Date.now() },
  { id: 'meal-6', name: 'Turkey & Avocado Wrap', description: 'Whole wheat wrap with turkey, avocado, lettuce, tomato', tags: ['lunch'], macros: { protein: 28, carbs: 42, fats: 16, calories: 420 }, userId: 'demo-user', createdAt: Date.now() },
  { id: 'meal-7', name: 'Quinoa Buddha Bowl', description: 'Quinoa with roasted veggies, chickpeas, tahini', tags: ['lunch', 'dinner'], macros: { protein: 18, carbs: 58, fats: 20, calories: 480 }, userId: 'demo-user', createdAt: Date.now() },
  { id: 'meal-8', name: 'Tuna Poke Bowl', description: 'Sushi rice with raw tuna, edamame, seaweed, cucumber', tags: ['lunch', 'dinner'], macros: { protein: 32, carbs: 52, fats: 12, calories: 440 }, userId: 'demo-user', createdAt: Date.now() },
  
  // Dinner
  { id: 'meal-9', name: 'Grilled Salmon & Veggies', description: 'Atlantic salmon with roasted broccoli and sweet potato', tags: ['dinner'], macros: { protein: 38, carbs: 35, fats: 24, calories: 520 }, userId: 'demo-user', createdAt: Date.now() },
  { id: 'meal-10', name: 'Chicken Stir Fry', description: 'Chicken breast with mixed vegetables and brown rice', tags: ['dinner'], macros: { protein: 42, carbs: 48, fats: 14, calories: 480 }, userId: 'demo-user', createdAt: Date.now() },
  { id: 'meal-11', name: 'Spaghetti Bolognese', description: 'Whole wheat pasta with lean ground beef sauce', tags: ['dinner'], macros: { protein: 36, carbs: 62, fats: 18, calories: 540 }, userId: 'demo-user', createdAt: Date.now() },
  { id: 'meal-12', name: 'Shrimp Tacos', description: 'Grilled shrimp tacos with cabbage slaw and lime', tags: ['dinner'], macros: { protein: 30, carbs: 44, fats: 16, calories: 440 }, userId: 'demo-user', createdAt: Date.now() },
  
  // Snacks
  { id: 'meal-13', name: 'Protein Bar', description: 'Quest protein bar - chocolate chip', tags: ['snack'], macros: { protein: 20, carbs: 22, fats: 8, calories: 200 }, userId: 'demo-user', createdAt: Date.now() },
  { id: 'meal-14', name: 'Apple & Almond Butter', description: 'Sliced apple with 2 tbsp almond butter', tags: ['snack'], macros: { protein: 5, carbs: 28, fats: 16, calories: 270 }, userId: 'demo-user', createdAt: Date.now() },
  { id: 'meal-15', name: 'Trail Mix', description: 'Mixed nuts, dried fruit, dark chocolate', tags: ['snack'], macros: { protein: 8, carbs: 32, fats: 18, calories: 320 }, userId: 'demo-user', createdAt: Date.now() },
  { id: 'meal-16', name: 'Protein Shake', description: 'Whey protein with almond milk', tags: ['snack'], macros: { protein: 25, carbs: 8, fats: 4, calories: 160 }, userId: 'demo-user', createdAt: Date.now() },
];

// Demo mode component
function DemoApp() {
  const [showMealLibrary, setShowMealLibrary] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [currentWeekStart, setCurrentWeekStart] = useState(getWeekStartDate());
  const [meals, setMeals] = useState([]);
  const [mealPlans, setMealPlans] = useState([]);
  const [userSettings, setUserSettings] = useState({
    mealsPerDay: DEFAULT_MEALS,
    trackMacros: true,
    dailyGoals: {
      calories: 2000,
      protein: 150,
      carbs: 250,
      fats: 65
    }
  });

  // Mock user
  const demoUser = {
    id: 'demo-user',
    email: 'demo@plated.app'
  };

  // Load data from localStorage
  useEffect(() => {
    const savedMeals = localStorage.getItem('plated-demo-meals');
    const savedPlans = localStorage.getItem('plated-demo-plans');
    const savedSettings = localStorage.getItem('plated-demo-settings');
    
    // Initialize with sample data if no saved data exists
    if (savedMeals) {
      setMeals(JSON.parse(savedMeals));
    } else {
      setMeals(SAMPLE_MEALS);
    }
    
    if (savedPlans) {
      setMealPlans(JSON.parse(savedPlans));
    } else {
      // Create some sample meal plans for the week
      const samplePlans = [
        // Monday
        { id: 'plan-1', userId: 'demo-user', dayOfWeek: 'monday', mealType: 'breakfast', mealId: 'meal-1', weekStartDate: getWeekStartDate(), createdAt: Date.now() },
        { id: 'plan-2', userId: 'demo-user', dayOfWeek: 'monday', mealType: 'lunch', mealId: 'meal-5', weekStartDate: getWeekStartDate(), createdAt: Date.now() },
        { id: 'plan-3', userId: 'demo-user', dayOfWeek: 'monday', mealType: 'dinner', mealId: 'meal-9', weekStartDate: getWeekStartDate(), createdAt: Date.now() },
        { id: 'plan-4', userId: 'demo-user', dayOfWeek: 'monday', mealType: 'snack1', mealId: 'meal-13', weekStartDate: getWeekStartDate(), createdAt: Date.now() },
        
        // Tuesday
        { id: 'plan-5', userId: 'demo-user', dayOfWeek: 'tuesday', mealType: 'breakfast', mealId: 'meal-2', weekStartDate: getWeekStartDate(), createdAt: Date.now() },
        { id: 'plan-6', userId: 'demo-user', dayOfWeek: 'tuesday', mealType: 'lunch', mealId: 'meal-6', weekStartDate: getWeekStartDate(), createdAt: Date.now() },
        { id: 'plan-7', userId: 'demo-user', dayOfWeek: 'tuesday', mealType: 'dinner', mealId: 'meal-10', weekStartDate: getWeekStartDate(), createdAt: Date.now() },
        { id: 'plan-8', userId: 'demo-user', dayOfWeek: 'tuesday', mealType: 'snack2', mealId: 'meal-14', weekStartDate: getWeekStartDate(), createdAt: Date.now() },
        
        // Wednesday
        { id: 'plan-9', userId: 'demo-user', dayOfWeek: 'wednesday', mealType: 'breakfast', mealId: 'meal-3', weekStartDate: getWeekStartDate(), createdAt: Date.now() },
        { id: 'plan-10', userId: 'demo-user', dayOfWeek: 'wednesday', mealType: 'lunch', mealId: 'meal-7', weekStartDate: getWeekStartDate(), createdAt: Date.now() },
        { id: 'plan-11', userId: 'demo-user', dayOfWeek: 'wednesday', mealType: 'dinner', mealId: 'meal-11', weekStartDate: getWeekStartDate(), createdAt: Date.now() },
      ];
      setMealPlans(samplePlans);
    }
    
    if (savedSettings) setUserSettings(JSON.parse(savedSettings));

    // Listen for demo events from components
    const handleCreatePlan = (e) => {
      const newPlan = { 
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        ...e.detail
      };
      setMealPlans(prev => [...prev, newPlan]);
    };

    const handleUpdatePlan = (e) => {
      setMealPlans(prev => prev.map(p => 
        p.id === e.detail.id ? { ...p, mealId: e.detail.mealId } : p
      ));
    };

    const handleDeletePlan = (e) => {
      setMealPlans(prev => prev.filter(p => p.id !== e.detail.id));
    };

    const handleCreateMeal = (e) => {
      const newMeal = { 
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        ...e.detail,
        createdAt: Date.now()
      };
      setMeals(prev => [...prev, newMeal]);
    };

    const handleUpdateMeal = (e) => {
      setMeals(prev => prev.map(m => 
        m.id === e.detail.id ? { ...m, ...e.detail.updates } : m
      ));
    };

    const handleDeleteMeal = (e) => {
      setMeals(prev => prev.filter(m => m.id !== e.detail.id));
    };

    const handleUpdateSettings = (e) => {
      setUserSettings(prev => ({ ...prev, ...e.detail }));
    };

    window.addEventListener('demo-create-plan', handleCreatePlan);
    window.addEventListener('demo-update-plan', handleUpdatePlan);
    window.addEventListener('demo-delete-plan', handleDeletePlan);
    window.addEventListener('demo-create-meal', handleCreateMeal);
    window.addEventListener('demo-update-meal', handleUpdateMeal);
    window.addEventListener('demo-delete-meal', handleDeleteMeal);
    window.addEventListener('demo-update-settings', handleUpdateSettings);

    return () => {
      window.removeEventListener('demo-create-plan', handleCreatePlan);
      window.removeEventListener('demo-update-plan', handleUpdatePlan);
      window.removeEventListener('demo-delete-plan', handleDeletePlan);
      window.removeEventListener('demo-create-meal', handleCreateMeal);
      window.removeEventListener('demo-update-meal', handleUpdateMeal);
      window.removeEventListener('demo-delete-meal', handleDeleteMeal);
      window.removeEventListener('demo-update-settings', handleUpdateSettings);
    };
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('plated-demo-meals', JSON.stringify(meals));
  }, [meals]);

  useEffect(() => {
    localStorage.setItem('plated-demo-plans', JSON.stringify(mealPlans));
  }, [mealPlans]);

  useEffect(() => {
    localStorage.setItem('plated-demo-settings', JSON.stringify(userSettings));
  }, [userSettings]);

  // Mock db object for demo mode
  const mockDb = {
    transact: (transactions) => {
      transactions.forEach(tx => {
        const action = tx.action || 'update';
        const entity = tx['tx-type'] || 'unknown';
        
        if (entity === 'meals' || tx.toString().includes('meals')) {
          if (action === 'update') {
            const newMeal = { 
              id: tx.id || Date.now().toString(), 
              ...tx.attrs,
              createdAt: Date.now() 
            };
            setMeals(prev => [...prev, newMeal]);
          } else if (action === 'delete') {
            setMeals(prev => prev.filter(m => m.id !== tx.id));
          }
        } else if (entity === 'mealPlans' || tx.toString().includes('mealPlans')) {
          if (action === 'update') {
            const newPlan = { 
              id: tx.id || Date.now().toString(), 
              ...tx.attrs,
              createdAt: Date.now() 
            };
            setMealPlans(prev => [...prev, newPlan]);
          } else if (action === 'delete') {
            setMealPlans(prev => prev.filter(p => p.id !== tx.id));
          }
        } else if (entity === 'userSettings' || tx.toString().includes('userSettings')) {
          setUserSettings(tx.attrs || userSettings);
        }
      });
      return Promise.resolve();
    },
    id: () => Date.now().toString() + Math.random().toString(36).substr(2, 9)
  };

  // Expose mockDb globally for child components
  window.__demoDb = mockDb;

  const handleSignOut = () => {
    if (confirm('Exit demo mode?')) {
      window.location.reload();
    }
  };

  const loadSampleData = () => {
    if (confirm('Load sample meals and meal plans? This will replace your current data.')) {
      // Create sample meal plans
      const samplePlans = [
        // Monday
        { id: 'plan-1', userId: 'demo-user', dayOfWeek: 'monday', mealType: 'breakfast', mealId: 'meal-1', weekStartDate: currentWeekStart, createdAt: Date.now() },
        { id: 'plan-2', userId: 'demo-user', dayOfWeek: 'monday', mealType: 'lunch', mealId: 'meal-5', weekStartDate: currentWeekStart, createdAt: Date.now() },
        { id: 'plan-3', userId: 'demo-user', dayOfWeek: 'monday', mealType: 'dinner', mealId: 'meal-9', weekStartDate: currentWeekStart, createdAt: Date.now() },
        { id: 'plan-4', userId: 'demo-user', dayOfWeek: 'monday', mealType: 'snack1', mealId: 'meal-13', weekStartDate: currentWeekStart, createdAt: Date.now() },
        
        // Tuesday
        { id: 'plan-5', userId: 'demo-user', dayOfWeek: 'tuesday', mealType: 'breakfast', mealId: 'meal-2', weekStartDate: currentWeekStart, createdAt: Date.now() },
        { id: 'plan-6', userId: 'demo-user', dayOfWeek: 'tuesday', mealType: 'lunch', mealId: 'meal-6', weekStartDate: currentWeekStart, createdAt: Date.now() },
        { id: 'plan-7', userId: 'demo-user', dayOfWeek: 'tuesday', mealType: 'dinner', mealId: 'meal-10', weekStartDate: currentWeekStart, createdAt: Date.now() },
        { id: 'plan-8', userId: 'demo-user', dayOfWeek: 'tuesday', mealType: 'snack2', mealId: 'meal-14', weekStartDate: currentWeekStart, createdAt: Date.now() },
        
        // Wednesday
        { id: 'plan-9', userId: 'demo-user', dayOfWeek: 'wednesday', mealType: 'breakfast', mealId: 'meal-3', weekStartDate: currentWeekStart, createdAt: Date.now() },
        { id: 'plan-10', userId: 'demo-user', dayOfWeek: 'wednesday', mealType: 'lunch', mealId: 'meal-7', weekStartDate: currentWeekStart, createdAt: Date.now() },
        { id: 'plan-11', userId: 'demo-user', dayOfWeek: 'wednesday', mealType: 'dinner', mealId: 'meal-11', weekStartDate: currentWeekStart, createdAt: Date.now() },
        
        // Thursday
        { id: 'plan-12', userId: 'demo-user', dayOfWeek: 'thursday', mealType: 'breakfast', mealId: 'meal-4', weekStartDate: currentWeekStart, createdAt: Date.now() },
        { id: 'plan-13', userId: 'demo-user', dayOfWeek: 'thursday', mealType: 'lunch', mealId: 'meal-8', weekStartDate: currentWeekStart, createdAt: Date.now() },
        { id: 'plan-14', userId: 'demo-user', dayOfWeek: 'thursday', mealType: 'dinner', mealId: 'meal-12', weekStartDate: currentWeekStart, createdAt: Date.now() },
      ];
      
      setMeals(SAMPLE_MEALS);
      setMealPlans(samplePlans);
      alert('Sample data loaded! 🎉');
    }
  };

  return (
    <div className="app">
      <Header 
        user={demoUser} 
        onSignOut={handleSignOut}
        onOpenMealLibrary={() => setShowMealLibrary(true)}
        onOpenSettings={() => setShowSettings(true)}
      />
      
      <div style={{
        background: '#fff3cd',
        border: '1px solid #ffc107',
        padding: '12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '14px',
        color: '#856404'
      }}>
        <span>🎭 <strong>Demo Mode</strong> - Data is saved locally in your browser</span>
        <button 
          onClick={loadSampleData}
          style={{
            background: '#ffc107',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            color: '#856404'
          }}
        >
          Load Sample Data
        </button>
      </div>

      <main className="main-content">
        <div className="days-container">
          {DAYS_OF_WEEK.map(day => (
            <DayCard
              key={day}
              day={day}
              meals={meals}
              mealPlans={mealPlans.filter(mp => mp.dayOfWeek === day && mp.weekStartDate === currentWeekStart)}
              mealsPerDay={userSettings.mealsPerDay}
              userId={demoUser.id}
              weekStartDate={currentWeekStart}
              dailyGoals={userSettings.dailyGoals}
              demoMode={true}
              onUpdate={(newPlans) => setMealPlans(newPlans)}
            />
          ))}
        </div>
      </main>

      {showMealLibrary && (
        <MealLibrary
          meals={meals}
          userId={demoUser.id}
          onClose={() => setShowMealLibrary(false)}
          demoMode={true}
          onUpdate={(newMeals) => setMeals(newMeals)}
        />
      )}

      {showSettings && (
        <UserSettings
          userSettings={userSettings}
          userId={demoUser.id}
          onClose={() => setShowSettings(false)}
          demoMode={true}
          onUpdate={(newSettings) => setUserSettings(newSettings)}
        />
      )}
    </div>
  );
}

function AppContent() {
  const { isLoading, user, error } = db.useAuth();
  const [showMealLibrary, setShowMealLibrary] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [currentWeekStart, setCurrentWeekStart] = useState(getWeekStartDate());
  const [useDemoMode, setUseDemoMode] = useState(false);

  // Query meals, meal plans, and user settings
  const { data, isLoading: dataLoading } = db.useQuery({
    meals: user ? { $: { where: { userId: user.id } } } : null,
    mealPlans: user ? { 
      $: { 
        where: { 
          userId: user.id,
          weekStartDate: currentWeekStart 
        } 
      } 
    } : null,
    userSettings: user ? { $: { where: { userId: user.id } } } : null
  });

  // Get user settings or use defaults
  const userSettings = data?.userSettings?.[0] || {
    mealsPerDay: DEFAULT_MEALS,
    trackMacros: false
  };

  // Initialize user settings if they don't exist
  useEffect(() => {
    if (user && data && !data.userSettings?.length) {
      db.transact([
        db.tx.userSettings[id()].update({
          userId: user.id,
          mealsPerDay: DEFAULT_MEALS,
          trackMacros: false,
          dailyGoals: {
            calories: 2000,
            protein: 150,
            carbs: 250,
            fats: 65
          }
        })
      ]);
    }
  }, [user, data]);

  if (useDemoMode) {
    return <DemoApp />;
  }

  if (isLoading || dataLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Authentication Error</h2>
        <p>{error.message}</p>
        <button 
          className="auth-button"
          style={{ marginTop: '16px' }}
          onClick={() => setUseDemoMode(true)}
        >
          Try Demo Mode Instead
        </button>
      </div>
    );
  }

  if (!user) {
    const handleGoogleSuccess = async (credentialResponse) => {
      try {
        console.log('Google sign-in successful, signing in to InstantDB...');
        console.log('Credential response:', credentialResponse);
        console.log('Using clientName: google-web');
        
        const result = await db.auth.signInWithIdToken({
          clientName: 'google-web',
          idToken: credentialResponse.credential,
        });
        
        console.log('InstantDB sign-in successful!', result);
      } catch (err) {
        console.error('InstantDB sign-in error (full error):', err);
        console.error('Error body:', err.body);
        console.error('Error message:', err.message);
        console.error('Error stack:', err.stack);
        
        const errorMsg = err.body?.message || err.message || 'Unknown error';
        alert(`Sign-in failed: ${errorMsg}\n\nCheck browser console (F12) for details.\n\nTry demo mode instead!`);
      }
    };

    const handleGoogleError = () => {
      console.error('Google sign-in failed');
      alert('Google sign-in failed. Try demo mode!');
    };

    return (
      <div className="auth-container">
        <div className="auth-card">
          <img src="/plated-logo.svg" alt="Plated" style={{ height: '48px', width: 'auto', marginBottom: '16px' }} />
          <p>Your personal meal planning assistant</p>
          
          <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap={false}
            />
            
            <div style={{ 
              width: '100%', 
              height: '1px', 
              background: '#ddd',
              margin: '8px 0',
              position: 'relative'
            }}>
              <span style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'white',
                padding: '0 12px',
                color: '#999',
                fontSize: '14px'
              }}>or</span>
            </div>

            <button 
              className="auth-button"
              style={{ 
                background: '#6c757d',
                width: '100%'
              }}
              onClick={() => setUseDemoMode(true)}
            >
              🎭 Try Demo Mode
            </button>
          </div>

          <p style={{ fontSize: '12px', color: '#999', marginTop: '16px' }}>
            Demo mode saves data locally in your browser
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Header 
        user={user} 
        onSignOut={() => db.auth.signOut()}
        onOpenMealLibrary={() => setShowMealLibrary(true)}
        onOpenSettings={() => setShowSettings(true)}
      />
      
      <main className="main-content">
        <div className="days-container">
          {DAYS_OF_WEEK.map(day => (
            <DayCard
              key={day}
              day={day}
              meals={data?.meals || []}
              mealPlans={(data?.mealPlans || []).filter(mp => mp.dayOfWeek === day)}
              mealsPerDay={userSettings.mealsPerDay}
              userId={user.id}
              weekStartDate={currentWeekStart}
              dailyGoals={userSettings.dailyGoals}
            />
          ))}
        </div>
      </main>

      {showMealLibrary && (
        <MealLibrary
          meals={data?.meals || []}
          userId={user.id}
          onClose={() => setShowMealLibrary(false)}
        />
      )}

      {showSettings && (
        <UserSettings
          userSettings={data?.userSettings?.[0]}
          userId={user.id}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AppContent />
    </GoogleOAuthProvider>
  );
}

export default App;
