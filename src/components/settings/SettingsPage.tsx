import React from 'react';
import { ProfileSettings } from './ProfileSettings';
import { NotificationSettings } from './NotificationSettings';
import { AccountSettings } from './AccountSettings';
import { PageContainer } from '../layout/PageContainer';

export function SettingsPage() {
  return (
    <PageContainer>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Settings</h1>
      
      <div className="space-y-8">
        <ProfileSettings />
        <NotificationSettings />
        <AccountSettings />
      </div>
    </PageContainer>
  );
}