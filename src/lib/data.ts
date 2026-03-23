import osakaData from "@/data/osaka.json";
import tokyoData from "@/data/tokyo.json";
import { SchoolData, NscClass } from "./types";

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
