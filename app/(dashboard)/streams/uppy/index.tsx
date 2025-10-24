'use client';
import { useState } from 'react';
import Uppy from '@uppy/core';
import { Dashboard } from '@uppy/react';
import Tus from '@uppy/tus';

import '@uppy/core/css/style.min.css';
import '@uppy/dashboard/css/style.min.css';

export function UppyUpload() {
  const [uppy] = useState(() =>
    new Uppy({
      restrictions: {
        allowedFileTypes: ['video/*'],
        maxNumberOfFiles: 1,
      },
    }).use(Tus, {
      retryDelays: [0, 1000, 3000, 5000],
      chunkSize: 50 * 1024 ** 2,
      headers: () => {
        const name = '';
        return {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_CLOUDFLARE_AUTHORIZATION}`,
          'Upload-Metadata': '',
        };
      },

      endpoint: `https://api.cloudflare.com/client/v4/accounts/${process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID}/stream`,
    }),
  );
  return <Dashboard theme="dark" uppy={uppy} width="100%" height="400px" />;
}
