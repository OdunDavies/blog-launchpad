import { Card } from '@/components/ui/card';
import { Globe, Wheat } from 'lucide-react';
import { CuisineType } from '@/types/diet';

interface StepCuisineProps {
  cuisine: CuisineType;
  setCuisine: (cuisine: CuisineType) => void;
}

const cuisineOptions = [
  {
    value: 'international' as CuisineType,
    label: 'International Mix',
    emoji: '🌍',
    icon: Globe,
    description: 'Varied global cuisines with diverse protein sources',
  },
  {
    value: 'nigerian' as CuisineType,
    label: 'Nigerian',
    emoji: '🇳🇬',
    icon: null,
    description: 'Traditional Nigerian dishes with high protein focus',
  },
  {
    value: 'west-african' as CuisineType,
    label: 'West African',
    emoji: '🌾',
    icon: Wheat,
    description: 'Regional West African foods and flavors',
  },
];

export function StepCuisine({ cuisine, setCuisine }: StepCuisineProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="text-4xl">🍽️</div>
        <h3 className="text-lg font-semibold">Choose your cuisine preference</h3>
        <p className="text-sm text-muted-foreground">
          Select foods you're familiar with for better meal adherence
        </p>
      </div>

      <div className="grid gap-4">
        {cuisineOptions.map((option) => (
          <Card
            key={option.value}
            className={`p-4 cursor-pointer transition-all hover:border-primary/50 ${
              cuisine === option.value
                ? 'border-primary bg-primary/5 ring-1 ring-primary'
                : 'border-border'
            }`}
            onClick={() => setCuisine(option.value)}
          >
            <div className="flex items-center gap-4">
              <div className="text-3xl">{option.emoji}</div>
              <div className="flex-1">
                <h4 className="font-medium">{option.label}</h4>
                <p className="text-sm text-muted-foreground">{option.description}</p>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  cuisine === option.value
                    ? 'border-primary bg-primary'
                    : 'border-muted-foreground/30'
                }`}
              >
                {cuisine === option.value && (
                  <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {cuisine === 'nigerian' && (
        <div className="p-4 bg-muted/50 rounded-lg border">
          <h4 className="font-medium text-sm mb-2">🥩 High-Protein Nigerian Foods Included:</h4>
          <div className="text-sm text-muted-foreground space-y-1">
            <p><strong>Proteins:</strong> Suya, Grilled Fish, Goat Meat, Kilishi, Stockfish, Catfish, Snails</p>
            <p><strong>Carbs:</strong> Ofada Rice, Yam, Plantain, Moi Moi, Brown Beans, Akara</p>
            <p><strong>Soups:</strong> Egusi, Efo Riro, Pepper Soup, Edikang Ikong, Ogbono</p>
          </div>
        </div>
      )}

      {cuisine === 'west-african' && (
        <div className="p-4 bg-muted/50 rounded-lg border">
          <h4 className="font-medium text-sm mb-2">🌍 West African Foods Included:</h4>
          <div className="text-sm text-muted-foreground space-y-1">
            <p><strong>Proteins:</strong> Grilled meats, Fish stews, Groundnut soups, Bean dishes</p>
            <p><strong>Carbs:</strong> Jollof rice, Fufu varieties, Banku, Kenkey, Cassava</p>
            <p><strong>Dishes:</strong> Palava sauce, Kontomire, Light soup, Groundnut soup</p>
          </div>
        </div>
      )}
    </div>
  );
}
