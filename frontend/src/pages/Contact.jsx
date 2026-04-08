import React, { useState } from 'react'
import Section from '../components/Section'
import { api } from '../lib/api'

export default function Contact() {
  const [form, setForm] = useState({
    prefix: '',
    first_name: '',
    last_name: '',
    suffix: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: ''
  })

  const [status, setStatus] = useState({ kind: '', msg: '' })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const errs = {}
    if (!form.first_name.trim()) errs.first_name = 'First name is required.'
    if (!form.last_name.trim()) errs.last_name = 'Last name is required.'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
    if (!form.email.trim()) {
      errs.email = 'Email is required.'
    } else if (!emailRegex.test(form.email)) {
      errs.email = 'Please enter a valid email address (e.g. name@example.com).'
    }
    const phoneDigits = form.phone.replace(/\D/g, '')
    if (!form.phone.trim()) {
      errs.phone = 'Phone number is required.'
    } else if (phoneDigits.length !== 10) {
      errs.phone = 'Please enter a valid 10-digit US phone number.'
    }
    if (!form.message.trim()) errs.message = 'Message is required.'
    return errs
  }

  const formatPhone = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 10)
    if (digits.length <= 3) return digits
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
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
      payload.name = nameParts.join(' ')
      delete payload.prefix
      delete payload.first_name
      delete payload.last_name
      delete payload.suffix
      await api.sendContact(payload)
      setErrors({})
      setStatus({ kind: 'ok', msg: "Your inquiry has been sent. We'll be in touch soon." })
      setForm({
        prefix: '',
        first_name: '',
        last_name: '',
        suffix: '',
        email: '',
        phone: '',
        subject: 'General Inquiry',
        message: ''
      })
    } catch (e) {
      setStatus({ kind: 'err', msg: e.message || 'Failed to send inquiry.' })
    }
  }

  return (
    <>
      <section className="pt-16">
        <div className="bb-container">
          <div className="bb-label text-cherry">Contact</div>
          <h1 className="bb-h1 mt-3">Get in touch</h1>
          <p className="mt-6 text-base md:text-lg bb-muted leading-relaxed max-w-3xl">
            Have a question, want to discuss an event, or just want to say hello?
            We'd love to hear from you.
          </p>
        </div>
      </section>

      <Section eyebrow="Inquiry" title="Send us a message.">
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
                className={`bb-input ${errors.email ? 'border-cherry' : ''}`}
                value={form.email}
                onChange={(e) => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: '' }) }}
              />
              {errors.email && <p className="text-cherry text-xs mt-1">{errors.email}</p>}
            </div>
            <div>
              <div className="bb-label mb-2">Phone <span className="text-cherry">*</span></div>
              <input
                type="tel"
                className={`bb-input ${errors.phone ? 'border-cherry' : ''}`}
                placeholder="(555) 123-4567"
                value={form.phone}
                onChange={(e) => { setForm({ ...form, phone: formatPhone(e.target.value) }); setErrors({ ...errors, phone: '' }) }}
              />
              {errors.phone && <p className="text-cherry text-xs mt-1">{errors.phone}</p>}
            </div>
          </div>

          <div>
            <div className="bb-label mb-2">Subject</div>
            <select
              className="bb-input"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
            >
              <option value="General Inquiry">General Inquiry</option>
              <option value="Custom Order Question">Custom Order Question</option>
              <option value="Pricing">Pricing</option>
              <option value="Availability">Availability</option>
              <option value="Feedback">Feedback</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <div className="bb-label mb-2">Message <span className="text-cherry">*</span></div>
            <textarea
              className={`bb-input min-h-[140px] ${errors.message ? 'border-cherry' : ''}`}
              value={form.message}
              onChange={(e) => { setForm({ ...form, message: e.target.value }); setErrors({ ...errors, message: '' }) }}
              placeholder="Tell us how we can help..."
            />
            {errors.message && <p className="text-cherry text-xs mt-1">{errors.message}</p>}
          </div>

          <div className="flex items-center gap-3">
            <button className="bb-btn bb-btn-accent" type="submit">
              Send Message
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
