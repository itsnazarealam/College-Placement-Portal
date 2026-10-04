import { Link } from 'react-router-dom'
import { Card, CardHeader } from '../components/ui/Card'

const portals = [
  {
    title: 'Student',
    desc: 'College email login, eligibility, and eligible openings.',
    to: '/student/login',
    cta: 'Student portal',
  },
  {
    title: 'Company',
    desc: 'Register and post job openings for placement review.',
    to: '/company/register',
    cta: 'Company portal',
  },
  {
    title: 'Admin',
    desc: 'Upload student data, manage companies, approve jobs.',
    to: '/admin/login',
    cta: 'Admin portal',
  },
]

export function Login() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-center font-display text-3xl font-bold text-slate-900">
        Portal login
      </h1>
      <p className="mx-auto mt-2 max-w-xl text-center text-slate-600">
        Choose your role to continue. This demo runs entirely in your browser.
      </p>
      <div className="">
        {portals.map((p) => (
          <Card key={p.title} >
            <CardHeader title={p.title} subtitle={p.desc} />
            <Link
              to={p.to}
              className=" inline-flex items-center justify-center rounded-xl bg-brand-600 px-4 py-2.5 mt-4 text-sm font-semibold text-white hover:bg-brand-700"
            >
              {p.cta}
            </Link>
          </Card>
        ))}
      </div>
    </div>
  )
}
