import React, { useState, useContext } from 'react';
import { AuthAPI } from '../lib/axios'; // ✅ Use AuthAPI instead of default API
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await AuthAPI.post('/login', formData); // 🔥 AuthAPI to /login
      const { token, user } = res.data;
      login(token, user);
      navigate('/dashboard'); // 🔁 Redirect on success
    } catch (err) {
      console.error('Login failed', err);
      alert('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen min-w-screen w-full flex items-center justify-center px-4 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-gray-900 dark:to-black">
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-900 dark:text-white">
          SynexiOps Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Email</label>
            <input
              type="email"
              name="email"
              className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-white"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Password</label>
            <input
              type="password"
              name="password"
              className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-white"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 rounded-md transition duration-200"
          >
            Log In
          </button>
        </form>
        <p className="text-sm text-center text-gray-600 dark:text-gray-300 mt-4">
          Don't have an account?{' '}
          <a href="/signup" className="text-cyan-600 hover:underline">Sign Up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
