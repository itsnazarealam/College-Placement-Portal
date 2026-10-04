const STUDENT_SESSION_KEY = 'placement_student_session'
const SESSION_DURATION_MS = 5 * 60 * 1000 // 5 minutes

export function storeStudentSession(student) {
  const session = {
    student,
    expiresAt: Date.now() + SESSION_DURATION_MS,
  }
  localStorage.setItem(STUDENT_SESSION_KEY, JSON.stringify(session))
  return student
}

export function getStudentSession() {
  try {
    const raw = localStorage.getItem(STUDENT_SESSION_KEY)
    if (!raw) return null
    const session = JSON.parse(raw)
    if (!session.expiresAt || Date.now() > session.expiresAt) {
      localStorage.removeItem(STUDENT_SESSION_KEY)
      return null
    }
    return session.student
  } catch {
    return null
  }
}

export function clearStudentSession() {
  localStorage.removeItem(STUDENT_SESSION_KEY)
}

export function isStudentAuthenticated() {
  return Boolean(getStudentSession())
}