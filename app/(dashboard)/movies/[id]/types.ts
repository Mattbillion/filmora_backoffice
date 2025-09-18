export type MovieDetailResponse = {
  status: string;
  message: string;
  data: MovieDetail;
};

export type Category = {
  id: number;
  name: string;
  // add other category properties as needed
};

type Genre = {
  id: number;
  name: string;
  // add other genre properties as needed
};

export type MovieDetail = {
  title: string;
  description: string;
  type: string;
  year: number;
  price: string;
  is_premium: boolean;
  poster_url: string;
  is_adult: boolean;
  load_image_url: string | null;
  id: string;
  created_at: string;
  categories: Category[];
  genres: Genre[];
};
