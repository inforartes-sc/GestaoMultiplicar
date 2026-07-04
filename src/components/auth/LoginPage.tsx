import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { INITIAL_USERS } from '../../data/initialData';
import { 
  ShieldCheck, 
  Lock, 
  User, 
  ArrowRight, 
  Award, 
  Users, 
  KeyRound,
  CheckCircle2,
  LockKeyhole
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, settings } = useApp();
  const [loginInput, setLoginInput] = useState('');
  const [senhaInput, setSenhaInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = login(loginInput, senhaInput);
    if (!res.success) {
      setError(res.message || 'Erro ao realizar login');
    }
  };

  const handleQuickDemoLogin = (loginStr: string, senhaStr: string) => {
    setLoginInput(loginStr);
    setSenhaInput(senhaStr);
    const res = login(loginStr, senhaStr);
    if (!res.success) {
      setError(res.message || 'Erro ao realizar login');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative overflow-hidden text-slate-100">
      
      {/* Luzes de Fundo Decorativas */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none translate-x-1/2 translate-y-1/2" />

      {/* Conteúdo Central */}
      <div className="max-w-4xl w-full mx-auto my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10">
        
        {/* Painel Esquerdo: Apresentação */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-900/40 border border-blue-500/30 text-blue-300 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            Plataforma Segura com Criptografia LGPD
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
            Gestão Estratégica de <span className="bg-linear-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Multiplicadores</span> & Eleitores
          </h1>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Organize sua base política com hierarquia de acesso, isolamento rigoroso por multiplicador, acompanhamento georreferenciado e auditoria completa 24/7.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
              <Award className="w-6 h-6 text-amber-400 mb-2" />
              <h3 className="font-bold text-sm text-white">Super Administrador</h3>
              <p className="text-xs text-slate-400 mt-1 leading-normal">
                Visão 360º de todos os cadastros, ranking em tempo real, auditoria e exportação total.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
              <Users className="w-6 h-6 text-blue-400 mb-2" />
              <h3 className="font-bold text-sm text-white">Multiplicador</h3>
              <p className="text-xs text-slate-400 mt-1 leading-normal">
                Painel blindado para cadastrar e acompanhar apenas as suas próprias lideranças e eleitores.
              </p>
            </div>
          </div>
        </div>

        {/* Painel Direito: Formulário de Login */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          <div className="flex items-center gap-3 justify-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-blue-600/30 shrink-0">
              360
            </div>
            <div className="flex flex-col items-center text-center">
              <h2 className="text-xl font-extrabold text-white leading-tight">
                {settings.nomeSistema || 'Multiplicador 360'}
              </h2>
              <span className="text-[11px] text-blue-400 font-bold uppercase tracking-widest leading-none mt-1">
                Sistema de Gestão
              </span>
            </div>
          </div>

          {/* Subtítulo de Instrução e Acesso */}
          <div className="text-center mb-6 border-t border-slate-800/80 pt-5">
            <h3 className="text-sm font-bold text-slate-200">Acesso ao Sistema</h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Digite suas credenciais para acessar sua área de trabalho.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-950/80 border border-red-500/40 text-red-300 text-xs flex items-center gap-2 animate-in fade-in">
              <LockKeyhole className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Usuário / Login
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={loginInput}
                  onChange={(e) => setLoginInput(e.target.value)}
                  placeholder="Ex: admin ou marcos.silva"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-hidden focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={senhaInput}
                  onChange={(e) => setSenhaInput(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-hidden focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span>Entrar no Sistema</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

        </div>

      </div>

      {/* Rodapé */}
      <footer className="text-center text-xs text-slate-500 py-4 z-10">
        {settings.textoRodape}
      </footer>
    </div>
  );
};
