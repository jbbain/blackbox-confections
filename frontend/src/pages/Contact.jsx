import React, { useState } from 'react'
import Section from '../components/Section'
import { api } from '../lib/api'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: 'Inquiry', message: '' })
  const [status, setStatus] = useState({ kind: '', msg: '' })

  const onSubmit = async (e) => {
    e.preventDefault()
    setStatus({ kind: '', msg: '' })
    try {
      await api.sendContact(form)
      setStatus({ kind: 'ok', msg: 'Message received. We’ll reply soon.' })
      setForm({ name: '', email: '', subject: 'Inquiry', message: '' })
    } catch (e) {
      setStatus({ kind: 'err', msg: e.message })
    }
  }

  return (
    <>
      <section className="pt-16">
        <div className="bb-container">
          <div className="bb-label text-cherry">Contact</div>
          <h1 className="bb-h1 mt-3">Let’s design your order.</h1>
          <p className="mt-6 text-base md:text-lg bb-muted leading-relaxed max-w-3xl">
            Custom cakes, event trays, premium dessert tables. Tell us what you need.
          </p>
        </div>
      </section>

      <Section eyebrow="Inquiry" title="Send a message.">
        <form onSubmit={onSubmit} className="max-w-2xl">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <div className="bb-label mb-2">Name</div>
              <input className="bb-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <div className="bb-label mb-2">Email</div>
              <input type="email" className="bb-input" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
          </div>
          <div className="mt-4">
            <div className="bb-label mb-2">Subject</div>
            <input className="bb-input" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} />
          </div>
          <div className="mt-4">
            <div className="bb-label mb-2">Message</div>
            <textarea className="bb-input min-h-[140px]" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required />
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button className="bb-btn bb-btn-accent" type="submit">Send</button>
            {status.msg && (
              <div className={`text-sm ${status.kind === 'ok' ? 'opacity-80' : 'text-cherry'}`}>{status.msg}</div>
            )}
          </div>
        </form>
      </Section>
    </>
  )
}
