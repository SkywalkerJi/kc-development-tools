'use client';

import { Language } from '../../types/lottery';
import { getTranslation } from '../../utils/i18n';
import { useLanguage } from '../../contexts/LanguageContext';

export default function ProbabilityTable() {
  const { language } = useLanguage();
  const t = getTranslation(language);

  return (
    <main className="p-4 lg:p-8">
      <div className="space-y-8">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100">
          {t.nav.table}
        </h1>
        
        <div className="text-center text-gray-500 dark:text-gray-400">
          功能开发中...
        </div>
      </div>
    </main>
  );
} 