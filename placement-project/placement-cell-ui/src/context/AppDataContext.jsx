import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import {
  initialCompanies,
  initialJobs,
  initialStudents,
} from '../data/dummyData'

const STORAGE_KEY = 'placement-cell-app-v3'

function loadPersisted() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const p = JSON.parse(raw)
    if (p && Array.isArray(p.students) && Array.isArray(p.jobs))
      return {
        students: p.students,
        jobs: p.jobs,
        companies: Array.isArray(p.companies) ? p.companies : initialCompanies,
      }
  } catch {
    /* ignore */
  }
  return null
}

const AppDataContext = createContext(null)

export function AppDataProvider({ children }) {
  const persisted = loadPersisted()
  const [students, setStudents] = useState(
    () => persisted?.students ?? initialStudents
  )
  const [jobs, setJobs] = useState(() => persisted?.jobs ?? initialJobs)
  const [companies, setCompanies] = useState(
    () => persisted?.companies ?? initialCompanies
  )

  const persist = useCallback((nextStudents, nextJobs, nextCompanies) => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        students: nextStudents,
        jobs: nextJobs,
        companies: nextCompanies,
      })
    )
  }, [])

  const addStudents = useCallback(
    (rows) => {
      setStudents((prev) => {
        const byEmail = new Map(prev.map((s) => [s.email.toLowerCase(), s]))
        for (const row of rows) {
          const email = String(row.email || '').toLowerCase()
          if (!email) continue
          const id =
            byEmail.get(email)?.id ??
            `u-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
          byEmail.set(email, {
            id,
            name: row.name || 'Unknown',
            email: row.email,
            branch: row.branch || '',
            cgpa: Number(row.cgpa) || 0,
            batch: String(row.batch || ''),
            skills: Array.isArray(row.skills) ? row.skills : [],
          })
        }
        const next = Array.from(byEmail.values())
        persist(next, jobs, companies)
        return next
      })
    },
    [jobs, companies, persist]
  )

  const addJob = useCallback(
    (job) => {
      setJobs((prev) => {
        const id = `j-${Date.now()}`
        const next = [
          ...prev,
          {
            ...job,
            id,
            status: 'pending',
            createdAt: new Date().toISOString().slice(0, 10),
          },
        ]
        persist(students, next, companies)
        return next
      })
    },
    [students, companies, persist]
  )

  const approveJob = useCallback(
    (jobId) => {
      setJobs((prev) => {
        const next = prev.map((j) =>
          j.id === jobId ? { ...j, status: 'approved' } : j
        )
        persist(students, next, companies)
        return next
      })
    },
    [students, companies, persist]
  )

  const rejectJob = useCallback(
    (jobId) => {
      setJobs((prev) => {
        const next = prev.filter((j) => j.id !== jobId)
        persist(students, next, companies)
        return next
      })
    },
    [students, companies, persist]
  )

  const upsertCompany = useCallback(
    (company) => {
      setCompanies((prev) => {
        let idx = -1
        if (company.id)
          idx = prev.findIndex((c) => c.id === company.id)
        if (idx < 0)
          idx = prev.findIndex(
            (c) => c.email.toLowerCase() === company.email.toLowerCase()
          )
        let next
        if (idx >= 0) {
          next = [...prev]
          next[idx] = { ...next[idx], ...company }
        } else {
          next = [
            ...prev,
            {
              ...company,
              id: `co-${Date.now()}`,
            },
          ]
        }
        persist(students, jobs, next)
        return next
      })
    },
    [students, jobs, persist]
  )

  const deleteCompany = useCallback(
    (id) => {
      setCompanies((prev) => {
        const next = prev.filter((c) => c.id !== id)
        persist(students, jobs, next)
        return next
      })
    },
    [students, jobs, persist]
  )

  const resetDemoData = useCallback(() => {
    setStudents(initialStudents)
    setJobs(initialJobs)
    setCompanies(initialCompanies)
    persist(initialStudents, initialJobs, initialCompanies)
  }, [persist])

  const value = useMemo(
    () => ({
      students,
      jobs,
      companies,
      addStudents,
      addJob,
      approveJob,
      rejectJob,
      upsertCompany,
      deleteCompany,
      resetDemoData,
    }),
    [
      students,
      jobs,
      companies,
      addStudents,
      addJob,
      approveJob,
      rejectJob,
      upsertCompany,
      deleteCompany,
      resetDemoData,
    ]
  )

  return (
    <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
  )
}

export function useAppData() {
  const ctx = useContext(AppDataContext)
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider')
  return ctx
}
