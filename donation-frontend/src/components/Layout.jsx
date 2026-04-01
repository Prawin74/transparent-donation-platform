import React from 'react';
import '../styles/GlobalTheme.css';

const Layout = ({ children }) => {
  return (
    <div className="layout-wrapper">
      {/* Persistent Animated Background */}
      <div className="bg-orb orb-1"></div>
      <div className="bg-orb orb-2"></div>
      <div className="bg-orb orb-3"></div>

      {/* Navbar Placeholder for Anti-Gravity Float effect */}
      {/* Height = Navbar Height (72px) + Top Margin (20px) + Extra Spacing (20px) */}
      <div style={{ height: '112px', width: '100%', pointerEvents: 'none' }}></div>

      <div className="layout-content">
        {children}
      </div>

      <style jsx>{`
        .layout-wrapper {
          position: relative;
          min-height: 100vh;
          background-color: var(--bg-main);
          overflow-x: hidden;
        }

        .bg-orb {
          position: fixed;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.4;
          z-index: 0;
          pointer-events: none;
          animation: floatOrb 15s infinite alternate ease-in-out;
        }

        .orb-1 {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, #4f46e5, #9333ea);
          top: -150px;
          left: -100px;
        }

        .orb-2 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, #06b6d4, #3b82f6);
          bottom: -100px;
          right: -100px;
          animation-delay: -5s;
        }

        .orb-3 {
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, #ec4899, #f43f5e);
          top: 40%;
          left: 30%;
          opacity: 0.2;
          animation-delay: -8s;
        }

        @keyframes floatOrb {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(40px, 60px) scale(1.1); }
        }

        .layout-content {
          position: relative;
          z-index: 1;
        }
      `}</style>
    </div>
  );
};

export default Layout;
