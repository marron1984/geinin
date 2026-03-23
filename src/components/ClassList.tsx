"use client";

import { NscClass } from "@/lib/types";
import ClassCard from "./ClassCard";
import { StaggerContainer, StaggerItem } from "./MotionWrapper";

interface ClassListProps {
  classes: NscClass[];
}

export default function ClassList({ classes }: ClassListProps) {
  return (
    <StaggerContainer className="grid gap-4">
      {classes.map((cls) => (
        <StaggerItem key={cls.classNumber}>
          <ClassCard cls={cls} />
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
}
