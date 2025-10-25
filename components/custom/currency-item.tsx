'use client';

import { ControllerRenderProps } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';

import {
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { cn } from '@/lib/utils';

import { Input } from '../ui/input';

export default function CurrencyItem({
  field,
  label,
  placeholder,
  description,
  className,
  inputClassName,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: ControllerRenderProps<any, any>;
  label?: string;
  placeholder?: string;
  description?: string;
  className?: string;
  inputClassName?: string;
}) {
  return (
    <FormItem className={cn('flex flex-col', className)}>
      {label && <FormLabel>{label}</FormLabel>}
      <NumericFormat
        value={field.value}
        onValueChange={(v) => field.onChange(Number(v.value))}
        thousandSeparator
        customInput={Input}
        valueIsNumericString
        placeholder={placeholder}
        className={inputClassName}
        suffix="₮"
      />
      {description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  );
}
