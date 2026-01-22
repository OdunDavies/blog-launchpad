import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { DayPlan, FitnessGoal, UserProfile } from '@/types/diet';

interface DietPlanData {
  name: string;
  calorieTarget: number;
  dietType: string;
  mealsPerDay: number;
  restrictions: string[];
  mealPlan: DayPlan[];
  goal?: FitnessGoal | string;
  profile?: UserProfile;
}

const dietTypeLabels: Record<string, string> = {
  balanced: 'Balanced',
  'high-protein': 'High Protein',
  'low-carb': 'Low Carb',
  mediterranean: 'Mediterranean',
  vegetarian: 'Vegetarian',
  vegan: 'Vegan',
};

const goalLabels: Record<string, string> = {
  'muscle-gain': 'Muscle Gain',
  'fat-loss': 'Fat Loss',
  'maintenance': 'Maintenance',
  'recomposition': 'Body Recomposition',
};

const activityLabels: Record<string, string> = {
  sedentary: 'Sedentary',
  light: 'Lightly Active',
  moderate: 'Moderately Active',
  active: 'Very Active',
  'very-active': 'Extremely Active',
};

function getProfileSummary(profile?: UserProfile): string {
  if (!profile) return '';
  
  const height = profile.heightUnit === 'ft' 
    ? `${profile.height}'${profile.heightInches || 0}"`
    : `${profile.height} cm`;
  
  return `${profile.age}y • ${profile.gender} • ${profile.weight}${profile.weightUnit} • ${height} • ${activityLabels[profile.activityLevel] || profile.activityLevel}`;
}

