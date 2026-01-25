import { DietaryRestriction, RESTRICTION_LABELS } from '@/types/diet';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { AlertTriangle, ShieldAlert } from 'lucide-react';

interface StepRestrictionsProps {
  restrictions: string[];
  toggleRestriction: (value: string) => void;
}

const restrictionOptions: { value: DietaryRestriction; label: string; description: string }[] = [
  { value: 'gluten-free', label: 'Gluten-Free', description: 'No wheat, barley, or rye' },
  { value: 'dairy-free', label: 'Dairy-Free', description: 'No milk, cheese, or butter' },
  { value: 'nut-free', label: 'Nut-Free', description: 'No tree nuts or peanuts' },
  { value: 'shellfish-free', label: 'Shellfish-Free', description: 'No shrimp, crab, or lobster' },
  { value: 'soy-free', label: 'Soy-Free', description: 'No soy or soy products' },
  { value: 'egg-free', label: 'Egg-Free', description: 'No eggs or egg products' },
  { value: 'halal', label: 'Halal', description: 'Islamic dietary guidelines' },
  { value: 'kosher', label: 'Kosher', description: 'Jewish dietary guidelines' },
];

export function StepRestrictions({ restrictions, toggleRestriction }: StepRestrictionsProps) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
          <ShieldAlert className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-lg sm:text-xl font-semibold">Any Dietary Restrictions?</h3>
        <p className="text-sm text-muted-foreground">
          Select all that apply (optional)
        </p>
      </div>

      <div className="grid gap-2 sm:gap-3 grid-cols-1 sm:grid-cols-2">
        {restrictionOptions.map((option) => {
          const isSelected = restrictions.includes(option.value);
          
          return (
            <Card
              key={option.value}
              className={`cursor-pointer transition-all hover:border-primary ${
                isSelected ? 'border-primary bg-primary/5 ring-1 ring-primary' : ''
              }`}
              onClick={() => toggleRestriction(option.value)}
            >
              <CardContent className="flex items-center gap-3 p-3 sm:p-4">
                <Checkbox
                  id={`restriction-${option.value}`}
                  checked={isSelected}
                  onCheckedChange={() => toggleRestriction(option.value)}
                  className="shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <Label 
                    htmlFor={`restriction-${option.value}`} 
                    className="cursor-pointer font-medium text-sm"
                  >
                    {option.label}
                  </Label>
                  <p className="text-xs text-muted-foreground">{option.description}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {restrictions.length > 0 && (
        <Card className="bg-amber-500/10 border-amber-500/30">
          <CardContent className="flex items-start gap-3 p-3 sm:p-4">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="font-medium text-sm">Selected Restrictions</p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Your meal plan will exclude: {restrictions.map(r => RESTRICTION_LABELS[r as DietaryRestriction] || r).join(', ')}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
