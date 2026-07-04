import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Settings, Save, ShieldCheck, Palette, Target, Database, CheckCircle2, Lock, KeyRound } from 'lucide-react';

export const SystemSettingsPage: React.FC = () => {
  const { settings, updateSettings, currentUser, resetUserPassword } = useApp();

  const [nomeSistema, setNomeSistema] = useState(settings.nomeSistema);
  const [candidatoApoiado, setCandidatoApoiado] = useState(settings.candidatoApoiado);
  const [corPrincipal, setCorPrincipal] = useState(settings.corPrincipal);
  const [corSecundaria, setCorSecundaria] = useState(settings.corSecundaria);
  const [textoRodape, setTextoRodape] = useState(settings.textoRodape);
  const [metaMensalPadrao, setMetaMensalPadrao] = useState(settings.metaMensalPadrao);
  const [retencaoDadosMeses, setRetencaoDadosMeses] = useState(settings.retencaoDadosMeses);
  const [salvo, setSalvo] = useState(false);

  // Alteração de Senha do Admin
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [senhaErro, setSenhaErro] = useState<string | null>(null);
  const [senhaSalva, setSenhaSalva] = useState(false);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSenhaErro(null);
    setSenhaSalva(false);
    if (!novaSenha.trim()) {
      setSenhaErro('A senha não pode estar em branco.');
      return;
    }
    if (novaSenha !== confirmarSenha) {
      setSenhaErro('As senhas não coincidem.');
      return;
    }
    if (currentUser) {
      await resetUserPassword(currentUser.id, novaSenha.trim());
      setSenhaSalva(true);
      setNovaSenha('');
      setConfirmarSenha('');
      setTimeout(() => setSenhaSalva(false), 3000);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      nomeSistema: nomeSistema.trim(),
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
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2.5 shadow-xl animate-in fade-in slide-in-from-bottom-5 duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          Configurações salvas e aplicadas em tempo real com sucesso!
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
              <label className="block text-xs font-bold text-slate-500 mb-1">Nome do Sistema</label>
              <input
                type="text"
                value={nomeSistema}
                onChange={(e) => setNomeSistema(e.target.value)}
                readOnly={currentUser?.role !== 'MASTER'}
                className={`w-full border rounded-xl px-3.5 py-2.5 text-sm ${
                  currentUser?.role === 'MASTER'
                    ? 'bg-white text-slate-900 border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500'
                    : 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed select-none'
                }`}
                title={currentUser?.role !== 'MASTER' ? "Apenas o Super Admin Master (desenvolvedor) pode alterar o nome do sistema" : ""}
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
            <Database className="w-4 h-4 text-slate-500" /> 4. Texto de Rodapé do Sistema (Exclusivo do Sistema)
          </h3>
          <input
            type="text"
            readOnly
            value={textoRodape}
            className="w-full bg-slate-50 text-slate-500 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs cursor-not-allowed select-none"
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

      {/* Alterar Senha do Super Admin */}
      <form onSubmit={handleUpdatePassword} className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
            <Lock className="w-4 h-4 text-red-600" /> 5. Alterar Senha do Administrador
          </h3>

          {senhaErro && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
              {senhaErro}
            </div>
          )}

          {senhaSalva && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
              Senha do administrador redefinida com sucesso!
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nova Senha</label>
              <input
                type="password"
                required
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                placeholder="Digite a nova senha"
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:border-red-600 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Confirmar Nova Senha</label>
              <input
                type="password"
                required
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                placeholder="Confirme a nova senha"
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:border-red-600 focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xs shadow-md shadow-red-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <KeyRound className="w-4 h-4" /> Alterar Senha
          </button>
        </div>
      </form>
    </div>
  );
};
