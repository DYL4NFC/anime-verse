export default function WatchLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="h-8 w-32 bg-muted animate-pulse rounded" />
        <div className="h-7 w-64 bg-muted animate-pulse rounded" />
      </div>
      <div className="aspect-video bg-muted animate-pulse rounded-lg" />
      <div className="h-4 w-48 bg-muted animate-pulse rounded" />
    </div>
  )
}
