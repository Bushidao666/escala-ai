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
export async function getDashboardData(): Promise<DashboardData> {
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
    throw new Error('User is not authenticated.')
  }

  const { data, error } = await supabase.rpc('get_user_dashboard_data' as any, {
    target_user_id: user.id,
  })

  if (error) {
    console.error('Error fetching dashboard data:', error)
    throw new Error('Failed to fetch dashboard data.')
  }

  // The RPC function is expected to return a single JSONB object.
  // We cast it to our defined type for type safety in the frontend.
  return data as unknown as DashboardData
}

/**
 * Fetches the 5 most recent, completed creatives for the current user.
 * This is used for the "Recent Creations" section on the homepage.
 *
 * @returns {Promise<RecentCreative[]>} A promise that resolves to an array of recent creatives.
 * @throws {Error} If the user is not authenticated or if the data fetching fails.
 */
export async function getRecentCreatives(): Promise<RecentCreative[]> {
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
    throw new Error('User is not authenticated.')
  }

  const { data, error } = await supabase.rpc('get_user_recent_creatives' as any, {
    target_user_id: user.id,
    limit_count: 5,
  })

  if (error) {
    console.error('Error fetching recent creatives:', error)
    throw new Error('Failed to fetch recent creatives.')
  }

  return (data as unknown as RecentCreative[]) ?? []
} 