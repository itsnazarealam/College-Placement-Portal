import { Badge } from '../ui/Badge'
import { Card } from '../ui/Card'

function Row({ label, ok, detail }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-slate-100 py-2 last:border-0">
      <span className="text-sm text-slate-600">{label}</span>
      <div className="text-right">
        <Badge variant={ok ? 'success' : 'danger'}>{ok ? 'Pass' : 'Fail'}</Badge>
        {detail && (
          <p className="mt-1 max-w-[200px] text-xs text-slate-500 sm:max-w-xs">
            {detail}
          </p>
        )}
      </div>
    </div>
  )
}

export function EligibilityBreakdownCard({ job, evaluation, compact }) {
  const { cgpaOk, branchOk, skillsOk, missingSkills } = evaluation
  return (
    <Card
      className={`${compact ? 'p-4' : ''} ${evaluation.eligible ? 'ring-1 ring-emerald-200' : 'ring-1 ring-slate-200'}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-display font-semibold text-slate-900">
            {job.companyName}
          </p>
          <p className="text-sm text-slate-600">{job.role}</p>
        </div>
        <Badge variant={evaluation.eligible ? 'success' : 'warning'}>
          {evaluation.eligible ? 'Eligible' : 'Not eligible'}
        </Badge>
      </div>
      <div className="mt-3 text-xs text-slate-500">
        Package: <span className="font-medium text-slate-700">{job.package}</span>
        {' · '}
        Apply by: {job.lastDate}
      </div>
      <div className="mt-4">
        <Row
          label="CGPA vs minimum"
          ok={cgpaOk}
          detail={`Requires ≥ ${job.minCgpa}`}
        />
        <Row
          label="Branch"
          ok={branchOk}
          detail={
            Array.isArray(job.branches)
              ? `Allowed: ${job.branches.join(', ')}`
              : ''
          }
        />
        <Row
          label="Required skills"
          ok={skillsOk}
          detail={
            !skillsOk && missingSkills?.length
              ? `Missing: ${missingSkills.join(', ')}`
              : undefined
          }
        />
      </div>
    </Card>
  )
}
