export interface ArticleFrontmatter {
  title: string;
  description: string;
  category: "spreadsheet" | "docs" | "slides" | "gas" | "hack";
  downloadUrl: string;
  date: string;
  tags: string[];
  rank?: number;
  status?: "public" | "private";
}

export const categoryDefaultRank: Record<
  ArticleFrontmatter["category"],
  number
> = {
  spreadsheet: 10000,
  docs: 20000,
  slides: 30000,
  gas: 40000,
  hack: 50000,
};

export interface Article {
  slug: string;
  frontmatter: ArticleFrontmatter;
  content: string;
}

export interface Link {
  url: string;
  title: string;
  description: string;
  category: string;
  status?: "public" | "private";
}

export const linkCategoryLabels: Record<string, string> = {
  spreadsheet: "スプレッドシート",
  docs: "ドキュメント",
  slides: "スライド",
  gas: "Google App Script",
  hack: "Hack",
};

export interface Snippet {
  title: string;
  description: string;
  content: string;
  category: string;
  tags: string[];
  status?: "public" | "private";
}

export const categoryLabels: Record<ArticleFrontmatter["category"], string> = {
  spreadsheet: "スプレッドシート",
  docs: "ドキュメント",
  slides: "スライド",
  gas: "Google App Script",
  hack: "Hack",
};
// export const categoryLabels: Record<ArticleFrontmatter["category"], string> = {
//   spreadsheet: "Sheets",
//   docs: "Docs",
//   slides: "Slides",
//   gas: "GAS",
//   hack: "Hack",
//   others: "Ohters",
// };
