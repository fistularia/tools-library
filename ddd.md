## ディレクトリ構造のリファクタリング
DDDの考え方を取り入れるために、以下のように階層を整理したいです

src/
main.ts -- エントリーポイント
app/
domain/
ui/
  components/ --共通パーツ
    DownloadButton.tsx
    DownloadButton.scss -- tsxと同じ階層に同じファイル名で設置（コロケーション）
  pages/ --ページレイアウト
    Layout.tsx
    articles/
      article.tsx
      article.scss -- コンポーネントごとのscssをまとめる
    top/
      top.tsx
      top.scsss -- コンポーネントごとのscssをまとめる
  styles/ --共通のscss (reset, valiables)
infra/


---

utils/以下のファイル
build.ts
の内容も適切に上のディレクトリ構造に再配置してください。


