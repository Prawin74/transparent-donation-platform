import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './LoginPremium.css';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsSubmitting(true);
    setError('');

    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      navigate('/'); // App.js will handle role-based redirect
    } else {
      /* NGO verification temporarily disabled
      if (result.pendingVerification) {
        navigate('/ngo-pending');
      } else {
      */
      setError(result.error);
      // }
    }
  };

  return (
    <div className="login-premium-wrapper">
      {/* Background Elements */}
      <div className="login-bg-orb orb-1"></div>
      <div className="login-bg-orb orb-2"></div>
      <div className="login-bg-orb orb-3"></div>

      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">GlobalGive</h1>
          <h2>Welcome Back</h2>
          <p>Sign in to your donation dashboard</p>
        </div>

        <form className="login-form" onSubmit={handleLogin}>
          {error && (
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#fca5a5', padding: '10px', borderRadius: '6px', marginBottom: '16px', fontSize: '13px', textAlign: 'center' }}>
              {error}
            </div>
          )}
          <div className="input-group">
            <input
              type="email"
              placeholder="Email Address"
              className="login-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="button" className="forgot-password-link" style={{
            background: 'none', border: 'none', color: '#94a3b8',
            fontSize: '13px', textAlign: 'right', cursor: 'pointer', padding: 0
          }}>
            Forgot Password?
          </button>

          <button type="submit" className="login-btn">
            {isSubmitting ? 'Signing In...' : 'Login'}
          </button>
        </form>

        <div className="signup-cta">
          <p>New to GlobalGive?</p>
          <button className="signup-btn" onClick={() => navigate('/signup')}>
            Create an Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
