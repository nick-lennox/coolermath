import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { SettingsSection } from './SettingsSection';

export function AccountSettings() {
  const { user, signOut } = useAuth();

  return (
    <SettingsSection title="Account Settings">
      <div className="space-y-4">
        <div className="text-sm text-gray-600">
          Email: {user?.email}
        </div>
        
        <div className="border-t border-gray-200 pt-4">
          <button
            onClick={() => signOut()}
            className="px-4 py-2 text-red-600 hover:text-red-700 font-medium"
          >
            Sign Out
          </button>
        </div>
      </div>
    </SettingsSection>
  );
}