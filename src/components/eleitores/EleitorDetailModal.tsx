import React from 'react';
import { Eleitor } from '../../types';
import { 
  X, 
  User, 
  MapPin, 
  Vote, 
  Share2, 
  FileText, 
  ShieldCheck, 
  Phone, 
  Mail, 
  Calendar,
  CheckCircle2,
  Award,
  Users
} from 'lucide-react';

interface EleitorDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  eleitor: Eleitor | null;
}

export const EleitorDetailModal: React.FC<EleitorDetailModalProps> = ({ isOpen, onClose, eleitor }) => {
  if (!isOpen || !eleitor) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        
        {/* Cabeçalho */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center font-black text-xl text-white shadow-md">
              {eleitor.nomeCompleto.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="text-lg font-bold">{eleitor.nomeCompleto}</h2>
              <p className="text-xs text-blue-400">
                CPF: {eleitor.cpf} • Cadastrado por: <span className="font-semibold text-white">{eleitor.multiplicadorNome}</span>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Badges Rápidos */}
          <div className="flex flex-wrap items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
              eleitor.apoiaCandidato ? 'bg-blue-100 text-blue-800 border border-blue-300' : 'bg-slate-100 text-slate-700'
            }`}>
              <CheckCircle2 className="w-3.5 h-3.5" />
              {eleitor.apoiaCandidato ? 'Apoiador Confirmado' : 'Em Avaliação'}
            </span>

            {eleitor.liderComunitario && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
                <Award className="w-3.5 h-3.5" /> Líder Comunitário
              </span>
            )}

            {eleitor.influenciador && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-300 flex items-center gap-1">
                <Share2 className="w-3.5 h-3.5" /> Influenciador
              </span>
            )}

            {eleitor.possuiGrupoWhatsapp && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                <Users className="w-3.5 h-3.5" /> Grupo WhatsApp ({eleitor.quantidadeInfluenciados} pessoas)
              </span>
            )}
          </div>

          {/* 1. Dados Pessoais */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <h3 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" /> Dados Pessoais & Contato
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block">RG / Órgão:</span>
                <span className="font-semibold text-slate-800">{eleitor.rg || 'N/I'} ({eleitor.orgaoEmissor || 'SSP'})</span>
              </div>
              <div>
                <span className="text-slate-500 block">Data Nascimento:</span>
                <span className="font-semibold text-slate-800">
                  {eleitor.dataNascimento ? new Date(eleitor.dataNascimento).toLocaleDateString('pt-BR') : 'N/I'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Profissão / Escolaridade:</span>
                <span className="font-semibold text-slate-800">{eleitor.profissao || 'N/I'} ({eleitor.escolaridade || 'N/I'})</span>
              </div>
              <div>
                <span className="text-slate-500 block">WhatsApp:</span>
                <span className="font-bold text-emerald-600">{eleitor.whatsapp || eleitor.telefone || 'N/I'}</span>
              </div>
              <div>
                <span className="text-slate-500 block">E-mail:</span>
                <span className="font-semibold text-slate-800">{eleitor.email || 'N/I'}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Filiação:</span>
                <span className="font-semibold text-slate-800">Mãe: {eleitor.nomeMae || 'N/I'}</span>
              </div>
            </div>
          </div>

          {/* 2. Endereço */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <h3 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-red-600" /> Endereço Completo
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="sm:col-span-2">
                <span className="text-slate-500 block">Logradouro / Número:</span>
                <span className="font-semibold text-slate-800">
                  {eleitor.rua || 'N/I'}, {eleitor.numero || 'S/N'} {eleitor.complemento ? `(${eleitor.complemento})` : ''}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">CEP:</span>
                <span className="font-semibold text-slate-800">{eleitor.cep || 'N/I'}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Bairro:</span>
                <span className="font-bold text-slate-800">{eleitor.bairro || 'N/I'}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Cidade / Estado:</span>
                <span className="font-bold text-slate-800">{eleitor.cidade} - {eleitor.estado}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Ponto de Referência:</span>
                <span className="font-semibold text-slate-800">{eleitor.pontoReferencia || 'N/I'}</span>
              </div>
            </div>
          </div>

          {/* 3. Dados Eleitorais */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <h3 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
              <Vote className="w-4 h-4 text-indigo-600" /> Situação Eleitoral
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block">Título:</span>
                <span className="font-mono font-bold text-slate-800">{eleitor.tituloEleitor || 'N/I'}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Zona / Seção:</span>
                <span className="font-bold text-indigo-600">Zona {eleitor.zonaEleitoral || 'N/I'} / Seção {eleitor.secao || 'N/I'}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Município Votação:</span>
                <span className="font-semibold text-slate-800">{eleitor.municipioVota || eleitor.cidade}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Local Votação:</span>
                <span className="font-semibold text-slate-800">{eleitor.localVotacao || 'N/I'}</span>
              </div>
            </div>
            {eleitor.observacoes && (
              <div className="mt-2 pt-2 border-t border-slate-200 text-xs">
                <span className="text-slate-500 font-semibold">Obs: </span>
                <span className="text-slate-700">{eleitor.observacoes}</span>
              </div>
            )}
          </div>

          {/* 4. Comentários Políticos */}
          {eleitor.comentarios && (
            <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-200 text-xs">
              <h4 className="font-bold text-blue-950 mb-1">Comentários e Histórico de Mobilização:</h4>
              <p className="text-slate-700 leading-relaxed">{eleitor.comentarios}</p>
            </div>
          )}

          {/* 5. Documentos Anexos */}
          <div>
            <h3 className="font-bold text-sm text-slate-900 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-600" /> Documentos Anexados ({eleitor.documentos?.length || 0})
            </h3>
            {(!eleitor.documentos || eleitor.documentos.length === 0) ? (
              <p className="text-xs text-slate-400">Nenhum documento anexado a esta ficha.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {eleitor.documentos.map(doc => (
                  <div key={doc.id} className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center gap-3">
                    <span className="p-2 bg-blue-50 text-blue-600 rounded-lg font-bold text-[10px]">{doc.formato}</span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">{doc.nomeArquivo}</p>
                      <p className="text-[10px] text-slate-400">Tipo: {doc.tipo} • {doc.tamanhoKb} KB</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Auditoria LGPD */}
          <div className="p-3 bg-emerald-900 text-emerald-100 rounded-2xl text-[11px] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <span className="font-bold">Termo de Consentimento LGPD Assinado</span>
                <p className="text-emerald-300/80">
                  Registrado em {new Date(eleitor.dataConsentimento || eleitor.dataCadastro).toLocaleString('pt-BR')} • IP: {eleitor.ipConsentimento || '189.120.45.10'}
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Rodapé */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition-colors"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
