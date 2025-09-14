'use client';

import { useState } from 'react';
import { ControllerRenderProps, useFormContext } from 'react-hook-form';

import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { uploadAudio } from '@/lib/functions';
import { extractActionError, isPath, isUri } from '@/lib/utils';

import { Input } from '../ui/input';

export default function UploadAudioItem({
  field,
  prefix,
  label,
  maxSize = 500000000,
  durationFieldName = 'audioDuration',
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: ControllerRenderProps<any, any>;
  prefix: string;
  label: string;
  maxSize?: number;
  durationFieldName?: string;
}) {
  const { clearErrors, setError, setValue } = useFormContext();
  // const [progress, setProgress] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const validAudio =
    !!field.value && (isPath(field.value) || isUri(field.value));

  // console.log(progress);
  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <div className="space-y-4">
          {validAudio && (
            <audio
              src={
                (process.env.NEXT_PUBLIC_FILMORA_DOMAIN ??
                  (process.env.FILMORA_DOMAIN || 'http://localhost:3000/api/v1')) + field.value
              }
              controls
              className="h-11 w-full"
              controlsList="nodownload noremoteplayback noplaybackrate"
            />
          )}
          <Input
            type="file"
            accept=".mp3, audio/*"
            disabled={loading}
            className="block content-center"
            onChange={(e) => {
              const file = e.target.files?.[0];

              if (file) {
                if (file?.size >= maxSize)
                  return setError(
                    field.name,
                    { message: 'Аудио хэмжээ том байна.' },
                    { shouldFocus: true },
                  );

                setLoading(true);

                const formData = new FormData();
                formData.append('file', file);
                formData.append('prefix', prefix);

                // const uploadURL = `http://localhost:3001/uploads/audio`;

                // const eventSource = new EventSource(uploadURL);
                // eventSource.onmessage = (event) => {
                //   const data = JSON.parse(event.data);
                //   setProgress(data.progress);

                //   if (data.progress === 100) eventSource.close();
                // };

                // eventSource.onerror = () => {
                //   console.error("Error in SSE connection");
                //   eventSource.close();
                // };

                uploadAudio(formData)
                  .then((c) => {
                    field.onChange(c?.data?.filePath);
                    setValue(durationFieldName, c?.data?.audioDuration);
                    clearErrors(field.name);
                  })
                  .catch((err) => {
                    const { message } = extractActionError(err);
                    setError(field.name, { message }, { shouldFocus: true });
                  })
                  .finally(() => setLoading(false));
              }
            }}
          />
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}
