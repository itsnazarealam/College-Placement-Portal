export function Textarea({
  label,
  error,
  id,
  className = '',
  wrapperClassName = '',
  ...props
}) {
  const inputId = id || props.name
  return (
    <div className={wrapperClassName}>
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        className={`min-h-[120px] w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${
          error ? 'border-red-400' : 'border-slate-200'
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
}
