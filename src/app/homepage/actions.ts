'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

import { Database } from '@/types/supabase'
import {
  Achievement,
  Insight,
  RecentActivity,
  UserStat,
  RecentCreative,
} from './types'

export type DashboardData = {
  stats: UserStat
  recent_achievements: Achievement[]
  recent_activity: RecentActivity[]
  insights: Insight[]
  last_updated: string
}

/**
 * Fetches the complete set of data required for the user's dashboard.
 * This function acts as a wrapper around the `get_user_dashboard_data` PostgreSQL function,
 * providing a secure, server-side-only interface to the frontend.
 *
 * @returns {Promise<DashboardData>} A promise that resolves to the comprehensive dashboard data.
 * @throws {Error} If the user is not authenticated or if the data fetching fails.
 */
export async function getDashboardData(): Promise<{ success: boolean; data?: DashboardData; error?: string }> {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      },
    )

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return {
        success: false,
        error: 'User is not authenticated.'
      }
    }

    const { data, error } = await supabase.rpc('get_user_dashboard_data' as any, {
      target_user_id: user.id,
    })

    if (error) {
      console.error('Error fetching dashboard data:', error)
      return {
        success: false,
        error: `Failed to fetch dashboard data: ${error.message}`
      }
    }

    if (!data) {
      return {
        success: false,
        error: 'No dashboard data returned'
      }
    }

    // The RPC function is expected to return a single JSONB object.
    // We cast it to our defined type for type safety in the frontend.
    return {
      success: true,
      data: data as unknown as DashboardData
    }

  } catch (err) {
    console.error('Unexpected error in getDashboardData:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unexpected error occurred'
    }
  }
}

/**
 * Fetches the 5 most recent, completed creatives for the current user.
 * This is used for the "Recent Creations" section on the homepage.
 *
 * @returns {Promise<RecentCreative[]>} A promise that resolves to an array of recent creatives.
 * @throws {Error} If the user is not authenticated or if the data fetching fails.
 */
export async function getRecentCreatives(): Promise<{ success: boolean; data?: RecentCreative[]; error?: string }> {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      },
    )

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return {
        success: false,
        error: 'User is not authenticated.'
      }
    }

    const { data, error } = await supabase.rpc('get_user_recent_creatives' as any, {
      target_user_id: user.id,
      limit_count: 5,
    })

    if (error) {
      console.error('Error fetching recent creatives:', error)
      return {
        success: false,
        error: `Failed to fetch recent creatives: ${error.message}`
      }
    }

    return {
      success: true,
      data: (data as unknown as RecentCreative[]) ?? []
    }

  } catch (err) {
    console.error('Unexpected error in getRecentCreatives:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unexpected error occurred'
    }
  }
} 