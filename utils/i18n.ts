import { Language } from '../types/lottery';

export const translations = {
  ja_jp: {
    title: '艦これ装備開発シミュレーター',
    resources: {
      fuel: '燃料',
      steel: '鋼材',
      ammo: '弾薬',
      bauxite: 'ボーキサイト'
    },
    pools: {
      gunFs: '砲戦系(燃料/鋼材)',
      gunAm: '砲戦系(弾薬)',
      gunBx: '砲戦系(ボーキ)',
      torpFs: '水雷系(燃料/鋼材)',
      torpAm: '水雷系(弾薬)',
      torpBx: '水雷系(ボーキ)',
      airFs: '空母系(燃料/鋼材)',
      airAm: '空母系(弾薬)',
      airBx: '空母系(ボーキ)',
      subFs: '潜水系(燃料/鋼材)',
      subAm: '潜水系(弾薬)',
      subBx: '潜水系(ボーキ)'
    },
    secretary: '秘書艦種別',
    shipTypes: {
      gun: '砲戦系',
      torp: '水雷系',
      air: '空母系',
      sub: '潜水系'
    },
    hqLevel: '司令部レベル',
    calculate: '確率計算',
    calculating: '計算中...',
    resultTitle: '開発確率表',
    rarity: 'レア度',
    minRequirement: '必要資源',
    developmentFailed: '開発失敗',
    failureReasons: '失敗理由',
    reasons: {
      levelInsufficient: '司令部レベル不足',
      resourceInsufficient: '資源不足',
      itemNotFound: '装備データなし'
    },
    requiredLevel: '必要司令部レベル',
    requiredResources: '必要資源'
  },
  zh_cn: {
    title: 'Kancolle开发模拟器',
    resources: {
      fuel: '燃料',
      steel: '钢材',
      ammo: '弹药',
      bauxite: '铝土'
    },
    pools: {
      gunFs: '炮战系(燃料/钢材)',
      gunAm: '炮战系(弹药)',
      gunBx: '炮战系(铝)',
      torpFs: '水雷系(燃料/钢材)',
      torpAm: '水雷系(弹药)',
      torpBx: '水雷系(铝)',
      airFs: '空母系(燃料/钢材)',
      airAm: '空母系(弹药)',
      airBx: '空母系(铝)',
      subFs: '潜水系(燃料/钢材)',
      subAm: '潜水系(弹药)',
      subBx: '潜水系(铝)'
    },
    secretary: '秘书舰种',
    shipTypes: {
      gun: '炮战系',
      torp: '水雷系',
      air: '空母系',
      sub: '潜水系'
    },
    hqLevel: '司令部等级',
    calculate: '计算概率',
    calculating: '计算中...',
    resultTitle: '开发概率表',
    rarity: '稀有度',
    minRequirement: '最低需求',
    developmentFailed: '开发失败',
    failureReasons: '失败原因',
    reasons: {
      levelInsufficient: '司令部等级不足',
      resourceInsufficient: '资源不足',
      itemNotFound: '装备数据未找到'
    },
    requiredLevel: '需要司令部等级',
    requiredResources: '需要资源'
  },
  zh_tw: {
    title: 'Kancolle開發模擬器',
    resources: {
      fuel: '燃料',
      steel: '鋼材',
      ammo: '彈藥',
      bauxite: '鋁土'
    },
    pools: {
      gunFs: '砲戰系(燃料/鋼材)',
      gunAm: '砲戰系(彈藥)',
      gunBx: '砲戰系(鋁)',
      torpFs: '水雷系(燃料/鋼材)',
      torpAm: '水雷系(彈藥)',
      torpBx: '水雷系(鋁)',
      airFs: '空母系(燃料/鋼材)',
      airAm: '空母系(彈藥)',
      airBx: '空母系(鋁)',
      subFs: '潛水系(燃料/鋼材)',
      subAm: '潛水系(彈藥)',
      subBx: '潛水系(鋁)'
    },
    secretary: '秘書艦種',
    shipTypes: {
      gun: '砲戰系',
      torp: '水雷系',
      air: '空母系',
      sub: '潛水系'
    },
    hqLevel: '司令部等級',
    calculate: '計算概率',
    calculating: '計算中...',
    resultTitle: '開發概率表',
    rarity: '稀有度',
    minRequirement: '最低需求',
    developmentFailed: '開發失敗',
    failureReasons: '失敗原因',
    reasons: {
      levelInsufficient: '司令部等級不足',
      resourceInsufficient: '資源不足',
      itemNotFound: '裝備數據未找到'
    },
    requiredLevel: '需要司令部等級',
    requiredResources: '需要資源'
  },
  en_us: {
    title: 'Kancolle Equipment Development Simulator',
    resources: {
      fuel: 'Fuel',
      steel: 'Steel',
      ammo: 'Ammo',
      bauxite: 'Bauxite'
    },
    pools: {
      gunFs: 'Gunboat (Fuel/Steel)',
      gunAm: 'Gunboat (Ammo)',
      gunBx: 'Gunboat (Bauxite)',
      torpFs: 'Torpedo (Fuel/Steel)',
      torpAm: 'Torpedo (Ammo)',
      torpBx: 'Torpedo (Bauxite)',
      airFs: 'Carrier (Fuel/Steel)',
      airAm: 'Carrier (Ammo)',
      airBx: 'Carrier (Bauxite)',
      subFs: 'Submarine (Fuel/Steel)',
      subAm: 'Submarine (Ammo)',
      subBx: 'Submarine (Bauxite)'
    },
    secretary: 'Secretary Ship Type',
    shipTypes: {
      gun: 'Gunboat',
      torp: 'Torpedo',
      air: 'Carrier',
      sub: 'Submarine'
    },
    hqLevel: 'HQ Level',
    calculate: 'Calculate',
    calculating: 'Calculating...',
    resultTitle: 'Development Probability',
    rarity: 'Rarity',
    minRequirement: 'Minimum Required',
    developmentFailed: 'Development Failed',
    failureReasons: 'Failure Reasons',
    reasons: {
      levelInsufficient: 'HQ Level Insufficient',
      resourceInsufficient: 'Resources Insufficient',
      itemNotFound: 'Equipment Data Not Found'
    },
    requiredLevel: 'Required HQ Level',
    requiredResources: 'Required Resources'
  }
} as const;

export function getItemName(item: { name: { [key: string]: string } }, language: Language): string {
  if (language === 'zh_tw' && item.name.zh_tw) {
    return item.name.zh_tw;
  }
  
  if (language === 'en_us' && item.name.en_us) {
    return item.name.en_us;
  }
  
  if (language === 'zh_cn') {
    return item.name.zh_cn;
  }
  
  // 如果请求英文但没有英文翻译，使用日文
  if (language === 'en_us') {
    return item.name.ja_jp;
  }
  
  return item.name[language];
}

export function getTranslation(language: Language) {
  return translations[language];
} 