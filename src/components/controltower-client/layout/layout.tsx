import React, { useState } from 'react';
import { Layout, Menu, Button, Avatar, Breadcrumb, Dropdown, Divider, AutoComplete } from '@arco-design/web-react';
import { 
  IconDashboard, 
  IconList, 
  IconApps, 
  IconUser, 
  IconMenuFold, 
  IconMenuUnfold, 
  IconDown, 
  IconPoweroff, 
  IconSettings as IconSettingsOutline, 
  IconLanguage, 
  IconQuestionCircle,
  IconFile
} from '@arco-design/web-react/icon';

// faShip 导入已暂时注释，因为运价中心菜单被注释了
// import { faShip } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useLocation } from 'react-router-dom';
import '../ControlTowerClientStyles.css';
import AIAssistant from './ai-client';
import AIFullscreen from './AIFullscreen';

const { Header, Sider, Content } = Layout;
const MenuItem = Menu.Item;
const SubMenu = Menu.SubMenu;

interface BreadcrumbItem {
  title: string;
  path?: string; // 可选路径，允许为最后一项不设置路径
}

interface LayoutProps {
  children: React.ReactNode;
}

const ControlTowerClientLayout: React.FC<LayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [aiChatVisible, setAiChatVisible] = useState(false);
  const [aiFullscreenVisible, setAiFullscreenVisible] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // 处理锚点导航
  React.useEffect(() => {
    const hash = location.hash;
    if (hash === '#profile') {
      navigate('/controltower-client/user-profile');
    } else if (hash === '#company') {
      navigate('/controltower-client/company-profile');
    }
  }, [location.hash, navigate]);

  const toggleCollapse = () => setCollapsed(!collapsed);

  // 功能菜单数据
  const menuItems = [
    { 
      title: '仪表盘', 
      key: 'dashboard', 
      path: '/controltower-client/dashboard',
      category: '工作台',
      icon: <IconDashboard />
    },
    { 
      title: '控制塔面板', 
      key: 'control-tower-panel', 
      path: '/controltower-client/control-tower-panel',
      category: '工作台',
      icon: <IconApps />
    },
    { 
      title: '控制塔面板-临时', 
      key: 'control-tower-panel-temp', 
      path: '/controltower-client/control-tower-panel-temp',
      category: '工作台',
      icon: <IconApps />
    },
    { 
      title: '船期查询', 
      key: 'schedule-query', 
      path: '/controltower-client/schedule-query',
      category: '统计中心',
      icon: <IconList />
    },
    { 
      title: '运价查询', 
      key: 'saas/rate-query', 
      path: '/controltower-client/saas/rate-query',
      category: '超级运价',
      icon: <IconFile />
    },
    { 
      title: '询价管理', 
      key: 'saas/inquiry-management', 
      path: '/controltower-client/saas/inquiry-management',
      category: '超级运价',
      icon: <IconFile />
    },
    { 
      title: '订单管理', 
      key: 'order-management', 
      path: '/controltower-client/order-management',
      category: '订单中心',
      icon: <IconList />
    },
    { 
      title: '状态追踪', 
      key: 'order-tracking', 
      path: '/controltower-client/order-tracking',
      category: '订单中心',
      icon: <IconList />
    },
    { 
      title: '个人信息', 
      key: 'user-profile', 
      path: '/controltower-client/user-profile',
      category: '用户中心',
      icon: <IconUser />
    },
    { 
      title: '企业信息', 
      key: 'company-profile', 
      path: '/controltower-client/company-profile',
      category: '用户中心',
      icon: <IconUser />
    }
  ];

  // 搜索过滤逻辑
  const filterMenuItems = (inputValue: string) => {
    if (!inputValue) return [];
    
    const filtered = menuItems.filter(item => 
      item.title.toLowerCase().includes(inputValue.toLowerCase()) ||
      item.category.toLowerCase().includes(inputValue.toLowerCase())
    );
    
    // 直接返回扁平化的选项列表
    return filtered.map(item => ({
      value: item.path,
      name: item.title,
      label: (
        <div className="flex items-center">
          <span className="mr-2 text-blue-500">{item.icon}</span>
          <span>{item.title}</span>
          <span className="ml-auto text-xs text-gray-400">{item.category}</span>
        </div>
      )
    }));
  };

  // 处理搜索选择
  const handleSearchSelect = (value: string) => {
    navigate(value);
    setSearchValue('');
  };

  // 菜单点击
  const handleMenuItemClick = (key: string) => {
    if (key === 'dashboard') {
      navigate('/controltower-client');
    } else if (key.startsWith('saas/')) {
      // 超级运价页面路由处理
      navigate(`/controltower-client/${key}`);
    } else {
      navigate(key === 'dashboard' ? '/controltower-client' : `/controltower-client/${key}`);
    }
  };

  // 根据当前路由生成面包屑
  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const path = location.pathname.replace('/controltower-client/', '');
    const breadcrumbs: BreadcrumbItem[] = [
      { title: '首页', path: '/controltower-client' },
      { title: '控制塔系统', path: '/controltower-client' }
    ];

    // 检查是否是订单详情页面（格式：/order-detail/:orderId）
    if (path.startsWith('order-detail/')) {
      const orderId = path.split('/')[1]; // 获取订单ID
      breadcrumbs.push(
        { title: '订单中心', path: '/controltower-client/order' },
        { title: '订单管理', path: '/controltower-client/order-management' },
        { title: orderId, path: undefined } // 当前订单，无链接
      );
      return breadcrumbs;
    }

    // 检查是否是查看运价详情页面（格式：/view-fcl-rate/:id）
    if (path.startsWith('view-fcl-rate/')) {
      const rateId = path.split('/')[1]; // 获取运价ID
      breadcrumbs.push(
        { title: '超级运价', path: undefined },
        { title: '运价查询', path: '/controltower-client/saas/rate-query' },
        { title: `运价详情 ${rateId}`, path: undefined } // 当前运价详情，无链接
      );
      return breadcrumbs;
    }

    // 处理超级运价系统页面
    if (path.startsWith('saas/')) {
      const saasPath = path.replace('saas/', '');
      switch (saasPath) {
        // 控制台和数据分析页面面包屑已删除
        /*
        case 'super-freight-dashboard':
          breadcrumbs.push({ title: '超级运价', path: '/controltower/saas/super-freight-dashboard' });
          break;
        */
        case 'fcl-rates':
          breadcrumbs.push(
            { title: '超级运价', path: undefined },
            { title: '运价管理', path: undefined },
            { title: '海运整箱', path: '/controltower/saas/fcl-rates' }
          );
          break;
        case 'rate-query':
          breadcrumbs.push(
            { title: '超级运价', path: undefined },
            { title: '运价管理', path: undefined },
            { title: '运价查询', path: '/controltower/saas/rate-query' }
          );
          break;
        case 'precarriage-rates':
          breadcrumbs.push(
            { title: '超级运价', path: undefined },
            { title: '门点服务管理', path: undefined },
            { title: '港前运价', path: '/controltower/saas/precarriage-rates' }
          );
          break;
        case 'lastmile-rates':
          breadcrumbs.push(
            { title: '超级运价', path: undefined },
            { title: '门点服务管理', path: undefined },
            { title: '尾程运价', path: '/controltower/saas/lastmile-rates' }
          );
          break;
        case 'inquiry-management':
          breadcrumbs.push(
            { title: '超级运价', path: undefined },
            { title: '询价报价', path: undefined },
            { title: '询价管理', path: '/controltower/saas/inquiry-management' }
          );
          break;
        case 'route-management':
          breadcrumbs.push(
            { title: '超级运价', path: undefined },
            { title: '基础数据', path: undefined },
            { title: '航线管理', path: '/controltower/saas/route-management' }
          );
          break;
        case 'region-management':
          breadcrumbs.push(
            { title: '超级运价', path: undefined },
            { title: '基础数据', path: undefined },
            { title: '行政区划', path: '/controltower/saas/region-management' }
          );
          break;
        case 'zipcode-management':
          breadcrumbs.push(
            { title: '超级运价', path: undefined },
            { title: '基础数据', path: undefined },
            { title: '邮编管理', path: '/controltower/saas/zipcode-management' }
          );
          break;
        case 'fba-warehouse':
          breadcrumbs.push(
            { title: '超级运价', path: undefined },
            { title: '基础数据', path: undefined },
            { title: 'FBA仓库', path: '/controltower/saas/fba-warehouse' }
          );
          break;
        default:
          break;
      }
      return breadcrumbs;
    }

    // 处理其他路径
    const simplePath = path.replace('/', '');
    switch (simplePath) {
      case '':
      case 'dashboard':
        breadcrumbs.push({ title: '仪表盘', path: '/controltower/dashboard' });
        break;
      case 'control-tower-panel':
        breadcrumbs.push({ title: '控制塔面板', path: '/controltower-client/control-tower-panel' });
        break;
      case 'control-tower-panel-temp':
        breadcrumbs.push({ title: '控制塔面板-临时', path: '/controltower-client/control-tower-panel-temp' });
        break;
      case 'schedule-query':
        breadcrumbs.push({ title: '船期查询', path: '/controltower-client/schedule-query' });
        break;
      // 运价中心相关页面面包屑已暂时注释
      /*
      case 'freight-rate-query':
        breadcrumbs.push(
          { title: '运价中心', path: '/controltower/freight' },
          { title: '运价查询', path: '/controltower/freight-rate-query' }
        );
        break;
      case 'inquiry-management':
        breadcrumbs.push(
          { title: '运价中心', path: '/controltower/freight' },
          { title: '询价管理', path: '/controltower/inquiry-management' }
        );
        break;
      */

      case 'user-profile':
        breadcrumbs.push(
          { title: '用户中心', path: '/controltower/user' },
          { title: '个人信息', path: '/controltower/user-profile' }
        );
        break;
      case 'company-profile':
        breadcrumbs.push(
          { title: '用户中心', path: '/controltower/user' },
          { title: '企业信息', path: '/controltower/company-profile' }
        );
        break;
      case 'order-management':
        breadcrumbs.push(
          { title: '订单中心', path: '/controltower/order' },
          { title: '订单管理', path: '/controltower/order-management' }
        );
        break;
      case 'order-tracking':
        breadcrumbs.push(
          { title: '订单中心', path: '/controltower/order' },
          { title: '状态追踪', path: '/controltower/order-tracking' }
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
        className="border-r border-gray-200 relative"
      >
        {/* 绸带标签 - 放在侧边栏左上角 */}
        <div className="ribbon green">
          客户端
        </div>
        
        <div className="p-4 flex items-center justify-center">
          {!collapsed ? (
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white w-10 h-10 rounded-lg flex items-center justify-center mr-4 relative overflow-hidden shadow-lg">
                <span className="text-xl font-bold">C</span>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-white rounded-tl-lg flex items-center justify-center">
                  <span className="text-xs text-blue-600 font-bold">1</span>
                </div>
              </div>
              <div>
                <div className="text-lg font-bold text-blue-600 leading-relaxed tracking-wide">控制塔系统</div>
                <div className="text-xs text-gray-500 mt-0.5 tracking-wider">CargoONE</div>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white w-10 h-10 rounded-lg flex items-center justify-center relative overflow-hidden shadow-lg">
              <span className="text-xl font-bold">C</span>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-white rounded-tl-lg flex items-center justify-center">
                <span className="text-xs text-blue-600 font-bold">1</span>
              </div>
            </div>
          )}
        </div>
        <Menu
          selectedKeys={[
            location.pathname.replace('/controltower-client/', '').replace('/', '') || 'dashboard'
          ]}
          onClickMenuItem={handleMenuItemClick}
          style={{ width: '100%' }}
        >
          <MenuItem key="dashboard">
            <IconDashboard />
            <span>仪表盘</span>
          </MenuItem>
          <SubMenu
            key="control-tower"
            title={
              <span>
                <IconApps />
                <span>控制塔面板</span>
              </span>
            }
          >
            <MenuItem key="control-tower-panel">控制塔面板</MenuItem>
            <MenuItem key="control-tower-panel-temp">控制塔面板-临时</MenuItem>
          </SubMenu>
          <MenuItem key="schedule-query">
            <IconList />
            <span>船期查询</span>
          </MenuItem>
          
          {/* 超级运价系统菜单 */}
          <SubMenu
            key="super-freight"
            title={
              <span>
                <IconFile />
                <span>超级运价</span>
              </span>
            }
          >
            {/* 保留运价查询，直接作为超级运价的子菜单 */}
            <MenuItem key="saas/rate-query">运价查询</MenuItem>
            {/* 询价管理上提一级 */}
            <MenuItem key="saas/inquiry-management">询价管理</MenuItem>
          </SubMenu>
          
          {/* 原有控制塔菜单 */}
          {/* 运价中心菜单已暂时注释
          <SubMenu
            key="freight"
            title={
              <span>
                <FontAwesomeIcon icon={faShip} className="mr-2" />
                <span>运价中心</span>
              </span>
            }
          >
            <MenuItem key="freight-rate-query">运价查询</MenuItem>
            <MenuItem key="inquiry-management">询价管理</MenuItem>
          </SubMenu>
          */}
          <SubMenu
            key="order"
            title={
              <span>
                <IconList />
                <span>订单中心</span>
              </span>
            }
          >
            <MenuItem key="order-management">订单管理</MenuItem>
            <MenuItem key="order-tracking">状态追踪</MenuItem>
          </SubMenu>

          <SubMenu
            key="user"
            title={
              <span>
                <IconUser />
                <span>用户中心</span>
              </span>
            }
          >
            <MenuItem key="user-profile">个人信息</MenuItem>
            <MenuItem key="company-profile">企业信息</MenuItem>
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
                <Menu>
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
      <AIAssistant 
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

export default ControlTowerClientLayout; 