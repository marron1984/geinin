import { NscClass, SchoolData } from "./types";

export interface SearchResult {
  school: "osaka" | "tokyo";
  schoolName: string;
  cls: NscClass;
  matchedNames: string[];
}

export function searchComedians(
  query: string,
  allData: SchoolData[]
): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const results: SearchResult[] = [];

  for (const schoolData of allData) {
    for (const cls of schoolData.classes) {
      const matchedNames: string[] = [];

      // Match by class number
      const numQuery = parseInt(q);
      if (!isNaN(numQuery) && cls.classNumber === numQuery) {
        results.push({
          school: schoolData.school as "osaka" | "tokyo",
          schoolName: schoolData.schoolName,
          cls,
          matchedNames: [],
        });
        continue;
      }

      if (q === `${cls.classNumber}期`) {
        results.push({
          school: schoolData.school as "osaka" | "tokyo",
          schoolName: schoolData.schoolName,
          cls,
          matchedNames: [],
        });
        continue;
      }

      // Match by year
      if (q === `${cls.enrollmentYear}年` || q === String(cls.enrollmentYear)) {
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
              matchedNames.push(`${grad.name}（${member}）`);
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
