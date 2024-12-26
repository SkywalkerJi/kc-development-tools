export interface Secretary {
  id: number;
  name: string;
  shortName: string;
  order: number;
}

export interface SecretaryAdjustment {
  itemId: number;
  value: number;
}

export interface SecretaryBonus {
  pool: string;
  adjustments: SecretaryAdjustment[];
}

export interface SecretaryData extends Secretary {
  bonuses: SecretaryBonus[];
} 