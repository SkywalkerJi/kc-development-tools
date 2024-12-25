"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  type CellContext,
} from "@tanstack/react-table";
import poolData from "../../db/pool_lowdb.json";
import itemsData from "../../db/items.json";
import { getTranslation } from "../../utils/i18n";
import { useLanguage } from "../../contexts/LanguageContext";
import type { PoolItem as BasePoolItem, Pool } from "../../types/lottery";
import { debounce } from "lodash";

type PoolValue = string | number | "";

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

type EditableKeys =
  | "gunFs"
  | "gunAm"
  | "gunBx"
  | "torpFs"
  | "torpAm"
  | "torpBx"
  | "airFs"
  | "airAm"
  | "airBx"
  | "subFs"
  | "subAm"
  | "subBx";

interface CustomTableMeta {
  updateData: (newData: PoolItem[]) => void;
}

// 创建输入单元格组件
const InputCell = ({
  getValue,
  row,
  column,
  table,
}: CellContext<PoolItem, PoolValue>) => {
  const value = getValue();
  const columnId = column.id as EditableKeys;
  const [localValue, setLocalValue] = useState(value);

  const debouncedUpdate = useCallback(
    (newValue: string) => {
      const numValue = newValue ? Number(newValue) : "";
      const newData = [...(table.options.data as PoolItem[])];
      const updatedRow = { ...newData[row.index] };
      updatedRow[columnId] = numValue;
      newData[row.index] = updatedRow;
      (table.options.meta as CustomTableMeta).updateData(newData);
    },
    [row.index, columnId, table]
  );

  const debouncedUpdateValue = useMemo(
    () => debounce(debouncedUpdate, 300),
    [debouncedUpdate]
  );

  // 当外部值改变时更新本地值
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    debouncedUpdateValue(newValue);
  };

  return (
    <input
      type="number"
      min="0"
      max="100"
      value={localValue === undefined || localValue === "" ? "" : localValue}
      onChange={handleChange}
      className="w-16 px-2 py-1 border rounded dark:bg-gray-800 dark:border-gray-700"
    />
  );
};

// 使用 memo 优化单元格组件
const MemoizedInputCell = React.memo(InputCell);

export default function ProbabilityTable() {
  const { language } = useLanguage();
  const t = getTranslation(language);
  const [data, setData] = useState<PoolItem[]>([]);

  // 使用 useCallback 优化数据更新函数
  const updateData = useCallback((newData: PoolItem[]) => {
    try {
      setData(newData);
      localStorage.setItem("poolData", JSON.stringify(newData));
    } catch (error) {
      console.error("Error saving data:", error);
    }
  }, []);

  // 初始化数据
  const initializeData = useCallback(() => {
    try {
      const savedData = localStorage.getItem("poolData");
      let initialData = savedData
        ? JSON.parse(savedData)
        : (poolData as Pool).pool;

      initialData = initialData.map((item: BasePoolItem) => {
        const itemDetails = itemsData.items.find((i) => i.id === item.id);
        return {
          id: item.id,
          name: item.name,
          itemName: itemDetails?.name?.zh_cn || `装备${item.id}`,
          gunFs: item.gunFs || "",
          gunAm: item.gunAm || "",
          gunBx: item.gunBx || "",
          torpFs: item.torpFs || "",
          torpAm: item.torpAm || "",
          torpBx: item.torpBx || "",
          airFs: item.airFs || "",
          airAm: item.airAm || "",
          airBx: item.airBx || "",
          subFs: item.subFs || "",
          subAm: item.subAm || "",
          subBx: item.subBx || "",
        };
      });

      setData(initialData);
    } catch (error) {
      console.error("Error initializing data:", error);
      // 如果出错，使用默认数据
      const defaultData = (poolData as Pool).pool.map((item: BasePoolItem) => ({
        id: item.id,
        name: item.name,
        itemName: `装备${item.id}`,
        gunFs: item.gunFs || "",
        gunAm: item.gunAm || "",
        gunBx: item.gunBx || "",
        torpFs: item.torpFs || "",
        torpAm: item.torpAm || "",
        torpBx: item.torpBx || "",
        airFs: item.airFs || "",
        airAm: item.airAm || "",
        airBx: item.airBx || "",
        subFs: item.subFs || "",
        subAm: item.subAm || "",
        subBx: item.subBx || "",
      }));
      setData(defaultData);
    }
  }, []);

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  const columnHelper = createColumnHelper<PoolItem>();

  // 使用 useMemo 优化列定义
  const tableColumns = useMemo(
    () => [
      columnHelper.accessor("itemName", {
        header: t.equipment,
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("gunFs", {
        header: t.pools.gunFs,
        cell: MemoizedInputCell,
      }),
      columnHelper.accessor("gunAm", {
        header: t.pools.gunAm,
        cell: MemoizedInputCell,
      }),
      columnHelper.accessor("gunBx", {
        header: t.pools.gunBx,
        cell: MemoizedInputCell,
      }),
      columnHelper.accessor("torpFs", {
        header: t.pools.torpFs,
        cell: MemoizedInputCell,
      }),
      columnHelper.accessor("torpAm", {
        header: t.pools.torpAm,
        cell: MemoizedInputCell,
      }),
      columnHelper.accessor("torpBx", {
        header: t.pools.torpBx,
        cell: MemoizedInputCell,
      }),
      columnHelper.accessor("airFs", {
        header: t.pools.airFs,
        cell: MemoizedInputCell,
      }),
      columnHelper.accessor("airAm", {
        header: t.pools.airAm,
        cell: MemoizedInputCell,
      }),
      columnHelper.accessor("airBx", {
        header: t.pools.airBx,
        cell: MemoizedInputCell,
      }),
      columnHelper.accessor("subFs", {
        header: t.pools.subFs,
        cell: MemoizedInputCell,
      }),
      columnHelper.accessor("subAm", {
        header: t.pools.subAm,
        cell: MemoizedInputCell,
      }),
      columnHelper.accessor("subBx", {
        header: t.pools.subBx,
        cell: MemoizedInputCell,
      }),
    ],
    [columnHelper, t]
  );

  const table = useReactTable({
    data,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      updateData,
    },
  });

  const handleReset = useCallback(() => {
    try {
      localStorage.removeItem("poolData");
      initializeData();
    } catch (error) {
      console.error("Error resetting data:", error);
    }
  }, [initializeData]);

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
            {language === "en_us" ? "Reset Data" : "重置数据"}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
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
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
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
