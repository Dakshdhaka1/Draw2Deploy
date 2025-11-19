import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Alert from '../components/Alert'
import { verifyUser } from '../api/auth'
import Logo from '../components/Logo'
import ThemeToggle from '../components/ThemeToggle'

function VerificationPage() {
  const navigate = useNavigate()
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('d2d_token')
    if (!token) {
      setStatus('error')
      setMessage('No authentication token found. Please log in first.')
      setTimeout(() => {
        navigate('/login', { replace: true })
      }, 2000)
    }
  }, [navigate])

  const handleVerify = async () => {
    try {
      const token = localStorage.getItem('d2d_token')
      if (!token) {
        setStatus('error')
        setMessage('No authentication token found. Please log in again.')
        setTimeout(() => {
          navigate('/login', { replace: true })
        }, 2000)
        return
      }

      setStatus('loading')
      setMessage('')
      const response = await verifyUser()
      
      setStatus('success')
      setMessage('Profile verified')
      
      setTimeout(() => {
        navigate('/dashboard', { replace: true })
      }, 1000)
    } catch (error) {
      setStatus('error')
      const errorMessage = error instanceof Error ? error.message : 'Unable to verify email.'
      setMessage(errorMessage)
      
      if (errorMessage.includes('Authentication') || errorMessage.includes('log in')) {
        setTimeout(() => {
          navigate('/login', { replace: true })
        }, 3000)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-100/80 to-white text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-white">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <Logo />
        <ThemeToggle />
      </header>

      <main className="mx-auto flex w-full max-w-2xl items-center justify-center px-6 py-20">
        <div className="w-full rounded-3xl bg-white/70 px-8 py-12 shadow-xl ring-1 ring-slate-200 dark:bg-slate-900/70 dark:ring-slate-700">
          <div className="text-center">
            {/* Icon */}
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-600 shadow-lg">
              {status === 'success' ? (
                <svg
                  className="h-12 w-12 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg
                  className="h-12 w-12 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              )}
            </div>

            <h1 className="text-4xl font-semibold text-slate-900 md:text-5xl dark:text-white">
              {status === 'success' ? 'Email Verified!' : 'Verify Your Email'}
            </h1>
            <p className="mt-4 text-base text-slate-500 dark:text-slate-400">
              {status === 'success'
                ? 'Profile verified. Redirecting...'
                : 'Click the button below to confirm your email address for Draw2Deploy.'}
            </p>

            {message && (
              <div className="mt-6">
                <Alert variant={status === 'error' ? 'error' : 'success'} message={message} />
              </div>
            )}

            {status !== 'success' && (
              <button
                onClick={handleVerify}
                disabled={status === 'loading'}
                className="mt-8 w-full rounded-xl bg-brand-600 px-6 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === 'loading' ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="h-5 w-5 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Verifying...
                  </span>
                ) : (
                  'Verify Email Address'
                )}
              </button>
            )}

            {status === 'success' && (
              <div className="mt-8 animate-bounce">
                <svg
                  className="mx-auto h-16 w-16 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default VerificationPage
