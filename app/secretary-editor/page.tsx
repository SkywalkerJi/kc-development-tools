'use client';

import React, { useState, useEffect } from 'react';
import Select, { SingleValue } from 'react-select';
import { SecretaryBonus, ShipType } from '../../utils/secretary';
import poolData from '../../db/pool_lowdb.json';
import itemsData from '../../db/items.json';

// 定义资源池类型
const POOL_TYPES = ['fs', 'am', 'bx'];
const SHIP_TYPES = ['gun', 'torp', 'air', 'sub'];

// 获取装备名称
function getItemName(itemId: number): string {
  const item = itemsData.items.find(item => item.id === itemId);
  return item?.name?.zh_cn || `装备${itemId}`;
}

interface ItemOption {
  value: number;
  label: string;
}

// 获取可用的装备列表
function getAvailableItems(): ItemOption[] {
  const items = new Set<number>();
  Object.values(poolData.pool).forEach(item => {
    items.add(item.id);
  });
  return Array.from(items).map(id => ({
    value: id,
    label: getItemName(id)
  })).sort((a, b) => a.value - b.value);
}

// 获取资源池显示名称
function getPoolTypeName(type: string): string {
  switch (type) {
    case 'fs': return '油钢';
    case 'am': return '弹';
    case 'bx': return '铝';
    default: return type;
  }
}

