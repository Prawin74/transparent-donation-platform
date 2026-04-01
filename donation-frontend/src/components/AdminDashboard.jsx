import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const { token, logout } = useAuth();
    const [pendingNgos, setPendingNgos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionMessage, setActionMessage] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        fetchPendingNgos();
    }, []);

    const fetchPendingNgos = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/auth/pending-ngos', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                setPendingNgos(data);
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError('Failed to fetch pending NGOs');
        } finally {
            setLoading(false);
        }
    };

    const approveNgo = async (id, name) => {
        try {
            const response = await fetch(`http://localhost:3001/api/auth/verify-ngo/${id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                setActionMessage(`Successfully approved ${name}`);
                // Remove from list
                setPendingNgos(pendingNgos.filter(ngo => ngo._id !== id));
                setTimeout(() => setActionMessage(''), 3000);
            } else {
                const data = await response.json();
                setError(data.error);
            }
        } catch (err) {
            setError('Failed to approve NGO');
        }
    };

    return (
        <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto', color: '#e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1>Admin Dashboard</h1>
                <button onClick={logout} className="btn-secondary" style={{ padding: '8px 16px' }}>Sign Out</button>
            </div>

            <div className="dashboard-card" style={{ background: 'rgba(30, 41, 59, 0.7)', borderRadius: '16px', padding: '24px' }}>
                <h2>Pending NGO Verifications</h2>
                <p style={{ color: '#94a3b8', marginBottom: '20px' }}>Review and approve NGO account requests.</p>

                {error && <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#fca5a5', padding: '12px', borderRadius: '8px', marginBottom: '20px' }}>{error}</div>}
                {actionMessage && <div style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#86efac', padding: '12px', borderRadius: '8px', marginBottom: '20px' }}>{actionMessage}</div>}

                {loading ? (
                    <p>Loading requests...</p>
                ) : pendingNgos.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8', border: '1px dashed #475569', borderRadius: '8px' }}>
                        No pending verifications at this time.
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '16px' }}>
                        {pendingNgos.map(ngo => (
                            <div key={ngo._id} style={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                background: 'rgba(15, 23, 42, 0.6)', padding: '20px', borderRadius: '12px', border: '1px solid #334155'
                            }}>
                                <div>
                                    <h3 style={{ margin: '0 0 4px 0', fontSize: '18px' }}>{ngo.name}</h3>
                                    <div style={{ color: '#94a3b8', fontSize: '14px' }}>{ngo.email}</div>
                                    <div style={{ color: '#64748b', fontSize: '12px', marginTop: '4px' }}>ID: {ngo._id}</div>
                                </div>
                                <button
                                    onClick={() => approveNgo(ngo._id, ngo.name)}
                                    style={{
                                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                        color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '500'
                                    }}
                                >
                                    Approve Application
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
