import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
}

export function PageContainer({ children }: PageContainerProps) {
  return (
    <div className="w-full px-3 sm:px-4 md:px-6 py-6">
      {children}
    </div>
  );
}