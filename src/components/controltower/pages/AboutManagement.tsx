import React from 'react';
import { 
  Card, 
  Typography 
} from '@arco-design/web-react';

const { Title, Text } = Typography;

const AboutManagement: React.FC = () => {
  return (
    <div style={{ padding: '0' }}>
      {/* 页面标题 */}
      <div style={{ marginBottom: '24px' }}>
        <Title heading={3} style={{ margin: 0, marginBottom: '8px' }}>
          关于我们管理
        </Title>
        <Text type="secondary">
          管理网站的公司介绍和企业信息
        </Text>
      </div>

      {/* 页面内容 */}
      <Card>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          minHeight: '400px',
          color: '#86909c'
        }}>
          <Text style={{ fontSize: '16px', marginBottom: '8px' }}>
            🚧 页面开发中
          </Text>
          <Text type="secondary">
            关于我们管理功能正在开发，敬请期待...
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default AboutManagement; 