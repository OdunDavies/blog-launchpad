import { Food } from '@/types/diet';

export const COMMON_FOODS: Food[] = [
  // === PROTEINS - International ===
  { name: 'Grilled Chicken Breast', portion: '100g', calories: 165, protein: 31, carbs: 0, fat: 4 },
  { name: 'Boiled Eggs (2)', portion: '2 large', calories: 143, protein: 13, carbs: 1, fat: 10 },
  { name: 'Scrambled Eggs', portion: '2 large', calories: 180, protein: 12, carbs: 2, fat: 14 },
  { name: 'Grilled Salmon', portion: '150g', calories: 312, protein: 30, carbs: 0, fat: 20 },
  { name: 'Turkey Breast', portion: '100g', calories: 135, protein: 30, carbs: 0, fat: 1 },
  { name: 'Tuna Steak', portion: '100g', calories: 132, protein: 28, carbs: 0, fat: 1 },
  { name: 'Greek Yogurt', portion: '150g', calories: 145, protein: 13, carbs: 5, fat: 7 },
  { name: 'Cottage Cheese', portion: '100g', calories: 98, protein: 11, carbs: 3, fat: 4 },
  { name: 'Whey Protein Shake', portion: '1 scoop', calories: 120, protein: 24, carbs: 3, fat: 1 },
  
  // === PROTEINS - Nigerian ===
  { name: 'Suya', portion: '100g', calories: 250, protein: 25, carbs: 5, fat: 15 },
  { name: 'Grilled Tilapia', portion: '150g', calories: 192, protein: 39, carbs: 0, fat: 4 },
  { name: 'Grilled Fish', portion: '150g', calories: 180, protein: 30, carbs: 0, fat: 6 },
  { name: 'Goat Meat', portion: '100g', calories: 143, protein: 27, carbs: 0, fat: 3 },
  { name: 'Chicken Pepper Soup', portion: '1 serving', calories: 180, protein: 22, carbs: 8, fat: 6 },
  { name: 'Catfish Pepper Soup', portion: '1 serving', calories: 160, protein: 24, carbs: 4, fat: 5 },
  
  // === CARBS - International ===
  { name: 'Brown Rice', portion: '150g cooked', calories: 185, protein: 4, carbs: 39, fat: 2 },
  { name: 'White Rice', portion: '150g cooked', calories: 195, protein: 4, carbs: 42, fat: 0 },
  { name: 'Oatmeal', portion: '100g cooked', calories: 68, protein: 2, carbs: 12, fat: 1 },
  { name: 'Sweet Potato', portion: '150g', calories: 129, protein: 2, carbs: 30, fat: 0 },
  { name: 'Quinoa', portion: '150g cooked', calories: 180, protein: 7, carbs: 32, fat: 3 },
  { name: 'Whole Wheat Bread', portion: '2 slices', calories: 160, protein: 8, carbs: 28, fat: 2 },
  { name: 'Whole Wheat Pasta', portion: '150g cooked', calories: 186, protein: 8, carbs: 38, fat: 1 },
  
  // === CARBS - Nigerian ===
  { name: 'Boiled Yam', portion: '150g', calories: 177, protein: 2, carbs: 42, fat: 0 },
  { name: 'Fried Plantain (Dodo)', portion: '100g', calories: 150, protein: 1, carbs: 35, fat: 2 },
  { name: 'Boiled Plantain', portion: '150g', calories: 183, protein: 2, carbs: 48, fat: 1 },
  { name: 'Jollof Rice', portion: '200g', calories: 360, protein: 8, carbs: 64, fat: 8 },
  { name: 'Fried Rice', portion: '200g', calories: 400, protein: 10, carbs: 60, fat: 12 },
  { name: 'Moi Moi', portion: '1 wrap', calories: 180, protein: 9, carbs: 18, fat: 8 },
  { name: 'Akara (3 pieces)', portion: '3 pieces', calories: 170, protein: 6, carbs: 15, fat: 10 },
  { name: 'Pap/Ogi', portion: '1 cup', calories: 120, protein: 4, carbs: 22, fat: 2 },
  { name: 'Eba', portion: '150g', calories: 240, protein: 1, carbs: 57, fat: 1 },
  { name: 'Pounded Yam', portion: '150g', calories: 177, protein: 2, carbs: 42, fat: 0 },
  
  // === FRUITS ===
  { name: 'Banana', portion: '1 medium', calories: 89, protein: 1, carbs: 23, fat: 0 },
  { name: 'Apple', portion: '1 medium', calories: 95, protein: 1, carbs: 25, fat: 0 },
  { name: 'Orange', portion: '1 medium', calories: 62, protein: 1, carbs: 15, fat: 0 },
  { name: 'Mango', portion: '100g', calories: 60, protein: 1, carbs: 15, fat: 0 },
  { name: 'Pineapple', portion: '100g', calories: 50, protein: 1, carbs: 13, fat: 0 },
  { name: 'Watermelon', portion: '150g', calories: 45, protein: 1, carbs: 12, fat: 0 },
  { name: 'Pawpaw (Papaya)', portion: '100g', calories: 43, protein: 1, carbs: 11, fat: 0 },
  { name: 'Strawberries', portion: '100g', calories: 32, protein: 1, carbs: 8, fat: 0 },
  { name: 'Blueberries', portion: '100g', calories: 57, protein: 1, carbs: 14, fat: 0 },
  { name: 'Mixed Fruit Bowl', portion: '150g', calories: 75, protein: 1, carbs: 19, fat: 0 },
  { name: 'Tangerine', portion: '1 medium', calories: 53, protein: 1, carbs: 13, fat: 0 },
  { name: 'Guava', portion: '100g', calories: 68, protein: 3, carbs: 14, fat: 1 },
  
  // === SNACKS - Nuts & Seeds ===
  { name: 'Almonds', portion: '28g (handful)', calories: 164, protein: 6, carbs: 6, fat: 14 },
  { name: 'Cashews', portion: '28g (handful)', calories: 157, protein: 5, carbs: 9, fat: 12 },
  { name: 'Walnuts', portion: '28g (handful)', calories: 185, protein: 4, carbs: 4, fat: 18 },
  { name: 'Mixed Nuts', portion: '28g', calories: 172, protein: 5, carbs: 6, fat: 15 },
  { name: 'Roasted Groundnuts', portion: '30g', calories: 170, protein: 8, carbs: 5, fat: 14 },
  { name: 'Pumpkin Seeds', portion: '28g', calories: 151, protein: 7, carbs: 5, fat: 13 },
  
  // === SNACKS - Nigerian ===
  { name: 'Kulikuli', portion: '30g', calories: 150, protein: 7, carbs: 8, fat: 11 },
  { name: 'Tiger Nuts (Aya)', portion: '30g', calories: 120, protein: 2, carbs: 15, fat: 7 },
  { name: 'Coconut Chunks', portion: '50g', calories: 180, protein: 2, carbs: 8, fat: 17 },
  { name: 'Roasted Corn', portion: '1 cob', calories: 120, protein: 4, carbs: 22, fat: 2 },
  { name: 'Boiled Corn', portion: '1 cob', calories: 90, protein: 3, carbs: 19, fat: 1 },
  
  // === SNACKS - Other ===
  { name: 'Protein Bar', portion: '1 bar', calories: 200, protein: 20, carbs: 20, fat: 6 },
  { name: 'Greek Yogurt with Berries', portion: '150g', calories: 130, protein: 12, carbs: 15, fat: 3 },
  { name: 'Beef Jerky', portion: '30g', calories: 116, protein: 10, carbs: 3, fat: 7 },
  { name: 'Rice Cakes', portion: '2 cakes', calories: 70, protein: 1, carbs: 15, fat: 0 },
  { name: 'Dark Chocolate (70%)', portion: '30g', calories: 170, protein: 2, carbs: 13, fat: 12 },
  { name: 'Hummus with Veggies', portion: '100g', calories: 130, protein: 4, carbs: 15, fat: 6 },
  
  // === VEGETABLES ===
  { name: 'Mixed Salad', portion: '100g', calories: 20, protein: 2, carbs: 3, fat: 0 },
  { name: 'Steamed Vegetables', portion: '150g', calories: 75, protein: 3, carbs: 15, fat: 1 },
  { name: 'Roasted Vegetables', portion: '150g', calories: 120, protein: 3, carbs: 18, fat: 5 },
  { name: 'Broccoli', portion: '100g', calories: 34, protein: 3, carbs: 7, fat: 0 },
  { name: 'Spinach', portion: '100g', calories: 23, protein: 3, carbs: 4, fat: 0 },
  
  // === SOUPS (Nigerian) ===
  { name: 'Egusi Soup', portion: '1 serving', calories: 250, protein: 12, carbs: 8, fat: 20 },
  { name: 'Efo Riro', portion: '1 serving', calories: 180, protein: 8, carbs: 6, fat: 14 },
  { name: 'Ogbono Soup', portion: '1 serving', calories: 200, protein: 10, carbs: 8, fat: 15 },
  { name: 'Okra Soup', portion: '1 serving', calories: 80, protein: 4, carbs: 10, fat: 3 },
  { name: 'Vegetable Soup', portion: '1 serving', calories: 100, protein: 5, carbs: 12, fat: 4 },
  
  // === DRINKS ===
  { name: 'Zobo (Hibiscus)', portion: '1 cup', calories: 20, protein: 0, carbs: 5, fat: 0 },
  { name: 'Kunu', portion: '1 cup', calories: 80, protein: 2, carbs: 16, fat: 1 },
  { name: 'Green Smoothie', portion: '250ml', calories: 120, protein: 3, carbs: 22, fat: 2 },
  { name: 'Protein Smoothie', portion: '300ml', calories: 200, protein: 20, carbs: 25, fat: 4 },
];

