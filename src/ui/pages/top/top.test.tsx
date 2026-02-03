import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { render } from "preact-render-to-string";
import { TopPage } from "./top.tsx";
import type { Article } from "../../../domain/types.ts";

const createMockArticle = (
  slug: string,
  category: Article["frontmatter"]["category"],
  title: string,
): Article => ({
  slug,
  frontmatter: {
    title,
    description: `${title}の説明`,
    category,
    downloadUrl: `https://example.com/${slug}`,
    date: "2024-01-15",
    tags: ["テスト"],
  },
  content: `<p>${title}の本文</p>`,
});

const mockArticles: Article[] = [
  createMockArticle("sheet1", "spreadsheet", "スプレッドシート記事1"),
  createMockArticle("sheet2", "spreadsheet", "スプレッドシート記事2"),
  createMockArticle("gas1", "gas", "GAS記事1"),
  createMockArticle("docs1", "docs", "ドキュメント記事1"),
  createMockArticle("others1", "others", "その他記事1"),
];

Deno.test("TopPage - スプレッドシートカテゴリの記事が表示される", () => {
  const html = render(<TopPage baseUrl="/" articles={mockArticles} />);

  assertEquals(html.includes("スプレッドシート記事1"), true);
  assertEquals(html.includes("スプレッドシート記事2"), true);
});

Deno.test("TopPage - GASカテゴリの記事が表示される", () => {
  const html = render(<TopPage baseUrl="/" articles={mockArticles} />);

  assertEquals(html.includes("GAS記事1"), true);
});

Deno.test("TopPage - docsカテゴリの記事はトップページに表示されない", () => {
  const html = render(<TopPage baseUrl="/" articles={mockArticles} />);

  // docsカテゴリの記事タイトルがカード内に表示されていないことを確認
  // (セクション見出しには「ドキュメント」は含まれないので、記事タイトルで確認)
  assertEquals(html.includes("ドキュメント記事1"), false);
});


Deno.test("TopPage - 記事が0件でもエラーにならない", () => {
  const html = render(<TopPage baseUrl="/" articles={[]} />);

  assertEquals(html.includes("スプレッドシート"), true);
  assertEquals(html.includes("GAS"), true);
});

Deno.test("TopPage - baseUrlがリンクに正しく適用される", () => {
  const baseUrl = "https://example.com/";
  const html = render(<TopPage baseUrl={baseUrl} articles={mockArticles} />);

  assertEquals(html.includes(`href="${baseUrl}articles/sheet1.html"`), true);
});

Deno.test("TopPage - タブボタンが表示される", () => {
  const html = render(<TopPage baseUrl="/" articles={mockArticles} />);

  assertEquals(html.includes("スプレッドシート</button>"), true);
  assertEquals(html.includes("GAS</button>"), true);
});
