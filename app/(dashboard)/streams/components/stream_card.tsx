'use client';
import Image from 'next/image';
import Link from 'next/link';

import { Stream } from '@/app/(dashboard)/streams/cloudflare-stream';

export default function StreamCard({ stream }: { stream: Stream }) {
  const thumbnail = stream.thumbnail;
  const details = [stream.size, stream.maxDurationSeconds];
  return (
    <Link
      className="border-border relative overflow-hidden rounded-lg border"
      href={stream.preview}
    >
      <div className="relative aspect-video bg-slate-700">
        <Image
          src={thumbnail || '/fallback_thumbnail.png'}
          alt={stream.meta.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-2">
        <h1>{stream.meta.name}</h1>
        {details.map((detail, idx2) => (
          <p key={idx2}>{detail}</p>
        ))}
      </div>
    </Link>
  );
}
