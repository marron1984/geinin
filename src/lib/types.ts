export interface Comedian {
  name: string;
  members?: string[];
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
