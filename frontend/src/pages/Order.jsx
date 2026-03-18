import React, { useState } from 'react'
import Section from '../components/Section'
import { api } from '../lib/api'

export default function Order() {
  const [form, setForm] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    event_type: '',
    dessert_type: '',
    servings: '',
    event_date: '',
    pickup_or_delivery: 'pickup',
    inspiration_notes: '',
    color_theme: '',
    flavor_preferences: ''
  })

  const [status, setStatus] = useState({ kind: '', msg: '' })

  const onSubmit = async (e) => {
    e.preventDefault()
    console.log('Order form submit fired', form)
    setStatus({ kind: '', msg: '' })

    try {
      await api.createOrder(form)
      setStatus({ kind: 'ok', msg: 'Your custom order request has been submitted.' })
      setForm({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        event_type: '',
        dessert_type: '',
        servings: '',
        event_date: '',
        pickup_or_delivery: 'pickup',
        inspiration_notes: '',
        color_theme: '',
        flavor_preferences: ''
      })
    } catch (e) {
      console.error('Order submit error', e);
      setStatus({ kind: 'err', msg: e.message || 'Failed to submit order request.' })
    }
  }

  return (
    <>
      <section className="pt-16">
        <div className="bb-container">
          <div className="bb-label text-cherry">Custom Order</div>
          <h1 className="bb-h1 mt-3">Request your order</h1>
          <p className="mt-6 text-base md:text-lg bb-muted leading-relaxed max-w-3xl">
            Tell us about your event, style, servings, and flavor preferences. We’ll review
            your request and follow up with next steps.
          </p>
        </div>
      </section>

      <Section eyebrow="Order Request" title="Let’s create something unforgettable.">
        <form onSubmit={onSubmit} className="max-w-3xl space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <div className="bb-label mb-2">Name</div>
              <input
                className="bb-input"
                value={form.customer_name}
                onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                required
              />
            </div>
            <div>
              <div className="bb-label mb-2">Email</div>
              <input
                type="email"
                className="bb-input"
                value={form.customer_email}
                onChange={(e) => setForm({ ...form, customer_email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <div className="bb-label mb-2">Phone</div>
              <input
                className="bb-input"
                value={form.customer_phone}
                onChange={(e) => setForm({ ...form, customer_phone: e.target.value })}
              />
            </div>
            <div>
              <div className="bb-label mb-2">Event Date</div>
              <input
                type="date"
                className="bb-input"
                value={form.event_date}
                onChange={(e) => setForm({ ...form, event_date: e.target.value })}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <div className="bb-label mb-2">Event Type</div>
              <select
                className="bb-input"
                value={form.event_type}
                onChange={(e) => setForm({ ...form, event_type: e.target.value })}
              >
                <option value="">Select event type</option>
                <option value="Birthday">Birthday</option>
                <option value="Wedding">Wedding</option>
                <option value="Baby Shower">Baby Shower</option>
                <option value="Bridal Shower">Bridal Shower</option>
                <option value="Corporate">Corporate</option>
                <option value="Graduation">Graduation</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <div className="bb-label mb-2">Dessert Type</div>
              <select
                className="bb-input"
                value={form.dessert_type}
                onChange={(e) => setForm({ ...form, dessert_type: e.target.value })}
              >
                <option value="">Select dessert type</option>
                <option value="Cupcake">Cupcake</option>
                <option value="One-Tier Cake">One-Tier Cake</option>
                <option value="Two-Tier Cake">Two-Tier Cake</option>
                <option value="Three-Tier Cake">Three-Tier Cake</option>
                <option value="Baked Goods">Baked Goods</option>
                <option value="Dessert Table">Dessert Table</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <div className="bb-label mb-2">Estimated Servings</div>
              <input
                className="bb-input"
                value={form.servings}
                onChange={(e) => setForm({ ...form, servings: e.target.value })}
                placeholder="Ex. 25-30"
              />
            </div>

            <div>
              <div className="bb-label mb-2">Pickup or Delivery</div>
              <select
                className="bb-input"
                value={form.pickup_or_delivery}
                onChange={(e) => setForm({ ...form, pickup_or_delivery: e.target.value })}
              >
                <option value="pickup">Pickup</option>
                <option value="delivery">Delivery</option>
              </select>
            </div>
          </div>

          <div>
            <div className="bb-label mb-2">Color Theme</div>
            <input
              className="bb-input"
              value={form.color_theme}
              onChange={(e) => setForm({ ...form, color_theme: e.target.value })}
              placeholder="Ex. Blush pink, gold, ivory"
            />
          </div>

          <div>
            <div className="bb-label mb-2">Flavor Preferences</div>
            <input
              className="bb-input"
              value={form.flavor_preferences}
              onChange={(e) => setForm({ ...form, flavor_preferences: e.target.value })}
              placeholder="Ex. Vanilla bean, strawberry crunch, chocolate ganache"
            />
          </div>

          <div>
            <div className="bb-label mb-2">Design Notes / Inspiration</div>
            <textarea
              className="bb-input min-h-[140px]"
              value={form.inspiration_notes}
              onChange={(e) => setForm({ ...form, inspiration_notes: e.target.value })}
              placeholder="Describe your vision, theme, message on cake, special details, etc."
            />
          </div>

          <div className="flex items-center gap-3">
            <button className="bb-btn bb-btn-accent" type="submit">
              Submit Request
            </button>

            {status.msg && (
              <div className={`text-sm ${status.kind === 'ok' ? 'opacity-80' : 'text-cherry'}`}>
                {status.msg}
              </div>
            )}
          </div>
        </form>
      </Section>
    </>
  )
}