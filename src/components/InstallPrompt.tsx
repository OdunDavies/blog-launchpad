import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Smartphone, X } from "lucide-react";

const STORAGE_KEY = "muscleatlas-install-prompt-shown";

export function InstallPrompt() {
  const [open, setOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const hasSeenPrompt = localStorage.getItem(STORAGE_KEY);
    const isInstalled = window.matchMedia("(display-mode: standalone)").matches;

    if (!hasSeenPrompt && !isInstalled) {
      // Small delay so user sees the app first
      const timer = setTimeout(() => setOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setDeferredPrompt(null);
      }
    }
    handleDismiss();
  };

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Smartphone className="h-6 w-6 text-primary" />
            Save MuscleAtlas
          </DialogTitle>
          <DialogDescription className="text-base pt-2">
            Add MuscleAtlas to your home screen for quick access to your workouts anytime, anywhere.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          <div className="flex items-start gap-3 text-sm text-muted-foreground">
            <Download className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <span>Works offline — no internet needed</span>
          </div>
          <div className="flex items-start gap-3 text-sm text-muted-foreground">
            <Smartphone className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <span>Launches instantly like a native app</span>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button variant="ghost" onClick={handleDismiss}>
            Maybe Later
          </Button>
          <Button onClick={handleInstall} className="gap-2">
            <Download className="h-4 w-4" />
            Add to Home Screen
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
