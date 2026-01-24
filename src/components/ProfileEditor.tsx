import { User, Activity, Trash2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProfile } from '@/hooks/useProfile';
import { ActivityLevel } from '@/types/diet';
import { calculateTDEEWithRecommendations } from '@/utils/tdeeCalculator';

const activityLevels: { value: ActivityLevel; label: string; description: string }[] = [
  { value: 'sedentary', label: 'Sedentary', description: 'Little to no exercise' },
  { value: 'light', label: 'Lightly Active', description: '1-3 days/week' },
  { value: 'moderate', label: 'Moderately Active', description: '3-5 days/week' },
  { value: 'active', label: 'Very Active', description: '6-7 days/week' },
  { value: 'very-active', label: 'Extremely Active', description: 'Athlete/physical job' },
];

interface ProfileEditorProps {
  onSave?: () => void;
  showClearButton?: boolean;
}

export function ProfileEditor({ onSave, showClearButton = false }: ProfileEditorProps) {
  const { profile, updateProfile, clearProfile, isProfileComplete } = useProfile();

  // Calculate TDEE preview when profile is complete
  const tdeePreview = isProfileComplete 
    ? calculateTDEEWithRecommendations(profile, 'maintenance')
    : null;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div className="p-3 rounded-full bg-primary/10">
            <User className="w-8 h-8 text-primary" />
          </div>
        </div>
        <h3 className="text-xl font-semibold">Your Fitness Profile</h3>
        <p className="text-muted-foreground">This helps us personalize your workout and diet plans</p>
      </div>

      <div className="grid gap-6 max-w-md mx-auto">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">Name (optional)</Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter your name"
            value={profile.name || ''}
            onChange={(e) => updateProfile({ name: e.target.value })}
            className="max-w-[280px]"
          />
          <p className="text-xs text-muted-foreground">Used to personalize your plans</p>
        </div>

        {/* Gender */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Gender</Label>
          <RadioGroup
            value={profile.gender}
            onValueChange={(value) => updateProfile({ gender: value as 'male' | 'female' | 'other' })}
            className="flex gap-4"
          >
            {['male', 'female', 'other'].map((g) => (
              <Label
                key={g}
                htmlFor={`gender-${g}`}
                className="flex items-center gap-2 cursor-pointer"
              >
                <RadioGroupItem value={g} id={`gender-${g}`} />
                <span className="capitalize">{g}</span>
              </Label>
            ))}
          </RadioGroup>
        </div>

        {/* Age */}
        <div className="space-y-2">
          <Label htmlFor="age" className="text-sm font-medium">Age</Label>
          <Input
            id="age"
            type="number"
            placeholder="25"
            value={profile.age || ''}
            onChange={(e) => updateProfile({ age: parseInt(e.target.value) || 0 })}
            min="15"
            max="100"
            className="max-w-[120px]"
          />
        </div>

        {/* Weight */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Weight</Label>
          <div className="flex gap-3">
            <Input
              type="number"
              placeholder={profile.weightUnit === 'kg' ? '70' : '154'}
              value={profile.weight || ''}
              onChange={(e) => updateProfile({ weight: parseFloat(e.target.value) || 0 })}
              min="30"
              max="300"
              className="flex-1 max-w-[120px]"
            />
            <Tabs
              value={profile.weightUnit}
              onValueChange={(v) => updateProfile({ weightUnit: v as 'kg' | 'lbs' })}
            >
              <TabsList className="h-10">
                <TabsTrigger value="kg" className="px-4">kg</TabsTrigger>
                <TabsTrigger value="lbs" className="px-4">lbs</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Height */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Height</Label>
          <div className="flex gap-3 items-center">
            {profile.heightUnit === 'cm' ? (
              <Input
                type="number"
                placeholder="175"
                value={profile.height || ''}
                onChange={(e) => updateProfile({ height: parseFloat(e.target.value) || 0 })}
                min="100"
                max="250"
                className="flex-1 max-w-[120px]"
              />
            ) : (
              <div className="flex gap-2 items-center">
                <Input
                  type="number"
                  placeholder="5"
                  value={profile.height || ''}
                  onChange={(e) => updateProfile({ height: parseInt(e.target.value) || 0 })}
                  min="3"
                  max="8"
                  className="w-16"
                />
                <span className="text-muted-foreground">ft</span>
                <Input
                  type="number"
                  placeholder="9"
                  value={profile.heightInches || ''}
                  onChange={(e) => updateProfile({ heightInches: parseInt(e.target.value) || 0 })}
                  min="0"
                  max="11"
                  className="w-16"
                />
                <span className="text-muted-foreground">in</span>
              </div>
            )}
            <Tabs
              value={profile.heightUnit}
              onValueChange={(v) => updateProfile({ heightUnit: v as 'cm' | 'ft' })}
            >
              <TabsList className="h-10">
                <TabsTrigger value="cm" className="px-4">cm</TabsTrigger>
                <TabsTrigger value="ft" className="px-4">ft/in</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Activity Level */}
        <div className="space-y-3">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Activity Level
          </Label>
          <Select
            value={profile.activityLevel}
            onValueChange={(value) => updateProfile({ activityLevel: value as ActivityLevel })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select activity level" />
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
        <div className="space-y-2">
          <Label className="text-sm font-medium">Training Days Per Week</Label>
          <Select
            value={profile.trainingDays.toString()}
            onValueChange={(value) => updateProfile({ trainingDays: parseInt(value) })}
          >
            <SelectTrigger className="max-w-[200px]">
              <SelectValue placeholder="Select days" />
            </SelectTrigger>
            <SelectContent>
              {[0, 1, 2, 3, 4, 5, 6, 7].map((days) => (
                <SelectItem key={days} value={days.toString()}>
                  {days === 0 ? 'No training' : `${days} day${days > 1 ? 's' : ''}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* TDEE Preview with Plain Language Explanations */}
        {tdeePreview && (
          <div className="p-5 rounded-lg bg-primary/5 border border-primary/20 space-y-4">
            <p className="text-sm font-semibold text-primary flex items-center gap-2">
              📊 Your Daily Energy Stats
            </p>
            
            <div className="space-y-3">
              {/* BMR */}
              <div className="space-y-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-medium">BMR (Basal Metabolic Rate)</span>
                </div>
                <p className="text-2xl font-bold text-foreground">
                  {Math.round(tdeePreview.bmr).toLocaleString()} <span className="text-base font-normal text-muted-foreground">kcal</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  Calories your body burns at rest just to stay alive — breathing, heartbeat, brain function
                </p>
              </div>

              {/* TDEE */}
              <div className="space-y-1 pt-2 border-t border-primary/10">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-medium">TDEE (Total Daily Energy Expenditure)</span>
                </div>
                <p className="text-2xl font-bold text-primary">
                  {Math.round(tdeePreview.tdee).toLocaleString()} <span className="text-base font-normal text-muted-foreground">kcal</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  Total calories you burn each day including all your daily activities and exercise
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end pt-4">
          {showClearButton && (
            <Button variant="outline" onClick={clearProfile} className="gap-2">
              <Trash2 className="w-4 h-4" />
              Clear
            </Button>
          )}
          {onSave && (
            <Button onClick={onSave} disabled={!isProfileComplete}>
              Save Profile
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
