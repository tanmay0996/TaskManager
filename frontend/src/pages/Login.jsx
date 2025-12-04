import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, Lock, User, AlertCircle, Sparkles } from 'lucide-react';
import { z } from 'zod';
import api from '../utils/api.js';

// Zod validation schema
const loginSchema = z.object({
  username: z.string()
    .min(1, 'Username is required')
    .max(20, 'Username must be less than 20 characters'),
  password: z.string()
    .min(1, 'Password is required')
    .max(50, 'Password must be less than 50 characters')
});

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    // Zod validation (only block when there are real issues)
    try {
      loginSchema.parse({ username, password });
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errors = {};
        const issues = err.issues ?? err.errors ?? [];
        issues.forEach((issue) => {
          const key = issue.path && issue.path.length ? issue.path[0] : 'username';
          errors[key] = issue.message || 'Invalid value';
        });
        setFieldErrors(errors);
        return;
      }
      // eslint-disable-next-line no-console
      console.error('Login validation error (non-Zod)', err);
      setError('Unexpected validation error, check console for details');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/login', { username, password });
      const token = res.data?.token;
      if (token) {
        try {
          localStorage.setItem('token', token);
        } catch {
          // ignore storage errors (e.g. in tests)
        }
        const from = location.state?.from?.pathname || '/';
        navigate(from, { replace: true });
      } else {
        setError('No token returned from server');
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Login request error', err);
      const message =
        err?.response?.data?.error ||
        err?.message ||
        'Login failed, see console for details';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-900 flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 w-full max-w-md relative z-10 border border-white/20"
      >
        {/* Header */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="flex justify-center mb-6"
        >
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-4 rounded-full">
            <LogIn className="w-8 h-8 text-white" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold text-center text-white mb-2"
        >
          Welcome Back
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-purple-200 mb-8 flex items-center justify-center gap-1"
        >
          Sign in to continue <Sparkles className="w-4 h-4" />
        </motion.p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username Field */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <label
              htmlFor="login-username"
              className="block text-sm font-medium text-purple-200 mb-2"
            >
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-300" />
              <input
                id="login-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-purple-300 transition-all"
                placeholder="Enter your username"
              />
            </div>
            {fieldErrors.username && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-pink-300 text-sm mt-1 flex items-center gap-1"
              >
                <AlertCircle className="w-4 h-4" />
                {fieldErrors.username}
              </motion.p>
            )}
          </motion.div>

          {/* Password Field */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <label
              htmlFor="login-password"
              className="block text-sm font-medium text-purple-200 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-300" />
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-purple-300 transition-all"
                placeholder="Enter your password"
              />
            </div>
            {fieldErrors.password && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-pink-300 text-sm mt-1 flex items-center gap-1"
              >
                <AlertCircle className="w-4 h-4" />
                {fieldErrors.password}
              </motion.p>
            )}
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-pink-500/20 border border-pink-500/50 rounded-lg p-3 flex items-start gap-2"
            >
              <AlertCircle className="w-5 h-5 text-pink-300 flex-shrink-0 mt-0.5" />
              <p className="text-pink-200 text-sm">{error}</p>
            </motion.div>
          )}

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
                Logging in...
              </span>
            ) : (
              'Login'
            )}
          </motion.button>

          {/* Register Link */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center text-purple-200 text-sm"
          >
            Need an account?{' '}
            <Link
              to="/register"
              className="text-pink-300 hover:text-pink-200 font-semibold transition-colors underline decoration-pink-300/50 hover:decoration-pink-200"
            >
              Register
            </Link>
          </motion.p>
        </form>
      </motion.div>
    </div>
  );
}
