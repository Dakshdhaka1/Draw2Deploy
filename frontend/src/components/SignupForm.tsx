import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import TextInput from './TextInput'
import Alert from './Alert'
import { registerUser } from '../api/auth'
import ResendVerification from './ResendVerification'

type SignupFormState = {
  firstName: string
  lastName: string
  email: string
  password: string
}

const initialState: SignupFormState = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
}

type SignupFormProps = {
  showHeading?: boolean
}

function SignupForm({ showHeading = true }: SignupFormProps) {
  const [formState, setFormState] = useState<SignupFormState>(initialState)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [resendEmail, setResendEmail] = useState('')
  const [resendReady, setResendReady] = useState(false)

  const isSubmitDisabled = useMemo(() => {
    return !formState.firstName || !formState.lastName || !formState.email || formState.password.length < 8
  }, [formState])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const emailForResend = formState.email.trim()
    try {
      setStatus('loading')
      const response = await registerUser({
        firstName: formState.firstName.trim(),
        lastName: formState.lastName.trim(),
        email: emailForResend,
        password: formState.password,
      })
      setStatus('success')
      setMessage(response.message ?? 'Account created. Check your inbox to verify your email.')
      setResendEmail(emailForResend)
      setResendReady(true)
      setFormState(initialState)
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Unable to sign up.')
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {showHeading ? <h2 className="text-2xl font-semibold text-slate-900">Sign up</h2> : null}
      {status === 'success' && message ? (
        <div className="rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100/50 p-4 shadow-lg dark:border-blue-800 dark:from-blue-900/30 dark:to-blue-950/30">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-base font-bold text-blue-900 dark:text-blue-100 mb-1.5">
                Check Your Email!
              </h3>
              <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
                We've sent a verification email to <strong className="font-semibold">{resendEmail}</strong>
              </p>
              <div className="space-y-1.5 text-sm text-blue-700 dark:text-blue-300">
                <p className="font-medium">📧 Please check your inbox and:</p>
                <ul className="ml-4 list-disc space-y-0.5">
                  <li>Open the verification email we just sent</li>
                  <li>Click the verification link in the email</li>
                  <li>Return here to sign in after verification</li>
                </ul>
              </div>
              <p className="mt-2 text-xs text-blue-600 dark:text-blue-400">
                ⚠️ <strong>Important:</strong> You must verify your email before you can use all features.
              </p>
            </div>
          </div>
        </div>
      ) : message ? (
        <Alert variant={status === 'error' ? 'error' : 'success'} message={message} />
      ) : null}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <TextInput
            label="First Name"
            placeholder="Jane"
            autoComplete="given-name"
            value={formState.firstName}
            onChange={(event) => setFormState((prev) => ({ ...prev, firstName: event.target.value }))}
            required
          />
          <TextInput
            label="Last Name"
            placeholder="Doe"
            autoComplete="family-name"
            value={formState.lastName}
            onChange={(event) => setFormState((prev) => ({ ...prev, lastName: event.target.value }))}
            required
          />
        </div>
        <TextInput
          label="Email"
          placeholder="jane@company.com"
          type="email"
          autoComplete="email"
          value={formState.email}
          onChange={(event) => setFormState((prev) => ({ ...prev, email: event.target.value }))}
          required
        />
        <div>
          <TextInput
            label="Password"
            placeholder="••••••••"
            type="password"
            autoComplete="new-password"
            minLength={8}
            value={formState.password}
            onChange={(event) =>
              setFormState((prev) => ({ ...prev, password: event.target.value }))
            }
            required
          />
          <div className="mt-2 space-y-1 text-xs text-slate-600">
            <p className="font-medium text-slate-700">Password requirements:</p>
            <ul className="ml-4 list-disc space-y-0.5">
              <li className={formState.password.length >= 8 ? 'text-green-600' : ''}>
                At least 8 characters
              </li>
              <li className={/[A-Z]/.test(formState.password) ? 'text-green-600' : ''}>
                One uppercase letter (recommended)
              </li>
              <li className={/[0-9]/.test(formState.password) ? 'text-green-600' : ''}>
                One number (recommended)
              </li>
            </ul>
          </div>
        </div>
        <button
          type="submit"
          disabled={status === 'loading' || isSubmitDisabled}
          className="mt-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 text-base font-semibold text-white shadow-lg transition hover:from-blue-700 hover:to-blue-800 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === 'loading' ? 'Creating account...' : 'Create account'}
        </button>
      </form>
      <ResendVerification email={resendEmail} visible={resendReady} />
    </div>
  )
}

export default SignupForm

