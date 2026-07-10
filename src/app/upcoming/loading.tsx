export default function UpcomingLoading() {
  return (
    <div>
      <div className="h-8 w-52 bg-muted animate-pulse rounded mb-2" />
      <div className="h-4 w-72 bg-muted animate-pulse rounded mb-6" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="aspect-[3/4] bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    </div>
  )
}
