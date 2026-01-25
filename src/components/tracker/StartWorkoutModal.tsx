import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, Plus, FileText, Sparkles, Dumbbell, ChevronRight } from 'lucide-react';
import { workoutTemplates, WorkoutTemplate, TemplateDay } from '@/data/workoutTemplates';
import { useIsMobile } from '@/hooks/use-mobile';

interface StartWorkoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStart: (
    name: string,
    exercises: { name: string; targetSets?: number; targetReps?: string }[],
    source?: 'template' | 'ai-generated' | 'custom',
    sourceId?: string,
    sourceDayIndex?: number
  ) => void;
}

interface SavedPlan {
  id: string;
  name: string;
  goal: string;
  splitDays: number;
  gender: string;
  targetMuscles: string[];
  schedule: TemplateDay[];
  savedAt: string;
}

type Step = 'choose' | 'templates' | 'ai-plans' | 'day-select';

export function StartWorkoutModal({ open, onOpenChange, onStart }: StartWorkoutModalProps) {
  const isMobile = useIsMobile();
  const [step, setStep] = useState<Step>('choose');
  const [workoutName, setWorkoutName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<WorkoutTemplate | null>(null);
  const [selectedAIPlan, setSelectedAIPlan] = useState<SavedPlan | null>(null);
  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>([]);

  // Load saved AI plans
  useEffect(() => {
    if (open) {
      const saved = localStorage.getItem('workout-planner-saved-plans');
      if (saved) {
        try {
          setSavedPlans(JSON.parse(saved));
        } catch (e) {
          console.error('Failed to parse saved plans:', e);
        }
      }
    }
  }, [open]);

  const reset = () => {
    setStep('choose');
    setWorkoutName('');
    setSelectedTemplate(null);
    setSelectedAIPlan(null);
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(reset, 200);
  };

  const handleBack = () => {
    if (step === 'day-select') {
      if (selectedTemplate) {
        setSelectedTemplate(null);
        setStep('templates');
      } else {
        setSelectedAIPlan(null);
        setStep('ai-plans');
      }
    } else {
      setStep('choose');
    }
  };

  const handleStartEmpty = () => {
    const name = workoutName.trim() || `Workout ${new Date().toLocaleDateString()}`;
    onStart(name, [], 'custom');
    handleClose();
  };

  const handleSelectTemplate = (template: WorkoutTemplate) => {
    setSelectedTemplate(template);
    setStep('day-select');
  };

  const handleSelectAIPlan = (plan: SavedPlan) => {
    setSelectedAIPlan(plan);
    setStep('day-select');
  };

  const handleSelectDay = (dayIndex: number) => {
    const schedule = selectedTemplate?.schedule || selectedAIPlan?.schedule;
    const sourceId = selectedTemplate?.id || selectedAIPlan?.id;
    const source = selectedTemplate ? 'template' : 'ai-generated';

    if (!schedule) return;

    const day = schedule[dayIndex];
    const name = workoutName.trim() || `${day.day}: ${day.focus}`;
    
    onStart(
      name,
      day.exercises.map(ex => ({
        name: ex.name,
        targetSets: ex.sets,
        targetReps: ex.reps,
      })),
      source as 'template' | 'ai-generated',
      sourceId,
      dayIndex
    );
    handleClose();
  };

  const content = (
    <div className="space-y-4">
      {/* Header with Back Button */}
      {step !== 'choose' && (
        <Button variant="ghost" size="sm" onClick={handleBack} className="gap-1 -ml-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      )}

      {/* Step: Choose */}
      {step === 'choose' && (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Workout Name (optional)</label>
            <Input
              placeholder="e.g., Morning Push Day"
              value={workoutName}
              onChange={(e) => setWorkoutName(e.target.value)}
              className="mt-1"
            />
          </div>

          <div className="grid gap-3">
            <Card
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={handleStartEmpty}
            >
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Plus className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Empty Workout</p>
                  <p className="text-sm text-muted-foreground">Start from scratch</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => setStep('templates')}
            >
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <FileText className="w-5 h-5 text-blue-500" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">From Template</p>
                  <p className="text-sm text-muted-foreground">{workoutTemplates.length} templates available</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </CardContent>
            </Card>

            {savedPlans.length > 0 && (
              <Card
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setStep('ai-plans')}
              >
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/10">
                    <Sparkles className="w-5 h-5 text-purple-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Saved AI Plans</p>
                    <p className="text-sm text-muted-foreground">{savedPlans.length} plans saved</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Step: Templates */}
      {step === 'templates' && (
        <ScrollArea className="h-[400px] -mx-2 px-2">
          <div className="space-y-3">
            {workoutTemplates.map((template) => (
              <Card
                key={template.id}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => handleSelectTemplate(template)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{template.name}</p>
                      <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                    </div>
                    <Badge variant="secondary">{template.daysPerWeek} days</Badge>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">{template.difficulty}</Badge>
                    <Badge variant="outline" className="text-xs">{template.goal}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}

      {/* Step: AI Plans */}
      {step === 'ai-plans' && (
        <ScrollArea className="h-[400px] -mx-2 px-2">
          <div className="space-y-3">
            {savedPlans.map((plan) => (
              <Card
                key={plan.id}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => handleSelectAIPlan(plan)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{plan.name}</p>
                      <p className="text-sm text-muted-foreground mt-1">{plan.goal}</p>
                    </div>
                    <Badge variant="secondary">{plan.schedule.length} days</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Saved {new Date(plan.savedAt).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}

      {/* Step: Day Selection */}
      {step === 'day-select' && (
        <ScrollArea className="h-[400px] -mx-2 px-2">
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground px-1">
              Select a day from {selectedTemplate?.name || selectedAIPlan?.name}
            </p>
            {(selectedTemplate?.schedule || selectedAIPlan?.schedule)?.map((day, index) => (
              <Card
                key={index}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => handleSelectDay(index)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Dumbbell className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{day.day}: {day.focus}</p>
                      <p className="text-sm text-muted-foreground">
                        {day.exercises.length} exercises
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    {day.exercises.slice(0, 3).map(ex => ex.name).join(', ')}
                    {day.exercises.length > 3 && `, +${day.exercises.length - 3} more`}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={handleClose}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader>
            <DrawerTitle>Start Workout</DrawerTitle>
            <DrawerDescription>Choose how to start your workout</DrawerDescription>
          </DrawerHeader>
          <div className="px-4 pb-6">{content}</div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Start Workout</DialogTitle>
          <DialogDescription>Choose how to start your workout</DialogDescription>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
}
