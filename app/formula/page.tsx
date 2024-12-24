"use client";

import { useState, useEffect } from "react";
import { ItemType, Item, RecipeResult } from "../../types/lottery";
import { getTranslation, getItemName } from "../../utils/i18n";
import { useLanguage } from "../../contexts/LanguageContext";
import { generateRecipes } from "../../utils/recipe";
import itemTypesData from "../../db/item_types.json";
import itemsData from "../../db/items.json";

export default function FormulaGenerator() {
  const { language } = useLanguage();
  const t = getTranslation(language);

  // 状态
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [recipes, setRecipes] = useState<RecipeResult[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);

  // 获取装备类型和装备列表
  const items = (itemsData.items as Item[])
    .filter((item) => item.craftable)
    .sort((a, b) => a.rarity - b.rarity);

  // 获取有可开发装备的类型列表
  const availableTypes = new Set(items.map((item) => item.type));
  const itemTypes = (itemTypesData.item_types as ItemType[])
    .filter((type) => availableTypes.has(type.id))
    .sort((a, b) => a.id - b.id);

  // 按类型分组装备
  const itemsByType = itemTypes.map((type) => ({
    type,
    items: items.filter((item) => item.type === type.id),
  }));

  // 处理装备选择
  const handleItemSelect = (itemId: number) => {
    setSelectedItems((prev) => {
      const newItems = prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId];
      return newItems;
    });
  };

  // 计算配方
  const calculateRecipes = async () => {
    setIsCalculating(true);
    const selectedItemsData = items.filter((item) =>
      selectedItems.includes(item.id)
    );
    const recipes = await generateRecipes(selectedItemsData);
    setRecipes(recipes);
    setIsCalculating(false);
  };

  // 当选中装备变化时自动计算
  useEffect(() => {
    if (selectedItems.length > 0) {
      calculateRecipes();
    } else {
      setRecipes([]);
    }
  }, [selectedItems]);

  return (
    <main className="p-4 lg:p-8 max-w-[1920px] mx-auto">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-8">
          {t.nav.formula}
        </h1>

        <div className="space-y-6">
          {/* 装备类型和选择 */}
          {itemsByType.map(({ type, items }) => (
            <div key={type.id} className="space-y-3">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
                {getItemName(type, language)}
                <span className="ml-2 text-sm text-gray-500">
                  ({items.length})
                </span>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-7 2xl:grid-cols-9 gap-2">
                {items.map((item) => (
                  <div key={item.id} className="relative">
                    <button
                      onClick={() => handleItemSelect(item.id)}
                      onMouseEnter={() => setHoveredItem(item.id)}
                      onMouseLeave={() => setHoveredItem(null)}
                      className={`w-full p-3 rounded text-sm min-h-[48px] flex items-center justify-center text-center break-words ${
                        selectedItems.includes(item.id)
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      }`}
                    >
                      {getItemName(item, language)}
                    </button>
                    {hoveredItem === item.id && (
                      <div className="absolute z-10 bg-gray-900 text-white p-2 rounded shadow-lg text-xs -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                        {t.rarity}: {item.rarity}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* 计算按钮和选中装备显示 */}
          <div className="sticky bottom-4 bg-white dark:bg-gray-900 p-4 shadow-lg rounded-lg">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <span className="text-sm text-gray-500">
                    已选择 {selectedItems.length} 个装备：
                    <span className="ml-2">
                      {selectedItems
                        .map((id) => {
                          const item = items.find((i) => i.id === id);
                          return item ? getItemName(item, language) : "";
                        })
                        .join("、")}
                    </span>
                  </span>
                </div>
                <button
                  disabled={selectedItems.length === 0 || isCalculating}
                  className={`px-4 py-2 rounded text-white min-w-[100px] ${
                    selectedItems.length === 0
                      ? "bg-gray-300 cursor-not-allowed"
                      : isCalculating
                      ? "bg-blue-400"
                      : "bg-blue-500 hover:bg-blue-600"
                  }`}
                >
                  {isCalculating ? "计算中..." : t.calculate}
                </button>
              </div>
            </div>
          </div>

          {/* 配方结果 */}
          {recipes.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {t.recipeResults}
              </h2>
              <div className="space-y-2">
                {recipes.map((recipe, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-50 dark:bg-gray-800 rounded flex items-center justify-between"
                  >
                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex gap-4">
                        <span>{t.resources.fuel}: {recipe.resources.fuel}</span>
                        <span>{t.resources.ammo}: {recipe.resources.ammo}</span>
                        <span>{t.resources.steel}: {recipe.resources.steel}</span>
                        <span>{t.resources.bauxite}: {recipe.resources.bauxite}</span>
                      </div>
                      <div className="text-gray-500">
                        {t.secretary}: {recipe.shipTypes.map(type => t.shipTypes[type]).join("/")}
                      </div>
                    </div>
                    <span className="text-lg font-bold ml-4">
                      {recipe.probability}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
