import {
  // Creation Icons
  Paintbrush2, Palette, Brush, Target, Award, Crown, Star, Shield, Compass, Trophy,
  
  // Productivity Icons  
  Zap, Flame, Calendar, CalendarDays, Clock, Bolt, TrendingUp,
  
  // Quality Icons
  Gem, ShieldCheck, CheckCircle2, Sparkles,
  
  // Engagement Icons
  Heart, Share2, Eye, MessageCircle, ThumbsUp, Users,
  
  // Special Icons
  Rocket, TestTube, Medal, LucideIcon, Activity, BarChart3, Hexagon, Image
} from 'lucide-react'



// Mapeamento de ícones profissionais para conquistas
export const achievementIconMap: Record<string, LucideIcon> = {
  // Creation Category
  'first_creative': Paintbrush2,
  'creative_apprentice': Target,
  'creative_journeyman': Award,
  'creative_master': Crown,
  'creative_legend': Star,
  'creative_architect': Shield,
  'format_explorer': Compass,
  'hundred_club': Trophy,
  
  // Productivity Category
  'speed_creator': Zap,
  'productivity_beast': Flame,
  'daily_grind': Calendar,
  'week_warrior': CalendarDays,
  'consistency_king': Clock,
  'streak_master': Flame,
  'power_user': Bolt,
  
  // Quality Category
  'perfectionist': Gem,
  'quality_master': ShieldCheck,
  'no_errors': CheckCircle2,
  'efficiency_expert': TrendingUp,
  
  // Engagement Category
  'social_butterfly': Share2,
  'community_favorite': Heart,
  'trendsetter': TrendingUp,
  'influencer': Users,
  
  // Meta Achievements
  'achievement_hunter': Medal,
  'completionist': Crown,
  
  // Special Categories
  'early_adopter': Rocket,
  'beta_tester': TestTube,
  'feedback_champion': MessageCircle
}

// Ícones por categoria
export const categoryIconMap: Record<string, LucideIcon> = {
  creation: Palette,
  productivity: TrendingUp,
  quality: CheckCircle2,
  engagement: Users,
  achievement: Trophy,
  social: Share2,
  special: Star
}

// Função para pegar ícone da conquista
export function getAchievementIcon(achievementId: string): LucideIcon {
  return achievementIconMap[achievementId] || Trophy
}

// Função para pegar ícone da categoria
export function getCategoryIcon(category: string): LucideIcon {
  return categoryIconMap[category] || Star
}

// Sistema de cores por raridade
export const rarityColors = {
  common: {
    text: 'text-gray-400',
    bg: 'bg-gray-500/10',
    border: 'border-gray-500/30',
    glow: 'shadow-gray-500/20'
  },
  rare: {
    text: 'text-blue-400',
    bg: 'bg-blue-500/10', 
    border: 'border-blue-500/30',
    glow: 'shadow-blue-500/30'
  },
  epic: {
    text: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    glow: 'shadow-purple-500/40'
  },
  legendary: {
    text: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30', 
    glow: 'shadow-amber-500/50'
  },
  mythic: {
    text: 'text-red-400',
    bg: 'bg-gradient-to-r from-red-500/10 to-pink-500/10',
    border: 'border-red-500/40',
    glow: 'shadow-red-500/60'
  }
}

export function getRarityColors(rarity: string) {
  return rarityColors[rarity as keyof typeof rarityColors] || rarityColors.common
} 