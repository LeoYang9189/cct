import React from 'react';
import PortalHeader from './PortalHeader';
import PortalFooter from './PortalFooter';
import PortalHero from './PortalHero';
import PortalFeatures from './PortalFeatures';
import PortalSolutions from './PortalSolutions';
import NewsCenter from './NewsCenter';
import PortalCTA from './PortalCTA';
import { UserProvider } from './UserContext';
import './PortalStyles.css';

const Portal: React.FC = () => {
  return (
    <UserProvider>
    <div className="min-h-screen bg-white">
      <PortalHeader />
      <main>
        <PortalHero />
        <PortalFeatures />
        <PortalSolutions />
        <NewsCenter />
        <PortalCTA />
      </main>
        <PortalFooter />
    </div>
    </UserProvider>
  );
};

export default Portal; 