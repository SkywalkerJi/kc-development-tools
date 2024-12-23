import { Item, Resources, ShipType, RecipeResult } from '../types/lottery';

// 根据装备类型确定可用的秘书舰类型
function getAvailableShipTypes(items: Item[]): ShipType[] {
  const types = new Set<ShipType>();

  items.forEach(item => {
    // 根据装备类型判断秘书舰类型
    // 这里需要根据实际规则补充逻辑
    switch (item.type) {
      case 1: // 小口径主炮
      case 2: // 中口径主炮
      case 3: // 大口径主炮
        types.add('gun');
        break;
      case 5: // 鱼雷
      case 6: // 舰战
        types.add('torp');
        break;
      case 7: // 舰攻
      case 8: // 舰爆
      case 9: // 舰侦
        types.add('air');
        break;
      case 12: // 声纳
      case 13: // 爆雷
        types.add('sub');
        break;
      default:
        // 其他装备类型需要根据实际规则补充
        break;
    }
  });

  return Array.from(types);
}

// 根据分解值计算可能的资源投入
function calculatePossibleResources(items: Item[]): Resources[] {
  const recipes: Resources[] = [];

  // 计算所有装备的分解值范围
  const dismantleRanges = items.map(item => item.dismantle);

  // 找出每种资源的最大值
  const maxValues = dismantleRanges.reduce((acc, curr) => ({
    fuel: Math.max(acc.fuel, curr[0] * 10),
    ammo: Math.max(acc.ammo, curr[1] * 10),
    steel: Math.max(acc.steel, curr[2] * 10),
    bauxite: Math.max(acc.bauxite, curr[3] * 10),
  }), { fuel: 0, ammo: 0, steel: 0, bauxite: 0 });

  // 生成可能的资源组合
  // 这里简化处理，实际应该根据更复杂的规则生成
  recipes.push({
    fuel: Math.min(300, Math.max(10, maxValues.fuel)),
    ammo: Math.min(300, Math.max(10, maxValues.ammo)),
    steel: Math.min(300, Math.max(10, maxValues.steel)),
    bauxite: Math.min(300, Math.max(10, maxValues.bauxite)),
  });

  return recipes;
}

// 计算成功率
function calculateProbability(items: Item[], recipe: Resources, shipType: ShipType): number {
  // 这里需要实现实际的概率计算逻辑
  // 当前返回一个示例值
  return 10;
}

// 生成开发配方
export function generateRecipes(items: Item[]): RecipeResult[] {
  const recipes: RecipeResult[] = [];
  
  // 获取可用的秘书舰类型
  const shipTypes = getAvailableShipTypes(items);
  
  // 获取可能的资源组合
  const possibleResources = calculatePossibleResources(items);
  
  // 生成所有可能的配方组合
  possibleResources.forEach(resources => {
    shipTypes.forEach(shipType => {
      const probability = calculateProbability(items, resources, shipType);
      
      recipes.push({
        resources,
        shipTypes: [shipType],
        probability,
      });
    });
  });
  
  return recipes;
} 