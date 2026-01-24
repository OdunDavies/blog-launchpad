import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExerciseLibrary } from '@/components/ExerciseLibrary';
import { WorkoutGenerator } from '@/components/WorkoutGenerator';
import { WorkoutTemplates } from '@/components/WorkoutTemplates';
import { WorkoutTracker } from '@/components/WorkoutTracker';
import { DietGenerator } from '@/components/DietGenerator';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ProfileStatusBadge } from '@/components/ProfileStatusBadge';
import { HeroSection } from '@/components/HeroSection';
import { Button } from '@/components/ui/button';
import { Dumbbell, Library, Sparkles, LayoutTemplate, ArrowUp, Salad, ClipboardList } from 'lucide-react';
import { MuscleGroup } from '@/data/exercises';

const Index = () => {
  const [activeTab, setActiveTab] = useState('library');
  const [selectedMuscleFilter, setSelectedMuscleFilter] = useState<MuscleGroup[]>([]);

  const handleExploreClick = () => {
    setActiveTab('library');
    setSelectedMuscleFilter([]);
    document.getElementById('main-content')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleGenerateClick = () => {
    setActiveTab('generator');
    document.getElementById('main-content')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleMuscleGroupSelect = (muscles: MuscleGroup[]) => {
    setSelectedMuscleFilter(muscles);
    setActiveTab('library');
    document.getElementById('main-content')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50" role="banner">
        <nav className="container max-w-6xl mx-auto px-4 py-4" aria-label="Main navigation">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-foreground text-background">
                <Dumbbell className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight">MuscleAtlas</span>
                <p className="text-xs text-muted-foreground hidden sm:block">Navigate your fitness journey</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ProfileStatusBadge />
              <ThemeToggle />
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <HeroSection 
        onExploreClick={handleExploreClick}
        onGenerateClick={handleGenerateClick}
      />

      {/* Main Content */}
      <main id="main-content" className="container max-w-6xl mx-auto px-4 py-8" role="main" aria-label="Main content">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-3xl grid-cols-5" aria-label="Content sections">
            <TabsTrigger value="library" className="flex items-center gap-2">
              <Library className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline">Exercise</span> Library
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <LayoutTemplate className="w-4 h-4" aria-hidden="true" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="generator" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline">AI</span> Workout
            </TabsTrigger>
            <TabsTrigger value="diet" className="flex items-center gap-2">
              <Salad className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline">AI</span> Diet
            </TabsTrigger>
            <TabsTrigger value="tracker" className="flex items-center gap-2">
              <ClipboardList className="w-4 h-4" aria-hidden="true" />
              Tracker
            </TabsTrigger>
          </TabsList>

          <TabsContent value="library" className="mt-6">
            <article>
              <header className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Exercise Library</h2>
                <p className="text-muted-foreground">
                  Browse our collection of exercises with video demonstrations and muscle targeting info.
                </p>
              </header>
              <ExerciseLibrary initialMuscleFilter={selectedMuscleFilter} />
            </article>
          </TabsContent>

          <TabsContent value="templates" className="mt-6">
            <article>
              <header className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Workout Templates</h2>
                <p className="text-muted-foreground">
                  Pre-made workout routines to get you started quickly. Click any template to view details.
                </p>
              </header>
              <WorkoutTemplates />
            </article>
          </TabsContent>

          <TabsContent value="generator" className="mt-6">
            <article>
              <header className="mb-6">
                <h2 className="text-2xl font-bold mb-2">AI Workout Generator</h2>
                <p className="text-muted-foreground">
                  Get a personalized workout split based on your goals and target muscles.
                </p>
              </header>
              <WorkoutGenerator />
            </article>
          </TabsContent>

          <TabsContent value="diet" className="mt-6">
            <article>
              <header className="mb-6">
                <h2 className="text-2xl font-bold mb-2">AI Diet Generator</h2>
                <p className="text-muted-foreground">
                  Get a personalized 7-day meal plan based on your goals, preferences, and cuisine.
                </p>
              </header>
              <DietGenerator />
            </article>
          </TabsContent>

          <TabsContent value="tracker" className="mt-6">
            <article>
              <header className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Workout Tracker</h2>
                <p className="text-muted-foreground">
                  Log your workouts, track your progress, and celebrate your personal records.
                </p>
              </header>
              <WorkoutTracker />
            </article>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t mt-auto bg-muted/30" role="contentinfo">
        <div className="container max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-foreground text-background">
                <Dumbbell className="w-3 h-3" aria-hidden="true" />
              </div>
              <span className="font-semibold">MuscleAtlas</span>
              <span className="text-sm text-muted-foreground">© {new Date().getFullYear()}</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="gap-1"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-4 h-4" aria-hidden="true" />
              Top
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
