// 🎯 TIPOS TYPESCRIPT PARA PROFILE

export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  role: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserStats {
  user_id: string;
  total_creatives: number;
  total_favorites: number;
  achievements_count: number;
  total_processing_time: number;
  last_login: string;
  created_at: string;
  updated_at: string;
}

export interface ProfileFormData {
  name: string;
  bio?: string;
}

export interface AvatarUploadResponse {
  success: boolean;
  avatarUrl?: string;
  error?: string;
}

export interface ProfileUpdateResponse {
  success: boolean;
  profile?: UserProfile;
  error?: string;
}

export interface StatsResponse {
  success: boolean;
  stats?: UserStats;
  error?: string;
}

// 🔄 TIPOS PARA REALTIME
export interface RealtimeProfileUpdate {
  eventType: 'UPDATE' | 'INSERT';
  new: UserProfile;
  old?: UserProfile;
}

export interface RealtimeStatsUpdate {
  eventType: 'UPDATE' | 'INSERT';
  new: UserStats;
  old?: UserStats;
}

// 🎨 TIPOS PARA COMPONENTES UI
export interface AvatarProps {
  src?: string | null;
  alt: string;
  size: 'sm' | 'md' | 'lg' | 'xl';
  fallback?: string;
  className?: string;
  showEditButton?: boolean;
  onEdit?: () => void;
}

export interface ProfileCardProps {
  profile: UserProfile;
  stats?: UserStats;
  isLoading?: boolean;
  className?: string;
}

export interface ProfileFormProps {
  initialData?: ProfileFormData;
  onSubmit: (data: ProfileFormData) => Promise<void>;
  isLoading?: boolean;
  autoSave?: boolean;
}

// ⚡ TIPOS PARA REALTIME HOOKS
export interface UseProfileRealtimeReturn {
  profile: UserProfile | null;
  stats: UserStats | null;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  uploadAvatar: (file: File) => Promise<void>;
  removeAvatar: () => Promise<void>;
}

export interface RealtimeConfig {
  enabled: boolean;
  autoSync: boolean;
  optimisticUpdates: boolean;
  conflictResolution: 'server-wins' | 'client-wins' | 'merge';
}

// 📊 TIPOS PARA DASHBOARD
export interface StatCardProps {
  label: string;
  value: number;
  icon: string;
  trend?: 'up' | 'down' | 'stable';
  isAnimating?: boolean;
  className?: string;
}

export interface ActivityItem {
  id: string;
  type: 'avatar_update' | 'profile_update' | 'creative_generated' | 'achievement_unlocked';
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface ActivityFeedProps {
  activities: ActivityItem[];
  isLoading?: boolean;
  className?: string;
}

// 🔧 TIPOS PARA CONFIGURAÇÕES
export interface ProfileSettings {
  notifications: {
    email: boolean;
    push: boolean;
    creativeCompleted: boolean;
    achievementUnlocked: boolean;
  };
  privacy: {
    profilePublic: boolean;
    showStats: boolean;
    showActivity: boolean;
  };
  preferences: {
    theme: 'dark' | 'light' | 'auto';
    language: string;
    timezone: string;
  };
}

// 🎯 CONSTANTES ÚTEIS
export const AVATAR_SIZES = {
  sm: '32px',
  md: '48px', 
  lg: '64px',
  xl: '96px'
} as const;

export const ALLOWED_AVATAR_TYPES = [
  'image/jpeg',
  'image/png', 
  'image/webp'
] as const;

export const MAX_AVATAR_SIZE = 5 * 1024 * 1024; // 5MB

export const PROFILE_FIELDS = {
  name: {
    minLength: 2,
    maxLength: 50,
    required: true
  },
  bio: {
    maxLength: 200,
    required: false
  }
} as const;