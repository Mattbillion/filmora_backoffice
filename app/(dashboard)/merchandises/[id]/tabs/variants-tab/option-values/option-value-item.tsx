'use client';
import React, { useState, useTransition } from 'react';
import { PlusCircle, Trash2, X } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ID } from '@/lib/fetch/types';

import { createVariantOptionValue, deleteVariantOptionValue } from './actions';
import { OptionValueInterface } from './schema';

type OptionValueItemProps = {
  com_id: ID;
  merch_id: ID;
  canAdd: boolean;
  canDelete: boolean;
  setOptionTypes: React.Dispatch<
    React.SetStateAction<Array<{ name: string; id: number }>>
  >;
  optionValues: OptionValueInterface[];
  optionType: { name: string; id: ID };
  setOptionValues: React.Dispatch<React.SetStateAction<OptionValueInterface[]>>;
};

function OptionValueItem({
  optionType,
  com_id,
  merch_id,
  optionValues,
  setOptionValues,
  setOptionTypes,
  canAdd,
  canDelete,
}: OptionValueItemProps) {
  const [value, setValue] = useState('');
  const [loading, setStartLoading] = useTransition();
  const [deleting, setStartDeleting] = useTransition();

  const handleAdd = () => {
    if (!!(value || '')?.trim()) {
      setStartLoading(() => {
        createVariantOptionValue({
          value,
          com_id: com_id,
          merch_id: merch_id,
          option_type_id: optionType.id,
        }).then((c) => {
          setOptionValues((prev) => c?.data?.data || prev);
          setValue('');
        });
      });
    }
  };

  const handleDelete = (valueId: ID) => {
    setStartDeleting(() => {
      deleteVariantOptionValue(valueId, {
        company_id: com_id,
      }).then(() =>
        setOptionValues((prev) => prev.filter((op) => op.id !== valueId)),
      );
    });
  };
  return (
    <Card>
      <CardHeader className="p-3">
        <CardTitle>
          <div className="flex items-center gap-2">
            <Label className="w-full text-base font-medium">
              {optionType.name}
            </Label>
            <Button
              size="sm"
              variant="ghost"
              disabled={loading || optionValues.length > 0}
              className="size-10 rounded-full text-destructive hover:text-destructive"
              onClick={() => {
                setOptionTypes((prev) =>
                  prev.filter((op) => op.id !== optionType.id),
                );
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 p-3 pt-0">
        {/* Add Values */}
        {optionValues.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {optionValues.map((op) => (
              <Badge
                key={op.id}
                variant="secondary"
                className="flex items-center gap-1 rounded-full px-3 py-1.5"
              >
                {op.value}
                {canDelete && (
                  <button
                    disabled={deleting}
                    onClick={() => handleDelete(op.id)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </Badge>
            ))}
          </div>
        )}
        <div className="flex flex-col gap-2">
          <Input
            value={value}
            className={'h-9'}
            disabled={loading}
            placeholder="Add option value"
            onChange={(e) => setValue(e.target.value)}
          />
          {canAdd && (
            <Button
              size="default"
              variant="outline"
              disabled={loading || !value}
              onClick={handleAdd}
            >
              <span>Add more option</span>
              <PlusCircle size={16} />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default OptionValueItem;
