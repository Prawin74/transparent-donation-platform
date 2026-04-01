import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Web3Context } from '../App';
import { useModal } from '../contexts/ModalContext';
import '../styles/NavbarPremium.css';
import logo from '../assets/logo.png';
import {
    Menu,
    X,
    Sun,
    Moon,
    Heart,
    LogOut,
    User,
    LayoutDashboard,
    FileText
} from 'lucide-react';

const NavBar = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const { account } = useContext(Web3Context);
    const location = useLocation();

    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Scroll Effect
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location]);

    const isActive = (path) => location.pathname === path;

    // --- NAVIGATION CONFIGURATION ---

    // Authenticated Navigation (Dashboard, Audit, Actions)
    const AuthNav = () => (
        <>
            <div className="navbar-center">
                <Link
                    to={user.role === 'ngo' ? '/ngo' : '/donor'}
                    className={`nav-link-item ${isActive(user.role === 'ngo' ? '/ngo' : '/donor') ? 'active' : ''}`}
                >
                    Dashboard
                </Link>
                {user.role === 'donor' && (
                    <Link
                        to="/donate"
                        className={`nav-link-item ${isActive('/donate') ? 'active' : ''}`}
                    >
                        Donate
                    </Link>
                )}
                <Link
                    to="/audit"
                    className={`nav-link-item ${isActive('/audit') ? 'active' : ''}`}
                >
                    Audit Trail
                </Link>
            </div>

            <div className="navbar-right">
                <button onClick={toggleTheme} className="theme-toggle-circle" aria-label="Toggle Theme">
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>

                <div className="user-indicator" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-primary)', fontSize: '14px', fontWeight: '500' }}>
                    {/* User Role Badge */}
                    <span style={{
                        background: 'rgba(59, 130, 246, 0.2)',
                        color: '#60a5fa',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                    }}>
                        {user.role}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <User size={18} />
                        <span>{user.name.split(' ')[0]}</span>
                    </div>
                </div>

                <button
                    onClick={logout}
                    className="btn-login"
                    style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '6px' }}
                    title="Sign Out"
                >
                    <LogOut size={18} />
                    <span>Sign Out</span>
                </button>
            </div>
        </>
    );

    // Public Navigation (Home, About, Contact, Donate)
    const PublicNav = () => (
        <>
            <div className="navbar-center">
                <Link to="/" className={`nav-link-item ${isActive('/') ? 'active' : ''}`}>
                    Home
                </Link>
                <Link to="/about" className={`nav-link-item ${isActive('/about') ? 'active' : ''}`}>
                    About Us
                </Link>
                <Link to="/contact" className={`nav-link-item ${isActive('/contact') ? 'active' : ''}`}>
                    Contact Us
                </Link>
            </div>

            <div className="navbar-right">
                <button onClick={toggleTheme} className="theme-toggle-circle" aria-label="Toggle Theme">
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>

                <Link to="/login" className="btn-login">
                    Log In
                </Link>
                <Link to="/signup" className="btn-signup">
                    Sign Up
                </Link>

                <Link to="#featured" className="btn-donate-nav">
                    <Heart size={18} fill="currentColor" />
                    <span>Donate</span>
                </Link>
            </div>
        </>
    );

    return (
        <>
            <nav className={`navbar-premium ${scrolled ? 'navbar-scrolled' : ''}`}>
                {/* Brand */}
                <Link to={user ? (user.role === 'ngo' ? '/ngo' : '/donor') : "/"} className="navbar-brand">
                    <img src={logo} alt="GlobalGive" className="navbar-logo" />
                    <span className="navbar-title">GlobalGive</span>
                </Link>

                {/* Desktop Render Logic */}
                {user ? <AuthNav /> : <PublicNav />}

                {/* Mobile Toggle */}
                <button
                    className="mobile-menu-toggle"
                    onClick={() => setMobileMenuOpen(true)}
                >
                    <Menu size={24} />
                </button>
            </nav>

            {/* Mobile Menu Overlay */}
            <div className={`mobile-menu-overlay ${mobileMenuOpen ? 'open' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                <div className="mobile-menu-content" onClick={e => e.stopPropagation()}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <span className="navbar-title">Menu</span>
                        <button onClick={() => setMobileMenuOpen(false)} style={{ background: 'transparent', border: 'none', color: '#fff' }}>
                            <X size={24} />
                        </button>
                    </div>

                    {user ? (
                        /* Mobile Authenticated Menu */
                        <>
                            <Link to={user.role === 'ngo' ? '/ngo' : '/donor'} className={`mobile-nav-link ${isActive('/ngo') || isActive('/donor') ? 'active' : ''}`}>
                                <LayoutDashboard size={18} style={{ marginRight: '8px', verticalAlign: 'text-bottom' }} />
                                Dashboard
                            </Link>
                            <Link to="/audit" className={`mobile-nav-link ${isActive('/audit') ? 'active' : ''}`}>
                                <FileText size={18} style={{ marginRight: '8px', verticalAlign: 'text-bottom' }} />
                                Audit Trail
                            </Link>

                            <div style={{ padding: '20px 0', borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: 'auto' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', color: '#cbd5e1' }}>
                                    <User size={20} />
                                    <span>{user.name}</span>
                                    <span style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', padding: '2px 8px', borderRadius: '12px', fontSize: '10px' }}>
                                        {user.role}
                                    </span>
                                </div>
                                <button onClick={logout} className="btn-login" style={{ color: '#ef4444', width: '100%', justifyContent: 'center' }}>
                                    Sign Out
                                </button>
                            </div>
                        </>
                    ) : (
                        /* Mobile Public Menu */
                        <>
                            <Link to="/" className={`mobile-nav-link ${isActive('/') ? 'active' : ''}`}>Home</Link>
                            <Link to="/about" className={`mobile-nav-link ${isActive('/about') ? 'active' : ''}`}>About Us</Link>
                            <Link to="/contact" className={`mobile-nav-link ${isActive('/contact') ? 'active' : ''}`}>Contact Us</Link>

                            <div style={{ padding: '20px 0', borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '20px' }}>
                                <Link to="/login" className="mobile-nav-link">Log In</Link>
                                <Link to="/signup" className="btn-signup" style={{ textAlign: 'center', marginTop: '16px', display: 'block', width: '100%' }}>
                                    Sign Up
                                </Link>
                                <Link to="#featured" className="btn-donate-nav" style={{ justifyContent: 'center', marginTop: '16px', width: '100%' }}>
                                    Donate Now
                                </Link>
                            </div>
                        </>
                    )}

                    <div style={{ marginTop: user ? '0' : 'auto', display: 'flex', justifyContent: 'center', paddingTop: '20px' }}>
                        <button onClick={toggleTheme} className="theme-toggle-circle">
                            {theme === 'light' ? <Moon size={24} /> : <Sun size={24} />}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default NavBar;
