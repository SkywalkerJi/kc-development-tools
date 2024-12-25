import { Item, ShipType, RecipeResult, Resources } from '../types/lottery';
import { calculateProbabilities } from './lottery';
import { getSecretaryOptions } from './secretary';

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

  // 获取所有可用的秘书舰选项
  const secretaryOptions = getSecretaryOptions();
  
  // 检查是否包含九六式陆攻（ID 168）
  const hasLandBasedAircraft = items.some(item => item.id === 168);
  
  // 如果包含陆攻，则只生成满足特殊条件的配方
  if (hasLandBasedAircraft) {
    const minResources = {
      fuel: 240,
      ammo: 260,
      steel: 10,
      bauxite: 250
    };
    
    // 更新最低资源需求
    for (let j = 0; j < 4; j++) {
      if (mins[j] < [minResources.fuel, minResources.ammo, minResources.steel, minResources.bauxite][j]) {
        mins[j] = [minResources.fuel, minResources.ammo, minResources.steel, minResources.bauxite][j];
      }
    }
    
    // 只使用空母系秘书舰
    secretaryOptions.length = 0;
    secretaryOptions.push(...getSecretaryOptions().filter(opt => opt.shipType === 'air'));
  }

  // 遍历所有秘书舰选项
  for (const secretaryOption of secretaryOptions) {
    // 3. 遍历资源优先级
    for (let layerIndex = 0; layerIndex < 4; layerIndex++) {
      const layer = RESOURCE_LAYERS[layerIndex];
      const adjustedResources = adjustResources(mins, layer);
      const resources = arrayToResources(adjustedResources);

      try {
        // 4. 计算开发概率
        const results = await calculateProbabilities(
          resources,
          secretaryOption.shipType,
          hqLevel,
          hasLandBasedAircraft && secretaryOption.shipType === 'air',
          secretaryOption.id
        );
        console.log('计算结果:', results);
        console.log('失败原因:', results[0]?.failureReasons);
        
        // 5. 检查是否包含所有目标装备
        const targetResults = results.filter(result => {
          const itemId = Number(result.shipId);
          return targetItemIds.has(itemId);
        });

        console.log('目标装备结果:', targetResults);

        // 确保找到了所有目标装备
        const foundItemIds = new Set(targetResults.map(r => Number(r.shipId)));
        const allTargetsFound = Array.from(targetItemIds).every(id => foundItemIds.has(id));

        if (allTargetsFound) {
          // 计算总成功率（所有目标装备概率之和）
          const totalProbability = targetResults.reduce((sum, r) => sum + r.probability, 0);
          
          // 计算开发失败率（所有装备概率之和的剩余部分）
          const allEquipmentsProbability = results.reduce((sum, r) => {
            // 如果这个结果没有失败原因，说明是可以开发的装备
            const hasFailureReason = results[0]?.failureReasons?.some(
              f => f.itemName === r.itemName
            );
            return sum + (hasFailureReason ? 0 : r.probability);
          }, 0);
          
          const failureRate = 100 - allEquipmentsProbability;
          console.log('所有可开发装备概率:', allEquipmentsProbability);
          console.log('计算得到的失败率:', failureRate);
          
          // 构建每个装备的概率映射
          const itemProbabilities: Record<number, number> = {};
          targetResults.forEach(result => {
            itemProbabilities[result.shipId] = result.probability;
          });
          
          // 7. 添加配方
          validRecipes.push({
            resources,
            shipTypes: [secretaryOption.shipType],
            probability: totalProbability,
            itemProbabilities,
            failureRate,
            secretaryInfo: {  // 添加秘书舰信息
              id: secretaryOption.id,
              shortName: secretaryOption.shortName
            }
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