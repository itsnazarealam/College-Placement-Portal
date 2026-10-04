import { Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { DashboardLayout } from '../../components/layout/DashboardLayout'

export function AdminLayout() {
  const { logout, user } = useAuth()

  return (
    <DashboardLayout
      sidebarProps={{
        title: 'Admin',
        subtitle: user?.userMail || 'Placement office',
        items: [
          { to: '/admin/upload', label: 'Upload students', end: true },
          { to: '/admin/companies', label: 'Companies' },
          { to: '/admin/approvals', label: 'Job approvals' },
        ],
        onLogout: logout,
      }}
    >
      <Outlet />
    </DashboardLayout>
  )
}