// Categorize foods for easier browsing
export const FOOD_CATEGORIES = {
  proteins: COMMON_FOODS.filter(f => f.protein >= 10),
  carbs: COMMON_FOODS.filter(f => f.carbs >= 15 && f.protein < 10),
  fruits: COMMON_FOODS.filter(f => 
    ['Banana', 'Apple', 'Orange', 'Mango', 'Pineapple', 'Watermelon', 'Pawpaw', 'Strawberries', 'Blueberries', 'Mixed Fruit Bowl', 'Tangerine', 'Guava'].includes(f.name)
  ),
  snacks: COMMON_FOODS.filter(f => 
    f.name.includes('Almond') || f.name.includes('Cashew') || f.name.includes('Walnut') || 
    f.name.includes('Nut') || f.name.includes('Kulikuli') || f.name.includes('Tiger') || 
    f.name.includes('Coconut Chunk') || f.name.includes('Protein Bar') || f.name.includes('Jerky') ||
    f.name.includes('Chocolate') || f.name.includes('Hummus')
  ),
  nigerian: COMMON_FOODS.filter(f => 
    ['Suya', 'Grilled Tilapia', 'Goat Meat', 'Jollof Rice', 'Fried Rice', 'Moi Moi', 'Akara', 'Pap/Ogi', 'Eba', 'Pounded Yam', 'Boiled Yam', 'Fried Plantain (Dodo)', 'Boiled Plantain', 'Kulikuli', 'Tiger Nuts (Aya)', 'Egusi Soup', 'Efo Riro', 'Ogbono Soup', 'Okra Soup', 'Chicken Pepper Soup', 'Catfish Pepper Soup', 'Zobo (Hibiscus)', 'Kunu'].includes(f.name)
  ),
};
