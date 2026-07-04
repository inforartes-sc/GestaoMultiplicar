import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MultiplicadorEleitoresModal } from '../multiplicadores/MultiplicadorEleitoresModal';
import { 
  Users, 
  UserCheck, 
  UserPlus, 
  Calendar, 
  TrendingUp, 
  Award, 
  MapPin, 
  CheckCircle, 
  ShieldCheck, 
  Clock,
  ArrowUpRight,
  Database,
  Share2
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  AreaChart,
  Area
} from 'recharts';

export const SuperAdminDashboard: React.FC = () => {
  const { eleitores, users, auditLogs, setActiveTab } = useApp();
  const [viewingEleitoresFor, setViewingEleitoresFor] = useState<any>(null);

  // Filtrar usuários que não são MASTER (o super admin global não deve aparecer no painel)
  const multiplicadoresFiltrados = users.filter(u => u.role !== 'MASTER');

  // 1. Estatísticas Rápidas
  const totalEleitores = eleitores.length;
  const totalMultiplicadores = multiplicadoresFiltrados.length;
  const multiplicadoresAtivos = multiplicadoresFiltrados.filter(u => u.situacao === 'ATIVO').length;

  const hojeStr = new Date().toISOString().split('T')[0];
  const cadastrosHoje = eleitores.filter(e => e.dataCadastro.startsWith(hojeStr)).length;

  // Calculando cadastros da semana (últimos 7 dias)
  const seteDiasAtras = new Date();
  seteDiasAtras.setDate(seteDiasAtras.getDate() - 7);
  const cadastrosSemana = eleitores.filter(e => new Date(e.dataCadastro) >= seteDiasAtras).length;

  // Calculando mês atual
  const mesAtual = new Date().toISOString().slice(0, 7);
  const cadastrosMes = eleitores.filter(e => e.dataCadastro.startsWith(mesAtual)).length;

  const totalLideres = eleitores.filter(e => e.liderComunitario).length;
  const totalInfluenciadores = eleitores.filter(e => e.influenciador).length;
  const totalGruposWhatsapp = eleitores.filter(e => e.possuiGrupoWhatsapp).length;
  const totalPessoasInfluenciadas = eleitores.reduce((acc, curr) => acc + (curr.quantidadeInfluenciados || 0), 0);

  // 2. Ranking de Multiplicadores
  const rankingMultiplicadores = multiplicadoresFiltrados
    .map(u => {
      const contagem = eleitores.filter(e => e.multiplicadorId === u.id).length;
      const meta = u.metaMensal || 25;
      const percentual = Math.min(Math.round((contagem / meta) * 100), 100);
      return { ...u, contagem, percentual };
    })
    .sort((a, b) => b.contagem - a.contagem);

  // 3. Cadastros por Cidade
  const cidaseMap: Record<string, number> = {};
  eleitores.forEach(e => {
    const cid = e.cidade || 'Outra';
    cidaseMap[cid] = (cidaseMap[cid] || 0) + 1;
  });
  const dadosCidade = Object.entries(cidaseMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // 4. Cadastros por Bairro (Top 6)
  const bairroMap: Record<string, number> = {};
  eleitores.forEach(e => {
    const bai = `${e.bairro || 'Centro'} (${e.cidade?.slice(0, 3)})`;
    bairroMap[bai] = (bairroMap[bai] || 0) + 1;
  });
  const dadosBairro = Object.entries(bairroMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  // 5. Gráfico de Apoio e Engajamento (Pizza)
  const dadosEngajamento = [
    { name: 'Apoio Confirmado', value: eleitores.filter(e => e.apoiaCandidato).length, color: '#2563eb' },
    { name: 'Em Avaliação/Indeciso', value: eleitores.filter(e => !e.apoiaCandidato).length, color: '#94a3b8' },
  ];

  // 6. Últimos Cadastros
  const ultimosCadastros = [...eleitores]
    .sort((a, b) => new Date(b.dataCadastro).getTime() - new Date(a.dataCadastro).getTime())
    .slice(0, 5);

  // 7. Últimos Acessos (Logs de Login)
  const ultimosAcessos = auditLogs
    .filter(l => l.acao === 'LOGIN')
    .slice(0, 5);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Banner de Boas-Vindas */}
      <div className="bg-linear-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-6 text-white border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 mb-1">
            <Award className="w-4 h-4" /> Centro de Comando • Super Administrador
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Painel Geral de Monitoramento em Tempo Real
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
            Acompanhe o desempenho de cada multiplicador, captação por cidade, engajamento por bairro e conformidade com a LGPD.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => setActiveTab('eleitores')}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer shrink-0"
          >
            <UserPlus className="w-4 h-4" /> Cadastrar Novo Eleitor
          </button>
          <button
            onClick={() => setActiveTab('multiplicadores')}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-all flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Users className="w-4 h-4 text-blue-400" /> Multiplicadores
          </button>
        </div>
      </div>

      {/* 1. Grade de Estatísticas Principais (KPIs) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Eleitores Cadastrados</span>
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">{totalEleitores}</div>
          <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-0.5 mt-1">
            <TrendingUp className="w-3 h-3" /> +100% da base ativa
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Multiplicadores</span>
            <Award className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">{totalMultiplicadores}</div>
          <div className="text-[11px] text-slate-500 mt-1">
            <span className="font-bold text-emerald-600">{multiplicadoresAtivos} ativos</span> no momento
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Cadastros Hoje</span>
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">{cadastrosHoje}</div>
          <div className="text-[11px] text-amber-600 font-semibold mt-1">
            Últimas 24 horas
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Cadastros na Semana</span>
            <Calendar className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">{cadastrosSemana}</div>
          <div className="text-[11px] text-slate-500 mt-1">
            Últimos 7 dias
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Cadastros do Mês</span>
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">{cadastrosMes}</div>
          <div className="text-[11px] text-purple-600 font-semibold mt-1">
            Mês corrente
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Alcance Indireto</span>
            <Share2 className="w-5 h-5 text-rose-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">{totalPessoasInfluenciadas}</div>
          <div className="text-[11px] text-rose-600 font-medium mt-1">
            Em grupos de WhatsApp
          </div>
        </div>

      </div>

      {/* 2. Destaques de Liderança Política */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-linear-to-br from-blue-50 to-indigo-50/50 p-4 rounded-2xl border border-blue-100 flex items-center gap-4">
          <div className="p-3 bg-blue-600 text-white rounded-xl shadow-md">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl font-bold text-slate-900">{totalLideres}</div>
            <div className="text-xs text-slate-600 font-medium">Líderes Comunitários Cadastrados</div>
          </div>
        </div>

        <div className="bg-linear-to-br from-emerald-50 to-teal-50/50 p-4 rounded-2xl border border-emerald-100 flex items-center gap-4">
          <div className="p-3 bg-emerald-600 text-white rounded-xl shadow-md">
            <Share2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl font-bold text-slate-900">{totalInfluenciadores}</div>
            <div className="text-xs text-slate-600 font-medium">Influenciadores Digitais & Locais</div>
          </div>
        </div>

        <div className="bg-linear-to-br from-amber-50 to-orange-50/50 p-4 rounded-2xl border border-amber-100 flex items-center gap-4">
          <div className="p-3 bg-amber-500 text-white rounded-xl shadow-md">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl font-bold text-slate-900">{totalGruposWhatsapp}</div>
            <div className="text-xs text-slate-600 font-medium">Grupos de WhatsApp Administrados</div>
          </div>
        </div>
      </div>

      {/* 3. Gráficos & Ranking */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Gráfico de Cadastros por Bairro */}
        <div className="lg:col-span-7 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  Cadastros por Bairro & Região
                </h3>
                <p className="text-xs text-slate-500">Principais zonas de concentração de eleitores</p>
              </div>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dadosBairro} layout="vertical" margin={{ top: 5, right: 10, left: -25, bottom: 5 }}>
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={110} />
                  <Tooltip />
                  <Bar dataKey="value" name="Eleitores" fill="#2563eb" radius={[0, 6, 6, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Ranking de Multiplicadores */}
        <div className="lg:col-span-5 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  Ranking dos Multiplicadores
                </h3>
                <p className="text-xs text-slate-500">Desempenho e atingimento de metas</p>
              </div>
            </div>

            <div className="space-y-3.5 max-h-64 overflow-y-auto pr-1">
              {rankingMultiplicadores.map((m, idx) => (
                <div 
                  key={m.id} 
                  onClick={() => setViewingEleitoresFor(m)}
                  className="p-3 bg-slate-50 hover:bg-indigo-50/70 rounded-xl border border-slate-100 hover:border-indigo-200 flex items-center justify-between gap-3 transition-all cursor-pointer group"
                  title="Clique para ver a lista de eleitores cadastrados por este multiplicador"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${
                      idx === 0 ? 'bg-amber-500 text-white' : idx === 1 ? 'bg-slate-300 text-slate-800' : idx === 2 ? 'bg-amber-700 text-white' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {idx + 1}º
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 group-hover:text-indigo-900 truncate">{m.nome}</p>
                      <p className="text-[10px] text-slate-500">{m.cidade} • Meta: {m.metaMensal || 25}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm font-black text-blue-600 group-hover:text-indigo-600">{m.contagem}</span>
                    <span className="text-[10px] text-slate-400 block">{m.percentual}% meta</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* 4. Segunda Linha: Distribuição por Cidade & Gráfico de Apoio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Gráfico de Cidades */}
        <div className="lg:col-span-6 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <h3 className="font-bold text-base text-slate-900 mb-1">Cadastros por Cidade</h3>
          <p className="text-xs text-slate-500 mb-4">Volume total distribuído nos municípios</p>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dadosCidade}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" name="Eleitores" fill="#4f46e5" radius={[6, 6, 0, 0]} barSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de Apoio */}
        <div className="lg:col-span-6 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900 mb-1">Engajamento e Apoio ao Candidato</h3>
            <p className="text-xs text-slate-500 mb-2">Índice de apoio dos eleitores cadastrados</p>
            <div className="h-52 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dadosEngajamento}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {dadosEngajamento.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 text-xs font-medium pt-2 border-t border-slate-100">
              <span className="flex items-center gap-1.5 text-blue-700">
                <span className="w-3 h-3 rounded-full bg-blue-600 inline-block" /> Apoio Confirmado
              </span>
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-3 h-3 rounded-full bg-slate-400 inline-block" /> Em Avaliação
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* 5. Últimos Cadastros & Últimos Acessos ao Sistema */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Últimos Cadastros */}
        <div className="lg:col-span-7 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-emerald-600" />
              Últimos Cadastros de Eleitores
            </h3>
            <button
              onClick={() => setActiveTab('eleitores')}
              className="text-xs text-blue-600 font-semibold hover:underline"
            >
              Ver todos →
            </button>
          </div>

          <div className="divide-y divide-slate-100 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 uppercase font-semibold">
                  <th className="pb-2">Nome / CPF</th>
                  <th className="pb-2">Cidade/Bairro</th>
                  <th className="pb-2">Multiplicador</th>
                  <th className="pb-2 text-right">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ultimosCadastros.map(e => (
                  <tr key={e.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 font-medium text-slate-800">
                      <div>{e.nomeCompleto}</div>
                      <div className="text-[10px] text-slate-400">{e.cpf}</div>
                    </td>
                    <td className="py-2.5 text-slate-600">
                      <div>{e.cidade}</div>
                      <div className="text-[10px] text-slate-400">{e.bairro}</div>
                    </td>
                    <td className="py-2.5">
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md font-medium text-[11px]">
                        {e.multiplicadorNome.split(' ')[0]}
                      </span>
                    </td>
                    <td className="py-2.5 text-right text-slate-400 text-[11px]">
                      {new Date(e.dataCadastro).toLocaleDateString('pt-BR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Últimos Acessos / Logs */}
        <div className="lg:col-span-5 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-600" />
                Últimos Acessos ao Sistema
              </h3>
              <button
                onClick={() => setActiveTab('auditoria')}
                className="text-xs text-blue-600 font-semibold hover:underline"
              >
                Auditoria →
              </button>
            </div>

            <div className="space-y-3">
              {ultimosAcessos.map(log => (
                <div key={log.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">{log.usuarioNome}</p>
                    <p className="text-[10px] text-slate-500 truncate">IP: {log.ip} • {log.perfil}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                    {new Date(log.dataHora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      <MultiplicadorEleitoresModal
        isOpen={!!viewingEleitoresFor}
        onClose={() => setViewingEleitoresFor(null)}
        multiplicador={viewingEleitoresFor}
      />
    </div>
  );
};
