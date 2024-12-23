'use client';

import { useState } from 'react';
import { useTheme } from 'next-themes';
import { Resources, ShipType, LotteryResult } from '../types/lottery';
import { calculateProbabilities } from '../utils/lottery';

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [resources, setResources] = useState<Resources>({
    fuel: 0,
    steel: 0,
    ammo: 0,
    bauxite: 0
  });
  const [shipType, setShipType] = useState<ShipType>('gun');
  const [hqLevel, setHqLevel] = useState<number>(120);
  const [results, setResults] = useState<LotteryResult[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCalculate = async () => {
    if (isCalculating) return;

    // 验证资源值
    const total = resources.fuel + resources.steel + resources.ammo + resources.bauxite;
    if (total <= 0) {
      alert('请输入有效的资源值');
      return;
    }
    
    setIsCalculating(true);
    try {
      const results = await calculateProbabilities(resources, shipType, hqLevel);
      console.log('计算结果:', results);
      setResults(results);
    } catch (error) {
      console.error('计算概率时出错:', error);
      alert('计算概率时出错，请检查输入值和奖池数据');
    } finally {
      setIsCalculating(false);
    }
  };

  const handleResourceChange = (key: keyof Resources, value: string) => {
    const numValue = value === '' ? 0 : Math.max(0, parseInt(value));
    setResources(prev => ({ ...prev, [key]: numValue }));
  };

  const totalProbability = results.reduce((sum, item) => sum + item.probability, 0);
  const failureRate = 100 - totalProbability;

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-gray-100">Kancolle开发模拟器</h1>
        
        {/* <div className="flex justify-end mb-4">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            {theme === 'dark' ? '切换到浅色模式' : '切换到深色模式'}
          </button>
        </div> */}
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">燃料</label>
              <input
                type="number"
                value={resources.fuel || ''}
                onChange={(e) => handleResourceChange('fuel', e.target.value)}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                min="0"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">钢材</label>
              <input
                type="number"
                value={resources.steel || ''}
                onChange={(e) => handleResourceChange('steel', e.target.value)}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                min="0"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">弹药</label>
              <input
                type="number"
                value={resources.ammo || ''}
                onChange={(e) => handleResourceChange('ammo', e.target.value)}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                min="0"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">铝土</label>
              <input
                type="number"
                value={resources.bauxite || ''}
                onChange={(e) => handleResourceChange('bauxite', e.target.value)}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                min="0"
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">秘书舰种</label>
              <select
                value={shipType}
                onChange={(e) => setShipType(e.target.value as ShipType)}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
              >
                <option value="gun">炮战系</option>
                <option value="torp">水雷系</option>
                <option value="air">空母系</option>
                <option value="sub">潜水系</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">司令部等级</label>
              <input
                type="number"
                value={hqLevel}
                onChange={(e) => setHqLevel(Math.max(1, Math.min(120, parseInt(e.target.value) || 120)))}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                min="1"
                max="120"
                placeholder="120"
              />
            </div>
          </div>

          <button
            onClick={handleCalculate}
            disabled={isCalculating}
            className={`w-full py-2 rounded text-white ${
              isCalculating 
                ? 'bg-blue-300 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {isCalculating ? '计算中...' : '计算概率'}
          </button>
        </div>

        {results.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">开发概率表</h2>
            <div className="space-y-2">
              {results.map((result, index) => (
                <div
                  key={index}
                  className="flex justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded"
                >
                  <div className="flex-1">
                    <span className="mr-2 dark:text-gray-100">{result.itemName}</span>
                    <span className="text-gray-500 dark:text-gray-400 text-sm">
                      ({result.poolName}) - 稀有度:{result.rarity}
                    </span>
                    {result.requiredResources && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        最低需求: {result.requiredResources.fuel}燃/{result.requiredResources.ammo}弹/
                        {result.requiredResources.steel}钢/{result.requiredResources.bauxite}铝
                      </div>
                    )}
                  </div>
                  <span className="ml-4">{result.probability}%</span>
                </div>
              ))}
              <div className="flex flex-col p-2 bg-red-50 dark:bg-red-900/30 rounded">
                <div className="flex justify-between dark:text-gray-100">
                  <span>开发失败</span>
                  <span>{failureRate.toFixed(2)}%</span>
                </div>
                {results[0]?.failureReasons && results[0].failureReasons.length > 0 && (
                  <div className="mt-2 text-sm text-gray-600">
                    <div className="font-medium mb-1">失败原因：</div>
                    <div className="space-y-1">
                      {results[0].failureReasons.map((failure, index) => (
                        <div key={index} className="pl-2 border-l-2 border-red-200">
                          <div className="flex items-baseline">
                            <span className="font-medium">{failure.itemName}</span>
                            <span className="ml-2 text-sm text-red-500">- {failure.reason}</span>
                          </div>
                          {failure.requiredLevel && (
                            <div className="text-xs text-gray-500">
                              需要司令部等级: {failure.requiredLevel}
                            </div>
                          )}
                          {failure.requiredResources && (
                            <div className="text-xs text-gray-500">
                              需要资源: {failure.requiredResources.fuel}燃/{failure.requiredResources.ammo}弹/
                              {failure.requiredResources.steel}钢/{failure.requiredResources.bauxite}铝
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
