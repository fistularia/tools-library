import { Layout } from "../Layout.tsx";
import { ArticleCard } from "../../components/ArticleCard.tsx";
import type { Article, ArticleFrontmatter } from "../../../domain/types.ts";
import { categoryLabels } from "../../../domain/types.ts";

interface TopPageProps {
  baseUrl: string;
  articles: Article[];
}

type Category = ArticleFrontmatter["category"];

const tabCategories: Category[] = ["spreadsheet", "gas", "others"];

export function TopPage({ baseUrl, articles }: TopPageProps) {
  const articlesByCategory = (category: Category) =>
    articles.filter((article) => article.frontmatter.category === category);

  const tabScript = `
    document.addEventListener('DOMContentLoaded', function() {
      const tabs = document.querySelectorAll('.tabs__button');
      const panels = document.querySelectorAll('.tab-panel');

      tabs.forEach(function(tab) {
        tab.addEventListener('click', function() {
          const category = this.dataset.category;

          tabs.forEach(function(t) { t.classList.remove('tabs__button--active'); });
          this.classList.add('tabs__button--active');

          panels.forEach(function(panel) {
            if (category === 'all' || panel.dataset.category === category) {
              panel.classList.remove('tab-panel--hidden');
            } else {
              panel.classList.add('tab-panel--hidden');
            }
          });
        }.bind(tab));
      });
    });
  `;

  return (
    <Layout title="Home" baseUrl={baseUrl}>
      <div class="top-page">
        <section class="hero">
          <h1 class="hero__title">📒 業務に役立つシートや関数です。</h1>
        </section>

        <div class="tabs">
          <button
            class="tabs__button tabs__button--active"
            data-category="all"
          >
            すべて
          </button>
          {tabCategories.map((category) => (
            <button
              key={category}
              class={`tabs__button tabs__button--${category}`}
              data-category={category}
            >
              {categoryLabels[category]}
            </button>
          ))}
        </div>

        <div class="articles-container">
          {tabCategories.map((category) => {
            const categoryArticles = articlesByCategory(category);
            if (categoryArticles.length === 0) return null;
            return (
              <section
                key={category}
                class="tab-panel"
                data-category={category}
              >
                <h2 class="articles__heading">{categoryLabels[category]}</h2>
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
      <script dangerouslySetInnerHTML={{ __html: tabScript }} />
    </Layout>
  );
}
