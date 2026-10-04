import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'

export function DashboardLayout({ sidebarProps, children }) {
  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <Sidebar {...sidebarProps} />
      <div className="flex-1 overflow-auto">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children ?? <Outlet />}
        </div>
      </div>
    </div>
  )
}
