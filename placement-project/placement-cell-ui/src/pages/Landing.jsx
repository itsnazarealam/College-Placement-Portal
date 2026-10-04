import { Link } from 'react-router-dom'
import { INSTITUTE_NAME } from '../config/branding'
import { placementStats } from '../data/dummyData'
import { Button } from '../components/ui/Button'
import AboutDeveloper from '../components/AboutDeveloper'
import aboutDev from '../components/aboutDev'
import Banner from '../components/Banner'

const stats = [
  { label: 'Offers secured', value: placementStats.offers.toLocaleString() },
  { label: 'Recruiting partners', value: placementStats.companies },
  { label: 'Highest package', value: placementStats.highestPackage },
  { label: 'Average package', value: placementStats.averagePackage },
]

export function Landing() {
  return (
    <div>
      <section className="relative overflow-hidden bg-[#0f172b] text-white">
        <div className="pointer-events-none absolute inset-0 opacity-30">
          <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-brand-500 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-indigo-500 blur-3xl" />
        </div>
       
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <p className="text-sm font-medium uppercase tracking-widest text-brand-200">
           BHARATI VIDYAPEETH'S INSTITUTE OF COMPUTER APPLICATIONS AND MANAGEMENT
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            Your career journey, supported by the Placement Cell
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-brand-100/90">
            We connect students with leading companies through structured drives,
            eligibility screening, and transparent communication — all in one
            portal.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/eligibility">
              <Button variant="hero">Check eligibility</Button>
            </Link>
            <Link to="/companies">
              <Button variant="hero">View companies</Button>
            </Link>
          </div>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/15 backdrop-blur-sm"
              >
                <p className="text-2xl font-bold tracking-tight sm:text-3xl">
                  {s.value}
                </p>
                <p className="mt-1 text-sm text-brand-100">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
          
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="font-display text-2xl font-semibold text-slate-900 sm:text-3xl">
              About the Placement Cell
            </h2>
            <p className="mt-4 text-slate-600 leading-relaxed">
              The Training and Placement Office coordinates campus recruitment,
              skill development workshops, and policy compliance. Students can
              verify eligibility against live job criteria, while companies post
              openings that are reviewed before publication.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-slate-700">
              <li className="flex gap-2">
                <span className="text-brand-600">✓</span>
                Centralized job postings and approval workflow
              </li>
              <li className="flex gap-2">
                <span className="text-brand-600">✓</span>
                CGPA, branch, and skill-based eligibility matching
              </li>
              <li className="flex gap-2">
                <span className="text-brand-600">✓</span>
                Student records import for accurate shortlisting
              </li>
            </ul>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60">
            <h3 className="font-display font-semibold text-slate-900">
              For students & recruiters
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Sign in to the appropriate portal to access dashboards tailored to
              your role.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link to="/student/login" className="flex-1">
                <Button className="w-full">Student login</Button>
              </Link>
              <Link to="/company/register" className="flex-1">
                <Button variant="secondary" className="w-full">
                  Company registration
                </Button>
              </Link>
            </div>
          </div>
        </div>  
      </section>
      <Banner />
      <AboutDeveloper />
    </div>
  )
}
