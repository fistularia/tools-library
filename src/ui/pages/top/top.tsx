import { Layout } from "../Layout.tsx";
import { ArticleCard } from "../../components/ArticleCard.tsx";
import type { Article, ArticleFrontmatter } from "../../../domain/types.ts";
import { categoryLabels } from "../../../domain/types.ts";

interface TopPageProps {
  baseUrl: string;
  articles: Article[];
}

type Category = ArticleFrontmatter["category"];

const tabCategories: Category[] = ["spreadsheet", "gas"];

export function TopPage({ baseUrl, articles }: TopPageProps) {
  const articlesByCategory = (category: Category) =>
    articles.filter((article) => article.frontmatter.category === category);

  return (
    <Layout title="Home" baseUrl={baseUrl}>
      <div class="top-page">
        <section class="hero">
          <h1 class="hero__title">📒 業務効率化ツール</h1>
        </section>

        <div class="search-box">
          <input
            type="text"
            class="search-box__input"
            placeholder="検索..."
            id="search-input"
          />
        </div>

        <div class="tabs">
          {tabCategories.map((category, index) => (
            <button
              key={category}
              class={`tabs__button tabs__button--${category}${index === 0 ? " tabs__button--active" : ""}`}
              data-category={category}
            >
              {categoryLabels[category]}
            </button>
          ))}
          <button
            class="tabs__button"
            data-category="all"
          >
            すべて
          </button>
        </div>

        <div class="articles-container">
          {tabCategories.map((category) => {
            const categoryArticles = articlesByCategory(category);
            if (categoryArticles.length === 0) return null;
            return (
              <section
                key={category}
                class={`tab-panel${category !== "spreadsheet" ? " tab-panel--hidden" : ""}`}
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
      </div>
      <script src={`${baseUrl}scripts/tabs.js`} />
      <script src={`${baseUrl}scripts/search.js`} />
    </Layout>
  );
}
