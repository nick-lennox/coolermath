import React, { forwardRef, Suspense } from 'react';
import { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types/types';
import { ExcalidrawCanvas } from './scratchpad/ExcalidrawCanvas';
import { LoadingSpinner } from './scratchpad/LoadingSpinner';

export interface ScratchpadRef {
  clear: () => void;
}

interface ScratchpadProps {
  isOverlayVisible?: boolean;
}

export const Scratchpad = forwardRef<ScratchpadRef, ScratchpadProps>(({ isOverlayVisible = false }, ref) => {
  const excalidrawRef = React.useRef<ExcalidrawImperativeAPI>(null);

  React.useImperativeHandle(ref, () => ({
    clear: () => {
      excalidrawRef.current?.updateScene({
        elements: []
      });
    }
  }));

  if (isOverlayVisible) {
    return null;
  }

  return (
    <div className="bg-gray-50 min-h-[50vh] md:min-h-[calc(100vh-8.5rem)] flex flex-col">
      <div className="flex-1 border border-gray-200 rounded-lg bg-white overflow-hidden">
        <Suspense fallback={<LoadingSpinner />}>
          <ExcalidrawCanvas excalidrawRef={excalidrawRef} />
        </Suspense>
      </div>
    </div>
  );
});

Scratchpad.displayName = 'Scratchpad';