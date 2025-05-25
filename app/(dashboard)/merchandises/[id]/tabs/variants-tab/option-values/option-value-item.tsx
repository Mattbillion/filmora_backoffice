'use client';
import React, { useState, useTransition } from 'react';
import { Plus, Trash2, X } from 'lucide-react';

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
      }).then(() => {
        console.log('deleted', valueId);
        setOptionValues((prev) => prev.filter((op) => op.id !== valueId));
      });
    });
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">{optionType.name}</Label>
            </div>
            {!optionValues?.length && (
              <Button
                size="sm"
                variant="ghost"
                disabled={loading}
                className="text-destructive hover:text-destructive"
                onClick={() => {
                  setOptionTypes((prev) =>
                    prev.filter((op) => op.id !== optionType.id),
                  );
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add Values */}
        <div className="flex gap-2">
          <Input
            value={value}
            className={'h-9'}
            disabled={loading}
            onChange={(e) => setValue(e.target.value)}
          />
          {canAdd && (
            <Button
              size={'icon'}
              disabled={loading}
              onClick={handleAdd}
              className={'flex-basis-9 h-9 w-9 flex-shrink-0 flex-grow-0'}
            >
              <Plus className="h-4 w-4" />
            </Button>
          )}
        </div>
        {optionValues.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {optionValues.map((op) => (
              <Badge
                key={op.id}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {op.value}
                {canDelete && (
                  <button
                    disabled={deleting}
                    className="ml-1 hover:text-destructive"
                    onClick={() => handleDelete(op.id)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default OptionValueItem;
