"use client";

import "./globals.css";
import Providers from "../components/Providers";
import { getTranslation } from '../utils/i18n';
import { Language } from '../types/lottery';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 获取当前路径
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  // 根据路径设置标题
  const t = getTranslation('zh_cn' as Language);
  if (typeof document !== 'undefined') {
    document.title = pathname.includes('/simulator') ? t.title : 'Kancolle Development Tools';
  }

  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="bg-white dark:bg-gray-900">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
