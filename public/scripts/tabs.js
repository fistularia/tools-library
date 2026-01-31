document.addEventListener('DOMContentLoaded', function() {
  const tabs = document.querySelectorAll('.tabs__button');
  const panels = document.querySelectorAll('.tab-panel');

  tabs.forEach(function(tab) {
    tab.addEventListener('click', function() {
      const category = this.dataset.category;

      tabs.forEach(function(t) { t.classList.remove('tabs__button--active'); });
      this.classList.add('tabs__button--active');

      panels.forEach(function(panel) {
        if (category === 'all' || panel.dataset.category === category) {
          panel.classList.remove('tab-panel--hidden');
        } else {
          panel.classList.add('tab-panel--hidden');
        }
      });
    });
  });
});
