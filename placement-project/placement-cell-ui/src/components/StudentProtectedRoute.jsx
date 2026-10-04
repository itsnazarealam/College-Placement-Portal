import { Navigate } from 'react-router-dom'
import { isStudentAuthenticated } from '../services/studentSession'

export function StudentProtectedRoute({ children }) {
  if (!isStudentAuthenticated()) {
    return <Navigate to="/student/login" replace />
  }
  return children
}