import type { Article } from "../../domain/types.ts";
import { categoryLabels } from "../../domain/types.ts";

interface ArticleCardProps {
  baseUrl: string;
  article: Article;
}

export function ArticleCard({ baseUrl, article }: ArticleCardProps) {
  const { slug, frontmatter } = article;
  const { title, description, category } = frontmatter;

  return (
    <article class="article-card">
      <a href={`${baseUrl}articles/${slug}.html`} class="article-card__link">
        <div class="article-card__content">
          <span
            class={`article-card__category article-card__category--${category}`}
          >
            {categoryLabels[category]}
          </span>
          <img
            src={`${baseUrl}img/${slug}.png`}
            alt={title}
            class="article-card__thumbnail"
          />
          <div class="article-card__text-content">
            <h2 class="article-card__title">{title}</h2>
            <p class="article-card__description">{description}</p>
          </div>
        </div>
      </a>
    </article>
  );
}
