import { Icon } from "./Icon";

type MetricCardProps = {
  label: string;
  value: string;
  detail: string;
  icon: string;
  tone?: "primary" | "danger" | "neutral";
};

export function MetricCard({ label, value, detail, icon, tone = "primary" }: MetricCardProps) {
  const iconClass =
    tone === "danger" ? "text-red-700 bg-red-50" : tone === "neutral" ? "text-tertiary bg-slate-50" : "text-primary bg-[#F4511E]/10";

  return (
    <section className="card p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="label text-on-surface-variant">{label}</p>
          <p className="mt-2 text-3xl font-bold text-on-surface">{value}</p>
          <p className="mt-1 text-sm leading-5 text-on-surface-variant">{detail}</p>
        </div>
        <div className={`grid h-10 w-10 place-items-center rounded-lg ${iconClass}`}>
          <Icon name={icon} />
        </div>
      </div>
    </section>
  );
}
