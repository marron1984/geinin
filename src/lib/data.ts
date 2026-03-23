import osakaData from "@/data/osaka.json";
import tokyoData from "@/data/tokyo.json";
import newsData from "@/data/news.json";
import { SchoolData, NscClass, NewsArticle } from "./types";

export function getOsakaData(): SchoolData {
  return osakaData as SchoolData;
}

export function getTokyoData(): SchoolData {
  return tokyoData as SchoolData;
}

export function getAllData(): SchoolData[] {
  return [getOsakaData(), getTokyoData()];
}

export function getClassByNumber(
  school: "osaka" | "tokyo",
  classNumber: number
): NscClass | undefined {
  const data = school === "osaka" ? getOsakaData() : getTokyoData();
  return data.classes.find((c) => c.classNumber === classNumber);
}

export interface ComedianEntry {
  name: string;
  school: "osaka" | "tokyo";
  classNumber: number;
  members?: string[];
}

export function getAllComedians(): ComedianEntry[] {
  const results: ComedianEntry[] = [];
  for (const data of getAllData()) {
    for (const cls of data.classes) {
      for (const grad of cls.notableGraduates) {
        results.push({
          name: grad.name,
          school: data.school,
          classNumber: cls.classNumber,
          members: grad.members,
        });
      }
    }
  }
  return results;
}

export function getNewsArticles(): NewsArticle[] {
  return (newsData as NewsArticle[]).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getNewsArticleById(id: string): NewsArticle | undefined {
  return (newsData as NewsArticle[]).find((n) => n.id === id);
}
