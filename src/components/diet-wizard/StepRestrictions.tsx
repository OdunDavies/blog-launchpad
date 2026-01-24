import { AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface StepRestrictionsProps {
  restrictions: string[];
  toggleRestriction: (restriction: string) => void;
}

const restrictionOptions = [
  { value: 'gluten-free', label: 'Gluten-Free', description: 'No wheat, barley, rye' },
  { value: 'dairy-free', label: 'Dairy-Free', description: 'No milk products' },
  { value: 'nut-free', label: 'Nut-Free', description: 'No tree nuts or peanuts' },
  { value: 'shellfish-free', label: 'Shellfish-Free', description: 'No shrimp, crab, lobster' },
  { value: 'egg-free', label: 'Egg-Free', description: 'No eggs or egg products' },
  { value: 'soy-free', label: 'Soy-Free', description: 'No soy products' },
  { value: 'halal', label: 'Halal', description: 'Islamic dietary laws' },
  { value: 'kosher', label: 'Kosher', description: 'Jewish dietary laws' },
];

export function StepRestrictions({ restrictions, toggleRestriction }: StepRestrictionsProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div className="p-3 rounded-full bg-primary/10">
            <AlertCircle className="w-8 h-8 text-primary" />
          </div>
        </div>
        <h3 className="text-xl font-semibold">Any dietary restrictions?</h3>
        <p className="text-muted-foreground">Select all that apply (optional)</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
        {restrictionOptions.map((option) => {
          const isSelected = restrictions.includes(option.value);
          return (
            <Card
              key={option.value}
              className={`cursor-pointer transition-all duration-200 hover:border-primary ${
                isSelected ? 'border-primary bg-primary/5' : ''
              }`}
              onClick={() => toggleRestriction(option.value)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <Checkbox 
                    id={`restriction-${option.value}`}
                    checked={isSelected}
                    onCheckedChange={() => toggleRestriction(option.value)}
                  />
                  <Label htmlFor={`restriction-${option.value}`} className="cursor-pointer">
                    <CardTitle className="text-lg">{option.label}</CardTitle>
                  </Label>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription>{option.description}</CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
