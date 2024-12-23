'use client';

import { useState } from 'react';
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
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: '/simulator', label: t.nav.simulator },
    { href: '/formula', label: t.nav.formula },
    { href: '/table', label: t.nav.table }
  ];

  return (
    <>
      {/* 移动端菜单按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-md lg:hidden bg-white dark:bg-gray-800 shadow-lg"
      >
        <svg
          className="w-6 h-6 text-gray-600 dark:text-gray-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* 遮罩层 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* 侧边导航栏 */}
      <nav className={`
        fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg z-40
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-0
      `}>
        <div className="flex flex-col h-full p-4">
          <div className="space-y-4">
            {links.map(({ href, label }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-2 rounded-md text-sm font-medium transition-colors ${
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

          {/* 语言选择器 */}
          {onLanguageChange && (
            <div className="mt-auto pt-4 border-t dark:border-gray-700">
              <select
                value={language}
                onChange={(e) => onLanguageChange(e.target.value as Language)}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
              >
                <option value="ja_jp">日本語</option>
                <option value="zh_cn">简体中文</option>
                <option value="zh_tw">繁體中文</option>
                <option value="en_us">English</option>
              </select>
            </div>
          )}
        </div>
      </nav>
    </>
  );
} 