import { useEffect, useState } from 'react'
import * as XLSX from 'xlsx'
import {
  bulkInsertStudents,
  fetchStudents,
  normalizeStudent,
} from '../../services/api'
import { Button } from '../../components/ui/Button'
import { Card, CardHeader } from '../../components/ui/Card'
import { Table, Td, Th } from '../../components/ui/Table'

const PAGE_SIZE = 10

function normalizeRow(raw) {
  const keys = Object.keys(raw || {})
  const lower = keys.reduce((acc, k) => {
    acc[String(k).toLowerCase().trim()] = raw[k]
    return acc
  }, {})
  const name = lower.name ?? lower['student name'] ?? lower.fullname ?? ''
  const email = lower.email ?? lower['college email'] ?? ''
  const mobile = lower.mobile ?? lower.phone ?? lower['phone number'] ?? ''
  const enrollNo =
    lower.enrollno ??
    lower['enroll no'] ??
    lower.enrollment ??
    lower.id ??
    ''
  const cgpa = lower.cgpa ?? lower.gpa ?? lower['cgpa / gpa'] ?? lower.marks_ug ?? ''
  const batch = lower.batch ?? lower.year ?? lower.degree ?? ''
  const branch = lower.branch ?? lower.graduationbranch ?? ''
  let skills = lower.skills ?? lower.skill ?? ''
  if (typeof skills === 'string') {
    skills = skills
      .split(/[,;]/)
      .map((s) => s.trim())
      .filter(Boolean)
  }
  if (!Array.isArray(skills)) skills = []
  return {
    enrollNo: String(enrollNo || email || `ENR-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`).trim(),
    studentName: String(name).trim(),
    email: String(email).trim(),
    mobile: mobile ? Number(String(mobile).replace(/\D/g, '')) || null : null,
    marks_ug: Number(cgpa) || 0,
    graduationDegree: String(batch).trim(),
    graduationBranch: String(branch).trim(),
    skills: skills.join(', '),
  }
}

export function AdminUpload() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [page, setPage] = useState(1)

  async function loadStudents() {
    setLoading(true)
    setError('')
    try {
      const data = await fetchStudents()
      setStudents((data || []).map(normalizeStudent))
      setPage(1)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStudents()
  }, [])

  function handleFile(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setError('')
    setMessage('')
    const reader = new FileReader()
    reader.onload = async (ev) => {
      try {
        const data = new Uint8Array(ev.target?.result)
        const wb = XLSX.read(data, { type: 'array' })
        const sheet = wb.Sheets[wb.SheetNames[0]]
        const json = XLSX.utils.sheet_to_json(sheet)
        const rows = json.map(normalizeRow).filter((r) => r.email)
        if (!rows.length) {
          setError(
            'No rows with an Email column found. Use headers: EnrollNo, Name, Email, Mobile, CGPA, Branch, Skills.'
          )
          return
        }
        setUploading(true)
        await bulkInsertStudents(rows)
        setMessage(`Imported ${rows.length} row(s) to the server.`)
        await loadStudents()
      } catch (err) {
        setError(err.message || 'Could not read/upload the file. Use .xlsx or .xls.')
      } finally {
        setUploading(false)
      }
    }
    reader.readAsArrayBuffer(file)
  }

  const totalPages = Math.max(1, Math.ceil(students.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const startIdx = (currentPage - 1) * PAGE_SIZE
  const visibleStudents = students.slice(startIdx, startIdx + PAGE_SIZE)

  function goToPage(p) {
    const clamped = Math.min(Math.max(p, 1), totalPages)
    setPage(clamped)
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader
          title="Upload student Excel"
          subtitle="Expected columns: EnrollNo, Name, Email, Mobile, CGPA, Branch, Skills (comma-separated). Header names are matched case-insensitively."
        />
        <div className="flex flex-wrap items-center gap-3">
          <label className="inline-flex cursor-pointer">
            <input
              type="file"
              accept=".xlsx,.xls"
              className="sr-only"
              onChange={handleFile}
              disabled={uploading}
            />
            <span className="inline-flex rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">
              {uploading ? 'Uploading…' : 'Choose Excel file'}
            </span>
          </label>
          <Button type="button" variant="secondary" className='cursor-pointer' onClick={loadStudents}>
            Refresh
          </Button>
        </div>
        {message && (
          <p className="mt-4 text-sm font-medium text-emerald-700">{message}</p>
        )}
        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      </Card>

      <Card>
        <CardHeader
          title="Student records"
          subtitle={
            loading
              ? 'Loading…'
              : `${students.length} students in the database`
          }
        />
        {!loading && students.length === 0 && (
          <p className="text-sm text-slate-500">No students yet.</p>
        )}
        {!loading && students.length > 0 && (
          <>
            <Table>
              <thead>
                <tr>
                  <Th>Enroll No</Th>
                  <Th>Name</Th>
                  <Th>Email</Th>
                  <Th>Mobile</Th>
                  <Th>CGPA</Th>
                  <Th>Branch</Th>
                  <Th>Skills</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visibleStudents.map((s) => (
                  <tr key={s.id}>
                    <Td>{s.enrollNo}</Td>
                    <Td className="font-medium">{s.name}</Td>
                    <Td className="max-w-[200px] truncate">{s.email}</Td>
                    <Td>{s.mobile}</Td>
                    <Td>{s.cgpa}</Td>
                    <Td>{s.branch}</Td>
                    <Td className="max-w-xs truncate">
                      {(s.skills || []).join(', ')}
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {students.length > PAGE_SIZE && (
              <div className="mt-6 flex items-center justify-between gap-3">
                <p className="text-sm text-slate-500">
                  Showing {startIdx + 1}–{Math.min(startIdx + PAGE_SIZE, students.length)} of{' '}
                  {students.length}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Prev
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => goToPage(p)}
                      className={`h-9 w-9 rounded-lg text-sm font-medium cursor-pointer ${
                        p === currentPage
                          ? 'bg-brand-600 text-white'
                          : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {p}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  )
}