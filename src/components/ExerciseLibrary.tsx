import { useState, useMemo, useEffect } from 'react';
import { exercises, muscleGroups, MuscleGroup, equipmentTypes } from '@/data/exercises';
import { ExerciseCard } from './ExerciseCard';
import { ExerciseCardSkeleton } from './ExerciseCardSkeleton';
import { InteractiveMuscleSelector } from './InteractiveMuscleSelector';
import { SearchAutocomplete } from './SearchAutocomplete';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { X, Heart } from 'lucide-react';
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

  const groupedMuscles = muscleGroups.reduce(
    (acc, muscle) => {
      if (!acc[muscle.category]) {
        acc[muscle.category] = [];
      }
      acc[muscle.category].push(muscle);
      return acc;
    },
    {} as Record<string, typeof muscleGroups>
  );

  const hasActiveFilters = search || selectedMuscles.length > 0 || selectedDifficulty || selectedCategory || selectedEquipment.length > 0 || showFavoritesOnly;

  const categories = [
    { id: 'push', label: 'Push' },
    { id: 'pull', label: 'Pull' },
    { id: 'legs', label: 'Legs' },
    { id: 'core', label: 'Core' },
    { id: 'compound', label: 'Compound' },
    { id: 'cardio', label: 'Cardio' },
    { id: 'stretching', label: 'Stretching' },
  ];

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

        {/* Favorites Toggle */}
        <div className="flex items-center space-x-2">
          <Switch
            id="favorites-only"
            checked={showFavoritesOnly}
            onCheckedChange={setShowFavoritesOnly}
          />
          <Label htmlFor="favorites-only" className="flex items-center gap-1.5 cursor-pointer">
            <Heart className={`w-4 h-4 ${showFavoritesOnly ? 'fill-destructive text-destructive' : ''}`} />
            Show favorites only
            {favorites.length > 0 && (
              <span className="text-xs text-muted-foreground">({favorites.length})</span>
            )}
          </Label>
        </div>

        {/* Equipment Filter */}
        <div>
          <p className="text-sm font-medium mb-2">Equipment</p>
          <div className="flex flex-wrap gap-2">
            {equipmentTypes.map((eq) => (
              <Badge
                key={eq}
                variant={selectedEquipment.includes(eq) ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => toggleEquipment(eq)}
              >
                {eq}
              </Badge>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <p className="text-sm font-medium mb-2">Category</p>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Badge
                key={cat.id}
                variant={selectedCategory === cat.id ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() =>
                  setSelectedCategory(selectedCategory === cat.id ? null : cat.id)
                }
              >
                {cat.label}
              </Badge>
            ))}
          </div>
        </div>

        {/* Difficulty Filter */}
        <div>
          <p className="text-sm font-medium mb-2">Difficulty</p>
          <div className="flex flex-wrap gap-2">
            {['beginner', 'intermediate', 'advanced'].map((diff) => (
              <Badge
                key={diff}
                variant={selectedDifficulty === diff ? 'default' : 'outline'}
                className="cursor-pointer capitalize"
                onClick={() =>
                  setSelectedDifficulty(selectedDifficulty === diff ? null : diff)
                }
              >
                {diff}
              </Badge>
            ))}
          </div>
        </div>

        {/* Muscle Group Filters */}
        <div className="space-y-3">
          <p className="text-sm font-medium">Muscle Groups</p>
          {Object.entries(groupedMuscles).map(([category, muscles]) => (
            <div key={category}>
              <p className="text-xs text-muted-foreground mb-1.5">{category}</p>
              <div className="flex flex-wrap gap-1.5">
                {muscles.map((muscle) => (
                  <Badge
                    key={muscle.id}
                    variant={selectedMuscles.includes(muscle.id) ? 'default' : 'outline'}
                    className="cursor-pointer text-xs"
                    onClick={() => toggleMuscle(muscle.id)}
                  >
                    {muscle.name}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
            Clear all filters
          </button>
        )}
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
