"use client";

import { Button } from '@/components/ui/button';
import { Trash2, X } from 'lucide-react';

interface ActionBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}

export function ActionBar({ 
  selectedCount, 
  onClearSelection, 
  onDelete,
  isDeleting
}: ActionBarProps) {
  // A barra só é renderizada se houver itens selecionados
  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className="sticky top-4 z-20 w-full">
      <div className="max-w-md mx-auto p-2 flex items-center justify-between bg-brand-neon-green/90 text-brand-black rounded-lg shadow-2xl shadow-brand-neon-green/20 backdrop-blur-sm animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="flex items-center gap-4">
          <span className="font-bold text-lg px-2">{selectedCount}</span>
          <p className="font-semibold">
            {selectedCount > 1 ? 'itens selecionados' : 'item selecionado'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={onDelete}
            disabled={isDeleting}
            className="bg-brand-black text-red-400 hover:bg-brand-gray-900 h-9 px-3"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Excluir
          </Button>
          <Button
            onClick={onClearSelection}
            className="bg-transparent hover:bg-brand-black/20 h-9 w-9 p-0"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
} 