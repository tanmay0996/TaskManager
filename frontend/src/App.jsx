import React from 'react';
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, LogIn, UserPlus, LogOut, Sparkles } from 'lucide-react';
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import Tasks from './pages/Tasks.jsx';

function useAuth() {
  return !!localStorage.getItem('token');
}

function ProtectedRoute({ children }) {
  const isAuthed = useAuth();
  const location = useLocation();
  if (!isAuthed) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
}

function Nav() {
  const isAuthed = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="sticky top-0 z-50 bg-gradient-to-r from-purple-900 via-indigo-900 to-pink-900 backdrop-blur-lg border-b border-white/10 shadow-2xl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="bg-gradient-to-br from-purple-500 to-pink-500 p-2.5 rounded-xl shadow-lg"
            >
              <Zap className="w-6 h-6 text-white" fill="white" />
            </motion.div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-white group-hover:text-purple-200 transition-colors">
                Task Manager
              </span>
              <Sparkles className="w-4 h-4 text-yellow-300 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-3">
            {!isAuthed ? (
              <>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/login"
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      location.pathname === '/login'
                        ? 'bg-white/20 text-white'
                        : 'text-purple-200 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <LogIn className="w-4 h-4" />
                    <span className="hidden sm:inline">Login</span>
                  </Link>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/register"
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      location.pathname === '/register'
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    <UserPlus className="w-4 h-4" />
                    <span className="hidden sm:inline">Register</span>
                  </Link>
                </motion.div>
              </>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-pink-500/80 hover:bg-pink-600 text-white transition-all shadow-lg hover:shadow-xl"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Decorative gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 opacity-50" />
    </motion.nav>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-900">
      <Nav />
      <main>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Tasks />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}