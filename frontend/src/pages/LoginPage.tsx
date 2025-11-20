import { Link, useNavigate } from 'react-router-dom'
import AuthShell from '../components/AuthShell'
import LoginForm from '../components/LoginForm'

function LoginPage() {
  const navigate = useNavigate()

  return (
    <AuthShell
      footer={
        <>
          Need an account?{' '}
          <Link to="/signup" className="font-semibold text-brand-600 hover:text-brand-700">
            Sign up
          </Link>
        </>
      }
    >
      <LoginForm onSuccess={() => navigate('/welcome', { replace: true })} />
    </AuthShell>
  )
}

export default LoginPage

