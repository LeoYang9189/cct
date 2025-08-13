import React from 'react';
import { UserProvider } from './UserContext';
import CompanyPage from './CompanyPage';

const CompanyPageWrapper: React.FC = () => {
  return (
    <UserProvider>
      <CompanyPage />
    </UserProvider>
  );
};

export default CompanyPageWrapper; 