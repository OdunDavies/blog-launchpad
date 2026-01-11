import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { decodeWorkout, DecodedWorkout, generateShareUrl, copyToClipboard } from '@/utils/shareWorkout';
import { generateWorkoutPdf } from '@/utils/downloadHtml';
import { Calendar, Dumbbell, Target, Download, Save, Share2, Sparkles, AlertCircle, Loader2, ArrowLeft, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAnalytics } from '@/hooks/useAnalytics';
import { ThemeToggle } from '@/components/ThemeToggle';

const STORAGE_KEY = 'workout-planner-saved-plans';

export default function SharedWorkout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { trackPdfDownload } = useAnalytics();
  
  const [workout, setWorkout] = useState<DecodedWorkout | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const planParam = searchParams.get('plan');
    
    if (!planParam) {
      setError('No workout plan found in the URL.');
      setIsLoading(false);
      return;
    }

    const decoded = decodeWorkout(planParam);
    
    if (!decoded) {
      setError('Invalid or corrupted workout link. Please request a new link.');
      setIsLoading(false);
      return;
    }

    setWorkout(decoded);
    setIsLoading(false);
  }, [searchParams]);

  const savePlan = () => {
    if (!workout || isSaving) return;
    
    setIsSaving(true);
    
    try {
      const existingPlans = localStorage.getItem(STORAGE_KEY);
      const plans = existingPlans ? JSON.parse(existingPlans) : [];
      
      const newPlan = {
        id: crypto.randomUUID(),
        name: workout.name,
        splitDays: workout.daysPerWeek,
        goal: workout.goal,
        gender: 'unspecified',
        targetMuscles: [],
        schedule: workout.schedule,
        savedAt: new Date().toISOString(),
      };
      
      plans.unshift(newPlan);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
      
      toast({
        title: 'Plan Saved!',
        description: 'The workout has been added to your saved plans.',
      });
    } catch (e) {
      console.error('Failed to save plan:', e);
      toast({
        title: 'Save Failed',
        description: 'Could not save the workout. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const downloadPlan = async () => {
    if (!workout || isDownloading) return;
    
    setIsDownloading(true);
    try {
      await generateWorkoutPdf({
        name: workout.name,
        daysPerWeek: workout.daysPerWeek,
        goal: workout.goal,
        schedule: workout.schedule,
      });
      
      trackPdfDownload(workout.name);
      
      toast({
        title: 'PDF Downloaded',
        description: 'Your workout plan has been saved as a PDF.',
      });
    } catch (e) {
      console.error('PDF generation failed:', e);
      toast({
        title: 'Download Failed',
        description: 'Could not generate PDF. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const copyLink = async () => {
    if (!workout) return;
    
    const url = window.location.href;
    const copied = await copyToClipboard(url);
    
    if (copied) {
      toast({
        title: 'Link Copied!',
        description: 'Share this link with others.',
      });
    } else {
      toast({
        title: 'Copy Failed',
        description: 'Could not copy link. Please copy from the address bar.',
        variant: 'destructive',
      });
    }
  };

  const goToGenerator = () => {
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading workout...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b sticky top-0 bg-background/95 backdrop-blur z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-xl font-bold">MuscleAtlas</h1>
            <ThemeToggle />
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-16">
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                <AlertCircle className="w-6 h-6 text-destructive" />
              </div>
              <CardTitle>Invalid Link</CardTitle>
              <CardDescription>{error}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={goToGenerator} className="w-full">
                <Sparkles className="w-4 h-4 mr-2" />
                Create Your Own Workout
              </Button>
              <Button variant="outline" onClick={() => navigate('/')} className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go to Home
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  if (!workout) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/')} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">MuscleAtlas</span>
          </Button>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Shared Badge */}
        <div className="flex justify-center mb-6">
          <Badge variant="secondary" className="px-4 py-1.5">
            <Share2 className="w-3 h-3 mr-2" />
            Shared Workout Plan
          </Badge>
        </div>

        {/* Workout Details */}
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <div className="space-y-4">
              <CardTitle className="text-2xl md:text-3xl text-center">
                {workout.name}
              </CardTitle>
              <div className="flex flex-wrap justify-center gap-3">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {workout.daysPerWeek} days/week
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Target className="w-3 h-3" />
                  {workout.goal.charAt(0).toUpperCase() + workout.goal.slice(1)}
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Schedule Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {workout.schedule.map((day, dayIndex) => (
                <Card key={dayIndex} className="bg-muted/50">
                  <CardHeader className="pb-2">
                    <Badge variant="outline" className="w-fit mb-1">
                      {day.day}
                    </Badge>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Dumbbell className="w-4 h-4" />
                      {day.focus}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-2">
                      {day.exercises.map((exercise, exerciseIndex) => (
                        <li key={exerciseIndex} className="text-sm">
                          <p className="font-medium">{exercise.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {exercise.sets} × {exercise.reps} • Rest: {exercise.rest}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
              <Button onClick={savePlan} className="flex-1" disabled={isSaving}>
                {isSaving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {isSaving ? 'Saving...' : 'Save to My Plans'}
              </Button>
              <Button onClick={downloadPlan} variant="outline" className="flex-1" disabled={isDownloading}>
                {isDownloading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                {isDownloading ? 'Generating...' : 'Download PDF'}
              </Button>
              <Button onClick={copyLink} variant="outline" className="flex-1">
                <Copy className="w-4 h-4 mr-2" />
                Copy Link
              </Button>
            </div>

            {/* CTA to create own */}
            <div className="text-center pt-4">
              <p className="text-sm text-muted-foreground mb-3">
                Want to create your own personalized workout?
              </p>
              <Button onClick={goToGenerator} variant="default" size="lg">
                <Sparkles className="w-4 h-4 mr-2" />
                Create Your Own Workout
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
