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
  IconFile,
  IconStorage,
  IconSettings,
  IconBook,
  IconDownload,
  IconDelete,
  IconEye,
  IconGift
} from '@arco-design/web-react/icon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faShip } from '@fortawesome/free-solid-svg-icons';
// faShip 导入已暂时注释，因为运价中心菜单被注释了
// import { faShip } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useLocation } from 'react-router-dom';
import '../ControlTowerStyles.css';
import AIAssistant from './ai';
import AIFullscreen from './AIFullscreen';
import TabsComponent from './TabsComponent';

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

const ControlTowerLayout: React.FC<LayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [aiChatVisible, setAiChatVisible] = useState(false);
  const [aiFullscreenVisible, setAiFullscreenVisible] = useState(false);
  const [searchValue, setSearchValue] = useState('');// 云文件下拉框状态
  const [cloudFileVisible, setCloudFileVisible] = useState(false);
  const [activeCloudTab, setActiveCloudTab] = useState('export');
  
  // 文件悬停状态和文件列表管理
  const [hoveredFileId, setHoveredFileId] = useState<string | null>(null);
  
  // 避免TypeScript警告 - hoveredFileId用于UI交互
  void hoveredFileId;
  const [exportFiles, setExportFiles] = useState([
    {
      id: '1',
      name: '消费账单2025-07-29.xlsx',
      user: '张三',
      time: '1 小时前'
    }
  ]);
  const [importFiles, setImportFiles] = useState([
    {
      id: '2',
      name: '供应商数据2025-07-29.xlsx',
      user: '李四',
      time: '2 小时前'
    }
  ]);
  const navigate = useNavigate();
  const location = useLocation();
  
  // 检查是否为个人模式
  const urlParams = new URLSearchParams(location.search);
  const isPersonalMode = urlParams.get('mode') === 'personal';

  const toggleCollapse = () => setCollapsed(!collapsed);

  // 运营版功能菜单数据
  const menuItems = [
    // 工作台
    { 
      title: '通用规范约定', 
      key: 'ui-standards', 
      path: '/controltower/ui-standards',
      category: '工作台',
      icon: <IconBook />
    },
    { 
      title: '仪表盘', 
      key: 'dashboard', 
      path: '/controltower',
      category: '工作台',
      icon: <IconDashboard />
    },
    { 
      title: '控制塔面板', 
      key: 'control-tower-panel', 
      path: '/controltower/control-tower-panel',
      category: '工作台',
      icon: <IconApps />
    },
    { 
      title: '控制塔面板-临时', 
      key: 'control-tower-panel-temp', 
      path: '/controltower/control-tower-panel-temp',
      category: '工作台',
      icon: <IconApps />
    },
    { 
      title: '应用中心', 
      key: 'application-center', 
      path: '/controltower/application-center',
      category: '工作台',
      icon: <IconApps />
    },
    
    // 超级运价系统
    { 
      title: '运价维护', 
      key: 'saas/fcl-rates', 
      path: '/controltower/saas/fcl-rates',
      category: '超级运价',
      icon: <IconFile />
    },
    { 
      title: '运价查询', 
      key: 'saas/rate-query', 
      path: '/controltower/saas/rate-query',
      category: '超级运价',
      icon: <IconFile />
    },
    { 
      title: '询价管理', 
      key: 'saas/inquiry-management', 
      path: '/controltower/saas/inquiry-management',
      category: '超级运价-询价报价',
      icon: <IconFile />
    },
    { 
      title: '报价管理', 
      key: 'saas/quote-management', 
      path: '/controltower/saas/quote-management',
      category: '超级运价-询价报价',
      icon: <IconFile />
    },
    { 
      title: '舱位查询', 
      key: 'saas/space-query', 
      path: '/controltower/saas/space-query',
      category: '超级运价-舱位管理',
      icon: <IconFile />
    },
    { 
      title: '舱位预订', 
      key: 'saas/space-booking', 
      path: '/controltower/saas/space-booking',
      category: '超级运价-舱位管理',
      icon: <IconFile />
    },
    { 
      title: '舱位统计', 
      key: 'saas/space-statistics', 
      path: '/controltower/saas/space-statistics',
      category: '超级运价-舱位管理',
      icon: <IconFile />
    },
    { 
      title: '合约管理', 
      key: 'saas/contract-management', 
      path: '/controltower/saas/contract-management',
      category: '超级运价',
      icon: <IconFile />
    },
    { 
      title: '附加费维护', 
      key: 'saas/surcharge', 
      path: '/controltower/saas/surcharge',
      category: '超级运价',
      icon: <IconFile />
    },
    { 
      title: '加价规则维护', 
      key: 'saas/pricing-rule-management', 
      path: '/controltower/saas/pricing-rule-management',
      category: '超级运价',
      icon: <IconFile />
    },
    
    // 订单中心
    { 
      title: '订单管理', 
      key: 'order-management', 
      path: '/controltower/order-management',
      category: '订单中心',
      icon: <IconList />
    },
    
    // 船期中心
    { 
      title: '航线维护', 
      key: 'route-maintenance', 
      path: '/controltower/route-maintenance',
      category: '船期中心',
      icon: <FontAwesomeIcon icon={faShip} />
    },
    { 
      title: '船期查询', 
      key: 'schedule-query', 
      path: '/controltower/schedule-query',
      category: '船期中心',
      icon: <FontAwesomeIcon icon={faShip} />
    },
    
    // 客商中心
    { 
      title: '用户管理', 
      key: 'user-management', 
      path: '/controltower/user-management',
      category: '客商中心',
      icon: <FontAwesomeIcon icon={faUsers} />
    },
    { 
      title: '企业管理', 
      key: 'company-management', 
      path: '/controltower/company-management',
      category: '客商中心',
      icon: <FontAwesomeIcon icon={faUsers} />
    },
    
    // 用户中心
    { 
      title: '个人信息', 
      key: 'user-profile', 
      path: '/controltower/user-profile',
      category: '用户中心',
      icon: <IconUser />
    },
    { 
      title: '企业信息', 
      key: 'company-profile', 
      path: '/controltower/company-profile',
      category: '用户中心',
      icon: <IconUser />
    },
    
    // 运营管理
    { 
      title: '首页管理', 
      key: 'home-management', 
      path: '/controltower/home-management',
      category: '运营管理',
      icon: <IconApps />
    },
    { 
      title: '资讯中心管理', 
      key: 'news-management', 
      path: '/controltower/news-management',
      category: '运营管理',
      icon: <IconApps />
    },
    { 
      title: '业务介绍管理', 
      key: 'business-management', 
      path: '/controltower/business-management',
      category: '运营管理',
      icon: <IconApps />
    },
    { 
      title: '关于我们管理', 
      key: 'about-management', 
      path: '/controltower/about-management',
      category: '运营管理',
      icon: <IconApps />
    },
    
    // 系统设置
    { 
      title: '员工管理', 
      key: 'employee-management', 
      path: '/controltower/employee-management',
      category: '系统设置',
      icon: <IconSettings />
    },
    { 
      title: '权限管理', 
      key: 'permission-management', 
      path: '/controltower/permission-management',
      category: '系统设置',
      icon: <IconSettings />
    },
    { 
      title: '个性化配置', 
      key: 'personalization-config', 
      path: '/controltower/personalization-config',
      category: '系统设置',
      icon: <IconSettings />
    },
    { 
      title: '任务管理', 
      key: 'task-management', 
      path: '/controltower/task-management',
      category: '系统设置',
      icon: <IconSettings />
    },
    { 
      title: '业务节点设置', 
      key: 'business-node-settings', 
      path: '/controltower/business-node-settings',
      category: '系统设置',
      icon: <IconSettings />
    },
    
    // 基础资料维护
    { 
      title: '港口管理', 
      key: 'port-management', 
      path: '/controltower/port-management',
      category: '基础资料维护',
      icon: <IconStorage />
    },
    { 
      title: '承运人管理', 
      key: 'carrier-management', 
      path: '/controltower/carrier-management',
      category: '基础资料维护',
      icon: <IconStorage />
    },
    { 
      title: '国家（地区）', 
      key: 'country-region-management', 
      path: '/controltower/country-region-management',
      category: '基础资料维护',
      icon: <IconStorage />
    },
    { 
      title: '行政区划', 
      key: 'china-administrative', 
      path: '/controltower/china-administrative',
      category: '基础资料维护',
      icon: <IconStorage />
    },
    { 
      title: '海外仓库', 
      key: 'overseas-warehouse', 
      path: '/controltower/overseas-warehouse',
      category: '基础资料维护',
      icon: <IconStorage />
    },
    { 
      title: '邮编管理', 
      key: 'zipcode-management', 
      path: '/controltower/zipcode-management',
      category: '基础资料维护',
      icon: <IconStorage />
    },
    { 
      title: '航线管理', 
      key: 'route-management', 
      path: '/controltower/route-management',
      category: '基础资料维护',
      icon: <IconStorage />
    },
    { 
      title: '集装箱管理', 
      key: 'container-management', 
      path: '/controltower/container-management',
      category: '基础资料维护',
      icon: <IconStorage />
    },
    { 
      title: '包装单位', 
      key: 'package-unit', 
      path: '/controltower/package-unit',
      category: '基础资料维护',
      icon: <IconStorage />
    },
    { 
      title: '运输条款', 
      key: 'transport-terms', 
      path: '/controltower/transport-terms',
      category: '基础资料维护',
      icon: <IconStorage />
    },
    { 
      title: '贸易条款', 
      key: 'trade-terms', 
      path: '/controltower/trade-terms',
      category: '基础资料维护',
      icon: <IconStorage />
    },
    { 
      title: '币种管理', 
      key: 'currency-management', 
      path: '/controltower/currency-management',
      category: '基础资料维护',
      icon: <IconStorage />
    },
    { 
      title: '汇率设置', 
      key: 'exchange-rate-management', 
      path: '/controltower/exchange-rate-management',
      category: '基础资料维护',
      icon: <IconStorage />
    },
    { 
      title: '计费单位', 
      key: 'calculation-unit', 
      path: '/controltower/calculation-unit',
      category: '基础资料维护',
      icon: <IconStorage />
    },
    { 
      title: '费用管理', 
      key: 'charge-management', 
      path: '/controltower/charge-management',
      category: '基础资料维护',
      icon: <IconStorage />
    },
    { 
      title: '船舶代理', 
      key: 'ship-agent', 
      path: '/controltower/ship-agent',
      category: '基础资料维护',
      icon: <IconStorage />
    },
    { 
      title: '船舶资料', 
      key: 'ship-data', 
      path: '/controltower/ship-data',
      category: '基础资料维护',
      icon: <IconStorage />
    },
    { 
      title: '码头管理', 
      key: 'terminal-management', 
      path: '/controltower/terminal-management',
      category: '基础资料维护',
      icon: <IconStorage />
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
      // 构建面包屑路径
      let breadcrumbPath = '';
      const categoryParts = item.category.split('-');
      
      if (categoryParts.length > 1) {
        // 如果有子分类（如"超级运价-询价报价"）
        breadcrumbPath = `${categoryParts[0]} > ${categoryParts[1]} > ${item.title}`;
      } else {
        // 普通分类
        breadcrumbPath = `${item.category} > ${item.title}`;
      }
      
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
      navigate('/controltower');
    } else if (key === 'bi-analytics') {
      // BI统计分析页面
      navigate('/controltower/bi-analytics');
    } else if (key === 'api-list') {
      // API列表页面
      navigate('/controltower/api-center');
    } else if (key === 'api-settings') {
      // API设置页面
      navigate('/controltower/api-settings');
    } else if (key === 'ai-customer-acquisition') {
      // AI获客页面
      navigate('/controltower/sales-toolkit/ai-customer-acquisition');
    } else if (key === 'customer-management') {
      // 客户管理页面
      navigate('/controltower/sales-toolkit/customer-management');
    } else if (key === 'contact-management') {
      // 联系人管理页面
      navigate('/controltower/sales-toolkit/contact-management');
    } else if (key === 'contract-management-sales') {
      // 合同管理页面（销售百宝箱）
      navigate('/controltower/sales-toolkit/contract-management');
    } else if (key === 'ai-marketing') {
      // AI营销页面
      navigate('/controltower/sales-toolkit/ai-marketing');
    } else if (key.startsWith('saas/')) {
      // 超级运价页面路由处理
      navigate(`/controltower/${key}`);
    } else {
      navigate(key === 'dashboard' ? '/controltower' : `/controltower/${key}`);
    }
  };

  // 删除文件处理函数
  const handleDeleteFile = (fileId: string) => {
    setExportFiles(prevFiles => prevFiles.filter(file => file.id !== fileId));
    setHoveredFileId(null);
  };

  // 删除导入文件处理函数
  const handleDeleteImportFile = (fileId: string) => {
    setImportFiles(prevFiles => prevFiles.filter(file => file.id !== fileId));
    setHoveredFileId(null);
  };

  // 根据当前路由生成面包屑
  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const path = location.pathname.replace('/controltower/', '');
    const breadcrumbs: BreadcrumbItem[] = [
      { title: '控制塔', path: '/controltower' }
    ];

    // BI统计分析页面
    if (path === 'bi-analytics') {
      breadcrumbs.push(
        { title: 'BI统计分析', path: undefined }
      );
      return breadcrumbs;
    }

    // 通用规范约定页面
    if (path === 'ui-standards') {
      breadcrumbs.push(
        { title: '通用规范约定', path: undefined }
      );
      return breadcrumbs;
    }

    // 检查是否是订单详情页面（格式：/order-detail/:orderId）
    if (path.startsWith('order-detail/')) {
      const orderId = path.split('/')[1]; // 获取订单ID
      breadcrumbs.push(
        { title: '订单中心', path: '/controltower/order' },
        { title: '订单管理', path: '/controltower/order-management' },
        { title: orderId, path: undefined } // 当前订单，无链接
      );
      return breadcrumbs;
    }

    // 船期中心页面
    if (path === 'route-maintenance') {
      breadcrumbs.push(
        { title: '船期中心', path: undefined },
        { title: '航线维护', path: undefined }
      );
      return breadcrumbs;
    }
    if (path.startsWith('route-maintenance/')) {
      const isEdit = path.includes('edit');
      breadcrumbs.push(
        { title: '船期中心', path: undefined },
        { title: '航线维护', path: '/controltower/route-maintenance' },
        { title: isEdit ? '编辑航线' : '新增航线', path: undefined }
      );
      return breadcrumbs;
    }
    if (path === 'schedule-query') {
      breadcrumbs.push(
        { title: '船期中心', path: undefined },
        { title: '船期查询', path: undefined }
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
            { title: '运价维护', path: undefined }
          );
          break;
        case 'rate-query':
          breadcrumbs.push(
            { title: '超级运价', path: undefined },
            { title: '运价查询', path: undefined }
          );
          break;
        case 'precarriage-rates':
          breadcrumbs.push(
            { title: '超级运价', path: undefined },
            { title: '港前运价', path: undefined }
          );
          break;
        case 'lastmile-rates':
          breadcrumbs.push(
            { title: '超级运价', path: undefined },
            { title: '尾程运价', path: undefined }
          );
          break;
        case 'inquiry-management':
          breadcrumbs.push(
            { title: '超级运价', path: undefined },
            { title: '询价报价', path: undefined },
            { title: '询价管理', path: undefined }
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
        case 'pricing-rule-management':
          breadcrumbs.push(
            { title: '超级运价', path: undefined },
            { title: '加价规则维护', path: undefined }
          );
          break;
        case 'surcharge':
          breadcrumbs.push(
            { title: '超级运价', path: undefined },
            { title: '附加费维护', path: undefined }
          );
          break;
        case 'contract-management':
          breadcrumbs.push(
            { title: '超级运价', path: undefined },
            { title: '合约管理', path: undefined }
          );
          break;
        case 'create-precarriage-rate':
          breadcrumbs.push(
            { title: '超级运价', path: undefined },
            { title: '港前运价', path: '/controltower/saas/precarriage-rates' },
            { title: '新增港前运价', path: undefined }
          );
          break;
        case 'create-lastmile-rate':
          breadcrumbs.push(
            { title: '超级运价', path: undefined },
            { title: '尾程运价', path: '/controltower/saas/lastmile-rates' },
            { title: '新增尾程运价', path: undefined }
          );
          break;
        case 'quote-management':
          breadcrumbs.push(
            { title: '超级运价', path: undefined },
            { title: '询价报价', path: undefined },
            { title: '报价管理', path: undefined }
          );
          break;
        default:
          if (saasPath.startsWith('contract/')) {
            const isEdit = saasPath.includes('edit');
            breadcrumbs.push(
              { title: '超级运价', path: undefined },
              { title: '合约管理', path: '/controltower/saas/contract-management' },
              { title: isEdit ? '编辑合约' : '新增合约', path: undefined }
            );
          } else if (saasPath.startsWith('pricing-rule-management/')) {
            const isEdit = saasPath.includes('edit');
            breadcrumbs.push(
              { title: '超级运价', path: undefined },
              { title: '加价规则维护', path: '/controltower/saas/pricing-rule-management' },
              { title: isEdit ? '编辑规则' : '新增规则', path: undefined }
            );
          } else if (saasPath.startsWith('surcharge/')) {
            const action = saasPath.includes('edit') ? '编辑附加费' : saasPath.includes('view') ? '查看附加费' : '新增附加费';
            breadcrumbs.push(
              { title: '超级运价', path: undefined },
              { title: '附加费维护', path: '/controltower/saas/surcharge' },
              { title: action, path: undefined }
            );
          }
          break;
      }
      return breadcrumbs;
    }

    // 处理其他路径
    const simplePath = path.replace('/', '');
    switch (simplePath) {
      case '':
      case 'dashboard':
        // 仪表盘不需要额外的面包屑，只显示"控制塔"
        break;
      case 'control-tower-panel':
        breadcrumbs.push({ title: '控制塔面板', path: undefined });
        break;
      case 'control-tower-panel-temp':
        breadcrumbs.push({ title: '控制塔面板-临时', path: undefined });
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
      case 'billing-management':
        breadcrumbs.push(
          { title: '财务中心', path: '/controltower/finance' },
          { title: '账单管理', path: '/controltower/billing-management' }
        );
        break;
      case 'invoice-management':
        breadcrumbs.push(
          { title: '财务中心', path: '/controltower/finance' },
          { title: '发票管理', path: '/controltower/invoice-management' }
        );
        break;
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

      case 'application-center':
        breadcrumbs.push({ title: '应用中心', path: '/controltower/application-center' });
        break;
      // 销售百宝箱相关页面
      case 'ai-customer-acquisition':
        breadcrumbs.push(
          { title: '销售百宝箱', path: undefined },
          { title: 'AI获客', path: '/controltower/ai-customer-acquisition' }
        );
        break;
      case 'customer-management':
        breadcrumbs.push(
          { title: '销售百宝箱', path: undefined },
          { title: '客户管理', path: '/controltower/customer-management' }
        );
        break;
      case 'contact-management':
        breadcrumbs.push(
          { title: '销售百宝箱', path: undefined },
          { title: '联系人管理', path: '/controltower/contact-management' }
        );
        break;
      case 'contract-management':
        breadcrumbs.push(
          { title: '销售百宝箱', path: undefined },
          { title: '合同管理', path: '/controltower/contract-management' }
        );
        break;
      case 'ai-marketing':
        breadcrumbs.push(
          { title: '销售百宝箱', path: undefined },
          { title: 'AI营销', path: '/controltower/ai-marketing' }
        );
        break;
      case 'api-center':
        breadcrumbs.push(
          { title: 'API中心', path: undefined },
          { title: 'API列表', path: '/controltower/api-center' }
        );
        break;
      case 'api-settings':
        breadcrumbs.push(
          { title: 'API中心', path: undefined },
          { title: 'API设置', path: '/controltower/api-settings' }
        );
        break;
      case 'user-management':
        breadcrumbs.push(
          { title: '客商中心', path: undefined },
          { title: '用户管理', path: '/controltower/user-management' }
        );
        break;
      case 'company-management':
        breadcrumbs.push(
          { title: '客商中心', path: undefined },
          { title: '企业管理', path: '/controltower/company-management' }
        );
        break;
      case 'employee-management':
        breadcrumbs.push(
          { title: '系统设置', path: undefined },
          { title: '员工管理', path: '/controltower/employee-management' }
        );
        break;
      case 'permission-management':
        breadcrumbs.push(
          { title: '系统设置', path: undefined },
          { title: '权限管理', path: '/controltower/permission-management' }
        );
        break;
      case 'role-permission-management':
        breadcrumbs.push(
          { title: '系统设置', path: undefined },
          { title: '角色权限管理', path: '/controltower/role-permission-management' }
        );
        break;
      case 'personalization-config':
        breadcrumbs.push(
          { title: '系统设置', path: undefined },
          { title: '个性化配置', path: '/controltower/personalization-config' }
        );
        break;
      case 'task-management':
        breadcrumbs.push(
          { title: '系统设置', path: undefined },
          { title: '任务管理', path: '/controltower/task-management' }
        );
        break;
      case 'business-node-settings':
        breadcrumbs.push(
          { title: '系统设置', path: undefined },
          { title: '业务节点设置', path: undefined }
        );
        break;
      case 'template-settings':
        breadcrumbs.push(
          { title: '系统设置', path: undefined },
          { title: '模板设置', path: '/controltower/template-settings' }
        );
        break;
      case 'home-management':
        breadcrumbs.push(
          { title: '运营管理', path: undefined },
          { title: '首页管理', path: '/controltower/home-management' }
        );
        break;
      case 'news-management':
        breadcrumbs.push(
          { title: '运营管理', path: undefined },
          { title: '资讯中心管理', path: '/controltower/news-management' }
        );
        break;
      case 'business-management':
        breadcrumbs.push(
          { title: '运营管理', path: undefined },
          { title: '业务介绍管理', path: '/controltower/business-management' }
        );
        break;
      case 'about-management':
        breadcrumbs.push(
          { title: '运营管理', path: undefined },
          { title: '关于我们管理', path: '/controltower/about-management' }
        );
        break;
      case 'add-employee':
        breadcrumbs.push(
          { title: '系统设置', path: undefined },
          { title: '员工管理', path: '/controltower/employee-management' },
          { title: '新增员工', path: undefined }
        );
        break;
      // 基础资料维护页面
      case 'port-management':
        breadcrumbs.push(
          { title: '基础资料维护', path: undefined },
          { title: '港口管理', path: undefined }
        );
        break;
      case 'carrier-management':
        breadcrumbs.push(
          { title: '基础资料维护', path: undefined },
          { title: '承运人管理', path: undefined }
        );
        break;
      case 'country-region-management':
        breadcrumbs.push(
          { title: '基础资料维护', path: undefined },
          { title: '国家（地区）', path: undefined }
        );
        break;
      case 'china-administrative':
        breadcrumbs.push(
          { title: '基础资料维护', path: undefined },
          { title: '行政区划', path: undefined }
        );
        break;
      case 'overseas-warehouse':
        breadcrumbs.push(
          { title: '基础资料维护', path: undefined },
          { title: '海外仓库', path: undefined }
        );
        break;
      case 'zipcode-management':
        breadcrumbs.push(
          { title: '基础资料维护', path: undefined },
          { title: '邮编管理', path: undefined }
        );
        break;
      case 'route-management':
        breadcrumbs.push(
          { title: '基础资料维护', path: undefined },
          { title: '航线管理', path: undefined }
        );
        break;
      case 'container-management':
        breadcrumbs.push(
          { title: '基础资料维护', path: undefined },
          { title: '集装箱管理', path: undefined }
        );
        break;
      case 'package-unit':
        breadcrumbs.push(
          { title: '基础资料维护', path: undefined },
          { title: '包装单位', path: undefined }
        );
        break;
      case 'transport-terms':
        breadcrumbs.push(
          { title: '基础资料维护', path: undefined },
          { title: '运输条款', path: undefined }
        );
        break;
      case 'trade-terms':
        breadcrumbs.push(
          { title: '基础资料维护', path: undefined },
          { title: '贸易条款', path: undefined }
        );
        break;
      case 'calculation-unit':
        breadcrumbs.push(
          { title: '基础资料维护', path: undefined },
          { title: '计费单位', path: undefined }
        );
        break;
      case 'charge-management':
        breadcrumbs.push(
          { title: '基础资料维护', path: undefined },
          { title: '费用管理', path: undefined }
        );
        break;
      case 'ship-agent':
        breadcrumbs.push(
          { title: '基础资料维护', path: undefined },
          { title: '船舶代理', path: undefined }
        );
        break;
      case 'ship-data':
        breadcrumbs.push(
          { title: '基础资料维护', path: undefined },
          { title: '船舶资料', path: undefined }
        );
        break;
      case 'terminal-management':
        breadcrumbs.push(
          { title: '基础资料维护', path: undefined },
          { title: '码头管理', path: undefined }
        );
        break;
      case 'company-certification':
        breadcrumbs.push(
          { title: '用户中心', path: undefined },
          { title: '企业认证', path: undefined }
        );
        break;
      case 'company-data-management':
        breadcrumbs.push(
          { title: '用户中心', path: undefined },
          { title: '企业资料管理', path: undefined }
        );
        break;
      case 'currency-management':
        breadcrumbs.push(
          { title: '基础资料维护', path: undefined },
          { title: '币种管理', path: undefined }
        );
        break;
      case 'exchange-rate-management':
        breadcrumbs.push(
          { title: '基础资料维护', path: undefined },
          { title: '汇率设置', path: undefined }
        );
        break;
      default:
        // 处理编辑员工页面
        if (simplePath.startsWith('edit-employee/')) {
          breadcrumbs.push(
            { title: '系统设置', path: undefined },
            { title: '员工管理', path: '/controltower/employee-management' },
            { title: '编辑员工', path: undefined }
          );
        }
        // 处理企业管理的新增和编辑页面
        else if (simplePath.startsWith('company-management/')) {
          if (simplePath === 'company-management/add') {
            breadcrumbs.push(
              { title: '客户中心', path: undefined },
              { title: '企业管理', path: '/controltower/company-management' },
              { title: '添加企业', path: undefined }
            );
          } else if (simplePath.startsWith('company-management/edit/')) {
            breadcrumbs.push(
              { title: '客户中心', path: undefined },
              { title: '企业管理', path: '/controltower/company-management' },
              { title: '编辑企业', path: undefined }
            );
          }
        }
        // 处理导入任务详情页面
        else if (simplePath.startsWith('import-task-detail/')) {
          breadcrumbs.push(
            { title: '系统设置', path: undefined },
            { title: '任务管理', path: '/controltower/task-management' },
            { title: '导入任务详情', path: undefined }
          );
        }
        // 处理角色权限配置页面
        else if (simplePath.startsWith('role-permission-config/')) {
          breadcrumbs.push(
            { title: '系统设置', path: undefined },
            { title: '角色权限管理', path: '/controltower/role-permission-management' },
            { title: '权限配置', path: undefined }
          );
        }
        // 处理角色客商配置页面
        else if (simplePath.startsWith('role-customer-config/')) {
          breadcrumbs.push(
            { title: '系统设置', path: undefined },
            { title: '角色权限管理', path: '/controltower/role-permission-management' },
            { title: '配置客商', path: undefined }
          );
        }
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
        <div className={`ribbon ${isPersonalMode ? 'green' : 'orange'}`}>
          {isPersonalMode ? '个人' : '运营'}
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
            location.pathname.replace('/controltower/', '').replace('/', '') || 'dashboard'
          ]}
          onClickMenuItem={handleMenuItemClick}
          style={{ width: '100%' }}
        >
          {/* 个人模式只显示用户中心 */}
          {isPersonalMode ? (
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
          ) : (
            <>
              {/* 企业模式显示完整菜单 */}
              {/* BI统计分析 - 置于菜单最上方 */}
              <MenuItem key="bi-analytics">
                <IconDashboard />
                <span>BI统计分析</span>
              </MenuItem>
              <MenuItem key="ui-standards">
                <IconBook />
                <span>通用规范约定</span>
              </MenuItem>
              <MenuItem key="dashboard">
                <IconDashboard />
                <span>仪表盘</span>
              </MenuItem>
              <MenuItem key="control-tower-panel">
                <IconApps />
                <span>控制塔面板</span>
              </MenuItem>
              <MenuItem key="control-tower-panel-temp">
                <IconApps />
                <span>控制塔面板-临时</span>
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
                <MenuItem key="saas/fcl-rates">运价维护</MenuItem>
                <MenuItem key="saas/rate-query">运价查询</MenuItem>
                <SubMenu
                  key="inquiry-quote"
                  title="询价报价"
                >
                  <MenuItem key="saas/inquiry-management">询价管理</MenuItem>
                  <MenuItem key="saas/quote-management">报价管理</MenuItem>
                </SubMenu>
                <SubMenu
                  key="space-management"
                  title="舱位管理"
                >
                  <MenuItem key="saas/space-query">舱位查询</MenuItem>
                  <MenuItem key="saas/space-booking">舱位预订</MenuItem>
                  <MenuItem key="saas/space-statistics">舱位统计</MenuItem>
                </SubMenu>
                <MenuItem key="saas/contract-management">合约管理</MenuItem>
                <MenuItem key="saas/surcharge">附加费维护</MenuItem>
                <MenuItem key="saas/pricing-rule-management">加价规则维护</MenuItem>
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
              </SubMenu>

              {/* 船期中心 */}
              <SubMenu
                key="schedule"
                title={
                  <span>
                    <FontAwesomeIcon icon={faShip} className="mr-2" />
                    <span>船期中心</span>
                  </span>
                }
              >
                <MenuItem key="route-maintenance">航线维护</MenuItem>
                <MenuItem key="schedule-query">船期查询</MenuItem>
              </SubMenu>

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
                <MenuItem key="company-management">企业管理</MenuItem>
                <MenuItem key="role-permission-management">角色权限管理</MenuItem>
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
              <MenuItem key="application-center">
                <IconApps />
                <span>应用中心</span>
              </MenuItem>

              {/* 销售百宝箱 */}
              <SubMenu
                key="sales-toolkit"
                title={
                  <span>
                    <IconGift />
                    <span>销售百宝箱</span>
                  </span>
                }
              >
                <MenuItem key="ai-customer-acquisition">AI获客</MenuItem>
                <MenuItem key="customer-management">客户管理</MenuItem>
                <MenuItem key="contact-management">联系人</MenuItem>
                <MenuItem key="contract-management-sales">合同管理</MenuItem>
                <MenuItem key="ai-marketing">AI营销</MenuItem>
              </SubMenu>

              {/* 运营管理 */}
              <SubMenu
                key="operation-management"
                title={
                  <span>
                    <IconApps />
                    <span>运营管理</span>
                  </span>
                }
              >
                <MenuItem key="home-management">首页管理</MenuItem>
                <MenuItem key="news-management">资讯中心管理</MenuItem>
                <MenuItem key="business-management">业务介绍管理</MenuItem>
                <MenuItem key="about-management">关于我们管理</MenuItem>
              </SubMenu>

              {/* API中心 */}
              <SubMenu
                key="api-center"
                title={
                  <span>
                    <IconApps />
                    <span>API中心</span>
                  </span>
                }
              >
                <MenuItem key="api-list">API列表</MenuItem>
                <MenuItem key="api-settings">API设置</MenuItem>
              </SubMenu>

              {/* 系统设置 */}
              <SubMenu
                key="system-settings"
                title={
                  <span>
                    <IconSettings />
                    <span>系统设置</span>
                  </span>
                }
              >
                <MenuItem key="employee-management">员工管理</MenuItem>
                <MenuItem key="permission-management">权限管理</MenuItem>
                <MenuItem key="personalization-config">个性化配置</MenuItem>
                <MenuItem key="template-settings">模板设置</MenuItem>
                <MenuItem key="task-management">任务管理</MenuItem>
                <MenuItem key="business-node-settings">业务节点设置</MenuItem>
              </SubMenu>

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
                <MenuItem key="carrier-management">
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
                <MenuItem key="currency-management">
                  <span>币种管理</span>
                </MenuItem>
                <MenuItem key="exchange-rate-management">
                  <span>汇率设置</span>
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
              </SubMenu>
            </>
          )}
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
            {/* 云文件下拉框 */}
            <Dropdown
              droplist={
                <div style={{ width: 400, padding: 0, backgroundColor: '#ffffff', borderRadius: '6px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}>
                  {/* Tab头部和历史任务按钮在同一行 */}
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '12px 16px',
                    borderBottom: '1px solid #f0f0f0'
                  }}>
                    {/* 自定义Tab按钮 */}
                    <div style={{ display: 'flex', gap: '16px' }}>
                      <button
                        style={{
                          background: 'none',
                          border: 'none',
                          padding: '4px 0',
                          fontSize: '14px',
                          fontWeight: activeCloudTab === 'export' ? '500' : '400',
                          color: activeCloudTab === 'export' ? '#1890ff' : '#666',
                          borderBottom: activeCloudTab === 'export' ? '2px solid #1890ff' : 'none',
                          cursor: 'pointer'
                        }}
                        onClick={() => setActiveCloudTab('export')}
                      >
                        导出任务
                      </button>
                      <button
                        style={{
                          background: 'none',
                          border: 'none',
                          padding: '4px 0',
                          fontSize: '14px',
                          fontWeight: activeCloudTab === 'import' ? '500' : '400',
                          color: activeCloudTab === 'import' ? '#1890ff' : '#666',
                          borderBottom: activeCloudTab === 'import' ? '2px solid #1890ff' : 'none',
                          cursor: 'pointer'
                        }}
                        onClick={() => setActiveCloudTab('import')}
                      >
                        导入任务
                      </button>
                    </div>
                    
                    {/* 历史任务按钮 */}
                    <Button 
                      type="text" 
                      style={{ color: '#1890ff', fontSize: '14px' }}
                      onClick={() => {
                        // 跳转到系统设置-任务管理页面
                        navigate('/controltower/task-management');
                        setCloudFileVisible(false); // 关闭下拉框
                      }}
                    >
                      历史任务
                    </Button>
                  </div>
                  
                  {/* Tab内容区域 */}
                  <div style={{ backgroundColor: '#ffffff' }}>
                    {activeCloudTab === 'export' && (
                      <div style={{ padding: '16px' }}>
                        {exportFiles.length > 0 ? (
                          exportFiles.map(file => (
                            <div 
                              key={file.id}
                              style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                padding: '8px 0', 
                                borderBottom: '1px solid #f0f0f0',
                                position: 'relative'
                              }}
                              onMouseEnter={() => setHoveredFileId(file.id)}
                              onMouseLeave={() => setHoveredFileId(null)}
                            >
                              <div style={{ 
                                width: '24px', 
                                height: '24px', 
                                backgroundColor: '#52c41a', 
                                borderRadius: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: '12px'
                              }}>
                                <span style={{ color: 'white', fontSize: '12px', fontWeight: 'bold' }}>X</span>
                              </div>
                              <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '14px', fontWeight: '500' }}>{file.name}</div>
                                <div style={{ fontSize: '12px', color: '#999', marginTop: '2px' }}>
                                  {file.user}
                                </div>
                                <div style={{ fontSize: '12px', color: '#999' }}>{file.time}</div>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Button 
                                  type="text" 
                                  icon={<IconDownload />} 
                                  style={{ color: '#1890ff' }}
                                  onClick={() => {
                                    // 处理下载逻辑
                                    console.log('下载文件:', file.name);
                                  }}
                                />
                                <Button 
                                  type="text" 
                                  icon={<IconDelete />} 
                                  style={{ color: '#ff4d4f', marginLeft: '4px' }}
                                  onClick={() => handleDeleteFile(file.id)}
                                />
                              </div>
                            </div>
                          ))
                        ) : (
                          <div style={{ 
                            textAlign: 'center', 
                            padding: '40px 20px',
                            color: '#999'
                          }}>
                            <div style={{ 
                              width: '120px', 
                              height: '120px', 
                              margin: '0 auto 16px',
                              backgroundImage: 'url(/assets/empty.png)',
                              backgroundSize: 'contain',
                              backgroundRepeat: 'no-repeat',
                              backgroundPosition: 'center'
                            }} />
                            <div style={{ fontSize: '14px', marginBottom: '8px' }}>今日没有导出记录，您可以查看</div>
                            <Button 
                              type="text" 
                              style={{ color: '#1890ff', padding: 0 }}
                              onClick={() => {
                                console.log('查看历史导出');
                              }}
                            >
                              历史导出
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {activeCloudTab === 'import' && (
                      <div style={{ padding: '16px' }}>
                        {importFiles.length > 0 ? (
                          importFiles.map(file => (
                            <div 
                              key={file.id}
                              style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                padding: '8px 0', 
                                borderBottom: '1px solid #f0f0f0',
                                position: 'relative'
                              }}
                              onMouseEnter={() => setHoveredFileId(file.id)}
                              onMouseLeave={() => setHoveredFileId(null)}
                            >
                              <div style={{ 
                                width: '24px', 
                                height: '24px', 
                                backgroundColor: '#1890ff', 
                                borderRadius: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: '12px'
                              }}>
                                <span style={{ color: 'white', fontSize: '12px', fontWeight: 'bold' }}>I</span>
                              </div>
                              <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '14px', fontWeight: '500' }}>{file.name}</div>
                                <div style={{ fontSize: '12px', color: '#999', marginTop: '2px' }}>
                                  {file.user}
                                </div>
                                <div style={{ fontSize: '12px', color: '#999' }}>{file.time}</div>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Button 
                                  type="text" 
                                  icon={<IconEye />} 
                                  style={{ color: '#1890ff' }}
                                  onClick={() => {
                                    // 跳转到导入任务详情页面
                                    navigate(`/controltower/import-task-detail/${file.id}`);
                                    setCloudFileVisible(false); // 关闭下拉框
                                  }}
                                />
                                <Button 
                                  type="text" 
                                  icon={<IconDelete />} 
                                  style={{ color: '#ff4d4f', marginLeft: '4px' }}
                                  onClick={() => handleDeleteImportFile(file.id)}
                                />
                              </div>
                            </div>
                          ))
                        ) : (
                          <div style={{ 
                            textAlign: 'center', 
                            padding: '40px 20px',
                            color: '#999'
                          }}>
                            <div style={{ 
                              width: '120px', 
                              height: '120px', 
                              margin: '0 auto 16px',
                              backgroundImage: 'url(/assets/empty.png)',
                              backgroundSize: 'contain',
                              backgroundRepeat: 'no-repeat',
                              backgroundPosition: 'center'
                            }} />
                            <div style={{ fontSize: '14px', marginBottom: '8px' }}>今日没有导入记录，您可以查看</div>
                            <Button 
                              type="text" 
                              style={{ color: '#1890ff', padding: 0 }}
                              onClick={() => {
                                console.log('查看历史导入');
                              }}
                            >
                              历史导入
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              }
              position="br"
              trigger="click"
              popupVisible={cloudFileVisible}
              onVisibleChange={setCloudFileVisible}
            >
              <Button 
                type="text" 
                icon={<IconFile />} 
                style={{ margin: '0 8px' }}
                onClick={() => setCloudFileVisible(!cloudFileVisible)}
              />
            </Dropdown>
            <Dropdown
              droplist={
                <Menu>
                  <Menu.Item key="zh-CN">简体中文</Menu.Item>
                  <Menu.Item key="en-US">English</Menu.Item>
                  <Menu.Item key="ja-JP">日本語</Menu.Item>
                  <Menu.Item key="vi-VN">Tiếng Việt</Menu.Item>
                  <Menu.Item key="th-TH">ไทย</Menu.Item>
                </Menu>
              }
              position="br"
            >
              <Button type="text" icon={<IconLanguage />} style={{ margin: '0 8px' }} />
            </Dropdown>
            <Dropdown
              droplist={
                <Menu
                  onClickMenuItem={(key) => {
                    if (key === 'profile') {
                      navigate('/controltower/user-profile');
                    } else if (key === 'company') {
                      navigate('/controltower/company-profile');
                    } else if (key === 'logout') {
                      navigate('/portalhome');
                    }
                  }}
                >
                  <Menu.Item key="profile"><IconUser className="mr-2" />个人信息</Menu.Item>
                  <Menu.Item key="company"><IconSettingsOutline className="mr-2" />企业信息</Menu.Item>
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
        {/* 页签组件 */}
        <TabsComponent />
        <Content className="bg-gray-50 min-h-[calc(100vh-112px)] overflow-auto">
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

export default ControlTowerLayout;