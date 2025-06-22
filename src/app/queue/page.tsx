"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  Play, 
  Pause,
  RefreshCw,
  Eye,
  Download,
  Trash2,
  AlertTriangle,
  Timer,
  Activity,
  TrendingUp,
  Zap,
  FileImage,
  Calendar,
  BarChart3,
  Filter,
  Search,
  MoreHorizontal,
  ExternalLink,
  RotateCcw,
  Sparkles,
  Clock4,
  CheckCircle2,
  AlertCircle,
  XOctagon,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Copy,
  Share2
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { getUserCreatives, reprocessCreative, deleteCreative, triggerQueueProcessing, getUserCreativeRequests } from "../new/actions";
import { FORMAT_LABELS } from "@/lib/schemas/creative";
import { CreativeRequestCard } from "./CreativeRequestCard";

interface Creative {
  id: string;
  title: string;
  prompt: string;
  status: string;
  format: string;
  created_at: string;
  updated_at: string;
  result_url?: string;
  error_message?: string;
  queue_jobs?: any[];
}

interface CreativeRequest {
  id: string;
  title: string;
  status: 'pending' | 'processing' | 'completed' | 'partial' | 'failed';
  requested_formats: string[];
  created_at: string;
  creatives: any[];
}

const STATUS_CONFIG = {
  draft: {
    label: "Rascunho",
    shortLabel: "Draft",
    color: "bg-brand-gray-700/50 text-brand-gray-400 border-brand-gray-600/50",
    icon: Clock4,
    description: "Salvo como rascunho",
    gradient: "from-brand-gray-700 to-brand-gray-800"
  },
  queued: {
    label: "Na Fila",
    shortLabel: "Queued",
    color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    icon: Clock,
    description: "Aguardando processamento",
    gradient: "from-blue-500/20 to-blue-600/20"
  },
  processing: {
    label: "Processando",
    shortLabel: "Processing",
    color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    icon: Loader2,
    description: "IA gerando criativo...",
    gradient: "from-yellow-500/20 to-amber-500/20"
  },
  completed: {
    label: "Concluído",
    shortLabel: "Done",
    color: "bg-brand-neon-green/20 text-brand-neon-green border-brand-neon-green/30",
    icon: CheckCircle2,
    description: "Criativo gerado com sucesso",
    gradient: "from-brand-neon-green/20 to-green-500/20"
  },
  failed: {
    label: "Falhou",
    shortLabel: "Failed",
    color: "bg-red-500/20 text-red-400 border-red-500/30",
    icon: XOctagon,
    description: "Erro durante o processamento",
    gradient: "from-red-500/20 to-red-600/20"
  }
};

