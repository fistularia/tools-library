import type { ComponentChildren } from "preact";

interface LayoutProps {
  title: string;
  baseUrl: string;
  children: ComponentChildren;
}

export function Layout({ title, baseUrl, children }: LayoutProps) {
  return (
    <html lang="ja">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title} | tools library</title>
        <link rel="stylesheet" href={`${baseUrl}styles/main.css`} />
      </head>
      <body>
        <Header baseUrl={baseUrl} />
        <main class="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

function Header({ baseUrl }: { baseUrl: string }) {
  return (
    <header class="header">
      <div class="header__inner">
        <a href="/" class="header__logo">
        </a>
        <nav class="header__nav">
          <a href={`${baseUrl}`}>Home</a>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer class="footer">
      <div class="footer__inner">
        <p class="footer__copyright">&copy; 2026 tools library</p>
      </div>
    </footer>
  );
}
