import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { printOrExportPDF } from '../../utils/exportUtils';
import { 
  FileText, 
  Search, 
  Filter, 
  ShieldCheck, 
  Printer, 
  LogOut, 
  LogIn, 
  PlusCircle, 
  Edit, 
  Trash, 
  Lock,
  Clock,
  User,
  Activity
} from 'lucide-react';

export const AuditLogsPage: React.FC = () => {
  const { auditLogs } = useApp();
  const [filtroAcao, setFiltroAcao] = useState<string>('TODAS');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = auditLogs.filter((log) => {
    if (filtroAcao !== 'TODAS' && log.acao !== filtroAcao) return false;
    if (searchTerm.trim()) {
      const termo = searchTerm.toLowerCase();
      const comb = `${log.usuarioNome} ${log.ip} ${log.detalhes} ${log.acao}`.toLowerCase();
      if (!comb.includes(termo)) return false;
    }
    return true;
  });

  const getAcaoBadge = (acao: string) => {
    switch (acao) {
      case 'LOGIN':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 flex items-center gap-1"><LogIn className="w-3 h-3" /> LOGIN</span>;
      case 'LOGOUT':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-800 flex items-center gap-1"><LogOut className="w-3 h-3" /> LOGOUT</span>;
      case 'CRIACAO':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1"><PlusCircle className="w-3 h-3" /> CRIAÇÃO</span>;
      case 'ALTERACAO':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1"><Edit className="w-3 h-3" /> ALTERAÇÃO</span>;
      case 'EXCLUSAO':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800 flex items-center gap-1"><Trash className="w-3 h-3" /> EXCLUSÃO</span>;
      case 'LGPD':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> LGPD</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">{acao}</span>;
    }
  };

  const handlePrintLogs = () => {
    const cabecalhos = ['Data / Hora', 'Usuário Responsável', 'Perfil', 'Ação', 'Endereço IP', 'Detalhes da Atividade'];
    const linhas = filteredLogs.map((l) => [
      new Date(l.dataHora).toLocaleString('pt-BR'),
      l.usuarioNome,
      l.perfil,
      l.acao,
      l.ip,
      l.detalhes,
    ]);
    printOrExportPDF('Relatório de Auditoria e Segurança de Acessos', `Trilha de auditoria oficial em conformidade com a LGPD • ${filteredLogs.length} eventos`, cabecalhos, linhas);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Cabeçalho */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <Activity className="w-6 h-6 text-indigo-600" />
            Trilha de Auditoria & Logs de Acesso
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Registro imutável de todas as atividades, acessos e alterações realizadas no sistema.
          </p>
        </div>

        <button
          onClick={handlePrintLogs}
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
        >
          <Printer className="w-4 h-4" /> Exportar Relatório de Auditoria
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="md:col-span-8 relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pesquisar por usuário, IP ou descrição do evento..."
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:border-blue-600"
          />
        </div>

        <div className="md:col-span-4">
          <select
            value={filtroAcao}
            onChange={(e) => setFiltroAcao(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-hidden font-bold"
          >
            <option value="TODAS">⚡ Todas as Ações</option>
            <option value="LOGIN">🔑 Login de Sessão</option>
            <option value="LOGOUT">🚪 Logout</option>
            <option value="CRIACAO">➕ Cadastros (Criação)</option>
            <option value="ALTERACAO">✏️ Alterações / Edição</option>
            <option value="EXCLUSAO">🗑️ Exclusão de Registros</option>
            <option value="LGPD">🛡️ Auditoria LGPD</option>
          </select>
        </div>
      </div>

      {/* Tabela de Logs */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-white font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Data & Hora</th>
                <th className="py-3.5 px-4">Usuário / Perfil</th>
                <th className="py-3.5 px-4">Endereço IP</th>
                <th className="py-3.5 px-4">Ação</th>
                <th className="py-3.5 px-4">Detalhes do Evento</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    <FileText className="w-10 h-10 mx-auto mb-2 opacity-30" />
                    Nenhum registro de auditoria encontrado.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors font-mono text-[11px]">
                    <td className="py-3 px-4 text-slate-500 font-bold whitespace-nowrap">
                      {new Date(log.dataHora).toLocaleString('pt-BR')}
                    </td>
                    <td className="py-3 px-4 font-sans">
                      <div className="font-bold text-slate-900 text-xs">{log.usuarioNome}</div>
                      <div className="text-[10px] text-slate-400 uppercase">{log.perfil}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-semibold">{log.ip}</td>
                    <td className="py-3 px-4">{getAcaoBadge(log.acao)}</td>
                    <td className="py-3 px-4 font-sans text-slate-700 leading-normal max-w-md">
                      {log.detalhes}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
