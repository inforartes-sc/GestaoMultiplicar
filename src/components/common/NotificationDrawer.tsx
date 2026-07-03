import React from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, Check, Trash2, X, UserCheck, AlertTriangle, ShieldCheck, Award } from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useApp();

  if (!isOpen) return null;

  const naoLidas = notifications.filter((n) => !n.lido).length;

  const getIcon = (tipo: string) => {
    switch (tipo) {
      case 'NOVO_CADASTRO':
        return <UserCheck className="w-5 h-5 text-emerald-600" />;
      case 'MULTIPLICADOR_INATIVO':
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'SISTEMA':
        return <ShieldCheck className="w-5 h-5 text-blue-600" />;
      case 'META_ATINGIDA':
        return <Award className="w-5 h-5 text-purple-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Cabeçalho */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-400 animate-pulse" />
            <h3 className="font-semibold text-lg">Central de Notificações</h3>
            {naoLidas > 0 && (
              <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {naoLidas} nova{naoLidas > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Ações Rápidas */}
        {naoLidas > 0 && (
          <div className="p-3 bg-slate-50 border-b border-slate-200 flex justify-end">
            <button
              onClick={markAllNotificationsAsRead}
              className="text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1.5 px-2 py-1 hover:bg-blue-50 rounded-md transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              Marcar todas como lidas
            </button>
          </div>
        )}

        {/* Lista */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2">
          {notifications.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <Bell className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Nenhuma notificação no momento</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`p-3 rounded-lg mb-1 transition-all flex items-start gap-3 ${
                  n.lido ? 'bg-white opacity-70 hover:opacity-100' : 'bg-blue-50/60 border-l-4 border-blue-600 shadow-2xs'
                }`}
              >
                <div className="p-2 bg-white rounded-lg shadow-2xs border border-slate-100 shrink-0">
                  {getIcon(n.tipo)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-semibold text-slate-800 truncate">{n.titulo}</h4>
                    <span className="text-[10px] text-slate-400 shrink-0">
                      {new Date(n.dataHora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.mensagem}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">
                      {new Date(n.dataHora).toLocaleDateString('pt-BR')}
                    </span>
                    {!n.lido && (
                      <button
                        onClick={() => markNotificationAsRead(n.id)}
                        className="text-[11px] font-medium text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" /> Lido
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Rodapé */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-500">
          Notificações automáticas geradas em tempo real pelas atividades dos multiplicadores.
        </div>
      </div>
    </div>
  );
};
