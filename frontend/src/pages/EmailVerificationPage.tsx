import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Alert from '../components/Alert'
import { getApiErrorMessage } from '../api/client'
import Logo from '../components/Logo'
import ThemeToggle from '../components/ThemeToggle'

const API_BASE = 'http://localhost:9000'

function EmailVerificationPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const token = searchParams.get('token')
    
    if (!token) {
      setStatus('error')
      setMessage('No verification token found in the link.')
      return
    }

    const verifyEmail = async () => {
      try {
        setStatus('loading')
        setMessage('Verifying your email...')

        const response = await fetch(`${API_BASE}/public/auth/verify-email?token=${encodeURIComponent(token)}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'omit',
        })

        const data = await response.json()

        if (!response.ok) {
          setStatus('error')
          setMessage(data.message || `Verification failed: ${response.statusText}`)
          return
        }

        setStatus('success')
        setMessage('Profile verified')
        
        // Redirect to login after 1 second
        setTimeout(() => {
          navigate('/login', { replace: true })
        }, 1000)
      } catch (error) {
        setStatus('error')
        setMessage(getApiErrorMessage(error))
      }
    }

    verifyEmail()
  }, [searchParams, navigate])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-100/80 to-white text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-white">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <Logo />
        <ThemeToggle />
      </header>

      <main className="mx-auto flex w-full max-w-2xl items-center justify-center px-6 py-20">
        <div className="relative w-full overflow-hidden rounded-3xl border border-slate-200 bg-white/70 p-10 shadow-xl ring-1 ring-slate-200 dark:border-slate-700 dark:bg-slate-900/70 dark:ring-slate-700">
          {/* Decorative gradient overlay */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-brand-500/10 via-purple-500/5 to-blue-500/10 opacity-50 blur-3xl" />
          
          {/* Success animation background */}
          {status === 'success' && (
            <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-green-500/10 to-emerald-500/10" />
          )}

          <div className="relative z-10 text-center">
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
              ) : status === 'loading' ? (
                <svg
                  className="h-12 w-12 animate-spin text-white"
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

            <h1 className="text-4xl font-bold text-slate-900 md:text-5xl dark:text-white">
              {status === 'success' 
                ? 'Email Verified!' 
                : status === 'loading'
                ? 'Verifying Email...'
                : 'Email Verification'}
            </h1>
            
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
              {status === 'success'
                ? 'Profile verified. Redirecting...'
                : status === 'loading'
                ? 'Please wait while we verify your email address.'
                : 'We are processing your verification request.'}
            </p>

            {message && (
              <div className="mt-6">
                <Alert 
                  variant={status === 'error' ? 'error' : 'success'} 
                  message={message} 
                />
              </div>
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

            {status === 'error' && (
              <div className="mt-8">
                <button
                  onClick={() => navigate('/login')}
                  className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-brand-700"
                >
                  Go to Login
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default EmailVerificationPage
