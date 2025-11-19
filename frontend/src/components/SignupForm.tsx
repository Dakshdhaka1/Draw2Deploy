import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import TextInput from './TextInput'
import Alert from './Alert'
import { registerUser } from '../api/auth'
import ResendVerification from './ResendVerification'

type SignupFormState = {
  name: string
  email: string
  password: string
}

const initialState: SignupFormState = {
  name: '',
  email: '',
  password: '',
}

const mapName = (value: string) => {
  const parts = value.trim().split(/\s+/)
  const [firstName, ...rest] = parts
  return {
    firstName: firstName ?? '',
    lastName: rest.join(' ') || 'User',
  }
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
    return !formState.name || !formState.email || formState.password.length < 8
  }, [formState])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const { firstName, lastName } = mapName(formState.name)
    const emailForResend = formState.email.trim()
    try {
      setStatus('loading')
      const response = await registerUser({
        firstName,
        lastName,
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
      {message ? <Alert variant={status === 'error' ? 'error' : 'success'} message={message} /> : null}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <TextInput
          label="Name"
          placeholder="Jane Doe"
          autoComplete="name"
          value={formState.name}
          onChange={(event) => setFormState((prev) => ({ ...prev, name: event.target.value }))}
          required
        />
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

