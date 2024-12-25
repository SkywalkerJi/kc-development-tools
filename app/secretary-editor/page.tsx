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

  // 删除特殊秘书舰
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
    
    // 交换order值
    const tempOrder = newSecretaries[index].order;
    newSecretaries[index].order = newSecretaries[targetIndex].order;
    newSecretaries[targetIndex].order = tempOrder;

    // 交换位置
    [newSecretaries[index], newSecretaries[targetIndex]] = 
    [newSecretaries[targetIndex], newSecretaries[index]];

    setSecretaries(newSecretaries);
    handleSaveAll(newSecretaries);
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">特殊秘书舰规则编辑器</h1>
        <div className="space-x-2">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            onClick={handleExportJson}
          >
            导出JSON
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={handleAddSecretary}
          >
            添加新秘书舰
          </button>
        </div>
      </div>

      {/* 编辑表单 */}
      {editingSecretary && (
        <div className="bg-white p-4 rounded shadow-md mb-4">
          <h2 className="text-xl font-bold mb-4">编辑秘书舰</h2>
          
          <div className="flex gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">ID</label>
              <input
                type="text"
                value={editingSecretary.id}
                disabled
                className="border p-2 rounded bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">简称</label>
              <input
                type="text"
                value={editingSecretary.shortName}
                onChange={e => setEditingSecretary({
                  ...editingSecretary,
                  shortName: e.target.value
                })}
                className="border p-2 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">名称</label>
              <input
                type="text"
                value={editingSecretary.name}
                onChange={e => setEditingSecretary({
                  ...editingSecretary,
                  name: e.target.value
                })}
                className="border p-2 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">舰种</label>
              <select
                value={editingSecretary.shipType}
                onChange={e => setEditingSecretary({
                  ...editingSecretary,
                  shipType: e.target.value as ShipType
                })}
                className="border p-2 rounded"
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
            <div key={bonusIndex} className="bg-gray-50 p-4 rounded mb-4">
              <div className="flex gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">资源池</label>
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
                    className="border p-2 rounded"
                  >
                    {POOL_TYPES.map(type => (
                      <option key={type} value={type}>
                        {type === 'fs' ? '燃料/钢材开发' :
                         type === 'am' ? '弹药开发' : '铝开发'}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={() => {
                    const newBonuses = editingSecretary.bonuses.filter((_, i) => i !== bonusIndex);
                    setEditingSecretary({
                      ...editingSecretary,
                      bonuses: newBonuses
                    });
                  }}
                  className="text-red-500 hover:text-red-600"
                >
                  删除规则
                </button>
              </div>

              <table className="w-full mb-4">
                <thead>
                  <tr>
                    <th className="text-left">装备</th>
                    <th className="text-left">调整值</th>
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
                            control: () => "border rounded",
                            menu: () => "bg-white shadow-lg rounded mt-1",
                            option: (state: { isFocused: boolean; isSelected: boolean }) => 
                              `px-3 py-2 ${state.isFocused ? 'bg-blue-50' : 'bg-white'} 
                               ${state.isSelected ? 'bg-blue-100' : ''}`
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
                          className="border p-2 rounded w-24"
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
                className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
              >
                添加装备调整
              </button>
            </div>
          ))}

          <div className="flex gap-4">
            <button
              className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
              onClick={handleAddBonus}
            >
              添加规则
            </button>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={handleSave}
            >
              保存
            </button>
          </div>
        </div>
      )}

      {/* 秘书舰列表 */}
      <div className="bg-white rounded shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">简称</th>
              <th className="px-4 py-2 text-left">名称</th>
              <th className="px-4 py-2 text-left">舰种</th>
              <th className="px-4 py-2 text-left">规则数</th>
              <th className="px-4 py-2 text-left">操作</th>
            </tr>
          </thead>
          <tbody>
            {secretaries.map((secretary, index) => (
              <tr key={secretary.id} className="border-t">
                <td className="px-4 py-2">{secretary.id}</td>
                <td className="px-4 py-2">{secretary.shortName}</td>
                <td className="px-4 py-2">{secretary.name}</td>
                <td className="px-4 py-2">
                  {secretary.shipType === 'gun' ? '炮战系' :
                   secretary.shipType === 'torp' ? '水雷系' :
                   secretary.shipType === 'air' ? '空母系' : '潜水系'}
                </td>
                <td className="px-4 py-2">{secretary.bonuses.length}</td>
                <td className="px-4 py-2">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditSecretary(secretary)}
                      className="text-blue-500 hover:text-blue-600"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => handleDeleteSecretary(secretary.id)}
                      className="text-red-500 hover:text-red-600"
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