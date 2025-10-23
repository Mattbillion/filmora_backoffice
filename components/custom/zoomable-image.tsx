import Zoom from 'react-medium-image-zoom';

import { imageResize } from '@/lib/utils';

export default function ZoomableImage({ src }: { src: string }) {
  if (!src) return null;
  return (
    <Zoom
      zoomImg={{
        src: src,
        width: 1080,
        height: 1080,
      }}
    >
      <img
        src={imageResize(src, 'tiny')}
        alt=""
        width={70}
        height={70}
        unoptimized
        className="ml-4 aspect-square rounded-md object-contain"
      />
    </Zoom>
  );
}
