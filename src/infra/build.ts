import { render } from "preact-render-to-string";
import * as sass from "npm:sass@1.69.7";
import { getArticles } from "./content.ts";
import { TopPage } from "../ui/pages/top/top.tsx";
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

async function buildPages() {
  console.log("Building pages...");

  const articles = await getArticles();

  // Build top page
  const topPageHtml = "<!DOCTYPE html>" + render(TopPage({ articles }));
  await Deno.writeTextFile(`${DIST_DIR}/index.html`, topPageHtml);
  console.log("  Created: dist/index.html");

  // Build article pages
  await ensureDir(`${DIST_DIR}/articles`);

  for (const article of articles) {
    const articleHtml =
      "<!DOCTYPE html>" + render(ArticlePage({ article }));
    await Deno.writeTextFile(
      `${DIST_DIR}/articles/${article.slug}.html`,
      articleHtml
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
