export type Category = {
  id: string;
  label: string;
};

export type NewsItem = {
  id: string;
  title: string;
  summary: string;
  author: string;
  publishedAt: string;
  tags: string[];
  imageUrl: string;
};
