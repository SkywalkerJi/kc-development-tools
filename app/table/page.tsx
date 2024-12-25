'use client';

import { useState, useEffect } from 'react';
import {
  type ColumnDef,
  type CellContext,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import poolData from '../../db/pool_lowdb.json';
import itemsData from '../../db/items.json';
import { getTranslation } from '../../utils/i18n';
import { useLanguage } from '../../contexts/LanguageContext';
import type { PoolItem as BasePoolItem, Pool } from '../../types/lottery';

type PoolValue = string | number | '';

interface PoolItem {
  id: number;
  name: string;
  itemName?: string;
  gunFs: PoolValue;
  gunAm: PoolValue;
  gunBx: PoolValue;
  torpFs: PoolValue;
  torpAm: PoolValue;
  torpBx: PoolValue;
  airFs: PoolValue;
  airAm: PoolValue;
  airBx: PoolValue;
  subFs: PoolValue;
  subAm: PoolValue;
  subBx: PoolValue;
}

type EditableKeys = 'gunFs' | 'gunAm' | 'gunBx' | 'torpFs' | 'torpAm' | 'torpBx' | 'airFs' | 'airAm' | 'airBx' | 'subFs' | 'subAm' | 'subBx';

interface CustomTableMeta {
  updateData: (newData: PoolItem[]) => void;
}

// 创建输入单元格组件
function InputCell({ getValue, row, column, table }: CellContext<PoolItem, PoolValue>) {
  const value = getValue();
  const columnId = column.id as EditableKeys;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const newData = [...(table.options.data as PoolItem[])];
      const newValue = e.target.value ? Number(e.target.value) : '';
      const updatedRow = { ...newData[row.index] };
      updatedRow[columnId] = newValue;
      newData[row.index] = updatedRow;
      (table.options.meta as CustomTableMeta).updateData(newData);
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  return (
    <input
      type="number"
      min="0"
      max="100"
      value={value === undefined || value === '' ? '' : value}
      onChange={handleChange}
      className="w-16 px-2 py-1 border rounded dark:bg-gray-800 dark:border-gray-700"
    />
  );
}

export default function ProbabilityTable() {
  const { language } = useLanguage();
  const t = getTranslation(language);
  const [data, setData] = useState<PoolItem[]>([]);

  // 初始化数据
  const initializeData = () => {
    try {
      const savedData = localStorage.getItem('poolData');
      let initialData = savedData ? JSON.parse(savedData) : (poolData as Pool).pool;

      initialData = initialData.map((item: BasePoolItem) => {
        const itemDetails = itemsData.items.find(i => i.id === item.id);
        return {
          id: item.id,
          name: item.name,
          itemName: itemDetails?.name?.zh_cn || `装备${item.id}`,
          gunFs: item.gunFs || '',
          gunAm: item.gunAm || '',
          gunBx: item.gunBx || '',
          torpFs: item.torpFs || '',
          torpAm: item.torpAm || '',
          torpBx: item.torpBx || '',
          airFs: item.airFs || '',
          airAm: item.airAm || '',
          airBx: item.airBx || '',
          subFs: item.subFs || '',
          subAm: item.subAm || '',
          subBx: item.subBx || '',
        };
      });

      setData(initialData);
    } catch (error) {
      console.error('Error initializing data:', error);
      // 如果出错，使用默认数据
      const defaultData = (poolData as Pool).pool.map((item: BasePoolItem) => ({
        id: item.id,
        name: item.name,
        itemName: `装备${item.id}`,
        gunFs: item.gunFs || '',
        gunAm: item.gunAm || '',
        gunBx: item.gunBx || '',
        torpFs: item.torpFs || '',
        torpAm: item.torpAm || '',
        torpBx: item.torpBx || '',
        airFs: item.airFs || '',
        airAm: item.airAm || '',
        airBx: item.airBx || '',
        subFs: item.subFs || '',
        subAm: item.subAm || '',
        subBx: item.subBx || '',
      }));
      setData(defaultData);
    }
  };

  useEffect(() => {
    initializeData();
  }, []);

  const columnHelper = createColumnHelper<PoolItem>();

  // 定义列
  const columns = [
    columnHelper.accessor('itemName', {
      header: '装备名称',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('gunFs', {
      header: '主炮/FS',
      cell: InputCell,
    }),
    columnHelper.accessor('gunAm', {
      header: '主炮/AM',
      cell: InputCell,
    }),
    columnHelper.accessor('gunBx', {
      header: '主炮/BX',
      cell: InputCell,
    }),
    columnHelper.accessor('torpFs', {
      header: '鱼雷/FS',
      cell: InputCell,
    }),
    columnHelper.accessor('torpAm', {
      header: '鱼雷/AM',
      cell: InputCell,
    }),
    columnHelper.accessor('torpBx', {
      header: '鱼雷/BX',
      cell: InputCell,
    }),
    columnHelper.accessor('airFs', {
      header: '舰载机/FS',
      cell: InputCell,
    }),
    columnHelper.accessor('airAm', {
      header: '舰载机/AM',
      cell: InputCell,
    }),
    columnHelper.accessor('airBx', {
      header: '舰载机/BX',
      cell: InputCell,
    }),
    columnHelper.accessor('subFs', {
      header: '潜艇装备/FS',
      cell: InputCell,
    }),
    columnHelper.accessor('subAm', {
      header: '潜艇装备/AM',
      cell: InputCell,
    }),
    columnHelper.accessor('subBx', {
      header: '潜艇装备/BX',
      cell: InputCell,
    }),
  ] as ColumnDef<PoolItem>[];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      updateData: (newData: PoolItem[]) => {
        try {
          setData(newData);
          localStorage.setItem('poolData', JSON.stringify(newData));
        } catch (error) {
          console.error('Error saving data:', error);
        }
      },
    },
  });

  const handleReset = () => {
    try {
      localStorage.removeItem('poolData');
      initializeData();
    } catch (error) {
      console.error('Error resetting data:', error);
    }
  };

  return (
    <main className="p-4 lg:p-8">
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {t.nav.table}
          </h1>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            重置数据
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {table.getRowModel().rows.map(row => (
                <tr key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <td
                      key={cell.id}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
} 