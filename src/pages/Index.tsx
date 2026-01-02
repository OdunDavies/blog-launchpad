import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExerciseLibrary } from '@/components/ExerciseLibrary';
import { WorkoutGenerator } from '@/components/WorkoutGenerator';
import { WorkoutTemplates } from '@/components/WorkoutTemplates';
import { ThemeToggle } from '@/components/ThemeToggle';
import { HeroSection } from '@/components/HeroSection';
import { MuscleGroupCards } from '@/components/MuscleGroupCards';
import { Button } from '@/components/ui/button';
import { Dumbbell, Library, Sparkles, LayoutTemplate, ArrowUp, Github, Twitter, Mail } from 'lucide-react';
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
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="container max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-foreground text-background">
                <Dumbbell className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">MuscleAtlas</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">Navigate your fitness journey</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <HeroSection 
        onExploreClick={handleExploreClick}
        onGenerateClick={handleGenerateClick}
      />

      {/* Muscle Group Cards */}
      <MuscleGroupCards onSelectMuscleGroup={handleMuscleGroupSelect} />

      {/* Main Content */}
      <main id="main-content" className="container max-w-6xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-xl grid-cols-3">
            <TabsTrigger value="library" className="flex items-center gap-2">
              <Library className="w-4 h-4" />
              <span className="hidden sm:inline">Exercise</span> Library
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <LayoutTemplate className="w-4 h-4" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="generator" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">AI</span> Generator
            </TabsTrigger>
          </TabsList>

          <TabsContent value="library" className="mt-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Exercise Library</h2>
              <p className="text-muted-foreground">
                Browse our collection of exercises with video demonstrations and muscle targeting info.
              </p>
            </div>
            <ExerciseLibrary initialMuscleFilter={selectedMuscleFilter} />
          </TabsContent>

          <TabsContent value="templates" className="mt-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Workout Templates</h2>
              <p className="text-muted-foreground">
                Pre-made workout routines to get you started quickly. Click any template to view details.
              </p>
            </div>
            <WorkoutTemplates />
          </TabsContent>

          <TabsContent value="generator" className="mt-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">AI Workout Generator</h2>
              <p className="text-muted-foreground">
                Get a personalized workout split based on your goals and target muscles.
              </p>
            </div>
            <WorkoutGenerator />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t mt-auto bg-muted/30">
        <div className="container max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-lg bg-foreground text-background">
                  <Dumbbell className="w-4 h-4" />
                </div>
                <span className="font-bold text-lg">MuscleAtlas</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Navigate your fitness journey. Discover exercises, master proper form, and generate AI-powered workout plans.
              </p>
            </div>
            
            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <button 
                    onClick={() => { setActiveTab('library'); document.getElementById('main-content')?.scrollIntoView({ behavior: 'smooth' }); }}
                    className="hover:text-foreground transition-colors"
                  >
                    Exercise Library
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => { setActiveTab('templates'); document.getElementById('main-content')?.scrollIntoView({ behavior: 'smooth' }); }}
                    className="hover:text-foreground transition-colors"
                  >
                    Workout Templates
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => { setActiveTab('generator'); document.getElementById('main-content')?.scrollIntoView({ behavior: 'smooth' }); }}
                    className="hover:text-foreground transition-colors"
                  >
                    AI Generator
                  </button>
                </li>
              </ul>
            </div>
            
            {/* Connect */}
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="flex gap-3">
                <Button variant="outline" size="icon" className="rounded-full h-9 w-9">
                  <Github className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full h-9 w-9">
                  <Twitter className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full h-9 w-9">
                  <Mail className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Bottom bar */}
          <div className="pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} MuscleAtlas. All rights reserved.
            </p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="gap-2"
            >
              <ArrowUp className="w-4 h-4" />
              Back to top
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
