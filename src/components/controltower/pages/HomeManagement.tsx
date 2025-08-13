import React from 'react';
import { Card, Typography, Space } from '@arco-design/web-react';
import { IconHome } from '@arco-design/web-react/icon';

const { Title, Text } = Typography;

const HomeManagement: React.FC = () => {
  return (
    <div style={{ padding: 24 }}>
      <Card>
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <Space direction="vertical" size={20}>
            <IconHome style={{ fontSize: 64, color: '#165DFF' }} />
            <Title heading={3} style={{ margin: 0, color: '#1D2129' }}>
              首页管理
            </Title>
            <Text type="secondary" style={{ fontSize: 16 }}>
              功能开发中，敬请期待...
            </Text>
            <Text type="secondary" style={{ fontSize: 14 }}>
              此页面将用于管理网站首页的内容配置和布局设置
            </Text>
          </Space>
        </div>
      </Card>
    </div>
  );
};

export default HomeManagement; 