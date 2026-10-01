# 🚀 SVAPI - Guia de Execução para ChatGPT

**Objetivo Final:** Validar build, configurar Supabase, testar localmente, fazer deploy no Vercel e validar em produção.

---

## 📌 CONTEXTO

- **Repositório:** https://github.com/goulart-1/SVAPI
- **Stack:** Next.js 14 + TypeScript + Supabase + Vercel
- **Acesso:** GitHub com permissão de escrita ✅ confirmada
- **Estado:** Código pronto, falta configuração de ambiente e deployment

---

## ✅ CHECKLIST DE EXECUÇÃO COMPLETA

### **FASE 1: VALIDAÇÃO LOCAL (15 minutos)**

#### Passo 1.1 - Clonar e instalar dependências
```bash
# Clonar repositório
git clone https://github.com/goulart-1/SVAPI.git
cd SVAPI

# Verificar Node.js (deve ser 18+)
node --version
npm --version

# Instalar dependências
npm install

# Resultado esperado: node_modules/ criado, sem erros de compilação
```

**Validação:** Não deve haver erros. Se houver `ERESOLVE`, rodar:
```bash
npm install --legacy-peer-deps
```

---

#### Passo 1.2 - Executar build (detecta erros TypeScript/compilação)
```bash
# Build de produção
npm run build

# Resultado esperado:
# ✓ Compilação concluída sem erros
# ✓ Pasta .next/ gerada
# ✓ Output no terminal: "compiled successfully"
```

**Se houver ERRO:**
- Ler mensagem de erro completa
- Verificar linhas indicadas nos arquivos `.ts`/`.tsx`
- Corrigir e rodar `npm run build` novamente
- Exemplo de correção comum:
  ```bash
  # Se erro em tipos Supabase
  npm install --save-dev @supabase/supabase-js@latest
  npm run build
  ```

---

#### Passo 1.3 - Executar linter (ESLint)
```bash
# Verificar qualidade de código
npm run lint

# Resultado esperado: sem avisos críticos ou erros de sintaxe
```

---

### **FASE 2: CONFIGURAR SUPABASE (20 minutos)**

#### Passo 2.1 - Criar projeto Supabase

1. Acesse **supabase.com**
2. Clique em **"New Project"**
3. Preencha:
   - **Organization:** sua organização ou conta pessoal
   - **Project name:** `svapi`
   - **Database password:** `SuperSenha123!@#` (salve em local seguro)
   - **Region:** `South America - São Paulo` (ou mais próxima)
4. Clique **"Create new project"**
5. Aguarde 1-2 minutos até a página carregar completamente

---

#### Passo 2.2 - Executar Migration SQL

**No Supabase Dashboard:**
1. Vá para **"SQL Editor"** (lado esquerdo, abaixo de Authentication)
2. Clique em **"New query"**
3. **Cole o conteúdo completo abaixo** (ou copie de `supabase/migrations/001_products_users.sql`):

```sql
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  sku text unique,
  price numeric(12,2) not null default 0 check (price >= 0),
  stock integer not null default 0 check (stock >= 0),
  active boolean not null default true,
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name) values (new.id, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.products enable row level security;

drop policy if exists "Users can read their profile" on public.profiles;
create policy "Users can read their profile" on public.profiles for select using (auth.uid() = id);
drop policy if exists "Users can update their profile" on public.profiles;
create policy "Users can update their profile" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "Authenticated users can read products" on public.products;
create policy "Authenticated users can read products" on public.products for select to authenticated using (true);
drop policy if exists "Users can create products" on public.products;
create policy "Users can create products" on public.products for insert to authenticated with check (auth.uid() = created_by);
drop policy if exists "Owners can update products" on public.products;
create policy "Owners can update products" on public.products for update to authenticated using (auth.uid() = created_by) with check (auth.uid() = created_by);
drop policy if exists "Owners can delete products" on public.products;
create policy "Owners can delete products" on public.products for delete to authenticated using (auth.uid() = created_by);

create index if not exists products_created_by_idx on public.products(created_by);
create index if not exists products_active_idx on public.products(active);
```

