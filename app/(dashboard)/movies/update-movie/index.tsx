'use client';

import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderIcon } from 'lucide-react';
import { toast } from 'sonner';

import HtmlTipTapItem from '@/components/custom/html-tiptap-item';
import { MultiSelect } from '@/components/custom/multi-select';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { getCategories } from '@/services/categories';
import { getGenres } from '@/services/genres';
import { getMovie, updateMovie } from '@/services/movies-generated';
import {
  CategoryResponseType,
  GenreResponseType,
  movieResponseSchema,
  MovieResponseType,
  MovieUpdateType,
} from '@/services/schema';

import { UploadCover } from '../components/upload-cover';
import { UploadPoster } from '../components/upload-poster';

// import { UploadCover } from './upload-cover';
// import { UploadPoster } from './upload-poster';

export default function UpdateMovie({
  id,
  buttonVariant = 'outline',
  editDrawerOpen,
  setEditDrawerOpen,
}: {
  id: string;
  buttonVariant?: 'outline' | 'default' | 'ghost';
  editDrawerOpen: boolean;
  setEditDrawerOpen: (open: boolean) => void;
}) {
  const [categories, setCategories] = useState<CategoryResponseType[]>([]);
  const [genres, setGenres] = useState<GenreResponseType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [initialData, setInitialData] = useState<MovieResponseType>();

  const fetchCategories = useCallback(async () => {
    try {
      const res = await getCategories();
      if (res.status === 'success') {
        setCategories(res.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch categories', error);
    }
  }, []);

  const fetchGenres = useCallback(async () => {
    try {
      const res = await getGenres();
      if (res.status === 'success') {
        setGenres(res.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch genres', error);
    }
  }, []);

  const fetchMovie = async () => {
    try {
      const response = await getMovie(id);
      if (response.status === 'success') {
        setInitialData(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch movie', err);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchGenres();
    fetchMovie();
  }, []);

  const form = useForm<MovieResponseType>({
    resolver: zodResolver(movieResponseSchema),
    values: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      type: initialData?.type || 'movie',
      year: initialData?.year || 0,
      price: initialData?.price || 0,
      is_premium: initialData?.is_premium || false,
      poster_url: initialData?.poster_url || '',
      load_image_url: initialData?.load_image_url || '',
      is_adult: initialData?.is_adult || false,
      categories: initialData?.categories || [],
      genres: initialData?.genres || [],
      movie_id: initialData?.movie_id || '',
      created_at: '2025-09-24T05:20:30.123Z',
    },
  });

  const isSeriesMovie = form.watch('type') === 'series';

  const onSubmit = async (d: MovieResponseType) => {
    setIsLoading(true);
    try {
      const body: MovieUpdateType = {
        title: d.title,
        description: d.description,
        type: d.type as 'movie' | 'series',
        year: Number(d.year),
        price: Number(d.price),
        is_premium: true,
        poster_url: d.poster_url,
        load_image_url: d.load_image_url || '',
        is_adult: false,
        category_ids: d.categories?.map((cat) => Number(cat.id)),
        genre_ids: d.genres?.map((genre) => Number(genre.id)),
      };

      const response = await updateMovie(id, body);
      if (response.status === 'success') {
        toast.success('Кино амжилттай засгалаа');
        setEditDrawerOpen(false);
      }
    } catch (err) {
      console.error('Failed to update movie', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Drawer open={editDrawerOpen} onOpenChange={setEditDrawerOpen}>
      <DrawerContent className="max-h-[95vh] overflow-hidden">
        <ScrollArea className="h-auto overflow-y-auto">
          <div className="mx-auto max-w-[900px] space-y-4 pt-16 pb-20">
            <DrawerHeader className="bg-background fixed top-0 right-0 left-0 z-10 p-4">
              <DrawerTitle className="text-lg">Кино мэдээлэл засах</DrawerTitle>
            </DrawerHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
                id="create-movie-form"
              >
                <FormField
                  control={form.control}
                  name="load_image_url"
                  render={({ field }) => <UploadCover field={field} />}
                />
                <FormField
                  control={form.control}
                  name="poster_url"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-1">
                      <UploadPoster field={field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-1">
                      <FormLabel>Киноны нэр оруулна уу</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Киноны нэр оруулна уу"
                          {...field}
                          className="shadow-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Дэлгэрэнгүй тайлбар</FormLabel>
                      <FormControl>
                        <HtmlTipTapItem field={field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-1">
                      <FormLabel>Кино төрөл сонгох</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="movie">Movie</SelectItem>
                            <SelectItem value="series">Series</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="categories"
                  render={({ field }) => {
                    const currentValues = field.value?.map((cat) =>
                      cat.id.toString(),
                    );
                    return (
                      <FormItem className="flex flex-col gap-1">
                        <FormLabel>Кино категори сонгох</FormLabel>
                        <FormControl>
                          <MultiSelect
                            options={categories.map((cat) => {
                              return {
                                label: cat.name,
                                value: cat.id.toString(),
                              };
                            })}
                            onValueChange={(selectedValues: string[]) => {
                              const selectedCategories = selectedValues.map(
                                (value) => {
                                  const categoryId = Number(value);
                                  const category = categories.find(
                                    (cat) => cat.id === categoryId,
                                  );
                                  return {
                                    id: categoryId,
                                    name: category?.name || '',
                                    description: '',
                                    is_adult: false,
                                  };
                                },
                              );
                              field.onChange(selectedCategories);
                            }}
                            defaultValue={currentValues}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

                <FormField
                  control={form.control}
                  name="genres"
                  render={({ field }) => {
                    const currentValues = field.value?.map((genre) =>
                      genre.id.toString(),
                    );
                    return (
                      <FormItem className="flex flex-col gap-1">
                        <FormLabel>Кино genre сонгох</FormLabel>
                        <FormControl>
                          <MultiSelect
                            options={genres.map((genre) => {
                              return {
                                label: genre.name,
                                value: genre.id.toString(),
                              };
                            })}
                            onValueChange={(selectedValues: string[]) => {
                              const selectedGenres = selectedValues.map(
                                (value) => {
                                  const genreId = Number(value);
                                  const genre = genres.find(
                                    (g) => g.id === genreId,
                                  );
                                  return {
                                    id: genreId,
                                    name: genre?.name || '',
                                  };
                                },
                              );
                              field.onChange(selectedGenres);
                            }}
                            defaultValue={currentValues}
                          />
                        </FormControl>
                      </FormItem>
                    );
                  }}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem className={cn(isSeriesMovie && 'sr-only')}>
                      <FormLabel>Түрээсийн үнэ</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter Price"
                          {...field}
                          value={field.value || ''}
                          className="shadow-none"
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value === '' ? 0 : Number(value));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem className={cn(isSeriesMovie && 'sr-only')}>
                      <FormLabel>Кино гарсан он</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Кино гарсан он"
                          {...field}
                          value={field.value || ''}
                          className="shadow-none"
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(
                              value === ''
                                ? new Date().getFullYear()
                                : Number(value),
                            );
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="is_premium"
                  render={({ field }) => (
                    <FormItem
                      className={cn(
                        isSeriesMovie
                          ? 'sr-only'
                          : 'flex flex-row items-center justify-between rounded-lg border p-4',
                      )}
                    >
                      <div className="flex flex-col gap-1">
                        <FormLabel className="text-md font-semibold">
                          Түрээсийн кино эсэх
                        </FormLabel>
                        <FormDescription className="text-muted-foreground">
                          Багцад үл хамаарсан зөвхөн түрээслэн үзэх боломжтой
                          кино
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value || false}
                          onCheckedChange={(checked) => field.onChange(checked)}
                          aria-readonly
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="is_adult"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="flex flex-col gap-1">
                        <FormLabel className="text-md font-semibold">
                          Насанд хүрэгчдийн кино эсэх
                        </FormLabel>
                        <FormDescription className="text-muted-foreground">
                          Хэрвээ таны оруулж буй кино +21 насанд хүрэгчдэд
                          зориулсан эсэх?
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value || false}
                          onCheckedChange={(checked) => field.onChange(checked)}
                          aria-readonly
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </form>
            </Form>

            <DrawerFooter className="bg-background border-border fixed right-0 bottom-0 left-0 border-t p-4">
              <div className="flex items-center justify-end gap-2">
                <DrawerClose asChild>
                  <Button variant="outline" disabled={isLoading}>
                    Цуцлах
                  </Button>
                </DrawerClose>
                <Button
                  type="submit"
                  form="create-movie-form"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <LoaderIcon className="animate-spin" />
                  ) : (
                    'Нэмэх'
                  )}
                </Button>
              </div>
            </DrawerFooter>
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
}
