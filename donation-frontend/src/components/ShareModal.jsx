import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Twitter, Facebook, Mail, Send } from 'lucide-react';
import '../styles/GlobalTheme.css';

const ShareModal = ({ isOpen, onClose, campaign }) => {
    const [copied, setCopied] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [walletCopied, setWalletCopied] = useState(false);

    const handleCopyWallet = () => {
        if (campaign?.walletAddress) {
            navigator.clipboard.writeText(campaign.walletAddress);
            setWalletCopied(true);
            setTimeout(() => setWalletCopied(false), 2000);
        }
    };

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
        } else {
            setTimeout(() => setIsVisible(false), 300); // Wait for exit animation
        }
    }, [isOpen]);

    if (!isVisible && !isOpen) return null;

    const campaignUrl = `${window.location.origin}/campaigns/${campaign?._id || campaign?.id}`;
    const shareText = `Check out this campaign: ${campaign?.title}. Help them reach their goal of ₹${campaign?.targetAmount}! #GlobalGive #BlockchainDonation`;

    const shareLinks = [
        {
            name: 'WhatsApp',
            icon: <div className="share-icon-whatsapp">WA</div>, // Lucide doesn't have WA, using text/styled div or replace with image if needed. But for now text placeholder or generic. Actually, let's use a generic Send icon or similar, or just text. Let's use MessageCircle from lucide if available, or just custom SVG. For now, I'll use a simple styled letter.
            color: '#25D366',
            url: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + campaignUrl)}`
        },
        {
            name: 'Twitter',
            icon: <Twitter size={24} />,
            color: '#1DA1F2',
            url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(campaignUrl)}`
        },
        {
            name: 'Facebook',
            icon: <Facebook size={24} />,
            color: '#4267B2',
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(campaignUrl)}`
        },
        {
            name: 'Telegram',
            icon: <Send size={24} />,
            color: '#0088cc',
            url: `https://t.me/share/url?url=${encodeURIComponent(campaignUrl)}&text=${encodeURIComponent(shareText)}`
        },
        {
            name: 'Email',
            icon: <Mail size={24} />,
            color: '#EA4335',
            url: `mailto:?subject=${encodeURIComponent(campaign?.title)}&body=${encodeURIComponent(shareText + '\n\n' + campaignUrl)}`
        }
    ];

    const handleCopy = () => {
        navigator.clipboard.writeText(campaignUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };



    return (
        <div className={`modal-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
            <div className={`modal-content share-modal ${isOpen ? 'open' : ''}`} onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Share Campaign</h3>
                    <button className="close-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <div className="share-campaign-info">
                    <p className="share-title">{campaign?.title}</p>
                    <p className="share-desc">Spread the word and help them reach their goal!</p>
                </div>

                <div className="share-grid">
                    {shareLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="share-item"
                            style={{ '--hover-color': link.color }}
                        >
                            <div className="share-icon-wrapper" style={{ color: link.color, borderColor: link.color }}>
                                {link.icon}
                            </div>
                            <span>{link.name}</span>
                        </a>
                    ))}
                </div>

                <div className="copy-link-section">
                    <label style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px', display: 'block' }}>Campaign Link</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <input type="text" value={campaignUrl} readOnly className="input-premium copy-input" />
                        <button className="btn-copy" onClick={handleCopy} title="Copy Link">
                            {copied ? <Check size={20} /> : <Copy size={20} />}
                        </button>
                    </div>
                </div>

                {campaign?.walletAddress && (
                    <div className="copy-link-section" style={{ marginTop: '16px' }}>
                        <label style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px', display: 'block' }}>
                            Campaign Wallet Address ({campaign.network})
                        </label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <input
                                type="text"
                                value={campaign.walletAddress}
                                readOnly
                                className="input-premium copy-input"
                                style={{ fontSize: '0.85rem', fontFamily: 'monospace' }}
                            />
                            <button className="btn-copy" onClick={handleCopyWallet} title="Copy Address">
                                {walletCopied ? <Check size={20} /> : <Copy size={20} />}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShareModal;
