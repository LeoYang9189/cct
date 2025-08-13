import React, { useState } from 'react';
import { Layout, Menu, Button, Avatar, Breadcrumb, Dropdown, Divider, AutoComplete } from '@arco-design/web-react';
import { 
  IconDashboard, 
  IconApps, 
  IconUser, 
  IconMenuFold, 
  IconMenuUnfold, 
  IconDown, 
  IconPoweroff, 
  IconSettings as IconSettingsOutline, 
  IconLanguage, 
  IconQuestionCircle,
  IconSettings,
  IconStorage,
  IconTool
} from '@arco-design/web-react/icon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { Message } from '@arco-design/web-react';
import '../PlatformAdminStyles.css';
import AIPlatformAssistant from './ai-platform';
import AIFullscreen from './AIFullscreen';

const { Header, Sider, Content } = Layout;
const MenuItem = Menu.Item;
const SubMenu = Menu.SubMenu;

interface BreadcrumbItem {
  title: string;
  path?: string;
}

interface LayoutProps {
  children: React.ReactNode;
}

const PlatformAdminLayout: React.FC<LayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [aiChatVisible, setAiChatVisible] = useState(false);
  const [aiFullscreenVisible, setAiFullscreenVisible] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const toggleCollapse = () => setCollapsed(!collapsed);

  // 平台管理端功能菜单数据
  const menuItems = [
    // 控制台
    { 
      title: '控制台', 
      key: 'dashboard', 
      path: '/platformadmin',
      category: '工作台',
      icon: <IconDashboard />
    },
    
    // 客商中心
    { 
      title: '用户管理', 
      key: 'user-management', 
      path: '/platformadmin/user-management',
      category: '客商中心',
      icon: <FontAwesomeIcon icon={faUsers} />
    },
    { 
      title: '租户管理', 
      key: 'company-management', 
      path: '/platformadmin/company-management',
      category: '客商中心',
      icon: <FontAwesomeIcon icon={faUsers} />
    },
    
    // 运营管理
    { 
      title: '船东维护', 
      key: 'carrier-management', 
      path: '/platformadmin/carrier-management',
      category: '运营管理',
      icon: <IconSettings />
    },
    { 
      title: '公告板管理', 
      key: 'announcement-management', 
      path: '/platformadmin/announcement-management',
      category: '运营管理',
      icon: <IconSettings />
    },
    
    // 产品中心
    { 
      title: '产品中心', 
      key: 'product-center', 
      path: '/platformadmin/product-center',
      category: '产品中心',
      icon: <IconApps />
    },
    
    // 基础资料维护
    { 
      title: '港口管理', 
      key: 'port-management', 
      path: '/platformadmin/port-management',
      category: '基础资料维护',
      icon: <IconStorage />
    },
    { 
      title: '承运人管理', 
      key: 'carrier-management-basic', 
      path: '/platformadmin/carrier-management-basic',
      category: '基础资料维护',
      icon: <IconStorage />
    },
    { 
      title: '国家（地区）', 
      key: 'country-region-management', 
      path: '/platformadmin/country-region-management',
      category: '基础资料维护',
      icon: <IconStorage />
    },
    { 
      title: '行政区划', 
      key: 'china-administrative', 
      path: '/platformadmin/china-administrative',
      category: '基础资料维护',
      icon: <IconStorage />
    },
    { 
      title: '海外仓库', 
      key: 'overseas-warehouse', 
      path: '/platformadmin/overseas-warehouse',
      category: '基础资料维护',
      icon: <IconStorage />
    },
    { 
      title: '邮编管理', 
      key: 'zipcode-management', 
      path: '/platformadmin/zipcode-management',
      category: '基础资料维护',
      icon: <IconStorage />
    },
    { 
      title: '航线管理', 
      key: 'route-management', 
      path: '/platformadmin/route-management',
      category: '基础资料维护',
      icon: <IconStorage />
    },
    { 
      title: '集装箱管理', 
      key: 'container-management', 
      path: '/platformadmin/container-management',
      category: '基础资料维护',
      icon: <IconStorage />
    },
    { 
      title: '包装单位', 
      key: 'package-unit', 
      path: '/platformadmin/package-unit',
      category: '基础资料维护',
      icon: <IconStorage />
    },
    { 
      title: '运输条款', 
      key: 'transport-terms', 
      path: '/platformadmin/transport-terms',
      category: '基础资料维护',
      icon: <IconStorage />
    },
    { 
      title: '贸易条款', 
      key: 'trade-terms', 
      path: '/platformadmin/trade-terms',
      category: '基础资料维护',
      icon: <IconStorage />
    },
    { 
      title: '计费单位', 
      key: 'calculation-unit', 
      path: '/platformadmin/calculation-unit',
      category: '基础资料维护',
      icon: <IconStorage />
    },
    { 
      title: '费用管理', 
      key: 'charge-management', 
      path: '/platformadmin/charge-management',
      category: '基础资料维护',
      icon: <IconStorage />
    },
    { 
      title: '船舶代理', 
      key: 'ship-agent', 
      path: '/platformadmin/ship-agent',
      category: '基础资料维护',
      icon: <IconStorage />
    },
    { 
      title: '船舶资料', 
      key: 'ship-data', 
      path: '/platformadmin/ship-data',
      category: '基础资料维护',
      icon: <IconStorage />
    },
    { 
      title: '码头管理', 
      key: 'terminal-management', 
      path: '/platformadmin/terminal-management',
      category: '基础资料维护',
      icon: <IconStorage />
    },
    { 
      title: '币种管理', 
      key: 'currency-management', 
      path: '/platformadmin/currency-management',
      category: '基础资料维护',
      icon: <IconStorage />
    },
    { 
      title: '汇率设置', 
      key: 'exchange-rate-management', 
      path: '/platformadmin/exchange-rate-management',
      category: '基础资料维护',
      icon: <IconStorage />
    },
    
    // 系统设置
    { 
      title: '员工管理', 
      key: 'staff-management', 
      path: '/platformadmin/staff-management',
      category: '系统设置',
      icon: <IconTool />
    },
    { 
      title: '权限管理', 
      key: 'permission-management', 
      path: '/platformadmin/permission-management',
      category: '系统设置',
      icon: <IconTool />
    },
    { 
      title: '菜单管理', 
      key: 'menu-management', 
      path: '/platformadmin/menu-management',
      category: '系统设置',
      icon: <IconTool />
    }
  ];

  // 搜索过滤逻辑
  const filterMenuItems = (inputValue: string) => {
    if (!inputValue) return [];
    
    const filtered = menuItems.filter(item => 
      item.title.toLowerCase().includes(inputValue.toLowerCase()) ||
      item.category.toLowerCase().includes(inputValue.toLowerCase())
    );
    
    // 返回带父子关系的选项列表
    return filtered.map(item => {
      const breadcrumbPath = `${item.category} > ${item.title}`;
      
      return {
        value: item.path,
        name: breadcrumbPath,
        label: (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '8px', color: '#1890ff' }}>{item.icon}</span>
            <span>{breadcrumbPath}</span>
          </div>
        )
      };
    });
  };

  // 处理搜索选择
  const handleSearchSelect = (value: string) => {
    navigate(value);
    setSearchValue('');
  };

  // 菜单点击
  const handleMenuItemClick = (key: string) => {
    if (key === 'dashboard') {
      navigate('/platformadmin');
    } else {
      navigate(key === 'dashboard' ? '/platformadmin' : `/platformadmin/${key}`);
    }
  };

  // 处理用户菜单点击
  const handleUserMenuClick = (key: string) => {
    switch (key) {
      case 'logout':
        // 清除登录状态
        localStorage.removeItem('platformAdminAuth');
        Message.success('已安全退出登录');
        // 跳转到登录页
        navigate('/platformadmin/login');
        break;
      case 'info':
        // 个人信息页面
        break;
      case 'setting':
        // 账户设置页面
        break;
      case 'help':
        // 帮助中心页面
        break;
      default:
        break;
    }
  };

  // 产品名称映射
  const productNames: { [key: string]: string } = {
    'super-freight': '超级运价',
    'control-tower': '控制塔',
    'smart-container': '智慧箱管',
    'ai-assistant': 'AI助手'
  };

  // 根据当前路由生成面包屑
  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const path = location.pathname.replace('/platformadmin/', '');
    const breadcrumbs: BreadcrumbItem[] = [
      { title: '首页', path: '/platformadmin' },
      { title: '平台运营后台', path: '/platformadmin' }
    ];

    // 处理产品授权页面的特殊情况
    if (path.startsWith('product-authorization/')) {
      const productId = path.split('/')[1];
      const productName = productNames[productId] || '未知产品';
      breadcrumbs.push(
        { title: '产品中心', path: '/platformadmin/product-center' },
        { title: `${productName} - 授权企业`, path: undefined }
      );
      return breadcrumbs;
    }

    // 处理产品配置页面的特殊情况
    if (path.startsWith('product-config/')) {
      const productId = path.split('/')[1];
      const productName = productNames[productId] || '未知产品';
      breadcrumbs.push(
        { title: '产品中心', path: '/platformadmin/product-center' },
        { title: `${productName} - 产品配置`, path: undefined }
      );
      return breadcrumbs;
    }

    // 处理权限管理编辑页面的特殊情况
    if (path.startsWith('permission-management/edit/')) {
      breadcrumbs.push(
        { title: '系统设置', path: undefined },
        { title: '权限管理', path: '/platformadmin/permission-management' },
        { title: '编辑权限', path: undefined }
      );
      return breadcrumbs;
    }

    const simplePath = path.replace('/', '');
    switch (simplePath) {
      case '':
      case 'dashboard':
        breadcrumbs.push({ title: '控制台', path: '/platformadmin/dashboard' });
        break;
      case 'user-management':
        breadcrumbs.push(
          { title: '客商中心', path: undefined },
          { title: '用户管理', path: '/platformadmin/user-management' }
        );
        break;
      case 'company-management':
        breadcrumbs.push(
          { title: '客商中心', path: undefined },
          { title: '租户管理', path: '/platformadmin/company-management' }
        );
        break;
      case 'carrier-management':
        breadcrumbs.push(
          { title: '运营管理', path: undefined },
          { title: '船东维护', path: '/platformadmin/carrier-management' }
        );
        break;
      case 'announcement-management':
        breadcrumbs.push(
          { title: '运营管理', path: undefined },
          { title: '公告板管理', path: '/platformadmin/announcement-management' }
        );
        break;
      case 'product-center':
        breadcrumbs.push({ title: '产品中心', path: '/platformadmin/product-center' });
        break;
      // 基础资料维护
      case 'port-management':
        breadcrumbs.push(
          { title: '基础资料维护', path: undefined },
          { title: '港口管理', path: '/platformadmin/port-management' }
        );
        break;
      case 'carrier-management-basic':
        breadcrumbs.push(
          { title: '基础资料维护', path: undefined },
          { title: '承运人管理', path: '/platformadmin/carrier-management-basic' }
        );
        break;
      case 'country-region-management':
        breadcrumbs.push(
          { title: '基础资料维护', path: undefined },
          { title: '国家（地区）', path: '/platformadmin/country-region-management' }
        );
        break;
      case 'china-administrative':
        breadcrumbs.push(
          { title: '基础资料维护', path: undefined },
          { title: '行政区划', path: '/platformadmin/china-administrative' }
        );
        break;
      case 'overseas-warehouse':
        breadcrumbs.push(
          { title: '基础资料维护', path: undefined },
          { title: '海外仓库', path: '/platformadmin/overseas-warehouse' }
        );
        break;
      case 'zipcode-management':
        breadcrumbs.push(
          { title: '基础资料维护', path: undefined },
          { title: '邮编管理', path: '/platformadmin/zipcode-management' }
        );
        break;
      case 'route-management':
        breadcrumbs.push(
          { title: '基础资料维护', path: undefined },
          { title: '航线管理', path: '/platformadmin/route-management' }
        );
        break;
      case 'container-management':
        breadcrumbs.push(
          { title: '基础资料维护', path: undefined },
          { title: '集装箱管理', path: '/platformadmin/container-management' }
        );
        break;
      case 'package-unit':
        breadcrumbs.push(
          { title: '基础资料维护', path: undefined },
          { title: '包装单位', path: '/platformadmin/package-unit' }
        );
        break;
      case 'transport-terms':
        breadcrumbs.push(
          { title: '基础资料维护', path: undefined },
          { title: '运输条款', path: '/platformadmin/transport-terms' }
        );
        break;
      case 'calculation-unit':
        breadcrumbs.push(
          { title: '基础资料维护', path: undefined },
          { title: '计费单位', path: '/platformadmin/calculation-unit' }
        );
        break;
      case 'charge-management':
        breadcrumbs.push(
          { title: '基础资料维护', path: undefined },
          { title: '费用管理', path: '/platformadmin/charge-management' }
        );
        break;
      case 'ship-agent':
        breadcrumbs.push(
          { title: '基础资料维护', path: undefined },
          { title: '船舶代理', path: '/platformadmin/ship-agent' }
        );
        break;
      case 'ship-data':
        breadcrumbs.push(
          { title: '基础资料维护', path: undefined },
          { title: '船舶资料', path: '/platformadmin/ship-data' }
        );
        break;
      case 'terminal-management':
        breadcrumbs.push(
          { title: '基础资料维护', path: undefined },
          { title: '码头管理', path: '/platformadmin/terminal-management' }
        );
        break;
      case 'currency-management':
        breadcrumbs.push(
          { title: '基础资料维护', path: undefined },
          { title: '币种管理', path: '/platformadmin/currency-management' }
        );
        break;
      case 'exchange-rate-management':
        breadcrumbs.push(
          { title: '基础资料维护', path: undefined },
          { title: '汇率设置', path: '/platformadmin/exchange-rate-management' }
        );
        break;
      // 系统设置
      case 'staff-management':
        breadcrumbs.push(
          { title: '系统设置', path: undefined },
          { title: '员工管理', path: '/platformadmin/staff-management' }
        );
        break;
      case 'permission-management':
        breadcrumbs.push(
          { title: '系统设置', path: undefined },
          { title: '权限管理', path: '/platformadmin/permission-management' }
        );
        break;
      case 'menu-management':
        breadcrumbs.push(
          { title: '系统设置', path: undefined },
          { title: '菜单管理', path: '/platformadmin/menu-management' }
        );
        break;
      case 'permission-management/add':
        breadcrumbs.push(
          { title: '系统设置', path: undefined },
          { title: '权限管理', path: '/platformadmin/permission-management' },
          { title: '新增权限', path: undefined }
        );
        break;
      default:
        break;
    }

    return breadcrumbs;
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
              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white w-10 h-10 rounded-lg flex items-center justify-center mr-4 relative overflow-hidden shadow-lg">
                <span className="text-xl font-bold">P</span>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-white rounded-tl-lg flex items-center justify-center">
                  <span className="text-xs text-blue-600 font-bold">A</span>
                </div>
              </div>
              <div>
                <div className="text-lg font-bold text-blue-600 leading-relaxed tracking-wide">平台运营后台</div>
                <div className="text-xs text-gray-500 mt-0.5 tracking-wider">Admin Platform</div>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white w-10 h-10 rounded-lg flex items-center justify-center relative overflow-hidden shadow-lg">
              <span className="text-xl font-bold">P</span>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-white rounded-tl-lg flex items-center justify-center">
                <span className="text-xs text-blue-600 font-bold">A</span>
              </div>
            </div>
          )}
        </div>
        <Menu
          selectedKeys={[
            location.pathname.replace('/platformadmin/', '').replace('/', '') || 'dashboard'
          ]}
          onClickMenuItem={handleMenuItemClick}
          style={{ width: '100%' }}
        >
          {/* 控制台 */}
          <MenuItem key="dashboard">
            <IconDashboard />
            <span>控制台</span>
          </MenuItem>
          
          {/* 客商中心 */}
          <SubMenu
            key="customer"
            title={
              <span>
                <FontAwesomeIcon icon={faUsers} className="mr-2" />
                <span>客商中心</span>
              </span>
            }
          >
            <MenuItem key="user-management">用户管理</MenuItem>
            <MenuItem key="company-management">租户管理</MenuItem>
          </SubMenu>
          
          {/* 运营管理 */}
          <SubMenu
            key="operation"
            title={
              <span>
                <IconSettings />
                <span>运营管理</span>
              </span>
            }
          >
            <MenuItem key="carrier-management">
              <span>船东维护</span>
            </MenuItem>
            <MenuItem key="announcement-management">
              <span>公告板管理</span>
            </MenuItem>
          </SubMenu>
          
          {/* 产品中心 */}
          <MenuItem key="product-center">
            <IconApps />
            <span>产品中心</span>
          </MenuItem>

          {/* 基础资料维护 */}
          <SubMenu
            key="basic-data"
            title={
              <span>
                <IconStorage />
                <span>基础资料维护</span>
              </span>
            }
          >
            <MenuItem key="port-management">
              <span>港口管理</span>
            </MenuItem>
            <MenuItem key="carrier-management-basic">
              <span>承运人管理</span>
            </MenuItem>
            <MenuItem key="country-region-management">
              <span>国家（地区）</span>
            </MenuItem>
            <MenuItem key="china-administrative">
              <span>行政区划</span>
            </MenuItem>
            <MenuItem key="overseas-warehouse">
              <span>海外仓库</span>
            </MenuItem>
            <MenuItem key="zipcode-management">
              <span>邮编管理</span>
            </MenuItem>
            <MenuItem key="route-management">
              <span>航线管理</span>
            </MenuItem>
            <MenuItem key="container-management">
              <span>集装箱管理</span>
            </MenuItem>
            <MenuItem key="package-unit">
              <span>包装单位</span>
            </MenuItem>
            <MenuItem key="transport-terms">
              <span>运输条款</span>
            </MenuItem>
            <MenuItem key="trade-terms">
              <span>贸易条款</span>
            </MenuItem>
            <MenuItem key="calculation-unit">
              <span>计费单位</span>
            </MenuItem>
            <MenuItem key="charge-management">
              <span>费用管理</span>
            </MenuItem>
            <MenuItem key="ship-agent">
              <span>船舶代理</span>
            </MenuItem>
            <MenuItem key="ship-data">
              <span>船舶资料</span>
            </MenuItem>
            <MenuItem key="terminal-management">
              <span>码头管理</span>
            </MenuItem>
            <MenuItem key="currency-management">
              <span>币种管理</span>
            </MenuItem>
            <MenuItem key="exchange-rate-management">
              <span>汇率设置</span>
            </MenuItem>
          </SubMenu>

          {/* 系统设置 */}
          <SubMenu
            key="system-settings"
            title={
              <span>
                <IconTool />
                <span>系统设置</span>
              </span>
            }
          >
            <MenuItem key="staff-management">
              <span>员工管理</span>
            </MenuItem>
            <MenuItem key="permission-management">
              <span>权限管理</span>
            </MenuItem>
            <MenuItem key="menu-management">
              <span>菜单管理</span>
            </MenuItem>
          </SubMenu>
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
            <Breadcrumb>
              {getBreadcrumbs().map((item, index) => (
                <Breadcrumb.Item
                  key={index}
                  onClick={() => item.path && navigate(item.path)}
                  className={item.path ? "cursor-pointer hover:text-blue-500" : "text-blue-600 font-medium"}
                >
                  {item.title}
                </Breadcrumb.Item>
              ))}
            </Breadcrumb>
          </div>
          <div className="flex items-center">
            <div 
              className="cursor-pointer hover:opacity-80 transition-opacity mr-4"
              onClick={() => setAiChatVisible(!aiChatVisible)}
              style={{ 
                width: '60px', 
                height: '60px',
                overflow: 'hidden',
                borderRadius: '50%'
              }}
            >
              <img 
                src="/assets/g6qmm-vsolk.gif" 
                alt="智能助手" 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                  borderRadius: '50%'
                }}
              />
            </div>
            <AutoComplete
              className="mr-4"
              style={{ width: 300 }}
              placeholder="请输入菜单名称搜索"
              data={filterMenuItems(searchValue)}
              value={searchValue}
              onSearch={setSearchValue}
              onSelect={handleSearchSelect}
              allowClear
              filterOption={false}
            />
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
                <Menu onClickMenuItem={handleUserMenuClick}>
                  <Menu.Item key="info"><IconUser className="mr-2" />个人信息</Menu.Item>
                  <Menu.Item key="setting"><IconSettingsOutline className="mr-2" />账户设置</Menu.Item>
                  <Menu.Item key="help"><IconQuestionCircle className="mr-2" />帮助中心</Menu.Item>
                  <Divider style={{ margin: '4px 0' }} />
                  <Menu.Item key="logout"><IconPoweroff className="mr-2" />退出登录</Menu.Item>
                </Menu>
              }
              position="br"
            >
              <div className="flex items-center cursor-pointer ml-3">
                <Avatar className="bg-blue-500 mr-2"><IconUser /></Avatar>
                <span className="mr-1">平台管理员</span>
                <IconDown />
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content className="p-0 bg-gray-50 min-h-[calc(100vh-64px)] overflow-auto">
          {children}
        </Content>
      </Layout>
      <AIPlatformAssistant 
        visible={aiChatVisible} 
        onClose={() => setAiChatVisible(false)} 
        onFullscreen={() => {
          setAiChatVisible(false);
          setAiFullscreenVisible(true);
        }}
      />
      <AIFullscreen 
        visible={aiFullscreenVisible} 
        onClose={() => setAiFullscreenVisible(false)} 
        onExitFullscreen={() => {
          setAiFullscreenVisible(false);
          setAiChatVisible(true);
        }}
      />
    </Layout>
  );
};

export default PlatformAdminLayout;