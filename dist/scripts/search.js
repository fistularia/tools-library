document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('search-input');
  const tabsContainer = document.querySelector('.tabs');
  const articlesContainer = document.querySelector('.articles-container');
  const categoryLabels = {
    spreadsheet: 'スプレッドシート',
    docs: 'ドキュメント',
    slides: 'スライド',
    gas: 'GAS',
    hack: 'hack',
    others: 'その他'
  };

  let searchData = [];
  let searchResultsContainer = null;

  // 検索結果コンテナを作成
  function createSearchResultsContainer() {
    searchResultsContainer = document.createElement('div');
    searchResultsContainer.className = 'search-results search-results--hidden';
    searchResultsContainer.innerHTML = '<div class="search-results__grid"></div>';
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

  // 検索を実行
  function performSearch(query) {
    const normalizedQuery = query.toLowerCase().trim();

    if (!normalizedQuery) {
      // 検索クエリが空の場合、元の表示に戻す
      searchResultsContainer.classList.add('search-results--hidden');
      tabsContainer.classList.remove('tabs--hidden');
      articlesContainer.classList.remove('articles-container--hidden');
      return;
    }

    // タブと通常のコンテナを非表示
    tabsContainer.classList.add('tabs--hidden');
    articlesContainer.classList.add('articles-container--hidden');
    searchResultsContainer.classList.remove('search-results--hidden');

    // フィルタリング
    const results = searchData.filter(function(item) {
      return item.searchText.toLowerCase().includes(normalizedQuery);
    });

    // 結果を表示
    const grid = searchResultsContainer.querySelector('.search-results__grid');
    if (results.length === 0) {
      grid.innerHTML = '<p class="search-results__empty">該当する記事が見つかりませんでした</p>';
    } else {
      grid.innerHTML = results.map(createArticleCardHTML).join('');
    }
  }

  // 検索データを取得
  fetch('/search-data.json')
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      searchData = data;
      createSearchResultsContainer();

      // 検索イベントをバインド
      searchInput.addEventListener('input', function() {
        performSearch(this.value);
      });
    })
    .catch(function(error) {
      console.error('Failed to load search data:', error);
    });
});
