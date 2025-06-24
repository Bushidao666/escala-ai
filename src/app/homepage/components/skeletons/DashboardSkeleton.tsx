import { AchievementCardSkeleton } from './AchievementCardSkeleton'
import { InsightsCarouselSkeleton } from './InsightsCarouselSkeleton'
import { RecentActivityFeedSkeleton } from './RecentActivityFeedSkeleton'
import { StatCardSkeleton } from './StatCardSkeleton'

export function DashboardSkeleton() {
  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <div className="h-10 w-1/3 animate-pulse rounded-lg bg-gray-700/50" />
        <div className="mt-2 h-5 w-1/2 animate-pulse rounded-lg bg-gray-700/50" />
      </div>

      <section className="mb-8">
        <InsightsCarouselSkeleton />
      </section>

      <section className="mb-8">
        <div className="mb-4 h-7 w-1/4 animate-pulse rounded-lg bg-gray-700/50" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
      </section>

      <section>
        <div className="mb-4 h-7 w-1/4 animate-pulse rounded-lg bg-gray-700/50" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AchievementCardSkeleton />
          <AchievementCardSkeleton />
          <AchievementCardSkeleton />
        </div>
      </section>

      <section className="mt-8">
        <div className="mb-4 h-7 w-1/4 animate-pulse rounded-lg bg-gray-700/50" />
        <RecentActivityFeedSkeleton />
      </section>
    </main>
  )
} 