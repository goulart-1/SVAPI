# SVAPI

Aplicação Next.js com App Router, autenticação Supabase e deploy preparado para Vercel.

## Desenvolvimento

```bash
npm install
cp .env.example .env.local
npm run dev
```

Configure `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` no `.env.local` ou nas Environment Variables da Vercel. Nunca exponha `SUPABASE_SERVICE_ROLE_KEY` no cliente.

## Verificação

- `GET /api/health` confirma que a aplicação está respondendo.
- `/login` testa cadastro e login do Supabase.
- `/dashboard` é protegido pelo middleware e exige uma sessão válida.
- `npm run build` valida a compilação de produção.
