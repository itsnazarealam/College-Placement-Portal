import { clearAuth, getToken } from './auth'

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

function handleUnauthorized() {
  clearAuth()
  if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
    window.location.href = '/login'
  }
}


async function request(method, path, body) {
  const headers = { 'Content-Type': 'application/json' }
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body !== undefined && body !== null ? JSON.stringify(body) : undefined,
  })

  if (res.status === 401 || res.status === 403) {
    handleUnauthorized()
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message ?? (res.status === 403 ? 'Forbidden' : 'Unauthorized'))
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message ?? `HTTP ${res.status}`)
  }

  if (res.status === 204) return null
  const text = await res.text()
  if (!text) return null
  return JSON.parse(text)
}

export { request }

// ── Companies
export async function createCompany(formData) {
  return request('POST', '/api/companies', {
    companyName: formData.companyName,
    companyMail: formData.contactEmail,
    role: formData.jobRole,
    packageOffered: formData.package,
    minCgpa: Number(formData.minCgpa),
    branches: Array.isArray(formData.branches)
      ? formData.branches.join(',')
      : formData.branches,
    requiredSkills: Array.isArray(formData.requiredSkills)
      ? formData.requiredSkills.join(',')
      : formData.requiredSkills,
    lastDate: formData.lastDate,
    jobDesc: formData.description ?? '',
  })
}

export async function registerStudent(payload) {
  const res = await fetch(`${BASE}/Student/StudentInsert`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message ?? `HTTP ${res.status}`)
  return data
}

export async function loginStudent(email, password) {
    const res = await fetch(`${BASE}/Student/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });

    const text = await res.text();

    console.log("Status:", res.status);
    console.log("Raw Response:", text);

    let data = {};

    if (text.trim()) {
        try {
            data = JSON.parse(text);
        } catch (error) {
            console.error("Invalid JSON from backend:", text);
            throw new Error("Backend returned invalid JSON");
        }
    }

    if (!res.ok) {
        throw new Error(data.message ?? `HTTP ${res.status}`);
    }

    return data;
}

export async function fetchApprovedCompanies() {
  return request('GET', '/api/companies')
}

export async function fetchAllCompanies() {
  return request('GET', '/api/companies/all')
}

export async function fetchCompaniesByName(name) {
  return request('GET', `/api/companies/by-name?name=${encodeURIComponent(name)}`)
}

export async function approveCompany(id) {
  return request('PATCH', `/api/companies/${id}/approve`)
}

export async function deleteCompany(id) {
  return request('DELETE', `/api/companies/${id}`)
}

export async function updateCompany(id, data) {
  return request('PUT', `/api/companies/${id}`, {
    companyName: data.name,
    companyMail: data.email,
  })
}

export function normalizeCompany(c) {
  return {
    id: c.companyId,
    companyName: c.companyName,
    contactEmail: c.companyMail,
    role: c.role,
    package: c.packageOffered,
    minCgpa: c.minCgpa,
    branches: c.branches ? c.branches.split(',').map((s) => s.trim()) : [],
    requiredSkills: c.requiredSkills
      ? c.requiredSkills.split(',').map((s) => s.trim())
      : [],
    lastDate: c.lastDate,
    description: c.jobDesc,
    status: c.approved ? 'approved' : 'pending',
    approved: c.approved,
  }
}

// ── Students
export async function updateStudent(enrollNo, data) {
  return request('PATCH', `/Student/StudentUpdate/${enrollNo}`, data)
}

export async function deleteStudent(enrollNo) {
  return request('DELETE', `/Student/StudentDelete/${enrollNo}`)
}

export async function fetchStudents() {  
  return request('GET', '/Student/StudentSelect')
}

export async function fetchMyStudent() {
  return request('GET', '/Student/me')
}

export async function bulkInsertStudents(students) {
  return request('POST', '/Student/addAll', students)
}

export function normalizeStudent(s) {
  const skills =
    typeof s.skills === 'string'
      ? s.skills.split(/[,;]/).map((x) => x.trim()).filter(Boolean)
      : Array.isArray(s.skills)
        ? s.skills
        : []
  const cgpa = s.marks_ug ?? s.marks_pg ?? s.cgpa_12 ?? s.cgpa_10 ?? s.cgpa ?? 0
  return {
    id: s.enrollNo,
    enrollNo: s.enrollNo,
    name: s.studentName ?? s.name ?? '',
    email: s.email ?? '',
    mobile: s.mobile ?? '',
    branch: s.graduationBranch ?? s.branch ?? '',
    cgpa: Number(cgpa) || 0,
    batch: s.graduationDegree ?? s.batch ?? '',
    skills,
    raw: s,
  }
}

// ── Jobs
export async function fetchJobs() {
  return request('GET', '/Job/JobSelect')
}

export function normalizeJob(j) {
  return {
    id: j.jobId,
    companyId: j.companyId,
    companyName: j.companyName ?? j.companyId ?? 'Company',
    role: j.jobRole,
    package: j.lpaPackage != null ? `${j.lpaPackage} LPA` : '',
    minCgpa: j.minCgpa,
    branches: j.allowedBranches
      ? j.allowedBranches.split(',').map((s) => s.trim())
      : [],
    requiredSkills: j.requiredSkills
      ? j.requiredSkills.split(',').map((s) => s.trim())
      : [],
    lastDate: j.resultDate ?? j.interviewDate ?? '',
    description: j.jobDesc,
    status: 'approved',
    maxBacklogs: j.maxBacklogs,
  }
}

// ── Applications
export async function fetchApplications() {
  return request('GET', '/application/all')
}

export async function submitApplications(applications) {
  return request('POST', '/application/addAll', applications)
}

export async function fetchStudentByEmail(email) {
  const token = getToken()
  const res = await fetch(
    `${BASE}/Student/by-email?email=${encodeURIComponent(email)}`,
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  )
  if (res.status === 404) return null
  if (!res.ok) throw new Error('Failed to look up student record')
  return res.json()
}

// export async function fetchStudentByEmail(email) {
//   const res = await fetch(`${BASE}/Student/by-email?email=${encodeURIComponent(email)}`)
//   if (res.status === 404) return null
//   if (!res.ok) throw new Error('Failed to look up student record')
//   return res.json()
// }
