import { Link } from 'react-router-dom'
import { Card, CardHeader } from '../components/ui/Card'

export function LoginHub() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-md space-y-4 flex flex-col">
        <h1 className="mb-8 text-center text-2xl font-bold text-white">
          Placement Portal
        </h1>

        <Link to="/admin/login">
          <Card className="cursor-pointer transition-all hover:border-blue-500">
            <CardHeader
              title="Admin"
              subtitle="Manage students, upload data, approve jobs"
            />
          </Card>
        </Link>

        <Link to="/student/login">
          <Card className="cursor-pointer transition-all hover:border-blue-500">
            <CardHeader
              title="Student"
              subtitle="View eligibility and apply to openings"
            />
          </Card>
        </Link>

        <Link to="/company/login">
          <Card className="cursor-pointer transition-all hover:border-blue-500">
            <CardHeader
              title="Company"
              subtitle="Sign in to post and track job openings"
            />
          </Card>
        </Link>
      </div>
    </div>
  )
}
