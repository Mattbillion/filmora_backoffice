'use client';

import { ControllerRenderProps } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';

import {
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { Input } from '../ui/input';

export default function CurrencyItem({
  field,
  label,
  description,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: ControllerRenderProps<any, any>;
  label?: string;
  description?: string;
}) {
  return (
    <FormItem className="flex flex-col">
      {label && <FormLabel>{label}</FormLabel>}
      <NumericFormat
        value={field.value}
        onValueChange={(v) => field.onChange(Number(v.value))}
        thousandSeparator
        customInput={Input}
        valueIsNumericString
      />
      {description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  );
}
