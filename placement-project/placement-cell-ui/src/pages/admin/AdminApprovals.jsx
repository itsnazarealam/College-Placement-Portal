import { useEffect, useMemo, useState } from 'react'
import {
  approveCompany,
  deleteCompany,
  fetchAllCompanies,
  normalizeCompany,
} from '../../services/api'
import { Button } from '../../components/ui/Button'
import { Card, CardHeader } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Table, Td, Th } from '../../components/ui/Table'

export function AdminApprovals() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')
  const [busyId, setBusyId] = useState(null)

  async function load() {
    setLoading(true)
    setError('')
    try {
      const data = await fetchAllCompanies()
      setJobs((data || []).map(normalizeCompany))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const pending = useMemo(
    () => jobs.filter((j) => j.status === 'pending'),
    [jobs]
  )
  const approved = useMemo(
    () => jobs.filter((j) => j.status === 'approved'),
    [jobs]
  )

  async function handleApprove(id) {
    setActionError('')
    setBusyId(id)
    try {
      const updated = await approveCompany(id)
      const norm = normalizeCompany(updated)
      setJobs((prev) => prev.map((j) => (j.id === id ? norm : j)))
    } catch (err) {
      setActionError(err.message)
    } finally {
      setBusyId(null)
    }
  }

  async function handleReject(id) {
    setActionError('')
    setBusyId(id)
    try {
      await deleteCompany(id)
      setJobs((prev) => prev.filter((j) => j.id !== id))
    } catch (err) {
      setActionError(err.message)
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="space-y-8">
      {actionError && (
        <p className="text-sm text-red-600">{actionError}</p>
      )}
      <Card>
        <CardHeader
          title="Pending job postings"
          subtitle="Approve to publish on the Companies page and include in eligibility checks."
        />
        {loading && <p className="text-slate-600">Loading…</p>}
        {!loading && error && (
          <p className="text-sm text-red-600">Error: {error}</p>
        )}
        {!loading && !error && pending.length === 0 ? (
          <p className="text-slate-600">No pending postings.</p>
        ) : null}
        {!loading && !error && pending.length > 0 && (
          <Table>
            <thead>
              <tr>
                <Th>Company</Th>
                <Th>Role</Th>
                <Th>Package</Th>
                <Th>Apply by</Th>
                <Th className="text-right">Actions</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pending.map((j) => (
                <tr key={j.id}>
                  <Td className="font-medium">{j.companyName}</Td>
                  <Td>{j.role}</Td>
                  <Td>{j.package}</Td>
                  <Td>{j.lastDate}</Td>
                  <Td className="text-right">
                    <Button
                      type="button"
                      className="mr-2 py-1.5 text-xs"
                      disabled={busyId === j.id}
                      onClick={() => handleApprove(j.id)}
                    >
                      Approve
                    </Button>
                    <Button
                      type="button"
                      variant="danger"
                      className="py-1.5 text-xs"
                      disabled={busyId === j.id}
                      onClick={() => handleReject(j.id)}
                    >
                      Reject
                    </Button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>

      <Card>
        <CardHeader title="Approved postings" subtitle="Live on the public board." />
        <Table>
          <thead>
            <tr>
              <Th>Company</Th>
              <Th>Role</Th>
              <Th>Package</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {approved.map((j) => (
              <tr key={j.id}>
                <Td className="font-medium">{j.companyName}</Td>
                <Td>{j.role}</Td>
                <Td>{j.package}</Td>
                <Td>
                  <Badge variant="success">Approved</Badge>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  )
}
