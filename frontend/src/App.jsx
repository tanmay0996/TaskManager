import React from 'react';
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <nav className="flex items-center justify-between px-4 py-2 bg-white shadow">
      <Link to="/" className="font-semibold">
        Task Manager
      </Link>
      <div className="space-x-3 text-sm">
        {!isAuthed && (
          <>
            <Link to="/login" className="text-blue-600">
              Login
            </Link>
            <Link to="/register" className="text-blue-600">
              Register
            </Link>
          </>
        )}
        {isAuthed && (
          <button
            onClick={handleLogout}
            className="px-2 py-1 rounded bg-red-500 text-white"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <div className="min-h-screen">
      <Nav />
      <main className="max-w-2xl mx-auto p-4">
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
