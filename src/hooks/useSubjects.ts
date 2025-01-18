import { useState, useEffect } from 'react';
import { Subject, TEST_TYPES, TestType } from '../types/subjects';

export function useSubjects() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Convert test types to subjects
    const subjectsList = Object.entries(TEST_TYPES).map(([id, name]): Subject => ({
      id: id as TestType,
      name,
      icon: 'Calculator', // All math subjects use calculator icon
      hasLevel: id === 'SAT' || id === 'ACT' // Only SAT and ACT have levels
    }));

    setSubjects(subjectsList);
    setIsLoading(false);
  }, []);

  return { subjects, isLoading, error };
}