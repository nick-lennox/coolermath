import React from 'react';
import { Eraser } from 'lucide-react';
import { ColorPicker } from './ColorPicker';
import { LineWidthPicker } from './LineWidthPicker';
import { DrawingOptions } from '../../types/drawing';

interface DrawingControlsProps {
  options: DrawingOptions;
  onOptionsChange: (options: Partial<DrawingOptions>) => void;
  onClear: () => void;
}

export function DrawingControls({ options, onOptionsChange, onClear }: DrawingControlsProps) {
  return (
    <div className="flex items-center justify-between gap-4 mb-4">
      <div className="flex items-center gap-6">
        <ColorPicker
          selectedColor={options.color}
          onChange={(color) => onOptionsChange({ color })}
        />
        <LineWidthPicker
          selectedWidth={options.lineWidth}
          onChange={(lineWidth) => onOptionsChange({ lineWidth })}
        />
      </div>
      <button
        onClick={onClear}
        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border rounded-md hover:bg-white"
      >
        <Eraser size={16} />
        Clear
      </button>
    </div>
  );
}