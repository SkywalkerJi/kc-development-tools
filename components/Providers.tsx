"use client";

import { useState, useEffect } from "react";
import { ThemeProvider } from "next-themes";
import { Language } from "../types/lottery";
import Navigation from "./Navigation";
import { LanguageProvider } from "../contexts/LanguageContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("zh_cn");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <LanguageProvider language={language} setLanguage={setLanguage}>
        <div className="min-h-screen flex">
          <Navigation language={language} onLanguageChange={setLanguage} />
          <div className="flex-1">{children}</div>
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}
