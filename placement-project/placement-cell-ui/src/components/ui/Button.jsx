export function Button({
  children,
  type = 'button',
  variant = 'primary',
  className = '',
  disabled,
  ...props
}) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer'
  const variants = {
    primary:
      'bg-brand-600 text-white hover:bg-brand-700 focus-visible:ring-brand-500',
    /** For CTAs on dark hero / gradient sections */
    hero:
      'border-0 bg-white/10 text-white shadow-none ring-1 ring-white/30 hover:bg-white/15 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-900',
    secondary:
      'bg-white text-slate-800 ring-1 ring-slate-200 hover:bg-slate-50 focus-visible:ring-brand-500',
    danger:
      'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
    ghost: 'text-brand-700 hover:bg-brand-50 focus-visible:ring-brand-500',
  }
  return (
    <button
      type={type}
      disabled={disabled}
      className={`${base} ${variants[variant] ?? variants.primary} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
