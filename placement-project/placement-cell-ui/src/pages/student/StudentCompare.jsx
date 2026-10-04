import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchApprovedCompanies, normalizeCompany } from '../../services/api'
import { getStudentSession, clearStudentSession } from '../../services/studentSession'
import { evaluateJobEligibility } from '../../utils/eligibility'
import { EligibilityBreakdownCard } from '../../components/eligibility/EligibilityBreakdownCard'
import { Button } from '../../components/ui/Button'
import { Card, CardHeader } from '../../components/ui/Card'

export function StudentCompare() {
  const navigate = useNavigate()
  const student = getStudentSession()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchApprovedCompanies()
      .then((data) => setJobs((data || []).map(normalizeCompany)))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  function handleLogout() {
    clearStudentSession()
    navigate('/student/login', { replace: true })
  }

  if (!student) return null // StudentProtectedRoute handles the redirect

  const normalizedStudent = {
    name: student.studentName,
    email: student.email,
    cgpa: student.marks_ug ?? student.marks_pg ?? student.cgpa_12 ?? student.cgpa_10 ?? 0,
    branch: student.graduationBranch,
    skills: typeof student.skills === 'string'
      ? student.skills.split(/[,;]/).map((s) => s.trim()).filter(Boolean)
      : [],
  }

  const rows = jobs.map((job) => ({ job, ...evaluateJobEligibility(normalizedStudent, job) }))

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-slate-900">
            Welcome, {normalizedStudent.name}
          </h1>
          <p className="mt-1 text-slate-600">
            {normalizedStudent.branch} · CGPA {normalizedStudent.cgpa}
          </p>
        </div>
        <Button variant="secondary" onClick={handleLogout}>Logout</Button>
      </div>

      {loading && (
        <Card className="mt-8">
          <p className="text-center text-slate-500">Loading companies…</p>
        </Card>
      )}
      {!loading && error && (
        <Card className="mt-8 border-red-200 bg-red-50/50">
          <p className="text-center text-red-700">{error}</p>
        </Card>
      )}
      {!loading && !error && (
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {rows.map(({ job, ...evaluation }) => (
            <EligibilityBreakdownCard key={job.id} job={job} evaluation={evaluation} />
          ))}
          {rows.length === 0 && (
            <Card className="md:col-span-2">
              <p className="text-center text-slate-600">No open positions right now.</p>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}