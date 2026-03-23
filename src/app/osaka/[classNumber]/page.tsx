import { getOsakaData, getClassByNumber } from "@/lib/data";
import ComedianTag from "@/components/ComedianTag";
import ComedianNotes from "@/components/ComedianNotes";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { FadeInUp, FadeIn, SlideInLeft, TapButton } from "@/components/MotionWrapper";

export function generateStaticParams() {
  const data = getOsakaData();
  return data.classes.map((cls) => ({
    classNumber: String(cls.classNumber),
  }));
}

export function generateMetadata({
  params,
}: {
  params: { classNumber: string };
}): Metadata {
  return {
    title: `NSC大阪校 ${params.classNumber}期`,
    description: `NSC大阪校 第${params.classNumber}期の卒業生一覧`,
  };
}

export default function OsakaClassPage({
  params,
}: {
  params: { classNumber: string };
}) {
  const classNumber = parseInt(params.classNumber);
  const cls = getClassByNumber("osaka", classNumber);

  if (!cls) return notFound();

  const data = getOsakaData();
  const maxClass = data.classes.length;

  return (
    <div className="space-y-6">
      <SlideInLeft>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link href="/osaka" className="hover:text-yoshimoto-red">
            大阪校
          </Link>
          <span>/</span>
          <span>{classNumber}期</span>
        </div>
      </SlideInLeft>

      <FadeInUp delay={0.1}>
        <div>
          <h1 className="text-3xl font-bold text-yoshimoto-red">
            第{classNumber}期
          </h1>
          <p className="text-gray-500 mt-1">
            NSC大阪校 ・ {cls.enrollmentYear}年入学
          </p>
        </div>
      </FadeInUp>

      {cls.notableGraduates.length > 0 ? (
        <div className="space-y-6">
          {cls.notableGraduates.map((grad, i) => (
            <FadeInUp key={i} delay={0.15 + i * 0.05}>
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5 space-y-4">
                <div className="flex items-start gap-3">
                  <ComedianTag comedian={grad} index={i} />
                </div>
                <ComedianNotes
                  comedianName={grad.name}
                  school="osaka"
                  classNumber={classNumber}
                />
              </div>
            </FadeInUp>
          ))}
        </div>
      ) : (
        <FadeInUp delay={0.2}>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 text-gray-400">
            主な卒業生のデータはまだありません
          </div>
        </FadeInUp>
      )}

      <FadeIn delay={0.35}>
        <div className="flex justify-between pt-4">
          {classNumber > 1 ? (
            <TapButton>
              <Link
                href={`/osaka/${classNumber - 1}`}
                className="inline-flex items-center gap-1 text-yoshimoto-red hover:underline px-3 py-2 -mx-3 rounded-lg active:bg-red-50"
              >
                ← {classNumber - 1}期
              </Link>
            </TapButton>
          ) : (
            <div />
          )}
          {classNumber < maxClass ? (
            <TapButton>
              <Link
                href={`/osaka/${classNumber + 1}`}
                className="inline-flex items-center gap-1 text-yoshimoto-red hover:underline px-3 py-2 -mx-3 rounded-lg active:bg-red-50"
              >
                {classNumber + 1}期 →
              </Link>
            </TapButton>
          ) : (
            <div />
          )}
        </div>
      </FadeIn>
    </div>
  );
}
