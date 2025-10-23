'use client';

import { useState } from 'react';
import Image from 'next/image';

function SafeNextImage({
  src,
  alt,
  fallback,
  ...props
}: {
  src: string;
  alt: string;
  fallback?: string;
}) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      onError={() => setImgSrc(fallback!)}
      fill
    />
  );
}

export default SafeNextImage;
