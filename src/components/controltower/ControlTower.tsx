import React from 'react';
import './ControlTowerStyles.css';
import ControlTowerLayout from './layout/layout';
import ControlTowerRoutes from './routes';

const ControlTower: React.FC = () => {
  return (
    <ControlTowerLayout>
      <ControlTowerRoutes />
    </ControlTowerLayout>
  );
};

export default ControlTower; 