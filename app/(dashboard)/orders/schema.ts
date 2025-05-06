import { z } from 'zod';

import type { BaseType, PrettyType } from '@/lib/fetch/types';

export const ordersSchema = z.object({
  order_id: z.number(),
  order_number: z.string(),
  order_status: z.string(),
  payment_deadline: z.string(),
  order_date: z.string(),
  order_time: z.string(),
  product_count: z.number(),
});

export type OrdersBodyType = z.infer<typeof ordersSchema>;

export type OrdersItemType = PrettyType<BaseType<OrdersBodyType>>;

export const RVK_ORDERS = 'orders';

export interface OrderDetail {
  id: number;
  order_date: string;
  order_time: string;
  items_count: number;
  order_items: OrderItem[];
  order_number: string;
  order_status: string;
  order_address: OrderAddress;
  order_contact: OrderContact;
  total_quantity: number;
  payment_deadline: string;
}

export type OrderItem = SeatItem | MerchandiseItem;

interface SeatItem {
  id: number;
  type: 'seat';
  price: number;
  seat_id: number | null;
  quantity: number;
  variant_id: number | null;
  discount_id: number | null;
  seat_details: SeatDetails;
  variant_details: null;
  discount_details: null;
  item_total_price: number;
  item_discounted_total_price: number;
}

interface MerchandiseItem {
  id: number;
  type: 'merchandise';
  price: number;
  seat_id: null;
  quantity: number;
  variant_id: number | null;
  discount_id: number | null;
  seat_details: null;
  variant_details: VariantDetails;
  discount_details: DiscountDetails;
  item_total_price: number;
  item_discounted_total_price: number;
}

export interface SeatDetails {
  price: number;
  row_no: string;
  seat_no: string;
  seat_name: string;
  is_reserved: string;
  section_type: string;
}

export interface VariantDetails {
  sku: string;
  stock: number;
  medias: Media[];
  mer_id: number;
  mer_name: string;
  properties: {
    age: string;
    brand: string;
    gender: string;
    material: string;
  };
  option_values: OptionValue[];
  variant_price: number;
  variant_discounted_price: number;
}

export interface Media {
  media_url: string;
  media_desc: string;
  media_type: string;
  media_label: string;
}

export interface OptionValue {
  value: string;
  option_id: number;
  option_name: string;
  option_name_mn: string;
}

export interface DiscountDetails {
  end_at: string;
  discount: number;
  start_at: string;
  discount_name: string;
  discount_type: string;
}

export interface OrderAddress {
  id: number;
  city: string;
  alias: string;
  khoroo: string;
  address: string;
  address2: string;
  district: string;
  address_lat: string;
  address_long: string;
}

export interface OrderContact {
  id: number;
  email: string;
  phone: string;
  phone2: string;
  last_name: string;
  first_name: string;
}
