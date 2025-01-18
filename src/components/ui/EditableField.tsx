import React, { useState, useRef, useEffect } from 'react';
import { Pencil } from 'lucide-react';

interface EditableFieldProps {
  value: string;
  onSave: (newValue: string) => Promise<void>;
  isTitle?: boolean;
}

export function EditableField({ value, onSave, isTitle = false }: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedValue, setEditedValue] = useState(value);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if (isTitle) {
        inputRef.current.setSelectionRange(value.length, value.length);
      }
    }
  }, [isEditing, value]);

  const handleSave = async () => {
    if (editedValue === value) {
      setIsEditing(false);
      return;
    }

    try {
      setIsLoading(true);
      await onSave(editedValue);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving:', error);
      setEditedValue(value);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === 'Escape') {
      setEditedValue(value);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    const Component = isTitle ? 'input' : 'textarea';
    return (
      <Component
        ref={inputRef as any}
        value={editedValue}
        onChange={(e) => setEditedValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
        className={`w-full border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
          isTitle 
            ? 'text-2xl font-bold px-3 py-2 rounded-md' 
            : 'text-base px-3 py-2 min-h-[100px] resize-none rounded-lg'
        }`}
      />
    );
  }

  if (isTitle) {
    return (
      <div className="flex items-center gap-2 group">
        <h1 className="text-2xl font-bold text-gray-900">{value}</h1>
        <button
          onClick={() => setIsEditing(true)}
          className="inline-flex items-center text-gray-400 opacity-0 group-hover:opacity-100 hover:text-gray-600 transition-opacity"
          aria-label="Edit title"
        >
          <Pencil className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div 
      onClick={() => setIsEditing(true)}
      className="text-gray-600 cursor-text"
    >
      {value || <span className="text-gray-400 italic">Add a description...</span>}
    </div>
  );
}