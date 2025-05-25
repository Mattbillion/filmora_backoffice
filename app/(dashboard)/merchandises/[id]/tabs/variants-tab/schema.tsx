import { z } from 'zod';

export const variantsSchema = z.object({
  variant_id: z.number(),
  image: z.string(),
  price: z.number(),
  stock: z.number(),
  merch_id: z.number(),
});

export const variantsBulkSchema = z.object({
  updates: z.array(variantsSchema),
});

export type VariantBodyType = z.infer<typeof variantsSchema>;
export type VariantsBodyType = z.infer<typeof variantsBulkSchema>;

export type VariantItemType = {
  id: number;
  sku: string;
  image?: string;
  price?: number;
  stock: number;
  cat_id: number;
  status: boolean;
  com_id: number;
  merch_id: number;
  is_master: boolean;
  created_at: string;
  updated_at?: string;
  created_employee: string;

  attributes: Array<{
    value: string;
    option_type_id: number;
    option_type_name: string;
    attribute_value_id: number;
  }>;
};

export const RVK_VARIANTS = 'variants';
