import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Eleitor, AuditLog, NotificationItem, SystemSettings, TipoAcaoAudit, Candidato } from '../types';
import { INITIAL_USERS, INITIAL_ELEITORES, INITIAL_AUDIT_LOGS, INITIAL_NOTIFICATIONS, INITIAL_SETTINGS } from '../data/initialData';
import { supabase } from '../utils/supabaseClient';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  eleitores: Eleitor[];
  auditLogs: AuditLog[];
  notifications: NotificationItem[];
  settings: SystemSettings;
  candidatos: Candidato[];
  selectedCandidatoId: string | null;
  setSelectedCandidatoId: (id: string | null) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  login: (loginStr: string, senhaStr: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  switchProfile: (user: User) => void;
  // CRUD Eleitores
  addEleitor: (novo: Omit<Eleitor, 'id' | 'dataCadastro' | 'ultimaAlteracao' | 'multiplicadorId' | 'multiplicadorNome'>) => Promise<void>;
  updateEleitor: (id: string, atualizado: Partial<Eleitor>) => Promise<void>;
  deleteEleitor: (id: string) => Promise<void>;
  // CRUD Multiplicadores
  addUser: (novo: Omit<User, 'id' | 'dataCriacao'>) => Promise<void>;
  updateUser: (id: string, atualizado: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  toggleUserStatus: (id: string) => Promise<void>;
  resetUserPassword: (id: string, novaSenha: string) => Promise<void>;
  // CRUD Candidatos
  addCandidato: (novo: Omit<Candidato, 'id' | 'createdAt'>) => Promise<void>;
  updateCandidato: (id: string, atualizado: Partial<Candidato>) => Promise<void>;
  deleteCandidato: (id: string) => Promise<void>;
  // Notificações e Audit
  markNotificationAsRead: (id: string) => Promise<void>;
  markAllNotificationsAsRead: () => Promise<void>;
  logAction: (acao: TipoAcaoAudit, entidade: AuditLog['entidade'], detalhes: string) => Promise<void>;
  updateSettings: (novas: Partial<SystemSettings>) => Promise<void>;
  // Filtros Auxiliares
  getFilteredEleitores: () => Eleitor[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Mapeadores do Banco de Dados para o Frontend (Supabase -> Typescript)
const mapUserFromDb = (u: any): User => ({
  id: u.id,
  nome: u.nome,
  login: u.login,
  senha: u.senha,
  telefone: u.telefone || '',
  cidade: u.cidade || '',
  situacao: u.situacao || 'ATIVO',
  role: u.role || 'MULTIPLICADOR',
  dataCriacao: u.data_criacao || new Date().toISOString(),
  metaMensal: u.meta_mensal || 25,
  candidatoId: u.candidato_id || undefined,
});

const mapUserToDb = (u: Partial<User>) => {
  const data: any = {};
  if (u.id !== undefined) data.id = u.id;
  if (u.nome !== undefined) data.nome = u.nome;
  if (u.login !== undefined) data.login = u.login;
  if (u.senha !== undefined) data.senha = u.senha;
  if (u.telefone !== undefined) data.telefone = u.telefone;
  if (u.cidade !== undefined) data.cidade = u.cidade;
  if (u.situacao !== undefined) data.situacao = u.situacao;
  if (u.role !== undefined) data.role = u.role;
  if (u.dataCriacao !== undefined) data.data_criacao = u.dataCriacao;
  if (u.metaMensal !== undefined) data.meta_mensal = u.metaMensal;
  if (u.candidatoId !== undefined) data.candidato_id = u.candidatoId;
  return data;
};

const mapSettingsFromDb = (s: any): SystemSettings => ({
  nomeSistema: (s.nome_sistema || s.nome || 'Multiplicador 360').trim(),
  candidatoApoiado: s.candidato_apoiado || s.nome || '',
  corPrincipal: s.cor_principal || '#2563eb',
  corSecundaria: s.cor_secundaria || '#1e40af',
  textoRodape: s.texto_rodape || '',
  metaMensalPadrao: s.meta_mensal_padrao || 25,
  exigirConsentimentoLGPD: s.exigir_consentimento_lgpd !== false,
  retencaoDadosMeses: s.retencao_dados_meses || 48,
});

const mapSettingsToDb = (s: Partial<SystemSettings>) => {
  const data: any = {};
  if (s.nomeSistema !== undefined) data.nome_sistema = s.nomeSistema;
  if (s.candidatoApoiado !== undefined) data.candidato_apoiado = s.candidatoApoiado;
  if (s.corPrincipal !== undefined) data.cor_principal = s.corPrincipal;
  if (s.corSecundaria !== undefined) data.cor_secundaria = s.corSecundaria;
  if (s.textoRodape !== undefined) data.texto_rodape = s.textoRodape;
  if (s.metaMensalPadrao !== undefined) data.meta_mensal_padrao = s.metaMensalPadrao;
  if (s.exigirConsentimentoLGPD !== undefined) data.exigir_consentimento_lgpd = s.exigirConsentimentoLGPD;
  if (s.retencaoDadosMeses !== undefined) data.retencao_dados_meses = s.retencaoDadosMeses;
  return data;
};

const mapCandidatoFromDb = (c: any): Candidato => ({
  id: c.id,
  nome: c.nome,
  nomeSistema: c.nome_sistema || 'Multiplicador 360',
  candidatoApoiado: c.candidato_apoiado || '',
  corPrincipal: c.cor_principal || '#2563eb',
  corSecundaria: c.cor_secundaria || '#1e40af',
  textoRodape: c.texto_rodape || '',
  logoUrl: c.logo_url || undefined,
  metaMensalPadrao: c.meta_mensal_padrao || 25,
  exigirConsentimentoLGPD: c.exigir_consentimento_lgpd !== false,
  retencaoDadosMeses: c.retencao_dados_meses || 48,
  dataCriacao: c.created_at || new Date().toISOString(),
});

const mapCandidatoToDb = (c: Partial<Candidato>) => {
  const data: any = {};
  if (c.id !== undefined) data.id = c.id;
  if (c.nome !== undefined) data.nome = c.nome;
  if (c.nomeSistema !== undefined) data.nome_sistema = c.nomeSistema;
  if (c.candidatoApoiado !== undefined) data.candidato_apoiado = c.candidatoApoiado;
  if (c.corPrincipal !== undefined) data.cor_principal = c.corPrincipal;
  if (c.corSecundaria !== undefined) data.cor_secundaria = c.corSecundaria;
  if (c.textoRodape !== undefined) data.texto_rodape = c.textoRodape;
  if (c.logoUrl !== undefined) data.logo_url = c.logoUrl;
  if (c.metaMensalPadrao !== undefined) data.meta_mensal_padrao = c.metaMensalPadrao;
  if (c.exigirConsentimentoLGPD !== undefined) data.exigir_consentimento_lgpd = c.exigirConsentimentoLGPD;
  if (c.retencaoDadosMeses !== undefined) data.retencao_dados_meses = c.retencaoDadosMeses;
  return data;
};

const mapAuditFromDb = (a: any): AuditLog => ({
  id: a.id,
  acao: a.acao,
  entidade: a.entidade,
  usuarioId: a.usuario_id || 'anon',
  usuarioNome: a.usuario_nome || 'Anônimo',
  perfil: a.perfil || 'MULTIPLICADOR',
  dataHora: a.data_hora || new Date().toISOString(),
  ip: a.ip || '',
  detalhes: a.detalhes || '',
  candidatoId: a.candidato_id || undefined,
});

const mapAuditToDb = (a: AuditLog) => ({
  id: a.id,
  acao: a.acao,
  entidade: a.entidade,
  usuario_id: a.usuarioId,
  usuario_nome: a.usuarioNome,
  perfil: a.perfil,
  data_hora: a.dataHora,
  ip: a.ip,
  detalhes: a.detalhes,
  candidato_id: a.candidatoId,
});

const mapNotificationFromDb = (n: any): NotificationItem => ({
  id: n.id,
  tipo: n.tipo,
  titulo: n.titulo,
  mensagem: n.mensagem || '',
  dataHora: n.data_hora || new Date().toISOString(),
  lido: n.lido || false,
  multiplicadorId: n.multiplicador_id || undefined,
  eleitorId: n.eleitor_id || undefined,
  candidatoId: n.candidato_id || undefined,
});

const mapNotificationToDb = (n: Partial<NotificationItem>) => {
  const data: any = {};
  if (n.id !== undefined) data.id = n.id;
  if (n.tipo !== undefined) data.tipo = n.tipo;
  if (n.titulo !== undefined) data.titulo = n.titulo;
  if (n.mensagem !== undefined) data.mensagem = n.mensagem;
  if (n.dataHora !== undefined) data.data_hora = n.dataHora;
  if (n.lido !== undefined) data.lido = n.lido;
  if (n.multiplicadorId !== undefined) data.multiplicador_id = n.multiplicadorId;
  if (n.eleitorId !== undefined) data.eleitor_id = n.eleitorId;
  if (n.candidatoId !== undefined) data.candidato_id = n.candidatoId;
  return data;
};

const mapEleitorFromDb = (e: any): Eleitor => ({
  id: e.id,
  multiplicadorId: e.multiplicador_id || '',
  multiplicadorNome: e.multiplicador_nome || '',
  dataCadastro: e.data_cadastro || new Date().toISOString(),
  ultimaAlteracao: e.ultima_alteracao || new Date().toISOString(),
  nomeCompleto: e.nome_completo,
  cpf: e.cpf || '',
  rg: e.rg || '',
  orgaoEmissor: e.orgao_emissor || '',
  dataNascimento: e.data_nascimento || '',
  sexo: e.sexo || 'NAO_INFORMADO',
  estadoCivil: e.estado_civil || 'SOLTEIRO',
  escolaridade: e.escolaridade || '',
  profissao: e.profissao || '',
  telefone: e.telefone || '',
  whatsapp: e.whatsapp || '',
  email: e.email || '',
  nomeMae: e.nome_mae || '',
  nomePai: e.nome_pai || '',
  cep: e.cep || '',
  rua: e.rua || '',
  numero: e.numero || '',
  complemento: e.complemento || '',
  bairro: e.bairro || '',
  cidade: e.cidade || '',
  estado: e.estado || '',
  pontoReferencia: e.ponto_referencia || '',
  tituloEleitor: e.titulo_eleitor || '',
  zonaEleitoral: e.zona_eleitoral || '',
  secao: e.secao || '',
  municipioVota: e.municipio_vota || '',
  localVotacao: e.local_votacao || '',
  situacaoEleitor: e.situacao_eleitor || 'REGULAR',
  observacoes: e.observacoes || '',
  apoiaCandidato: e.apoia_candidato !== false,
  jaVotouAnteriormente: e.ja_votou_anteriormente !== false,
  liderComunitario: e.lider_comunitario === true,
  influenciador: e.influenciador === true,
  possuiGrupoWhatsapp: e.possui_grupo_whatsapp === true,
  quantidadeInfluenciados: e.quantidade_influenciados || 0,
  comentarios: e.comentarios || '',
  documentos: e.documentos || [],
  consentimentoLGPD: e.consentimento_lgpd !== false,
  dataConsentimento: e.data_consentimento || new Date().toISOString(),
  ipConsentimento: e.ip_consentimento || '',
});

const mapEleitorToDb = (e: Partial<Eleitor>) => {
  const data: any = {};
  if (e.id !== undefined) data.id = e.id;
  if (e.multiplicadorId !== undefined) data.multiplicador_id = e.multiplicadorId;
  if (e.multiplicadorNome !== undefined) data.multiplicador_nome = e.multiplicadorNome;
  if (e.dataCadastro !== undefined) data.data_cadastro = e.dataCadastro;
  if (e.ultimaAlteracao !== undefined) data.ultima_alteracao = e.ultimaAlteracao;
  if (e.nomeCompleto !== undefined) data.nome_completo = e.nomeCompleto;
  if (e.cpf !== undefined) data.cpf = e.cpf;
  if (e.rg !== undefined) data.rg = e.rg;
  if (e.orgaoEmissor !== undefined) data.orgao_emissor = e.orgaoEmissor;
  if (e.dataNascimento !== undefined) data.data_nascimento = e.dataNascimento;
  if (e.sexo !== undefined) data.sexo = e.sexo;
  if (e.estadoCivil !== undefined) data.estado_civil = e.estadoCivil;
  if (e.escolaridade !== undefined) data.escolaridade = e.escolaridade;
  if (e.profissao !== undefined) data.profissao = e.profissao;
  if (e.telefone !== undefined) data.telefone = e.telefone;
  if (e.whatsapp !== undefined) data.whatsapp = e.whatsapp;
  if (e.email !== undefined) data.email = e.email;
  if (e.nomeMae !== undefined) data.nome_mae = e.nomeMae;
  if (e.nomePai !== undefined) data.nome_pai = e.nomePai;
  if (e.cep !== undefined) data.cep = e.cep;
  if (e.rua !== undefined) data.rua = e.rua;
  if (e.numero !== undefined) data.numero = e.numero;
  if (e.complemento !== undefined) data.complemento = e.complemento;
  if (e.bairro !== undefined) data.bairro = e.bairro;
  if (e.cidade !== undefined) data.cidade = e.cidade;
  if (e.estado !== undefined) data.estado = e.estado;
  if (e.pontoReferencia !== undefined) data.ponto_referencia = e.pontoReferencia;
  if (e.tituloEleitor !== undefined) data.titulo_eleitor = e.tituloEleitor;
  if (e.zonaEleitoral !== undefined) data.zona_eleitoral = e.zonaEleitoral;
  if (e.secao !== undefined) data.secao = e.secao;
  if (e.municipioVota !== undefined) data.municipio_vota = e.municipioVota;
  if (e.localVotacao !== undefined) data.local_votacao = e.localVotacao;
  if (e.situacaoEleitor !== undefined) data.situacao_eleitor = e.situacaoEleitor;
  if (e.observacoes !== undefined) data.observacoes = e.observacoes;
  if (e.apoiaCandidato !== undefined) data.apoia_candidato = e.apoiaCandidato;
  if (e.jaVotouAnteriormente !== undefined) data.ja_votou_anteriormente = e.jaVotouAnteriormente;
  if (e.liderComunitario !== undefined) data.lider_comunitario = e.liderComunitario;
  if (e.influenciador !== undefined) data.influenciador = e.influenciador;
  if (e.possuiGrupoWhatsapp !== undefined) data.possui_grupo_whatsapp = e.possuiGrupoWhatsapp;
  if (e.quantidadeInfluenciados !== undefined) data.quantidade_influenciados = e.quantidadeInfluenciados;
  if (e.comentarios !== undefined) data.comentarios = e.comentarios;
  if (e.documentos !== undefined) data.documentos = e.documentos;
  if (e.consentimentoLGPD !== undefined) data.consentimento_lgpd = e.consentimentoLGPD;
  if (e.dataConsentimento !== undefined) data.data_consentimento = e.dataConsentimento;
  if (e.ipConsentimento !== undefined) data.ip_consentimento = e.ipConsentimento;
  return data;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [eleitores, setEleitores] = useState<Eleitor[]>(INITIAL_ELEITORES);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [settings, setSettings] = useState<SystemSettings>(INITIAL_SETTINGS);
  const [candidatos, setCandidatos] = useState<Candidato[]>([]);
  const [selectedCandidatoId, setSelectedCandidatoId] = useState<string | null>(null);
  
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('eleitopro_current_user_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Buscar dados do Supabase
  const fetchData = async () => {
    try {
      // 1. Determinar o candidato ativo para carregar as configurações de marca
      const activeCandId = currentUser ? (currentUser.role === 'MASTER' ? (selectedCandidatoId || 'candidato-padrao') : currentUser.candidatoId) : 'candidato-padrao';
      let settingsLoaded = false;

      if (activeCandId) {
        try {
          const { data: dbCand, error: errCand } = await supabase.from('candidatos').select('*').eq('id', activeCandId).single();
          if (!errCand && dbCand) {
            setSettings(mapSettingsFromDb(dbCand));
            settingsLoaded = true;
          }
        } catch (candErr) {
          console.warn("Tabela 'candidatos' não disponível ainda. Usando fallback.");
        }
      }

      if (!settingsLoaded) {
        const { data: dbSettings, error: errSettings } = await supabase.from('settings').select('*').eq('id', 1).single();
        if (!errSettings && dbSettings) {
          setSettings(mapSettingsFromDb(dbSettings));
        } else {
          setSettings(INITIAL_SETTINGS);
        }
      }

      // Se não há usuário logado, limpa os dados em memória e interrompe carregamentos pesados
      if (!currentUser) {
        setUsers([]);
        setEleitores([]);
        setAuditLogs([]);
        setNotifications([]);
        setCandidatos([]);
        return;
      }

      const isMaster = currentUser.role === 'MASTER';
      const isSuperAdmin = currentUser.role === 'SUPER_ADMIN' || isMaster;

      // 2. Se for MASTER, buscar a lista de todos os candidatos cadastrados
      if (isMaster) {
        try {
          const { data: dbCands, error: errCands } = await supabase.from('candidatos').select('*').order('nome', { ascending: true });
          if (!errCands && dbCands) {
            setCandidatos(dbCands.map(mapCandidatoFromDb));
          }
        } catch (candsErr) {
          console.warn("Erro ao buscar candidatos:", candsErr);
        }
      }

      // Definir ID do candidato para filtro de consultas
      const targetCandidatoId = isMaster ? selectedCandidatoId : currentUser.candidatoId;

      // 3. Buscar Usuários (Somente Super Admin lê todos; Multiplicador vê apenas ele mesmo)
      if (isSuperAdmin) {
        let queryUsers = supabase.from('users').select('*');
        if (targetCandidatoId) {
          // Coordenadores vêem usuários do candidato ou administradores globais (MASTER)
          queryUsers = queryUsers.or(`candidato_id.eq.${targetCandidatoId},role.eq.MASTER`);
        }
        const { data: dbUsers, error: errUsers } = await queryUsers;
        if (!errUsers && dbUsers) {
          // Atualiza automaticamente o usuário master se ainda for o antigo no banco de dados
          const oldAdmin = dbUsers.find(u => u.login === 'admin' || u.id === 'usr-admin-01');
          if (oldAdmin && (oldAdmin.login !== 'superadmin' || oldAdmin.nome !== 'Olzenis Gomes' || oldAdmin.role !== 'MASTER')) {
            try {
              await supabase.from('users').update({
                nome: 'Olzenis Gomes',
                login: 'superadmin',
                role: 'MASTER'
              }).eq('id', 'usr-admin-01');
              dbUsers.forEach(u => {
                if (u.id === 'usr-admin-01') {
                  u.nome = 'Olzenis Gomes';
                  u.login = 'superadmin';
                  u.role = 'MASTER';
                }
              });
            } catch (updateErr) {
              console.error("Erro ao atualizar usuário master no Supabase:", updateErr);
            }
          }
          
          if (dbUsers.length === 0) {
            try {
              await supabase.from('users').insert(INITIAL_USERS.map(mapUserToDb));
              setUsers(INITIAL_USERS);
            } catch (err) { }
          } else {
            setUsers(dbUsers.map(mapUserFromDb));
          }
        }
      } else {
        setUsers([currentUser]);
      }

      // 4. Buscar Eleitores
      let queryEleitores = supabase.from('eleitores').select('*');
      if (targetCandidatoId) {
        queryEleitores = queryEleitores.eq('candidato_id', targetCandidatoId);
      }
      if (!isSuperAdmin) {
        queryEleitores = queryEleitores.eq('multiplicador_id', currentUser.id);
      }
      const { data: dbEleitores, error: errEleitores } = await queryEleitores;
      if (!errEleitores && dbEleitores) {
        if (dbEleitores.length === 0 && isSuperAdmin && !targetCandidatoId) {
          try {
            await supabase.from('eleitores').insert(INITIAL_ELEITORES.map(mapEleitorToDb));
            setEleitores(INITIAL_ELEITORES);
          } catch (err) { }
        } else {
          setEleitores(dbEleitores.map(mapEleitorFromDb));
        }
      }

      // 5. Buscar Logs de Auditoria (Apenas Super Admin tem acesso)
      if (isSuperAdmin) {
        let queryAudit = supabase.from('audit_logs').select('*');
        if (targetCandidatoId) {
          queryAudit = queryAudit.eq('candidato_id', targetCandidatoId);
        }
        queryAudit = queryAudit.order('data_hora', { ascending: false });
        const { data: dbAudit, error: errAudit } = await queryAudit;
        if (!errAudit && dbAudit) {
          if (dbAudit.length === 0 && !targetCandidatoId) {
            try {
              await supabase.from('audit_logs').insert(INITIAL_AUDIT_LOGS.map(mapAuditToDb));
              setAuditLogs(INITIAL_AUDIT_LOGS);
            } catch (err) { }
          } else {
            setAuditLogs(dbAudit.map(mapAuditFromDb));
          }
        }
      } else {
        setAuditLogs([]);
      }

      // 6. Buscar Notificações (Filtrado no banco por destinatário e candidato)
      let queryNotif = supabase.from('notifications').select('*');
      if (targetCandidatoId) {
        queryNotif = queryNotif.eq('candidato_id', targetCandidatoId);
      }
      if (!isSuperAdmin) {
        queryNotif = queryNotif.or(`multiplicador_id.eq.${currentUser.id},multiplicador_id.is.null`);
      }
      queryNotif = queryNotif.order('data_hora', { ascending: false });
      const { data: dbNotif, error: errNotif } = await queryNotif;
      if (!errNotif && dbNotif) {
        const readNotifs = JSON.parse(localStorage.getItem('read_notifications') || '[]');
        if (dbNotif.length === 0 && isSuperAdmin && !targetCandidatoId) {
          try {
            await supabase.from('notifications').insert(INITIAL_NOTIFICATIONS.map(mapNotificationToDb));
            setNotifications(INITIAL_NOTIFICATIONS.map(n => ({
              ...n,
              lido: n.lido || readNotifs.includes(String(n.id))
            })));
          } catch (err) { }
        } else {
          setNotifications(dbNotif.map(mapNotificationFromDb).map(n => ({
            ...n,
            lido: n.lido || readNotifs.includes(String(n.id))
          })));
        }
      }

    } catch (e) {
      console.error("Falha ao se conectar com o Supabase. Utilizando dados locais como fallback.", e);
    }
  };

  // Recarrega os dados adequadamente sempre que o status de login mudar
  useEffect(() => {
    fetchData();
  }, [currentUser]);

  // Sincronizar o perfil ativo com o LocalStorage para manter sessão rápida
  useEffect(() => {
    const saved = localStorage.getItem('eleitopro_current_user_v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.id === 'usr-admin-01' && (parsed.login !== 'superadmin' || parsed.nome !== 'Olzenis Gomes')) {
          parsed.nome = 'Olzenis Gomes';
          parsed.login = 'superadmin';
          parsed.role = 'MASTER';
          localStorage.setItem('eleitopro_current_user_v1', JSON.stringify(parsed));
        }
        setCurrentUser(parsed);
      } catch { }
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('eleitopro_current_user_v1', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('eleitopro_current_user_v1');
    }
  }, [currentUser]);

  const logAction = async (acao: TipoAcaoAudit, entidade: AuditLog['entidade'], detalhes: string) => {
    const log: AuditLog = {
      id: `aud-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      acao,
      entidade,
      usuarioId: currentUser ? currentUser.id : 'anon',
      usuarioNome: currentUser ? currentUser.nome : 'Anônimo',
      perfil: currentUser ? currentUser.role : 'MULTIPLICADOR',
      dataHora: new Date().toISOString(),
      ip: '189.' + Math.floor(Math.random() * 255) + '.' + Math.floor(Math.random() * 255) + '.10',
      detalhes,
      candidatoId: currentUser ? (currentUser.role === 'MASTER' ? (selectedCandidatoId || undefined) : currentUser.candidatoId) : undefined,
    };

    setAuditLogs((prev) => [log, ...prev]);

    // Salvar no Supabase
    try {
      const { error } = await supabase.from('audit_logs').insert([mapAuditToDb(log)]);
      if (error) console.error("Erro ao salvar log no Supabase:", error.message);
    } catch (err) {
      console.warn("Falha ao salvar log no Supabase", err);
    }
  };

  const login = async (loginStr: string, senhaStr: string) => {
    // Buscar diretamente do Supabase se possível
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('login', loginStr.trim())
        .single();

      if (!error && data) {
        const dbUser = mapUserFromDb(data);
        if (dbUser.senha === senhaStr || !dbUser.senha) {
          if (dbUser.situacao === 'INATIVO') {
            return { success: false, message: 'Acesso bloqueado pelo Super Administrador. Contate a coordenação.' };
          }
          setCurrentUser(dbUser);
          setActiveTab('dashboard');
          await logAction('LOGIN', 'SESSAO', `Sessão iniciada como ${dbUser.role === 'SUPER_ADMIN' || dbUser.role === 'MASTER' ? 'Super Administrador' : 'Multiplicador'}.`);
          return { success: true };
        }
      } else if (error) {
        console.warn("Erro ao fazer login via Supabase (tentando local):", error.message);
      }
    } catch (e) {
      console.warn("Erro ao buscar login no Supabase, tentando local", e);
    }

    // Fallback local
    const found = users.find((u) => u.login.toLowerCase() === loginStr.toLowerCase().trim() && (u.senha === senhaStr || !u.senha));
    if (!found) {
      return { success: false, message: 'Usuário ou senha inválidos.' };
    }
    if (found.situacao === 'INATIVO') {
      return { success: false, message: 'Acesso bloqueado pelo Super Administrador. Contate a coordenação.' };
    }
    setCurrentUser(found);
    setActiveTab('dashboard');
    await logAction('LOGIN', 'SESSAO', `Sessão iniciada localmente como ${found.role === 'SUPER_ADMIN' || found.role === 'MASTER' ? 'Super Administrador' : 'Multiplicador'}.`);
    return { success: true };
  };

  const logout = () => {
    logAction('LOGOUT', 'SESSAO', 'Sessão encerrada pelo usuário.');
    setCurrentUser(null);
  };

  const switchProfile = (user: User) => {
    setCurrentUser(user);
    setActiveTab('dashboard');
    logAction('LOGIN', 'SESSAO', `Alternância rápida demonstrativa para o perfil: ${user.nome} (${user.role}).`);
  };

  const addEleitor = async (novo: Omit<Eleitor, 'id' | 'dataCadastro' | 'ultimaAlteracao' | 'multiplicadorId' | 'multiplicadorNome'>) => {
    if (!currentUser) return;
    const agora = new Date().toISOString();
    const candId = currentUser.role === 'MASTER' ? (selectedCandidatoId || 'candidato-padrao') : currentUser.candidatoId;
    const novoEleitor: Eleitor = {
      ...novo,
      id: `elt-${Date.now()}`,
      multiplicadorId: currentUser.id,
      multiplicadorNome: currentUser.nome,
      dataCadastro: agora,
      ultimaAlteracao: agora,
      candidatoId: candId || undefined,
    };

    setEleitores((prev) => [novoEleitor, ...prev]);
    await logAction('CRIACAO', 'ELEITOR', `Cadastrou o eleitor ${novoEleitor.nomeCompleto} (CPF: ${novoEleitor.cpf}).`);

    // Notificação
    const novaNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      tipo: 'NOVO_CADASTRO',
      titulo: 'Novo Eleitor Cadastrado',
      mensagem: `${currentUser.nome} registrou ${novoEleitor.nomeCompleto} (${novoEleitor.cidade}).`,
      dataHora: agora,
      lido: false,
      eleitorId: novoEleitor.id,
      multiplicadorId: currentUser.id,
      candidatoId: candId || undefined,
    };
    setNotifications((prev) => [novaNotif, ...prev]);

    // Persistir no Supabase
    try {
      const { error: errElt } = await supabase.from('eleitores').insert([mapEleitorToDb(novoEleitor)]);
      if (errElt) console.error("Erro ao salvar eleitor no Supabase:", errElt.message);
      
      const { error: errNotif } = await supabase.from('notifications').insert([mapNotificationToDb(novaNotif)]);
      if (errNotif) console.error("Erro ao salvar notificação no Supabase:", errNotif.message);
    } catch (err) {
      console.warn("Erro ao salvar eleitor/notificação no Supabase", err);
    }
  };

  const updateEleitor = async (id: string, atualizado: Partial<Eleitor>) => {
    let nomeAlterado = '';
    setEleitores((prev) =>
      prev.map((e) => {
        if (e.id === id) {
          nomeAlterado = atualizado.nomeCompleto || e.nomeCompleto;
          return { ...e, ...atualizado, ultimaAlteracao: new Date().toISOString() };
        }
        return e;
      })
    );
    await logAction('ALTERACAO', 'ELEITOR', `Atualizou os dados do cadastro de ${nomeAlterado || id}.`);

    try {
      const { error } = await supabase
        .from('eleitores')
        .update(mapEleitorToDb(atualizado))
        .eq('id', id);
      if (error) console.error("Erro ao atualizar eleitor no Supabase:", error.message);
    } catch (err) {
      console.warn("Erro ao atualizar eleitor no Supabase", err);
    }
  };

  const deleteEleitor = async (id: string) => {
    const alvo = eleitores.find((e) => e.id === id);
    setEleitores((prev) => prev.filter((e) => e.id !== id));
    if (alvo) {
      await logAction('EXCLUSAO', 'ELEITOR', `Excluiu permanentemente o cadastro de ${alvo.nomeCompleto} (CPF: ${alvo.cpf}).`);
    }

    try {
      const { error } = await supabase.from('eleitores').delete().eq('id', id);
      if (error) console.error("Erro ao excluir eleitor no Supabase:", error.message);
    } catch (err) {
      console.warn("Erro ao excluir eleitor no Supabase", err);
    }
  };

  const addUser = async (novo: Omit<User, 'id' | 'dataCriacao'>) => {
    const id = `usr-mult-${Date.now().toString().slice(-4)}`;
    const candId = currentUser?.role === 'MASTER' ? (selectedCandidatoId || 'candidato-padrao') : currentUser?.candidatoId;
    const novoUser: User = {
      ...novo,
      id,
      dataCriacao: new Date().toISOString(),
      candidatoId: candId || undefined,
    };
    setUsers((prev) => [...prev, novoUser]);
    await logAction('CRIACAO', 'MULTIPLICADOR', `Criou o multiplicador ${novoUser.nome} (${novoUser.login}).`);

    try {
      const { error } = await supabase.from('users').insert([mapUserToDb(novoUser)]);
      if (error) console.error("Erro ao cadastrar multiplicador no Supabase:", error.message, error.details);
    } catch (err) {
      console.warn("Erro ao cadastrar multiplicador no Supabase", err);
    }
  };

  const updateUser = async (id: string, atualizado: Partial<User>) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          return { ...u, ...atualizado };
        }
        return u;
      })
    );
    await logAction('ALTERACAO', 'MULTIPLICADOR', `Editou os dados do multiplicador ID ${id}.`);

    try {
      const { error } = await supabase
        .from('users')
        .update(mapUserToDb(atualizado))
        .eq('id', id);
      if (error) console.error("Erro ao atualizar multiplicador no Supabase:", error.message);
    } catch (err) {
      console.warn("Erro ao atualizar multiplicador no Supabase", err);
    }
  };

  const deleteUser = async (id: string) => {
    const alvo = users.find((u) => u.id === id);
    setUsers((prev) => prev.filter((u) => u.id !== id));
    if (alvo) {
      await logAction('EXCLUSAO', 'MULTIPLICADOR', `Removeu o multiplicador ${alvo.nome} do sistema.`);
    }

    try {
      const { error } = await supabase.from('users').delete().eq('id', id);
      if (error) console.error("Erro ao excluir usuário no Supabase:", error.message);
    } catch (err) {
      console.warn("Erro ao excluir usuário no Supabase", err);
    }
  };

  const toggleUserStatus = async (id: string) => {
    let novoStatus: User['situacao'] = 'ATIVO';
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          novoStatus = u.situacao === 'ATIVO' ? 'INATIVO' : 'ATIVO';
          return { ...u, situacao: novoStatus };
        }
        return u;
      })
    );
    const alvo = users.find((u) => u.id === id);
    await logAction('BLOQUEIO', 'MULTIPLICADOR', `Alterou situação de ${alvo?.nome || id} para ${novoStatus}.`);

    try {
      const { error } = await supabase
        .from('users')
        .update({ situacao: novoStatus })
        .eq('id', id);
      if (error) console.error("Erro ao alterar situação do multiplicador no Supabase:", error.message);
    } catch (err) {
      console.warn("Erro ao alterar situação do multiplicador no Supabase", err);
    }
  };

  const resetUserPassword = async (id: string, novaSenha: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          return { ...u, senha: novaSenha };
        }
        return u;
      })
    );
    const alvo = users.find((u) => u.id === id);
    await logAction('ALTERACAO', 'MULTIPLICADOR', `Redefiniu a senha de acesso para o multiplicador ${alvo?.nome || id}.`);

    try {
      const { error } = await supabase
        .from('users')
        .update({ senha: novaSenha })
        .eq('id', id);
      if (error) console.error("Erro ao redefinir senha no Supabase:", error.message);
    } catch (err) {
      console.warn("Erro ao redefinir senha no Supabase", err);
    }
  };

  const markNotificationAsRead = async (id: string | number) => {
    const idStr = String(id);
    setNotifications((prev) => prev.map((n) => (String(n.id) === idStr ? { ...n, lido: true } : n)));
    
    try {
      const readNotifs = JSON.parse(localStorage.getItem('read_notifications') || '[]');
      if (!readNotifs.includes(idStr)) {
        readNotifs.push(idStr);
        localStorage.setItem('read_notifications', JSON.stringify(readNotifs));
      }
    } catch (e) {
      console.warn("Erro ao salvar no LocalStorage:", e);
    }

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ lido: true })
        .eq('id', id);
      if (error) console.error("Erro ao marcar notificação como lida no Supabase:", error.message);
    } catch (err) {
      console.warn("Erro ao marcar notificação como lida no Supabase", err);
    }
  };

  const markAllNotificationsAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, lido: true })));
    
    try {
      const readNotifs = notifications.map(n => String(n.id));
      localStorage.setItem('read_notifications', JSON.stringify(readNotifs));
    } catch (e) {
      console.warn("Erro ao salvar no LocalStorage:", e);
    }

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ lido: true })
        .eq('lido', false);
      if (error) console.error("Erro ao marcar todas as notificações como lidas no Supabase:", error.message);
    } catch (err) {
      console.warn("Erro ao marcar todas as notificações como lidas no Supabase", err);
    }
  };

  const updateSettings = async (novas: Partial<SystemSettings>) => {
    setSettings((prev) => ({ ...prev, ...novas }));
    await logAction('ALTERACAO', 'SISTEMA', 'Atualizou as configurações gerais e preferências do sistema.');

    const candId = currentUser?.role === 'MASTER' ? (selectedCandidatoId || 'candidato-padrao') : currentUser?.candidatoId;

    if (candId) {
      try {
        const mapped = mapSettingsToDb(novas);
        const { error } = await supabase
          .from('candidatos')
          .update(mapped)
          .eq('id', candId);
        if (error) console.error("Erro ao salvar configurações do candidato no Supabase:", error.message);
      } catch (err) {
        console.warn("Erro ao salvar configurações do candidato no Supabase", err);
      }
    } else {
      try {
        const { error } = await supabase
          .from('settings')
          .update(mapSettingsToDb(novas))
          .eq('id', 1);
        if (error) console.error("Erro ao salvar configurações no Supabase:", error.message);
      } catch (err) {
        console.warn("Erro ao salvar configurações no Supabase", err);
      }
    }
  };

  const addCandidato = async (novo: Omit<Candidato, 'id' | 'createdAt'>) => {
    const id = `cand-${Date.now().toString().slice(-4)}`;
    const novoCand: Candidato = {
      ...novo,
      id,
      dataCriacao: new Date().toISOString(),
    };
    setCandidatos((prev) => [...prev, novoCand]);
    await logAction('CRIACAO', 'SISTEMA', `Cadastrou o candidato ${novoCand.nome}.`);

    try {
      const { error } = await supabase.from('candidatos').insert([mapCandidatoToDb(novoCand)]);
      if (error) console.error("Erro ao cadastrar candidato no Supabase:", error.message);
    } catch (err) {
      console.warn("Erro ao cadastrar candidato no Supabase", err);
    }
  };

  const updateCandidato = async (id: string, atualizado: Partial<Candidato>) => {
    setCandidatos((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...atualizado } : c))
    );
    if (selectedCandidatoId === id || (!selectedCandidatoId && id === 'candidato-padrao')) {
      setSettings((prev) => ({ ...prev, ...atualizado as any }));
    }
    await logAction('ALTERACAO', 'SISTEMA', `Atualizou os dados do candidato ID ${id}.`);

    try {
      const { error } = await supabase
        .from('candidatos')
        .update(mapCandidatoToDb(atualizado))
        .eq('id', id);
      if (error) console.error("Erro ao atualizar candidato no Supabase:", error.message);
    } catch (err) {
      console.warn("Erro ao atualizar candidato no Supabase", err);
    }
  };

  const deleteCandidato = async (id: string) => {
    const alvo = candidatos.find((c) => c.id === id);
    setCandidatos((prev) => prev.filter((c) => c.id !== id));
    if (alvo) {
      await logAction('EXCLUSAO', 'SISTEMA', `Excluiu permanentemente o candidato ${alvo.nome}.`);
    }

    try {
      const { error } = await supabase.from('candidatos').delete().eq('id', id);
      if (error) console.error("Erro ao excluir candidato no Supabase:", error.message);
    } catch (err) {
      console.warn("Erro ao excluir candidato no Supabase", err);
    }
  };

  const getFilteredEleitores = () => {
    if (!currentUser) return [];
    if (currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'MASTER') {
      return eleitores;
    }
    return eleitores.filter((e) => e.multiplicadorId === currentUser.id);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        eleitores,
        auditLogs,
        notifications,
        settings,
        candidatos,
        selectedCandidatoId,
        setSelectedCandidatoId,
        activeTab,
        setActiveTab,
        login,
        logout,
        switchProfile,
        addEleitor,
        updateEleitor,
        deleteEleitor,
        addUser,
        updateUser,
        deleteUser,
        toggleUserStatus,
        resetUserPassword,
        addCandidato,
        updateCandidato,
        deleteCandidato,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        logAction,
        updateSettings,
        getFilteredEleitores,
        searchTerm,
        setSearchTerm,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp deve ser utilizado dentro de um AppProvider');
  }
  return context;
};
