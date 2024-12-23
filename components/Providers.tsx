'use client';

import { useState, useEffect } from 'react';
import { ThemeProvider } from 'next-themes';
import { Language } from '../types/lottery';
import Navigation from './Navigation';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('zh_cn');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen">
        <Navigation language={language} onLanguageChange={setLanguage} />
        {children}
      </div>
    </ThemeProvider>
  );
} 