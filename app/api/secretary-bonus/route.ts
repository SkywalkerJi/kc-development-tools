import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

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
    const newSecretary = await request.json();
    const currentData = await fs.readFile(secretaryBonusPath, 'utf8');
    const secretaries = JSON.parse(currentData);
    
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
    const updatedSecretary = await request.json();
    const currentData = await fs.readFile(secretaryBonusPath, 'utf8');
    const secretaries = JSON.parse(currentData);
    
    const index = secretaries.findIndex((s: any) => s.id === updatedSecretary.id);
    if (index !== -1) {
      secretaries[index] = updatedSecretary;
      await fs.writeFile(secretaryBonusPath, JSON.stringify(secretaries, null, 2));
    }
    
    return NextResponse.json(secretaries);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 