'use client';

import { useState } from 'react';

import { TemplateType, TemplateValidationResult } from '../schema';
import { svgStrToJSON, validateSVG } from '../util';

export function UploadView({
  onChange,
}: {
  onChange: (
    template: TemplateType,
    validation: TemplateValidationResult,
  ) => void;
}) {
  const [errors, setErrors] = useState<TemplateValidationResult | undefined>();

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <input
        type="file"
        accept="image/svg+xml"
        onChange={(event) => {
          const selectedFile = event.target.files?.[0];

          if (selectedFile) {
            const reader = new FileReader();
            reader.onload = (e) => {
              const svgString = e.target?.result;
              if (typeof svgString === 'string') {
                const json = svgStrToJSON(svgString);
                const validationResult = validateSVG(json.templateJSON);

                // if (
                //   !validationResult.svgGrouped ||
                //   !validationResult.ticketsChildrenGrouped
                // )
                //   return setErrors(validationResult);
                onChange(json, validationResult);
                setErrors(undefined);
                event.target.value = '';
              }
            };
            reader.readAsText(selectedFile);
          }
        }}
      />
      {Object.entries(errors ?? {}).map(([key, value]) => (
        <span key={key} className="text-red-500">
          {key}, {value}
        </span>
      ))}
    </div>
  );
}
