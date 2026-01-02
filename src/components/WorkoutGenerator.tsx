import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MuscleGroup } from '@/data/exercises';
import { Loader2, Download, Dumbbell, Calendar, Sparkles, Save, History, Trash2, Pencil, Check, X, ChevronLeft, ChevronRight, User, Target, Zap, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { WizardProgress } from './workout-wizard/WizardProgress';
import { StepSchedule } from './workout-wizard/StepSchedule';
import { StepProfile } from './workout-wizard/StepProfile';
import { StepGoal } from './workout-wizard/StepGoal';
import { StepMuscles } from './workout-wizard/StepMuscles';
import { StepReview } from './workout-wizard/StepReview';
import { ExercisePickerModal } from './ExercisePickerModal';
import { generateWorkoutHtml, downloadHtmlFile } from '@/utils/downloadHtml';

interface WorkoutExercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
}

interface WorkoutDay {
  day: string;
  focus: string;
  exercises: WorkoutExercise[];
}

interface GeneratedPlan {
  splitDays: number;
  goal: string;
  gender: string;
  targetMuscles: string[];
  schedule: WorkoutDay[];
}

interface SavedPlan extends GeneratedPlan {
  id: string;
  name: string;
  savedAt: string;
}

const STORAGE_KEY = 'workout-planner-saved-plans';
const TOTAL_STEPS = 5;

const wizardSteps = [
  { title: 'Schedule', icon: <Calendar className="w-5 h-5" /> },
  { title: 'Profile', icon: <User className="w-5 h-5" /> },
  { title: 'Goal', icon: <Target className="w-5 h-5" /> },
  { title: 'Muscles', icon: <Zap className="w-5 h-5" /> },
  { title: 'Review', icon: <Sparkles className="w-5 h-5" /> },
];

