import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { dashboardPathForRole } from '../../services/auth'
import { Button } from '../../components/ui/Button'
import { Card, CardHeader } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'

export function CompanyLogin() {
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
      if (role !== 'COMPANY') {
        clearSession()
        setError('Access denied. Company role required.')
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
          title="Company login"
          subtitle="Sign in to manage your job postings"
        />
        <form noValidate onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeValue="Enter your email"
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
            {loading ? 'Signing in…' : 'Login'}
          </Button>
        </form>
      
        <Link to="/company/register" className="text-white hover:underline">
        <p className="mt-4 text-center flex items-center text-sm text-slate-400 hover:text-[#4000ff]">
          New recruiter?{' '}
            Register &amp; post a job
        </p>
        </Link>
        <Link
          to="/login"
          className="mt-2 block text-center text-sm text-slate-400 hover:text-[#4000ff]"
        >
          ← Back to login hub
        </Link>
      </Card>
    </div>
  )
}
