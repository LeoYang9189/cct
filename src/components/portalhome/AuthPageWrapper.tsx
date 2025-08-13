import React from 'react';
import { UserProvider } from './UserContext';
import AuthPage from './AuthPage';

const AuthPageWrapper: React.FC = () => {
  return (
    <UserProvider>
      <AuthPage />
    </UserProvider>
  );
};

export default AuthPageWrapper; 