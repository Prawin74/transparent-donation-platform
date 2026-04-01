import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Search,
    Heart,
    Shield,
    Users,
    ArrowRight,
    Globe,
    Activity,
    Stethoscope,
    GraduationCap,
    AlertCircle,
    Leaf
} from 'lucide-react';
import '../styles/Home.css';
import { useAuth } from '../contexts/AuthContext';

// Mock Data for Featured Fundraisers
const FEATURED_FUNDRAISERS = [
    {
        id: 1,
        title: "Urgent: Heart Surgery for Baby Tanya",
        description: "Help baby Tanya get the life-saving heart surgery she needs immediately.",
        raised: 125000,
        goal: 500000,
        image: "https://images.unsplash.com/photo-1519092676752-l8516ee717l4?auto=format&fit=crop&q=80&w=800",
        category: "Medical"
    },
    {
        id: 2,
        title: "Educate 100 Rural Children",
        description: "providing books, uniforms, and tuition for underprivileged kids in rural districts.",
        raised: 45000,
        goal: 100000,
        image: "https://images.unsplash.com/photo-1427504743050-6605296530a6?auto=format&fit=crop&q=80&w=800",
        category: "Education"
    },
    {
        id: 3,
        title: "Flood Relief: Rebuild Hope",
        description: "Emergency supplies and reconstruction for families affected by recent floods.",
        raised: 890000,
        goal: 1000000,
        image: "https://images.unsplash.com/photo-1542316410-b472eec30588?auto=format&fit=crop&q=80&w=800",
        category: "Emergency"
    }
];

const CATEGORIES = [
    { name: 'Medical', icon: Stethoscope },
    { name: 'Education', icon: GraduationCap },
    { name: 'Emergency', icon: AlertCircle },
    { name: 'Environment', icon: Leaf },
    { name: 'Social', icon: Users },
    { name: 'Community', icon: Globe },
];

const TESTIMONIALS = [
    {
        name: "Sarah Johnson",
        role: "Donor",
        quote: "Transparent and easy to use. I love seeing exactly where my money goes through the audit trail.",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
        name: "David Chen",
        role: "Campaigner",
        quote: "GlobalGive helped us raise funds for our local shelter in record time. The support was amazing.",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    }
];

