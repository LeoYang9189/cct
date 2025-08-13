import React from 'react';
import './ControlTowerClientStyles.css';
import ControlTowerClientLayout from './layout/layout';
import ControlTowerClientRoutes from './routes';

const ControlTowerClient: React.FC = () => {
  return (
    <ControlTowerClientLayout>
      <ControlTowerClientRoutes />
    </ControlTowerClientLayout>
  );
};

export default ControlTowerClient; 