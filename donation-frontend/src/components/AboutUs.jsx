import React from 'react';
import { Link } from 'react-router-dom';
import {
    Shield,
    Heart,
    Eye,
    CheckCircle,
    Users,
    Globe,
    Activity,
    Lock,
    Award,
    TrendingUp,
    FileText
} from 'lucide-react';
import '../styles/AboutUs.css';

const AboutUs = () => {
    return (
        <div className="about-page">
            {/* 1. Hero Section */}
            <section className="about-hero animate-fade-in">
                <div className="section-container">
                    <h1 className="about-headline">Transparency is Our Foundation,<br />Trust is Our Currency</h1>
                    <p className="about-subtext">
                        We are building a world where every donation is tracked, every fundraiser is verified,
                        and every act of kindness makes a tangible difference.
                    </p>
                </div>
            </section>

            {/* 2. Our Purpose */}
            <section className="about-section">
                <div className="section-container purpose-grid">
                    <div className="purpose-content">
                        <h3>Why We Exist</h3>
                        <p>
                            Traditional crowdfunding often suffers from a lack of clarity. Donors wonder,
                            "Did my money actually reach the person in need?"
                        </p>
                        <p>
                            GlobalGive was born to solve this. We leverage technology to create an
                            immutable, transparent record of every transaction. Our mission is to empower
                            individuals and NGOs to raise funds with dignity, while giving donors the
                            absolute confidence that their support creates real impact.
                        </p>
                    </div>
                    <div className="purpose-visual">
                        {/* Placeholder for a trust/community illustration */}
                        <div style={{
                            width: '100%',
                            height: '300px',
                            background: 'radial-gradient(ellipse at center, rgba(79, 70, 229, 0.15), transparent)',
                            borderRadius: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px solid var(--glass-border)'
                        }}>
                            <Shield size={120} color="var(--text-accent)" style={{ opacity: 0.2 }} />
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. What We Do - Process */}
            <section className="about-section" style={{ background: 'var(--bg-card)' }}>
                <div className="section-container">
                    <h2 className="about-section-title">How We Empower Change</h2>
                    <div className="process-steps">
                        <div className="process-card">
                            <div className="process-icon">
                                <FileText size={32} />
                            </div>
                            <h4>Easy Campaign Creation</h4>
                            <p>Launch a fundraiser in minutes with verified details and a compelling story.</p>
                        </div>
                        <div className="process-card">
                            <div className="process-icon">
                                <Activity size={32} />
                            </div>
                            <h4>Trackable Donations</h4>
                            <p>Every rupee donated is recorded. See exactly when and where funds are transferred.</p>
                        </div>
                        <div className="process-card">
                            <div className="process-icon">
                                <TrendUpIconWrapper />
                            </div>
                            <h4>Real-Time Progress</h4>
                            <p>Stay updated with live milestones, withdrawal requests, and impact reports.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Transparency & Verification */}
            <section className="about-section">
                <div className="section-container">
                    <h2 className="about-section-title">Uncompromising Transparency</h2>
                    <div className="features-grid">
                        <div className="feature-item">
                            <CheckCircle className="feature-icon-sm" />
                            <div className="feature-text">
                                <h4>Verified Campaigns</h4>
                                <p>Strict identity and document checks for every fundraiser.</p>
                            </div>
                        </div>
                        <div className="feature-item">
                            <Eye className="feature-icon-sm" />
                            <div className="feature-text">
                                <h4>Fund Flow Visibility</h4>
                                <p>Public audit trail of all deposits and withdrawals.</p>
                            </div>
                        </div>
                        <div className="feature-item">
                            <Lock className="feature-icon-sm" />
                            <div className="feature-text">
                                <h4>Secure Payments</h4>
                                <p>Bank-grade security ensures your money is safe at every step.</p>
                            </div>
                        </div>
                        <div className="feature-item">
                            <Shield className="feature-icon-sm" />
                            <div className="feature-text">
                                <h4>Anti-Fraud Systems</h4>
                                <p>Proactive monitoring to prevent misuse of funds.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. Causes We Support */}
            <section className="about-section">
                <div className="section-container">
                    <h2 className="about-section-title">Causes We Support</h2>
                    <div className="causes-grid">
                        <div className="cause-tag">Medical Emergencies</div>
                        <div className="cause-tag">Education Support</div>
                        <div className="cause-tag">Disaster Relief</div>
                        <div className="cause-tag">Social Welfare</div>
                        <div className="cause-tag">Animal Welfare</div>
                        <div className="cause-tag">Community Development</div>
                        <div className="cause-tag">Environment</div>
                        <div className="cause-tag">Elderly Care</div>
                    </div>
                </div>
            </section>

            {/* 6. Our Values */}
            <section className="about-section" style={{ background: 'var(--bg-card)' }}>
                <div className="section-container">
                    <h2 className="about-section-title">Our Core Values</h2>
                    <div className="values-container">
                        <div className="value-card">
                            <Eye size={40} className="value-icon" />
                            <h3>Radical Transparency</h3>
                            <p>We believe honesty is the only policy. Nothing is hidden from our donors.</p>
                        </div>
                        <div className="value-card">
                            <Heart size={40} className="value-icon" />
                            <h3>Compassion First</h3>
                            <p>We work to serve those in dire need with empathy and respect.</p>
                        </div>
                        <div className="value-card">
                            <Award size={40} className="value-icon" />
                            <h3>Accountability</h3>
                            <p>We take responsibility for every campaign hosted on our platform.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 7. Why Trust Us */}
            <section className="about-section">
                <div className="section-container">
                    <h2 className="about-section-title">Why Trust GlobalGive?</h2>

                    <div className="trust-indicators">
                        <div className="trust-item">
                            <Globe size={32} className="trust-icon" />
                            <span>Global Standards</span>
                        </div>
                        <div className="trust-item">
                            <Lock size={32} className="trust-icon" />
                            <span>AES Encryption</span>
                        </div>
                        <div className="trust-item">
                            <Users size={32} className="trust-icon" />
                            <span>Community Vetted</span>
                        </div>
                        <div className="trust-item">
                            <CheckCircle size={32} className="trust-icon" />
                            <span>100% Verified</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* 8. Community & Impact */}
            <section className="about-section">
                <div className="section-container" style={{ textAlign: 'center' }}>
                    <h2 className="about-section-title">A Community of Changemakers</h2>
                    <p style={{ maxWidth: '700px', margin: '0 auto 40px', color: 'var(--text-secondary)' }}>
                        We are more than a platform; we are a movement. By connecting generous hearts with
                        urgent needs, we foster a cycle of gratitude and hope. Every donor, volunteer, and
                        campaigner plays a vital role in this ecosystem of good.
                    </p>
                </div>
            </section>

            {/* 9. Closing CTA */}
            <section className="about-section">
                <div className="section-container">
                    <div className="about-cta">
                        <h2>Ready to Make a Difference?</h2>
                        <p>Join thousands of others in our mission to bring transparency and hope to the world.</p>
                        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                            <Link to="/signup" className="btn-premium">Start Fundraising</Link>
                            <Link to="/" className="btn-secondary">Explore Causes</Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

// Helper for icon consistency
const TrendUpIconWrapper = () => (
    <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
        <polyline points="17 6 23 6 23 12"></polyline>
    </svg>
);

export default AboutUs;
