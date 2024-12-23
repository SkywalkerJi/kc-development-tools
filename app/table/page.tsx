'use client';

import { useState } from 'react';
import { Language } from '../../types/lottery';
import { getTranslation } from '../../utils/i18n';

export default function ProbabilityTable() {
  const [language, setLanguage] = useState<Language>('zh_cn');
  const t = getTranslation(language);

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">概率一览表</h1>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="p-2 border rounded dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
          >
            <option value="ja_jp">日本語</option>
            <option value="zh_cn">简体中文</option>
            <option value="zh_tw">繁體中文</option>
            <option value="en_us">English</option>
          </select>
        </div>
        
        <div className="text-center text-gray-500 dark:text-gray-400">
          功能开发中...
        </div>
      </div>
    </main>
  );
} 