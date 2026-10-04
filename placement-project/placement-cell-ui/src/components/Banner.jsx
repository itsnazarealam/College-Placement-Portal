// src/components/Banner.jsx
import { Link } from 'react-router-dom'

const Banner = ({
  eyebrow = "Let's get you placed",
  title = 'Your next opportunity is one click away',
  ctaLabel = 'Check eligibility',
  ctaTo = '/eligibility',
}) => {
  return (
    <div className="relative overflow-hidden bg-[#0f172b]">
      {/* diagonal accent stripe */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'repeating-linear-gradient(135deg, #fff 0px, #fff 2px, transparent 2px, transparent 14px)',
        }}
      />

      <div className="relative mx-auto flex max-w-6xl flex-col items-start gap-4 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div>
          <p className="font-mono text-xs font-medium uppercase tracking-widest text-[#fff]">
            {eyebrow}
          </p>
          <h3 className="mt-2 font-display text-xl font-semibold text-white sm:text-2xl">
            {title}
          </h3>
        </div>

        <Link
          to={ctaTo}
          className="shrink-0 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-brand-700 shadow-sm transition-colors hover:bg-brand-50"
        >
          {ctaLabel} →
        </Link>
      </div>
    </div>
  )
}

export default Banner