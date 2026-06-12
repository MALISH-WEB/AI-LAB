import { competencyLevel, computeMastery } from '@ai-lab/shared';

export const updateCompetencyFromMetrics = (metrics: {
  accuracy: number;
  completionSpeed: number;
  conceptUnderstanding: number;
}): { mastery: number; level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' } => {
  const mastery = computeMastery(metrics);
  return {
    mastery,
    level: competencyLevel(mastery)
  };
};
