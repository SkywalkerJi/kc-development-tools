import { Item, ShipType, RecipeResult, Resources } from '../types/lottery';
import { calculateProbabilities } from './lottery';

// 资源优先级顺序：[燃料, 钢材, 弹药, 铝]
const RESOURCE_LAYERS = [0, 2, 1, 3];

// 资源索引到奖池类型的映射
const RESOURCE_TO_POOL: Record<number, 'fs' | 'am' | 'bx'> = {
  0: 'fs', // 燃料
  1: 'am', // 弹药
  2: 'fs', // 钢材
  3: 'bx'  // 铝
};

// 调整资源量以满足优先级要求
function adjustResources(mins: number[], layer: number): number[] {
  const materials = [...mins];
  for (let i = 0; i < 4; i++) {
    if (RESOURCE_LAYERS.indexOf(i) < RESOURCE_LAYERS.indexOf(layer)) {
      // 如果当前资源优先级低于目标资源，且当前资源量大于等于目标资源量，则目标资源量+1
      if (materials[i] >= materials[layer]) {
        materials[layer] = materials[i] + 1;
      }
    } else {
      // 如果当前资源优先级高于等于目标资源，且当前资源量大于目标资源量，则目标资源量调整为相同值
      if (materials[i] > materials[layer]) {
        materials[layer] = materials[i];
      }
    }
  }
  return materials;
}

// 将资源数组转换为Resources对象
function arrayToResources(arr: number[]): Resources {
  return {
    fuel: arr[0],
    ammo: arr[1],
    steel: arr[2],
    bauxite: arr[3]
  };
}

// 生成开发配方
export async function generateRecipes(items: Item[], hqLevel: number = 120): Promise<RecipeResult[]> {
  if (items.length === 0) {
    return [];
  }

  console.log('开始生成配方，选中装备:', items.map(item => item.name.zh_cn));

  // 1. 计算最低资源消耗
  const mins = [10, 10, 10, 10];
  items.forEach(item => {
    for (let j = 0; j < 4; j++) {
      if (item.dismantle[j] * 10 > mins[j]) {
        mins[j] = item.dismantle[j] * 10;
      }
    }
  });

  console.log('最低资源需求:', mins);

  const validRecipes: RecipeResult[] = [];
  const targetItemIds = new Set(items.map(item => item.id));

  // 2. 遍历所有可能的秘书舰类型和资源组合
  const secretaryTypes: ShipType[] = ['gun', 'torp', 'air', 'sub'];
  
  for (let secretaryIndex = 0; secretaryIndex < secretaryTypes.length; secretaryIndex++) {
    const secretary = secretaryTypes[secretaryIndex];
    
    // 3. 遍历资源优先级
    for (let layerIndex = 0; layerIndex < 4; layerIndex++) {
      const layer = RESOURCE_LAYERS[layerIndex];
      const adjustedResources = adjustResources(mins, layer);
      const resources = arrayToResources(adjustedResources);

      // 强制设置最大资源类型
      const poolType = RESOURCE_TO_POOL[layer];
      console.log(`尝试组合 - 秘书舰类型: ${secretary}, 资源优先级: ${layer}, 奖池类型: ${poolType}, 资源:`, resources);

      try {
        // 4. 计算开发概率
        const results = await calculateProbabilities(resources, secretary, hqLevel, poolType);
        console.log('计算结果:', results);
        
        // 5. 检查是否包含目标装备
        const targetResults = results.filter(result => {
          const itemId = Number(result.shipId);
          return targetItemIds.has(itemId);
        });

        console.log('目标装备结果:', targetResults);

        if (targetResults.length > 0) {
          const probability = Math.min(...targetResults.map(r => r.probability));
          console.log('找到有效配方，概率:', probability);
          
          // 构建每个装备的概率映射
          const itemProbabilities: Record<number, number> = {};
          targetResults.forEach(result => {
            itemProbabilities[result.shipId] = result.probability;
          });
          
          // 7. 添加配方
          validRecipes.push({
            resources,
            shipTypes: [secretary],
            probability,
            itemProbabilities
          });
        }
      } catch (error) {
        console.error('计算概率时出错:', error);
      }
    }
  }

  console.log('生成的配方数量:', validRecipes.length);

  // 8. 按概率降序排序
  return validRecipes.sort((a, b) => b.probability - a.probability);
} 