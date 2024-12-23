export type ShipType = 'gun' | 'torp' | 'air' | 'sub';

export interface Resources {
  fuel: number;
  steel: number;
  ammo: number;
  bauxite: number;
}

export interface ItemDetails {
  id: number;
  rarity: number;
  dismantle: number[];
  name: {
    ja_jp: string;
    ja_kana: string;
    ja_romaji: string;
    zh_cn: string;
    en_us?: string;
  };
}

export interface FailureReason {
  itemName: string;
  reason: string;
  requiredLevel?: number;
  requiredResources?: Resources;
}

export interface PoolItem {
  id: number;
  name: string;
  gunFs: string | number;
  gunAm: string | number;
  gunBx: string | number;
  torpFs: string | number;
  torpAm: string | number;
  torpBx: string | number;
  airFs: string | number;
  airAm: string | number;
  airBx: string | number;
  subFs: string | number;
  subAm: string | number;
  subBx: string | number;
}

export interface Pool {
  pool: PoolItem[];
}

export interface LotteryResult {
  poolName: string;
  probability: number;
  shipId: number;
  itemName?: string;
  rarity?: number;
  requiredResources?: Resources;
  failureReasons?: FailureReason[];
} 