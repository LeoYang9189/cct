import React from 'react';
import { UserProvider } from './UserContext';
import StaffAuthPage from './StaffAuthPage';

const StaffAuthPageWrapper: React.FC = () => {
  return (
    <UserProvider>
      <StaffAuthPage />
    </UserProvider>
  );
};

export default StaffAuthPageWrapper; 