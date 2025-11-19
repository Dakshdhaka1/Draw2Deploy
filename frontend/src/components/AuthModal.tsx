import type { ReactNode } from 'react'

type AuthModalProps = {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
}

function AuthModal({ open, title, onClose, children }: AuthModalProps) {
  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4 py-8">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-blue-200/50 bg-gradient-to-br from-white/95 via-blue-50/30 to-white/95 p-8 shadow-2xl ring-1 ring-blue-200/50 dark:border-blue-800/50 dark:from-slate-900/95 dark:via-blue-950/30 dark:to-slate-900/95 dark:ring-blue-800/50">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233b82f6' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        <div className="relative z-10">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h3>
            <button
              onClick={onClose}
              className="rounded-full border border-blue-200 bg-white/80 p-2 text-sm text-blue-700 transition hover:bg-blue-50 hover:border-blue-300 dark:border-blue-800 dark:bg-slate-800/80 dark:text-blue-400 dark:hover:bg-slate-700"
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}

export default AuthModal
