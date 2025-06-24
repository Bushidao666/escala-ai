'use client'

import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { 
  User, 
  Palette, 
  CheckCircle, 
  Clock, 
  Trash2, 
  Edit3, 
  Upload, 
  Award,
  Activity,
  Calendar
} from 'lucide-react'
import { RecentActivity } from '../types'
import { cn } from '@/lib/utils'

// Usando sistema premium V2.0
const SPACING_PREMIUM = {
  xs: 'var(--spacing-xs)',
  sm: 'var(--spacing-sm)',
  md: 'var(--spacing-md)',
  lg: 'var(--spacing-lg)',
  xl: 'var(--spacing-xl)',
} as const

const HEIGHTS_PREMIUM = {
  activity_container: 'hp-section',        // Container premium
  header: 'hp-header',                     // Header unificado  
  activity_item: 'hp-item',                // Item harmonizado
} as const

const getActivityIcon = (action: string) => {
  switch (action) {
    case 'creative_created':
      return Palette
    case 'creative_completed':
      return CheckCircle
    case 'creative_deleted':
      return Trash2
    case 'creative_updated':
      return Edit3
    case 'upload_completed':
      return Upload
    case 'achievement_unlocked':
      return Award
    case 'profile_updated':
      return User
    default:
      return Activity
  }
}

const getActivityColor = (action: string) => {
  switch (action) {
    case 'creative_created':
      return 'text-blue-400'
    case 'creative_completed':
      return 'text-green-400'
    case 'creative_deleted':
      return 'text-red-400'
    case 'creative_updated':
      return 'text-yellow-400'
    case 'upload_completed':
      return 'text-purple-400'
    case 'achievement_unlocked':
      return 'text-brand-neon-green'
    case 'profile_updated':
      return 'text-orange-400'
    default:
      return 'text-brand-gray-400'
  }
}

const getActivityBgColor = (action: string) => {
  switch (action) {
    case 'creative_created':
      return 'bg-blue-500/10 border-blue-500/30'
    case 'creative_completed':
      return 'bg-green-500/10 border-green-500/30'
    case 'creative_deleted':
      return 'bg-red-500/10 border-red-500/30'
    case 'creative_updated':
      return 'bg-yellow-500/10 border-yellow-500/30'
    case 'upload_completed':
      return 'bg-purple-500/10 border-purple-500/30'
    case 'achievement_unlocked':
      return 'bg-brand-neon-green/10 border-brand-neon-green/30'
    case 'profile_updated':
      return 'bg-orange-500/10 border-orange-500/30'
    default:
      return 'bg-brand-gray-500/10 border-brand-gray-500/30'
  }
}

const getActionText = (action: string, metadata?: any) => {
  switch (action) {
    case 'creative_created':
      return 'Criativo iniciado'
    case 'creative_completed':
      return 'Criativo concluído'
    case 'creative_deleted':
      return 'Criativo removido'
    case 'creative_updated':
      return 'Criativo atualizado'
    case 'upload_completed':
      return 'Upload finalizado'
    case 'achievement_unlocked':
      return `Conquista desbloqueada: ${metadata?.achievement_name || 'Nova conquista'}`
    case 'profile_updated':
      return 'Perfil atualizado'
    default:
      return 'Atividade registrada'
  }
}

interface RecentActivityFeedProps {
  activities: RecentActivity[]
}

export function RecentActivityFeed({ activities }: RecentActivityFeedProps) {
  if (activities.length === 0) {
    return (
      <div className="text-center py-[var(--spacing-xl)]">
        <div className="w-16 h-16 bg-brand-gray-800/50 rounded-xl flex items-center justify-center mx-auto mb-[var(--spacing-md)]">
          <Activity className="w-8 h-8 text-brand-gray-500" />
        </div>
        <h3 className="hp-text-title mb-[var(--spacing-xs)]">
          Nenhuma atividade recente
        </h3>
        <p className="hp-text-body text-brand-gray-400">
          Suas atividades aparecerão aqui!
        </p>
      </div>
    )
  }

  return (
    <>
      {/* Header Premium */}
      <div className="flex items-center justify-between mb-[var(--spacing-lg)]">
        <div className="flex items-center gap-[var(--spacing-sm)]">
          <div className="w-12 h-12 bg-green-500/10 rounded-xl border border-green-500/30 flex items-center justify-center">
            <Activity className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <h3 className="hp-text-title">Atividade Recente</h3>
            <p className="hp-text-caption">Últimas {activities.length} ações</p>
          </div>
        </div>
        
        {/* Timestamp do último update */}
        <div className="flex items-center text-brand-gray-500 gap-[var(--spacing-xs)]">
          <Calendar className="w-4 h-4" />
          <span className="hp-text-caption">Atualizado agora</span>
        </div>
      </div>

      {/* Feed de Atividades Premium */}
      <div className="space-y-[var(--spacing-xs)] animate-premium-stagger">
        {activities.slice(0, 4).map((activity, index) => {
          const IconComponent = getActivityIcon(activity.action)
          const iconColor = getActivityColor(activity.action)
          const bgColor = getActivityBgColor(activity.action)
          const actionText = getActionText(activity.action, activity.metadata)
          
          return (
            <motion.div
              key={`${activity.id}-${index}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.06 }}
              className="group hover-lift-premium"
            >
              <div className="bg-brand-gray-800/50 border border-brand-gray-700/50 rounded-lg p-3 flex items-center gap-4">
                {/* Ícone da Atividade */}
                <div className={cn("w-10 h-10 rounded-xl flex-shrink-0 border flex items-center justify-center", bgColor)}>
                  <IconComponent className={cn("w-5 h-5", iconColor)} />
                </div>
                
                {/* Conteúdo Principal */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h5 className="hp-text-body font-medium text-white truncate">
                      {actionText}
                    </h5>
                    <span className="hp-text-caption text-brand-gray-400 flex-shrink-0">
                      {formatDistanceToNow(new Date(activity.created_at), {
                        addSuffix: true,
                        locale: ptBR
                      })}
                    </span>
                  </div>
                  
                  {/* Metadata/Detalhes */}
                  {activity.metadata?.creative_title && (
                    <p className="hp-text-caption text-brand-gray-400 truncate">
                      "{activity.metadata.creative_title}"
                    </p>
                  )}
                  
                  {activity.metadata?.achievement_name && (
                    <p className="hp-text-caption text-brand-neon-green truncate">
                      +{activity.metadata.achievement_points || 0} XP
                    </p>
                  )}
                  
                  {activity.metadata?.file_size && (
                    <p className="hp-text-caption text-brand-gray-400 truncate">
                      {formatFileSize(activity.metadata.file_size)}
                    </p>
                  )}
                </div>
                
                {/* Status Indicator */}
                <div className={cn(
                  "w-3 h-3 rounded-full flex-shrink-0",
                  activity.action === 'creative_completed' ? 'bg-green-400 shadow-lg shadow-green-400/50' :
                  activity.action === 'creative_created' ? 'bg-blue-400 shadow-lg shadow-blue-400/50' :
                  activity.action === 'achievement_unlocked' ? 'bg-brand-neon-green shadow-lg shadow-brand-neon-green/50' :
                  'bg-brand-gray-500'
                )} />
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Indicador de mais atividades */}
      {activities.length > 4 && (
        <div className="text-center pt-6 border-t border-brand-gray-700/50 mt-[var(--spacing-md)]">
          <span className="hp-text-caption text-brand-gray-500">
            +{activities.length - 4} atividades anteriores
          </span>
        </div>
      )}
    </>
  )
}

// Helper function para formatar tamanho de arquivo
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
} 