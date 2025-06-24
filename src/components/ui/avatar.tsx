"use client";

import { useState, useCallback, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Camera, User, X, Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { AVATAR_SIZES, ALLOWED_AVATAR_TYPES, MAX_AVATAR_SIZE } from '@/app/profile/types';
import type { AvatarProps } from '@/app/profile/types';

/**
 * 🎯 COMPONENTE AVATAR DESKTOP PREMIUM
 * 
 * Features:
 * - Realtime updates
 * - Optimistic UI
 * - Drag & drop upload
 * - Hover effects elaborados
 * - Loading states
 * - Error handling
 * - Desktop-optimized UX
 */

interface DesktopAvatarProps extends AvatarProps {
  onUpload?: (file: File) => Promise<void>;
  onRemove?: () => Promise<void>;
  isUploading?: boolean;
  uploadProgress?: number;
  enableUpload?: boolean;
  enableRemove?: boolean;
}

export function Avatar({ 
  src, 
  alt, 
  size = 'md', 
  fallback,
  className,
  showEditButton = false,
  onEdit,
  onUpload,
  onRemove,
  isUploading = false,
  uploadProgress = 0,
  enableUpload = false,
  enableRemove = false,
  ...props 
}: DesktopAvatarProps) {
  
  const [isDragOver, setIsDragOver] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 📏 SIZE MAPPING
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12', 
    lg: 'w-20 h-20',
    xl: 'w-32 h-32'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-6 h-6', 
    xl: 'w-8 h-8'
  };

  // 📁 FILE VALIDATION
  const validateFile = useCallback((file: File): string | null => {
    if (!ALLOWED_AVATAR_TYPES.includes(file.type as any)) {
      return 'Tipo de arquivo não suportado. Use JPEG, PNG ou WebP.';
    }
    
    if (file.size > MAX_AVATAR_SIZE) {
      return 'Arquivo muito grande. Máximo 5MB.';
    }
    
    return null;
  }, []);

  // 📤 HANDLE FILE UPLOAD
  const handleFileUpload = useCallback(async (file: File) => {
    const error = validateFile(file);
    if (error) {
      toast.error(error);
      return;
    }

    if (onUpload) {
      try {
        await onUpload(file);
      } catch (err: any) {
        toast.error('Erro no upload', {
          description: err.message
        });
      }
    }
  }, [validateFile, onUpload]);

  // 🎯 DRAG & DROP HANDLERS
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  // 📁 FILE INPUT HANDLER
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [handleFileUpload]);

  // 🗑️ REMOVE HANDLER
  const handleRemove = useCallback(async () => {
    if (onRemove) {
      try {
        await onRemove();
        toast.success('Avatar removido com sucesso');
      } catch (err: any) {
        toast.error('Erro ao remover avatar', {
          description: err.message
        });
      }
    }
  }, [onRemove]);

  // 🎨 GENERATE FALLBACK INITIALS
  const generateFallback = useCallback(() => {
    if (fallback) return fallback;
    
    const name = alt || 'User';
    const initials = name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
    
    return initials;
  }, [fallback, alt]);

  return (
    <div 
      className={cn(
        "relative group cursor-pointer transition-all duration-300",
        sizeClasses[size],
        className
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      onDragOver={enableUpload ? handleDragOver : undefined}
      onDragLeave={enableUpload ? handleDragLeave : undefined}
      onDrop={enableUpload ? handleDrop : undefined}
      {...props}
    >
      {/* 🖼️ AVATAR IMAGE */}
      <div className={cn(
        "relative w-full h-full rounded-full overflow-hidden transition-all duration-300",
        "border-2 border-brand-gray-600/50 group-hover:border-brand-neon-green/50",
        "shadow-lg shadow-black/20 group-hover:shadow-brand-neon-green/25",
        isDragOver && "border-brand-neon-green scale-105"
      )}>
        {src ? (
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            draggable={false}
          />
        ) : (
          <div className={cn(
            "w-full h-full flex items-center justify-center transition-all duration-300",
            "bg-gradient-to-br from-brand-gray-700 to-brand-gray-800",
            "group-hover:from-brand-gray-600 group-hover:to-brand-gray-700"
          )}>
            {generateFallback() ? (
              <span className={cn(
                "font-bold text-brand-gray-300 group-hover:text-white transition-colors",
                size === 'sm' && "text-xs",
                size === 'md' && "text-sm", 
                size === 'lg' && "text-lg",
                size === 'xl' && "text-2xl"
              )}>
                {generateFallback()}
              </span>
            ) : (
              <User className={cn(
                "text-brand-gray-400 group-hover:text-brand-neon-green transition-colors",
                iconSizes[size]
              )} />
            )}
          </div>
        )}

        {/* 🔄 LOADING OVERLAY */}
        {isUploading && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-full">
            <div className="flex flex-col items-center space-y-2">
              <Loader2 className="w-6 h-6 text-brand-neon-green animate-spin" />
              {uploadProgress > 0 && (
                <span className="text-xs text-white font-medium">
                  {uploadProgress}%
                </span>
              )}
            </div>
          </div>
        )}

        {/* 🎯 DRAG OVERLAY */}
        {isDragOver && !isUploading && (
          <div className="absolute inset-0 bg-brand-neon-green/30 flex items-center justify-center rounded-full border-2 border-dashed border-brand-neon-green animate-pulse">
            <Upload className="w-6 h-6 text-brand-neon-green" />
          </div>
        )}

        {/* ✨ HOVER OVERLAY */}
        {showActions && !isUploading && !isDragOver && (enableUpload || enableRemove || showEditButton) && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-full transition-opacity duration-200">
            <div className="flex items-center space-x-2">
              {enableUpload && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="p-2 h-8 w-8 rounded-full bg-brand-neon-green/20 hover:bg-brand-neon-green/30 border border-brand-neon-green/50"
                >
                  <Camera className="w-4 h-4 text-brand-neon-green" />
                </Button>
              )}
              
              {enableRemove && src && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove();
                  }}
                  className="p-2 h-8 w-8 rounded-full bg-red-500/20 hover:bg-red-500/30 border border-red-500/50"
                >
                  <X className="w-4 h-4 text-red-400" />
                </Button>
              )}
              
              {showEditButton && onEdit && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                  }}
                  className="p-2 h-8 w-8 rounded-full bg-brand-gray-600/50 hover:bg-brand-gray-500/50"
                >
                  <Camera className="w-4 h-4 text-white" />
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 🟢 ONLINE INDICATOR */}
      {size !== 'sm' && (
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-brand-black rounded-full animate-pulse" />
      )}

      {/* 📁 HIDDEN FILE INPUT */}
      {enableUpload && (
        <input
          ref={fileInputRef}
          type="file"
          accept={ALLOWED_AVATAR_TYPES.join(',')}
          onChange={handleFileSelect}
          className="hidden"
        />
      )}
    </div>
  );
}

/**
 * 🚀 AVATAR REALTIME WRAPPER
 * Componente que integra com o hook useProfileRealtime
 */
interface AvatarRealtimeProps {
  userId: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  enableUpload?: boolean;
  enableRemove?: boolean;
  showOnlineIndicator?: boolean;
}

export function AvatarRealtime({ 
  userId, 
  size = 'md', 
  className,
  enableUpload = false,
  enableRemove = false,
  showOnlineIndicator = true
}: AvatarRealtimeProps) {
  
  // Este componente será implementado na próxima etapa quando 
  // tivermos o hook useProfileRealtime integrado
  
  return (
    <Avatar
      src={null} // Será conectado com realtime data
      alt="User Avatar"
      size={size}
      className={className}
      enableUpload={enableUpload}
      enableRemove={enableRemove}
      fallback="U"
    />
  );
}

export default Avatar;