/**
 * Compare student profile with a single job's criteria.
 * @returns {{ eligible: boolean, cgpaOk: boolean, branchOk: boolean, skillsOk: boolean, missingSkills: string[] }}
 */
export function evaluateJobEligibility(student, job) {
  const cgpaOk = Number(student.cgpa) >= Number(job.minCgpa)

  const branches = (job.branches || []).map((b) => String(b).toLowerCase())
  const branchOk =
    branches.includes('all') ||
    branches.includes(String(student.branch).toLowerCase())

  const required = job.requiredSkills || []
  const studentSkillsLower = (student.skills || []).map((s) =>
    String(s).toLowerCase()
  )
  const missingSkills = required.filter(
    (req) => !studentSkillsLower.includes(String(req).toLowerCase())
  )
  const skillsOk = missingSkills.length === 0

  return {
    eligible: cgpaOk && branchOk && skillsOk,
    cgpaOk,
    branchOk,
    skillsOk,
    missingSkills,
  }
}

/** Approved jobs only, optionally filtered by application deadline */
export function getOpenApprovedJobs(jobs, today = new Date()) {
  return jobs.filter((j) => {
    if (j.status !== 'approved') return false
    if (!j.lastDate) return true
    const end = new Date(j.lastDate)
    end.setHours(23, 59, 59, 999)
    return end >= today
  })
}

export function findStudentByEmail(students, email) {
  const e = String(email).trim().toLowerCase()
  return students.find((s) => s.email.toLowerCase() === e) || null
}

export function getEligibleJobsForStudent(student, jobs) {
  const open = getOpenApprovedJobs(jobs)
  return open
    .map((job) => ({
      job,
      ...evaluateJobEligibility(student, job),
    }))
    .filter((x) => x.eligible)
}
