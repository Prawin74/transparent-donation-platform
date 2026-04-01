import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/GlobalTheme.css';

const Register = () => {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('donor'); // Default role
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!name || !email || !password) {
            setError("All fields are required.");
            return;
        }

        setIsSubmitting(true);
        setError('');

        const result = await register(name, email, password, role);

        setIsSubmitting(false);

        if (result.success) {
            // Redirection logic will be handled in App.js based on user state
            // But for clarity, we can check role here too or rely on user state change
            // For now, let's just trigger navigation to home which will redirect
            navigate('/');
        } else {
            setError(result.error);
        }
    };

    return (
        <div className="page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '90vh' }}>
            <div className="card-premium animate-fade-in" style={{ width: '100%', maxWidth: '450px' }}>

                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <h1 className="site-title" style={{ fontSize: '28px', marginBottom: '8px' }}>GlobalGive</h1>
                    <h2>Create Account</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Choose your role to get started</p>
                </div>

                {error && (
                    <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#fca5a5', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', textAlign: 'center' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                    {/* Role Selection */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '8px' }}>
                        <button
                            type="button"
                            className={`btn-secondary ${role === 'donor' ? 'active-role' : ''}`}
                            style={{
                                border: role === 'donor' ? '1px solid #3b82f6' : '1px solid transparent',
                                background: role === 'donor' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255,255,255,0.05)'
                            }}
                            onClick={() => setRole('donor')}
                        >
                            Donor
                        </button>
                        <button
                            type="button"
                            className={`btn-secondary ${role === 'ngo' ? 'active-role' : ''}`}
                            style={{
                                border: role === 'ngo' ? '1px solid #10b981' : '1px solid transparent',
                                background: role === 'ngo' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.05)'
                            }}
                            onClick={() => setRole('ngo')}
                        >
                            NGO
                        </button>
                    </div>
                    {role === 'ngo' && (
                        <p style={{ fontSize: '13px', color: '#10b981', margin: '-10px 0 0 0', textAlign: 'center' }}>
                            ℹ️ NGO accounts are auto-verified for development.
                        </p>
                    )}

                    <div>
                        <label className="label-premium">Full Name / Org Name</label>
                        <input
                            type="text"
                            className="input-premium"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={role === 'ngo' ? "Organization Name" : "Your Name"}
                        />
                    </div>

                    <div>
                        <label className="label-premium">Email Address</label>
                        <input
                            type="email"
                            className="input-premium"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@example.com"
                        />
                    </div>

                    <div>
                        <label className="label-premium">Password</label>
                        <input
                            type="password"
                            className="input-premium"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Create a strong password"
                        />
                    </div>

                    <button type="submit" className="btn-premium" disabled={isSubmitting}>
                        {isSubmitting ? 'Creating Account...' : `Sign Up as ${role === 'donor' ? 'Donor' : 'NGO'}`}
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

export default Register;
