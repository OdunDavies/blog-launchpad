import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useProfile } from '@/contexts/ProfileContext';
import { useAnalytics } from '@/hooks/useAnalytics';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WizardProgress } from '@/components/workout-wizard/WizardProgress';
import { StepGoal } from '@/components/diet-wizard/StepGoal';
import { StepCalories } from '@/components/diet-wizard/StepCalories';
import { StepDietType } from '@/components/diet-wizard/StepDietType';
import { StepRestrictions } from '@/components/diet-wizard/StepRestrictions';
import { StepMeals } from '@/components/diet-wizard/StepMeals';
import { StepCuisine } from '@/components/diet-wizard/StepCuisine';
import { StepReview } from '@/components/diet-wizard/StepReview';
import {
  DietGoal, DietType, CuisinePreference, DietaryRestriction, MealType,
  GeneratedDietPlan, SavedDietPlan, DietDay,
  GOAL_LABELS, DIET_TYPE_LABELS, CUISINE_LABELS, MEAL_TYPE_LABELS,
} from '@/types/diet';
import { Target, Flame, ChevronLeft, ChevronRight, Sparkles, Save, Trash2, RotateCcw, Download, Loader2, UtensilsCrossed } from 'lucide-react';

const wizardSteps = [
  { title: 'Goal', icon: Target },
  { title: 'Calories', icon: Flame },
  { title: 'Diet Type', icon: UtensilsCrossed },
  { title: 'Restrictions', icon: UtensilsCrossed },
  { title: 'Meals', icon: UtensilsCrossed },
  { title: 'Cuisine', icon: UtensilsCrossed },
  { title: 'Review', icon: Sparkles },
];

