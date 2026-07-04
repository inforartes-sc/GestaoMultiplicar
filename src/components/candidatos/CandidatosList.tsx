import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Candidato } from '../../types';
import { Users, Plus, Edit3, Trash2, Eye, Paintbrush, ShieldCheck, Target, RefreshCw } from 'lucide-react';

export const CandidatosList: React.FC = () => {
  const { 
    candidatos, 
    addCandidato, 
    updateCandidato, 
    deleteCandidato,
    selectedCandidatoId,
    setSelectedCandidatoId,
    currentUser
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCand, setEditingCand] = useState<Candidato | null>(null);

  // Form states
  const [nome, setNome] = useState('');
  const [nomeSistema, setNomeSistema] = useState('Multiplicador 360');
  const [candidatoApoiado, setCandidatoApoiado] = useState('');
  const [corPrincipal, setCorPrincipal] = useState('#2563eb');
  const [corSecundaria, setCorSecundaria] = useState('#1e40af');
  const [textoRodape, setTextoRodape] = useState('');
  const [metaMensalPadrao, setMetaMensalPadrao] = useState(25);
  const [retencaoDadosMeses, setRetencaoDadosMeses] = useState(48);
  const [exigirConsentimentoLGPD, setExigirConsentimentoLGPD] = useState(true);

  const openNewModal = () => {
    setEditingCand(null);
    setNome('');
    setNomeSistema('Multiplicador 360');
    setCandidatoApoiado('');
    setCorPrincipal('#2563eb');
    setCorSecundaria('#1e40af');
    setTextoRodape('');
    setMetaMensalPadrao(25);
    setRetencaoDadosMeses(48);
    setExigirConsentimentoLGPD(true);
    setIsModalOpen(true);
  };

  const openEditModal = (c: Candidato) => {
    setEditingCand(c);
    setNome(c.nome);
    setNomeSistema(c.nomeSistema);
    setCandidatoApoiado(c.candidatoApoiado);
    setCorPrincipal(c.corPrincipal);
    setCorSecundaria(c.corSecundaria);
    setTextoRodape(c.textoRodape);
    setMetaMensalPadrao(c.metaMensalPadrao);
    setRetencaoDadosMeses(c.retencaoDadosMeses);
    setExigirConsentimentoLGPD(c.exigirConsentimentoLGPD);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      nome: nome.trim(),
      nomeSistema: nomeSistema.trim(),
      candidatoApoiado: candidatoApoiado.trim(),
      corPrincipal,
      corSecundaria,
      textoRodape: textoRodape.trim(),
      metaMensalPadrao: Number(metaMensalPadrao) || 25,
      retencaoDadosMeses: Number(retencaoDadosMeses) || 48,
      exigirConsentimentoLGPD,
    };

    if (editingCand) {
      await updateCandidato(editingCand.id, payload);
    } else {
      await addCandidato(payload);
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Tem certeza absoluta que deseja excluir o candidato "${name}"? Todos os multiplicadores e eleitores associados a ele serão deletados permanentemente!`)) {
      await deleteCandidato(id);
      if (selectedCandidatoId === id) {
        setSelectedCandidatoId(null);
      }
    }
  };

  if (currentUser?.role !== 'MASTER') {
    return (
      <div className="bg-red-50 border border-red-200 p-8 rounded-3xl text-center max-w-lg mx-auto my-12">
        <h2 className="text-lg font-bold text-red-950">Acesso Negado</h2>
        <p className="text-xs text-red-800 mt-2">Você não tem permissões MASTER para acessar a lista global de candidatos.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Header Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <Users className="w-6 h-6 text-blue-600" />
            Central de Candidatos
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Cadastre novos candidatos, customize identidades visuais e gerencie acessos de inquilinos na plataforma.
          </p>
        </div>
        <button
          onClick={openNewModal}
          className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-600/20 active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Novo Candidato
        </button>
      </div>

      {/* Impersonation Indicator */}
      {selectedCandidatoId && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-amber-900 text-xs font-semibold flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
            </span>
            <span>
              Visualização Ativa: Exibindo dados do candidato{' '}
              <strong className="text-amber-950">
                {candidatos.find((c) => c.id === selectedCandidatoId)?.nome || selectedCandidatoId}
              </strong>
            </span>
          </div>
          <button
            onClick={() => setSelectedCandidatoId(null)}
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-[10px] transition-all cursor-pointer"
          >
            Limpar Filtro (Ver Tudo)
          </button>
        </div>
      )}

      {/* Grid of Candidates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Default / Unassociated Option card if no candidate chosen */}
        <div className={`bg-white rounded-3xl border p-6 flex flex-col justify-between transition-all ${
          !selectedCandidatoId 
            ? 'border-indigo-600 ring-2 ring-indigo-600/10' 
            : 'border-slate-200 hover:border-slate-300'
        }`}>
          <div>
            <div className="flex items-start justify-between">
              <div className="h-10 w-10 rounded-2xl bg-indigo-50 flex items-center justify-center">
                <RefreshCw className="w-5 h-5 text-indigo-600" />
              </div>
              <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-wider">
                Global
              </span>
            </div>
            <div className="mt-4">
              <h3 className="font-bold text-slate-900 text-base">Visão Global Unificada</h3>
              <p className="text-xs text-slate-500 mt-1">
                Visualização consolidada de todos os eleitores e logs de auditoria do sistema.
              </p>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100">
            <button
              onClick={() => setSelectedCandidatoId(null)}
              disabled={!selectedCandidatoId}
              className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                !selectedCandidatoId
                  ? 'bg-slate-100 text-slate-400 cursor-default'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs'
              }`}
            >
              <Eye className="w-4 h-4" /> Visão Global Ativa
            </button>
          </div>
        </div>

        {/* Real candidates list */}
        {candidatos.map((c) => {
          const isActive = selectedCandidatoId === c.id;
          return (
            <div 
              key={c.id}
              className={`bg-white rounded-3xl border p-6 flex flex-col justify-between transition-all ${
                isActive 
                  ? 'border-blue-600 ring-2 ring-blue-600/10' 
                  : 'border-slate-200 hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-4 h-4 rounded-full border border-white shadow-xs block"
                      style={{ backgroundColor: c.corPrincipal }}
                      title="Cor Principal"
                    />
                    <span 
                      className="w-4 h-4 rounded-full border border-white shadow-xs block -ml-3"
                      style={{ backgroundColor: c.corSecundaria }}
                      title="Cor Secundária"
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(c)}
                      className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
                      title="Editar Candidato"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    {c.id !== 'candidato-padrao' && (
                      <button
                        onClick={() => handleDelete(c.id, c.nome)}
                        className="p-1.5 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600 transition-all cursor-pointer"
                        title="Deletar Candidato"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="font-bold text-slate-900 text-base">{c.nome}</h3>
                  <div className="mt-2 space-y-1.5 text-xs text-slate-500">
                    <p>🎯 <span className="font-medium text-slate-700">Sistema:</span> {c.nomeSistema}</p>
                    <p>🗳️ <span className="font-medium text-slate-700">Apoiado:</span> {c.candidatoApoiado}</p>
                    <p>📊 <span className="font-medium text-slate-700">Meta Mensal:</span> {c.metaMensalPadrao} cadastros</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => setSelectedCandidatoId(isActive ? null : c.id)}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <Eye className="w-4 h-4" /> {isActive ? 'Visualização Ativa' : 'Ativar Visualização'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Form Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-3xl border border-slate-100 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            
            {/* Modal Header */}
            <div className="px-6 py-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                {editingCand ? <Edit3 className="w-5 h-5 text-blue-600" /> : <Plus className="w-5 h-5 text-blue-600" />}
                {editingCand ? 'Editar Candidato' : 'Cadastrar Novo Candidato'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-xs font-bold px-3 py-1.5 bg-slate-200 hover:bg-slate-300 rounded-lg text-slate-600 transition-all cursor-pointer"
              >
                Fechar
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nome do Candidato *</label>
                  <input
                    type="text"
                    required
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Ex: Candidato João da Silva"
                    className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:border-blue-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Candidato Apoiado na Campanha *</label>
                  <input
                    type="text"
                    required
                    value={candidatoApoiado}
                    onChange={(e) => setCandidatoApoiado(e.target.value)}
                    placeholder="Ex: Deputado Federal João"
                    className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:border-blue-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nome Personalizado do Sistema</label>
                  <input
                    type="text"
                    value={nomeSistema}
                    onChange={(e) => setNomeSistema(e.target.value)}
                    placeholder="Ex: Gestão Multiplicadores João"
                    className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:border-blue-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Meta Mensal Padrão (Cadastros)</label>
                  <input
                    type="number"
                    min="1"
                    value={metaMensalPadrao}
                    onChange={(e) => setMetaMensalPadrao(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:border-blue-600 focus:outline-hidden font-bold"
                  />
                </div>
              </div>

              {/* Colors Picker */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Paintbrush className="w-3.5 h-3.5 text-indigo-600" /> Identidade Visual (Cores)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Cor Principal</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={corPrincipal}
                        onChange={(e) => setCorPrincipal(e.target.value)}
                        className="w-9 h-9 rounded-xl border border-slate-200 cursor-pointer shrink-0"
                      />
                      <input
                        type="text"
                        value={corPrincipal}
                        onChange={(e) => setCorPrincipal(e.target.value)}
                        className="w-full border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Cor Secundária</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={corSecundaria}
                        onChange={(e) => setCorSecundaria(e.target.value)}
                        className="w-9 h-9 rounded-xl border border-slate-200 cursor-pointer shrink-0"
                      />
                      <input
                        type="text"
                        value={corSecundaria}
                        onChange={(e) => setCorSecundaria(e.target.value)}
                        className="w-full border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer text */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Texto de Rodapé do Painel</label>
                <input
                  type="text"
                  value={textoRodape}
                  onChange={(e) => setTextoRodape(e.target.value)}
                  placeholder="Ex: © 2026 Campanha Oficial João da Silva"
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs focus:border-blue-600 focus:outline-hidden"
                />
              </div>

              {/* LGPD Settings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tempo Retenção Dados (Meses)</label>
                  <input
                    type="number"
                    min="6"
                    value={retencaoDadosMeses}
                    onChange={(e) => setRetencaoDadosMeses(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:border-blue-600 focus:outline-hidden font-bold"
                  />
                </div>

                <div className="flex items-center gap-3 bg-slate-50 px-4 rounded-xl border border-slate-100 shrink-0 select-none">
                  <input
                    type="checkbox"
                    id="consentimentoLgpdCheck"
                    checked={exigirConsentimentoLGPD}
                    onChange={(e) => setExigirConsentimentoLGPD(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-slate-300 rounded-sm focus:ring-blue-500 cursor-pointer"
                  />
                  <label htmlFor="consentimentoLgpdCheck" className="text-xs font-bold text-slate-700 cursor-pointer py-4 flex-1">
                    Exigir Termo de Consentimento LGPD
                  </label>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs cursor-pointer shadow-md shadow-blue-600/10"
                >
                  Salvar Candidato
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
