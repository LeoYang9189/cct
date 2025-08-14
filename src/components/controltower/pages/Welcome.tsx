import React, { useState, useEffect } from 'react';
import { Card, Button, Grid, Typography } from '@arco-design/web-react';
import { IconSettings } from '@arco-design/web-react/icon';
import { useNavigate } from 'react-router-dom';
import ShortcutSettings, { ALL_SHORTCUTS } from './ShortcutSettings';
import bannerImage from '../../../../public/assets/bannerrukou.png';

const { Row, Col } = Grid;
const { Text } = Typography;



// 默认快捷入口
const DEFAULT_SHORTCUTS = [
  'rate-query',
  'inquiry-management', 
  'quote-management',
  'rate-maintenance',
  'order-management',
  'schedule-query'
];

/**
 * 欢迎界面组件
 * 显示配图和快捷入口，支持自定义快捷入口设置
 */
const Welcome: React.FC = () => {
  const navigate = useNavigate();
  const [selectedShortcuts, setSelectedShortcuts] = useState<string[]>(DEFAULT_SHORTCUTS);
  const [settingsVisible, setSettingsVisible] = useState(false);

  // 从localStorage加载用户设置的快捷入口
  useEffect(() => {
    const savedShortcuts = localStorage.getItem('userShortcuts');
    if (savedShortcuts) {
      try {
        const shortcuts = JSON.parse(savedShortcuts);
        setSelectedShortcuts(shortcuts);
      } catch (error) {
        console.error('Failed to parse saved shortcuts:', error);
      }
    }
  }, []);

  /**
   * 处理快捷入口点击
   */
  const handleShortcutClick = (path: string) => {
    navigate(path);
  };

  /**
   * 保存快捷入口设置
   */
  const handleSaveShortcuts = (shortcuts: string[]) => {
    setSelectedShortcuts(shortcuts);
    localStorage.setItem('userShortcuts', JSON.stringify(shortcuts));
  };

  /**
   * 进入仪表盘
   */
  const handleEnterDashboard = () => {
    localStorage.setItem('hasSeenWelcome', 'true');
    navigate('/controltower/dashboard');
  };

  // 获取当前选中的快捷入口
  const displayShortcuts = ALL_SHORTCUTS.filter(item => selectedShortcuts.includes(item.key));

  return (
    <div className="welcome-container p-6">
      {/* 欢迎横幅 - 全屏背景 */}
      <div 
        className="welcome-banner mb-6 relative overflow-hidden rounded-lg"
        style={{
          height: '400px',
          backgroundImage: `url(${bannerImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* 遮罩层 - 使用深蓝色渐变替代纯黑色 */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.4) 0%, rgba(147, 51, 234, 0.3) 100%)'
        }}></div>
        
        {/* 内容层 */}
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">
              欢迎使用控制塔系统
            </h1>
            <p className="text-xl drop-shadow-md">
              您的智能物流管理平台，让货运更简单高效
            </p>
          </div>
        </div>
      </div>

      {/* 快捷入口 */}
      <Card 
        title={
          <div className="flex items-center justify-between">
            <span className="text-xl font-semibold">快捷入口</span>
            <div className="flex justify-between items-center">
              <Button 
                type="primary"
                size="large"
                onClick={handleEnterDashboard}
                className="px-8 mr-4"
              >
                进入系统
              </Button>
              <Button 
                type="text" 
                icon={<IconSettings />} 
                onClick={() => setSettingsVisible(true)}
                className="text-gray-500 hover:text-blue-500"
              >
                设置
              </Button>
            </div>
          </div>
        }
        bordered={false}
        className="shortcuts-card"
      >
        <Row gutter={[16, 16]}>
          {displayShortcuts.map((shortcut) => (
            <Col key={shortcut.key} xs={12} sm={8} md={6} lg={4} xl={3}>
              <Card
                hoverable
                style={{ 
                  textAlign: 'center',
                  height: '120px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}
                onClick={() => handleShortcutClick(shortcut.path)}
              >
                <div style={{ fontSize: '32px', marginBottom: '8px', color: '#1890ff' }}>
                  {shortcut.icon}
                </div>
                <Text style={{ fontSize: '14px', fontWeight: 500 }}>
                  {shortcut.title}
                </Text>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      {/* 快捷入口设置弹窗 */}
      <ShortcutSettings
        visible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
        selectedShortcuts={selectedShortcuts}
        onSave={handleSaveShortcuts}
      />
    </div>
  );
};

export default Welcome;