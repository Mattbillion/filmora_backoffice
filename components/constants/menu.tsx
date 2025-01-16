import {
  LayoutTemplate,
  Newspaper,
  TableOfContents,
  Tag,
  Trophy,
  Disc3,
  BookHeart,
  Podcast,
  SquarePlay,
  Moon,
  Archive,
  SquareUserRound,
  Users,
  SquareLibrary,
  FolderClock,
  type LucideIcon,
} from "lucide-react";

export type SubMenuItemType = {
  title: string;
  url: string;
  icon: LucideIcon;
  subRoutes?: boolean;
  children?: Omit<SubMenuItemType, "children">[];
};

export const navMain = [
  {
    title: "Trainings",
    url: "/trainings",
    icon: Trophy,
    subRoutes: true,
  },
  {
    title: "Albums",
    url: "/albums",
    icon: Disc3,
    subRoutes: true,
  },
  {
    title: "Moods",
    url: "/moods",
    icon: Moon,
    subRoutes: true,
  },
  {
    title: "Books",
    url: "/books",
    icon: BookHeart,
  },
  {
    title: "Article",
    url: "/article",
    icon: Newspaper,
  },
  {
    title: "Podcasts",
    url: "/podcasts",
    icon: Podcast,
  },
  {
    title: "Videos",
    url: "/videos",
    icon: SquarePlay,
  },
  {
    title: "Banners",
    url: "/banners",
    icon: LayoutTemplate,
  },
  {
    title: "Magazine",
    url: "/magazines",
    icon: SquareLibrary,
    subRoutes: true,
    children: [
      // {
      //   title: "Articles",
      //   url: "/magazines/articles",
      // },
      {
        title: "Category",
        url: "/magazines/category",
      },
    ],
  },
] as const;

export const navAdmin = [
  {
    title: "Tags",
    url: "/tags",
    icon: Tag,
  },
  {
    title: "FAQs",
    url: "/faqs",
    icon: TableOfContents,
  },
  {
    title: "Employees",
    url: "/employees",
    icon: SquareUserRound,
  },
  {
    title: "Users",
    url: "/users",
    icon: Users,
    subRoutes: true,
  },
  {
    title: "Orders",
    url: "/orders",
    icon: Archive,
  },
  {
    title: "Activity logs",
    url: "/logs",
    icon: FolderClock,
  },
] as const;

export const menuData: Record<string, SubMenuItemType[]> = {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  navMain: [...navMain].sort((a, b) => a.title.localeCompare(b.title)),
  navAdmin: [...navAdmin].sort((a, b) => a.title.localeCompare(b.title)),
};
