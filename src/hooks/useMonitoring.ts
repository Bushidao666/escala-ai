// ============================================================================
// HOOK DE MONITORAMENTO ULTRA-AVANÇADO
// Integração com sistema de monitoramento ETAPA 4
// ============================================================================

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';

// Tipos para monitoramento
interface MonitoringData {
  summary: {
    total_metrics_today: number;
    critical_alerts_count: number;
    health_checks_count: number;
    overall_health: 'healthy' | 'warning' | 'critical';
    avg_response_time: number;
    last_updated: string;
  };
  recent_metrics: Array<{
    metric_name: string;
    metric_value: number;
    metric_unit: string;
    metric_type: string;
    created_at: string;
  }>;
  health_status: Array<{
    check_type: string;
    check_name: string;
    status: 'healthy' | 'warning' | 'critical';
    response_time_ms?: number;
    checked_at: string;
  }>;
  active_alerts: Array<{
    id: string;
    alert_type: string;
    severity: 'info' | 'warning' | 'error' | 'critical';
    title: string;
    message: string;
    source: string;
    created_at: string;
    acknowledged: boolean;
  }>;
  generated_at: string;
}

interface UseMonitoringReturn {
  data: MonitoringData | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  lastUpdated: Date | null;
  healthStatus: 'healthy' | 'warning' | 'critical' | 'unknown';
  criticalAlertsCount: number;
  avgResponseTime: number;
  refresh: () => Promise<void>;
  performHealthCheck: (type?: 'quick' | 'full') => Promise<any>;
  runAutoRecovery: () => Promise<any>;
  acknowledgeAlert: (alertId: string) => Promise<boolean>;
}

/**
 * Hook para monitoramento em tempo real do sistema
 */
export function useMonitoring(): UseMonitoringReturn {
  const [data, setData] = useState<MonitoringData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const supabase = createClient();

  // Buscar dados do dashboard de monitoramento
  const fetchMonitoringData = useCallback(async () => {
    try {
      setIsError(false);
      setError(null);

      const { data: result, error: fetchError } = await supabase
        .rpc('get_monitoring_dashboard');

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      if (result?.success) {
        setData(result);
        setLastUpdated(new Date());
      } else {
        throw new Error(result?.message || 'Failed to fetch monitoring data');
      }

    } catch (err) {
      console.error('Failed to fetch monitoring data:', err);
      setIsError(true);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  // Refresh manual
  const refresh = useCallback(async () => {
    setIsLoading(true);
    await fetchMonitoringData();
  }, [fetchMonitoringData]);

  // Executar health check via Edge Function
  const performHealthCheck = useCallback(async (type: 'quick' | 'full' = 'full') => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/monitoring-health-check?operation=${type}_check`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Health check failed: ${response.statusText}`);
      }

      const result = await response.json();
      
      // Refresh dados após health check
      await fetchMonitoringData();
      
      return result;

    } catch (err) {
      console.error(`Failed to perform ${type} health check:`, err);
      throw err;
    }
  }, [supabase, fetchMonitoringData]);

  // Executar auto-recovery
  const runAutoRecovery = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/monitoring-health-check?operation=auto_recovery`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Auto-recovery failed: ${response.statusText}`);
      }

      const result = await response.json();
      
      // Refresh dados após auto-recovery
      await fetchMonitoringData();
      
      return result;

    } catch (err) {
      console.error('Failed to run auto-recovery:', err);
      throw err;
    }
  }, [supabase, fetchMonitoringData]);

  // Reconhecer alerta
  const acknowledgeAlert = useCallback(async (alertId: string): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { error } = await supabase
        .from('system_alerts')
        .update({
          acknowledged: true,
          acknowledged_by: user.id,
          acknowledged_at: new Date().toISOString()
        })
        .eq('id', alertId);

      if (error) {
        console.error('Failed to acknowledge alert:', error);
        return false;
      }

      // Refresh dados após reconhecimento
      await fetchMonitoringData();
      return true;

    } catch (err) {
      console.error('Failed to acknowledge alert:', err);
      return false;
    }
  }, [supabase, fetchMonitoringData]);

  // Auto-refresh periódico
  useEffect(() => {
    // Buscar dados iniciais
    fetchMonitoringData();

    // Setup interval para refresh automático (30 segundos)
    intervalRef.current = setInterval(() => {
      fetchMonitoringData();
    }, 30 * 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchMonitoringData]);

  // Real-time updates para alertas
  useEffect(() => {
    const channel = supabase
      .channel('monitoring_updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'system_alerts',
      }, () => {
        // Refresh quando alertas mudam
        fetchMonitoringData();
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'health_checks',
      }, () => {
        // Refresh quando health checks mudam
        fetchMonitoringData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, fetchMonitoringData]);

  // Valores derivados
  const healthStatus = data?.summary?.overall_health || 'unknown';
  const criticalAlertsCount = data?.summary?.critical_alerts_count || 0;
  const avgResponseTime = data?.summary?.avg_response_time || 0;

  return {
    data,
    isLoading,
    isError,
    error,
    lastUpdated,
    healthStatus,
    criticalAlertsCount,
    avgResponseTime,
    refresh,
    performHealthCheck,
    runAutoRecovery,
    acknowledgeAlert,
  };
}