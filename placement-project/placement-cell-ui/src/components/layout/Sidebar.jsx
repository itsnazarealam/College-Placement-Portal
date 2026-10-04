import { NavLink } from 'react-router-dom'

export function Sidebar({ title, subtitle, items, onLogout, logoutLabel }) {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
      isActive
        ? 'bg-brand-600 text-white shadow-md shadow-brand-600/25'
        : 'text-slate-600 hover:bg-slate-100'
    }`

  return (
    <aside className="flex w-full flex-col border-b border-slate-200 bg-white lg:w-64 lg:border-b-0 lg:border-r lg:min-h-screen">
      <div className="border-b border-slate-100 p-4 lg:p-6">
        <p className="font-display text-sm font-semibold text-slate-900">
          {title}
        </p>
        {subtitle && (
          <p className="mt-0.5 truncate text-xs text-slate-500">{subtitle}</p>
        )}
      </div>
      <nav className="flex flex-row gap-1 overflow-x-auto p-2 lg:flex-col lg:p-3">
        {items.map((item) => (
          <NavLink key={item.to} to={item.to} className={linkClass} end={item.end}>
            <span className="whitespace-nowrap">{item.label}</span>
          </NavLink>
        ))}
      </nav>
      {onLogout && (
        <div className="mt-auto hidden border-t border-slate-100 p-3 lg:block">
          <button
            type="button"
            onClick={onLogout}
            className="w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50"
          >
            {logoutLabel || 'Sign out'}
          </button>
        </div>
      )}
    </aside>
  )
}
