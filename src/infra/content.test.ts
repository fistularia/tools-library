import {
  assertEquals,
  assertExists,
} from "https://deno.land/std@0.224.0/assert/mod.ts";
import { stub } from "https://deno.land/std@0.224.0/testing/mock.ts";
import { getArticle, getArticles, getArticlesByCategory } from "./content.ts";

const mockMarkdownWithFrontmatter = `---
title: テスト記事
description: テスト説明
category: spreadsheet
downloadUrl: https://example.com/download
date: "2024-01-15"
tags:
  - テスト
  - サンプル
---

# テスト見出し

これはテスト本文です。
`;

const mockMarkdownWithFrontmatter2 = `---
title: 2番目の記事
description: 2番目の説明
category: gas
downloadUrl: https://example.com/download2
date: "2024-01-20"
tags:
  - GAS
---

# GAS記事

GASの本文です。
`;

const mockMarkdownWithFrontmatter3 = `---
title: 3番目の記事
description: 3番目の説明
category: spreadsheet
downloadUrl: https://example.com/download3
date: "2024-01-10"
tags:
  - スプレッドシート
---

古い記事です。
`;

Deno.test("getArticle - 正常系: Frontmatterありのマークダウンを正しくパースできる", async () => {
  const readTextFileStub = stub(
    Deno,
    "readTextFile",
    () => Promise.resolve(mockMarkdownWithFrontmatter),
  );

  try {
    const article = await getArticle("test-article");

    assertExists(article);
    assertEquals(article.slug, "test-article");
    assertEquals(article.frontmatter.title, "テスト記事");
    assertEquals(article.frontmatter.description, "テスト説明");
    assertEquals(article.frontmatter.category, "spreadsheet");
    assertEquals(article.frontmatter.downloadUrl, "https://example.com/download");
    assertEquals(article.frontmatter.date, "2024-01-15");
    assertEquals(article.frontmatter.tags, ["テスト", "サンプル"]);
    assertEquals(article.content.includes("<h1>テスト見出し</h1>"), true);
    assertEquals(article.content.includes("これはテスト本文です。"), true);
  } finally {
    readTextFileStub.restore();
  }
});

Deno.test("getArticle - 異常系: 存在しないファイルはnullを返す", async () => {
  const readTextFileStub = stub(
    Deno,
    "readTextFile",
    () => Promise.reject(new Deno.errors.NotFound("File not found")),
  );

  try {
    const article = await getArticle("non-existent");
    assertEquals(article, null);
  } finally {
    readTextFileStub.restore();
  }
});

Deno.test("getArticles - 正常系: 記事一覧をrank昇順で取得できる", async () => {
  const mockEntries = [
    { name: "article1.md", isFile: true, isDirectory: false, isSymlink: false },
    { name: "article2.md", isFile: true, isDirectory: false, isSymlink: false },
    { name: "article3.md", isFile: true, isDirectory: false, isSymlink: false },
  ];

  async function* mockReadDir() {
    for (const entry of mockEntries) {
      yield entry;
    }
  }

  const readDirStub = stub(
    Deno,
    "readDir",
    () => mockReadDir() as AsyncIterable<Deno.DirEntry>,
  );

  const fileContents: Record<string, string> = {
    "./content/articles/article1.md": mockMarkdownWithFrontmatter, // spreadsheet, rank: 10000
    "./content/articles/article2.md": mockMarkdownWithFrontmatter2, // gas, rank: 40000
    "./content/articles/article3.md": mockMarkdownWithFrontmatter3, // spreadsheet, rank: 10000
  };

  const readTextFileStub = stub(
    Deno,
    "readTextFile",
    (path: string | URL) => Promise.resolve(fileContents[path.toString()] || ""),
  );

  try {
    const articles = await getArticles();

    assertEquals(articles.length, 3);
    // rank昇順でソートされていることを確認（spreadsheetはrank 10000、gasはrank 40000）
    assertEquals(articles[0].frontmatter.category, "spreadsheet");
    assertEquals(articles[1].frontmatter.category, "spreadsheet");
    assertEquals(articles[2].frontmatter.category, "gas");
  } finally {
    readDirStub.restore();
    readTextFileStub.restore();
  }
});

