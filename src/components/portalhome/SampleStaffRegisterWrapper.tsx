import React from 'react';
import { UserProvider } from './UserContext';
import SampleStaffRegister from './SampleStaffRegister';

const SampleStaffRegisterWrapper: React.FC = () => {
  return (
    <UserProvider>
      <SampleStaffRegister />
    </UserProvider>
  );
};

export default SampleStaffRegisterWrapper;