4. Clique no botão **"Run"** (canto inferior direito, verde)
5. **Resultado esperado:** Mensagem "Success" verde ou sem erros vermelhos

**Se houver ERRO:**
- Verificar se syntax está correta (paste do arquivo SQL do repositório)
- Tentar copiar bloco por bloco se houver conflito
- Confirmar que a região/projeto Supabase está ativa

---

#### Passo 2.3 - Habilitar Autenticação por Email

**No Supabase Dashboard:**
1. Clique em **"Authentication"** (aba azul no topo)
2. Clique em **"Providers"** (menu lateral)
3. Procure por **"Email"**
4. Clique no toggle para **ativar (ON)**
5. Deixar configurações padrão
6. Clique em **"Save"**

---

#### Passo 2.4 - Copiar Credenciais

**No Supabase Dashboard:**
1. Clique em **"Settings"** (engrenagem, canto inferior esquerdo)
2. Clique em **"API"** (menu lateral esquerdo)
3. **Copie e SALVE em local seguro:**
   - `Project URL` → será `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` (campo keys) → será `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role secret` (campo keys) → será `SUPABASE_SERVICE_ROLE_KEY`

**Formato esperado:**
```
NEXT_PUBLIC_SUPABASE_URL = https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

#### Passo 2.5 - Configurar Redirect URLs

**No Supabase Dashboard:**
1. Clique em **"Authentication"** (aba azul)
2. Clique em **"URL Configuration"** (menu lateral)
3. Na seção **"Redirect URLs"**, clique em **"Add URL"**
4. Cole este valor para desenvolvimento local:
   ```
   http://localhost:3000/**
   ```
5. Clique em **"Add URL"** novamente e cole:
   ```
   http://localhost:3000/auth/callback
   ```
6. Clique fora ou em **"Save"**

**Nota:** Após deploy no Vercel, voltaremos aqui para adicionar a URL de produção.

---

### **FASE 3: CONFIGURAR AMBIENTE LOCAL (5 minutos)**

#### Passo 3.1 - Criar arquivo .env.local

**Na pasta raiz do projeto (SVAPI/):**
```bash
# Copiar arquivo de exemplo
cp .env.example .env.local
```

#### Passo 3.2 - Preencher variáveis

**Abra `.env.local` e preencha com os valores do Supabase (Passo 2.4):**

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**⚠️ IMPORTANTE:**
- Não fazer commit de `.env.local` (está no `.gitignore`)
- Não compartilhar `SUPABASE_SERVICE_ROLE_KEY`
- Valores devem ser exatos (sem aspas, sem espaços extras)

---

### **FASE 4: TESTES LOCAIS (20 minutos)**

#### Passo 4.1 - Iniciar servidor de desenvolvimento

```bash
# Terminal 1: Iniciar servidor
npm run dev

# Resultado esperado:
# ➜  Local:        http://localhost:3000
# ➜  Environments: .env.local
```

#### Passo 4.2 - Teste 1: Health Check

```bash
# Terminal 2 (novo terminal, enquanto npm run dev está rodando):
curl http://localhost:3000/api/health

# Resultado esperado:
# {"status":"ok","service":"svapi"}
```

✅ **Se passou:** API respondendo corretamente

---

#### Passo 4.3 - Teste 2: Página de Login

1. Abra navegador: `http://localhost:3000`
2. Você deve ser redirecionado para `http://localhost:3000/login`
3. Veja um formulário com:
   - Campo "Email"
   - Campo "Senha"
   - Botão "Entrar"
   - Botão "Criar conta"

✅ **Se viu:** Login page carregando corretamente

---

#### Passo 4.4 - Teste 3: Criar Conta

1. Clique em "Criar conta"
2. Preencha:
   - Email: `teste@exemplo.com` (use um email real que tenha acesso)
   - Senha: `Senha123!` (mínimo 6 caracteres)
3. Clique em "Criar conta"
4. **Resultado esperado:** Uma de duas coisas:
   - Redireciona para `/login` com mensagem "Verifique seu email"
   - Ou email de confirmação chega em segundos

✅ **Se viu:** Cadastro funcionando

---

#### Passo 4.5 - Teste 4: Confirmar Email

