import React, { useEffect, useState } from 'react'
import Section from '../components/Section'
import { api, resolveImageUrl } from '../lib/api'
import { useAdminAuth } from '../state/adminAuth'
import DashboardAdmin from './DashboardAdmin'

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

  const [tab, setTab] = useState('dashboard')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [orders, setOrders] = useState([])
  const [reviews, setReviews] = useState([])
  const [gallery, setGallery] = useState([])
  const [contacts, setContacts] = useState([])

  const refresh = async () => {
    setError('')
    setLoading(true)

    try {
      const [o, r, g, c] = await Promise.all([
        api.listOrders(),
        api.listReviews(false),
        api.listGallery(),
        api.listContacts()
      ])

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
            Manage custom order requests, reviews, gallery items, and contact messages.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            <TabButton active={tab === 'dashboard'} onClick={() => setTab('dashboard')}>
              Dashboard
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

      {tab === 'dashboard' && <DashboardAdmin />}

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
          <div key={o.id} className="bb-card p-6 relative overflow-hidden">
            {/* ── fireworks overlay when completed ── */}
            {o.status === 'completed' && <Fireworks />}

            {/* ── tracker ── */}
            <OrderTracker
              status={o.status || 'new'}
              onChange={(s) => updateStatus(o.id, s)}
            />

            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mt-5">
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

              <div className="md:text-right shrink-0">
                <button type="button" className="bb-btn text-xs mt-2" onClick={() => del(o.id)}>
                  🗑 Delete
                </button>
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

/* ── Fireworks / confetti burst for completed orders ── */
function Fireworks() {
  const particles = React.useMemo(() => {
    const colors = ['#D2042D', '#16a34a', '#f59e0b', '#6366f1', '#ec4899', '#14b8a6', '#f97316', '#22d3ee']
    return Array.from({ length: 40 }, (_, i) => ({
      id: i,
      color: colors[i % colors.length],
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 0.6}s`,
      duration: `${1.2 + Math.random() * 1.2}s`,
      size: `${4 + Math.random() * 4}px`,
      tx: `${(Math.random() - 0.5) * 200}px`,
      ty: `${-40 - Math.random() * 120}px`,
      rotate: `${Math.random() * 720}deg`,
      shape: i % 5 === 0 ? 'circle' : i % 5 === 1 ? 'star' : 'rect',
    }))
  }, [])

  return (
    <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute bottom-0"
          style={{
            left: p.left,
            width: p.size,
            height: p.shape === 'rect' ? `${parseFloat(p.size) * 1.8}px` : p.size,
            backgroundColor: p.color,
            borderRadius: p.shape === 'circle' ? '50%' : p.shape === 'star' ? '2px' : '1px',
            opacity: 0,
            animation: `fireworkBurst ${p.duration} ${p.delay} ease-out forwards`,
            ['--tx']: p.tx,
            ['--ty']: p.ty,
            ['--rot']: p.rotate,
          }}
        />
      ))}
      <style>{`
        @keyframes fireworkBurst {
          0% {
            opacity: 1;
            transform: translateY(0) translateX(0) rotate(0deg) scale(1);
          }
          60% {
            opacity: 0.9;
          }
          100% {
            opacity: 0;
            transform: translateY(var(--ty)) translateX(var(--tx)) rotate(var(--rot)) scale(0.3);
          }
        }
      `}</style>
    </div>
  )
}

/* ── Dominos-style order progress tracker ────────── */
const ORDER_STEPS = [
  { key: 'new',         label: 'New',         icon: '📋' },
  { key: 'in_progress', label: 'In Progress', icon: '🧑🏿‍🍳' },
  { key: 'ready',       label: 'Ready',       icon: '🎂' },
  { key: 'completed',   label: 'Completed',   icon: '🎉' },
]
const CANCELLED_KEY = 'cancelled'

function OrderTracker({ status, onChange }) {
  const isCancelled = status === CANCELLED_KEY
  const activeIdx = ORDER_STEPS.findIndex((s) => s.key === status)
  const isAllDone = status === 'completed'

  // Color scheme: green when completed, cherry otherwise
  const accent    = isAllDone ? '#16a34a' : '#D2042D' // green-600 vs cherry
  const accentBg  = isAllDone ? 'bg-green-600'   : 'bg-cherry'
  const accentTxt = isAllDone ? 'text-green-600'  : 'text-cherry'
  const accentShadow = isAllDone
    ? 'shadow-lg shadow-green-600/30 ring-4 ring-green-600/20'
    : 'shadow-lg shadow-cherry/30 ring-4 ring-cherry/20'
  const accentPing = isAllDone ? 'bg-green-600/20' : 'bg-cherry/20'

  return (
    <div className="space-y-2">
      {/* ── step rail ── */}
      <div className="relative flex items-center">
        {ORDER_STEPS.map((step, i) => {
          const isCompleted = !isCancelled && activeIdx > i
          const isActive    = !isCancelled && activeIdx === i
          const isPast      = isCompleted || isActive

          return (
            <React.Fragment key={step.key}>
              {/* connector line (before every step except the first) */}
              {i > 0 && (
                <div className="flex-1 h-0.5 mx-1 rounded-full transition-colors duration-500 ease-out"
                  style={{
                    background: isPast
                      ? accent
                      : isCancelled
                        ? 'rgba(239,68,68,0.25)'
                        : 'rgba(161,161,170,0.25)'
                  }}
                />
              )}

              {/* step node */}
              <button
                type="button"
                onClick={() => onChange(step.key)}
                className="group relative flex flex-col items-center shrink-0 focus:outline-none"
                title={`Set to ${step.label}`}
              >
                {/* circle */}
                <div
                  className={`
                    relative z-10 flex items-center justify-center rounded-full
                    transition-all duration-300 ease-out cursor-pointer
                    ${isActive
                      ? `w-10 h-10 ${accentBg} text-white ${accentShadow} scale-110`
                      : isCompleted
                        ? `w-8 h-8 ${accentBg} text-white shadow-sm opacity-90`
                        : isCancelled
                          ? 'w-8 h-8 bg-red-500/15 text-red-400 dark:bg-red-500/20 dark:text-red-400'
                          : 'w-8 h-8 bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700'
                    }
                  `}
                >
                  <span className={`${isActive ? 'text-lg' : 'text-sm'} leading-none`}>
                    {isCompleted ? '✓' : step.icon}
                  </span>
                </div>

                {/* label */}
                <span
                  className={`
                    mt-1.5 text-[10px] font-semibold uppercase tracking-widest whitespace-nowrap
                    transition-colors duration-300
                    ${isActive
                      ? accentTxt
                      : isCompleted
                        ? `${accentTxt} opacity-70`
                        : 'text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-600 dark:group-hover:text-zinc-300'
                    }
                  `}
                >
                  {step.label}
                </span>

                {/* active pulse ring */}
                {isActive && (
                  <span className={`absolute top-0 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full ${accentPing} animate-ping pointer-events-none`} />
                )}
              </button>
            </React.Fragment>
          )
        })}
      </div>

      {/* ── cancel toggle ── */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => onChange(isCancelled ? 'new' : CANCELLED_KEY)}
          className={`
            text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-md transition-all
            ${isCancelled
              ? 'bg-red-500/15 text-red-500 hover:bg-red-500/25'
              : 'text-zinc-400 hover:text-red-500 hover:bg-red-500/10 dark:text-zinc-500 dark:hover:text-red-400'
            }
          `}
        >
          {isCancelled ? '↩ Restore' : '✕ Cancel Order'}
        </button>
      </div>

      {/* ── cancelled banner ── */}
      {isCancelled && (
        <div className="text-center text-xs font-semibold uppercase tracking-widest text-red-500 bg-red-500/10 dark:bg-red-500/15 rounded-md py-2">
          Order Cancelled
        </div>
      )}
    </div>
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