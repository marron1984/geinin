/**
 * ニュースクローラー
 *
 * 吉本興業関連のニュースソースからNSC芸人に関する情報を収集し、
 * src/data/news.json に追加するスクリプト。
 *
 * 使い方:
 *   npx tsx scripts/crawl-news.ts
 *
 * 1日4回実行を想定（cron例: 0 6,12,18,0 * * *）
 *
 * 対応ソース:
 *   1. 吉本興業公式サイト（イベント・ライブ情報）
 *   2. FANYチケット（劇場公演情報）
 *   3. お笑いナタリー（ニュース記事）
 *
 * 注意: 実際のクロールには各サイトの利用規約を確認してください。
 *       このスクリプトはテンプレートとして、RSSフィードやAPIがある場合は
 *       そちらを優先的に使用してください。
 */

import * as fs from "fs";
import * as path from "path";
import * as https from "https";

// --- 型定義 ---
interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  body: string;
  date: string;
  category: "theater" | "live" | "tv" | "award" | "debut" | "other";
  comedians: string[];
  school?: "osaka" | "tokyo";
  classNumber?: number;
  imageEmoji?: string;
  venue?: string;
  eventDate?: string;
}

// --- 設定 ---
const NEWS_JSON_PATH = path.resolve(__dirname, "../src/data/news.json");
const MAX_NEWS_ITEMS = 100; // 保持する最大ニュース件数

// --- ユーティリティ ---
function loadExistingNews(): NewsArticle[] {
  try {
    const raw = fs.readFileSync(NEWS_JSON_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveNews(articles: NewsArticle[]) {
  const sorted = articles.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const trimmed = sorted.slice(0, MAX_NEWS_ITEMS);
  fs.writeFileSync(NEWS_JSON_PATH, JSON.stringify(trimmed, null, 2) + "\n", "utf-8");
  return trimmed;
}

function generateId(title: string, date: string): string {
  const slug = title
    .replace(/[^\w\u3000-\u9FFF]/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 40);
  return `${date}-${slug}`;
}

function fetchUrl(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { "User-Agent": "NSC-News-Crawler/1.0" } }, (res) => {
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchUrl(res.headers.location).then(resolve).catch(reject);
      }
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve(data));
      res.on("error", reject);
    }).on("error", reject);
  });
}

// --- クローラー本体 ---
// 以下はテンプレート実装です。実際の運用時は各ソースのHTML/RSS構造に合わせて調整してください。

interface CrawlSource {
  name: string;
  crawl: () => Promise<NewsArticle[]>;
}

// ソース1: お笑いナタリー（RSSフィードベース）
const natalieCrawler: CrawlSource = {
  name: "お笑いナタリー",
  async crawl() {
    // RSSフィード or スクレイピング
    // 実際のURL: https://natalie.mu/owarai/feed
    // ここではテンプレートとして空配列を返す
    console.log("  [natalie] フィード取得中...");
    try {
      // const rss = await fetchUrl("https://natalie.mu/owarai/feed");
      // RSSパース → NSC関連記事をフィルタ → NewsArticle[] に変換
      return [];
    } catch (e) {
      console.log("  [natalie] 取得失敗:", e);
      return [];
    }
  },
};

// ソース2: FANYチケット（劇場公演情報）
const fanyCrawler: CrawlSource = {
  name: "FANYチケット",
  async crawl() {
    console.log("  [fany] 公演情報取得中...");
    try {
      // const html = await fetchUrl("https://yoshimoto.funity.jp/");
      // HTMLパース → 若手芸人のライブ情報を抽出
      return [];
    } catch (e) {
      console.log("  [fany] 取得失敗:", e);
      return [];
    }
  },
};

// ソース3: 吉本興業公式
const yoshimotoCrawler: CrawlSource = {
  name: "吉本興業公式",
  async crawl() {
    console.log("  [yoshimoto] ニュース取得中...");
    try {
      // const html = await fetchUrl("https://www.yoshimoto.co.jp/news/");
      // HTMLパース → NSC関連ニュースを抽出
      return [];
    } catch (e) {
      console.log("  [yoshimoto] 取得失敗:", e);
      return [];
    }
  },
};

const sources: CrawlSource[] = [natalieCrawler, fanyCrawler, yoshimotoCrawler];

// --- メイン ---
async function main() {
  console.log(`=== NSCニュースクローラー ===`);
  console.log(`実行時刻: ${new Date().toLocaleString("ja-JP")}`);
  console.log(`ニュースファイル: ${NEWS_JSON_PATH}`);
  console.log("");

  const existing = loadExistingNews();
  const existingIds = new Set(existing.map((a) => a.id));
  console.log(`既存ニュース: ${existing.length}件`);

  let newArticles: NewsArticle[] = [];

  for (const source of sources) {
    console.log(`\nクロール: ${source.name}`);
    try {
      const articles = await source.crawl();
      const fresh = articles.filter((a) => !existingIds.has(a.id));
      newArticles.push(...fresh);
      console.log(`  結果: ${articles.length}件取得, ${fresh.length}件が新規`);
    } catch (e) {
      console.log(`  エラー: ${e}`);
    }
  }

  if (newArticles.length > 0) {
    const merged = [...newArticles, ...existing];
    const saved = saveNews(merged);
    console.log(`\n✅ ${newArticles.length}件の新規ニュースを追加`);
    console.log(`保存済み: ${saved.length}件（最大${MAX_NEWS_ITEMS}件）`);
  } else {
    console.log("\n新規ニュースなし");
  }

  console.log("\n完了");
}

main().catch((e) => {
  console.error("クローラーエラー:", e);
  process.exit(1);
});
