'use client';

import { useSession } from 'next-auth/react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TabsContent } from '@/components/ui/tabs';
import { checkPermission } from '@/lib/permission';

export function VariantsTab() {
  const { data: session } = useSession();

  return (
    <TabsContent value="variants" className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="space-y-1.5">
            <CardTitle>Product Variants</CardTitle>
            <CardDescription>Manage product variants and stock</CardDescription>
          </div>
          {checkPermission(session, [
            'create_company_merchandise_attribute_value',
          ]) && <Button>Add Variant</Button>}
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Master</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/*{merchVariants.map((variant) => (*/}
              {/*  <TableRow key={variant.id}>*/}
              {/*    <TableCell className="font-medium">*/}
              {/*      {variant.id}*/}
              {/*    </TableCell>*/}
              {/*    <TableCell>{variant.sku}</TableCell>*/}
              {/*    <TableCell>{variant.stock}</TableCell>*/}
              {/*    <TableCell>*/}
              {/*      {variant.is_master ? (*/}
              {/*        <Badge>Master</Badge>*/}
              {/*      ) : (*/}
              {/*        <Badge variant="outline">No</Badge>*/}
              {/*      )}*/}
              {/*    </TableCell>*/}
              {/*    <TableCell>*/}
              {/*      {variant.status ? (*/}
              {/*        <Badge variant="default">Active</Badge>*/}
              {/*      ) : (*/}
              {/*        <Badge variant="destructive">Inactive</Badge>*/}
              {/*      )}*/}
              {/*    </TableCell>*/}
              {/*    <TableCell>{formatDate(variant.created_at)}</TableCell>*/}
              {/*    <TableCell className="text-right">*/}
              {/*      <div className="flex justify-end gap-2">*/}
              {/*        <Button size="icon" variant="ghost">*/}
              {/*          <Edit className="h-4 w-4" />*/}
              {/*        </Button>*/}
              {/*        <Button*/}
              {/*          size="icon"*/}
              {/*          variant="ghost"*/}
              {/*          className="text-red-500"*/}
              {/*        >*/}
              {/*          <Trash className="h-4 w-4" />*/}
              {/*        </Button>*/}
              {/*      </div>*/}
              {/*    </TableCell>*/}
              {/*  </TableRow>*/}
              {/*))}*/}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
