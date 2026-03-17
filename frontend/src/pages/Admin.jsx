import React, { useEffect, useRef, useState } from 'react'
import Section from '../components/Section'
import { api, resolveImageUrl } from '../lib/api'
import { useAdminAuth } from '../state/adminAuth'

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
  const { isAuthed, login, logout } = useAdminAuth()

  const [pw, setPw] = useState('')
  const [loginErr, setLoginErr] = useState('')

  const [tab, setTab] = useState('products')
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
        api.listProducts ? api.listProducts(false) : Promise.resolve([]),
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
      setError(e.message || 'Failed to load admin data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthed) {
      refresh()
    }
  }, [isAuthed])

  if (!isAuthed) {
    return (
      <>
        <section className="pt-16">
          <div className="bb-container">
            <div className="bb-label text-cherry">Admin</div>
            <h1 className="bb-h1 mt-3">Login</h1>
            <p className="mt-6 text-base md:text-lg bb-muted leading-relaxed max-w-3xl">
              Enter the admin password to access the dashboard.
            </p>
          </div>
        </section>

        <Section eyebrow="Access" title="Administrator">
          <div className="max-w-md bb-card p-6">
            <div className="bb-label mb-2">Password</div>

            <input
              type="password"
              className="bb-input"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="••••••••"
            />

            {loginErr && (
              <div className="mt-3 text-sm text-cherry">{loginErr}</div>
            )}

            <button
              className="bb-btn bb-btn-accent w-full mt-5"
              type="button"
              onClick={() => {
                const ok = login(pw)

                if (!ok) {
                  setLoginErr('Incorrect password.')
                } else {
                  setLoginErr('')
                  setPw('')
                }
              }}
            >
              Log in
            </button>

            <div className="mt-4 text-xs uppercase tracking-widest opacity-60">
              Tip: set <span className="opacity-80">VITE_ADMIN_PASSWORD</span> in{' '}
              <span className="opacity-80">frontend/.env</span>.
            </div>
          </div>
        </Section>
      </>
    )
  }

  return (
    <>
      <section className="pt-16">
        <div className="bb-container">
          <div className="bb-label text-cherry">Admin</div>
          <h1 className="bb-h1 mt-3">Dashboard</h1>
          <p className="mt-6 text-base md:text-lg bb-muted leading-relaxed max-w-3xl">
            Manage products, custom order requests, reviews, gallery items, and contact messages.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            <TabButton active={tab === 'products'} onClick={() => setTab('products')}>
              Products
            </TabButton>

            <TabButton active={tab === 'orders'} onClick={() => setTab('orders')}>
              Orders
            </TabButton>

            <TabButton active={tab === 'reviews'} onClick={() => setTab('reviews')}>
              Reviews
            </TabButton>

            <TabButton active={tab === 'gallery'} onClick={() => setTab('gallery')}>
              Gallery
            </TabButton>

            <TabButton active={tab === 'contacts'} onClick={() => setTab('contacts')}>
              Contact
            </TabButton>

            <button className="bb-btn" type="button" onClick={refresh}>
              {loading ? 'Refreshing…' : 'Refresh'}
            </button>

            <button className="bb-btn" type="button" onClick={logout}>
              Logout
            </button>
          </div>

          {error && <div className="mt-6 text-sm text-cherry">{error}</div>}
        </div>
      </section>

      {tab === 'products' && (
        <ProductsAdmin
          products={products}
          setProducts={setProducts}
          setError={setError}
        />
      )}

      {tab === 'orders' && (
        <OrdersAdmin orders={orders} setOrders={setOrders} setError={setError} />
      )}

      {tab === 'reviews' && (
        <ReviewsAdmin
          reviews={reviews}
          setReviews={setReviews}
          setError={setError}
        />
      )}

      {tab === 'gallery' && (
        <GalleryAdmin
          gallery={gallery}
          setGallery={setGallery}
          setError={setError}
        />
      )}

      {tab === 'contacts' && (
        <ContactsAdmin
          contacts={contacts}
          setContacts={setContacts}
          setError={setError}
        />
      )}
    </>
  )
}

