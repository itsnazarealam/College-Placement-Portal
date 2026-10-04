import { useEffect, useState } from 'react'
import { fetchApprovedCompanies, normalizeCompany } from '../services/api'
import { Badge } from '../components/ui/Badge'
import { Card, CardHeader } from '../components/ui/Card'

const PAGE_SIZE = 10

export function Companies() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    fetchApprovedCompanies()
      .then((data) => setJobs((data || []).map(normalizeCompany)))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  function removeZeroes(value) {
    let val = String(value)
    let val2 = val.split('0')[0]
    return val2.split('lpa')[0]
  }

  const totalPages = Math.max(1, Math.ceil(jobs.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const startIdx = (currentPage - 1) * PAGE_SIZE
  const visibleJobs = jobs.slice(startIdx, startIdx + PAGE_SIZE)

  function goToPage(p) {
    const clamped = Math.min(Math.max(p, 1), totalPages)
    setPage(clamped)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <h1 className="font-display text-3xl font-bold text-slate-900">
          Active recruiters
        </h1>
        <p className="mt-2 text-slate-600">
          Approved openings currently accepting applications through the
          placement cell.
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {loading && (
          <Card className="md:col-span-2">
            <p className="text-center text-slate-500">Loading companies…</p>
          </Card>
        )}
        {!loading && error && (
          <Card className="md:col-span-2 border-red-200 bg-red-50/50">
            <p className="text-center font-medium text-red-700">
              API Error (backend not available): {error}
            </p>
          </Card>
        )}
        {!loading && !error && jobs.length === 0 && (
          <Card className="md:col-span-2">
            <p className="text-center text-slate-600">
              No open positions right now. Check back soon.
            </p>
          </Card>
        )}
        {!loading &&
          !error &&
          visibleJobs.map((job) => (
            <Card key={job.id}>
              <CardHeader
                title={job.companyName}
                subtitle={job.role}
                action={<Badge variant="info">{removeZeroes(job.package) + " lpa"}</Badge>}
              />
              <dl className="grid gap-2 text-sm text-slate-600">
                <div>
                  <dt className="font-medium text-slate-700">Eligibility</dt>
                  <dd className="mt-0.5">
                    Min CGPA {job.minCgpa} ·{' '}
                    {job.branches?.includes('All')
                      ? 'All branches'
                      : (job.branches || []).join(', ')}
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-700">Skills</dt>
                  <dd className="mt-0.5">
                    {(job.requiredSkills || []).join(', ')}
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-700">Apply by</dt>
                  <dd className="mt-0.5">{job.lastDate}</dd>
                </div>
              </dl>
              {job.description && (
                <p className="mt-4 border-t border-slate-100 pt-4 text-sm leading-relaxed text-slate-600">
                  {job.description}
                </p>
              )}
            </Card>
          ))}
      </div>

      {!loading && !error && jobs.length > PAGE_SIZE && (
        <div className="mt-10 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer disabled:opacity-40"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => goToPage(p)}
              className={`h-9 w-9 rounded-lg text-sm font-medium cursor-pointer ${
                p === currentPage
                  ? 'bg-brand-600 text-white'
                  : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {p}
            </button>
          ))}

          <button
            type="button"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer  disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}