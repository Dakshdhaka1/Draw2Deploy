import { useEffect, useState } from 'react'
import { resendVerificationEmail } from '../api/auth'

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
    <div className="flex flex-col gap-1.5">
      <button
        type="button"
        onClick={handleClick}
        disabled={!email || status === 'loading'}
        className="text-sm font-medium text-blue-600 hover:text-blue-700 underline transition-colors disabled:cursor-not-allowed disabled:opacity-50 disabled:no-underline dark:text-blue-400 dark:hover:text-blue-300"
      >
        {status === 'loading' ? 'Sending…' : 'Resend verification email'}
      </button>
      {message && (
        <span className={`text-sm font-medium ${status === 'error' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
          {message}
        </span>
      )}
    </div>
  )
}

export default ResendVerification
