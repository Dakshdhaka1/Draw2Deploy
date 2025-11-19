import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { submitProject } from '../api/project'
import Alert from '../components/Alert'
import Logo from '../components/Logo'
import ThemeToggle from '../components/ThemeToggle'

function NewProjectPage() {
  const navigate = useNavigate()
  const [projectName, setProjectName] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!image) {
      setStatus('error')
      setMessage('Please select an image.')
      return
    }

    try {
      setStatus('loading')
      const response = await submitProject({ projectName, image })
      setStatus('success')
      setMessage(response.message ?? 'Project submitted successfully.')
      
      setTimeout(() => {
        navigate('/dashboard', { replace: true })
      }, 1500)
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Project submission failed.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-100/80 to-white text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-white">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <Logo />
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            onClick={() => navigate('/dashboard')}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Back to Dashboard
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl px-6 pb-20">
        <section className="rounded-3xl bg-white/70 px-8 py-10 shadow-xl ring-1 ring-slate-200 dark:bg-slate-900/70 dark:ring-slate-700">
          <div className="mb-8">
            <p className="text-sm uppercase tracking-[0.4em] text-brand-700 dark:text-brand-400">New project</p>
            <h1 className="mt-4 text-4xl font-semibold text-slate-900 dark:text-white">
              Upload diagram → Deploy to AWS
            </h1>
            <p className="mt-3 text-base text-slate-500 dark:text-slate-400">
              Upload your architecture diagram to generate Terraform modules automatically.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <label className="text-left">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Project name</span>
              <input
                type="text"
                value={projectName}
                onChange={(event) => setProjectName(event.target.value)}
                required
                placeholder="e.g., Production VPC"
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:ring-brand-800"
              />
            </label>

            <label className="text-left">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Diagram / architecture image</span>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => setImage(event.target.files?.[0] ?? null)}
                required
                className="mt-2 w-full rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-slate-700 file:mr-4 file:rounded-lg file:border-0 file:bg-brand-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white file:transition hover:file:bg-brand-700 hover:border-brand-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-brand-500"
              />
            </label>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="mt-2 rounded-xl bg-brand-600 px-6 py-3 text-base font-semibold text-white shadow-lg transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
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
                  Uploading…
                </span>
              ) : (
                'Submit project'
              )}
            </button>
          </form>

          {message && (
            <div className="mt-6">
              <Alert variant={status === 'error' ? 'error' : 'success'} message={message} />
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default NewProjectPage
