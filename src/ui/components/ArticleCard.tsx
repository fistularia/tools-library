import type { Article } from "../../domain/types.ts";
import { categoryLabels } from "../../domain/types.ts";

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const { slug, frontmatter } = article;
  const { title, description, category } = frontmatter;

  return (
    <article class="article-card">
      <a href={`/articles/${slug}.html`} class="article-card__link">
        <div class="article-card__content">
          <span class={`article-card__category article-card__category--${category}`}>
            {categoryLabels[category]}
          </span>
          <h2 class="article-card__title">{title}</h2>
          <p class="article-card__description">{description}</p>
        </div>
      </a>
    </article>
  );
}
