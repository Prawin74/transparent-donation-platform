import React from 'react';
import Donate from '../components/Donate';

const DonatePage = () => {
    return (
        <div className="page-container fade-in-up">
            <div className="section-header">
                <h1 style={{ color: 'var(--text-primary)' }}>Make a Donation</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Support a campaign directly via blockchain.</p>
            </div>

            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                <Donate />
            </div>
        </div>
    );
};

export default DonatePage;
