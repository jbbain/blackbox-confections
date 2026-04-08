const API_BASE =
  import.meta.env.VITE_API_BASE || 'http://localhost:8000/api'

export const ASSET_BASE = API_BASE.replace('/api', '')
console.log('API_BASE:', API_BASE)
export function resolveImageUrl(path) {
  if (!path) return ''
  if (path.startsWith('http') || path.startsWith('data:')) return path
  return `${ASSET_BASE}${path}`
}

async function request(path, options = {}) {
  console.log('API request about to fire', `${API_BASE}${path}`, options)
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

export const api = {
  // orders (custom requests)
  listOrders: () => request('/orders'),
  createOrder: (body) => request('/orders', { method: 'POST', body: JSON.stringify(body) }),
  updateOrder: (id, body) => request(`/orders/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteOrder: (id) => request(`/orders/${id}`, { method: 'DELETE' }),

  // reviews
  listReviews: (approvedOnly = true) => request(`/reviews?approved_only=${approvedOnly}`),
  createReview: (body) => request('/reviews', { method: 'POST', body: JSON.stringify(body) }),
  updateReview: (id, body) => request(`/reviews/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteReview: (id) => request(`/reviews/${id}`, { method: 'DELETE' }),

  // gallery
  listGallery: () => request('/gallery'),
  createGallery: (body) => request('/gallery', { method: 'POST', body: JSON.stringify(body) }),
  updateGallery: (id, body) => request(`/gallery/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteGallery: (id) => request(`/gallery/${id}`, { method: 'DELETE' }),

  // contact
  sendContact: (body) => request('/contact', { method: 'POST', body: JSON.stringify(body) }),
  listContacts: () => request('/contacts'),
  deleteContact: (id) => request(`/contacts/${id}`, { method: 'DELETE' }),

  // page tracking
  trackVisit: (page) => request('/track', { method: 'POST', body: JSON.stringify({ page }) }).catch(() => {}),

  // analytics
  getAnalytics: (days = 30) => request(`/analytics/summary?days=${days}`),

  // vercel web analytics
  getVercelAnalytics: () => request('/analytics/vercel')
}