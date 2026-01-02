import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { exercises, MuscleGroup } from '@/data/exercises';

import muscleChest from '@/assets/muscle-chest.jpg';
import muscleBack from '@/assets/muscle-back.jpg';
import muscleShoulders from '@/assets/muscle-shoulders.jpg';
import muscleArms from '@/assets/muscle-arms.jpg';
import muscleLegs from '@/assets/muscle-legs.jpg';
import muscleCore from '@/assets/muscle-core.jpg';

interface MuscleGroupData {
  id: string;
  name: string;
  image: string;
  muscles: MuscleGroup[];
}

const muscleGroups: MuscleGroupData[] = [
  {
    id: 'chest',
    name: 'Chest',
    image: muscleChest,
    muscles: ['chest'],
  },
  {
    id: 'back',
    name: 'Back',
    image: muscleBack,
    muscles: ['lats', 'traps', 'back'],
  },
  {
    id: 'shoulders',
    name: 'Shoulders',
    image: muscleShoulders,
    muscles: ['shoulders'],
  },
  {
    id: 'arms',
    name: 'Arms',
    image: muscleArms,
    muscles: ['biceps', 'triceps', 'forearms'],
  },
  {
    id: 'legs',
    name: 'Legs',
    image: muscleLegs,
    muscles: ['quads', 'hamstrings', 'glutes', 'calves'],
  },
  {
    id: 'core',
    name: 'Core',
    image: muscleCore,
    muscles: ['abs', 'obliques'],
  },
];

function getExerciseCount(muscles: MuscleGroup[]): number {
  return exercises.filter((ex) =>
    ex.primaryMuscles.some((m) => muscles.includes(m))
  ).length;
}

interface MuscleGroupCardsProps {
  onSelectMuscleGroup: (muscles: MuscleGroup[]) => void;
}

export function MuscleGroupCards({ onSelectMuscleGroup }: MuscleGroupCardsProps) {
  return (
    <section className="py-12">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Browse by Muscle Group</h2>
          <p className="text-muted-foreground">
            Click any muscle group to see targeted exercises
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {muscleGroups.map((group) => {
            const count = getExerciseCount(group.muscles);
            
            return (
              <Card
                key={group.id}
                className="group relative overflow-hidden cursor-pointer aspect-[3/4] border-0"
                onClick={() => onSelectMuscleGroup(group.muscles)}
              >
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url(${group.image})` }}
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                
                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-4">
                  <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                    {group.name}
                  </h3>
                  <Badge variant="secondary" className="w-fit text-xs">
                    {count} exercises
                  </Badge>
                </div>
                
                {/* Hover border effect */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/50 rounded-lg transition-colors" />
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
