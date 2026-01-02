interface WorkoutExercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
}

interface WorkoutDay {
  day: string;
  focus: string;
  exercises: WorkoutExercise[];
}

interface WorkoutPlanData {
  name: string;
  description?: string;
  difficulty?: string;
  daysPerWeek?: number;
  splitDays?: number;
  goal: string;
  gender?: string;
  targetMuscles?: string[];
  schedule: WorkoutDay[];
}

export function generateWorkoutHtml(plan: WorkoutPlanData): string {
  const days = plan.daysPerWeek || plan.splitDays || plan.schedule.length;
  const difficultyCapitalized = plan.difficulty 
    ? plan.difficulty.charAt(0).toUpperCase() + plan.difficulty.slice(1) 
    : '';
  const goalCapitalized = plan.goal.charAt(0).toUpperCase() + plan.goal.slice(1);
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${plan.name} - Workout Plan</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
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
      background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
      color: white; 
      padding: 40px; 
      border-radius: 20px; 
      margin-bottom: 32px;
      text-align: center;
      box-shadow: 0 20px 40px rgba(0,0,0,0.15);
    }
    
    .header h1 { 
      font-size: 32px; 
      margin-bottom: 12px; 
      font-weight: 700;
      letter-spacing: -0.5px;
    }
    
    .header p {
      color: rgba(255,255,255,0.8);
      font-size: 16px;
      max-width: 600px;
      margin: 0 auto 20px;
    }
    
    .meta { 
      display: flex; 
      gap: 16px; 
      justify-content: center; 
      flex-wrap: wrap;
    }
    
    .meta-item { 
      background: rgba(255,255,255,0.15);
      backdrop-filter: blur(10px);
      padding: 10px 20px; 
      border-radius: 50px;
      font-size: 14px;
      font-weight: 500;
      border: 1px solid rgba(255,255,255,0.1);
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
      transition: transform 0.2s, box-shadow 0.2s;
    }
    
    .day-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 30px rgba(0,0,0,0.12);
    }
    
    .day-header {
      background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
      padding: 20px 24px;
      border-bottom: 1px solid #e2e8f0;
    }
    
    .day-badge {
      display: inline-block;
      background: #1e293b;
      color: white;
      font-size: 12px;
      font-weight: 600;
      padding: 4px 12px;
      border-radius: 20px;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .day-title {
      font-size: 18px;
      font-weight: 600;
      color: #1e293b;
    }
    
    .day-content {
      padding: 20px 24px;
    }
    
    .exercise-row { 
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 14px 0;
      border-bottom: 1px solid #f1f5f9;
    }
    
    .exercise-row:last-child {
      border-bottom: none;
    }
    
    .exercise-number {
      width: 28px;
      height: 28px;
      background: #f1f5f9;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 600;
      color: #64748b;
      flex-shrink: 0;
    }
    
    .exercise-info {
      flex: 1;
    }
    
    .exercise-name { 
      font-weight: 600;
      font-size: 15px;
      color: #1e293b;
      margin-bottom: 4px;
    }
    
    .exercise-details { 
      color: #64748b;
      font-size: 13px;
    }
    
    .exercise-details span {
      display: inline-block;
      background: #f1f5f9;
      padding: 2px 8px;
      border-radius: 4px;
      margin-right: 6px;
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
    
    .footer .date {
      margin-top: 8px;
      font-size: 12px;
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
    
    @media (max-width: 600px) {
      body { padding: 16px; }
      .header { padding: 24px; }
      .header h1 { font-size: 24px; }
      .meta { gap: 8px; }
      .meta-item { padding: 8px 14px; font-size: 12px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <header class="header">
      <h1>${plan.name}</h1>
      ${plan.description ? `<p>${plan.description}</p>` : ''}
      <div class="meta">
        ${difficultyCapitalized ? `<span class="meta-item">📊 ${difficultyCapitalized}</span>` : ''}
        <span class="meta-item">📅 ${days} Days/Week</span>
        <span class="meta-item">🎯 ${goalCapitalized}</span>
        ${plan.gender ? `<span class="meta-item">👤 ${plan.gender.charAt(0).toUpperCase() + plan.gender.slice(1)}</span>` : ''}
      </div>
    </header>
    
    <div class="days-grid">
      ${plan.schedule.map(day => `
        <article class="day-card">
          <div class="day-header">
            <span class="day-badge">${day.day}</span>
            <h2 class="day-title">${day.focus}</h2>
          </div>
          <div class="day-content">
            ${day.exercises.map((ex, i) => `
              <div class="exercise-row">
                <span class="exercise-number">${i + 1}</span>
                <div class="exercise-info">
                  <div class="exercise-name">${ex.name}</div>
                  <div class="exercise-details">
                    <span>${ex.sets} sets</span>
                    <span>${ex.reps} reps</span>
                    <span>Rest: ${ex.rest}</span>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </article>
      `).join('')}
    </div>
    
    <footer class="footer">
      <p>Generated by <span class="brand">Musclepedia</span></p>
      <p class="date">${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
    </footer>
  </div>
</body>
</html>`;
}

export function downloadHtmlFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.html') ? filename : `${filename}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
