import { NextResponse } from 'next/server';
import { getCmsConnectionStatus } from '@/lib/sanityConnection';

export async function GET() {
  const status = await getCmsConnectionStatus();
  return NextResponse.json(status, { status: status.success ? 200 : 503 });
}
