import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Bell, 
  ShieldCheck, 
  User, 
  LogOut, 
  ChevronDown, 
  Users, 
  Award, 
  Sparkles,
  RefreshCw,
  Search
} from 'lucide-react';
import { NotificationDrawer } from './NotificationDrawer';

export const Navbar: React.FC = () => {
  const { currentUser, users, switchProfile, logout, notifications, settings, setActiveTab, searchTerm, setSearchTerm } = useApp();
  const [showProfileSwitcher, setShowProfileSwitcher] = useState(false);
  const [showNotifDrawer, setShowNotifDrawer] = useState(false);
  const switcherRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (switcherRef.current && !switcherRef.current.contains(e.target as Node)) {
        setShowProfileSwitcher(false);
      }
    };
    if (showProfileSwitcher) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [showProfileSwitcher]);

  if (!currentUser) return null;

  const naoLidas = notifications.filter((n) => !n.lido).length;

  const handleGlobalSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveTab('eleitores');
  };

  return (
    <>
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 shrink-0 sticky top-0 z-30">
        
        {/* Seção Esquerda: Busca Rápida */}
        <div className="flex items-center gap-4 flex-1 max-w-md">
          <form onSubmit={handleGlobalSearchSubmit} className="relative w-full">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setActiveTab('eleitores');
              }}
              placeholder="Pesquisar eleitores por CPF, Nome ou Título..."
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-full text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-slate-50 text-slate-800 placeholder:text-slate-400"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          </form>
        </div>

        {/* Seção Direita: Controles e Perfil */}
        <div className="flex items-center gap-3 sm:gap-6">
          
          {/* Selo LGPD */}
          <button
            onClick={() => setActiveTab('lgpd')}
            className="hidden xl:flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors cursor-pointer"
            title="Auditado e em conformidade com a LGPD"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>LGPD Compliant</span>
          </button>



          {/* Sino de Notificações */}
          <button
            onClick={() => setShowNotifDrawer(true)}
            className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors cursor-pointer"
            title="Notificações do Sistema"
          >
            <Bell className="w-5 h-5" />
            {naoLidas > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse" />
            )}
          </button>

          {/* Perfil */}
          <div className="flex items-center gap-3 pl-4 sm:pl-6 border-l border-slate-200">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-900 leading-tight truncate max-w-[140px]">
                {currentUser.nome}
              </p>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                {currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'MASTER' ? 'Super Administrador' : 'Multiplicador'}
              </p>
            </div>
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-sm shrink-0">
              {currentUser.nome.substring(0, 2).toUpperCase()}
            </div>

            {/* Botão Sair */}
            <button
              onClick={logout}
              className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              title="Sair do Sistema"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>
      </header>

      <NotificationDrawer isOpen={showNotifDrawer} onClose={() => setShowNotifDrawer(false)} />
    </>
  );
};
