export const GOOGLE_SHEETS_URL =
  import.meta.env.VITE_GOOGLE_SCRIPT_URL ||
  'https://script.google.com/macros/s/AKfycbzm9JBn999NpW8SY3uP-wGedxqYXbnV5vSpDRUN7zrwUsg9HaB0BwG85ehcZO1f1ZJdfA/exec'

export function resolveImageUrl(path) {
  if (!path) return ''
  return path
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

  return { success: true, ...payload }
}

async function getFromGoogleScript(action) {
  const res = await fetch(`${GOOGLE_SHEETS_URL}?action=${action}`)
  const data = await res.json()

  if (!data.success) {
    throw new Error(data.message || 'Request failed.')
  }

  return data.items || []
}

export const api = {
  // Orders
  createOrder: (body) =>
    submitToGoogleScript({
      type: 'order',
      ...body
    }),

  listOrders: () => getFromGoogleScript('orders'),

  updateOrder: (id, body) =>
    submitToGoogleScript({
      type: 'updateOrder',
      id,
      ...body
    }),

  deleteOrder: (id) =>
    submitToGoogleScript({
      type: 'deleteOrder',
      id
    }),

  // Contact
  sendContact: (body) =>
    submitToGoogleScript({
      type: 'contact',
      ...body
    }),

  listContacts: () => getFromGoogleScript('contacts'),

  deleteContact: (id) =>
    submitToGoogleScript({
      type: 'deleteContact',
      id
    }),

  // Reviews
  listReviews: () => getFromGoogleScript('reviews'),

  createReview: (body) =>
    submitToGoogleScript({
      type: 'createReview',
      ...body
    }),

  updateReview: (id, body) =>
    submitToGoogleScript({
      type: 'updateReview',
      id,
      ...body
    }),

  deleteReview: (id) =>
    submitToGoogleScript({
      type: 'deleteReview',
      id
    }),

  // Gallery
  listGallery: () => getFromGoogleScript('gallery'),

  createGallery: (body) =>
    submitToGoogleScript({
      type: 'createGallery',
      ...body
    }),

  updateGallery: (id, body) =>
    submitToGoogleScript({
      type: 'updateGallery',
      id,
      ...body
    }),

  deleteGallery: (id) =>
    submitToGoogleScript({
      type: 'deleteGallery',
      id
    }),

  // These are no-ops now unless you rebuild analytics later
  trackVisit: () => Promise.resolve(),
  getAnalytics: () => Promise.resolve(null),
  getVercelAnalytics: () => Promise.resolve(null)

  //trackVisit: (page) => request('/track', { method: 'POST', body: JSON.stringify({ page }) }).catch(() => {}),
  //getAnalytics: (days = 30) => request(`/analytics/summary?days=${days}`),
  //getVercelAnalytics: () => request('/analytics/vercel')
}