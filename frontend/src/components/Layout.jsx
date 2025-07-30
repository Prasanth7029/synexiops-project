// src/components/Layout.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Moon, Sun, Menu, X } from 'lucide-react'; // Icons

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">SynexiOps Dashboard</h1>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-4 items-center">
            <span>👤 {user?.username || 'Guest'}</span>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="hover:text-blue-500 transition"
              aria-label="Toggle Theme"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
            >
              Logout
            </button>
          </nav>

          {/* Mobile Toggle */}
          <div className="md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-700 dark:text-white">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-2 px-4 space-y-2">
            <span>👤 {user?.username || 'Guest'}</span>
            <div className="flex space-x-4 items-center">
              <button onClick={() => setDarkMode(!darkMode)} aria-label="Toggle Theme">
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow px-4 py-6">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-200 dark:bg-gray-800 text-center p-4 text-sm text-gray-600 dark:text-gray-400">
        © {new Date().getFullYear()} SynexiOps. Built with 💙 locally.
      </footer>
    </div>
  );
};

export default Layout;
