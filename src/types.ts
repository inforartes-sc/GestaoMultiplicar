export type Role = 'MASTER' | 'SUPER_ADMIN' | 'MULTIPLICADOR';

export interface User {
  id: string;
  nome: string;
  login: string;
  senha?: string;
  telefone: string;
  cidade: string;
  situacao: 'ATIVO' | 'INATIVO';
  role: Role;
  dataCriacao: string;
  avatar?: string;
  metaMensal?: number;
}

export type TipoDocumento = 'RG' | 'CPF' | 'TITULO_ELEITOR' | 'COMPROVANTE_RESIDENCIA' | 'OUTROS';

export interface DocumentoAnexo {
  id: string;
  tipo: TipoDocumento;
  nomeArquivo: string;
  tamanhoKb: number;
  dataUpload: string;
  formato: 'PDF' | 'JPG' | 'PNG' | 'JPEG';
  url: string;
}

export interface Eleitor {
  id: string;
  multiplicadorId: string;
  multiplicadorNome: string;
  dataCadastro: string;
  ultimaAlteracao: string;

  // Dados Pessoais
  nomeCompleto: string;
  cpf: string;
  rg: string;
  orgaoEmissor: string;
  dataNascimento: string;
  sexo: 'M' | 'F' | 'OUTRO' | 'NAO_INFORMADO';
  estadoCivil: 'SOLTEIRO' | 'CASADO' | 'DIVORCIADO' | 'VIUVO' | 'UNIAO_ESTAVEL';
  escolaridade: string;
  profissao: string;
  telefone: string;
  whatsapp: string;
  email: string;
  nomeMae: string;
  nomePai?: string;

  // Endereço
  cep: string;
  rua: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  pontoReferencia?: string;

  // Dados Eleitorais
  tituloEleitor: string;
  zonaEleitoral: string;
  secao: string;
  municipioVota: string;
  localVotacao: string;
  situacaoEleitor: 'REGULAR' | 'PENDENTE' | 'TRANSFERIDO' | 'CANCELADO';
  observacoes?: string;

  // Informações Políticas
  apoiaCandidato: boolean;
  jaVotouAnteriormente: boolean;
  liderComunitario: boolean;
  influenciador: boolean;
  possuiGrupoWhatsapp: boolean;
  quantidadeInfluenciados: number;
  comentarios?: string;

  // Documentos
  documentos: DocumentoAnexo[];

  // LGPD
  consentimentoLGPD: boolean;
  dataConsentimento: string;
  ipConsentimento?: string;
}

export type TipoAcaoAudit = 'LOGIN' | 'LOGOUT' | 'CRIACAO' | 'ALTERACAO' | 'EXCLUSAO' | 'EXPORTACAO' | 'LGPD' | 'BLOQUEIO';

export interface AuditLog {
  id: string;
  acao: TipoAcaoAudit;
  entidade: 'ELEITOR' | 'MULTIPLICADOR' | 'SISTEMA' | 'SESSAO' | 'LGPD';
  usuarioId: string;
  usuarioNome: string;
  perfil: Role;
  dataHora: string;
  ip: string;
  detalhes: string;
}

export type TipoNotificacao = 'NOVO_CADASTRO' | 'MULTIPLICADOR_INATIVO' | 'CADASTRO_INCOMPLETO' | 'SISTEMA' | 'META_ATINGIDA';

export interface NotificationItem {
  id: string;
  tipo: TipoNotificacao;
  titulo: string;
  mensagem: string;
  dataHora: string;
  lido: boolean;
  multiplicadorId?: string;
  eleitorId?: string;
}

export interface SystemSettings {
  nomeSistema: string;
  candidatoApoiado: string;
  logoUrl?: string;
  corPrincipal: string;
  corSecundaria: string;
  imagemLoginUrl?: string;
  textoRodape: string;
  metaMensalPadrao: number;
  exigirConsentimentoLGPD: boolean;
  retencaoDadosMeses: number;
}
