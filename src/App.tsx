import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LoginPage } from './components/auth/LoginPage';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { SuperAdminDashboard } from './components/dashboard/SuperAdminDashboard';
import { MultiplicadorDashboard } from './components/dashboard/MultiplicadorDashboard';
import { EleitoresList } from './components/eleitores/EleitoresList';
import { MultiplicadoresList } from './components/multiplicadores/MultiplicadoresList';
import { AuditLogsPage } from './components/audit/AuditLogsPage';
import { LgpdCompliancePage } from './components/settings/LgpdCompliancePage';
import { SystemSettingsPage } from './components/settings/SystemSettingsPage';
import { Menu, ShieldAlert } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { currentUser, activeTab, setActiveTab } = useApp();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  if (!currentUser) {
    return <LoginPage />;
  }

  const isSuperAdmin = currentUser.role === 'SUPER_ADMIN';

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return isSuperAdmin ? <SuperAdminDashboard /> : <MultiplicadorDashboard />;
      case 'eleitores':
        return <EleitoresList />;
      case 'multiplicadores':
        if (!isSuperAdmin) {
          return (
            <div className="bg-red-50 border border-red-200 p-8 rounded-3xl text-center max-w-lg mx-auto my-12">
              <ShieldAlert className="w-12 h-12 text-red-600 mx-auto mb-3" />
              <h2 className="text-lg font-bold text-red-950">Acesso Restrito ao Super Administrador</h2>
              <p className="text-xs text-red-800 mt-2">
                Como Multiplicador, seu acesso é isolado e restrito aos seus próprios registros de eleitores.
              </p>
              <button
                onClick={() => setActiveTab('dashboard')}
                className="mt-4 px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-xl"
              >
                Voltar ao Painel
              </button>
            </div>
          );
        }
        return <MultiplicadoresList />;
      case 'auditoria':
        if (!isSuperAdmin) {
          return (
            <div className="bg-red-50 border border-red-200 p-8 rounded-3xl text-center max-w-lg mx-auto my-12">
              <ShieldAlert className="w-12 h-12 text-red-600 mx-auto mb-3" />
              <h2 className="text-lg font-bold text-red-950">Acesso Restrito à Auditoria</h2>
              <p className="text-xs text-red-800 mt-2">
                A visualização de logs de auditoria e endereços IP é de uso exclusivo da coordenação geral.
              </p>
            </div>
          );
        }
        return <AuditLogsPage />;
      case 'lgpd':
        return <LgpdCompliancePage />;
      case 'configuracoes':
        if (!isSuperAdmin) {
          return <LgpdCompliancePage />;
        }
        return <SystemSettingsPage />;
      default:
        return isSuperAdmin ? <SuperAdminDashboard /> : <MultiplicadorDashboard />;
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden font-sans bg-slate-50 text-slate-900">
      
      {/* Sidebar Lateral */}
      <Sidebar isMobileOpen={isMobileSidebarOpen} setIsMobileOpen={setIsMobileSidebarOpen} />

      {/* Main Content Column */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Header Superior (Navbar) */}
        <Navbar />

        {/* Botão Mobile de Abertura de Menu */}
        <div className="lg:hidden bg-slate-900 text-white px-4 py-2.5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <span className="text-xs font-bold text-slate-300">
            📍 {currentUser.role === 'SUPER_ADMIN' ? 'Centro de Comando' : `Zona: ${currentUser.cidade}`}
          </span>
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-200 flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
          >
            <Menu className="w-4 h-4" /> Menu
          </button>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-6 lg:p-8 flex-1 overflow-y-auto space-y-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {renderContent()}
          </div>
        </div>

        {/* System Footer */}
        <footer className="h-10 bg-slate-100 border-t border-slate-200 px-4 sm:px-8 flex items-center justify-between text-[10px] text-slate-500 uppercase tracking-widest shrink-0">
          <div className="truncate">© {new Date().getFullYear()} Voz & Voto — Sistema de Gestão Estratégica</div>
          <div className="hidden sm:flex items-center gap-4">
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Status: Online</span>
            <span>Segurança: SSL Criptografado</span>
            <span>LGPD Compliant</span>
          </div>
        </footer>

      </main>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
