import { omit } from 'lodash';

import CurrencyItem from '@/components/custom/currency-item';
import HtmlTipTapItem from '@/components/custom/html-tiptap-item';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { TabsContent } from '@/components/ui/tabs';
import { HierarchicalSelect } from '@/features/category/components/hierarichal-select';
import { HierarchicalCategory } from '@/features/category/schema';
import { DiscountsItemType } from '@/features/discounts/schema';

export function DetailsTab({
  control,
  discounts,
  categories,
  events,
}: {
  control: any;
  categories: HierarchicalCategory[];
  discounts: DiscountsItemType[];
  events: { id: number; name: string }[];
}) {
  return (
    <TabsContent value="details" className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            Edit the basic details of this product
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={control}
            name="mer_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Mer name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="mer_desc"
            render={({ field }) => (
              <HtmlTipTapItem field={field} label="Description" />
            )}
          />
          <FormField
            control={control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <CurrencyItem field={field} placeholder={'Enter Price'} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="cat_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <HierarchicalSelect
                  categories={categories}
                  onChange={field.onChange}
                  value={field.value}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="discount_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discount id</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  value={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger disabled={!discounts.length}>
                      <SelectValue placeholder="Select a Discount id" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent defaultValue="false">
                    {discounts.map((c, idx) => (
                      <SelectItem key={idx} value={c.id.toString()}>
                        {c.discount_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="event_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  value={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger disabled={!discounts.length}>
                      <SelectValue placeholder="Select a Event" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {events.map((c, idx) => (
                      <SelectItem key={idx} value={c.id.toString()}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="status"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2 space-y-0">
                <Switch
                  {...omit(field, 'value')}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <FormLabel>Active</FormLabel>
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </TabsContent>
  );
}
