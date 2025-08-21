interface SlotsSkeletonProps {
  daysCount?: number;
  slotsPerDay?: number;
}

export default function SlotsSkeleton({ daysCount = 3, slotsPerDay = 4 }: SlotsSkeletonProps) {
  return (
    <div className="space-y-6">
      {Array.from({ length: daysCount }).map((_, dayIndex) => (
        <div
          key={dayIndex}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
        >
          {/* Header skeleton */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <div className="px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gray-200 rounded-xl animate-pulse">
                    <div className="w-6 h-6 bg-gray-300 rounded"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-6 bg-gray-300 rounded-lg w-48 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="hidden md:flex items-center space-x-2">
                    {Array.from({ length: 3 }).map((_, badgeIndex) => (
                      <div
                        key={badgeIndex}
                        className="px-3 py-1.5 bg-gray-200 rounded-full animate-pulse"
                      >
                        <div className="h-4 w-16 bg-gray-300 rounded"></div>
                      </div>
                    ))}
                  </div>
                  <div className="p-2 bg-gray-200 rounded-lg animate-pulse">
                    <div className="w-5 h-5 bg-gray-300 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content skeleton */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: slotsPerDay }).map((_, slotIndex) => (
                <div
                  key={slotIndex}
                  className="border-2 border-gray-100 rounded-2xl p-6 animate-pulse"
                >
                  <div className="flex flex-col h-full">
                    {/* Date Section Skeleton */}
                    <div className="flex-1 mb-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="p-2 bg-gray-200 rounded-lg">
                          <div className="w-5 h-5 bg-gray-300 rounded"></div>
                        </div>
                        <div className="flex-1">
                          <div className="h-5 bg-gray-300 rounded w-3/4 mb-1"></div>
                        </div>
                      </div>

                      {/* Time Section Skeleton */}
                      <div className="bg-gray-100 rounded-xl p-4">
                        <div className="flex items-center justify-center space-x-2">
                          <div className="flex items-center space-x-1">
                            <div className="w-4 h-4 bg-gray-300 rounded"></div>
                            <div className="h-4 bg-gray-300 rounded w-12"></div>
                          </div>
                          <div className="w-2 h-1 bg-gray-300 rounded"></div>
                          <div className="h-4 bg-gray-300 rounded w-12"></div>
                        </div>
                      </div>
                    </div>

                    {/* Button Skeleton */}
                    <div className="w-full h-12 bg-gray-300 rounded-xl"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
