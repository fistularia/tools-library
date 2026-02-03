import {
  assertEquals,
  assertNotEquals,
} from "https://deno.land/std@0.224.0/assert/mod.ts";
import { categoryLabels, categoryDefaultRank, type ArticleFrontmatter } from "./types.ts";

const ALL_CATEGORIES: ArticleFrontmatter["category"][] = [
  "spreadsheet",
  "docs",
  "slides",
  "gas",
  "hack",
  "others",
];

Deno.test("categoryLabels - 全てのカテゴリにラベルが定義されている", () => {
  for (const category of ALL_CATEGORIES) {
    const label = categoryLabels[category];
    assertNotEquals(label, undefined, `カテゴリ "${category}" にラベルが定義されていません`);
    assertNotEquals(label, "", `カテゴリ "${category}" のラベルが空文字です`);
  }
});

Deno.test("categoryLabels - spreadsheetのラベルが正しい", () => {
  assertEquals(categoryLabels.spreadsheet, "スプレッドシート");
});

Deno.test("categoryLabels - docsのラベルが正しい", () => {
  assertEquals(categoryLabels.docs, "ドキュメント");
});

Deno.test("categoryLabels - slidesのラベルが正しい", () => {
  assertEquals(categoryLabels.slides, "スライド");
});

Deno.test("categoryLabels - gasのラベルが正しい", () => {
  assertEquals(categoryLabels.gas, "GAS");
});

Deno.test("categoryLabels - othersのラベルが正しい", () => {
  assertEquals(categoryLabels.others, "その他");
});

Deno.test("categoryLabels - 定義されているカテゴリ数が正しい", () => {
  const definedCategories = Object.keys(categoryLabels);
  assertEquals(definedCategories.length, ALL_CATEGORIES.length);
});
