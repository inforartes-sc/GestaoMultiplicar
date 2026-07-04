import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Eleitor } from '../../types';
import { EleitorFormModal } from './EleitorFormModal';
import { EleitorDetailModal } from './EleitorDetailModal';
import { ConfirmModal } from '../common/ConfirmModal';
import { exportEleitoresToExcel, exportEleitoresToCSV, printOrExportPDF } from '../../utils/exportUtils';
import { 
  Search, 
  Filter, 
  UserPlus, 
  FileSpreadsheet, 
  FileText, 
  Printer, 
  Eye, 
  Edit3, 
  Trash2, 
  Users, 
  Phone, 
  ChevronLeft, 
  ChevronRight
} from 'lucide-react';

export const EleitoresList: React.FC = () => {
  const { currentUser, getFilteredEleitores, deleteEleitor, searchTerm, setSearchTerm } = useApp();
  const [filtroEspecial, setFiltroEspecial] = useState<'TODOS' | 'APOIADORES' | 'LIDERES' | 'INFLUENCIADORES' | 'WHATSAPP'>('TODOS');
  const [filtroCidade, setFiltroCidade] = useState<string>('TODAS');
  const [filtroBairro, setFiltroBairro] = useState<string>('TODOS');
  const [filtroEstado, setFiltroEstado] = useState<string>('TODOS');

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [eleitorEditing, setEleitorEditing] = useState<Eleitor | null>(null);
  const [eleitorViewing, setEleitorViewing] = useState<Eleitor | null>(null);
  const [eleitorToDelete, setEleitorToDelete] = useState<Eleitor | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  if (!currentUser) return null;

  const isSuperAdmin = currentUser.role === 'SUPER_ADMIN';
  const eleitoresAutorizados = getFilteredEleitores();

  // Lista única de cidades para filtro com contagem
  const cidadesDisponiveis = useMemo(() => {
    const counts: Record<string, number> = {};
    eleitoresAutorizados.forEach((e) => {
      if (e.cidade) {
        counts[e.cidade] = (counts[e.cidade] || 0) + 1;
      }
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [eleitoresAutorizados]);

  // Lista única de bairros para filtro com contagem
  const bairrosDisponiveis = useMemo(() => {
    const counts: Record<string, number> = {};
    eleitoresAutorizados.forEach((e) => {
      if (e.bairro) {
        counts[e.bairro] = (counts[e.bairro] || 0) + 1;
      }
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [eleitoresAutorizados]);

  // Lista única de estados para filtro com contagem
  const estadosDisponiveis = useMemo(() => {
    const counts: Record<string, number> = {};
    eleitoresAutorizados.forEach((e) => {
      if (e.estado) {
        counts[e.estado] = (counts[e.estado] || 0) + 1;
      }
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [eleitoresAutorizados]);

  // Contagens por categoria para pílulas de filtro rápido
  const contagens = useMemo(() => {
    return {
      TODOS: eleitoresAutorizados.length,
      APOIADORES: eleitoresAutorizados.filter((e) => e.apoiaCandidato).length,
      LIDERES: eleitoresAutorizados.filter((e) => e.liderComunitario).length,
      INFLUENCIADORES: eleitoresAutorizados.filter((e) => e.influenciador).length,
      WHATSAPP: eleitoresAutorizados.filter((e) => e.possuiGrupoWhatsapp).length,
    };
  }, [eleitoresAutorizados]);

  // Filtragem instantânea
  const eleitoresFiltrados = useMemo(() => {
    return eleitoresAutorizados.filter((e) => {
      // 1. Filtro por busca instantânea
      if (searchTerm.trim()) {
        const termo = searchTerm.toLowerCase().trim();
        const combinacao = `
          ${e.nomeCompleto} 
          ${e.cpf} 
          ${e.telefone} 
          ${e.whatsapp} 
          ${e.cidade} 
          ${e.bairro} 
          ${e.zonaEleitoral} 
          ${e.secao} 
          ${e.tituloEleitor} 
          ${e.multiplicadorNome} 
          ${e.dataCadastro}
        `.toLowerCase();
        if (!combinacao.includes(termo)) return false;
      }

      // 2. Filtro por Cidade
      if (filtroCidade !== 'TODAS' && e.cidade !== filtroCidade) {
        return false;
      }

      // Filtro por Bairro
      if (filtroBairro !== 'TODOS' && e.bairro !== filtroBairro) {
        return false;
      }

      // Filtro por Estado
      if (filtroEstado !== 'TODOS' && e.estado !== filtroEstado) {
        return false;
      }

      // 3. Filtros Especiais
      if (filtroEspecial === 'APOIADORES' && !e.apoiaCandidato) return false;
      if (filtroEspecial === 'LIDERES' && !e.liderComunitario) return false;
      if (filtroEspecial === 'INFLUENCIADORES' && !e.influenciador) return false;
      if (filtroEspecial === 'WHATSAPP' && !e.possuiGrupoWhatsapp) return false;

      return true;
    });
  }, [eleitoresAutorizados, searchTerm, filtroCidade, filtroBairro, filtroEstado, filtroEspecial]);

  // Paginação
  const totalPages = Math.ceil(eleitoresFiltrados.length / itemsPerPage) || 1;
  const paginatedEleitores = eleitoresFiltrados.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = (e: Eleitor) => {
    // Verificar permissão
    if (!isSuperAdmin && e.multiplicadorId !== currentUser.id) {
      alert('Acesso negado: Você só pode excluir cadastros realizados por você.');
      return;
    }
    setEleitorToDelete(e);
  };

  const handleEdit = (e: Eleitor) => {
    if (!isSuperAdmin && e.multiplicadorId !== currentUser.id) {
      alert('Acesso negado: Você só pode editar cadastros realizados por você.');
      return;
    }
    setEleitorEditing(e);
    setIsFormOpen(true);
  };

  const handleExportPDF = () => {
    const cabecalhos = ['Nome Completo', 'CPF', 'WhatsApp', 'Cidade / Bairro', 'Zona / Seção', 'Multiplicador', 'Apoio'];
    const linhas = eleitoresFiltrados.map((e) => [
      e.nomeCompleto,
      e.cpf,
      e.whatsapp || e.telefone,
      `${e.cidade} / ${e.bairro}`,
      `Z: ${e.zonaEleitoral} S: ${e.secao}`,
      e.multiplicadorNome.split(' ')[0],
      e.apoiaCandidato ? 'Sim' : 'Em Avaliação',
    ]);
    printOrExportPDF('Relatório Oficial de Eleitores Cadastrados', `Filtro atual: ${eleitoresFiltrados.length} registros selecionados`, cabecalhos, linhas);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Cabeçalho da Seção */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <Users className="w-6 h-6 text-blue-600" />
            <span>Base Geral de Eleitores</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {isSuperAdmin
              ? 'Você tem permissão para visualizar, pesquisar e gerenciar toda a base de eleitores cadastrada no sistema.'
              : 'Pesquisa filtrada automaticamente para exibir exclusivamente os eleitores cadastrados pelo seu usuário.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Ações de Exportação */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => exportEleitoresToExcel(eleitoresFiltrados)}
              className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-white rounded-lg transition-colors flex items-center gap-1.5"
              title="Exportar para Excel (.xlsx)"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Excel
            </button>
            <button
              onClick={() => exportEleitoresToCSV(eleitoresFiltrados)}
              className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-white rounded-lg transition-colors flex items-center gap-1.5"
              title="Exportar para arquivo CSV"
            >
              <FileText className="w-4 h-4 text-blue-600" /> CSV
            </button>
            <button
              onClick={handleExportPDF}
              className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-white rounded-lg transition-colors flex items-center gap-1.5"
              title="Gerar Relatório / PDF"
            >
              <Printer className="w-4 h-4 text-purple-600" /> PDF
            </button>
          </div>

          <button
            onClick={() => {
              setEleitorEditing(null);
              setIsFormOpen(true);
            }}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/30 transition-all flex items-center gap-2 cursor-pointer grow md:grow-0 justify-center"
          >
            <UserPlus className="w-4 h-4" />
            <span>Cadastrar Eleitor</span>
          </button>
        </div>
      </div>

      {/* Barras de Busca e Filtros Rápidos */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="space-y-3">
          
          {/* Busca instantânea */}
          <div className="relative">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Pesquisa instantânea por Nome, CPF, Telefone, Cidade, Bairro, Zona, Seção ou Título..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:border-blue-600 focus:bg-white transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Filtro por Estado */}
            <div>
              <select
                value={filtroEstado}
                onChange={(e) => {
                  setFiltroEstado(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:border-blue-600 font-medium"
              >
                <option value="TODOS">🌎 Todos os Estados ({eleitoresAutorizados.length})</option>
                {estadosDisponiveis.map((est) => (
                  <option key={est.name} value={est.name}>
                    {est.name} ({est.count})
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro por Cidade */}
            <div>
              <select
                value={filtroCidade}
                onChange={(e) => {
                  setFiltroCidade(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:border-blue-600 font-medium"
              >
                <option value="TODAS">📍 Todas as Cidades ({eleitoresAutorizados.length})</option>
                {cidadesDisponiveis.map((cid) => (
                  <option key={cid.name} value={cid.name}>
                    {cid.name} ({cid.count})
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro por Bairro */}
            <div>
              <select
                value={filtroBairro}
                onChange={(e) => {
                  setFiltroBairro(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:border-blue-600 font-medium"
              >
                <option value="TODOS">🏡 Todos os Bairros ({eleitoresAutorizados.length})</option>
                {bairrosDisponiveis.map((bai) => (
                  <option key={bai.name} value={bai.name}>
                    {bai.name} ({bai.count})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Pílulas de Filtro Rápido e Contador Geral do Filtro */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filtros Rápidos:
            </span>
            {[
              { id: 'TODOS', label: 'Todos os Registros', count: contagens.TODOS },
              { id: 'APOIADORES', label: '✅ Apoiadores Confirmados', count: contagens.APOIADORES },
              { id: 'LIDERES', label: '👑 Líderes Comunitários', count: contagens.LIDERES },
              { id: 'INFLUENCIADORES', label: '📢 Influenciadores', count: contagens.INFLUENCIADORES },
              { id: 'WHATSAPP', label: '📱 Admins de Grupo WhatsApp', count: contagens.WHATSAPP },
            ].map((pill) => (
              <button
                key={pill.id}
                onClick={() => {
                  setFiltroEspecial(pill.id as any);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  filtroEspecial === pill.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{pill.label}</span>
                <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-extrabold ${
                  filtroEspecial === pill.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {pill.count}
                </span>
              </button>
            ))}
          </div>

          <div className="shrink-0 flex justify-end">
            <span className="px-3.5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5">
              Total Encontrado: <span className="text-blue-400 font-extrabold text-sm">{eleitoresFiltrados.length}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Tabela de Eleitores */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-white font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Eleitor / Contato</th>
                <th className="py-3.5 px-4">Endereço</th>
                <th className="py-3.5 px-4">Dados Eleitorais</th>
                <th className="py-3.5 px-4">Perfil Político</th>
                <th className="py-3.5 px-4">Multiplicador</th>
                <th className="py-3.5 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedEleitores.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-slate-400">
                    <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />
                    <p className="text-sm font-medium">Nenhum eleitor encontrado para os critérios de busca.</p>
                  </td>
                </tr>
              ) : (
                paginatedEleitores.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50 transition-colors">
                    
                    {/* Eleitor */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 text-sm">{e.nomeCompleto}</div>
                      <div className="text-[11px] text-slate-400 font-mono">CPF: {e.cpf}</div>
                      <div className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3" /> {e.whatsapp || e.telefone || 'Sem telefone'}
                      </div>
                    </td>

                    {/* Endereço */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{e.bairro}</div>
                      <div className="text-[11px] text-slate-500">{e.cidade} - {e.estado}</div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[150px]">{e.rua}, {e.numero}</div>
                    </td>

                    {/* Eleitorais */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-indigo-700">Zona {e.zonaEleitoral || '--'} • Seção {e.secao || '--'}</div>
                      <div className="text-[11px] text-slate-500 truncate max-w-[160px]">{e.localVotacao || 'Não informado'}</div>
                      <span className="inline-block mt-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                        {e.situacaoEleitor}
                      </span>
                    </td>

                    {/* Perfil Político */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          e.apoiaCandidato ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {e.apoiaCandidato ? 'Apoiador' : 'Em Análise'}
                        </span>
                        {e.liderComunitario && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                            👑 Líder
                          </span>
                        )}
                        {e.possuiGrupoWhatsapp && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            📱 {e.quantidadeInfluenciados} alc.
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Multiplicador */}
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded-lg text-xs font-bold inline-block">
                        {e.multiplicadorNome.split(' ')[0]}
                      </span>
                      <div className="text-[10px] text-slate-400 mt-1">
                        {new Date(e.dataCadastro).toLocaleDateString('pt-BR')}
                      </div>
                    </td>

                    {/* Ações */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setEleitorViewing(e)}
                          className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                          title="Visualizar Ficha Completa"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {(isSuperAdmin || e.multiplicadorId === currentUser.id) && (
                          <>
                            <button
                              onClick={() => handleEdit(e)}
                              className="p-1.5 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors"
                              title="Editar Ficha"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(e)}
                              className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                              title="Excluir Cadastro"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Exibindo página <strong className="text-slate-800">{currentPage}</strong> de <strong>{totalPages}</strong> ({eleitoresFiltrados.length} eleitores)
            </span>
            <div className="flex gap-1.5">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 border border-slate-300 rounded-xl bg-white text-slate-700 disabled:opacity-40 hover:bg-slate-100 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 border border-slate-300 rounded-xl bg-white text-slate-700 disabled:opacity-40 hover:bg-slate-100 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <EleitorFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEleitorEditing(null);
        }}
        eleitorToEdit={eleitorEditing}
      />

      <EleitorDetailModal
        isOpen={!!eleitorViewing}
        onClose={() => setEleitorViewing(null)}
        eleitor={eleitorViewing}
      />

      <ConfirmModal
        isOpen={!!eleitorToDelete}
        title="Excluir Eleitor"
        message={`Tem certeza que deseja excluir o cadastro do eleitor "${eleitorToDelete?.nomeCompleto}"? Esta ação não pode ser desfeita e será registrada na auditoria LGPD.`}
        confirmText="Excluir"
        isDanger={true}
        onConfirm={() => {
          if (eleitorToDelete) {
            deleteEleitor(eleitorToDelete.id);
          }
          setEleitorToDelete(null);
        }}
        onCancel={() => setEleitorToDelete(null)}
      />
    </div>
  );
};
