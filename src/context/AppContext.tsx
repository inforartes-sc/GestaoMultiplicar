import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Eleitor, AuditLog, NotificationItem, SystemSettings, TipoAcaoAudit } from '../types';
import { INITIAL_USERS, INITIAL_ELEITORES, INITIAL_AUDIT_LOGS, INITIAL_NOTIFICATIONS, INITIAL_SETTINGS } from '../data/initialData';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  eleitores: Eleitor[];
  auditLogs: AuditLog[];
  notifications: NotificationItem[];
  settings: SystemSettings;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  login: (loginStr: string, senhaStr: string) => { success: boolean; message?: string };
  logout: () => void;
  switchProfile: (user: User) => void;
  // CRUD Eleitores
  addEleitor: (novo: Omit<Eleitor, 'id' | 'dataCadastro' | 'ultimaAlteracao' | 'multiplicadorId' | 'multiplicadorNome'>) => void;
  updateEleitor: (id: string, atualizado: Partial<Eleitor>) => void;
  deleteEleitor: (id: string) => void;
  // CRUD Multiplicadores
  addUser: (novo: Omit<User, 'id' | 'dataCriacao'>) => void;
  updateUser: (id: string, atualizado: Partial<User>) => void;
  deleteUser: (id: string) => void;
  toggleUserStatus: (id: string) => void;
  resetUserPassword: (id: string, novaSenha: string) => void;
  // Notificações e Audit
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  logAction: (acao: TipoAcaoAudit, entidade: AuditLog['entidade'], detalhes: string) => void;
  updateSettings: (novas: Partial<SystemSettings>) => void;
  // Filtros Auxiliares
  getFilteredEleitores: () => Eleitor[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USERS: 'eleitopro_users_v1',
  ELEITORES: 'eleitopro_eleitores_v1',
  AUDIT: 'eleitopro_audit_v1',
  NOTIFICATIONS: 'eleitopro_notif_v1',
  SETTINGS: 'eleitopro_settings_v1',
  CURRENT_USER: 'eleitopro_current_user_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [eleitores, setEleitores] = useState<Eleitor[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ELEITORES);
    return saved ? JSON.parse(saved) : INITIAL_ELEITORES;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUDIT);
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [settings, setSettings] = useState<SystemSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (saved) {
      try { return JSON.parse(saved); } catch { return INITIAL_USERS[0]; }
    }
    return INITIAL_USERS[0]; // Padrão Super Admin
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Atualizar localStorage quando os estados mudam
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.ELEITORES, JSON.stringify(eleitores)); }, [eleitores]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(auditLogs)); }, [auditLogs]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings)); }, [settings]);
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }, [currentUser]);

  const logAction = (acao: TipoAcaoAudit, entidade: AuditLog['entidade'], detalhes: string) => {
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
    };
    setAuditLogs((prev) => [log, ...prev]);
  };

  const login = (loginStr: string, senhaStr: string) => {
    const found = users.find((u) => u.login.toLowerCase() === loginStr.toLowerCase().trim() && (u.senha === senhaStr || !u.senha));
    if (!found) {
      return { success: false, message: 'Usuário ou senha inválidos.' };
    }
    if (found.situacao === 'INATIVO') {
      return { success: false, message: 'Acesso bloqueado pelo Super Administrador. Contate a coordenação.' };
    }
    setCurrentUser(found);
    setActiveTab('dashboard');
    logAction('LOGIN', 'SESSAO', `Sessão iniciada como ${found.role === 'SUPER_ADMIN' ? 'Super Administrador' : 'Multiplicador'}.`);
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

  const addEleitor = (novo: Omit<Eleitor, 'id' | 'dataCadastro' | 'ultimaAlteracao' | 'multiplicadorId' | 'multiplicadorNome'>) => {
    if (!currentUser) return;
    const agora = new Date().toISOString();
    const novoEleitor: Eleitor = {
      ...novo,
      id: `elt-${Date.now()}`,
      multiplicadorId: currentUser.id,
      multiplicadorNome: currentUser.nome,
      dataCadastro: agora,
      ultimaAlteracao: agora,
    };

    setEleitores((prev) => [novoEleitor, ...prev]);
    logAction('CRIACAO', 'ELEITOR', `Cadastrou o eleitor ${novoEleitor.nomeCompleto} (CPF: ${novoEleitor.cpf}).`);

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
    };
    setNotifications((prev) => [novaNotif, ...prev]);
  };

  const updateEleitor = (id: string, atualizado: Partial<Eleitor>) => {
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
    logAction('ALTERACAO', 'ELEITOR', `Atualizou os dados do cadastro de ${nomeAlterado || id}.`);
  };

  const deleteEleitor = (id: string) => {
    const alvo = eleitores.find((e) => e.id === id);
    setEleitores((prev) => prev.filter((e) => e.id !== id));
    if (alvo) {
      logAction('EXCLUSAO', 'ELEITOR', `Excluiu permanentemente o cadastro de ${alvo.nomeCompleto} (CPF: ${alvo.cpf}).`);
    }
  };

  const addUser = (novo: Omit<User, 'id' | 'dataCriacao'>) => {
    const id = `usr-mult-${Date.now().toString().slice(-4)}`;
    const novoUser: User = {
      ...novo,
      id,
      dataCriacao: new Date().toISOString(),
    };
    setUsers((prev) => [...prev, novoUser]);
    logAction('CRIACAO', 'MULTIPLICADOR', `Criou o multiplicador ${novoUser.nome} (${novoUser.login}).`);
  };

  const updateUser = (id: string, atualizado: Partial<User>) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          return { ...u, ...atualizado };
        }
        return u;
      })
    );
    logAction('ALTERACAO', 'MULTIPLICADOR', `Editou os dados do multiplicador ID ${id}.`);
  };

  const deleteUser = (id: string) => {
    const alvo = users.find((u) => u.id === id);
    setUsers((prev) => prev.filter((u) => u.id !== id));
    if (alvo) {
      logAction('EXCLUSAO', 'MULTIPLICADOR', `Removeu o multiplicador ${alvo.nome} do sistema.`);
    }
  };

  const toggleUserStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const novoStatus = u.situacao === 'ATIVO' ? 'INATIVO' : 'ATIVO';
          logAction('BLOQUEIO', 'MULTIPLICADOR', `Alterou situação de ${u.nome} para ${novoStatus}.`);
          return { ...u, situacao: novoStatus };
        }
        return u;
      })
    );
  };

  const resetUserPassword = (id: string, novaSenha: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          logAction('ALTERACAO', 'MULTIPLICADOR', `Redefiniu a senha de acesso para o multiplicador ${u.nome}.`);
          return { ...u, senha: novaSenha };
        }
        return u;
      })
    );
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, lido: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, lido: true })));
  };

  const updateSettings = (novas: Partial<SystemSettings>) => {
    setSettings((prev) => ({ ...prev, ...novas }));
    logAction('ALTERACAO', 'SISTEMA', 'Atualizou as configurações gerais e preferências do sistema.');
  };

  // Retorna apenas eleitores autorizados
  const getFilteredEleitores = () => {
    if (!currentUser) return [];
    if (currentUser.role === 'SUPER_ADMIN') {
      return eleitores;
    }
    // Multiplicador visualiza ESTRITAMENTE apenas os seus cadastros
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
        markNotificationAsRead,
        markAllNotificationsAsRead,
        logAction,
        updateSettings,
        getFilteredEleitores,
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
