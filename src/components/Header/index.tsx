import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, LogIn } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { AuthModal } from '../auth/AuthModal';
import { ProfileDropdown } from './ProfileDropdown';
import { Navigation } from './Navigation';

export function Header() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <>
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity flex-shrink-0 mr-4"
            >
              <GraduationCap className="text-blue-600" size={24} />
              <h1 className="text-xl font-bold text-gray-800">SAT Prep</h1>
            </button>
            
            <div className="min-w-0 flex-1 flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <Navigation />
              </div>
              
              <div className="ml-4 flex-shrink-0">
                {user ? (
                  <ProfileDropdown 
                    onViewProfile={() => navigate(`/profile/${user.profile?.username}`)}
                    onViewSettings={() => navigate('/settings')}
                  />
                ) : (
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                  >
                    <LogIn className="w-4 h-4" />
                    <span className="hidden sm:inline">Sign In</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
}