import type { CompetencyLevel, RequiredLevel } from "@/lib/types/contracts";
import { levelScore } from "@/lib/mock/data";

type LevelDotsProps = {
  current: CompetencyLevel;
  required?: RequiredLevel;
};

export function LevelDots({ current, required }: LevelDotsProps) {
  const currentScore = levelScore[current];
  const requiredScore = required ? levelScore[required] : undefined;

  return (
    <div className="flex items-center gap-2" aria-label={`Current level ${current}`}>
      {[1, 2, 3].map((step) => (
        <span
          key={step}
          className={`h-2.5 w-12 rounded-full border ${
            step <= currentScore ? "border-[#F4511E] bg-[#F4511E]" : "border-slate-200 bg-slate-100"
          } ${requiredScore === step ? "ring-2 ring-[#F4511E]/20" : ""}`}
        />
      ))}
    </div>
  );
}
