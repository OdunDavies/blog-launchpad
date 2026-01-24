import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Download, Salad, Sparkles, Save, History, Trash2, Pencil, Check, X, ChevronLeft, ChevronRight, Flame, AlertCircle, UtensilsCrossed, Target, Globe, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useProfile } from '@/hooks/useProfile';
import { DietWizardProgress } from './diet-wizard/DietWizardProgress';
import { StepGoal } from './diet-wizard/StepGoal';
import { StepCalories } from './diet-wizard/StepCalories';
import { StepDietType } from './diet-wizard/StepDietType';
import { StepRestrictions } from './diet-wizard/StepRestrictions';
import { StepMeals } from './diet-wizard/StepMeals';
import { StepCuisine } from './diet-wizard/StepCuisine';
import { StepDietReview } from './diet-wizard/StepDietReview';
import { MealCard } from './MealCard';
import { NutritionSummary } from './NutritionSummary';
import { generateDietPdf } from '@/utils/downloadDietPdf';
import { calculateTDEEWithRecommendations, TDEEResult } from '@/utils/tdeeCalculator';
import { DietPlan, DayPlan, SavedDietPlan, FitnessGoal, UserProfile, CuisineType } from '@/types/diet';

const STORAGE_KEY = 'diet-planner-saved-plans';
const TOTAL_STEPS = 7;

const wizardSteps = [
  { title: 'Goal', icon: <Target className="w-5 h-5" /> },
  { title: 'Calories', icon: <Flame className="w-5 h-5" /> },
  { title: 'Diet Type', icon: <Salad className="w-5 h-5" /> },
  { title: 'Restrictions', icon: <AlertCircle className="w-5 h-5" /> },
  { title: 'Meals', icon: <UtensilsCrossed className="w-5 h-5" /> },
  { title: 'Cuisine', icon: <Globe className="w-5 h-5" /> },
  { title: 'Review', icon: <Sparkles className="w-5 h-5" /> },
];

const dietTypeLabels: Record<string, string> = {
  balanced: 'Balanced',
  'high-protein': 'High Protein',
  'low-carb': 'Low Carb',
  mediterranean: 'Mediterranean',
  vegetarian: 'Vegetarian',
  vegan: 'Vegan',
};

const goalLabels: Record<FitnessGoal, string> = {
  'muscle-gain': 'Muscle Gain',
  'fat-loss': 'Fat Loss',
  'maintenance': 'Maintenance',
  'recomposition': 'Body Recomposition',
};

const cuisineLabels: Record<CuisineType, string> = {
  'international': 'International',
  'nigerian': 'Nigerian',
  'west-african': 'West African',
};

const defaultProfile: UserProfile = {
  gender: 'male',
  weight: 70,
  weightUnit: 'kg',
  height: 175,
  heightUnit: 'cm',
  age: 25,
  activityLevel: 'moderate',
  trainingDays: 3,
};

