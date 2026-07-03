import React, { useState } from 'react';
import { User, Eleitor } from '../../types';
import { useApp } from '../../context/AppContext';
import { EleitorDetailModal } from '../eleitores/EleitorDetailModal';
import { exportEleitoresToExcel, exportEleitoresToCSV, printOrExportPDF } from '../../utils/exportUtils';
import { 
  X, 
  Users, 
  Search, 
  Phone, 
  MapPin, 
  Vote, 
  Eye, 
  FileSpreadsheet, 
  FileText, 
  Printer, 
  CheckCircle2, 
  Award, 
  UserCheck
} from 'lucide-react';

interface MultiplicadorEleitoresModalProps {
  isOpen: boolean;
  onClose: () => void;
  multiplicador: User | null;
}

export const MultiplicadorEleitoresModal: React.FC<MultiplicadorEleitoresModalProps> = ({
  isOpen,
  onClose,
  multiplicador
}) => {
  const { eleitores } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [eleitorViewing, setEleitorViewing] = useState<Eleitor | null>(null);

  if (!isOpen || !multiplicador) return null;

  // Filtrar eleitores cadastrados exclusivamente por este multiplicador
  const eleitoresDoMultiplicador = eleitores.filter(
    (e) => e.multiplicadorId === multiplicador.id
  );

  const eleitoresFiltrados = eleitoresDoMultiplicador.filter((e) => {
    if (!searchTerm.trim()) return true;
    const termo = searchTerm.toLowerCase();
    const comb = `${e.nomeCompleto} ${e.cpf} ${e.telefone} ${e.whatsapp} ${e.cidade} ${e.bairro} ${e.zonaEleitoral} ${e.secao}`.toLowerCase();
    return comb.includes(termo);
  });

  const handleExportPDF = () => {
    const cabecalhos = ['Nome Completo', 'CPF', 'WhatsApp', 'Cidade / Bairro', 'Zona / Seção', 'Apoio'];
    const linhas = eleitoresFiltrados.map((e) => [
      e.nomeCompleto,
      e.cpf,
      e.whatsapp || e.telefone || 'N/I',
      `${e.cidade} / ${e.bairro}`,
      `Z: ${e.zonaEleitoral || '--'} S: ${e.secao || '--'}`,
      e.apoiaCandidato ? 'Sim' : 'Em Análise',
    ]);
    printOrExportPDF(
      `Relatório de Eleitores — ${multiplicador.nome}`,
      `Multiplicador: @${multiplicador.login} • Cidade: ${multiplicador.cidade} • Total: ${eleitoresFiltrados.length} eleitores`,
      cabecalhos,
      linhas
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        
        {/* Cabeçalho */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center font-black text-lg text-white shadow-md">
              {multiplicador.nome.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white">{multiplicador.nome}</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/30 text-indigo-300 border border-indigo-500/40">
                  @{multiplicador.login}
                </span>
              </div>
              <p className="text-xs text-slate-300 flex items-center gap-3 mt-1">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-indigo-400" /> {multiplicador.cidade}</span>
                <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-emerald-400" /> {multiplicador.telefone || 'Sem telefone'}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Barra de Ações e Busca */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Pesquisar eleitor deste multiplicador..."
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-800 focus:outline-hidden focus:border-indigo-600"
            />
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
            <span className="text-xs font-bold text-slate-600 px-2.5 py-1 bg-white border border-slate-200 rounded-xl">
              Total: <strong className="text-indigo-600">{eleitoresDoMultiplicador.length}</strong> cad.
            </span>

            <div className="flex items-center gap-1">
              <button
                onClick={() => exportEleitoresToExcel(eleitoresFiltrados)}
                className="p-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl transition-colors"
                title="Exportar para Excel"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              </button>
              <button
                onClick={() => exportEleitoresToCSV(eleitoresFiltrados)}
                className="p-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl transition-colors"
                title="Exportar para CSV"
              >
                <FileText className="w-4 h-4 text-blue-600" />
              </button>
              <button
                onClick={handleExportPDF}
                className="p-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl transition-colors"
                title="Imprimir / Exportar PDF"
              >
                <Printer className="w-4 h-4 text-purple-600" />
              </button>
            </div>
          </div>

        </div>

        {/* Conteúdo / Tabela de Eleitores */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {eleitoresFiltrados.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <Users className="w-12 h-12 mx-auto opacity-30 text-indigo-600" />
              <p className="text-sm font-semibold text-slate-700">
                {eleitoresDoMultiplicador.length === 0
                  ? 'Este multiplicador ainda não possui nenhum eleitor cadastrado.'
                  : 'Nenhum eleitor encontrado para o filtro digitado.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Eleitor / Contato</th>
                    <th className="py-3 px-4">Endereço</th>
                    <th className="py-3 px-4">Zona / Seção</th>
                    <th className="py-3 px-4">Engajamento</th>
                    <th className="py-3 px-4 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {eleitoresFiltrados.map((e) => (
                    <tr key={e.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 text-sm">{e.nomeCompleto}</div>
                        <div className="text-[11px] text-slate-400 font-mono">CPF: {e.cpf}</div>
                        <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3" /> {e.whatsapp || e.telefone || 'Sem fone'}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800">{e.bairro || 'N/I'}</div>
                        <div className="text-[11px] text-slate-500">{e.cidade} - {e.estado}</div>
                      </td>

                      <td className="py-3 px-4 font-bold text-indigo-700">
                        Z: {e.zonaEleitoral || '--'} • S: {e.secao || '--'}
                      </td>

                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                          e.apoiaCandidato
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          <CheckCircle2 className="w-3 h-3" />
                          {e.apoiaCandidato ? 'Apoiador' : 'Em Análise'}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setEleitorViewing(e)}
                          className="px-2.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" /> Ficha
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Rodapé */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500">
            Mostrando <strong>{eleitoresFiltrados.length}</strong> de <strong>{eleitoresDoMultiplicador.length}</strong> cadastros
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>

      </div>

      {/* Modal individual de detalhes do eleitor */}
      <EleitorDetailModal
        isOpen={!!eleitorViewing}
        onClose={() => setEleitorViewing(null)}
        eleitor={eleitorViewing}
      />
    </div>
  );
};
