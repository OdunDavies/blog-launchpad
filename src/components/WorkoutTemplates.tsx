import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { workoutTemplates, WorkoutTemplate, TemplateExercise } from '@/data/workoutTemplates';
import { Calendar, Dumbbell, Target, ChevronRight, Download, X, Edit2, Plus, Trash2, Save, RotateCcw, Loader2 } from 'lucide-react';
import { ExercisePickerModal } from './ExercisePickerModal';
import { toast } from '@/hooks/use-toast';
import { generateWorkoutPdf } from '@/utils/downloadHtml';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableExerciseItem } from './SortableExerciseItem';

const CUSTOM_TEMPLATES_KEY = 'musclepedia-custom-templates';

export function WorkoutTemplates() {
  const [selectedTemplate, setSelectedTemplate] = useState<WorkoutTemplate | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<WorkoutTemplate | null>(null);
  const [editingDayIndex, setEditingDayIndex] = useState<number | null>(null);
  const [customTemplates, setCustomTemplates] = useState<WorkoutTemplate[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Load custom templates from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(CUSTOM_TEMPLATES_KEY);
    if (saved) {
      try {
        setCustomTemplates(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load custom templates:', e);
      }
    }
  }, []);

  // Save custom templates to localStorage
  const saveCustomTemplates = (templates: WorkoutTemplate[]) => {
    setCustomTemplates(templates);
    localStorage.setItem(CUSTOM_TEMPLATES_KEY, JSON.stringify(templates));
  };

  const allTemplates = [...workoutTemplates, ...customTemplates];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'intermediate':
        return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'advanced':
        return 'bg-red-500/10 text-red-600 border-red-500/20';
      default:
        return '';
    }
  };

  const isCustomTemplate = (id: string) => customTemplates.some(t => t.id === id);

  const startEditing = () => {
    if (selectedTemplate) {
      setEditingTemplate(JSON.parse(JSON.stringify(selectedTemplate)));
      setIsEditing(true);
    }
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditingTemplate(null);
    setEditingDayIndex(null);
  };

  const removeExercise = (dayIndex: number, exerciseIndex: number) => {
    if (!editingTemplate) return;
    const updated = { ...editingTemplate };
    updated.schedule[dayIndex].exercises.splice(exerciseIndex, 1);
    setEditingTemplate(updated);
  };

  const addExercise = (exercise: { name: string; sets: number; reps: string; rest: string }) => {
    if (!editingTemplate || editingDayIndex === null) return;
    const updated = { ...editingTemplate };
    updated.schedule[editingDayIndex].exercises.push(exercise);
    setEditingTemplate(updated);
    setEditingDayIndex(null);
  };

  const reorderExercises = (dayIndex: number, oldIndex: number, newIndex: number) => {
    if (!editingTemplate) return;
    
    const updated = { ...editingTemplate };
    updated.schedule[dayIndex] = {
      ...updated.schedule[dayIndex],
      exercises: arrayMove(updated.schedule[dayIndex].exercises, oldIndex, newIndex),
    };
    setEditingTemplate(updated);
  };

  const handleDragEnd = (event: DragEndEvent, dayIndex: number) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = parseInt(active.id.toString().split('-')[1]);
      const newIndex = parseInt(over.id.toString().split('-')[1]);
      reorderExercises(dayIndex, oldIndex, newIndex);
    }
  };

  const saveChanges = () => {
    if (!editingTemplate) return;
    
    // Create a custom version with a new ID
    const customId = `custom-${editingTemplate.id}-${Date.now()}`;
    const customTemplate: WorkoutTemplate = {
      ...editingTemplate,
      id: customId,
      name: `${editingTemplate.name} (Custom)`,
    };
    
    saveCustomTemplates([...customTemplates, customTemplate]);
    setIsEditing(false);
    setEditingTemplate(null);
    setSelectedTemplate(null);
    toast({
      title: 'Template Saved',
      description: 'Your custom template has been saved.',
    });
  };

  const deleteCustomTemplate = (id: string) => {
    const updated = customTemplates.filter(t => t.id !== id);
    saveCustomTemplates(updated);
    setSelectedTemplate(null);
    toast({
      title: 'Template Deleted',
      description: 'Your custom template has been removed.',
    });
  };

  const downloadTemplate = async (template: WorkoutTemplate) => {
    if (isDownloading) return;
    
    setIsDownloading(true);
    try {
      await generateWorkoutPdf({
        name: template.name,
        description: template.description,
        difficulty: template.difficulty,
        daysPerWeek: template.daysPerWeek,
        goal: template.goal,
        schedule: template.schedule,
      });
      
      toast({
        title: "PDF Downloaded",
        description: "Your workout plan has been saved as a PDF.",
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

  const displayTemplate = isEditing && editingTemplate ? editingTemplate : selectedTemplate;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {allTemplates.map((template) => (
          <Card
            key={template.id}
            className="cursor-pointer hover:shadow-lg transition-all hover:border-primary/50 group"
            onClick={() => setSelectedTemplate(template)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Badge className={getDifficultyColor(template.difficulty)}>
                    {template.difficulty}
                  </Badge>
                  {isCustomTemplate(template.id) && (
                    <Badge variant="outline" className="text-xs">Custom</Badge>
                  )}
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <CardTitle className="text-lg mt-2">{template.name}</CardTitle>
              <CardDescription className="line-clamp-2">
                {template.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{template.daysPerWeek} days/week</span>
                </div>
                <div className="flex items-center gap-1">
                  <Target className="w-4 h-4" />
                  <span>{template.goal}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedTemplate} onOpenChange={(open) => {
        if (!open) {
          setSelectedTemplate(null);
          cancelEditing();
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          {displayTemplate && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between pr-8">
                  <div>
                    <DialogTitle className="text-2xl">
                      {displayTemplate.name}
                      {isEditing && <span className="text-primary ml-2">(Editing)</span>}
                    </DialogTitle>
                    <DialogDescription className="mt-2">
                      {displayTemplate.description}
                    </DialogDescription>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 pt-4">
                  <Badge className={getDifficultyColor(displayTemplate.difficulty)}>
                    {displayTemplate.difficulty}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {displayTemplate.daysPerWeek} days/week
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    {displayTemplate.goal}
                  </Badge>
                </div>
              </DialogHeader>

              <div className="grid gap-4 mt-6 md:grid-cols-2">
                {displayTemplate.schedule.map((day, dayIndex) => (
                  <Card key={day.day} className="bg-muted/50">
                    <CardHeader className="pb-2">
                      <Badge variant="outline" className="w-fit mb-1">
                        {day.day}
                      </Badge>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Dumbbell className="w-4 h-4" />
                        {day.focus}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      {isEditing ? (
                        <DndContext
                          sensors={sensors}
                          collisionDetection={closestCenter}
                          onDragEnd={(event) => handleDragEnd(event, dayIndex)}
                        >
                          <SortableContext
                            items={day.exercises.map((_, i) => `exercise-${i}`)}
                            strategy={verticalListSortingStrategy}
                          >
                            <ul className="space-y-2">
                              {day.exercises.map((exercise, exerciseIndex) => (
                                <SortableExerciseItem
                                  key={`exercise-${exerciseIndex}`}
                                  id={`exercise-${exerciseIndex}`}
                                  exercise={exercise}
                                  isEditing={isEditing}
                                  onRemove={() => removeExercise(dayIndex, exerciseIndex)}
                                />
                              ))}
                            </ul>
                          </SortableContext>
                        </DndContext>
                      ) : (
                        <ul className="space-y-2">
                          {day.exercises.map((exercise, exerciseIndex) => (
                            <li key={exerciseIndex} className="text-sm">
                              <div className="flex-1">
                                <p className="font-medium">{exercise.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {exercise.sets} × {exercise.reps} • Rest: {exercise.rest}
                                </p>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                      {isEditing && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-3"
                          onClick={() => setEditingDayIndex(dayIndex)}
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Add Exercise
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex flex-wrap justify-end gap-2 mt-6 pt-4 border-t">
                {isEditing ? (
                  <>
                    <Button variant="outline" onClick={cancelEditing}>
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                    <Button onClick={saveChanges}>
                      <Save className="w-4 h-4 mr-2" />
                      Save as Custom
                    </Button>
                  </>
                ) : (
                  <>
                    {selectedTemplate && isCustomTemplate(selectedTemplate.id) && (
                      <Button 
                        variant="destructive" 
                        onClick={() => deleteCustomTemplate(selectedTemplate.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    )}
                    <Button variant="outline" onClick={() => setSelectedTemplate(null)}>
                      <X className="w-4 h-4 mr-2" />
                      Close
                    </Button>
                    <Button variant="outline" onClick={startEditing}>
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button onClick={() => selectedTemplate && downloadTemplate(selectedTemplate)} disabled={isDownloading}>
                      {isDownloading ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Download className="w-4 h-4 mr-2" />
                      )}
                      {isDownloading ? 'Generating...' : 'Download PDF'}
                    </Button>
                  </>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <ExercisePickerModal
        open={editingDayIndex !== null}
        onClose={() => setEditingDayIndex(null)}
        onSelectExercise={addExercise}
        dayFocus={editingDayIndex !== null && editingTemplate ? editingTemplate.schedule[editingDayIndex].focus : undefined}
      />
    </div>
  );
}