1. Abra seu email (pasta inbox, pode levar 30 segundos)
2. Procure por email de "Supabase" com título "Confirm your signup"
3. Clique no link de confirmação no email
4. **Resultado esperado:** Volta para `http://localhost:3000/login`

✅ **Se viu:** Email confirmado com sucesso

---

#### Passo 4.6 - Teste 5: Fazer Login

1. Na página de login, preencha:
   - Email: `teste@exemplo.com`
   - Senha: `Senha123!`
2. Clique em "Entrar"
3. **Resultado esperado:** Redireciona para `http://localhost:3000/dashboard`
4. Você vê:
   - Título "Painel SVAPI"
   - Seu email em "Autenticado como"
   - Um botão "Sair" (cinza)

✅ **Se viu:** Autenticação funcionando

---

#### Passo 4.7 - Teste 6: Módulo de Produtos

1. Na barra de endereço, acesse: `http://localhost:3000/products`
2. Você vê um formulário com:
   - Campo "Nome" (obrigatório)
   - Campo "SKU" (opcional)
   - Campo "Preço" (número)
   - Campo "Estoque" (número)
   - Botão "Adicionar"
3. Preencha:
   - Nome: `Produto Teste`
   - SKU: `SKU-001`
   - Preço: `99.90`
   - Estoque: `10`
4. Clique em "Adicionar"
5. **Resultado esperado:**
   - Uma linha aparece na tabela abaixo
   - Com os dados que inseriu
   - Um botão "Excluir" em cada linha
6. Clique em "Excluir" para testar deleção
7. **Resultado esperado:** Linha some da tabela

✅ **Se funcionou:** Módulo de produtos OK

---

#### Passo 4.8 - Teste 7: Módulo de Usuários

1. Na barra de endereço, acesse: `http://localhost:3000/users`
2. Você vê:
   - Campo de texto "Nome completo" (vazio ou com nome)
   - Exibição "Perfil: user" (ou admin)
   - Botão "Salvar"
3. Preencha o nome: `João da Silva`
4. Clique em "Salvar"
5. **Resultado esperado:** Mensagem "Perfil atualizado." aparece
6. Atualize a página (F5) e o nome deve estar lá

✅ **Se funcionou:** Módulo de usuários OK

---

#### Passo 4.9 - Teste 8: Logout

1. Volte para `http://localhost:3000/dashboard`
2. Clique no botão "Sair"
3. **Resultado esperado:** Redireciona para `/login`
4. Se tentar acessar `/dashboard` novamente sem login, redireciona para `/login`

✅ **Se funcionou:** Proteção de rotas OK

---

#### Passo 4.10 - Parar servidor local

```bash
# No terminal onde npm run dev está rodando:
Ctrl+C
```

---

### **FASE 5: DEPLOY NO VERCEL (15 minutos)**

#### Passo 5.1 - Conectar repositório ao Vercel

1. Acesse **vercel.com**
2. Faça login com sua conta GitHub
3. Clique em **"Add New"** (canto superior direito) → **"Project"**
4. Selecione **"Import Git Repository"**
5. Cole: `https://github.com/goulart-1/SVAPI`
6. Clique em **"Continue"**
7. Selecione sua conta GitHub (goulart-1)
8. Clique em **"Continue"** novamente
9. Na tela de configuração, você verá:
   - Project name: `svapi` (ou similar)
   - Framework Preset: `Next.js` (deve detectar automaticamente)

#### Passo 5.2 - Adicionar Environment Variables

1. Na mesma tela, procure por **"Environment Variables"**
2. Clique em **"Add Environment Variable"** e preencha:

**Variável 1:**
- Name: `NEXT_PUBLIC_SUPABASE_URL`
- Value: `https://xxxxxxxxxxxxx.supabase.co` (do Supabase Passo 2.4)
- Environments: `Production`, `Preview`, `Development`

**Variável 2:**
- Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (do Supabase Passo 2.4)
- Environments: `Production`, `Preview`, `Development`

**Variável 3:**
- Name: `SUPABASE_SERVICE_ROLE_KEY`
- Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (do Supabase Passo 2.4)
- Environments: Apenas `Production` (nunca em Preview/Dev se possível)

