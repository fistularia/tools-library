import matter from "gray-matter";
import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";
import hljs from "highlight.js";
import type { Article, ArticleFrontmatter } from "../domain/types.ts";

const marked = new Marked(
  markedHighlight({
    langPrefix: "hljs language-",
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : "plaintext";
      return hljs.highlight(code, { language }).value;
    },
  })
);

const CONTENT_DIR = "./content/articles";

export async function getArticles(): Promise<Article[]> {
  const articles: Article[] = [];

  for await (const entry of Deno.readDir(CONTENT_DIR)) {
    if (entry.isFile && entry.name.endsWith(".md")) {
      const slug = entry.name.replace(/\.md$/, "");
      const article = await getArticle(slug);
      if (article) {
        articles.push(article);
      }
    }
  }

  return articles.sort(
    (a, b) =>
      new Date(b.frontmatter.date).getTime() -
      new Date(a.frontmatter.date).getTime(),
  );
}

export async function getArticle(slug: string): Promise<Article | null> {
  const filePath = `${CONTENT_DIR}/${slug}.md`;

  try {
    const fileContent = await Deno.readTextFile(filePath);
    const { data, content } = matter(fileContent);
    const htmlContent = await marked.parse(content);

    return {
      slug,
      frontmatter: data as ArticleFrontmatter,
      content: htmlContent,
    };
  } catch {
    return null;
  }
}

export async function getArticlesByCategory(
  category: ArticleFrontmatter["category"],
): Promise<Article[]> {
  const articles = await getArticles();
  return articles.filter((article) =>
    article.frontmatter.category === category
  );
}
