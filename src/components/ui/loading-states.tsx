// ============================================================================
// LOADING STATES ULTRA-OTIMIZADOS
// Sistema completo de loading states com skeleton e animações premium
// ============================================================================

'use client';

import { motion } from 'framer-motion';
import { Loader2, RefreshCw, AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';

// Skeleton básico reutilizável
export function Skeleton({ 
  className, 
  ...props 
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <motion.div
      className={cn(
        "animate-pulse rounded-lg bg-gradient-to-r from-brand-gray-800/50 to-brand-gray-700/30",
        className
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      {...props}
    />
  );
}

// Loading spinner premium
export function LoadingSpinner({ 
  size = 'default', 
  className = '' 
}: { 
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    default: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <Loader2 
      className={cn(
        'animate-spin text-brand-neon-green',
        sizeClasses[size],
        className
      )} 
    />
  );
}

// Stats card skeleton
export function StatsCardSkeleton() {
  return (
    <div className="stat-card-premium">
      <div className="hp-padding-md">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="w-12 h-12 rounded-xl" />
          <Skeleton className="w-16 h-6 rounded-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="w-20 h-8" />
          <Skeleton className="w-32 h-4" />
        </div>
      </div>
    </div>
  );
}

// Dashboard skeleton completo
export function DashboardSkeleton() {
  return (
    <div className="layout-premium">
      {/* Hero Section Skeleton */}
      <div className="layout-hero-premium">
        <div className="flex items-center justify-between mb-[var(--spacing-xl)]">
          <div className="flex items-center gap-[var(--spacing-md)]">
            <Skeleton className="w-16 h-16 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="w-64 h-8" />
              <Skeleton className="w-48 h-5" />
            </div>
          </div>
        </div>

        {/* Stats Grid Skeleton */}
        <div className="hp-grid-stats">
          {Array.from({ length: 4 }, (_, i) => (
            <StatsCardSkeleton key={i} />
          ))}
        </div>
      </div>

      {/* Content Grid Skeleton */}
      <div className="hp-grid-main">
        <div className="section-card-premium">
          <div className="hp-padding-lg space-y-4">
            <div className="flex items-center gap-4 mb-6">
              <Skeleton className="w-12 h-12 rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="w-32 h-6" />
                <Skeleton className="w-24 h-4" />
              </div>
            </div>
            <Skeleton className="w-full h-32 rounded-xl" />
          </div>
        </div>

        <div className="section-card-premium">
          <div className="hp-padding-lg space-y-4">
            <div className="flex items-center gap-4 mb-6">
              <Skeleton className="w-12 h-12 rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="w-40 h-6" />
                <Skeleton className="w-32 h-4" />
              </div>
            </div>
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-brand-gray-800/50">
                <Skeleton className="w-8 h-8 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="w-3/4 h-4" />
                  <Skeleton className="w-1/2 h-3" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="section-card-premium">
          <div className="hp-padding-lg space-y-4">
            <div className="flex items-center gap-4 mb-6">
              <Skeleton className="w-12 h-12 rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="w-36 h-6" />
                <Skeleton className="w-28 h-4" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 4 }, (_, i) => (
                <Skeleton key={i} className="aspect-square rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Estado de erro com retry
export function ErrorState({ 
  error, 
  onRetry, 
  isRetrying = false,
  showDetails = false 
}: {
  error: Error | string;
  onRetry?: () => void;
  isRetrying?: boolean;
  showDetails?: boolean;
}) {
  const errorMessage = typeof error === 'string' ? error : error.message;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-[var(--spacing-xxl)]"
    >
      <div className="w-16 h-16 bg-red-500/10 rounded-xl flex items-center justify-center mx-auto mb-[var(--spacing-md)]">
        <AlertCircle className="w-8 h-8 text-red-400" />
      </div>
      
      <h3 className="hp-text-title mb-[var(--spacing-xs)] text-red-400">
        Erro ao carregar dados
      </h3>
      
      <p className="hp-text-body text-brand-gray-400 mb-[var(--spacing-md)]">
        {errorMessage}
      </p>

      {showDetails && typeof error !== 'string' && (
        <details className="text-left text-sm text-brand-gray-500 mb-[var(--spacing-md)] max-w-md mx-auto">
          <summary className="cursor-pointer hover:text-brand-gray-400">
            Detalhes técnicos
          </summary>
          <pre className="mt-2 p-2 bg-brand-gray-900/50 rounded border text-xs overflow-auto">
            {error.stack || error.toString()}
          </pre>
        </details>
      )}
      
      {onRetry && (
        <motion.button
          onClick={onRetry}
          disabled={isRetrying}
          className={cn(
            "button-premium flex items-center gap-2 mx-auto",
            isRetrying && "opacity-50 cursor-not-allowed"
          )}
          whileHover={!isRetrying ? { scale: 1.02 } : {}}
          whileTap={!isRetrying ? { scale: 0.98 } : {}}
        >
          {isRetrying ? (
            <LoadingSpinner size="sm" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
          {isRetrying ? 'Tentando novamente...' : 'Tentar Novamente'}
        </motion.button>
      )}
    </motion.div>
  );
}

// Indicador de conexão
export function ConnectionStatus({ 
  isOnline = true,
  isStale = false,
  lastUpdated,
  className = ''
}: {
  isOnline?: boolean;
  isStale?: boolean;
  lastUpdated?: Date | null;
  className?: string;
}) {
  const getStatusInfo = () => {
    if (!isOnline) {
      return {
        icon: WifiOff,
        color: 'text-red-400',
        bg: 'bg-red-400/10',
        text: 'Offline'
      };
    }
    
    if (isStale) {
      return {
        icon: RefreshCw,
        color: 'text-yellow-400',
        bg: 'bg-yellow-400/10',
        text: 'Atualizando...'
      };
    }
    
    return {
      icon: Wifi,
      color: 'text-green-400',
      bg: 'bg-green-400/10',
      text: 'Online'
    };
  };

  const status = getStatusInfo();
  const IconComponent = status.icon;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm",
        status.bg,
        status.color,
        "border-current/20",
        className
      )}
    >
      <IconComponent className={cn(
        "w-3 h-3",
        isStale && "animate-spin"
      )} />
      <span className="font-medium">{status.text}</span>
      
      {lastUpdated && !isStale && (
        <span className="text-xs opacity-70">
          {new Intl.DateTimeFormat('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
          }).format(lastUpdated)}
        </span>
      )}
    </motion.div>
  );
}

// Empty state para quando não há dados
export function EmptyState({
  icon: Icon = AlertCircle,
  title = 'Nenhum dado encontrado',
  description = 'Não há informações para exibir no momento.',
  action,
  className = ''
}: {
  icon?: React.ComponentType<{ className?: string }>;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("text-center py-[var(--spacing-xxl)]", className)}
    >
      <div className="w-16 h-16 bg-brand-gray-800/50 rounded-xl flex items-center justify-center mx-auto mb-[var(--spacing-md)]">
        <Icon className="w-8 h-8 text-brand-gray-500" />
      </div>
      
      <h3 className="hp-text-title mb-[var(--spacing-xs)]">
        {title}
      </h3>
      
      <p className="hp-text-body text-brand-gray-400 mb-[var(--spacing-md)]">
        {description}
      </p>
      
      {action && (
        <div className="flex justify-center">
          {action}
        </div>
      )}
    </motion.div>
  );
}

// Loading overlay para ações específicas
export function LoadingOverlay({
  isLoading,
  message = 'Carregando...',
  children
}: {
  isLoading: boolean;
  message?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      {children}
      
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-brand-gray-900/80 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center z-50"
        >
          <LoadingSpinner size="lg" className="mb-4" />
          <p className="hp-text-body text-brand-gray-300">
            {message}
          </p>
        </motion.div>
      )}
    </div>
  );
}