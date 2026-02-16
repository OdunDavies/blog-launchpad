import { useState } from 'react';
import { X, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const DomainMigrationBanner = () => {
  const [dismissed, setDismissed] = useState(() => 
    sessionStorage.getItem('domain-banner-dismissed') === 'true'
  );

  const isOldDomain = window.location.hostname.includes('netlify.app');

  if (!isOldDomain || dismissed) return null;

  const newUrl = `https://www.muscleatlas.site${window.location.pathname}${window.location.hash}`;

  const handleDismiss = () => {
    sessionStorage.setItem('domain-banner-dismissed', 'true');
    setDismissed(true);
  };

  return (
    <div className="sticky top-0 z-[60] bg-destructive text-destructive-foreground px-4 py-3">
      <div className="container max-w-6xl mx-auto flex items-center justify-between gap-3">
        <p className="text-sm font-medium">
          We've moved! Visit us at <strong>www.muscleatlas.site</strong> for the best experience.
        </p>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            size="sm"
            variant="secondary"
            className="gap-1.5"
            onClick={() => window.location.href = newUrl}
          >
            Go to new site
            <ExternalLink className="w-3.5 h-3.5" />
          </Button>
          <button
            onClick={handleDismiss}
            className="p-1 rounded-md hover:bg-destructive-foreground/20 transition-colors"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
