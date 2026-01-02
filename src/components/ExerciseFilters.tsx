import { useState } from 'react';
import { MuscleGroup, muscleGroups, equipmentTypes } from '@/data/exercises';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ChevronDown, X, Heart, Filter, SlidersHorizontal } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';

interface ExerciseFiltersProps {
  selectedMuscles: MuscleGroup[];
  selectedEquipment: string[];
  selectedCategory: string | null;
  selectedDifficulty: string | null;
  showFavoritesOnly: boolean;
  favoritesCount: number;
  onMuscleToggle: (muscle: MuscleGroup) => void;
  onEquipmentToggle: (equipment: string) => void;
  onCategoryChange: (category: string | null) => void;
  onDifficultyChange: (difficulty: string | null) => void;
  onFavoritesToggle: (show: boolean) => void;
  onClearAll: () => void;
}

const categories = [
  { id: 'push', label: 'Push' },
  { id: 'pull', label: 'Pull' },
  { id: 'legs', label: 'Legs' },
  { id: 'core', label: 'Core' },
  { id: 'compound', label: 'Compound' },
  { id: 'cardio', label: 'Cardio' },
  { id: 'stretching', label: 'Stretching' },
];

const difficulties = [
  { id: 'beginner', label: 'Beginner', color: 'bg-green-500' },
  { id: 'intermediate', label: 'Intermediate', color: 'bg-yellow-500' },
  { id: 'advanced', label: 'Advanced', color: 'bg-red-500' },
];

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

