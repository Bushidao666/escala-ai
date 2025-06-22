"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import {
  X,
  Copy,
  Download,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Palette,
  Type,
  Monitor,
  Heart,
  Share2,
  Maximize2,
  Minimize2,
  Eye,
  Calendar,
  Zap,
  Settings,
  ExternalLink
} from 'lucide-react';
import { toast } from "sonner";
import { cn } from '@/lib/utils';

// Simplificando a tipagem para o que o lightbox precisa
type CreativeForLightbox = {
  id: string;
  title: string;
  prompt: string;
  result_url: string | null;
  status: string;
  style?: string | null;
  primary_color?: string | null;
  secondary_color?: string | null;
  format?: string | null;
  error_message?: string | null;
};

interface CreativeLightboxProps {
  images: CreativeForLightbox[];
  startIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (id: string) => void;
}

export function CreativeLightbox({ images, startIndex, isOpen, onClose, onDelete }: CreativeLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const creative = images[currentIndex];

  const handleNavigate = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'next'
      ? (currentIndex + 1) % images.length
      : (currentIndex - 1 + images.length) % images.length;
    setCurrentIndex(newIndex);
    setIsImageLoaded(false); // Reset image loading state
  };

  if (!creative) return null;

  const handleCopyPrompt = () => {
    if (creative.prompt) {
      navigator.clipboard.writeText(creative.prompt);
      toast.success("Prompt copiado para a área de transferência!");
    }
  };

  const handleShare = () => {
    if (navigator.share && creative.result_url) {
      navigator.share({
        title: creative.title,
        text: creative.prompt,
        url: creative.result_url,
      }).catch(() => {
        // Fallback to copy URL
        navigator.clipboard.writeText(creative.result_url || '');
        toast.success("URL copiada para compartilhamento!");
      });
    } else {
      navigator.clipboard.writeText(creative.result_url || '');
      toast.success("URL copiada para compartilhamento!");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'processing': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'failed': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'draft': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-brand-gray-700/50 text-brand-gray-300 border-brand-gray-600/50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✅';
      case 'processing': return '⚡';
      case 'failed': return '❌';
      case 'draft': return '📝';
      default: return '📄';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn(
        "max-w-7xl h-[95vh] p-0 border-brand-gray-700/50 bg-brand-gray-900/95 backdrop-blur-xl overflow-hidden",
        "animate-in zoom-in-95 duration-300"
      )}>
        {/* Epic Multi-layer Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-gray-900/50 via-brand-gray-800/30 to-brand-gray-900/80"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-brand-neon-green/5 via-transparent to-cyan-400/5"></div>
        
        {/* Header Premium */}
        <div className="relative border-b border-brand-gray-700/50 bg-brand-gray-800/30 backdrop-blur-sm">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-0 bg-brand-neon-green/20 rounded-xl blur animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-brand-neon-green to-emerald-400 p-3 rounded-xl">
                  <Eye className="w-6 h-6 text-brand-black" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-white via-brand-neon-green to-cyan-400 bg-clip-text">
                  {creative.title}
                </h2>
                <div className="flex items-center space-x-3 mt-2">
                  <Badge className={cn("text-xs font-medium px-3 py-1.5 border", getStatusColor(creative.status))}>
                    {getStatusIcon(creative.status)} {creative.status}
                  </Badge>
                  {creative.format && (
                    <Badge className="bg-brand-gray-700/50 text-brand-gray-300 border-brand-gray-600/50 text-xs px-3 py-1.5">
                      📐 {creative.format}
                    </Badge>
                  )}
                  {creative.style && (
                    <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs px-3 py-1.5">
                      🎨 {creative.style}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="btn-ghost w-10 h-10 p-0 hover:bg-brand-gray-700/50 transition-all duration-300"
                title={isFullscreen ? "Sair do fullscreen" : "Fullscreen"}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </Button>
              <Button
                onClick={onClose}
                className="btn-ghost w-10 h-10 p-0 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300"
                title="Fechar (ESC)"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className={cn(
          "relative grid transition-all duration-500",
          isFullscreen ? "grid-cols-1" : "grid-cols-1 xl:grid-cols-3"
        )}>
          
          {/* Image Section */}
          <div className={cn(
            "relative bg-brand-gray-900/50 flex items-center justify-center group",
            isFullscreen ? "col-span-1 h-[calc(95vh-120px)]" : "xl:col-span-2 h-[calc(95vh-120px)]"
          )}>
            {/* Epic Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-neon-green/20 via-transparent to-cyan-400/20"></div>
            </div>

            {creative.result_url ? (
              <div className="relative max-w-full max-h-full group">
                {!isImageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      <div className="absolute inset-0 bg-brand-neon-green/20 rounded-full blur-xl animate-glow-pulse"></div>
                      <div className="relative w-16 h-16 border-4 border-brand-neon-green/20 border-t-brand-neon-green rounded-full animate-spin"></div>
                    </div>
                  </div>
                )}
                <img 
                  src={creative.result_url} 
                  alt={creative.title} 
                  className={cn(
                    "max-w-full max-h-full object-contain rounded-lg shadow-2xl transition-all duration-500",
                    isImageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
                  )}
                  onLoad={() => setIsImageLoaded(true)}
                />
                
                {/* Image Overlay Actions */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 rounded-lg">
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center space-x-2">
                      <Button className="btn-ghost bg-black/50 backdrop-blur-sm hover:bg-black/70 text-white border-white/20">
                        <Heart className="w-4 h-4 mr-2" />
                        Favoritar
                      </Button>
                      <Button onClick={handleShare} className="btn-ghost bg-black/50 backdrop-blur-sm hover:bg-black/70 text-white border-white/20">
                        <Share2 className="w-4 h-4 mr-2" />
                        Compartilhar
                      </Button>
                    </div>
                    {creative.result_url && (
                      <a href={creative.result_url} download target="_blank" rel="noopener noreferrer">
                        <Button className="btn-neon">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="relative w-24 h-24 mx-auto">
                  <div className="absolute inset-0 bg-brand-gray-600/20 rounded-full blur-xl"></div>
                  <div className="relative w-24 h-24 bg-gradient-to-br from-brand-gray-700 to-brand-gray-800 rounded-full flex items-center justify-center">
                    <Sparkles className="w-12 h-12 text-brand-gray-500" />
                  </div>
                </div>
                <p className="text-brand-gray-400 text-lg">Imagem não disponível</p>
              </div>
            )}

            {/* Navigation Arrows */}
            <div className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="relative group/nav">
                <div className="absolute inset-0 bg-brand-neon-green/20 rounded-full blur opacity-0 group-hover/nav:opacity-100 transition-opacity duration-300"></div>
                <Button 
                  onClick={() => handleNavigate('prev')} 
                  className="relative w-12 h-12 p-0 rounded-full bg-black/50 hover:bg-black/70 border border-white/20 backdrop-blur-sm transition-all duration-300"
                  title="Anterior (←)"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </Button>
              </div>
            </div>
            
            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="relative group/nav">
                <div className="absolute inset-0 bg-brand-neon-green/20 rounded-full blur opacity-0 group-hover/nav:opacity-100 transition-opacity duration-300"></div>
                <Button 
                  onClick={() => handleNavigate('next')} 
                  className="relative w-12 h-12 p-0 rounded-full bg-black/50 hover:bg-black/70 border border-white/20 backdrop-blur-sm transition-all duration-300"
                  title="Próximo (→)"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </Button>
              </div>
            </div>
          </div>

          {/* Details Sidebar */}
          {!isFullscreen && (
            <div className="xl:col-span-1 border-l border-brand-gray-700/50 bg-brand-gray-800/20 backdrop-blur-sm">
              <ScrollArea className="h-[calc(95vh-120px)]">
                <div className="p-6 space-y-8">
                  
                  {/* Prompt Section */}
                  <Card className="card-glass border-brand-gray-700/50 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-neon-green/5 to-cyan-400/5"></div>
                    <CardContent className="relative p-6">
                      <div className="flex items-center space-x-2 mb-4">
                        <Sparkles className="w-5 h-5 text-brand-neon-green" />
                        <h3 className="text-lg font-semibold text-white">Prompt Utilizado</h3>
                      </div>
                      <div className="space-y-4">
                        <div className="bg-brand-gray-800/50 rounded-xl p-4 border border-brand-gray-700/50">
                          <p className="text-brand-gray-300 text-sm leading-relaxed">{creative.prompt}</p>
                        </div>
                        <Button 
                          onClick={handleCopyPrompt} 
                          className="w-full btn-ghost hover:bg-brand-neon-green/10 hover:text-brand-neon-green transition-all duration-300"
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copiar Prompt
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Visual Details */}
                  {(creative.style || creative.primary_color || creative.secondary_color) && (
                    <Card className="card-glass border-brand-gray-700/50 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5"></div>
                      <CardContent className="relative p-6">
                        <div className="flex items-center space-x-2 mb-4">
                          <Palette className="w-5 h-5 text-purple-400" />
                          <h3 className="text-lg font-semibold text-white">Detalhes Visuais</h3>
                        </div>
                        <div className="space-y-4">
                          {creative.style && (
                            <div className="flex items-center justify-between p-3 bg-brand-gray-800/50 rounded-lg border border-brand-gray-700/50">
                              <span className="text-brand-gray-400 text-sm">Estilo</span>
                              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                                {creative.style}
                              </Badge>
                            </div>
                          )}
                          {creative.primary_color && (
                            <div className="flex items-center justify-between p-3 bg-brand-gray-800/50 rounded-lg border border-brand-gray-700/50">
                              <span className="text-brand-gray-400 text-sm">Cor Primária</span>
                              <div className="flex items-center space-x-2">
                                <div 
                                  className="w-6 h-6 rounded-full border-2 border-white/20"
                                  style={{ backgroundColor: creative.primary_color }}
                                ></div>
                                <span className="text-white text-sm font-mono">{creative.primary_color}</span>
                              </div>
                            </div>
                          )}
                          {creative.secondary_color && (
                            <div className="flex items-center justify-between p-3 bg-brand-gray-800/50 rounded-lg border border-brand-gray-700/50">
                              <span className="text-brand-gray-400 text-sm">Cor Secundária</span>
                              <div className="flex items-center space-x-2">
                                <div 
                                  className="w-6 h-6 rounded-full border-2 border-white/20"
                                  style={{ backgroundColor: creative.secondary_color }}
                                ></div>
                                <span className="text-white text-sm font-mono">{creative.secondary_color}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Error Message */}
                  {creative.error_message && (
                    <Card className="card-glass border-red-500/30 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-orange-500/5"></div>
                      <CardContent className="relative p-6">
                        <div className="flex items-center space-x-2 mb-4">
                          <Zap className="w-5 h-5 text-red-400" />
                          <h3 className="text-lg font-semibold text-red-400">Erro Detectado</h3>
                        </div>
                        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                          <p className="text-red-300 text-sm leading-relaxed">{creative.error_message}</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Actions */}
                  <Card className="card-glass border-brand-gray-700/50 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-gray-800/30 to-brand-gray-900/30"></div>
                    <CardContent className="relative p-6">
                      <div className="flex items-center space-x-2 mb-4">
                        <Settings className="w-5 h-5 text-brand-neon-green" />
                        <h3 className="text-lg font-semibold text-white">Ações</h3>
                      </div>
                      <div className="space-y-3">
                        {creative.result_url && (
                          <a href={creative.result_url} target="_blank" rel="noopener noreferrer" className="block">
                            <Button className="w-full btn-ghost hover:bg-blue-500/10 hover:text-blue-400 transition-all duration-300">
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Abrir em Nova Aba
                            </Button>
                          </a>
                        )}
                        <Button 
                          onClick={() => onDelete(creative.id)} 
                          className="w-full btn-ghost text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-300"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Excluir Criativo
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 