export function DietGenerator() {
  // Get profile from context
  const { profile: savedProfile, isProfileComplete } = useProfile();
  // Use saved profile if complete, otherwise fallback to defaults
  const profile = isProfileComplete ? savedProfile : defaultProfile;
  const [currentStep, setCurrentStep] = useState(1);
  const [goal, setGoal] = useState<FitnessGoal | ''>('');
  const [calorieTarget, setCalorieTarget] = useState<string>('');
  const [customCalories, setCustomCalories] = useState<string>('');
  const [dietType, setDietType] = useState<string>('balanced');
  const [restrictions, setRestrictions] = useState<string[]>([]);
  const [mealsPerDay, setMealsPerDay] = useState<string>('3');
  const [cuisine, setCuisine] = useState<CuisineType>('international');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<DietPlan | null>(null);
  const [savedPlans, setSavedPlans] = useState<SavedDietPlan[]>([]);
  const [showSavedPlans, setShowSavedPlans] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  // Calculate TDEE when profile or goal changes
  const tdeeResult = useMemo<TDEEResult | null>(() => {
    if (!goal || !profile.weight || !profile.height || !profile.age) {
      return null;
    }
    return calculateTDEEWithRecommendations(profile, goal as FitnessGoal);
  }, [profile, goal]);

  // Auto-set suggested calories when TDEE is calculated
  useEffect(() => {
    if (tdeeResult && !calorieTarget) {
      setCalorieTarget('suggested');
    }
  }, [tdeeResult]);

  // Load saved plans from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setSavedPlans(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse saved diet plans:', e);
      }
    }
  }, []);

  // Save plans to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedPlans));
  }, [savedPlans]);

  const toggleRestriction = (restriction: string) => {
    setRestrictions((prev) =>
      prev.includes(restriction) 
        ? prev.filter((r) => r !== restriction) 
        : [...prev, restriction]
    );
  };

  const getEffectiveCalories = (): number => {
    if (calorieTarget === 'suggested' && tdeeResult) {
      return tdeeResult.suggestedCalories;
    }
    if (calorieTarget === 'custom') {
      return parseInt(customCalories) || 2000;
    }
    return parseInt(calorieTarget) || 2000;
  };

  const savePlan = () => {
    if (!generatedPlan) return;

    const calories = getEffectiveCalories();
    const goalLabel = goal ? goalLabels[goal as FitnessGoal] : '';
    const cuisineLabel = cuisineLabels[cuisine];
    const newPlan: SavedDietPlan = {
      ...generatedPlan,
      id: crypto.randomUUID(),
      name: `${goalLabel} - ${calories} kcal ${dietTypeLabels[dietType]} (${cuisineLabel})`,
      savedAt: new Date().toISOString(),
    };

    setSavedPlans((prev) => [newPlan, ...prev]);
    toast({
      title: "Plan Saved!",
      description: "Your diet plan has been saved locally.",
    });
  };

  const loadPlan = (plan: SavedDietPlan) => {
    setGeneratedPlan(plan);
    setShowSavedPlans(false);
    setSelectedDayIndex(0);
    toast({
      title: "Plan Loaded",
      description: `Loaded "${plan.name}"`,
    });
  };

  const deletePlan = (id: string) => {
    setSavedPlans((prev) => prev.filter((p) => p.id !== id));
    toast({
      title: "Plan Deleted",
      description: "The diet plan has been removed.",
    });
  };

  const startEditing = (plan: SavedDietPlan) => {
    setEditingPlanId(plan.id);
    setEditingName(plan.name);
  };

  const cancelEditing = () => {
    setEditingPlanId(null);
    setEditingName('');
  };

  const saveRename = (id: string) => {
    if (!editingName.trim()) {
      cancelEditing();
      return;
    }
    setSavedPlans((prev) =>
      prev.map((p) => (p.id === id ? { ...p, name: editingName.trim() } : p))
    );
    setEditingPlanId(null);
    setEditingName('');
    toast({
      title: "Plan Renamed",
      description: "Your diet plan has been renamed.",
    });
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: // Goal
        return !!goal;
      case 2: // Calories
        if (calorieTarget === 'custom') {
          const cal = parseInt(customCalories);
          return !isNaN(cal) && cal >= 1000 && cal <= 5000;
        }
        return !!calorieTarget;
      case 3: // Diet Type
        return !!dietType;
      case 4: // Restrictions
        return true;
      case 5: // Meals
        return !!mealsPerDay;
      case 6: // Cuisine
        return !!cuisine;
      case 7: // Review
        return true;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (currentStep < TOTAL_STEPS && canProceed()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const generateDietPlan = async () => {
    setIsGenerating(true);
    
    const targetCalories = getEffectiveCalories();

    try {
      const { data, error } = await supabase.functions.invoke('generate-diet', {
        body: {
          calorieTarget: targetCalories,
          dietType,
          restrictions,
          mealsPerDay: parseInt(mealsPerDay),
          goal,
          profile,
          cuisine,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setGeneratedPlan({
        calorieTarget: targetCalories,
        dietType,
        restrictions,
        mealsPerDay: parseInt(mealsPerDay),
        goal: goal || '',
        profile,
        gender: profile.gender,
        cuisine,
        mealPlan: data.mealPlan,
      });

      setSelectedDayIndex(0);

      toast({
        title: "Diet Plan Generated!",
        description: "Your personalized 7-day meal plan is ready.",
      });

    } catch (error) {
      console.error("Error generating diet plan:", error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate diet plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadPlan = async () => {
    if (!generatedPlan || isDownloading) return;
    
    setIsDownloading(true);
    const goalLabel = goal ? goalLabels[goal as FitnessGoal] : '';
    const planName = `${goalLabel} - ${generatedPlan.calorieTarget} kcal ${dietTypeLabels[generatedPlan.dietType]} Diet Plan`;
    
    try {
      await generateDietPdf({
        name: planName,
        calorieTarget: generatedPlan.calorieTarget,
        dietType: generatedPlan.dietType,
        mealsPerDay: generatedPlan.mealsPerDay,
        restrictions: generatedPlan.restrictions,
        mealPlan: generatedPlan.mealPlan,
        goal: generatedPlan.goal,
        profile: generatedPlan.profile,
        cuisine: generatedPlan.cuisine,
      });
      
      toast({
        title: "PDF Downloaded",
        description: "Your diet plan has been saved as a PDF.",
      });
    } catch (error) {
      console.error('PDF generation failed:', error);
      toast({
        title: "Download Failed",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const startNewPlan = () => {
    setGeneratedPlan(null);
    setCurrentStep(1);
    setSelectedDayIndex(0);
    setGoal('');
    setCalorieTarget('');
    setCustomCalories('');
    setCuisine('international');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepGoal goal={goal} setGoal={setGoal} />;
      case 2:
        return (
          <StepCalories 
            calorieTarget={calorieTarget} 
            setCalorieTarget={setCalorieTarget}
            customCalories={customCalories}
            setCustomCalories={setCustomCalories}
            tdeeResult={tdeeResult}
            goal={goal as FitnessGoal}
          />
        );
      case 3:
        return <StepDietType dietType={dietType} setDietType={setDietType} />;
      case 4:
        return <StepRestrictions restrictions={restrictions} toggleRestriction={toggleRestriction} />;
      case 5:
        return <StepMeals mealsPerDay={mealsPerDay} setMealsPerDay={setMealsPerDay} />;
      case 6:
        return <StepCuisine cuisine={cuisine} setCuisine={setCuisine} />;
      case 7:
        return (
          <StepDietReview 
            calorieTarget={calorieTarget}
            customCalories={customCalories}
            dietType={dietType}
            restrictions={restrictions}
            mealsPerDay={mealsPerDay}
            goal={goal as FitnessGoal}
            profile={profile}
            tdeeResult={tdeeResult}
            cuisine={cuisine}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Saved Plans Toggle */}
      {savedPlans.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <History className="w-4 h-4" />
                Saved Plans ({savedPlans.length})
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSavedPlans(!showSavedPlans)}
              >
                {showSavedPlans ? 'Hide' : 'Show'}
              </Button>
            </div>
          </CardHeader>
          {showSavedPlans && (
            <CardContent className="pt-0">
              <div className="space-y-2">
                {savedPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    {editingPlanId === plan.id ? (
                      <div className="flex-1 flex items-center gap-2 mr-2">
                        <Input
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="h-8 text-sm"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveRename(plan.id);
                            if (e.key === 'Escape') cancelEditing();
                          }}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-primary"
                          onClick={() => saveRename(plan.id)}
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={cancelEditing}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="flex-1 cursor-pointer" onClick={() => loadPlan(plan)}>
                          <p className="font-medium text-sm">{plan.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Saved {new Date(plan.savedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-primary"
                          onClick={() => startEditing(plan)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => deletePlan(plan.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {!generatedPlan ? (
        /* Wizard */
        <Card className="overflow-hidden">
          <CardHeader className="border-b bg-muted/30">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary text-primary-foreground">
                <Salad className="w-5 h-5" />
              </div>
              <div>
                <CardTitle>AI Diet Plan Generator</CardTitle>
                <CardDescription>
                  Create your personalized 7-day meal plan for body growth
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            {/* Profile Warning */}
            {!isProfileComplete && (
              <Alert className="mb-6">
                <User className="h-4 w-4" />
                <AlertDescription>
                  Set up your profile in the header for personalized calorie recommendations based on your body metrics.
                </AlertDescription>
              </Alert>
            )}

            {/* Progress */}
            <div className="mb-8">
              <DietWizardProgress 
                currentStep={currentStep} 
                totalSteps={TOTAL_STEPS} 
                steps={wizardSteps}
              />
            </div>

            {/* Step Content */}
            <div className="min-h-[300px]">
              {renderStep()}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-6 border-t mt-6">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </Button>

              {currentStep < TOTAL_STEPS ? (
                <Button
                  onClick={nextStep}
                  disabled={!canProceed()}
                  className="gap-2"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={generateDietPlan}
                  disabled={isGenerating || !canProceed()}
                  className="gap-2"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Generate Plan
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Generated Plan Display */
        <div className="space-y-6">
          {/* Header */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary text-primary-foreground">
                    <Salad className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Your 7-Day Meal Plan</h2>
                    <p className="text-sm text-muted-foreground">
                      {goal && goalLabels[goal as FitnessGoal]} • {generatedPlan.calorieTarget} kcal • {dietTypeLabels[generatedPlan.dietType]} • {generatedPlan.mealsPerDay} meals/day
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={savePlan} className="gap-2">
                    <Save className="w-4 h-4" />
                    Save
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={downloadPlan}
                    disabled={isDownloading}
                    className="gap-2"
                  >
                    {isDownloading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                    PDF
                  </Button>
                  <Button variant="outline" size="sm" onClick={startNewPlan}>
                    New Plan
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Day Selector */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {generatedPlan.mealPlan.map((day, index) => (
              <Button
                key={index}
                variant={selectedDayIndex === index ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedDayIndex(index)}
                className="flex-shrink-0"
              >
                {day.day}
              </Button>
            ))}
          </div>

          {/* Selected Day Content */}
          {generatedPlan.mealPlan[selectedDayIndex] && (
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Meals */}
              <div className="lg:col-span-2 space-y-4">
                {generatedPlan.mealPlan[selectedDayIndex].meals.map((meal, mealIndex) => (
                  <MealCard 
                    key={mealIndex} 
                    meal={meal} 
                    isEditing={false}
                  />
                ))}
              </div>

              {/* Nutrition Summary */}
              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  <NutritionSummary
                    totalCalories={generatedPlan.mealPlan[selectedDayIndex].totalCalories}
                    totalProtein={generatedPlan.mealPlan[selectedDayIndex].totalProtein}
                    totalCarbs={generatedPlan.mealPlan[selectedDayIndex].totalCarbs}
                    totalFat={generatedPlan.mealPlan[selectedDayIndex].totalFat}
                    targetCalories={generatedPlan.calorieTarget}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
