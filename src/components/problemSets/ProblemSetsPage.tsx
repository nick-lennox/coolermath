import React, { useState, useRef } from 'react';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ProblemSetsList } from './ProblemSetsList';
import { ProblemSetDetails } from './ProblemSetDetails';
import { CreateProblemSetModal } from './CreateProblemSetModal';
import { ProblemSetCard } from './ProblemSetCard';
import { useProblemSets } from '../../hooks/useProblemSets';
import { useAuth } from '../../contexts/AuthContext';
import { PageContainer } from '../layout/PageContainer';
import { toggleProblemSetPublic } from '../../lib/problemSets/togglePublic';
import { deleteProblemSet } from '../../lib/problemSets/delete';
import { ProblemSet } from '../../types/problemSet';

export function ProblemSetsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { problemSets, isLoading, refetch } = useProblemSets();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedProblemSetId, setSelectedProblemSetId] = useState<string | null>(null);
  const userSetsRef = useRef<HTMLDivElement>(null);
  const [hasOverflow, setHasOverflow] = useState(false);

  const handleQuestionSelect = (questionId: string) => {
    navigate('/', { state: { questionId } });
  };

  const handleNavigateToExplore = () => {
    navigate('/explore');
  };

  const handleScroll = (direction: 'left' | 'right') => {
    if (!userSetsRef.current) return;
    const cardWidth = userSetsRef.current.offsetWidth / 3; // Width of one card
    const newScrollLeft = userSetsRef.current.scrollLeft + (direction === 'left' ? -cardWidth : cardWidth);
    userSetsRef.current.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });
  };

  const handleTogglePublic = async (problemSet: ProblemSet) => {
    if (!user) return;

    try {
      await toggleProblemSetPublic(problemSet.id, !problemSet.is_public);
      refetch();
    } catch (error) {
      console.error('Error toggling problem set visibility:', error);
      alert('Failed to update problem set visibility. Please try again.');
    }
  };

  const handleDelete = async (problemSet: ProblemSet) => {
    if (!user) return;
    
    if (!confirm('Are you sure you want to delete this problem set? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteProblemSet(problemSet.id);
      refetch();
    } catch (error) {
      console.error('Error deleting problem set:', error);
      alert('Failed to delete problem set. Please try again.');
    }
  };

  // Check for overflow when the component mounts and when problem sets change
  React.useEffect(() => {
    const checkOverflow = () => {
      if (userSetsRef.current) {
        const { scrollWidth, clientWidth } = userSetsRef.current;
        setHasOverflow(scrollWidth > clientWidth);
      }
    };

    checkOverflow();
    // Also check after a short delay to account for any dynamic content
    const timer = setTimeout(checkOverflow, 100);

    // Add resize listener
    window.addEventListener('resize', checkOverflow);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkOverflow);
    };
  }, [problemSets]);

  if (selectedProblemSetId) {
    return (
      <ProblemSetDetails
        problemSetId={selectedProblemSetId}
        onBack={() => setSelectedProblemSetId(null)}
        onQuestionSelect={handleQuestionSelect}
        onNavigateToExplore={handleNavigateToExplore}
      />
    );
  }

  // Filter problem sets into user's sets and public sets
  const userProblemSets = user 
    ? problemSets.filter(set => set.created_by === user.profile?.username)
    : [];
  
  const publicProblemSets = problemSets.filter(set => 
    set.is_public && (!user || set.created_by !== user.profile?.username)
  );

  return (
    <PageContainer>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Problem Sets</h1>
        {user && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Create Problem Set</span>
            <span className="sm:hidden">Create</span>
          </button>
        )}
      </div>

      {user && (
        <div className="mb-12">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Your Problem Sets</h2>
          <div className="relative">
            {/* Only show scroll buttons on desktop AND when there's overflow */}
            {hasOverflow && (
              <div className="hidden md:block">
                <button
                  onClick={() => handleScroll('left')}
                  className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-50"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  onClick={() => handleScroll('right')}
                  className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-50"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            )}
            <div 
              ref={userSetsRef}
              className="overflow-x-auto scrollbar-hide scroll-smooth"
            >
              <div className="inline-flex gap-4 md:gap-6 pb-4 md:pb-0">
                {userProblemSets.map((problemSet) => (
                  <div 
                    key={problemSet.id} 
                    className="w-[85vw] sm:w-[45vw] md:w-[calc(33.333%-1rem)] flex-none"
                  >
                    <ProblemSetCard 
                      problemSet={problemSet}
                      onClick={() => setSelectedProblemSetId(problemSet.id)}
                      onTogglePublic={() => handleTogglePublic(problemSet)}
                      onDelete={() => handleDelete(problemSet)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Public Problem Sets</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {publicProblemSets.map((problemSet) => (
            <ProblemSetCard 
              key={problemSet.id} 
              problemSet={problemSet}
              onClick={() => setSelectedProblemSetId(problemSet.id)}
            />
          ))}
        </div>
      </div>

      <CreateProblemSetModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={refetch}
      />
    </PageContainer>
  );
}