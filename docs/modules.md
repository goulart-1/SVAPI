# Módulos de produtos e usuários

Após aplicar `supabase/migrations/001_products_users.sql` no SQL Editor do Supabase:

- `GET/POST /api/products`: listar e criar produtos.
- `GET/PATCH/DELETE /api/products/:id`: consultar, editar e excluir produtos do usuário autenticado.
- `GET/PATCH /api/users`: consultar e editar o próprio perfil.
- `/products`: tela de cadastro, listagem e exclusão de produtos.
- `/users`: tela de edição do perfil autenticado.

As políticas RLS garantem que somente usuários autenticados criem produtos e que cada usuário altere apenas os próprios registros.
