export default function AnimeLoading() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-72 shrink-0">
          <div className="aspect-[3/4] bg-muted animate-pulse rounded-lg" />
        </div>
        <div className="flex-1 space-y-4">
          <div className="h-9 w-80 bg-muted animate-pulse rounded" />
          <div className="h-5 w-48 bg-muted animate-pulse rounded" />
          <div className="flex gap-3 mt-4">
            <div className="h-8 w-24 bg-muted animate-pulse rounded-full" />
            <div className="h-8 w-20 bg-muted animate-pulse rounded-full" />
            <div className="h-8 w-16 bg-muted animate-pulse rounded-full" />
          </div>
          <div className="flex gap-2 mt-4">
            <div className="h-7 w-16 bg-muted animate-pulse rounded-full" />
            <div className="h-7 w-20 bg-muted animate-pulse rounded-full" />
            <div className="h-7 w-14 bg-muted animate-pulse rounded-full" />
          </div>
          <div className="space-y-2 mt-6">
            <div className="h-4 w-full bg-muted animate-pulse rounded" />
            <div className="h-4 w-full bg-muted animate-pulse rounded" />
            <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
          </div>
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-8 w-40 bg-muted animate-pulse rounded" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 w-full bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    </div>
  )
}
