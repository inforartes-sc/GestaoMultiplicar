import React, { useState, useEffect } from 'react';
import { Eleitor, DocumentoAnexo, TipoDocumento } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  User, 
  MapPin, 
  Vote, 
  Share2, 
  UploadCloud, 
  FileText, 
  Trash2, 
  CheckCircle2, 
  ShieldAlert, 
  HelpCircle 
} from 'lucide-react';

interface EleitorFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  eleitorToEdit?: Eleitor | null;
}

export const EleitorFormModal: React.FC<EleitorFormModalProps> = ({ isOpen, onClose, eleitorToEdit }) => {
  const { addEleitor, updateEleitor } = useApp();
  const [activeTab, setActiveTab] = useState<'pessoais' | 'endereco' | 'eleitorais' | 'politicas' | 'documentos'>('pessoais');

  // Form states
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [cpf, setCpf] = useState('');
  const [rg, setRg] = useState('');
  const [orgaoEmissor, setOrgaoEmissor] = useState('SSP/SP');
  const [dataNascimento, setDataNascimento] = useState('');
  const [sexo, setSexo] = useState<'M' | 'F' | 'OUTRO' | 'NAO_INFORMADO'>('M');
  const [estadoCivil, setEstadoCivil] = useState<'SOLTEIRO' | 'CASADO' | 'DIVORCIADO' | 'VIUVO' | 'UNIAO_ESTAVEL'>('CASADO');
  const [escolaridade, setEscolaridade] = useState('Ensino Médio Completo');
  const [profissao, setProfissao] = useState('');
  const [telefone, setTelefone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [nomeMae, setNomeMae] = useState('');
  const [nomePai, setNomePai] = useState('');

  // Endereço
  const [cep, setCep] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('São Paulo');
  const [estado, setEstado] = useState('SP');
  const [pontoReferencia, setPontoReferencia] = useState('');

  // Eleitorais
  const [tituloEleitor, setTituloEleitor] = useState('');
  const [zonaEleitoral, setZonaEleitoral] = useState('');
  const [secao, setSecao] = useState('');
  const [municipioVota, setMunicipioVota] = useState('São Paulo');
  const [localVotacao, setLocalVotacao] = useState('');
  const [situacaoEleitor, setSituacaoEleitor] = useState<'REGULAR' | 'PENDENTE' | 'TRANSFERIDO' | 'CANCELADO'>('REGULAR');
  const [observacoes, setObservacoes] = useState('');

  // Políticas
  const [apoiaCandidato, setApoiaCandidato] = useState(true);
  const [jaVotouAnteriormente, setJaVotouAnteriormente] = useState(false);
  const [liderComunitario, setLiderComunitario] = useState(false);
  const [influenciador, setInfluenciador] = useState(false);
  const [possuiGrupoWhatsapp, setPossuiGrupoWhatsapp] = useState(false);
  const [quantidadeInfluenciados, setQuantidadeInfluenciados] = useState<number>(10);
  const [comentarios, setComentarios] = useState('');

  // Documentos
  const [documentos, setDocumentos] = useState<DocumentoAnexo[]>([]);
  const [tipoDocSelecionado, setTipoDocSelecionado] = useState<TipoDocumento>('RG');

  // LGPD
  const [consentimentoLGPD, setConsentimentoLGPD] = useState(true);

  useEffect(() => {
    if (eleitorToEdit) {
      setNomeCompleto(eleitorToEdit.nomeCompleto);
      setCpf(eleitorToEdit.cpf);
      setRg(eleitorToEdit.rg);
      setOrgaoEmissor(eleitorToEdit.orgaoEmissor || 'SSP/SP');
      setDataNascimento(eleitorToEdit.dataNascimento || '');
      setSexo(eleitorToEdit.sexo || 'M');
      setEstadoCivil(eleitorToEdit.estadoCivil || 'SOLTEIRO');
      setEscolaridade(eleitorToEdit.escolaridade || '');
      setProfissao(eleitorToEdit.profissao || '');
      setTelefone(eleitorToEdit.telefone || '');
      setWhatsapp(eleitorToEdit.whatsapp || '');
      setEmail(eleitorToEdit.email || '');
      setNomeMae(eleitorToEdit.nomeMae || '');
      setNomePai(eleitorToEdit.nomePai || '');

      setCep(eleitorToEdit.cep || '');
      setRua(eleitorToEdit.rua || '');
      setNumero(eleitorToEdit.numero || '');
      setComplemento(eleitorToEdit.complemento || '');
      setBairro(eleitorToEdit.bairro || '');
      setCidade(eleitorToEdit.cidade || '');
      setEstado(eleitorToEdit.estado || 'SP');
      setPontoReferencia(eleitorToEdit.pontoReferencia || '');

      setTituloEleitor(eleitorToEdit.tituloEleitor || '');
      setZonaEleitoral(eleitorToEdit.zonaEleitoral || '');
      setSecao(eleitorToEdit.secao || '');
      setMunicipioVota(eleitorToEdit.municipioVota || '');
      setLocalVotacao(eleitorToEdit.localVotacao || '');
      setSituacaoEleitor(eleitorToEdit.situacaoEleitor || 'REGULAR');
      setObservacoes(eleitorToEdit.observacoes || '');

      setApoiaCandidato(eleitorToEdit.apoiaCandidato);
      setJaVotouAnteriormente(eleitorToEdit.jaVotouAnteriormente);
      setLiderComunitario(eleitorToEdit.liderComunitario);
      setInfluenciador(eleitorToEdit.influenciador);
      setPossuiGrupoWhatsapp(eleitorToEdit.possuiGrupoWhatsapp);
      setQuantidadeInfluenciados(eleitorToEdit.quantidadeInfluenciados || 0);
      setComentarios(eleitorToEdit.comentarios || '');

      setDocumentos(eleitorToEdit.documentos || []);
      setConsentimentoLGPD(eleitorToEdit.consentimentoLGPD);
    } else {
      // Limpar formulário para novo cadastro
      setNomeCompleto('');
      setCpf('');
      setRg('');
      setOrgaoEmissor('SSP/SP');
      setDataNascimento('');
      setSexo('M');
      setEstadoCivil('CASADO');
      setEscolaridade('Ensino Médio Completo');
      setProfissao('');
      setTelefone('');
      setWhatsapp('');
      setEmail('');
      setNomeMae('');
      setNomePai('');

      setCep('');
      setRua('');
      setNumero('');
      setComplemento('');
      setBairro('');
      setCidade('São Paulo');
      setEstado('SP');
      setPontoReferencia('');

      setTituloEleitor('');
      setZonaEleitoral('');
      setSecao('');
      setMunicipioVota('São Paulo');
      setLocalVotacao('');
      setSituacaoEleitor('REGULAR');
      setObservacoes('');

      setApoiaCandidato(true);
      setJaVotouAnteriormente(false);
      setLiderComunitario(false);
      setInfluenciador(false);
      setPossuiGrupoWhatsapp(false);
      setQuantidadeInfluenciados(10);
      setComentarios('');
      setDocumentos([]);
      setConsentimentoLGPD(true);
    }
  }, [eleitorToEdit, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    
    const formato = file.name.endsWith('.pdf') ? 'PDF' : file.name.endsWith('.png') ? 'PNG' : 'JPG';
    const novoDoc: DocumentoAnexo = {
      id: `doc-${Date.now()}`,
      tipo: tipoDocSelecionado,
      nomeArquivo: file.name,
      tamanhoKb: Math.round(file.size / 1024) || 250,
      dataUpload: new Date().toISOString(),
      formato,
      url: URL.createObjectURL(file),
    };
    setDocumentos(prev => [...prev, novoDoc]);
  };

  const handleRemoveDoc = (id: string) => {
    setDocumentos(prev => prev.filter(d => d.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomeCompleto.trim() || !cpf.trim() || !cidade.trim()) {
      alert('Por favor, preencha os campos obrigatórios (Nome, CPF, Cidade).');
      return;
    }
    if (!consentimentoLGPD) {
      alert('É obrigatório obter e registrar o consentimento LGPD do eleitor.');
      return;
    }

    const payload = {
      nomeCompleto,
      cpf,
      rg,
      orgaoEmissor,
      dataNascimento,
      sexo,
      estadoCivil,
      escolaridade,
      profissao,
      telefone,
      whatsapp: whatsapp || telefone,
      email,
      nomeMae,
      nomePai,
      cep,
      rua,
      numero,
      complemento,
      bairro,
      cidade,
      estado,
      pontoReferencia,
      tituloEleitor,
      zonaEleitoral,
      secao,
      municipioVota,
      localVotacao,
      situacaoEleitor,
      observacoes,
      apoiaCandidato,
      jaVotouAnteriormente,
      liderComunitario,
      influenciador,
      possuiGrupoWhatsapp,
      quantidadeInfluenciados: Number(quantidadeInfluenciados) || 0,
      comentarios,
      documentos,
      consentimentoLGPD,
      dataConsentimento: new Date().toISOString(),
      ipConsentimento: '189.120.45.10',
    };

    if (eleitorToEdit) {
      updateEleitor(eleitorToEdit.id, payload);
    } else {
      addEleitor(payload);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        
        {/* Cabeçalho */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-lg font-bold">
              {eleitorToEdit ? 'Editar Ficha do Eleitor' : 'Novo Cadastro de Eleitor'}
            </h2>
            <p className="text-xs text-blue-400">
              {eleitorToEdit ? `ID: ${eleitorToEdit.id}` : 'Preencha as informações completas para a base política'}
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Abas */}
        <div className="flex border-b border-slate-200 bg-slate-50 overflow-x-auto shrink-0 px-2 pt-2">
          <button
            type="button"
            onClick={() => setActiveTab('pessoais')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl flex items-center gap-2 border-b-2 transition-all shrink-0 ${
              activeTab === 'pessoais' ? 'bg-white border-blue-600 text-blue-600 shadow-2xs' : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4" /> 1. Dados Pessoais
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('endereco')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl flex items-center gap-2 border-b-2 transition-all shrink-0 ${
              activeTab === 'endereco' ? 'bg-white border-blue-600 text-blue-600 shadow-2xs' : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-4 h-4" /> 2. Endereço
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('eleitorais')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl flex items-center gap-2 border-b-2 transition-all shrink-0 ${
              activeTab === 'eleitorais' ? 'bg-white border-blue-600 text-blue-600 shadow-2xs' : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Vote className="w-4 h-4" /> 3. Dados Eleitorais
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('politicas')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl flex items-center gap-2 border-b-2 transition-all shrink-0 ${
              activeTab === 'politicas' ? 'bg-white border-blue-600 text-blue-600 shadow-2xs' : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Share2 className="w-4 h-4" /> 4. Perfil Político
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('documentos')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl flex items-center gap-2 border-b-2 transition-all shrink-0 ${
              activeTab === 'documentos' ? 'bg-white border-blue-600 text-blue-600 shadow-2xs' : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <UploadCloud className="w-4 h-4" /> 5. Documentos ({documentos.length})
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Aba 1: Dados Pessoais */}
          {activeTab === 'pessoais' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Nome Completo *</label>
                <input
                  type="text"
                  required
                  value={nomeCompleto}
                  onChange={(e) => setNomeCompleto(e.target.value)}
                  placeholder="Ex: Fernando Oliveira de Albuquerque"
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:border-blue-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">CPF *</label>
                <input
                  type="text"
                  required
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  placeholder="000.000.000-00"
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:border-blue-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">RG</label>
                <input
                  type="text"
                  value={rg}
                  onChange={(e) => setRg(e.target.value)}
                  placeholder="00.000.000-X"
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Órgão Emissor</label>
                <input
                  type="text"
                  value={orgaoEmissor}
                  onChange={(e) => setOrgaoEmissor(e.target.value)}
                  placeholder="SSP/SP"
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Data de Nascimento</label>
                <input
                  type="date"
                  value={dataNascimento}
                  onChange={(e) => setDataNascimento(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Sexo</label>
                <select
                  value={sexo}
                  onChange={(e) => setSexo(e.target.value as any)}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm bg-white"
                >
                  <option value="M">Masculino</option>
                  <option value="F">Feminino</option>
                  <option value="OUTRO">Outro</option>
                  <option value="NAO_INFORMADO">Prefiro não informar</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Estado Civil</label>
                <select
                  value={estadoCivil}
                  onChange={(e) => setEstadoCivil(e.target.value as any)}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm bg-white"
                >
                  <option value="SOLTEIRO">Solteiro(a)</option>
                  <option value="CASADO">Casado(a)</option>
                  <option value="UNIAO_ESTAVEL">União Estável</option>
                  <option value="DIVORCIADO">Divorciado(a)</option>
                  <option value="VIUVO">Viúvo(a)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Escolaridade</label>
                <input
                  type="text"
                  value={escolaridade}
                  onChange={(e) => setEscolaridade(e.target.value)}
                  placeholder="Ex: Superior Completo"
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Profissão</label>
                <input
                  type="text"
                  value={profissao}
                  onChange={(e) => setProfissao(e.target.value)}
                  placeholder="Ex: Advogado, Professor"
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Telefone</label>
                <input
                  type="text"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  placeholder="(11) 3333-4444"
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-emerald-700 mb-1">WhatsApp *</label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="(11) 99999-8888"
                  className="w-full border border-emerald-300 rounded-xl px-3 py-2 text-sm focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">E-mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="eleitor@email.com"
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Nome da Mãe</label>
                <input
                  type="text"
                  value={nomeMae}
                  onChange={(e) => setNomeMae(e.target.value)}
                  placeholder="Nome completo da mãe"
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Nome do Pai</label>
                <input
                  type="text"
                  value={nomePai}
                  onChange={(e) => setNomePai(e.target.value)}
                  placeholder="Nome completo do pai"
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
                />
              </div>
            </div>
          )}

          {/* Aba 2: Endereço */}
          {activeTab === 'endereco' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-in fade-in">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">CEP</label>
                <input
                  type="text"
                  value={cep}
                  onChange={(e) => setCep(e.target.value)}
                  placeholder="00000-000"
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">Rua / Avenida</label>
                <input
                  type="text"
                  value={rua}
                  onChange={(e) => setRua(e.target.value)}
                  placeholder="Av. Paulista"
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Número</label>
                <input
                  type="text"
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                  placeholder="1000"
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Complemento</label>
                <input
                  type="text"
                  value={complemento}
                  onChange={(e) => setComplemento(e.target.value)}
                  placeholder="Apto 101, Bloco B"
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Bairro *</label>
                <input
                  type="text"
                  value={bairro}
                  onChange={(e) => setBairro(e.target.value)}
                  placeholder="Centro"
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Cidade *</label>
                <input
                  type="text"
                  required
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                  placeholder="São Paulo"
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Estado (UF)</label>
                <input
                  type="text"
                  value={estado}
                  onChange={(e) => setEstado(e.target.value)}
                  placeholder="SP"
                  maxLength={2}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm uppercase"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-medium text-slate-700 mb-1">Ponto de Referência</label>
                <input
                  type="text"
                  value={pontoReferencia}
                  onChange={(e) => setPontoReferencia(e.target.value)}
                  placeholder="Próximo ao posto de saúde central"
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
                />
              </div>
            </div>
          )}

          {/* Aba 3: Dados Eleitorais */}
          {activeTab === 'eleitorais' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-in fade-in">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">Número do Título de Eleitor</label>
                <input
                  type="text"
                  value={tituloEleitor}
                  onChange={(e) => setTituloEleitor(e.target.value)}
                  placeholder="0000 0000 0000"
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Situação do Eleitor</label>
                <select
                  value={situacaoEleitor}
                  onChange={(e) => setSituacaoEleitor(e.target.value as any)}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm bg-white font-medium"
                >
                  <option value="REGULAR">Regular</option>
                  <option value="PENDENTE">Pendente de Biometria / Atualização</option>
                  <option value="TRANSFERIDO">Transferido</option>
                  <option value="CANCELADO">Cancelado</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Zona Eleitoral</label>
                <input
                  type="text"
                  value={zonaEleitoral}
                  onChange={(e) => setZonaEleitoral(e.target.value)}
                  placeholder="002"
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Seção</label>
                <input
                  type="text"
                  value={secao}
                  onChange={(e) => setSecao(e.target.value)}
                  placeholder="0145"
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Município onde vota</label>
                <input
                  type="text"
                  value={municipioVota}
                  onChange={(e) => setMunicipioVota(e.target.value)}
                  placeholder="São Paulo"
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-medium text-slate-700 mb-1">Local de Votação (Escola / Clube)</label>
                <input
                  type="text"
                  value={localVotacao}
                  onChange={(e) => setLocalVotacao(e.target.value)}
                  placeholder="Colégio Estadual Central"
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-medium text-slate-700 mb-1">Observações Eleitorais</label>
                <textarea
                  rows={2}
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  placeholder="Ex: Precisa de transporte ou apoio para consulta da zona eleitoral..."
                  className="w-full border border-slate-300 rounded-xl p-3 text-sm"
                />
              </div>
            </div>
          )}

          {/* Aba 4: Perfil Político */}
          {activeTab === 'politicas' && (
            <div className="space-y-5 animate-in fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Apoia */}
                <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-sm text-blue-950 block">Possui interesse em apoiar?</span>
                    <span className="text-xs text-blue-700">Confirmado como base de apoio ao candidato</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={apoiaCandidato}
                    onChange={(e) => setApoiaCandidato(e.target.checked)}
                    className="w-6 h-6 rounded-md text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </div>

                {/* Votou Antes */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-sm text-slate-900 block">Já votou no candidato anteriormente?</span>
                    <span className="text-xs text-slate-500">Eleitor de eleições passadas</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={jaVotouAnteriormente}
                    onChange={(e) => setJaVotouAnteriormente(e.target.checked)}
                    className="w-6 h-6 rounded-md text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </div>

                {/* Líder Comunitário */}
                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-sm text-amber-950 block">É líder comunitário?</span>
                    <span className="text-xs text-amber-800">Presidente de bairro, associação ou paróquia</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={liderComunitario}
                    onChange={(e) => setLiderComunitario(e.target.checked)}
                    className="w-6 h-6 rounded-md text-amber-600 focus:ring-amber-500 cursor-pointer"
                  />
                </div>

                {/* Influenciador */}
                <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-sm text-purple-950 block">É influenciador?</span>
                    <span className="text-xs text-purple-800">Possui voz ativa nas redes sociais ou local</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={influenciador}
                    onChange={(e) => setInfluenciador(e.target.checked)}
                    className="w-6 h-6 rounded-md text-purple-600 focus:ring-purple-500 cursor-pointer"
                  />
                </div>

              </div>

              {/* Grupo WhatsApp */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div className="flex items-center justify-between sm:pr-4">
                  <div>
                    <span className="font-bold text-sm text-emerald-950 block">Possui ou administra grupo de WhatsApp?</span>
                    <span className="text-xs text-emerald-800">Grupos de condomínio, bairro ou profissão</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={possuiGrupoWhatsapp}
                    onChange={(e) => setPossuiGrupoWhatsapp(e.target.checked)}
                    className="w-6 h-6 rounded-md text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-emerald-900 mb-1">
                    Quantidade aproximada de pessoas influenciadas / alcançadas
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={quantidadeInfluenciados}
                    onChange={(e) => setQuantidadeInfluenciados(Number(e.target.value))}
                    className="w-full bg-white border border-emerald-300 rounded-xl px-3 py-2 text-sm font-bold text-emerald-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Comentários e Histórico de Mobilização</label>
                <textarea
                  rows={3}
                  value={comentarios}
                  onChange={(e) => setComentarios(e.target.value)}
                  placeholder="Descreva o potencial de apoio, demandas do bairro ou histórico de reuniões..."
                  className="w-full border border-slate-300 rounded-xl p-3 text-sm"
                />
              </div>
            </div>
          )}

          {/* Aba 5: Documentos */}
          {activeTab === 'documentos' && (
            <div className="space-y-6 animate-in fade-in">
              
              {/* Simulador de Upload */}
              <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-3xl p-6 text-center">
                <UploadCloud className="w-10 h-10 text-blue-600 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-slate-800">Anexar Documento do Eleitor</h3>
                <p className="text-xs text-slate-500 mb-4">Formatos suportados: PDF, JPG, PNG, JPEG (Máx 10MB)</p>

                <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
                  <label className="text-xs font-semibold text-slate-700">Tipo de Documento:</label>
                  <select
                    value={tipoDocSelecionado}
                    onChange={(e) => setTipoDocSelecionado(e.target.value as any)}
                    className="border border-slate-300 rounded-xl px-3 py-1.5 text-xs bg-white font-medium"
                  >
                    <option value="TITULO_ELEITOR">Título de Eleitor</option>
                    <option value="RG">RG (Frente e Verso)</option>
                    <option value="CPF">CPF</option>
                    <option value="COMPROVANTE_RESIDENCIA">Comprovante de Residência</option>
                    <option value="OUTROS">Outros Documentos</option>
                  </select>

                  <label className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shadow-md cursor-pointer transition-all flex items-center gap-1.5">
                    <UploadCloud className="w-4 h-4" /> Selecionar Arquivo...
                    <input type="file" onChange={handleFileUpload} accept=".pdf,.jpg,.png,.jpeg" className="hidden" />
                  </label>
                </div>
              </div>

              {/* Lista de Documentos Anexados */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Documentos Anexados ({documentos.length})
                </h4>

                {documentos.length === 0 ? (
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
                    Nenhum documento anexado ainda.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {documentos.map((doc) => (
                      <div key={doc.id} className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-3 shadow-2xs">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg font-bold text-xs">
                            {doc.formato}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800">{doc.nomeArquivo}</p>
                            <p className="text-[10px] text-slate-500">
                              Tipo: <span className="font-semibold text-blue-600">{doc.tipo}</span> • {doc.tamanhoKb} KB • Anexado em {new Date(doc.dataUpload).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveDoc(doc.id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remover documento"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* Seção Obrigatória LGPD */}
          <div className="p-4 bg-emerald-50/80 border border-emerald-300 rounded-2xl flex items-start gap-3 mt-4">
            <input
              type="checkbox"
              id="lgpd_check"
              checked={consentimentoLGPD}
              onChange={(e) => setConsentimentoLGPD(e.target.checked)}
              className="mt-0.5 w-5 h-5 rounded-md text-emerald-600 focus:ring-emerald-500 cursor-pointer"
            />
            <label htmlFor="lgpd_check" className="text-xs text-emerald-950 cursor-pointer leading-relaxed">
              <span className="font-bold">Declaração de Conformidade LGPD:</span> Declaro que obtive o consentimento livre, expresso e informado deste eleitor para a coleta e tratamento de seus dados pessoais para fins exclusivos de contato político, em estrita conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).
            </label>
          </div>

          {/* Botões de Ação */}
          <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-200 sticky bottom-0 bg-white">
            <button
              type="button"
              onClick={() => {
                const abas: Array<'pessoais' | 'endereco' | 'eleitorais' | 'politicas' | 'documentos'> = ['pessoais', 'endereco', 'eleitorais', 'politicas', 'documentos'];
                const idx = abas.indexOf(activeTab);
                if (idx > 0) setActiveTab(abas[idx - 1]);
              }}
              disabled={activeTab === 'pessoais'}
              className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 disabled:opacity-40 hover:bg-slate-50 transition-colors"
            >
              ← Anterior
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                {eleitorToEdit ? 'Salvar Alterações' : 'Concluir Cadastro'}
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                const abas: Array<'pessoais' | 'endereco' | 'eleitorais' | 'politicas' | 'documentos'> = ['pessoais', 'endereco', 'eleitorais', 'politicas', 'documentos'];
                const idx = abas.indexOf(activeTab);
                if (idx < abas.length - 1) setActiveTab(abas[idx + 1]);
              }}
              disabled={activeTab === 'documentos'}
              className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-semibold disabled:opacity-40 hover:bg-slate-700 transition-colors"
            >
              Próxima Aba →
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
