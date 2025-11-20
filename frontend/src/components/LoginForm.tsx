import { useState } from 'react'
import type { FormEvent } from 'react'
import TextInput from './TextInput'
import Alert from './Alert'
import { loginUser } from '../api/auth'

type LoginFormProps = {
  onSuccess?: () => void
  showHeading?: boolean
}

function LoginForm({ onSuccess, showHeading = true }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      setStatus('loading')
      const response = await loginUser({ email: email.trim(), password })
      localStorage.setItem('d2d_token', response.data)
      setStatus('idle')
      setMessage('')
      onSuccess?.()
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Unable to login.')
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {showHeading ? <h2 className="text-2xl font-semibold text-slate-900">Sign in</h2> : null}
      {status === 'error' && message ? <Alert variant="error" message={message} /> : null}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <TextInput
          label="Email"
          placeholder="you@company.com"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <TextInput
          label="Password"
          placeholder="••••••••"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="mt-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 text-base font-semibold text-white shadow-lg transition hover:from-blue-700 hover:to-blue-800 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === 'loading' ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}

export default LoginForm

