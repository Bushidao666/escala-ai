// ============================================================================
// HOMEPAGE ULTRA-OTIMIZADA COM SISTEMA DE CACHE INTELIGENTE
// Nova versão com loading states, cache avançado e fallbacks
// ============================================================================

'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from '@supabase/supabase-js';
import { 
  Trophy, Plus, Zap, Target, ChevronRight, Palette, Settings, Clock,
  Lightbulb, Sparkles, PlayCircle, CheckCircle, Timer, Rocket, RefreshCw,
  Keyboard, ArrowUp
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Hooks e componentes otimizados
import { useStatsCache } from '@/hooks/useStatsCache';
import { 
  DashboardSkeleton, 
  ErrorState, 
  ConnectionStatus, 
  LoadingOverlay,
  EmptyState 
} from '@/components/ui/loading-states';

// Componentes existentes
import { IntelligentInsights } from '@/app/homepage/components/InsightsCarousel';
import { RecentActivityFeed } from '@/app/homepage/components/RecentActivityFeed';
import { AchievementShowcase } from '@/app/homepage/components/achievements/AchievementShowcase';

// Tipos
import { RecentCreative } from '@/types/supabase';
import { createClient } from '@/lib/supabase/client';

// Design tokens premium
const SPACING_PREMIUM = {
  xs: 'var(--spacing-xs)',
  sm: 'var(--spacing-sm)',  
  md: 'var(--spacing-md)',
  lg: 'var(--spacing-lg)',
  xl: 'var(--spacing-xl)',
  xxl: 'var(--spacing-xxl)',
  section: 'var(--spacing-section)'
} as const;

// Animações premium
const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' }
  }
};

// Componente Hero Stats Premium otimizado
function HeroStatsSection({ data, isStale }: { 
  data: any; 
  isStale: boolean;
}) {
  const stats = [
    {
      label: 'Criativos Hoje',
      value: data.stats.creatives_today,
      icon: Zap,
      color: 'text-brand-neon-green',
      bgColor: 'bg-brand-neon-green/10',
      trend: '+12'
    },
    {
      label: 'Taxa de Sucesso',
      value: `${data.stats.success_rate}%`,
      icon: Target,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
      trend: '+5.2%'
    },
    {
      label: 'Sequência',
      value: `${data.stats.current_streak} dias`,
      icon: CheckCircle,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10',
      trend: data.stats.current_streak > 0 ? '+1' : '0'
    },
    {
      label: 'XP Total',
      value: data.stats.achievement_points,
      icon: Trophy,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10',
      trend: '+45'
    }
  ];

  return (
    <div className="hp-grid-stats animate-premium-stagger relative">
      {/* Overlay sutil se dados estão stale */}
      {isStale && (
        <div className="absolute inset-0 bg-yellow-400/5 rounded-xl pointer-events-none" />
      )}
      
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <motion.div
            key={stat.label}
            variants={sectionVariants}
            className="group hover-lift-premium"
          >
            <div className="stat-card-premium">
              <div className="hp-padding-md relative h-full">
                <div className={cn(
                  "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[var(--radius-card)]",
                  stat.bgColor.replace('/10', '/5')
                )} />
                
                <div className="relative h-full flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300",
                      stat.bgColor,
                      "group-hover:scale-110 group-hover:shadow-lg"
                    )}>
                      <IconComponent className={cn("w-6 h-6", stat.color)} />
                    </div>
                    
                    <span className={cn(
                      "hp-text-caption font-semibold px-3 py-1.5 rounded-full border",
                      stat.bgColor,
                      stat.color,
                      "border-current/20"
                    )}>
                      {stat.trend}
                    </span>
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-end pb-2">
                    <p className="hp-text-title mb-1 group-hover:text-shadow-sm transition-all duration-300">
                      {stat.value}
                    </p>
                    <p className="hp-text-caption group-hover:text-brand-gray-300 transition-colors duration-300">
                      {stat.label}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// Componente Criações Recentes otimizado
