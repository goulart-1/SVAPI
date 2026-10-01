# 🚀 Guia Prático: Configuração Supabase + Vercel + SVAPI

## Pré-requisitos
- Conta no Supabase (supabase.com)
- Conta no Vercel (vercel.com)
- Git instalado
- Node.js 18+
- Repositório GitHub clonado localmente

---

## PARTE 1: Configurar Supabase (10-15 minutos)

### 1.1 Criar projeto Supabase
1. Vá para supabase.com e faça login
2. Clique em "New Project"
3. Preencha:
   - Organization: escolha sua organização
   - Project name: `svapi` (ou seu escolhido)
   - Database password: gere uma senha forte
   - Region: escolha a mais próxima (ex: São Paulo)
4. Clique "Create new project" e aguarde (1-2 minutos)

### 1.2 Executar migration SQL
1. No Supabase, vá em "SQL Editor" (abaixo de "Authentication")
2. Clique em "New query"
3. Cole todo o conteúdo de: `supabase/migrations/001_products_users.sql`
4. Clique "Run" (botão verde no canto inferior direito)
5. Se aparecer "Success", está pronto. Se erro, verifique a sintaxe SQL.

### 1.3 Copiar variáveis de ambiente
1. Vá em "Settings" (engrenagem no canto inferior esquerdo)
2. Clique em "API" (no menu lateral)
3. Você verá:
   - **Project URL** → copie e guarde como `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → copie e guarde como `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role secret** → copie e guarde como `SUPABASE_SERVICE_ROLE_KEY`

**⚠️ IMPORTANTE:** Nunca exponha `SUPABASE_SERVICE_ROLE_KEY` no cliente ou repositório público.

### 1.4 Configurar autenticação por email
1. Volte ao menu principal do Supabase
2. Clique em "Authentication" (aba azul no topo)
3. Clique em "Providers"
4. Procure por "Email" e ative-o (botão toggle)
5. Mantenha as configurações padrão
6. Clique em "Save"

### 1.5 Configurar redirect URLs
1. Em "Authentication", clique em "URL Configuration" (menu lateral)
2. Na seção "Redirect URLs", clique em "Add URL" e insira:
   - `http://localhost:3000/**` (desenvolvimento local)
   - `http://localhost:3000/auth/callback`
3. Após deploy no Vercel, adicione:
   - `https://<seu-dominio-vercel>.vercel.app/**`
   - `https://<seu-dominio-vercel>.vercel.app/auth/callback`
4. Salve clicando fora ou em "Save"

---

## PARTE 2: Configurar desenvolvimento local (5-10 minutos)

### 2.1 Clonar repositório e instalar dependências
```bash
cd ~/seu-projeto
git clone https://github.com/goulart-1/SVAPI.git
cd SVAPI
npm install
```

### 2.2 Configurar variáveis de ambiente locais
1. Abra o terminal na pasta do projeto
2. Copie o arquivo de exemplo:
   ```bash
   cp .env.example .env.local
   ```
3. Abra `.env.local` com seu editor de texto favorito
4. Preencha com os valores copiados do Supabase:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1N...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1N...
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```
5. Salve o arquivo

### 2.3 Executar build de produção (valida erros)
```bash
npm run build
```
Se tudo passar sem erro, a compilação está OK.

### 2.4 Iniciar servidor local
```bash
npm run dev
```
Você verá:
```
> next dev

  ▲ Next.js 14.2.13
  - Local:        http://localhost:3000
```

---

## PARTE 3: Testar fluxo completo localmente (10 minutos)

### 3.1 Testar autenticação
1. Abra http://localhost:3000 no navegador
2. Você será redirecionado para `/login`
3. Clique em "Criar conta"
4. Preencha:
   - Email: seu-email@exemplo.com
   - Senha: senha123 (mínimo 6 caracteres)
5. Clique "Criar conta"
6. Verifique seu email e clique no link de confirmação
7. Volte para http://localhost:3000/login
8. Faça login com suas credenciais

### 3.2 Testar dashboard
Após login com sucesso:
1. Você deve estar em `/dashboard`
2. Verá: "Painel SVAPI" + seu email
3. Dois cards: "Autenticação" e "Módulos"
4. Um botão "Sair" no canto direito

### 3.3 Testar módulo de produtos
1. No dashboard ou direto em http://localhost:3000/products
2. Você verá um formulário com:
   - Nome (obrigatório)
   - SKU (opcional)
   - Preço
   - Estoque
   - Botão "Adicionar"
3. Preencha e clique "Adicionar"
4. Deve aparecer uma linha na tabela abaixo com seu produto
5. Botão "Excluir" deve remover o produto

### 3.4 Testar módulo de usuários
1. Em http://localhost:3000/users
2. Você verá seu nome completo (vazio inicialmente)
3. Campo de texto para editar nome
4. Seu papel (role): "user" ou "admin"
5. Botão "Salvar" para atualizar o nome
6. Clique em "Salvar" após preencher um nome

### 3.5 Testar APIs de health check
```bash
curl http://localhost:3000/api/health
```
Deve retornar:
```json
{"status":"ok","service":"svapi"}
```

### 3.6 Parar o servidor local
No terminal: `Ctrl+C`

---

## PARTE 4: Deploy no Vercel (10-15 minutos)

### 4.1 Conectar repositório ao Vercel
1. Vá para vercel.com e faça login
2. Clique em "Add New..." → "Project"
3. Selecione "Import Git Repository"
4. Cole: `https://github.com/goulart-1/SVAPI`
5. Clique "Continue"
6. Selecione seu usuário/organização GitHub
7. Clique "Continue"

