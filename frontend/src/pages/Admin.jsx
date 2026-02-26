import React, { useEffect, useMemo, useState } from 'react'
import Section from '../components/Section'
import { api } from '../lib/api'

function TabButton({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`bb-btn ${active ? 'bb-btn-accent' : ''}`}
      type="button"
    >
      {children}
    </button>
  )
}

export default function Admin() {
  const [tab, setTab] = useState('products') // products | orders | reviews | gallery | contacts
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [reviews, setReviews] = useState([])
  const [gallery, setGallery] = useState([])
  const [contacts, setContacts] = useState([])

  const refresh = async () => {
    setError('')
    setLoading(true)
    try {
      const [p, o, r, g, c] = await Promise.all([
        api.listProducts(false),
        api.listOrders(),
        api.listReviews(false),
        api.listGallery(),
        api.listContacts()
      ])
      setProducts(p)
      setOrders(o)
      setReviews(r)
      setGallery(g)
      setContacts(c)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { refresh() }, [])

  return (
    <>
      <section className="pt-16">
        <div className="bb-container">
          <div className="bb-label text-cherry">Admin</div>
          <h1 className="bb-h1 mt-3">Dashboard</h1>
          <p className="mt-6 text-base md:text-lg bb-muted leading-relaxed max-w-3xl">
            Add/edit/delete products and manage orders. No authentication wired yet (as requested).
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <TabButton active={tab==='products'} onClick={() => setTab('products')}>Products</TabButton>
            <TabButton active={tab==='orders'} onClick={() => setTab('orders')}>Orders</TabButton>
            <TabButton active={tab==='reviews'} onClick={() => setTab('reviews')}>Reviews</TabButton>
            <TabButton active={tab==='gallery'} onClick={() => setTab('gallery')}>Gallery</TabButton>
            <TabButton active={tab==='contacts'} onClick={() => setTab('contacts')}>Contact</TabButton>
            <button className="bb-btn" type="button" onClick={refresh}>{loading ? 'Refreshing…' : 'Refresh'}</button>
          </div>
          {error && <div className="mt-6 text-sm text-cherry">{error}</div>}
        </div>
      </section>

      {tab === 'products' && (
        <ProductsAdmin products={products} setProducts={setProducts} setError={setError} />
      )}
      {tab === 'orders' && (
        <OrdersAdmin orders={orders} setOrders={setOrders} setError={setError} />
      )}
      {tab === 'reviews' && (
        <ReviewsAdmin reviews={reviews} setReviews={setReviews} setError={setError} />
      )}
      {tab === 'gallery' && (
        <GalleryAdmin gallery={gallery} setGallery={setGallery} setError={setError} />
      )}
      {tab === 'contacts' && (
        <ContactsAdmin contacts={contacts} setContacts={setContacts} setError={setError} />
      )}
    </>
  )
}

function ProductsAdmin({ products, setProducts, setError }) {
  const [draft, setDraft] = useState({ name: '', description: '', price: 0, image_url: '', category: 'Baked Goods', is_active: true })
  const [editingId, setEditingId] = useState(null)

  const startEdit = (p) => {
    setEditingId(p.id)
    setDraft({ name: p.name, description: p.description, price: p.price, image_url: p.image_url, category: p.category, is_active: p.is_active })
  }

  const reset = () => {
    setEditingId(null)
    setDraft({ name: '', description: '', price: 0, image_url: '', category: 'Baked Goods', is_active: true })
  }

  const save = async () => {
    setError('')
    try {
      if (editingId) {
        const updated = await api.updateProduct(editingId, draft)
        setProducts(prev => prev.map(p => p.id === editingId ? updated : p))
      } else {
        const created = await api.createProduct(draft)
        setProducts(prev => [created, ...prev])
      }
      reset()
    } catch (e) {
      setError(e.message)
    }
  }

  const del = async (id) => {
    setError('')
    try {
      await api.deleteProduct(id)
      setProducts(prev => prev.filter(p => p.id !== id))
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <Section eyebrow="Manage" title="Products">
      <div className="grid md:grid-cols-12 gap-8">
        <div className="md:col-span-5">
          <div className="bb-card p-6">
            <div className="bb-label">{editingId ? `Editing #${editingId}` : 'New product'}</div>
            <div className="mt-4 space-y-3">
              <Field label="Name"><input className="bb-input" value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })} /></Field>
              <Field label="Category"><input className="bb-input" value={draft.category} onChange={e => setDraft({ ...draft, category: e.target.value })} /></Field>
              <Field label="Image URL"><input className="bb-input" value={draft.image_url} onChange={e => setDraft({ ...draft, image_url: e.target.value })} /></Field>
              <Field label="Price">
                <input type="number" min="0" step="0.01" className="bb-input" value={draft.price}
                  onChange={e => setDraft({ ...draft, price: Number(e.target.value || 0) })} />
              </Field>
              <Field label="Description">
                <textarea className="bb-input min-h-[110px]" value={draft.description} onChange={e => setDraft({ ...draft, description: e.target.value })} />
              </Field>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={draft.is_active} onChange={e => setDraft({ ...draft, is_active: e.target.checked })} />
                  Active
                </label>
                <div className="flex gap-2">
                  {editingId && <button className="bb-btn" type="button" onClick={reset}>Cancel</button>}
                  <button className="bb-btn bb-btn-accent" type="button" onClick={save}>Save</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-7">
          <div className="bb-card p-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs uppercase tracking-widest opacity-70">
                <tr className="border-b border-black/10 dark:border-white/10">
                  <th className="py-3 text-left">Name</th>
                  <th className="py-3 text-left">Category</th>
                  <th className="py-3 text-left">Price</th>
                  <th className="py-3 text-left">Active</th>
                  <th className="py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id} className="border-b border-black/10 dark:border-white/10">
                    <td className="py-3">{p.name}</td>
                    <td className="py-3 bb-muted">{p.category}</td>
                    <td className="py-3">${p.price.toFixed(2)}</td>
                    <td className="py-3">{p.is_active ? 'Yes' : 'No'}</td>
                    <td className="py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="bb-btn" type="button" onClick={() => startEdit(p)}>Edit</button>
                        <button className="bb-btn" type="button" onClick={() => del(p.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!products.length && <tr><td className="py-6 bb-muted" colSpan="5">No products yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Section>
  )
}

function OrdersAdmin({ orders, setOrders, setError }) {
  const updateStatus = async (id, status) => {
    setError('')
    try {
      const updated = await api.updateOrder(id, { status })
      setOrders(prev => prev.map(o => o.id === id ? updated : o))
    } catch (e) {
      setError(e.message)
    }
  }

  const del = async (id) => {
    setError('')
    try {
      await api.deleteOrder(id)
      setOrders(prev => prev.filter(o => o.id !== id))
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <Section eyebrow="Manage" title="Orders">
      <div className="space-y-4">
        {orders.map(o => (
          <div key={o.id} className="bb-card p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <div className="font-display text-xl">Order #{o.id}</div>
                <div className="text-xs uppercase tracking-widest opacity-70 mt-1">{new Date(o.created_at).toLocaleString()}</div>
                <div className="mt-3 text-sm bb-muted">
                  <div><span className="opacity-70">Customer:</span> {o.customer_name} — {o.customer_email}</div>
                  <div><span className="opacity-70">Fulfillment:</span> {o.fulfillment_type}{o.address ? ` — ${o.address}` : ''}</div>
                  {o.notes ? <div><span className="opacity-70">Notes:</span> {o.notes}</div> : null}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs uppercase tracking-widest opacity-70">Total</div>
                <div className="font-display text-2xl">${o.total.toFixed(2)}</div>
                <div className="mt-3 flex flex-wrap gap-2 justify-end">
                  {['new','in_progress','ready','completed','cancelled'].map(s => (
                    <button key={s} type="button" className={`bb-btn ${o.status===s ? 'bb-btn-accent' : ''}`} onClick={() => updateStatus(o.id, s)}>
                      {s.replace('_',' ')}
                    </button>
                  ))}
                  <button type="button" className="bb-btn" onClick={() => del(o.id)}>Delete</button>
                </div>
              </div>
            </div>

            <div className="bb-divider my-5" />
            <div className="grid md:grid-cols-2 gap-3">
              {o.items.map(it => (
                <div key={it.id} className="flex items-center justify-between text-sm">
                  <div className="bb-muted">{it.product_name || `Product #${it.product_id}`} <span className="opacity-60">× {it.quantity}</span></div>
                  <div>${(it.unit_price * it.quantity).toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {!orders.length && <div className="bb-card p-6 bb-muted">No orders yet.</div>}
      </div>
    </Section>
  )
}

function ReviewsAdmin({ reviews, setReviews, setError }) {
  const [draft, setDraft] = useState({ name: '', rating: 5, message: '', approved: true })
  const [editingId, setEditingId] = useState(null)

  const startEdit = (r) => {
    setEditingId(r.id)
    setDraft({ name: r.name, rating: r.rating, message: r.message, approved: r.approved })
  }
  const reset = () => { setEditingId(null); setDraft({ name: '', rating: 5, message: '', approved: true }) }

  const save = async () => {
    setError('')
    try {
      if (editingId) {
        const updated = await api.updateReview(editingId, draft)
        setReviews(prev => prev.map(r => r.id === editingId ? updated : r))
      } else {
        const created = await api.createReview(draft)
        setReviews(prev => [created, ...prev])
      }
      reset()
    } catch (e) { setError(e.message) }
  }

  const del = async (id) => {
    setError('')
    try {
      await api.deleteReview(id)
      setReviews(prev => prev.filter(r => r.id !== id))
    } catch (e) { setError(e.message) }
  }

  return (
    <Section eyebrow="Manage" title="Reviews">
      <div className="grid md:grid-cols-12 gap-8">
        <div className="md:col-span-5">
          <div className="bb-card p-6">
            <div className="bb-label">{editingId ? `Editing #${editingId}` : 'New review'}</div>
            <div className="mt-4 space-y-3">
              <Field label="Name"><input className="bb-input" value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })} /></Field>
              <Field label="Rating">
                <select className="bb-input" value={draft.rating} onChange={e => setDraft({ ...draft, rating: Number(e.target.value) })}>
                  {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </Field>
              <Field label="Message">
                <textarea className="bb-input min-h-[110px]" value={draft.message} onChange={e => setDraft({ ...draft, message: e.target.value })} />
              </Field>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={draft.approved} onChange={e => setDraft({ ...draft, approved: e.target.checked })} />
                  Approved
                </label>
                <div className="flex gap-2">
                  {editingId && <button className="bb-btn" type="button" onClick={reset}>Cancel</button>}
                  <button className="bb-btn bb-btn-accent" type="button" onClick={save}>Save</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-7">
          <div className="bb-card p-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs uppercase tracking-widest opacity-70">
                <tr className="border-b border-black/10 dark:border-white/10">
                  <th className="py-3 text-left">Name</th>
                  <th className="py-3 text-left">Rating</th>
                  <th className="py-3 text-left">Approved</th>
                  <th className="py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map(r => (
                  <tr key={r.id} className="border-b border-black/10 dark:border-white/10">
                    <td className="py-3">{r.name}</td>
                    <td className="py-3">{r.rating}</td>
                    <td className="py-3">{r.approved ? 'Yes' : 'No'}</td>
                    <td className="py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="bb-btn" type="button" onClick={() => startEdit(r)}>Edit</button>
                        <button className="bb-btn" type="button" onClick={() => del(r.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!reviews.length && <tr><td className="py-6 bb-muted" colSpan="4">No reviews yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Section>
  )
}

function GalleryAdmin({ gallery, setGallery, setError }) {
  const [draft, setDraft] = useState({ image_url: '', caption: '', sort_order: 0 })
  const [editingId, setEditingId] = useState(null)

  const startEdit = (g) => { setEditingId(g.id); setDraft({ image_url: g.image_url, caption: g.caption, sort_order: g.sort_order }) }
  const reset = () => { setEditingId(null); setDraft({ image_url: '', caption: '', sort_order: 0 }) }

  const save = async () => {
    setError('')
    try {
      if (editingId) {
        const updated = await api.updateGallery(editingId, draft)
        setGallery(prev => prev.map(g => g.id === editingId ? updated : g))
      } else {
        const created = await api.createGallery(draft)
        setGallery(prev => [...prev, created].sort((a,b) => a.sort_order - b.sort_order))
      }
      reset()
    } catch (e) { setError(e.message) }
  }

  const del = async (id) => {
    setError('')
    try {
      await api.deleteGallery(id)
      setGallery(prev => prev.filter(g => g.id !== id))
    } catch (e) { setError(e.message) }
  }

  return (
    <Section eyebrow="Manage" title="Gallery">
      <div className="grid md:grid-cols-12 gap-8">
        <div className="md:col-span-5">
          <div className="bb-card p-6">
            <div className="bb-label">{editingId ? `Editing #${editingId}` : 'New gallery item'}</div>
            <div className="mt-4 space-y-3">
              <Field label="Image URL"><input className="bb-input" value={draft.image_url} onChange={e => setDraft({ ...draft, image_url: e.target.value })} /></Field>
              <Field label="Caption"><input className="bb-input" value={draft.caption} onChange={e => setDraft({ ...draft, caption: e.target.value })} /></Field>
              <Field label="Sort order">
                <input type="number" className="bb-input" value={draft.sort_order} onChange={e => setDraft({ ...draft, sort_order: Number(e.target.value || 0) })} />
              </Field>
              <div className="flex items-center justify-end gap-2">
                {editingId && <button className="bb-btn" type="button" onClick={reset}>Cancel</button>}
                <button className="bb-btn bb-btn-accent" type="button" onClick={save}>Save</button>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-7 grid sm:grid-cols-2 gap-6">
          {gallery.map(g => (
            <div key={g.id} className="bb-card overflow-hidden">
              <div className="aspect-[4/3] bg-black/5 dark:bg-white/5">
                <img src={g.image_url} alt={g.caption || 'Gallery'} className="h-full w-full object-cover" />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs uppercase tracking-widest opacity-70">Sort {g.sort_order}</div>
                    <div className="mt-1 text-sm bb-muted">{g.caption}</div>
                  </div>
                  <div className="flex gap-2">
                    <button className="bb-btn" type="button" onClick={() => startEdit(g)}>Edit</button>
                    <button className="bb-btn" type="button" onClick={() => del(g.id)}>Delete</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {!gallery.length && <div className="bb-card p-6 bb-muted">No gallery items yet.</div>}
        </div>
      </div>
    </Section>
  )
}

function ContactsAdmin({ contacts, setContacts, setError }) {
  const del = async (id) => {
    setError('')
    try {
      await api.deleteContact(id)
      setContacts(prev => prev.filter(c => c.id !== id))
    } catch (e) { setError(e.message) }
  }

  return (
    <Section eyebrow="Messages" title="Contact Inbox">
      <div className="space-y-4">
        {contacts.map(c => (
          <div key={c.id} className="bb-card p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <div className="font-display text-xl">{c.subject}</div>
                <div className="text-xs uppercase tracking-widest opacity-70 mt-1">{new Date(c.created_at).toLocaleString()}</div>
                <div className="mt-3 text-sm bb-muted">
                  <div><span className="opacity-70">From:</span> {c.name} — {c.email}</div>
                  <div className="mt-2"><span className="opacity-70">Message:</span> {c.message}</div>
                </div>
              </div>
              <div className="md:text-right">
                <button className="bb-btn" type="button" onClick={() => del(c.id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
        {!contacts.length && <div className="bb-card p-6 bb-muted">No contact messages yet.</div>}
      </div>
    </Section>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <div className="bb-label mb-2">{label}</div>
      {children}
    </div>
  )
}
