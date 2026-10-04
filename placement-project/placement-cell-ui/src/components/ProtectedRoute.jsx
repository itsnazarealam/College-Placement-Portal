import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Card } from './ui/Card'

export function ProtectedRoute({ children, roles }) {
  const { user, loading, isAuthenticated } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Card>
          <p className="text-sm text-slate-600">Checking session…</p>
        </Card>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (roles?.length) {
    const role = String(user.role || '').toUpperCase()
    const allowed = roles.map((r) => String(r).toUpperCase())
    if (!allowed.includes(role)) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
          <Card className="max-w-md text-center">
            <h1 className="font-display text-xl font-bold text-slate-900">
              Not authorized
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Your account ({role || 'unknown'}) cannot access this area.
            </p>
            <a
              href="/"
              className="mt-4 inline-block text-sm font-medium text-brand-700 hover:underline"
            >
              Back to home
            </a>
          </Card>
        </div>
      )
    }
  }

  return children
}
