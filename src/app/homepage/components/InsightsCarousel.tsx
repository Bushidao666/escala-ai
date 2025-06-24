'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronLeft, 
  ChevronRight, 
  Lightbulb, 
  TrendingUp, 
  Flag, 
  AlertTriangle, 
  Trophy, 
  Zap,
  BarChart3,
  Info,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'
import { Insight } from '../types'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

// Usando sistema premium V2.0
const SPACING_PREMIUM = {
  xs: 'var(--spacing-xs)',
  sm: 'var(--spacing-sm)', 
  md: 'var(--spacing-md)',
  lg: 'var(--spacing-lg)',
  xl: 'var(--spacing-xl)',
} as const

const HEIGHTS_PREMIUM = {
  insight_container: 'hp-section',        // Altura premium
  insight_card: 'hp-compact',             // Card compacto
  header: 'hp-header',                    // Header unificado
} as const

// Mapeamento de ícones para tipos de insight
const insightIconMap = {
  performance_tip: TrendingUp,
  milestone_reached: Flag, 
  suggestion: Lightbulb,
  trend_alert: AlertTriangle,
  achievement_available: Trophy,
  efficiency_boost: Zap,
  usage_pattern: BarChart3,
  default: Info
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 100 : -100,
    opacity: 0
  }),
}

interface IntelligentInsightsProps {
  insights: Insight[]
}

export function IntelligentInsights({ insights }: IntelligentInsightsProps) {
  const [[page, direction], setPage] = useState([0, 0])

  if (insights.length === 0) {
    return (
      <div className="text-center py-[var(--spacing-xl)]">
        <div className="w-16 h-16 bg-brand-gray-800/50 rounded-xl flex items-center justify-center mx-auto mb-[var(--spacing-md)]">
          <Lightbulb className="w-8 h-8 text-brand-gray-500" />
        </div>
        <h3 className="hp-text-title mb-[var(--spacing-xs)]">
          Nenhum insight disponível
        </h3>
        <p className="hp-text-body text-brand-gray-400">
          Continue criando para receber insights personalizados!
        </p>
      </div>
    )
  }

  const insightIndex = ((page % insights.length) + insights.length) % insights.length
  const currentInsight = insights[insightIndex]
  
  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection])
  }

  const IconComponent = insightIconMap[currentInsight.type as keyof typeof insightIconMap] || insightIconMap.default

  return (
    <>
      {/* Header Premium */}
      <div className="flex items-center justify-between mb-[var(--spacing-lg)]">
        <div className="flex items-center gap-[var(--spacing-sm)]">
          <div className="w-12 h-12 bg-brand-neon-green/10 rounded-xl border border-brand-neon-green/30 flex items-center justify-center">
            <Lightbulb className="w-6 h-6 text-brand-neon-green" />
          </div>
          <div>
            <h3 className="hp-text-title">Insights</h3>
            <p className="hp-text-caption">Análises personalizadas</p>
          </div>
        </div>
        
        {/* Indicador de posição premium */}
        {insights.length > 1 && (
          <div className="flex items-center gap-[var(--spacing-xs)]">
            {insights.map((_, index) => (
              <button
                key={index}
                onClick={() => setPage([index, index > insightIndex ? 1 : -1])}
                className={cn(
                  "w-3 h-3 rounded-full transition-all duration-300",
                  index === insightIndex ? "bg-brand-neon-green shadow-lg shadow-brand-neon-green/50" : "bg-brand-gray-600 hover:bg-brand-gray-500"
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* Insight Card Premium */}
      <div className="bg-brand-gray-800/50 border border-brand-gray-700/50 rounded-lg p-6 overflow-hidden relative h-48">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={page}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className="absolute inset-0 hp-padding-md"
          >
            <div className="h-full flex flex-col">
              <div className="flex items-start gap-[var(--spacing-sm)] mb-[var(--spacing-sm)]">
                {/* Ícone do Insight */}
                <div className="w-10 h-10 bg-brand-neon-green/10 rounded-xl border border-brand-neon-green/30 flex-shrink-0 flex items-center justify-center">
                  <IconComponent className="w-5 h-5 text-brand-neon-green" />
                </div>
                
                {/* Categoria */}
                <span className="hp-text-caption font-semibold uppercase tracking-wider rounded-full bg-brand-neon-green/10 text-brand-neon-green border border-brand-neon-green/30 px-3 py-1.5">
                  {currentInsight.category}
                </span>
              </div>
              
              <div className="flex-1 flex flex-col">
                {/* Título */}
                <h4 className="hp-text-subtitle text-white mb-[var(--spacing-xs)]">
                  {currentInsight.title}
                </h4>
                
                {/* Descrição */}
                <p className="hp-text-body text-brand-gray-300 line-clamp-3 flex-1 mb-[var(--spacing-sm)]">
                  {currentInsight.description}
                </p>
                
                {/* CTA */}
                {currentInsight.action_text && currentInsight.action_url && (
                  <div className="mt-auto">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="button-secondary-premium"
                      asChild
                    >
                      <Link href={currentInsight.action_url}>
                        {currentInsight.action_text}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Controles de Navegação Premium */}
        {insights.length > 1 && (
          <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between pointer-events-none">
            <button
              className="pointer-events-auto w-10 h-10 rounded-xl bg-brand-gray-800/90 border border-brand-gray-600/50 text-brand-gray-400 hover:text-white hover:bg-brand-gray-700/80 transition-all duration-200 flex items-center justify-center -ml-2 backdrop-blur-sm"
              onClick={() => paginate(-1)}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <button
              className="pointer-events-auto w-10 h-10 rounded-xl bg-brand-gray-800/90 border border-brand-gray-600/50 text-brand-gray-400 hover:text-white hover:bg-brand-gray-700/80 transition-all duration-200 flex items-center justify-center -mr-2 backdrop-blur-sm"
              onClick={() => paginate(1)}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </>
  )
} 