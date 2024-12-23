'use client';

import { useState } from 'react';
import { Resources, ShipType, LotteryResult } from '../../types/lottery';
import { calculateProbabilities } from '../../utils/lottery';
import { getTranslation } from '../../utils/i18n';
import { HelpModal } from '../../components/HelpModal';

export default function Simulator() {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const t = getTranslation('zh_cn'); // 暂时使用固定语言，后续会从 context 获取

  const [resources, setResources] = useState<Resources>({
    fuel: 10,
    steel: 10,
    ammo: 10,
    bauxite: 10
  });
  const [shipType, setShipType] = useState<ShipType>('gun');
  const [hqLevel, setHqLevel] = useState<number>(120);
  const [results, setResults] = useState<LotteryResult[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCalculate = async () => {
    if (isCalculating) return;

    // 验证资源值是否在合法范围内
    const isValid = Object.values(resources).every(value => value >= 10 && value <= 300);
    if (!isValid) {
      alert('请确保所有资源值在10-300之间');
      return;
    }
    
    setIsCalculating(true);
    try {
      const results = await calculateProbabilities(resources, shipType, hqLevel);
      setResults(results);
    } catch (error) {
      console.error('计算概率时出错:', error);
      alert('计算概率时出错，请检查输入值和奖池数据');
    } finally {
      setIsCalculating(false);
    }
  };

  const handleResourceChange = (key: keyof Resources, value: string) => {
    const numValue = value === '' ? 10 : Math.min(300, Math.max(10, parseInt(value) || 10));
    setResources(prev => ({ ...prev, [key]: numValue }));
  };

  const totalProbability = results.reduce((sum, item) => sum + item.probability, 0);
  const failureRate = 100 - totalProbability;

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100">{t.title}</h1>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">{t.resources.fuel}</label>
              <input
                type="number"
                value={resources.fuel || ''}
                onChange={(e) => handleResourceChange('fuel', e.target.value)}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                min="10"
                max="300"
                placeholder="10"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">{t.resources.steel}</label>
              <input
                type="number"
                value={resources.steel || ''}
                onChange={(e) => handleResourceChange('steel', e.target.value)}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                min="10"
                max="300"
                placeholder="10"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">{t.resources.ammo}</label>
              <input
                type="number"
                value={resources.ammo || ''}
                onChange={(e) => handleResourceChange('ammo', e.target.value)}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                min="10"
                max="300"
                placeholder="10"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">{t.resources.bauxite}</label>
              <input
                type="number"
                value={resources.bauxite || ''}
                onChange={(e) => handleResourceChange('bauxite', e.target.value)}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                min="10"
                max="300"
                placeholder="10"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">
                  {t.secretary}
                </label>
                <button
                  onClick={() => setIsHelpOpen(true)}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                  title={t.shipTypeHelp.title}
                >
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              <select
                value={shipType}
                onChange={(e) => setShipType(e.target.value as ShipType)}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
              >
                <option value="gun">{t.shipTypes.gun}</option>
                <option value="torp">{t.shipTypes.torp}</option>
                <option value="air">{t.shipTypes.air}</option>
                <option value="sub">{t.shipTypes.sub}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">{t.hqLevel}</label>
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
            {isCalculating ? t.calculating : t.calculate}
          </button>
        </div>

        {results.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">{t.resultTitle}</h2>
            <div className="space-y-2">
              {results.map((result, index) => (
                <div
                  key={index}
                  className="flex justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded"
                >
                  <div className="flex-1">
                    <span className="mr-2 dark:text-gray-100">
                      {result.itemName}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 text-sm">
                      ({t.pools[result.poolName.split('(')[0] as keyof typeof t.pools]}) - {t.rarity}:{result.rarity}
                    </span>
                    {result.requiredResources && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {t.minRequirement}: {result.requiredResources.fuel}{t.resources.fuel}/
                        {result.requiredResources.ammo}{t.resources.ammo}/
                        {result.requiredResources.steel}{t.resources.steel}/
                        {result.requiredResources.bauxite}{t.resources.bauxite}
                      </div>
                    )}
                  </div>
                  <span className="ml-4">{result.probability}%</span>
                </div>
              ))}
              <div className="flex flex-col p-2 bg-red-50 dark:bg-red-900/30 rounded">
                <div className="flex justify-between dark:text-gray-100">
                  <span>{t.developmentFailed}</span>
                  <span>{failureRate.toFixed(2)}%</span>
                </div>
                {results[0]?.failureReasons && results[0].failureReasons.length > 0 && (
                  <div className="mt-2 text-sm text-gray-600">
                    <div className="font-medium mb-1">{t.failureReasons}：</div>
                    <div className="space-y-1">
                      {results[0].failureReasons.map((failure, index) => (
                        <div key={index} className="pl-2 border-l-2 border-red-200">
                          <div className="flex items-baseline">
                            <span className="font-medium">
                              {failure.itemName}
                            </span>
                            <span className="ml-2 text-sm text-red-500">
                              - {t.reasons[failure.reason as keyof typeof t.reasons]}
                            </span>
                          </div>
                          {failure.requiredLevel && (
                            <div className="text-xs text-gray-500">
                              {t.requiredLevel}: {failure.requiredLevel}
                            </div>
                          )}
                          {failure.requiredResources && (
                            <div className="text-xs text-gray-500">
                              {t.requiredResources}: {failure.requiredResources.fuel}{t.resources.fuel}/
                              {failure.requiredResources.ammo}{t.resources.ammo}/
                              {failure.requiredResources.steel}{t.resources.steel}/
                              {failure.requiredResources.bauxite}{t.resources.bauxite}
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

      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        title={t.shipTypeHelp.title}
      >
        <div className="space-y-3">
          <p>{t.shipTypeHelp.gun}</p>
          <p>{t.shipTypeHelp.torp}</p>
          <p>{t.shipTypeHelp.air}</p>
          <p>{t.shipTypeHelp.sub}</p>
        </div>
      </HelpModal>
    </main>
  );
} 