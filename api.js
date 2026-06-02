const BASE = '/api';

const headers = (token) => ({
  'Content-Type': 'application/json',
  ...(token && { Authorization: `Bearer ${token}` }),
});

export const api = {
  login: (email, senha) =>
    fetch(`${BASE}/auth/login`, { method: 'POST', headers: headers(), body: JSON.stringify({ email, senha }) }).then(r => r.json()),

  register: (nome_completo, email, senha) =>
    fetch(`${BASE}/auth/register`, { method: 'POST', headers: headers(), body: JSON.stringify({ nome_completo, email, senha }) }).then(r => r.json()),

  getRegioes: (token) =>
    fetch(`${BASE}/regioes`, { headers: headers(token) }).then(r => r.json()),

  criarRoteiro: (token, dados) =>
    fetch(`${BASE}/roteiros`, { method: 'POST', headers: headers(token), body: JSON.stringify(dados) }).then(r => r.json()),

  getRoteiros: (token) =>
    fetch(`${BASE}/roteiros`, { headers: headers(token) }).then(r => r.json()),

  getRoteiro: (token, id) =>
    fetch(`${BASE}/roteiros/${id}`, { headers: headers(token) }).then(r => r.json()),

  deletarRoteiro: (token, id) =>
    fetch(`${BASE}/roteiros/${id}`, { method: 'DELETE', headers: headers(token) }).then(r => r.json()),

  // RF-06 — CT-66/67/68: Exportar roteiro
  exportarRoteiro: (token, id) =>
    fetch(`${BASE}/roteiros/${id}/export`, { headers: headers(token) }),

  // RF-07 — CT-69/71/75: Compartilhar roteiro
  compartilharRoteiro: (token, id) =>
    fetch(`${BASE}/roteiros/${id}/share`, { headers: headers(token) }).then(r => r.json()),

  // RF-08 — CT-83: Clonar roteiro
  clonarRoteiro: (token, id) =>
    fetch(`${BASE}/roteiros/${id}/clonar`, { method: 'POST', headers: headers(token) }).then(r => r.json()),

  // RF-03 — CT-28: Remover item do roteiro
  removerItem: (token, itemId) =>
    fetch(`${BASE}/roteiros/itens/${itemId}`, { method: 'DELETE', headers: headers(token) }).then(r => r.json()),

  // RF-03 — CT-34/39/43: Adicionar item manual / atualizar item (nota, check-in)
  adicionarItem: (token, diaId, dados) =>
    fetch(`${BASE}/roteiros/dias/${diaId}/itens`, { method: 'POST', headers: headers(token), body: JSON.stringify(dados) }).then(r => r.json()),

  atualizarItem: (token, itemId, dados) =>
    fetch(`${BASE}/roteiros/itens/${itemId}`, { method: 'PUT', headers: headers(token), body: JSON.stringify(dados) }).then(r => r.json()),

  // RF-03 — CT-40: Limpar todos os itens de um dia
  limparDia: (token, diaId) =>
    fetch(`${BASE}/roteiros/dias/${diaId}/itens`, { method: 'DELETE', headers: headers(token) }).then(r => r.json()),

  // RF-03 — CT-50: Otimizar rota por proximidade
  otimizarRota: (token, diaId) =>
    fetch(`${BASE}/roteiros/dias/${diaId}/otimizar`, { method: 'POST', headers: headers(token) }).then(r => r.json()),

  // RF-02 — CT-09: Recuperar senha
  recuperarSenha: (email) =>
    fetch(`${BASE}/auth/recuperar-senha`, { method: 'POST', headers: headers(), body: JSON.stringify({ email }) }).then(r => r.json()),

  // CT-09: Redefinir senha (etapa 2)
  redefinirSenha: (token, nova_senha) =>
    fetch(`${BASE}/auth/redefinir-senha`, { method: 'POST', headers: headers(), body: JSON.stringify({ token, nova_senha }) }).then(r => r.json()),

  // CT-61: Buscar voos via Skyscanner (datas editáveis)
  buscarVoos: (token, roteiroId, origem, data_ida, data_volta) => {
    const qs = new URLSearchParams({ origem, ...(data_ida && { data_ida }), ...(data_volta && { data_volta }) });
    return fetch(`${BASE}/roteiros/${roteiroId}/voos?${qs}`, { headers: headers(token) }).then(r => r.json());
  },

  // CT-61: Salvar voo escolhido
  escolherVoo: (token, roteiroId, dados) =>
    fetch(`${BASE}/roteiros/${roteiroId}/voos/escolher`, { method: 'POST', headers: headers(token), body: JSON.stringify(dados) }).then(r => r.json()),

  // CT-61: Obter voo escolhido
  getVooEscolhido: (token, roteiroId) =>
    fetch(`${BASE}/roteiros/${roteiroId}/voo-escolhido`, { headers: headers(token) }).then(r => r.json()),

  // CT-97: Calcular km percorridos no roteiro
  calcularKm: (token, roteiroId) =>
    fetch(`${BASE}/roteiros/${roteiroId}/km`, { headers: headers(token) }).then(r => r.json()),

  // RF-04 — CT-48: Buscar locais por palavra-chave
  buscarLocais: (token, q) =>
    fetch(`${BASE}/locais/buscar?q=${encodeURIComponent(q)}`, { headers: headers(token) }).then(r => r.json()),

  getPerfil: (token) =>
    fetch(`${BASE}/perfil`, { headers: headers(token) }).then(r => r.json()),

  atualizarPerfil: (token, dados) =>
    fetch(`${BASE}/perfil`, { method: 'PUT', headers: headers(token), body: JSON.stringify(dados) }).then(r => r.json()),
};
