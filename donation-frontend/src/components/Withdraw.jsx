import React, { useState } from 'react';
import { Upload, AlertTriangle, ShieldCheck } from 'lucide-react';
import '../styles/NGODashboard.css';

const Withdraw = () => {
  // Mock Data for Campaigns owned by this NGO
  const campaigns = [
    { id: 1, title: 'Help Kids in Rural India', raised: 450000, balance: 120000 },
    { id: 2, title: 'Flood Relief 2024', raised: 1200000, balance: 850000 }
  ];

  const [selectedCampaign, setSelectedCampaign] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const activeCampaign = campaigns.find(c => c.id === parseInt(selectedCampaign));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate withdrawal
    setTimeout(() => {
      setLoading(false);
      alert('Withdrawal Request Processed! Funds will be transferred after verification.');
      setAmount('');
    }, 2000);
  };

  return (
    <div className="fade-in-up">
      <div className="dashboard-header">
        <h1 className="page-title">Safe Withdrawal</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(16, 185, 129, 0.1)', padding: '8px 16px', borderRadius: '20px', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
          <ShieldCheck size={18} />
          <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>Secure Mode</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        {/* Withdrawal Form */}
        <div className="card-premium" style={{ padding: '32px' }}>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="input-label">Select Campaign</label>
              <select
                className="input-premium"
                value={selectedCampaign}
                onChange={(e) => setSelectedCampaign(e.target.value)}
                required
              >
                <option value="">-- Choose Campaign --</option>
                {campaigns.map(c => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>

            {activeCampaign && (
              <div style={{
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.05))',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ color: '#94a3b8' }}>Available Balance</span>
                <span style={{ fontSize: '1.4rem', fontWeight: '700', color: '#60a5fa' }}>
                  ₹ {activeCampaign.balance.toLocaleString()}
                </span>
              </div>
            )}

            <div className="input-group">
              <label className="input-label">Withdrawal Amount (₹)</label>
              <input
                type="number"
                className="input-premium"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                max={activeCampaign?.balance}
                disabled={!activeCampaign}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Purpose of Withdrawal</label>
              <textarea
                className="input-premium"
                rows="3"
                placeholder="E.g. Purchasing medical kits for batch #2..."
                required
              ></textarea>
              <span style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px', display: 'block' }}>
                This will be recorded on the blockchain public ledger.
              </span>
            </div>

            <div className="input-group">
              <label className="input-label">Proof of Work (Invoice/Estimate)</label>
              <div style={{
                border: '1px dashed rgba(255,255,255,0.1)',
                padding: '16px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer'
              }}>
                <Upload size={20} style={{ color: '#94a3b8' }} />
                <span style={{ color: '#cbd5e1' }}>Upload Document</span>
              </div>
            </div>

            <button
              type="submit"
              className="btn-premium"
              style={{ width: '100%', marginTop: '16px', background: 'linear-gradient(135deg, #ef4444, #b91c1c)' }}
              disabled={loading || !activeCampaign}
            >
              {loading ? 'Processing...' : 'Withdraw Funds'}
            </button>
          </form>
        </div>

        {/* Important Notice */}
        <div>
          <div style={{
            background: 'rgba(239, 68, 68, 0.05)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '16px',
            padding: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', color: '#ef4444' }}>
              <AlertTriangle size={24} />
              <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Important Notice</h3>
            </div>
            <ul style={{ paddingLeft: '20px', color: '#cbd5e1', lineHeight: '1.6' }}>
              <li>Withdrawals are <strong>permanent and immutable</strong>.</li>
              <li>You must upload proof of expenditure (invoices, receipts) within 7 days of withdrawal.</li>
              <li>Failure to provide proof may lead to account suspension.</li>
              <li>For amounts over ₹ 1,00,000, 2-factor authentication is required.</li>
            </ul>
          </div>

          <div style={{ marginTop: '24px' }}>
            <h4 style={{ color: '#fff', marginBottom: '16px' }}>Recent Withdrawals</h4>
            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#fff' }}>Medical Kits Batch 1</span>
                <span style={{ color: '#ef4444', fontWeight: '600' }}>- ₹ 50,000</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#64748b' }}>
                <span>12 Dec 2024</span>
                <span style={{ color: '#10b981' }}>Verified</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Withdraw;
