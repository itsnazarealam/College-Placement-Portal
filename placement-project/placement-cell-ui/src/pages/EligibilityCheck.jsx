import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { COLLEGE_EMAIL_DOMAIN } from '../config/branding'
import { EligibilityBreakdownCard } from '../components/eligibility/EligibilityBreakdownCard'
import { Button } from '../components/ui/Button'
import { Card, CardHeader } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import {
  fetchApprovedCompanies,
  fetchMyStudent,
  fetchStudentByEmail,
  normalizeCompany,
  normalizeStudent,
} from '../services/api'
import {
  evaluateJobEligibility,
  getOpenApprovedJobs,
} from '../utils/eligibility'
import { validateCollegeEmail } from '../utils/validation'

export function EligibilityCheck() {
  const { user, isAuthenticated } = useAuth()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [jobs, setJobs] = useState([])
  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      try {
        const companies = await fetchApprovedCompanies()
        if (!cancelled) setJobs((companies || []).map(normalizeCompany))
        if (isAuthenticated && String(user?.role || '').toUpperCase() === 'STUDENT') {
          try {
            const me = await fetchMyStudent()
            if (!cancelled && me) {
              const norm = normalizeStudent(me)
              setStudent(norm)
              setEmail(norm.email || user?.userMail || '')
            }
          } catch {
            /* no student profile yet */
          }
        }
      } catch (err) {
        if (!cancelled) setLoadError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [isAuthenticated, user])

  const result = useMemo(() => {
    if (!submitted || error) return null
    const open = getOpenApprovedJobs(jobs)
    if (!student) {
      return { type: 'unknown', student: null, rows: [] }
    }
    const emailMatch =
      String(student.email || '').toLowerCase() ===
      String(email).trim().toLowerCase()
    if (!emailMatch) {
      return { type: 'unknown', student: null, rows: [] }
    }
    const rows = open.map((job) => ({
      job,
      ...evaluateJobEligibility(student, job),
    }))
    const anyEligible = rows.some((r) => r.eligible)
    return { type: 'known', student, rows, anyEligible }
  }, [submitted, error, email, student, jobs])

  async function handleSubmit(e) {
    e.preventDefault()
    const err = validateCollegeEmail(email)
    setError(err)
    setSubmitted(true)
    if (err) return

    setLoading(true)
    setLoadError('')
    try {
      const found = await fetchStudentByEmail(email.trim())
      setStudent(found ? normalizeStudent(found) : null)
    } catch (e) {
      setLoadError(e.message)
      setStudent(null)
    } finally {
      setLoading(false)
    }
  }

  const eligibilityResult = useMemo(() => {
    if (!submitted || error) return null
    const open = getOpenApprovedJobs(jobs)
    if (!student) return { type: 'unknown', student: null, rows: [] }
    const rows = open.map((job) => ({ job, ...evaluateJobEligibility(student, job) }))
    const anyEligible = rows.some((r) => r.eligible)
    return { type: 'known', student, rows, anyEligible }
  }, [submitted, error, student, jobs])

  
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold text-slate-900">
        Eligibility check
      </h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        Enter your college email to compare your CGPA, branch, and skills
        against published criteria. Use addresses ending with @{COLLEGE_EMAIL_DOMAIN}{' '}
        or @student.{COLLEGE_EMAIL_DOMAIN}. Sign in as a student so we can load
        your uploaded profile.
      </p>

      {loading && (
        <Card className="mx-auto mt-8 max-w-xl">
          <p className="text-center text-slate-500">Loading openings…</p>
        </Card>
      )}

      {loadError && (
        <Card className="mx-auto mt-8 max-w-xl border-red-200 bg-red-50/50">
          <p className="text-center text-red-700">{loadError}</p>
        </Card>
      )}

      {!loading && (
        <Card className="mx-auto mt-8 max-w-xl">
          <CardHeader
            title="Student email"
            subtitle="We match against records maintained by the placement office."
          />
          {!isAuthenticated && (
            <p className="mb-4 text-sm text-amber-800">
              <Link to="/student/login" className="font-medium text-brand-700">
                Sign in as a student
              </Link>{' '}
              to load your profile for eligibility checks.
            </p>
          )}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 sm:flex-row sm:items-end"
          >
            <div className="flex-1">
              <Input
                type="email"
                name="email"
                placeholder={`email@.${COLLEGE_EMAIL_DOMAIN}`}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setSubmitted(false)
                  setError('')
                }}
                error={submitted ? error : ''}
              />
            </div>
            <Button type="submit">Check eligibility</Button>
          </form>
        </Card>
      )}

      {submitted && !error && result?.type === 'unknown' && (
        <Card className="mx-auto mt-8 max-w-xl border-amber-200 bg-amber-50/50">
          <p className="text-center font-medium text-amber-900">
            No student record found for this email.
          </p>
          <p className="mt-2 text-center text-sm text-amber-800">
            Contact the placement cell or ask an administrator to upload your
            row, then sign in with the same email.
          </p>
        </Card>
      )}

      {submitted && !error && result?.type === 'known' && (
        <div className="mt-10 space-y-8">
          <Card
            className={
              result.anyEligible
                ? 'border-emerald-200 bg-emerald-50/40 ring-1 ring-emerald-200'
                : 'border-slate-200'
            }
          >
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <p className="text-sm font-medium text-slate-500">Result</p>
                <p className="mt-1 font-display text-2xl font-bold text-slate-900">
                  {result.anyEligible ? 'Eligible' : 'Not eligible'}{' '}
                  <span className="text-lg font-normal text-slate-600">
                    for current openings
                  </span>
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  {result.student.name} · {result.student.branch} · CGPA{' '}
                  {result.student.cgpa}
                </p>
              </div>
            </div>
          </Card>

          <div>
            <h2 className="font-display text-xl font-semibold text-slate-900">
              Eligible companies & roles
            </h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {result.rows
                .filter((r) => r.eligible)
                .map(({ job, ...evaluation }) => (
                  <EligibilityBreakdownCard
                    key={job.id}
                    job={job}
                    evaluation={evaluation}
                    compact
                  />
                ))}
              {result.rows.filter((r) => r.eligible).length === 0 && (
                <Card className="md:col-span-2">
                  <p className="text-center text-slate-600">
                    No matching openings. Review skill gaps below or check new
                    postings later.
                  </p>
                </Card>
              )}
            </div>
          </div>

          <div>
            <h2 className="font-display text-xl font-semibold text-slate-900">
              Criteria breakdown (all open roles)
            </h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {result.rows.map(({ job, ...evaluation }) => (
                <EligibilityBreakdownCard
                  key={job.id}
                  job={job}
                  evaluation={evaluation}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
