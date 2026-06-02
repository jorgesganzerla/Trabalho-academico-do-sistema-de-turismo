# 📦 Conexão Gaúcha — Documento de Entrega Final

**Projeto:** Conexão Gaúcha  
**Diretório:** `/home/ubuntu/conexao-gaucha/`  
**Data:** 02/06/2026  

---

## 1. ✅ Checklist de Critérios de Aceite

### ✅ CT-09 — Esqueci a Senha (Fluxo Completo)
| Etapa | Status |
|---|---|
| Tela de login → botão "Esqueci a senha" | ✅ |
| Envia e-mail real via Resend com link contendo token JWT (1h de validade) | ✅ |
| Link direciona para `/recuperar-senha?token=xxx` → tela `ResetPasswordScreen` | ✅ |
| Formulário valida nova senha (mín. 6 caracteres) + confirmação | ✅ |
| `POST /api/auth/redefinir-senha` valida token, atualiza `senha_hash` no banco | ✅ |
| Após redefinir, usuário consegue logar com a nova senha | ✅ |
| Mensagens amigáveis via Toast em cada etapa (sucesso/erro) | ✅ |

### ✅ CT-19 — E-mail de Boas-Vindas no Cadastro
| Etapa | Status |
|---|---|
| Cadastro novo → `enviarBoasVindas()` dispara e-mail via Resend | ✅ |
| Envio é não-bloqueante (`.catch(() => {})`) — não impede o cadastro | ✅ |
| Já funcionava, validado e mantido | ✅ |

### ✅ CT-61 — Voos com Datas Editáveis e Persistência
| Etapa | Status |
|---|---|
| Campos de origem + data ida + data volta editáveis no painel de voos | ✅ |
| Busca voos via Skyscanner/RapidAPI (`GET /api/roteiros/:id/voos`) | ✅ |
| Exibe lista de resultados com companhia, preço e link | ✅ |
| Seleciono um voo → salva no banco (`POST /api/roteiros/:id/voos/escolher`) | ✅ |
| Voo fica persistido na tabela `roteiro_voos` (visível ao recarregar) | ✅ |
| `GET /api/roteiros/:id/voo-escolhido` restaura voo ao montar tela | ✅ |
| Link "Ver no Skyscanner" abre busca externa | ✅ |
| Migração `001_roteiro_voos.sql` criada e incluída no `banco.sql` | ✅ |

### ✅ CT-97 — Recálculo Automático de Km
| Etapa | Status |
|---|---|
| Adiciono 2+ locais → km aparece automaticamente | ✅ |
| `useMemo` gera hash dos itens (posição, coordenadas, ordem) | ✅ |
| `useEffect` detecta mudança no hash → dispara recálculo com debounce 500ms | ✅ |
| Adiciono mais locais → atualiza sozinho | ✅ |
| Removo um local → atualiza sozinho | ✅ |
| Backend calcula via OpenRouteService (`GET /api/roteiros/:id/km`) | ✅ |
| Exibe km total e duração estimada na tela do itinerário | ✅ |

---

## 2. Resumo das Modificações por Arquivo

### `auth.js` (routes)
- **Adicionado:** `POST /api/auth/recuperar-senha` — gera token JWT de curta duração (1h, tipo `reset_senha`) e envia e-mail real via `enviarRecuperacaoSenha()`
- **Adicionado:** `POST /api/auth/redefinir-senha` — valida token JWT, verifica `tipo === 'reset_senha'`, faz hash da nova senha com bcrypt e atualiza `usuarios.senha_hash`
- **Importação adicionada:** `enviarRecuperacaoSenha` de `email.js`

### `roteiros.js` (routes)
- **Adicionado:** `GET /:id/voos` — busca voos via Skyscanner/RapidAPI com datas editáveis (aceita `origem`, `data_ida`, `data_volta` via query string; fallback para datas do roteiro)
- **Adicionado:** `POST /:id/voos/escolher` — salva voo selecionado na tabela `roteiro_voos` (replace: remove anterior e insere novo)
- **Adicionado:** `GET /:id/voo-escolhido` — retorna voo persistido para o roteiro
- **Adicionado:** `GET /:id/km` — coleta coordenadas de todos os locais do roteiro e calcula distância total via OpenRouteService

### `banco.sql`
- **Adicionado:** Tabela `roteiro_voos` (linhas 83+) com colunas: `id`, `roteiro_id`, `origem`, `destino`, `data_ida`, `data_volta`, `companhia`, `preco`, `moeda`, `link_externo`, `payload_json`, `criado_em` — FK para `roteiros(id) ON DELETE CASCADE`

### `database/migrations/001_roteiro_voos.sql` *(novo)*
- **Criado:** Migração independente para criar a tabela `roteiro_voos` em bancos existentes sem precisar re-executar o schema completo

### `api.js` (frontend)
- **Adicionado:** `recuperarSenha(email)` — `POST /api/auth/recuperar-senha`
- **Adicionado:** `redefinirSenha(token, nova_senha)` — `POST /api/auth/redefinir-senha`
- **Adicionado:** `buscarVoos(token, roteiroId, origem, data_ida, data_volta)` — `GET /api/roteiros/:id/voos` com query params
- **Adicionado:** `escolherVoo(token, roteiroId, dados)` — `POST /api/roteiros/:id/voos/escolher`
- **Adicionado:** `getVooEscolhido(token, roteiroId)` — `GET /api/roteiros/:id/voo-escolhido`
- **Adicionado:** `calcularKm(token, roteiroId)` — `GET /api/roteiros/:id/km`

