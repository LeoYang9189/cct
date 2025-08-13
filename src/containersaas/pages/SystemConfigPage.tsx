import React from 'react';
import { Card, Typography } from '@arco-design/web-react';

const { Title } = Typography;

const SystemConfigPage: React.FC = () => {
  return (
    <div className="p-6">
      <Card>
        <Title heading={5} className="mb-4">
          系统配置
        </Title>
        <div className="text-center text-gray-500 py-20">
          系统配置功能开发中...
        </div>
      </Card>
    </div>
  );
};

export default SystemConfigPage; 