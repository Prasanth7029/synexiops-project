// src/pages/Dashboard.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import InventoryList from '../pages/InventoryList'; // ✅ Import InventoryList
import Layout from '../components/Layout'; // ✅ Wrap inside Layout

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <Layout>
      {/* Welcome Section */}
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome, {user?.username || 'Guest'} 👋
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          You're logged in as <span className="font-semibold">{user?.email}</span>
        </p>

        <div className="mt-8 text-left">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">What’s Next?</h2>
          <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-1">
            <li>🔍 View and manage Inventory</li>
            <li>📦 Create new Orders</li>
            <li>📊 Analyze Sales & Trends (Coming soon!)</li>
            <li>🔔 Get Notified for Low Stock</li>
            <li>🧠 AI Predictions & Insights (Sprint 3)</li>
          </ul>
        </div>
      </div>

      {/* Inventory List Section */}
      <InventoryList />
    </Layout>
  );
};

export default Dashboard;
