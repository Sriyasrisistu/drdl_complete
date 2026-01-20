import React, { useState } from 'react';
import ApiService from '../services/apiService';
import './LoginForm.css';

const LoginForm = ({ onLoginSuccess }) => {
  const [personnelNo, setPersonnelNo] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await ApiService.login(personnelNo, password);
      if (response.success) {
        onLoginSuccess(response.employee);
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (err) {
      setError('Failed to login. Please check backend connection.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>DRDL Safety Fire</h1>
        <h2>Request Management System</h2>
        
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="personnelNo">Personnel Number</label>
            <input
              type="text"
              id="personnelNo"
              value={personnelNo}
              onChange={(e) => setPersonnelNo(e.target.value)}
              placeholder="Enter your personnel number"
              required
              disabled={loading}
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={loading} className="login-btn">
            {loading ? 'Signing In...' : 'SIGN IN'}
          </button>
        </form>

        <div className="demo-credentials">
          <p>Demo Account</p>
          <p>Personnel No: <code>001234</code></p>
          <p>Password: <code>pass123</code></p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
