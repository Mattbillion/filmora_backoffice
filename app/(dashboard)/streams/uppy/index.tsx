'use client';

import { useState } from 'react';
import { Uppy } from '@uppy/core';
import { Dashboard } from '@uppy/react';
import Tus from '@uppy/tus';

import '@uppy/core/css/style.min.css';
import '@uppy/dashboard/css/style.min.css';

import { Input } from '@/components/ui/input';

const UppyUpload = () => {
  const [movieName, setMovieName] = useState('Sonin');
  const [uppyTus] = useState(() =>
    new Uppy({
      debug: true,
      restrictions: {
        maxFileSize: 10 * 1024 * 1024 * 1024, // 10gb
        maxNumberOfFiles: 10,
        allowedFileTypes: ['video/*'],
      },
    }).use(Tus, {
      headers: (file) => {
        const name = movieName || file.name;
        const nameB64 = btoa(unescape(encodeURIComponent(name!)));
        const requireSignedB64 = btoa('true');
        return {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_CLOUDFLARE_AUTHORIZATION}`,
          'Upload-Metadata': `name ${nameB64},requiresignedurls ${requireSignedB64}`,
        };
      },
      metadata: {
        name: 'testing with good intention',
      },
      endpoint: `https://api.cloudflare.com/client/v4/accounts/${process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID}/stream`,
      retryDelays: [0, 1000, 3000, 5000],
      removeFingerprintOnSuccess: true,
      chunkSize: 5 * 1024 ** 3,
    }),
  );
  uppyTus.on('upload-success', (file, response) => {
    console.log(file);
    console.log(response);
  });
  return (
    <div className="uppy-container mx-auto">
      {uppyTus && (
        <Dashboard
          uppy={uppyTus}
          height={400}
          hideProgressDetails={false}
          showLinkToFileUploadResult={true}
          showRemoveButtonAfterComplete={true}
          theme="dark"
          note="Upload up to 10 files, max 100MB each"
        />
      )}
      <Input
        type="text"
        value={movieName}
        onChange={(e) => setMovieName(e.target.value)}
        placeholder="Enter movie name"
        className="uppy-input mx-auto"
      />
    </div>
  );
};

export default UppyUpload;
