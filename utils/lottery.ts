import {
  Resources,
  ShipType,
  LotteryResult,
  Pool,
  ItemDetails,
  FailureReason,
} from "../types/lottery";
import poolData from "../db/pool_lowdb.json";
import itemsData from "../db/items.json";
import { getPoolType, getSecretaryBonus, applySecretaryBonuses } from "./secretary";

// 配置数据库
const defaultData: Pool = poolData;

// 获取装备详情的函数
function getItemDetails(itemId: number): ItemDetails | undefined {
  return itemsData.items.find((item) => item.id === itemId);
}

// 检查资源是否满足最低需求
function checkResourceRequirements(
  resources: Resources,
  dismantle: number[]
): boolean {
  const [fuel, ammo, steel, bauxite] = dismantle.map((x) => x * 10);
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
  hqLevel: number = 120,
  secretaryId: number = 0,
  forcedPoolType?: "fs" | "am" | "bx"
): Promise<LotteryResult[]> {
  // 获取最高资源类型
  const highestResource = forcedPoolType || getPoolType(resources);

  // 构建奖池名称（例如：gunFs, gunAm, gunBx）
  const poolKey = `${shipType}${highestResource
    .charAt(0)
    .toUpperCase()}${highestResource.slice(
    1
  )}` as keyof (typeof defaultData.pool)[0];

  const results: LotteryResult[] = [];
  const failureReasons: FailureReason[] = [];

  // 获取特殊秘书舰的概率调整
  const secretaryAdjustments = getSecretaryBonus(
    secretaryId,
    shipType,
    highestResource
  );

  // 直接使用奖池中的数值作为百分比
  let probabilities = defaultData.pool.map(item => ({
    shipId: item.id,
    probability: Number(item[poolKey]) || 0
  }));

  // 应用特殊秘书舰的概率调整
  probabilities = applySecretaryBonuses(probabilities, secretaryAdjustments);

  // 处理每个装备的概率
  for (const prob of probabilities) {
    if (prob.probability > 0) {
      const itemDetails = getItemDetails(prob.shipId);

      // 如果找不到装备详情，跳过该装备
      if (!itemDetails) {
        failureReasons.push({
          itemName: `装备${prob.shipId}`,
          reason: "itemNotFound",
        });
        continue;
      }

      const itemName = itemDetails.name.zh_cn || `装备${prob.shipId}`;
      const requiredResources = {
        fuel: itemDetails.dismantle[0] * 10,
        ammo: itemDetails.dismantle[1] * 10,
        steel: itemDetails.dismantle[2] * 10,
        bauxite: itemDetails.dismantle[3] * 10,
      };

      // 检查等级要求
      if (itemDetails.rarity * 10 > hqLevel) {
        failureReasons.push({
          itemName,
          reason: "levelInsufficient",
          requiredLevel: itemDetails.rarity * 10,
        });
        continue;
      }

      // 检查资源要求
      if (!checkResourceRequirements(resources, itemDetails.dismantle)) {
        failureReasons.push({
          itemName,
          reason: "resourceInsufficient",
          requiredResources,
        });
        continue;
      }

      results.push({
        poolName: `${poolKey}(${prob.shipId})`,
        probability: prob.probability,
        shipId: prob.shipId,
        itemName,
        rarity: itemDetails.rarity,
        requiredResources,
      });
    }
  }

  // 按概率降序排序
  results.sort((a, b) => b.probability - a.probability);

  // 将失败原因添加到第一个结果中
  if (results.length > 0 && failureReasons.length > 0) {
    results[0].failureReasons = failureReasons;
  } else if (results.length === 0 && failureReasons.length > 0) {
    // 如果没有成功的结果，创建一个只包含失败原因的结果
    results.push({
      poolName: "failed",
      probability: 0,
      shipId: 0,
      failureReasons,
    });
  }

  return results;
}
