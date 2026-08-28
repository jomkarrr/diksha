import { Badge } from "@/components/ui/Badge";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
};

export function PageHeader({ eyebrow, title, description, action }: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-start">
      <div>
        {eyebrow ? <Badge tone="primary">{eyebrow}</Badge> : null}
        <h1 className="mt-3 text-2xl font-bold leading-8 tracking-normal text-on-surface md:text-[32px] md:leading-10">{title}</h1>
        {description ? <p className="mt-2 max-w-3xl text-sm leading-6 text-on-surface-variant md:text-base">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
