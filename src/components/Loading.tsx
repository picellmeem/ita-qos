function ShimmerBar({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rounded bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 bg-[length:200%_100%] animate-shimmer ${className}`}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="card-static">
      <ShimmerBar className="h-4 w-32" />
      <div className="mt-4 space-y-2">
        <ShimmerBar className="h-3 w-full" />
        <ShimmerBar className="h-3 w-3/4" />
        <ShimmerBar className="h-3 w-5/6" />
      </div>
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="card-static">
      <div className="space-y-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <ShimmerBar className="h-4 w-20" />
            <ShimmerBar className="h-4 flex-1" />
            <ShimmerBar className="h-4 w-24" />
            <ShimmerBar className="h-4 w-16" />
            <ShimmerBar className="h-4 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card-static">
            <ShimmerBar className="h-3 w-20" />
            <ShimmerBar className="mt-3 h-8 w-12" />
          </div>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
      <TableSkeleton />
    </div>
  );
}
