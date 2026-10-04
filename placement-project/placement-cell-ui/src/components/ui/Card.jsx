export function Card({ children, className = '' }) {
  return (
    <div
      className={`rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-200/50 ${className}`}
    >
      {children}
    </div>
  )
}

export function CardHeader({ title, subtitle, action }) {
  return (
    <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h2 className="font-display text-lg font-semibold text-slate-900">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-0.5 text-sm text-slate-600">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  )
}
