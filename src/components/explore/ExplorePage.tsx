import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { QuestionCard } from './QuestionCard';
import { FilterPanel } from './FilterPanel';
import { FilterBadges } from './FilterBadges';
import { useExploreQuestions } from '../../hooks/useExploreQuestions';
import { useNavigateToQuestion } from '../../hooks/useNavigateToQuestion';
import { Loader2 } from 'lucide-react';
import { PageContainer } from '../layout/PageContainer';

interface ExplorePageProps {
  onQuestionSelect: (questionId: string) => void;
}

export function ExplorePage({ onQuestionSelect }: ExplorePageProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    subject: '',
    difficulty: '',
    successRate: ''
  });

  const { questions, isLoading, error } = useExploreQuestions({
    searchQuery,
    ...filters
  });

  const { navigateToQuestion } = useNavigateToQuestion();

  const handleQuestionSelect = (questionId: string) => {
    navigateToQuestion(questionId, onQuestionSelect);
  };

  const handleRemoveFilter = (key: keyof typeof filters) => {
    setFilters(prev => ({
      ...prev,
      [key]: ''
    }));
  };

  return (
    <PageContainer>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Questions</h1>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 sm:flex-none">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions..."
              className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
          <button 
            onClick={() => setShowFilters(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 border rounded-lg hover:bg-gray-50"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

      <FilterBadges
        filters={filters}
        onRemoveFilter={handleRemoveFilter}
      />

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center text-red-600 py-8">
          {error}
        </div>
      ) : questions.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No questions found matching your criteria
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {questions.map((question) => (
            <div key={question.id} className="min-w-[300px] h-full">
              <QuestionCard
                {...question}
                onSelect={handleQuestionSelect}
              />
            </div>
          ))}
        </div>
      )}

      <FilterPanel 
        isOpen={showFilters} 
        onClose={() => setShowFilters(false)}
        filters={filters}
        onFiltersChange={setFilters}
      />
    </PageContainer>
  );
}