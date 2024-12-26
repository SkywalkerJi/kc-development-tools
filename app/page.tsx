'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* 标题 */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            舰队收藏开发工具集
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            为提督们提供的装备开发模拟与数据分析工具
          </p>
        </div>

        {/* 功能介绍卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 开发模拟器 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                开发模拟器
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                模拟装备开发结果，支持特殊秘书舰加成，帮助提督优化开发策略。
              </p>
              <Link 
                href="/simulator" 
                className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                开始模拟
              </Link>
            </div>
          </div>

          {/* 复合公式生成器 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                复合公式生成器
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                根据目标装备生成最优的复合公式，提高开发效率。
              </p>
              <Link 
                href="/formula" 
                className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                生成公式
              </Link>
            </div>
          </div>

          {/* 概率一览表 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                概率一览表
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                查看所有装备的开发概率，包括基础概率和秘书舰加成。
              </p>
              <Link 
                href="/probability" 
                className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                查看概率
              </Link>
            </div>
          </div>
        </div>

        {/* 项目信息 */}
        <div className="text-center text-gray-600 dark:text-gray-400 text-sm">
          <p>本项目仅供学习交流使用，游戏数据来源于网络</p>
          <p>如有问题或建议，欢迎在 GitHub 上提出 issue</p>
        </div>
      </div>
    </main>
  );
} 