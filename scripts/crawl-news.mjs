// NSC芸人ニュースクローラー
// RSSフィードを取得し、データベース内の芸人名とマッチした記事を news.json に保存する。
// GitHub Actions の cron から定期実行される（ローカル実行時は HTTPS_PROXY があれば curl 経由で取得）。
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const NEWS_PATH = join(root, "src/data/news.json");
const MAX_ITEMS = 50;

const SOURCES = [
  { name: "お笑いナタリー", url: "https://natalie.mu/owarai/feed/news" },
  { name: "FANY Magazine", url: "https://magazine.fany.lol/feed/" },
];

function fetchText(url) {
  // Node の fetch は HTTPS_PROXY を見ないため、プロキシ環境では curl で取得する
  if (process.env.HTTPS_PROXY) {
    return execFileSync("curl", ["-sSL", "--max-time", "30", url], {
      encoding: "utf8",
      maxBuffer: 10 * 1024 * 1024,
    });
  }
  return fetch(url, { signal: AbortSignal.timeout(30000) }).then((r) => {
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.text();
  });
}

function decodeEntities(s) {
  return s
    .replace(/<!\[CDATA\[(.*?)\]\]>/gs, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .trim();
}

function parseFeed(xml, sourceName) {
  const items = [];
  for (const m of xml.matchAll(/<item[\s>][\s\S]*?<\/item>/g)) {
    const block = m[0];
    const title = decodeEntities(block.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? "");
    const link = decodeEntities(
      block.match(/<link>([\s\S]*?)<\/link>/)?.[1] ??
        block.match(/<link[^>]*href="([^"]+)"/)?.[1] ??
        ""
    );
    const date =
      block.match(/<dc:date>([\s\S]*?)<\/dc:date>/)?.[1] ??
      block.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] ??
      "";
    if (!title || !link) continue;
    const iso = new Date(date.trim());
    items.push({
      title,
      url: link,
      date: isNaN(iso) ? new Date().toISOString() : iso.toISOString(),
      source: sourceName,
    });
  }
  return items;
}

function loadComedianNames() {
  const names = new Set();
  for (const file of ["src/data/osaka.json", "src/data/tokyo.json"]) {
    const data = JSON.parse(readFileSync(join(root, file), "utf8"));
    for (const cls of data.classes) {
      for (const g of cls.notableGraduates) {
        // 括弧書きの補足を除いた本体名
        const base = g.name.replace(/[（(].*?[）)]/g, "").trim();
        if (base.length >= 3) names.add(base);
        for (const member of g.members ?? []) {
          if (member.length >= 3) names.add(member);
        }
      }
    }
  }
  return [...names];
}

async function main() {
  const names = loadComedianNames();
  console.log(`comedian names loaded: ${names.length}`);

  const fetched = [];
  for (const src of SOURCES) {
    try {
      const xml = await fetchText(src.url);
      const items = parseFeed(xml, src.name);
      console.log(`${src.name}: ${items.length} items`);
      fetched.push(...items);
    } catch (e) {
      console.warn(`${src.name}: fetch failed (${e.message}) — skipped`);
    }
  }

  // 芸人名マッチ or NSC/吉本 キーワードで絞り込み
  const relevant = fetched
    .map((item) => {
      const matched = names.filter((n) => item.title.includes(n));
      return { ...item, matched };
    })
    .filter((item) => item.matched.length > 0 || /NSC|吉本/.test(item.title));

  console.log(`relevant items: ${relevant.length} / ${fetched.length}`);

  // 既存データとマージ（URL重複排除・新しい順・上限件数）
  const existing = existsSync(NEWS_PATH)
    ? JSON.parse(readFileSync(NEWS_PATH, "utf8"))
    : [];
  const byUrl = new Map();
  for (const item of [...relevant, ...existing]) {
    if (!byUrl.has(item.url)) byUrl.set(item.url, item);
  }
  const merged = [...byUrl.values()]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, MAX_ITEMS);

  const next = JSON.stringify(merged, null, 2) + "\n";
  const prev = existsSync(NEWS_PATH) ? readFileSync(NEWS_PATH, "utf8") : "";
  if (next === prev) {
    console.log("no changes");
    return;
  }
  writeFileSync(NEWS_PATH, next);
  console.log(`news.json updated: ${merged.length} items`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
