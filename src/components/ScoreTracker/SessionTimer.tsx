import React from 'react';
import { Clock } from 'lucide-react';
import { useSessionTimer } from '../../contexts/SessionTimerContext';

interface SessionTimerProps {
  className?: string;
}

export function SessionTimer({ className = "" }: SessionTimerProps) {
  const { seconds, formatTime } = useSessionTimer();

  return (
    <div className={`flex items-center gap-2 text-sm text-gray-500 ${className}`}>
      <Clock className="w-4 h-4" />
      <span>{formatTime(seconds)}</span>
    </div>
  );
}