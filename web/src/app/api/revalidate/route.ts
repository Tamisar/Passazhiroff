import { revalidateTag } from 'next/cache';
import type { NextRequest } from 'next/server';
import { CMS_TAG } from '@/lib/cms';

export async function POST(request: NextRequest) {
  if (request.headers.get('authorization') !== `Bearer ${process.env.REVALIDATE_SECRET}`) {
    return Response.json({ message: 'Invalid secret' }, { status: 401 });
  }

  revalidateTag(CMS_TAG, { expire: 0 });
  return Response.json({ revalidated: true });
}
