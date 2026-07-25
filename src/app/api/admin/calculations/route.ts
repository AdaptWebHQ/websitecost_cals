import { NextResponse } from 'next/server';
import { getCalculationsPage } from '@/lib/calculations';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const limit = Number(url.searchParams.get('limit') ?? '25');
  const cursor = url.searchParams.get('cursor') ?? undefined;
  const userId = url.searchParams.get('userId') ?? undefined;

  const page = await getCalculationsPage({ limit, cursor, userId });
  return NextResponse.json(page);
}
