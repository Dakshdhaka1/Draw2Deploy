import { Link } from 'react-router-dom'
import AuthShell from '../components/AuthShell'
import SignupForm from '../components/SignupForm'

function SignupPage() {
  return (
    <AuthShell
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700">
            Sign in
          </Link>
        </>
      }
    >
      <SignupForm />
    </AuthShell>
  )
}

export default SignupPage

