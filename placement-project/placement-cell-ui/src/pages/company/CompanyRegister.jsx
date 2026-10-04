import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { Card, CardHeader } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { Textarea } from '../../components/ui/Textarea'
import { createCompany } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import * as authService from '../../services/auth'
import {
  parseSkillsInput,
  validateEmail,
  validateFutureDate,
  validateRequired,
} from '../../utils/validation'

const BRANCHES = ['CSE', 'IT', 'ECE', 'EEE', 'ME', 'CE', 'All']

export function CompanyRegister() {
  const navigate = useNavigate()
  const { user, login } = useAuth()
  const [form, setForm] = useState({
    companyName: '',
    contactEmail: '',
    password: '',
    jobRole: '',
    package: '',
    minCgpa: '',
    branch: 'CSE',
    skills: '',
    lastDate: '',
    description: '',
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [apiError, setApiError] = useState('')

  const alreadyCompany =
    user && String(user.role || '').toUpperCase() === 'COMPANY'

  function setField(name, value) {
    setForm((f) => ({ ...f, [name]: value }))
    setErrors((e) => ({ ...e, [name]: '' }))
    setApiError('')
  }

  function validate() {
    const e = {}
    e.companyName = validateRequired(form.companyName, 'Company name')
    e.contactEmail = validateEmail(form.contactEmail)
    if (!alreadyCompany) {
      e.password = validateRequired(form.password, 'Password')
    }
    e.jobRole = validateRequired(form.jobRole, 'Job role')
    e.package = validateRequired(form.package, 'Package')
    e.minCgpa = form.minCgpa === '' ? 'Minimum CGPA is required' : ''
    if (form.minCgpa !== '') {
      const n = Number(form.minCgpa)
      if (Number.isNaN(n) || n < 0 || n > 10)
        e.minCgpa = 'CGPA must be between 0 and 10'
    }
    e.skills = validateRequired(form.skills, 'Skills')
    e.lastDate = validateFutureDate(form.lastDate, 'Last date')
    setErrors(e)
    return !Object.values(e).some(Boolean)
  }

  async function ensureCompanySession() {
    if (alreadyCompany) return user
    try {
      await authService.register({
        username: form.companyName.trim(),
        userMail: form.contactEmail.trim(),
        userPassword: form.password,
        role: 'COMPANY',
      })
    } catch (err) {
      // Email may already exist — try login next
      if (!String(err.message || '').toLowerCase().includes('already')) {
        // still attempt login in case of race / existing account
      }
    }
    return login(form.contactEmail.trim(), form.password)
  }

  async function handleSubmit(ev) {
    ev.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    setApiError('')

    try {
      const session = await ensureCompanySession()
      if (String(session.role || '').toUpperCase() !== 'COMPANY') {
        setApiError('Logged-in account is not a COMPANY user.')
        return
      }

      const payload = {
        companyName: form.companyName.trim(),
        contactEmail: form.contactEmail.trim(),
        jobRole: form.jobRole.trim(),
        package: form.package.trim(),
        minCgpa: form.minCgpa,
        branches: form.branch === 'All' ? ['All'] : [form.branch],
        requiredSkills: parseSkillsInput(form.skills),
        lastDate: form.lastDate,
        description: form.description.trim(),
      }

      await createCompany(payload)
      navigate('/company/dashboard')
    } catch (err) {
      setApiError(err.message || 'Failed to submit. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4 sm:px-6">
          <Link to="/" className="text-sm font-medium text-brand-700 hover:underline">
            ← Back to home
          </Link>
          <Link to="/company/login" className="text-sm text-slate-600 hover:text-slate-900">
            Already registered? Login
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <Card>
          <CardHeader
            title="Company registration & job posting"
            subtitle={
              alreadyCompany
                ? 'Post a new opening. The placement cell will review before it appears publicly.'
                : 'Creates a COMPANY account and submits your first opening for review.'
            }
          />

          {apiError && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                label="Company name"
                name="companyName"
                value={form.companyName}
                onChange={(e) => setField('companyName', e.target.value)}
                error={errors.companyName}
              />
              <Input
                label="HR / contact email"
                name="contactEmail"
                type="email"
                value={form.contactEmail}
                onChange={(e) => setField('contactEmail', e.target.value)}
                error={errors.contactEmail}
              />
            </div>

            {!alreadyCompany && (
              <Input
                label="Account password"
                name="password"
                type="password"
                value={form.password}
                onChange={(e) => setField('password', e.target.value)}
                error={errors.password}
              />
            )}

            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                label="Job role"
                name="jobRole"
                value={form.jobRole}
                onChange={(e) => setField('jobRole', e.target.value)}
                error={errors.jobRole}
              />
              <Input
                label="Package (e.g. 18 LPA)"
                name="package"
                value={form.package}
                onChange={(e) => setField('package', e.target.value)}
                error={errors.package}
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                label="Minimum CGPA"
                name="minCgpa"
                type="number"
                step="0.01"
                min="0"
                max="10"
                value={form.minCgpa}
                onChange={(e) => setField('minCgpa', e.target.value)}
                error={errors.minCgpa}
              />
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Eligible branch
                </label>
                <select
                  name="branch"
                  value={form.branch}
                  onChange={(e) => setField('branch', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                >
                  {BRANCHES.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Textarea
              label="Required skills (comma-separated)"
              name="skills"
              placeholder="e.g. JavaScript, React, SQL"
              value={form.skills}
              onChange={(e) => setField('skills', e.target.value)}
              error={errors.skills}
            />

            <Input
              label="Last date to apply"
              name="lastDate"
              type="date"
              value={form.lastDate}
              onChange={(e) => setField('lastDate', e.target.value)}
              error={errors.lastDate}
            />

            <Textarea
              label="Job description (optional)"
              name="description"
              placeholder="Responsibilities, location, bond, etc."
              value={form.description}
              onChange={(e) => setField('description', e.target.value)}
            />

            <Button type="submit" className="w-full sm:w-auto" disabled={submitting}>
              {submitting ? 'Submitting…' : 'Post job opening'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}