export function ExerciseFilters({
  selectedMuscles,
  selectedEquipment,
  selectedCategory,
  selectedDifficulty,
  showFavoritesOnly,
  favoritesCount,
  onMuscleToggle,
  onEquipmentToggle,
  onCategoryChange,
  onDifficultyChange,
  onFavoritesToggle,
  onClearAll,
}: ExerciseFiltersProps) {
  const isMobile = useIsMobile();
  
  const hasActiveFilters = 
    selectedMuscles.length > 0 || 
    selectedEquipment.length > 0 || 
    selectedCategory !== null || 
    selectedDifficulty !== null || 
    showFavoritesOnly;

  const activeFilterCount = 
    selectedMuscles.length + 
    selectedEquipment.length + 
    (selectedCategory ? 1 : 0) + 
    (selectedDifficulty ? 1 : 0) + 
    (showFavoritesOnly ? 1 : 0);

  const FilterContent = () => (
    <div className="space-y-4">
      {/* Favorites Toggle */}
      <div className="flex items-center justify-between">
        <Label htmlFor="favorites-filter" className="flex items-center gap-2 cursor-pointer">
          <Heart className={`w-4 h-4 ${showFavoritesOnly ? 'fill-destructive text-destructive' : ''}`} />
          Favorites only
          {favoritesCount > 0 && (
            <span className="text-xs text-muted-foreground">({favoritesCount})</span>
          )}
        </Label>
        <Switch
          id="favorites-filter"
          checked={showFavoritesOnly}
          onCheckedChange={onFavoritesToggle}
        />
      </div>

      {/* Equipment */}
      <div>
        <p className="text-sm font-medium mb-2">Equipment</p>
        <div className="grid grid-cols-2 gap-2">
          {equipmentTypes.map((eq) => (
            <div key={eq} className="flex items-center space-x-2">
              <Checkbox
                id={`eq-${eq}`}
                checked={selectedEquipment.includes(eq)}
                onCheckedChange={() => onEquipmentToggle(eq)}
              />
              <Label htmlFor={`eq-${eq}`} className="text-sm cursor-pointer">{eq}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* Category */}
      <div>
        <p className="text-sm font-medium mb-2">Category</p>
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <Badge
              key={cat.id}
              variant={selectedCategory === cat.id ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => onCategoryChange(selectedCategory === cat.id ? null : cat.id)}
            >
              {cat.label}
            </Badge>
          ))}
        </div>
      </div>

      {/* Difficulty */}
      <div>
        <p className="text-sm font-medium mb-2">Difficulty</p>
        <div className="flex flex-wrap gap-1.5">
          {difficulties.map((diff) => (
            <Badge
              key={diff.id}
              variant={selectedDifficulty === diff.id ? 'default' : 'outline'}
              className="cursor-pointer capitalize flex items-center gap-1.5"
              onClick={() => onDifficultyChange(selectedDifficulty === diff.id ? null : diff.id)}
            >
              <span className={`w-2 h-2 rounded-full ${diff.color}`} />
              {diff.label}
            </Badge>
          ))}
        </div>
      </div>

      {/* Muscle Groups */}
      <div>
        <p className="text-sm font-medium mb-2">Muscle Groups</p>
        <div className="space-y-3">
          {Object.entries(groupedMuscles).map(([category, muscles]) => (
            <div key={category}>
              <p className="text-xs text-muted-foreground mb-1.5">{category}</p>
              <div className="flex flex-wrap gap-1.5">
                {muscles.map((muscle) => (
                  <Badge
                    key={muscle.id}
                    variant={selectedMuscles.includes(muscle.id) ? 'default' : 'outline'}
                    className="cursor-pointer text-xs"
                    onClick={() => onMuscleToggle(muscle.id)}
                  >
                    {muscle.name}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Clear All */}
      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={onClearAll} className="w-full">
          <X className="w-4 h-4 mr-1.5" />
          Clear all filters
        </Button>
      )}
    </div>
  );

  // Mobile: Sheet drawer
  if (isMobile) {
    return (
      <div className="space-y-3">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              <span className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </span>
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-2">{activeFilterCount}</Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh]">
            <SheetHeader>
              <SheetTitle>Filter Exercises</SheetTitle>
            </SheetHeader>
            <ScrollArea className="h-full py-4">
              <FilterContent />
            </ScrollArea>
          </SheetContent>
        </Sheet>

        {/* Active Filters Chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-1.5">
            {showFavoritesOnly && (
              <Badge variant="secondary" className="gap-1">
                <Heart className="w-3 h-3 fill-current" />
                Favorites
                <X className="w-3 h-3 cursor-pointer" onClick={() => onFavoritesToggle(false)} />
              </Badge>
            )}
            {selectedCategory && (
              <Badge variant="secondary" className="gap-1">
                {categories.find(c => c.id === selectedCategory)?.label}
                <X className="w-3 h-3 cursor-pointer" onClick={() => onCategoryChange(null)} />
              </Badge>
            )}
            {selectedDifficulty && (
              <Badge variant="secondary" className="gap-1 capitalize">
                {selectedDifficulty}
                <X className="w-3 h-3 cursor-pointer" onClick={() => onDifficultyChange(null)} />
              </Badge>
            )}
            {selectedEquipment.map(eq => (
              <Badge key={eq} variant="secondary" className="gap-1">
                {eq}
                <X className="w-3 h-3 cursor-pointer" onClick={() => onEquipmentToggle(eq)} />
              </Badge>
            ))}
            {selectedMuscles.map(muscle => (
              <Badge key={muscle} variant="secondary" className="gap-1 capitalize">
                {muscle}
                <X className="w-3 h-3 cursor-pointer" onClick={() => onMuscleToggle(muscle)} />
              </Badge>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Desktop: Dropdown popovers
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        {/* Equipment Dropdown */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1.5">
              Equipment
              {selectedEquipment.length > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5">{selectedEquipment.length}</Badge>
              )}
              <ChevronDown className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56" align="start">
            <div className="space-y-2">
              {equipmentTypes.map((eq) => (
                <div key={eq} className="flex items-center space-x-2">
                  <Checkbox
                    id={`desktop-eq-${eq}`}
                    checked={selectedEquipment.includes(eq)}
                    onCheckedChange={() => onEquipmentToggle(eq)}
                  />
                  <Label htmlFor={`desktop-eq-${eq}`} className="text-sm cursor-pointer flex-1">{eq}</Label>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Category Dropdown */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1.5">
              Category
              {selectedCategory && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5">1</Badge>
              )}
              <ChevronDown className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48" align="start">
            <div className="space-y-1">
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  variant={selectedCategory === cat.id ? 'secondary' : 'ghost'}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => onCategoryChange(selectedCategory === cat.id ? null : cat.id)}
                >
                  {cat.label}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Muscle Group Dropdown */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1.5">
              Muscle Group
              {selectedMuscles.length > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5">{selectedMuscles.length}</Badge>
              )}
              <ChevronDown className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64" align="start">
            <ScrollArea className="h-64">
              <div className="space-y-3 pr-4">
                {Object.entries(groupedMuscles).map(([category, muscles]) => (
                  <div key={category}>
                    <p className="text-xs font-medium text-muted-foreground mb-1.5">{category}</p>
                    {muscles.map((muscle) => (
                      <div key={muscle.id} className="flex items-center space-x-2 py-1">
                        <Checkbox
                          id={`muscle-${muscle.id}`}
                          checked={selectedMuscles.includes(muscle.id)}
                          onCheckedChange={() => onMuscleToggle(muscle.id)}
                        />
                        <Label htmlFor={`muscle-${muscle.id}`} className="text-sm cursor-pointer flex-1">
                          {muscle.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </PopoverContent>
        </Popover>

        {/* Difficulty Dropdown */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1.5">
              Difficulty
              {selectedDifficulty && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5">1</Badge>
              )}
              <ChevronDown className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-40" align="start">
            <div className="space-y-1">
              {difficulties.map((diff) => (
                <Button
                  key={diff.id}
                  variant={selectedDifficulty === diff.id ? 'secondary' : 'ghost'}
                  size="sm"
                  className="w-full justify-start gap-2"
                  onClick={() => onDifficultyChange(selectedDifficulty === diff.id ? null : diff.id)}
                >
                  <span className={`w-2 h-2 rounded-full ${diff.color}`} />
                  {diff.label}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Favorites Toggle */}
        <Button
          variant={showFavoritesOnly ? 'default' : 'outline'}
          size="sm"
          onClick={() => onFavoritesToggle(!showFavoritesOnly)}
          className="gap-1.5"
        >
          <Heart className={`w-4 h-4 ${showFavoritesOnly ? 'fill-current' : ''}`} />
          Favorites
          {favoritesCount > 0 && (
            <span className="text-xs opacity-70">({favoritesCount})</span>
          )}
        </Button>

        {/* Clear All */}
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onClearAll} className="text-muted-foreground">
            <X className="w-4 h-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Active Filters Chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-1.5">
          {showFavoritesOnly && (
            <Badge variant="secondary" className="gap-1 pr-1">
              <Heart className="w-3 h-3 fill-current" />
              Favorites
              <button onClick={() => onFavoritesToggle(false)} className="ml-1 hover:bg-muted rounded-full p-0.5">
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {selectedCategory && (
            <Badge variant="secondary" className="gap-1 pr-1">
              {categories.find(c => c.id === selectedCategory)?.label}
              <button onClick={() => onCategoryChange(null)} className="ml-1 hover:bg-muted rounded-full p-0.5">
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {selectedDifficulty && (
            <Badge variant="secondary" className="gap-1 pr-1 capitalize">
              {selectedDifficulty}
              <button onClick={() => onDifficultyChange(null)} className="ml-1 hover:bg-muted rounded-full p-0.5">
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {selectedEquipment.map(eq => (
            <Badge key={eq} variant="secondary" className="gap-1 pr-1">
              {eq}
              <button onClick={() => onEquipmentToggle(eq)} className="ml-1 hover:bg-muted rounded-full p-0.5">
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
          {selectedMuscles.map(muscle => (
            <Badge key={muscle} variant="secondary" className="gap-1 pr-1 capitalize">
              {muscle}
              <button onClick={() => onMuscleToggle(muscle)} className="ml-1 hover:bg-muted rounded-full p-0.5">
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
