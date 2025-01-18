import React, { forwardRef } from 'react';
import { Excalidraw } from '@excalidraw/excalidraw';
import { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types/types';

interface ExcalidrawCanvasProps {
  excalidrawRef: React.RefObject<ExcalidrawImperativeAPI>;
}

export const ExcalidrawCanvas = React.memo(({ excalidrawRef }: ExcalidrawCanvasProps) => {
  return (
    <div className="w-full h-full">
      <Excalidraw
        initialData={{
          appState: {
            theme: 'light',
            viewBackgroundColor: '#ffffff',
            currentItemFontFamily: 1,
            defaultFontSize: 20
          }
        }}
        UIOptions={{
          canvasActions: {
            loadScene: false,
            saveToActiveFile: false,
            export: false,
            saveAsImage: false
          }
        }}
      />
    </div>
  );
});

ExcalidrawCanvas.displayName = 'ExcalidrawCanvas';