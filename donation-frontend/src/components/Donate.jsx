import React, { useState } from 'react';
import { useWallet } from '../hooks/useWallet';
import { useDonation } from '../hooks/useDonation'; // IMPORT NEW HOOK
import { AlertCircle, ExternalLink, RefreshCw, Wallet, PartyPopper } from 'lucide-react';
import { explorerLink } from '../utils/contractABI';

const Donate = () => {
  const {
    account,
    balance,
    isPolygonAmoy,
    connectWallet,
    switchNetwork,
    validateDonation,
    isConnecting,

    signer,
    validateAddress
  } = useWallet();

  // Init useDonation hooks
  const { donate, status: donationStatus, txHash, error: donationError, reset, isMock } = useDonation(signer, account);

  // State for inputs
  const [campaignId, setCampaignId] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [localError, setLocalError] = useState(null);

  const handleDonate = async (e) => {
    e.preventDefault();
    setLocalError(null);
    reset();

    // 1. Connectivity Check
    if (!account) {
      await connectWallet();
      return;
    }

    // 2. Network Check
    // The hook also checks this, but good for UI feedback
    if (!isPolygonAmoy) {
      setLocalError("Please switch to Polygon Amoy Testnet.");
      return;
    }

    // 3. Inputs Check
    if (!campaignId || !walletAddress) {
      setLocalError("Please provide Campaign ID and Wallet Address.");
      return;
    }

    if (!validateAddress(walletAddress)) {
      setLocalError("Invalid Wallet Address. Must be a valid Polygon address (0x...).");
      return;
    }

    // 4. Validate Amount
    const validationError = validateDonation(amount);
    if (validationError) {
      setLocalError(validationError);
      return;
    }

    // 5. Execute Donation via Hook (Handles Gas, Logging, Contract)
    await donate(campaignId, walletAddress, amount);

    if (donationStatus === 'success') {
      setAmount('');
    }
  };

  // Derived State
  const status = donationStatus; // checking, preparing, signing, broadcasting, success, error
  const error = localError || donationError;

  return (
    <div className="card-premium" style={{ transition: 'all 0.3s ease' }}>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '16px', color: 'var(--text-primary)' }}>
        Quick Donate
      </h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
        Directly donate MATIC to any campaign on the platform.
      </p>

      {/* Network & Account Status */}
      {account && (
        <div style={{ marginBottom: '20px', padding: '12px', background: 'var(--bg-main)', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Status</span>
            <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%' }}></div>
              Connected
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <code style={{ fontSize: '0.8rem', color: 'var(--text-primary)', background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '4px' }}>
              {account.slice(0, 6)}...{account.slice(-4)}
            </code>
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
              {parseFloat(balance).toFixed(4)} MATIC
            </span>
          </div>
        </div>
      )}

      {/* Network Warning */}
      {account && !isPolygonAmoy && (
        <div style={{
          padding: '12px', background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px',
          marginBottom: '20px', fontSize: '0.9rem', color: '#ef4444'
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

      <form onSubmit={handleDonate} style={{ display: 'grid', gap: '16px' }}>
        {/* Campaign Details Inputs */}
        <div>
          <label className="label-premium">Campaign ID</label>
          <input
            className="input-premium"
            value={campaignId}
            onChange={e => setCampaignId(e.target.value)}
            placeholder="e.g. 64f..."
            disabled={status !== 'idle' && status !== 'error'}
          />
        </div>

        <div>
          <label className="label-premium">Wallet Address</label>
          <input
            className="input-premium"
            value={walletAddress}
            onChange={e => setWalletAddress(e.target.value)}
            placeholder="0x..."
            disabled={status !== 'idle' && status !== 'error'}
          />
        </div>

        <div>
          <label className="label-premium">Amount (MATIC)</label>
          <div style={{ position: 'relative' }}>
            <input
              type="number"
              step="0.0001"
              className="input-premium"
              placeholder="0.1"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setLocalError(null);
              }}
              disabled={status !== 'idle' && status !== 'error'}
              style={{ paddingRight: '60px' }}
            />
            <span style={{
              position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)',
              fontWeight: 600, color: 'var(--text-secondary)'
            }}>MATIC</span>
          </div>
        </div>

        {error && (
          <div style={{ padding: '10px', background: 'rgba(239,68,68,0.1)', borderRadius: '6px', color: '#ef4444', fontSize: '0.9rem', display: 'flex', gap: '8px' }}>
            <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>{error}</span>
          </div>
        )}

        {/* Enhanced Success UI */}
        {status === 'success' ? (
          <div style={{
            textAlign: 'center',
            padding: '24px',
            background: 'radial-gradient(circle at center, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.05) 100%)',
            borderRadius: '16px',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            animation: 'fadeIn 0.5s ease'
          }}>
            <div style={{
              width: '50px', height: '50px', background: '#10b981', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
              boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)'
            }}>
              <PartyPopper size={24} color="#fff" />
            </div>
            <h3 style={{ color: '#10b981', margin: '0 0 8px 0', fontSize: '1.4rem' }}>Donation Confirmed!</h3>
            {isMock && (
              <span style={{
                display: 'inline-block', marginBottom: '8px',
                padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700,
                background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.3)'
              }}>✨ Demo Mode — Simulated Transaction</span>
            )}
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Your transaction has been securely recorded on the Polygon Amoy blockchain.
            </p>

            <a
              href={explorerLink('tx', txHash, 'https://amoy.polygonscan.com')}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.2)',
                marginBottom: '16px', fontSize: '0.9rem', padding: '8px 16px'
              }}
            >
              View on PolygonScan <ExternalLink size={14} />
            </a>

            <button
              type="button"
              onClick={reset}
              className="btn-premium"
              style={{ width: '100%', fontSize: '0.9rem', background: 'var(--bg-card)', border: '1px solid var(--glass-border)' }}
            >
              Donate Again
            </button>
          </div>
        ) : (
          <button
            type="submit"
            className="btn-premium"
            style={{ width: '100%', justifyContent: 'center' }}
            disabled={status !== 'idle' && status !== 'error' || (account && !isPolygonAmoy)}
          >
            {!account ? 'Connect Wallet' :
              status === 'checking' ? 'Verifying...' :
                status === 'preparing' ? 'Optimizing Gas...' :
                  status === 'signing' ? 'Check MetaMask...' :
                    status === 'broadcasting' ? 'Broadcasting...' :
                      'Donate Now'}
            {(status !== 'idle' && status !== 'error' && status !== 'success') && <RefreshCw size={16} className="spin" style={{ marginLeft: '8px' }} />}
          </button>
        )}
      </form>
    </div>
  );
};

export default Donate;
