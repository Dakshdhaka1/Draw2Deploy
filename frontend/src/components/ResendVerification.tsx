import { useEffect, useState } from 'react'
import { resendVerificationEmail } from '../api/auth'
import Alert from './Alert'

type ResendVerificationProps = {
  email?: string
  visible?: boolean
}

function ResendVerification({ email, visible = false }: ResendVerificationProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  useEffect(() => {
    setStatus('idle')
    setMessage('')
  }, [visible, email])

  if (!visible) {
    return null
  }

  const handleClick = async () => {
    if (!email) {
      setStatus('error')
      setMessage('Enter your email first.')
      return
    }

    try {
      setStatus('loading')
      const response = await resendVerificationEmail({ email })
      setStatus('success')
      setMessage(response.message ?? 'Verification email sent.')
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Unable to resend email.')
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-slate-900">Need another verification email?</p>
        <button
          type="button"
          onClick={handleClick}
          disabled={!email || status === 'loading'}
          className="rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === 'loading' ? 'Sending…' : 'Send again'}
        </button>
        {message ? (
          <Alert variant={status === 'error' ? 'error' : 'success'} message={message} />
        ) : null}
        {!email ? (
          <p className="text-xs text-slate-600">Enter your email above to enable resend.</p>
        ) : null}
      </div>
    </div>
  )
}

export default ResendVerification
