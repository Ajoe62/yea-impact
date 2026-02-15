export default function DashboardLoading() {
  return (
    <div className="space-y-8 py-8 animate-pulse">
      {/* Profile Section Skeleton */}
      <div className="bg-gray-200 rounded-2xl p-8 h-40"></div>

      {/* Stats Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-gray-200 rounded-xl h-24"></div>
        ))}
      </div>

      {/* Content Sections Skeleton */}
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-gray-200 rounded-xl h-64"></div>
      ))}
    </div>
  );
}
