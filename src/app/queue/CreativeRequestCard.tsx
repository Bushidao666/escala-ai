"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  FileImage,
  Clock,
  Loader2,
  CheckCircle2,
  XOctagon,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Trash2,
  Eye,
  Download
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { FORMAT_LABELS } from "@/lib/schemas/creative";
import { reprocessCreativeRequest, deleteCreativeRequest } from "../new/actions";

// Tipos para os dados do request e criativos
type Creative = {
  id: string;
  format: string;
  status: 'draft' | 'queued' | 'processing' | 'completed' | 'failed';
  result_url?: string;
  error_message?: string;
};

type CreativeRequest = {
  id: string;
  title: string;
  status: 'pending' | 'processing' | 'completed' | 'partial' | 'failed';
  requested_formats: string[];
  created_at: string;
  creatives: Creative[];
};

// Configuração de status para requests
const REQUEST_STATUS_CONFIG = {
  pending: { label: "Pendente", color: "bg-gray-500/20 text-gray-400", icon: Clock },
  processing: { label: "Processando", color: "bg-yellow-500/20 text-yellow-400", icon: Loader2 },
  completed: { label: "Concluído", color: "bg-green-500/20 text-green-400", icon: CheckCircle2 },
  partial: { label: "Parcial", color: "bg-blue-500/20 text-blue-400", icon: CheckCircle2 },
  failed: { label: "Falhou", color: "bg-red-500/20 text-red-400", icon: XOctagon },
};

// Configuração de status para criativos individuais
const CREATIVE_STATUS_CONFIG = {
  draft: { label: "Rascunho", icon: Clock },
  queued: { label: "Na Fila", icon: Clock },
  processing: { label: "Processando", icon: Loader2 },
  completed: { label: "Concluído", icon: CheckCircle2 },
  failed: { label: "Falhou", icon: XOctagon },
};

export function CreativeRequestCard({ request, onUpdate }: { request: CreativeRequest; onUpdate: () => void }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isReprocessing, setIsReprocessing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const statusConfig = REQUEST_STATUS_CONFIG[request.status];
  const StatusIcon = statusConfig.icon;
  
  const completedCount = request.creatives.filter(c => c.status === 'completed').length;
  const failedCount = request.creatives.filter(c => c.status === 'failed').length;
  const totalCount = request.creatives.length;
  const progress = totalCount > 0 ? ((completedCount + failedCount) / totalCount) * 100 : 0;
  
  const handleReprocess = async () => {
    setIsReprocessing(true);
    try {
      await reprocessCreativeRequest(request.id);
      toast.success("Solicitação enviada para reprocessamento!");
      onUpdate();
    } catch (error: any) {
      toast.error("Erro ao reprocessar", { description: error.message });
    } finally {
      setIsReprocessing(false);
    }
  };

  const handleDelete = async () => {
    if (confirm(`Tem certeza que deseja excluir "${request.title}" e todos os seus criativos?`)) {
      setIsDeleting(true);
      try {
        await deleteCreativeRequest(request.id);
        toast.success("Solicitação excluída com sucesso!");
        onUpdate();
      } catch (error: any) {
        toast.error("Erro ao excluir", { description: error.message });
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <Card className="card-glass-intense border-brand-gray-700/50 hover:border-brand-neon-green/30 transition-all duration-500 group">
      <CardContent className="p-6">
        {/* Header do Card */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3 mb-2">
              <StatusIcon className={cn("w-6 h-6", statusConfig.color.replace('bg-', 'text-'))} />
              <h3 className="text-xl font-semibold text-white truncate group-hover:text-brand-neon-green transition-colors duration-300">
                {request.title}
              </h3>
              <Badge className={cn("text-xs font-medium", statusConfig.color)}>
                {statusConfig.label}
              </Badge>
            </div>
            <div className="flex items-center flex-wrap gap-2 mb-4">
              {request.requested_formats.map(format => (
                <Badge key={format} className="bg-brand-gray-700/50 text-brand-gray-300 border-brand-gray-600/50 text-xs">
                  {FORMAT_LABELS[format as keyof typeof FORMAT_LABELS] || format}
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {(failedCount > 0) && (
              <Button onClick={handleReprocess} disabled={isReprocessing} className="btn-ghost h-9 px-3">
                {isReprocessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
                <span className="ml-2 text-xs">Reprocessar Falhas</span>
              </Button>
            )}
            <Button onClick={handleDelete} disabled={isDeleting} className="btn-ghost text-red-400 hover:text-red-400 hover:bg-red-500/10 h-9 w-9 p-0">
              {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            </Button>
            <Button onClick={() => setIsExpanded(!isExpanded)} className="btn-ghost h-9 w-9 p-0">
              {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Barra de Progresso */}
        <div>
          <div className="flex items-center justify-between text-xs text-brand-gray-400 mb-2">
            <span className="font-medium">{completedCount} de {totalCount} concluídos</span>
            <span className="font-mono">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2 bg-brand-gray-800/50" />
        </div>

        {/* Detalhes expansíveis */}
        {isExpanded && (
          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {request.creatives.map(creative => {
              const CreativeStatusIcon = CREATIVE_STATUS_CONFIG[creative.status].icon;
              return (
                <div key={creative.id} className="group/item relative rounded-lg border border-brand-gray-700 overflow-hidden aspect-square flex flex-col items-center justify-center bg-brand-gray-800/50">
                  {creative.status === 'completed' && creative.result_url ? (
                    <img src={creative.result_url} alt={creative.format} className="w-full h-full object-cover transition-transform duration-300 group-hover/item:scale-105" />
                  ) : (
                    <div className="flex flex-col items-center text-brand-gray-500">
                      <CreativeStatusIcon className={cn("w-8 h-8", creative.status === 'processing' && 'animate-spin')} />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-3 flex flex-col justify-end">
                    <div className="flex items-center justify-between">
                      <Badge className="text-xs bg-black/50 text-white backdrop-blur-sm border-white/20">
                        {FORMAT_LABELS[creative.format as keyof typeof FORMAT_LABELS]}
                      </Badge>
                      <Badge className={cn("text-xs bg-black/50 backdrop-blur-sm border-white/20", 
                        creative.status === 'completed' && 'text-green-400',
                        creative.status === 'failed' && 'text-red-400',
                      )}>
                        {CREATIVE_STATUS_CONFIG[creative.status].label}
                      </Badge>
                    </div>
                  </div>

                  {creative.status === 'completed' && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 space-x-2">
                      <Button className="btn-ghost h-9 w-9 p-0 text-white hover:text-brand-neon-green" onClick={() => window.open(creative.result_url, '_blank')}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button className="btn-ghost h-9 w-9 p-0 text-white hover:text-brand-neon-green">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                   {creative.status === 'failed' && creative.error_message && (
                     <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-2 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300">
                       <p className="text-red-400 text-xs text-center leading-tight">
                         {creative.error_message}
                       </p>
                     </div>
                   )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 