import { NextResponse } from 'next/server';
import { getPackagesPage } from '@/lib/packages';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const limit = Number(url.searchParams.get('limit') ?? '25');
  const cursor = url.searchParams.get('cursor') ?? undefined;
  const onlyActive = url.searchParams.get('onlyActive') === 'true';

  const page = await getPackagesPage({ limit, cursor, onlyActive });
  return NextResponse.json(page);
}
