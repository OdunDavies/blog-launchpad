import { useState } from 'react';
import { Food } from '@/types/diet';
import { COMMON_FOODS, FOOD_CATEGORIES } from '@/data/commonFoods';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Apple, Drumstick, Wheat, Cookie, Globe } from 'lucide-react';

interface AddFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddFood: (food: Food) => void;
  mealName: string;
}

export function AddFoodModal({ isOpen, onClose, onAddFood, mealName }: AddFoodModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Custom food form state
  const [customName, setCustomName] = useState('');
  const [customPortion, setCustomPortion] = useState('');
  const [customCalories, setCustomCalories] = useState('');
  const [customProtein, setCustomProtein] = useState('');
  const [customCarbs, setCustomCarbs] = useState('');
  const [customFat, setCustomFat] = useState('');

  // Filter foods based on search and category
  const getFilteredFoods = () => {
    let foods = COMMON_FOODS;
    
    // Filter by category
    if (selectedCategory !== 'all') {
      foods = FOOD_CATEGORIES[selectedCategory as keyof typeof FOOD_CATEGORIES] || COMMON_FOODS;
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      foods = foods.filter(f => 
        f.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return foods;
  };

  const handleSelectFood = (food: Food) => {
    onAddFood(food);
    resetForm();
    onClose();
  };

  const handleAddCustomFood = () => {
    if (!customName || !customPortion || !customCalories) return;
    
    const food: Food = {
      name: customName,
      portion: customPortion,
      calories: parseInt(customCalories) || 0,
      protein: parseInt(customProtein) || 0,
      carbs: parseInt(customCarbs) || 0,
      fat: parseInt(customFat) || 0,
    };
    
    onAddFood(food);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setCustomName('');
    setCustomPortion('');
    setCustomCalories('');
    setCustomProtein('');
    setCustomCarbs('');
    setCustomFat('');
  };

  const isCustomFormValid = customName && customPortion && customCalories;

  const categoryButtons = [
    { id: 'all', label: 'All', icon: null },
    { id: 'proteins', label: 'Protein', icon: <Drumstick className="w-3 h-3" /> },
    { id: 'carbs', label: 'Carbs', icon: <Wheat className="w-3 h-3" /> },
    { id: 'fruits', label: 'Fruits', icon: <Apple className="w-3 h-3" /> },
    { id: 'snacks', label: 'Snacks', icon: <Cookie className="w-3 h-3" /> },
    { id: 'nigerian', label: 'Nigerian', icon: <Globe className="w-3 h-3" /> },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md max-h-[85vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>Add Food to {mealName}</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="search" className="flex-1 flex flex-col min-h-0">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="search">Search Foods</TabsTrigger>
            <TabsTrigger value="custom">Custom Food</TabsTrigger>
          </TabsList>
          
          {/* Search Foods Tab */}
          <TabsContent value="search" className="flex-1 flex flex-col min-h-0 mt-4">
            {/* Search Input */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search foods..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            
            {/* Category Filters */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {categoryButtons.map((cat) => (
                <Badge
                  key={cat.id}
                  variant={selectedCategory === cat.id ? 'default' : 'outline'}
                  className="cursor-pointer text-xs"
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  {cat.icon}
                  <span className={cat.icon ? 'ml-1' : ''}>{cat.label}</span>
                </Badge>
              ))}
            </div>
            
            {/* Food List */}
            <ScrollArea className="flex-1 -mx-4 px-4 min-h-0">
              <div className="space-y-1">
                {getFilteredFoods().map((food, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectFood(food)}
                    className="w-full text-left p-3 rounded-lg border hover:bg-accent hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{food.name}</p>
                        <p className="text-xs text-muted-foreground">{food.portion}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">{food.calories} cal</p>
                        <p className="text-xs text-muted-foreground">
                          P:{food.protein}g C:{food.carbs}g F:{food.fat}g
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
                
                {getFilteredFoods().length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No foods found. Try a different search or add a custom food.
                  </p>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
          
          {/* Custom Food Tab */}
          <TabsContent value="custom" className="mt-4 space-y-4">
            <div className="space-y-3">
              <div>
                <Label htmlFor="food-name">Food Name *</Label>
                <Input
                  id="food-name"
                  placeholder="e.g., Grilled Salmon"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="portion">Portion Size *</Label>
                <Input
                  id="portion"
                  placeholder="e.g., 150g, 1 cup, 2 pieces"
                  value={customPortion}
                  onChange={(e) => setCustomPortion(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="calories">Calories *</Label>
                <Input
                  id="calories"
                  type="number"
                  placeholder="e.g., 200"
                  value={customCalories}
                  onChange={(e) => setCustomCalories(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label htmlFor="protein">Protein (g)</Label>
                  <Input
                    id="protein"
                    type="number"
                    placeholder="0"
                    value={customProtein}
                    onChange={(e) => setCustomProtein(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="carbs">Carbs (g)</Label>
                  <Input
                    id="carbs"
                    type="number"
                    placeholder="0"
                    value={customCarbs}
                    onChange={(e) => setCustomCarbs(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="fat">Fat (g)</Label>
                  <Input
                    id="fat"
                    type="number"
                    placeholder="0"
                    value={customFat}
                    onChange={(e) => setCustomFat(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <Button 
              onClick={handleAddCustomFood} 
              disabled={!isCustomFormValid}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Custom Food
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