// Modal de Preview Premium
function CreativePreviewModal({ creative, isOpen, onClose }: { 
  creative: Creative; 
  isOpen: boolean; 
  onClose: () => void; 
}) {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const statusConfig = STATUS_CONFIG[creative.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.draft;

  const handleDownload = async () => {
    if (!creative.result_url) return;
    
    setIsDownloading(true);
    try {
      // Fetch da imagem como blob
      const response = await fetch(creative.result_url);
      if (!response.ok) throw new Error('Falha ao baixar imagem');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      // Criar link de download
      const link = document.createElement('a');
      link.href = url;
      link.download = `${creative.title.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Limpar URL do blob
      window.URL.revokeObjectURL(url);
      
      toast.success("Download concluído!", {
        description: `${creative.title} foi baixado com sucesso`
      });
    } catch (error) {
      toast.error("Erro no download", {
        description: "Não foi possível baixar o criativo"
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyUrl = () => {
    if (creative.result_url) {
      navigator.clipboard.writeText(creative.result_url);
      toast.success("URL copiada!", {
        description: "Link do criativo copiado para a área de transferência"
      });
    }
  };

  const handleShare = () => {
    if (navigator.share && creative.result_url) {
      navigator.share({
        title: creative.title,
        text: `Confira este criativo: ${creative.title}`,
        url: creative.result_url,
      });
    } else {
      handleCopyUrl();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full h-[90vh] p-0 bg-brand-gray-900/95 border-brand-gray-700/50 backdrop-blur-xl">
        <div className="flex flex-col h-full">
          
          {/* Header */}
          <DialogHeader className="p-6 pb-4 border-b border-brand-gray-700/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={cn(
                  "w-12 h-12 rounded-xl border flex items-center justify-center",
                  "bg-gradient-to-br", statusConfig.gradient,
                  statusConfig.color.includes('border-') ? statusConfig.color.split(' ').find(c => c.includes('border-')) : "border-brand-gray-700"
                )}>
                  <statusConfig.icon className={cn(
                    "w-6 h-6",
                    creative.status === 'completed' && 'text-brand-neon-green',
                    creative.status === 'failed' && 'text-red-400',
                    creative.status === 'processing' && 'text-yellow-400',
                    creative.status === 'queued' && 'text-blue-400',
                    creative.status === 'draft' && 'text-brand-gray-400'
                  )} />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold text-white">
                    {creative.title}
                  </DialogTitle>
                  <DialogDescription className="text-brand-gray-400 mt-1">
                    {FORMAT_LABELS[creative.format as keyof typeof FORMAT_LABELS]} • {statusConfig.label}
                  </DialogDescription>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {creative.result_url && (
                  <>
                    <Button
                      onClick={handleShare}
                      className="btn-ghost h-10 w-10 p-0"
                      title="Compartilhar"
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      onClick={handleCopyUrl}
                      className="btn-ghost h-10 w-10 p-0"
                      title="Copiar URL"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      onClick={handleDownload}
                      disabled={isDownloading}
                      className="btn-neon h-10 px-4"
                    >
                      {isDownloading ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Download className="w-4 h-4 mr-2" />
                      )}
                      {isDownloading ? "Baixando..." : "Download"}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </DialogHeader>

          {/* Content */}
          <div className="flex-1 flex overflow-hidden">
            
            {/* Image Preview */}
            <div className="flex-1 flex items-center justify-center bg-brand-gray-900/50 relative">
              {creative.result_url ? (
                <div className="relative max-w-full max-h-full">
                  {isImageLoading && !imageError && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex flex-col items-center space-y-4">
                        <Loader2 className="w-8 h-8 text-brand-neon-green animate-spin" />
                        <span className="text-brand-gray-400">Carregando imagem...</span>
                      </div>
                    </div>
                  )}
                  
                  {imageError ? (
                    <div className="flex flex-col items-center space-y-4 p-8">
                      <AlertCircle className="w-16 h-16 text-red-400" />
                      <div className="text-center">
                        <h3 className="text-white font-semibold mb-2">Erro ao carregar imagem</h3>
                        <p className="text-brand-gray-400">Não foi possível exibir o criativo</p>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={creative.result_url}
                      alt={creative.title}
                      className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                      onLoad={() => setIsImageLoading(false)}
                      onError={() => {
                        setIsImageLoading(false);
                        setImageError(true);
                      }}
                      style={{ display: isImageLoading ? 'none' : 'block' }}
                    />
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-4 p-8">
                  <FileImage className="w-16 h-16 text-brand-gray-600" />
                  <div className="text-center">
                    <h3 className="text-white font-semibold mb-2">Preview não disponível</h3>
                    <p className="text-brand-gray-400">O criativo ainda não foi processado</p>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar com detalhes */}
            <div className="w-80 bg-brand-gray-900/80 border-l border-brand-gray-700/50 p-6 overflow-y-auto">
              <div className="space-y-6">
                
                {/* Status */}
                <div>
                  <h4 className="text-white font-semibold mb-3">Status</h4>
                  <Badge className={cn("text-sm", statusConfig.color)}>
                    {statusConfig.label}
                  </Badge>
                  <p className="text-brand-gray-400 text-sm mt-2">
                    {statusConfig.description}
                  </p>
                </div>

                {/* Prompt */}
                <div>
                  <h4 className="text-white font-semibold mb-3">Prompt</h4>
                  <p className="text-brand-gray-400 text-sm leading-relaxed">
                    {creative.prompt}
                  </p>
                </div>

                {/* Detalhes técnicos */}
                <div>
                  <h4 className="text-white font-semibold mb-3">Detalhes</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-brand-gray-500">Formato:</span>
                      <span className="text-white">
                        {FORMAT_LABELS[creative.format as keyof typeof FORMAT_LABELS]}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-brand-gray-500">Criado:</span>
                      <span className="text-white">
                        {new Date(creative.created_at).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-brand-gray-500">Atualizado:</span>
                      <span className="text-white">
                        {new Date(creative.updated_at).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Jobs info */}
                {creative.queue_jobs && creative.queue_jobs.length > 0 && (
                  <div>
                    <h4 className="text-white font-semibold mb-3">Processamento</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-brand-gray-500">Tentativas:</span>
                        <span className="text-white">{creative.queue_jobs[0].attempts}</span>
                      </div>
                      {creative.queue_jobs[0].processing_started_at && (
                        <div className="flex justify-between">
                          <span className="text-brand-gray-500">Iniciado:</span>
                          <span className="text-white">
                            {new Date(creative.queue_jobs[0].processing_started_at).toLocaleTimeString('pt-BR')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Error details */}
                {creative.status === 'failed' && creative.error_message && (
                  <div>
                    <h4 className="text-red-400 font-semibold mb-3 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Erro
                    </h4>
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                      <p className="text-red-300 text-sm leading-relaxed">
                        {creative.error_message}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function QueuePage() {
  const [creatives, setCreatives] = useState<Creative[]>([]);
  const [creativeRequests, setCreativeRequests] = useState<CreativeRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"cards" | "list">("cards");
  const [isProcessingQueue, setIsProcessingQueue] = useState(false);
  const [previewCreative, setPreviewCreative] = useState<Creative | null>(null);

  // Carrega criativos iniciais
  const loadData = async (showLoader = true) => {
    try {
      if (showLoader) setIsLoading(true);
      
      const filters = filterStatus === "all" ? {} : { status: filterStatus };

      // Buscar ambos os tipos de dados
      const creativeData = await getUserCreatives(filters);
      const requestData = await getUserCreativeRequests(filters as any); // "status" é compatível

      setCreatives(creativeData as any);
      setCreativeRequests(requestData as any);

    } catch (error: any) {
      toast.error("Erro ao carregar dados", {
        description: error.message
      });
    } finally {
      if (showLoader) setIsLoading(false);
    }
  };

  // Atualização em tempo real
  const refreshData = async () => {
    setIsRefreshing(true);
    await loadData(false);
    setIsRefreshing(false);
  };

  useEffect(() => {
    loadData();
    
    // Auto-refresh a cada 5 segundos para jobs em processamento
    const interval = setInterval(() => {
      const hasProcessingCreatives = creatives.some(c => 
        c.status === 'queued' || c.status === 'processing'
      );
      const hasProcessingRequests = creativeRequests.some(r => 
        r.status === 'pending' || r.status === 'processing'
      );
      
      if (hasProcessingCreatives || hasProcessingRequests) {
        refreshData();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [filterStatus]);

  // Reprocessar criativo
  const handleReprocess = async (creativeId: string) => {
    try {
      await reprocessCreative(creativeId);
      toast.success("Criativo adicionado à fila novamente");
      await refreshData();
    } catch (error: any) {
      toast.error("Erro ao reprocessar", {
        description: error.message
      });
    }
  };

  // Deletar criativo
  const handleDelete = async (creativeId: string) => {
    try {
      await deleteCreative(creativeId);
      toast.success("Criativo removido");
      await refreshData();
    } catch (error: any) {
      toast.error("Erro ao remover", {
        description: error.message
      });
    }
  };

  // Processar fila
  const handleProcessQueue = async () => {
    setIsProcessingQueue(true);
    try {
      toast.info("Acionando processamento da fila...", {
        description: "Iniciando processamento de criativos pendentes"
      });
      await triggerQueueProcessing();
      toast.success("Processamento acionado com sucesso!", {
        description: "A fila será processada em instantes"
      });
      setTimeout(refreshData, 2000);
    } catch (error: any) {
      toast.error("Erro ao acionar processamento", {
        description: error.message
      });
    } finally {
      setIsProcessingQueue(false);
    }
  };

  // Download inteligente
  const handleSmartDownload = async (creative: Creative) => {
    if (!creative.result_url) return;
    
    try {
      toast.info("Iniciando download...", {
        description: `Baixando ${creative.title}`
      });

      // Fetch da imagem como blob
      const response = await fetch(creative.result_url);
      if (!response.ok) throw new Error('Falha ao baixar imagem');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      // Criar link de download
      const link = document.createElement('a');
      link.href = url;
      link.download = `${creative.title.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Limpar URL do blob
      window.URL.revokeObjectURL(url);
      
      toast.success("Download concluído!", {
        description: `${creative.title} foi baixado com sucesso`
      });
    } catch (error) {
      toast.error("Erro no download", {
        description: "Não foi possível baixar o criativo"
      });
    }
  };

  // Calcular progresso baseado no status
  const getProgress = (creative: Creative) => {
    switch (creative.status) {
      case 'draft': return 0;
      case 'queued': return 25;
      case 'processing': return 75;
      case 'completed': return 100;
      case 'failed': return 100;
      default: return 0;
    }
  };

  // Filtrar criativos e requests (requests não são filtrados por status ainda, mas a estrutura está pronta)
  const filteredCreatives = creatives.filter(creative => 
    filterStatus === "all" || creative.status === filterStatus
  );

  const filteredRequests = creativeRequests; // Adicionar filtro aqui se necessário

  // Estatísticas avançadas
  const stats = {
    total: creativeRequests.reduce((acc, r) => acc + r.creatives.length, 0) + creatives.length,
    queued: creativeRequests.reduce((acc, r) => acc + r.creatives.filter(c => c.status === 'queued').length, 0) + creatives.filter(c => c.status === 'queued').length,
    processing: creativeRequests.reduce((acc, r) => acc + r.creatives.filter(c => c.status === 'processing').length, 0) + creatives.filter(c => c.status === 'processing').length,
    completed: creativeRequests.reduce((acc, r) => acc + r.creatives.filter(c => c.status === 'completed').length, 0) + creatives.filter(c => c.status === 'completed').length,
    failed: creativeRequests.reduce((acc, r) => acc + r.creatives.filter(c => c.status === 'failed').length, 0) + creatives.filter(c => c.status === 'failed').length,
    draft: creatives.filter(c => c.status === 'draft').length,
  };

  const successRate = stats.total > 0 ? Math.round((stats.completed / (stats.completed + stats.failed)) * 100) || 0 : 0;
  const activeJobs = stats.queued + stats.processing;

  if (isLoading) {
  return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            <div className="absolute inset-0 bg-brand-neon-green/20 rounded-full blur-xl animate-glow-pulse"></div>
            <div className="relative w-20 h-20 border-4 border-brand-neon-green/20 border-t-brand-neon-green rounded-full animate-spin"></div>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold text-white mb-2">Carregando Dashboard</h3>
            <p className="text-brand-gray-400">Sincronizando dados da fila...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Premium */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-0 bg-brand-neon-green/20 rounded-2xl blur-xl animate-glow-pulse"></div>
                <div className="relative bg-gradient-to-br from-brand-neon-green via-brand-neon-green to-brand-neon-green-dark p-4 rounded-2xl shadow-lg">
                  <Activity className="w-7 h-7 text-brand-black" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white tracking-tight">
                  Dashboard da Fila
                </h1>
                <p className="text-brand-gray-400 text-lg mt-1 flex items-center">
                  Monitoramento em tempo real dos seus criativos
                  {(stats.queued > 0 || stats.processing > 0) && (
                    <span className="ml-3 flex items-center text-brand-neon-green text-sm">
                      <div className="w-2 h-2 bg-brand-neon-green rounded-full animate-pulse mr-2"></div>
                      Live
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                onClick={refreshData}
                disabled={isRefreshing}
                className="btn-ghost h-11 px-4"
              >
                <RefreshCw className={cn("w-4 h-4 mr-2", isRefreshing && "animate-spin")} />
                Atualizar
              </Button>

              <Button
                onClick={handleProcessQueue}
                disabled={isProcessingQueue || activeJobs === 0}
                className="btn-neon h-11 px-6"
              >
                {isProcessingQueue ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Zap className="w-4 h-4 mr-2" />
                )}
                {isProcessingQueue ? "Processando..." : "Processar Fila"}
              </Button>
            </div>
          </div>

          {/* Dashboard de Métricas */}
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
            {/* Total */}
            <Card className="card-glass-intense border-brand-gray-700/50 hover:border-brand-neon-green/30 transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-white">{stats.total}</div>
                    <div className="text-brand-gray-400 text-sm">Total</div>
                  </div>
                  <FileImage className="w-8 h-8 text-brand-gray-500" />
                </div>
              </CardContent>
            </Card>

            {/* Ativos */}
            <Card className="card-glass-intense border-yellow-500/30 hover:border-yellow-400/50 transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-yellow-400">{activeJobs}</div>
                    <div className="text-brand-gray-400 text-sm">Ativos</div>
                  </div>
                  <Activity className="w-8 h-8 text-yellow-400" />
                </div>
                {activeJobs > 0 && (
                  <div className="mt-2">
                    <div className="w-full bg-brand-gray-800 rounded-full h-1.5">
                      <div 
                        className="bg-yellow-400 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((activeJobs / stats.total) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Processando */}
            <Card className="card-glass-intense border-blue-500/30 hover:border-blue-400/50 transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-blue-400">{stats.processing}</div>
                    <div className="text-brand-gray-400 text-sm">Processando</div>
                  </div>
                  <Loader2 className={cn("w-8 h-8 text-blue-400", stats.processing > 0 && "animate-spin")} />
                </div>
              </CardContent>
            </Card>

            {/* Concluídos */}
            <Card className="card-glass-intense border-brand-neon-green/30 hover:border-brand-neon-green/50 transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-brand-neon-green">{stats.completed}</div>
                    <div className="text-brand-gray-400 text-sm">Concluídos</div>
                  </div>
                  <CheckCircle2 className="w-8 h-8 text-brand-neon-green" />
                </div>
              </CardContent>
            </Card>

            {/* Taxa de Sucesso */}
            <Card className="card-glass-intense border-purple-500/30 hover:border-purple-400/50 transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-purple-400">{successRate}%</div>
                    <div className="text-brand-gray-400 text-sm">Sucesso</div>
                  </div>
                  <TrendingUp className="w-8 h-8 text-purple-400" />
                </div>
              </CardContent>
            </Card>

            {/* Falharam */}
            <Card className="card-glass-intense border-red-500/30 hover:border-red-400/50 transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-red-400">{stats.failed}</div>
                    <div className="text-brand-gray-400 text-sm">Falharam</div>
                  </div>
                  <XOctagon className="w-8 h-8 text-red-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filtros Premium */}
          <Card className="card-glass-intense border-brand-gray-700/50 mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-brand-gray-400" />
                    <span className="text-white font-medium text-sm">Filtros:</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {[
                      { key: "all", label: "Todos", count: stats.total },
                      { key: "queued", label: "Na Fila", count: stats.queued },
                      { key: "processing", label: "Processando", count: stats.processing },
                      { key: "completed", label: "Concluídos", count: stats.completed },
                      { key: "failed", label: "Falharam", count: stats.failed },
                      { key: "draft", label: "Rascunhos", count: stats.draft }
                    ].map(filter => (
                      <Button
                        key={filter.key}
                        onClick={() => setFilterStatus(filter.key)}
                        className={cn(
                          "h-9 px-4 text-sm transition-all duration-300",
                          filterStatus === filter.key 
                            ? "bg-brand-neon-green/20 text-brand-neon-green border-brand-neon-green/30 hover:bg-brand-neon-green/30" 
                            : "btn-ghost hover:bg-brand-gray-700/50"
                        )}
                      >
                        {filter.label}
                        {filter.count > 0 && (
                          <Badge className="ml-2 bg-brand-gray-700/50 text-white text-xs px-1.5 py-0.5">
                            {filter.count}
                          </Badge>
                        )}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-brand-gray-400 text-sm">
                    {filteredRequests.length + filteredCreatives.length} {filteredRequests.length + filteredCreatives.length === 1 ? 'item' : 'itens'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Criativos */}
        <div className="space-y-4">
          {(filteredRequests.length + filteredCreatives.length) === 0 ? (
            <Card className="card-glass-intense border-brand-gray-700/50">
              <CardContent className="p-16 text-center">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-brand-gray-600/20 rounded-full blur-xl"></div>
                  <div className="relative w-20 h-20 bg-gradient-to-br from-brand-gray-700 to-brand-gray-800 rounded-full flex items-center justify-center mx-auto">
                    <Clock className="w-10 h-10 text-brand-gray-500" />
                  </div>
                </div>
                <h3 className="text-2xl font-semibold text-white mb-3">
                  {filterStatus === "all" 
                    ? "Nenhum criativo encontrado" 
                    : `Nenhum criativo ${STATUS_CONFIG[filterStatus as keyof typeof STATUS_CONFIG]?.label.toLowerCase() || filterStatus}`
                  }
                </h3>
                <p className="text-brand-gray-400 text-lg max-w-md mx-auto">
                  {filterStatus === "all" 
                    ? "Você ainda não criou nenhum criativo. Que tal começar criando seu primeiro?" 
                    : `Não há criativos com status "${STATUS_CONFIG[filterStatus as keyof typeof STATUS_CONFIG]?.label || filterStatus}" no momento.`
                  }
                </p>
                {filterStatus === "all" && (
                  <Button className="btn-neon mt-6" onClick={() => window.location.href = '/new'}>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Criar Primeiro Criativo
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <>
              {/* NOVOS: Renderizar Creative Requests */}
              {filteredRequests.map((request) => (
                <CreativeRequestCard key={request.id} request={request} onUpdate={refreshData} />
              ))}

              {/* ANTIGOS: Renderizar Creatives Individuais */}
              {filteredCreatives.map((creative) => {
                const statusConfig = STATUS_CONFIG[creative.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.draft;
                const StatusIcon = statusConfig.icon;
                const progress = getProgress(creative);
                const latestJob = creative.queue_jobs?.[0];
    
                return (
                  <Card 
                    key={creative.id} 
                    className="card-glass-intense border-brand-gray-700/50 hover:border-brand-neon-green/30 transition-all duration-500 group"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        
                        {/* Informações Principais */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start space-x-4">
                            
                            {/* Status Icon */}
                            <div className="flex-shrink-0">
                              <div className="relative">
                                <div className={cn(
                                  "absolute inset-0 rounded-xl blur-md transition-all duration-300",
                                  creative.status === 'completed' && "bg-brand-neon-green/20",
                                  creative.status === 'processing' && "bg-yellow-500/20",
                                  creative.status === 'failed' && "bg-red-500/20",
                                  creative.status === 'queued' && "bg-blue-500/20"
                                )}></div>
                                <div className={cn(
                                  "relative w-14 h-14 rounded-xl border flex items-center justify-center transition-all duration-300",
                                  "bg-gradient-to-br", statusConfig.gradient,
                                  statusConfig.color.includes('border-') ? statusConfig.color.split(' ').find(c => c.includes('border-')) : "border-brand-gray-700"
                                )}>
                                  <StatusIcon className={cn(
                                    "w-7 h-7 transition-all duration-300",
                                    creative.status === 'processing' && 'animate-spin',
                                    creative.status === 'completed' && 'text-brand-neon-green',
                                    creative.status === 'failed' && 'text-red-400',
                                    creative.status === 'processing' && 'text-yellow-400',
                                    creative.status === 'queued' && 'text-blue-400',
                                    creative.status === 'draft' && 'text-brand-gray-400'
                                  )} />
                                </div>
                              </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              
                              {/* Header */}
                              <div className="flex items-center space-x-3 mb-3">
                                <h3 className="text-xl font-semibold text-white truncate group-hover:text-brand-neon-green transition-colors duration-300">
                                  {creative.title}
                                </h3>
                                
                                <Badge className={cn("text-xs font-medium", statusConfig.color)}>
                                  {statusConfig.label}
                                </Badge>
                                
                                <Badge className="bg-brand-gray-700/50 text-brand-gray-300 border-brand-gray-600/50 text-xs">
                                  {FORMAT_LABELS[creative.format as keyof typeof FORMAT_LABELS] || creative.format}
                                </Badge>
                              </div>

                              {/* Description */}
                              <p className="text-brand-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">
                                {creative.prompt}
                              </p>

                              {/* Progress Bar */}
                              <div className="mb-4">
                                <div className="flex items-center justify-between text-xs text-brand-gray-400 mb-2">
                                  <span className="font-medium">{statusConfig.description}</span>
                                  <span className="font-mono">{progress}%</span>
                                </div>
                                <div className="relative">
                                  <Progress 
                                    value={progress} 
                                    className="h-2 bg-brand-gray-800/50"
                                  />
                                  {creative.status === 'processing' && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent h-2 rounded-full animate-pulse"></div>
                                  )}
                                </div>
                              </div>

                              {/* Metadata */}
                              <div className="flex items-center space-x-4 text-xs text-brand-gray-500 mb-3">
                                <div className="flex items-center space-x-1">
                                  <Calendar className="w-3 h-3" />
                                  <span>
                                    {new Date(creative.created_at).toLocaleDateString('pt-BR', {
                                      day: '2-digit',
                                      month: '2-digit',
                                      year: 'numeric'
                                    })}
                                  </span>
                                </div>
                                
                                {latestJob && (
                                  <>
                                    <span>•</span>
                                    <span>Tentativas: {latestJob.attempts}</span>
                                    
                                    {latestJob.processing_started_at && (
                                      <>
                                        <span>•</span>
                                        <span>
                                          Iniciado: {new Date(latestJob.processing_started_at).toLocaleTimeString('pt-BR', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                          })}
                                        </span>
                                      </>
                                    )}
                                  </>
                                )}
                              </div>

                              {/* Error Message */}
                              {creative.status === 'failed' && creative.error_message && (
                                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg backdrop-blur-sm">
                                  <div className="flex items-start space-x-3">
                                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                    <div className="text-red-400 text-sm">
                                      <div className="font-semibold mb-1">Erro no processamento:</div>
                                      <div className="text-red-300 leading-relaxed">{creative.error_message}</div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2 flex-shrink-0 ml-6">
                          {creative.status === 'completed' && creative.result_url && (
                            <>
                              <Button
                                className="btn-ghost h-10 w-10 p-0 hover:bg-brand-neon-green/10 hover:text-brand-neon-green transition-all duration-300"
                                onClick={() => setPreviewCreative(creative)}
                                title="Visualizar criativo"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              
                              <Button
                                className="btn-ghost h-10 w-10 p-0 hover:bg-blue-500/10 hover:text-blue-400 transition-all duration-300"
                                onClick={() => handleSmartDownload(creative)}
                                title="Baixar criativo"
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                            </>
                          )}

                          {creative.status === 'failed' && (
                            <Button
                              className="btn-ghost h-10 w-10 p-0 hover:bg-yellow-500/10 hover:text-yellow-400 transition-all duration-300"
                              onClick={() => handleReprocess(creative.id)}
                              title="Reprocessar criativo"
                            >
                              <RotateCcw className="w-4 h-4" />
                            </Button>
                          )}

                          {(creative.status === 'draft' || creative.status === 'failed') && (
                            <Button
                              className="btn-ghost h-10 w-10 p-0 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300"
                              onClick={() => {
                                if (confirm(`Tem certeza que deseja excluir "${creative.title}"?`)) {
                                  handleDelete(creative.id);
                                }
                              }}
                              title="Excluir criativo"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </>
          )}
        </div>

        {/* Footer Info */}
        {(filteredRequests.length + filteredCreatives.length) > 0 && (
          <Card className="card-glass-intense border-brand-gray-700/50 mt-8">
            <CardContent className="p-4">
              <div className="flex items-center justify-center space-x-6 text-sm text-brand-gray-400">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-brand-neon-green rounded-full animate-pulse"></div>
                  <span>Atualização automática a cada 5 segundos</span>
                </div>
                <span>•</span>
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4" />
                  <span>Dashboard em tempo real</span>
                </div>
                <span>•</span>
                <span>{filteredRequests.length + filteredCreatives.length} de {stats.total} criativos exibidos</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Modal de Preview */}
        {previewCreative && (
          <CreativePreviewModal
            creative={previewCreative}
            isOpen={!!previewCreative}
            onClose={() => setPreviewCreative(null)}
          />
        )}
      </div>
    </div>
  );
} 