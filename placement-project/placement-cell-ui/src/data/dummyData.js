import { COLLEGE_EMAIL_DOMAIN } from '../config/branding'

export const initialStudents = [
  {
    id: 's1',
    name: 'Ananya Sharma',
    email: `ananya.sharma@student.${COLLEGE_EMAIL_DOMAIN}`,
    branch: 'CSE',
    cgpa: 8.6,
    batch: '2025',
    skills: ['JavaScript', 'React', 'Node.js', 'SQL'],
  },
  {
    id: 's2',
    name: 'Rahul Verma',
    email: `rahul.verma@student.${COLLEGE_EMAIL_DOMAIN}`,
    branch: 'ECE',
    cgpa: 7.2,
    batch: '2025',
    skills: ['Python', 'Embedded C', 'MATLAB'],
  },
  {
    id: 's3',
    name: 'Priya Nair',
    email: `priya.nair@${COLLEGE_EMAIL_DOMAIN}`,
    branch: 'CSE',
    cgpa: 9.1,
    batch: '2026',
    skills: ['Java', 'Spring', 'SQL', 'System Design'],
  },
  {
    id: 's4',
    name: 'Karthik Iyer',
    email: `karthik.iyer@student.${COLLEGE_EMAIL_DOMAIN}`,
    branch: 'ME',
    cgpa: 6.8,
    batch: '2025',
    skills: ['AutoCAD', 'SolidWorks'],
  },
]

export const initialCompanies = [
  {
    id: 'c1',
    name: 'TechNova Labs',
    email: 'hr@technova.example',
    contact: '+91 98765 43210',
    industry: 'Software',
  },
  {
    id: 'c2',
    name: 'CircuitSphere',
    email: 'talent@circuitsphere.example',
    contact: '+91 91234 56789',
    industry: 'Semiconductors',
  },
]

/** Job postings — mix of approved & pending for demo */
export const initialJobs = [
  {
    id: 'j1',
    companyName: 'TechNova Labs',
    role: 'Full Stack Engineer',
    package: '18 LPA',
    minCgpa: 7.5,
    branches: ['CSE', 'IT'],
    requiredSkills: ['JavaScript', 'React', 'SQL'],
    lastDate: '2026-05-15',
    description:
      'Build scalable web products with React and Node. Strong problem-solving and collaboration skills required.',
    status: 'approved',
    createdAt: '2026-03-01',
  },
  {
    id: 'j2',
    companyName: 'CircuitSphere',
    role: 'Embedded Software Intern',
    package: '12 LPA',
    minCgpa: 7.0,
    branches: ['ECE', 'EEE'],
    requiredSkills: ['Python', 'Embedded C'],
    lastDate: '2026-04-30',
    description:
      'Firmware and driver development for IoT devices. Exposure to RTOS is a plus.',
    status: 'approved',
    createdAt: '2026-03-10',
  },
  {
    id: 'j3',
    companyName: 'TechNova Labs',
    role: 'Backend Engineer',
    package: '22 LPA',
    minCgpa: 8.0,
    branches: ['CSE'],
    requiredSkills: ['Java', 'Spring', 'SQL', 'System Design'],
    lastDate: '2026-06-01',
    description:
      'Design APIs and microservices for enterprise clients. Experience with cloud platforms preferred.',
    status: 'approved',
    createdAt: '2026-03-18',
  },
  {
    id: 'j4',
    companyName: 'DataWeave Analytics',
    role: 'Data Analyst',
    package: '10 LPA',
    minCgpa: 7.0,
    branches: ['All'],
    requiredSkills: ['Python', 'SQL'],
    lastDate: '2026-05-01',
    description: 'Analyze datasets and build dashboards. Statistics background helpful.',
    status: 'pending',
    createdAt: '2026-04-01',
  },
]

export const placementStats = {
  offers: 1240,
  companies: 86,
  highestPackage: '11 LPA',
  averagePackage: '4.4 LPA',
}
