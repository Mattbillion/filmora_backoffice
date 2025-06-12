/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { z } from 'zod';

import { auth } from '@/app/(auth)/auth';

import { stringifyError, validateSchema } from './utils';

export async function revalidate(tagName: string) {
  revalidateTag(tagName);
}

export async function revalidateAll() {
  revalidatePath('/', 'layout');
}

export async function revalidateXOOX(origin: 'vercel' | 'xoox') {
  const url = {
    vercel: process.env.FRONT_VERCEL_DOMAIN || 'https://xoox.vercel.app',
    xoox: process.env.FRONT_DOMAIN || 'https://xoox.mn',
  }[origin];

  let endpoint = `${url}/api/revalidate?secret=ps_ez&path=/`;
  try {
    const res = await fetch(endpoint, { method: 'POST', cache: 'no-store' });
    const result = await res.json();

    if (!res.ok) throw new Error('Something went wrong:' + result.message);
    return { result };
  } catch (err) {
    console.error('Revalidation url:', endpoint);
    console.error('Revalidation error:', err);
  }
}

const MAX_FILE_SIZE = 5000000; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

const imageSchema = z.object({
  file: z
    .any()
    .refine(
      (file) => file?.size <= MAX_FILE_SIZE,
      `Зургийн хэмжээ 5MB aac том байна.`,
    )
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      `Only ${ACCEPTED_IMAGE_TYPES.map((c) => c.replace('image/', '')).join(', ')} formats are supported.`,
    ),
});

export async function uploadImage(formData: FormData) {
  try {
    validateSchema(imageSchema, formData);

    const file = formData.get('file') as File;

    if (!file) throw new Error('No file uploaded');

    const session = await auth();

    const headers = new Headers({});

    if (!!session?.user?.id)
      headers.set('Authorization', `Bearer ${session?.user?.id}`);
    const res = await fetch(`${process.env.XOOX_DOMAIN}/client/upload-file`, {
      method: 'POST',
      body: formData,
      headers,
      cache: 'no-store',
    });

    const result = await res.json();

    if (!res.ok)
      throw new Error(
        result?.detail?.[0]?.msg ||
          result?.error ||
          (result as any)?.message ||
          (typeof result?.detail === 'string' ? result?.detail : undefined) ||
          String(res.status),
      );

    const filePath = result?.data?.data?.original;

    return { data: filePath, error: null };
  } catch (error: any) {
    console.log(error);
    stringifyError(error);
  }
}

const ACCEPTED_AUDIO_TYPES = [
  'audio/mpeg',
  'audio/wav',
  'audio/ogg',
  'audio/mpeg3',
];

const audioSchema = z.object({
  file: z
    .any()
    .refine(
      (file) => file?.size <= 500000000,
      `Аудио хэмжээ 500MB aac том байна.`,
    )
    .refine(
      (file) => ACCEPTED_AUDIO_TYPES.includes(file?.type),
      `Only ${ACCEPTED_AUDIO_TYPES.map((c) => c.replace('image/', '')).join(', ')} formats are supported.`,
    ),
});

export async function uploadAudio(formData: FormData) {
  try {
    validateSchema(audioSchema, formData);

    const file = formData.get('file') as File;

    if (!file) throw new Error('No file uploaded');

    const session = await auth();

    const headers = new Headers({});

    if (!!session?.user?.id)
      headers.set('Authorization', `Bearer ${session?.user?.id}`);
    const res = await fetch(`${process.env.XOOX_DOMAIN}/uploads/audio`, {
      method: 'POST',
      body: formData,
      headers,
      cache: 'no-store',
    });

    const result = await res.json();

    if (!res.ok)
      throw new Error(
        result?.error || (result as any)?.message || String(res.status),
      );

    const filePath = result?.data as {
      audioDuration: number;
      filePath: string;
      url: string;
    };
    return { data: filePath, error: null };
  } catch (error: any) {
    stringifyError(error);
  }
}

uploadAudio.runtime = 'nodejs';
