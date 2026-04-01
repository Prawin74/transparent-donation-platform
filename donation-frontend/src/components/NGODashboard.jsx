import React, { useState, useEffect } from 'react';
import '../styles/NGODashboard.css';
import { TrendingUp, Users, AlertCircle, CheckCircle } from 'lucide-react';

import { useSocket } from '../contexts/SocketContext';

const NGODashboardOverview = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const socket = useSocket();
    const [stats, setStats] = useState({
        totalRaised: 0,
        activeDonors: 0,
        pendingWithdrawals: 0
    });

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const token = localStorage.getItem('globalgive_token');
                const response = await fetch('http://localhost:3001/api/campaigns/my', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setCampaigns(data);

                    // simple calculation for stats based on data
                    const raised = data.reduce((acc, curr) => acc + (curr.raisedAmount || 0), 0);
                    setStats(prev => ({ ...prev, totalRaised: raised }));
                }
            } catch (error) {
                console.error("Failed to fetch campaigns", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCampaigns();
    }, []);

    // Socket Listener for Real-time Credits
    useEffect(() => {
        if (!socket) return;

        const handleNewDonation = (data) => {
            // Check if donation belongs to one of my campaigns
            // We need to know which campaigns are mine. `campaigns` state has this.
            const myCampaign = campaigns.find(c => c._id === data.campaignId);

            if (myCampaign) {
                console.log("Real-time Credit detected:", data);

                // Update Campaign Raised Amount
                setCampaigns(prev => prev.map(c => {
                    if (c._id === data.campaignId) {
                        return { ...c, raisedAmount: (c.raisedAmount || 0) + parseFloat(data.amount) };
                    }
                    return c;
                }));

                // Update Total Raised Stat
                setStats(prev => ({
                    ...prev,
                    totalRaised: prev.totalRaised + parseFloat(data.amount)
                }));
            }
        };

        socket.on('newDonation', handleNewDonation);
        socket.on('donationUpdated', (data) => {
            // If backend emits 'donationUpdated' instead (handled in previous task), we can use that too.
            // But blockchain listener emits 'newDonation'. Let's handle both or ensure consistent event names.
            // Previous task used 'donationUpdated' for database writes. Blockchain listener uses 'newDonation'.
            // Let's rely on handleNewDonation above which is specifically from Listener.
        });

        return () => {
            socket.off('newDonation', handleNewDonation);
        };
    }, [socket, campaigns]);

    return (
        <div className="fade-in-up">
            <div className="dashboard-header">
                <div>
                    <h1 className="page-title">Dashboard Overview</h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Welcome back! Here's what's happening today.</p>
                </div>
                <button className="btn-premium" style={{ height: 'fit-content', padding: '10px 20px' }}>
                    Download Report
                </button>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                        <TrendingUp size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>Total Funds Raised</h3>
                        <p>₹ {stats.totalRaised.toLocaleString()}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
                        <Users size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>Active Donors</h3>
                        {/* Mock data for donors as we don't track unique donors per relationship yet */}
                        <p>1,245</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
                        <AlertCircle size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>Pending Withdrawals</h3>
                        <p>0</p>
                    </div>
                </div>
            </div>

            {/* Recent Activity / My Campaigns */}
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '16px' }}>My Campaigns</h3>
            <div className="card-premium" style={{ padding: '0', overflow: 'hidden' }}>
                {loading ? (
                    <div style={{ padding: '20px', color: 'var(--text-secondary)' }}>Loading campaigns...</div>
                ) : campaigns.length === 0 ? (
                    <div style={{ padding: '20px', color: 'var(--text-secondary)', textAlign: 'center' }}>
                        No campaigns found. Create one to get started!
                    </div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ background: 'var(--bg-main)', color: 'var(--text-secondary)' }}>
                            <tr>
                                <th style={{ padding: '16px' }}>Campaign</th>
                                <th style={{ padding: '16px' }}>Category</th>
                                <th style={{ padding: '16px' }}>Target</th>
                                <th style={{ padding: '16px' }}>Raised</th>
                                <th style={{ padding: '16px' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody style={{ color: 'var(--text-primary)' }}>
                            {campaigns.map((camp) => (
                                <tr key={camp._id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                    <td style={{ padding: '16px' }}>{camp.title}</td>
                                    <td style={{ padding: '16px' }}>{camp.category}</td>
                                    <td style={{ padding: '16px' }}>₹ {camp.targetAmount}</td>
                                    <td style={{ padding: '16px', color: '#10b981' }}>₹ {camp.raisedAmount || 0}</td>
                                    <td style={{ padding: '16px' }}>
                                        <span style={{
                                            padding: '4px 12px',
                                            borderRadius: '20px',
                                            fontSize: '0.85rem',
                                            background: camp.status === 'Active' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(148, 163, 184, 0.2)',
                                            color: camp.status === 'Active' ? '#10b981' : 'var(--text-secondary)'
                                        }}>
                                            {camp.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default NGODashboardOverview;
