import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { logout, verifyUser } from '../api/auth'
import { getAllProjects, deleteProject, generateTerraform, checkAiServiceStatus, type Project } from '../api/project'
import Alert from '../components/Alert'
import Logo from '../components/Logo'
import ThemeToggle from '../components/ThemeToggle'

function DashboardPage() {
  const navigate = useNavigate()
  const [projects, setProjects] = useState<Project[]>([])
  const [isVerified, setIsVerified] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [generatingId, setGeneratingId] = useState<string | null>(null)
  const [generationProgress, setGenerationProgress] = useState<number>(0)
  const [aiServiceStatus, setAiServiceStatus] = useState<{ available: boolean; message: string } | null>(null)

  // Check verification status
  useEffect(() => {
    const checkVerification = async () => {
      try {
        const response = await verifyUser()
        const msg = response.message?.toLowerCase() || ''
        if (msg.includes('already verified') || msg.includes('verified successfully')) {
          setIsVerified(true)
        } else {
          setIsVerified(true)
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message.toLowerCase() : ''
        if (errorMsg.includes('already verified')) {
          setIsVerified(true)
        } else {
          setIsVerified(false)
        }
      }
    }

    checkVerification()
  }, [])

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true)
        const data = await getAllProjects()
        setProjects(data)
        setError('')
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load projects')
        setProjects([])
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  // Check AI service status
  useEffect(() => {
    const checkStatus = async () => {
      const status = await checkAiServiceStatus()
      setAiServiceStatus(status)
    }
    checkStatus()
  }, [])

  const handleDelete = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) {
      return
    }

    try {
      setDeletingId(projectId)
      await deleteProject(projectId)
      const data = await getAllProjects()
      setProjects(data)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete project')
    } finally {
      setDeletingId(null)
    }
  }

  const handleGenerateTerraform = async (projectId: string) => {
    let progressInterval: NodeJS.Timeout | null = null
    try {
      setGeneratingId(projectId)
      setGenerationProgress(0)
      setError('')
      
      // Realistic progress simulation with gradual slowdown
      const updateProgress = () => {
        setGenerationProgress((prev) => {
          // Calculate remaining progress to 95% (we'll set 100% when done)
          const remaining = 95 - prev
          if (remaining <= 0) return prev
          
          // Gradually slow down as we approach 95%
          // Early stages: slower (1-2% per update)
          // Later stages: very slow (0.3-0.8% per update)
          const speed = remaining > 50 ? 1 + Math.random() * 1 : 0.3 + Math.random() * 0.5
          return Math.min(95, prev + speed)
        })
      }
      
      // Update progress every 600ms for slower, smoother animation
      progressInterval = setInterval(updateProgress, 600)
      
      // Initial progress
      setGenerationProgress(5)
      
      // Check AI service before generating
      await new Promise(resolve => setTimeout(resolve, 500))
      setGenerationProgress(15)
      
      const status = await checkAiServiceStatus()
      if (!status.available) {
        if (progressInterval) clearInterval(progressInterval)
        const errorMsg = `Cannot generate Terraform: ${status.message}\n\nPlease start the AI service on http://localhost:7000`
        setError(errorMsg)
        setGenerationProgress(0)
        alert(errorMsg)
        return
      }
      
      // Progress to 25% after AI service check
      setGenerationProgress(25)
      
      // Start terraform generation (this is the long operation)
      // The progress will continue updating via the interval
      await generateTerraform(projectId)
      
      // Complete the progress
      if (progressInterval) clearInterval(progressInterval)
      setGenerationProgress(100)
      
      // Success - file download should start automatically
      setError('') // Clear any previous errors
      
      // Reset progress after a short delay
      setTimeout(() => {
        setGenerationProgress(0)
      }, 1500)
    } catch (err) {
      // Clear progress interval if still running
      if (progressInterval) {
        clearInterval(progressInterval)
      }
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate Terraform'
      setError(errorMessage)
      setGenerationProgress(0)
      console.error('Terraform generation error:', err)
      
      // Show detailed error in alert
      alert(errorMessage)
    } finally {
      setGeneratingId(null)
    }
  }

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-blue-100/50 to-white text-slate-900 dark:from-slate-950 dark:via-blue-950/30 dark:to-slate-950 dark:text-white">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <Logo />
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            onClick={() => navigate('/projects/new')}
            className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:from-blue-700 hover:to-blue-800 hover:shadow-xl"
          >
            New Project
          </button>
          <button
            onClick={handleLogout}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-6 pb-20">
        {/* Verify Email Section - Only show if not verified */}
        {isVerified === false && (
          <section className="mb-8 rounded-3xl border border-blue-200 bg-blue-50/60 px-6 py-5 shadow-sm ring-1 ring-blue-100 dark:border-blue-700 dark:bg-blue-900/20 dark:ring-blue-800">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-blue-900 dark:text-blue-200">Verify your email</p>
                <p className="text-sm text-blue-700/80 dark:text-blue-300/80">
                  Complete verification to unlock deployment actions.
                </p>
              </div>
              <Link
                to="/verify"
                className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-2 text-sm font-semibold text-white shadow-lg transition hover:from-blue-700 hover:to-blue-800 hover:shadow-xl"
              >
                Go to verification
              </Link>
            </div>
          </section>
        )}


        {/* AI Service Status */}
        {aiServiceStatus && !aiServiceStatus.available && (
          <section className="mb-8 rounded-3xl border border-yellow-200 bg-yellow-50/60 px-6 py-5 shadow-sm ring-1 ring-yellow-100 dark:border-yellow-700 dark:bg-yellow-900/20 dark:ring-yellow-800">
            <div className="flex items-center gap-3">
              <svg
                className="h-6 w-6 text-yellow-600 dark:text-yellow-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <div>
                <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-200">AI Service Unavailable</p>
                <p className="text-sm text-yellow-700/80 dark:text-yellow-300/80">
                  {aiServiceStatus.message}. Terraform generation requires the AI service to be running.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Projects Section */}
        <section className="rounded-3xl bg-white/80 px-8 py-8 shadow-xl ring-1 ring-blue-200/50 dark:bg-slate-900/80 dark:ring-blue-800/50 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Your Projects</h2>
              {projects.length > 0 && (
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  {projects.length} project{projects.length !== 1 ? 's' : ''} total
                </p>
              )}
            </div>
          </div>

          {error && (
            <div className="mt-6">
              <Alert variant="error" message={error} />
            </div>
          )}

          {loading && (
            <div className="mt-8 text-center text-slate-500 dark:text-slate-400">Loading projects...</div>
          )}

          {!loading && !error && projects.length === 0 && (
            <div className="mt-8 rounded-2xl border-2 border-dashed border-blue-300 bg-blue-50/50 p-12 text-center dark:border-blue-700 dark:bg-blue-950/30">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                <svg className="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <p className="text-lg font-semibold text-slate-700 dark:text-slate-300">No projects yet</p>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Create your first project to get started!</p>
              <button
                onClick={() => navigate('/projects/new')}
                className="mt-6 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:from-blue-700 hover:to-blue-800 hover:shadow-xl"
              >
                Create Project
              </button>
            </div>
          )}

          {!loading && !error && projects.length > 0 && (
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <article
                  key={project.id}
                  className="group relative overflow-hidden rounded-2xl border border-blue-200 bg-white/80 p-6 shadow-sm transition-all duration-300 hover:border-blue-400 hover:shadow-xl hover:scale-105 dark:border-blue-800 dark:bg-slate-800/80 dark:hover:border-blue-600"
                >
                  {/* Status badge */}
                  <div className="absolute top-4 right-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      project.status === 'ANALYZED' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                        : project.status === 'Uploaded'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                        : 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'
                    }`}>
                      {project.status || 'Active'}
                    </span>
                  </div>
                  
                  <div className="flex items-start justify-between pr-16">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {project.title || project.projectName || 'Untitled Project'}
                      </h3>
                      {project.createdAt && (
                        <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(project.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 flex flex-col gap-2">
                    {/* Progress Bar */}
                    {generatingId === project.id && (
                      <div className="w-full">
                        <div className="mb-1 flex items-center justify-between text-xs">
                          <span className="text-slate-600 dark:text-slate-400">Generating Terraform...</span>
                          <span className="font-semibold text-blue-600 dark:text-blue-400">
                            {Math.round(generationProgress)}%
                          </span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300 ease-out"
                            style={{ width: `${generationProgress}%` }}
                          />
                        </div>
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleGenerateTerraform(project.id)}
                        disabled={generatingId === project.id || !isVerified || (aiServiceStatus?.available === false)}
                        className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:from-blue-700 hover:to-blue-800 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:from-blue-600 disabled:hover:to-blue-700"
                        title={
                          !isVerified 
                            ? 'Verify email to generate Terraform' 
                            : (aiServiceStatus?.available === false)
                            ? 'AI service is not available'
                            : 'Generate Terraform module'
                        }
                      >
                        {generatingId === project.id ? (
                          <span className="flex items-center justify-center gap-2">
                            <svg
                              className="h-4 w-4 animate-spin"
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
                            Generating...
                          </span>
                        ) : (
                          'Generate TF'
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        disabled={deletingId === project.id}
                        className="rounded-xl border border-red-300 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-700 dark:bg-red-900/20 dark:text-red-300 dark:hover:bg-red-900/30"
                      >
                        {deletingId === project.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default DashboardPage
