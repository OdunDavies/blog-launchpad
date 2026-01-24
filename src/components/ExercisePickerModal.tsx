import { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { exercises, Exercise, MuscleGroup } from '@/data/exercises';
import { Search, Plus, Filter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ExercisePickerModalProps {
  open: boolean;
  onClose: () => void;
  onSelectExercise: (exercise: { name: string; sets: number; reps: string; rest: string }) => void;
  dayFocus?: string;
}

const muscleFilters: { value: string; label: string; muscles: MuscleGroup[] }[] = [
  { value: 'all', label: 'All Muscles', muscles: [] },
  { value: 'chest', label: 'Chest', muscles: ['chest'] },
  { value: 'back', label: 'Back', muscles: ['lats', 'traps', 'back'] },
  { value: 'shoulders', label: 'Shoulders', muscles: ['shoulders'] },
  { value: 'arms', label: 'Arms', muscles: ['biceps', 'triceps', 'forearms'] },
  { value: 'legs', label: 'Legs', muscles: ['quads', 'hamstrings', 'glutes', 'calves'] },
  { value: 'core', label: 'Core', muscles: ['abs', 'obliques'] },
];

const difficultyColors: Record<string, string> = {
  beginner: 'bg-green-500/10 text-green-600 border-green-500/30',
  intermediate: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/30',
  advanced: 'bg-red-500/10 text-red-600 border-red-500/30',
};

export function ExercisePickerModal({ open, onClose, onSelectExercise, dayFocus }: ExercisePickerModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [muscleFilter, setMuscleFilter] = useState('all');

  const filteredExercises = useMemo(() => {
    return exercises.filter((exercise) => {
      const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (muscleFilter === 'all') return matchesSearch;
      
      const filterMuscles = muscleFilters.find((f) => f.value === muscleFilter)?.muscles || [];
      const matchesMuscle = exercise.primaryMuscles.some((m) => filterMuscles.includes(m));
      
      return matchesSearch && matchesMuscle;
    });
  }, [searchQuery, muscleFilter]);

  const handleAddExercise = (exercise: Exercise) => {
    const defaultSets = exercise.difficulty === 'beginner' ? 3 : exercise.difficulty === 'intermediate' ? 4 : 4;
    const defaultReps = exercise.difficulty === 'advanced' ? '6-8' : exercise.difficulty === 'intermediate' ? '8-10' : '10-12';
    
    onSelectExercise({
      name: exercise.name,
      sets: defaultSets,
      reps: defaultReps,
      rest: '60-90 sec',
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col overflow-hidden">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Add Exercise{dayFocus && ` to ${dayFocus}`}</DialogTitle>
        </DialogHeader>
        
        {/* Search and Filter */}
        <div className="flex gap-3 py-2 flex-shrink-0">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search exercises..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={muscleFilter} onValueChange={setMuscleFilter}>
            <SelectTrigger className="w-[160px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              {muscleFilters.map((filter) => (
                <SelectItem key={filter.value} value={filter.value}>
                  {filter.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Exercise List */}
        <ScrollArea className="flex-1 min-h-0 -mx-6 px-6">
          <div className="space-y-2 pb-4">
            {filteredExercises.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No exercises found</p>
            ) : (
              filteredExercises.map((exercise) => (
                <div
                  key={exercise.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm truncate">{exercise.name}</p>
                      <Badge variant="outline" className={`text-xs ${difficultyColors[exercise.difficulty]}`}>
                        {exercise.difficulty}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {exercise.primaryMuscles.slice(0, 3).map((muscle) => (
                        <Badge key={muscle} variant="secondary" className="text-xs capitalize">
                          {muscle}
                        </Badge>
                      ))}
                      {exercise.primaryMuscles.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{exercise.primaryMuscles.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleAddExercise(exercise)}
                    className="ml-2 shrink-0"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
