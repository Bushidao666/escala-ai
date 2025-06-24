"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { 
  UserProfile, 
  UserStats, 
  UseProfileRealtimeReturn,
  RealtimeConfig,
  RealtimeProfileUpdate,
  RealtimeStatsUpdate
} from '@/app/profile/types';
import { 
  getUserProfile, 
  getUserStats, 
  updateUserProfile, 
  uploadProfileAvatar, 
  removeProfileAvatar 
} from '@/app/profile/actions';

// 🔧 CONFIGURAÇÃO PADRÃO PARA DESKTOP
const DEFAULT_CONFIG: RealtimeConfig = {
  enabled: true,
  autoSync: true,
  optimisticUpdates: true,
  conflictResolution: 'server-wins'
};

// 🎯 INTERFACE DO HOOK STATE
interface ProfileRealtimeState {
  profile: UserProfile | null;
  stats: UserStats | null;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  lastSyncTime: Date | null;
  optimisticUpdates: Map<string, any>;
}

/**
 * 🚀 HOOK PERSONALIZADO PARA PROFILE REALTIME DESKTOP
 * 
 * Features:
 * - Realtime sync de profile e stats
 * - Optimistic updates para UX fluida
 * - Auto-reconnection em caso de desconexão
 * - Conflict resolution inteligente
 * - Desktop-optimized performance
 */
