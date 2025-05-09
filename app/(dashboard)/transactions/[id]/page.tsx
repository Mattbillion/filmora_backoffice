import { currencyFormat } from '@interpriz/lib';
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  MapPin,
  Package,
  Phone,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getOrdersDetail } from '@/app/(dashboard)/orders/actions';
import { getTransactionsDetail } from '@/app/(dashboard)/transactions/actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default async function TransactionDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { data } = await getTransactionsDetail(params.id);
  const { data: orderData } = await getOrdersDetail(data?.data.order_id!);
  const transaction = data?.data;
  const order = orderData?.data;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('mn-MN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatSimpleDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('mn-MN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const orderTotal =
    order?.order_items?.reduce(
      (total, item) => total + item.item_discounted_total_price,
      0,
    ) || 0;

  if (!transaction) return notFound();

  return (
    <div className="container mx-auto space-y-6 py-6">
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/transactions">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to transactions</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">
          Transaction #{transaction.id}
        </h1>
      </div>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="mr-2 h-5 w-5" />
            Transaction Details
          </CardTitle>
          <CardDescription>
            Complete information about this transaction
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <p className="text-sm font-medium">Transaction ID</p>
              <p className="text-sm text-muted-foreground">{transaction.id}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Amount</p>
              <p className="text-sm font-bold">
                {currencyFormat(transaction.transaction_amount)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Status</p>
              <Badge
                className="capitalize"
                variant={
                  transaction.transaction_status === 'completed'
                    ? 'default'
                    : 'outline'
                }
              >
                {transaction.transaction_status || 'N/A'}
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Payment Method</p>
              <p className="text-sm text-muted-foreground">
                {transaction.payment_method || 'N/A'}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Transaction Date</p>
              <p className="text-sm text-muted-foreground">
                {formatDate(transaction.transaction_date)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Created At</p>
              <p className="text-sm text-muted-foreground">
                {formatDate(transaction.created_at)}
              </p>
            </div>
            {!!transaction.updated_at && (
              <div className="space-y-1">
                <p className="text-sm font-medium">Last Updated</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(transaction.updated_at)}
                </p>
              </div>
            )}
            {!!order && (
              <div className="space-y-1">
                <p className="text-sm font-medium">Payment Deadline</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(order.payment_deadline)}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {!!order && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="mr-2 h-5 w-5" />
              Order Information
            </CardTitle>
            <CardDescription>
              Order #{order.order_number} • {formatSimpleDate(order.order_date)}{' '}
              {order.order_time}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="items" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="items">Order Items</TabsTrigger>
                <TabsTrigger value="shipping">Shipping Details</TabsTrigger>
                <TabsTrigger value="payment">Payment Details</TabsTrigger>
              </TabsList>
              <TabsContent value="items" className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium">
                      Items ({order.items_count})
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Total Quantity: {order.total_quantity}
                    </p>
                  </div>
                  <Badge className="capitalize" variant="outline">
                    {order.order_status}
                  </Badge>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Discount</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.order_items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {item.type === 'merchandise' &&
                              item.variant_details?.medias?.[0] && (
                                <div className="h-10 w-10 overflow-hidden rounded">
                                  <Image
                                    src={
                                      item.variant_details.medias[0]
                                        .media_url || '/placeholder.svg'
                                    }
                                    alt={
                                      item.variant_details.medias[0].media_desc
                                    }
                                    width={40}
                                    height={40}
                                    className="object-cover"
                                  />
                                </div>
                              )}
                            <div>
                              {item.type === 'seat' && item.seat_details ? (
                                <>
                                  <div className="font-medium">
                                    {item.seat_details.seat_name}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    Row {item.seat_details.row_no}, Seat{' '}
                                    {item.seat_details.seat_no} (
                                    {item.seat_details.section_type})
                                  </div>
                                </>
                              ) : item.type === 'merchandise' &&
                                item.variant_details ? (
                                <>
                                  <div className="font-medium">
                                    {item.variant_details.mer_name}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {item.variant_details.option_values
                                      .map(
                                        (option) =>
                                          `${option.option_name}: ${option.value}`,
                                      )
                                      .join(', ')}
                                  </div>
                                </>
                              ) : (
                                <div className="font-medium">Unknown Item</div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {item.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {item.quantity}
                        </TableCell>
                        <TableCell className="text-right">
                          {currencyFormat(item.price)}
                        </TableCell>
                        <TableCell className="text-right">
                          {item.type === 'merchandise' && item.discount_details
                            ? currencyFormat(
                                item.item_total_price -
                                  item.item_discounted_total_price,
                              )
                            : '—'}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {currencyFormat(item.item_discounted_total_price)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={5} className="text-right font-medium">
                        Total
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        {currencyFormat(orderTotal)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="shipping" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <h3 className="text-lg font-medium">Shipping Address</h3>
                    </div>

                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-sm font-medium">Alias</p>
                          <p className="text-sm text-muted-foreground">
                            {order.order_address.alias}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">City</p>
                          <p className="text-sm text-muted-foreground">
                            {order.order_address.city}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium">Address</p>
                        <p className="text-sm text-muted-foreground">
                          {order.order_address.address}
                        </p>
                        {order.order_address.address2 && (
                          <p className="text-sm text-muted-foreground">
                            {order.order_address.address2}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-sm font-medium">District</p>
                          <p className="text-sm text-muted-foreground">
                            {order.order_address.district}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Khoroo</p>
                          <p className="text-sm text-muted-foreground">
                            {order.order_address.khoroo}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-sm font-medium">Latitude</p>
                          <p className="text-sm text-muted-foreground">
                            {order.order_address.address_lat}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Longitude</p>
                          <p className="text-sm text-muted-foreground">
                            {order.order_address.address_long}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Phone className="h-5 w-5 text-muted-foreground" />
                      <h3 className="text-lg font-medium">
                        Contact Information
                      </h3>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <p className="text-sm font-medium">Full Name</p>
                        <p className="text-sm text-muted-foreground">
                          {order.order_contact.first_name}{' '}
                          {order.order_contact.last_name}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-medium">Email</p>
                        <p className="text-sm text-muted-foreground">
                          {order.order_contact.email}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-medium">Primary Phone</p>
                        <p className="text-sm text-muted-foreground">
                          {order.order_contact.phone}
                        </p>
                      </div>

                      {order.order_contact.phone2 && (
                        <div>
                          <p className="text-sm font-medium">Secondary Phone</p>
                          <p className="text-sm text-muted-foreground">
                            {order.order_contact.phone2}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="payment" className="space-y-4 pt-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <h3 className="text-lg font-medium">Payment Timeline</h3>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2 rounded-lg border p-4">
                      <p className="text-sm font-medium">Order Date</p>
                      <p className="text-sm text-muted-foreground">
                        {formatSimpleDate(order.order_date)} at{' '}
                        {order.order_time}
                      </p>
                    </div>

                    <div className="space-y-2 rounded-lg border p-4">
                      <p className="text-sm font-medium">Payment Deadline</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(order.payment_deadline)}
                      </p>
                    </div>

                    <div className="space-y-2 rounded-lg border p-4">
                      <p className="text-sm font-medium">Transaction Date</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(transaction.transaction_date)}
                      </p>
                    </div>

                    <div className="space-y-2 rounded-lg border p-4">
                      <p className="text-sm font-medium">Payment Method</p>
                      <p className="text-sm text-muted-foreground">
                        {transaction.payment_method || 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-lg border p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-sm font-medium">Payment Summary</p>
                      <Badge
                        className="capitalize"
                        variant={
                          transaction.transaction_status === 'completed'
                            ? 'default'
                            : 'outline'
                        }
                      >
                        {transaction.transaction_status}
                      </Badge>
                    </div>

                    <Separator className="my-4" />

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <p className="text-sm">Subtotal</p>
                        <p className="text-sm">
                          {currencyFormat(
                            order.order_items.reduce(
                              (total, item) => total + item.item_total_price,
                              0,
                            ),
                          )}
                        </p>
                      </div>

                      <div className="flex justify-between">
                        <p className="text-sm">Discounts</p>
                        <p className="text-sm text-destructive">
                          -
                          {currencyFormat(
                            order.order_items.reduce(
                              (total, item) =>
                                total +
                                (item.item_total_price -
                                  item.item_discounted_total_price),
                              0,
                            ),
                          )}
                        </p>
                      </div>

                      <Separator className="my-2" />

                      <div className="flex justify-between font-medium">
                        <p>Total</p>
                        <p>{currencyFormat(transaction.transaction_amount)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
