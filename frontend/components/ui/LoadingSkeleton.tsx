"use client";

type LoadingSkeletonProps = {
  className?: string;
  count?: number;
};

export function LoadingSkeleton({ className = "h-20 w-full", count = 1 }: LoadingSkeletonProps) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`card animate-pulse rounded-lg bg-surface-container-high/60 ${className}`}
        />
      ))}
    </div>
  );
}

export function MetricCardSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="card p-4 animate-pulse">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2 flex-1">
              <div className="h-3 w-20 rounded bg-slate-200" />
              <div className="h-7 w-16 rounded bg-slate-300" />
              <div className="h-3 w-28 rounded bg-slate-200" />
            </div>
            <div className="h-10 w-10 rounded-lg bg-slate-200" />
          </div>
        </div>
      ))}
    </div>
  );
}
