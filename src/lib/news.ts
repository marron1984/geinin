export interface NewsArticle {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  source: string;
}

/**
 * お笑いナタリーのRSSフィードからニュースを取得
 */
async function fetchNatalie(): Promise<NewsArticle[]> {
  try {
    const res = await fetch("https://natalie.mu/owarai/feed/news", {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const xml = await res.text();
    return parseRss(xml, "お笑いナタリー");
  } catch {
    return [];
  }
}

/**
 * Yahoo!ニュース お笑いカテゴリのRSSフィード
 */
async function fetchYahooOwarai(): Promise<NewsArticle[]> {
  try {
    const res = await fetch(
      "https://news.yahoo.co.jp/rss/topics/entertainment.xml",
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const xml = await res.text();
    return parseRss(xml, "Yahoo!ニュース");
  } catch {
    return [];
  }
}

function parseRss(xml: string, source: string): NewsArticle[] {
  const items: NewsArticle[] = [];
  const itemRegex = /<item[^>]*>([\s\S]*?)<\/item>/g;
  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const content = match[1];
    const title = extractTag(content, "title");
    const link = extractTag(content, "link");
    const pubDate = extractTag(content, "pubDate");
    const description = extractTag(content, "description");
    if (title && link) {
      items.push({
        title: decodeHtmlEntities(title),
        link,
        pubDate: pubDate || "",
        description: description
          ? decodeHtmlEntities(description).slice(0, 120)
          : "",
        source,
      });
    }
  }
  return items;
}

function extractTag(xml: string, tag: string): string {
  // Handle CDATA sections
  const cdataRegex = new RegExp(
    `<${tag}[^>]*>\\s*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>\\s*</${tag}>`
  );
  const cdataMatch = cdataRegex.exec(xml);
  if (cdataMatch) return cdataMatch[1].trim();

  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`);
  const match = regex.exec(xml);
  return match ? match[1].trim() : "";
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/<[^>]*>/g, "");
}

export async function getNews(): Promise<NewsArticle[]> {
  const [natalie, yahoo] = await Promise.all([
    fetchNatalie(),
    fetchYahooOwarai(),
  ]);

  const all = [...natalie, ...yahoo];

  // Sort by date descending
  all.sort((a, b) => {
    const da = a.pubDate ? new Date(a.pubDate).getTime() : 0;
    const db = b.pubDate ? new Date(b.pubDate).getTime() : 0;
    return db - da;
  });

  return all.slice(0, 30);
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const hours = d.getHours().toString().padStart(2, "0");
    const minutes = d.getMinutes().toString().padStart(2, "0");
    return `${month}/${day} ${hours}:${minutes}`;
  } catch {
    return "";
  }
}
