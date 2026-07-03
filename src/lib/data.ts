import osakaData from "@/data/osaka.json";
import tokyoData from "@/data/tokyo.json";
import awardsData from "@/data/awards.json";
import newsData from "@/data/news.json";
import { SchoolData, NscClass, Award, TimelineEntry, NewsItem } from "./types";

export function getNews(): NewsItem[] {
  return newsData as NewsItem[];
}

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

export function getAwards(): Award[] {
  return awardsData as Award[];
}

export function getTimeline(): TimelineEntry[] {
  const osaka = getOsakaData();
  const tokyo = getTokyoData();
  const awards = getAwards();

  const yearMap = new Map<number, TimelineEntry>();

  for (const cls of osaka.classes) {
    const entry = yearMap.get(cls.enrollmentYear) || {
      year: cls.enrollmentYear,
      awards: [],
    };
    entry.osakaClass = cls;
    yearMap.set(cls.enrollmentYear, entry);
  }

  for (const cls of tokyo.classes) {
    const entry = yearMap.get(cls.enrollmentYear) || {
      year: cls.enrollmentYear,
      awards: [],
    };
    entry.tokyoClass = cls;
    yearMap.set(cls.enrollmentYear, entry);
  }

  for (const award of awards) {
    const entry = yearMap.get(award.year);
    if (entry) {
      entry.awards.push(award);
    }
  }

  return Array.from(yearMap.values()).sort((a, b) => a.year - b.year);
}
