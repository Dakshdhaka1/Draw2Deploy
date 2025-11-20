import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentUserEmail, getCurrentUserInfo, getCurrentUserName } from '../api/auth'
import Logo from '../components/Logo'
import ProfileMenu from '../components/ProfileMenu'
import ThemeToggle from '../components/ThemeToggle'

function WelcomePage() {
  const navigate = useNavigate()
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [userName, setUserName] = useState<string>('User')

  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        // Try to get user info from API (more reliable)
        const response = await getCurrentUserInfo()
        console.log('User info API response:', response)
        
        if (response && response.data) {
          const { firstName, lastName, email } = response.data
          console.log('Extracted user data:', { firstName, lastName, email })
          
          setUserEmail(email || '')
          
          // Build full name from firstName and lastName
          const fullName = `${firstName || ''} ${lastName || ''}`.trim()
          console.log('Full name built:', fullName)
          
          if (fullName) {
            setUserName(fullName)
            return
          }
        }
      } catch (error) {
        // If API call fails, fallback to JWT token
        console.error('Failed to get user info from API:', error)
      }

      // Fallback 1: Try to get name from JWT token
      const nameFromToken = getCurrentUserName()
      if (nameFromToken) {
        const { firstName, lastName } = nameFromToken
        const fullName = `${firstName || ''} ${lastName || ''}`.trim()
        if (fullName) {
          setUserName(fullName)
          const email = getCurrentUserEmail()
          setUserEmail(email || '')
          return
        }
      }

      // Fallback 2: Last resort - just show "User"
      const email = getCurrentUserEmail()
      setUserEmail(email || '')
      setUserName('User')
    }

    loadUserInfo()
  }, [])

  const stats = [
    { label: 'Projects Created', value: '0+', icon: '📊' },
    { label: 'Infrastructure Deployed', value: '0+', icon: '☁️' },
    { label: 'Terraform Modules', value: '0+', icon: '⚙️' },
    { label: 'Success Rate', value: '100%', icon: '✅' },
  ]

  const features = [
    {
      title: 'AI-Powered Analysis',
      description: 'Advanced machine learning algorithms analyze your architecture diagrams with precision.',
      icon: (
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
    },
    {
      title: 'Terraform Generation',
      description: 'Automatically generate production-ready Terraform modules from your designs.',
      icon: (
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
    },
    {
      title: 'AWS Integration',
      description: 'Seamless deployment to AWS with automated infrastructure provisioning.',
      icon: (
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
        </svg>
      ),
    },
    {
      title: 'Real-time Validation',
      description: 'Validate your infrastructure designs before deployment with instant feedback.',
      icon: (
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-blue-100/50 to-white text-slate-900 dark:from-slate-950 dark:via-blue-950/30 dark:to-slate-950 dark:text-white">
      {/* Header */}
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6">
        <Logo />
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <ProfileMenu />
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-6 pb-20">
        {/* Welcome Hero Section */}
        <section className="mt-8 rounded-3xl bg-gradient-to-br from-blue-500/10 via-blue-600/5 to-blue-700/10 px-8 py-16 shadow-2xl ring-1 ring-blue-200/50 dark:from-blue-900/20 dark:via-blue-800/10 dark:to-blue-900/20 dark:ring-blue-800/50">
          <div className="text-center">
            <h1 className="text-4xl font-bold leading-tight text-slate-900 md:text-5xl lg:text-6xl dark:text-white">
              Welcome back,{' '}
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent dark:from-blue-400 dark:to-blue-600">
                {userName}
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
              Ready to transform your architecture diagrams into production-ready infrastructure? Let's get started!
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <button
                onClick={() => navigate('/projects/new')}
                className="rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-4 text-base font-semibold text-white shadow-xl transition hover:from-blue-700 hover:to-blue-800 hover:shadow-2xl hover:scale-105"
              >
                Create New Project
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="rounded-2xl border-2 border-blue-300 bg-white/80 px-8 py-4 text-base font-semibold text-blue-700 transition hover:bg-white hover:border-blue-400 dark:border-blue-700 dark:bg-slate-900/80 dark:text-blue-400 dark:hover:bg-slate-800"
              >
                View Projects
              </button>
            </div>
          </div>
        </section>

        {/* User Profile Card */}
        <section className="mt-12">
          <div className="rounded-3xl bg-white/80 px-8 py-8 shadow-xl ring-1 ring-blue-200/50 dark:bg-slate-900/80 dark:ring-blue-800/50 backdrop-blur-sm">
            <div className="flex flex-col items-center md:flex-row md:items-start md:justify-between">
              <div className="flex items-center gap-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-700 text-3xl font-bold text-white shadow-lg">
                  {userName?.charAt(0).toUpperCase() || userEmail?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Your Profile</h2>
                  <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">{userName}</p>
                  <p className="mt-1 text-slate-600 dark:text-slate-400">{userEmail}</p>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-500">
                    Member since {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4 md:mt-0 md:grid-cols-4">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl mb-1">{stat.icon}</div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* About Draw2Deploy Section */}
        <section className="mt-12">
          <div className="rounded-3xl bg-white/80 px-8 py-12 shadow-xl ring-1 ring-blue-200/50 dark:bg-slate-900/80 dark:ring-blue-800/50 backdrop-blur-sm">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">About Draw2Deploy</h2>
              <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
                Draw2Deploy is a cutting-edge platform that bridges the gap between design and deployment.
                Transform your architecture diagrams into production-ready infrastructure code with AI-powered automation.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-2xl border border-blue-200/50 bg-gradient-to-br from-blue-50 to-white p-6 shadow-lg transition-all hover:border-blue-400 hover:shadow-xl hover:scale-105 dark:border-blue-800/50 dark:from-blue-950/30 dark:to-slate-900"
                >
                  <div className="mb-4 inline-flex rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 p-3 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Start Guide */}
        <section className="mt-12">
          <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-blue-700 px-8 py-12 shadow-xl text-white">
            <h2 className="text-3xl font-bold mb-8 text-center">Quick Start Guide</h2>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="text-center">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-xl font-bold mb-4">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-2">Upload Diagram</h3>
                <p className="text-blue-100">
                  Upload your architecture diagram in supported formats (PNG, JPG, SVG)
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-xl font-bold mb-4">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-2">AI Analysis</h3>
                <p className="text-blue-100">
                  Our AI analyzes your diagram and extracts infrastructure components automatically
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-xl font-bold mb-4">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-2">Deploy</h3>
                <p className="text-blue-100">
                  Generate Terraform modules and deploy directly to AWS with one click
                </p>
              </div>
            </div>
            <div className="mt-8 text-center">
              <button
                onClick={() => navigate('/projects/new')}
                className="rounded-xl bg-white px-8 py-3 text-base font-semibold text-blue-700 shadow-lg transition hover:bg-blue-50 hover:shadow-xl"
              >
                Get Started Now
              </button>
            </div>
          </div>
        </section>

        {/* Platform Stats */}
        <section className="mt-12">
          <div className="rounded-3xl bg-white/80 px-8 py-12 shadow-xl ring-1 ring-blue-200/50 dark:bg-slate-900/80 dark:ring-blue-800/50 backdrop-blur-sm">
            <h2 className="text-3xl font-bold text-center mb-10 text-slate-900 dark:text-white">Platform Statistics</h2>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/30 dark:to-slate-900 border border-blue-200/50 dark:border-blue-800/50">
                <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">99.9%</div>
                <div className="text-slate-600 dark:text-slate-400">Uptime</div>
              </div>
              <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/30 dark:to-slate-900 border border-blue-200/50 dark:border-blue-800/50">
                <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">&lt;2s</div>
                <div className="text-slate-600 dark:text-slate-400">Average Response Time</div>
              </div>
              <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/30 dark:to-slate-900 border border-blue-200/50 dark:border-blue-800/50">
                <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">24/7</div>
                <div className="text-slate-600 dark:text-slate-400">Support Available</div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default WelcomePage