**Variável 4:**
- Name: `NEXT_PUBLIC_APP_URL`
- Value: `https://svapi-xxxxx.vercel.app` (será seu domínio Vercel - pode deixar temporário por enquanto)
- Environments: `Production`, `Preview`, `Development`

#### Passo 5.3 - Iniciar Deploy

1. Clique em **"Deploy"** (botão azul no canto inferior direito)
2. Vercel irá:
   - Clonar o repositório
   - Instalar dependências (`npm install`)
   - Executar build (`npm run build`)
   - Fazer deploy automático
3. Aguarde a barra de progresso completar (1-3 minutos)
4. **Resultado esperado:** Página com mensagem "Congratulations! Your site is live."
5. Você receberá uma URL: `https://svapi-xxxxx.vercel.app`

#### Passo 5.4 - Atualizar Redirect URLs do Supabase

1. Volte ao **Supabase Dashboard**
2. Clique em **"Authentication"** → **"URL Configuration"**
3. Clique em **"Add URL"** e cole:
   ```
   https://svapi-xxxxx.vercel.app/**
   ```
4. Clique em **"Add URL"** novamente e cole:
   ```
   https://svapi-xxxxx.vercel.app/auth/callback
   ```
5. Clique em **"Save"**

#### Passo 5.5 - Atualizar NEXT_PUBLIC_APP_URL no Vercel (opcional)

1. Volte ao **Vercel Dashboard** do projeto
2. Clique em **"Settings"** → **"Environment Variables"**
3. Edite a variável `NEXT_PUBLIC_APP_URL`
4. Mude o valor para sua URL real: `https://svapi-xxxxx.vercel.app`
5. Salve
6. Volte a "Deployments" e clique em **"Redeploy"** (3 pontos do último deploy)

---

### **FASE 6: TESTES EM PRODUÇÃO (15 minutos)**

#### Passo 6.1 - Acessar aplicação em produção

1. Abra: `https://svapi-xxxxx.vercel.app`
2. **Resultado esperado:** Redireciona para `/login`

✅ **Se viu:** App rodando em produção

---

#### Passo 6.2 - Teste: Criar nova conta em produção

1. Clique em "Criar conta"
2. Preencha:
   - Email: `producao@teste.com` (email diferente do teste local)
   - Senha: `Senha123!`
3. Clique em "Criar conta"
4. **Resultado esperado:** Email de confirmação chega

✅ **Se funcionou:** Supabase conectado corretamente

---

#### Passo 6.3 - Teste: Confirmar email em produção

1. Abra seu email
2. Procure por email de Supabase
3. Clique no link
4. **Resultado esperado:** Volta para login em produção

✅ **Se funcionou:** Autenticação por email OK

---

#### Passo 6.4 - Teste: Fazer login em produção

1. Faça login com `producao@teste.com` e `Senha123!`
2. **Resultado esperado:** Vai para `/dashboard` em `https://svapi-xxxxx.vercel.app/dashboard`

✅ **Se funcionou:** Middleware protegendo rotas

---

#### Passo 6.5 - Teste: Produtos em produção

1. Acesse: `https://svapi-xxxxx.vercel.app/products`
2. Crie um produto:
   - Nome: `Produto Produção`
   - SKU: `PROD-001`
   - Preço: `150.00`
   - Estoque: `5`
3. Clique "Adicionar"
4. **Resultado esperado:** Produto aparece na tabela

✅ **Se funcionou:** API de produtos OK

---

#### Passo 6.6 - Teste: Usuários em produção

1. Acesse: `https://svapi-xxxxx.vercel.app/users`
2. Preencha nome: `Usuário Produção`
3. Clique "Salvar"
4. **Resultado esperado:** Mensagem "Perfil atualizado."
5. Atualize a página (F5) e o nome deve estar lá

✅ **Se funcionou:** API de usuários OK

---

#### Passo 6.7 - Teste: Health Check em produção

```bash
curl https://svapi-xxxxx.vercel.app/api/health

# Resultado esperado:
# {"status":"ok","service":"svapi"}
```

