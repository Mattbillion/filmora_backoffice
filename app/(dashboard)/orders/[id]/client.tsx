'use client';

import { currencyFormat, handleCopy } from '@interpriz/lib';
import dayjs from 'dayjs';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Copy,
  Edit,
  MapPin,
  Percent,
  Phone,
  Tag,
  User,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

import { OrderDetail } from '../schema';

export default function OrderDetailClient({ order }: { order: OrderDetail }) {
  const lineItems = order.order_items || [];

  const totalPrice = lineItems.reduce(
    (sum, item) => sum + item.item_total_price,
    0,
  );
  const discountedTotalPrice = lineItems.reduce(
    (sum, item) => sum + item.item_discounted_total_price,
    0,
  );
  const totalDiscount = totalPrice - discountedTotalPrice;

  return (
    <div className="container mx-auto space-y-6 py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/orders">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to orders</span>
            </Link>
          </Button>
          <div>
            <h1 className="flex items-center text-2xl font-bold tracking-tight">
              Order Details
              <Button
                variant="ghost"
                size="sm"
                className="ml-2 h-6"
                onClick={() =>
                  handleCopy(order.order_number, () =>
                    toast.success('Copied to clipboard'),
                  )
                }
              >
                <span className="text-sm font-normal text-muted-foreground">
                  {order.order_number}
                </span>
                <Copy className="ml-1 h-3 w-3" />
              </Button>
            </h1>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Order Status</CardTitle>
              <Badge
                className={cn('bg-gray-100 text-gray-800 hover:bg-gray-100', {
                  'bg-green-100 text-green-800 hover:bg-green-100':
                    order.order_status === 'completed',
                  'bg-yellow-100 text-yellow-800 hover:bg-yellow-100':
                    order.order_status === 'pending',
                  'bg-red-100 text-red-800 hover:bg-red-100':
                    order.order_status === 'cancelled',
                })}
              >
                {order.order_status.charAt(0).toUpperCase() +
                  order.order_status.slice(1)}
              </Badge>
            </div>
            <CardDescription className="mt-1 flex items-center">
              <Calendar className="mr-1 h-4 w-4" />
              {order.order_date}
              <Clock className="ml-3 mr-1 h-4 w-4" />
              {order.order_time.split('.')[0]}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Update Status</label>
                <Select value={order.order_status} onValueChange={console.log}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div>
                <h3 className="mb-2 text-sm font-medium">
                  Payment Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Total Amount</p>
                    <p className="text-2xl font-bold">
                      {currencyFormat(discountedTotalPrice)}
                    </p>
                    {totalDiscount > 0 && (
                      <p className="text-sm text-muted-foreground line-through">
                        {currencyFormat(totalPrice)}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">Payment Deadline</p>
                    <p className="text-base">
                      {dayjs(order.payment_deadline).format(
                        'YYYY-MM-DD hh:mm:ss',
                      )}
                    </p>
                  </div>
                </div>
                {totalDiscount > 0 && (
                  <div className="mt-2 flex items-center rounded-md bg-green-50 p-2">
                    <Percent className="mr-2 h-4 w-4 text-green-600" />
                    <p className="text-sm text-green-700">
                      Discount applied: {currencyFormat(totalDiscount)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="contact">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="contact">Contact</TabsTrigger>
                <TabsTrigger value="address">Address</TabsTrigger>
              </TabsList>
              <TabsContent value="contact" className="mt-4 space-y-4">
                <div className="flex items-start gap-3">
                  <User className="mt-0.5 h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">
                      {order.order_contact.first_name}{' '}
                      {order.order_contact.last_name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {order.order_contact.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">
                      Primary: {order.order_contact.phone}
                    </p>
                    {order.order_contact.phone2 && (
                      <p className="text-sm text-muted-foreground">
                        Secondary: {order.order_contact.phone2}
                      </p>
                    )}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="address" className="mt-4 space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{order.order_address.alias}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.order_address.address}
                    </p>
                    {order.order_address.address2 && (
                      <p className="text-sm text-muted-foreground">
                        {order.order_address.address2}
                      </p>
                    )}
                    <p className="mt-1 text-sm text-muted-foreground">
                      District: {order.order_address.district}, Khoroo:{' '}
                      {order.order_address.khoroo}, City:{' '}
                      {order.order_address.city}
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Order Items</CardTitle>
              <CardDescription>
                {order.items_count} item{order.items_count > 1 ? 's' : ''} in
                this order
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Edit className="mr-2 h-4 w-4" />
              Edit Items
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="min-w-full divide-y divide-border">
              <thead>
                <tr className="bg-muted/50">
                  <th className="px-4 py-3.5 text-left text-sm font-semibold text-foreground">
                    Item ID
                  </th>
                  <th className="px-4 py-3.5 text-left text-sm font-semibold text-foreground">
                    Item
                  </th>
                  <th className="px-4 py-3.5 text-left text-sm font-semibold text-foreground">
                    Details
                  </th>
                  <th className="px-4 py-3.5 text-left text-sm font-semibold text-foreground">
                    Quantity
                  </th>
                  <th className="px-4 py-3.5 text-right text-sm font-semibold text-foreground">
                    Price
                  </th>
                  <th className="px-4 py-3.5 text-right text-sm font-semibold text-foreground">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-background">
                {lineItems.map((item) => (
                  <tr key={item.id}>
                    <td className="whitespace-nowrap px-4 py-4 font-mono text-sm">
                      {item.id}
                    </td>
                    <td className="px-4 py-4 text-sm">
                      {item.type === 'merchandise' &&
                        item.variant_details?.medias?.[0]?.media_url && (
                          <div className="flex items-center gap-3">
                            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
                              <Image
                                src={
                                  item.variant_details.medias[0].media_url ||
                                  '/placeholder.svg'
                                }
                                alt={item.variant_details.mer_name}
                                width={64}
                                height={64}
                                className="h-full w-full object-cover object-center"
                              />
                            </div>
                            <div>
                              <div className="font-medium">
                                {item.variant_details.mer_name}
                              </div>
                              <div className="flex items-center text-muted-foreground">
                                <Tag className="mr-1 h-3 w-3" />
                                {item.variant_details.sku}
                              </div>
                              <div className="mt-1 text-xs text-muted-foreground">
                                Stock: {item.variant_details.stock}
                              </div>
                            </div>
                          </div>
                        )}
                      {item.type === 'seat' && (
                        <div>
                          <div className="font-medium">
                            {item.type.charAt(0).toUpperCase() +
                              item.type.slice(1)}
                          </div>
                          {item.seat_details && (
                            <div className="text-muted-foreground">
                              ID: {item.seat_id}
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4 text-sm">
                      {item.type === 'merchandise' && item.variant_details && (
                        <div className="space-y-1">
                          {item.variant_details.option_values
                            .filter(
                              (option, index, self) =>
                                self.findIndex(
                                  (o) =>
                                    o.option_name === option.option_name &&
                                    o.value === option.value,
                                ) === index,
                            )
                            .map((option, index) => (
                              <div key={index}>
                                <span className="font-medium">
                                  {option.option_name}:
                                </span>{' '}
                                {option.value}
                              </div>
                            ))}
                          {Object.entries(item.variant_details.properties).map(
                            ([key, value]) => (
                              <div key={key}>
                                <span className="font-medium">
                                  {key.charAt(0).toUpperCase() + key.slice(1)}:
                                </span>{' '}
                                {value}
                              </div>
                            ),
                          )}
                          {item.discount_details && (
                            <div className="mt-2">
                              <Badge
                                variant="outline"
                                className="border-green-200 bg-green-50 text-green-700"
                              >
                                <Percent className="mr-1 h-3 w-3" />
                                {item.discount_details.discount_name}:{' '}
                                {item.discount_details.discount}
                                {item.discount_details.discount_type ===
                                'PERCENT'
                                  ? '%'
                                  : ' off'}
                              </Badge>
                            </div>
                          )}
                        </div>
                      )}
                      {item.type === 'seat' && item.seat_details && (
                        <div>
                          <div>
                            <span className="font-medium">Seat:</span>{' '}
                            {item.seat_details.seat_name}
                          </div>
                          <div>
                            <span className="font-medium">Row:</span>{' '}
                            {item.seat_details.row_no}
                          </div>
                          <div>
                            <span className="font-medium">Status:</span>{' '}
                            {item.seat_details.is_reserved}
                          </div>
                          <div>
                            <span className="font-medium">Section:</span>{' '}
                            {item.seat_details.section_type}
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm">
                      {item.quantity}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-right text-sm">
                      {item.item_discounted_total_price !==
                      item.item_total_price ? (
                        <div>
                          <div>
                            {currencyFormat(
                              item.item_discounted_total_price / item.quantity,
                            )}
                          </div>
                          <div className="text-muted-foreground line-through">
                            {currencyFormat(
                              item.item_total_price / item.quantity,
                            )}
                          </div>
                        </div>
                      ) : (
                        currencyFormat(item.price)
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-right text-sm font-medium">
                      {item.item_discounted_total_price !==
                      item.item_total_price ? (
                        <div>
                          <div>
                            {currencyFormat(item.item_discounted_total_price)}
                          </div>
                          <div className="text-muted-foreground line-through">
                            {currencyFormat(item.item_total_price)}
                          </div>
                        </div>
                      ) : (
                        currencyFormat(item.item_total_price)
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-border">
                  <th
                    colSpan={5}
                    className="px-4 py-3.5 text-right text-sm font-semibold text-foreground"
                  >
                    Subtotal
                  </th>
                  <th className="px-4 py-3.5 text-right text-sm font-semibold text-foreground">
                    {currencyFormat(totalPrice)}
                  </th>
                  <th></th>
                </tr>
                {totalDiscount > 0 && (
                  <tr>
                    <th
                      colSpan={5}
                      className="px-4 py-3.5 text-right text-sm font-semibold text-green-600"
                    >
                      Discount
                    </th>
                    <th className="px-4 py-3.5 text-right text-sm font-semibold text-green-600">
                      -{currencyFormat(totalDiscount)}
                    </th>
                    <th></th>
                  </tr>
                )}
                <tr className="border-t border-border bg-muted/30">
                  <th
                    colSpan={5}
                    className="px-4 py-3.5 text-right text-base font-semibold text-foreground"
                  >
                    Total
                  </th>
                  <th className="px-4 py-3.5 text-right text-base font-semibold text-foreground">
                    {currencyFormat(discountedTotalPrice)}
                  </th>
                  <th></th>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
