'use client'

import { motion } from 'framer-motion'
import { Trophy, ChevronRight, Star, Calendar, Target, Award } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Achievement } from '../../types'
import { AchievementCard, NextAchievementCard } from '../AchievementCard'
import { getCategoryIcon } from '../../utils/achievementIcons'
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
  achievement_container: 'hp-section',        // Container premium
  header: 'hp-header',                        // Header unificado
  achievement_item: 'hp-item',                // Item harmonizado
  stats_item: 'hp-compact',                   // Stats compactos
  progress_item: 'hp-item',                   // Progress harmonizado
} as const

interface AchievementShowcaseProps {
  achievements: Achievement[]
  nextAchievements?: any[]
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
}

export function AchievementShowcase({ achievements, nextAchievements = [] }: AchievementShowcaseProps) {
  if (achievements.length === 0) {
    return (
      <div className="text-center py-[var(--spacing-xl)]">
        <div className="w-16 h-16 bg-brand-gray-800/50 rounded-xl flex items-center justify-center mx-auto mb-[var(--spacing-md)]">
          <Trophy className="w-8 h-8 text-brand-gray-500" />
        </div>
        <h3 className="hp-text-title mb-[var(--spacing-xs)]">
          Nenhuma conquista ainda
        </h3>
        <p className="hp-text-body text-brand-gray-400 mb-[var(--spacing-md)]">
          Continue criando para desbloquear conquistas!
        </p>
        <Button className="button-premium" asChild>
          <Link href="/new">
            Criar Primeiro Criativo
          </Link>
        </Button>
      </div>
    )
  }
  
  // Agrupa conquistas por categoria para estatísticas
  const achievementsByCategory = achievements.reduce((acc, achievement) => {
    const category = inferCategory(achievement.id)
    acc[category] = (acc[category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const recentAchievements = achievements.filter(a => a.is_new || a.is_featured).slice(0, 3)
  
  return (
    <>
      {/* Header Premium */}
      <div className="flex items-center justify-between mb-[var(--spacing-lg)]">
        <div className="flex items-center gap-[var(--spacing-sm)]">
          <div className="w-12 h-12 bg-purple-500/10 rounded-xl border border-purple-500/30 flex items-center justify-center">
            <Trophy className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h3 className="hp-text-title">Conquistas ({achievements.length})</h3>
            <p className="hp-text-caption">{achievements.filter(a => a.is_new).length} novas</p>
          </div>
        </div>
        
        <Button variant="ghost" size="sm" className="button-secondary-premium" asChild>
          <Link href="/achievements">
            Ver Todas
            <ChevronRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </div>

      {/* Stats Rápidas Premium */}
      <div className="grid grid-cols-2 gap-[var(--spacing-xs)] mb-[var(--spacing-lg)] animate-premium-stagger">
        {Object.entries(achievementsByCategory).slice(0, 4).map(([category, count]) => {
          const IconComponent = getCategoryIcon(category)
          return (
            <div
              key={category}
              className="card-premium hp-compact flex flex-col items-center justify-center text-center hp-padding-sm hover-lift-premium"
            >
              <div className="w-8 h-8 bg-brand-neon-green/10 rounded-lg flex items-center justify-center mb-2">
                <IconComponent className="w-4 h-4 text-brand-neon-green" />
              </div>
              <p className="hp-text-subtitle font-bold text-white">{count}</p>
              <p className="hp-text-caption text-brand-gray-400 capitalize">{category}</p>
            </div>
          )
        })}
      </div>

      {/* Conquistas Recentes Premium */}
      {recentAchievements.length > 0 && (
        <div className="space-y-[var(--spacing-sm)]">
          <div className="flex items-center gap-[var(--spacing-xs)]">
            <div className="w-1 h-4 bg-brand-neon-green rounded-full" />
            <h4 className="hp-text-body font-semibold text-white">Recentes</h4>
          </div>
          
          <div className="space-y-[var(--spacing-xs)] animate-premium-stagger">
            {recentAchievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="hover-lift-premium"
              >
                <div className="bg-brand-gray-800/50 border border-brand-gray-700/50 rounded-lg p-3 flex items-center gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center border",
                    achievement.rarity === 'legendary' ? 'bg-yellow-500/20 border-yellow-500/50' :
                    achievement.rarity === 'epic' ? 'bg-purple-500/20 border-purple-500/50' :
                    achievement.rarity === 'rare' ? 'bg-blue-500/20 border-blue-500/50' :
                    'bg-green-500/20 border-green-500/50'
                  )}>
                    <Trophy className={cn(
                      "w-5 h-5",
                      achievement.rarity === 'legendary' ? 'text-yellow-400' :
                      achievement.rarity === 'epic' ? 'text-purple-400' :
                      achievement.rarity === 'rare' ? 'text-blue-400' :
                      'text-green-400'
                    )} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h5 className="hp-text-body font-medium text-white truncate">
                        {achievement.name}
                      </h5>
                      {achievement.is_new && (
                        <span className="bg-brand-neon-green text-brand-black hp-text-caption font-semibold rounded-full px-2 py-0.5">
                          NOVO
                        </span>
                      )}
                    </div>
                    <p className="hp-text-caption text-brand-gray-400 line-clamp-1">
                      {achievement.description}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="hp-text-caption text-brand-neon-green font-medium">
                        +{achievement.points} XP
                      </span>
                      <span className={cn(
                        "hp-text-caption font-medium capitalize",
                        achievement.rarity === 'legendary' ? 'text-yellow-400' :
                        achievement.rarity === 'epic' ? 'text-purple-400' :
                        achievement.rarity === 'rare' ? 'text-blue-400' :
                        'text-green-400'
                      )}>
                        {achievement.rarity}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Próximas Conquistas Premium */}
      {nextAchievements.length > 0 && (
        <div className="space-y-[var(--spacing-sm)]">
          <div className="flex items-center gap-[var(--spacing-xs)]">
            <div className="w-1 h-4 bg-blue-400 rounded-full" />
            <h4 className="hp-text-body font-semibold text-white">Próximas</h4>
          </div>
          
          <div className="space-y-[var(--spacing-xs)] animate-premium-stagger">
            {nextAchievements.slice(0, 2).map((next, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="hover-lift-premium"
              >
                <div className="bg-brand-gray-800/50 border border-brand-gray-700/50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-[var(--spacing-xs)]">
                    <h5 className="hp-text-body font-medium text-white">{next.name}</h5>
                    <span className="hp-text-caption text-brand-gray-400">
                      {next.progress}/{next.maxProgress}
                    </span>
                  </div>
                  <div className="w-full bg-brand-gray-700 rounded-full h-1.5 mb-[var(--spacing-xs)]">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-blue-400 h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${(next.progress / next.maxProgress) * 100}%` }}
                    />
                  </div>
                  <p className="hp-text-caption text-brand-gray-400 line-clamp-1">
                    {next.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Call to Action Premium */}
      {achievements.length > 3 && (
        <div className="pt-3 border-t border-brand-gray-700/50 text-center mt-[var(--spacing-md)]">
          <Button variant="ghost" size="sm" className="button-secondary-premium" asChild>
            <Link href="/achievements">
              Ver mais {achievements.length - 3} conquistas
              <ChevronRight className="w-3 h-3 ml-[var(--spacing-xs)]" />
            </Link>
          </Button>
        </div>
      )}
    </>
  )
}

// Helper para inferir categoria baseado no ID da conquista
function inferCategory(achievementId: string): string {
  if (achievementId.includes('creative') || achievementId.includes('first')) return 'creation'
  if (achievementId.includes('speed') || achievementId.includes('productivity') || achievementId.includes('streak')) return 'productivity' 
  if (achievementId.includes('quality') || achievementId.includes('perfect')) return 'quality'
  if (achievementId.includes('social') || achievementId.includes('share')) return 'engagement'
  if (achievementId.includes('achievement') || achievementId.includes('hunter')) return 'achievement'
  return 'special'
} 