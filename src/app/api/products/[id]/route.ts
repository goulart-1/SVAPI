import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

type Context = { params: { id: string } }

export async function GET(_: Request, { params }: Context) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  const { data, error } = await supabase.from('products').select('*').eq('id', params.id).single()
  if (error) return NextResponse.json({ error: error.message }, { status: 404 })
  return NextResponse.json({ data })
}

export async function PATCH(request: Request, { params }: Context) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  const body = await request.json()
  const allowed = ['name', 'description', 'sku', 'price', 'stock', 'active']
  const changes = Object.fromEntries(Object.entries(body).filter(([key]) => allowed.includes(key)))
  const { data, error } = await supabase.from('products').update({ ...changes, updated_at: new Date().toISOString() }).eq('id', params.id).eq('created_by', user.id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ data })
}

export async function DELETE(_: Request, { params }: Context) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  const { error } = await supabase.from('products').delete().eq('id', params.id).eq('created_by', user.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return new NextResponse(null, { status: 204 })
}
