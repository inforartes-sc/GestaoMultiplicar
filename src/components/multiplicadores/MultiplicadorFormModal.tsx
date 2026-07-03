import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import { useApp } from '../../context/AppContext';
import { X, UserPlus, Phone, MapPin, Lock, Target, ShieldCheck } from 'lucide-react';

interface MultiplicadorFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  userToEdit?: User | null;
}

export const MultiplicadorFormModal: React.FC<MultiplicadorFormModalProps> = ({ isOpen, onClose, userToEdit }) => {
  const { addUser, updateUser } = useApp();

  const [nome, setNome] = useState('');
  const [loginStr, setLoginStr] = useState('');
  const [senha, setSenha] = useState('123456');
  const [telefone, setTelefone] = useState('');
  const [cidade, setCidade] = useState('');
  const [situacao, setSituacao] = useState<'ATIVO' | 'INATIVO'>('ATIVO');
  const [metaMensal, setMetaMensal] = useState<number>(30);

  useEffect(() => {
    if (userToEdit) {
      setNome(userToEdit.nome);
      setLoginStr(userToEdit.login);
      setSenha(userToEdit.senha || '');
      setTelefone(userToEdit.telefone);
      setCidade(userToEdit.cidade);
      setSituacao(userToEdit.situacao);
      setMetaMensal(userToEdit.metaMensal || 30);
    } else {
      setNome('');
      setLoginStr('');
      setSenha('123456');
      setTelefone('');
      setCidade('São Paulo');
      setSituacao('ATIVO');
      setMetaMensal(30);
    }
  }, [userToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !loginStr.trim() || !cidade.trim()) {
      alert('Por favor, preencha o Nome, Login e Cidade.');
      return;
    }

    if (userToEdit) {
      updateUser(userToEdit.id, {
        nome,
        login: loginStr,
        telefone,
        cidade,
        situacao,
        metaMensal: Number(metaMensal) || 25,
      });
    } else {
      addUser({
        nome,
        login: loginStr,
        senha: senha || '123456',
        telefone,
        cidade,
        situacao,
        role: 'MULTIPLICADOR',
        metaMensal: Number(metaMensal) || 25,
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <UserPlus className="w-6 h-6 text-blue-400" />
            <div>
              <h2 className="text-base font-bold">
                {userToEdit ? 'Editar Multiplicador' : 'Novo Multiplicador Político'}
              </h2>
              <p className="text-[11px] text-slate-400">Credenciais de acesso e metas de captação</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Nome Completo *</label>
            <input
              type="text"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Marcos Silva (Coord. Zona Sul)"
              className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:border-blue-600 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Login de Acesso *</label>
              <input
                type="text"
                required
                value={loginStr}
                onChange={(e) => setLoginStr(e.target.value)}
                placeholder="marcos.silva"
                className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm font-mono focus:border-blue-600 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {userToEdit ? 'Nova Senha (opcional)' : 'Senha Inicial *'}
              </label>
              <input
                type="text"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="123456"
                className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Telefone / WhatsApp</label>
              <input
                type="text"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="(11) 98111-2233"
                className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Cidade de Atuação *</label>
              <input
                type="text"
                required
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                placeholder="São Paulo"
                className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Situação no Sistema</label>
              <select
                value={situacao}
                onChange={(e) => setSituacao(e.target.value as any)}
                className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm bg-white font-bold"
              >
                <option value="ATIVO">✅ ATIVO (Acesso Liberado)</option>
                <option value="INATIVO">🚫 INATIVO (Bloqueado)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Meta de Cadastros / Mês</label>
              <input
                type="number"
                min="1"
                value={metaMensal}
                onChange={(e) => setMetaMensal(Number(e.target.value))}
                className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm font-bold text-blue-600"
              />
            </div>
          </div>

          <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200 flex items-start gap-2.5 mt-2">
            <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-[11px] text-blue-900 leading-tight">
              O multiplicador cadastrado receberá as credenciais e enxergará <strong>estritamente</strong> os eleitores registrados por ele.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-md shadow-blue-600/30 transition-all cursor-pointer"
            >
              {userToEdit ? 'Salvar Alterações' : 'Cadastrar Multiplicador'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
