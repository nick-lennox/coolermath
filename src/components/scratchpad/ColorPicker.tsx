import React from 'react';
import { COLORS } from '../../types/drawing';

interface ColorPickerProps {
  selectedColor: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ selectedColor, onChange }: ColorPickerProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">Color:</span>
      <div className="flex gap-2">
        {COLORS.map(({ label, value }) => (
          <button
            key={value}
            className={`w-6 h-6 rounded-full border-2 ${
              selectedColor === value ? 'border-gray-400' : 'border-transparent'
            }`}
            style={{ backgroundColor: value }}
            title={label}
            onClick={() => onChange(value)}
          />
        ))}
      </div>
    </div>
  );
}