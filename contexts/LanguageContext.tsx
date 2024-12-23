'use client';

import { createContext, useContext, ReactNode } from 'react';
import { Language } from '../types/lottery';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export function LanguageProvider({ children, language, setLanguage }: {
  children: ReactNode;
  language: Language;
  setLanguage: (lang: Language) => void;
}) {
  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
} 