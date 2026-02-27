import type { Snippet } from "../../domain/types.ts";

interface SnippetCardProps {
  snippet: Snippet;
}

export function SnippetCard({ snippet }: SnippetCardProps) {
  const { title, description, content, category } = snippet;
  return (
    <article
      class="snippet-card"
      data-snippet-content={content}
      role="button"
      tabIndex={0}
      aria-label={`${title} をクリップボードにコピー`}
    >
      <span class="snippet-card__category">#{category}</span>
      <div class="snippet-card__body">
        <h3 class="snippet-card__title">
          {title}
          <span class="snippet-card__copy-icon" aria-hidden="true">⧉</span>
        </h3>
        <p class="snippet-card__description">{description}</p>
        <pre class="snippet-card__content"><code>{content}</code></pre>
      </div>
    </article>
  );
}