### 4.2 Configurar variáveis de ambiente no Vercel
1. Na página de setup do Vercel, procure por "Environment Variables"
2. Adicione as 4 variáveis do Supabase:
   ```
   NEXT_PUBLIC_SUPABASE_URL = https://seu-projeto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1N...
   SUPABASE_SERVICE_ROLE_KEY = eyJhbGciOiJIUzI1N...
   NEXT_PUBLIC_APP_URL = https://<seu-projeto>.vercel.app
   ```
3. As variáveis `NEXT_PUBLIC_*` aparecem no cliente (não sensíveis)
4. A variável `SUPABASE_SERVICE_ROLE_KEY` é protegida no servidor
5. Clique "Deploy"

### 4.3 Aguardar deploy
O Vercel irá:
1. Fazer clone do repositório
2. Instalar dependências (`npm install`)
3. Executar build (`npm run build`)
4. Fazer deploy automático

Você receberá um link do tipo: `https://svapi-xxxxx.vercel.app`

### 4.4 Atualizar redirect URLs do Supabase
1. Volte ao Supabase
2. Vá em Authentication → URL Configuration
3. Adicione as URLs do seu app Vercel:
   ```
   https://<seu-projeto>.vercel.app/**
   https://<seu-projeto>.vercel.app/auth/callback
   ```
4. Salve

### 4.5 Testar aplicação em produção
1. Abra o link fornecido pelo Vercel
2. Repita os testes da PARTE 3 (login, dashboard, produtos, usuários)
3. Tudo deve funcionar igual ao ambiente local

---

## CHECKLIST FINAL

- [ ] Projeto Supabase criado e migration executada
- [ ] Variáveis do Supabase copiadas corretamente
- [ ] Email authentication ativado no Supabase
- [ ] Arquivo `.env.local` preenchido corretamente
- [ ] `npm run build` executado sem erros
- [ ] `npm run dev` rodando e aplicação acessível em localhost:3000
- [ ] Login, cadastro e autenticação testados
- [ ] Dashboard carregado corretamente
- [ ] Módulo de produtos testado (criar e deletar)
- [ ] Módulo de usuários testado (atualizar perfil)
- [ ] API `/api/health` respondendo
- [ ] Repositório conectado ao Vercel
- [ ] Variáveis de ambiente configuradas no Vercel
- [ ] Deploy realizado com sucesso
- [ ] Redirect URLs atualizadas no Supabase
- [ ] Aplicação funcionando em produção (Vercel)

---

## Troubleshooting

### Erro: "Invalid Supabase credentials"
- Verifique se `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` estão corretos
- Não adicione aspas ou espaços extras
- Reinicie o servidor local: `Ctrl+C` e `npm run dev` novamente

### Erro: "Cannot read property 'signInWithPassword' of undefined"
- Verifique se a autenticação por email está ativada no Supabase
- Confirme que as variáveis de ambiente foram carregadas corretamente

### Email de confirmação não chega
- Verifique spam/lixo
- No Supabase, vá em Authentication → Email → Confirm email e desative se quiser testes mais rápidos (não recomendado em produção)

### Produtos não aparecem após criar
- Verifique se a migration SQL foi executada corretamente
- No Supabase, vá em SQL Editor e confirme que as tabelas `products` e `profiles` existem
- Verifique o console do navegador (F12) para erros de rede

### Deploy no Vercel falha
- Verifique se `npm run build` passa localmente
- Confirme que todas as variáveis de ambiente estão definidas no Vercel
- Verifique os logs do Vercel na aba "Deployments"

---

## Próximos passos (opcional)

1. Adicionar validação de formulários com zod ou similar
2. Implementar upload de imagens de produtos (Supabase Storage)
3. Adicionar paginação ao módulo de produtos
4. Implementar busca e filtros avançados
5. Adicionar dark mode
6. Configurar CI/CD customizado
7. Adicionar testes automatizados (vitest)
8. Implementar permissões de admin

---

**Suporte:** Se encontrar problemas, verifique:
- Documentação Next.js: https://nextjs.org/docs
- Documentação Supabase: https://supabase.com/docs
- Documentação Vercel: https://vercel.com/docs
