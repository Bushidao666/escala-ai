// ============================================================================
// HOOK DE CACHE INTELIGENTE PARA ESTATÍSTICAS
// Sistema ultra-otimizado com múltiplas camadas de cache e fallbacks
// ============================================================================

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { DashboardData, UserStat } from '@/app/homepage/types';

// Tipos para o sistema de cache
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  source: 'cache' | 'network' | 'fallback';
  version: number;
}

interface StatsConfig {
  cacheTime: number;          // Tempo de cache em ms
  staleTime: number;          // Tempo antes de considerar stale
  refetchInterval: number;    // Intervalo de refresh automático
  retryAttempts: number;      // Tentativas de retry
  enableRealtime: boolean;    // Real-time updates
  enableFallback: boolean;    // Usar dados em cache se network falhar
}

interface UseStatsCacheReturn {
  data: DashboardData | null;
  isLoading: boolean;
  isStale: boolean;
  isError: boolean;
  error: Error | null;
  lastUpdated: Date | null;
  cacheStatus: 'fresh' | 'stale' | 'expired' | 'missing';
  refetch: () => Promise<void>;
  invalidate: () => void;
  forceRefresh: () => Promise<void>;
}

// Cache global em memória (sobrevive a re-renders)
const globalCache = new Map<string, CacheEntry<any>>();
const cacheVersion = Date.now(); // Para invalidar cache ao recarregar

// Configuração padrão ultra-otimizada
const DEFAULT_CONFIG: StatsConfig = {
  cacheTime: 5 * 60 * 1000,      // 5 minutos
  staleTime: 2 * 60 * 1000,      // 2 minutos
  refetchInterval: 30 * 1000,    // 30 segundos
  retryAttempts: 3,
  enableRealtime: true,
  enableFallback: true,
};

// Dados de fallback padrão
const DEFAULT_DASHBOARD_DATA: DashboardData = {
  stats: {
    total_creatives: 0,
    total_completed: 0,
    success_rate: 0,
    current_streak: 0,
    creatives_today: 0,
    creatives_this_week: 0,
    creatives_this_month: 0,
    most_used_format: 'N/A',
    favorite_time: 12,
    achievement_points: 0,
    user_level: 1
  },
  recent_achievements: [],
  recent_activity: [],
  insights: [],
  last_updated: new Date().toISOString()
};

/**
 * Hook ultra-otimizado para gerenciar estatísticas com cache inteligente
 */
