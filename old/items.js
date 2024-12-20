var itemtypenames;
if (itemtypenames == undefined)
  itemtypenames = [
    "Small Caliber Main Gun",
    "Medium Caliber Main Gun",
    "Large Caliber Main Gun",
    "Secondary Gun",
    "Anti-Aircraft Gun",
    "Anti-Aircraft Shell",
    "Armor Piercing Shell",
    "Torpedos & Submarine",
    "Carrier-Based Fighter",
    "Carrier-Based Torpedo Bomber",
    "Carrier-Based Dive Bomber",
    "Carrier-Based Reconn",
    "Seaplane",
    "Radar",
    "Anti-submarine Warfare",
    "Engine",
    "Extra Armor",
    "Anti-Air Fire Director",
    "Amphibious & Transport",
    "Land-Based Attack Aircraft",
    "Land-Based Fighter",
    "Night Battle Aid",
    "Submarine Torpedo",
    "Smoke Generator",
    "Anti-submarine Aircraft",
  ];

// Id, Name, Rarity, Internal Rarity, Type, Break Materials[, is AA]

const materialNames = ["Fuel", "Ammunition", "Steel", "Bauxite"];

const items = [
  // 小口径主炮
  [1, "12cm単装砲", 1, 0, 0, [0, 1, 1, 0], false],
  [2, "12.7cm連装砲", 1, 0, 0, [0, 1, 2, 0], false],
  [3, "10cm連装高角砲", 2, 1, 0, [0, 1, 3, 0], true],
  [48, "12cm単装高角砲", 1, 1, 0, [0, 1, 1, 0], true],
  [78, "12.7cm単装砲", 1, 0, 0, [1, 1, 1, 1], false],
  [147, "120mm/50 連装砲", 2, 2, 0, [0, 1, 2, 0], false],
  // 中口径主炮
  [4, "14cm単装砲", 1, 0, 1, [0, 2, 1, 0], false],
  [65, "15.2cm連装砲", 2, 2, 1, [0, 2, 3, 0], false],
  [5, "15.5cm三連装砲", 2, 0, 1, [0, 2, 5, 0], false],
  [6, "20.3cm連装砲", 2, 0, 1, [0, 3, 4, 0], false],
  [90, "20.3cm(2号)連装砲", 2, 1, 1, [0, 3, 4, 0], false],
  // 大口径主炮
  [7, "35.6cm連装砲", 1, 0, 2, [0, 10, 15, 0], false],
  [8, "41cm連装砲", 2, 1, 2, [0, 12, 20, 0], false],
  [9, "46cm三連装砲", 3, 2, 2, [0, 24, 25, 0], false],
  [298, "16inch Mk.I三連装砲", 3, 3, 2, [0, 15, 21, 1], false],
  [507, "14inch/45 連装砲", 1, 1, 2, [0, 10, 16, 0], false],
  // 副炮
  [10, "12.7cm連装高角砲", 1, 0, 3, [0, 2, 2, 0], true],
  [11, "15.2cm単装砲", 1, 0, 3, [0, 2, 2, 0], false],
  [12, "15.5cm三連装副砲", 2, 1, 3, [0, 2, 5, 0], false],
  [66, "8cm高角砲", 3, 3, 3, [0, 1, 2, 0], true],
  [71, "10cm連装高角砲(砲架)", 3, 3, 3, [0, 1, 3, 0], true],
  // 强化弹
  [35, "三式弾", 2, 0, 5, [0, 9, 6, 3], false],
  [36, "九一式徹甲弾", 3, 1, 6, [0, 3, 9, 0], false],
  // 机枪/高射装置
  [37, "7.7mm機銃", 1, 0, 4, [0, 1, 1, 0], false],
  [38, "12.7mm単装機銃", 1, 0, 4, [0, 1, 1, 0], false],
  [39, "25mm連装機銃", 2, 0, 4, [0, 2, 1, 0], false],
  [40, "25mm三連装機銃", 2, 1, 4, [0, 3, 1, 0], false],
  [49, "25mm単装機銃", 2, 1, 4, [0, 1, 1, 0], false],
  [51, "12cm30連装噴進砲", 2, 2, 4, [0, 4, 2, 2], false],
  [301, "20連装7inch UP Rocket Launchers", 3, 3, 4, [0, 4, 2, 4], false],
  [120, "91式高射装置", 1, 1, 17, [0, 1, 0, 1], false],
  // 鱼雷/特殊潜航艇
  [13, "61cm三連装魚雷", 1, 0, 7, [1, 1, 1, 0], false],
  [14, "61cm四連装魚雷", 1, 0, 7, [1, 2, 2, 0], false],
  [15, "61cm四連装(酸素)魚雷", 2, 1, 7, [2, 2, 2, 0], false],
  [41, "甲標的 甲型", 1, 1, 7, [0, 7, 7, 0], false],
  [213, "後期型艦首魚雷(6門)", 3, 3, 22, [2, 3, 2, 1], false],
  [440, "21inch艦首魚雷発射管6門(初期型)", 2, 2, 22, [3, 3, 2, 2], false],
  [442, "潜水艦後部魚雷発射管4門(初期型)", 2, 2, 22, [2, 2, 3, 2], false],
  [457, "後期型艦首魚雷(4門)", 4, 4, 22, [2, 2, 2, 2], false],
  [511, "21inch艦首魚雷発射管4門(初期型)", 2, 2, 22, [2, 2, 2, 2], false],
  // 对潜装备
  [44, "九四式爆雷投射機", 1, 0, 14, [0, 2, 1, 1], false],
  [45, "三式爆雷投射機", 3, 2, 14, [0, 3, 1, 1], false],
  [226, "九五式爆雷", 1, 1, 14, [1, 2, 0, 1], false],
  [46, "九三式水中聴音機", 1, 0, 14, [0, 0, 1, 1], false],
  [47, "三式水中探信儀", 3, 2, 14, [0, 0, 1, 2], false],
  // 舰攻
  [16, "九七式艦攻", 1, 0, 9, [1, 1, 0, 2], false],
  [17, "天山", 2, 1, 9, [2, 4, 0, 4], false],
  [18, "流星", 3, 2, 9, [2, 5, 0, 10], false],
  [52, "流星改", 3, 3, 9, [2, 6, 0, 10], false],
  [242, "Swordfish", 2, 2, 9, [1, 1, 0, 1], false],
  // 舰爆
  [23, "九九式艦爆", 1, 0, 10, [1, 1, 0, 2], false],
  [24, "彗星", 2, 1, 10, [2, 3, 0, 3], false],
  [57, "彗星一二型甲", 3, 2, 10, [2, 3, 0, 4], false],
  [60, "零式艦戦62型(爆戦)", 3, 2, 10, [1, 3, 0, 3], false],
  [195, "SBD", 2, 2, 10, [1, 3, 0, 2], false],
  // 舰战
  [19, "九六式艦戦", 1, 0, 8, [1, 1, 0, 1], false],
  [20, "零式艦戦21型", 1, 0, 8, [1, 1, 0, 2], false],
  [21, "零式艦戦52型", 2, 1, 8, [1, 2, 0, 3], false],
  [55, "紫電改二", 3, 2, 8, [2, 2, 0, 7], false],
  [22, "試製烈風 後期型", 3, 3, 8, [2, 2, 0, 9], false],
  [181, "零式艦戦32型", 2, 3, 8, [1, 2, 0, 2], false],
  [197, "F4F-3", 2, 2, 8, [1, 2, 0, 2], false],
  [249, "Fulmar", 2, 2, 8, [1, 2, 0, 2], false],
  // 舰侦
  [54, "彩雲", 3, 2, 11, [2, 0, 0, 11], false],
  [61, "二式艦上偵察機", 2, 1, 11, [3, 1, 0, 13], false],
  // 水上机
  [25, "零式水上偵察機", 1, 0, 12, [1, 1, 0, 2], false],
  [59, "零式水上観測機", 2, 1, 12, [1, 1, 0, 2], false],
  [163, "Ro.43水偵", 3, 3, 12, [1, 1, 0, 2], false],
  [414, "SOC Seagull", 3, 3, 12, [1, 1, 0, 2], false],
  [102, "九八式水上偵察機(夜偵)", 3, 3, 12, [2, 1, 0, 4], false],
  [26, "瑞雲", 2, 1, 12, [2, 3, 0, 5], false],
  [207, "瑞雲(六三一空)", 3, 3, 12, [2, 3, 0, 5], false],
  [194, "Laté 298B", 3, 3, 12, [2, 4, 0, 5], false],
  // 陆航飞机
  [168, "九六式陸攻", 1, 1, 19, [24, 26, 0, 25], false],
  [221, "一式戦 隼II型", 2, 2, 20, [1, 1, 0, 3], false],
  [250, "Spitfire Mk.I", 3, 3, 20, [1, 2, 0, 4], false],
  [445, "二式複戦 屠龍", 2, 2, 20, [2, 4, 0, 12], false],
  [201, "紫電一一型", 3, 3, 20, [2, 2, 0, 6], false],
  // 其他飞机
  [69, "カ号観測機", 3, 3, 24, [1, 1, 0, 4], false],
  [70, "三式指揮連絡機(対潜)", 2, 1, 24, [1, 1, 0, 2], false],
  // 电探/潜水电探
  [27, "13号対空電探", 2, 1, 13, [0, 0, 10, 10], false],
  [28, "22号対水上電探", 2, 1, 13, [0, 0, 15, 15], false],
  [29, "33号対水上電探", 3, 2, 13, [0, 0, 20, 15], false],
  [30, "21号対空電探", 2, 2, 13, [0, 0, 20, 20], false],
  [31, "32号対水上電探", 3, 3, 13, [0, 0, 20, 25], false],
  [32, "42号対空電探", 3, 4, 13, [0, 0, 25, 25], false],
  [210, "潜水艦搭載電探&水防式望遠鏡", 3, 2, 13, [0, 0, 12, 13], false],
  // 其他装备
  [33, "改良型艦本式タービン", 1, 0, 15, [10, 0, 10, 0], false],
  [34, "強化型艦本式缶", 2, 1, 15, [10, 0, 20, 0], false],
  [72, "増設バルジ(中型艦)", 2, 2, 16, [0, 0, 12, 0], false],
  [73, "増設バルジ(大型艦)", 2, 2, 16, [0, 0, 30, 0], false],
  [75, "ドラム缶(輸送用)", 1, 0, 18, [0, 0, 1, 0], false],
  [68, "大発動艇", 1, 0, 18, [1, 1, 0, 1], false],
  [74, "探照灯", 1, 0, 21, [0, 0, 1, 1], false],
  [500, "発煙装置(煙幕)", 1, 1, 23, [1, 0, 0, 1], false],
];

