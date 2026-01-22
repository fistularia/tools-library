export interface ArticleFrontmatter {
  title: string;
  description: string;
  category: "spreadsheet" | "docs" | "slides";
  downloadUrl: string;
  thumbnail: string;
  date: string;
  tags: string[];
}

export interface Article {
  slug: string;
  frontmatter: ArticleFrontmatter;
  content: string;
}

export const categoryLabels: Record<ArticleFrontmatter["category"], string> = {
  spreadsheet: "スプレッドシート",
  docs: "ドキュメント",
  slides: "スライド",
};
