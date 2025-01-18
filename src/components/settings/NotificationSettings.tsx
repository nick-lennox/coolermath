import React, { useState } from 'react';
import { SettingsSection } from './SettingsSection';
import { Toggle } from '../ui/Toggle';

export function NotificationSettings() {
  const [dailyReminders, setDailyReminders] = useState(false);
  const [weeklyProgress, setWeeklyProgress] = useState(true);

  return (
    <SettingsSection title="Notification Settings">
      <div className="space-y-4">
        <Toggle
          label="Daily Practice Reminders"
          description="Receive daily reminders to practice"
          checked={dailyReminders}
          onChange={setDailyReminders}
        />
        <Toggle
          label="Weekly Progress Report"
          description="Get a summary of your progress every week"
          checked={weeklyProgress}
          onChange={setWeeklyProgress}
        />
      </div>
    </SettingsSection>
  );
}