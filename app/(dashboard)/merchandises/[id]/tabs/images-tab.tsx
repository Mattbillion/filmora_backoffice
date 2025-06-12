import { X } from 'lucide-react';
import Image from 'next/image';

import UploadImageItem from '@/components/custom/upload-image-item';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  FieldArray,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { TabsContent } from '@/components/ui/tabs';

export function ImagesTab({ control }: { control: any }) {
  return (
    <TabsContent value="images" className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Product Images</CardTitle>
          <CardDescription>Manage product images</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldArray name="medias">
            {({ fields, append, remove }) => (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {fields.map((field, index) => (
                    <div key={field.id} className="space-y-2">
                      <FormField
                        control={control}
                        name={`medias.${index}.media_url`}
                        render={({ field: itemField }) => (
                          <div className="relative aspect-square overflow-hidden rounded-lg border">
                            <Image
                              src={itemField.value}
                              alt=""
                              fill
                              className="object-cover"
                            />

                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute left-2 top-2"
                              onClick={() => remove(index)}
                            >
                              <X />
                            </Button>
                          </div>
                        )}
                      />
                      <FormField
                        control={control}
                        name={`medias.${index}.media_label`}
                        render={({ field: itemField }) => (
                          <FormItem className="space-y-1">
                            <FormLabel className="text-sm">
                              Media label
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...itemField}
                                placeholder="Media label"
                                className="h-8"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={control}
                        name={`medias.${index}.media_desc`}
                        render={({ field: itemField }) => (
                          <FormItem className="space-y-1">
                            <FormLabel className="text-sm">
                              Media desc
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...itemField}
                                placeholder="Media desc"
                                className="h-8"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}
                </div>

                <UploadImageItem
                  field={
                    {
                      value: undefined,
                      onChange: (newFile: string) => {
                        append({
                          media_url: newFile,
                          media_desc: '',
                          media_type: 'image',
                          media_label: '',
                        });
                      },
                    } as any
                  }
                  imagePrefix="picture"
                />
              </div>
            )}
          </FieldArray>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