function CompactCreativesGrid({ 
  creatives, 
  onRefresh, 
  isLoading = false 
}: { 
  creatives: RecentCreative[];
  onRefresh: () => void;
  isLoading?: boolean;
}) {
  if (creatives.length === 0) {
    return (
      <EmptyState
        icon={Palette}
        title="Suas primeiras criações"
        description="Comece criando seu primeiro criativo!"
        action={
          <Button className="button-premium" asChild>
            <Link href="/new">
              <Plus className="w-5 h-5 mr-2" />
              Criar Agora
            </Link>
          </Button>
        }
      />
    );
  }

  return (
    <LoadingOverlay isLoading={isLoading} message="Atualizando criações...">
      <div className="flex items-center justify-between mb-[var(--spacing-lg)]">
        <div className="flex items-center gap-[var(--spacing-sm)]">
          <div className="w-12 h-12 bg-brand-neon-green/10 rounded-xl border border-brand-neon-green/30 flex items-center justify-center">
            <Palette className="w-6 h-6 text-brand-neon-green" />
          </div>
          <div>
            <h3 className="hp-text-title">Criações Recentes</h3>
            <p className="hp-text-caption">{creatives.length} criativos disponíveis</p>
          </div>
        </div>
        
        <div className="flex items-center gap-[var(--spacing-xs)]">
          <Button 
            variant="ghost" 
            size="sm" 
            className="button-secondary-premium"
            onClick={onRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
          </Button>
          
          <Button variant="ghost" size="sm" className="button-secondary-premium" asChild>
            <Link href="/gallery">
              Ver Todas
              <ChevronRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="hp-grid-creatives animate-premium-stagger">
        {creatives.slice(0, 6).map((creative, index) => (
          <motion.div
            key={creative.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.08 }}
            className="group hover-lift-premium"
          >
            <div className="card-premium overflow-hidden aspect-square">
              {creative.result_url ? (
                <img 
                  src={creative.result_url} 
                  alt={creative.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-brand-gray-800/50">
                  <Timer className="w-6 h-6 text-brand-gray-500 animate-pulse" />
                </div>
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-[var(--spacing-sm)]">
                <h4 className="hp-text-body font-semibold text-white truncate mb-1">
                  {creative.title}
                </h4>
                <div className="flex items-center justify-between">
                  <span className="hp-text-caption text-brand-gray-300">
                    {creative.format}
                  </span>
                  <div className={cn(
                    "w-2 h-2 rounded-full transition-all duration-300",
                    creative.status === 'completed' ? 'bg-green-400 shadow-lg shadow-green-400/50' : 
                    creative.status === 'processing' ? 'bg-blue-400 animate-pulse' : 'bg-gray-400'
                  )} />
                </div>
              </div>

              {creative.status === 'processing' && (
                <div className="absolute top-3 right-3">
                  <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse shadow-lg shadow-blue-400/50" />
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </LoadingOverlay>
  );
}

// Componente principal otimizado
export default function HomePageOptimized() {
  const [user, setUser] = useState<User | null>(null);
  const [recentCreatives, setRecentCreatives] = useState<RecentCreative[]>([]);
  const [creativesLoading, setCreativesLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  // Hook de cache inteligente para estatísticas
  const {
    data,
    isLoading,
    isStale,
    isError,
    error,
    lastUpdated,
    cacheStatus,
    refetch,
    forceRefresh
  } = useStatsCache(user?.id || '', {
    enableRealtime: true,
    enableFallback: true,
    staleTime: 2 * 60 * 1000, // 2 minutos
    refetchInterval: 30 * 1000 // 30 segundos
  });

  // Verificar status online/offline
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Buscar usuário atual
  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  // Buscar criativos recentes
  const fetchRecentCreatives = async () => {
    if (!user) return;
    
    setCreativesLoading(true);
    try {
      const { getRecentCreatives } = await import('@/app/homepage/actions');
      const result = await getRecentCreatives();
      
      if (result.success && result.data) {
        setRecentCreatives(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch recent creatives:', error);
    } finally {
      setCreativesLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchRecentCreatives();
    }
  }, [user]);

  // Loading state inicial
  if (!user || (isLoading && !data)) {
    return <DashboardSkeleton />;
  }

  // Error state
  if (isError && !data) {
    return (
      <div className="layout-premium">
        <ErrorState
          error={error || 'Erro desconhecido'}
          onRetry={forceRefresh}
          showDetails={process.env.NODE_ENV === 'development'}
        />
      </div>
    );
  }

  // Fallback se não há dados
  if (!data) {
    return (
      <div className="layout-premium">
        <EmptyState
          title="Carregando dados..."
          description="Aguarde enquanto carregamos suas informações."
        />
      </div>
    );
  }

  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'Usuário';

  return (
    <>
      <motion.div 
        className="layout-premium"
        variants={pageVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Connection Status */}
        <div className="fixed top-4 right-4 z-50">
          <ConnectionStatus
            isOnline={isOnline}
            isStale={isStale}
            lastUpdated={lastUpdated}
          />
        </div>

        {/* Hero Section Premium */}
        <motion.section 
          variants={sectionVariants} 
          className="layout-hero-premium animate-premium-entrance"
        >
          <div className="flex items-center justify-between mb-[var(--spacing-xl)]">
            <div className="flex items-center gap-[var(--spacing-md)]">
              <div className="relative">
                <div className="absolute inset-0 bg-brand-neon-green/20 rounded-xl blur-lg animate-glow-pulse" />
                <div className="relative bg-gradient-to-br from-brand-neon-green to-brand-neon-green-dark rounded-xl p-[var(--spacing-sm)]">
                  <Rocket className="w-8 h-8 text-brand-black" />
                </div>
              </div>
              <div>
                <h1 className="hp-text-hero text-balanced">
                  Bem-vindo de volta, <span className="text-gradient-neon">{userName}</span>
                </h1>
                <p className="hp-text-subtitle mt-[var(--spacing-xs)] text-pretty">
                  {data.stats.creatives_today > 0 
                    ? `Você já criou ${data.stats.creatives_today} criativos hoje! Continue assim.` 
                    : 'Pronto para criar algo incrível hoje?'
                  }
                </p>
              </div>
            </div>
            
            {/* Actions com loading state */}
            <div className="hidden lg:flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => refetch()}
                disabled={isLoading}
                className="button-secondary-premium"
              >
                <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
                Atualizar
              </Button>
              
              <Button className="button-premium" asChild>
                <Link href="/new">
                  <Plus className="w-5 h-5 mr-2" />
                  Novo Criativo
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats Cards com indicador de cache */}
          <HeroStatsSection data={data} isStale={isStale} />
        </motion.section>

        {/* Main Content Grid - Layout 5-4-3 */}
        <motion.section 
          variants={sectionVariants} 
          className="grid grid-cols-1 lg:grid-cols-12 gap-6"
        >
          {/* Coluna 1: Insights (5 colunas) - Destaque principal */}
          <div className="lg:col-span-5">
            <div className="bg-brand-gray-800/50 border border-brand-gray-700/50 rounded-lg p-6">
              <IntelligentInsights insights={data.insights} />
            </div>
          </div>

          {/* Coluna 2: Atividade (4 colunas) - Seção central */}
          <div className="lg:col-span-4">
            <div className="bg-brand-gray-800/50 border border-brand-gray-700/50 rounded-lg p-6">
              <RecentActivityFeed activities={data.recent_activity} />
            </div>
          </div>

          {/* Coluna 3: Conquistas (3 colunas) - Seção compacta */}
          <div className="lg:col-span-3">
            <div className="bg-brand-gray-800/50 border border-brand-gray-700/50 rounded-lg p-6">
              <AchievementShowcase 
                achievements={data.recent_achievements}
                nextAchievements={[]}
              />
            </div>
          </div>
        </motion.section>

        {/* Criações Recentes com loading state */}
        <motion.section 
          variants={sectionVariants}
          className="card-premium hp-padding-lg"
        >
          <CompactCreativesGrid 
            creatives={recentCreatives} 
            onRefresh={fetchRecentCreatives}
            isLoading={creativesLoading}
          />
        </motion.section>
      </motion.div>
    </>
  );
}