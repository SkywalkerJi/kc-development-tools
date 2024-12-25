export type ShipType = 'gun' | 'torp' | 'air' | 'sub';

export interface SecretaryAdjustment {
  itemId: number;
  value: number;
}

export interface SecretaryBonus {
  id: number;
  name: string;
  shortName: string;
  order: number;
  shipType: ShipType;
  bonuses: {
    pool: string;
    adjustments: SecretaryAdjustment[];
  }[];
}

import { Resources } from '../types/lottery';
import secretaryBonusData from '../db/secretary_bonus.json';

export function getPoolType(resources: Resources): string {
  const { fuel, steel, ammo, bauxite } = resources;
  const resourceValues = [
    { type: "fs", value: Math.max(fuel, steel) },
    { type: "am", value: ammo },
    { type: "bx", value: bauxite }
  ];
  return resourceValues.reduce((max, current) =>
    current.value > max.value ? current : max
  ).type;
}

// 类型转换函数
function validateShipType(type: string): ShipType {
  if (['gun', 'torp', 'air', 'sub'].includes(type)) {
    return type as ShipType;
  }
  return 'gun'; // 默认值
}

// 转换数据类型
const typedSecretaryBonusData: SecretaryBonus[] = secretaryBonusData.map(s => ({
  ...s,
  shipType: validateShipType(s.shipType)
}));

export function getSecretaryBonus(secretaryId: number, shipType: ShipType, pool: string): SecretaryAdjustment[] {
  const secretary = typedSecretaryBonusData.find(s => s.id === secretaryId);
  if (!secretary) return [];

  if (secretary.shipType !== shipType) return [];

  const bonus = secretary.bonuses.find(b => b.pool === pool);
  return bonus?.adjustments || [];
}

export function isSpecialSecretary(secretaryId: number): boolean {
  return typedSecretaryBonusData.some(s => s.id === secretaryId);
}

export function getSecretaryInfo(secretaryId: number): SecretaryBonus | undefined {
  return typedSecretaryBonusData.find(s => s.id === secretaryId);
}

/**
 * 应用特殊秘书舰的概率调整
 * @param probabilities 原始概率数组
 * @param adjustments 概率调整数组
 * @returns 调整后的概率数组
 */
export function applySecretaryBonuses(
  probabilities: { itemId: number; probability: number }[],
  adjustments: SecretaryAdjustment[]
): { itemId: number; probability: number }[] {
  if (!adjustments.length) {
    return probabilities;
  }

  return probabilities.map(prob => {
    const adjustment = adjustments.find(adj => adj.itemId === prob.itemId);
    if (adjustment) {
      return {
        ...prob,
        probability: Math.max(0, prob.probability + adjustment.value)
      };
    }
    return prob;
  });
} 