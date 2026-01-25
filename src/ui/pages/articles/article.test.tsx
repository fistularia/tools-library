import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { render } from "preact-render-to-string";
import { ArticlePage } from "./article.tsx";
import type { Article } from "../../../domain/types.ts";

const createMockArticle = (
  overrides: Partial<Article["frontmatter"]> = {},
): Article => ({
  slug: "test-article",
  frontmatter: {
    title: "テスト記事タイトル",
    description: "テスト記事の説明文です",
    category: "spreadsheet",
    downloadUrl: "https://example.com/download",
    date: "2024-01-15",
    tags: ["タグ1", "タグ2"],
    ...overrides,
  },
  content: "<p>これはテスト本文です</p>",
});

Deno.test("ArticlePage - 記事タイトルが表示される", () => {
  const article = createMockArticle();
  const html = render(<ArticlePage baseUrl="/" article={article} />);

  assertEquals(html.includes("テスト記事タイトル"), true);
});

Deno.test("ArticlePage - 記事説明が表示される", () => {
  const article = createMockArticle();
  const html = render(<ArticlePage baseUrl="/" article={article} />);

  assertEquals(html.includes("テスト記事の説明文です"), true);
});

Deno.test("ArticlePage - 日付が表示される", () => {
  const article = createMockArticle();
  const html = render(<ArticlePage baseUrl="/" article={article} />);

  assertEquals(html.includes("2024-01-15"), true);
});

Deno.test("ArticlePage - タグが表示される", () => {
  const article = createMockArticle();
  const html = render(<ArticlePage baseUrl="/" article={article} />);

  assertEquals(html.includes("タグ1"), true);
  assertEquals(html.includes("タグ2"), true);
});

Deno.test("ArticlePage - spreadsheetカテゴリのラベルが正しく表示される", () => {
  const article = createMockArticle({ category: "spreadsheet" });
  const html = render(<ArticlePage baseUrl="/" article={article} />);

  assertEquals(html.includes("スプレッドシート"), true);
  assertEquals(html.includes("article-page__category--spreadsheet"), true);
});

Deno.test("ArticlePage - gasカテゴリのラベルが正しく表示される", () => {
  const article = createMockArticle({ category: "gas" });
  const html = render(<ArticlePage baseUrl="/" article={article} />);

  assertEquals(html.includes(">GAS<"), true);
  assertEquals(html.includes("article-page__category--gas"), true);
});

Deno.test("ArticlePage - ダウンロードボタンが表示される", () => {
  const article = createMockArticle({ downloadUrl: "https://example.com/dl" });
  const html = render(<ArticlePage baseUrl="/" article={article} />);

  assertEquals(html.includes("download-button"), true);
  assertEquals(html.includes("https://example.com/dl"), true);
});

Deno.test("ArticlePage - 本文コンテンツが表示される", () => {
  const article = createMockArticle();
  const html = render(<ArticlePage baseUrl="/" article={article} />);

  assertEquals(html.includes("これはテスト本文です"), true);
});

Deno.test("ArticlePage - 一覧に戻るリンクが表示される", () => {
  const article = createMockArticle();
  const html = render(<ArticlePage baseUrl="/" article={article} />);

  assertEquals(html.includes("一覧に戻る"), true);
});

Deno.test("ArticlePage - baseUrlがリンクに正しく適用される", () => {
  const baseUrl = "https://example.com/";
  const article = createMockArticle();
  const html = render(<ArticlePage baseUrl={baseUrl} article={article} />);

  assertEquals(html.includes(`href="${baseUrl}"`), true);
});

Deno.test("ArticlePage - サムネイル画像のパスが正しい", () => {
  const article = createMockArticle();
  const html = render(<ArticlePage baseUrl="/" article={article} />);

  assertEquals(html.includes(`src="/img/test-article.png"`), true);
});
