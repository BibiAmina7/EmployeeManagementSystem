// frontend/src/App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import EmployeePage from "./pages/EmployeePage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import NotFound from "./pages/NotFound";
import api from "./api/axiosConfig"; // IMPORT API CONFIG

function App() {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("authToken");
    const username = localStorage.getItem("username");
    return token ? { token, username } : null;
  });

  // Initialize auth token on app start
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      console.log("Auth token initialized on app start");
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    if (userData.token) {
      localStorage.setItem("authToken", userData.token);
      localStorage.setItem("username", userData.username);
      // Update axios headers immediately
      api.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");
    // Remove axios headers
    delete api.defaults.headers.common['Authorization'];
    console.log("User logged out and tokens cleared");
  };

  return (
    <Router>
      <Navbar onLogout={handleLogout} isLoggedIn={!!user} />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" /> : <LoginPage onLogin={handleLogin} />}
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/employees"
          element={user ? <EmployeePage /> : <Navigate to="/login" />}
        />

        {/* 404 Page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;