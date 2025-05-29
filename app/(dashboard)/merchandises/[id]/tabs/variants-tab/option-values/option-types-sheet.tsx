'use client';

import { ReactNode, useRef, useState, useTransition } from 'react';
import { DatabaseZap } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

import { generateVariants } from '@/app/(dashboard)/merchandises/[id]/tabs/variants-tab/actions';
import { VariantItemType } from '@/app/(dashboard)/merchandises/[id]/tabs/variants-tab/schema';
import { FormDialogRef } from '@/components/custom/form-dialog';
import { Button } from '@/components/ui/button';
import { ID } from '@/lib/fetch/types';
import { checkPermission } from '@/lib/permission';

import { getMerchOptionValues } from './actions';
import AddOptionType from './add-option-type';
import OptionValueItem from './option-value-item';
import { OptionValueInterface } from './schema';
import SheetItem from './sheet';

interface OptionTypesSheetProps {
  onSave: (variants: VariantItemType[]) => void;
  children: ReactNode;
  canAddType: boolean;
}

export function OptionTypesSheet({
  onSave,
  children,
  canAddType,
}: OptionTypesSheetProps) {
  const [loading, startLoadingTransition] = useTransition();
  const [generating, startLoadingGenerate] = useTransition();
  const dialogRef = useRef<FormDialogRef>(null);
  const [optionTypes, setOptionTypes] = useState<
    Array<{ name: string; id: number }>
  >([]);
  const [optionValues, setOptionValues] = useState<OptionValueInterface[]>([]);
  const { id } = useParams<{ id: string }>();
  const { data: session } = useSession();

  const canIGenerate = checkPermission(session, [
    'get_company_merchandise_attribute_value_list',
    'get_company_merchandise_attribute_value',
    'create_company_merchandise_attribute_value',
    'update_company_merchandise_attribute_value',
    'delete_company_merchandise_attribute_value',
    'get_company_merchandise_attribute_option_value_list',
    'get_company_merchandise_attribute_option_value',
    'create_company_merchandise_attribute_option_value',
    'update_company_merchandise_attribute_option_value',
    'delete_company_merchandise_attribute_option_value',
  ]);

  return (
    <SheetItem
      ref={dialogRef}
      title="Option types"
      trigger={children}
      footerClassName="px-0 pt-3"
      footerActions={
        canIGenerate ? (
          <Button
            variant="outline"
            className="h-12 w-full rounded-xl"
            disabled={generating || loading}
            onClick={() => {
              startLoadingGenerate(() => {
                generateVariants({
                  merch_id: Number(id),
                  company_id: Number(session?.user?.company_id),
                }).then((res) => {
                  toast.success('Variants generated successfully');
                  onSave(res.data?.data || []);
                  dialogRef.current?.close();
                });
              });
            }}
          >
            Generate Variants
            <DatabaseZap size={16} />
          </Button>
        ) : undefined
      }
      onOpenChange={(c) => {
        if (c) {
          startLoadingTransition(() => {
            getMerchOptionValues(Number(id), {
              com_id: Number(session?.user?.company_id),
            }).then((optionData) => {
              const tmpTypes = (optionData.data?.data || [])?.reduce(
                (acc, cur) => {
                  acc[cur.option_type_id] = {
                    id: cur.option_type_id,
                    name: cur.option_name,
                  };
                  return acc;
                },
                {} as Record<ID, { id: ID; name: string }>,
              );
              setOptionTypes(Object.values(tmpTypes || { d: [] }));
              setOptionValues(optionData.data?.data || []);
            });
          });
        }
      }}
    >
      <div className={'flex w-full flex-col-reverse gap-4'}>
        {optionTypes.map((ot) => (
          <OptionValueItem
            key={ot.id}
            optionType={ot}
            merch_id={Number(id)}
            optionValues={optionValues.filter(
              (c) => c.option_type_id === ot.id,
            )}
            setOptionValues={setOptionValues}
            setOptionTypes={setOptionTypes}
            canAdd={checkPermission(session, [
              'create_company_merchandise_attribute_value',
              'create_company_merchandise_attribute_option_value',
            ])}
            canDelete={checkPermission(session, [
              'delete_company_merchandise_attribute_value',
              'delete_company_merchandise_attribute_option_value',
            ])}
            com_id={Number(session?.user?.company_id)}
          />
        ))}
        {canAddType && (
          <AddOptionType
            onSelect={(ot) =>
              setOptionTypes((prev) => [
                ...prev.filter((c) => c.id !== ot.id),
                { name: ot.option_name, id: ot.id },
              ])
            }
          />
        )}
      </div>
    </SheetItem>
  );
}
