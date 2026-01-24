import { Layout } from "../Layout.tsx";
import { ArticleCard } from "../../components/ArticleCard.tsx";
import type { Article } from "../../../domain/types.ts";

interface TopPageProps {
  articles: Article[];
}

export function TopPage({ articles }: TopPageProps) {
  return (
    <Layout title="ホーム">
      <div class="top-page">
        <section class="hero">
          <h1 class="hero__title">業務に役立つファイル集</h1>
          {/* <p class="hero__description">
            Googleスプレッドシートなど、効率的に業務を行うのに役立つツールを紹介します
          </p> */}
        </section>

        <section class="articles">
          {/* <h2 class="articles__heading">テンプレート一覧</h2> */}
          <div class="articles__grid">
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}
