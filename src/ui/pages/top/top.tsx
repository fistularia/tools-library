import { Layout } from "../Layout.tsx";
import { ArticleCard } from "../../components/ArticleCard.tsx";
import { LinkCard } from "../../components/LinkCard.tsx";
import { SnippetCard } from "../../components/SnippetCard.tsx";
import type {
  Article,
  ArticleFrontmatter,
  Link,
  Snippet,
} from "../../../domain/types.ts";
import { categoryLabels } from "../../../domain/types.ts";

interface TopPageProps {
  baseUrl: string;
  articles: Article[];
  links: Link[];
  snippets: Snippet[];
}

type Category = ArticleFrontmatter["category"];

const tabCategories: Category[] = [
  "spreadsheet",
  // "docs",
  "slides",
  "gas",
  "hack",
];

const categoryIcons: Record<Category, string> = {
  spreadsheet: "img/spreadsheet.svg",
  docs: "img/docs.svg",
  slides: "img/slides.svg",
  gas: "img/gas.svg",
  hack: "img/hack.svg",
};

export function TopPage({ baseUrl, articles, links, snippets }: TopPageProps) {
  const articlesByCategory = (category: Category) =>
    articles.filter((article) => article.frontmatter.category === category);

  return (
    <Layout title="トップページ" baseUrl={baseUrl}>
      <div class="top-page">
        <section class="hero">
          <h1 class="hero__title">🧪 業務効率化ツール</h1>
        </section>

        <div class="search-box">
          <input
            type="text"
            class="search-box__input"
            placeholder="検索..."
            id="search-input"
          />
        </div>

        <div class="tabs-wrapper">
          <div class="tabs">
            {tabCategories.map((category, index) => (
              <button
                type="button"
                key={category}
                class={`tabs__button tabs__button--${category}${
                  index === 0 ? " tabs__button--active" : ""
                }`}
                data-category={category}
              >
                <span
                  class="tabs__icon"
                  style={`--icon-url: url(${baseUrl}${
                    categoryIcons[category]
                  })`}
                />
                {categoryLabels[category]}
              </button>
            ))}
          </div>
        </div>

        <div class="articles-container">
          {tabCategories.map((category) => {
            const categoryArticles = articlesByCategory(category);
            if (categoryArticles.length === 0) return null;
            return (
              <section
                key={category}
                class={`tab-panel${
                  category !== "spreadsheet" ? " tab-panel--hidden" : ""
                }`}
                data-category={category}
              >
                <div class="articles__grid">
                  {categoryArticles.map((article) => (
                    <ArticleCard
                      key={article.slug}
                      baseUrl={baseUrl}
                      article={article}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        {snippets.length > 0 && (
          <section class="snippets-section">
            <h2 class="snippets-section__title">🧩 スニペット
              <span>
              カードをクリックでコピー
              </span>
              </h2>
            <div class="snippets-section__grid">
              {snippets.map((snippet, i) => (
                <SnippetCard key={i} snippet={snippet} />
              ))}
            </div>
          </section>
        )}

        {links.length > 0 && (
          <section class="links-section">
            <h2 class="links-section__title">🔗 関連外部リンク</h2>
            <div class="links-section__grid">
              {links.map((link, i) => <LinkCard key={i} link={link} />)}
            </div>
          </section>
        )}
      </div>
      <script src={`${baseUrl}scripts/snippets.js`} />
      <script src={`${baseUrl}scripts/tabs.js`} />
      <script src={`${baseUrl}scripts/search.js`} />
    </Layout>
  );
}
