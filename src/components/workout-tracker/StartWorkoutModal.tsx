import { useState, useEffect } from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LayoutTemplate, 
  Sparkles, 
  Plus,
  ChevronRight,
  Dumbbell
} from 'lucide-react';
import { workoutTemplates, WorkoutTemplate } from '@/data/workoutTemplates';
import { useIsMobile } from '@/hooks/use-mobile';

interface StartWorkoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStart: (
    name: string,
    exercises: { name: string; targetSets: number; targetReps: string }[],
    source?: 'template' | 'ai-generated' | 'custom',
    sourceId?: string,
    sourceDayIndex?: number
  ) => void;
}

interface SavedPlan {
  id: string;
  name: string;
  schedule: {
    day: string;
    focus: string;
    exercises: { name: string; sets: number; reps: string; rest: string }[];
  }[];
}

export function StartWorkoutModal({ open, onOpenChange, onStart }: StartWorkoutModalProps) {
  const isMobile = useIsMobile();
  const [selectedTab, setSelectedTab] = useState('templates');
  const [selectedTemplate, setSelectedTemplate] = useState<WorkoutTemplate | null>(null);
  const [selectedAIPlan, setSelectedAIPlan] = useState<SavedPlan | null>(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);
  const [customName, setCustomName] = useState('');
  const [aiPlans, setAIPlans] = useState<SavedPlan[]>([]);

  // Load AI-generated plans from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('workout-planner-saved');
    if (saved) {
      try {
        const plans = JSON.parse(saved);
        setAIPlans(plans);
      } catch {
        setAIPlans([]);
      }
    }
  }, [open]);

  const handleSelectTemplate = (template: WorkoutTemplate) => {
    setSelectedTemplate(template);
    setSelectedAIPlan(null);
    setSelectedDayIndex(null);
  };

  const handleSelectAIPlan = (plan: SavedPlan) => {
    setSelectedAIPlan(plan);
    setSelectedTemplate(null);
    setSelectedDayIndex(null);
  };

  const handleSelectDay = (index: number) => {
    setSelectedDayIndex(index);
  };

  const handleStartWorkout = () => {
    if (selectedTab === 'custom') {
      if (!customName.trim()) return;
      onStart(customName.trim(), [], 'custom');
      onOpenChange(false);
      reset();
      return;
    }

    if (selectedTemplate && selectedDayIndex !== null) {
      const day = selectedTemplate.schedule[selectedDayIndex];
      const name = `${selectedTemplate.name} - ${day.focus}`;
      const exercises = day.exercises.map(e => ({
        name: e.name,
        targetSets: e.sets,
        targetReps: e.reps,
      }));
      onStart(name, exercises, 'template', selectedTemplate.id, selectedDayIndex);
      onOpenChange(false);
      reset();
      return;
    }

    if (selectedAIPlan && selectedDayIndex !== null) {
      const day = selectedAIPlan.schedule[selectedDayIndex];
      const name = `${selectedAIPlan.name} - ${day.focus}`;
      const exercises = day.exercises.map(e => ({
        name: e.name,
        targetSets: e.sets,
        targetReps: e.reps,
      }));
      onStart(name, exercises, 'ai-generated', selectedAIPlan.id, selectedDayIndex);
      onOpenChange(false);
      reset();
      return;
    }
  };

  const reset = () => {
    setSelectedTemplate(null);
    setSelectedAIPlan(null);
    setSelectedDayIndex(null);
    setCustomName('');
  };

  const schedule = selectedTemplate?.schedule || selectedAIPlan?.schedule;

  const content = (
    <>
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="templates" className="gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4">
            <LayoutTemplate className="w-4 h-4" />
            <span className="hidden sm:inline">Templates</span>
          </TabsTrigger>
          <TabsTrigger value="ai" className="gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4">
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">AI Plans</span>
          </TabsTrigger>
          <TabsTrigger value="custom" className="gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Custom</span>
          </TabsTrigger>
        </TabsList>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-3 mt-4">
          {!schedule && (
            <div className="grid gap-2">
              {workoutTemplates.map((template) => (
                <Card
                  key={template.id}
                  className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                    selectedTemplate?.id === template.id ? 'border-primary' : ''
                  }`}
                  onClick={() => handleSelectTemplate(template)}
                >
                  <CardContent className="p-3 sm:p-4 flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium text-sm sm:text-base truncate">{template.name}</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {template.daysPerWeek} days/week • {template.goal}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0 ml-2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {selectedTemplate && (
            <div className="space-y-3">
              <Button variant="ghost" size="sm" onClick={() => setSelectedTemplate(null)}>
                ← Back to templates
              </Button>
              <h4 className="font-medium text-sm">Select a day from {selectedTemplate.name}</h4>
              <div className="grid gap-2">
                {selectedTemplate.schedule.map((day, index) => (
                  <Card
                    key={index}
                    className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                      selectedDayIndex === index ? 'border-primary bg-primary/5' : ''
                    }`}
                    onClick={() => handleSelectDay(index)}
                  >
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex items-center justify-between mb-1 sm:mb-2 gap-2">
                        <h5 className="font-medium text-sm truncate">{day.day}: {day.focus}</h5>
                        <Badge variant="secondary" className="text-xs shrink-0">{day.exercises.length} exercises</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {day.exercises.slice(0, 3).map(e => e.name).join(', ')}
                        {day.exercises.length > 3 && '...'}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        {/* AI Plans Tab */}
        <TabsContent value="ai" className="space-y-3 mt-4">
          {aiPlans.length === 0 && !selectedAIPlan && (
            <div className="text-center py-8">
              <Sparkles className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <h4 className="font-medium mb-2">No AI Plans Saved</h4>
              <p className="text-sm text-muted-foreground">
                Generate and save a workout plan in the AI Workout tab first.
              </p>
            </div>
          )}

          {aiPlans.length > 0 && !selectedAIPlan && (
            <div className="grid gap-2">
              {aiPlans.map((plan) => (
                <Card
                  key={plan.id}
                  className="cursor-pointer transition-colors hover:bg-muted/50"
                  onClick={() => handleSelectAIPlan(plan)}
                >
                  <CardContent className="p-3 sm:p-4 flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium text-sm sm:text-base truncate">{plan.name}</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {plan.schedule.length} days
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0 ml-2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {selectedAIPlan && (
            <div className="space-y-3">
              <Button variant="ghost" size="sm" onClick={() => setSelectedAIPlan(null)}>
                ← Back to plans
              </Button>
              <h4 className="font-medium text-sm">Select a day from {selectedAIPlan.name}</h4>
              <div className="grid gap-2">
                {selectedAIPlan.schedule.map((day, index) => (
                  <Card
                    key={index}
                    className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                      selectedDayIndex === index ? 'border-primary bg-primary/5' : ''
                    }`}
                    onClick={() => handleSelectDay(index)}
                  >
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex items-center justify-between mb-1 sm:mb-2 gap-2">
                        <h5 className="font-medium text-sm truncate">{day.day}: {day.focus}</h5>
                        <Badge variant="secondary" className="text-xs shrink-0">{day.exercises.length} exercises</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {day.exercises.slice(0, 3).map(e => e.name).join(', ')}
                        {day.exercises.length > 3 && '...'}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        {/* Custom Tab */}
        <TabsContent value="custom" className="space-y-4 mt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="workout-name">Workout Name</Label>
              <Input
                id="workout-name"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="e.g., Morning Push Day"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Start with an empty workout and add exercises as you go.
            </p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Start button */}
      <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-4 border-t mt-4">
        <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
          Cancel
        </Button>
        <Button
          onClick={handleStartWorkout}
          disabled={
            (selectedTab === 'templates' && (selectedDayIndex === null)) ||
            (selectedTab === 'ai' && (selectedDayIndex === null)) ||
            (selectedTab === 'custom' && !customName.trim())
          }
          className="w-full sm:w-auto"
        >
          <Dumbbell className="w-4 h-4 mr-2" />
          Start Workout
        </Button>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="px-4 pb-6 max-h-[90vh]">
          <DrawerHeader className="px-0">
            <DrawerTitle>Start Workout</DrawerTitle>
          </DrawerHeader>
          <div className="overflow-y-auto">
            {content}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Start Workout</DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
}
