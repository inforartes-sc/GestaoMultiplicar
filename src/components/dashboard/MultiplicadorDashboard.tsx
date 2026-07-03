import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  UserPlus, 
  Calendar, 
  TrendingUp, 
  Target, 
  CheckCircle2, 
  MapPin, 
  Award,
  Clock,
  Heart,
  Share2
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

export const MultiplicadorDashboard: React.FC = () => {
  const { currentUser, getFilteredEleitores, setActiveTab, settings } = useApp();

  if (!currentUser) return null;

  const meusEleitores = getFilteredEleitores();
  const totalCadastrados = meusEleitores.length;

  const hojeStr = new Date().toISOString().split('T')[0];
  const cadastrosHoje = meusEleitores.filter(e => e.dataCadastro.startsWith(hojeStr)).length;

  const seteDiasAtras = new Date();
  seteDiasAtras.setDate(seteDiasAtras.getDate() - 7);
  const cadastrosSemana = meusEleitores.filter(e => new Date(e.dataCadastro) >= seteDiasAtras).length;

  const mesAtual = new Date().toISOString().slice(0, 7);
  const cadastrosMes = meusEleitores.filter(e => e.dataCadastro.startsWith(mesAtual)).length;

  const meta = currentUser.metaMensal || settings.metaMensalPadrao || 25;
  const progressoMeta = Math.min(Math.round((totalCadastrados / meta) * 100), 100);

  const totalApoiadores = meusEleitores.filter(e => e.apoiaCandidato).length;
  const totalLideres = meusEleitores.filter(e => e.liderComunitario).length;

  // Gráfico de Evolução (Simulando distribuição dos cadastros nos últimos dias/semanas)
  const dadosEvolucao = [
    { data: 'Semana 1', cadastros: Math.max(1, Math.floor(totalCadastrados * 0.2)) },
    { data: 'Semana 2', cadastros: Math.max(2, Math.floor(totalCadastrados * 0.45)) },
    { data: 'Semana 3', cadastros: Math.max(3, Math.floor(totalCadastrados * 0.75)) },
    { data: 'Atual', cadastros: totalCadastrados },
  ];

  const ultimosCadastros = [...meusEleitores]
    .sort((a, b) => new Date(b.dataCadastro).getTime() - new Date(a.dataCadastro).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Banner de Boas-Vindas & Meta */}
      <div className="bg-linear-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 text-white border border-blue-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-300 flex items-center gap-1.5">
            <Users className="w-4 h-4" /> Painel de Acesso Blindado • {currentUser.cidade}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Olá, {currentUser.nome}!
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
            Sua visualização é automaticamente filtrada para os eleitores cadastrados por você. Continue mobilizando sua região para atingirmos nossa meta de liderança!
          </p>
        </div>

        {/* Card de Meta */}
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 w-full md:w-64 shrink-0">
          <div className="flex items-center justify-between text-xs font-semibold text-blue-200 mb-2">
            <span className="flex items-center gap-1"><Target className="w-4 h-4 text-amber-400" /> Meta Mensal</span>
            <span>{totalCadastrados} / {meta}</span>
          </div>
          <div className="w-full bg-white/20 h-3 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                progressoMeta >= 100 ? 'bg-amber-400' : 'bg-blue-400'
              }`}
              style={{ width: `${progressoMeta}%` }}
            />
          </div>
          <div className="text-right text-[11px] text-slate-300 font-bold mt-1">
            {progressoMeta}% alcançada
          </div>
        </div>
      </div>

      {/* Ação Rápida de Cadastro */}
      <div className="flex items-center justify-between bg-blue-50 border border-blue-200 p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-600 text-white rounded-xl shadow-md">
            <UserPlus className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-blue-950">Pronto para cadastrar um novo apoiador?</h3>
            <p className="text-xs text-blue-800">Preencha os dados completos, endereço, seção eleitoral e anexe os documentos.</p>
          </div>
        </div>
        <button
          onClick={() => setActiveTab('eleitores')}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer shrink-0"
        >
          + Cadastrar Eleitor
        </button>
      </div>

      {/* Grade de Estatísticas Pessoais */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Total Cadastrado</span>
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">{totalCadastrados}</div>
          <p className="text-[11px] text-slate-500 mt-1">Sua base de contatos</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Cadastros Hoje</span>
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-slate-900">{cadastrosHoje}</div>
          <p className="text-[11px] text-amber-600 font-medium mt-1">Registrados hoje</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Cadastros da Semana</span>
            <Calendar className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">{cadastrosSemana}</div>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">Últimos 7 dias</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Cadastros do Mês</span>
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">{cadastrosMes}</div>
          <p className="text-[11px] text-purple-600 font-medium mt-1">Mês atual</p>
        </div>

      </div>

      {/* Gráfico de Evolução & Destaques */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Gráfico de Evolução */}
        <div className="lg:col-span-7 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <h3 className="font-bold text-base text-slate-900 mb-1 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Evolução de Crescimento de Contatos
          </h3>
          <p className="text-xs text-slate-500 mb-4">Acompanhamento acumulado da sua rede de eleitores</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dadosEvolucao} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCadastros" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="data" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="cadastros" name="Eleitores" stroke="#2563eb" fillOpacity={1} fill="url(#colorCadastros)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Últimos Cadastros Realizados por Você */}
        <div className="lg:col-span-5 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                Meus Últimos Registros
              </h3>
              <button
                onClick={() => setActiveTab('eleitores')}
                className="text-xs text-blue-600 font-semibold hover:underline"
              >
                Gerenciar →
              </button>
            </div>

            {ultimosCadastros.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-xs">Nenhum eleitor cadastrado por você até o momento.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {ultimosCadastros.map(e => (
                  <div key={e.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">{e.nomeCompleto}</p>
                      <p className="text-[10px] text-slate-500 truncate">{e.bairro} • {e.cidade}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                        e.apoiaCandidato ? 'bg-blue-100 text-blue-800' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {e.apoiaCandidato ? 'Apoiador' : 'Em Análise'}
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        {new Date(e.dataCadastro).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
