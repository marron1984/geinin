export interface Comedian {
  name: string;
  members?: string[];
  profileUrl?: string;
  note?: string;
}

export interface NscClass {
  classNumber: number;
  school: "osaka" | "tokyo";
  enrollmentYear: number;
  classNote?: string;
  notableGraduates: Comedian[];
}

export interface SchoolData {
  school: "osaka" | "tokyo";
  schoolName: string;
  startYear: number;
  classes: NscClass[];
}

export interface Award {
  contest: string;
  year: number;
  result: "優勝" | "準優勝";
  name: string;
}

export interface TimelineEntry {
  year: number;
  osakaClass?: NscClass;
  tokyoClass?: NscClass;
  awards: Award[];
}

export interface NewsItem {
  title: string;
  url: string;
  date: string;
  source: string;
  matched: string[];
}
