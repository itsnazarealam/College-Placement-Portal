import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { INSTITUTE_SHORT } from '../../config/branding'
import { useAuth } from '../../context/AuthContext'
import { dashboardPathForRole } from '../../services/auth'

const navLinkClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive
      ? 'bg-[#0f172b] text-white'
      : 'text-slate-300 hover:bg-[#0f172b] hover:text-white'
  }`

export function Navbar() {
  const [open, setOpen] = useState(false)
  const { user, logout, loading } = useAuth()
  const role = String(user?.role || '').toUpperCase()

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-background backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="font-display text-whiteBg text-lg font-bold tracking-tight "
        >
          {INSTITUTE_SHORT}{' '}
          <span className="text-brand-600">Placement</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/companies" className={navLinkClass}>
            Companies
          </NavLink>
          <NavLink to="/eligibility" className={navLinkClass}>
            Eligibility Check
          </NavLink>
          {!loading && user && (
            <NavLink to={dashboardPathForRole(role)} className={navLinkClass}>
              Dashboard
            </NavLink>
          )}
          {!loading && user ? (
            <button
              type="button"
              onClick={logout}
              className="rounded-lg px-3 py-2 text-sm font-medium cursor-pointer text-red-600 hover:bg-red-50"
            >
              Logout
            </button>
          ) : (
            <NavLink to="/login" className={navLinkClass}>
              Login
            </NavLink>
          )}
        </nav>

        <button
          type="button"
          className="inline-flex rounded-lg p-2 text-slate-700 md:hidden"
          aria-expanded={open}
          aria-label="Toggle menu"
          onClick={() => setOpen((o) => !o)}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {open ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-100 bg-white px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            <NavLink to="/" end className={navLinkClass} onClick={() => setOpen(false)}>
              Home
            </NavLink>
            <NavLink
              to="/companies"
              className={navLinkClass}
              onClick={() => setOpen(false)}
            >
              Companies
            </NavLink>
            <NavLink
              to="/eligibility"
              className={navLinkClass}
              onClick={() => setOpen(false)}
            >
              Eligibility Check
            </NavLink>
            {!loading && user && (
              <NavLink
                to={dashboardPathForRole(role)}
                className={navLinkClass}
                onClick={() => setOpen(false)}
              >
                Dashboard
              </NavLink>
            )}
            {!loading && user ? (
              <button
                type="button"
                onClick={() => {
                  setOpen(false)
                  logout()
                }}
                className="rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50"
              >
                Logout
              </button>
            ) : (
              <NavLink
                to="/login"
                className={navLinkClass}
                onClick={() => setOpen(false)}
              >
                Login
              </NavLink>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
