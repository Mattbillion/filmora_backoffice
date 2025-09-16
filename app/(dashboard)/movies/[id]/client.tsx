'use client';
import React from 'react';
import { MovieDetail } from './types';
import { useForm } from 'react-hook-form';
import { MoviesBodyType, moviesSchema } from '../schema';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Form,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import HtmlTipTapItem from '@/components/custom/html-tiptap-item';

export default function Client({ data }: { data: MovieDetail }) {
  const categories = data.categories?.map((category) => category);
  const form = useForm<MoviesBodyType>({
    resolver: zodResolver(moviesSchema),
    defaultValues: data,
  });

  function onSubmit(data: MoviesBodyType) {
    return console.log(data);
  }

  console.log(categories, 'data');
  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, console.error)}>
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Title" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => <HtmlTipTapItem field={field} />}
          />
        </form>
      </Form>
    </>
  );
}
