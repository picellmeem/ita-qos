export function CardSkeleton() {
  return (
    <div className="card animate-pulse">
      <div className="h-4 w-32 rounded bg-slate-100" />
      <div className="mt-3 space-y-2">
        <div className="h-3 w-full rounded bg-slate-100" />
        <div className="h-3 w-3/4 rounded bg-slate-100" />
      </div>
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="card animate-pulse">
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="h-4 w-20 rounded bg-slate-100" />
            <div className="h-4 flex-1 rounded bg-slate-100" />
            <div className="h-4 w-16 rounded bg-slate-100" />
            <div className="h-4 w-20 rounded bg-slate-100" />
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
          <div key={i} className="card animate-pulse">
            <div className="h-3 w-20 rounded bg-slate-100" />
            <div className="mt-3 h-8 w-12 rounded bg-slate-100" />
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
