import { z } from 'zod';

export const seriesSeasonSchema = z.object({
  id: z.uuid(),
  movie_id: z.uuid().optional(),
  season_number: z.number().int(),
  title: z.string().optional(),
  description: z.string().optional(),
  release_date: z.iso.datetime().optional(),
  cover_image_url: z.string().optional(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime().optional(),
});

export type SeriesSeasonType = z.infer<typeof seriesSeasonSchema>;

export const baseResponseUnionListSeriesSeasonDictSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: z.union([z.array(seriesSeasonSchema), z.object({})]),
  total_count: z.number().int().optional(),
});

export type BaseResponseUnionListSeriesSeasonDictType = z.infer<
  typeof baseResponseUnionListSeriesSeasonDictSchema
>;

export const baseResponseUnionSeriesSeasonDictSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: z.union([seriesSeasonSchema, z.object({})]),
  total_count: z.number().int().optional(),
});

export type BaseResponseUnionSeriesSeasonDictType = z.infer<
  typeof baseResponseUnionSeriesSeasonDictSchema
>;

export const seriesEpisodeSchema = z.object({
  episode_id: z.uuid(),
  season_id: z.uuid(),
  title: z.string().optional(),
  episode_number: z.number().int().optional(),
  m3u8_url: z.string(),
  duration: z.string().optional(),
});

export type SeriesEpisodeType = z.infer<typeof seriesEpisodeSchema>;

export const baseResponseUnionSeriesEpisodeDictSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: z.union([seriesEpisodeSchema, z.object({})]),
  total_count: z.number().int().optional(),
});

export type BaseResponseUnionSeriesEpisodeDictType = z.infer<
  typeof baseResponseUnionSeriesEpisodeDictSchema
>;

export const seriesSeasonCreateSchema = z.object({
  movie_id: z.uuid().optional(),
  season_number: z.number().int(),
  title: z.string().optional(),
  description: z.string().optional(),
  release_date: z.iso.datetime().optional(),
  cover_image_url: z.string().optional(),
});

export type SeriesSeasonCreateType = z.infer<typeof seriesSeasonCreateSchema>;

export const seriesSeasonUpdateSchema = z.object({
  movie_id: z.uuid().optional(),
  season_number: z.number().int().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  release_date: z.iso.datetime().optional(),
  cover_image_url: z.string().optional(),
});

export type SeriesSeasonUpdateType = z.infer<typeof seriesSeasonUpdateSchema>;

export const baseResponseDictSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: z.object({}),
  total_count: z.number().int().optional(),
});

export type BaseResponseDictType = z.infer<typeof baseResponseDictSchema>;

export const bodyDashboardEmployeeLoginSchema = z.object({
  grant_type: z.string().optional(),
  username: z.string(),
  password: z.string(),
  scope: z.string().optional(),
  client_id: z.string().optional(),
  client_secret: z.string().optional(),
});

export type BodyDashboardEmployeeLoginType = z.infer<
  typeof bodyDashboardEmployeeLoginSchema
>;

export const tokenRefreshRequestSchema = z.object({
  refresh_token: z.string(),
});

export type TokenRefreshRequestType = z.infer<typeof tokenRefreshRequestSchema>;

export const bodyDashboardUploadImageSchema = z.object({
  file: z.instanceof(Blob),
});

export type BodyDashboardUploadImageType = z.infer<
  typeof bodyDashboardUploadImageSchema
>;

export const imageInfoSchema = z.object({
  id: z.uuid(),
  image_url: z.string(),
  file_name: z.string(),
  file_size: z.number().int(),
  content_type: z.string(),
  created_at: z.string(),
});

export type ImageInfoType = z.infer<typeof imageInfoSchema>;

export const imageListResponseSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: z.array(imageInfoSchema),
  pagination: z.object({}),
});

export type ImageListResponseType = z.infer<typeof imageListResponseSchema>;

export const categoryResponseSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  description: z.string().optional(),
  is_adult: z.boolean().optional(),
});

export type CategoryResponseType = z.infer<typeof categoryResponseSchema>;

