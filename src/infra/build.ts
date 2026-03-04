import { render } from "preact-render-to-string";
import * as sass from "npm:sass@1.69.7";
import { getArticles, getLinks, getSnippets } from "./content.ts";
import type { Article, Link, Snippet } from "../domain/types.ts";
import { IndexPage } from "../ui/pages/top/IndexPage.tsx";
import { PrivatePage } from "../ui/pages/top/PrivatePage.tsx";
import { ArticlePage } from "../ui/pages/articles/article.tsx";

const DIST_DIR = "./dist";

async function ensureDir(path: string) {
  try {
    await Deno.mkdir(path, { recursive: true });
  } catch (e) {
    if (!(e instanceof Deno.errors.AlreadyExists)) {
      throw e;
    }
  }
}

async function buildStyles() {
  console.log("Building styles...");

  const result = sass.compile("./src/ui/styles/main.scss", {
    style: "compressed",
  });

  await ensureDir(`${DIST_DIR}/styles`);
  await Deno.writeTextFile(`${DIST_DIR}/styles/main.css`, result.css);

  console.log("  Created: dist/styles/main.css");
}

interface SearchDataItem {
  searchText: string;
  slug: string;
  title: string;
  description: string;
  category: string;
}

function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function isPublicArticle(article: Article): boolean {
  return article.frontmatter.status === "public";
}

function isPublic(item: { status?: string }): boolean {
  return item.status === "public";
}

async function buildSearchData(
  articles: Awaited<ReturnType<typeof getArticles>>,
  destPath: string,
) {
  const searchData: SearchDataItem[] = articles.map((article) => {
    const { slug, frontmatter, content } = article;
    const { title, description, category, tags } = frontmatter;
    const plainContent = stripHtmlTags(content);
    const searchText = [slug, title, ...tags, description, plainContent].join(
      "_",
    );

    return {
      searchText,
      slug,
      title,
      description,
      category,
    };
  });

  const jsonString = JSON.stringify(searchData);
  await Deno.writeTextFile(destPath, jsonString);

  const fileSizeBytes = new TextEncoder().encode(jsonString).length;
  const fileSizeKB = (fileSizeBytes / 1024).toFixed(2);
  const fileSizeMB = (fileSizeBytes / 1024 / 1024).toFixed(3);
  console.log(
    `  Created: ${destPath} (${fileSizeKB} KB / ${fileSizeMB} MB)`,
  );
}

async function buildSnippetsData(snippets: Snippet[], destPath: string) {
  const data = snippets.map((
    { title, description, content, category, tags },
  ) => ({
    searchText: [title, description, category, ...tags, content].join("_"),
    title,
    description,
    content,
    category,
  }));
  await Deno.writeTextFile(destPath, JSON.stringify(data));
  console.log(`  Created: ${destPath}`);
}

async function buildLinksData(links: Link[], destPath: string) {
  const data = links.map(({ url, title, description, category }) => ({
    searchText: [title, description, category].join("_"),
    url,
    title,
    description,
    category,
  }));
  await Deno.writeTextFile(destPath, JSON.stringify(data));
  console.log(`  Created: ${destPath}`);
}


async function buildPages() {
  console.log("Building pages...");

  // GitHub Actions上ならリポジトリ名、ローカルならルート(/)
  const isCI = Deno.env.get("GITHUB_ACTIONS") === "true";
  const baseUrl = isCI ? "https://tools-library.mints.ne.jp/" : "/";

  const allArticles = await getArticles();
  const allLinks = await getLinks();
  const allSnippets = await getSnippets();

  const publicArticles = allArticles.filter(isPublicArticle);
  const publicLinks = allLinks.filter(isPublic);
  const publicSnippets = allSnippets.filter(isPublic);

  // Build public search data
  await buildSearchData(publicArticles, `${DIST_DIR}/search-data.json`);
  await buildLinksData(publicLinks, `${DIST_DIR}/links-data.json`);
  await buildSnippetsData(publicSnippets, `${DIST_DIR}/snippets-data.json`);

  // Build public top page
  const topPageHtml = "<!DOCTYPE html>" +
    render(
      IndexPage({
        baseUrl,
        articles: publicArticles,
        links: publicLinks,
        snippets: publicSnippets,
      }),
    );
  await Deno.writeTextFile(`${DIST_DIR}/index.html`, topPageHtml);
  console.log("  Created: dist/index.html");

  // Build private search data (all content, prefixed filenames)
  await buildSearchData(allArticles, `${DIST_DIR}/private-search-data.json`);
  await buildLinksData(allLinks, `${DIST_DIR}/private-links-data.json`);
  await buildSnippetsData(allSnippets, `${DIST_DIR}/private-snippets-data.json`);

  // Build private top page (all content)
  const privatePageHtml = "<!DOCTYPE html>" +
    render(
      PrivatePage({
        baseUrl,
        articles: allArticles,
        links: allLinks,
        snippets: allSnippets,
      }),
    );
  await Deno.writeTextFile(`${DIST_DIR}/private.html`, privatePageHtml);
  console.log("  Created: dist/private.html");

  // Build article pages (all articles)
  await ensureDir(`${DIST_DIR}/articles`);

  for (const article of allArticles) {
    const articleHtml = "<!DOCTYPE html>" +
      render(ArticlePage({ baseUrl, article }));
    await Deno.writeTextFile(
      `${DIST_DIR}/articles/${article.slug}.html`,
      articleHtml,
    );
    console.log(`  Created: dist/articles/${article.slug}.html`);
  }
}

async function copyPublicFiles() {
  console.log("Copying public files...");

  try {
    for await (const entry of Deno.readDir("./public")) {
      const srcPath = `./public/${entry.name}`;
      const destPath = `${DIST_DIR}/${entry.name}`;

      if (entry.isFile) {
        await Deno.copyFile(srcPath, destPath);
        console.log(`  Copied: ${entry.name}`);
      } else if (entry.isDirectory) {
        await copyDir(srcPath, destPath);
      }
    }
  } catch (e) {
    if (!(e instanceof Deno.errors.NotFound)) {
      throw e;
    }
  }
}

async function copyDir(src: string, dest: string) {
  await ensureDir(dest);

  for await (const entry of Deno.readDir(src)) {
    const srcPath = `${src}/${entry.name}`;
    const destPath = `${dest}/${entry.name}`;

    if (entry.isFile) {
      await Deno.copyFile(srcPath, destPath);
    } else if (entry.isDirectory) {
      await copyDir(srcPath, destPath);
    }
  }
}

async function build() {
  console.log("Starting build...\n");

  await ensureDir(DIST_DIR);

  await buildStyles();
  await buildPages();
  await copyPublicFiles();

  console.log("\nBuild completed!");
}

build().catch((e) => {
  console.error("Build failed:", e);
  Deno.exit(1);
});
