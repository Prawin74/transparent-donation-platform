import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useWallet } from '../hooks/useWallet';
import '../styles/NGODashboard.css';
import { Upload, ChevronRight, Check } from 'lucide-react';

const CreateCampaign = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { account } = useWallet();

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'Medical',
    description: '',
    targetAmount: '',
    deadline: '',
    beneficiaryName: '',
    image: null,
    walletAddress: '',
    network: 'Ethereum'
  });

  // Auto-fill wallet address from connected MetaMask account
  useEffect(() => {
    if (account) {
      setFormData(prev => ({ ...prev, walletAddress: account }));
    }
  }, [account]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('globalgive_token');
      if (!token) {
        alert('You must be logged in to create a campaign');
        navigate('/login');
        return;
      }

      // Clear per-field frontend validation
      const evmAddressRegex = /^0x[a-fA-F0-9]{40}$/;
      if (!formData.title.trim()) { alert('Campaign Title is required.'); setLoading(false); return; }
      if (!formData.description.trim()) { alert('Campaign Description is required.'); setLoading(false); return; }
      if (!formData.targetAmount) { alert('Target Amount is required.'); setLoading(false); return; }
      if (!formData.deadline) { alert('End Date is required.'); setLoading(false); return; }
      if (!formData.beneficiaryName.trim()) { alert('Beneficiary Name is required.'); setLoading(false); return; }
      if (!formData.walletAddress) { alert('Campaign Wallet Address is required. Please connect your MetaMask wallet or enter an address manually.'); setLoading(false); return; }
      if (!evmAddressRegex.test(formData.walletAddress)) {
        alert("Invalid wallet address format. Must be a valid EVM address starting with 0x followed by 40 hex characters.");
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:3001/api/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create campaign');
      }

      alert('Campaign Created Successfully!');
      navigate('/ngo');

    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in-up">
      <div className="dashboard-header">
        <h1 className="page-title">Create New Campaign</h1>
      </div>

      {/* Wizard Steps */}
      <div className="wizard-steps">
        <div className={`wizard-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
          <div className="step-circle">{step > 1 ? <Check size={16} /> : '1'}</div>
          <span className="step-label">Details</span>
        </div>
        <div className={`wizard-step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
          <div className="step-circle">{step > 2 ? <Check size={16} /> : '2'}</div>
          <span className="step-label">Media & Financials</span>
        </div>
        <div className={`wizard-step ${step >= 3 ? 'active' : ''}`}>
          <div className="step-circle">3</div>
          <span className="step-label">Review & Deploy</span>
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} style={{ maxWidth: '800px', margin: '0 auto' }}>

        {/* Step 1: Basic Details */}
        {step === 1 && (
          <div className="form-step animate-fade-in">
            <div className="input-group">
              <label className="input-label">Campaign Title</label>
              <input
                type="text"
                name="title"
                className="input-premium"
                placeholder="e.g. Help Kids in Rural India"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-group">
              <label className="input-label">Category</label>
              <select
                name="category"
                className="input-premium"
                value={formData.category}
                onChange={handleChange}
              >
                <option>Medical</option>
                <option>Education</option>
                <option>Disaster Relief</option>
                <option>Social Cause</option>
              </select>
            </div>
            <div className="input-group">
              <label className="input-label">Story / Description</label>
              <textarea
                name="description"
                className="input-premium"
                rows="6"
                placeholder="Describe why this campaign matters..."
                value={formData.description}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button type="button" onClick={handleNext} className="btn-premium">
                Next Step <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Media & Financials */}
        {step === 2 && (
          <div className="form-step animate-fade-in">
            <div className="grid-2">
              <div className="input-group">
                <label className="input-label">Target Amount (INR/USD)</label>
                <input
                  type="number"
                  name="targetAmount"
                  className="input-premium"
                  placeholder="e.g. 5000"
                  value={formData.targetAmount}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-group">
                <label className="input-label">End Date</label>
                <input
                  type="date"
                  name="deadline"
                  className="input-premium"
                  value={formData.deadline}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Beneficiary Name</label>
              <input
                type="text"
                name="beneficiaryName"
                className="input-premium"
                placeholder="Who will receive the funds?"
                value={formData.beneficiaryName}
                onChange={handleChange}
                required
              />
            </div>

            {/* Wallet Architecture Inputs */}
            <div style={{ background: 'var(--bg-main)', padding: '20px', borderRadius: '12px', border: '1px solid var(--glass-border)', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', color: 'var(--text-accent)' }}>Campaign Wallet Configuration</h3>
              <div className="grid-2">
                <div className="input-group">
                  <label className="input-label">Blockchain Network</label>
                  <select
                    name="network"
                    className="input-premium"
                    value={formData.network}
                    onChange={handleChange}
                  >
                    <option>Ethereum</option>
                    <option>Polygon</option>
                    <option>BSC</option>
                  </select>
                </div>
                <div className="input-group">
                  <label className="input-label">
                    Campaign Wallet Address
                    {account && <span style={{ marginLeft: '8px', fontSize: '0.75rem', color: '#10b981' }}>✓ Auto-filled from MetaMask</span>}
                  </label>
                  <input
                    type="text"
                    name="walletAddress"
                    className="input-premium"
                    placeholder="Connect MetaMask or enter 0x address..."
                    value={formData.walletAddress}
                    onChange={handleChange}
                    required
                    pattern="^0x[a-fA-F0-9]{40}$"
                    title="Must be a valid EVM address starting with 0x"
                  />
                </div>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
                <span style={{ color: '#f59e0b', marginRight: '6px' }}>⚠</span>
                Funds will be sent directly to this address. Ensure you have access to the private keys.
              </p>
            </div>

            <div className="input-group">
              <label className="input-label">Cover Image</label>
              <div style={{
                border: '2px dashed var(--glass-border)',
                padding: '32px',
                borderRadius: '12px',
                textAlign: 'center',
                cursor: 'pointer',
                background: 'var(--bg-card)'
              }}>
                <Upload size={32} style={{ color: 'var(--text-secondary)', marginBottom: '12px' }} />
                <p style={{ color: 'var(--text-secondary)' }}>Click to upload cover image</p>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>JPG, PNG up to 5MB</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
              <button type="button" onClick={handleBack} className="btn-secondary">
                Back
              </button>
              <button type="button" onClick={handleNext} className="btn-premium">
                Next Step <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <div className="form-step animate-fade-in">
            <div style={{ background: 'var(--bg-card)', borderRadius: '16px', padding: '24px', marginBottom: '24px', border: '1px solid var(--glass-border)' }}>
              <h3 style={{ marginTop: 0, color: 'var(--text-primary)' }}>Summary</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', color: 'var(--text-secondary)' }}>
                <div>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Title</span>
                  <p style={{ margin: '4px 0', fontSize: '1.1rem', color: 'var(--text-primary)' }}>{formData.title}</p>
                </div>
                <div>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Target</span>
                  <p style={{ margin: '4px 0', fontSize: '1.1rem', color: '#10b981' }}>{formData.targetAmount}</p>
                </div>
                <div>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Beneficiary</span>
                  <p style={{ margin: '4px 0', color: 'var(--text-primary)' }}>{formData.beneficiaryName}</p>
                </div>
                <div>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Category</span>
                  <p style={{ margin: '4px 0', color: 'var(--text-primary)' }}>{formData.category}</p>
                </div>
                <div>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Network</span>
                  <p style={{ margin: '4px 0', color: 'var(--text-primary)' }}>{formData.network}</p>
                </div>
                <div>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Wallet</span>
                  <p style={{ margin: '4px 0', fontFamily: 'monospace', color: 'var(--text-primary)' }}>{formData.walletAddress.substring(0, 6)}...{formData.walletAddress.substring(38)}</p>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
              <button type="button" onClick={handleBack} className="btn-secondary">
                Back
              </button>
              <button
                type="submit"
                className="btn-premium"
                disabled={loading}
                style={{ background: 'linear-gradient(90deg, #10b981, #059669)', width: '200px' }}
              >
                {loading ? 'Deploying...' : 'Deploy Campaign'}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default CreateCampaign;
