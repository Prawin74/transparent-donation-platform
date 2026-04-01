import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/NGODashboard.css';
import { Plus, Search, Filter, MoreHorizontal, Eye, Edit2, Trash2, Share2, Copy, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ShareModal from './ShareModal';

const NGOCampaigns = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [selectedCampaignForShare, setSelectedCampaignForShare] = useState(null);
    const [copiedId, setCopiedId] = useState(null);

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
                }
            } catch (error) {
                console.error("Failed to fetch campaigns", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCampaigns();
    }, []);

    const filteredCampaigns = campaigns.filter(c => {
        if (filter === 'All') return true;
        return c.status === filter;
    });

    const handleDelete = async (campaignId) => {
        if (!window.confirm("Are you sure you want to delete this campaign? This action cannot be undone.")) {
            return;
        }

        try {
            const token = localStorage.getItem('globalgive_token');
            const response = await fetch(`http://localhost:3001/api/campaigns/${campaignId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                // Immediately remove from UI
                setCampaigns(campaigns.filter(c => c._id !== campaignId));

                // Optional: Show success notification
                // You could use a toast library here instead of alert
                console.log('Campaign deleted successfully');
            } else {
                const text = await response.text();
                try {
                    const errData = JSON.parse(text);
                    alert(`Failed to delete campaign: ${errData.message || errData.error || 'Unknown error'}`);
                } catch (e) {
                    // If response is not JSON (e.g. 404 HTML from Express default), show the text preview
                    console.error("Non-JSON response:", text);
                    alert(`Failed to delete (Server Error): ${text.substring(0, 100)}...`);
                }
            }
        } catch (error) {
            console.error("Error deleting campaign:", error);
            alert(`Error deleting campaign: ${error.message}`);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active': return '#10b981';
            case 'ONGOING': return '#10b981';
            case 'Completed': return '#3b82f6';
            case 'Expired': return '#ef4444';
            default: return '#94a3b8';
        }
    };

    return (
        <div className="page-container fade-in-up">
            <ShareModal
                isOpen={!!selectedCampaignForShare}
                onClose={() => setSelectedCampaignForShare(null)}
                campaign={selectedCampaignForShare}
            />

            <div className="dashboard-header">
                <div>
                    <h1 className="page-title">My Campaigns</h1>
                    <p className="page-subtitle">Manage and track your fundraising initiatives</p>
                </div>
                <button onClick={() => navigate('/ngo/create')} className="btn-premium">
                    <Plus size={20} style={{ marginRight: '8px' }} />
                    Create New Campaign
                </button>
            </div>

            {/* Filters & Search */}
            <div className="stats-grid" style={{ gridTemplateColumns: '1fr', marginBottom: '32px' }}>
                <div className="stat-card" style={{ flexDirection: 'row', alignItems: 'center', padding: '16px', gap: '16px' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <Search size={20} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-secondary)' }} />
                        <input
                            type="text"
                            placeholder="Search campaigns..."
                            className="input-premium"
                            style={{ paddingLeft: '40px', background: 'var(--bg-card)' }}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        {['All', 'Active', 'ONGOING', 'Completed', 'Expired'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                style={{
                                    background: filter === f ? 'var(--hover-color)' : 'transparent',
                                    color: filter === f ? 'var(--text-accent)' : 'var(--text-secondary)',
                                    border: filter === f ? `1px solid var(--text-accent)` : '1px solid var(--glass-border)',
                                    padding: '8px 16px',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>
                    Loading campaigns...
                </div>
            ) : filteredCampaigns.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px', background: 'var(--bg-card)', borderRadius: '16px', border: '1px dashed var(--glass-border)' }}>
                    <h3 style={{ marginBottom: '16px', color: 'var(--text-primary)' }}>No campaigns found</h3>
                    <p style={{ marginBottom: '24px' }}>You haven't created any campaigns in this category yet.</p>
                    <button onClick={() => navigate('/ngo/create')} className="btn-premium">
                        Create Your First Campaign
                    </button>
                </div>
            ) : (
                <div className="grid-2">
                    {filteredCampaigns.map(campaign => (
                        <div key={campaign._id} className="card-premium" style={{ padding: '0', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
                                <img
                                    src={campaign.image || "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"}
                                    alt={campaign.title}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                                <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', gap: '8px' }}>
                                    <span style={{
                                        background: 'rgba(0,0,0,0.6)',
                                        backdropFilter: 'blur(4px)',
                                        color: getStatusColor(campaign.status),
                                        padding: '4px 12px',
                                        borderRadius: '20px',
                                        fontSize: '0.8rem',
                                        fontWeight: 600,
                                        border: `1px solid ${getStatusColor(campaign.status)}`
                                    }}>
                                        {campaign.status}
                                    </span>
                                </div>
                            </div>

                            <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                                    <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', flex: 1, color: 'var(--text-primary)' }}>{campaign.title}</h3>
                                </div>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '24px', flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                    {campaign.description}
                                </p>

                                {/* Progress */}
                                <div style={{ marginBottom: '20px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
                                        <span style={{ color: 'var(--text-secondary)' }}>Raised: <span style={{ color: '#10b981', fontWeight: 600 }}>₹{campaign.raisedAmount || 0}</span></span>
                                        <span style={{ color: 'var(--text-secondary)' }}>Goal: ₹{campaign.targetAmount}</span>
                                    </div>
                                    <div style={{ height: '6px', background: 'var(--glass-border)', borderRadius: '3px', overflow: 'hidden' }}>
                                        <div style={{ width: `${Math.min(((campaign.raisedAmount || 0) / campaign.targetAmount) * 100, 100)}%`, height: '100%', background: '#10b981' }}></div>
                                    </div>
                                </div>

                                {/* Wallet Address */}
                                {campaign.walletAddress && (
                                    <div style={{
                                        marginBottom: '20px',
                                        background: 'var(--bg-main)',
                                        padding: '8px 12px',
                                        borderRadius: '8px',
                                        border: '1px solid var(--glass-border)'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Wallet Address ({campaign.network})</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <code style={{
                                                fontSize: '0.8rem',
                                                color: 'var(--text-primary)',
                                                flex: 1,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                fontFamily: 'monospace'
                                            }}>
                                                {campaign.walletAddress}
                                            </code>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigator.clipboard.writeText(campaign.walletAddress);
                                                    setCopiedId(campaign._id);
                                                    setTimeout(() => setCopiedId(null), 2000);
                                                }}
                                                style={{
                                                    background: 'transparent',
                                                    border: 'none',
                                                    color: copiedId === campaign._id ? '#10b981' : '#64748b',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center'
                                                }}
                                                title="Copy Address"
                                            >
                                                {copiedId === campaign._id ? <Check size={14} /> : <Copy size={14} />}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div style={{ display: 'flex', gap: '12px', marginTop: 'auto' }}>
                                    <button
                                        onClick={() => navigate(`/campaigns/${campaign._id}`)}
                                        className="btn-secondary"
                                        style={{ flex: 1, padding: '10px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                                    >
                                        <Eye size={16} /> View
                                    </button>
                                    <button
                                        className="btn-secondary"
                                        style={{ width: '42px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        onClick={() => setSelectedCampaignForShare(campaign)}
                                        title="Share"
                                    >
                                        <Share2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(campaign._id)}
                                        className="btn-secondary"
                                        style={{ width: '42px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                                        title="Delete Campaign"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NGOCampaigns;
