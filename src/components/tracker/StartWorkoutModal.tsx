import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dumbbell, FileText, Plus } from 'lucide-react';
import { workoutTemplates } from '@/data/workoutTemplates';
import { ScrollArea } from '@/components/ui/scroll-area';

interface StartWorkoutModalProps {
  open: boolean;
  onClose: () => void;
  onStartBlank: (name?: string) => void;
  onStartFromTemplate: (templateId: string, name: string, exercises: Array<{ exerciseId: string; exerciseName: string }>) => void;
}

export function StartWorkoutModal({ open, onClose, onStartBlank, onStartFromTemplate }: StartWorkoutModalProps) {
  const [workoutName, setWorkoutName] = useState('');
  const [step, setStep] = useState<'choose' | 'template'>('choose');

  const handleStartBlank = () => {
    onStartBlank(workoutName || undefined);
    setWorkoutName('');
    setStep('choose');
  };

  const handleSelectTemplate = (templateId: string) => {
    const template = workoutTemplates.find(t => t.id === templateId);
    if (!template) return;

    // Get all exercises from the first day (or combine all days)
    const exercises = template.schedule[0]?.exercises.map(e => ({
      exerciseId: e.name.toLowerCase().replace(/\s+/g, '-'),
      exerciseName: e.name,
    })) || [];

    onStartFromTemplate(templateId, template.name, exercises);
    setWorkoutName('');
    setStep('choose');
  };

  const handleClose = () => {
    setStep('choose');
    setWorkoutName('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Start Workout</DialogTitle>
          <DialogDescription>
            {step === 'choose' 
              ? 'Start a new workout session or choose from a template.'
              : 'Select a workout template to get started.'}
          </DialogDescription>
        </DialogHeader>

        {step === 'choose' ? (
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
                  <div>
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
                  <div>
                    <p className="font-medium">From Template</p>
                    <p className="text-sm text-muted-foreground">Use a pre-made workout</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Button variant="ghost" size="sm" onClick={() => setStep('choose')}>
              ← Back
            </Button>

            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-2">
                {workoutTemplates.map((template) => (
                  <Card 
                    key={template.id}
                    className="cursor-pointer hover:border-primary/50 hover:shadow-md transition-all"
                    onClick={() => handleSelectTemplate(template.id)}
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
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
