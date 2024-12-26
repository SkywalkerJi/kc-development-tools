import { SecretaryData } from '@/types/secretary';

const STORAGE_KEY = 'secretary_bonus_data';
const BASE_PATH = '/kc-development-tools';

// 从 localStorage 获取数据
export function getSecretaryData(): SecretaryData[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

// 保存数据到 localStorage
function saveSecretaryData(data: SecretaryData[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// 获取所有秘书舰数据
export async function getAllSecretaries(): Promise<SecretaryData[]> {
  return getSecretaryData();
}

// 添加新的秘书舰
export async function addSecretary(secretary: SecretaryData): Promise<SecretaryData[]> {
  const secretaries = getSecretaryData();
  secretaries.push(secretary);
  saveSecretaryData(secretaries);
  return secretaries;
}

// 更新秘书舰数据
export async function updateSecretary(updatedData: SecretaryData | SecretaryData[]): Promise<SecretaryData[]> {
  let secretaries = getSecretaryData();
  
  if (Array.isArray(updatedData)) {
    secretaries = updatedData;
  } else {
    const index = secretaries.findIndex(s => s.id === updatedData.id);
    if (index !== -1) {
      secretaries[index] = updatedData;
    }
  }
  
  saveSecretaryData(secretaries);
  return secretaries;
}

// 删除秘书舰
export async function deleteSecretary(id: number): Promise<SecretaryData[]> {
  const secretaries = getSecretaryData();
  const newSecretaries = secretaries.filter(s => s.id !== id);
  saveSecretaryData(newSecretaries);
  return newSecretaries;
}

// 初始化数据（如果 localStorage 为空，从静态文件加载）
export async function initializeData() {
  if (typeof window === 'undefined') return;
  
  const existingData = localStorage.getItem(STORAGE_KEY);
  if (!existingData) {
    try {
      const response = await fetch(`${BASE_PATH}/data/secretary_bonus.json`);
      const initialData = await response.json();
      saveSecretaryData(initialData);
    } catch (error) {
      console.error('Failed to load initial data:', error);
      saveSecretaryData([]);
    }
  }
} 