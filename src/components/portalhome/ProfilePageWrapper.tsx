import React from 'react';
import { UserProvider } from './UserContext';
import ProfilePage from './ProfilePage';

const ProfilePageWrapper: React.FC = () => {
  return (
    <UserProvider>
      <ProfilePage />
    </UserProvider>
  );
};

export default ProfilePageWrapper; 