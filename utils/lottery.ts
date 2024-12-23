import { Resources, ShipType, LotteryResult, Pool, ItemDetails, FailureReason } from '../types/lottery';
import poolData from '../db/pool_lowdb.json';
import itemsData from '../db/items.json';

// 配置数据库
const defaultData: Pool = poolData;

// 获取装备详情的函数
function getItemDetails(itemId: number): ItemDetails | undefined {
  return itemsData.items.find(item => item.id === itemId);
}

// 检查资源是否满足最低需求
function checkResourceRequirements(resources: Resources, dismantle: number[]): boolean {
  const [fuel, ammo, steel, bauxite] = dismantle.map(x => x * 10);
  return (
    resources.fuel >= fuel &&
    resources.ammo >= ammo &&
    resources.steel >= steel &&
    resources.bauxite >= bauxite
  );
}

export async function calculateProbabilities(
  resources: Resources, 
  shipType: ShipType,
  hqLevel: number = 120
): Promise<LotteryResult[]> {
  // 获取最高资源类型
  const highestResource = getHighestResource(resources);
  
  // 构建奖池名称（例如：gunFs, gunAm, gunBx）
  const poolKey = `${shipType}${highestResource.charAt(0).toUpperCase()}${highestResource.slice(1)}` as keyof typeof defaultData.pool[0];

  const results: LotteryResult[] = [];
  const failureReasons: FailureReason[] = [];

  // 直接使用奖池中的数值作为百分比
  defaultData.pool.forEach((item) => {
    const probability = Number(item[poolKey]) || 0;
    if (probability > 0) {
      const itemDetails = getItemDetails(item.id);
      
      // 如果找不到装备详情，跳过该装备
      if (!itemDetails) {
        failureReasons.push({
          itemName: `装备${item.id}`,
          reason: 'itemNotFound'
        });
        return;
      }

      const itemName = itemDetails.name.zh_cn || `装备${item.id}`;
      const requiredResources = {
        fuel: itemDetails.dismantle[0] * 10,
        ammo: itemDetails.dismantle[1] * 10,
        steel: itemDetails.dismantle[2] * 10,
        bauxite: itemDetails.dismantle[3] * 10
      };

      // 检查等级要求
      if (itemDetails.rarity * 10 > hqLevel) {
        failureReasons.push({
          itemName,
          reason: 'levelInsufficient',
          requiredLevel: itemDetails.rarity * 10
        });
        return;
      }

      // 检查资源要求
      if (!checkResourceRequirements(resources, itemDetails.dismantle)) {
        failureReasons.push({
          itemName,
          reason: 'resourceInsufficient',
          requiredResources
        });
        return;
      }

      results.push({
        poolName: `${poolKey}(${item.id})`,
        probability: probability,
        shipId: item.id,
        itemName,
        rarity: itemDetails.rarity,
        requiredResources
      });
    }
  });

  // 按概率降序排序
  results.sort((a, b) => b.probability - a.probability);

  // 将失败原因添加到第一个结果中
  if (results.length > 0 && failureReasons.length > 0) {
    results[0].failureReasons = failureReasons;
  } else if (results.length === 0 && failureReasons.length > 0) {
    // 如果没有成功的结果，创建一个只包含失败原因的结果
    results.push({
      poolName: 'failed',
      probability: 0,
      shipId: 0,
      failureReasons
    });
  }

  return results;
}

// 获取最高资源类型
function getHighestResource(resources: Resources): 'fs' | 'am' | 'bx' {
  const { fuel, steel, ammo, bauxite } = resources;
  
  // 创建资源值数组
  const resourceValues = [
    { type: 'fuel', value: fuel },
    { type: 'steel', value: steel },
    { type: 'ammo', value: ammo },
    { type: 'bauxite', value: bauxite }
  ];

  // 找出最高值的资源类型
  const maxResource = resourceValues.reduce((max, current) => 
    current.value > max.value ? current : max
  );

  // 根据最高资源类型返回对应的池类型
  switch (maxResource.type) {
    case 'fuel':
    case 'steel':
      return 'fs';
    case 'ammo':
      return 'am';
    case 'bauxite':
      return 'bx';
    default:
      return 'fs'; // 默认返回 fs
  }
} 