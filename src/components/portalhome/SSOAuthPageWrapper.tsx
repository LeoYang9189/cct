import React from 'react';
import { UserProvider } from './UserContext';
import SSOAuthPage from './SSOAuthPage';

const SSOAuthPageWrapper: React.FC = () => {
  return (
    <UserProvider>
      <SSOAuthPage />
    </UserProvider>
  );
};

export default SSOAuthPageWrapper; 