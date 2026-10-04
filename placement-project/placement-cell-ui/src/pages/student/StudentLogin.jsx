import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginStudent } from '../../services/api'
import { storeStudentSession } from '../../services/studentSession'
import { Button } from '../../components/ui/Button'
import { Card, CardHeader } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'

export function StudentLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const student = await loginStudent(email.trim(), password)
      storeStudentSession(student)
      navigate('/student/compare', { replace: true })
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
          title="Student login"
          subtitle="Sign in with your registered college email"
        />
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
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
            placeholder="Enter your password"
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