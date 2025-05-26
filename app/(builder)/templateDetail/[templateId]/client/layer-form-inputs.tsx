import { useRef, useState } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDebounce } from '@/hooks/use-debounce';
import { cn } from '@/lib/utils';

import { KonvaNode } from '../schema';
import { dataMap, dataMapReverse, translationMap } from './constants';

export function LayerTypeSelect({
  node,
  onChange,
  options,
  className,
  hideLabel,
  disabled,
}: {
  node: KonvaNode;
  onChange: (val: string) => void;
  options: { value: string; label: string }[];
  className?: string;
  hideLabel?: boolean;
  disabled?: boolean;
}) {
  const oldValue = useRef<string | undefined>(node.attrs['data-type']);

  return (
    <div className={cn('space-y-2', className)}>
      {!hideLabel && <Label>Layer Type:</Label>}
      <Select
        defaultValue={node.attrs['data-type']}
        onValueChange={(val) => {
          node.setAttr('data-type', val);
          onChange(val);
          if (!!oldValue.current && oldValue.current !== val)
            manipulateAttrs(node, `data-${oldValue.current}`, '', 'remove');
          oldValue.current = val;
        }}
      >
        <SelectTrigger disabled={disabled}>
          <SelectValue placeholder="Select layer type" />
        </SelectTrigger>
        <SelectContent>
          {options.map((o, idx) => (
            <SelectItem value={o.value} key={idx}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export type LayerValueInputProps = {
  node: KonvaNode;
  onFocus?: () => void;
  onChange?: (val: string) => void;
  className?: string;
  hideLabel?: boolean;
  disabled?: boolean;
  debounce?: number;
  fixedField?: {
    [K in keyof typeof dataMap]: (typeof dataMap)[K];
  }[keyof typeof dataMap];
};

export function LayerValueInput({
  node,
  onFocus,
  onChange = () => false,
  className,
  hideLabel,
  fixedField,
  debounce = 200,
  disabled,
}: LayerValueInputProps) {
  const field = fixedField
    ? `data-${fixedField}`
    : `data-${node.getAttr('data-type')}`;

  const [value, setValue] = useState(node.getAttr(field)?.replace('_', ' '));
  const nodeId = node.id() || node.attrs['data-testid'];
  useDebounce(onChange, debounce, value);

  return (
    <div className={cn('space-y-2', className)} onMouseEnter={onFocus}>
      {!hideLabel && (
        <Label htmlFor={nodeId + field}>
          {translationMap[field.replace('data-', '')] + ': '}
        </Label>
      )}
      <Input
        id={nodeId + field}
        value={value}
        disabled={disabled}
        onChange={(e) => {
          const val = e.target.value;
          setValue(val);
          manipulateAttrs(node, field, val.replace(/\s/g, '_'));
        }}
        onFocus={onFocus}
        placeholder={`Current: ${node.attrs[field] || '' || 'N/A'}`}
        className="!h-9 flex-1 rounded-sm border-neutral-400 dark:border-neutral-600 dark:bg-neutral-600"
      />
    </div>
  );
}
export const modifyId = (
  id: string = '',
  field: string = '',
  val: string = '',
) => {
  let newId;
  const reversedK = dataMapReverse[field.replace('data-', '')];
  const reg = new RegExp(`(?<=-|^)(${reversedK}[^-]*)(?=-|$)`);

  if (!reversedK) return id;

  if (val) {
    if (reg.test(id)) {
      newId = id.replace(reg, `${reversedK}${val}`);
    } else {
      const parts = id.split('-');
      parts.splice(parts.length - 1, 0, `${reversedK}${val}`);
      newId = parts.join('-');
    }
  } else {
    // Remove segment from ID
    newId = id.replace(reg, '').replace(/--+/g, '-').replace(/^-|-$/g, '');
  }

  return newId;
};

export const manipulateAttrs = (
  n: KonvaNode,
  field: string,
  value: string = '',
  mode: 'add' | 'remove' = 'add',
) => {
  if (n.hasChildren()) {
    const nodeChildren = n.children!;
    for (let i = 0; i < nodeChildren.length; i++) {
      const child = nodeChildren[i];
      if (child.hasChildren()) manipulateAttrs(child, field, value, mode);

      if (child.getType() !== 'Text') {
        updateAttrs(child, field, value, mode);
      }
    }
  }
  updateAttrs(n, field, value, mode);
};

const updateAttrs = (
  node: KonvaNode,
  field: string,
  value: string,
  mode: 'add' | 'remove',
) => {
  node.setAttrs({
    id: modifyId(node.id(), field, mode === 'add' ? value : ''),
    [field]: mode === 'add' ? value : undefined,
  });
};