export default function SecretaryEditor() {
  const [secretaries, setSecretaries] = useState<SecretaryBonus[]>([]);
  const [editingSecretary, setEditingSecretary] = useState<SecretaryBonus | null>(null);
  const [availableItems] = useState(getAvailableItems());

  // 加载现有数据
  useEffect(() => {
    fetch('/api/secretary-bonus')
      .then(res => res.json())
      .then(data => {
        // 确保所有记录都有order字段，如果没有则按id排序
        const sortedData = data.map((s: SecretaryBonus, index: number) => ({
          ...s,
          order: s.order ?? index,
          shortName: s.shortName ?? s.name.split('/')[0]
        })).sort((a: SecretaryBonus, b: SecretaryBonus) => a.order - b.order);
        setSecretaries(sortedData);
      });
  }, []);

  // 添加新的特殊秘书舰
  const handleAddSecretary = () => {
    const newSecretary: SecretaryBonus = {
      id: Math.max(0, ...secretaries.map(s => s.id)) + 1,
      name: '',
      shortName: '',
      order: secretaries.length,
      shipType: 'gun',
      bonuses: []
    };
    setEditingSecretary(newSecretary);
  };

  // 编辑现有特殊秘书舰
  const handleEditSecretary = (secretary: SecretaryBonus) => {
    setEditingSecretary({ ...secretary });
  };

  // 删除特殊秘��舰
  const handleDeleteSecretary = async (id: number) => {
    if (confirm('确定要删除这个特殊秘书舰吗？')) {
      await fetch(`/api/secretary-bonus/${id}`, { method: 'DELETE' });
      setSecretaries(secretaries.filter(s => s.id !== id));
    }
  };

  // 移动秘书舰顺序
  const handleMoveSecretary = (id: number, direction: 'up' | 'down') => {
    const index = secretaries.findIndex(s => s.id === id);
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === secretaries.length - 1)
    ) {
      return;
    }

    const newSecretaries = [...secretaries];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // 交换位置
    [newSecretaries[index], newSecretaries[targetIndex]] = 
    [newSecretaries[targetIndex], newSecretaries[index]];

    // 更新所有记录的 order 字段
    const updatedSecretaries = newSecretaries.map((secretary, idx) => ({
      ...secretary,
      order: idx
    }));

    setSecretaries(updatedSecretaries);
    handleSaveAll(updatedSecretaries);
  };

  // 导出JSON文件
  const handleExportJson = () => {
    const jsonString = JSON.stringify(secretaries, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'secretary_bonus.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 保存所有更改
  const handleSaveAll = async (data: SecretaryBonus[]) => {
    await fetch('/api/secretary-bonus', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  };

  // 添加新的规则
  const handleAddBonus = () => {
    if (editingSecretary) {
      setEditingSecretary({
        ...editingSecretary,
        bonuses: [
          ...editingSecretary.bonuses,
          {
            pool: 'fs',
            adjustments: []
          }
        ]
      });
    }
  };

  // 添加新的装备调整
  const handleAddAdjustment = (bonusIndex: number) => {
    if (editingSecretary) {
      const newBonuses = [...editingSecretary.bonuses];
      newBonuses[bonusIndex] = {
        ...newBonuses[bonusIndex],
        adjustments: [
          ...newBonuses[bonusIndex].adjustments,
          { itemId: availableItems[0].value, value: 0 }
        ]
      };
      setEditingSecretary({ ...editingSecretary, bonuses: newBonuses });
    }
  };

  // 保存编辑
  const handleSave = async () => {
    if (editingSecretary) {
      const method = secretaries.some(s => s.id === editingSecretary.id) ? 'PUT' : 'POST';
      await fetch('/api/secretary-bonus', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingSecretary)
      });
      
      setSecretaries(prev => {
        const newSecretaries = method === 'PUT' 
          ? prev.map(s => s.id === editingSecretary.id ? editingSecretary : s)
          : [...prev, editingSecretary];
        return newSecretaries.sort((a, b) => a.order - b.order);
      });
      setEditingSecretary(null);
    }
  };

  // 添加复制规则的处理函数
  const handleCopyBonus = (bonusIndex: number) => {
    if (editingSecretary) {
      const currentBonus = editingSecretary.bonuses[bonusIndex];
      // 确定下一个资源池类型
      const currentPoolIndex = POOL_TYPES.indexOf(currentBonus.pool);
      const nextPool = POOL_TYPES[(currentPoolIndex + 1) % POOL_TYPES.length];
      
      // 创建新的规则，使用深拷贝复制调整值
      const newBonus = {
        pool: nextPool,
        adjustments: currentBonus.adjustments.map(adj => ({
          itemId: adj.itemId,
          value: adj.value
        }))
      };

      const newBonuses = [...editingSecretary.bonuses];
      newBonuses.splice(bonusIndex + 1, 0, newBonus);
      
      setEditingSecretary({
        ...editingSecretary,
        bonuses: newBonuses
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-white">特殊秘书舰规则编辑器</h1>
        <div className="space-x-2">
          <button
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            onClick={handleExportJson}
          >
            导出JSON
          </button>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={handleAddSecretary}
          >
            添加新秘书舰
          </button>
        </div>
      </div>

      {/* 编辑表单 */}
      {editingSecretary && (
        <div className="bg-gray-800 p-4 rounded shadow-md mb-4">
          <h2 className="text-xl font-bold mb-4 text-white">编辑秘书舰</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-200">名称</label>
            <input
              type="text"
              value={editingSecretary.name}
              onChange={e => setEditingSecretary({
                ...editingSecretary,
                name: e.target.value
              })}
              className="border border-gray-700 p-2 rounded bg-gray-700 text-white w-full focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-200">ID</label>
              <input
                type="text"
                value={editingSecretary.id}
                disabled
                className="border border-gray-700 p-2 rounded bg-gray-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-200">简称</label>
              <input
                type="text"
                value={editingSecretary.shortName}
                onChange={e => setEditingSecretary({
                  ...editingSecretary,
                  shortName: e.target.value
                })}
                className="border border-gray-700 p-2 rounded bg-gray-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-200">舰种</label>
              <select
                value={editingSecretary.shipType}
                onChange={e => setEditingSecretary({
                  ...editingSecretary,
                  shipType: e.target.value as ShipType
                })}
                className="border border-gray-700 p-2 rounded bg-gray-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                {SHIP_TYPES.map(type => (
                  <option key={type} value={type}>
                    {type === 'gun' ? '炮战系' :
                     type === 'torp' ? '水雷系' :
                     type === 'air' ? '空母系' : '潜水系'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 规则列表 */}
          {editingSecretary.bonuses.map((bonus, bonusIndex) => (
            <div key={bonusIndex} className="bg-gray-700 p-4 rounded mb-4">
              <div className="flex gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-200">资源池</label>
                  <select
                    value={bonus.pool}
                    onChange={e => {
                      const newBonuses = [...editingSecretary.bonuses];
                      newBonuses[bonusIndex] = {
                        ...bonus,
                        pool: e.target.value
                      };
                      setEditingSecretary({
                        ...editingSecretary,
                        bonuses: newBonuses
                      });
                    }}
                    className="border border-gray-600 p-2 rounded bg-gray-600 text-white"
                  >
                    {POOL_TYPES.map(type => (
                      <option key={type} value={type}>
                        {type === 'fs' ? '油钢' :
                         type === 'am' ? '弹' : '铝'}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2 items-end">
                  <button
                    onClick={() => handleCopyBonus(bonusIndex)}
                    className="text-blue-400 hover:text-blue-300"
                    title="复制到下一个资源池"
                  >
                    复制
                  </button>
                  <button
                    onClick={() => {
                      const newBonuses = editingSecretary.bonuses.filter((_, i) => i !== bonusIndex);
                      setEditingSecretary({
                        ...editingSecretary,
                        bonuses: newBonuses
                      });
                    }}
                    className="text-red-400 hover:text-red-300"
                  >
                    删除规则
                  </button>
                </div>
              </div>

              <table className="w-full mb-4">
                <thead>
                  <tr>
                    <th className="text-left text-gray-200">装备</th>
                    <th className="text-left text-gray-200">调整值</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {bonus.adjustments.map((adj, adjIndex) => (
                    <tr key={adjIndex}>
                      <td className="py-2">
                        <Select<ItemOption>
                          value={availableItems.find(item => item.value === adj.itemId)}
                          onChange={(option: SingleValue<ItemOption>) => {
                            if (option) {
                              const newBonuses = [...editingSecretary.bonuses];
                              newBonuses[bonusIndex].adjustments[adjIndex].itemId = option.value;
                              setEditingSecretary({
                                ...editingSecretary,
                                bonuses: newBonuses
                              });
                            }
                          }}
                          options={availableItems}
                          isSearchable={true}
                          placeholder="搜索装备..."
                          noOptionsMessage={() => "没有找到匹配的装备"}
                          className="w-full"
                          classNames={{
                            control: () => "border border-gray-600 rounded bg-gray-700",
                            menu: () => "bg-gray-700 shadow-lg rounded mt-1",
                            option: (state: { isFocused: boolean; isSelected: boolean }) => 
                              `px-3 py-2 ${state.isFocused ? 'bg-gray-600' : 'bg-gray-700'} 
                               ${state.isSelected ? 'bg-blue-600' : ''} text-gray-200`,
                            singleValue: () => "text-gray-200",
                            input: () => "text-gray-200",
                            placeholder: () => "text-gray-400",
                            noOptionsMessage: () => "text-gray-300",
                            menuList: () => "bg-gray-700",
                            dropdownIndicator: () => "text-gray-400",
                            indicatorSeparator: () => "bg-gray-600"
                          }}
                          styles={{
                            control: (base) => ({
                              ...base,
                              backgroundColor: 'rgb(55, 65, 81)',
                              borderColor: 'rgb(75, 85, 99)',
                              color: 'rgb(229, 231, 235)'
                            }),
                            menu: (base) => ({
                              ...base,
                              backgroundColor: 'rgb(55, 65, 81)'
                            }),
                            option: (base) => ({
                              ...base,
                              backgroundColor: 'rgb(55, 65, 81)',
                              color: 'rgb(229, 231, 235)',
                              '&:hover': {
                                backgroundColor: 'rgb(75, 85, 99)'
                              }
                            }),
                            singleValue: (base) => ({
                              ...base,
                              color: 'rgb(229, 231, 235)'
                            }),
                            input: (base) => ({
                              ...base,
                              color: 'rgb(229, 231, 235)'
                            })
                          }}
                        />
                      </td>
                      <td className="py-2">
                        <input
                          type="number"
                          value={adj.value}
                          onChange={e => {
                            const newBonuses = [...editingSecretary.bonuses];
                            newBonuses[bonusIndex].adjustments[adjIndex].value = Number(e.target.value);
                            setEditingSecretary({
                              ...editingSecretary,
                              bonuses: newBonuses
                            });
                          }}
                          className="border border-gray-600 p-2 rounded bg-gray-700 text-white w-24"
                        />
                      </td>
                      <td className="py-2">
                        <button
                          onClick={() => {
                            const newBonuses = [...editingSecretary.bonuses];
                            newBonuses[bonusIndex].adjustments = bonus.adjustments.filter((_, i) => i !== adjIndex);
                            setEditingSecretary({
                              ...editingSecretary,
                              bonuses: newBonuses
                            });
                          }}
                          className="text-red-500 hover:text-red-600"
                        >
                          删除
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <button
                onClick={() => handleAddAdjustment(bonusIndex)}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                添加装备调整
              </button>
            </div>
          ))}

          <div className="flex gap-4">
            <button
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500"
              onClick={handleAddBonus}
            >
              添加规则
            </button>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={handleSave}
            >
              保存
            </button>
          </div>
        </div>
      )}

      {/* 秘书舰列表 */}
      <div className="bg-gray-800 rounded shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-4 py-2 text-left text-white">ID</th>
              <th className="px-4 py-2 text-left text-white">简称</th>
              <th className="px-4 py-2 text-left text-white">名称</th>
              <th className="px-4 py-2 text-left text-white">舰种</th>
              <th className="px-4 py-2 text-left text-white">规则</th>
              <th className="px-4 py-2 text-left text-white">操作</th>
            </tr>
          </thead>
          <tbody>
            {secretaries.map((secretary, index) => (
              <tr key={secretary.id} className="border-t border-gray-700">
                <td className="px-4 py-2 text-gray-200">{secretary.id}</td>
                <td className="px-4 py-2 text-gray-200">{secretary.shortName}</td>
                <td className="px-4 py-2 text-gray-200">{secretary.name}</td>
                <td className="px-4 py-2 text-gray-200">
                  {secretary.shipType === 'gun' ? '炮战系' :
                   secretary.shipType === 'torp' ? '水雷系' :
                   secretary.shipType === 'air' ? '空母系' : '潜水系'}
                </td>
                <td className="px-4 py-2 text-gray-200">
                  {secretary.bonuses.length > 0 ? (
                    <div className="flex gap-1 flex-wrap">
                      {secretary.bonuses.map(bonus => (
                        <span key={bonus.pool} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-600 text-gray-200">
                          {getPoolTypeName(bonus.pool)}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-400">无</span>
                  )}
                </td>
                <td className="px-4 py-2">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditSecretary(secretary)}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => handleDeleteSecretary(secretary.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      删除
                    </button>
                    <button
                      onClick={() => handleMoveSecretary(secretary.id, 'up')}
                      disabled={index === 0}
                      className={`${index === 0 ? 'text-gray-400' : 'text-gray-600 hover:text-gray-800'}`}
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => handleMoveSecretary(secretary.id, 'down')}
                      disabled={index === secretaries.length - 1}
                      className={`${index === secretaries.length - 1 ? 'text-gray-400' : 'text-gray-600 hover:text-gray-800'}`}
                    >
                      ↓
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 