import type { GapSeverity } from "@/lib/types/contracts";
import { severityClass } from "@/lib/mock/data";

type BadgeProps = {
  children: React.ReactNode;
  tone?: "primary" | "neutral" | "success" | "warning" | "danger";
  severity?: GapSeverity;
};

const toneClass = {
  primary: "border-[#F4511E]/20 bg-[#F4511E]/10 text-[#F4511E]",
  neutral: "border-slate-200 bg-slate-50 text-slate-600",
  success: "border-green-100 bg-green-50 text-green-700",
  warning: "border-yellow-100 bg-yellow-50 text-yellow-700",
  danger: "border-red-100 bg-red-50 text-red-700"
};

export function Badge({ children, tone = "neutral", severity }: BadgeProps) {
  return (
    <span
      className={`label inline-flex items-center rounded border px-2 py-1 ${
        severity ? severityClass(severity) : toneClass[tone]
      }`}
    >
      {children}
    </span>
  );
}
