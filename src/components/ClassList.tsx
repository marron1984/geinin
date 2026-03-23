import { NscClass } from "@/lib/types";
import ClassCard from "./ClassCard";

interface ClassListProps {
  classes: NscClass[];
}

export default function ClassList({ classes }: ClassListProps) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {classes.map((cls) => (
        <ClassCard key={cls.classNumber} cls={cls} />
      ))}
    </div>
  );
}
