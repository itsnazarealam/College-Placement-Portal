import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { MainLayout } from './components/layout/MainLayout'
import { Landing } from './pages/Landing'
import { Companies } from './pages/Companies'
import { EligibilityCheck } from './pages/EligibilityCheck'
import { CompanyRegister } from './pages/company/CompanyRegister'
import { CompanyDashboard } from './pages/company/CompanyDashboard'
import { StudentLogin } from './pages/student/StudentLogin'
import { StudentDashboard } from './pages/student/StudentDashboard'
import { AdminLogin } from './pages/admin/AdminLogin'
import { AdminLayout } from './pages/admin/AdminLayout'
import { AdminUpload } from './pages/admin/AdminUpload'
import { AdminCompanies } from './pages/admin/AdminCompanies'
import { AdminApprovals } from './pages/admin/AdminApprovals'
import { LoginHub } from './pages/LoginHub'
import { CompanyLogin } from './pages/company/CompanyLogin'
import { Navbar } from './components/layout/Navbar'
import { StudentCompare } from './pages/student/StudentCompare'
import { StudentProtectedRoute } from './components/StudentProtectedRoute'

export default function App() {
  return (
    <BrowserRouter>
    
      <AuthProvider>
        <Navbar/>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/eligibility" element={<EligibilityCheck />} />
            <Route path="/login" element={<LoginHub />} />
          </Route>

          <Route path="/student/login" element={<StudentLogin />} />
          <Route path="/login/student" element={<Navigate to="/student/login" replace />} />
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute roles={['STUDENT']}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="/company/login" element={<CompanyLogin />} />
          <Route path="/company/register" element={<CompanyRegister />} />
          <Route path="/company/dashboard" element={<ProtectedRoute roles={['COMPANY']}><CompanyDashboard /></ProtectedRoute>}/>

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/login/admin" element={<Navigate to="/admin/login" replace />} />
          <Route path="signup" element={<AdminUpload />} />
          <Route path="/admin" element={<ProtectedRoute roles={['ADMIN']}><AdminLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/admin/upload" replace />} />
            <Route path="upload" element={<AdminUpload />} />
            <Route path="companies" element={<AdminCompanies />} />
            

            <Route path="approvals" element={<AdminApprovals />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="/student/compare" element={
          <StudentProtectedRoute>
            <StudentCompare />
          </StudentProtectedRoute>
        }
/>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