export function useProfileRealtime(
  userId: string | null,
  config: Partial<RealtimeConfig> = {}
): UseProfileRealtimeReturn {
  
  const finalConfig = useMemo(() => ({ ...DEFAULT_CONFIG, ...config }), [config]);
  const supabase = useMemo(() => createClient(), []);
  
  // 🏗️ STATE MANAGEMENT
  const [state, setState] = useState<ProfileRealtimeState>({
    profile: null,
    stats: null,
    isConnected: false,
    isLoading: true,
    error: null,
    lastSyncTime: null,
    optimisticUpdates: new Map()
  });

  // 📡 CHANNELS REFS
  const profileChannelRef = useRef<RealtimeChannel | null>(null);
  const statsChannelRef = useRef<RealtimeChannel | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 🔄 UTILITY FUNCTIONS
  const log = useCallback((message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[ProfileRealtime] ${message}`, data || '');
    }
  }, []);

  const updateState = useCallback((updates: Partial<ProfileRealtimeState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  // 📥 INITIAL DATA LOADING
  const loadInitialData = useCallback(async () => {
    if (!userId) return;

    log('Loading initial profile data...');
    updateState({ isLoading: true, error: null });

    try {
      const [profileResult, statsResult] = await Promise.all([
        getUserProfile(),
        getUserStats()
      ]);

      if (profileResult.success && statsResult.success) {
        updateState({
          profile: profileResult.profile || null,
          stats: statsResult.stats || null,
          isLoading: false,
          lastSyncTime: new Date()
        });
        log('Initial data loaded successfully');
      } else {
        const error = profileResult.error || statsResult.error || 'Failed to load data';
        updateState({ error, isLoading: false });
        log('Failed to load initial data:', error);
      }
    } catch (error: any) {
      updateState({ 
        error: 'Erro ao carregar dados do perfil', 
        isLoading: false 
      });
      log('Unexpected error loading initial data:', error);
    }
  }, [userId, log, updateState]);

  // 🔄 REALTIME PROFILE HANDLER
  const handleProfileUpdate = useCallback((payload: RealtimeProfileUpdate) => {
    log('Profile update received:', payload);

    const newProfile = payload.new;
    const oldProfile = payload.old;

    // Verificar se é uma atualização relevante
    if (!newProfile || newProfile.id !== userId) {
      return;
    }

    // Aplicar otimistic updates se necessário
    if (finalConfig.optimisticUpdates) {
      updateState({ 
        profile: newProfile,
        lastSyncTime: new Date()
      });
    }

    // Mostrar notificação se houve mudança significativa
    if (oldProfile && newProfile.avatar_url !== oldProfile.avatar_url) {
      toast.success('Avatar atualizado!', {
        description: 'Seu avatar foi atualizado com sucesso'
      });
    } else if (oldProfile && newProfile.name !== oldProfile.name) {
      toast.success('Perfil atualizado!', {
        description: 'Suas informações foram atualizadas'
      });
    }

  }, [userId, finalConfig.optimisticUpdates, log, updateState]);

  // 📊 REALTIME STATS HANDLER  
  const handleStatsUpdate = useCallback((payload: RealtimeStatsUpdate) => {
    log('Stats update received:', payload);

    const newStats = payload.new;
    const oldStats = payload.old;

    if (!newStats || newStats.user_id !== userId) {
      return;
    }

    updateState({ 
      stats: newStats,
      lastSyncTime: new Date()
    });

    // Animações para mudanças em stats
    if (oldStats) {
      if (newStats.total_creatives > oldStats.total_creatives) {
        toast.success('Novo criativo gerado!', {
          description: `Total: ${newStats.total_creatives} criativos`
        });
      }
      if (newStats.achievements_count > oldStats.achievements_count) {
        toast.success('Nova conquista desbloqueada!', {
          description: 'Confira suas conquistas no perfil'
        });
      }
    }

  }, [userId, log, updateState]);

  // 🔌 SETUP REALTIME CONNECTIONS
  const setupRealtimeConnections = useCallback(() => {
    if (!userId || !finalConfig.enabled) {
      log('Realtime disabled or no user ID');
      return;
    }

    log('Setting up realtime connections...');

    // 👤 PROFILE CHANNEL
    profileChannelRef.current = supabase
      .channel(`profile-${userId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'users',
        filter: `id=eq.${userId}`
      }, handleProfileUpdate)
      .subscribe((status, err) => {
        log(`Profile channel status: ${status}`, err);
        
        if (status === 'SUBSCRIBED') {
          updateState({ isConnected: true });
        } else if (status === 'CHANNEL_ERROR' || status === 'CLOSED') {
          updateState({ isConnected: false });
          
          // Auto-reconnect para desktop
          if (finalConfig.autoSync && !reconnectTimeoutRef.current) {
            reconnectTimeoutRef.current = setTimeout(() => {
              log('Attempting to reconnect...');
              setupRealtimeConnections();
              reconnectTimeoutRef.current = null;
            }, 3000);
          }
        }
      });

    // 📊 STATS CHANNEL
    statsChannelRef.current = supabase
      .channel(`stats-${userId}`)
      .on('postgres_changes', {
        event: 'UPDATE', 
        schema: 'public',
        table: 'user_stats',
        filter: `user_id=eq.${userId}`
      }, handleStatsUpdate)
      .subscribe((status, err) => {
        log(`Stats channel status: ${status}`, err);
      });

  }, [userId, finalConfig.enabled, finalConfig.autoSync, supabase, handleProfileUpdate, handleStatsUpdate, log, updateState]);

  // 🧹 CLEANUP CONNECTIONS
  const cleanupConnections = useCallback(() => {
    log('Cleaning up realtime connections...');

    if (profileChannelRef.current) {
      supabase.removeChannel(profileChannelRef.current);
      profileChannelRef.current = null;
    }

    if (statsChannelRef.current) {
      supabase.removeChannel(statsChannelRef.current);
      statsChannelRef.current = null;
    }

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    updateState({ isConnected: false });
  }, [supabase, log, updateState]);

  // 🔄 PROFILE UPDATE FUNCTION
  const updateProfile = useCallback(async (data: Partial<UserProfile>) => {
    if (!state.profile) return;

    log('Updating profile...', data);

    // Optimistic update
    if (finalConfig.optimisticUpdates) {
      const optimisticProfile = { ...state.profile, ...data };
      updateState({ profile: optimisticProfile });
    }

    try {
      const result = await updateUserProfile(data);
      
      if (!result.success) {
        // Rollback optimistic update
        if (finalConfig.optimisticUpdates) {
          updateState({ profile: state.profile });
        }
        throw new Error(result.error);
      }

      log('Profile updated successfully');
      
    } catch (error: any) {
      log('Failed to update profile:', error);
      toast.error('Erro ao atualizar perfil', {
        description: error.message
      });
    }
  }, [state.profile, finalConfig.optimisticUpdates, log, updateState]);

  // 📷 AVATAR UPLOAD FUNCTION
  const uploadAvatar = useCallback(async (file: File) => {
    log('Uploading avatar...', { name: file.name, size: file.size });

    // Optimistic update com preview
    if (finalConfig.optimisticUpdates && state.profile) {
      const previewUrl = URL.createObjectURL(file);
      const optimisticProfile = { ...state.profile, avatar_url: previewUrl };
      updateState({ profile: optimisticProfile });
      
      // Cleanup preview URL depois
      setTimeout(() => URL.revokeObjectURL(previewUrl), 10000);
    }

    try {
      const formData = new FormData();
      formData.append('file', file);

      const result = await uploadProfileAvatar(formData);
      
      if (!result.success) {
        // Rollback optimistic update
        if (finalConfig.optimisticUpdates) {
          updateState({ profile: state.profile });
        }
        throw new Error(result.error);
      }

      log('Avatar uploaded successfully:', result.avatarUrl);
      
    } catch (error: any) {
      log('Failed to upload avatar:', error);
      toast.error('Erro no upload do avatar', {
        description: error.message
      });
    }
  }, [state.profile, finalConfig.optimisticUpdates, log, updateState]);

  // 🗑️ REMOVE AVATAR FUNCTION
  const removeAvatar = useCallback(async () => {
    if (!state.profile) return;

    log('Removing avatar...');

    // Optimistic update
    if (finalConfig.optimisticUpdates) {
      const optimisticProfile = { ...state.profile, avatar_url: null };
      updateState({ profile: optimisticProfile });
    }

    try {
      const result = await removeProfileAvatar();
      
      if (!result.success) {
        // Rollback optimistic update
        if (finalConfig.optimisticUpdates) {
          updateState({ profile: state.profile });
        }
        throw new Error(result.error);
      }

      log('Avatar removed successfully');
      
    } catch (error: any) {
      log('Failed to remove avatar:', error);
      toast.error('Erro ao remover avatar', {
        description: error.message
      });
    }
  }, [state.profile, finalConfig.optimisticUpdates, log, updateState]);

  // 🎯 MAIN EFFECT - Setup and teardown
  useEffect(() => {
    if (userId) {
      loadInitialData();
      setupRealtimeConnections();
    }

    return () => {
      cleanupConnections();
    };
  }, [userId, loadInitialData, setupRealtimeConnections, cleanupConnections]);

  // 🔄 RECONNECTION EFFECT
  useEffect(() => {
    if (!state.isConnected && userId && finalConfig.enabled) {
      const checkConnection = setInterval(() => {
        if (!state.isConnected) {
          log('Connection lost, attempting to reconnect...');
          setupRealtimeConnections();
        }
      }, 10000); // Check every 10 seconds

      return () => clearInterval(checkConnection);
    }
  }, [state.isConnected, userId, finalConfig.enabled, setupRealtimeConnections, log]);

  // 📤 RETURN INTERFACE
  return {
    profile: state.profile,
    stats: state.stats,
    isConnected: state.isConnected,
    isLoading: state.isLoading,
    error: state.error,
    updateProfile,
    uploadAvatar,
    removeAvatar
  };
}