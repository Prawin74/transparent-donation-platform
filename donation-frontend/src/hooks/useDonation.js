import { useState } from 'react';

// Generates a realistic-looking fake transaction hash
const generateMockTxHash = () => {
    const chars = '0123456789abcdef';
    let hash = '0x';
    for (let i = 0; i < 64; i++) {
        hash += chars[Math.floor(Math.random() * chars.length)];
    }
    return hash;
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const useDonation = (signer, account) => {
    const [status, setStatus] = useState('idle');
    const [txHash, setTxHash] = useState(null);
    const [error, setError] = useState(null);
    const [isMock] = useState(true); // Always demo mode

    const donate = async (campaignId, walletAddress, amount) => {
        setError(null);
        setTxHash(null);

        const mockHash = generateMockTxHash();

        console.log('%c[GlobalGive Demo] Initiating simulated donation...', 'color: #f59e0b; font-weight: bold;');
        console.log(`> Amount: ${amount} MATIC | Campaign: ${campaignId} | Recipient: ${walletAddress}`);

        try {
            // Stage 1 — Checking
            setStatus('checking');
            console.log('%c[Demo] Step 1: Verifying address & network...', 'color: cyan');
            await sleep(900);

            // Stage 2 — Preparing gas
            setStatus('preparing');
            console.log('%c[Demo] Step 2: Fetching optimized gas fees...', 'color: cyan');
            await sleep(1100);

            // Stage 3 — Signing
            setStatus('signing');
            console.log('%c[Demo] Step 3: Awaiting wallet signature...', 'color: orange; font-weight: bold;');
            await sleep(1300);

            // Stage 4 — Broadcasting
            setStatus('broadcasting');
            setTxHash(mockHash);
            console.log('%c[Demo] Step 4: Transaction broadcasted! ✅', 'color: green; font-weight: bold;');
            console.log(`> Tx Hash: ${mockHash}`);
            await sleep(1500);

            // Stage 5 — Confirmed
            console.log('%c[Demo] Step 5: CONFIRMED on Polygon Amoy! 🎉', 'color: #10b981; font-weight: bold; font-size: 1.2em;');
            setStatus('success');

            // 🔔 Broadcast to history hook via custom event (real-time UI update)
            window.dispatchEvent(new CustomEvent('gg:newDonation', {
                detail: {
                    id: `live-${mockHash.slice(0, 10)}`,
                    campaignName: campaignId || 'Campaign Donation',
                    amount: parseFloat(amount),
                    currency: 'MATIC',
                    txHash: mockHash,
                    date: new Date(),
                    status: 'Confirmed',
                    isNew: true,
                }
            }));

            // Log to backend so it persists
            logToBackend(campaignId, mockHash, amount, account, walletAddress)
                .catch(err => console.warn('Backend sync skipped:', err));

        } catch (err) {
            console.error('Donation flow error:', err);
            setError('Something went wrong. Please try again.');
            setStatus('error');
        }
    };

    const logToBackend = async (campaignId, txHash, amount, account, walletAddress) => {
        try {
            await fetch('http://localhost:3001/api/transactions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    campaignId,
                    transactionHash: txHash,
                    amount: parseFloat(amount),
                    donor: account,
                    donorName: 'Donor ' + account?.slice(-4),
                    recipientAddress: walletAddress,
                    status: 'success'
                })
            });
            console.log('> Backend synced.');
        } catch (e) {
            console.warn('> Backend sync failed (non-critical).', e);
        }
    };

    const reset = () => {
        setStatus('idle');
        setTxHash(null);
        setError(null);
    };

    return { donate, status, txHash, error, reset, isMock };
};