export function DietGenerator() {
  const { profile, tdee } = useProfile();
  const { trackEvent } = useAnalytics();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [goal, setGoal] = useState<DietGoal | ''>('');
  const [dailyCalories, setDailyCalories] = useState(0);
  const [dietType, setDietType] = useState<DietType | ''>('');
  const [restrictions, setRestrictions] = useState<DietaryRestriction[]>([]);
  const [mealTypes, setMealTypes] = useState<MealType[]>(['breakfast', 'lunch', 'dinner']);
  const [cuisine, setCuisine] = useState<CuisinePreference | ''>('');
  
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedDietPlan | null>(null);
  const [savedPlans, setSavedPlans] = useState<SavedDietPlan[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Load saved plans from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('diet-planner-saved-plans');
    if (saved) setSavedPlans(JSON.parse(saved));
  }, []);

  // Save plans to localStorage
  useEffect(() => {
    localStorage.setItem('diet-planner-saved-plans', JSON.stringify(savedPlans));
  }, [savedPlans]);

  // Auto-set calories from TDEE when goal changes
  useEffect(() => {
    if (tdee && goal && !dailyCalories) {
      const modifiers: Record<DietGoal, number> = {
        muscle_building: 1.1,
        fat_loss: 0.8,
        maintenance: 1,
        endurance: 1.15,
      };
      setDailyCalories(Math.round(tdee * modifiers[goal]));
    }
  }, [goal, tdee, dailyCalories]);

  const canProceed = () => {
    switch (currentStep) {
      case 0: return !!goal;
      case 1: return dailyCalories >= 1200;
      case 2: return !!dietType;
      case 3: return true; // restrictions optional
      case 4: return mealTypes.length >= 2;
      case 5: return !!cuisine;
      case 6: return true;
      default: return false;
    }
  };

  const generateDietPlan = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-diet', {
        body: { goal, dailyCalories, dietType, restrictions, mealTypes, cuisine, gender: profile.gender },
      });
      
      if (error) throw error;
      
      setGeneratedPlan({
        goal: goal as DietGoal,
        dailyCalories,
        dietType: dietType as DietType,
        restrictions,
        mealTypes,
        cuisine: cuisine as CuisinePreference,
        schedule: data.schedule,
      });
      
      trackEvent('diet_generated', { dietType, cuisine, mealCount: mealTypes.length });
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
    setCurrentStep(0);
    setGoal('');
    setDailyCalories(0);
    setDietType('');
    setRestrictions([]);
    setMealTypes(['breakfast', 'lunch', 'dinner']);
    setCuisine('');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0: return <StepGoal goal={goal} setGoal={setGoal} />;
      case 1: return <StepCalories dailyCalories={dailyCalories} setDailyCalories={setDailyCalories} goal={goal} />;
      case 2: return <StepDietType dietType={dietType} setDietType={setDietType} />;
      case 3: return <StepRestrictions restrictions={restrictions} setRestrictions={setRestrictions} />;
      case 4: return <StepMeals mealTypes={mealTypes} setMealTypes={setMealTypes} />;
      case 5: return <StepCuisine cuisine={cuisine} setCuisine={setCuisine} />;
      case 6: return <StepReview goal={goal} dailyCalories={dailyCalories} dietType={dietType} restrictions={restrictions} mealTypes={mealTypes} cuisine={cuisine} />;
      default: return null;
    }
  };

  if (generatedPlan) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold">Your 7-Day Diet Plan</h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={startNewPlan}>
              <RotateCcw className="w-4 h-4 mr-1" /> New Plan
            </Button>
            <Button variant="outline" size="sm" onClick={savePlan}>
              <Save className="w-4 h-4 mr-1" /> Save
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 text-sm">
          <Badge>{GOAL_LABELS[generatedPlan.goal]}</Badge>
          <Badge variant="secondary">{generatedPlan.dailyCalories} kcal/day</Badge>
          <Badge variant="secondary">{DIET_TYPE_LABELS[generatedPlan.dietType]}</Badge>
          <Badge variant="secondary">{CUISINE_LABELS[generatedPlan.cuisine]}</Badge>
        </div>

        <div className="space-y-4">
          {generatedPlan.schedule.map((day: DietDay, idx: number) => (
            <Card key={idx}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex justify-between">
                  <span>{day.day}</span>
                  <span className="text-sm font-normal text-muted-foreground">{day.totalCalories} kcal</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {day.meals.map((meal, mIdx) => (
                  <div key={mIdx} className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-medium">{MEAL_TYPE_LABELS[meal.mealType as MealType] || meal.mealType}</span>
                      <span className="text-xs text-muted-foreground">{meal.calories} kcal</span>
                    </div>
                    <p className="text-sm font-medium text-primary">{meal.name}</p>
                    <p className="text-xs text-muted-foreground">{meal.foods.join(', ')}</p>
                    <div className="flex gap-3 mt-1 text-xs">
                      <span>P: {meal.protein}g</span>
                      <span>C: {meal.carbs}g</span>
                      <span>F: {meal.fats}g</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {savedPlans.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-lg">Saved Diet Plans</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {savedPlans.slice(0, 3).map(plan => (
              <div key={plan.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                <button onClick={() => loadPlan(plan)} className="text-left flex-1">
                  <p className="font-medium text-sm">{plan.name}</p>
                  <p className="text-xs text-muted-foreground">{new Date(plan.savedAt).toLocaleDateString()}</p>
                </button>
                <Button variant="ghost" size="icon" onClick={() => deletePlan(plan.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <WizardProgress currentStep={currentStep} totalSteps={wizardSteps.length} steps={wizardSteps} />

      <Card>
        <CardContent className="pt-6">{renderStep()}</CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setCurrentStep(s => s - 1)} disabled={currentStep === 0}>
          <ChevronLeft className="w-4 h-4 mr-1" /> Back
        </Button>
        {currentStep < 6 ? (
          <Button onClick={() => setCurrentStep(s => s + 1)} disabled={!canProceed()}>
            Next <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        ) : (
          <Button onClick={generateDietPlan} disabled={isGenerating}>
            {isGenerating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating...</> : <><Sparkles className="w-4 h-4 mr-2" /> Generate Plan</>}
          </Button>
        )}
      </div>
    </div>
  );
}
