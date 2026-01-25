import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useProfile } from '@/contexts/ProfileContext';
import { useAnalytics } from '@/hooks/useAnalytics';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DietWizardProgress } from '@/components/diet-wizard/DietWizardProgress';
import { StepGoal } from '@/components/diet-wizard/StepGoal';
import { StepCalories } from '@/components/diet-wizard/StepCalories';
import { StepDietType } from '@/components/diet-wizard/StepDietType';
import { StepRestrictions } from '@/components/diet-wizard/StepRestrictions';
import { StepMeals } from '@/components/diet-wizard/StepMeals';
import { StepCuisine } from '@/components/diet-wizard/StepCuisine';
import { StepDietReview } from '@/components/diet-wizard/StepDietReview';
import { MealCard } from '@/components/MealCard';
import { NutritionSummary } from '@/components/NutritionSummary';
import {
  FitnessGoal, DietType, CuisineType, DietPlan, SavedDietPlan, DayPlan,
  GOAL_LABELS, DIET_TYPE_LABELS, CUISINE_LABELS,
} from '@/types/diet';
import { getSuggestedCalories } from '@/utils/tdeeCalculator';
import { Target, Flame, ChevronLeft, ChevronRight, Sparkles, Save, Trash2, RotateCcw, Loader2, UtensilsCrossed, Clock, Globe, ShieldAlert, Pencil, Check } from 'lucide-react';

const wizardSteps = [
  { title: 'Goal', icon: <Target className="w-4 h-4" /> },
  { title: 'Calories', icon: <Flame className="w-4 h-4" /> },
  { title: 'Diet', icon: <UtensilsCrossed className="w-4 h-4" /> },
  { title: 'Restrict', icon: <ShieldAlert className="w-4 h-4" /> },
  { title: 'Meals', icon: <Clock className="w-4 h-4" /> },
  { title: 'Cuisine', icon: <Globe className="w-4 h-4" /> },
  { title: 'Review', icon: <Sparkles className="w-4 h-4" /> },
];

