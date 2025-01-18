import React from 'react';
import { Language } from '../../types/subjects';

interface LanguageSelectorProps {
  selectedLanguage?: Language;
  onChange: (language: Language) => void;
}

const languages: Language[] = [
  'French', 'German', 'Spanish', 'Hebrew', 
  'Italian', 'Latin', 'Chinese', 'Japanese', 'Korean'
];

export function LanguageSelector({ selectedLanguage, onChange }: LanguageSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {languages.map((language) => (
        <button
          key={language}
          onClick={() => onChange(language)}
          className={`px-3 py-1 text-sm rounded-full transition-all ${
            selectedLanguage === language
              ? 'bg-blue-600 text-white'
              : 'bg-white border border-gray-200 text-gray-700 hover:border-blue-300'
          }`}
        >
          {language}
        </button>
      ))}
    </div>
  );
}