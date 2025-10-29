import { NextResponse } from 'next/server';

import { updateStream } from '@/lib/cloudflare';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { streamId, meta, requireSignedURLs } = body as {
      streamId?: string;
      meta?: Record<string, unknown>;
      requireSignedURLs?: boolean;
    };

    if (!streamId) {
      return NextResponse.json({ error: 'Missing streamId' }, { status: 400 });
    }

    const payload: Record<string, unknown> = {};
    if (meta) {
      payload.meta = meta;
    }
    if (typeof requireSignedURLs !== 'undefined') {
      payload.requireSignedURLs = requireSignedURLs;
    }

    const res = await updateStream(streamId, payload);

    return NextResponse.json(res);
  } catch (err: unknown) {
    console.error('API update stream error', err);
    return NextResponse.json(
      { error: (err as any)?.message || String(err) },
      { status: 500 },
    );
  }
}
