import { NextResponse } from 'next/server';
import { getInquiriesPage } from '@/lib/inquiries';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const limit = Number(url.searchParams.get('limit') ?? '25');
  const cursor = url.searchParams.get('cursor') ?? undefined;

  const page = await getInquiriesPage({ limit, cursor });
  return NextResponse.json(page);
}