// let k = 0;
// for (let j = 0; j < itemtypenames.length; ++j) {
//   for (let i = 0; i < itemlist.length; ++i) {
//     if (itemlist[i][4] == j) {
//       items[k] = itemlist[i];
//       k++;
//     }
//   }
// }

function developResult(id, percentage, materials, hqlevel) {
  this.id = id;
  this.percentage = percentage;
  this.successful = true;
  for (let j = 0; j < items.length; ++j) {
    if (items[j][0] == id) {
      if (items[j][3] * 10 > hqlevel) this.successful = false;
      for (let i = 0; i < 4; ++i) {
        if (items[j][5][i] * 10 > materials[i]) {
          this.successful = false;
          break;
        }
      }
    }
  }

  this.toTRNode = function () {
    let itemid;
    for (let j = 0; j < items.length; ++j) {
      if (items[j][0] == id) {
        itemid = j;
      }
    }

    let node = document.createElement("tr");
    if (this.successful) node.className = "success";
    else {
      node.className = "fail";
      let title = "Require";
      for (let i = 0; i < 4; ++i) {
        if (items[itemid][5][i] * 10 > materials[i]) {
          title +=
            "\n" +
            getString(materialNames[i]) +
            " ≥ " +
            items[itemid][5][i] * 10;
        }
      }
      if (items[itemid][3] * 10 > hqlevel) {
        title += "\n" + getString("HQ Level") + " ≥ " + items[itemid][3] * 10;
      }
      node.title = getString(title);
    }
    let tdnode = document.createElement("td");
    tdnode.className = "type" + (items[itemid][6] ? 4 : items[itemid][4]);
    tdnode.appendChild(document.createTextNode(items[itemid][1]));
    node.appendChild(tdnode);
    tdnode = document.createElement("td");
    tdnode.appendChild(document.createTextNode(percentage + "%"));
    node.appendChild(tdnode);
    return node;
  };
}
