import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../hooks/useWallet';
import { useTransactionHistory } from '../hooks/useTransactionHistory';
import { LogOut, ExternalLink, ShieldCheck, Heart, Activity, AlertTriangle, PieChart as PieIcon, TrendingUp } from 'lucide-react';
import { explorerLink } from '../utils/contractABI';
import OngoingCampaigns from '../components/OngoingCampaigns';
import { useSocket } from '../contexts/SocketContext';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];

const DonorDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'campaigns'

    const {
        connectWallet,
        switchNetwork,
        isConnected, // From useWallet
        account,
        balance,
        isPolygonAmoy,
        fetchBalance,
        error,
        isConnecting
    } = useWallet();

    const { transactions, stats, loading: historyLoading, error: historyError, refetch } = useTransactionHistory(account);
    const socket = useSocket();

    // Calculate Analytics Data
    const analytics = useMemo(() => {
        if (!transactions || transactions.length === 0) return { trend: [], distribution: [] };

        // 1. Impact Trend (Cumulative)
        const sortedTx = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
        let cumulative = 0;
        const trend = sortedTx.map(tx => {
            cumulative += parseFloat(tx.amount || 0);
            return {
                date: new Date(tx.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
                amount: cumulative
            };
        });

        // 2. Donation Distribution (Pie)
        const distMap = {};
        transactions.forEach(tx => {
            const name = tx.campaignName || 'General';
            distMap[name] = (distMap[name] || 0) + parseFloat(tx.amount || 0);
        });
        const distribution = Object.keys(distMap).map(key => ({
            name: key,
            value: distMap[key]
        }));

        return { trend, distribution };
    }, [transactions]);

    const trustScore = useMemo(() => {
        if (!isConnected || transactions.length === 0) return 0;
        // Mock trust score calculation based on activity
        const base = 80;
        const bonus = Math.min(transactions.length * 2, 19.5);
        return (base + bonus).toFixed(1);
    }, [isConnected, transactions]);

    useEffect(() => {
        if (!socket || !account) return;

        const handleNewDonation = (data) => {
            if (data.donor && data.donor.toLowerCase() === account.toLowerCase()) {
                console.log("Real-time Debit detected:", data);
                refetch();
                fetchBalance(account);
            }
        };

        socket.on('newDonation', handleNewDonation);
        return () => {
            socket.off('newDonation', handleNewDonation);
        };
    }, [socket, account, refetch, fetchBalance]);

    const handleDisconnect = () => {
        navigate('/');
        window.location.reload();
    };

    if (!isConnected) {
        return (
            <div className="page-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
                <h1 style={{ color: 'var(--text-primary)', marginBottom: '16px' }}>Donor Dashboard</h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Please connect your wallet to view your personal dashboard.</p>

                {error && (
                    <div style={{
                        padding: '12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
                        borderRadius: '8px', color: '#ef4444', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px'
                    }}>
                        <AlertTriangle size={16} /> {error}
                    </div>
                )}

                <button
                    onClick={connectWallet}
                    className="btn-premium"
                    disabled={isConnecting}
                    style={{ opacity: isConnecting ? 0.7 : 1 }}
                >
                    {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                </button>
            </div>
        );
    }

    return (
        <div className="page-container fade-in-up">
            {/* Header / Wallet Interface */}
            <div className="dashboard-header" style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'end', flexWrap: 'wrap', gap: '20px' }}>
                <div>
                    <h1 className="page-title" style={{ fontSize: '2rem' }}>My Impact Dashboard</h1>
                    <p className="page-subtitle">Track your contributions and real-time impact.</p>
                </div>

                <div className="card-premium" style={{ padding: '12px 24px', minWidth: '300px', backdropFilter: 'blur(10px)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Wallet Connected</span>
                        {!isPolygonAmoy && (
                            <span style={{ color: '#ef4444', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <AlertTriangle size={14} /> Wrong Network
                            </span>
                        )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #10b981, #3b82f6)' }}></div>
                        <div>
                            <p style={{ margin: 0, fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                                {account?.substring(0, 6)}...{account?.substring(38)}
                            </p>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                {balance ? parseFloat(balance).toFixed(4) : '0.00'} MATIC
                            </p>
                        </div>
                    </div>
                    {!isPolygonAmoy ? (
                        <button onClick={switchNetwork} className="btn-secondary" style={{ width: '100%', padding: '8px', color: '#ef4444', borderColor: '#ef4444' }}>
                            Switch Network
                        </button>
                    ) : (
                        <button onClick={handleDisconnect} className="btn-secondary" style={{ width: '100%', padding: '8px', fontSize: '0.8rem' }}>
                            <LogOut size={14} style={{ marginRight: '6px' }} /> Disconnect
                        </button>
                    )}
                </div>
            </div>

            {/* Navigation Tabs */}
            <div style={{ marginBottom: '32px', borderBottom: '1px solid var(--glass-border)', display: 'flex', gap: '24px' }}>
                <button
                    onClick={() => setActiveTab('overview')}
                    style={{
                        padding: '12px 4px',
                        background: 'transparent',
                        border: 'none',
                        borderBottom: activeTab === 'overview' ? '2px solid #3b82f6' : '2px solid transparent',
                        color: activeTab === 'overview' ? '#3b82f6' : 'var(--text-secondary)',
                        fontSize: '1rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.2s'
                    }}
                >
                    <PieIcon size={18} /> Dashboard
                </button>
                <button
                    onClick={() => setActiveTab('campaigns')}
                    style={{
                        padding: '12px 4px',
                        background: 'transparent',
                        border: 'none',
                        borderBottom: activeTab === 'campaigns' ? '2px solid #10b981' : '2px solid transparent',
                        color: activeTab === 'campaigns' ? '#10b981' : 'var(--text-secondary)',
                        fontSize: '1rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.2s'
                    }}
                >
                    <Heart size={18} /> Campaigns
                </button>
            </div>

            {activeTab === 'campaigns' ? (
                <OngoingCampaigns />
            ) : (
                <div className="animate-fade-in">
                    {/* Metrics Row */}
                    <div className="stats-grid" style={{ marginBottom: '32px', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
                        <div className="stat-card">
                            <div className="icon-box" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
                                <Heart size={24} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.8rem' }}>{stats.totalDonated.toFixed(2)} <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>MATIC</span></h3>
                                <p>Total Impact</p>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="icon-box" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                                <Activity size={24} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.8rem' }}>{stats.activeCampaigns}</h3>
                                <p>Campaigns Supported</p>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="icon-box" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>
                                <ShieldCheck size={24} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.8rem' }}>{trustScore}%</h3>
                                <p>Trust Score</p>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Grid: History & Charts */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px', alignItems: 'start' }}>

                        {/* LEFT: Donation History */}
                        <div className="card-premium">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>Donation History</h3>
                                <button className="btn-text" style={{ fontSize: '0.9rem', color: '#3b82f6' }}>Export CSV</button>
                            </div>

                            {historyLoading ? (
                                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading history...</div>
                            ) : transactions.length === 0 ? (
                                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                    No donations yet. Start your journey!
                                </div>
                            ) : (
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-primary)' }}>
                                        <thead>
                                            <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
                                                <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: 500, fontSize: '0.9rem' }}>Campaign</th>
                                                <th style={{ padding: '12px 8px', textAlign: 'right', fontWeight: 500, fontSize: '0.9rem' }}>Amount</th>
                                                <th style={{ padding: '12px 8px', textAlign: 'center', fontWeight: 500, fontSize: '0.9rem' }}>Status</th>
                                                <th style={{ padding: '12px 8px', textAlign: 'center', fontWeight: 500, fontSize: '0.9rem' }}>Valid</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {transactions.slice(0, 12).map((tx, idx) => (
                                                <tr key={tx.id || idx} style={{
                                                    borderBottom: '1px solid rgba(255,255,255,0.03)',
                                                    background: tx.isNew ? 'rgba(16, 185, 129, 0.08)' : 'transparent',
                                                    transition: 'background 1s ease',
                                                }}>
                                                    <td style={{ padding: '16px 8px' }}>
                                                        <div style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                            {tx.isNew && <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981', display: 'inline-block', animation: 'pulse 1.2s infinite' }}></span>}
                                                            {tx.campaignName}
                                                        </div>
                                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                                            {tx.date instanceof Date ? tx.date.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' }) + ' · ' + tx.date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }) : tx.date}
                                                        </div>
                                                    </td>
                                                    <td style={{ padding: '16px 8px', textAlign: 'right', fontWeight: 600, fontFamily: 'monospace' }}>
                                                        {tx.amount} MATIC
                                                    </td>
                                                    <td style={{ padding: '16px 8px', textAlign: 'center' }}>
                                                        <span style={{
                                                            padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600,
                                                            background: 'rgba(16, 185, 129, 0.15)', color: '#10b981'
                                                        }}>
                                                            Confirmed
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '16px 8px', textAlign: 'center', color: '#10b981', fontWeight: 600 }}>
                                                        100%
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {transactions.length > 5 && (
                                        <div style={{ padding: '16px', textAlign: 'center', borderTop: '1px solid var(--glass-border)' }}>
                                            <button className="btn-text" style={{ color: 'var(--text-secondary)' }}>View All Transactions</button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* RIGHT: Visual Analytics */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {/* Impact Trend */}
                            <div className="card-premium">
                                <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <TrendingUp size={18} color="#3b82f6" /> Impact Trend
                                </h3>
                                <div style={{ height: '200px', width: '100%', fontSize: '0.8rem' }}>
                                    <ResponsiveContainer>
                                        <LineChart data={analytics.trend}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                            <XAxis dataKey="date" stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} />
                                            <YAxis stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                                            />
                                            <Line type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} activeDot={{ r: 6 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Donation Distribution */}
                            <div className="card-premium">
                                <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <PieIcon size={18} color="#8b5cf6" /> Distribution
                                </h3>
                                <div style={{ height: '260px', width: '100%', fontSize: '0.8rem' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
                                            <Pie
                                                data={analytics.distribution}
                                                cx="50%"
                                                cy="44%"
                                                innerRadius={52}
                                                outerRadius={70}
                                                paddingAngle={4}
                                                dataKey="value"
                                            >
                                                {analytics.distribution.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--glass-border)', color: 'var(--text-primary)', borderRadius: '8px', fontSize: '0.82rem' }}
                                                formatter={(value, name) => [`${parseFloat(value).toFixed(2)} MATIC`, name]}
                                            />
                                            <Legend
                                                verticalAlign="bottom"
                                                height={64}
                                                wrapperStyle={{ fontSize: '0.75rem', color: 'var(--text-secondary)', paddingTop: '10px', lineHeight: '1.6' }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DonorDashboard;