Deno.test("getArticles - 正常系: .md以外のファイルは無視される", async () => {
  const mockEntries = [
    { name: "article1.md", isFile: true, isDirectory: false, isSymlink: false },
    { name: "readme.txt", isFile: true, isDirectory: false, isSymlink: false },
    { name: "image.png", isFile: true, isDirectory: false, isSymlink: false },
  ];

  async function* mockReadDir() {
    for (const entry of mockEntries) {
      yield entry;
    }
  }

  const readDirStub = stub(
    Deno,
    "readDir",
    () => mockReadDir() as AsyncIterable<Deno.DirEntry>,
  );

  const readTextFileStub = stub(
    Deno,
    "readTextFile",
    () => Promise.resolve(mockMarkdownWithFrontmatter),
  );

  try {
    const articles = await getArticles();
    assertEquals(articles.length, 1);
    assertEquals(articles[0].frontmatter.title, "テスト記事");
  } finally {
    readDirStub.restore();
    readTextFileStub.restore();
  }
});

Deno.test("getArticles - 正常系: ディレクトリは無視される", async () => {
  const mockEntries = [
    { name: "article1.md", isFile: true, isDirectory: false, isSymlink: false },
    { name: "subdir", isFile: false, isDirectory: true, isSymlink: false },
  ];

  async function* mockReadDir() {
    for (const entry of mockEntries) {
      yield entry;
    }
  }

  const readDirStub = stub(
    Deno,
    "readDir",
    () => mockReadDir() as AsyncIterable<Deno.DirEntry>,
  );

  const readTextFileStub = stub(
    Deno,
    "readTextFile",
    () => Promise.resolve(mockMarkdownWithFrontmatter),
  );

  try {
    const articles = await getArticles();
    assertEquals(articles.length, 1);
  } finally {
    readDirStub.restore();
    readTextFileStub.restore();
  }
});

Deno.test("getArticlesByCategory - 正常系: カテゴリでフィルタリングできる", async () => {
  const mockEntries = [
    { name: "article1.md", isFile: true, isDirectory: false, isSymlink: false },
    { name: "article2.md", isFile: true, isDirectory: false, isSymlink: false },
    { name: "article3.md", isFile: true, isDirectory: false, isSymlink: false },
  ];

  async function* mockReadDir() {
    for (const entry of mockEntries) {
      yield entry;
    }
  }

  const readDirStub = stub(
    Deno,
    "readDir",
    () => mockReadDir() as AsyncIterable<Deno.DirEntry>,
  );

  const fileContents: Record<string, string> = {
    "./content/articles/article1.md": mockMarkdownWithFrontmatter, // spreadsheet
    "./content/articles/article2.md": mockMarkdownWithFrontmatter2, // gas
    "./content/articles/article3.md": mockMarkdownWithFrontmatter3, // spreadsheet
  };

  const readTextFileStub = stub(
    Deno,
    "readTextFile",
    (path: string | URL) => Promise.resolve(fileContents[path.toString()] || ""),
  );

  try {
    const spreadsheetArticles = await getArticlesByCategory("spreadsheet");
    assertEquals(spreadsheetArticles.length, 2);
    assertEquals(
      spreadsheetArticles.every((a) => a.frontmatter.category === "spreadsheet"),
      true,
    );

    const gasArticles = await getArticlesByCategory("gas");
    assertEquals(gasArticles.length, 1);
    assertEquals(gasArticles[0].frontmatter.category, "gas");

    const docsArticles = await getArticlesByCategory("docs");
    assertEquals(docsArticles.length, 0);
  } finally {
    readDirStub.restore();
    readTextFileStub.restore();
  }
});
