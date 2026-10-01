import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { logout } from '@/app/login/actions'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  return <main className="container"><header><div><h1>Painel SVAPI</h1><p>Autenticado como {user.email}</p></div><form action={logout}><button className="secondary">Sair</button></form></header><section className="grid"><article><h2>Autenticação</h2><p>Supabase Auth conectado e protegido por middleware.</p></article><article><h2>Módulos</h2><p>Estrutura inicial pronta para expansão da API.</p></article></section></main>
}
