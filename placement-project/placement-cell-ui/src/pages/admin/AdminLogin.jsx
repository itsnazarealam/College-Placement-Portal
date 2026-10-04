import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { dashboardPathForRole } from '../../services/auth'
import { Button } from '../../components/ui/Button'
import { Card, CardHeader } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'

export function AdminLogin() {
  const navigate = useNavigate()
  const { login, clearSession } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(email.trim(), password)
      const role = String(user.role || '').toUpperCase()
      if (role !== 'ADMIN') {
        clearSession()
        setError('Access denied. Admin role required.')
        return
      }
      navigate(dashboardPathForRole(role), { replace: true })
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4">
      <Card className="w-full max-w-md shadow-xl shadow-slate-900/40">
        <CardHeader
          title="Admin access"
          subtitle="Sign in with your registered admin account"
        />
        <form noValidate onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeValue="Enter your email"
            name="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setError('')
            }}
            required
          />
          <Input
            label="Password"
            type="password"
            name="password"
            placeValue="Enter your password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setError('')
            }}
            error={error}
            required
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing in…' : 'Enter dashboard'}
          </Button>
        </form>
        <Link
          to="/signup"
          className="mt-4 block text-center text-sm text-slate-400 hover:text-[#4000ff]"
        >
          ← Admin signup
        </Link>
        <Link
          to="/login"
          className="mt-4 block text-center text-sm text-slate-400 hover:text-[#4000ff]"
        >
          ← Back to login hub
        </Link>
      </Card>
    </div>
  )
}
