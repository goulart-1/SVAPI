'use client'

import { useEffect, useState } from 'react'

type Product = { id: string; name: string; sku: string | null; price: number; stock: number; active: boolean }
export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [form, setForm] = useState({ name: '', sku: '', price: '0', stock: '0' })
  const load = async () => { const response = await fetch('/api/products'); if (response.ok) setProducts((await response.json()).data) }
  useEffect(() => { void load() }, [])
  async function create(event: React.FormEvent) { event.preventDefault(); const response = await fetch('/api/products', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(form) }); if (response.ok) { setForm({ name: '', sku: '', price: '0', stock: '0' }); void load() } }
  async function remove(id: string) { await fetch(`/api/products/${id}`, { method: 'DELETE' }); void load() }
  return <main className="container"><a href="/dashboard">← Dashboard</a><h1>Produtos</h1><form onSubmit={create} className="product-form"><input placeholder="Nome" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /><input placeholder="SKU" value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} /><input placeholder="Preço" type="number" min="0" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} /><input placeholder="Estoque" type="number" min="0" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} /><button type="submit">Adicionar</button></form><div className="table-wrap"><table><thead><tr><th>Nome</th><th>SKU</th><th>Preço</th><th>Estoque</th><th /></tr></thead><tbody>{products.map(product => <tr key={product.id}><td>{product.name}</td><td>{product.sku || '—'}</td><td>R$ {Number(product.price).toFixed(2)}</td><td>{product.stock}</td><td><button className="secondary" onClick={() => remove(product.id)}>Excluir</button></td></tr>)}</tbody></table></div></main>
}
