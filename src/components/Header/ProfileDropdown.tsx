import React, { useRef, useState } from 'react';
import { User, ChevronDown, LayoutDashboard, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';
import { useNavigate } from 'react-router-dom';

interface ProfileDropdownProps {
  onViewSettings: () => void;
}

export function ProfileDropdown({ onViewSettings }: ProfileDropdownProps) {
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useOnClickOutside(dropdownRef, () => setIsOpen(false));

  const handleViewProfile = () => {
    if (user?.profile?.username) {
      navigate(`/profile/${user.profile.username}`);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2 sm:px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-blue-600" />
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">
            {user?.profile?.username || 'Loading...'}
          </span>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 py-1 z-50">
          <button
            onClick={handleViewProfile}
            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
          >
            <LayoutDashboard className="w-4 h-4" />
            Your Profile
          </button>
          
          <button
            onClick={() => {
              onViewSettings();
              setIsOpen(false);
            }}
            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
          >
            <Settings className="w-4 h-4" />
            Settings
          </button>
          
          <div className="border-t border-gray-100 my-1" />
          
          <button
            onClick={() => {
              signOut();
              setIsOpen(false);
            }}
            className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-gray-50 w-full text-left"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}