import { useState } from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import { ProfileEditor } from './ProfileEditor';
import { Button } from '@/components/ui/button';
import { User, AlertCircle } from 'lucide-react';

export function ProfileStatusBadge() {
  const [editorOpen, setEditorOpen] = useState(false);
  const { profile, isProfileComplete } = useProfile();

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setEditorOpen(true)}
        className="gap-1 sm:gap-2 px-2 sm:px-3"
      >
        {!isProfileComplete && (
          <AlertCircle className="w-4 h-4 text-destructive" />
        )}
        <User className="w-4 h-4" />
        <span className="hidden md:inline text-sm">
          {profile.name || 'Set Profile'}
        </span>
      </Button>
      <ProfileEditor open={editorOpen} onClose={() => setEditorOpen(false)} />
    </>
  );
}
