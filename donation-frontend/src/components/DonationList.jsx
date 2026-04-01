import React from 'react';
import { ExternalLink, User } from 'lucide-react';

const DonationList = ({ donations }) => {
    if (!donations || donations.length === 0) {
        return (
            <div className="card-premium" style={{ textAlign: 'center', padding: '40px' }}>
                <p style={{ color: '#94a3b8' }}>No donations yet. Be the first to contribute!</p>
            </div>
        );
    }

    return (
        <div className="card-premium animate-fade-in" style={{ marginTop: '32px' }}>
            <h3 style={{ marginBottom: '24px', fontSize: '1.25rem' }}>Recent Donations</h3>
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#94a3b8', fontSize: '0.9rem' }}>
                            <th style={{ padding: '16px 8px' }}>Donor</th>
                            <th style={{ padding: '16px 8px' }}>Amount</th>
                            <th style={{ padding: '16px 8px' }}>Date</th>
                            <th style={{ padding: '16px 8px', textAlign: 'right' }}>Transaction</th>
                        </tr>
                    </thead>
                    <tbody>
                        {donations.map((donation) => (
                            <tr key={donation._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '16px 8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{
                                        width: '32px', height: '32px',
                                        borderRadius: '50%',
                                        background: 'rgba(255,255,255,0.1)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        <User size={16} color="#cbd5e1" />
                                    </div>
                                    <span style={{ color: '#fff', fontWeight: 500 }}>
                                        {donation.donor ? donation.donor.name : 'Anonymous Donor'}
                                    </span>
                                </td>
                                <td style={{ padding: '16px 8px', color: '#10b981', fontWeight: 600 }}>
                                    {donation.amount} {donation.currency}
                                </td>
                                <td style={{ padding: '16px 8px', color: '#94a3b8', fontSize: '0.9rem' }}>
                                    {new Date(donation.timestamp).toLocaleDateString()}
                                </td>
                                <td style={{ padding: '16px 8px', textAlign: 'right' }}>
                                    <a
                                        href={`https://sepolia.etherscan.io/tx/${donation.transactionHash}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            display: 'inline-flex', alignItems: 'center', gap: '4px',
                                            color: '#818cf8', textDecoration: 'none', fontSize: '0.85rem'
                                        }}
                                        className="hover-underline"
                                    >
                                        View <ExternalLink size={14} />
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DonationList;
