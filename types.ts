export interface FoodItem {
  name: string;
  calories: number;
  confidence: number; // 0-1
}

export interface NutritionAnalysis {
  totalCalories: number;
  items: FoodItem[];
  summary: string;
  macroEstimate?: {
    protein: string;
    carbs: string;
    fat: string;
  };
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export enum AppState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  RESULT = 'RESULT',
  ERROR = 'ERROR'
}