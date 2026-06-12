export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="h-14 bg-card border-b border-border" />
      <div className="max-w-3xl mx-auto px-4 py-5 space-y-5">
        {/* Gallery skeleton */}
        <div className="aspect-[4/3] sm:aspect-[16/10] bg-muted rounded-2xl animate-pulse" />
        {/* Info card skeleton */}
        <div className="bg-card rounded-2xl p-5 space-y-3 border border-border">
          <div className="h-3 w-32 bg-muted rounded animate-pulse" />
          <div className="flex gap-2">
            <div className="h-6 w-16 bg-muted rounded animate-pulse" />
            <div className="h-6 w-24 bg-muted rounded animate-pulse" />
          </div>
          <div className="h-8 w-40 bg-muted rounded animate-pulse" />
          <div className="h-5 w-3/4 bg-muted rounded animate-pulse" />
          <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
          <div className="space-y-2 pt-2">
            <div className="h-3 bg-muted rounded animate-pulse" />
            <div className="h-3 bg-muted rounded animate-pulse w-5/6" />
            <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
          </div>
        </div>
      </div>
    </div>
  )
}
