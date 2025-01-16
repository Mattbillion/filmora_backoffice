"use client";

import { getAlbums } from "@/app/(dashboard)/albums/actions";
import { AlbumItemType } from "@/app/(dashboard)/albums/schema";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function AlbumField({ control }: { control: any }) {
  const [loading, setLoading] = useState(false);
  const [albums, setAlbums] = useState<AlbumItemType[]>([]);

  useEffect(() => {
    setLoading(true);
    getAlbums({ limit: 1000 })
      .then((c) => setAlbums(c.data.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <FormField
      control={control}
      name="albumId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Suggest album</FormLabel>
          <Select
            disabled={loading}
            onValueChange={(value) => field.onChange(Number(value))}
            defaultValue={field.value ? field.value.toString() : undefined}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a album" />
              </SelectTrigger>
            </FormControl>
            <SelectContent defaultValue="0">
              {albums.map((c, idx) => (
                <SelectItem value={c.id.toString()} key={idx}>
                  {c.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
