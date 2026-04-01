import React, { useState, useEffect, useContext, useMemo, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { ethers } from 'ethers';
import './App.css';
import './styles/GlobalTheme.css'; // Global Design System
import './styles/LogoFont.css'; // Advanced Font Init
import Layout from './components/Layout';
import logo from './assets/logo.png'; // Logo Import

// Pages
import Login from './components/Login';
import Signup from './components/Register'; // Using new Register component
import DonorDashboard from './pages/DonorDashboard';
import DonatePage from './pages/DonatePage';
import NGODashboard from './components/NGODashboard';
import NGOPending from './components/NGOPending';
import AdminDashboard from './components/AdminDashboard';
import CampaignDetails from './components/CampaignDetails';
import AuditTrail from './components/AuditTrail';
import CreditDeposit from './components/CreditDeposit';
import Home from './components/Home';
import AboutUs from './components/AboutUs';
import Contact from './components/Contact';
import NGOLayout from './components/NGOLayout';
import CreateCampaign from './components/CreateCampaign';
import NGOCampaigns from './components/NGOCampaigns';
import Withdraw from './components/Withdraw';

// Context
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ModalProvider } from './contexts/ModalContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { SocketProvider } from './contexts/SocketContext';

// Components
import NavBar from './components/NavBar';
import DepositModal from './components/modals/DepositModal';
import WithdrawModal from './components/modals/WithdrawModal';

export const Web3Context = createContext(null);

// --- Route Guards ---

// 1. Require Authentication
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div className="loading-screen">Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

// 2. Require Specific Role
const RoleRoute = ({ children, allowedRole }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div className="loading-screen">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  if (user.role !== allowedRole) {
    // Redirect to correct dashboard if wrong role
    return <Navigate to={user.role === 'donor' ? '/donor' : '/ngo'} replace />;
  }

  /* NGO verification temporarily disabled
  // For NGO, check verification
  if (allowedRole === 'ngo' && !user.isVerified) {
    return <Navigate to="/ngo-pending" replace />;
  }
  */

  return children;
};

// 3. Public Route (Redirects authenticated users to dashboard)
const PublicRoute = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div className="loading-screen">Loading...</div>;

  if (isAuthenticated && user) {
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    if (user.role === 'ngo') return <Navigate to="/ngo" replace />;
    return <Navigate to="/donor" replace />;
  }
  return children;
};


// --- Main App Component ---

const MainApp = () => {
  const { user, logout } = useAuth();
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState('');
  const [network, setNetwork] = useState(null);
  const [status, setStatus] = useState('Connect wallet');

  useEffect(() => {
    if (window.ethereum) {
      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(browserProvider);

      window.ethereum.on('accountsChanged', (accounts) => {
        setAccount(accounts.length > 0 ? accounts[0] : '');
      });
      window.ethereum.on('chainChanged', () => window.location.reload());
    }
  }, []);

  const connectWallet = async () => {
    if (!provider) return;
    try {
      await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const net = await provider.getNetwork();

      // Fix: Disable ENS on Amoy Testnet (Chain ID 80002) to prevent "UNSUPPORTED_OPERATION"
      if (net.chainId === 80002n) {
        net.ensAddress = null;
      }

      setSigner(signer);
      setAccount(address);
      setNetwork(net);
      setStatus(`Connected: ${net.name}`);
    } catch (err) {
      console.error(err);
      setStatus("Connection failed");
    }
  };

  const web3Value = useMemo(() => ({ provider, signer, account, network, connectWallet, status }), [provider, signer, account, network, status]);

  return (
    <Web3Context.Provider value={web3Value}>
      <ModalProvider>
        <Layout>
          {/* New Premium Navigation Bar */}
          <NavBar />

          {/* Routes */}
          <div className="main-content">
            <Routes>
              <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
              <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />

              {/* Root Redirect - Now Home Page */}
              <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />
              <Route path="/about" element={<PublicRoute><AboutUs /></PublicRoute>} />
              <Route path="/contact" element={<PublicRoute><Contact /></PublicRoute>} />

              {/* Donor Routes */}
              <Route path="/donor" element={
                <RoleRoute allowedRole="donor">
                  <DonorDashboard />
                </RoleRoute>
              } />
              <Route path="/deposit-credit" element={
                <RoleRoute allowedRole="donor">
                  <CreditDeposit />
                </RoleRoute>
              } />
              <Route path="/donate" element={
                <RoleRoute allowedRole="donor">
                  <DonatePage />
                </RoleRoute>
              } />

              {/* NGO Routes */}
              <Route path="/ngo" element={
                <RoleRoute allowedRole="ngo">
                  <NGOLayout />
                </RoleRoute>
              }>
                <Route index element={<NGODashboard />} />
                <Route path="create" element={<CreateCampaign />} />
                <Route path="campaigns" element={<NGOCampaigns />} />
                <Route path="withdraw" element={<Withdraw />} />
              </Route>
              <Route path="/ngo-pending" element={<NGOPending />} />

              {/* Admin Routes */}
              <Route path="/admin" element={
                <RoleRoute allowedRole="admin">
                  <AdminDashboard />
                </RoleRoute>
              } />

              {/* Shared Protected Routes */}
              <Route path="/campaign/:id" element={<ProtectedRoute><CampaignDetails /></ProtectedRoute>} />
              <Route path="/audit" element={<ProtectedRoute><AuditTrail /></ProtectedRoute>} />

            </Routes>
          </div>

          {/* Global Modals */}
          <DepositModal />
          <WithdrawModal />

        </Layout>
      </ModalProvider>
    </Web3Context.Provider>
  );
};

const App = () => (
  <Router>
    <AuthProvider>
      <SocketProvider>
        <ThemeProvider>
          <MainApp />
        </ThemeProvider>
      </SocketProvider>
    </AuthProvider>
  </Router>
);

export default App;