export const baseResponseListUnionCategoryResponseNoneTypeSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: z.array(categoryResponseSchema),
  total_count: z.number().int().optional(),
});

export type BaseResponseListUnionCategoryResponseNoneTypeType = z.infer<
  typeof baseResponseListUnionCategoryResponseNoneTypeSchema
>;

export const baseResponseUnionCategoryResponseNoneTypeSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: categoryResponseSchema,
  total_count: z.number().int().optional(),
});

export type BaseResponseUnionCategoryResponseNoneTypeType = z.infer<
  typeof baseResponseUnionCategoryResponseNoneTypeSchema
>;

export const categoryCreateSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  is_adult: z.boolean().optional(),
  is_featured: z.boolean().optional(),
});

export type CategoryCreateType = z.infer<typeof categoryCreateSchema>;

export const categoryUpdateSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  is_adult: z.boolean().optional(),
  is_featured: z.boolean().optional(),
});

export type CategoryUpdateType = z.infer<typeof categoryUpdateSchema>;

export const baseResponseUnionDictNoneTypeSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: z.object({}),
  total_count: z.number().int().optional(),
});

export type BaseResponseUnionDictNoneTypeType = z.infer<
  typeof baseResponseUnionDictNoneTypeSchema
>;

export const genreResponseSchema = z.object({
  id: z.number().int(),
  name: z.string(),
});

export type GenreResponseType = z.infer<typeof genreResponseSchema>;

export const baseResponseUnionListGenreResponseNoneTypeSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: z.array(genreResponseSchema),
  total_count: z.number().int().optional(),
});

export type BaseResponseUnionListGenreResponseNoneTypeType = z.infer<
  typeof baseResponseUnionListGenreResponseNoneTypeSchema
>;

export const baseResponseUnionGenreResponseNoneTypeSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: genreResponseSchema,
  total_count: z.number().int().optional(),
});

export type BaseResponseUnionGenreResponseNoneTypeType = z.infer<
  typeof baseResponseUnionGenreResponseNoneTypeSchema
>;

export const genreCreateSchema = z.object({
  name: z.string(),
});

export type GenreCreateType = z.infer<typeof genreCreateSchema>;

export const genreUpdateSchema = z.object({
  name: z.string().optional(),
});

export type GenreUpdateType = z.infer<typeof genreUpdateSchema>;

export const movieResponseSchema = z.object({
  title: z.string().max(500).min(1),
  description: z.string().max(5000).optional(),
  type: z.enum(['movie', 'series']),
  year: z.number().int().min(1900).max(2030).optional(),
  price: z.number().int().min(0).optional(),
  is_premium: z.boolean().optional(),
  poster_url: z.string().optional(),
  is_adult: z.boolean().optional(),
  load_image_url: z.string().optional(),
  movie_id: z.uuid(),
  created_at: z.iso.datetime(),
  categories: z.array(categoryResponseSchema).optional(),
  genres: z.array(genreResponseSchema).optional(),
});

export type MovieResponseType = z.infer<typeof movieResponseSchema>;

export const baseResponseUnionMovieResponseNoneTypeSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: movieResponseSchema,
  total_count: z.number().int().optional(),
});

export type BaseResponseUnionMovieResponseNoneTypeType = z.infer<
  typeof baseResponseUnionMovieResponseNoneTypeSchema
>;

export const movieCreateSchema = z.object({
  title: z.string().max(500).min(1),
  description: z.string().max(5000).optional(),
  type: z.enum(['movie', 'series']),
  year: z.number().int().min(1900).max(2030).optional(),
  price: z.number().int().min(0).optional(),
  is_premium: z.boolean().optional(),
  poster_url: z.string().optional(),
  is_adult: z.boolean().optional(),
  load_image_url: z.string().optional(),
  category_ids: z.array(z.number().int()).optional(),
  genre_ids: z.array(z.number().int()).optional(),
});

export type MovieCreateType = z.infer<typeof movieCreateSchema>;

