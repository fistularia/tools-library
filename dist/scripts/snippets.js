document.addEventListener("click", function (e) {
  const card = e.target.closest(".snippet-card");
  if (!card) return;
  const content = card.dataset.snippetContent;
  if (!content) return;
  card.classList.add("snippet-card--copied");
  setTimeout(function () {
    card.classList.remove("snippet-card--copied");
  }, 1500);
  navigator.clipboard.writeText(content);
});

document.addEventListener("keydown", function (e) {
  if (e.key !== "Enter" && e.key !== " ") return;
  const card = e.target.closest(".snippet-card");
  if (!card) return;
  e.preventDefault();
  card.click();
});
