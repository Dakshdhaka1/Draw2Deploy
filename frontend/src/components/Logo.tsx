import { Link } from 'react-router-dom'

type LogoProps = {
  showText?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

function Logo({ showText = true, size = 'md', className = '' }: LogoProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  }

  return (
    <Link to="/" className={`flex items-center gap-3 ${className}`}>
      <div className={`${sizeClasses[size]} flex-shrink-0`}>
        <img 
          src="/logo.svg" 
          alt="Draw2Deploy Logo" 
          className="h-full w-full"
        />
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className="text-lg font-semibold text-slate-900 dark:text-white">Draw2Deploy</span>
          <p className="text-xs font-normal text-slate-500 dark:text-slate-400">
            Upload diagram → Deploy to AWS
          </p>
        </div>
      )}
    </Link>
  )
}

export default Logo

