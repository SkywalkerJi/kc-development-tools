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
import secretaryBonusData from "../db/secretary_bonus.json";
import { getPoolType, getSecretaryBonus, applySecretaryBonuses } from "./secretary";

// 配置数据库
const defaultData: Pool = poolData;
const secretaryBonuses = secretaryBonusData;

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

export const calculateProbabilities = async (
  resources: Resources,
  secretary: ShipType,
  hqLevel: number,
  isLandBasedAircraftCondition: boolean = false,
  secretaryId: number = 0
): Promise<LotteryResult[]> => {
  // 获取最高资源类型
  const highestResource = getPoolType(resources);

  // 构建奖池名称（例如：gunFs, gunAm, gunBx）
  const poolKey = `${secretary}${highestResource
    .charAt(0)
    .toUpperCase()}${highestResource.slice(
    1
  )}` as keyof (typeof defaultData.pool)[0];

  const results: LotteryResult[] = [];
  const failureReasons: FailureReason[] = [];

  // 获取特殊秘书舰的概率调整
  const secretaryAdjustments = getSecretaryBonus(
    0,
    secretary,
    highestResource
  );

  // 直接使用奖池中的数值作为百分比
  let probabilities = defaultData.pool.map(item => ({
    itemId: item.id,
    probability: Number(item[poolKey]) || 0
  }));

  // 应用特殊秘书舰的概率调整
  probabilities = applySecretaryBonuses(probabilities, secretaryAdjustments);

  // 如果满足陆攻条件，应用特殊规则的概率调整
  if (isLandBasedAircraftCondition && secretary === "air") {
    const landBasedBonus = secretaryBonuses.find(bonus => bonus.shortName === "陆攻");
    if (landBasedBonus) {
      // 应用陆攻加成到空母弹池和空母铝池
      landBasedBonus.bonuses.forEach(poolBonus => {
        if (poolBonus.pool === "am" || poolBonus.pool === "bx") {
          poolBonus.adjustments.forEach(adjustment => {
            // 在相应池中查找并调整概率
            const targetItem = probabilities.find(item => item.itemId === adjustment.itemId);
            if (targetItem) {
              targetItem.probability += adjustment.value;
            }
          });
        }
      });
    }
  }

  // 处理每个装备的概率
  for (const prob of probabilities) {
    if (prob.probability > 0) {
      const itemDetails = getItemDetails(prob.itemId);

      // 如果找不到装备详情，跳过该装备
      if (!itemDetails) {
        failureReasons.push({
          itemName: `装备${prob.itemId}`,
          reason: "itemNotFound",
        });
        continue;
      }

      const itemName = itemDetails.name.zh_cn || `装备${prob.itemId}`;
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
        poolName: `${poolKey}(${prob.itemId})`,
        probability: prob.probability,
        shipId: prob.itemId,
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
};
