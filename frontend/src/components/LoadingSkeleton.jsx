import React from 'react'

const LoadingSkeleton = ({ type = 'timetable' }) => {
  if (type === 'search') {
    return (
      <div className="space-y-3 animate-pulse">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="px-4 py-3 border-b border-gray-100 dark:border-dark-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-200 dark:bg-dark-border rounded-full"></div>
                <div>
                  <div className="h-4 bg-gray-200 dark:bg-dark-border rounded w-24 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-dark-border rounded w-16"></div>
                </div>
              </div>
              <div className="h-4 bg-gray-200 dark:bg-dark-border rounded w-20"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (type === 'student-info') {
    return (
      <div className="bg-white dark:bg-dark-card rounded-notion shadow-notion dark:shadow-dark overflow-hidden animate-pulse">
        <div className="bg-gray-50 dark:bg-dark-hover px-6 py-4 border-b border-gray-200 dark:border-dark-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-200 dark:bg-dark-border rounded-full"></div>
              <div>
                <div className="h-5 bg-gray-200 dark:bg-dark-border rounded w-32 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-dark-border rounded w-24"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-dark-border rounded w-20"></div>
              <div className="h-4 bg-gray-200 dark:bg-dark-border rounded w-24"></div>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="text-center">
                <div className="h-8 bg-gray-200 dark:bg-dark-border rounded w-12 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-dark-border rounded w-16 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Default timetable skeleton
  return (
    <div className="bg-white dark:bg-dark-card rounded-notion shadow-notion dark:shadow-dark overflow-hidden animate-pulse">
      <div className="bg-gray-50 dark:bg-dark-hover px-6 py-4 border-b border-gray-200 dark:border-dark-border">
        <div className="h-6 bg-gray-200 dark:bg-dark-border rounded w-32 mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-dark-border rounded w-48"></div>
      </div>

      <div className="p-6">
        {/* Desktop skeleton */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-6 gap-4 mb-4">
            <div className="h-8 bg-gray-200 dark:bg-dark-border rounded"></div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-8 bg-gray-200 dark:bg-dark-border rounded"></div>
            ))}
          </div>

          {[...Array(8)].map((_, row) => (
            <div key={row} className="grid grid-cols-6 gap-4 mb-3">
              <div className="h-16 bg-gray-200 dark:bg-dark-border rounded"></div>
              {[...Array(5)].map((_, col) => (
                <div key={col} className="h-16 bg-gray-200 dark:bg-dark-border rounded"></div>
              ))}
            </div>
          ))}
        </div>

        {/* Mobile skeleton */}
        <div className="lg:hidden space-y-4">
          {[...Array(5)].map((_, day) => (
            <div key={day} className="border border-gray-200 dark:border-dark-border rounded-notion">
              <div className="h-12 bg-gray-200 dark:bg-dark-border rounded-t-notion"></div>
              <div className="p-4 space-y-3">
                {[...Array(4)].map((_, period) => (
                  <div key={period} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-200 dark:bg-dark-border rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 dark:bg-dark-border rounded w-24 mb-2"></div>
                      <div className="h-3 bg-gray-200 dark:bg-dark-border rounded w-32"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default LoadingSkeleton