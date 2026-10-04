import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { EligibilityBreakdownCard } from '../../components/eligibility/EligibilityBreakdownCard'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { Button } from '../../components/ui/Button'
import { Card, CardHeader } from '../../components/ui/Card'
import {
  fetchApprovedCompanies,
  fetchJobs,
  fetchMyStudent,
  normalizeCompany,
  normalizeJob,
  normalizeStudent,
  submitApplications,
} from '../../services/api'
import {
  evaluateJobEligibility,
  getOpenApprovedJobs,
} from '../../utils/eligibility'

export function StudentDashboard() {
  const { user, logout } = useAuth()
  const [student, setStudent] = useState(null)
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [applyMsg, setApplyMsg] = useState('')
  const [applyError, setApplyError] = useState('')
  const [applyingId, setApplyingId] = useState(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      setError('')
      try {
        const [me, companies, jobRows] = await Promise.all([
          fetchMyStudent().catch(() => null),
          fetchApprovedCompanies().catch(() => []),
          fetchJobs().catch(() => []),
        ])
        if (cancelled) return
        setStudent(me ? normalizeStudent(me) : null)
        const fromCompanies = (companies || []).map(normalizeCompany)
        const fromJobs = (jobRows || []).map(normalizeJob)
        // Prefer company board (approved postings); merge Job table as extras
        const byKey = new Map()
        for (const j of [...fromCompanies, ...fromJobs]) {
          byKey.set(String(j.id), j)
        }
        setJobs(Array.from(byKey.values()))
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const open = useMemo(() => getOpenApprovedJobs(jobs), [jobs])
  const rows = useMemo(() => {
    if (!student) return []
    return open.map((job) => ({
      job,
      ...evaluateJobEligibility(student, job),
    }))
  }, [student, open])

  const anyEligible = rows.some((r) => r.eligible)

  async function handleApply(job) {
    if (!student?.enrollNo) return
    setApplyMsg('')
    setApplyError('')
    setApplyingId(job.id)
    try {
      await submitApplications([
        {
          jobId: String(job.id),
          studentId: String(student.enrollNo),
          status: 'APPLIED',
        },
      ])
      setApplyMsg(`Applied to ${job.companyName} — ${job.role}`)
    } catch (err) {
      setApplyError(err.message)
    } finally {
      setApplyingId(null)
    }
  }

  return (
    <DashboardLayout
      sidebarProps={{
        title: 'Student portal',
        subtitle: user?.userMail,
        items: [
          { to: '/student/dashboard', label: 'Eligibility', end: true },
          { to: '/companies', label: 'Companies' },
          { to: '/eligibility', label: 'Public check' },
        ],
        onLogout: logout,
      }}
    >
      {loading && (
        <Card className="mb-8">
          <p className="text-slate-600">Loading your profile and openings…</p>
        </Card>
      )}

      {!loading && error && (
        <Card className="mb-8 border-red-200 bg-red-50/50">
          <p className="font-medium text-red-700">{error}</p>
        </Card>
      )}

      {!loading && !error && !student && (
        <Card className="mb-8 border-amber-200 bg-amber-50/50">
          <p className="font-medium text-amber-900">Student profile not found.</p>
          <p className="mt-1 text-sm text-amber-800">
            Your login email ({user?.userMail}) has no matching student record.
            Ask the admin to upload your details (email must match).
          </p>
        </Card>
      )}

      {applyMsg && (
        <p className="mb-4 text-sm font-medium text-emerald-700">{applyMsg}</p>
      )}
      {applyError && (
        <p className="mb-4 text-sm text-red-600">{applyError}</p>
      )}

      {!loading && student && (
        <>
          <Card
            className={`mb-8 ${
              anyEligible
                ? 'border-emerald-200 bg-emerald-50/40 ring-1 ring-emerald-200'
                : ''
            }`}
          >
            <CardHeader
              title="Result"
              subtitle={`${student.name} · ${student.branch} · CGPA ${student.cgpa}`}
            />
            <p className="font-display text-2xl font-bold text-slate-900">
              {anyEligible ? 'Eligible' : 'Not eligible'}
              <span className="text-lg font-normal text-slate-600">
                {' '}
                for current openings
              </span>
            </p>
          </Card>

          <div className="mb-6">
            <h2 className="font-display text-xl font-semibold text-slate-900">
              Eligible companies
            </h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {rows
                .filter((r) => r.eligible)
                .map(({ job, ...evaluation }) => (
                  <div key={job.id} className="space-y-2">
                    <EligibilityBreakdownCard
                      job={job}
                      evaluation={evaluation}
                      compact
                    />
                    <Button
                      type="button"
                      className="w-full"
                      disabled={applyingId === job.id}
                      onClick={() => handleApply(job)}
                    >
                      {applyingId === job.id ? 'Applying…' : 'Apply'}
                    </Button>
                  </div>
                ))}
              {rows.filter((r) => r.eligible).length === 0 && (
                <Card className="md:col-span-2">
                  <p className="text-slate-600">
                    No eligible openings right now. See full breakdown below.
                  </p>
                </Card>
              )}
            </div>
          </div>

          <div>
            <h2 className="font-display text-xl font-semibold text-slate-900">
              Full criteria comparison
            </h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {rows.map(({ job, ...evaluation }) => (
                <EligibilityBreakdownCard
                  key={job.id}
                  job={job}
                  evaluation={evaluation}
                />
              ))}
              {rows.length === 0 && (
                <Card className="md:col-span-2">
                  <p className="text-slate-600">
                    No approved openings yet.{' '}
                    <Link to="/companies" className="text-brand-700">
                      Browse companies
                    </Link>
                    .
                  </p>
                </Card>
              )}
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  )
}
