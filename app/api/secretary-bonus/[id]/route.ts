import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const secretaryBonusPath = path.join(process.cwd(), 'db', 'secretary_bonus.json');

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await fs.readFile(secretaryBonusPath, 'utf8');
    const secretaries = JSON.parse(data);
    
    const newSecretaries = secretaries.filter((s: any) => s.id !== Number(params.id));
    
    await fs.writeFile(secretaryBonusPath, JSON.stringify(newSecretaries, null, 2));
    return NextResponse.json(newSecretaries);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 