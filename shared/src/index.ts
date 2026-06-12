export type UserRole = 'student' | 'instructor' | 'admin';

export type LabDomain =
  | 'networking'
  | 'cybersecurity'
  | 'robotics'
  | 'data_analytics'
  | 'software_engineering'
  | 'general_computing';

export interface Lab {
  id: string;
  title: string;
  domain: LabDomain;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description: string;
}

export interface NetworkingScenario {
  id: 'network-basic-config' | 'routing-setup' | 'network-troubleshooting';
  title: string;
  objective: string;
  expectedActions: string[];
}

export interface CompetencyMetrics {
  accuracy: number;
  completionSpeed: number;
  conceptUnderstanding: number;
}

export const computeMastery = ({ accuracy, completionSpeed, conceptUnderstanding }: CompetencyMetrics): number => {
  const normalized =
    accuracy * 0.4 +
    completionSpeed * 0.3 +
    conceptUnderstanding * 0.3;
  return Math.max(0, Math.min(100, Number(normalized.toFixed(2))));
};

export const competencyLevel = (mastery: number): 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' => {
  if (mastery < 25) return 'Beginner';
  if (mastery < 50) return 'Intermediate';
  if (mastery < 75) return 'Advanced';
  return 'Expert';
};
