import React, { useState, useContext, useEffect } from 'react';
import { ethers } from 'ethers';
import { Web3Context } from '../../App';
import { useModal } from '../../contexts/ModalContext';
import {
    CONTRACT_ADDRESSES,
    STABLECOIN_DECIMALS,
    donationCampaignABI,
} from '../../utils/contractABI';
import { uploadFileToIPFS, uploadJSONToIPFS } from '../../utils/ipfs';
import '../../styles/NavbarPremium.css';

const WithdrawModal = () => {
    const { isWithdrawOpen, closeWithdraw } = useModal();
    const { signer, account, connectWallet } = useContext(Web3Context);

    // State
    const [campaignAddress, setCampaignAddress] = useState('');
    const [amount, setAmount] = useState('');
    const [purpose, setPurpose] = useState('');
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState('idle');
    const [logs, setLogs] = useState([]);

    // Auto-fill default campaign if available
    useEffect(() => {
        if (CONTRACT_ADDRESSES && CONTRACT_ADDRESSES.DonationCampaign) {
            setCampaignAddress(CONTRACT_ADDRESSES.DonationCampaign);
        }
    }, []);

    // Reset state on open
    useEffect(() => {
        if (isWithdrawOpen) {
            setAmount('');
            setPurpose('');
            setFile(null);
            setStatus('idle');
            setLogs([]);
        }
    }, [isWithdrawOpen]);

    if (!isWithdrawOpen) return null;

    const addLog = (msg) => setLogs(prev => [...prev, msg]);

    const handleWithdraw = async (e) => {
        e.preventDefault();

        if (!signer) {
            addLog("Connect wallet first!");
            if (connectWallet) connectWallet();
            return;
        }

        setStatus('processing');
        setLogs([]);

        try {
            // Check Owner
            addLog("Checking ownership...");
            // Ideally we check ownership before letting them proceed, but we'll do it as part of the flow 
            // or we accept that the tx will fail if not owner.
            const campaign = new ethers.Contract(campaignAddress, donationCampaignABI, signer);
            const ownerAddr = await campaign.owner();

            if (ownerAddr.toLowerCase() !== account.toLowerCase()) {
                throw new Error("You are not the owner of this campaign.");
            }

            addLog("Preparing proof metadata...");
            let proofHash = '';
            if (file) {
                addLog("Uploading file to IPFS...");
                proofHash = await uploadFileToIPFS(file);
            } else {
                addLog("Uploading purpose to IPFS...");
                proofHash = await uploadJSONToIPFS({ purpose, amount, timestamp: new Date().toISOString() });
            }

            if (!proofHash) throw new Error("Failed to generate proof hash.");

            addLog("Submitting withdrawal to blockchain...");
            const parsedAmount = ethers.parseUnits(amount || '0', STABLECOIN_DECIMALS);
            const tx = await campaign.withdraw(parsedAmount, purpose, proofHash);

            addLog(`Tx Sent: ${tx.hash.slice(0, 10)}...`);
            addLog("Waiting for confirmation...");

            await tx.wait();
            addLog("Withdrawal Confirmed!");
            setStatus('success');

        } catch (err) {
            console.error(err);
            setStatus('error');
            addLog(`Error: ${err.message}`);
        }
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) closeWithdraw();
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-container">
                <div className="modal-header">
                    <h2 className="modal-title">Withdraw Funds</h2>
                    <button className="modal-close-btn" onClick={closeWithdraw}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleWithdraw}>
                    <div className="modal-input-group">
                        <label className="modal-label">Campaign Address</label>
                        <input
                            type="text"
                            className="modal-input"
                            value={campaignAddress}
                            onChange={(e) => setCampaignAddress(e.target.value)}
                            placeholder="0x..."
                            required
                        />
                    </div>

                    <div className="modal-input-group">
                        <label className="modal-label">Amount (INR)</label>
                        <input
                            type="number"
                            className="modal-input"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Amount to withdraw"
                            required
                        />
                    </div>

                    <div className="modal-input-group">
                        <label className="modal-label">Purpose of Withdrawal</label>
                        <input
                            type="text"
                            className="modal-input"
                            value={purpose}
                            onChange={(e) => setPurpose(e.target.value)}
                            placeholder="E.g. Medical supplies, Food"
                            required
                        />
                    </div>

                    <div className="modal-input-group">
                        <label className="modal-label">Proof (Optional File)</label>
                        <input
                            type="file"
                            className="modal-input"
                            style={{ padding: '8px' }}
                            onChange={(e) => setFile(e.target.files?.[0])}
                        />
                    </div>

                    <button
                        type="submit"
                        className="modal-action-btn modal-btn-primary"
                        style={{ background: status === 'success' ? '#10b981' : undefined }}
                        disabled={status === 'processing'}
                    >
                        {status === 'idle' && "Confirm Withdrawal"}
                        {status === 'processing' && "Processing..."}
                        {status === 'success' && "Success"}
                        {status === 'error' && "Retry"}
                    </button>
                </form>

                {(logs.length > 0 || status === 'error') && (
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

export default WithdrawModal;
