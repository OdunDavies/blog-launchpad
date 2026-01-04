import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Smartphone, Share, Plus } from "lucide-react";

const STORAGE_KEY = "muscleatlas-install-prompt-shown";

// Detect iOS
const isIOS = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
};

// Detect if in standalone mode (already installed)
const isStandalone = () => {
  return window.matchMedia("(display-mode: standalone)").matches || 
         (navigator as any).standalone === true;
};

export function InstallPrompt() {
  const [open, setOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [platform, setPlatform] = useState<"ios" | "android" | "other">("other");

  useEffect(() => {
    const hasSeenPrompt = localStorage.getItem(STORAGE_KEY);

    if (!hasSeenPrompt && !isStandalone()) {
      // Detect platform
      if (isIOS()) {
        setPlatform("ios");
      } else if (/android/i.test(navigator.userAgent)) {
        setPlatform("android");
      }
      
      // Small delay so user sees the app first
      const timer = setTimeout(() => setOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setPlatform("android"); // Chrome/Android supports beforeinstallprompt
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
            Install MuscleAtlas
          </DialogTitle>
          <DialogDescription className="text-base pt-2">
            Add MuscleAtlas to your home screen for quick access to your workouts anytime, anywhere.
          </DialogDescription>
        </DialogHeader>

        {platform === "ios" ? (
          <div className="space-y-4 py-4">
            <p className="text-sm font-medium">To install on your iPhone or iPad:</p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-lg">1</span>
                </div>
                <span className="flex items-center gap-1">
                  Tap the <Share className="h-4 w-4 inline mx-1" /> Share button in Safari
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-lg">2</span>
                </div>
                <span className="flex items-center gap-1">
                  Scroll down and tap <Plus className="h-4 w-4 inline mx-1" /> "Add to Home Screen"
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-lg">3</span>
                </div>
                <span>Tap "Add" to confirm</span>
              </div>
            </div>
          </div>
        ) : (
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
        )}

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button variant="ghost" onClick={handleDismiss}>
            Maybe Later
          </Button>
          {platform === "ios" ? (
            <Button onClick={handleDismiss} className="gap-2">
              Got It
            </Button>
          ) : (
            <Button onClick={handleInstall} className="gap-2">
              <Download className="h-4 w-4" />
              Add to Home Screen
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