const Home = () => {
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');

    const calculateProgress = (raised, goal) => {
        return Math.min((raised / goal) * 100, 100);
    };

    return (
        <div className="home-container">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="page-container">
                    <h1 className="hero-headline">Together, We Can<br />Change Lives</h1>
                    <p className="hero-subtitle">
                        Empower dreams, save lives, and build a better future.
                        Join our transparent community of givers and changemakers today.
                    </p>
                    <div className="hero-cta-group">
                        <Link to={user ? "/ngo" : "/signup"} className="btn-premium">
                            Start a Fundraiser
                        </Link>
                        <a href="#featured" className="btn-secondary">
                            Donate Now
                        </a>
                    </div>
                </div>
            </section>

            {/* Search & Categories */}
            <section className="search-categories-section">
                <div className="page-container">
                    {/* Search Bar */}
                    <div className="search-section">
                        <div className="search-bar-container">
                            <Search className="search-icon" />
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Search fundraisers by name, cause, or location..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="categories-grid">
                        {CATEGORIES.map((cat) => (
                            <div key={cat.name} className="category-card">
                                <div className="category-icon">
                                    <cat.icon size={24} />
                                </div>
                                <span className="category-name">{cat.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Fundraisers */}
            <section id="featured" className="section-common">
                <div className="page-container">
                    <div className="section-header">
                        <h2 className="section-title">Featured Fundraisers</h2>
                        <p className="section-desc">Support urgent causes and make an immediate impact.</p>
                    </div>

                    <div className="fundraiser-grid">
                        {FEATURED_FUNDRAISERS.map((campaign) => (
                            <div key={campaign.id} className="card-premium fundraiser-card">
                                <div className="card-image-wrapper">
                                    <span className="card-tag">{campaign.category}</span>
                                    <img src={campaign.image} alt={campaign.title} className="card-image" />
                                </div>
                                <div className="card-content">
                                    <h3 className="card-title">{campaign.title}</h3>
                                    <p className="card-desc">{campaign.description}</p>

                                    <div className="progress-section">
                                        <div className="progress-labels">
                                            <span className="progress-highlight">₹{campaign.raised.toLocaleString()}</span>
                                            <span>of ₹{campaign.goal.toLocaleString()}</span>
                                        </div>
                                        <div className="progress-bar-bg">
                                            <div
                                                className="progress-bar-fill"
                                                style={{ width: `${calculateProgress(campaign.raised, campaign.goal)}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    <Link to={`/campaign/${campaign.id}`} className="card-donate-btn">
                                        Donate Now
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="section-common" style={{ background: 'var(--bg-card)' }}>
                <div className="page-container">
                    <div className="section-header">
                        <h2 className="section-title">How It Works</h2>
                        <p className="section-desc">Start making a difference in three simple steps.</p>
                    </div>

                    <div className="steps-container">
                        <div className="step-item">
                            <div className="step-icon-wrapper">
                                <span className="step-number">1</span>
                                <Heart />
                            </div>
                            <h3 className="step-title">Start a Fundraiser</h3>
                            <p className="step-text">Share your story and set a goal for your cause.</p>
                        </div>
                        <div className="step-item">
                            <div className="step-icon-wrapper">
                                <span className="step-number">2</span>
                                <Users />
                            </div>
                            <h3 className="step-title">Share with Others</h3>
                            <p className="step-text">Spread the word to friends, family, and the community.</p>
                        </div>
                        <div className="step-item">
                            <div className="step-icon-wrapper">
                                <span className="step-number">3</span>
                                <Shield />
                            </div>
                            <h3 className="step-title">Receive Funds</h3>
                            <p className="step-text">Get funds securely directly to your bank account.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="section-common stats-section">
                <div className="page-container">
                    <div className="stats-grid">
                        <div className="stat-item">
                            <div className="stat-value">₹5CR+</div>
                            <div className="stat-label">Total Raised</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-value">100K+</div>
                            <div className="stat-label">Donors</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-value">5,000+</div>
                            <div className="stat-label">Success Stories</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="section-common">
                <div className="page-container">
                    <div className="section-header">
                        <h2 className="section-title">Happy Donors & Campaigners</h2>
                    </div>
                    <div className="grid-2">
                        {TESTIMONIALS.map((t, index) => (
                            <div key={index} className="card-premium testimonial-card">
                                <div className="user-profile">
                                    <img src={t.avatar} alt={t.name} className="user-avatar" />
                                    <div className="user-info">
                                        <h4>{t.name}</h4>
                                        <span>{t.role}</span>
                                    </div>
                                </div>
                                <p className="quote-text">"{t.quote}"</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Banner */}
            <div className="page-container">
                <div className="cta-banner">
                    <h2>Your small help can make a big difference</h2>
                    <p>Join thousands of other donors and start changing lives today.</p>
                    <Link to="/signup" className="btn-white">
                        Start Helping Today
                    </Link>
                </div>
            </div>

            {/* Footer */}
            <footer className="home-footer">
                <div className="footer-content">
                    <div className="footer-brand">
                        <h3>GlobalGive</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>
                            Transparent, secure, and impactful crowdfunding for everyone.
                        </p>
                    </div>
                    <div className="footer-links">
                        <h4>Platform</h4>
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/about">About Us</Link></li>
                            <li><Link to="/how-it-works">How It Works</Link></li>
                            <li><Link to="/fees">Pricing & Fees</Link></li>
                        </ul>
                    </div>
                    <div className="footer-links">
                        <h4>Support</h4>
                        <ul>
                            <li><Link to="/faq">FAQs</Link></li>
                            <li><Link to="/contact">Contact Us</Link></li>
                            <li><Link to="/trust">Trust & Safety</Link></li>
                        </ul>
                    </div>
                    <div className="footer-links">
                        <h4>Legal</h4>
                        <ul>
                            <li><Link to="/privacy">Privacy Policy</Link></li>
                            <li><Link to="/terms">Terms of Use</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    &copy; {new Date().getFullYear()} GlobalGive. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default Home;
