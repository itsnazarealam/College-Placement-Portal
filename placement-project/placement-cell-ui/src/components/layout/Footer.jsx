import { Link } from 'react-router-dom'
import {
  COLLEGE_WEBSITE_LABEL,
  COLLEGE_WEBSITE_URL,
  INSTITUTE_NAME,
  INSTITUTE_SHORT,
  PLACEMENT_CONTACT_EMAIL,
} from '../../config/branding'

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <p className="font-display text-lg font-semibold text-white">
              {INSTITUTE_SHORT} Placement Cell
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              Training and Placement Office, {INSTITUTE_NAME} — bridging
              students and recruiters with transparent processes.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Contact
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <span className="text-slate-500">Email:</span>{' '}
                <a
                  href={`mailto:${PLACEMENT_CONTACT_EMAIL}`}
                  className="text-brand-300 hover:underline"
                >
                  {PLACEMENT_CONTACT_EMAIL}
                </a>
              </li>
              <li>
                <span className="text-slate-500">Website:</span>{' '}
                <a
                  href={COLLEGE_WEBSITE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-300 hover:underline"
                >
                  {COLLEGE_WEBSITE_LABEL}
                </a>
              </li>
              <li>
                <span className="text-slate-500">Tel:</span> 011-25275055
              </li>
              <li>
                <span className="text-slate-500">Office:</span> A-4 Paschim Vihar, Paschim Vihar (E) Metro Station Rohtak Road, New Delhi-110063
                <br/>Mon–Sat, 09:00–17:00
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Quick links
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link to="/companies" className="hover:text-white">
                  Active recruiters
                </Link>
              </li>
              <li>
                <Link to="/eligibility" className="hover:text-white">
                  Eligibility check
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white">
                  Portal login
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <p className="mt-10 border-t border-slate-800 pt-8 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} {INSTITUTE_NAME}. Demo UI — data is local
          to your browser.
        </p>
      </div>
    </footer>
  )
}
