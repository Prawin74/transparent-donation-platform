import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/NGODashboard.css';
import {
    LayoutDashboard,
    PlusCircle,
    Wallet,
    List,
    FileText,
    Settings
} from 'lucide-react';

const NGOLayout = () => {
    const { user } = useAuth();

    return (
        <div className="ngo-layout animate-fade-in">
            {/* Sidebar Navigation */}
            <aside className="ngo-sidebar">
                <div className="sidebar-header">
                    <h2 className="sidebar-title">NGO Portal</h2>
                    <p className="sidebar-subtitle">{user?.name || 'Organization'}</p>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <NavLink
                        to="/ngo"
                        end
                        className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                    >
                        <LayoutDashboard size={20} />
                        <span>Overview</span>
                    </NavLink>

                    <NavLink
                        to="/ngo/create"
                        className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                    >
                        <PlusCircle size={20} />
                        <span>Create Campaign</span>
                    </NavLink>

                    <NavLink
                        to="/ngo/withdraw"
                        className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                    >
                        <Wallet size={20} />
                        <span>Withdraw Funds</span>
                    </NavLink>

                    <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', margin: '8px 0' }}></div>

                    <NavLink
                        to="/ngo/campaigns"
                        className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                    >
                        <List size={20} />
                        <span>My Campaigns</span>
                    </NavLink>

                    <NavLink
                        to="/ngo/reports"
                        className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                    >
                        <FileText size={20} />
                        <span>Reports</span>
                    </NavLink>

                    <NavLink
                        to="/ngo/settings"
                        className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                    >
                        <Settings size={20} />
                        <span>Settings</span>
                    </NavLink>
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="ngo-content">
                <Outlet />
            </main>
        </div>
    );
};

export default NGOLayout;
