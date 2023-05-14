export default function shouldDisplayDefaultImage(
  url: string | Array<string>
): boolean {
  if (Array.isArray(url)) return url.length === 0 || !url[0] || url[0] === "_";
  return !url || url === "_";
}
