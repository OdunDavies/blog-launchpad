import { useState, useEffect } from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import { ActivityLevel, ACTIVITY_LEVEL_LABELS } from '@/types/diet';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent } from '@/components/ui/card';
import { User, Scale, Ruler, Calendar, Activity, Flame, Zap, Save } from 'lucide-react';
import { toast } from 'sonner';

interface ProfileEditorProps {
  open: boolean;
  onClose: () => void;
}

export function ProfileEditor({ open, onClose }: ProfileEditorProps) {
  const { profile, updateProfile, bmr, tdee } = useProfile();

  const [localProfile, setLocalProfile] = useState({
    name: profile.name || '',
    gender: profile.gender || '',
    age: profile.age?.toString() || '',
    weight: profile.weight?.toString() || '',
    height: profile.height?.toString() || '',
    activityLevel: profile.activityLevel || '',
  });

  // Sync local state when profile changes
  useEffect(() => {
    setLocalProfile({
      name: profile.name || '',
      gender: profile.gender || '',
      age: profile.age?.toString() || '',
      weight: profile.weight?.toString() || '',
      height: profile.height?.toString() || '',
      activityLevel: profile.activityLevel || '',
    });
  }, [profile]);

  const handleSave = () => {
    updateProfile({
      name: localProfile.name || undefined,
      gender: localProfile.gender as 'male' | 'female' | undefined,
      age: localProfile.age ? parseInt(localProfile.age) : undefined,
      weight: localProfile.weight ? parseFloat(localProfile.weight) : undefined,
      height: localProfile.height ? parseFloat(localProfile.height) : undefined,
      activityLevel: localProfile.activityLevel as ActivityLevel | undefined,
    });
    toast.success('Profile saved successfully!');
    onClose();
  };

  const activityLevels: { value: ActivityLevel; label: string; description: string }[] = [
    { value: 'sedentary', label: 'Sedentary', description: 'Little to no exercise' },
    { value: 'lightly_active', label: 'Lightly Active', description: 'Light exercise 1-3 days/week' },
    { value: 'moderately_active', label: 'Moderately Active', description: 'Moderate exercise 3-5 days/week' },
    { value: 'very_active', label: 'Very Active', description: 'Hard exercise 6-7 days/week' },
    { value: 'extremely_active', label: 'Extremely Active', description: 'Very hard exercise, physical job' },
  ];

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Your Profile
          </SheetTitle>
          <SheetDescription>
            Enter your details for personalized calorie and macro calculations.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Name (optional)
            </Label>
            <Input
              id="name"
              placeholder="Your name"
              value={localProfile.name}
              onChange={(e) => setLocalProfile(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">Gender</Label>
            <RadioGroup
              value={localProfile.gender}
              onValueChange={(value) => setLocalProfile(prev => ({ ...prev, gender: value }))}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="male" />
                <Label htmlFor="male" className="cursor-pointer">Male</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="female" />
                <Label htmlFor="female" className="cursor-pointer">Female</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Age */}
          <div className="space-y-2">
            <Label htmlFor="age" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Age
            </Label>
            <Input
              id="age"
              type="number"
              placeholder="e.g., 25"
              min="10"
              max="100"
              value={localProfile.age}
              onChange={(e) => setLocalProfile(prev => ({ ...prev, age: e.target.value }))}
            />
          </div>

          {/* Weight */}
          <div className="space-y-2">
            <Label htmlFor="weight" className="flex items-center gap-2">
              <Scale className="w-4 h-4" />
              Weight (kg)
            </Label>
            <Input
              id="weight"
              type="number"
              placeholder="e.g., 70"
              min="30"
              max="300"
              step="0.1"
              value={localProfile.weight}
              onChange={(e) => setLocalProfile(prev => ({ ...prev, weight: e.target.value }))}
            />
          </div>

          {/* Height */}
          <div className="space-y-2">
            <Label htmlFor="height" className="flex items-center gap-2">
              <Ruler className="w-4 h-4" />
              Height (cm)
            </Label>
            <Input
              id="height"
              type="number"
              placeholder="e.g., 175"
              min="100"
              max="250"
              value={localProfile.height}
              onChange={(e) => setLocalProfile(prev => ({ ...prev, height: e.target.value }))}
            />
          </div>

          {/* Activity Level */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Activity Level
            </Label>
            <Select
              value={localProfile.activityLevel}
              onValueChange={(value) => setLocalProfile(prev => ({ ...prev, activityLevel: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your activity level" />
              </SelectTrigger>
              <SelectContent>
                {activityLevels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    <div className="flex flex-col">
                      <span>{level.label}</span>
                      <span className="text-xs text-muted-foreground">{level.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Calculated Values */}
          {(bmr || tdee) && (
            <Card className="bg-muted/50">
              <CardContent className="pt-4">
                <h4 className="font-medium mb-3">Your Metabolic Stats</h4>
                <div className="grid grid-cols-2 gap-4">
                  {bmr && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Flame className="w-4 h-4" />
                        BMR
                      </div>
                      <p className="text-2xl font-bold">{bmr.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">
                        Calories burned at rest
                      </p>
                    </div>
                  )}
                  {tdee && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Zap className="w-4 h-4" />
                        TDEE
                      </div>
                      <p className="text-2xl font-bold">{tdee.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">
                        Total daily calories
                      </p>
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  <strong>BMR</strong> = calories your body needs just to stay alive. 
                  <strong> TDEE</strong> = total calories burned per day including activity.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Save Button */}
          <Button onClick={handleSave} className="w-full" size="lg">
            <Save className="w-4 h-4 mr-2" />
            Save Profile
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
