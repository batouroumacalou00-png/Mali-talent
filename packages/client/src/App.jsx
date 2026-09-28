import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/Login.jsx';
import RegisterPage from './pages/Register.jsx';
import ProfileSetupPage from './pages/ProfileSetup.jsx';
import DashboardPage from './pages/Dashboard.jsx';

const tokenKey = 'mali_talent_token';

function getToken() {
  return localStorage.getItem(tokenKey);
}

function PrivateRoute({ children }) {
  const token = getToken();
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<PrivateRoute><ProfileSetupPage /></PrivateRoute>} />
        <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
