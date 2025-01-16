"use client";

import { getBooks } from "@/app/(dashboard)/books/actions";
import { BookItemType } from "@/app/(dashboard)/books/schema";
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
export function BookField({ control }: { control: any }) {
  const [loading, setLoading] = useState(false);
  const [books, setBooks] = useState<BookItemType[]>([]);

  useEffect(() => {
    setLoading(true);
    getBooks({ limit: 1000 })
      .then((c) => setBooks(c.data.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <FormField
      control={control}
      name="bookId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Suggest book</FormLabel>
          <Select
            disabled={loading}
            onValueChange={(value) => field.onChange(Number(value))}
            defaultValue={field.value ? field.value.toString() : undefined}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a book" />
              </SelectTrigger>
            </FormControl>
            <SelectContent defaultValue="0">
              {books.map((c, idx) => (
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
