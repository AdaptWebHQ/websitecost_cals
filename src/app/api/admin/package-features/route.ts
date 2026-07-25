import { NextResponse } from 'next/server';
import { getPackageFeaturesPage } from '@/lib/packages/package-features-library';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const limit = Number(url.searchParams.get('limit') ?? '25');
  const cursor = url.searchParams.get('cursor') ?? undefined;
  const categoryId = url.searchParams.get('categoryId') ?? undefined;
  const onlyActive = url.searchParams.get('onlyActive') === 'true';

  const page = await getPackageFeaturesPage({ limit, cursor, categoryId, onlyActive });
  return NextResponse.json(page);
}