export const movieListResponseSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  description: z.string().optional(),
  type: z.enum(['movie', 'series']),
  year: z.number().int().optional(),
  price: z.number().int().optional(),
  is_premium: z.boolean().optional(),
  poster_url: z.string().optional(),
  load_image_url: z.string().optional(),
  trailer_url: z.string().optional(),
  is_adult: z.boolean().optional(),
  created_at: z.iso.datetime(),
  categories: z.array(categoryResponseSchema).optional(),
  genres: z.array(genreResponseSchema).optional(),
});

export type MovieListResponseType = z.infer<typeof movieListResponseSchema>;

export const baseResponseUnionListMovieListResponseNoneTypeSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: z.array(movieListResponseSchema),
  total_count: z.number().int().optional(),
});

export type BaseResponseUnionListMovieListResponseNoneTypeType = z.infer<
  typeof baseResponseUnionListMovieListResponseNoneTypeSchema
>;

export const singleItemReponseMovieResponseSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: movieResponseSchema,
});

export type SingleItemReponseMovieResponseType = z.infer<
  typeof singleItemReponseMovieResponseSchema
>;

export const movieUpdateSchema = z.object({
  title: z.string().max(500).min(1).optional(),
  description: z.string().max(5000).optional(),
  type: z.enum(['movie', 'series']).optional(),
  year: z.number().int().min(1900).max(2030).optional(),
  price: z.number().int().min(0).optional(),
  is_premium: z.boolean().optional(),
  poster_url: z.string().optional(),
  is_adult: z.boolean().optional(),
  categories: z.array(z.number().int()).optional(),
  genres: z.array(z.number().int()).optional(),
  load_image_url: z.string().optional(),
});

export type MovieUpdateType = z.infer<typeof movieUpdateSchema>;

export const bodyDashboardUploadVideoSchema = z.object({
  file: z.instanceof(Blob),
  movie_id: z.string(),
  season_id: z.string().optional(),
  episode_number: z.number().int().optional(),
  is_trailer: z.boolean().optional(),
});

export type BodyDashboardUploadVideoType = z.infer<
  typeof bodyDashboardUploadVideoSchema
>;

export const baseResponseUnionListDictNoneTypeSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: z.array(z.object({})),
  total_count: z.number().int().optional(),
});

export type BaseResponseUnionListDictNoneTypeType = z.infer<
  typeof baseResponseUnionListDictNoneTypeSchema
>;

export const bodyDashboardGetVideosSchema = z.object({
  movie_id: z.string(),
});

export type BodyDashboardGetVideosType = z.infer<
  typeof bodyDashboardGetVideosSchema
>;

export const movieRentalDataSchema = z.object({
  movie_id: z.uuid(),
  title: z.string(),
  poster_url: z.string().optional(),
  is_adult: z.boolean(),
  total_rentals: z.number().int(),
});

export type MovieRentalDataType = z.infer<typeof movieRentalDataSchema>;

export const baseResponseUnionListMovieRentalDataNoneTypeSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: z.array(movieRentalDataSchema),
  total_count: z.number().int().optional(),
});

export type BaseResponseUnionListMovieRentalDataNoneTypeType = z.infer<
  typeof baseResponseUnionListMovieRentalDataNoneTypeSchema
>;

export const subscriptionUserDataSchema = z.object({
  user_id: z.uuid(),
  full_name: z.string().optional(),
  email: z.string(),
  plan: z.string(),
  status: z.string(),
  started_at: z.iso.datetime(),
  expires_at: z.iso.datetime(),
});

export type SubscriptionUserDataType = z.infer<
  typeof subscriptionUserDataSchema
>;

export const baseResponseUnionListSubscriptionUserDataNoneTypeSchema = z.object(
  {
    status: z.string(),
    message: z.string(),
    data: z.array(subscriptionUserDataSchema),
    total_count: z.number().int().optional(),
  },
);

export type BaseResponseUnionListSubscriptionUserDataNoneTypeType = z.infer<
  typeof baseResponseUnionListSubscriptionUserDataNoneTypeSchema
>;
