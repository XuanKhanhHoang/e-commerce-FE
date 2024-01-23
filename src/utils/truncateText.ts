export default function truncateText(content: string, length?: number) {
  length = length || 24;
  if (content.length < length + 1) return content;
  else return content.substring(0, length) + "...";
}
