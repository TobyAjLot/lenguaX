import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Loader2, Eye, EyeOff, X } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

type AuthMode = 'login' | 'signup';

const AuthPage = () => {
  const navigate = useNavigate();
  const { signIn, signUp, loading, error, clearError, user } = useAuthStore();

  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Load remember me preference
  useEffect(() => {
    const remembered = localStorage.getItem('rememberMe') === 'true';
    setRememberMe(remembered);
  }, []);

  // Save remember me preference
  useEffect(() => {
    localStorage.setItem('rememberMe', rememberMe.toString());
  }, [rememberMe]);

  const handleModeSwitch = (newMode: AuthMode) => {
    setMode(newMode);
    clearError();
    setEmail('');
    setPassword('');
    setFullName('');
    setShowPassword(false);
  };

  const handleInputChange = () => {
    if (error) {
      clearError();
    }
  };

  const getPasswordStrength = (pwd: string): { strength: number; color: string; label: string } => {
    if (pwd.length === 0) return { strength: 0, color: 'bg-gray-200', label: '' };
    if (pwd.length < 6) return { strength: 1, color: 'bg-red-500', label: 'Weak' };
    if (pwd.length < 8) return { strength: 2, color: 'bg-yellow-500', label: 'Fair' };
    if (pwd.length < 12) return { strength: 3, color: 'bg-blue-500', label: 'Good' };
    return { strength: 4, color: 'bg-green-500', label: 'Strong' };
  };

  const passwordStrength = mode === 'signup' ? getPasswordStrength(password) : null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearError();

    try {
      if (mode === 'login') {
        await signIn(email, password);
      } else {
        if (password.length < 6) {
          return;
        }
        await signUp(email, password, fullName);
      }
      navigate('/dashboard');
    } catch (err) {
      // Error is handled by the store
      console.error('Auth error:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          {/* Logo/Title */}
          <div className="text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              LenguaX
            </h1>
            <p className="text-gray-600 mt-2">Connect. Learn. Exchange.</p>
          </div>

          {/* Tab System */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => handleModeSwitch('login')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                mode === 'login'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              aria-label="Switch to login mode"
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => handleModeSwitch('signup')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                mode === 'signup'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              aria-label="Switch to signup mode"
            >
              Sign Up
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3 animate-in fade-in duration-200">
              <div className="flex-1">
                <p className="text-sm text-red-800">{error}</p>
              </div>
              <button
                type="button"
                onClick={clearError}
                className="text-red-600 hover:text-red-800 transition-colors"
                aria-label="Close error message"
              >
                <X size={18} />
              </button>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name (Signup only) */}
            {mode === 'signup' && (
              <div className="space-y-1">
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="fullName"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      handleInputChange();
                    }}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Enter your full name"
                    aria-label="Full name"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div className="space-y-1">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    handleInputChange();
                  }}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="Enter your email"
                  aria-label="Email address"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={mode === 'signup' ? 6 : undefined}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    handleInputChange();
                  }}
                  className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder={mode === 'signup' ? 'At least 6 characters' : 'Enter your password'}
                  aria-label="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {/* Password Strength Indicator (Signup only) */}
              {mode === 'signup' && password && passwordStrength && (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                        style={{ width: `${(passwordStrength.strength / 4) * 100}%` }}
                      />
                    </div>
                    {passwordStrength.label && (
                      <span className={`text-xs font-medium ${passwordStrength.color.replace('bg-', 'text-')}`}>
                        {passwordStrength.label}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Remember Me (Login only) */}
            {mode === 'login' && (
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                </>
              ) : (
                mode === 'login' ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="text-center space-y-2">
            {mode === 'login' ? (
              <>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    // TODO: Implement forgot password
                  }}
                >
                  Forgot password?
                </a>
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => handleModeSwitch('signup')}
                    className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    Sign up
                  </button>
                </p>
              </>
            ) : (
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => handleModeSwitch('login')}
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;

