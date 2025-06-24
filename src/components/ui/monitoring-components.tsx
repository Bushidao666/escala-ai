// ============================================================================
// COMPONENTES DE MONITORAMENTO ULTRA-AVANÇADOS
// Interface para sistema de monitoramento ETAPA 4
// ============================================================================

'use client';

import { motion } from 'framer-motion';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  RefreshCw, 
  Shield, 
  Zap,
  Database,
  Server,
  AlertCircle,
  TrendingUp,
  Timer,
  Bug,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

// Health Status Indicator
export function HealthStatusIndicator({ 
  status, 
  className = '' 
}: { 
  status: 'healthy' | 'warning' | 'critical' | 'unknown';
  className?: string;
}) {
  const getStatusConfig = () => {
    switch (status) {
      case 'healthy':
        return {
          icon: CheckCircle,
          color: 'text-green-400',
          bg: 'bg-green-400/10',
          border: 'border-green-400/30',
          text: 'Sistema Saudável'
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          color: 'text-yellow-400',
          bg: 'bg-yellow-400/10',
          border: 'border-yellow-400/30',
          text: 'Atenção Necessária'
        };
      case 'critical':
        return {
          icon: AlertCircle,
          color: 'text-red-400',
          bg: 'bg-red-400/10',
          border: 'border-red-400/30',
          text: 'Estado Crítico'
        };
      default:
        return {
          icon: Activity,
          color: 'text-gray-400',
          bg: 'bg-gray-400/10',
          border: 'border-gray-400/30',
          text: 'Status Desconhecido'
        };
    }
  };

  const config = getStatusConfig();
  const IconComponent = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-xl border",
        config.bg,
        config.border,
        className
      )}
    >
      <IconComponent className={cn("w-5 h-5", config.color)} />
      <span className={cn("font-medium", config.color)}>
        {config.text}
      </span>
    </motion.div>
  );
}

// Metrics Card
export function MetricsCard({ 
  title, 
  value, 
  unit, 
  trend, 
  icon: Icon,
  status = 'normal'
}: {
  title: string;
  value: number | string;
  unit?: string;
  trend?: string;
  icon: any;
  status?: 'normal' | 'warning' | 'critical';
}) {
  const getStatusColor = () => {
    switch (status) {
      case 'warning': return 'text-yellow-400 bg-yellow-400/10';
      case 'critical': return 'text-red-400 bg-red-400/10';
      default: return 'text-brand-neon-green bg-brand-neon-green/10';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-premium hp-padding-md hover-lift-premium"
    >
      <div className="flex items-center justify-between mb-3">
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", getStatusColor())}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <span className="hp-text-caption text-brand-gray-400 font-medium">
            {trend}
          </span>
        )}
      </div>
      
      <div>
        <p className="hp-text-title mb-1">
          {value} {unit && <span className="hp-text-caption">{unit}</span>}
        </p>
        <p className="hp-text-caption text-brand-gray-400">{title}</p>
      </div>
    </motion.div>
  );
}

