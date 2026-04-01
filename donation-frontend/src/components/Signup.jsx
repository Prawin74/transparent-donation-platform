import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/GlobalTheme.css';

const Signup = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignup = (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) return; // Basic validation

    setIsSubmitting(true);
    setTimeout(() => {
      login({ email, name });
      setIsSubmitting(false);
      navigate('/');
    }, 1000);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div className="card-premium animate-fade-in" style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2>Create Account</h2>
          <p>Join the next generation of giving</p>
        </div>

        <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label className="label-premium">Full Name</label>
            <input
              type="text"
              className="input-premium"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: John Doe"
            />
          </div>

          <div>
            <label className="label-premium">Email Address</label>
            <input
              type="email"
              className="input-premium"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="label-premium">Password</label>
            <input
              type="password"
              className="input-premium"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
            />
          </div>

          <div>
            <label className="label-premium">Confirm Password</label>
            <input
              type="password"
              className="input-premium"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
            />
          </div>

          <button type="submit" className="btn-premium" disabled={isSubmitting}>
            {isSubmitting ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', paddingTop: '24px', borderTop: '1px solid var(--glass-border)' }}>
          <p style={{ fontSize: '14px', marginBottom: '12px' }}>Already have an account?</p>
          <button
            className="btn-secondary"
            style={{ width: '100%' }}
            onClick={() => navigate('/login')}
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
