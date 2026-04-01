import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import Donate from './Donate'; // Reuse existing donation component
import TransactionList from './TransactionList';
import '../styles/GlobalTheme.css';

const DonorDashboard = () => {
    const { user } = useAuth();

    return (
        <div className="page-container">
            <div className="section-header fade-in-up">
                <h1 style={{ color: 'var(--text-primary)' }}>Welcome, {user?.name}</h1>
                <p>Start making an impact today.</p>
            </div>

            <div className="dashboard-grid fade-in-up" style={{ animationDelay: '0.1s' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <Donate />
                    <TransactionList />
                </div>

                {/* Placeholder for Impact Stats */}
                <div className="card-premium">
                    <h2>Your Impact</h2>
                    <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
                        <div className="stat-box" style={{ background: 'var(--bg-main)', border: '1px solid var(--glass-border)', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
                            <h3 style={{ fontSize: '24px', color: '#3b82f6', marginBottom: '4px' }}>$0</h3>
                            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Total Donated</p>
                        </div>
                        <div className="stat-box" style={{ background: 'var(--bg-main)', border: '1px solid var(--glass-border)', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
                            <h3 style={{ fontSize: '24px', color: '#10b981', marginBottom: '4px' }}>0</h3>
                            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Campaigns Supported</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DonorDashboard;
