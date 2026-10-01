# SVAPI - Setup Rápido

**Aplicação Next.js 14** com autenticação Supabase, módulos de produtos e usuários, pronta para Vercel.

## 📋 Quick Start

```bash
# 1. Clonar e instalar
git clone https://github.com/goulart-1/SVAPI.git
cd SVAPI
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais do Supabase

# 3. Executar localmente
npm run dev
# Abra http://localhost:3000
```

## 🔗 Endpoints da API

| Método | Rota | Descrição |
|--------|------|----------|
| GET | `/api/health` | Health check |
| GET/POST | `/api/products` | Listar/criar produtos |
| GET/PATCH/DELETE | `/api/products/:id` | Detalhes/editar/deletar produto |
| GET/PATCH | `/api/users` | Perfil/atualizar usuário |

## 🌐 Páginas

- `/login` - Autenticação (signup/signin)
- `/dashboard` - Dashboard principal (protegido)
- `/products` - Gerenciar produtos (protegido)
- `/users` - Editar perfil (protegido)

## 🚀 Deploy

Ver guia completo em: `docs/SETUP_PRODUCTION.md`

## 📚 Estrutura

```
src/
├── app/
│   ├── api/           # API routes
│   ├── login/         # Autenticação
│   ├── dashboard/     # Dashboard
│   ├── products/      # Módulo de produtos
│   └── users/         # Módulo de usuários
├── lib/
│   └── supabase/      # Clientes Supabase
└── middleware.ts      # Proteção de rotas
```

## 🔐 Segurança

- RLS (Row Level Security) ativado no Supabase
- Middleware protege rotas autenticadas
- Service role key nunca exposição no cliente
- Validação de propriedade em cada operação

## 📖 Documentação

- `docs/SETUP_PRODUCTION.md` - Guia passo a passo de produção
- `docs/modules.md` - Detalhes dos módulos
- Supabase Docs: https://supabase.com/docs
- Next.js Docs: https://nextjs.org/docs
