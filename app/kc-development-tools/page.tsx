'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function KcDevTools() {
  const router = useRouter();

  useEffect(() => {
    router.push('simulator');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-gray-600 dark:text-gray-400">加载中...</div>
    </div>
  );
} 