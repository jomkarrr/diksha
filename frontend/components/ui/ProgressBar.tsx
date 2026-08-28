type ProgressBarProps = {
  value: number;
  label?: React.ReactNode;
  shimmer?: boolean;
};

export function ProgressBar({ value, label, shimmer = false }: ProgressBarProps) {
  const width = Math.max(0, Math.min(100, value));

  return (
    <div>
      {label ? <div className="mb-2 flex justify-between text-sm text-on-surface-variant">{label}<span>{width}%</span></div> : null}
      <div className="h-2 overflow-hidden rounded-full bg-surface-container-high">
        <div className={`h-full rounded-full ${shimmer ? "shimmer" : "bg-[#F4511E]"}`} style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}
