'use client';

'use client';

import type React from 'react';
import { useRef, useState } from 'react';
import { Upload } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { TemplateType, TemplateValidationResult } from '../schema';
import { formatFileSize, svgStrToJSON, validateSVG } from '../util';

export function UploadView({
  onChange,
}: {
  onChange: (
    template: TemplateType,
    validation: TemplateValidationResult,
  ) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<TemplateValidationResult | undefined>();
  const [fileInfo, setFileInfo] = useState<
    { name: string; size: string } | undefined
  >();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files[0]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = (file: File) => {
    setFileInfo({ name: file.name, size: formatFileSize(file.size) });
    setErrors(undefined);
    const reader = new FileReader();

    reader.onload = (e) => {
      const svgString = e.target?.result;
      if (typeof svgString === 'string') {
        const json = svgStrToJSON(svgString);
        const validationResult = validateSVG(json.templateJSON);

        if (Object.values(validationResult).some((v) => !v)) {
          return setErrors(validationResult);
        }
        onChange(json, validationResult);
        setErrors(undefined);
      }
    };
    reader.readAsText(file);
  };

  const errorList = Object.entries(errors ?? {}).filter(([_, v]) => !v);

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <div
        className={`w-3/4 max-w-2xl rounded-lg border-2 border-dashed px-6 py-9 text-center ${
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/20'
        } transition-colors duration-200`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          className="hidden"
          multiple={false}
          accept="image/svg+xml"
        />
        <div className="flex flex-col items-center justify-center space-y-9">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="rounded-full bg-primary/10 p-3">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            <p className="text-sm font-medium">
              Drag and drop your SVG file here
            </p>
          </div>
          {(!!fileInfo || errorList.length > 0) && (
            <div className="space-y-2 text-left">
              {!!fileInfo && (
                <Badge variant="secondary">
                  <p className="text-sm font-bold">
                    {fileInfo.name} ({fileInfo.size})
                  </p>
                </Badge>
              )}
              {errorList.length > 0 && (
                <ul className="ml-0 list-disc">
                  {errorList.map(([key]) => (
                    <li key={key} className="text-sm text-red-500">
                      {
                        {
                          ticketsChildrenGrouped:
                            'Ticket seat elements in the SVG are not grouped correctly.',
                          svgGrouped:
                            'SVG is not properly grouped (expected groups: background, tickets, mask).',
                        }[key]
                      }
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
          <Button onClick={handleButtonClick} size="lg" className="w-full">
            Click to upload SVG file
          </Button>
        </div>
      </div>
    </div>
  );
}
