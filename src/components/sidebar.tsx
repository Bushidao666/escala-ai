"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
  Flame, 
  Home, 
  Plus, 
  Clock, 
  Settings, 
  LogOut, 
  Sparkles,
  Zap,
  Image,
  User,
  ChevronRight
} from "lucide-react";
import { signOut } from "@/app/auth/actions";
import { createClient } from "@/lib/supabase/client";
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const navigation = [
  {
    name: "Galeria",
    href: "/gallery",
    icon: Image,
    description: "Explore seus criativos"
  },
  {
    name: "Novo Criativo",
    href: "/new",
    icon: Plus,
    description: "Criar novo conteúdo"
  },
  {
    name: "Fila de Processamento",
    href: "/queue",
    icon: Clock,
    description: "Acompanhar progresso"
  },
  {
    name: "Configurações",
    href: "/settings",
    icon: Settings,
    description: "Ajustar preferências"
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState<{ name: string, email: string } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getUser();

      if (data.user) {
        const userName = data.user.user_metadata?.name || data.user.email?.split('@')[0] || "Usuário";
        setUser({
          name: userName,
          email: data.user.email || "Nenhum email",
        });
      }
    };
    fetchUser();
  }, []);

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="sidebar-glass w-80 flex flex-col h-screen sticky top-0 bg-brand-black/60 border-r border-brand-gray-800 backdrop-blur-xl">
      {/* Header */}
      <div className="p-6 border-b border-brand-gray-800">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="absolute inset-0 bg-brand-neon-green/20 rounded-xl blur-lg animate-glow-pulse"></div>
            <div className="relative bg-gradient-to-br from-brand-neon-green to-brand-neon-green-dark p-3 rounded-xl">
              <Flame className="w-6 h-6 text-brand-black" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold">
              <span className="text-gradient-neon">Creative</span>{" "}
              <span className="text-white">Gen</span>
            </h1>
            <p className="text-brand-gray-500 text-sm font-medium">
              AI Creative Studio
            </p>
          </div>
        </div>
      </div>

      {/* User Profile Section */}
      <div className="p-6 border-b border-brand-gray-800">
        <div className="p-4 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 relative">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-brand-neon-green/20 to-brand-neon-green/10 rounded-full flex items-center justify-center border border-brand-gray-600">
              <User className="w-5 h-5 text-brand-neon-green" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user ? user.name : "Carregando..."}
              </p>
              <p className="text-xs text-brand-gray-500 truncate">
                {user ? user.email : "..."}
              </p>
            </div>
            <div className="flex items-center space-x-1">
              <Sparkles className="w-4 h-4 text-brand-neon-green" />
              <span className="text-xs font-medium text-brand-neon-green">PRO</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <div className="mb-4">
          <h2 className="text-xs font-semibold text-brand-gray-500 uppercase tracking-wider mb-2 px-2">
            Navegação
          </h2>
          
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center justify-between p-3 rounded-lg transition-colors duration-200 ease-in-out",
                  "hover:bg-white/5",
                  isActive 
                    ? "bg-white/10 shadow-inner shadow-white/5" 
                    : ""
                )}
              >
                <div className="flex items-center space-x-3">
                  <div className={cn(
                    "p-2 rounded-md transition-all duration-300 border",
                    isActive 
                      ? "bg-transparent border-brand-neon-green/50 text-brand-neon-green backdrop-blur-sm shadow-lg shadow-brand-neon-green/20" 
                      : "bg-brand-gray-800 border-transparent text-brand-gray-400 group-hover:bg-brand-gray-700 group-hover:text-white"
                  )}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className={cn(
                      "text-sm font-medium transition-colors duration-200",
                      isActive ? "text-white" : "text-brand-gray-300 group-hover:text-white"
                    )}>
                      {item.name}
                    </p>
                  </div>
                </div>
                
                {isActive && (
                  <div className="w-2 h-2 rounded-full bg-brand-neon-green shadow-[0_0_8px_0px] shadow-brand-neon-green/70">
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Stats Section */}
      <div className="px-4 pb-4">
        <div className="bg-brand-gray-900/50 rounded-xl p-4 space-y-3 border border-brand-gray-800 shadow-inner shadow-black/20">
          <h3 className="text-sm font-semibold text-white mb-3">
            Estatísticas do Mês
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center">
              <p className="text-2xl font-bold text-brand-neon-green">42</p>
              <p className="text-xs text-brand-gray-500">Criativos</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">1.2k</p>
              <p className="text-xs text-brand-gray-500">Visualizações</p>
            </div>
          </div>
          
          <div className="pt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-brand-gray-500">Limite mensal</span>
              <span className="text-brand-neon-green font-medium">42/100</span>
            </div>
            <div className="mt-2 w-full bg-black/30 rounded-full h-1.5">
              <div 
                className="bg-gradient-to-r from-brand-neon-green to-brand-neon-green-dark h-1.5 rounded-full"
                style={{ width: "42%" }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-brand-gray-800">
        <form action={handleSignOut} className="w-full">
          <Button 
            type="submit"
            className="w-full justify-start text-red-400 border border-transparent bg-transparent hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-300 transition-colors duration-200"
          >
            <LogOut className="w-4 h-4 mr-3" />
            Sair da Conta
          </Button>
        </form>
      </div>
    </div>
  );
} 