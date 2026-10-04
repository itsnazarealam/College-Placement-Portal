import { useEffect, useState } from "react";

function useTypewriter(text, speed = 28) {
  const [output, setOutput] = useState("");

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) {
      setOutput(text);
      return;
    }

    let i = 0;

    const id = setInterval(() => {
      i++;
      setOutput(text.slice(0, i));

      if (i >= text.length) {
        clearInterval(id);
      }
    }, speed);

    return () => clearInterval(id);
  }, [text, speed]);

  return output;
}

export default function aboutDev() {
  const typed = useTypewriter(
    '"streamline campus placement management"'
  );

  return (
    <section
      id="aboutDev"
      className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8"
    >
      <p className="font-mono text-sm font-medium text-brand-600">
        // behind the portal
      </p>

      <h2 className="mt-3 font-display text-2xl font-semibold text-slate-900 sm:text-3xl">
        Built by a student, for students
      </h2>

      <div className="mt-10 grid gap-8 lg:grid-cols-[280px_1fr] lg:items-start lg:h-[40vh]">
  {/* Profile Card */}
  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60">
    <img
      src="/nazare.jpg"
      alt="Developer"
      className="h-20 w-20 rounded-full object-cover ring-1 ring-slate-200"
    />

    <h3 className="mt-4 font-display font-semibold text-slate-900">
      Md Nazare Alam
    </h3>

    <p className="text-sm text-slate-600">
      Full-stack Developer · BVICAM
    </p>

    <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-100">
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
      Open to opportunities
    </span>

    <div className="mt-5 flex flex-wrap gap-3">
      <a
        href="https://github.com/itsnazarealam"
        target="_blank"
        rel="noreferrer"
        className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-medium text-slate-700 ring-1 ring-slate-200 transition-colors hover:bg-slate-200"
      >
        GitHub
      </a>
      <a
      
        href="https://linkedin.com/in/itsnazarealam"
        target="_blank"
        rel="noreferrer"
        className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-medium text-slate-700 ring-1 ring-slate-200 transition-colors hover:bg-slate-200"
      >
        LinkedIn
      </a>

      <a
        href="https://mail.google.com/mail/?view=cm&fs=1&to=itsnazarealam@gmail.com"
        target="_blank"
        rel="noreferrer"
        className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-medium text-slate-700 ring-1 ring-slate-200 transition-colors hover:bg-slate-200"
      >
        Email
      </a>
    </div>
  </div>

  {/* Code Editor */}
  <div className="overflow-hidden rounded-2xl bg-slate-900 shadow-xl shadow-slate-300/40 ring-1 ring-slate-800 flex flex-col">
    {/* Header */}
    <div className="flex items-center gap-2 border-b border-slate-800 bg-slate-950/60 px-4 py-3">
      <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
      <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
      <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />

      <span className="ml-3 font-mono text-xs text-slate-400">
        developer.js
      </span>
    </div>

    {/* Code */}
    <pre className="overflow-x-auto overflow-y-auto p-6 max-h-[60vh] lg:h-full lg:max-h-none font-mono text-[13px] leading-6 text-slate-300 sm:text-sm">
      <code>
        <span className="text-purple-400">const</span>{" "}
        <span className="text-sky-300">developer</span> = {"{"}
        {"\n"}
        {"  "}
        <span className="text-sky-300">name</span>:{" "}
        <span className="text-emerald-400">"Md Nazare Alam"</span>,
        {"\n"}
        {"  "}
        <span className="text-sky-300">role</span>:{" "}
        <span className="text-emerald-400">
          "Full-stack Developer"
        </span>
        ,
        {"\n"}
        {"  "}
        <span className="text-sky-300">institute</span>:{" "}
        <span className="text-emerald-400">"BVICAM"</span>,
        {"\n"}
        {"  "}
        <span className="text-sky-300">stack</span>: [
        <span className="text-emerald-400">"React"</span>,{" "}
        <span className="text-emerald-400">"Spring Boot"</span>,{" "}
        <span className="text-emerald-400">"MySQL"</span>,{" "}
        <span className="text-emerald-400">"Tailwind CSS"</span>],
        {"\n"}
        {"  "}
        <span className="text-sky-300">builtThis</span>:{" "}
        <span className="text-emerald-400">{typed}</span>
        <span className="ml-0.5 inline-block h-4 w-2 animate-pulse bg-slate-400 align-middle" />
        {"\n"}
        {"};"}
      </code>
    </pre>
  </div>
</div>
    </section>
  );
}