import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Web3Context } from '../App';
import { ethers } from 'ethers';
import { Share2, Clock, Target, AlertCircle, Copy, ExternalLink, Check, Radio } from 'lucide-react';
import ShareModal from './ShareModal';
import DonationList from './DonationList';
import DonationForm from './DonationForm';
import { io } from 'socket.io-client';
import { donationPlatformABI, CONTRACT_ADDRESSES } from '../utils/contractABI';

const CampaignDetails = () => {
  const { id } = useParams();
  const { provider, signer, connectWallet, account } = useContext(Web3Context);
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [donationAmount, setDonationAmount] = useState('');
  const [donating, setDonating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [donations, setDonations] = useState([]);
  const [baseApiUrl] = useState('http://localhost:3001');
  const [isProcessing, setIsProcessing] = useState(false);

  // Socket state
  const [socket, setSocket] = useState(null);
  const [liveEvent, setLiveEvent] = useState(null);

  useEffect(() => {
    // Initialize Socket
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('🔌 Connected to Real-Time Donation Feed');
    });

    // Listen for new donations for THIS campaign
    newSocket.on('newDonation', (data) => {
      if (data.campaignId === id) {
        console.log("🚀 Live Donation Received!", data);

        // Show floating notification or highlight
        setLiveEvent(data);
        setTimeout(() => setLiveEvent(null), 5000);

        // Update donations list immediately
        setDonations(prev => [data, ...prev]);

        // Update raised amount safely
        setCampaign(prev => prev ? ({
          ...prev,
          raisedAmount: (prev.raisedAmount || 0) + Number(data.amount)
        }) : null);
      }
    });

    return () => newSocket.disconnect();
  }, [id]);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const response = await fetch(`${baseApiUrl}/api/campaigns/${id}`);
        if (!response.ok) throw new Error('Campaign not found');
        const data = await response.json();
        setCampaign(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    const fetchDonations = async () => {
      try {
        const response = await fetch(`${baseApiUrl}/api/campaigns/${id}/donations`);
        if (response.ok) {
          const data = await response.json();
          setDonations(data);
        }
      } catch (error) {
        console.error("Failed to fetch donations", error);
      }
    };

    fetchCampaign();
    fetchDonations();
  }, [id, baseApiUrl]);

  const handleCopyAddress = () => {
    if (campaign?.walletAddress) {
      navigator.clipboard.writeText(campaign.walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDonate = async () => {
    if (!donationAmount || parseFloat(donationAmount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    if (!account) {
      await connectWallet();
      return;
    }

    try {
      setDonating(true);
      setIsProcessing(true);

      // SMART CONTRACT FLOW
      const contract = new ethers.Contract(
        CONTRACT_ADDRESSES.DonationPlatform,
        donationPlatformABI,
        signer
      );

      console.log("Initiating Smart Contract Donation...");

      // donate(string campaignId, address recipient)
      const tx = await contract.donate(id, campaign.walletAddress, {
        value: ethers.parseEther(donationAmount)
      });

      console.log("Transaction Sent:", tx.hash);

      // Notify user of pending status
      alert(`Transaction Sent! Waiting for blockchain confirmation... Hash: ${tx.hash}`);

      await tx.wait();

      console.log("Transaction Confirmed:", tx.hash);
      // NOTE: We do NOT need to manually POST to backend anymore. 
      // The Backend Listener will catch the event and update the DB + Socket.

      setDonationAmount('');
      setIsProcessing(false);

    } catch (error) {
      console.error("Donation failed:", error);
      alert("Donation failed: " + (error.reason || error.message || "Unknown error"));
      setIsProcessing(false);
    } finally {
      setDonating(false);
    }
  };

  if (loading) return <div style={{ color: 'var(--text-primary)', textAlign: 'center', marginTop: '50px' }}>Loading campaign...</div>;
  if (!campaign) return <div style={{ color: 'var(--text-primary)', textAlign: 'center', marginTop: '50px' }}>Campaign not found</div>;

  const progress = Math.min(((campaign.raisedAmount || 0) / campaign.targetAmount) * 100, 100);

  return (
    <div className="page-container animate-fade-in" style={{ position: 'relative' }}>
      <ShareModal isOpen={shareModalOpen} onClose={() => setShareModalOpen(false)} campaign={campaign} />

      {/* Live Event Toast */}
      {liveEvent && (
        <div style={{
          position: 'fixed',
          top: '100px',
          right: '24px',
          background: 'rgba(16, 185, 129, 0.9)',
          backdropFilter: 'blur(10px)',
          color: 'white',
          padding: '16px 24px',
          borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          zIndex: 1000,
          animation: 'float 3s ease-in-out infinite',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <div style={{ background: 'white', borderRadius: '50%', padding: '4px' }}>
            <Radio size={20} color="#10b981" />
          </div>
          <div>
            <p style={{ margin: 0, fontWeight: 700, fontSize: '1rem' }}>New Donation!</p>
            <p style={{ margin: 0, fontSize: '0.9rem' }}>{liveEvent.amount} ETH from {liveEvent.donor?.slice(0, 6)}...</p>
          </div>
        </div>
      )}

      <div className="grid-2" style={{ gap: '40px', alignItems: 'start' }}>
        {/* Left Column: Image & Details */}
        <div>
          <div style={{
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            marginBottom: '32px'
          }}>
            <img
              src={campaign.image || "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"}
              alt={campaign.title}
              style={{ width: '100%', height: '400px', objectFit: 'cover' }}
            />
          </div>

          <div className="card-premium">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
              <span style={{
                background: 'rgba(99, 102, 241, 0.2)',
                color: '#818cf8',
                padding: '6px 16px',
                borderRadius: '20px',
                fontSize: '0.9rem',
                fontWeight: 600
              }}>
                {campaign.category}
              </span>
              <button
                onClick={() => setShareModalOpen(true)}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                title="Share Campaign"
                className="hover:bg-white/10"
              >
                <Share2 size={20} />
              </button>
            </div>

            <h1 style={{ fontSize: '2.5rem', marginBottom: '16px', lineHeight: 1.2, color: 'var(--text-primary)' }}>{campaign.title}</h1>

            <div style={{ display: 'flex', gap: '24px', marginBottom: '24px', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={18} />
                <span>Ends {new Date(campaign.deadline).toLocaleDateString()}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Target size={18} />
                <span>Goal: ₹ {campaign.targetAmount}</span>
              </div>
            </div>

            <h3 style={{ color: 'var(--text-primary)', marginBottom: '12px' }}>About this Campaign</h3>
            <p style={{ whiteSpace: 'pre-line', fontSize: '1.05rem', color: 'var(--text-secondary)' }}>{campaign.description}</p>
          </div>

          {/* Transaction History Section - Now Real-time */}
          <div style={{ position: 'relative' }}>
            <DonationList donations={donations} />
            {donations.length > 0 && (
              <div style={{
                position: 'absolute', top: '40px', right: '24px',
                display: 'flex', alignItems: 'center', gap: '6px',
                background: 'rgba(16, 185, 129, 0.1)', // Light green bg
                border: '1px solid rgba(16, 185, 129, 0.3)',
                padding: '4px 12px', borderRadius: '20px'
              }}>
                <span style={{
                  width: '8px', height: '8px',
                  background: '#10b981', borderRadius: '50%',
                  boxShadow: '0 0 10px #10b981',
                  animation: 'pulse 1.5s infinite'
                }}></span>
                <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>LIVE FEED</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Donation Card */}
        <div style={{ position: 'sticky', top: '100px' }}>
          <div className="card-premium" style={{
            background: 'var(--bg-card)',
            backdropFilter: 'blur(20px)',
            border: '1px solid var(--glass-border)'
          }}>
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Raised</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{progress.toFixed(1)}%</span>
              </div>
              <div style={{ height: '8px', background: 'var(--glass-border)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${progress}%`, height: '100%', background: '#10b981', transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
                <div>
                  <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#10b981', margin: 0, transition: 'all 0.3s' }}>
                    ₹ {campaign.raisedAmount || 0}
                  </p>
                  <p style={{ fontSize: '0.85rem', margin: 0 }}>raised of ₹ {campaign.targetAmount}</p>
                </div>
              </div>
            </div>

            {/* Wallet Section */}
            <div style={{
              background: 'var(--bg-main)',
              padding: '16px',
              borderRadius: '12px',
              border: '1px solid var(--glass-border)',
              marginBottom: '24px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>Campaign Wallet</p>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{campaign.network}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <code style={{
                  flex: 1,
                  background: 'var(--glass-border)',
                  padding: '8px',
                  borderRadius: '6px',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {campaign.walletAddress}
                </code>
                <button
                  onClick={handleCopyAddress}
                  style={{
                    background: copied ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.1)',
                    border: 'none',
                    borderRadius: '6px',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: copied ? '#10b981' : '#fff',
                    transition: 'all 0.2s'
                  }}
                  title="Copy Address"
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                </button>
                <a
                  href={`https://etherscan.io/address/${campaign.walletAddress}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '6px',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff'
                  }}
                  title="View on Explorer"
                >
                  <ExternalLink size={18} />
                </a>
              </div>
            </div>

            {/* Donation Form Component */}
            <DonationForm
              campaignId={id}
              walletAddress={campaign.walletAddress}
              campaignTitle={campaign.title}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetails;
