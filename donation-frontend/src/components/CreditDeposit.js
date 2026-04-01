import React, { useState, useContext } from 'react';
import { Web3Context } from '../App';
import '../styles/GlobalTheme.css';

const CreditDeposit = () => {
    const { account } = useContext(Web3Context);
    const [amount, setAmount] = useState('');
    const [status, setStatus] = useState('idle'); // idle, processing, converting, success, error
    const [logs, setLogs] = useState([]);

    const addLog = (msg) => setLogs(prev => [...prev, `${new Date().toLocaleTimeString()} - ${msg}`]);

    const handleDeposit = async (e) => {
        e.preventDefault();
        if (!account) {
            alert("Please connect your wallet first!");
            return;
        }

        setStatus('processing');
        setLogs([]);
        addLog("Initiating Payment Intent...");

        try {
            // 1. Create Payment Intent
            const intentRes = await fetch('http://localhost:3001/api/create-payment-intent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount, currency: 'USD' })
            });
            const intentData = await intentRes.json();

            if (!intentData.paymentId) throw new Error("Failed to create payment intent");
            addLog(`Payment Authorized: ${intentData.paymentId}`);
            addLog("Simulating Card Processing (2s)...");

            // Simulate wait
            await new Promise(r => setTimeout(r, 2000));

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

            addLog(`Swap Complete! Crypto Amount: ${swapData.cryptoAmount} USDC`);
            addLog(`Transaction Hash: ${swapData.txHash}`);
            addLog(`Blockchain Log: ${swapData.logHash}`);

            setStatus('success');

        } catch (err) {
            console.error(err);
            addLog(`Error: ${err.message}`);
            setStatus('error');
        }
    };

    return (
        <div className="page-container">
            <div className="card-premium">
                <h2>Credit Card Deposit</h2>
                <p style={{ marginBottom: '24px', color: 'var(--text-secondary)' }}>Instant Fiat-to-Crypto On-ramp</p>

                <form onSubmit={handleDeposit} style={{ display: 'grid', gap: '20px' }}>
                    <div>
                        <label className="label-premium">Amount (INR)</label>
                        <input
                            type="number"
                            className="input-premium"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter amount (e.g. 5000)"
                            min="10"
                            required
                        />
                    </div>

                    <div style={{ padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                        <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)' }}>Exchange Rate: 1 INR = 1 Digital Rupee</p>
                        <p style={{ margin: '4px 0 0 0', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                            Est. Receive: {amount ? amount : '0'} Digital Rupee
                        </p>
                    </div>

                    <button
                        type="submit"
                        className="btn-premium"
                        disabled={status === 'processing' || status === 'converting'}
                    >
                        {status === 'idle' && "Pay with Card"}
                        {status === 'processing' && "Processing Payment..."}
                        {status === 'converting' && "Converting to Crypto..."}
                        {status === 'success' && "Deposit Complete!"}
                        {status === 'error' && "Failed - Try Again"}
                    </button>
                </form>

                {logs.length > 0 && (
                    <div style={{ marginTop: '30px', background: 'rgba(15,23,42,0.8)', padding: '16px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                        <h3 style={{ fontSize: '14px', marginBottom: '8px', color: '#86efac' }}>Transaction Status</h3>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontFamily: 'monospace', fontSize: '13px', color: '#bbf7d0' }}>
                            {logs.map((log, i) => <li key={i} style={{ marginBottom: '4px' }}>{log}</li>)}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreditDeposit;
