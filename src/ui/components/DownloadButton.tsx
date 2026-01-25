interface DownloadButtonProps {
  url: string;
  category: string;
}

export function DownloadButton({ url, category }: DownloadButtonProps) {
  const buttonText = getButtonText(category);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      class="download-button"
    >
      {buttonText}
    </a>
  );
}

export function getButtonText(category: string): string {
  switch (category) {
    case "spreadsheet":
      return "スプレッドシートをコピー";
    case "docs":
      return "ドキュメントをコピー";
    case "slides":
      return "スライドをコピー";
    default:
      return "ファイルをコピー";
  }
}
