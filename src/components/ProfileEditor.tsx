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
import { Slider } from '@/components/ui/slider';
import { User, Scale, Ruler, Calendar, Activity, Flame, Zap, Save, Dumbbell } from 'lucide-react';
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
    weightUnit: profile.weightUnit || 'kg',
    height: profile.height?.toString() || '',
    heightUnit: profile.heightUnit || 'cm',
    heightInches: profile.heightInches?.toString() || '',
    activityLevel: profile.activityLevel || '',
    trainingDays: profile.trainingDays || 3,
  });

  // Sync local state when profile changes
  useEffect(() => {
    setLocalProfile({
      name: profile.name || '',
      gender: profile.gender || '',
      age: profile.age?.toString() || '',
      weight: profile.weight?.toString() || '',
      weightUnit: profile.weightUnit || 'kg',
      height: profile.height?.toString() || '',
      heightUnit: profile.heightUnit || 'cm',
      heightInches: profile.heightInches?.toString() || '',
      activityLevel: profile.activityLevel || '',
      trainingDays: profile.trainingDays || 3,
    });
  }, [profile]);

  const handleSave = () => {
    updateProfile({
      name: localProfile.name || undefined,
      gender: localProfile.gender as 'male' | 'female' | undefined,
      age: localProfile.age ? parseInt(localProfile.age) : undefined,
      weight: localProfile.weight ? parseFloat(localProfile.weight) : undefined,
      weightUnit: localProfile.weightUnit as 'kg' | 'lbs',
      height: localProfile.height ? parseFloat(localProfile.height) : undefined,
      heightUnit: localProfile.heightUnit as 'cm' | 'ft',
      heightInches: localProfile.heightInches ? parseFloat(localProfile.heightInches) : undefined,
      activityLevel: localProfile.activityLevel as ActivityLevel | undefined,
      trainingDays: localProfile.trainingDays,
    });
    toast.success('Profile saved successfully!');
    onClose();
  };

  const activityLevels: { value: ActivityLevel; label: string; description: string }[] = [
    { value: 'sedentary', label: 'Sedentary', description: 'Little to no exercise' },
    { value: 'light', label: 'Lightly Active', description: 'Light exercise 1-3 days/week' },
    { value: 'moderate', label: 'Moderately Active', description: 'Moderate exercise 3-5 days/week' },
    { value: 'active', label: 'Very Active', description: 'Hard exercise 6-7 days/week' },
    { value: 'very-active', label: 'Extremely Active', description: 'Very hard exercise, physical job' },
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
              Weight
            </Label>
            <div className="flex gap-2">
              <Input
                id="weight"
                type="number"
                placeholder={localProfile.weightUnit === 'kg' ? 'e.g., 70' : 'e.g., 154'}
                min="30"
                max="300"
                step="0.1"
                value={localProfile.weight}
                onChange={(e) => setLocalProfile(prev => ({ ...prev, weight: e.target.value }))}
                className="flex-1"
              />
              <Select
                value={localProfile.weightUnit}
                onValueChange={(value: 'kg' | 'lbs') => setLocalProfile(prev => ({ ...prev, weightUnit: value }))}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">kg</SelectItem>
                  <SelectItem value="lbs">lbs</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Height */}
          <div className="space-y-2">
            <Label htmlFor="height" className="flex items-center gap-2">
              <Ruler className="w-4 h-4" />
              Height
            </Label>
            <div className="flex gap-2">
              <Input
                id="height"
                type="number"
                placeholder={localProfile.heightUnit === 'cm' ? 'e.g., 175' : 'e.g., 5'}
                min={localProfile.heightUnit === 'cm' ? '100' : '3'}
                max={localProfile.heightUnit === 'cm' ? '250' : '8'}
                value={localProfile.height}
                onChange={(e) => setLocalProfile(prev => ({ ...prev, height: e.target.value }))}
                className="flex-1"
              />
              {localProfile.heightUnit === 'ft' && (
                <Input
                  type="number"
                  placeholder="in"
                  min="0"
                  max="11"
                  value={localProfile.heightInches}
                  onChange={(e) => setLocalProfile(prev => ({ ...prev, heightInches: e.target.value }))}
                  className="w-16"
                />
              )}
              <Select
                value={localProfile.heightUnit}
                onValueChange={(value: 'cm' | 'ft') => setLocalProfile(prev => ({ ...prev, heightUnit: value, heightInches: '' }))}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cm">cm</SelectItem>
                  <SelectItem value="ft">ft</SelectItem>
                </SelectContent>
              </Select>
            </div>
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

          {/* Training Days */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Dumbbell className="w-4 h-4" />
              Training Days per Week
            </Label>
            <div className="space-y-2">
              <Slider
                value={[localProfile.trainingDays]}
                onValueChange={(value) => setLocalProfile(prev => ({ ...prev, trainingDays: value[0] }))}
                min={1}
                max={7}
                step={1}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1 day</span>
                <span className="font-medium text-foreground">{localProfile.trainingDays} days</span>
                <span>7 days</span>
              </div>
            </div>
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
