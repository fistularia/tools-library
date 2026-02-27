document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('search-input');
  const tabsContainer = document.querySelector('.tabs');
  const articlesContainer = document.querySelector('.articles-container');
  const staticLinksSection = document.querySelector('.links-section');
  const categoryLabels = {
    spreadsheet: 'スプレッドシート',
    docs: 'ドキュメント',
    slides: 'スライド',
    gas: 'GAS',
    hack: 'hack',
    others: 'その他'
  };

  let searchData = [];
  let linksData = [];
  let snippetsData = [];
  let searchResultsContainer = null;
  const staticSnippetsSection = document.querySelector('.snippets-section');

  // 検索結果コンテナを作成
  function createSearchResultsContainer() {
    searchResultsContainer = document.createElement('div');
    searchResultsContainer.className = 'search-results search-results--hidden';
    searchResultsContainer.innerHTML =
      '<div class="search-results__grid"></div>' +
      '<div class="snippets-section snippets-section--search" style="display:none;">' +
        '<h2 class="snippets-section__title">スニペット</h2>' +
        '<div class="snippets-section__grid snippets-section__grid--search"></div>' +
      '</div>' +
      '<div class="links-section links-section--search" style="display:none;">' +
        '<h2 class="links-section__title">関連外部リンク</h2>' +
        '<div class="links-section__grid links-section__grid--search"></div>' +
      '</div>';
    articlesContainer.parentNode.insertBefore(searchResultsContainer, articlesContainer.nextSibling);
  }

  // ArticleCardのHTMLを生成
  function createArticleCardHTML(item) {
    const categoryClass = 'article-card__category--' + item.category;
    const categoryLabel = categoryLabels[item.category] || item.category;

    return '<article class="article-card">' +
      '<a href="/articles/' + item.slug + '.html" class="article-card__link">' +
        '<div class="article-card__content">' +
          '<span class="article-card__category ' + categoryClass + '">' + categoryLabel + '</span>' +
          '<img src="/img/' + item.slug + '.png" onerror="this.onerror=null;this.src=\'/img/default-' + item.category + '.png\'" alt="' + item.title + '" class="article-card__thumbnail"/>' +
          '<div class="article-card__text-content">' +
            '<h2 class="article-card__title">' + item.title + '</h2>' +
            '<p class="article-card__description">' + item.description + '</p>' +
          '</div>' +
        '</div>' +
      '</a>' +
    '</article>';
  }

  // SnippetCardのHTMLを生成
  function createSnippetCardHTML(item) {
    return '<article class="snippet-card" data-snippet-content="' + item.content.replace(/"/g, '&quot;') + '" role="button" tabindex="0" aria-label="' + item.title + ' をクリップボードにコピー">' +
      '<span class="snippet-card__category">#' + item.category + '</span>' +
      '<div class="snippet-card__body">' +
        '<h3 class="snippet-card__title">' + item.title + ' <span class="snippet-card__copy-icon" aria-hidden="true">⧉</span></h3>' +
        '<p class="snippet-card__description">' + item.description + '</p>' +
        '<pre class="snippet-card__content"><code>' + item.content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</code></pre>' +
      '</div>' +
    '</article>';
  }

  // LinkCardのHTMLを生成
  function createLinkCardHTML(item) {
    return '<article class="link-card">' +
      '<a href="' + item.url + '" class="link-card__link" target="_blank" rel="noopener noreferrer">' +
        '<span class="link-card__category">#' + item.category + '</span>' +
        '<div class="link-card__body">' +
          '<h3 class="link-card__title">' + item.title + ' <span class="link-card__external-icon" aria-hidden="true">↗</span></h3>' +
          '<p class="link-card__description">' + item.description + '</p>' +
        '</div>' +
      '</a>' +
    '</article>';
  }

  // 検索を実行
  function performSearch(query) {
    const normalizedQuery = query.toLowerCase().trim();

    if (!normalizedQuery) {
      // 検索クエリが空の場合、元の表示に戻す
      searchResultsContainer.classList.add('search-results--hidden');
      tabsContainer.classList.remove('tabs--hidden');
      articlesContainer.classList.remove('articles-container--hidden');
      if (staticSnippetsSection) staticSnippetsSection.style.display = '';
      if (staticLinksSection) staticLinksSection.style.display = '';
      return;
    }

    // タブと通常のコンテナを非表示
    tabsContainer.classList.add('tabs--hidden');
    articlesContainer.classList.add('articles-container--hidden');
    if (staticSnippetsSection) staticSnippetsSection.style.display = 'none';
    if (staticLinksSection) staticLinksSection.style.display = 'none';
    searchResultsContainer.classList.remove('search-results--hidden');

    // 記事フィルタリング
    const articleResults = searchData.filter(function(item) {
      return item.searchText.toLowerCase().includes(normalizedQuery);
    });

    // 記事結果を表示
    const grid = searchResultsContainer.querySelector('.search-results__grid');
    if (articleResults.length === 0) {
      grid.innerHTML = '<p class="search-results__empty">該当する記事が見つかりませんでした</p>';
    } else {
      grid.innerHTML = articleResults.map(createArticleCardHTML).join('');
    }

    // スニペットフィルタリング
    const snippetResults = snippetsData.filter(function(item) {
      return item.searchText.toLowerCase().includes(normalizedQuery);
    });

    // スニペット結果を表示
    const snippetsSection = searchResultsContainer.querySelector('.snippets-section--search');
    const snippetsGrid = searchResultsContainer.querySelector('.snippets-section__grid--search');
    if (snippetResults.length === 0) {
      snippetsSection.style.display = 'none';
    } else {
      snippetsSection.style.display = '';
      snippetsGrid.innerHTML = snippetResults.map(createSnippetCardHTML).join('');
    }

    // リンクフィルタリング
    const linkResults = linksData.filter(function(item) {
      return item.searchText.toLowerCase().includes(normalizedQuery);
    });

    // リンク結果を表示
    const linksSection = searchResultsContainer.querySelector('.links-section--search');
    const linksGrid = searchResultsContainer.querySelector('.links-section__grid--search');
    if (linkResults.length === 0) {
      linksSection.style.display = 'none';
    } else {
      linksSection.style.display = '';
      linksGrid.innerHTML = linkResults.map(createLinkCardHTML).join('');
    }
  }

  // 検索データを並列取得
  Promise.all([
    fetch('/search-data.json').then(function(r) { return r.json(); }),
    fetch('/links-data.json').then(function(r) { return r.json(); }),
    fetch('/snippets-data.json').then(function(r) { return r.json(); }),
  ]).then(function(results) {
    searchData = results[0];
    linksData = results[1];
    snippetsData = results[2];
    createSearchResultsContainer();

    // 検索イベントをバインド
    searchInput.addEventListener('input', function() {
      performSearch(this.value);
    });
  }).catch(function(error) {
    console.error('Failed to load search data:', error);
  });
});
