import React from 'react';
import { LINE_WIDTHS } from '../../types/drawing';

interface LineWidthPickerProps {
  selectedWidth: number;
  onChange: (width: number) => void;
}

export function LineWidthPicker({ selectedWidth, onChange }: LineWidthPickerProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">Size:</span>
      <div className="flex gap-2">
        {LINE_WIDTHS.map(({ label, value }) => (
          <button
            key={value}
            className={`px-3 py-1 text-sm rounded ${
              selectedWidth === value
                ? 'bg-gray-200 text-gray-800'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            } border`}
            onClick={() => onChange(value)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}