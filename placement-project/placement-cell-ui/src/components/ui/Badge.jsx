export function Badge({ children, variant = 'default', className = '' }) {
  const styles = {
    default: 'bg-slate-100 text-slate-700',
    success: 'bg-emerald-100 text-emerald-800',
    warning: 'bg-amber-100 text-amber-900',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-brand-100 text-brand-800',
  }
  return (
    <span
      className={`inline-flex items-center rounded-lg px-2.5 py-0.5 text-xs font-semibold ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
