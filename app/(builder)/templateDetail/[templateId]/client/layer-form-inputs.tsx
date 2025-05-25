import { useState } from 'react';
import Konva from 'konva';

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
  node: Konva.Node & { children?: Konva.Node[] };
  onChange: (val: string) => void;
  options: { value: string; label: string }[];
  className?: string;
  hideLabel?: boolean;
  disabled?: boolean;
}) {
  return (
    <div className={cn('space-y-2', className)}>
      {!hideLabel && <Label>Layer Type:</Label>}
      <Select
        defaultValue={node.attrs['data-type'] || node.id()}
        onValueChange={(val) => {
          node.setAttr('data-type', val);
          onChange(val);
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

const getFieldInfo = (node: KonvaNode, fixedField?: string) => {
  const field = fixedField || `data-${node.attrs['data-type']}`;
  let label = translationMap[field.replace('data-', '')] + ': ';
  let placeholder = node.attrs[field] || '';

  return {
    field,
    label,
    placeholder,
  };
};

export type LayerValueInputProps = {
  node: KonvaNode & { children?: KonvaNode[] };
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
  const { field, label, placeholder } = getFieldInfo(
    node,
    fixedField ? `data-${fixedField}` : undefined,
  );
  const [value, setValue] = useState(node.attrs[field]?.replace('_', ' '));
  const nodeId = node.id() || node.attrs['data-testid'];
  useDebounce(onChange, debounce, value);

  return (
    <div className={cn('space-y-2', className)} onMouseEnter={onFocus}>
      {!hideLabel && <Label htmlFor={nodeId + field}>{label}</Label>}
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
        placeholder={`Current: ${placeholder || 'N/A'}`}
        className="!h-9 flex-1 rounded-sm border-neutral-400 dark:border-neutral-600 dark:bg-neutral-600"
      />
    </div>
  );
}
const modifyId = (id: string = '', field: string = '', val: string = '') => {
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
  const oldId = node.id() || '';
  const newId = modifyId(oldId, field, mode === 'add' ? value : '');
  node.setAttr('id', newId);

  const attrs = node.getAttrs();
  if (mode === 'add') {
    node.setAttr(field, value);
  } else {
    const { [field]: _, ...rest } = attrs;
    node.setAttrs(rest);
  }
};
