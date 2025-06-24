"use client";

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Mail, 
  Calendar, 
  Crown, 
  Camera,
  Sparkles,
  Clock,
  TrendingUp
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { UserProfile, UserStats } from '@/app/profile/types';

interface ProfileCardProps {
  profile: UserProfile;
  stats?: UserStats | null;
  onAvatarUpload?: (file: File) => Promise<void>;
  onAvatarRemove?: () => Promise<void>;
  isUploading?: boolean;
  uploadProgress?: number;
  className?: string;
  variant?: 'compact' | 'expanded' | 'hero';
}

/**
 * 🎯 PROFILE CARD DESKTOP PREMIUM
 * 
 * Múltiplas variantes para diferentes contextos:
 * - compact: Para sidebar e espaços pequenos
 * - expanded: Para dashboards e cards
 * - hero: Para página de perfil principal
 */
export function ProfileCard({
  profile,
  stats,
  onAvatarUpload,
  onAvatarRemove,
  isUploading = false,
  uploadProgress = 0,
  className,
  variant = 'expanded'
}: ProfileCardProps) {
  
  const [showFullBio, setShowFullBio] = useState(false);

  // 📊 FORMATTED DATA
  const formattedDate = format(new Date(profile.created_at), 'MMMM yyyy', { locale: ptBR });
  const displayName = profile.name || profile.email?.split('@')[0] || 'Usuário';
  
  // 🎨 VARIANT CONFIGURATIONS
  const variants = {
    compact: {
      container: "p-4 space-y-3",
      avatar: "lg" as const,
      showStats: false,
      showBio: false,
      layout: "flex flex-col items-center text-center"
    },
    expanded: {
      container: "p-6 space-y-4",
      avatar: "xl" as const,
      showStats: true,
      showBio: true,
      layout: "space-y-4"
    },
    hero: {
      container: "p-8 space-y-6",
      avatar: "xl" as const,
      showStats: true,
      showBio: true,
      layout: "space-y-6"
    }
  };

  const config = variants[variant];

  return (
    <div className={cn(
      "relative overflow-hidden rounded-2xl transition-all duration-300",
      "bg-gradient-to-br from-white/8 via-white/4 to-transparent",
      "border border-white/10 shadow-lg shadow-black/10 backdrop-blur-sm",
      "hover:border-white/20 hover:shadow-xl hover:shadow-black/20",
      config.container,
      className
    )}>
      
      {/* 🌟 BACKGROUND GLOW */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-neon-green/5 to-transparent opacity-50" />
      
      <div className={cn("relative", config.layout)}>
        
        {/* 👤 AVATAR SECTION */}
        <div className="flex flex-col items-center space-y-3">
          <div className="relative">
            <Avatar
              src={profile.avatar_url}
              alt={displayName}
              size={config.avatar}
              fallback={displayName.charAt(0).toUpperCase()}
              enableUpload={!!onAvatarUpload}
              enableRemove={!!onAvatarRemove && !!profile.avatar_url}
              onUpload={onAvatarUpload}
              onRemove={onAvatarRemove}
              isUploading={isUploading}
              uploadProgress={uploadProgress}
              className="ring-2 ring-brand-neon-green/20 ring-offset-2 ring-offset-brand-black"
            />
            
            {/* ✨ AVATAR GLOW EFFECT */}
            <div className="absolute inset-0 bg-brand-neon-green/20 rounded-full blur-md -z-10 animate-pulse" />
          </div>

          {/* 📝 USER INFO */}
          <div className="text-center space-y-1">
            <h3 className="text-xl font-bold text-white leading-none">
              {displayName}
            </h3>
            <div className="flex items-center justify-center space-x-2 text-brand-gray-400">
              <Mail className="w-3 h-3" />
              <span className="text-sm">{profile.email}</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-brand-gray-500">
              <Calendar className="w-3 h-3" />
              <span className="text-xs">Membro desde {formattedDate}</span>
            </div>
          </div>

          {/* 👑 ROLE BADGE */}
          <div className="flex items-center space-x-1.5 bg-brand-neon-green/10 px-3 py-1.5 rounded-lg border border-brand-neon-green/20">
            {profile.role === 'admin' ? (
              <>
                <Crown className="w-3.5 h-3.5 text-yellow-400" />
                <span className="text-xs font-semibold text-yellow-400">ADMIN</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-brand-neon-green" />
                <span className="text-xs font-semibold text-brand-neon-green">PRO</span>
              </>
            )}
          </div>
        </div>

        {/* 📊 STATS SECTION */}
        {config.showStats && stats && (
          <div className="grid grid-cols-3 gap-3">
            <StatMiniCard
              label="Criativos"
              value={stats.total_creatives}
              icon="🎨"
              trend="up"
            />
            <StatMiniCard
              label="Favoritos"
              value={stats.total_favorites}
              icon="⭐"
              trend="stable"
            />
            <StatMiniCard
              label="Conquistas"
              value={stats.achievements_count}
              icon="🏆"
              trend="up"
            />
          </div>
        )}

        {/* 💬 BIO SECTION */}
        {config.showBio && profile.name && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-brand-gray-400" />
              <span className="text-sm font-medium text-brand-gray-400">Sobre</span>
            </div>
            <div className="pl-6">
              <p className={cn(
                "text-sm text-brand-gray-300 leading-relaxed",
                !showFullBio && "line-clamp-2"
              )}>
                {profile.name || "Designer criativo apaixonado por IA e tecnologia. Sempre buscando criar experiências visuais únicas e impactantes."}
              </p>
              {(profile.name?.length || 0) > 100 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFullBio(!showFullBio)}
                  className="mt-1 p-0 h-auto text-xs text-brand-neon-green hover:text-brand-neon-green-light"
                >
                  {showFullBio ? 'Ver menos' : 'Ver mais'}
                </Button>
              )}
            </div>
          </div>
        )}

        {/* ⏱️ ACTIVITY SECTION */}
        {variant === 'hero' && stats && (
          <div className="pt-4 border-t border-white/10">
            <div className="flex items-center justify-between text-xs text-brand-gray-400">
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>Último acesso</span>
              </div>
              <span>{format(new Date(stats.last_login), 'dd MMM, HH:mm', { locale: ptBR })}</span>
            </div>
            
            {stats.total_processing_time > 0 && (
              <div className="flex items-center justify-between text-xs text-brand-gray-400 mt-1">
                <div className="flex items-center space-x-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>Tempo total de processamento</span>
                </div>
                <span>{Math.round(stats.total_processing_time / 1000)}s</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * 📊 MINI STAT CARD COMPONENT
 */
interface StatMiniCardProps {
  label: string;
  value: number;
  icon: string;
  trend?: 'up' | 'down' | 'stable';
  isAnimating?: boolean;
}

function StatMiniCard({ label, value, icon, trend = 'stable', isAnimating = false }: StatMiniCardProps) {
  return (
    <div className={cn(
      "p-3 rounded-xl transition-all duration-300",
      "bg-gradient-to-br from-brand-gray-800/50 to-brand-gray-900/50",
      "border border-brand-gray-700/50 hover:border-brand-gray-600/50",
      "hover:scale-105 hover:shadow-lg hover:shadow-black/20",
      isAnimating && "animate-pulse scale-105 shadow-lg shadow-brand-neon-green/25"
    )}>
      <div className="flex items-center justify-between">
        <span className="text-lg">{icon}</span>
        <div className={cn(
          "text-lg font-bold transition-all duration-300",
          isAnimating && "text-brand-neon-green"
        )}>
          {value}
        </div>
      </div>
      <p className="text-xs text-brand-gray-400 mt-1 leading-none">{label}</p>
      
      {trend !== 'stable' && (
        <div className={cn(
          "flex items-center mt-1",
          trend === 'up' && "text-green-400",
          trend === 'down' && "text-red-400"
        )}>
          <TrendingUp className={cn(
            "w-3 h-3",
            trend === 'down' && "rotate-180"
          )} />
        </div>
      )}
    </div>
  );
}

export default ProfileCard;