✅ **Se funcionou:** APIs respondendo

---

#### Passo 6.8 - Teste: Logout e proteção de rotas

1. No dashboard, clique "Sair"
2. **Resultado esperado:** Redireciona para `/login`
3. Tente acessar diretamente: `https://svapi-xxxxx.vercel.app/dashboard`
4. **Resultado esperado:** Redireciona para `/login`

✅ **Se funcionou:** Middleware protegendo corretamente

---

## 📋 CHECKLIST FINAL DE CONCLUSÃO

```
[ ] npm install sem erros
[ ] npm run build passa sem erros
[ ] npm run lint sem erros críticos
[ ] Supabase projeto criado
[ ] Migration SQL executada com sucesso
[ ] Email authentication ativado
[ ] Credenciais Supabase copiadas
[ ] Redirect URLs configuradas (local)
[ ] .env.local preenchido corretamente
[ ] npm run dev inicia sem erros
[ ] Health check local retorna status ok
[ ] Login page carrega
[ ] Cadastro funciona (email chega)
[ ] Confirmação de email funciona
[ ] Login funcionando
[ ] Dashboard carrega com usuário autenticado
[ ] Módulo de produtos funciona (criar/deletar)
[ ] Módulo de usuários funciona (editar perfil)
[ ] Logout funciona e redireciona para login
[ ] Rotas protegidas bloqueiam sem autenticação
[ ] Vercel deploy concluído com sucesso
[ ] Redirect URLs do Supabase atualizadas (produção)
[ ] Health check produção retorna status ok
[ ] Cadastro em produção funciona
[ ] Login em produção funciona
[ ] Produtos podem ser criados em produção
[ ] Perfil pode ser editado em produção
[ ] Logout e proteção de rotas funcionam em produção
```

---

## 🔴 ERROS COMUNS E SOLUÇÕES

### ❌ Erro: "Cannot find module '@supabase/ssr'"
```bash
# Solução:
npm install --legacy-peer-deps
npm run build
```

### ❌ Erro: "NEXT_PUBLIC_SUPABASE_URL is undefined"
- Verificar se `.env.local` existe e está preenchido
- Verificar se os valores não têm aspas ou espaços extras
- Reiniciar: `Ctrl+C` e `npm run dev` novamente

### ❌ Erro: "Invalid API key"
- Verificar se as chaves do Supabase foram copiadas corretamente
- Não adicionar espaços ou quebras de linha
- Confirmar que está usando `anon public`, não `service_role`

### ❌ Erro: "Email confirmation not working"
- Verificar pasta de spam/lixo
- No Supabase, em Email providers, confirmar que está ligado
- Verificar Redirect URLs estão corretas

### ❌ Deploy no Vercel falha
- Verificar se `npm run build` passa localmente primeiro
- Confirmar que todas as environment variables estão no Vercel
- Verificar logs do Vercel em "Deployments" → último deploy → "Logs"

### ❌ Produtos não salvam no banco
- Verificar se migration SQL foi executada completamente
- No Supabase SQL Editor, rodar:
  ```sql
  SELECT * FROM public.products;
  ```
  Deve retornar tabela vazia ou com dados
- Verificar RLS policies em Authentication → Policies

---

## ✅ QUANDO TUDO ESTIVER PRONTO

**Você terá:**
- ✅ Aplicação Next.js rodando em produção no Vercel
- ✅ Autenticação Supabase com email confirmação
- ✅ Módulo de produtos com CRUD completo
- ✅ Módulo de usuários com edição de perfil
- ✅ APIs protegidas com autenticação
- ✅ Rotas privadas protegidas por middleware
- ✅ Banco de dados Supabase configurado com RLS
- ✅ Aplicação testada e validada em produção

**URL Final:** `https://svapi-xxxxx.vercel.app`

---

**Tempo total estimado:** 60-90 minutos (incluindo espera de emails)

**Suporte:** Se houver dúvidas ou erros não listados aqui, verifique:
- Documentação Next.js: https://nextjs.org/docs
- Documentação Supabase: https://supabase.com/docs
- Documentação Vercel: https://vercel.com/docs
