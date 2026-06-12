export default function Loading() {
  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="h-14 bg-card/50 backdrop-blur rounded-xl border border-border animate-pulse" />
      <div className="bg-card/50 backdrop-blur rounded-xl border border-border p-5 space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="space-y-1.5">
            <div className="h-3 w-24 bg-muted rounded animate-pulse" />
            <div className="h-9 bg-muted rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  )
}
