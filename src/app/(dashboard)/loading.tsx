export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-end justify-between">
        <div>
          <div className="h-7 w-40 bg-gray-100 rounded-lg" />
          <div className="h-4 w-56 bg-gray-50 rounded mt-2" />
        </div>
        <div className="h-9 w-44 bg-gray-100 rounded-lg" />
      </div>

      {/* Metric cards skeleton */}
      <div className="grid grid-cols-3 gap-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-black/[0.07] p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-[8px] bg-gray-100" />
            <div className="space-y-2">
              <div className="h-3 w-16 bg-gray-100 rounded" />
              <div className="h-7 w-10 bg-gray-100 rounded" />
              <div className="h-2.5 w-20 bg-gray-50 rounded" />
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-black/[0.07] p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-[8px] bg-gray-100" />
            <div className="space-y-2">
              <div className="h-3 w-16 bg-gray-100 rounded" />
              <div className="h-7 w-10 bg-gray-100 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* Content skeleton */}
      <div className="bg-white rounded-xl border border-black/[0.07] p-4 space-y-3">
        <div className="h-5 w-48 bg-gray-100 rounded" />
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-16 bg-gray-50 rounded-lg" />
        ))}
      </div>
    </div>
  )
}
