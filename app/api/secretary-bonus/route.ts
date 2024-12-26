import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { SecretaryData } from '@/types/secretary';

const secretaryBonusPath = path.join(process.cwd(), 'db', 'secretary_bonus.json');

export async function GET() {
  try {
    const data = await fs.readFile(secretaryBonusPath, 'utf8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newSecretary = await request.json() as SecretaryData;
    const currentData = await fs.readFile(secretaryBonusPath, 'utf8');
    const secretaries = JSON.parse(currentData) as SecretaryData[];
    
    secretaries.push(newSecretary);
    await fs.writeFile(secretaryBonusPath, JSON.stringify(secretaries, null, 2));
    
    return NextResponse.json(secretaries);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const updatedData = await request.json() as SecretaryData | SecretaryData[];
    
    // 如果是数组，说明是批量更新（排序操作）
    if (Array.isArray(updatedData)) {
      await fs.writeFile(secretaryBonusPath, JSON.stringify(updatedData, null, 2));
      return NextResponse.json(updatedData);
    }
    
    // 单个记录更新
    const currentData = await fs.readFile(secretaryBonusPath, 'utf8');
    const secretaries = JSON.parse(currentData) as SecretaryData[];
    
    const index = secretaries.findIndex((s) => s.id === updatedData.id);
    if (index !== -1) {
      secretaries[index] = updatedData;
      await fs.writeFile(secretaryBonusPath, JSON.stringify(secretaries, null, 2));
    }
    
    return NextResponse.json(secretaries);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 