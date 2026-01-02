import { useState, useRef, useEffect } from 'react';
import { Exercise, MuscleGroup, muscleGroups } from '@/data/exercises';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Search, Dumbbell, Target } from 'lucide-react';

interface SearchAutocompleteProps {
  exercises: Exercise[];
  value: string;
  onChange: (value: string) => void;
  onMuscleSelect?: (muscle: MuscleGroup) => void;
}

export function SearchAutocomplete({ exercises, value, onChange, onMuscleSelect }: SearchAutocompleteProps) {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredExercises = value.length > 0
    ? exercises.filter((e) => e.name.toLowerCase().includes(value.toLowerCase())).slice(0, 5)
    : [];

  const filteredMuscles = value.length > 0
    ? muscleGroups.filter((m) => m.name.toLowerCase().includes(value.toLowerCase())).slice(0, 3)
    : [];

  const handleSelect = (exerciseName: string) => {
    onChange(exerciseName);
    setOpen(false);
  };

  const handleMuscleSelect = (muscle: MuscleGroup) => {
    if (onMuscleSelect) {
      onMuscleSelect(muscle);
      onChange('');
      setOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={inputRef}>
      <Command className="rounded-lg border shadow-none" shouldFilter={false}>
        <div className="flex items-center border-b px-3">
          <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
          <CommandInput
            placeholder="Search exercises or muscles..."
            value={value}
            onValueChange={(val) => {
              onChange(val);
              setOpen(val.length > 0);
            }}
            onFocus={() => value.length > 0 && setOpen(true)}
            className="border-0 focus:ring-0"
          />
        </div>
        {open && (filteredExercises.length > 0 || filteredMuscles.length > 0) && (
          <CommandList className="absolute top-full left-0 right-0 z-50 bg-popover border rounded-b-lg shadow-lg max-h-64 overflow-y-auto">
            {filteredExercises.length === 0 && filteredMuscles.length === 0 && (
              <CommandEmpty>No results found.</CommandEmpty>
            )}
            {filteredExercises.length > 0 && (
              <CommandGroup heading="Exercises">
                {filteredExercises.map((exercise) => (
                  <CommandItem
                    key={exercise.id}
                    value={exercise.name}
                    onSelect={() => handleSelect(exercise.name)}
                    className="cursor-pointer"
                  >
                    <Dumbbell className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{exercise.name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            {filteredMuscles.length > 0 && onMuscleSelect && (
              <CommandGroup heading="Muscle Groups">
                {filteredMuscles.map((muscle) => (
                  <CommandItem
                    key={muscle.id}
                    value={muscle.name}
                    onSelect={() => handleMuscleSelect(muscle.id)}
                    className="cursor-pointer"
                  >
                    <Target className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{muscle.name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        )}
      </Command>
    </div>
  );
}
