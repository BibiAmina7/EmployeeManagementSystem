import React, { useState } from "react";
import api from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Function to fill demo credentials
  const fillDemoCredentials = () => {
    setUsername("admin");
    setPassword("admin123");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post("/auth/login", {
        username,
        password,
      });

      const token = response.data.token;
      localStorage.setItem("authToken", token);
      localStorage.setItem("username", username);

      onLogin({ username, token });
      navigate("/"); // redirect to dashboard
    } catch (err) {
      console.error("Login failed:", err);
      setError("Invalid username or password");
    }
  };

  return (
    <div className="container mt-5">
      <h3 className="text-center mb-4">Employee Management System Login</h3>

      {/* Demo credentials section */}
      <div className="text-center mb-3">
        <p>
          <strong>Demo Credentials:</strong> <br />
          Username: <code>admin</code>, Password: <code>admin123</code>
        </p>
        <button
          className="btn btn-secondary mb-3"
          onClick={fillDemoCredentials}
        >
          Fill Demo Credentials
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mx-auto border rounded p-4 shadow w-50"
      >
        <div className="mb-3">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="form-control"
            required
          />
        </div>
        {error && <div className="text-danger mb-3">{error}</div>}
        <button type="submit" className="btn btn-primary w-100">
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
