import React, { useEffect, useState } from 'react';
import { useSocket } from '../contexts/SocketContext';
import { RefreshCw, ExternalLink } from 'lucide-react';
import { explorerLink } from '../utils/contractABI';

const TransactionList = () => {
    const socket = useSocket();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    // Initial Fetch
    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const res = await fetch('http://localhost:3001/api/transactions');
                const data = await res.json();
                if (Array.isArray(data)) {
                    setTransactions(data);
                }
            } catch (err) {
                console.error("Failed to fetch transactions", err);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    // Real-time Updates
    useEffect(() => {
        if (!socket) return;

        console.log("Listening for transaction updates...");

        const handleNewTransaction = (newTx) => {
            console.log("New Transaction Received:", newTx);
            setTransactions(prev => [newTx, ...prev].slice(0, 20)); // Keep top 20
        };

        socket.on('transactionCreated', handleNewTransaction);

        return () => {
            socket.off('transactionCreated', handleNewTransaction);
        };
    }, [socket]);

    return (
        <div className="card-premium" style={{ width: '100%', marginTop: '24px' }}>
            <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', boxShadow: '0 0 10px #10b981' }}></span>
                Live Transactions
            </h3>

            {loading ? (
                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    <RefreshCw className="spin" /> Loading feeds...
                </div>
            ) : transactions.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    No transactions yet. Be the first to donate!
                </div>
            ) : (
                <div className="transaction-list" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {transactions.map((tx, idx) => (
                        <div key={tx._id || tx.transactionId || idx} className="transaction-item fade-in-up" style={{
                            padding: '12px',
                            borderBottom: '1px solid var(--glass-border)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontSize: '0.9rem',
                            animationDelay: `${idx * 0.05}s`
                        }}>
                            <div>
                                <div style={{ fontWeight: 600, color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {tx.donorName || (tx.donor ? `${tx.donor.slice(0, 6)}...` : 'Anonymous')}
                                    <span style={{ fontSize: '0.75rem', fontWeight: 400, color: 'var(--text-secondary)' }}>
                                        donated
                                    </span>
                                </div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                    {new Date(tx.timestamp).toLocaleTimeString()} • {tx.campaign?.title || 'General Fund'}
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ color: '#10b981', fontWeight: 700 }}>
                                    +{tx.amount} MATIC
                                </div>
                                <a
                                    href={explorerLink('tx', tx.transactionHash, 'https://amoy.polygonscan.com')}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{ fontSize: '0.75rem', color: '#60a5fa', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}
                                >
                                    Hash <ExternalLink size={10} />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TransactionList;
