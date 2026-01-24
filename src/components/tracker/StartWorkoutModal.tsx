import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dumbbell, FileText, Plus, Sparkles, ChevronRight } from 'lucide-react';
import { workoutTemplates, WorkoutTemplate, TemplateDay } from '@/data/workoutTemplates';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface SavedPlan {
  id: string;
  name: string;
  savedAt: string;
  splitDays: number;
  goal: string;
  gender: string;
  targetMuscles: string[];
  schedule: Array<{
    day: string;
    focus: string;
    exercises: Array<{ name: string; sets: number; reps: string; rest: string }>;
  }>;
}

interface StartWorkoutModalProps {
  open: boolean;
  onClose: () => void;
  onStartBlank: (name?: string) => void;
  onStartFromTemplate: (
    templateId: string, 
    name: string, 
    exercises: Array<{ exerciseId: string; exerciseName: string }>
  ) => void;
  savedPlans?: SavedPlan[];
}

type ModalStep = 'choose' | 'template' | 'template-day' | 'saved-plans' | 'saved-day';

export function StartWorkoutModal({ 
  open, 
  onClose, 
  onStartBlank, 
  onStartFromTemplate,
  savedPlans = [] 
}: StartWorkoutModalProps) {
  const [workoutName, setWorkoutName] = useState('');
  const [step, setStep] = useState<ModalStep>('choose');
  const [selectedTemplate, setSelectedTemplate] = useState<WorkoutTemplate | null>(null);
  const [selectedSavedPlan, setSelectedSavedPlan] = useState<SavedPlan | null>(null);

  const handleStartBlank = () => {
    onStartBlank(workoutName || undefined);
    resetAndClose();
  };

  const handleSelectTemplate = (template: WorkoutTemplate) => {
    setSelectedTemplate(template);
    setStep('template-day');
  };

  const handleSelectSavedPlan = (plan: SavedPlan) => {
    setSelectedSavedPlan(plan);
    setStep('saved-day');
  };

  const handleSelectDay = (day: TemplateDay, templateName: string, templateId: string) => {
    const exercises = day.exercises.map(e => ({
      exerciseId: e.name.toLowerCase().replace(/\s+/g, '-'),
      exerciseName: e.name,
    }));

    const autoName = `${templateName} - ${day.day}: ${day.focus}`;
    onStartFromTemplate(templateId, workoutName || autoName, exercises);
    resetAndClose();
  };

  const handleSelectSavedDay = (day: SavedPlan['schedule'][0], planName: string, planId: string) => {
    const exercises = day.exercises.map(e => ({
      exerciseId: e.name.toLowerCase().replace(/\s+/g, '-'),
      exerciseName: e.name,
    }));

    const autoName = `${planName} - ${day.day}: ${day.focus}`;
    onStartFromTemplate(planId, workoutName || autoName, exercises);
    resetAndClose();
  };

  const resetAndClose = () => {
    setStep('choose');
    setWorkoutName('');
    setSelectedTemplate(null);
    setSelectedSavedPlan(null);
    onClose();
  };

  const goBack = () => {
    switch (step) {
      case 'template':
      case 'saved-plans':
        setStep('choose');
        break;
      case 'template-day':
        setSelectedTemplate(null);
        setStep('template');
        break;
      case 'saved-day':
        setSelectedSavedPlan(null);
        setStep('saved-plans');
        break;
      default:
        setStep('choose');
    }
  };

  const getDialogDescription = () => {
    switch (step) {
      case 'choose':
        return 'Start a new workout session or choose from a template.';
      case 'template':
        return 'Select a workout template to get started.';
      case 'template-day':
        return `Choose which day of ${selectedTemplate?.name} to track.`;
      case 'saved-plans':
        return 'Select one of your personalized AI-generated plans.';
      case 'saved-day':
        return `Choose which day of ${selectedSavedPlan?.name} to track.`;
      default:
        return '';
    }
  };

  const renderDayCard = (
    day: { day: string; focus: string; exercises: Array<{ name: string }> },
    index: number,
    onClick: () => void
  ) => {
    const previewExercises = day.exercises.slice(0, 3);
    const remainingCount = day.exercises.length - 3;

    return (
      <Card 
        key={index}
        className="cursor-pointer hover:border-primary/50 hover:shadow-md transition-all"
        onClick={onClick}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="font-medium">{day.day}</p>
              <p className="text-sm text-muted-foreground">{day.focus}</p>
            </div>
            <Badge variant="secondary" className="text-xs">
              {day.exercises.length} exercises
            </Badge>
          </div>
          <div className="mt-3 space-y-1">
            {previewExercises.map((exercise, i) => (
              <p key={i} className="text-xs text-muted-foreground flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-primary/60" />
                {exercise.name}
              </p>
            ))}
            {remainingCount > 0 && (
              <p className="text-xs text-muted-foreground/70 pl-2">
                +{remainingCount} more
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && resetAndClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Start Workout</DialogTitle>
          <DialogDescription>
            {getDialogDescription()}
          </DialogDescription>
        </DialogHeader>

        {/* Choose Step - Main menu */}
        {step === 'choose' && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="workout-name">Workout Name (optional)</Label>
              <Input
                id="workout-name"
                value={workoutName}
                onChange={(e) => setWorkoutName(e.target.value)}
                placeholder="e.g., Push Day, Leg Day"
                className="mt-1.5"
              />
            </div>

            <div className="grid gap-3">
              <Card 
                className="cursor-pointer hover:border-primary/50 hover:shadow-md transition-all"
                onClick={handleStartBlank}
              >
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Plus className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Empty Workout</p>
                    <p className="text-sm text-muted-foreground">Add exercises as you go</p>
                  </div>
                </CardContent>
              </Card>

              <Card 
                className="cursor-pointer hover:border-primary/50 hover:shadow-md transition-all"
                onClick={() => setStep('template')}
              >
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="p-2 rounded-lg bg-secondary/50">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">From Template</p>
                    <p className="text-sm text-muted-foreground">Use a pre-made workout</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </CardContent>
              </Card>

              {savedPlans.length > 0 && (
                <Card 
                  className="cursor-pointer hover:border-primary/50 hover:shadow-md transition-all"
                  onClick={() => setStep('saved-plans')}
                >
                  <CardContent className="flex items-center gap-3 p-4">
                    <div className="p-2 rounded-lg bg-accent/50">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">From My Plans</p>
                      <p className="text-sm text-muted-foreground">
                        Your AI-generated plans ({savedPlans.length})
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Template List Step */}
        {step === 'template' && (
          <div className="space-y-4">
            <Button variant="ghost" size="sm" onClick={goBack}>
              ← Back
            </Button>

            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-2">
                {workoutTemplates.map((template) => (
                  <Card 
                    key={template.id}
                    className="cursor-pointer hover:border-primary/50 hover:shadow-md transition-all"
                    onClick={() => handleSelectTemplate(template)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-muted">
                          <Dumbbell className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{template.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {template.daysPerWeek} days/week • {template.difficulty}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Template Day Selection Step */}
        {step === 'template-day' && selectedTemplate && (
          <div className="space-y-4">
            <Button variant="ghost" size="sm" onClick={goBack}>
              ← Back
            </Button>

            <ScrollArea className="h-[350px] pr-4">
              <div className="space-y-3">
                {selectedTemplate.schedule.map((day, index) => 
                  renderDayCard(day, index, () => 
                    handleSelectDay(day, selectedTemplate.name, selectedTemplate.id)
                  )
                )}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Saved Plans List Step */}
        {step === 'saved-plans' && (
          <div className="space-y-4">
            <Button variant="ghost" size="sm" onClick={goBack}>
              ← Back
            </Button>

            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-2">
                {savedPlans.map((plan) => (
                  <Card 
                    key={plan.id}
                    className="cursor-pointer hover:border-primary/50 hover:shadow-md transition-all"
                    onClick={() => handleSelectSavedPlan(plan)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-accent/30">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{plan.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {plan.splitDays} days • {plan.goal}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Saved Plan Day Selection Step */}
        {step === 'saved-day' && selectedSavedPlan && (
          <div className="space-y-4">
            <Button variant="ghost" size="sm" onClick={goBack}>
              ← Back
            </Button>

            <ScrollArea className="h-[350px] pr-4">
              <div className="space-y-3">
                {selectedSavedPlan.schedule.map((day, index) => 
                  renderDayCard(day, index, () => 
                    handleSelectSavedDay(day, selectedSavedPlan.name, selectedSavedPlan.id)
                  )
                )}
              </div>
            </ScrollArea>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
