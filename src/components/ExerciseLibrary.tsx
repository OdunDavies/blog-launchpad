import { useState, useMemo, useEffect } from 'react';
import { exercises, MuscleGroup } from '@/data/exercises';
import { ExerciseCard } from './ExerciseCard';
import { ExerciseCardSkeleton } from './ExerciseCardSkeleton';
import { InteractiveMuscleSelector } from './InteractiveMuscleSelector';
import { SearchAutocomplete } from './SearchAutocomplete';
import { ExerciseFilters } from './ExerciseFilters';
import { useFavorites } from '@/hooks/useFavorites';

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
        selectedMuscles.some(
          (muscle) =>
            exercise.primaryMuscles.includes(muscle) ||
            exercise.secondaryMuscles.includes(muscle)
        );
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

  return (
    <div className="space-y-6">
      {/* Interactive Muscle Map */}
      <InteractiveMuscleSelector
        selectedMuscles={selectedMuscles}
        onMuscleToggle={toggleMuscle}
        onClear={clearMuscleSelection}
      />

      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search Autocomplete */}
        <SearchAutocomplete
          exercises={exercises}
          value={search}
          onChange={setSearch}
          onMuscleSelect={toggleMuscle}
        />

        {/* Filter Bar */}
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

      {/* Results count */}
      <div className="flex items-center justify-between border-b pb-3">
        <p className="text-sm text-muted-foreground">
          {filteredExercises.length} exercise{filteredExercises.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Exercise Grid */}
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
        <div className="text-center py-12">
          <p className="text-muted-foreground">No exercises match your filters.</p>
          <button
            onClick={clearFilters}
            className="mt-2 text-sm underline hover:no-underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
