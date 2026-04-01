import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../contexts/SocketContext';
import { Clock, TrendingUp, AlertCircle, Heart } from 'lucide-react';
import '../styles/NGODashboard.css'; // Reusing premium styles

const OngoingCampaigns = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const socket = useSocket();
    const navigate = useNavigate();

    // Fetch initial data
    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/campaigns');
                if (response.ok) {
                    const data = await response.json();
                    // Filter for ONGOING explicitly, though backend returns Active + ONGOING
                    // We'll show ONGOING ones here mostly, or both if they fit "Ongoing" definition
                    const ongoing = data.filter(c => c.status === 'ONGOING' || c.status === 'Active');
                    setCampaigns(ongoing);
                }
            } catch (error) {
                console.error("Failed to fetch ongoing campaigns", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCampaigns();
    }, []);

    // Socket Listeners
    useEffect(() => {
        if (!socket) return;

        // 1. New Campaign Created
        socket.on('campaignCreated', (newCampaign) => {
            // Only add if it's ongoing/active
            if (newCampaign.status === 'ONGOING' || newCampaign.status === 'Active') {
                setCampaigns(prev => [newCampaign, ...prev]);
            }
        });

        // 2. Campaign Deleted
        socket.on('campaignDeleted', (campaignId) => {
            setCampaigns(prev => prev.filter(c => c._id !== campaignId));
        });

        // 3. Donation Updated
        socket.on('donationUpdated', ({ campaignId, raisedAmount }) => {
            setCampaigns(prev => prev.map(c => {
                if (c._id === campaignId) {
                    return { ...c, raisedAmount };
                }
                return c;
            }));
        });

        return () => {
            socket.off('campaignCreated');
            socket.off('campaignDeleted');
            socket.off('donationUpdated');
        };
    }, [socket]);

    if (loading) {
        return (
            <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                Loading ongoing campaigns...
            </div>
        );
    }

    if (campaigns.length === 0) {
        return (
            <div style={{ padding: '60px', textAlign: 'center', background: 'var(--bg-card)', borderRadius: '16px', border: '1px dashed var(--glass-border)' }}>
                <h3 style={{ marginBottom: '16px', color: 'var(--text-primary)' }}>No Live Campaigns</h3>
                <p style={{ color: 'var(--text-secondary)' }}>There are currently no ongoing campaigns. Please check back later!</p>
            </div>
        );
    }

    return (
        <div className="grid-3 animate-fade-in">
            {campaigns.map(campaign => (
                <div key={campaign._id} className="card-premium" style={{ padding: '0', display: 'flex', flexDirection: 'column', height: '100%' }}>
                    {/* Image */}
                    <div style={{ height: '180px', overflow: 'hidden', position: 'relative' }}>
                        <img
                            src={campaign.image || "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"}
                            alt={campaign.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                        />
                        <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                            <span style={{
                                background: 'rgba(0,0,0,0.6)',
                                backdropFilter: 'blur(4px)',
                                color: '#10b981',
                                padding: '4px 12px',
                                borderRadius: '20px',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                border: '1px solid #10b981',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                            }}>
                                <span style={{ width: '6px', height: '6px', background: '#10b981', borderRadius: '50%', boxShadow: '0 0 8px #10b981' }}></span>
                                LIVE
                            </span>
                        </div>
                    </div>

                    {/* Content */}
                    <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <div style={{ marginBottom: 'auto' }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-accent)', fontWeight: 600 }}>{campaign.category}</span>
                            <h3 style={{ fontSize: '1.15rem', margin: '8px 0', color: 'var(--text-primary)', lineHeight: '1.4' }}>{campaign.title}</h3>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                {campaign.description}
                            </p>
                        </div>

                        {/* Progress */}
                        <div style={{ marginTop: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
                                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>₹{campaign.raisedAmount?.toLocaleString() || 0}</span>
                                <span style={{ color: 'var(--text-secondary)' }}>of ₹{campaign.targetAmount?.toLocaleString()}</span>
                            </div>
                            <div style={{ height: '6px', background: 'var(--glass-border)', borderRadius: '3px', overflow: 'hidden' }}>
                                <div style={{
                                    width: `${Math.min(((campaign.raisedAmount || 0) / campaign.targetAmount) * 100, 100)}%`,
                                    height: '100%',
                                    background: 'linear-gradient(90deg, #10b981, #34d399)',
                                    borderRadius: '3px',
                                    transition: 'width 1s ease-in-out'
                                }}></div>
                            </div>
                        </div>

                        {/* Footer / Action */}
                        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                <Clock size={14} />
                                <span>{new Date(campaign.deadline).toLocaleDateString()}</span>
                            </div>
                            <button
                                onClick={() => navigate(`/campaign/${campaign._id}`)}
                                className="btn-premium"
                                style={{ padding: '8px 20px', fontSize: '0.9rem' }}
                            >
                                Donate
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default OngoingCampaigns;
