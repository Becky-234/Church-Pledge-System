import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Church, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'

const Login = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      // Trim email + lowercase (passwords NOT trimmed)
      const email = data.email.trim().toLowerCase()
      await login(email, data.password)
      toast.success('Welcome back!')
      navigate('/')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500 rounded-2xl mb-4 shadow-lg">
            <Church className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-secondary-800">Church Pledge</h1>
          <p className="text-sm text-secondary-500 mt-1">Management System</p>
        </div>

        {/* Card */}
        <div className="card p-8">
          <h2 className="text-xl font-bold text-secondary-800 mb-1">
            Welcome back
          </h2>
          <p className="text-sm text-secondary-500 mb-6">
            Sign in to your account to continue
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
                <input
                  type="email"
                  placeholder="admin@church.com"
                  className="input pl-10"
                  autoComplete="email"
                  {...register('email', {
                    required: 'Email is required',
                    setValueAs: (v) => v?.trim().toLowerCase() || '',
                  })}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="input pl-10 pr-10"
                  autoComplete="current-password"
                  {...register('password', { required: 'Password is required' })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full mt-2"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-secondary-500">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-primary-500 font-medium hover:underline"
              >
                Register
              </Link>
            </p>
          </div>

          {/* Demo credentials */}
          <div className="mt-6 p-3 bg-secondary-50 rounded-lg border border-secondary-100">
            <p className="text-xs font-semibold text-secondary-600 mb-2">
              Demo Credentials:
            </p>
            <p className="text-xs text-secondary-500">
              <strong>Admin:</strong> admin@church.com / Admin@123
            </p>
            <p className="text-xs text-secondary-500">
              <strong>Pastor:</strong> pastor@church.com / Pastor@123
            </p>
            <p className="text-xs text-secondary-500">
              <strong>Treasurer:</strong> treasurer@church.com / Treasurer@123
            </p>
            <p className="text-xs text-secondary-500">
              <strong>Member:</strong> member@church.com / Member@123
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login