function ProductsAdmin({ products, setProducts, setError }) {
  const categoryOptions = [
    'Baked Goods',
    'Cupcake',
    'One-Tier Cake',
    'Three-Tier Cake',
    'Two-Tier Cake'
  ].sort()

  const [draft, setDraft] = useState({
    name: '',
    description: '',
    price: 0,
    image_url: '',
    category: 'Baked Goods',
    is_active: true,
    image_scale: 1,
    image_x: 0,
    image_y: 0
  })

  const [editingId, setEditingId] = useState(null)

  const dragRef = useRef({
    dragging: false,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0
  })

  const startEdit = (p) => {
    setEditingId(p.id)
    setDraft({
      name: p.name ?? '',
      description: p.description ?? '',
      price: p.price ?? 0,
      image_url: p.image_url ?? '',
      category: p.category ?? 'Baked Goods',
      is_active: p.is_active ?? true,
      image_scale: p.image_scale ?? 1,
      image_x: p.image_x ?? 0,
      image_y: p.image_y ?? 0
    })
  }

  const reset = () => {
    setEditingId(null)
    setDraft({
      name: '',
      description: '',
      price: 0,
      image_url: '',
      category: 'Baked Goods',
      is_active: true,
      image_scale: 1,
      image_x: 0,
      image_y: 0
    })
  }

  const resetImagePosition = () => {
    setDraft((prev) => ({
      ...prev,
      image_scale: 1,
      image_x: 0,
      image_y: 0
    }))
  }

  const save = async () => {
    setError('')

    try {
      const payload = {
        ...draft,
        price: Number(draft.price || 0),
        image_scale: Number(draft.image_scale || 1),
        image_x: Number(draft.image_x || 0),
        image_y: Number(draft.image_y || 0)
      }

      if (editingId) {
        const updated = await api.updateProduct(editingId, payload)
        setProducts((prev) => prev.map((p) => (p.id === editingId ? updated : p)))
      } else {
        const created = await api.createProduct(payload)
        setProducts((prev) => [created, ...prev])
      }

      reset()
    } catch (e) {
      setError(e.message || 'Failed to save product.')
    }
  }

  const del = async (id) => {
    setError('')

    try {
      await api.deleteProduct(id)
      setProducts((prev) => prev.filter((p) => p.id !== id))
    } catch (e) {
      setError(e.message || 'Failed to delete product.')
    }
  }

  const onImagePointerDown = (e) => {
    if (!draft.image_url) return

    dragRef.current = {
      dragging: true,
      startX: e.clientX,
      startY: e.clientY,
      originX: draft.image_x || 0,
      originY: draft.image_y || 0
    }
  }

  const onImagePointerMove = (e) => {
    if (!dragRef.current.dragging) return

    const dx = e.clientX - dragRef.current.startX
    const dy = e.clientY - dragRef.current.startY

    setDraft((prev) => ({
      ...prev,
      image_x: dragRef.current.originX + dx,
      image_y: dragRef.current.originY + dy
    }))
  }

  const onImagePointerUp = () => {
    dragRef.current.dragging = false
  }

  return (
    <Section eyebrow="Manage" title="Products">
      <div className="grid md:grid-cols-12 gap-8">
        <div className="md:col-span-5">
          <div className="bb-card p-6">
            <div className="bb-label">
              {editingId ? `Editing #${editingId}` : 'New product'}
            </div>

            <div className="mt-4 space-y-3">
              <Field label="Name">
                <input
                  className="bb-input"
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                />
              </Field>

              <Field label="Category">
                <select
                  className="bb-input"
                  value={draft.category}
                  onChange={(e) => setDraft({ ...draft, category: e.target.value })}
                >
                  {categoryOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Product Image">
                <div className="space-y-3">
                  <input
                    type="file"
                    accept="image/*"
                    className="bb-input"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (!file) return

                      const reader = new FileReader()
                      reader.onloadend = () => {
                        setDraft((current) => ({
                          ...current,
                          image_url: reader.result,
                          image_scale: 1,
                          image_x: 0,
                          image_y: 0
                        }))
                      }
                      reader.readAsDataURL(file)
                    }}
                  />

                  <div>
                    <div className="bb-label mb-2">Or paste image URL</div>
                    <input
                      className="bb-input"
                      value={draft.image_url}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          image_url: e.target.value
                        })
                      }
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </Field>

              <Field label="Price">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="bb-input"
                  value={draft.price}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      price: Number(e.target.value || 0)
                    })
                  }
                />
              </Field>

              <Field label="Description">
                <textarea
                  className="bb-input min-h-[110px]"
                  value={draft.description}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      description: e.target.value
                    })
                  }
                />
              </Field>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={draft.is_active}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        is_active: e.target.checked
                      })
                    }
                  />
                  Active
                </label>

                <div className="flex gap-2">
                  {editingId && (
                    <button className="bb-btn" type="button" onClick={reset}>
                      Cancel
                    </button>
                  )}

                  <button className="bb-btn bb-btn-accent" type="button" onClick={save}>
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-7 space-y-6">
          <div className="bb-card p-6">
            <div className="bb-label">Live Preview</div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                className="bb-btn"
                type="button"
                onClick={() =>
                  setDraft((prev) => ({
                    ...prev,
                    image_scale: Number((prev.image_scale + 0.1).toFixed(2))
                  }))
                }
              >
                Zoom In
              </button>

              <button
                className="bb-btn"
                type="button"
                onClick={() =>
                  setDraft((prev) => ({
                    ...prev,
                    image_scale: Math.max(0.2, Number((prev.image_scale - 0.1).toFixed(2)))
                  }))
                }
              >
                Zoom Out
              </button>

              <button className="bb-btn" type="button" onClick={resetImagePosition}>
                Reset Crop
              </button>
            </div>

            <div className="mt-4 bb-card p-5">
              <div
                className="aspect-[4/3] bg-black/5 dark:bg-white/5 overflow-hidden relative cursor-move select-none"
                onPointerDown={onImagePointerDown}
                onPointerMove={onImagePointerMove}
                onPointerUp={onImagePointerUp}
                onPointerLeave={onImagePointerUp}
              >
                {draft.image_url ? (
                  <img
                    src={draft.image_url}
                    alt={draft.name || 'Preview'}
                    draggable={false}
                    style={{
                      transform: `translate(${draft.image_x}px, ${draft.image_y}px) scale(${draft.image_scale})`,
                      transformOrigin: 'center center'
                    }}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full grid place-items-center text-xs uppercase tracking-widest opacity-60">
                    No image selected
                  </div>
                )}
              </div>

              <div className="mt-4 flex items-start justify-between gap-4">
                <div>
                  <div className="font-display text-xl leading-tight">
                    {draft.name || 'Product Name'}
                  </div>
                  <div className="text-xs uppercase tracking-widest opacity-70 mt-1">
                    {draft.category || 'Category'}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm uppercase tracking-widest opacity-70">Price</div>
                  <div className="font-display text-xl">
                    ${Number(draft.price || 0).toFixed(2)}
                  </div>
                </div>
              </div>

              <p className="text-sm bb-muted mt-3 leading-relaxed">
                {draft.description ||
                  'Your product preview will appear here as customers would see it.'}
              </p>
            </div>
          </div>

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
                {products.map((p) => (
                  <tr key={p.id} className="border-b border-black/10 dark:border-white/10">
                    <td className="py-3">{p.name}</td>
                    <td className="py-3 bb-muted">{p.category}</td>
                    <td className="py-3">${Number(p.price || 0).toFixed(2)}</td>
                    <td className="py-3">{p.is_active ? 'Yes' : 'No'}</td>
                    <td className="py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="bb-btn" type="button" onClick={() => startEdit(p)}>
                          Edit
                        </button>
                        <button className="bb-btn" type="button" onClick={() => del(p.id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {!products.length && (
                  <tr>
                    <td className="py-6 bb-muted" colSpan="5">
                      No products yet.
                    </td>
                  </tr>
                )}
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
      setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)))
    } catch (e) {
      setError(e.message || 'Failed to update order request.')
    }
  }

  const del = async (id) => {
    setError('')
    try {
      await api.deleteOrder(id)
      setOrders((prev) => prev.filter((o) => o.id !== id))
    } catch (e) {
      setError(e.message || 'Failed to delete order request.')
    }
  }

  return (
    <Section eyebrow="Manage" title="Custom Order Requests">
      <div className="space-y-4">
        {orders.map((o) => (
          <div key={o.id} className="bb-card p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="max-w-3xl">
                <div className="font-display text-xl">Request #{o.id}</div>
                <div className="text-xs uppercase tracking-widest opacity-70 mt-1">
                  {new Date(o.created_at).toLocaleString()}
                </div>

                <div className="mt-4 grid md:grid-cols-2 gap-x-8 gap-y-3 text-sm bb-muted">
                  <div>
                    <span className="opacity-70">Customer:</span> {o.customer_name}
                  </div>
                  <div>
                    <span className="opacity-70">Email:</span> {o.customer_email}
                  </div>
                  <div>
                    <span className="opacity-70">Phone:</span> {o.customer_phone || '—'}
                  </div>
                  <div>
                    <span className="opacity-70">Event Type:</span> {o.event_type || '—'}
                  </div>
                  <div>
                    <span className="opacity-70">Dessert Type:</span> {o.dessert_type || '—'}
                  </div>
                  <div>
                    <span className="opacity-70">Servings:</span> {o.servings || '—'}
                  </div>
                  <div>
                    <span className="opacity-70">Event Date:</span> {o.event_date || '—'}
                  </div>
                  <div>
                    <span className="opacity-70">Pickup/Delivery:</span> {o.pickup_or_delivery || '—'}
                  </div>
                  <div className="md:col-span-2">
                    <span className="opacity-70">Color Theme:</span> {o.color_theme || '—'}
                  </div>
                  <div className="md:col-span-2">
                    <span className="opacity-70">Flavor Preferences:</span> {o.flavor_preferences || '—'}
                  </div>
                  <div className="md:col-span-2">
                    <span className="opacity-70">Design Notes / Inspiration:</span>{' '}
                    {o.inspiration_notes || '—'}
                  </div>
                </div>
              </div>

              <div className="md:text-right">
                <div className="text-xs uppercase tracking-widest opacity-70">Status</div>
                <div className="font-display text-2xl mt-1">
                  {(o.status || 'new').replace('_', ' ')}
                </div>

                <div className="mt-3 flex flex-wrap gap-2 md:justify-end">
                  {['new', 'in_progress', 'ready', 'completed', 'cancelled'].map((s) => (
                    <button
                      key={s}
                      type="button"
                      className={`bb-btn ${o.status === s ? 'bb-btn-accent' : ''}`}
                      onClick={() => updateStatus(o.id, s)}
                    >
                      {s.replace('_', ' ')}
                    </button>
                  ))}

                  <button type="button" className="bb-btn" onClick={() => del(o.id)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {!orders.length && (
          <div className="bb-card p-6 bb-muted">No custom order requests yet.</div>
        )}
      </div>
    </Section>
  )
}

function ReviewsAdmin({ reviews, setReviews, setError }) {
  const [draft, setDraft] = useState({
    name: '',
    rating: 5,
    message: '',
    approved: true
  })
  const [editingId, setEditingId] = useState(null)

  const startEdit = (r) => {
    setEditingId(r.id)
    setDraft({
      name: r.name,
      rating: r.rating,
      message: r.message,
      approved: r.approved
    })
  }

  const reset = () => {
    setEditingId(null)
    setDraft({
      name: '',
      rating: 5,
      message: '',
      approved: true
    })
  }

  const save = async () => {
    setError('')
    try {
      if (editingId) {
        const updated = await api.updateReview(editingId, draft)
        setReviews((prev) => prev.map((r) => (r.id === editingId ? updated : r)))
      } else {
        const created = await api.createReview(draft)
        setReviews((prev) => [created, ...prev])
      }
      reset()
    } catch (e) {
      setError(e.message || 'Failed to save review.')
    }
  }

  const del = async (id) => {
    setError('')
    try {
      await api.deleteReview(id)
      setReviews((prev) => prev.filter((r) => r.id !== id))
    } catch (e) {
      setError(e.message || 'Failed to delete review.')
    }
  }

  return (
    <Section eyebrow="Manage" title="Reviews">
      <div className="grid md:grid-cols-12 gap-8">
        <div className="md:col-span-5">
          <div className="bb-card p-6">
            <div className="bb-label">
              {editingId ? `Editing #${editingId}` : 'New review'}
            </div>

            <div className="mt-4 space-y-3">
              <Field label="Name">
                <input
                  className="bb-input"
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                />
              </Field>

              <Field label="Rating">
                <select
                  className="bb-input"
                  value={draft.rating}
                  onChange={(e) =>
                    setDraft({ ...draft, rating: Number(e.target.value) })
                  }
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Message">
                <textarea
                  className="bb-input min-h-[110px]"
                  value={draft.message}
                  onChange={(e) => setDraft({ ...draft, message: e.target.value })}
                />
              </Field>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={draft.approved}
                    onChange={(e) =>
                      setDraft({ ...draft, approved: e.target.checked })
                    }
                  />
                  Approved
                </label>

                <div className="flex gap-2">
                  {editingId && (
                    <button className="bb-btn" type="button" onClick={reset}>
                      Cancel
                    </button>
                  )}

                  <button className="bb-btn bb-btn-accent" type="button" onClick={save}>
                    Save
                  </button>
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
                {reviews.map((r) => (
                  <tr key={r.id} className="border-b border-black/10 dark:border-white/10">
                    <td className="py-3">{r.name}</td>
                    <td className="py-3">{r.rating}</td>
                    <td className="py-3">{r.approved ? 'Yes' : 'No'}</td>
                    <td className="py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="bb-btn" type="button" onClick={() => startEdit(r)}>
                          Edit
                        </button>
                        <button className="bb-btn" type="button" onClick={() => del(r.id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {!reviews.length && (
                  <tr>
                    <td className="py-6 bb-muted" colSpan="4">
                      No reviews yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Section>
  )
}

function GalleryAdmin({ gallery, setGallery, setError }) {
  const [draft, setDraft] = useState({
    image_url: '',
    caption: '',
    sort_order: 0
  })

  const [editingId, setEditingId] = useState(null)

  const startEdit = (g) => {
    setEditingId(g.id)

    setDraft({
      image_url: g.image_url,
      caption: g.caption,
      sort_order: g.sort_order
    })
  }

  const reset = () => {
    setEditingId(null)

    setDraft({
      image_url: '',
      caption: '',
      sort_order: 0
    })
  }

  const save = async () => {
    setError('')

    try {
      if (editingId) {
        const updated = await api.updateGallery(editingId, draft)

        setGallery((prev) =>
          prev.map((g) => (g.id === editingId ? updated : g))
        )
      } else {
        const created = await api.createGallery(draft)

        setGallery((prev) =>
          [...prev, created].sort((a, b) => a.sort_order - b.sort_order)
        )
      }

      reset()
    } catch (e) {
      setError(e.message || 'Failed to save gallery item.')
    }
  }

  const del = async (id) => {
    setError('')

    try {
      await api.deleteGallery(id)

      setGallery((prev) => prev.filter((g) => g.id !== id))
    } catch (e) {
      setError(e.message || 'Failed to delete gallery item.')
    }
  }

  return (
    <Section eyebrow="Manage" title="Gallery">
      <div className="grid md:grid-cols-12 gap-8">

        {/* LEFT FORM */}
        <div className="md:col-span-5">
          <div className="bb-card p-6">

            <div className="bb-label">
              {editingId ? `Editing #${editingId}` : 'New gallery item'}
            </div>

            <div className="mt-4 space-y-3">

              <Field label="Image URL">
                <input
                  className="bb-input"
                  value={draft.image_url}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      image_url: e.target.value
                    })
                  }
                  placeholder="Paste image URL or /static/uploads/image.jpg"
                />
              </Field>

              <Field label="Caption">
                <input
                  className="bb-input"
                  value={draft.caption}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      caption: e.target.value
                    })
                  }
                />
              </Field>

              <Field label="Sort Order">
                <input
                  type="number"
                  className="bb-input"
                  value={draft.sort_order}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      sort_order: Number(e.target.value || 0)
                    })
                  }
                />
              </Field>

              <div className="flex items-center justify-end gap-2">

                {editingId && (
                  <button
                    className="bb-btn"
                    type="button"
                    onClick={reset}
                  >
                    Cancel
                  </button>
                )}

                <button
                  className="bb-btn bb-btn-accent"
                  type="button"
                  onClick={save}
                >
                  Save
                </button>

              </div>

            </div>
          </div>
        </div>


        {/* RIGHT PREVIEW GRID */}
        <div className="md:col-span-7 grid sm:grid-cols-2 gap-6">

          {gallery.map((g) => (
            <div key={g.id} className="bb-card overflow-hidden">

              <div className="aspect-[4/3] bg-black/5 dark:bg-white/5">
                <img
                  src={resolveImageUrl(g.image_url)}
                  alt={g.caption || 'Gallery'}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="p-4">

                <div className="flex items-start justify-between gap-3">

                  <div>
                    <div className="text-xs uppercase tracking-widest opacity-70">
                      Sort {g.sort_order}
                    </div>

                    <div className="mt-1 text-sm bb-muted">
                      {g.caption}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      className="bb-btn"
                      type="button"
                      onClick={() => startEdit(g)}
                    >
                      Edit
                    </button>

                    <button
                      className="bb-btn"
                      type="button"
                      onClick={() => del(g.id)}
                    >
                      Delete
                    </button>
                  </div>

                </div>

              </div>
            </div>
          ))}

          {!gallery.length && (
            <div className="bb-card p-6 bb-muted">
              No gallery items yet.
            </div>
          )}

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
      setContacts((prev) => prev.filter((c) => c.id !== id))
    } catch (e) {
      setError(e.message || 'Failed to delete contact message.')
    }
  }

  return (
    <Section eyebrow="Messages" title="Contact Inbox">
      <div className="space-y-4">
        {contacts.map((c) => (
          <div key={c.id} className="bb-card p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <div className="font-display text-xl">{c.subject}</div>
                <div className="text-xs uppercase tracking-widest opacity-70 mt-1">
                  {new Date(c.created_at).toLocaleString()}
                </div>

                <div className="mt-3 text-sm bb-muted">
                  <div>
                    <span className="opacity-70">From:</span> {c.name} — {c.email}
                  </div>
                  <div className="mt-2">
                    <span className="opacity-70">Message:</span> {c.message}
                  </div>
                </div>
              </div>

              <div className="md:text-right">
                <button className="bb-btn" type="button" onClick={() => del(c.id)}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {!contacts.length && (
          <div className="bb-card p-6 bb-muted">No contact messages yet.</div>
        )}
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