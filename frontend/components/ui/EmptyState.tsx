import { Icon } from "./Icon";

type EmptyStateProps = {
  icon: string;
  title: string;
  description: string;
};

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="card grid min-h-[220px] place-items-center p-8 text-center">
      <div>
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-lg bg-surface-container text-primary">
          <Icon name={icon} />
        </div>
        <h3 className="mt-4 text-xl font-semibold">{title}</h3>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-on-surface-variant">{description}</p>
      </div>
    </div>
  );
}
