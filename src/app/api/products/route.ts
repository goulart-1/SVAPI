import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search')?.trim()
  let query = supabase.from('products').select('*').order('created_at', { ascending: false })
  if (search) query = query.or(`name.ilike.%${search}%,sku.ilike.%${search}%`)
  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  const body = await request.json()
  const { data, error } = await supabase.from('products').insert({
    name: body.name, description: body.description ?? null, sku: body.sku ?? null,
    price: Number(body.price), stock: Number(body.stock ?? 0), active: body.active !== false, created_by: user.id,
  }).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ data }, { status: 201 })
}
