import { NextResponse, NextRequest } from 'next/server';
import { getCalculationById } from '@/lib/calculations';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const calculation = await getCalculationById(id ?? '');
  if (!calculation) {
    return NextResponse.json({ error: 'Calculation not found' }, { status: 404 });
  }
  return NextResponse.json(calculation);
}
