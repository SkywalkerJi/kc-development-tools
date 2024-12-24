'use client';

import { useState } from 'react';
import { ItemType, Item, RecipeResult } from '../../types/lottery';
import { getTranslation, getItemName } from '../../utils/i18n';
import { useLanguage } from '../../contexts/LanguageContext';
import { generateRecipes } from '../../utils/recipe';
import itemTypesData from '../../db/item_types.json';
import itemsData from '../../db/items.json';

export default function FormulaGenerator() {
  const { language } = useLanguage();
  const t = getTranslation(language);

  // 状态
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [recipes, setRecipes] = useState<RecipeResult[]>([]);

  // 获取装备类型和装备列表
  const items = (itemsData.items as Item[])
    .filter(item => item.craftable)
    .sort((a, b) => a.rarity - b.rarity);

  // 获取有可开发装备的类型列表
  const availableTypes = new Set(items.map(item => item.type));
  const itemTypes = (itemTypesData.item_types as ItemType[])
    .filter(type => availableTypes.has(type.id))
    .sort((a, b) => a.id - b.id);

  // 按类型分组装备
  const itemsByType = itemTypes.map(type => ({
    type,
    items: items.filter(item => item.type === type.id)
  }));

  // 处理装备选择
  const handleItemSelect = (itemId: number) => {
    setSelectedItems(prev => {
      const newItems = prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId];
      return newItems;
    });
  };

  // 计算配方
  const calculateRecipes = async () => {
    const selectedItemsData = items.filter(item => selectedItems.includes(item.id));
    const recipes = await generateRecipes(selectedItemsData);
    setRecipes(recipes);
  };

  return (
    <main className="p-4 lg:p-8">
      <div className="space-y-8">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100">
          {t.nav.formula}
        </h1>
        
        <div className="space-y-8">
          {/* 装备类型和选择 */}
          {itemsByType.map(({ type, items }) => (
            <div key={type.id} className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
                {getItemName(type, language)}
                <span className="ml-2 text-sm text-gray-500">({items.length})</span>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {items.map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleItemSelect(item.id)}
                    className={`p-2 rounded text-sm ${
                      selectedItems.includes(item.id)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                    }`}
                  >
                    {getItemName(item, language)}
                    <span className="ml-1 text-xs">
                      ({t.rarity}:{item.rarity})
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* 计算按钮 */}
          <div className="sticky bottom-4 bg-white dark:bg-gray-900 p-4 shadow-lg rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">
                已选择 {selectedItems.length} 个装备
              </span>
              <button
                onClick={calculateRecipes}
                disabled={selectedItems.length === 0}
                className={`px-4 py-2 rounded text-white ${
                  selectedItems.length === 0
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                {t.calculate}
              </button>
            </div>
          </div>

          {/* 配方结果 */}
          {recipes.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {t.recipeResults}
              </h2>
              {recipes.map((recipe, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 dark:bg-gray-800 rounded"
                >
                  <div className="flex justify-between items-center">
                    <div className="space-x-2">
                      <span>{t.resources.fuel}: {recipe.resources.fuel}</span>
                      <span>{t.resources.ammo}: {recipe.resources.ammo}</span>
                      <span>{t.resources.steel}: {recipe.resources.steel}</span>
                      <span>{t.resources.bauxite}: {recipe.resources.bauxite}</span>
                    </div>
                    <span>{recipe.probability}%</span>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    {t.secretary}: {recipe.shipTypes.map(type => t.shipTypes[type]).join('/')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 