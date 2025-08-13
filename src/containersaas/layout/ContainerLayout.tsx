import React, { useState } from 'react';
import { Layout, Button, Avatar, Badge, Dropdown, Menu, Divider } from '@arco-design/web-react';
import {
  IconMenuFold,
  IconMenuUnfold,
  IconUser,
  IconSettings,
  IconNotification,
  IconMessage,
  IconQuestionCircle,
  IconPoweroff,
  IconDown
} from '@arco-design/web-react/icon';
import ContainerSidebar from './ContainerSidebar';
import ContainerHeader from './ContainerHeader';
import './layout.css';

const { Sider, Header, Content } = Layout;

interface ContainerLayoutProps {
  children: React.ReactNode;
  breadcrumb?: React.ReactNode;
}

const ContainerLayout: React.FC<ContainerLayoutProps> = ({ children, breadcrumb }) => {
  const [collapsed, setCollapsed] = useState(false);

  const handleCollapse = () => {
    setCollapsed(!collapsed);
  };

  // 主题切换 
  const [theme, setTheme] = useState('light');
  const onThemeChange = (currentTheme: string) => {
    setTheme(currentTheme);
    if (currentTheme === 'dark') {
      document.body.setAttribute('arco-theme', 'dark');
    } else {
      document.body.removeAttribute('arco-theme');
    }
  };

  const userDropList = (
    <Menu>
      <Menu.Item key="info"><IconUser className="mr-2" />个人信息</Menu.Item>
      <Menu.Item key="setting"><IconSettings className="mr-2" />账户设置</Menu.Item>
      <Menu.Item key="help"><IconQuestionCircle className="mr-2" />帮助中心</Menu.Item>
      <Divider style={{ margin: '4px 0' }} />
      <Menu.Item key="logout"><IconPoweroff className="mr-2" />退出登录</Menu.Item>
    </Menu>
  );

  return (
    <Layout className="h-screen">
      {/* 侧边栏 */}
      <Sider 
        theme="light"
        collapsed={collapsed}
        collapsible
        trigger={null}
        breakpoint="lg"
        onCollapse={handleCollapse}
        width={220}
        collapsedWidth={60}
        className="border-r border-gray-200"
      >
        <ContainerSidebar collapsed={collapsed} />
      </Sider>
      <Layout>
        {/* 顶部导航 */}
        <Header className="bg-white h-16 border-b border-gray-200 px-6 flex items-center justify-between">
          <div className="flex items-center">
            <Button
              type="text"
              icon={collapsed ? <IconMenuUnfold /> : <IconMenuFold />}
              onClick={handleCollapse}
              className="mr-4"
            />
            {breadcrumb ? (
              <div>{breadcrumb}</div>
            ) : (
              <ContainerHeader 
                collapsed={collapsed} 
                onToggleCollapse={handleCollapse} 
                onThemeChange={onThemeChange} 
                currentTheme={theme} 
              />
            )}
          </div>
          <div className="flex items-center">
            <Badge count={3} dot>
              <Button type="text" style={{ margin: '0 8px' }} icon={<IconNotification />} />
            </Badge>
            <Badge count={2}>
              <Button type="text" style={{ margin: '0 8px' }} icon={<IconMessage />} />
            </Badge>
            <Dropdown droplist={userDropList} position="br">
              <div className="flex items-center cursor-pointer ml-3">
                <Avatar className="bg-blue-500 mr-2"><IconUser /></Avatar>
                <span className="mr-1">管理员</span>
                <IconDown />
              </div>
            </Dropdown>
          </div>
        </Header>
        {/* 内容区域 */}
        <Content className="p-6 bg-gray-50 min-h-[calc(100vh-64px)] overflow-auto">
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default ContainerLayout; 