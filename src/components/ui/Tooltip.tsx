import React, { useState } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

export function Tooltip({ content, children }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  const handleMouseEnter = (e: React.MouseEvent) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setPosition({
      x: rect.left + window.scrollX,
      y: rect.top + window.scrollY - 5
    });
    setIsVisible(true);
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          className="fixed z-50 px-2 py-1 text-xs text-white bg-gray-900 rounded shadow-lg whitespace-nowrap transform -translate-x-1/2 -translate-y-full"
          style={{
            left: position.x,
            top: position.y,
            marginTop: '-4px'
          }}
        >
          {content}
          <div
            className="absolute left-1/2 bottom-0 w-2 h-2 bg-gray-900 transform rotate-45 translate-y-1/2 -translate-x-1/2"
          />
        </div>
      )}
    </div>
  );
}