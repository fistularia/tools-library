/**
 * <head> 内に挿入する外部タグ（GA等）をまとめるコンポーネント。
 * 新しいタグを追加する場合はここに追記してください。
 */
export function HeadTags() {
  return (
    <>
      {/* Google tag (gtag.js) */}
      <script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-FFDCZRFXQR"
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-FFDCZRFXQR');`,
        }}
      />
    </>
  );
}
