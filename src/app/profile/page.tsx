"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Settings, 
  User, 
  BarChart3, 
  Bell,
  Shield,
  Palette,
  Activity,
  Calendar,
  Trophy,
  Zap,
  Clock,
  TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useProfileRealtime } from '@/hooks/useProfileRealtime';
import { createClient } from '@/lib/supabase/client';
import ProfileCard from './components/ProfileCard';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * 🎯 PROFILE PAGE DESKTOP PREMIUM
 * 
 * Layout responsivo para:
 * - 1366x768 (Compact layout)
 * - 1920x1080 (Standard layout) 
 * - 3440x1440 (Ultrawide layout)
 * 
 * Features:
 * - Realtime updates
 * - Desktop-optimized UX
 * - Glass morphism design
 * - Activity tracking
 * - Stats dashboard
 */

export default function ProfilePage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(true);

  // 🔐 FETCH USER ID
  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/auth/login');
        return;
      }
      
      setUserId(user.id);
      setIsLoading(false);
    };

    fetchUser();
  }, [router]);

  // ⚡ REALTIME PROFILE DATA
  const {
    profile,
    stats,
    isConnected,
    isLoading: realtimeLoading,
    error,
    updateProfile,
    uploadAvatar,
    removeAvatar
  } = useProfileRealtime(userId);

  // 🔄 LOADING STATE
  if (isLoading || realtimeLoading || !profile) {
    return <ProfilePageSkeleton />;
  }

  // ❌ ERROR STATE
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="card-glass-intense border-red-500/20 max-w-md w-full">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Erro ao carregar perfil</h3>
            <p className="text-brand-gray-400 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} className="btn-neon">
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-black">
      {/* 📱 HEADER BAR */}
      <div className="sticky top-0 z-50 border-b border-brand-gray-800/50 backdrop-blur-xl bg-brand-black/80">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="text-brand-gray-400 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <div className="h-6 w-px bg-brand-gray-700" />
              <h1 className="text-2xl font-bold text-white">Meu Perfil</h1>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* 🔗 CONNECTION STATUS */}
              <div className={cn(
                "flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                isConnected 
                  ? "bg-green-500/20 border border-green-500/30 text-green-400" 
                  : "bg-red-500/20 border border-red-500/30 text-red-400"
              )}>
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  isConnected ? "bg-green-400 animate-pulse" : "bg-red-400"
                )} />
                <span>{isConnected ? 'Conectado' : 'Desconectado'}</span>
              </div>
              
              <Button size="sm" className="btn-outline-neon">
                <Settings className="w-4 h-4 mr-2" />
                Configurações
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 🏗️ MAIN LAYOUT */}
      <div className="max-w-7xl mx-auto p-6">
        
        {/* 🖥️ DESKTOP LAYOUT GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          
          {/* 👤 PROFILE SIDEBAR - 4 columns */}
          <div className="xl:col-span-4 space-y-6">
            <ProfileCard
              profile={profile}
              stats={stats}
              onAvatarUpload={uploadAvatar}
              onAvatarRemove={removeAvatar}
              variant="hero"
              className="sticky top-24"
            />
          </div>

          {/* 📋 MAIN CONTENT - 8 columns */}
          <div className="xl:col-span-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              
              {/* 🎯 TAB NAVIGATION */}
              <TabsList className="grid w-full grid-cols-4 p-2 gap-2 h-auto bg-transparent border border-brand-gray-700/50 rounded-xl backdrop-blur-sm">
                <TabsTrigger 
                  value="profile" 
                  className={cn(
                    "relative py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2",
                    activeTab === 'profile'
                      ? "bg-gradient-to-br from-brand-neon-green/20 to-brand-neon-green/10 text-white border border-brand-neon-green/30 shadow-lg"
                      : "text-brand-gray-400 hover:text-white hover:bg-brand-gray-700/50"
                  )}
                >
                  <User className="w-4 h-4" />
                  <span className="font-medium">Perfil</span>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="stats" 
                  className={cn(
                    "relative py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2",
                    activeTab === 'stats'
                      ? "bg-gradient-to-br from-brand-neon-green/20 to-brand-neon-green/10 text-white border border-brand-neon-green/30 shadow-lg"
                      : "text-brand-gray-400 hover:text-white hover:bg-brand-gray-700/50"
                  )}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span className="font-medium">Estatísticas</span>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="activity" 
                  className={cn(
                    "relative py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2",
                    activeTab === 'activity'
                      ? "bg-gradient-to-br from-brand-neon-green/20 to-brand-neon-green/10 text-white border border-brand-neon-green/30 shadow-lg"
                      : "text-brand-gray-400 hover:text-white hover:bg-brand-gray-700/50"
                  )}
                >
                  <Activity className="w-4 h-4" />
                  <span className="font-medium">Atividade</span>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="preferences" 
                  className={cn(
                    "relative py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2",
                    activeTab === 'preferences'
                      ? "bg-gradient-to-br from-brand-neon-green/20 to-brand-neon-green/10 text-white border border-brand-neon-green/30 shadow-lg"
                      : "text-brand-gray-400 hover:text-white hover:bg-brand-gray-700/50"
                  )}
                >
                  <Palette className="w-4 h-4" />
                  <span className="font-medium">Preferências</span>
                </TabsTrigger>
              </TabsList>

              {/* 📄 TAB CONTENT */}
              <div className="mt-6">
                
                {/* 👤 PROFILE TAB */}
                <TabsContent value="profile" className="mt-0 space-y-6">
                  <ProfileFormSection profile={profile} onUpdate={updateProfile} />
                </TabsContent>

                {/* 📊 STATS TAB */}
                <TabsContent value="stats" className="mt-0 space-y-6">
                  <StatsSection stats={stats} />
                </TabsContent>

                {/* 🔄 ACTIVITY TAB */}
                <TabsContent value="activity" className="mt-0 space-y-6">
                  <ActivitySection userId={userId!} />
                </TabsContent>

                {/* ⚙️ PREFERENCES TAB */}
                <TabsContent value="preferences" className="mt-0 space-y-6">
                  <PreferencesSection />
                </TabsContent>

              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 📝 PROFILE FORM SECTION
 */
