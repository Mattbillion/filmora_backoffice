'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  inventoryMap,
  logisticsMap,
  pricingMap,
  translationMap,
} from './constants';
import {
  LayerValueInput,
  LayerValueInputProps,
  manipulateAttrs,
} from './layer-form-inputs';

const allComponents = {
  ...pricingMap,
  ...inventoryMap,
  ...logisticsMap,
} as const;

type ComponentKey = {
  [K in keyof typeof allComponents]: (typeof allComponents)[K];
}[keyof typeof allComponents];

export function AdditionalInformation({
  node,
  onFocus,
  onChange,
}: Pick<LayerValueInputProps, 'node' | 'onFocus' | 'onChange'>) {
  const [selectedKeys, setSelectedKeys] = useState<ComponentKey[]>(
    Object.keys(node.attrs)
      .filter((c) =>
        Object.values(allComponents).includes(
          c.replace('data-', '') as ComponentKey,
        ),
      )
      .map((c) => c.replace('data-', '') as ComponentKey) || [],
  );
  const [newKey, setNewKey] = useState<ComponentKey | ''>('');

  const availableKeys = Object.values(allComponents).filter(
    (k) => !selectedKeys.includes(k as ComponentKey),
  ) as ComponentKey[];

  const addComponent = () => {
    if (newKey && !selectedKeys.includes(newKey)) {
      setSelectedKeys([...selectedKeys, newKey]);
      setNewKey('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="mb-2 border-b pb-2 pt-4 font-bold">
          Additional information
        </p>
        {selectedKeys.map((key) => (
          <div key={key} className="flex items-end gap-2">
            <LayerValueInput
              fixedField={key}
              node={node}
              onChange={onChange}
              onFocus={onFocus}
              className="flex-1"
            />
            <Button
              type="button"
              size="icon"
              onClick={() => {
                manipulateAttrs(node, `data-${key}`, '', 'remove');
                setSelectedKeys((c) => c.filter((k) => k !== key));
              }}
            >
              <Trash2 />
            </Button>
          </div>
        ))}
      </div>

      <div className="flex items-end gap-2">
        <div className="flex-1">
          <Label>Add Information</Label>
          <Select
            value={newKey}
            onValueChange={(value) => setNewKey(value as ComponentKey)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a component" />
            </SelectTrigger>
            <SelectContent>
              {availableKeys.map((k) => (
                <SelectItem key={k} value={k}>
                  {translationMap[k]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={addComponent} disabled={!newKey}>
          Add
        </Button>
      </div>
    </div>
  );
}
