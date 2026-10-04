import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import * as authService from '../services/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        if (!authService.isAuthenticated()) {
          if (!cancelled) setUser(null)
        } else {
          const me = await authService.rehydrate()
          if (!cancelled) setUser(me)
        }
      } catch {
        authService.clearAuth()
        if (!cancelled) setUser(null)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const login = useCallback(async (email, password) => {
    const loggedIn = await authService.login(email, password)
    setUser(loggedIn)
    return loggedIn
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    authService.logout(true)
  }, [])

  const clearSession = useCallback(() => {
    setUser(null)
    authService.clearAuth()
  }, [])

  const value = useMemo(
    () => ({
      user,
      token: user?.token ?? authService.getToken(),
      login,
      logout,
      clearSession,
      loading,
      isAuthenticated: Boolean(user?.token || authService.getToken()),
    }),
    [user, login, logout, clearSession, loading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
