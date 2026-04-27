const API_BASE =
  import.meta.env.VITE_API_BASE || 'http://localhost:8000/api'

export const ASSET_BASE = API_BASE.replace('/api', '')

export function resolveImageUrl(path) {
  if (!path) return ''
  if (path.startsWith('http') || path.startsWith('data:')) return path
  return `${ASSET_BASE}${path}`
}

export const GOOGLE_SHEETS_URL =
  import.meta.env.VITE_GOOGLE_SCRIPT_URL ||
  'https://script.google.com/macros/s/AKfycbzm9JBn999NpW8SY3uP-wGedxqYXbnV5vSpDRUN7zrwUsg9HaB0BwG85ehcZO1f1ZJdfA/exec'

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  })

  if (!res.ok) {
    let msg = 'Request failed'
    try {
      msg = (await res.json()).detail || msg
    } catch {}
    throw new Error(msg)
  }

  return res.json()
}

async function submitToGoogleScript(payload) {
  if (!GOOGLE_SHEETS_URL) {
    throw new Error('Google Script URL is missing.')
  }

  await fetch(GOOGLE_SHEETS_URL, {
    method: 'POST',
    mode: 'no-cors',
    body: JSON.stringify(payload)
  })

  return { success: true }
}

async function getFromGoogleScript(action){
  const res = await fetch(`${GOOGLE_SHEETS_URL}?action=${action}`);
  const data = await res.json();

  if (!data.success) {
    throw new Error(data.message || "Request failed.");
  }

  return data.items || [];
}

export const api = {
  // orders/contact now go to Google Sheets
  createOrder: (body) =>
    submitToGoogleScript({
      type: 'order',
      ...body
    }),

  sendContact: (body) =>
    submitToGoogleScript({
      type: 'contact',
      ...body
    }),

  createReview: (body) =>
    submitToGoogleScript({
      type: "review",
      ...body
    }),

    listGallery: () => getFromGoogleScript("gallery"),
    listReviews: () => getFromGoogleScript("reviews"),

  // backend-powered features
  listOrders: () => request('/orders'),
  updateOrder: (id, body) => request(`/orders/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteOrder: (id) => request(`/orders/${id}`, { method: 'DELETE' }),

  listReviews: (approvedOnly = true) => request(`/reviews?approved_only=${approvedOnly}`),
  createReview: (body) => request('/reviews', { method: 'POST', body: JSON.stringify(body) }),
  updateReview: (id, body) => request(`/reviews/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteReview: (id) => request(`/reviews/${id}`, { method: 'DELETE' }),

  listGallery: () => request('/gallery'),
  createGallery: (body) => request('/gallery', { method: 'POST', body: JSON.stringify(body) }),
  updateGallery: (id, body) => request(`/gallery/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteGallery: (id) => request(`/gallery/${id}`, { method: 'DELETE' }),

  listContacts: () => request('/contacts'),
  deleteContact: (id) => request(`/contacts/${id}`, { method: 'DELETE' }),

  trackVisit: (page) => request('/track', { method: 'POST', body: JSON.stringify({ page }) }).catch(() => {}),
  getAnalytics: (days = 30) => request(`/analytics/summary?days=${days}`),
  getVercelAnalytics: () => request('/analytics/vercel')
}