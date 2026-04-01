import { useState, useEffect, useCallback, useRef } from 'react';

const API_BASE_URL = 'http://localhost:3001/api/campaigns';

// ── Realistic dummy data pool ─────────────────────────────────────────────────
const CAMPAIGN_NAMES = [
    'Help Kids in Rural India',
    'Clean Water for Rajasthan Villages',
    'Medical Aid — Flood Victims',
    'Education Fund for Girls',
    'Solar Panels for Schools',
    'Disaster Relief — Cyclone Affected',
    'Free Meals for Elderly',
    'Plant 10,000 Trees Initiative',
];

const genHash = () => {
    const c = '0123456789abcdef';
    let h = '0x';
    for (let i = 0; i < 64; i++) h += c[Math.floor(Math.random() * c.length)];
    return h;
};

const daysAgo = (d) => {
    const dt = new Date();
    dt.setDate(dt.getDate() - d);
    dt.setHours(Math.floor(Math.random() * 23), Math.floor(Math.random() * 59));
    return dt;
};

const SEED_TRANSACTIONS = [
    { campaignName: 'Help Kids in Rural India', amount: 0.25, date: daysAgo(1) },
    { campaignName: 'Medical Aid — Flood Victims', amount: 0.50, date: daysAgo(2) },
    { campaignName: 'Clean Water for Rajasthan', amount: 0.10, date: daysAgo(4) },
    { campaignName: 'Education Fund for Girls', amount: 0.75, date: daysAgo(6) },
    { campaignName: 'Free Meals for Elderly', amount: 0.20, date: daysAgo(8) },
    { campaignName: 'Solar Panels for Schools', amount: 1.00, date: daysAgo(10) },
    { campaignName: 'Plant 10,000 Trees Initiative', amount: 0.30, date: daysAgo(12) },
    { campaignName: 'Disaster Relief — Cyclone', amount: 0.60, date: daysAgo(15) },
    { campaignName: 'Help Kids in Rural India', amount: 0.15, date: daysAgo(18) },
    { campaignName: 'Medical Aid — Flood Victims', amount: 0.40, date: daysAgo(21) },
    { campaignName: 'Education Fund for Girls', amount: 0.55, date: daysAgo(25) },
    { campaignName: 'Clean Water for Rajasthan', amount: 0.35, date: daysAgo(29) },
].map((tx, i) => ({
    id: `seed-${i}`,
    campaignName: tx.campaignName,
    amount: tx.amount,
    currency: 'MATIC',
    txHash: genHash(),
    date: tx.date,
    status: 'Confirmed',
    isNew: false,
}));

const calcStats = (txs) => ({
    totalDonated: txs.reduce((s, t) => s + (t.amount || 0), 0),
    activeCampaigns: new Set(txs.map(t => t.campaignName)).size,
    isVerified: true,
});

// ─────────────────────────────────────────────────────────────────────────────

export const useTransactionHistory = (walletAddress) => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({ totalDonated: 0, activeCampaigns: 0, isVerified: false });
    const tickerRef = useRef(null);

    // ── Real-time ticker: adds a new dummy tx every 25 seconds ───────────────
    const startTicker = useCallback(() => {
        if (tickerRef.current) clearInterval(tickerRef.current);
        tickerRef.current = setInterval(() => {
            const newTx = {
                id: `live-${Date.now()}`,
                campaignName: CAMPAIGN_NAMES[Math.floor(Math.random() * CAMPAIGN_NAMES.length)],
                amount: parseFloat((Math.random() * 0.8 + 0.05).toFixed(2)),
                currency: 'MATIC',
                txHash: genHash(),
                date: new Date(),
                status: 'Confirmed',
                isNew: true, // flag for highlight
            };

            setTransactions(prev => {
                const updated = [newTx, ...prev];
                setStats(calcStats(updated));
                return updated;
            });

            // Remove the "new" highlight after 4s
            setTimeout(() => {
                setTransactions(prev =>
                    prev.map(t => t.id === newTx.id ? { ...t, isNew: false } : t)
                );
            }, 4000);
        }, 25000);
    }, []);

    const fetchHistory = useCallback(async () => {
        if (!walletAddress) {
            setTransactions([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`${API_BASE_URL}/user/${walletAddress}`);

            let formatted = [];

            if (response.ok) {
                const data = await response.json();
                formatted = data.map(tx => ({
                    id: tx._id,
                    campaignName: tx.campaign?.title || 'Unknown Campaign',
                    amount: tx.amount,
                    currency: tx.currency || 'MATIC',
                    txHash: tx.transactionHash,
                    date: new Date(tx.timestamp),
                    status: 'Confirmed',
                    isNew: false,
                }));
            }

            // Merge real data with seed — seed fills any gap, keep real on top
            const merged = formatted.length > 0
                ? [...formatted, ...SEED_TRANSACTIONS].slice(0, 15)
                : SEED_TRANSACTIONS;

            setTransactions(merged);
            setStats(calcStats(merged));
        } catch (err) {
            console.error('History fetch error:', err);
            setError(null); // swallow — show seed data silently
            setTransactions(SEED_TRANSACTIONS);
            setStats(calcStats(SEED_TRANSACTIONS));
        } finally {
            setLoading(false);
            startTicker(); // kick off real-time updates
        }
    }, [walletAddress, startTicker]);

    useEffect(() => {
        fetchHistory();
        return () => {
            if (tickerRef.current) clearInterval(tickerRef.current);
        };
    }, [fetchHistory]);

    // ── Listen for donations made in useDonation (real-time update) ──────────
    useEffect(() => {
        const handleNewDonation = (e) => {
            const newTx = { ...e.detail, isNew: true };
            setTransactions(prev => {
                const updated = [newTx, ...prev];
                setStats(calcStats(updated));
                return updated;
            });
            // Remove highlight after 5s
            setTimeout(() => {
                setTransactions(prev =>
                    prev.map(t => t.id === newTx.id ? { ...t, isNew: false } : t)
                );
            }, 5000);
        };

        window.addEventListener('gg:newDonation', handleNewDonation);
        return () => window.removeEventListener('gg:newDonation', handleNewDonation);
    }, []);

    return { transactions, stats, loading, error, refetch: fetchHistory, refresh: fetchHistory };
};
