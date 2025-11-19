import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthModal from '../components/AuthModal'
import CloudInfrastructure3D from '../components/CloudInfrastructure3D'
import LoginForm from '../components/LoginForm'
import Logo from '../components/Logo'
import SignupForm from '../components/SignupForm'
import ThemeToggle from '../components/ThemeToggle'

type AuthMode = 'signin' | 'signup' | null

const features = [
  { 
    title: 'AI-Powered Analysis', 
    description: 'Advanced AI analyzes your architecture diagrams and extracts infrastructure components automatically.',
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    )
  },
  { 
    title: 'Terraform Generation', 
    description: 'Automatically generate production-ready Terraform modules from your diagrams.',
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    )
  },
  { 
    title: 'AWS Deployment', 
    description: 'One-click deployment to AWS with automated infrastructure provisioning.',
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
      </svg>
    )
  },
]

function HomePage() {
  const navigate = useNavigate()
  const [modalMode, setModalMode] = useState<AuthMode>(null)

  const closeModal = () => setModalMode(null)

  const handleLoginSuccess = () => {
    setModalMode(null)
    navigate('/dashboard', { replace: true })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-blue-100/50 to-white text-slate-900 dark:from-slate-950 dark:via-blue-950/30 dark:to-slate-950 dark:text-white">
      {/* Header */}
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6">
        <Logo />
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            onClick={() => setModalMode('signin')}
            className="rounded-xl border border-blue-200 bg-white/80 px-5 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-white dark:border-blue-800 dark:bg-slate-900/80 dark:text-blue-400 dark:hover:bg-slate-800"
          >
            Login
          </button>
          <button
            onClick={() => setModalMode('signup')}
            className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:from-blue-700 hover:to-blue-800 hover:shadow-xl"
          >
            Sign Up
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-6 pb-20">
        {/* Hero Section */}
        <section className="relative mt-8 overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500/10 via-blue-600/5 to-blue-700/10 px-8 py-16 shadow-2xl ring-1 ring-blue-200/50 dark:from-blue-900/20 dark:via-blue-800/10 dark:to-blue-900/20 dark:ring-blue-800/50">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233b82f6' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>
          
          <div className="relative z-10">
            <p className="text-sm uppercase tracking-[0.5em] text-blue-600 dark:text-blue-400 font-medium">
              Cloud Infrastructure Automation
            </p>
            <h1 className="mt-6 text-5xl font-bold leading-tight text-slate-900 md:text-6xl lg:text-7xl dark:text-white">
              Creating the most efficient{' '}
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent dark:from-blue-400 dark:to-blue-600">
                AI infrastructure
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              Upload your architecture diagram, validate it visually, then deploy the same blueprint to
              AWS. Draw2Deploy keeps designers, DevOps, and stakeholders aligned with automated Terraform generation.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <button
                className="rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-4 text-base font-semibold text-white shadow-xl transition hover:from-blue-700 hover:to-blue-800 hover:shadow-2xl hover:scale-105"
                onClick={() => setModalMode('signup')}
              >
                Start Designing
              </button>
              <button
                className="rounded-2xl border-2 border-blue-300 bg-white/80 px-8 py-4 text-base font-semibold text-blue-700 transition hover:bg-white hover:border-blue-400 dark:border-blue-700 dark:bg-slate-900/80 dark:text-blue-400 dark:hover:bg-slate-800"
                onClick={() => setModalMode('signin')}
              >
                View Dashboard
              </button>
            </div>
          </div>
          
          {/* 3D Graphics with hover effect */}
          <div className="relative mt-12 h-64 overflow-hidden rounded-2xl group cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-blue-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
            <CloudInfrastructure3D className="w-full h-full transition-transform duration-700 group-hover:scale-110 group-hover:rotate-2" />
          </div>
        </section>

        {/* Draw2Deploy Cloud Section */}
        <section className="mt-16 mx-auto max-w-5xl rounded-3xl bg-white/80 px-8 py-12 shadow-xl ring-1 ring-blue-200/50 dark:bg-slate-900/80 dark:ring-blue-800/50 backdrop-blur-sm">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              Draw2Deploy AI Cloud
            </h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              GPU-powered AI analysis with reliable performance, scalable infrastructure, and cost efficiency.
              Transform your diagrams into production-ready infrastructure code.
            </p>
          </div>
          
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="group relative overflow-hidden rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-6 shadow-lg transition-all duration-300 hover:border-blue-400 hover:shadow-2xl hover:scale-105 hover:-translate-y-1 dark:border-blue-800 dark:from-blue-950/30 dark:to-slate-900">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-600/0 group-hover:from-blue-500/10 group-hover:to-blue-600/10 transition-all duration-300"></div>
              <div className="relative mb-4 inline-flex rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 p-3 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="relative text-xl font-semibold text-slate-900 dark:text-white">Reliability</h3>
              <p className="relative mt-2 text-sm text-slate-600 dark:text-slate-400">
                Enterprise-grade infrastructure with automated validation and error checking.
              </p>
            </div>
            
            <div className="group relative overflow-hidden rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-6 shadow-lg transition-all duration-300 hover:border-blue-400 hover:shadow-2xl hover:scale-105 hover:-translate-y-1 dark:border-blue-800 dark:from-blue-950/30 dark:to-slate-900">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-600/0 group-hover:from-blue-500/10 group-hover:to-blue-600/10 transition-all duration-300"></div>
              <div className="relative mb-4 inline-flex rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 p-3 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="relative text-xl font-semibold text-slate-900 dark:text-white">Performance</h3>
              <p className="relative mt-2 text-sm text-slate-600 dark:text-slate-400">
                Fast AI analysis and instant Terraform generation for rapid deployment cycles.
              </p>
            </div>
            
            <div className="group relative overflow-hidden rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-6 shadow-lg transition-all duration-300 hover:border-blue-400 hover:shadow-2xl hover:scale-105 hover:-translate-y-1 dark:border-blue-800 dark:from-blue-950/30 dark:to-slate-900">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-600/0 group-hover:from-blue-500/10 group-hover:to-blue-600/10 transition-all duration-300"></div>
              <div className="relative mb-4 inline-flex rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 p-3 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="relative text-xl font-semibold text-slate-900 dark:text-white">Cost Efficiency</h3>
              <p className="relative mt-2 text-sm text-slate-600 dark:text-slate-400">
                Optimize infrastructure costs with automated resource allocation and best practices.
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="mt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              Comprehensive Infrastructure Automation
            </h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
              Advanced AI-powered tools to transform your architecture diagrams into production infrastructure
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-3xl border border-blue-200/50 bg-white/60 p-8 shadow-lg transition-all hover:border-blue-400 hover:shadow-xl hover:scale-105 dark:border-blue-800/50 dark:bg-slate-900/60"
              >
                <div className="mb-6 inline-flex rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-4 text-white shadow-lg">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <AuthModal open={modalMode === 'signin'} title="Sign in" onClose={closeModal}>
        <LoginForm onSuccess={handleLoginSuccess} showHeading={false} />
      </AuthModal>

      <AuthModal open={modalMode === 'signup'} title="Create account" onClose={closeModal}>
        <SignupForm showHeading={false} />
      </AuthModal>
    </div>
  )
}

export default HomePage
