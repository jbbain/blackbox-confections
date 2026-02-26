import React, { useMemo, useState } from 'react'
import Section from '../components/Section'
import { useCart } from '../state/cart'
import { api } from '../lib/api'

export default function Cart() {
  const { items, remove, setQty, clear, subtotal } = useCart()
  const [form, setForm] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    fulfillment_type: 'pickup',
    address: '',
    notes: ''
  })
  const [status, setStatus] = useState({ kind: '', msg: '' })

  const total = useMemo(() => Math.round(subtotal * 100) / 100, [subtotal])

  const placeOrder = async (e) => {
    e.preventDefault()
    setStatus({ kind: '', msg: '' })
    if (!items.length) return setStatus({ kind: 'err', msg: 'Your cart is empty.' })
    try {
      const payload = {
        ...form,
        items: items.map(i => ({ product_id: i.product.id, quantity: i.quantity }))
      }
      const order = await api.createOrder(payload)
      clear()
      setStatus({ kind: 'ok', msg: `Order placed. Your order #${order.id} is now in “new” status.` })
      setForm({ customer_name: '', customer_email: '', customer_phone: '', fulfillment_type: 'pickup', address: '', notes: '' })
    } catch (e) {
      setStatus({ kind: 'err', msg: e.message })
    }
  }

  return (
    <>
      <section className="pt-16">
        <div className="bb-container">
          <div className="bb-label text-cherry">Cart</div>
          <h1 className="bb-h1 mt-3">Checkout</h1>
          <p className="mt-6 text-base md:text-lg bb-muted leading-relaxed max-w-3xl">
            Review items, then place your order. No authentication or payments wired yet—this is a clean ordering flow.
          </p>
        </div>
      </section>

      <Section eyebrow="Items" title="Your selection.">
        <div className="grid md:grid-cols-12 gap-8">
          <div className="md:col-span-7 space-y-4">
            {items.map(i => (
              <div key={i.product.id} className="bb-card p-5 flex gap-4">
                <div className="h-24 w-24 bg-black/5 dark:bg-white/5 overflow-hidden shrink-0">
                  {i.product.image_url ? <img src={i.product.image_url} alt={i.product.name} className="h-full w-full object-cover" /> : null}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-display text-xl">{i.product.name}</div>
                      <div className="text-xs uppercase tracking-widest opacity-70 mt-1">{i.product.category}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-display text-xl">${(i.product.price * i.quantity).toFixed(2)}</div>
                      <div className="text-xs uppercase tracking-widest opacity-70">${i.product.price.toFixed(2)} each</div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="bb-label">Qty</div>
                    <input
                      type="number"
                      min="1"
                      className="bb-input w-24"
                      value={i.quantity}
                      onChange={e => setQty(i.product.id, Number(e.target.value || 1))}
                    />
                    <button className="bb-btn" type="button" onClick={() => remove(i.product.id)}>Remove</button>
                  </div>
                </div>
              </div>
            ))}
            {!items.length && (
              <div className="bb-card p-6 bb-muted">Your cart is empty.</div>
            )}
          </div>

          <div className="md:col-span-5">
            <div className="bb-card p-6">
              <div className="flex items-center justify-between">
                <div className="bb-label">Subtotal</div>
                <div className="font-display text-2xl">${total.toFixed(2)}</div>
              </div>
              <div className="bb-divider my-6" />
              <form onSubmit={placeOrder} className="space-y-4">
                <div>
                  <div className="bb-label mb-2">Name</div>
                  <input className="bb-input" value={form.customer_name} onChange={e => setForm({ ...form, customer_name: e.target.value })} required />
                </div>
                <div>
                  <div className="bb-label mb-2">Email</div>
                  <input type="email" className="bb-input" value={form.customer_email} onChange={e => setForm({ ...form, customer_email: e.target.value })} required />
                </div>
                <div>
                  <div className="bb-label mb-2">Phone</div>
                  <input className="bb-input" value={form.customer_phone} onChange={e => setForm({ ...form, customer_phone: e.target.value })} />
                </div>
                <div>
                  <div className="bb-label mb-2">Fulfillment</div>
                  <select className="bb-input" value={form.fulfillment_type} onChange={e => setForm({ ...form, fulfillment_type: e.target.value })}>
                    <option value="pickup">Pickup</option>
                    <option value="delivery">Delivery</option>
                  </select>
                </div>
                {form.fulfillment_type === 'delivery' && (
                  <div>
                    <div className="bb-label mb-2">Address</div>
                    <input className="bb-input" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} required />
                  </div>
                )}
                <div>
                  <div className="bb-label mb-2">Notes</div>
                  <textarea className="bb-input min-h-[90px]" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
                </div>
                <button className="bb-btn bb-btn-accent w-full" type="submit">Place order</button>
                {status.msg && (
                  <div className={`text-sm ${status.kind === 'ok' ? 'opacity-80' : 'text-cherry'}`}>{status.msg}</div>
                )}
              </form>
            </div>
          </div>
        </div>
      </Section>
    </>
  )
}
