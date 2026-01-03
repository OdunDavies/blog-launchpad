import { useState, useMemo, useEffect } from 'react';
import { exercises, MuscleGroup } from '@/data/exercises';
import { ExerciseCard } from './ExerciseCard';
import { ExerciseCardSkeleton } from './ExerciseCardSkeleton';
import { InteractiveMuscleSelector } from './InteractiveMuscleSelector';
import { SearchAutocomplete } from './SearchAutocomplete';
import { ExerciseFilters } from './ExerciseFilters';
import { useFavorites } from '@/hooks/useFavorites';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ChevronDown, Search } from 'lucide-react';

interface ExerciseLibraryProps {
  initialMuscleFilter?: MuscleGroup[];
}

export function ExerciseLibrary({ initialMuscleFilter = [] }: ExerciseLibraryProps) {
  const [search, setSearch] = useState('');
  const [selectedMuscles, setSelectedMuscles] = useState<MuscleGroup[]>(initialMuscleFilter);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  // Sync with external filter changes
  useEffect(() => {
    setSelectedMuscles(initialMuscleFilter);
  }, [initialMuscleFilter]);

  // Simulate initial load
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const filteredExercises = useMemo(() => {
    return exercises.filter((exercise) => {
      const matchesSearch = exercise.name.toLowerCase().includes(search.toLowerCase());
      const matchesMuscle =
        selectedMuscles.length === 0 ||
        selectedMuscles.some((muscle) => exercise.primaryMuscles.includes(muscle));
      const matchesDifficulty =
        !selectedDifficulty || exercise.difficulty === selectedDifficulty;
      const matchesCategory =
        !selectedCategory || exercise.category === selectedCategory;
      const matchesEquipment =
        selectedEquipment.length === 0 ||
        selectedEquipment.some((eq) =>
          exercise.equipment.toLowerCase().includes(eq.toLowerCase())
        );
      const matchesFavorites = !showFavoritesOnly || favorites.includes(exercise.id);

      return matchesSearch && matchesMuscle && matchesDifficulty && matchesCategory && matchesEquipment && matchesFavorites;
    });
  }, [search, selectedMuscles, selectedDifficulty, selectedCategory, selectedEquipment, showFavoritesOnly, favorites]);

  const toggleMuscle = (muscle: MuscleGroup) => {
    setSelectedMuscles((prev) =>
      prev.includes(muscle) ? prev.filter((m) => m !== muscle) : [...prev, muscle]
    );
  };

  const toggleEquipment = (equipment: string) => {
    setSelectedEquipment((prev) =>
      prev.includes(equipment) ? prev.filter((e) => e !== equipment) : [...prev, equipment]
    );
  };

  const clearMuscleSelection = () => {
    setSelectedMuscles([]);
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedMuscles([]);
    setSelectedDifficulty(null);
    setSelectedCategory(null);
    setSelectedEquipment([]);
    setShowFavoritesOnly(false);
  };

  const hasActiveFilters = search || selectedMuscles.length > 0 || selectedDifficulty || selectedCategory || selectedEquipment.length > 0 || showFavoritesOnly;

  const [muscleMapOpen, setMuscleMapOpen] = useState(false);

  return (
    <div className="space-y-4">
      {/* Collapsible Muscle Map */}
      <Collapsible open={muscleMapOpen} onOpenChange={setMuscleMapOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <span className="flex items-center gap-2">
              {selectedMuscles.length > 0 
                ? `${selectedMuscles.length} muscle${selectedMuscles.length > 1 ? 's' : ''} selected` 
                : 'Select muscles from body map'}
            </span>
            <ChevronDown className={`w-4 h-4 transition-transform ${muscleMapOpen ? 'rotate-180' : ''}`} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4">
          <InteractiveMuscleSelector
            selectedMuscles={selectedMuscles}
            onMuscleToggle={toggleMuscle}
            onClear={clearMuscleSelection}
          />
        </CollapsibleContent>
      </Collapsible>

      {/* Search and Filters */}
      <div className="space-y-4">
        <SearchAutocomplete
          exercises={exercises}
          value={search}
          onChange={setSearch}
          onMuscleSelect={toggleMuscle}
        />

        <ExerciseFilters
          selectedMuscles={selectedMuscles}
          selectedEquipment={selectedEquipment}
          selectedCategory={selectedCategory}
          selectedDifficulty={selectedDifficulty}
          showFavoritesOnly={showFavoritesOnly}
          favoritesCount={favorites.length}
          onMuscleToggle={toggleMuscle}
          onEquipmentToggle={toggleEquipment}
          onCategoryChange={setSelectedCategory}
          onDifficultyChange={setSelectedDifficulty}
          onFavoritesToggle={setShowFavoritesOnly}
          onClearAll={clearFilters}
        />
      </div>

      {/* Exercise Grid - Only show when filters are active */}
      {hasActiveFilters ? (
        <>
          <div className="flex items-center justify-between border-b pb-3">
            <p className="text-sm text-muted-foreground">
              {filteredExercises.length} exercise{filteredExercises.length !== 1 ? 's' : ''} found
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <ExerciseCardSkeleton key={i} />
              ))
            ) : (
              filteredExercises.map((exercise) => (
                <ExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  isFavorite={isFavorite(exercise.id)}
                  onToggleFavorite={toggleFavorite}
                />
              ))
            )}
          </div>

          {!isLoading && filteredExercises.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No exercises match your filters.</p>
              <button
                onClick={clearFilters}
                className="mt-2 text-sm underline hover:no-underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 border rounded-lg bg-muted/20">
          <Search className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
          <h3 className="font-semibold mb-1">Select Filters to View Exercises</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Click the muscle map above, use the search bar, or apply filters to discover exercises.
          </p>
        </div>
      )}
    </div>
  );
}
