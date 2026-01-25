import { DietaryRestriction, RESTRICTION_LABELS } from '@/types/diet';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { AlertTriangle } from 'lucide-react';

interface StepRestrictionsProps {
  restrictions: DietaryRestriction[];
  setRestrictions: (value: DietaryRestriction[]) => void;
}

const restrictionOptions: { value: DietaryRestriction; label: string; description: string }[] = [
  { value: 'gluten_free', label: 'Gluten-Free', description: 'No wheat, barley, or rye' },
  { value: 'dairy_free', label: 'Dairy-Free', description: 'No milk, cheese, or butter' },
  { value: 'nut_free', label: 'Nut-Free', description: 'No tree nuts or peanuts' },
  { value: 'shellfish_free', label: 'Shellfish-Free', description: 'No shrimp, crab, or lobster' },
  { value: 'soy_free', label: 'Soy-Free', description: 'No soy or soy products' },
  { value: 'egg_free', label: 'Egg-Free', description: 'No eggs or egg products' },
  { value: 'halal', label: 'Halal', description: 'Islamic dietary guidelines' },
  { value: 'kosher', label: 'Kosher', description: 'Jewish dietary guidelines' },
];

export function StepRestrictions({ restrictions, setRestrictions }: StepRestrictionsProps) {
  const toggleRestriction = (value: DietaryRestriction) => {
    if (restrictions.includes(value)) {
      setRestrictions(restrictions.filter(r => r !== value));
    } else {
      setRestrictions([...restrictions, value]);
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      <div>
        <h3 className="text-base sm:text-lg font-semibold">Any dietary restrictions?</h3>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Select all that apply (optional)
        </p>
      </div>

      <div className="grid gap-2 sm:gap-3 grid-cols-1 sm:grid-cols-2">
        {restrictionOptions.map((option) => (
          <Card
            key={option.value}
            className={`cursor-pointer transition-all hover:border-primary ${
              restrictions.includes(option.value) ? 'border-primary bg-primary/5 ring-1 ring-primary' : ''
            }`}
            onClick={() => toggleRestriction(option.value)}
          >
            <CardContent className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4">
              <Checkbox
                id={`restriction-${option.value}`}
                checked={restrictions.includes(option.value)}
                onCheckedChange={() => toggleRestriction(option.value)}
                className="shrink-0"
              />
              <div className="flex-1 min-w-0">
                <Label htmlFor={`restriction-${option.value}`} className="cursor-pointer font-medium text-sm">
                  {option.label}
                </Label>
                <p className="text-xs text-muted-foreground">{option.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {restrictions.length > 0 && (
        <Card className="bg-muted/50">
          <CardContent className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4">
            <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="font-medium text-xs sm:text-sm">Selected Restrictions</p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Your meal plan will exclude: {restrictions.map(r => RESTRICTION_LABELS[r]).join(', ')}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
