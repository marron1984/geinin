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

export function searchAll(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const results: {
    school: "osaka" | "tokyo";
    schoolName: string;
    cls: NscClass;
    matchedNames: string[];
  }[] = [];

  for (const schoolData of getAllData()) {
    for (const cls of schoolData.classes) {
      const matchedNames: string[] = [];

      // Match by class number
      if (q === String(cls.classNumber) || q === `${cls.classNumber}期`) {
        results.push({
          school: schoolData.school as "osaka" | "tokyo",
          schoolName: schoolData.schoolName,
          cls,
          matchedNames: [],
        });
        continue;
      }

      // Match by comedian name or member name
      for (const grad of cls.notableGraduates) {
        if (grad.name.toLowerCase().includes(q)) {
          matchedNames.push(grad.name);
        } else if (grad.members) {
          for (const member of grad.members) {
            if (member.toLowerCase().includes(q)) {
              matchedNames.push(grad.name);
              break;
            }
          }
        }
      }

      if (matchedNames.length > 0) {
        results.push({
          school: schoolData.school as "osaka" | "tokyo",
          schoolName: schoolData.schoolName,
          cls,
          matchedNames,
        });
      }
    }
  }

  return results;
}
