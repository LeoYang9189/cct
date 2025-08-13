import React, { useState, ReactNode } from 'react';
import { Layout, Menu, Button, Avatar, Badge, Breadcrumb, Dropdown, Divider } from '@arco-design/web-react';
import { 
  IconDashboard, 
  IconUser, 
  IconNotification, 
  IconMenuFold, 
  IconMenuUnfold, 
  IconMessage, 
  IconDown, 
  IconPoweroff, 
  IconSettings, 
  IconLanguage, 
  IconQuestionCircle,
  IconFile,
  IconStorage
} from '@arco-design/web-react/icon';
import { useNavigate } from 'react-router-dom';

const { Header, Sider, Content } = Layout;
const MenuItem = Menu.Item;
const SubMenu = Menu.SubMenu;

interface SaasLayoutProps {
  children: ReactNode;
  breadcrumb?: ReactNode;
  menuSelectedKey?: string;
}

const SaasLayout: React.FC<SaasLayoutProps> = ({ children, breadcrumb, menuSelectedKey }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  

  const toggleCollapse = () => setCollapsed(!collapsed);

  // 侧边栏菜单点击
  const handleMenuItemClick = (key: string) => {
    if (key === '1') navigate('/saas-system');
    else if (key === '3') navigate('/fcl-rates');
    // 其他菜单可按需扩展
  };

  return (
    <Layout className="h-screen">
      {/* 侧边栏 */}
      <Sider
        theme="light"
        collapsed={collapsed}
        collapsible
        trigger={null}
        breakpoint="md"
        width={220}
        className="border-r border-gray-200"
      >
        <div className="p-4 flex items-center justify-center">
          {!collapsed ? (
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white w-10 h-10 rounded-lg flex items-center justify-center mr-4 relative overflow-hidden shadow-lg">
                <span className="text-xl font-bold">S</span>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-white rounded-tl-lg flex items-center justify-center">
                  <span className="text-xs text-blue-600 font-bold">¥</span>
                </div>
              </div>
              <div>
                <div className="text-lg font-bold text-blue-600 leading-relaxed tracking-wide">超级运价</div>
                <div className="text-xs text-gray-500 mt-0.5 tracking-wider">SUPER FREIGHT</div>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white w-10 h-10 rounded-lg flex items-center justify-center relative overflow-hidden shadow-lg">
              <span className="text-xl font-bold">S</span>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-white rounded-tl-lg flex items-center justify-center">
                <span className="text-xs text-blue-600 font-bold">¥</span>
              </div>
            </div>
          )}
        </div>
        <Menu
          selectedKeys={[menuSelectedKey || '1']}
          defaultOpenKeys={['sub1']}
          style={{ width: '100%' }}
        >
          <MenuItem key="1" onClick={() => handleMenuItemClick('1')}>
            <IconDashboard />
            <span>控制台</span>
          </MenuItem>
          <MenuItem key="2">
            <IconFile />
            <span>数据分析</span>
          </MenuItem>
          <SubMenu
            key="sub1"
            title={
              <span>
                <IconFile />
                <span>运价管理</span>
              </span>
            }
          >
            <MenuItem key="3" onClick={() => handleMenuItemClick('3')}>海运整箱</MenuItem>
            <MenuItem key="4">海运拼箱</MenuItem>
            <MenuItem key="5">空运运价</MenuItem>
            <MenuItem key="6">整箱附加费</MenuItem>
            <MenuItem key="7">拼箱附加费</MenuItem>
            <MenuItem key="8">空运附加费</MenuItem>
            <MenuItem 
              key="3" 
              onClick={() => navigate('/rate-query')}
            >
              运价查询
            </MenuItem>
          </SubMenu>
          <SubMenu
            key="sub5"
            title={
              <span>
                <IconFile />
                <span>门点服务管理</span>
              </span>
            }
          >
            <MenuItem key="22" onClick={() => navigate('/precarriage-rates')}>港前运价</MenuItem>
            <MenuItem key="23" onClick={() => navigate('/lastmile-rates')}>尾程运价</MenuItem>
          </SubMenu>
          <SubMenu
            key="sub2"
            title={
              <span>
                <IconStorage />
                <span>询价报价</span>
              </span>
            }
          >
            <MenuItem key="9" onClick={() => navigate('/inquiry-management')}>询价管理</MenuItem>
            <MenuItem key="10">报价管理</MenuItem>
            <MenuItem key="11">报价审核</MenuItem>
          </SubMenu>
          <SubMenu
            key="sub3"
            title={
              <span>
                <IconFile />
                <span>舱位管理</span>
              </span>
            }
          >
            <MenuItem key="13">舱位查询</MenuItem>
            <MenuItem key="14">舱位预订</MenuItem>
            <MenuItem key="15">舱位统计</MenuItem>
          </SubMenu>
          <SubMenu
            key="sub4"
            title={
              <span>
                <IconStorage />
                <span>基础数据</span>
              </span>
            }
          >
            <MenuItem key="16">船公司管理</MenuItem>
            <MenuItem key="17">港口管理</MenuItem>
            <MenuItem key="18" onClick={() => navigate('/route-management')}>航线管理</MenuItem>
            <MenuItem key="19">货币管理</MenuItem>
            <MenuItem key="region" onClick={() => navigate('/saas/region-management')}>行政区划</MenuItem>
            <MenuItem key="zipcode" onClick={() => navigate('/saas/zipcode-management')}>邮编管理</MenuItem>
            <MenuItem key="fba-warehouse" onClick={() => navigate('/saas/fba-warehouse')}>FBA仓库</MenuItem>
          </SubMenu>
          <MenuItem key="12">
            <IconFile />
            <span>合约管理</span>
          </MenuItem>
          <MenuItem key="20">
            <IconFile />
            <span>客户管理</span>
          </MenuItem>
          <MenuItem key="21">
            <IconSettings />
            <span>系统设置</span>
          </MenuItem>
        </Menu>

      </Sider>
      <Layout>
        {/* 顶部导航 */}
        <Header className="bg-white h-16 border-b border-gray-200 px-6 flex items-center justify-between">
          <div className="flex items-center">
            <Button
              type="text"
              icon={collapsed ? <IconMenuUnfold /> : <IconMenuFold />}
              onClick={toggleCollapse}
              className="mr-4"
            />
            {breadcrumb || <Breadcrumb><Breadcrumb.Item>首页</Breadcrumb.Item></Breadcrumb>}
          </div>
          <div className="flex items-center">
            <Badge count={5} dot>
              <Button type="text" style={{ margin: '0 8px' }} icon={<IconNotification />} />
            </Badge>
            <Badge count={3}>
              <Button type="text" style={{ margin: '0 8px' }} icon={<IconMessage />} />
            </Badge>
            <Dropdown
              droplist={
                <Menu>
                  <Menu.Item key="zh-CN">简体中文</Menu.Item>
                  <Menu.Item key="en-US">English</Menu.Item>
                </Menu>
              }
              position="br"
            >
              <Button type="text" icon={<IconLanguage />} style={{ margin: '0 8px' }} />
            </Dropdown>
            <Dropdown
              droplist={
                <Menu>
                  <Menu.Item key="info"><IconUser className="mr-2" />个人信息</Menu.Item>
                  <Menu.Item key="setting"><IconSettings />账户设置</Menu.Item>
                  <Menu.Item key="help"><IconQuestionCircle className="mr-2" />帮助中心</Menu.Item>
                  <Divider style={{ margin: '4px 0' }} />
                  <Menu.Item key="logout"><IconPoweroff className="mr-2" />退出登录</Menu.Item>
                </Menu>
              }
              position="br"
            >
              <div className="flex items-center cursor-pointer ml-3">
                <Avatar className="bg-blue-500 mr-2"><IconUser /></Avatar>
                <span className="mr-1">管理员</span>
                <IconDown />
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content className="p-6 bg-gray-50 min-h-[calc(100vh-64px)] overflow-auto">
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default SaasLayout; 