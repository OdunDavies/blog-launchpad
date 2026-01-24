import { useState, useEffect } from 'react';
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Start Workout</DialogTitle>
        </DialogHeader>

        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="templates" className="gap-2">
              <LayoutTemplate className="w-4 h-4" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="ai" className="gap-2">
              <Sparkles className="w-4 h-4" />
              AI Plans
            </TabsTrigger>
            <TabsTrigger value="custom" className="gap-2">
              <Plus className="w-4 h-4" />
              Custom
            </TabsTrigger>
          </TabsList>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-4">
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
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{template.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {template.daysPerWeek} days/week • {template.goal}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {selectedTemplate && (
              <div className="space-y-4">
                <Button variant="ghost" onClick={() => setSelectedTemplate(null)}>
                  ← Back to templates
                </Button>
                <h4 className="font-medium">Select a day from {selectedTemplate.name}</h4>
                <div className="grid gap-2">
                  {selectedTemplate.schedule.map((day, index) => (
                    <Card
                      key={index}
                      className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                        selectedDayIndex === index ? 'border-primary bg-primary/5' : ''
                      }`}
                      onClick={() => handleSelectDay(index)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium">{day.day}: {day.focus}</h5>
                          <Badge variant="secondary">{day.exercises.length} exercises</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
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
          <TabsContent value="ai" className="space-y-4">
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
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{plan.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {plan.schedule.length} days
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {selectedAIPlan && (
              <div className="space-y-4">
                <Button variant="ghost" onClick={() => setSelectedAIPlan(null)}>
                  ← Back to plans
                </Button>
                <h4 className="font-medium">Select a day from {selectedAIPlan.name}</h4>
                <div className="grid gap-2">
                  {selectedAIPlan.schedule.map((day, index) => (
                    <Card
                      key={index}
                      className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                        selectedDayIndex === index ? 'border-primary bg-primary/5' : ''
                      }`}
                      onClick={() => handleSelectDay(index)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium">{day.day}: {day.focus}</h5>
                          <Badge variant="secondary">{day.exercises.length} exercises</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
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
          <TabsContent value="custom" className="space-y-4">
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
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleStartWorkout}
            disabled={
              (selectedTab === 'templates' && (selectedDayIndex === null)) ||
              (selectedTab === 'ai' && (selectedDayIndex === null)) ||
              (selectedTab === 'custom' && !customName.trim())
            }
          >
            <Dumbbell className="w-4 h-4 mr-2" />
            Start Workout
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
