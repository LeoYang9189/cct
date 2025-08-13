import React from 'react';
import { Card, Typography } from '@arco-design/web-react';

const { Title } = Typography;

const AnnouncementManagement: React.FC = () => {
  return (
    <div>
      <Title heading={3} className="!mb-6">公告板管理</Title>
      <Card>
        <p>公告板管理功能正在开发中...</p>
      </Card>
    </div>
  );
};

export default AnnouncementManagement; 