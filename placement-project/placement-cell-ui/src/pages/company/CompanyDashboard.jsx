import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card, CardHeader } from '../../components/ui/Card'
import { Table, Td, Th } from '../../components/ui/Table'
import { fetchCompaniesByName, normalizeCompany } from '../../services/api'

export function CompanyDashboard() {
  const { user, logout } = useAuth()
  const [companyName, setCompanyName] = useState('')
  const [myJobs, setMyJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const name = user?.username || ''
    setCompanyName(name)
    if (!name) {
      setLoading(false)
      setError('No company name on account. Re-register with a company name as username.')
      return
    }
    fetchCompaniesByName(name)
      .then((data) => setMyJobs((data || []).map(normalizeCompany)))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [user])

  return (
    <DashboardLayout
      sidebarProps={{
        title: 'Company portal',
        subtitle: companyName || user?.userMail,
        items: [
          { to: '/company/dashboard', label: 'Posted jobs', end: true },
          { to: '/company/register', label: 'New posting' },
          { to: '/companies', label: 'Public listings' },
        ],
        onLogout: logout,
        logoutLabel: 'Sign out',
      }}
    >
      <Card>
        <CardHeader
          title="Your job postings"
          subtitle="Status reflects placement cell review. Matched by company username."
          action={
            <Link to="/company/register">
              <Button type="button">Post another role</Button>
            </Link>
          }
        />

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading && !error && (
          <p className="text-sm text-slate-500">Loading your postings…</p>
        )}

        {!loading && !error && myJobs.length === 0 && (
          <p className="text-slate-600">
            No jobs yet.{' '}
            <Link to="/company/register" className="font-medium text-brand-700">
              Create your first posting
            </Link>
            .
          </p>
        )}

        {!loading && !error && myJobs.length > 0 && (
          <Table>
            <thead>
              <tr>
                <Th>Role</Th>
                <Th>Package</Th>
                <Th>Apply by</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {myJobs.map((j) => (
                <tr key={j.id}>
                  <Td className="font-medium text-slate-900">{j.role}</Td>
                  <Td>{j.package}</Td>
                  <Td>{j.lastDate}</Td>
                  <Td>
                    <Badge
                      variant={
                        j.status === 'approved'
                          ? 'success'
                          : j.status === 'pending'
                            ? 'warning'
                            : 'default'
                      }
                    >
                      {j.status === 'approved'
                        ? 'Approved'
                        : j.status === 'pending'
                          ? 'Pending review'
                          : j.status}
                    </Badge>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </DashboardLayout>
  )
}
