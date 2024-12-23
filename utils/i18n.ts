import { Language } from '../types/lottery';

export const translations = {
  ja_jp: {
    title: '艦これ装備開発シミュレーター',
    nav: {
      simulator: '開発シミュレーター',
      formula: '複合レシピジェネレーター',
      table: '確率一覧表'
    },
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
    shipTypeHelp: {
      title: '秘書艦種説明',
      gun: '砲戦系：戦艦(BB)、巡洋戦艦(FBB)、重巡洋艦(CA)、工作艦(AR)',
      torp: '水雷系：駆逐艦(DD)、海防艦(DE)、軽巡洋艦(CL)、重雷装巡洋艦(CLT)、練習巡洋艦(CT)、補給艦(AO、宗谷特務艦形態を除く)',
      air: '空母系：正規空母(CV)、装甲空母(CVB)、軽空母(CVL)、航空戦艦(BBV)、航空巡洋艦(CAV)、水上機母艦(AV)、揚陸艦(LHA)、宗谷特務艦形態',
      sub: '潜水系：潜水艦(SS)、潜水空母(SSV)、潜水母艦(AS)'
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
    nav: {
      simulator: '开发模拟器',
      formula: '复合公式生成器',
      table: '概率一览表'
    },
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
    shipTypeHelp: {
      title: '秘书舰种说明',
      gun: '炮战系：战舰(BB)、巡洋战舰(FBB)、重巡洋舰(CA)、工作舰(AR)',
      torp: '水雷系：驱逐舰(DD)、海防舰(DE)、轻巡洋舰(CL)、重雷装巡洋舰(CLT)、练习巡洋舰(CT)、补给舰(AO，宗谷特务舰形态除外)',
      air: '空母系：正规空母(CV)、装甲空母(CVB)、轻空母(CVL)、航空战舰(BBV)、航空巡洋舰(CAV)、水上机母舰(AV)、登陆舰(LHA)、宗谷特务舰形态',
      sub: '潜水系：潜水舰(SS)、潜水空母(SSV)、潜水母舰(AS)'
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
    nav: {
      simulator: '開發模擬器',
      formula: '複合公式生成器',
      table: '概率一覽表'
    },
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
    shipTypeHelp: {
      title: '秘書艦種說明',
      gun: '砲戰系：戰艦(BB)、巡洋戰艦(FBB)、重巡洋艦(CA)、工作艦(AR)',
      torp: '水雷系：驅逐艦(DD)、海防艦(DE)、輕巡洋艦(CL)、重雷裝巡洋艦(CLT)、練習巡洋艦(CT)、補給艦(AO，宗谷特務艦形態除外)',
      air: '空母系：正規空母(CV)、裝甲空母(CVB)、輕空母(CVL)、航空戰艦(BBV)、航空巡洋艦(CAV)、水上機母艦(AV)、登陸艦(LHA)、宗谷特務艦形態',
      sub: '潛水系：潛水艦(SS)、潛水空母(SSV)、潛水母艦(AS)'
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
    nav: {
      simulator: 'Development Simulator',
      formula: 'Recipe Generator',
      table: 'Probability Table'
    },
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
    shipTypeHelp: {
      title: 'Secretary Ship Type Guide',
      gun: 'Gunboat: Battleship(BB), Fast Battleship(FBB), Heavy Cruiser(CA), Repair Ship(AR)',
      torp: 'Torpedo: Destroyer(DD), Coastal Defense Ship(DE), Light Cruiser(CL), Torpedo Cruiser(CLT), Training Cruiser(CT), Fleet Oiler(AO, except Souya Special Form)',
      air: 'Carrier: Standard Carrier(CV), Armored Carrier(CVB), Light Carrier(CVL), Aviation Battleship(BBV), Aviation Cruiser(CAV), Seaplane Tender(AV), Amphibious Assault Ship(LHA), Souya Special Form',
      sub: 'Submarine: Submarine(SS), Aircraft Carrying Submarine(SSV), Submarine Tender(AS)'
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