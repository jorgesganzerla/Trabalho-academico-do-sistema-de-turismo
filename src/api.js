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

  deletarRoteiro: (token, id) =>
    fetch(`${BASE}/roteiros/${id}`, { method: 'DELETE', headers: headers(token) }).then(r => r.json()),

  getPerfil: (token) =>
    fetch(`${BASE}/perfil`, { headers: headers(token) }).then(r => r.json()),

  atualizarPerfil: (token, dados) =>
    fetch(`${BASE}/perfil`, { method: 'PUT', headers: headers(token), body: JSON.stringify(dados) }).then(r => r.json()),
};
