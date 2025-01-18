export type TestType = 'SAT' | 'ACT' | 'AP_CALC_AB' | 'AP_CALC_BC';
export type MathLevel = 'algebra' | 'geometry' | 'trigonometry' | 'precalculus' | 'calculus';
export type Difficulty = 'basic' | 'intermediate' | 'advanced' | 'challenge';

export interface Subject {
  id: string;
  name: string;
  icon: string;
  hasLevel: boolean;
}

export interface SubjectSelection {
  testType: TestType;
  level?: MathLevel;
}

export const TEST_TYPES: Record<TestType, string> = {
  'SAT': 'SAT Math',
  'ACT': 'ACT Math',
  'AP_CALC_AB': 'AP Calculus AB',
  'AP_CALC_BC': 'AP Calculus BC'
};