import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../styles/GlobalTheme.css';

const NGOPending = () => {
    const { logout } = useAuth();

    return (
        <div className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
            <div className="card-premium fade-in-up" style={{ maxWidth: '500px', textAlign: 'center', padding: '40px' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
                <h1 style={{ marginBottom: '16px' }}>Verification Pending</h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', lineHeight: '1.6' }}>
                    Thank you for registering your organization.
                    <br />
                    Your account is currently under review by our compliance team.
                    You will gain full access to the NGO Dashboard once verified.
                </p>

                <button className="btn-secondary" onClick={logout}>
                    Sign Out
                </button>
            </div>
        </div>
    );
};

export default NGOPending;
