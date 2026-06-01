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

  getPerfil: (token) =>
    fetch(`${BASE}/perfil`, { headers: headers(token) }).then(r => r.json()),

  atualizarPerfil: (token, dados) =>
    fetch(`${BASE}/perfil`, { method: 'PUT', headers: headers(token), body: JSON.stringify(dados) }).then(r => r.json()),

  getNotificacoes: (token) =>
  fetch(`${BASE}/notificacoes`, { headers: headers(token) }).then(r => r.json()),
  
  marcarNotificacoesLidas: (token) =>
  fetch(`${BASE}/notificacoes/lidas`, { method: 'PATCH', headers: headers(token) }).then(r => r.json()),

  // Favoritos
getFavoritos: (token) =>
  fetch(`${BASE}/favoritos`, { headers: headers(token) }).then(r => r.json()),

getFavoritosIds: (token) =>
  fetch(`${BASE}/favoritos/ids`, { headers: headers(token) }).then(r => r.json()),

favoritarRegiao: (token, regiao_id) =>
  fetch(`${BASE}/favoritos/${regiao_id}`, { method: 'POST', headers: headers(token) }).then(r => r.json()),

desfavoritarRegiao: (token, regiao_id) =>
  fetch(`${BASE}/favoritos/${regiao_id}`, { method: 'DELETE', headers: headers(token) }).then(r => r.json()),

// Avaliações
getAvaliacoes: (token) =>
  fetch(`${BASE}/avaliacoes`, { headers: headers(token) }).then(r => r.json()),

getAvaliacoesPendentes: (token) =>
  fetch(`${BASE}/avaliacoes/pendentes`, { headers: headers(token) }).then(r => r.json()),

salvarAvaliacao: (token, dados) =>
  fetch(`${BASE}/avaliacoes`, { method: 'POST', headers: headers(token), body: JSON.stringify(dados) }).then(r => r.json()),

deletarAvaliacao: (token, roteiro_id) =>
  fetch(`${BASE}/avaliacoes/${roteiro_id}`, { method: 'DELETE', headers: headers(token) }).then(r => r.json()),

exportarRoteiro: (token, id) =>
  fetch(`/api/roteiros/${id}/export`, { headers: { Authorization: `Bearer ${token}` } }),

compartilharRoteiro: (token, id) =>
  fetch(`/api/roteiros/${id}/share`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),

getLocaisPopulares: (token) =>
  fetch(`${BASE}/regioes/populares`, { headers: headers(token) }).then(r => r.json()),
};
esqueceuSenha: (email, nova_senha) =>
  fetch(`${BASE}/auth/esqueci-senha`, { method: 'POST', headers: headers(), body: JSON.stringify({ email, nova_senha }) }).then(r => r.json())