export function WorkoutGenerator() {
  const [currentStep, setCurrentStep] = useState(1);
  const [splitDays, setSplitDays] = useState<string>('4');
  const [gender, setGender] = useState<string>('');
  const [goal, setGoal] = useState<string>('strength');
  const [targetMuscles, setTargetMuscles] = useState<MuscleGroup[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedPlan | null>(null);
  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>([]);
  const [showSavedPlans, setShowSavedPlans] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [editingDayIndex, setEditingDayIndex] = useState<number | null>(null);
  const [exercisePickerOpen, setExercisePickerOpen] = useState(false);
  const [addingToDayIndex, setAddingToDayIndex] = useState<number | null>(null);
  const { toast } = useToast();

  // Load saved plans from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setSavedPlans(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse saved plans:', e);
      }
    }
  }, []);

  // Save plans to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedPlans));
  }, [savedPlans]);

  const savePlan = () => {
    if (!generatedPlan) return;

    const newPlan: SavedPlan = {
      ...generatedPlan,
      id: crypto.randomUUID(),
      name: `${generatedPlan.splitDays}-Day ${generatedPlan.goal} Plan`,
      savedAt: new Date().toISOString(),
    };

    setSavedPlans((prev) => [newPlan, ...prev]);
    toast({
      title: "Plan Saved!",
      description: "Your workout plan has been saved locally.",
    });
  };

  const loadPlan = (plan: SavedPlan) => {
    setGeneratedPlan(plan);
    setShowSavedPlans(false);
    toast({
      title: "Plan Loaded",
      description: `Loaded "${plan.name}"`,
    });
  };

  const deletePlan = (id: string) => {
    setSavedPlans((prev) => prev.filter((p) => p.id !== id));
    toast({
      title: "Plan Deleted",
      description: "The workout plan has been removed.",
    });
  };

  const startEditing = (plan: SavedPlan) => {
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
      description: "Your workout plan has been renamed.",
    });
  };

  const toggleMuscle = (muscle: MuscleGroup) => {
    setTargetMuscles((prev) =>
      prev.includes(muscle) ? prev.filter((m) => m !== muscle) : [...prev, muscle]
    );
  };

  // Workout editing functions
  const startEditingDay = (dayIndex: number) => {
    setEditingDayIndex(dayIndex);
  };

  const stopEditingDay = () => {
    setEditingDayIndex(null);
  };

  const removeExerciseFromDay = (dayIndex: number, exerciseIndex: number) => {
    if (!generatedPlan) return;
    
    const newSchedule = [...generatedPlan.schedule];
    newSchedule[dayIndex] = {
      ...newSchedule[dayIndex],
      exercises: newSchedule[dayIndex].exercises.filter((_, i) => i !== exerciseIndex),
    };
    
    setGeneratedPlan({ ...generatedPlan, schedule: newSchedule });
    toast({
      title: "Exercise Removed",
      description: "The exercise has been removed from your workout.",
    });
  };

  const openExercisePicker = (dayIndex: number) => {
    setAddingToDayIndex(dayIndex);
    setExercisePickerOpen(true);
  };

  const addExerciseToDay = (exercise: WorkoutExercise) => {
    if (!generatedPlan || addingToDayIndex === null) return;
    
    const newSchedule = [...generatedPlan.schedule];
    newSchedule[addingToDayIndex] = {
      ...newSchedule[addingToDayIndex],
      exercises: [...newSchedule[addingToDayIndex].exercises, exercise],
    };
    
    setGeneratedPlan({ ...generatedPlan, schedule: newSchedule });
    setAddingToDayIndex(null);
    toast({
      title: "Exercise Added",
      description: `${exercise.name} has been added to your workout.`,
    });
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return !!splitDays;
      case 2:
        return !!gender;
      case 3:
        return !!goal;
      case 4:
        return true;
      case 5:
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

  const generateWorkoutPlan = async () => {
    if (!gender) {
      toast({
        title: "Gender Required",
        description: "Please select your gender to generate a personalized plan.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-workout', {
        body: {
          splitDays: parseInt(splitDays),
          gender,
          goal,
          targetMuscles,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setGeneratedPlan({
        splitDays: parseInt(splitDays),
        goal,
        gender,
        targetMuscles: targetMuscles.length > 0 ? targetMuscles : ['All muscle groups'],
        schedule: data.schedule,
      });

      toast({
        title: "Workout Plan Generated!",
        description: "Your personalized workout plan is ready.",
      });

    } catch (error) {
      console.error("Error generating workout:", error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate workout plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadPlan = () => {
    if (!generatedPlan) return;

    const htmlContent = generateWorkoutHtml({
      name: `${generatedPlan.splitDays}-Day ${generatedPlan.goal.charAt(0).toUpperCase() + generatedPlan.goal.slice(1)} Workout Plan`,
      splitDays: generatedPlan.splitDays,
      goal: generatedPlan.goal,
      gender: generatedPlan.gender,
      targetMuscles: generatedPlan.targetMuscles,
      schedule: generatedPlan.schedule,
    });
    downloadHtmlFile(htmlContent, `workout-plan-${generatedPlan.splitDays}day-${generatedPlan.goal}.html`);
  };

  const startNewPlan = () => {
    setGeneratedPlan(null);
    setCurrentStep(1);
    setEditingDayIndex(null);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepSchedule splitDays={splitDays} setSplitDays={setSplitDays} />;
      case 2:
        return <StepProfile gender={gender} setGender={setGender} />;
      case 3:
        return <StepGoal goal={goal} setGoal={setGoal} />;
      case 4:
        return <StepMuscles targetMuscles={targetMuscles} toggleMuscle={toggleMuscle} />;
      case 5:
        return <StepReview splitDays={splitDays} gender={gender} goal={goal} targetMuscles={targetMuscles} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Exercise Picker Modal */}
      <ExercisePickerModal
        open={exercisePickerOpen}
        onClose={() => {
          setExercisePickerOpen(false);
          setAddingToDayIndex(null);
        }}
        onSelectExercise={addExerciseToDay}
        dayFocus={addingToDayIndex !== null && generatedPlan ? generatedPlan.schedule[addingToDayIndex]?.focus : undefined}
      />

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

      {/* Wizard or Generated Plan */}
      {!generatedPlan ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Dumbbell className="w-5 h-5" />
              Generate Your Workout Plan
            </CardTitle>
            <CardDescription>
              Step {currentStep} of {TOTAL_STEPS} — {wizardSteps[currentStep - 1].title}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Progress Indicator */}
            <WizardProgress 
              currentStep={currentStep} 
              totalSteps={TOTAL_STEPS} 
              steps={wizardSteps} 
            />

            {/* Step Content */}
            <div className="min-h-[300px]">
              {renderStep()}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-4 border-t">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>

              {currentStep < TOTAL_STEPS ? (
                <Button onClick={nextStep} disabled={!canProceed()}>
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={generateWorkoutPlan}
                  disabled={isGenerating || !canProceed()}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Plan
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <CardTitle>{generatedPlan.splitDays}-Day Workout Split</CardTitle>
                <CardDescription className="mt-1">
                  Goal: {generatedPlan.goal.charAt(0).toUpperCase() + generatedPlan.goal.slice(1)} • Click a day to edit exercises
                </CardDescription>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button onClick={startNewPlan} variant="outline" size="sm">
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  New Plan
                </Button>
                <Button onClick={savePlan} variant="outline" size="sm">
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button onClick={downloadPlan} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {generatedPlan.schedule.map((day, dayIndex) => {
                const isEditing = editingDayIndex === dayIndex;
                
                return (
                  <Card 
                    key={day.day} 
                    className={`bg-muted/50 transition-all ${isEditing ? 'ring-2 ring-primary' : 'cursor-pointer hover:bg-muted'}`}
                    onClick={() => !isEditing && startEditingDay(dayIndex)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="w-fit">
                          {day.day}
                        </Badge>
                        {isEditing ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              stopEditingDay();
                            }}
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Done
                          </Button>
                        ) : (
                          <Pencil className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                      <CardTitle className="text-base">{day.focus}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <ul className="space-y-2">
                        {day.exercises.map((exercise, exerciseIndex) => (
                          <li key={exerciseIndex} className="text-sm group/exercise">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <p className="font-medium">{exercise.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {exercise.sets} × {exercise.reps} • Rest: {exercise.rest}
                                </p>
                              </div>
                              {isEditing && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 text-muted-foreground hover:text-destructive shrink-0"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeExerciseFromDay(dayIndex, exerciseIndex);
                                  }}
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                      {isEditing && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-3"
                          onClick={(e) => {
                            e.stopPropagation();
                            openExercisePicker(dayIndex);
                          }}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Exercise
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
