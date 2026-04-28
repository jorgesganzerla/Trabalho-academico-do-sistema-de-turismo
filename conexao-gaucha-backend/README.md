# Conexão Gaúcha — Backend

API REST em Node.js + Express + MySQL.

## Pré-requisitos
- [Node.js 18+](https://nodejs.org/en/download)
- MySQL 8+

## Instalação

```bash
# 1. Instale as dependências
npm install

# 2. Configure o .env
cp .env.example .env
# Edite .env com os dados do seu MySQL

# 3. Crie o banco no MySQL
mysql -u root -p -e "CREATE DATABASE conexao_gaucha CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 4. Suba o servidor (cria as tabelas automaticamente)
npm run dev

# 5. Popule com dados iniciais (regiões e locais)
npm run seed
```

## Rotas da API

### Auth
| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| POST | /api/auth/register | Cadastrar usuário (RF-01) | ❌ |
| POST | /api/auth/login | Login (RF-02) | ❌ |

### Regiões
| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| GET | /api/regioes | Listar todas as regiões | ❌ |
| GET | /api/regioes/:slug/locais | Locais de uma região | ❌ |

### Roteiros
| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| POST | /api/roteiros | Criar roteiro (RF-03/RF-04) | ✅ |
| GET | /api/roteiros | Histórico (RF-08) | ✅ |
| GET | /api/roteiros/:id | Detalhes do roteiro | ✅ |
| GET | /api/roteiros/:id/custo | Custo total (RF-05) | ✅ |
| GET | /api/roteiros/:id/export | Exportar .txt (RF-06) | ✅ |
| GET | /api/roteiros/:id/share | Link de compartilhamento (RF-07) | ✅ |
| DELETE | /api/roteiros/:id | Excluir roteiro | ✅ |

### Perfil
| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| GET | /api/perfil | Dados + estatísticas | ✅ |
| PUT | /api/perfil | Atualizar nome/senha | ✅ |

## Autenticação
Rotas com ✅ exigem o header:
```
Authorization: Bearer <token_jwt>
```

## Exemplo — Criar roteiro
```json
POST /api/roteiros
{
  "regiao_id": 1,
  "data_inicio": "2025-10-20",
  "data_fim": "2025-10-24",
  "nivel_orcamento": "moderado",
  "preferencias": ["natureza", "cultura"]
}
```
