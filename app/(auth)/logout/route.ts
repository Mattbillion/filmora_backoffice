import { NextRequest } from 'next/server';

import { signOut } from '@/auth';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const redirectTo = url.searchParams.get('redirectTo') || '/login';
  return signOut({ redirectTo });
}
