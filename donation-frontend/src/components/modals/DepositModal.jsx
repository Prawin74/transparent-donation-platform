import React, { useState, useContext, useEffect } from 'react';
import { Web3Context } from '../../App';
import { useModal } from '../../contexts/ModalContext';
import { formatCurrency } from '../../utils/currencyFormatter';
import '../../styles/NavbarPremium.css';

const DepositModal = () => {
    const { isDepositOpen, closeDeposit } = useModal();
    const { account } = useContext(Web3Context);

    // State
    const [amount, setAmount] = useState('');
    const [status, setStatus] = useState('idle'); // idle, processing, converting, success, error
    const [logs, setLogs] = useState([]);

    // Reset state when modal opens
    useEffect(() => {
        if (isDepositOpen) {
            setAmount('');
            setStatus('idle');
            setLogs([]);
        }
    }, [isDepositOpen]);

    if (!isDepositOpen) return null;

    const addLog = (msg) => setLogs(prev => [...prev, msg]);

    const handleDeposit = async (e) => {
        e.preventDefault();
        if (!account) {
            addLog("Error: Please connect wallet first!");
            setStatus('error');
            return;
        }

        setStatus('processing');
        setLogs([]); // Clear previous logs
        addLog("Initiating Payment Intent...");

        try {
            // 1. Create Payment Intent
            const intentRes = await fetch('http://localhost:3001/api/create-payment-intent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount, currency: 'INR' })
            });
            const intentData = await intentRes.json();

            if (!intentData.paymentId) throw new Error("Failed to create payment intent");
            addLog(`Payment Authorized: ${intentData.paymentId}`);
            addLog("Simulating Card Processing...");

            // Simulate wait
            await new Promise(r => setTimeout(r, 1500));

            setStatus('converting');
            addLog("Payment Successful. Initiating Fiat-to-Crypto Swap...");

            // 2. Execute Swap & Deposit
            const swapRes = await fetch('http://localhost:3001/api/execute-swap', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    paymentId: intentData.paymentId,
                    amount,
                    userAddress: account
                })
            });
            const swapData = await swapRes.json();

            if (swapData.error) throw new Error(swapData.error);

            addLog(`Swap Complete! Sent ${formatCurrency(swapData.cryptoAmount)}`);
            addLog(`Tx: ${swapData.txHash.slice(0, 10)}...`);

            setStatus('success');

            // Auto close after success? Maybe let user see result first.
        } catch (err) {
            console.error(err);
            addLog(`Error: ${err.message}`);
            setStatus('error');
        }
    };

    // Close on overlay click
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) closeDeposit();
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-container">
                <div className="modal-header">
                    <h2 className="modal-title">Deposit Funds</h2>
                    <button className="modal-close-btn" onClick={closeDeposit}>
                        {/* X Icon SVG */}
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleDeposit}>
                    <div className="modal-input-group">
                        <label className="modal-label">Amount (INR)</label>
                        <input
                            type="number"
                            className="modal-input"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter amount in rupees (e.g. 1000)"
                            min="10"
                            required
                        />
                    </div>

                    {amount && (
                        <div style={{ marginBottom: '20px', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#94a3b8' }}>
                                <span>Exchange Rate</span>
                                <span>1 INR = 1 Digital Rupee</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontWeight: 'bold', color: '#fff' }}>
                                <span>Receive</span>
                                <span>{formatCurrency(amount)}</span>
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="modal-action-btn modal-btn-primary"
                        disabled={status === 'processing' || status === 'converting' || !amount}
                    >
                        {status === 'idle' && "Pay with Card"}
                        {status === 'processing' && "Processing..."}
                        {status === 'converting' && "Swapping..."}
                        {status === 'success' && "Deposit Complete!"}
                        {status === 'error' && "Retry"}
                    </button>
                </form>

                {(logs.length > 0 || status === 'success' || status === 'error') && (
                    <div className={`modal-status status-${status}`} style={{ textAlign: 'left', marginTop: '20px' }}>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.85rem' }}>
                            {logs.map((log, i) => (
                                <li key={i} style={{ marginBottom: '4px' }}>• {log}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DepositModal;