export function useStatsCache(
  userId: string,
  config: Partial<StatsConfig> = {}
): UseStatsCacheReturn {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const cacheKey = `stats:${userId}`;
  
  // Estados locais
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [cacheStatus, setCacheStatus] = useState<'fresh' | 'stale' | 'expired' | 'missing'>('missing');
  
  // Refs para controle
  const abortControllerRef = useRef<AbortController | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const realtimeChannelRef = useRef<any>(null);
  
  // Supabase client
  const supabase = createClient();

  // Função para determinar status do cache
  const getCacheStatus = useCallback((entry: CacheEntry<any> | undefined): typeof cacheStatus => {
    if (!entry) return 'missing';
    
    const now = Date.now();
    const age = now - entry.timestamp;
    
    if (age > entry.ttl) return 'expired';
    if (age > finalConfig.staleTime) return 'stale';
    return 'fresh';
  }, [finalConfig.staleTime]);

  // Função para buscar dados do cache
  const getFromCache = useCallback((): DashboardData | null => {
    const entry = globalCache.get(cacheKey) as CacheEntry<DashboardData> | undefined;
    if (!entry || entry.version !== cacheVersion) return null;
    
    const status = getCacheStatus(entry);
    setCacheStatus(status);
    
    // Retornar dados do cache mesmo se stale (melhor UX)
    if (status !== 'expired') {
      setLastUpdated(new Date(entry.timestamp));
      return entry.data;
    }
    
    return null;
  }, [cacheKey, getCacheStatus]);

  // Função para salvar no cache
  const saveToCache = useCallback((newData: DashboardData, source: CacheEntry<any>['source'] = 'network') => {
    const entry: CacheEntry<DashboardData> = {
      data: newData,
      timestamp: Date.now(),
      ttl: finalConfig.cacheTime,
      source,
      version: cacheVersion,
    };
    
    globalCache.set(cacheKey, entry);
    setCacheStatus('fresh');
    setLastUpdated(new Date(entry.timestamp));
  }, [cacheKey, finalConfig.cacheTime]);

  // Função principal para buscar dados
  const fetchStats = useCallback(async (options: { 
    retryCount?: number; 
    useCache?: boolean; 
    priority?: 'low' | 'medium' | 'high' 
  } = {}): Promise<DashboardData | null> => {
    const { retryCount = 0, useCache = true, priority = 'medium' } = options;
    
    try {
      // Cancelar request anterior se existir
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      abortControllerRef.current = new AbortController();
      
      // Tentar cache primeiro se permitido
      if (useCache) {
        const cachedData = getFromCache();
        if (cachedData && getCacheStatus(globalCache.get(cacheKey)) === 'fresh') {
          setData(cachedData);
          setIsLoading(false);
          setIsError(false);
          setError(null);
          return cachedData;
        }
      }

      setIsLoading(true);
      setIsError(false);
      setError(null);

      // Buscar via server action principal
      const { getDashboardData } = await import('@/app/homepage/actions');
      const result = await getDashboardData();

      if (!result.success || !result.data) {
        console.error('Dashboard data fetch failed:', result.error);
        throw new Error(result.error || 'Failed to fetch dashboard data');
      }

      // Validar estrutura dos dados antes de salvar
      if (!result.data.stats || typeof result.data.stats !== 'object') {
        console.error('Invalid dashboard data structure:', result.data);
        throw new Error('Invalid dashboard data structure received');
      }

      // Transformar dados para garantir compatibilidade
      const transformedData: DashboardData = {
        stats: {
          total_creatives: result.data.stats.total_creatives || 0,
          total_completed: result.data.stats.total_completed || 0,
          success_rate: result.data.stats.success_rate || result.data.stats.success_rate_percentage || 0,
          current_streak: result.data.stats.current_streak || result.data.stats.current_streak_days || 0,
          creatives_today: result.data.stats.creatives_today || 0,
          creatives_this_week: result.data.stats.creatives_this_week || 0,
          creatives_this_month: result.data.stats.creatives_this_month || 0,
          most_used_format: result.data.stats.most_used_format || 'N/A',
          favorite_time: result.data.stats.favorite_time || result.data.stats.favorite_time_of_day || 12,
          achievement_points: result.data.stats.achievement_points || result.data.stats.total_achievement_points || 0,
          user_level: result.data.stats.user_level || 1
        },
        recent_achievements: result.data.recent_achievements || [],
        recent_activity: result.data.recent_activity || [],
        insights: result.data.insights || [],
        last_updated: result.data.last_updated || new Date().toISOString()
      };

      // Salvar no cache e atualizar estado
      saveToCache(transformedData, 'network');
      setData(transformedData);
      setIsLoading(false);
      
      return transformedData;

    } catch (fetchError: any) {
      console.warn(`Stats fetch failed (attempt ${retryCount + 1}):`, fetchError);
      
      // Log adicional para debugging
      if (fetchError?.message) {
        console.warn('Error details:', fetchError.message);
      }
      
      // Se falhou mas temos cache, usar dados em cache como fallback
      if (finalConfig.enableFallback) {
        const fallbackData = getFromCache();
        if (fallbackData) {
          console.log('Using cached data as fallback');
          setData(fallbackData);
          setIsLoading(false);
          setIsError(false); // Não marcar como erro se temos fallback
          return fallbackData;
        }
        
        // Se não há cache mas fallback está habilitado, usar dados padrão
        if (retryCount >= finalConfig.retryAttempts - 1) {
          console.log('Using default dashboard data as final fallback');
          setData(DEFAULT_DASHBOARD_DATA);
          setIsLoading(false);
          setIsError(false);
          saveToCache(DEFAULT_DASHBOARD_DATA, 'fallback');
          return DEFAULT_DASHBOARD_DATA;
        }
      }

      // Retry logic com exponential backoff
      if (retryCount < finalConfig.retryAttempts && !abortControllerRef.current?.signal.aborted) {
        const retryDelay = Math.min(Math.pow(2, retryCount) * 1000, 8000); // 1s, 2s, 4s, max 8s
        console.log(`Retrying stats fetch in ${retryDelay}ms... (attempt ${retryCount + 1}/${finalConfig.retryAttempts})`);
        
        // Cancelar timeout anterior se existir
        if (retryTimeoutRef.current) {
          clearTimeout(retryTimeoutRef.current);
        }
        
        retryTimeoutRef.current = setTimeout(() => {
          fetchStats({ ...options, retryCount: retryCount + 1 });
        }, retryDelay);
        
        return null;
      }

      // Se todas as tentativas falharam
      setIsError(true);
      setError(fetchError instanceof Error ? fetchError : new Error(String(fetchError)));
      setIsLoading(false);
      
      return null;
    }
  }, [getFromCache, getCacheStatus, saveToCache, finalConfig]);

  // Função para forçar refresh (bypass cache)
  const forceRefresh = useCallback(async () => {
    // Invalidar cache atual
    globalCache.delete(cacheKey);
    setCacheStatus('missing');
    
    return fetchStats({ useCache: false, priority: 'high' });
  }, [cacheKey, fetchStats]);

  // Função para refetch (usar cache se fresh)
  const refetch = useCallback(async () => {
    return fetchStats({ useCache: true, priority: 'medium' });
  }, [fetchStats]);

  // Função para invalidar cache
  const invalidate = useCallback(() => {
    globalCache.delete(cacheKey);
    setCacheStatus('missing');
  }, [cacheKey]);

  // Setup real-time updates
  useEffect(() => {
    if (!finalConfig.enableRealtime || !userId) return;

    const channel = supabase
      .channel(`stats_updates_${userId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'user_stats',
        filter: `user_id=eq.${userId}`,
      }, async (payload) => {
        console.log('Real-time stats update received:', payload);
        
        // Delay pequeno para permitir que todas as atualizações sejam processadas
        setTimeout(() => {
          fetchStats({ useCache: false, priority: 'high' });
        }, 1000);
      })
      .subscribe();

    realtimeChannelRef.current = channel;

    return () => {
      channel.unsubscribe();
    };
  }, [userId, finalConfig.enableRealtime, fetchStats]);

  // Setup interval de refresh automático
  useEffect(() => {
    if (!finalConfig.refetchInterval) return;

    intervalRef.current = setInterval(() => {
      // Só fazer refetch se dados estão stale
      const entry = globalCache.get(cacheKey);
      if (entry && getCacheStatus(entry) === 'stale') {
        console.log('Auto-refreshing stale stats data...');
        fetchStats({ useCache: true, priority: 'low' });
      }
    }, finalConfig.refetchInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [finalConfig.refetchInterval, cacheKey, getCacheStatus, fetchStats]);

  // Initial load
  useEffect(() => {
    if (!userId) return;

    // Tentar carregar do cache primeiro
    const cachedData = getFromCache();
    if (cachedData) {
      setData(cachedData);
      setIsLoading(false);
      
      // Se dados estão stale, buscar em background
      const entry = globalCache.get(cacheKey);
      if (entry && getCacheStatus(entry) === 'stale') {
        fetchStats({ useCache: false, priority: 'low' });
      }
    } else {
      // Sem cache, buscar dados
      fetchStats({ useCache: false, priority: 'high' });
    }
  }, [userId, getFromCache, fetchStats, cacheKey, getCacheStatus]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (realtimeChannelRef.current) {
        realtimeChannelRef.current.unsubscribe();
      }
    };
  }, []);

  // Calcular isStale
  const isStale = data ? getCacheStatus(globalCache.get(cacheKey)) === 'stale' : false;

  return {
    data,
    isLoading,
    isStale,
    isError,
    error,
    lastUpdated,
    cacheStatus,
    refetch,
    invalidate,
    forceRefresh,
  };
}