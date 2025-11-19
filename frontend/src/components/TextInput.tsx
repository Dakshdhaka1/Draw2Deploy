import type { InputHTMLAttributes } from 'react'

type TextInputProps = {
  label: string
  error?: string
} & InputHTMLAttributes<HTMLInputElement>

function TextInput({ label, error, className, ...props }: TextInputProps) {
  return (
    <label className="block text-left">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input
        className={`mt-1 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 transition focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200 ${className ?? ''}`}
        {...props}
      />
      {error ? <span className="mt-1 block text-sm text-red-600">{error}</span> : null}
    </label>
  )
}

export default TextInput
