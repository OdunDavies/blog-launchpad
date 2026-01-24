import { User } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface StepProfileProps {
  gender: string;
  setGender: (value: string) => void;
}

const genderOptions = [
  { value: 'male', label: 'Male', description: 'Optimize for male physiology' },
  { value: 'female', label: 'Female', description: 'Optimize for female physiology' },
];

export function StepProfile({ gender, setGender }: StepProfileProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div className="p-3 rounded-full bg-primary/10">
            <User className="w-8 h-8 text-primary" />
          </div>
        </div>
        <h3 className="text-xl font-semibold">Tell us about yourself</h3>
        <p className="text-muted-foreground">This helps us personalize your workout plan</p>
      </div>

      <RadioGroup
        value={gender}
        onValueChange={setGender}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto"
      >
        {genderOptions.map((option) => (
          <Label
            key={option.value}
            htmlFor={`gender-${option.value}`}
            className="cursor-pointer"
          >
            <Card
              className={`transition-all duration-200 hover:border-primary ${
                gender === option.value ? 'border-primary bg-primary/5' : ''
              }`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <RadioGroupItem value={option.value} id={`gender-${option.value}`} />
                  <CardTitle className="text-lg">{option.label}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription>{option.description}</CardDescription>
              </CardContent>
            </Card>
          </Label>
        ))}
      </RadioGroup>
    </div>
  );
}
