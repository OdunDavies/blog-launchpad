import { useState } from 'react';
import { User, ChevronRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useProfile } from '@/hooks/useProfile';
import { ProfileEditor } from './ProfileEditor';

export function ProfileStatusBadge() {
  const { profile, isProfileComplete } = useProfile();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSave = () => {
    setDialogOpen(false);
  };

  return (
    <>
      <Button
        variant={isProfileComplete ? "outline" : "default"}
        size="sm"
        onClick={() => setDialogOpen(true)}
        className="gap-2"
      >
        <User className="w-4 h-4" />
        {isProfileComplete ? (
          <>
            <span className="hidden sm:inline">
              {profile.name ? `${profile.name}, ` : ''}{profile.weight}{profile.weightUnit}, {profile.age}yo
            </span>
            <Check className="w-3 h-3 text-primary" />
          </>
        ) : (
          <>
            <span className="hidden sm:inline">Set up profile</span>
            <ChevronRight className="w-3 h-3" />
          </>
        )}
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Fitness Profile</DialogTitle>
            <DialogDescription>
              Your profile is used to personalize AI-generated workout and diet plans.
            </DialogDescription>
          </DialogHeader>
          <ProfileEditor onSave={handleSave} showClearButton />
        </DialogContent>
      </Dialog>
    </>
  );
}
