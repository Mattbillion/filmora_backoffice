import { Image as TiptapImage } from '@tiptap/extension-image';
import { ReactNodeViewRenderer } from '@tiptap/react';

import { ImageViewBlock } from './components/image-view-block';

export const Image = TiptapImage.extend({
  addNodeView() {
    return ReactNodeViewRenderer(ImageViewBlock);
  },
  // addCommands(e) {
  //   console.log(e);
  //   return {
  //     setImage:
  //       (options) =>
  //       ({ chain }) => {
  //         return chain().setImage(options);
  //       },
  //   };
  // },

  onCreate() {
    const onUpload = async (file: File) => {
      const promise = fetch('/api/upload', {
        method: 'POST',
        headers: {
          'content-type': file?.type || 'application/octet-stream',
          'x-vercel-filename': file?.name || 'image.png',
        },
        body: file,
      });

      //This should return a src of the uploaded image
      return promise;
    };
    return {
      onUpload,
    };
  },
});