function ProfileFormSection({ profile, onUpdate }: { 
  profile: any; 
  onUpdate: (data: any) => Promise<void>; 
}) {
  return (
    <Card className="card-glass-intense border-brand-gray-700/50">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <User className="w-5 h-5 text-brand-neon-green" />
          <span>Informações Pessoais</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center text-brand-gray-400 py-8">
          <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Formulário de edição será implementado na próxima etapa</p>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * 📊 STATS SECTION
 */
function StatsSection({ stats }: { stats: any }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="card-glass-intense border-brand-gray-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-brand-neon-green" />
            <span>Estatísticas Gerais</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-brand-gray-400">Total de Criativos</span>
              <span className="text-2xl font-bold text-white">{stats?.total_creatives || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-brand-gray-400">Favoritos</span>
              <span className="text-2xl font-bold text-white">{stats?.total_favorites || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-brand-gray-400">Conquistas</span>
              <span className="text-2xl font-bold text-white">{stats?.achievements_count || 0}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="card-glass-intense border-brand-gray-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Clock className="w-5 h-5 text-brand-neon-green" />
            <span>Tempo de Uso</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-brand-gray-400">Último Acesso</span>
              <span className="text-white">
                {stats?.last_login ? format(new Date(stats.last_login), 'dd/MM/yyyy HH:mm', { locale: ptBR }) : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-brand-gray-400">Tempo Total</span>
              <span className="text-white">
                {stats?.total_processing_time ? `${Math.round(stats.total_processing_time / 1000)}s` : '0s'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * 🔄 ACTIVITY SECTION
 */
function ActivitySection({ userId }: { userId: string }) {
  return (
    <Card className="card-glass-intense border-brand-gray-700/50">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <Activity className="w-5 h-5 text-brand-neon-green" />
          <span>Atividade Recente</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center text-brand-gray-400 py-8">
          <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Feed de atividades será implementado em breve</p>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * ⚙️ PREFERENCES SECTION
 */
function PreferencesSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="card-glass-intense border-brand-gray-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Bell className="w-5 h-5 text-brand-neon-green" />
            <span>Notificações</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-brand-gray-400 py-8">
            <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Configurações de notificação em breve</p>
          </div>
        </CardContent>
      </Card>

      <Card className="card-glass-intense border-brand-gray-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Palette className="w-5 h-5 text-brand-neon-green" />
            <span>Aparência</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-brand-gray-400 py-8">
            <Palette className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Configurações de tema em breve</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * 💀 LOADING SKELETON
 */
function ProfilePageSkeleton() {
  return (
    <div className="min-h-screen bg-brand-black">
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-4">
            <div className="card-glass-intense p-8 rounded-2xl animate-pulse">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-32 h-32 bg-brand-gray-700 rounded-full" />
                <div className="w-32 h-4 bg-brand-gray-700 rounded" />
                <div className="w-48 h-3 bg-brand-gray-700 rounded" />
              </div>
            </div>
          </div>
          <div className="xl:col-span-8">
            <div className="space-y-6">
              <div className="w-full h-12 bg-brand-gray-700 rounded-xl animate-pulse" />
              <div className="card-glass-intense p-6 rounded-2xl">
                <div className="space-y-4">
                  <div className="w-48 h-6 bg-brand-gray-700 rounded animate-pulse" />
                  <div className="w-full h-32 bg-brand-gray-700 rounded animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}