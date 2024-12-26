'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Language, getTranslation } from '../utils/i18n';

export default function Home() {
  const [language, setLanguage] = useState<Language>('zh_cn');
  const t = getTranslation(language);

  return (
    <main className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* 语言选择 */}
        <div className="flex justify-end">
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

        {/* 标题 */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {t.title}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {t.description}
          </p>
        </div>

        {/* 功能介绍卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 开发模拟器 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                {t.simulator.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {t.simulator.description}
              </p>
              <Link 
                href="/simulator" 
                className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                {t.simulator.button}
              </Link>
            </div>
          </div>

          {/* 复合公式生成器 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                {t.formula.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {t.formula.description}
              </p>
              <Link 
                href="/formula" 
                className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                {t.formula.button}
              </Link>
            </div>
          </div>

          {/* 概率一览表 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                {t.table.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {t.table.description}
              </p>
              <Link 
                href="/table" 
                className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                {t.table.button}
              </Link>
            </div>
          </div>
        </div>

        {/* 项目信息 */}
        <div className="text-center text-gray-600 dark:text-gray-400 text-sm">
          <p>{t.footer.disclaimer}</p>
          <p>{t.footer.github}</p>
        </div>
      </div>
    </main>
  );
} 