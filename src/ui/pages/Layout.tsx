import type { ComponentChildren } from "preact";

interface LayoutProps {
  title: string;
  children: ComponentChildren;
}

export function Layout({ title, children }: LayoutProps) {
  return (
    <html lang="ja">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title} | 業務に役立つファイル集</title>
        <link rel="stylesheet" href="./styles/main.css" />
      </head>
      <body>
        <Header />
        <main class="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

function Header() {
  return (
    <header class="header">
      <div class="header__inner">
        <a href="/" class="header__logo">
        </a>
        <nav class="header__nav">
          <a href="/">Home</a>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer class="footer">
      <div class="footer__inner">
        <p class="footer__copyright">&copy; 2026 Tanaka's Tool Library</p>
      </div>
    </footer>
  );
}