### `App.jsx`
- **Adicionado:** Componente `ResetPasswordScreen` — formulário de redefinição de senha com validação (mín. 6 chars, confirmação)
- **Modificado:** `LoginScreen` — botão "Esqueci a senha" que chama `api.recuperarSenha()` e exibe feedback via Toast
- **Modificado:** Componente `App` — detecção de `?token=` na URL para navegar automaticamente para `ResetPasswordScreen`
- **Adicionado:** Painel de voos em `ItineraryScreen` com campos editáveis (origem, data ida, data volta), lista de resultados, seleção e persistência
- **Adicionado:** Exibição do voo escolhido com card resumo + link externo Skyscanner
- **Adicionado:** Seção de km percorridos com recálculo automático via `useMemo` (hash de itens) + `useEffect` com debounce 500ms
- **Adicionado:** Sistema de Toast unificado (`showToast`) propagado para todos os componentes — feedback visual de sucesso/erro
- **Modificado:** Mensagens de erro amigáveis em todas as chamadas de API (fallback genérico em caso de falha de rede)

---

## 3. Instruções de Instalação e Execução

### 3.1 Pré-requisitos
- Node.js 18+
- MySQL 8+

### 3.2 Banco de Dados

```bash
# Schema completo (primeira instalação)
mysql -u root -p < banco.sql

# Ou, se o banco já existe, apenas a migração de voos:
mysql -u root -p conexao_gaucha < database/migrations/001_roteiro_voos.sql
```

### 3.3 Variáveis de Ambiente

Copiar `backend_.env` para `.env` na raiz do backend:

| Variável | Descrição |
|---|---|
| `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | Conexão MySQL |
| `JWT_SECRET` | Chave para tokens JWT (trocar em produção) |
| `JWT_EXPIRES_IN` | Duração do token de sessão (padrão: `7d`) |
| `PORT` | Porta do backend (padrão: `3001`) |
| `APP_URL` | URL do frontend (padrão: `http://localhost:5173`) — usada nos links de e-mail |
| `RESEND_API_KEY` | Chave da API Resend para envio de e-mails (CT-09/CT-19) |
| `EMAIL_FROM` | Remetente dos e-mails (`onboarding@resend.dev` em sandbox) |
| `RAPIDAPI_KEY` | Chave RapidAPI para Skyscanner (CT-61) |
| `ORS_API_KEY` | Chave OpenRouteService para cálculo de rotas (CT-97) |

### 3.4 Instalar Dependências

```bash
cd /home/ubuntu/conexao-gaucha

# Dependências do frontend (React + Vite + Tailwind)
npm install

# Dependências do backend (na mesma pasta — estrutura plana)
# As deps do backend estão em backend_package.json
npm install --prefix . express mysql2 bcryptjs jsonwebtoken cors dotenv resend
```

### 3.5 Iniciar

```bash
# Backend (porta 3001)
node server.js

# Frontend (porta 5173, em outro terminal)
npx vite
```

---

## 4. Notas Técnicas Importantes

### 4.1 Estrutura de Pastas
O projeto está em **estrutura plana** — todos os arquivos na raiz. Para produção, recomenda-se organizar:

```
conexao-gaucha/
├── server.js              # Entry point do backend
├── backend_.env           # Template de variáveis de ambiente
├── banco.sql              # Schema + seed completo
├── database/
│   └── migrations/
│       └── 001_roteiro_voos.sql
├── auth.js                # Rotas: /api/auth/*
├── roteiros.js            # Rotas: /api/roteiros/*
├── perfil.js              # Rotas: /api/perfil/*
├── regioes.js             # Rotas: /api/regioes/*
├── db.js                  # Pool MySQL
├── email.js               # Serviço de e-mail (Resend)
├── skyscanner.js          # Integração Skyscanner/RapidAPI
├── middleware_auth.js     # Middleware JWT
├── App.jsx                # SPA React (todas as telas)
├── api.js                 # Client HTTP do frontend
├── main.jsx / index.html  # Bootstrap React + Vite
├── vite.config.js         # Proxy /api → backend
└── tailwind.config.js     # Configuração Tailwind CSS
```

> **Nota:** Os `require()` em `server.js` apontam para `./routes/auth`, `./routes/roteiros`, etc. Os arquivos precisam estar nos caminhos corretos ou os requires devem ser ajustados conforme a estrutura adotada.

### 4.2 Portas Padrão
| Serviço | Porta |
|---|---|
| Backend (Express) | `3001` |
| Frontend (Vite dev) | `5173` |

O `vite.config.js` faz proxy de `/api` → `http://localhost:3001`.

### 4.3 Integrações Externas

| Serviço | Uso | Configuração |
|---|---|---|
| **Resend** | Envio de e-mails (boas-vindas + recuperação de senha) | `RESEND_API_KEY` + `EMAIL_FROM` |
| **Skyscanner via RapidAPI** | Busca de preços de voos | `RAPIDAPI_KEY` |
| **OpenRouteService** | Cálculo de distância/km entre locais | `ORS_API_KEY` |

### 4.4 Segurança
- Endpoint `POST /api/auth/recuperar-senha` **não vaza** se o e-mail existe (sempre retorna mensagem genérica)
- Token de reset usa claim `tipo: 'reset_senha'` para evitar reuso de tokens de sessão
- Tokens de reset expiram em **1 hora**

---

*Documento gerado automaticamente — Conexão Gaúcha v1.0*
