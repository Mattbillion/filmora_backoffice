// filepath: /Volumes/Workspace/projects/filmora_backoffice/app/(auth)/logout/route.ts
import { NextRequest } from 'next/server';

import { signOut } from '@/app/(auth)/auth';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const redirectTo = url.searchParams.get('redirectTo') || '/login';
  return signOut({ redirectTo });
}
