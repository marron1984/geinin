export interface Comedian {
  name: string;
  members?: string[];
  profileUrl?: string;
}

export interface NscClass {
  classNumber: number;
  school: "osaka" | "tokyo";
  enrollmentYear: number;
  notableGraduates: Comedian[];
}

export interface SchoolData {
  school: "osaka" | "tokyo";
  schoolName: string;
  startYear: number;
  classes: NscClass[];
}

export interface NewsArticle {
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

export type NoteCategory = "family" | "neta" | "schedule" | "impression" | "other";

export interface ComedianNote {
  id: string;
  comedianName: string;
  school: "osaka" | "tokyo";
  classNumber: number;
  category: NoteCategory;
  content: string;
  createdAt: string;
  updatedAt: string;
}