function calculateWeeklyTotals(mealPlan: DayPlan[]) {
  return mealPlan.reduce((acc, day) => ({
    calories: acc.calories + day.totalCalories,
    protein: acc.protein + day.totalProtein,
    carbs: acc.carbs + day.totalCarbs,
    fat: acc.fat + day.totalFat,
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
}

export function generateDietHtml(plan: DietPlanData): string {
  const dietLabel = dietTypeLabels[plan.dietType] || plan.dietType;
  const goalLabel = plan.goal ? (goalLabels[plan.goal] || plan.goal) : '';
  const profileSummary = getProfileSummary(plan.profile);
  const weeklyTotals = calculateWeeklyTotals(plan.mealPlan);
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${plan.name} - Diet Plan</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
      background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
      min-height: 100vh;
      padding: 40px 20px;
      color: #1e293b;
      line-height: 1.6;
    }
    
    .container {
      max-width: 900px;
      margin: 0 auto;
    }
    
    .header { 
      background: linear-gradient(135deg, #166534 0%, #15803d 100%);
      color: white; 
      padding: 40px; 
      border-radius: 20px; 
      margin-bottom: 24px;
      text-align: center;
      box-shadow: 0 20px 40px rgba(0,0,0,0.15);
    }
    
    .header h1 { 
      font-size: 28px; 
      margin-bottom: 12px; 
      font-weight: 700;
      letter-spacing: -0.5px;
    }
    
    .goal-badge {
      display: inline-block;
      background: rgba(255,255,255,0.2);
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 12px;
    }
    
    .profile-summary {
      font-size: 13px;
      opacity: 0.9;
      margin-bottom: 16px;
    }
    
    .meta { 
      display: flex; 
      gap: 12px; 
      justify-content: center; 
      flex-wrap: wrap;
    }
    
    .meta-item { 
      background: rgba(255,255,255,0.15);
      backdrop-filter: blur(10px);
      padding: 8px 16px; 
      border-radius: 50px;
      font-size: 13px;
      font-weight: 500;
      border: 1px solid rgba(255,255,255,0.1);
    }
    
    .weekly-summary {
      background: white;
      border-radius: 16px;
      padding: 20px;
      margin-bottom: 24px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    }
    
    .weekly-summary h2 {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 16px;
      color: #166534;
    }
    
    .weekly-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      text-align: center;
    }
    
    .weekly-stat {
      padding: 12px;
      background: #f0fdf4;
      border-radius: 12px;
    }
    
    .weekly-stat-value {
      font-size: 24px;
      font-weight: 700;
      color: #166534;
    }
    
    .weekly-stat-label {
      font-size: 12px;
      color: #64748b;
      margin-top: 4px;
    }
    
    .days-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
    }
    
    .day-card { 
      background: white; 
      border-radius: 16px; 
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      page-break-inside: avoid;
    }
    
    .day-header {
      background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
      padding: 20px 24px;
      border-bottom: 1px solid #bbf7d0;
    }
    
    .day-badge {
      display: inline-block;
      background: #166534;
      color: white;
      font-size: 12px;
      font-weight: 600;
      padding: 4px 12px;
      border-radius: 20px;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .day-macros {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin-top: 8px;
    }
    
    .macro-badge {
      background: white;
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 500;
      border: 1px solid #bbf7d0;
    }
    
    .day-content {
      padding: 20px 24px;
    }
    
    .meal-section {
      margin-bottom: 16px;
      padding-bottom: 16px;
      border-bottom: 1px solid #f1f5f9;
    }
    
    .meal-section:last-child {
      margin-bottom: 0;
      padding-bottom: 0;
      border-bottom: none;
    }
    
    .meal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
    
    .meal-name {
      font-weight: 600;
      font-size: 14px;
      color: #166534;
    }
    
    .meal-time {
      font-size: 12px;
      color: #64748b;
    }
    
    .food-item {
      display: flex;
      justify-content: space-between;
      padding: 6px 0;
      font-size: 13px;
    }
    
    .food-name {
      color: #1e293b;
    }
    
    .food-portion {
      color: #64748b;
      font-size: 12px;
    }
    
    .food-calories {
      color: #64748b;
      font-size: 12px;
    }
    
    .footer { 
      text-align: center; 
      margin-top: 48px;
      padding: 24px;
      color: #94a3b8;
      font-size: 14px;
    }
    
    .footer .brand {
      font-weight: 600;
      color: #64748b;
    }
    
    @media print { 
      body { 
        padding: 20px;
        background: white;
      }
      .header {
        box-shadow: none;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .day-card {
        box-shadow: none;
        border: 1px solid #e2e8f0;
        break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <header class="header">
      ${goalLabel ? `<span class="goal-badge">🎯 ${goalLabel}</span>` : ''}
      <h1>${plan.name}</h1>
      ${profileSummary ? `<p class="profile-summary">${profileSummary}</p>` : ''}
      <div class="meta">
        <span class="meta-item">🔥 ${plan.calorieTarget} kcal/day</span>
        <span class="meta-item">🥗 ${dietLabel}</span>
        <span class="meta-item">🍽️ ${plan.mealsPerDay} meals/day</span>
        ${plan.profile?.trainingDays ? `<span class="meta-item">💪 ${plan.profile.trainingDays} training days/week</span>` : ''}
      </div>
    </header>
    
    <div class="weekly-summary">
      <h2>📊 Weekly Totals & Averages</h2>
      <div class="weekly-grid">
        <div class="weekly-stat">
          <div class="weekly-stat-value">${Math.round(weeklyTotals.calories / 7).toLocaleString()}</div>
          <div class="weekly-stat-label">Avg Daily Calories</div>
        </div>
        <div class="weekly-stat">
          <div class="weekly-stat-value">${Math.round(weeklyTotals.protein / 7)}g</div>
          <div class="weekly-stat-label">Avg Daily Protein</div>
        </div>
        <div class="weekly-stat">
          <div class="weekly-stat-value">${Math.round(weeklyTotals.carbs / 7)}g</div>
          <div class="weekly-stat-label">Avg Daily Carbs</div>
        </div>
        <div class="weekly-stat">
          <div class="weekly-stat-value">${Math.round(weeklyTotals.fat / 7)}g</div>
          <div class="weekly-stat-label">Avg Daily Fat</div>
        </div>
      </div>
    </div>
    
    <div class="days-grid">
      ${plan.mealPlan.map(day => `
        <article class="day-card">
          <div class="day-header">
            <span class="day-badge">${day.day}</span>
            <div class="day-macros">
              <span class="macro-badge">🔥 ${day.totalCalories} kcal</span>
              <span class="macro-badge">🥩 ${day.totalProtein}g P</span>
              <span class="macro-badge">🍞 ${day.totalCarbs}g C</span>
              <span class="macro-badge">🧈 ${day.totalFat}g F</span>
            </div>
          </div>
          <div class="day-content">
            ${day.meals.map(meal => `
              <div class="meal-section">
                <div class="meal-header">
                  <span class="meal-name">${meal.name}</span>
                  <span class="meal-time">${meal.time}</span>
                </div>
                ${meal.foods.map(food => `
                  <div class="food-item">
                    <div>
                      <span class="food-name">${food.name}</span>
                      <span class="food-portion"> · ${food.portion}</span>
                    </div>
                    <span class="food-calories">${food.calories} kcal</span>
                  </div>
                `).join('')}
              </div>
            `).join('')}
          </div>
        </article>
      `).join('')}
    </div>
    
    <footer class="footer">
      <p>Generated by <span class="brand">MuscleAtlas</span></p>
      <p>${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
    </footer>
  </div>
</body>
</html>`;
}

export async function generateDietPdf(plan: DietPlanData): Promise<void> {
  const container = document.createElement('div');
  container.innerHTML = generateDietHtml(plan);
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.width = '800px';
  container.style.background = '#f0fdf4';
  document.body.appendChild(container);
  
  try {
    const canvas = await html2canvas(container.querySelector('.container') as HTMLElement, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#f0fdf4',
      logging: false,
    });
    
    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    const pdf = new jsPDF('p', 'mm', 'a4');
    let position = 0;
    let heightLeft = imgHeight;
    
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    const filename = plan.name.replace(/\s+/g, '-').toLowerCase();
    pdf.save(`${filename}-diet-plan.pdf`);
  } finally {
    document.body.removeChild(container);
  }
}
