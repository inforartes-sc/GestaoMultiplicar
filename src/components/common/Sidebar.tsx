import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  ShieldCheck, 
  Settings, 
  FileText, 
  Database
} from 'lucide-react';

interface SidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, setIsMobileOpen }) => {
  const { currentUser, activeTab, setActiveTab, getFilteredEleitores, users, settings } = useApp();

  if (!currentUser) return null;

  const isSuperAdmin = currentUser.role === 'SUPER_ADMIN';
  const eleitoresFiltrados = getFilteredEleitores();

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
      adminOnly: false,
    },
    {
      id: 'eleitores',
      label: 'Eleitores',
      icon: Users,
      badge: eleitoresFiltrados.length,
      adminOnly: false,
    },
    {
      id: 'multiplicadores',
      label: 'Multiplicadores',
      icon: UserPlus,
      badge: isSuperAdmin ? users.length : null,
      adminOnly: true,
    },
    {
      id: 'auditoria',
      label: 'Auditoria & Logs',
      icon: FileText,
      badge: null,
      adminOnly: true,
    },
    {
      id: 'lgpd',
      label: 'Conformidade LGPD',
      icon: ShieldCheck,
      badge: '100%',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
      adminOnly: false,
    },
    {
      id: 'configuracoes',
      label: 'Configurações',
      icon: Settings,
      badge: null,
      adminOnly: true,
    },
  ];

  return (
    <>
      {/* Overlay para mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 lg:z-auto h-full w-64 bg-slate-900 text-white flex flex-col shrink-0 border-r border-slate-800 transition-transform duration-200 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3 font-bold text-xl tracking-tight text-indigo-400 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white text-sm font-black shadow-sm">
              V&V
            </div>
            <span className="truncate">{settings.nomeSistema || 'VOZ & VOTO'}</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
            Navegação Geral
          </div>

          {navItems.map((item) => {
            if (item.adminOnly && !isSuperAdmin) return null;
            const Icon = item.icon;
            const active = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg font-medium text-sm transition-colors cursor-pointer ${
                  active
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-900/40 font-semibold'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== null && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded font-bold ${
                      item.badgeColor || (active ? 'bg-indigo-700 text-white' : 'bg-slate-800 text-slate-300')
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Rodapé do Menu */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60">
          <div className="p-3 bg-slate-800/60 rounded-lg border border-slate-800">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-200 mb-1">
              <span>Escopo de Acesso</span>
              <Database className="w-4 h-4 text-indigo-400" />
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">
              {isSuperAdmin
                ? 'Base Global — Visão corporativa unificada.'
                : 'Filtrado por ID de multiplicador ativo.'}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
