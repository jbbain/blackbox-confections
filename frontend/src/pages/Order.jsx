import React, { useState } from 'react'
import Section from '../components/Section'
import { api } from '../lib/api'
import useScrollReveal from '../hooks/useScrollReveal'

export default function Order() {
  const [form, setForm] = useState({
    prefix: '',
    first_name: '',
    last_name: '',
    suffix: '',
    customer_email: '',
    customer_phone: '',
    event_type: '',
    custom_event_type: '',
    dessert_type: '',
    servings: '',
    event_date: '',
    pickup_or_delivery: 'pickup',
    inspiration_notes: '',
    color_theme: '',
    flavor_preferences: ''
  })

  const [status, setStatus] = useState({ kind: '', msg: '' })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const errs = {}

    if (!form.first_name.trim()) errs.first_name = 'First name is required.'
    if (!form.last_name.trim()) errs.last_name = 'Last name is required.'

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

    if (!form.customer_email.trim()) {
      errs.customer_email = 'Email is required.'
    } else if (!emailRegex.test(form.customer_email)) {
      errs.customer_email = 'Please enter a valid email address.'
    }

    const phoneDigits = form.customer_phone.replace(/\D/g, '')

    if (!form.customer_phone.trim()) {
      errs.customer_phone = 'Phone number is required.'
    } else if (phoneDigits.length !== 10) {
      errs.customer_phone = 'Please enter a valid 10-digit US phone number.'
    }

    if (form.event_type === 'Other' && !form.custom_event_type.trim()) {
      errs.custom_event_type = 'Please specify your event type.'
    }

    return errs
  }

  const formatPhone = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 10)
    if (digits.length <= 3) return digits
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
  }

  const resetForm = () => {
    setForm({
      prefix: '',
      first_name: '',
      last_name: '',
      suffix: '',
      customer_email: '',
      customer_phone: '',
      event_type: '',
      custom_event_type: '',
      dessert_type: '',
      servings: '',
      event_date: '',
      pickup_or_delivery: 'pickup',
      inspiration_notes: '',
      color_theme: '',
      flavor_preferences: ''
    })
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setStatus({ kind: '', msg: '' })

    const validationErrors = validate()
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) return

    try {
      const payload = { ...form }

      const nameParts = [
        payload.prefix,
        payload.first_name.trim(),
        payload.last_name.trim(),
        payload.suffix
      ].filter(Boolean)

      payload.customer_name = nameParts.join(' ')

      delete payload.prefix
      delete payload.first_name
      delete payload.last_name
      delete payload.suffix

      if (payload.event_type === 'Other' && payload.custom_event_type.trim()) {
        payload.event_type = payload.custom_event_type.trim()
      }

      delete payload.custom_event_type

      await api.createOrder(payload)

      setErrors({})
      setStatus({
        kind: 'ok',
        msg: 'Your custom order request has been submitted.'
      })

      resetForm()
    } catch (e) {
      setStatus({
        kind: 'err',
        msg: e.message || 'Failed to submit order request.'
      })
    }
  }

  const [heroRef, heroVisible] = useScrollReveal({ threshold: 0.05 })

  return (
    <>
      <section className="pt-16">
        <div className="bb-container">
          <div ref={heroRef} className={`reveal fade-up ${heroVisible ? 'visible' : ''}`}>
            <div className="bb-label text-cherry">Custom Order</div>
            <h1 className="bb-h1 mt-3">Request your order</h1>
            <p className="mt-6 text-base md:text-lg bb-muted leading-relaxed max-w-3xl">
              Tell us about your event, style, servings, and flavor preferences. We'll review
              your request and follow up with next steps.
            </p>
          </div>
        </div>
      </section>

      <Section eyebrow="Order Request" title="Let’s create something unforgettable.">
        <form onSubmit={onSubmit} noValidate className="max-w-3xl space-y-4">
          <div className="flex flex-wrap gap-4">
            <div className="w-24 shrink-0">
              <div className="bb-label mb-2">Prefix</div>
              <select
                className="bb-input"
                value={form.prefix}
                onChange={(e) => setForm({ ...form, prefix: e.target.value })}
              >
                <option value=""></option>
                <option value="Mr.">Mr.</option>
                <option value="Mrs.">Mrs.</option>
                <option value="Ms.">Ms.</option>
                <option value="Mx.">Mx.</option>
                <option value="Dr.">Dr.</option>
                <option value="Prof.">Prof.</option>
                <option value="Rev.">Rev.</option>
                <option value="Hon.">Hon.</option>
              </select>
            </div>
            <div className="flex-1 min-w-[140px]">
              <div className="bb-label mb-2">First Name <span className="text-cherry">*</span></div>
              <input
                className={`bb-input ${errors.first_name ? 'border-cherry' : ''}`}
                value={form.first_name}
                onChange={(e) => { setForm({ ...form, first_name: e.target.value }); setErrors({ ...errors, first_name: '' }) }}
              />
              {errors.first_name && <p className="text-cherry text-xs mt-1">{errors.first_name}</p>}
            </div>
            <div className="flex-1 min-w-[140px]">
              <div className="bb-label mb-2">Last Name <span className="text-cherry">*</span></div>
              <input
                className={`bb-input ${errors.last_name ? 'border-cherry' : ''}`}
                value={form.last_name}
                onChange={(e) => { setForm({ ...form, last_name: e.target.value }); setErrors({ ...errors, last_name: '' }) }}
              />
              {errors.last_name && <p className="text-cherry text-xs mt-1">{errors.last_name}</p>}
            </div>
            <div className="w-24 shrink-0">
              <div className="bb-label mb-2">Suffix</div>
              <select
                className="bb-input"
                value={form.suffix}
                onChange={(e) => setForm({ ...form, suffix: e.target.value })}
              >
                <option value=""></option>
                <option value="Jr.">Jr.</option>
                <option value="Sr.">Sr.</option>
                <option value="II">II</option>
                <option value="III">III</option>
                <option value="IV">IV</option>
                <option value="Esq.">Esq.</option>
                <option value="PhD">PhD</option>
                <option value="MD">MD</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <div className="bb-label mb-2">Email <span className="text-cherry">*</span></div>
              <input
                type="email"
                className={`bb-input ${errors.customer_email ? 'border-cherry' : ''}`}
                value={form.customer_email}
                onChange={(e) => { setForm({ ...form, customer_email: e.target.value }); setErrors({ ...errors, customer_email: '' }) }}
              />
              {errors.customer_email && <p className="text-cherry text-xs mt-1">{errors.customer_email}</p>}
            </div>
            <div>
              <div className="bb-label mb-2">Phone <span className="text-cherry">*</span></div>
              <input
                type="tel"
                className={`bb-input ${errors.customer_phone ? 'border-cherry' : ''}`}
                placeholder="(555) 123-4567"
                value={form.customer_phone}
                onChange={(e) => { setForm({ ...form, customer_phone: formatPhone(e.target.value) }); setErrors({ ...errors, customer_phone: '' }) }}
              />
              {errors.customer_phone && <p className="text-cherry text-xs mt-1">{errors.customer_phone}</p>}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <div className="bb-label mb-2">Event Date</div>
              <input
                type="date"
                className="bb-input"
                value={form.event_date}
                onChange={(e) => setForm({ ...form, event_date: e.target.value })}
              />
            </div>
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
              {form.event_type === 'Other' && (
                <>
                  <input
                    className={`bb-input mt-2 ${errors.custom_event_type ? 'border-cherry' : ''}`}
                    placeholder="Please specify your event type"
                    value={form.custom_event_type}
                    onChange={(e) => { setForm({ ...form, custom_event_type: e.target.value }); setErrors({ ...errors, custom_event_type: '' }) }}
                  />
                  {errors.custom_event_type && <p className="text-cherry text-xs mt-1">{errors.custom_event_type}</p>}
                </>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
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
            <div>
              <div className="bb-label mb-2">Estimated Servings</div>
              <input
                className="bb-input"
                value={form.servings}
                onChange={(e) => setForm({ ...form, servings: e.target.value })}
                placeholder="Ex. 25-30"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
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
            <div>
              <div className="bb-label mb-2">Color Theme</div>
              <input
                className="bb-input"
                value={form.color_theme}
                onChange={(e) => setForm({ ...form, color_theme: e.target.value })}
                placeholder="Ex. Blush pink, gold, ivory"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <div className="bb-label mb-2">Flavor Preferences</div>
              <input
                className="bb-input"
                value={form.flavor_preferences}
                onChange={(e) => setForm({ ...form, flavor_preferences: e.target.value })}
                placeholder="Ex. Vanilla bean, strawberry crunch, chocolate ganache"
              />
            </div>
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

            {Object.keys(errors).length > 0 && (
              <div className="text-cherry text-sm font-medium">
                Please fix the highlighted fields above.
              </div>
            )}

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