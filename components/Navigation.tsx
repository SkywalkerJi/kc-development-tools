'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Language } from '../types/lottery';
import { getTranslation } from '../utils/i18n';

export default function Navigation({ language, onLanguageChange }: { 
  language: Language;
  onLanguageChange?: (lang: Language) => void;
}) {
  const pathname = usePathname();
  const t = getTranslation(language);

  const links = [
    { href: '/simulator', label: t.nav.simulator },
    { href: '/formula', label: t.nav.formula },
    { href: '/table', label: t.nav.table }
  ];

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex space-x-4">
            {links.map(({ href, label }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </div>
          {onLanguageChange && (
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value as Language)}
              className="p-2 border rounded dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
            >
              <option value="ja_jp">日本語</option>
              <option value="zh_cn">简体中文</option>
              <option value="zh_tw">繁體中文</option>
              <option value="en_us">English</option>
            </select>
          )}
        </div>
      </div>
    </nav>
  );
} 