import { Layout } from "../Layout.tsx";
import { DownloadButton } from "../../components/DownloadButton.tsx";
import type { Article } from "../../../domain/types.ts";
import { categoryLabels } from "../../../domain/types.ts";

interface ArticlePageProps {
  baseUrl: string;
  article: Article;
}

export function ArticlePage({ baseUrl, article }: ArticlePageProps) {
  const { slug, frontmatter, content } = article;
  const { title, description, category, downloadUrl, date, tags } = frontmatter;

  return (
    <Layout title={title} baseUrl={baseUrl}>
      <article class="article-page">
        <header class="article-page__header">
          <span class={`article-page__category article-page__category--${category}`}>
            {categoryLabels[category]}
          </span>
          <h1 class="article-page__title">{title}</h1>
          <img src={`${baseUrl}img/${slug}.png`}
               alt={title} 
               class="article-page__thumbnail" />
          <p class="article-page__description">{description}</p>
          <div class="article-page__meta">
            <time class="article-page__date">{date}</time>
            <div class="article-page__tags">
              {tags.map((tag) => (
                <span key={tag} class="article-page__tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          
        </header>

        <div class="article-page__download">
          <DownloadButton url={downloadUrl} category={category} />
        </div>

        <div
          class="article-page__content"
          dangerouslySetInnerHTML={{ __html: content }}
        />

        <div class="article-page__footer">
          <a href={`${baseUrl}`} class="article-page__back">
            ← 一覧に戻る
          </a>
        </div>
      </article>
    </Layout>
  );
}
