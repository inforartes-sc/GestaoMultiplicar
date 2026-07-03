import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Settings, Save, ShieldCheck, Palette, Target, Database, CheckCircle2 } from 'lucide-react';

export const SystemSettingsPage: React.FC = () => {
  const { settings, updateSettings } = useApp();

  const [nomeSistema, setNomeSistema] = useState(settings.nomeSistema);
  const [candidatoApoiado, setCandidatoApoiado] = useState(settings.candidatoApoiado);
  const [corPrincipal, setCorPrincipal] = useState(settings.corPrincipal);
  const [corSecundaria, setCorSecundaria] = useState(settings.corSecundaria);
  const [textoRodape, setTextoRodape] = useState(settings.textoRodape);
  const [metaMensalPadrao, setMetaMensalPadrao] = useState(settings.metaMensalPadrao);
  const [retencaoDadosMeses, setRetencaoDadosMeses] = useState(settings.retencaoDadosMeses);
  const [salvo, setSalvo] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      nomeSistema,
      candidatoApoiado,
      corPrincipal,
      corSecundaria,
      textoRodape,
      metaMensalPadrao: Number(metaMensalPadrao) || 25,
      retencaoDadosMeses: Number(retencaoDadosMeses) || 48,
    });
    setSalvo(true);
    setTimeout(() => setSalvo(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      
      {/* Cabeçalho */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <Settings className="w-6 h-6 text-indigo-600" />
            Configurações Gerais do Sistema
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Personalize a identificação visual, metas padrão e políticas de privacidade da plataforma.
          </p>
        </div>
      </div>

      {salvo && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          Configurações atualizadas e aplicadas em tempo real a todo o sistema!
        </div>
      )}

      {/* Formulário */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
        
        {/* Identificação & Campanha */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
            <ShieldCheck className="w-4 h-4 text-blue-600" /> 1. Identificação e Campanha
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nome do Sistema *</label>
              <input
                type="text"
                required
                value={nomeSistema}
                onChange={(e) => setNomeSistema(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:border-blue-600 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Candidato ou Projeto Apoiado *</label>
              <input
                type="text"
                required
                value={candidatoApoiado}
                onChange={(e) => setCandidatoApoiado(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:border-blue-600 focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Cores & Aparência */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
            <Palette className="w-4 h-4 text-purple-600" /> 2. Identidade Visual
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Cor Principal (HEX)</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={corPrincipal}
                  onChange={(e) => setCorPrincipal(e.target.value)}
                  className="w-10 h-10 rounded-xl border border-slate-300 cursor-pointer shrink-0"
                />
                <input
                  type="text"
                  value={corPrincipal}
                  onChange={(e) => setCorPrincipal(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-sm font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Cor Secundária (HEX)</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={corSecundaria}
                  onChange={(e) => setCorSecundaria(e.target.value)}
                  className="w-10 h-10 rounded-xl border border-slate-300 cursor-pointer shrink-0"
                />
                <input
                  type="text"
                  value={corSecundaria}
                  onChange={(e) => setCorSecundaria(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-sm font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Metas & Retenção */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
            <Target className="w-4 h-4 text-amber-600" /> 3. Metas Padrão & Política LGPD
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Meta Mensal de Cadastros por Multiplicador
              </label>
              <input
                type="number"
                min="1"
                value={metaMensalPadrao}
                onChange={(e) => setMetaMensalPadrao(Number(e.target.value))}
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-bold text-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Prazo de Retenção de Dados Pessoais (Meses - LGPD)
              </label>
              <input
                type="number"
                min="6"
                value={retencaoDadosMeses}
                onChange={(e) => setRetencaoDadosMeses(Number(e.target.value))}
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-bold text-emerald-700"
              />
            </div>
          </div>
        </div>

        {/* Rodapé do Sistema */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
            <Database className="w-4 h-4 text-slate-600" /> 4. Texto de Rodapé do Sistema
          </h3>
          <input
            type="text"
            value={textoRodape}
            onChange={(e) => setTextoRodape(e.target.value)}
            className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-700"
          />
        </div>

        <div className="pt-4 border-t border-slate-200 flex justify-end">
          <button
            type="submit"
            className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" /> Salvar Configurações
          </button>
        </div>

      </form>
    </div>
  );
};
