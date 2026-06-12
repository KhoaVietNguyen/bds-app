export default function Loading() {
  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Header */}
      <div className="h-12 bg-card/50 backdrop-blur rounded-xl border border-border animate-pulse" />

      <div className="bg-card/50 backdrop-blur rounded-xl border border-border p-5 space-y-5">
        {/* Section title */}
        <div className="h-4 w-48 bg-muted rounded animate-pulse" />

        {/* Avatar + hint */}
        <div className="flex items-center gap-4">
          <div className="h-24 w-24 rounded-full bg-muted animate-pulse shrink-0" />
          <div className="space-y-2">
            <div className="h-3.5 w-28 bg-muted rounded animate-pulse" />
            <div className="h-3 w-40 bg-muted rounded animate-pulse" />
          </div>
        </div>

        {/* Tên */}
        <div className="space-y-1.5">
          <div className="h-3 w-24 bg-muted rounded animate-pulse" />
          <div className="h-9 bg-muted rounded animate-pulse" />
        </div>

        {/* SĐT */}
        <div className="space-y-1.5">
          <div className="h-3 w-28 bg-muted rounded animate-pulse" />
          <div className="h-9 bg-muted rounded animate-pulse" />
        </div>

        {/* Giới thiệu (textarea) */}
        <div className="space-y-1.5">
          <div className="h-3 w-20 bg-muted rounded animate-pulse" />
          <div className="h-24 bg-muted rounded animate-pulse" />
        </div>
      </div>

      {/* Nút lưu */}
      <div className="h-9 w-full sm:w-28 bg-muted rounded animate-pulse" />
    </div>
  )
}
