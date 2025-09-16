'use client';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from '@radix-ui/react-label';

import HtmlTipTapItem from '@/components/custom/html-tiptap-item';
import { MultiSelect } from '@/components/custom/multi-select';
import UploadCover from '@/components/custom/upload-cover';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

import { getGenres } from '../actions';
import { MoviesBodyType, moviesSchema } from '../schema';
import { Genre, MovieDetail } from './types';
export default function Client({ data }: { data: MovieDetail }) {
  const [genres, setGenres] = useState<Genre[]>([]);
  const defaultGenresValues = genres.map((genre) => genre.id.toString());

  useEffect(() => {
    const fetchGenres = async () => {
      const result = await getGenres();
      if (result.error) {
        throw new Error(result.error as string);
      }
      if (result.data) {
        setGenres(result.data.data);
      }
    };
    fetchGenres();
  }, []);

  const genreOptions = genres.map((genre) => ({
    label: genre.name,
    value: genre.id.toString(),
  }));

  const form = useForm<MoviesBodyType>({
    resolver: zodResolver(moviesSchema),
    defaultValues: data,
  });

  function onSubmit(data: MoviesBodyType) {}

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, console.error)}>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="load_image_url"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <UploadCover field={field} imagePrefix="poster_url" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
            <FormField
              control={form.control}
              name="genres_ids"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Movie Genres</FormLabel>
                  <FormControl>
                    <MultiSelect
                      defaultValue={defaultGenresValues}
                      options={genreOptions}
                      onValueChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categories_ids"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Movie Categories</FormLabel>
                  <FormControl>
                    <MultiSelect
                      defaultValue={defaultGenresValues}
                      options={genreOptions}
                      onValueChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_adult"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Movie Genres</FormLabel>
                  <FormControl>
                    <div>
                      <Label>Is Adult</Label>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </>
  );
}
