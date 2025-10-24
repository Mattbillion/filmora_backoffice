'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderIcon, PlusIcon } from 'lucide-react';
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
  DrawerTrigger,
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
import { createMovieAction } from '@/services/movies-generated';
import {
  AppApiApiV1EndpointsDashboardCategoriesTagResponseType,
  CategoryResponseType,
  GenreResponseType,
  movieCreateSchema,
  MovieCreateType,
} from '@/services/schema';
import { getTags } from '@/services/tags';

import { UploadCover } from '../components/upload-cover';
import { UploadPoster } from '../components/upload-poster';

export default function CreateMovie() {
  const [categories, setCategories] = useState<CategoryResponseType[]>([]);
  const [genres, setGenres] = useState<GenreResponseType[]>([]);
  const [tags, setTags] = useState<
    AppApiApiV1EndpointsDashboardCategoriesTagResponseType[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const fetchCategories = async () => {
    const result = await getCategories();
    if (result.status === 'success') {
      setCategories(result.data || []);
    }
    return;
  };

  const fetchGenres = async () => {
    const result = await getGenres();
    if (result.status === 'success') {
      setGenres(result.data || []);
    }
    return;
  };

  const fetchTags = async () => {
    try {
      const res = await getTags();
      if (res.status === 'success') {
        setTags(res.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch genres', error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      fetchGenres();
      fetchTags();
    }
  }, [isOpen]);

  const form = useForm<MovieCreateType>({
    resolver: zodResolver(movieCreateSchema),
    defaultValues: {
      title: '',
      description: '',
      type: 'movie',
      year: new Date().getFullYear(),
      price: 0,
      poster_url: '',
      load_image_url: '',
      is_adult: false,
      is_premium: false,
      category_ids: [],
      genre_ids: [],
    },
  });

  const isSeriesMovie = form.watch('type') === 'series';

  async function onSubmitMovie(d: MovieCreateType) {
    const body = {
      title: d.title,
      description: d.description,
      type: d.type as 'series' | 'movie',
      year: Number(d.year),
      price: Number(d.price),
      poster_url: d.poster_url || '',
      load_image_url: d.load_image_url || '',
      is_adult: d.is_adult || false,
      is_premium: d.is_premium || false,
      category_ids: d.category_ids?.map((cat) => Number(cat)),
      genre_ids: d.genre_ids?.map((genre) => Number(genre)),
    };

    try {
      setIsLoading(true);
      const movieCreated = await createMovieAction(body);
      if (movieCreated.status === 'success') {
        toast.success('Кино амжилттай нэмэгдлээ');
      }
    } catch (_error) {
      toast.error('Кино оруулахад алдаа гарлаа');
    } finally {
      handleCloseDrawer();
    }
  }

  const handleCloseDrawer = () => {
    setIsOpen((prev) => !prev);
    setIsLoading(false);
    form.reset();
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">
          <PlusIcon /> Шинэ кино
        </Button>
      </DrawerTrigger>

      <DrawerContent className="max-h-[95vh] overflow-hidden">
        <ScrollArea className="h-auto overflow-y-auto">
          <div className="mx-auto max-w-[900px] space-y-4 pt-16 pb-20">
            <DrawerHeader className="bg-background fixed top-0 right-0 left-0 z-10 p-4">
              <DrawerTitle className="text-lg">Шинээр кино оруулах</DrawerTitle>
            </DrawerHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmitMovie)}
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
                    <FormItem className="flex flex-col gap-1">
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
                  name="category_ids"
                  render={({ field }) => {
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
                            onValueChange={(selectedValues) =>
                              field.onChange(
                                selectedValues.map((value) => Number(value)),
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

                <FormField
                  control={form.control}
                  name="genre_ids"
                  render={({ field }) => {
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
                            onValueChange={(selectedValues) =>
                              field.onChange(
                                selectedValues.map((value) => Number(value)),
                              )
                            }
                          />
                        </FormControl>
                      </FormItem>
                    );
                  }}
                />

                <FormField
                  control={form.control}
                  name="tag_ids"
                  render={({ field }) => {
                    return (
                      <FormItem className="flex flex-col gap-1">
                        <FormLabel>Кино tag сонгох</FormLabel>
                        <FormControl>
                          <MultiSelect
                            options={tags.map((tag) => {
                              return {
                                label: tag.name,
                                value: tag.id.toString(),
                              };
                            })}
                            onValueChange={(selectedValues: string[]) => {
                              field.onChange(
                                selectedValues.map((value) => {
                                  const tagId = Number(value);
                                  const tag = tags.find((g) => g.id === tagId);
                                  return {
                                    id: tagId,
                                    name: tag?.name || '',
                                  };
                                }),
                              );
                            }}
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
                    <FormItem
                      className={cn(
                        isSeriesMovie && 'sr-only',
                        'flex flex-col gap-1',
                      )}
                    >
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
                    <FormItem
                      className={cn(
                        isSeriesMovie && 'sr-only',
                        'flex flex-col gap-1',
                      )}
                    >
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
