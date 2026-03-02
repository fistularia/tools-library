import type { Link } from "../../domain/types.ts";

interface LinkCardProps {
  link: Link;
}

export function LinkCard({ link }: LinkCardProps) {
  const { url, title, description, category } = link;

  return (
    <article class="link-card">
      <a
        href={url}
        class="link-card__link"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span class="link-card__category">
          #{category}
        </span>
        <div class="link-card__body">
          <h3 class="link-card__title">
            {title}
            <span class="link-card__external-icon" aria-hidden="true">↗</span>
          </h3>
          <p class="link-card__description">{description}</p>
        </div>
      </a>
    </article>
  );
}
