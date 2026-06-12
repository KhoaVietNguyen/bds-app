export default function Loading() {
  return (
    <div className="space-y-3 max-w-full">
      {/* Search bar skeleton */}
      <div className="bg-card/50 backdrop-blur rounded-xl border border-border p-3 space-y-3">
        <div className="h-7 w-48 bg-muted rounded animate-pulse mx-auto" />
        <div className="h-9 bg-muted rounded animate-pulse" />
        <div className="hidden md:flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-9 flex-1 bg-muted rounded animate-pulse" />
          ))}
        </div>
      </div>
      {/* Rows skeleton */}
      <div className="bg-card/50 backdrop-blur rounded-xl border border-border divide-y divide-border overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="p-3 flex gap-3 items-center">
            <div className="w-24 h-16 bg-muted rounded-lg animate-pulse shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-20 bg-muted rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
              <div className="h-3 w-1/2 bg-muted rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
