import { CuisineType } from '@/types/diet';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Globe, Info } from 'lucide-react';

interface StepCuisineProps {
  cuisine: CuisineType;
  setCuisine: (value: CuisineType) => void;
}

const cuisineOptions: { 
  value: CuisineType; 
  label: string; 
  emoji: string;
  description: string;
}[] = [
  {
    value: 'international',
    label: 'International Mix',
    emoji: '🌍',
    description: 'Diverse global cuisine options',
  },
  {
    value: 'nigerian',
    label: 'Nigerian',
    emoji: '🇳🇬',
    description: 'Traditional Nigerian dishes',
  },
  {
    value: 'west-african',
    label: 'West African',
    emoji: '🌴',
    description: 'Regional West African flavors',
  },
];

const africanFoods = {
  proteins: ['Suya', 'Kilishi', 'Stockfish', 'Goat Meat', 'Grilled Tilapia', 'Asun'],
  carbs: ['Jollof Rice', 'Pounded Yam', 'Eba', 'Amala', 'Moi Moi', 'Akara'],
  soups: ['Egusi Soup', 'Okra Soup', 'Efo Riro', 'Ogbono Soup', 'Pepper Soup'],
};

export function StepCuisine({ cuisine, setCuisine }: StepCuisineProps) {
  const showAfricanInfo = cuisine === 'nigerian' || cuisine === 'west-african';

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
          <Globe className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-lg sm:text-xl font-semibold">Choose Your Cuisine Preference</h3>
        <p className="text-sm text-muted-foreground">
          Select the type of foods you prefer in your meals
        </p>
      </div>

      <RadioGroup
        value={cuisine}
        onValueChange={(value) => setCuisine(value as CuisineType)}
        className="grid gap-3"
      >
        {cuisineOptions.map((option) => {
          const isSelected = cuisine === option.value;
          
          return (
            <Label
              key={option.value}
              htmlFor={`cuisine-${option.value}`}
              className="cursor-pointer"
            >
              <Card
                className={`transition-all hover:border-primary ${
                  isSelected ? 'border-primary bg-primary/5 ring-1 ring-primary' : ''
                }`}
              >
                <CardContent className="flex items-center gap-4 p-4">
                  <RadioGroupItem value={option.value} id={`cuisine-${option.value}`} className="sr-only" />
                  <div 
                    className={`w-12 h-12 rounded-lg shrink-0 flex items-center justify-center text-2xl ${
                      isSelected ? 'bg-primary/20' : 'bg-muted'
                    }`}
                  >
                    {option.emoji}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{option.label}</p>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </div>
                </CardContent>
              </Card>
            </Label>
          );
        })}
      </RadioGroup>

      {showAfricanInfo && (
        <Card className="bg-muted/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-4 h-4 text-primary" />
              <span className="font-medium text-sm">Available Foods</span>
            </div>
            <div className="space-y-2 text-xs">
              <div>
                <span className="font-medium text-muted-foreground">Proteins: </span>
                <span>{africanFoods.proteins.join(', ')}</span>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Carbs: </span>
                <span>{africanFoods.carbs.join(', ')}</span>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Soups: </span>
                <span>{africanFoods.soups.join(', ')}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
