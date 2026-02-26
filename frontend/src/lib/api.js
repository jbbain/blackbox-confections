const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api'

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  })
  if (!res.ok) {
    let msg = 'Request failed'
    try { msg = (await res.json()).detail || msg } catch {}
    throw new Error(msg)
  }
  return res.json()
}

export const api = {
  // products
  listProducts: (activeOnly = true) => request(`/products?active_only=${activeOnly}`),
  createProduct: (body) => request('/products', { method: 'POST', body: JSON.stringify(body) }),
  updateProduct: (id, body) => request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteProduct: (id) => request(`/products/${id}`, { method: 'DELETE' }),

  // orders
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
  deleteContact: (id) => request(`/contacts/${id}`, { method: 'DELETE' })
}
