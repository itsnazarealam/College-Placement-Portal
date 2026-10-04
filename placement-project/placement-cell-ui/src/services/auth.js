const TOKEN_KEY = 'token'
const USER_KEY = 'placement_user'

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
    
  }
}

export function isAuthenticated() {
  return Boolean(getToken())
}

function storeAuth({ token, role, username, userId, userMail }) {
  localStorage.setItem(TOKEN_KEY, token)
  const user = { token, role, username, userId, userMail }
  localStorage.setItem(USER_KEY, JSON.stringify(user))
  return user
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
  sessionStorage.removeItem('placement_admin')
  sessionStorage.removeItem('placement_student')
  sessionStorage.removeItem('placement_email')
  sessionStorage.removeItem('placement_student_email')
  sessionStorage.removeItem('placement_company')
  sessionStorage.removeItem('placement_role')
}

export async function login(userMail, userPassword) {
  const res = await fetch(`${BASE}/user/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userMail, userPassword }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.message ?? `HTTP ${res.status}`)
  }
  return storeAuth({
    token: data.token,
    role: data.role,
    username: data.username,
    userId: data.userId,
    userMail: data.userMail ?? userMail,
  })
}

export async function register(payload) {
  const res = await fetch(`${BASE}/user/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.message ?? `HTTP ${res.status}`)
  }
  return data
}

export function logout(redirect = true) {
  clearAuth()
  if (redirect && typeof window !== 'undefined') {
    window.location.href = '/login'
  }
}

/** Validate stored token and rehydrate user via GET /user/me */
export async function rehydrate() {
  const token = getToken()
  if (!token) return null

  const res = await fetch(`${BASE}/user/me`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (res.status === 401 || res.status === 403) {
    clearAuth()
    return null
  }
  if (!res.ok) {
    clearAuth()
    return null
  }
  const me = await res.json()
  return storeAuth({
    token,
    role: me.role,
    username: me.username,
    userId: me.userId,
    userMail: me.userMail,
  })
}

export function dashboardPathForRole(role) {
  const r = String(role || '').toUpperCase()
  if (r === 'ADMIN') return '/admin/upload'
  if (r === 'COMPANY') return '/company/dashboard'
  return '/student/dashboard'
}
