import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ProfileDashboard } from './ProfileDashboard';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { useProfile } from '../../hooks/useProfile';

export function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const { user } = useAuth();
  const { profile, isLoading, error } = useProfile(username || '');

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !profile) {
    return <Navigate to="/" replace />;
  }

  const isOwnProfile = user?.profile?.username === username;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {isOwnProfile ? 'Your Profile' : `${profile.username}'s Profile`}
          </h1>
        </div>
        <ProfileDashboard profileId={profile.id} />
      </div>
    </div>
  );
}