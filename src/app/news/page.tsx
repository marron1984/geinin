"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getNewsArticles } from "@/lib/data";
import { useOshi } from "@/lib/useOshi";
import NewsCard from "@/components/NewsCard";
import NewsCategoryFilter from "@/components/NewsCategoryFilter";
import { FadeInUp } from "@/components/MotionWrapper";

export default function NewsPage() {
  const allArticles = getNewsArticles();
  const [category, setCategory] = useState("all");
  const { oshiList, loaded } = useOshi();

  const oshiNames = useMemo(() => new Set(oshiList.map((o) => o.name)), [oshiList]);

  const filtered = useMemo(() => {
    let result = category === "all" ? allArticles : allArticles.filter((a) => a.category === category);

    if (loaded && oshiNames.size > 0) {
      const oshi = result.filter((a) => a.comedians.some((c) => oshiNames.has(c)));
      const other = result.filter((a) => !a.comedians.some((c) => oshiNames.has(c)));
      return [...oshi, ...other];
    }

    return result;
  }, [allArticles, category, oshiNames, loaded]);

  const hasOshiNews = loaded && oshiNames.size > 0 && filtered.some((a) => a.comedians.some((c) => oshiNames.has(c)));

  return (
    <div className="space-y-6">
      <FadeInUp>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            超若手芸人ニュース
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            劇場イベント・ライブ情報を中心に、NSC出身の超若手芸人の最新情報をお届け
          </p>
        </div>
      </FadeInUp>

      <FadeInUp delay={0.1}>
        <NewsCategoryFilter active={category} onSelect={setCategory} />
      </FadeInUp>

      <AnimatePresence mode="wait">
        <motion.div
          key={category}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="space-y-4"
        >
          {filtered.length > 0 ? (
            filtered.map((article, i) => {
              const isOshi = oshiNames.size > 0 && article.comedians.some((c) => oshiNames.has(c));
              return (
                <div key={article.id} className="relative">
                  {isOshi && (
                    <div className="absolute -left-1 top-3 bottom-3 w-0.5 bg-yoshimoto-red rounded-full" />
                  )}
                  {isOshi && i === 0 && (
                    <p className="text-xs text-yoshimoto-red font-medium mb-1.5 pl-1">❤️ 推しのニュース</p>
                  )}
                  {!isOshi && hasOshiNews && i > 0 && filtered[i - 1]?.comedians.some((c) => oshiNames.has(c)) && (
                    <p className="text-xs text-gray-400 font-medium mb-1.5 mt-2">その他のニュース</p>
                  )}
                  <NewsCard article={article} index={i} />
                </div>
              );
            })
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 text-gray-400"
            >
              <p className="text-lg">このカテゴリのニュースはまだありません</p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-xs text-gray-400 text-center pt-4"
      >
        ※ ニュースはサンプルデータです。実際の情報と異なる場合があります。
      </motion.p>
    </div>
  );
}
