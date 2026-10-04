export function Table({ children, className = '' }) {
  return (
    <div
      className={`overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm ${className}`}
    >
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        {children}
      </table>
    </div>
  )
}

export function Th({ children, className = '' }) {
  return (
    <th
      className={`bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 ${className}`}
    >
      {children}
    </th>
  )
}

export function Td({ children, className = '' }) {
  return (
    <td className={`whitespace-nowrap px-4 py-3 text-slate-800 ${className}`}>
      {children}
    </td>
  )
}
