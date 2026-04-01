import React, { useState } from 'react';
import '../styles/AboutUs.css'; // Reusing about styles for consistency

const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        // Simulate API call
        setTimeout(() => setSubmitted(false), 3000);
    };

    return (
        <div className="about-page">
            <section className="about-hero animate-fade-in" style={{ paddingBottom: '40px' }}>
                <div className="section-container">
                    <h1 className="about-headline">Get in Touch</h1>
                    <p className="about-subtext">
                        Have questions about a fundraiser? Want to partner with us?
                        We're here to help.
                    </p>
                </div>
            </section>

            <section className="about-section">
                <div className="section-container" style={{ maxWidth: '600px' }}>
                    {submitted ? (
                        <div style={{ textAlign: 'center', padding: '40px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                            <h3 style={{ color: '#10b981', marginBottom: '8px' }}>Message Sent!</h3>
                            <p>Thank you for reaching out. We'll get back to you shortly.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} style={{ background: 'var(--bg-card)', padding: '32px', borderRadius: '24px', border: '1px solid var(--glass-border)' }}>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Name</label>
                                <input
                                    type="text"
                                    required
                                    className="input-premium"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Email</label>
                                <input
                                    type="email"
                                    required
                                    className="input-premium"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Message</label>
                                <textarea
                                    required
                                    className="input-premium"
                                    rows="5"
                                    value={formData.message}
                                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                                ></textarea>
                            </div>
                            <button type="submit" className="btn-premium" style={{ width: '100%' }}>Send Message</button>
                        </form>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Contact;
