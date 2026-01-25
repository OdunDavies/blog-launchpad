import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dumbbell, Sparkles, ChevronDown } from 'lucide-react';
import heroBg from '@/assets/hero-bg.jpg';
import { exercises, muscleGroups } from '@/data/exercises';

interface StatProps {
  end: number;
  suffix: string;
  label: string;
  delay: number;
}

function AnimatedStat({ end, suffix, label, delay }: StatProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const duration = 2000;
      const steps = 60;
      const increment = end / steps;
      let current = 0;
      
      const interval = setInterval(() => {
        current += increment;
        if (current >= end) {
          setCount(end);
          clearInterval(interval);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);
      
      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timer);
  }, [end, delay]);

  return (
    <div className="text-center">
      <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-foreground">
        {count}{suffix}
      </div>
      <div className="text-xs sm:text-sm text-primary-foreground/70 mt-0.5 sm:mt-1">{label}</div>
    </div>
  );
}

interface HeroSectionProps {
  onExploreClick: () => void;
  onGenerateClick: () => void;
}

export function HeroSection({ onExploreClick, onGenerateClick }: HeroSectionProps) {
  return (
    <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/50 to-transparent" />
      
      {/* Content */}
      <div className="relative z-10 container max-w-6xl mx-auto px-4 py-16 text-center">
        <div className="animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Dumbbell className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Navigate Your Fitness Journey</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            Free Exercise Library &
            <span className="block text-primary">AI Workout Generator</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Build muscle, lose weight, and achieve your fitness goals. Browse 100+ exercises with video demos, 
            generate personalized AI workout plans, and create custom diet plans — completely free.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              onClick={onExploreClick}
              className="text-base px-8"
            >
              <Dumbbell className="w-5 h-5 mr-2" />
              Explore Exercises
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={onGenerateClick}
              className="text-base px-8 bg-background/50 hover:bg-background/80"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Generate Workout
            </Button>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-lg mx-auto p-4 sm:p-6 rounded-2xl bg-foreground/90 backdrop-blur-sm">
          <AnimatedStat end={exercises.length} suffix="+" label="Exercises" delay={0} />
          <AnimatedStat end={muscleGroups.length} suffix="" label="Muscles" delay={200} />
          <AnimatedStat end={1} suffix="" label="AI" delay={400} />
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-muted-foreground" />
        </div>
      </div>
    </section>
  );
}
