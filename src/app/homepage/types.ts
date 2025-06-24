// ============================================================================
// HOMEPAGE & GAMIFICATION - TYPES
//
// This file defines the data structures for the new homepage dashboard.
// These types ensure consistency between the data fetched from Supabase RPC calls
// and the components that render this data in the UI.
// ============================================================================

/**
 * Represents the core statistics for a user, displayed in the main dashboard.
 */
export type UserStat = {
  total_creatives: number
  total_completed: number
  success_rate: number
  current_streak: number
  creatives_today: number
  creatives_this_week: number
  creatives_this_month: number
  most_used_format: string
  favorite_time: number
  achievement_points: number
  user_level: number
}

/**
 * Represents a single achievement, unlocked or in progress.
 */
export type Achievement = {
  id: string
  name: string
  description: string
  icon: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic'
  points: number
  unlocked_at: string
  is_new: boolean
  is_featured: boolean
}

/**
 * Represents a single item in the user's recent activity feed.
 */
export type RecentActivity = {
  type:
    | 'creative_created'
    | 'creative_status_changed'
    | 'achievement_unlocked'
    | 'request_created'
  resource_type: 'creative' | 'request' | 'achievement'
  resource_id: string
  metadata: {
    title?: string
    status?: string
    format?: string
    achievement_name?: string
    rarity?: string
    points?: number
  }
  created_at: string
}

/**
 * Represents a personalized insight or suggestion for the user.
 */
export type Insight = {
  id: string
  type: string
  title: string
  description: string
  action_text: string
  action_url: string
  priority: number
  category: string
  created_at: string
}

/**
 * Represents a recently created creative, for the "Recent Creations" list.
 */
export type RecentCreative = {
  id: string
  title: string
  format: string | null
  status: string
  result_url: string | null
  created_at: string
  processing_time_ms: number | null
  is_favorited: boolean
} 