import { SubjectScore } from '../../types/score';

export function calculatePercentage(stats: SubjectScore): number {
  if (stats.total === 0) return 0;
  return Math.round((stats.correct / stats.total) * 100);
}

export function hasAnyData(stats: Record<string, SubjectScore>): boolean {
  return Object.values(stats).some(subject => subject.total > 0);
}