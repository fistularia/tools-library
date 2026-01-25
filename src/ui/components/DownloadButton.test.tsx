import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { getButtonText } from "./DownloadButton.tsx";

Deno.test("getButtonText - spreadsheetカテゴリで正しいテキストを返す", () => {
  const result = getButtonText("spreadsheet");
  assertEquals(result, "スプレッドシートをコピー");
});

Deno.test("getButtonText - docsカテゴリで正しいテキストを返す", () => {
  const result = getButtonText("docs");
  assertEquals(result, "ドキュメントをコピー");
});

Deno.test("getButtonText - slidesカテゴリで正しいテキストを返す", () => {
  const result = getButtonText("slides");
  assertEquals(result, "スライドをコピー");
});

Deno.test("getButtonText - 未知のカテゴリでデフォルトテキストを返す", () => {
  const result = getButtonText("unknown");
  assertEquals(result, "ファイルをコピー");
});

Deno.test("getButtonText - gasカテゴリでデフォルトテキストを返す", () => {
  const result = getButtonText("gas");
  assertEquals(result, "ファイルをコピー");
});

Deno.test("getButtonText - othersカテゴリでデフォルトテキストを返す", () => {
  const result = getButtonText("others");
  assertEquals(result, "ファイルをコピー");
});

Deno.test("getButtonText - 空文字でデフォルトテキストを返す", () => {
  const result = getButtonText("");
  assertEquals(result, "ファイルをコピー");
});
