import type { ReactNode } from 'react'
import Logo from './Logo'
import ThemeToggle from './ThemeToggle'

type AuthShellProps = {
  children: ReactNode
  footer?: ReactNode
}

function AuthShell({ children, footer }: AuthShellProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-100/80 to-white text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-white">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <Logo />
        <ThemeToggle />
      </header>

      <main className="mx-auto flex w-full max-w-5xl items-center justify-center px-6 py-10">
        <div className="flex w-full flex-col gap-8 lg:flex-row lg:items-stretch">
          {/* Left side - Branding */}
          <div className="flex-1 rounded-3xl bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700 p-10 text-white shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMjAiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiLz4KPC9zdmc+')] opacity-20"></div>
            <div className="relative z-10">
              <div className="mb-6 flex items-center gap-3">
                <img src="/logo.svg" alt="Draw2Deploy" className="h-12 w-12" />
              </div>
              <p className="text-sm uppercase tracking-[0.6em] text-white/70">Welcome</p>
              <h1 className="mt-4 text-5xl font-semibold tracking-tight">Draw2Deploy</h1>
              <p className="mt-2 text-xl text-white/80">Transform diagrams into infrastructure</p>
              <div className="mt-10 space-y-3">
                <div className="flex items-center gap-3 text-white/90">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>AI-powered analysis</span>
                </div>
                <div className="flex items-center gap-3 text-white/90">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Automated Terraform generation</span>
                </div>
                <div className="flex items-center gap-3 text-white/90">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>One-click AWS deployment</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Form */}
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white/70 px-8 py-8 shadow-xl ring-1 ring-slate-200 dark:border-slate-700 dark:bg-slate-900/70 dark:ring-slate-700">
            {children}
            {footer ? <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">{footer}</div> : null}
          </div>
        </div>
      </main>
    </div>
  )
}

export default AuthShell
