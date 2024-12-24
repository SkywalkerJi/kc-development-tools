"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ItemType, Item, RecipeResult } from "../../types/lottery";
import { getTranslation, getItemName } from "../../utils/i18n";
import { useLanguage } from "../../contexts/LanguageContext";
import { generateRecipes } from "../../utils/recipe";
import itemTypesData from "../../db/item_types.json";
import itemsData from "../../db/items.json";
import poolData from "../../db/pool_lowdb.json";
import Link from "next/link";

interface PoolItem {
  id: number;
  name: string;
  gunFs: number | string;
  gunAm: number | string;
  gunBx: number | string;
  torpFs: number | string;
  torpAm: number | string;
  torpBx: number | string;
  airFs: number | string;
  airAm: number | string;
  airBx: number | string;
  subFs: number | string;
  subAm: number | string;
  subBx: number | string;
}

interface PoolData {
  pool: PoolItem[];
}

export default function FormulaGenerator() {
  const { language } = useLanguage();
  const t = getTranslation(language);

  // 状态
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [recipes, setRecipes] = useState<RecipeResult[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [expandedRecipes, setExpandedRecipes] = useState<number[]>([]);
  const [hqLevel, setHqLevel] = useState<number>(120);
  const [recipeCount, setRecipeCount] = useState<number>(0);
  const recipeResultsRef = useRef<HTMLDivElement>(null);

  // 获取装备类型和装备列表
  const poolItemIds = new Set((poolData as PoolData).pool.map(item => item.id));
  const items = (itemsData.items as Item[])
    .filter((item) => poolItemIds.has(item.id))
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
  const calculateRecipes = useCallback(async () => {
    setIsCalculating(true);
    setRecipes([]);
    try {
      const selectedItemsData = items.filter((item) =>
        selectedItems.includes(item.id)
      );
      const results = await generateRecipes(selectedItemsData, hqLevel);
      setRecipes(results);
      setRecipeCount(results.length);
    } catch (error) {
      console.error("计算配方失败:", error);
      setRecipeCount(0);
    }
    setIsCalculating(false);
  }, [selectedItems, hqLevel, items]);

  // 处理按钮点击
  const handleCalculateClick = () => {
    calculateRecipes();
    // 滚动到结果区域
    if (recipeResultsRef.current) {
      recipeResultsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 当选中装备变化时自动计算
  useEffect(() => {
    if (selectedItems.length > 0) {
      calculateRecipes();
    } else {
      setRecipes([]);
      setRecipeCount(0);
    }
  }, [selectedItems]);

  // 处理配方展开/收起
  const toggleRecipe = (index: number) => {
    setExpandedRecipes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  // 生成模拟器链接
  const getSimulatorLink = (recipe: RecipeResult) => {
    const params = new URLSearchParams({
      fuel: recipe.resources.fuel.toString(),
      ammo: recipe.resources.ammo.toString(),
      steel: recipe.resources.steel.toString(),
      bauxite: recipe.resources.bauxite.toString(),
      secretary: recipe.shipTypes[0],
      items: selectedItems.join(","),
      hqLevel: hqLevel.toString(),
      autoCalculate: "true",
    });
    return `/simulator?${params.toString()}`;
  };

  // 当配方较少时默认展开
  useEffect(() => {
    if (recipes.length <= 3) {
      setExpandedRecipes(recipes.map((_, index) => index));
    } else {
      setExpandedRecipes([]);
    }
  }, [recipes]);

  return (
    <main className="p-4 lg:p-8 max-w-[1920px] mx-auto">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-8">
          {t.nav.formula}
        </h1>

        <div className="space-y-4">
          {/* 装备类型和选择 */}
          {itemsByType.map(({ type, items }) => (
            <div key={type.id}>
              <div className="flex items-center gap-4 mb-2">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center whitespace-nowrap">
                  {getItemName(type, language)}
                  <span className="ml-2 text-sm text-gray-500">
                    ({items.length})
                  </span>
                </h2>
                <div className="flex-1 flex flex-wrap gap-2">
                  {items.map((item) => (
                    <div key={item.id} className="relative">
                      <button
                        onClick={() => handleItemSelect(item.id)}
                        onMouseEnter={() => setHoveredItem(item.id)}
                        onMouseLeave={() => setHoveredItem(null)}
                        className={`px-2 py-1.5 rounded text-sm whitespace-nowrap ${
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
            </div>
          ))}

          {/* 计算按钮和选中装备显示 */}
          <div className="sticky bottom-4 bg-white dark:bg-gray-900 p-4 shadow-lg rounded-lg">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <span className="text-sm text-gray-500">
                    {t.selectedItems} {selectedItems.length}：
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
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {t.hqLevel}:
                    </span>
                    <select
                      value={hqLevel}
                      onChange={(e) => setHqLevel(Number(e.target.value))}
                      className="px-2 py-1.5 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
                    >
                      {[...Array(12)].map((_, i) => {
                        const level = (i + 1) * 10;
                        return (
                          <option key={level} value={level}>
                            {level}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <button
                    onClick={handleCalculateClick}
                    disabled={selectedItems.length === 0 || isCalculating}
                    className={`px-4 py-2 rounded text-white min-w-[100px] ${
                      selectedItems.length === 0
                        ? "bg-gray-300 cursor-not-allowed"
                        : isCalculating
                        ? "bg-blue-400"
                        : "bg-blue-500 hover:bg-blue-600"
                    }`}
                  >
                    {isCalculating ? t.calculating : t.gotResults.replace('{count}', recipeCount.toString())}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 配方结果 */}
          <div className="space-y-2">
            {recipes.length > 0 && (
              <>
                <h2 
                  ref={recipeResultsRef}
                  className="text-xl font-bold text-gray-900 dark:text-gray-100"
                >
                  {t.recipeResults}
                </h2>
                <div className="space-y-2">
                  {recipes.map((recipe, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden transition-all duration-200"
                    >
                      <div
                        className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                        onClick={() => toggleRecipe(index)}
                      >
                        <div className="flex items-center gap-6 text-sm">
                          <div className="flex gap-4">
                            <span>
                              {t.resources.fuel}: {recipe.resources.fuel}
                            </span>
                            <span>
                              {t.resources.ammo}: {recipe.resources.ammo}
                            </span>
                            <span>
                              {t.resources.steel}: {recipe.resources.steel}
                            </span>
                            <span>
                              {t.resources.bauxite}: {recipe.resources.bauxite}
                            </span>
                          </div>
                          <div className="text-gray-500">
                            {t.secretary}:{" "}
                            {recipe.shipTypes
                              .map((type) => t.shipTypes[type])
                              .join("/")}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Link
                            href={getSimulatorLink(recipe)}
                            className="text-blue-500 hover:text-blue-600 text-sm px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors duration-200"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {t.details}
                          </Link>
                          <span className="text-lg font-bold min-w-[60px] text-right">
                            {recipe.probability}%
                          </span>
                          <svg
                            className={`w-5 h-5 transition-transform duration-200 ${
                              expandedRecipes.includes(index)
                                ? "transform rotate-180"
                                : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>
                      </div>
                      <div
                        className={`transition-all duration-200 ${
                          expandedRecipes.includes(index)
                            ? "max-h-[500px] opacity-100"
                            : "max-h-0 opacity-0"
                        } overflow-hidden`}
                      >
                        <div className="px-4 pb-4">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b dark:border-gray-700">
                                <th className="py-2 text-left font-medium text-gray-600 dark:text-gray-300">
                                  {t.equipment}
                                </th>
                                <th className="py-2 text-right font-medium text-gray-600 dark:text-gray-300 w-24">
                                  {t.probability}
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {selectedItems.map((itemId) => {
                                const item = items.find((i) => i.id === itemId);
                                const probability =
                                  recipe.itemProbabilities?.[itemId] || 0;
                                return (
                                  item && (
                                    <tr
                                      key={itemId}
                                      className="border-b dark:border-gray-700 last:border-0"
                                    >
                                      <td className="py-2">
                                        {getItemName(item, language)}
                                      </td>
                                      <td className="py-2 text-right font-medium">
                                        {probability}%
                                      </td>
                                    </tr>
                                  )
                                );
                              })}
                              <tr className="border-t-2 dark:border-gray-600">
                                <td className="py-2 font-medium text-red-500">
                                  {t.failureRate}
                                </td>
                                <td className="py-2 text-right font-medium text-red-500">
                                  {recipe.failureRate}%
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
