import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User } from '../../types';
import { MultiplicadorFormModal } from './MultiplicadorFormModal';
import { MultiplicadorEleitoresModal } from './MultiplicadorEleitoresModal';
import { ConfirmModal } from '../common/ConfirmModal';
import { printOrExportPDF } from '../../utils/exportUtils';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  ShieldAlert, 
  Edit3, 
  Trash2, 
  KeyRound, 
  Award, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  XCircle,
  TrendingUp,
  Printer,
  Eye,
  ChevronRight
} from 'lucide-react';

export const MultiplicadoresList: React.FC = () => {
  const { users, eleitores, deleteUser, toggleUserStatus, resetUserPassword } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userEditing, setUserEditing] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [viewingEleitoresFor, setViewingEleitoresFor] = useState<User | null>(null);
  const [resetPasswordUser, setResetPasswordUser] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState('123456');
  const [resetSuccessMessage, setResetSuccessMessage] = useState<string | null>(null);

  const multiplicadores = users.filter((u) => u.role !== 'MASTER');

  const handleDelete = (u: User) => {
    const contagem = eleitores.filter((e) => e.multiplicadorId === u.id).length;
    if (contagem > 0) {
      alert(`Atenção: O multiplicador "${u.nome}" possui ${contagem} eleitores cadastrados. Recomendamos inativar o multiplicador em vez de excluir.`);
      return;
    }
    setUserToDelete(u);
  };

  const handleResetPassword = (u: User) => {
    setResetPasswordUser(u);
    setNewPassword('123456');
    setResetSuccessMessage(null);
  };

  const handlePrintReport = () => {
    const cabecalhos = ['Nome do Multiplicador', 'Login', 'Telefone', 'Cidade', 'Situação', 'Cadastros', 'Meta'];
    const linhas = multiplicadores.map((m) => {
      const contagem = eleitores.filter((e) => e.multiplicadorId === m.id).length;
      return [
        m.nome,
        m.login,
        m.telefone,
        m.cidade,
        m.situacao,
        contagem,
        `${m.metaMensal || 25} (${Math.round((contagem / (m.metaMensal || 25)) * 100)}%)`,
      ];
    });
    printOrExportPDF('Relatório Geral de Multiplicadores Políticos', `Equipe de coordenação • Total: ${multiplicadores.length} lideranças`, cabecalhos, linhas);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Cabeçalho */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <Award className="w-6 h-6 text-indigo-600" />
            Gestão de Multiplicadores
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Crie, edite, bloqueie e monitore as metas de cada liderança regional.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={handlePrintReport}
            className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4 text-slate-600" /> Imprimir Relatório
          </button>

          <button
            onClick={() => {
              setUserEditing(null);
              setIsModalOpen(true);
            }}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/30 transition-all flex items-center gap-2 cursor-pointer grow sm:grow-0 justify-center"
          >
            <UserPlus className="w-4 h-4" /> Cadastrar Multiplicador
          </button>
        </div>
      </div>

      {/* Grid de Multiplicadores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {multiplicadores.map((m) => {
          const cadastrados = eleitores.filter((e) => e.multiplicadorId === m.id).length;
          const meta = m.metaMensal || 25;
          const percentual = Math.min(Math.round((cadastrados / meta) * 100), 100);

          return (
            <div
              key={m.id}
              className={`bg-white rounded-3xl border transition-all shadow-xs hover:shadow-md overflow-hidden flex flex-col justify-between ${
                m.situacao === 'ATIVO' ? 'border-slate-200' : 'border-red-200 bg-red-50/20 opacity-85'
              }`}
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm text-white shrink-0 shadow-md ${
                      m.situacao === 'ATIVO' ? 'bg-indigo-600 shadow-indigo-600/20' : 'bg-slate-400'
                    }`}>
                      {m.nome.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <h3 className="font-bold text-sm text-slate-900 truncate" title={m.nome}>{m.nome}</h3>
                        {m.role === 'SUPER_ADMIN' && (
                          <span className="px-1.5 py-0.5 rounded-sm bg-blue-100 text-blue-800 text-[8px] font-black uppercase tracking-wider shrink-0" title="Administrador do Sistema">
                            Admin
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 font-mono">Login: {m.login}</p>
                    </div>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase shrink-0 ${
                    m.situacao === 'ATIVO' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {m.situacao}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{m.telefone || 'Sem telefone'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-semibold text-slate-800">{m.cidade}</span>
                  </div>
                </div>

                {/* Meta & Progresso */}
                <div 
                  onClick={() => setViewingEleitoresFor(m)}
                  className="mt-4 pt-3 border-t border-slate-100 p-2 -mx-2 rounded-2xl hover:bg-indigo-50/70 transition-all cursor-pointer group"
                  title="Clique para abrir e gerenciar a lista de eleitores cadastrados por este multiplicador"
                >
                  <div className="flex items-center justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-600 group-hover:text-indigo-700 flex items-center gap-1 transition-colors">
                      <TrendingUp className="w-3.5 h-3.5 text-blue-600 group-hover:text-indigo-600" /> Eleitores Cadastrados
                    </span>
                    <span className="text-slate-900 font-black">{cadastrados} / {meta}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${
                        percentual >= 100 ? 'bg-emerald-500' : 'bg-blue-600'
                      }`}
                      style={{ width: `${percentual}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-100/80">
                    <span className="text-[10px] text-slate-400 font-bold">
                      {percentual}% da meta
                    </span>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 group-hover:bg-indigo-600 text-indigo-700 group-hover:text-white font-bold text-[11px] transition-all shadow-xs cursor-pointer"
                    >
                      <Users className="w-3 h-3" />
                      <span>Ver Eleitores ({cadastrados})</span>
                      <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Ações de Gestão */}
              <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => toggleUserStatus(m.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer ${
                    m.situacao === 'ATIVO'
                      ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                      : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                  }`}
                  title={m.situacao === 'ATIVO' ? 'Bloquear Acesso' : 'Desbloquear Acesso'}
                >
                  {m.situacao === 'ATIVO' ? <XCircle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                  <span>{m.situacao === 'ATIVO' ? 'Bloquear' : 'Ativar'}</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleResetPassword(m)}
                    className="p-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 transition-colors cursor-pointer"
                    title="Redefinir Senha de Acesso"
                  >
                    <KeyRound className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setUserEditing(m);
                      setIsModalOpen(true);
                    }}
                    className="p-1.5 rounded-xl bg-blue-100 hover:bg-blue-200 text-blue-700 transition-colors cursor-pointer"
                    title="Editar Multiplicador"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(m)}
                    className="p-1.5 rounded-xl bg-red-100 hover:bg-red-200 text-red-700 transition-colors cursor-pointer"
                    title="Excluir Multiplicador"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      <MultiplicadorFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setUserEditing(null);
        }}
        userToEdit={userEditing}
      />

      <MultiplicadorEleitoresModal
        isOpen={!!viewingEleitoresFor}
        onClose={() => setViewingEleitoresFor(null)}
        multiplicador={viewingEleitoresFor}
      />

      <ConfirmModal
        isOpen={!!userToDelete}
        title="Excluir Multiplicador"
        message={`Confirma a exclusão do multiplicador "${userToDelete?.nome}"?`}
        confirmText="Excluir"
        isDanger={true}
        onConfirm={() => {
          if (userToDelete) {
            deleteUser(userToDelete.id);
          }
          setUserToDelete(null);
        }}
        onCancel={() => setUserToDelete(null)}
      />

      {/* Modal Personalizado para Redefinir Senha */}
      {resetPasswordUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setResetPasswordUser(null)} />
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 relative z-10 animate-in fade-in zoom-in-95 duration-200 text-xs">
            <div className="flex items-center gap-2.5 mb-4 pb-2 border-b border-slate-100">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl shrink-0">
                <KeyRound className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-slate-900">Redefinir Senha</h3>
                <p className="text-[10px] text-slate-500">Defina uma nova senha para {resetPasswordUser.nome}</p>
              </div>
            </div>

            {resetSuccessMessage ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl font-bold mb-2 text-center">
                {resetSuccessMessage}
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nova Senha de Acesso</label>
                  <input
                    type="text"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Digite a nova senha"
                    className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm font-mono focus:border-indigo-600 focus:outline-hidden"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setResetPasswordUser(null)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      if (newPassword.trim()) {
                        await resetUserPassword(resetPasswordUser.id, newPassword.trim());
                        setResetSuccessMessage(`Senha redefinida com sucesso!`);
                        setTimeout(() => {
                          setResetPasswordUser(null);
                          setResetSuccessMessage(null);
                        }, 2000);
                      }
                    }}
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
                  >
                    Salvar Senha
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