export function DietGenerator() {
  const { profile, bmr, tdee } = useProfile();
  const { trackEvent } = useAnalytics();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [goal, setGoal] = useState<FitnessGoal | ''>('');
  const [calorieTarget, setCalorieTarget] = useState<string>('');
  const [customCalories, setCustomCalories] = useState<string>('');
  const [dietType, setDietType] = useState<DietType | ''>('');
  const [restrictions, setRestrictions] = useState<string[]>([]);
  const [mealsPerDay, setMealsPerDay] = useState<string>('3');
  const [cuisine, setCuisine] = useState<CuisineType>('international');
  
  const [generatedPlan, setGeneratedPlan] = useState<DietPlan | null>(null);
  const [savedPlans, setSavedPlans] = useState<SavedDietPlan[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  // Load saved plans from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('diet-planner-saved-plans');
    if (saved) setSavedPlans(JSON.parse(saved));
  }, []);

  // Save plans to localStorage
  useEffect(() => {
    localStorage.setItem('diet-planner-saved-plans', JSON.stringify(savedPlans));
  }, [savedPlans]);

  // Calculate suggested calories based on goal and TDEE
  const suggestedCalories = tdee && goal ? getSuggestedCalories(tdee, goal) : null;

  // Get effective calorie target
  const getEffectiveCalories = (): number => {
    if (calorieTarget === 'suggested' && suggestedCalories) return suggestedCalories;
    if (calorieTarget === 'custom') return parseInt(customCalories) || 0;
    return parseInt(calorieTarget) || 0;
  };

  const toggleRestriction = (value: string) => {
    setRestrictions(prev => 
      prev.includes(value) ? prev.filter(r => r !== value) : [...prev, value]
    );
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return !!goal;
      case 2: return getEffectiveCalories() >= 1200;
      case 3: return !!dietType;
      case 4: return true;
      case 5: return !!mealsPerDay;
      case 6: return !!cuisine;
      case 7: return true;
      default: return false;
    }
  };

  // Remove a specific food from a meal
  const handleRemoveFood = (dayIndex: number, mealIndex: number, foodIndex: number) => {
    if (!generatedPlan) return;
    
    const updatedPlan = { ...generatedPlan };
    const day = { ...updatedPlan.mealPlan[dayIndex] };
    const meal = { ...day.meals[mealIndex] };
    
    // Get the food being removed for recalculation
    const removedFood = meal.foods[foodIndex];
    meal.foods = meal.foods.filter((_, i) => i !== foodIndex);
    
    // Recalculate day totals
    day.totalCalories -= removedFood.calories;
    day.totalProtein -= removedFood.protein;
    day.totalCarbs -= removedFood.carbs;
    day.totalFat -= removedFood.fat;
    
    day.meals[mealIndex] = meal;
    updatedPlan.mealPlan[dayIndex] = day;
    
    setGeneratedPlan(updatedPlan);
    toast.success(`Removed ${removedFood.name}`);
  };

  // Remove entire meal
  const handleRemoveMeal = (dayIndex: number, mealIndex: number) => {
    if (!generatedPlan) return;
    
    const updatedPlan = { ...generatedPlan };
    const day = { ...updatedPlan.mealPlan[dayIndex] };
    const removedMeal = day.meals[mealIndex];
    
    // Subtract meal totals from day
    const mealCals = removedMeal.foods.reduce((s, f) => s + f.calories, 0);
    const mealProtein = removedMeal.foods.reduce((s, f) => s + f.protein, 0);
    const mealCarbs = removedMeal.foods.reduce((s, f) => s + f.carbs, 0);
    const mealFat = removedMeal.foods.reduce((s, f) => s + f.fat, 0);
    
    day.totalCalories -= mealCals;
    day.totalProtein -= mealProtein;
    day.totalCarbs -= mealCarbs;
    day.totalFat -= mealFat;
    
    day.meals = day.meals.filter((_, i) => i !== mealIndex);
    updatedPlan.mealPlan[dayIndex] = day;
    
    setGeneratedPlan(updatedPlan);
    toast.success(`Removed ${removedMeal.name}`);
  };

  const generateDietPlan = async () => {
    setIsGenerating(true);
    try {
      const effectiveCalories = getEffectiveCalories();
      
      const { data, error } = await supabase.functions.invoke('generate-diet', {
        body: { 
          goal, 
          calorieTarget: effectiveCalories, 
          dietType, 
          restrictions, 
          mealsPerDay: parseInt(mealsPerDay), 
          cuisine, 
          gender: profile.gender,
          profile,
        },
      });
      
      if (error) throw error;
      
      setGeneratedPlan({
        goal: goal as FitnessGoal,
        calorieTarget: effectiveCalories,
        dietType: dietType as DietType,
        restrictions,
        mealsPerDay: parseInt(mealsPerDay),
        cuisine,
        profile,
        gender: profile.gender,
        mealPlan: data.mealPlan,
      });
      
      trackEvent('diet_generated', { dietType, cuisine, mealsPerDay });
      toast.success('Diet plan generated!');
    } catch (err: any) {
      console.error('Generation error:', err);
      toast.error(err.message || 'Failed to generate diet plan');
    } finally {
      setIsGenerating(false);
    }
  };

  const savePlan = () => {
    if (!generatedPlan) return;
    const newPlan: SavedDietPlan = {
      ...generatedPlan,
      id: crypto.randomUUID(),
      name: `${profile.name ? profile.name + "'s " : ''}${GOAL_LABELS[generatedPlan.goal]} Diet`,
      savedAt: new Date().toISOString(),
    };
    setSavedPlans(prev => [newPlan, ...prev]);
    toast.success('Diet plan saved!');
  };

  const deletePlan = (id: string) => {
    setSavedPlans(prev => prev.filter(p => p.id !== id));
    toast.success('Plan deleted');
  };

  const loadPlan = (plan: SavedDietPlan) => {
    setGeneratedPlan(plan);
    toast.success('Plan loaded');
  };

  const startNewPlan = () => {
    setGeneratedPlan(null);
    setCurrentStep(1);
    setGoal('');
    setCalorieTarget('');
    setCustomCalories('');
    setDietType('');
    setRestrictions([]);
    setMealsPerDay('3');
    setCuisine('international');
    setSelectedDayIndex(0);
    setIsEditing(false);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <StepGoal goal={goal} setGoal={setGoal} />;
      case 2: return <StepCalories calorieTarget={calorieTarget} setCalorieTarget={setCalorieTarget} customCalories={customCalories} setCustomCalories={setCustomCalories} goal={goal} suggestedCalories={suggestedCalories} bmr={bmr} tdee={tdee} />;
      case 3: return <StepDietType dietType={dietType} setDietType={setDietType} />;
      case 4: return <StepRestrictions restrictions={restrictions} toggleRestriction={toggleRestriction} />;
      case 5: return <StepMeals mealsPerDay={mealsPerDay} setMealsPerDay={setMealsPerDay} />;
      case 6: return <StepCuisine cuisine={cuisine} setCuisine={setCuisine} />;
      case 7: return <StepDietReview goal={goal} calorieTarget={getEffectiveCalories()} dietType={dietType} restrictions={restrictions} mealsPerDay={mealsPerDay} cuisine={cuisine} profile={profile} bmr={bmr} tdee={tdee} />;
      default: return null;
    }
  };

  // Render generated plan
  if (generatedPlan) {
    const selectedDay = generatedPlan.mealPlan[selectedDayIndex];
    const calorieDeficit = generatedPlan.calorieTarget - (selectedDay?.totalCalories || 0);
    
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h3 className="text-lg sm:text-xl font-bold">Your 7-Day Diet Plan</h3>
          <div className="flex gap-2">
            <Button 
              variant={isEditing ? "default" : "outline"} 
              size="sm" 
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? (
                <>
                  <Check className="w-4 h-4 sm:mr-1" />
                  <span className="hidden sm:inline">Done</span>
                </>
              ) : (
                <>
                  <Pencil className="w-4 h-4 sm:mr-1" />
                  <span className="hidden sm:inline">Edit</span>
                </>
              )}
            </Button>
            <Button variant="outline" size="sm" onClick={startNewPlan}>
              <RotateCcw className="w-4 h-4 sm:mr-1" />
              <span className="hidden sm:inline">New Plan</span>
            </Button>
            <Button variant="outline" size="sm" onClick={savePlan}>
              <Save className="w-4 h-4 sm:mr-1" />
              <span className="hidden sm:inline">Save</span>
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 sm:gap-2 text-xs sm:text-sm">
          <Badge>{GOAL_LABELS[generatedPlan.goal]}</Badge>
          <Badge variant="secondary">{generatedPlan.calorieTarget} kcal</Badge>
          <Badge variant="secondary">{DIET_TYPE_LABELS[generatedPlan.dietType]}</Badge>
          <Badge variant="secondary">{CUISINE_LABELS[generatedPlan.cuisine]}</Badge>
        </div>

        {isEditing && calorieDeficit !== 0 && (
          <div className={`p-3 rounded-lg text-sm ${calorieDeficit > 0 ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400' : 'bg-red-500/10 text-red-600 dark:text-red-400'}`}>
            {calorieDeficit > 0 
              ? `⚠️ Day ${selectedDayIndex + 1} is ${calorieDeficit} calories under target`
              : `⚠️ Day ${selectedDayIndex + 1} is ${Math.abs(calorieDeficit)} calories over target`
            }
          </div>
        )}

        {/* Day Selector */}
        <Tabs value={selectedDayIndex.toString()} onValueChange={(v) => setSelectedDayIndex(parseInt(v))}>
          <TabsList className="w-full justify-start overflow-x-auto">
            {generatedPlan.mealPlan.map((day, idx) => (
              <TabsTrigger key={idx} value={idx.toString()} className="text-xs sm:text-sm">
                Day {idx + 1}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {selectedDay && (
          <div className="space-y-4">
            <NutritionSummary 
              calories={selectedDay.totalCalories}
              targetCalories={generatedPlan.calorieTarget}
              protein={selectedDay.totalProtein}
              carbs={selectedDay.totalCarbs}
              fat={selectedDay.totalFat}
            />
            
            <div className="space-y-3">
              {selectedDay.meals.map((meal, mealIdx) => (
                <MealCard 
                  key={mealIdx} 
                  meal={meal} 
                  isEditing={isEditing}
                  onRemoveFood={(foodIdx) => handleRemoveFood(selectedDayIndex, mealIdx, foodIdx)}
                  onRemoveMeal={() => handleRemoveMeal(selectedDayIndex, mealIdx)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Render wizard
  return (
    <div className="space-y-4 sm:space-y-6">
      {savedPlans.length > 0 && (
        <Card>
          <CardHeader className="py-3 px-3 sm:px-6">
            <CardTitle className="text-base sm:text-lg">Saved Diet Plans</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 px-3 sm:px-6">
            {savedPlans.slice(0, 3).map(plan => (
              <div key={plan.id} className="flex items-center justify-between p-2 bg-muted/50 rounded gap-2">
                <button onClick={() => loadPlan(plan)} className="text-left flex-1 min-w-0">
                  <p className="font-medium text-xs sm:text-sm truncate">{plan.name}</p>
                  <p className="text-xs text-muted-foreground">{new Date(plan.savedAt).toLocaleDateString()}</p>
                </button>
                <Button variant="ghost" size="icon" onClick={() => deletePlan(plan.id)} className="shrink-0">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <DietWizardProgress currentStep={currentStep} totalSteps={wizardSteps.length} steps={wizardSteps} />

      <Card>
        <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">{renderStep()}</CardContent>
      </Card>

      <div className="flex justify-between gap-2">
        <Button variant="outline" onClick={() => setCurrentStep(s => s - 1)} disabled={currentStep === 1} className="flex-1 sm:flex-none">
          <ChevronLeft className="w-4 h-4 sm:mr-1" />
          <span className="hidden sm:inline">Back</span>
        </Button>
        {currentStep < 7 ? (
          <Button onClick={() => setCurrentStep(s => s + 1)} disabled={!canProceed()} className="flex-1 sm:flex-none">
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4 sm:ml-1" />
          </Button>
        ) : (
          <Button onClick={generateDietPlan} disabled={isGenerating} className="flex-1 sm:flex-none">
            {isGenerating ? <><Loader2 className="w-4 h-4 mr-1 sm:mr-2 animate-spin" /> <span className="hidden sm:inline">Generating...</span></> : <><Sparkles className="w-4 h-4 mr-1 sm:mr-2" /> <span className="hidden sm:inline">Generate Plan</span></>}
          </Button>
        )}
      </div>
    </div>
  );
}
