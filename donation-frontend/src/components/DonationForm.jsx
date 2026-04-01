import React, { useState } from 'react';
import { useWallet } from '../hooks/useWallet';
import { ethers } from 'ethers';
import { AlertCircle, ExternalLink, RefreshCw, Wallet } from 'lucide-react';
import { donationPlatformABI, CONTRACT_ADDRESSES, explorerLink } from '../utils/contractABI';

const DonationForm = ({ campaignId, walletAddress, campaignTitle }) => {
    const {
        account,
        balance,
        isPolygonAmoy,
        connectWallet,
        switchNetwork,
        validateDonation,
        isConnecting,
        signer
    } = useWallet();

    const [amount, setAmount] = useState('');
    const [status, setStatus] = useState('idle'); // idle, checking, pending, success, error
    const [error, setError] = useState(null);
    const [txHash, setTxHash] = useState(null);

    const handleDonate = async (e) => {
        e.preventDefault();
        setError(null);
        setStatus('checking');

        if (!account) {
            await connectWallet();
            setStatus('idle');
            return;
        }

        // Use strict validation from 'Wallet Intelligence'
        const validationError = validateDonation(amount);
        if (validationError) {
            setError(validationError);
            setStatus('idle');
            return;
        }

        if (!isPolygonAmoy) {
            setError("Please switch to Polygon Amoy Testnet.");
            setStatus('idle');
            // Optional: Auto trigger switch
            // await switchNetwork();
            return;
        }

        try {
            setStatus('pending');
            // Ensure we have a signer
            if (!signer) {
                throw new Error("Wallet not fully connected (Signer execution failed).");
            }

            const contract = new ethers.Contract(
                CONTRACT_ADDRESSES.DonationPlatform,
                donationPlatformABI,
                signer
            );

            console.log(`Donating ${amount} to ${campaignId} (${walletAddress})`);

            const tx = await contract.donate(campaignId, walletAddress, {
                value: ethers.parseEther(amount)
            });

            setTxHash(tx.hash);

            // Wait for confirmation
            await tx.wait();

            setStatus('success');
            setAmount('');

            // Post to backend for Immediate Audit Trail
            try {
                // Formatting amount properly for backend log
                const floatAmount = parseFloat(amount);
                await fetch('http://localhost:3001/api/campaigns/log-donation', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        campaignId,
                        transactionHash: tx.hash,
                        amount: floatAmount,
                        donor: account,
                        status: 'Completed'
                    })
                });
            } catch (err) {
                console.warn("Backend sync failed manually:", err);
            }

        } catch (err) {
            console.error(err);
            if (err.info?.error?.code === 4001 || err.code === "ACTION_REJECTED") {
                setError("Transaction rejected by user.");
            } else {
                setError(err.reason || err.message || "Transaction failed");
            }
            setStatus('error');
        }
    };

    return (
        <div className="card-premium" style={{
            background: 'var(--bg-card)',
            backdropFilter: 'blur(10px)',
            border: '1px solid var(--glass-border)'
        }}>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '16px' }}>
                Support this Campaign
            </h3>

            {account && (
                <div style={{ marginBottom: '16px', fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                    <span style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', padding: '2px 8px', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                        {account.substring(0, 6)}...{account.substring(38)}
                    </span>
                    <span style={{ color: 'var(--text-secondary)' }}>|</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        Bal: {parseFloat(balance).toFixed(4)} MATIC
                    </span>
                </div>
            )}

            {/* Network Verification UI */}
            {account && !isPolygonAmoy && (
                <div style={{
                    padding: '12px', background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px',
                    marginBottom: '16px', fontSize: '0.9rem', color: '#ef4444'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <AlertCircle size={16} />
                        <span>Wrong Network</span>
                    </div>
                    <button onClick={switchNetwork} className="btn-secondary" style={{ width: '100%', fontSize: '0.8rem', padding: '6px' }}>
                        Switch to Polygon Amoy
                    </button>
                </div>
            )}

            <form onSubmit={handleDonate}>
                <div style={{ marginBottom: '16px' }}>
                    <label className="label-premium" style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Amount (MATIC)</span>
                        {account && <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            <Wallet size={12} style={{ display: 'inline', marginRight: '4px' }} />
                            {/* Real-Time Balance Display */}
                            Bal: {parseFloat(balance).toFixed(4)}
                        </span>}
                    </label>
                    <div style={{ position: 'relative' }}>
                        <input
                            type="number"
                            step="0.0001"
                            className="input-premium"
                            placeholder="0.1"
                            value={amount}
                            onChange={(e) => {
                                setAmount(e.target.value);
                                setError(null);
                            }}
                            disabled={status === 'pending' || status === 'success'}
                            style={{ paddingRight: '60px' }}
                        />
                        <span style={{
                            position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)',
                            fontWeight: 600, color: 'var(--text-secondary)'
                        }}>MATIC</span>
                    </div>
                    {/* presets */}
                    <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                        {[0.01, 0.05, 0.1].map(val => (
                            <button
                                type="button"
                                key={val}
                                onClick={() => setAmount(val.toString())}
                                className="btn-secondary"
                                style={{ padding: '4px 12px', fontSize: '0.8rem' }}
                                disabled={status === 'pending'}
                            >
                                {val}
                            </button>
                        ))}
                    </div>
                </div>

                {error && (
                    <div style={{ marginBottom: '16px', color: '#ef4444', fontSize: '0.9rem', display: 'flex', alignItems: 'start', gap: '6px' }}>
                        <AlertCircle size={16} style={{ marginTop: '2px' }} />
                        <span>{error}</span>
                    </div>
                )}

                {status === 'success' ? (
                    <div style={{ textAlign: 'center', padding: '16px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                        <h4 style={{ color: '#10b981', margin: '0 0 8px 0' }}>Donation Successful!</h4>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                            Thank you for your generous contribution.
                        </p>
                        <a
                            href={explorerLink('tx', txHash, 'https://amoy.polygonscan.com')}
                            target="_blank"
                            rel="noreferrer"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#10b981', fontSize: '0.9rem' }}
                        >
                            View Transaction <ExternalLink size={14} />
                        </a>
                        <button
                            type="button"
                            onClick={() => setStatus('idle')}
                            style={{
                                display: 'block', margin: '16px auto 0',
                                background: 'transparent', border: 'none',
                                color: 'var(--text-secondary)', textDecoration: 'underline', cursor: 'pointer'
                            }}
                        >
                            Donate again
                        </button>
                    </div>
                ) : (
                    <button
                        type="submit"
                        className="btn-premium"
                        style={{ width: '100%', justifyContent: 'center', gap: '8px' }}
                        disabled={status === 'pending' || (account && !isPolygonAmoy)}
                    >
                        {!account ? 'Connect Wallet to Donate' : status === 'pending' ? 'Processing...' : 'Donate Now'}
                        {(status === 'pending' || isConnecting) && <RefreshCw size={16} className="spin" />}
                    </button>
                )}

                {status === 'pending' && txHash && (
                    <div style={{ marginTop: '12px', fontSize: '0.8rem', textAlign: 'center' }}>
                        <a
                            href={explorerLink('tx', txHash, 'https://amoy.polygonscan.com')}
                            target="_blank"
                            rel="noreferrer"
                            style={{ color: '#6366f1', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        >
                            View Pending Transaction <ExternalLink size={12} />
                        </a>
                    </div>
                )}
            </form>
        </div>
    );
};

export default DonationForm;
