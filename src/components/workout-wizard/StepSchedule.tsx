import { Calendar } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface StepScheduleProps {
  splitDays: string;
  setSplitDays: (value: string) => void;
}

const scheduleOptions = [
  { value: '3', label: '3 Days', description: 'Perfect for beginners or busy schedules' },
  { value: '4', label: '4 Days', description: 'Balanced split with adequate rest' },
  { value: '5', label: '5 Days', description: 'Intermediate level training' },
  { value: '6', label: '6 Days', description: 'Advanced high-frequency training' },
];

export function StepSchedule({ splitDays, setSplitDays }: StepScheduleProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div className="p-3 rounded-full bg-primary/10">
            <Calendar className="w-8 h-8 text-primary" />
          </div>
        </div>
        <h3 className="text-xl font-semibold">How many days per week can you train?</h3>
        <p className="text-muted-foreground">Choose a schedule that fits your lifestyle</p>
      </div>

      <RadioGroup
        value={splitDays}
        onValueChange={setSplitDays}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        {scheduleOptions.map((option) => (
          <Label
            key={option.value}
            htmlFor={`schedule-${option.value}`}
            className="cursor-pointer"
          >
            <Card
              className={`transition-all duration-200 hover:border-primary ${
                splitDays === option.value ? 'border-primary bg-primary/5' : ''
              }`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <RadioGroupItem value={option.value} id={`schedule-${option.value}`} />
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
