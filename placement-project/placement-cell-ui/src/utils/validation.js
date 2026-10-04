import { COLLEGE_EMAIL_DOMAIN } from '../config/branding'

export function isCollegeEmail(email) {
  const e = String(email || '').trim().toLowerCase()
  const re = new RegExp(
    `^[a-z0-9._%+-]+@(student\\.)?${COLLEGE_EMAIL_DOMAIN.replace('.', '\\.')}$`,
    'i'
  )
  return re.test(e)
}

export function validateRequired(value, fieldName = 'This field') {
  const v = String(value ?? '').trim()
  if (!v) return `${fieldName} is required`
  return ''
}

export function validateEmail(email) {
  const v = String(email ?? '').trim()
  if (!v) return 'Email is required'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Enter a valid email'
  return ''
}

export function validateCollegeEmail(email) {
  const base = validateEmail(email)
  if (base) return base
  if (!isCollegeEmail(email)) {
    return `Use your college email (@${COLLEGE_EMAIL_DOMAIN} or @student.${COLLEGE_EMAIL_DOMAIN})`
  }
  return ''
}

export function validateCgpa(value) {
  const n = Number(value)
  if (value === '' || value == null) return 'CGPA is required'
  if (Number.isNaN(n) || n < 0 || n > 10)
    return 'CGPA must be a number between 0 and 10'
  return ''
}

export function validateFutureDate(value, fieldName = 'Date') {
  if (!value) return `${fieldName} is required`
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return 'Invalid date'
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  if (d < today) return `${fieldName} must be today or later`
  return ''
}

export function parseSkillsInput(text) {
  return String(text || '')
    .split(/[,;\n]/)
    .map((s) => s.trim())
    .filter(Boolean)
}
