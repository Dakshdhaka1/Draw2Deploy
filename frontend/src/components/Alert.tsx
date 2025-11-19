type AlertProps = {
  variant?: 'success' | 'error' | 'info'
  message: string
}

const variantStyles: Record<Required<AlertProps>['variant'], string> = {
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-700',
  error: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-700',
  info: 'bg-brand-50 text-brand-800 border-brand-200 dark:bg-brand-900/20 dark:text-brand-300 dark:border-brand-700',
}

function Alert({ variant = 'info', message }: AlertProps) {
  return (
    <div className={`rounded-lg border px-4 py-3 text-sm font-medium ${variantStyles[variant]}`}>
      {message}
    </div>
  )
}

export default Alert