// Health Check Card
export function HealthCheckCard({ 
  check 
}: { 
  check: {
    check_type: string;
    check_name: string;
    status: 'healthy' | 'warning' | 'critical';
    response_time_ms?: number;
    checked_at: string;
  }
}) {
  const getIcon = () => {
    switch (check.check_type) {
      case 'database': return Database;
      case 'api': return Server;
      case 'queue': return Timer;
      default: return Activity;
    }
  };

  const getStatusColor = () => {
    switch (check.status) {
      case 'healthy': return 'text-green-400 bg-green-400/10 border-green-400/30';
      case 'warning': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
      case 'critical': return 'text-red-400 bg-red-400/10 border-red-400/30';
    }
  };

  const IconComponent = getIcon();

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="card-premium hp-padding-sm hover-lift-premium"
    >
      <div className="flex items-center gap-3">
        <div className={cn("w-8 h-8 rounded-lg border flex items-center justify-center", getStatusColor())}>
          <IconComponent className="w-4 h-4" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h5 className="hp-text-body font-medium text-white truncate">
              {check.check_name}
            </h5>
            <span className={cn(
              "hp-text-caption font-medium capitalize",
              check.status === 'healthy' ? 'text-green-400' :
              check.status === 'warning' ? 'text-yellow-400' : 'text-red-400'
            )}>
              {check.status}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="hp-text-caption text-brand-gray-400">
              {check.check_type}
            </span>
            {check.response_time_ms && (
              <span className="hp-text-caption text-brand-gray-400">
                {check.response_time_ms}ms
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Alert Card
export function AlertCard({ 
  alert, 
  onAcknowledge 
}: { 
  alert: {
    id: string;
    alert_type: string;
    severity: 'info' | 'warning' | 'error' | 'critical';
    title: string;
    message: string;
    source: string;
    created_at: string;
    acknowledged: boolean;
  };
  onAcknowledge: (alertId: string) => void;
}) {
  const [isAcknowledging, setIsAcknowledging] = useState(false);

  const getSeverityConfig = () => {
    switch (alert.severity) {
      case 'critical':
        return {
          icon: AlertCircle,
          color: 'text-red-400',
          bg: 'bg-red-400/10',
          border: 'border-red-400/30'
        };
      case 'error':
        return {
          icon: Bug,
          color: 'text-orange-400',
          bg: 'bg-orange-400/10',
          border: 'border-orange-400/30'
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          color: 'text-yellow-400',
          bg: 'bg-yellow-400/10',
          border: 'border-yellow-400/30'
        };
      default:
        return {
          icon: Activity,
          color: 'text-blue-400',
          bg: 'bg-blue-400/10',
          border: 'border-blue-400/30'
        };
    }
  };

  const config = getSeverityConfig();
  const IconComponent = config.icon;

  const handleAcknowledge = async () => {
    setIsAcknowledging(true);
    try {
      onAcknowledge(alert.id);
    } finally {
      setIsAcknowledging(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "card-premium border hp-padding-md",
        config.border,
        alert.acknowledged && "opacity-60"
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn("w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0", config.bg, config.border)}>
          <IconComponent className={cn("w-5 h-5", config.color)} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h5 className="hp-text-body font-semibold text-white">
              {alert.title}
            </h5>
            <span className={cn(
              "hp-text-caption font-medium uppercase px-2 py-1 rounded-full",
              config.bg,
              config.color
            )}>
              {alert.severity}
            </span>
          </div>
          
          <p className="hp-text-caption text-brand-gray-300 mb-3">
            {alert.message}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="hp-text-caption text-brand-gray-500">
                {alert.source}
              </span>
              <span className="hp-text-caption text-brand-gray-500">
                {new Date(alert.created_at).toLocaleString('pt-BR')}
              </span>
            </div>
            
            {!alert.acknowledged && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleAcknowledge}
                disabled={isAcknowledging}
                className="button-secondary-premium"
              >
                {isAcknowledging ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  'Reconhecer'
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Monitoring Dashboard Header
export function MonitoringHeader({ 
  healthStatus,
  criticalAlertsCount,
  onRefresh,
  onHealthCheck,
  onAutoRecovery,
  isLoading 
}: {
  healthStatus: 'healthy' | 'warning' | 'critical' | 'unknown';
  criticalAlertsCount: number;
  onRefresh: () => void;
  onHealthCheck: () => void;
  onAutoRecovery: () => void;
  isLoading: boolean;
}) {
  return (
    <div className="flex items-center justify-between mb-[var(--spacing-lg)]">
      <div className="flex items-center gap-[var(--spacing-md)]">
        <div className="w-12 h-12 bg-brand-neon-green/10 rounded-xl border border-brand-neon-green/30 flex items-center justify-center">
          <Shield className="w-6 h-6 text-brand-neon-green" />
        </div>
        <div>
          <h2 className="hp-text-title">Sistema de Monitoramento</h2>
          <p className="hp-text-caption">
            Status em tempo real - {criticalAlertsCount} alertas críticos
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <HealthStatusIndicator status={healthStatus} />
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
            className="button-secondary-premium"
          >
            <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onHealthCheck}
            className="button-secondary-premium"
          >
            <Activity className="w-4 h-4" />
            Health Check
          </Button>
          
          {healthStatus === 'critical' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onAutoRecovery}
              className="button-premium"
            >
              <Zap className="w-4 h-4" />
              Auto-Recovery
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// System Overview Grid
export function SystemOverviewGrid({ 
  summary 
}: { 
  summary: {
    total_metrics_today: number;
    critical_alerts_count: number;
    health_checks_count: number;
    avg_response_time: number;
  }
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[var(--spacing-md)] mb-[var(--spacing-lg)]">
      <MetricsCard
        title="Métricas Hoje"
        value={summary.total_metrics_today}
        icon={TrendingUp}
      />
      
      <MetricsCard
        title="Alertas Críticos"
        value={summary.critical_alerts_count}
        icon={AlertCircle}
        status={summary.critical_alerts_count > 0 ? 'critical' : 'normal'}
      />
      
      <MetricsCard
        title="Health Checks"
        value={summary.health_checks_count}
        icon={Activity}
      />
      
      <MetricsCard
        title="Tempo Resposta"
        value={Math.round(summary.avg_response_time)}
        unit="ms"
        icon={Clock}
        status={summary.avg_response_time > 500 ? 'warning' : 'normal'}
      />
    </div>
  );
}