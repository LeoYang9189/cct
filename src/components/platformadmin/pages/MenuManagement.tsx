import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Switch, 
  Input,
  Select,
  Message,
  Drawer,
  Form,
  Radio,
  InputNumber,
  Checkbox,
  Cascader,
  Modal,
  Tabs
} from '@arco-design/web-react';
import { 
  IconPlus, 
  IconDelete,
  IconDashboard,
  IconUser,
  IconSettings,
  IconStorage,
  IconTool,
  IconApps,
  IconSearch,
  IconRefresh,
  IconUp,
  IconDown,
  IconMore,
  IconClose
} from '@arco-design/web-react/icon';

const { Option } = Select;
const { TabPane } = Tabs;

// 菜单数据接口
interface MenuData {
  id: string;
  name: string;
  nameEn: string;
  type: string;
  icon: string;
  permission: string;
  status: boolean;
  sort: number;
  updateTime: string;
  parentId?: string;
  children?: MenuData[];
}

// 菜单类型选项
const menuTypeOptions = [
  { value: '目录', label: '目录' },
  { value: '菜单', label: '菜单' },
  { value: '按钮', label: '按钮' }
];

// 搜索筛选参数
interface SearchParams {
  menuName: string;
  nameEn: string;
  types: string[];
  permission: string;
}

// 租户菜单搜索参数
interface TenantMenuSearchParams {
  tenantId: string;
}

/**
 * 菜单管理页面组件
 * 完全复刻用户截图的界面设计
 */
const MenuManagement: React.FC = () => {
  const [expandedKeys, setExpandedKeys] = useState<(string | number)[]>([]);
  const [filteredData, setFilteredData] = useState<MenuData[]>([]);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    menuName: '',
    nameEn: '',
    types: [],
    permission: ''
  });

  // Tab切换相关状态
  const [activeTab, setActiveTab] = useState('platform');
  
  // 租户菜单相关状态
  const [tenantMenuData, setTenantMenuData] = useState<MenuData[]>([]);
  const [tenantSearchParams, setTenantSearchParams] = useState<TenantMenuSearchParams>({
    tenantId: ''
  });
  const [tenantSelectedRowKeys, setTenantSelectedRowKeys] = useState<string[]>([]);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [deleteType, setDeleteType] = useState<'single' | 'batch'>('single');
  const [deletingMenu, setDeletingMenu] = useState<MenuData | null>(null);

  // 弹窗相关状态
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('新增菜单');
  const [editingMenu, setEditingMenu] = useState<MenuData | null>(null);
  const [isTopLevel, setIsTopLevel] = useState(true);
  const [form] = Form.useForm();

  // 选择相关状态
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [tenantAuthVisible, setTenantAuthVisible] = useState(false);
  const [tenantSearchValue, setTenantSearchValue] = useState('');
  const [selectedTenants, setSelectedTenants] = useState<any[]>([]);
  const [hoveredTenantId, setHoveredTenantId] = useState<string | null>(null);

  // 模拟租户数据
  const mockTenants = [
    { id: '100', name: 'UBI Smart Parcel', code: '100' },
    { id: '1007', name: '特博国际物流(上海)有限公司', code: '1007' },
    { id: '10022', name: '测试初始化', code: '10022' },
    { id: '10052', name: '欧纬度国际物流有限公司', code: '10052' },
    { id: '10079', name: '上海港澜国际货运代理有限公司', code: '10079' },
    { id: '10088', name: '深圳市华联物流有限公司', code: '10088' },
    { id: '10099', name: '广州市天马物流有限公司', code: '10099' },
    { id: '10111', name: '北京中外运物流有限公司', code: '10111' },
    { id: '10123', name: '上海东方海外物流有限公司', code: '10123' },
    { id: '10145', name: '青岛港国际物流有限公司', code: '10145' }
  ];

  // 菜单数据，基于平台运营和控制塔的真实菜单结构
  const menuData: MenuData[] = [
    // 平台运营菜单
    {
      id: 'platform-1',
      name: '控制台',
      nameEn: 'Dashboard',
      type: '目录',
      icon: 'dashboard',
      permission: 'platform:dashboard',
      status: true,
      sort: 0,
      updateTime: '2024-01-15 10:30:25',
      children: [
        {
          id: 'platform-1-1',
          name: '数据概览',
          nameEn: 'Data Overview',
          type: '菜单',
          icon: 'chart',
          permission: 'platform:dashboard:overview',
          status: true,
          sort: 0,
          updateTime: '2024-01-15 10:30:25',
          parentId: 'platform-1'
        }
      ]
    },
    {
      id: 'platform-2',
      name: '客商中心',
      nameEn: 'Customer Center',
      type: '目录',
      icon: 'user',
      permission: 'platform:customer',
      status: true,
      sort: 1,
      updateTime: '2024-01-15 10:30:25',
      children: [
        {
          id: 'platform-2-1',
          name: '用户管理',
          nameEn: 'User Management',
          type: '菜单',
          icon: 'user',
          permission: 'platform:user:manage',
          status: true,
          sort: 0,
          updateTime: '2024-01-15 10:30:25',
          parentId: 'platform-2'
        },
        {
          id: 'platform-2-2',
          name: '企业管理',
          nameEn: 'Company Management',
          type: '菜单',
          icon: 'user',
          permission: 'platform:company:manage',
          status: true,
          sort: 1,
          updateTime: '2024-01-15 10:30:25',
          parentId: 'platform-2'
        }
      ]
    },
    {
      id: 'platform-3',
      name: '运营管理',
      nameEn: 'Operation Management',
      type: '目录',
      icon: 'apps',
      permission: 'platform:operation',
      status: true,
      sort: 2,
      updateTime: '2024-01-15 10:30:25',
      children: [
        {
          id: 'platform-3-1',
          name: '首页管理',
          nameEn: 'Home Management',
          type: '菜单',
          icon: 'apps',
          permission: 'platform:home:manage',
          status: true,
          sort: 0,
          updateTime: '2024-01-15 10:30:25',
          parentId: 'platform-3'
        },
        {
          id: 'platform-3-2',
          name: '资讯中心管理',
          nameEn: 'News Management',
          type: '菜单',
          icon: 'article',
          permission: 'platform:news:manage',
          status: true,
          sort: 1,
          updateTime: '2024-01-15 10:30:25',
          parentId: 'platform-3'
        },
        {
          id: 'platform-3-3',
          name: '业务介绍管理',
          nameEn: 'Business Management',
          type: '菜单',
          icon: 'apps',
          permission: 'platform:business:manage',
          status: true,
          sort: 2,
          updateTime: '2024-01-15 10:30:25',
          parentId: 'platform-3'
        },
        {
          id: 'platform-3-4',
          name: '关于我们管理',
          nameEn: 'About Management',
          type: '菜单',
          icon: 'apps',
          permission: 'platform:about:manage',
          status: true,
          sort: 3,
          updateTime: '2024-01-15 10:30:25',
          parentId: 'platform-3'
        }
      ]
    },
    {
      id: 'platform-4',
      name: '产品中心',
      nameEn: 'Product Center',
      type: '目录',
      icon: 'apps',
      permission: 'platform:product',
      status: true,
      sort: 3,
      updateTime: '2024-01-15 10:30:25',
      children: [
        {
          id: 'platform-4-1',
          name: '产品管理',
          nameEn: 'Product Management',
          type: '菜单',
          icon: 'apps',
          permission: 'platform:product:manage',
          status: true,
          sort: 0,
          updateTime: '2024-01-15 10:30:25',
          parentId: 'platform-4'
        },
        {
          id: 'platform-4-2',
          name: '版本管理',
          nameEn: 'Version Management',
          type: '菜单',
          icon: 'apps',
          permission: 'platform:version:manage',
          status: true,
          sort: 1,
          updateTime: '2024-01-15 10:30:25',
          parentId: 'platform-4'
        }
      ]
    },
    {
      id: 'platform-5',
      name: '基础资料维护',
      nameEn: 'Basic Data Maintenance',
      type: '目录',
      icon: 'storage',
      permission: 'platform:basic:data',
      status: true,
      sort: 4,
      updateTime: '2024-01-15 10:30:25',
      children: [
        {
          id: 'platform-5-1',
          name: '港口管理',
          nameEn: 'Port Management',
          type: '菜单',
          icon: 'storage',
          permission: 'platform:port:manage',
          status: true,
          sort: 0,
          updateTime: '2024-01-15 10:30:25',
          parentId: 'platform-5'
        },
        {
          id: 'platform-5-2',
          name: '承运人管理',
          nameEn: 'Carrier Management',
          type: '菜单',
          icon: 'storage',
          permission: 'platform:carrier:manage',
          status: true,
          sort: 1,
          updateTime: '2024-01-15 10:30:25',
          parentId: 'platform-5'
        },
        {
          id: 'platform-5-3',
          name: '国家（地区）',
          nameEn: 'Country/Region',
          type: '菜单',
          icon: 'storage',
          permission: 'platform:country:manage',
          status: true,
          sort: 2,
          updateTime: '2024-01-15 10:30:25',
          parentId: 'platform-5'
        },
        {
          id: 'platform-5-4',
          name: '行政区划',
          nameEn: 'Administrative Division',
          type: '菜单',
          icon: 'storage',
          permission: 'platform:admin:division',
          status: true,
          sort: 3,
          updateTime: '2024-01-15 10:30:25',
          parentId: 'platform-5'
        },
        {
          id: 'platform-5-5',
          name: '海外仓库',
          nameEn: 'Overseas Warehouse',
          type: '菜单',
          icon: 'storage',
          permission: 'platform:warehouse:manage',
          status: true,
          sort: 4,
          updateTime: '2024-01-15 10:30:25',
          parentId: 'platform-5'
        }
      ]
    },

    // 控制塔菜单
    {
      id: 'controltower-1',
      name: 'BI统计分析',
      nameEn: 'BI Analytics',
      type: '菜单',
      icon: 'dashboard',
      permission: 'controltower:bi:analytics',
      status: true,
      sort: 5,
      updateTime: '2024-01-15 10:30:25',
      children: []
    },
    {
      id: 'controltower-2',
      name: '超级运价',
      nameEn: 'Super Freight',
      type: '目录',
      icon: 'article',
      permission: 'controltower:super:freight',
      status: true,
      sort: 6,
      updateTime: '2024-01-15 10:30:25',
      children: [
        {
          id: 'controltower-2-1',
          name: '运价维护',
          nameEn: 'Rate Maintenance',
          type: '菜单',
          icon: 'article',
          permission: 'controltower:rate:maintenance',
          status: true,
          sort: 0,
          updateTime: '2024-01-15 10:30:25',
          parentId: 'controltower-2'
        },
        {
          id: 'controltower-2-2',
          name: '运价查询',
          nameEn: 'Rate Query',
          type: '菜单',
          icon: 'article',
          permission: 'controltower:rate:query',
          status: true,
          sort: 1,
          updateTime: '2024-01-15 10:30:25',
          parentId: 'controltower-2'
        },
        {
          id: 'controltower-2-3',
          name: '询价报价',
          nameEn: 'Inquiry Quote',
          type: '目录',
          icon: 'article',
          permission: 'controltower:inquiry:quote',
          status: true,
          sort: 2,
          updateTime: '2024-01-15 10:30:25',
          parentId: 'controltower-2',
          children: [
            {
              id: 'controltower-2-3-1',
              name: '询价管理',
              nameEn: 'Inquiry Management',
              type: '菜单',
              icon: 'article',
              permission: 'controltower:inquiry:manage',
              status: true,
              sort: 0,
              updateTime: '2024-01-15 10:30:25',
              parentId: 'controltower-2-3'
            },
            {
              id: 'controltower-2-3-2',
              name: '报价管理',
              nameEn: 'Quote Management',
              type: '菜单',
              icon: 'article',
              permission: 'controltower:quote:manage',
              status: true,
              sort: 1,
              updateTime: '2024-01-15 10:30:25',
              parentId: 'controltower-2-3'
            }
          ]
        },
        {
          id: 'controltower-2-4',
          name: '舱位管理',
          nameEn: 'Space Management',
          type: '目录',
          icon: 'article',
          permission: 'controltower:space:management',
          status: true,
          sort: 3,
          updateTime: '2024-01-15 10:30:25',
          parentId: 'controltower-2',
          children: [
            {
              id: 'controltower-2-4-1',
              name: '舱位查询',
              nameEn: 'Space Query',
              type: '菜单',
              icon: 'article',
              permission: 'controltower:space:query',
              status: true,
              sort: 0,
              updateTime: '2024-01-15 10:30:25',
              parentId: 'controltower-2-4'
            },
            {
              id: 'controltower-2-4-2',
              name: '舱位预订',
              nameEn: 'Space Booking',
              type: '菜单',
              icon: 'article',
              permission: 'controltower:space:booking',
              status: true,
              sort: 1,
              updateTime: '2024-01-15 10:30:25',
              parentId: 'controltower-2-4'
            }
          ]
        }
      ]
    },
    {
      id: 'controltower-3',
      name: '订单中心',
      nameEn: 'Order Center',
      type: '目录',
      icon: 'list',
      permission: 'controltower:order',
      status: true,
      sort: 7,
      updateTime: '2024-01-15 10:30:25',
      children: [
        {
          id: 'controltower-3-1',
          name: '订单管理',
          nameEn: 'Order Management',
          type: '菜单',
          icon: 'list',
          permission: 'controltower:order:manage',
          status: true,
          sort: 0,
          updateTime: '2024-01-15 10:30:25',
          parentId: 'controltower-3'
        }
      ]
    },
    {
      id: 'controltower-4',
      name: '船期中心',
      nameEn: 'Schedule Center',
      type: '目录',
      icon: 'article',
      permission: 'controltower:schedule',
      status: true,
      sort: 8,
      updateTime: '2024-01-15 10:30:25',
      children: [
        {
          id: 'controltower-4-1',
          name: '航线维护',
          nameEn: 'Route Maintenance',
          type: '菜单',
          icon: 'article',
          permission: 'controltower:route:maintenance',
          status: true,
          sort: 0,
          updateTime: '2024-01-15 10:30:25',
          parentId: 'controltower-4'
        },
        {
          id: 'controltower-4-2',
          name: '船期查询',
          nameEn: 'Schedule Query',
          type: '菜单',
          icon: 'article',
          permission: 'controltower:schedule:query',
          status: true,
          sort: 1,
          updateTime: '2024-01-15 10:30:25',
          parentId: 'controltower-4'
        }
      ]
    },
    {
      id: 'controltower-5',
      name: '客商中心',
      nameEn: 'Customer Center',
      type: '目录',
      icon: 'user',
      permission: 'controltower:customer',
      status: true,
      sort: 9,
      updateTime: '2024-01-15 10:30:25',
      children: [
        {
          id: 'controltower-5-1',
          name: '用户管理',
          nameEn: 'User Management',
          type: '菜单',
          icon: 'user',
          permission: 'controltower:user:manage',
          status: true,
          sort: 0,
          updateTime: '2024-01-15 10:30:25',
          parentId: 'controltower-5'
        },
        {
          id: 'controltower-5-2',
          name: '企业管理',
          nameEn: 'Company Management',
          type: '菜单',
          icon: 'user',
          permission: 'controltower:company:manage',
          status: true,
          sort: 1,
          updateTime: '2024-01-15 10:30:25',
          parentId: 'controltower-5'
        }
      ]
    },
    {
      id: 'controltower-6',
      name: '系统设置',
      nameEn: 'System Settings',
      type: '目录',
      icon: 'settings',
      permission: 'controltower:system:settings',
      status: true,
      sort: 10,
      updateTime: '2024-01-15 10:30:25',
      children: [
        {
          id: 'controltower-6-1',
          name: '员工管理',
          nameEn: 'Employee Management',
          type: '菜单',
          icon: 'settings',
          permission: 'controltower:employee:manage',
          status: true,
          sort: 0,
          updateTime: '2024-01-15 10:30:25',
          parentId: 'controltower-6'
        },
        {
          id: 'controltower-6-2',
          name: '权限管理',
          nameEn: 'Permission Management',
          type: '菜单',
          icon: 'settings',
          permission: 'controltower:permission:manage',
          status: true,
          sort: 1,
          updateTime: '2024-01-15 10:30:25',
          parentId: 'controltower-6'
        }
      ]
    },
    {
      id: 'controltower-7',
      name: '基础资料维护',
      nameEn: 'Basic Data Maintenance',
      type: '目录',
      icon: 'storage',
      permission: 'controltower:basic:data',
      status: true,
      sort: 11,
      updateTime: '2024-01-15 10:30:25',
      children: [
        {
          id: 'controltower-7-1',
          name: '港口管理',
          nameEn: 'Port Management',
          type: '菜单',
          icon: 'storage',
          permission: 'controltower:port:manage',
          status: true,
          sort: 0,
          updateTime: '2024-01-15 10:30:25',
          parentId: 'controltower-7'
        },
        {
          id: 'controltower-7-2',
          name: '承运人管理',
          nameEn: 'Carrier Management',
          type: '菜单',
          icon: 'storage',
          permission: 'controltower:carrier:manage',
          status: true,
          sort: 1,
          updateTime: '2024-01-15 10:30:25',
          parentId: 'controltower-7'
        },
        {
          id: 'controltower-7-3',
          name: '国家（地区）',
          nameEn: 'Country/Region',
          type: '菜单',
          icon: 'storage',
          permission: 'controltower:country:manage',
          status: true,
          sort: 2,
          updateTime: '2024-01-15 10:30:25',
          parentId: 'controltower-7'
        },
        {
          id: 'controltower-7-4',
          name: '行政区划',
          nameEn: 'Administrative Division',
          type: '菜单',
          icon: 'storage',
          permission: 'controltower:admin:division',
          status: true,
          sort: 3,
          updateTime: '2024-01-15 10:30:25',
          parentId: 'controltower-7'
        },
        {
          id: 'controltower-7-5',
          name: '海外仓库',
          nameEn: 'Overseas Warehouse',
          type: '菜单',
          icon: 'storage',
          permission: 'controltower:warehouse:manage',
          status: true,
          sort: 4,
          updateTime: '2024-01-15 10:30:25',
          parentId: 'controltower-7'
        }
      ]
    }
  ];

  // 初始化数据
  useEffect(() => {
    setFilteredData(menuData);
    // 默认展开第一层
    setExpandedKeys(menuData.map(item => item.id));
  }, []);

  /**
   * 搜索筛选功能
   */
  const handleSearch = () => {
    const filterTreeData = (data: MenuData[], searchParams: SearchParams): MenuData[] => {
      return data.reduce((acc: MenuData[], item) => {
        // 检查当前项是否匹配
        let matches = true;

        // 菜单名称搜索
        if (searchParams.menuName) {
          const keyword = searchParams.menuName.toLowerCase();
          matches = matches && item.name.toLowerCase().includes(keyword);
        }

        // 英文名搜索
        if (searchParams.nameEn) {
          const keyword = searchParams.nameEn.toLowerCase();
          matches = matches && item.nameEn.toLowerCase().includes(keyword);
        }

        // 类型筛选
        if (searchParams.types.length > 0) {
          matches = matches && searchParams.types.includes(item.type);
        }

        // 权限标志搜索
        if (searchParams.permission) {
          const keyword = searchParams.permission.toLowerCase();
          matches = matches && item.permission.toLowerCase().includes(keyword);
        }

        // 递归处理子项
        const filteredChildren = item.children ? filterTreeData(item.children, searchParams) : [];

        // 如果当前项匹配或有匹配的子项，则包含当前项
        if (matches || filteredChildren.length > 0) {
          acc.push({
            ...item,
            children: filteredChildren.length > 0 ? filteredChildren : item.children
          });
        }

        return acc;
      }, []);
    };

    const filtered = filterTreeData(menuData, searchParams);
    setFilteredData(filtered);
  };

  /**
   * 重置搜索
   */
  const handleReset = () => {
    setSearchParams({
      menuName: '',
      nameEn: '',
      types: [],
      permission: ''
    });
    setFilteredData(menuData);
  };

  /**
   * 展开全部
   */
  const expandAll = () => {
    const getAllKeys = (data: MenuData[]): (string | number)[] => {
      return data.reduce((keys: (string | number)[], item) => {
        keys.push(item.id);
        if (item.children) {
          keys.push(...getAllKeys(item.children));
        }
        return keys;
      }, []);
    };
    setExpandedKeys(getAllKeys(filteredData));
  };

  /**
   * 收起全部
   */
  const collapseAll = () => {
    setExpandedKeys([]);
  };

  /**
   * 处理排序调整
   * @param record 当前行数据
   * @param direction 调整方向 up/down
   */
  const handleSortChange = (record: MenuData, direction: 'up' | 'down') => {
    const newSort = direction === 'up' ? record.sort + 1 : record.sort - 1;
    console.log(`调整排序: ${record.name} ${direction === 'up' ? '上移' : '下移'} 到 ${newSort}`);
    Message.success(`${record.name} 排序已${direction === 'up' ? '上移' : '下移'}`);
    // 这里可以调用API更新排序
  };

  /**
   * 获取图标组件
   * @param iconName 图标名称
   * @returns React图标组件
   */
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'dashboard':
        return <IconDashboard />;
      case 'chart':
        return <IconDashboard />;
      case 'article':
        return <IconApps />;
      case 'user':
        return <IconUser />;
      case 'tool':
        return <IconTool />;
      case 'apps':
        return <IconApps />;
      case 'storage':
        return <IconStorage />;
      case 'settings':
        return <IconSettings />;
      case 'list':
        return <IconApps />;
      case 'index.console':
        return <IconDashboard />;
      default:
        return <IconMore />;
    }
  };

  /**
   * 处理状态切换
   * @param checked 开关状态
   * @param record 当前行数据
   */
  const handleStatusChange = (checked: boolean, record: MenuData) => {
    console.log('状态切换:', checked, record);
    Message.success(`${record.name} 状态已${checked ? '启用' : '禁用'}`);
    // 这里可以调用API更新状态
  };

  /**
   * 处理新增菜单
   */
  const handleAdd = () => {
    setModalTitle('新增菜单');
    setEditingMenu(null);
    setIsTopLevel(true);
    form.resetFields();
    form.setFieldsValue({
      type: '目录',
      isTopLevel: true,
      status: true,
      sort: 0
    });
    setModalVisible(true);
  };

  /**
   * 处理编辑菜单
   * @param record 当前行数据
   */
  const handleEdit = (record: MenuData) => {
    setModalTitle('编辑菜单');
    setEditingMenu(record);
    const isTop = !record.parentId;
    setIsTopLevel(isTop);
    form.setFieldsValue({
      type: record.type,
      isTopLevel: isTop,
      parentId: record.parentId ? [record.parentId] : undefined,
      name: record.name,
      nameEn: record.nameEn,
      icon: record.icon,
      path: record.permission,
      permission: record.permission,
      status: record.status,
      sort: record.sort
    });
    setModalVisible(true);
  };

  /**
   * 处理删除菜单
   * @param record 当前行数据
   */
  const handleDelete = (record: MenuData) => {
    console.log('删除菜单:', record);
    Message.success(`${record.name} 已删除`);
    // 这里可以调用删除API
  };

  /**
   * 获取所有菜单ID（包括子菜单）
   */
  const getAllMenuIds = (data: MenuData[]): string[] => {
    const ids: string[] = [];
    const traverse = (items: MenuData[]) => {
      items.forEach(item => {
        ids.push(item.id);
        if (item.children) {
          traverse(item.children);
        }
      });
    };
    traverse(data);
    return ids;
  };

  /**
   * 获取菜单及其所有子菜单ID
   */
  const getMenuWithChildrenIds = (menuId: string, data: MenuData[]): string[] => {
    const ids: string[] = [];
    const findMenu = (items: MenuData[]): MenuData | null => {
      for (const item of items) {
        if (item.id === menuId) {
          return item;
        }
        if (item.children) {
          const found = findMenu(item.children);
          if (found) return found;
        }
      }
      return null;
    };
    
    const menu = findMenu(data);
    if (menu) {
      ids.push(menu.id);
      if (menu.children) {
        ids.push(...getAllMenuIds(menu.children));
      }
    }
    return ids;
  };

  /**
   * 处理行选择
   */
  const handleRowSelect = (selected: boolean, record: MenuData) => {
    const menuIds = getMenuWithChildrenIds(record.id, filteredData);
    
    if (selected) {
      setSelectedRowKeys(prev => [...new Set([...prev, ...menuIds])]);
    } else {
      setSelectedRowKeys(prev => prev.filter(id => !menuIds.includes(id)));
    }
  };

  /**
   * 处理全选
   */
  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      const allIds = getAllMenuIds(filteredData);
      setSelectedRowKeys(allIds);
    } else {
      setSelectedRowKeys([]);
    }
  };

  /**
   * 处理租户授权
   */
  const handleTenantAuth = () => {
    if (selectedRowKeys.length === 0) {
      Message.warning('请先选择要授权的菜单');
      return;
    }
    setTenantAuthVisible(true);
  };

  /**
   * Tab切换处理
   */
  const handleTabChange = (key: string) => {
    setActiveTab(key);
    // 切换时重置相关状态
    if (key === 'platform') {
      setSelectedRowKeys([]);
    } else {
      setTenantSelectedRowKeys([]);
      setTenantMenuData([]);
    }
  };

  /**
   * 租户菜单搜索
   */
  const handleTenantMenuSearch = () => {
    if (!tenantSearchParams.tenantId) {
      Message.warning('请选择租户');
      return;
    }
    
    // 模拟API调用获取租户菜单数据
    setTimeout(() => {
      // 这里应该根据租户ID获取对应的菜单数据
      // 为了演示，我们使用部分菜单数据
      const tenantMenus = menuData.slice(0, 3).map(menu => ({
        ...menu,
        id: `tenant-${menu.id}`,
        children: menu.children?.map(child => ({
          ...child,
          id: `tenant-${child.id}`,
          parentId: `tenant-${menu.id}`
        }))
      }));
      
      setTenantMenuData(tenantMenus);
      Message.success('查询成功');
    }, 1000);
  };

  /**
   * 重置租户菜单搜索
   */
  const handleTenantMenuReset = () => {
    setTenantSearchParams({ tenantId: '' });
    setTenantMenuData([]);
    setTenantSelectedRowKeys([]);
  };

  /**
   * 处理租户菜单删除（单个）
   */
  const handleTenantMenuDelete = (record: MenuData) => {
    setDeleteType('single');
    setDeletingMenu(record);
    setDeleteConfirmVisible(true);
  };

  /**
   * 处理租户菜单批量删除
   */
  const handleTenantMenuBatchDelete = () => {
    if (tenantSelectedRowKeys.length === 0) {
      Message.warning('请先选择要删除的菜单');
      return;
    }
    setDeleteType('batch');
    setDeletingMenu(null);
    setDeleteConfirmVisible(true);
  };

  /**
   * 确认删除租户菜单
   */
  const handleConfirmDelete = () => {
    if (deleteType === 'single' && deletingMenu) {
      Message.success(`${deletingMenu.name} 已删除`);
      // 从租户菜单数据中移除
      const removeFromData = (data: MenuData[], targetId: string): MenuData[] => {
        return data.filter(item => {
          if (item.id === targetId) {
            return false;
          }
          if (item.children) {
            item.children = removeFromData(item.children, targetId);
          }
          return true;
        });
      };
      setTenantMenuData(prev => removeFromData(prev, deletingMenu.id));
    } else if (deleteType === 'batch') {
      Message.success(`已删除 ${tenantSelectedRowKeys.length} 个菜单`);
      // 批量删除逻辑
      const removeMultipleFromData = (data: MenuData[], targetIds: string[]): MenuData[] => {
        return data.filter(item => {
          if (targetIds.includes(item.id)) {
            return false;
          }
          if (item.children) {
            item.children = removeMultipleFromData(item.children, targetIds);
          }
          return true;
        });
      };
      setTenantMenuData(prev => removeMultipleFromData(prev, tenantSelectedRowKeys));
      setTenantSelectedRowKeys([]);
    }
    
    setDeleteConfirmVisible(false);
    setDeletingMenu(null);
  };

  /**
   * 取消删除
   */
  const handleCancelDelete = () => {
    setDeleteConfirmVisible(false);
    setDeletingMenu(null);
  };

  /**
   * 处理租户菜单行选择
   */
  const handleTenantRowSelect = (selected: boolean, record: MenuData) => {
    const menuIds = getMenuWithChildrenIds(record.id, tenantMenuData);
    
    if (selected) {
      setTenantSelectedRowKeys(prev => [...new Set([...prev, ...menuIds])]);
    } else {
      setTenantSelectedRowKeys(prev => prev.filter(id => !menuIds.includes(id)));
    }
  };

  /**
   * 处理租户菜单全选
   */
  const handleTenantSelectAll = (selected: boolean) => {
    if (selected) {
      const allIds = getAllMenuIds(tenantMenuData);
      setTenantSelectedRowKeys(allIds);
    } else {
      setTenantSelectedRowKeys([]);
    }
  };

  /**
   * 获取过滤后的租户列表
   */
  const getFilteredTenants = () => {
    if (!tenantSearchValue) return mockTenants;
    return mockTenants.filter(tenant => 
      tenant.name.toLowerCase().includes(tenantSearchValue.toLowerCase()) ||
      tenant.code.includes(tenantSearchValue)
    );
  };

  /**
   * 添加租户到选择列表
   */
  const handleAddTenant = (tenant: any) => {
    if (!selectedTenants.find(t => t.id === tenant.id)) {
      setSelectedTenants(prev => [...prev, tenant]);
    }
    setTenantSearchValue('');
  };

  /**
   * 移除选中的租户
   */
  const handleRemoveTenant = (tenantId: string) => {
    setSelectedTenants(prev => prev.filter(t => t.id !== tenantId));
  };

  /**
   * 处理租户授权确认
   */
  const handleTenantAuthOk = () => {
    if (selectedTenants.length === 0) {
      Message.warning('请选择要授权的租户');
      return;
    }
    
    console.log('租户授权菜单:', selectedRowKeys);
    console.log('授权给租户:', selectedTenants);
    
    Message.success(`已将 ${selectedRowKeys.length} 个菜单授权给 ${selectedTenants.length} 个租户`);
    setTenantAuthVisible(false);
    setSelectedRowKeys([]);
    setSelectedTenants([]);
    setTenantSearchValue('');
    setHoveredTenantId(null);
  };

  /**
   * 处理租户授权取消
   */
  const handleTenantAuthCancel = () => {
    setTenantAuthVisible(false);
    setSelectedTenants([]);
    setTenantSearchValue('');
    setHoveredTenantId(null);
  };

  /**
   * 获取父级菜单选项（级联结构）
   */
  const getParentMenuOptions = () => {
    const buildCascaderOptions = (data: MenuData[]): any[] => {
      return data.map(item => {
        if (item.type === '目录') {
          const option: any = {
            label: item.name,
            value: item.id
          };
          
          if (item.children && item.children.some(child => child.type === '目录')) {
            option.children = buildCascaderOptions(item.children.filter(child => child.type === '目录'));
          }
          
          return option;
        }
        return null;
      }).filter(Boolean);
    };
    
    return buildCascaderOptions(menuData);
  };

  /**
   * 处理弹窗确认
   */
  const handleModalOk = async () => {
    try {
      const values = await form.validate();
      
      // 处理表单数据
      const formData = {
        ...values,
        isTopLevel: isTopLevel,
        parentId: isTopLevel ? null : values.parentId,
        nameEn: values.nameEn,
        permission: values.permission,
        sort: values.sort || 0,
        status: values.status !== undefined ? values.status : true
      };

      console.log('表单数据:', formData);
      
      // 这里可以调用API保存数据
      // await saveMenuData(formData);
      
      Message.success(editingMenu ? '编辑菜单成功' : '新增菜单成功');
      setModalVisible(false);
      form.resetFields();
      setEditingMenu(null);
      setIsTopLevel(false);
      
      // 重新加载数据
      // await loadMenuData();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  /**
   * 处理弹窗取消
   */
  const handleModalCancel = () => {
    setModalVisible(false);
    form.resetFields();
    setEditingMenu(null);
    setIsTopLevel(false);
  };

  // 表格列配置
  const columns = [
    {
      title: '菜单名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      fixed: 'left' as const,
      render: (text: string) => (
        <span>{text}</span>
      ),
    },
    {
      title: '图标',
      dataIndex: 'icon',
      key: 'icon',
      width: 60,
      render: (iconName: string) => (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {getIcon(iconName)}
        </div>
      ),
    },
    {
      title: '英文名',
      dataIndex: 'nameEn',
      key: 'nameEn',
      width: 150,
    },
    {
      title: '节点ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: '父节点ID',
      dataIndex: 'parentId',
      key: 'parentId',
      width: 100,
      render: (text: string) => text || '-',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (text: string) => {
        const typeMap: { [key: string]: string } = {
          'directory': '目录',
          'menu': '菜单',
          'button': '按钮'
        };
        return typeMap[text] || text;
      },
    },
    {
      title: '权限标识',
      dataIndex: 'permission',
      key: 'permission',
      width: 150,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: boolean, record: MenuData) => (
        <Switch
          checked={status}
          onChange={(checked) => handleStatusChange(checked, record)}
          size="small"
        />
      ),
    },
    {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
      width: 120,
      render: (sort: number, record: MenuData) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Button
            type="text"
            size="mini"
            icon={<IconUp />}
            onClick={() => handleSortChange(record, 'up')}
            style={{ padding: '2px 4px' }}
          />
          <span style={{ minWidth: '20px', textAlign: 'center' }}>{sort}</span>
          <Button
            type="text"
            size="mini"
            icon={<IconDown />}
            onClick={() => handleSortChange(record, 'down')}
            style={{ padding: '2px 4px' }}
          />
        </div>
      ),
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      width: 150,
      render: (time: string) => {
        const [date, timeStr] = time.split(' ');
        return (
          <div style={{ lineHeight: '1.2' }}>
            <div>{date}</div>
            <div style={{ color: '#86909c', fontSize: '12px' }}>{timeStr}</div>
          </div>
        );
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right' as const,
      render: (_: any, record: MenuData) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button
            type="text"
            size="small"
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button
            type="text"
            size="small"
            status="danger"
            onClick={() => handleDelete(record)}
          >
            删除
          </Button>
        </div>
      ),
    },
  ];

  // 租户菜单表格列配置
  const tenantMenuColumns = [
    {
      title: '菜单名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      fixed: 'left' as const,
      render: (text: string) => (
        <span>{text}</span>
      ),
    },
    {
      title: '图标',
      dataIndex: 'icon',
      key: 'icon',
      width: 60,
      render: (iconName: string) => (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {getIcon(iconName)}
        </div>
      ),
    },
    {
      title: '英文名',
      dataIndex: 'nameEn',
      key: 'nameEn',
      width: 150,
    },
    {
      title: '节点ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: '父节点ID',
      dataIndex: 'parentId',
      key: 'parentId',
      width: 100,
      render: (text: string) => text || '-',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (text: string) => {
        const typeMap: { [key: string]: string } = {
          'directory': '目录',
          'menu': '菜单',
          'button': '按钮'
        };
        return typeMap[text] || text;
      },
    },
    {
      title: '权限标识',
      dataIndex: 'permission',
      key: 'permission',
      width: 150,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: boolean, record: MenuData) => (
        <Switch
          checked={status}
          onChange={(checked) => handleStatusChange(checked, record)}
          size="small"
        />
      ),
    },
    {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
      width: 120,
      render: (sort: number, record: MenuData) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Button
            type="text"
            size="mini"
            icon={<IconUp />}
            onClick={() => handleSortChange(record, 'up')}
            style={{ padding: '2px 4px' }}
          />
          <span style={{ minWidth: '20px', textAlign: 'center' }}>{sort}</span>
          <Button
            type="text"
            size="mini"
            icon={<IconDown />}
            onClick={() => handleSortChange(record, 'down')}
            style={{ padding: '2px 4px' }}
          />
        </div>
      ),
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      width: 150,
      render: (time: string) => {
        const [date, timeStr] = time.split(' ');
        return (
          <div style={{ lineHeight: '1.2' }}>
            <div>{date}</div>
            <div style={{ color: '#86909c', fontSize: '12px' }}>{timeStr}</div>
          </div>
        );
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      fixed: 'right' as const,
      render: (_: any, record: MenuData) => (
        <Button
          type="text"
          size="small"
          status="danger"
          onClick={() => handleTenantMenuDelete(record)}
        >
          删除
        </Button>
      ),
    },
  ];

  return (
    <div className="menu-management">
      <div className="page-header">
        <h2>菜单管理</h2>
      </div>

      {/* Tab切换 */}
      <Tabs activeTab={activeTab} onChange={handleTabChange} type="line">
        <TabPane key="platform" title="平台菜单">
          {/* 搜索筛选区域 */}
          <div className="filter-section">
            <div className="filter-row">
              <div className="filter-item">
                <label>关键词搜索</label>
                <Input
                  placeholder="菜单名称（中文/英文）"
                  value={searchParams.menuName}
                  onChange={(value) => setSearchParams(prev => ({ ...prev, menuName: value }))}
                  style={{ width: 200 }}
                />
              </div>
              <div className="filter-item">
                <label>英文名</label>
                <Input
                  placeholder="英文名"
                  value={searchParams.nameEn}
                  onChange={(value) => setSearchParams(prev => ({ ...prev, nameEn: value }))}
                  style={{ width: 200 }}
                />
              </div>
              <div className="filter-item">
                <label>类型</label>
                <Select
                  placeholder="选择类型"
                  value={searchParams.types}
                  onChange={(value) => setSearchParams(prev => ({ ...prev, types: value }))}
                  mode="multiple"
                  style={{ width: 200 }}
                  maxTagCount={2}
                >
                  {menuTypeOptions.map(option => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </div>
              <div className="filter-item">
                <label>权限标志</label>
                <Input
                  placeholder="权限标志"
                  value={searchParams.permission}
                  onChange={(value) => setSearchParams(prev => ({ ...prev, permission: value }))}
                  style={{ width: 200 }}
                />
              </div>
              <div className="filter-actions">
                <Button type="primary" icon={<IconSearch />} onClick={handleSearch}>
                  搜索
                </Button>
                <Button icon={<IconRefresh />} onClick={handleReset}>
                  重置
                </Button>
              </div>
            </div>
          </div>

          {/* 操作按钮行 */}
          <div className="action-bar">
            <div className="action-left">
              <Button type="primary" icon={<IconPlus />} onClick={handleAdd}>
                新增菜单
              </Button>
              <Button 
                type="outline" 
                onClick={handleTenantAuth}
                disabled={selectedRowKeys.length === 0}
              >
                租户授权
              </Button>
            </div>
            <div className="action-right">
              <Button 
                type="secondary" 
                size="small"
                onClick={expandAll}
                style={{ 
                  backgroundColor: '#f2f3f5', 
                  border: '1px solid #e5e6eb',
                  color: '#4e5969'
                }}
              >
                展开全部
              </Button>
              <Button 
                type="secondary" 
                size="small"
                onClick={collapseAll}
                style={{ 
                  backgroundColor: '#f2f3f5', 
                  border: '1px solid #e5e6eb',
                  color: '#4e5969'
                }}
              >
                收起全部
              </Button>
            </div>
          </div>

          {/* 表格 */}
          <Table
            columns={columns}
            data={filteredData}
            rowKey="id"
            pagination={false}
            expandedRowKeys={expandedKeys}
            onExpandedRowsChange={setExpandedKeys}
            childrenColumnName="children"
            scroll={{ x: 1200 }}
            rowSelection={{
              type: 'checkbox',
              selectedRowKeys,
              onSelect: handleRowSelect,
              onSelectAll: handleSelectAll,
              checkStrictly: false
            }}
          />
        </TabPane>

        <TabPane key="tenant" title="租户菜单">
          {/* 租户菜单搜索筛选区域 */}
          <div className="filter-section">
            <div className="filter-row tenant-filter-row">
              <div className="filter-item">
                <label>租户</label>
                <Select
                  placeholder="请选择租户"
                  value={tenantSearchParams.tenantId}
                  onChange={(value) => setTenantSearchParams(prev => ({ ...prev, tenantId: value }))}
                  style={{ width: 300 }}
                  showSearch
                >
                  {mockTenants.map(tenant => (
                    <Option key={tenant.id} value={tenant.id}>
                      {tenant.code} - {tenant.name}
                    </Option>
                  ))}
                </Select>
              </div>
              <div className="filter-actions">
                <Button type="primary" icon={<IconSearch />} onClick={handleTenantMenuSearch}>
                  查询
                </Button>
                <Button icon={<IconRefresh />} onClick={handleTenantMenuReset}>
                  重置
                </Button>
              </div>
            </div>
          </div>

          {/* 租户菜单操作按钮行 */}
          <div className="action-bar">
            <div className="action-left">
              <Button 
                type="primary" 
                icon={<IconDelete />} 
                onClick={handleTenantMenuBatchDelete}
                disabled={tenantSelectedRowKeys.length === 0}
                status="danger"
              >
                批量删除
              </Button>
            </div>
            <div className="action-right">
              <Button 
                type="secondary" 
                size="small"
                onClick={expandAll}
                style={{ 
                  backgroundColor: '#f2f3f5', 
                  border: '1px solid #e5e6eb',
                  color: '#4e5969'
                }}
              >
                展开全部
              </Button>
              <Button 
                type="secondary" 
                size="small"
                onClick={collapseAll}
                style={{ 
                  backgroundColor: '#f2f3f5', 
                  border: '1px solid #e5e6eb',
                  color: '#4e5969'
                }}
              >
                收起全部
              </Button>
            </div>
          </div>

          {/* 租户菜单表格 */}
          <Table
            columns={tenantMenuColumns}
            data={tenantMenuData}
            rowKey="id"
            pagination={false}
            expandedRowKeys={expandedKeys}
            onExpandedRowsChange={setExpandedKeys}
            childrenColumnName="children"
            scroll={{ x: 1200 }}
            rowSelection={{
              type: 'checkbox',
              selectedRowKeys: tenantSelectedRowKeys,
              onSelect: handleTenantRowSelect,
              onSelectAll: handleTenantSelectAll,
              checkStrictly: false
            }}
          />
        </TabPane>
      </Tabs>

      {/* 新增编辑菜单抽屉 */}
      <Drawer
        title={modalTitle}
        visible={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="确定"
        cancelText="取消"
        width={500}
        maskClosable={false}
      >
        <Form
          form={form}
          layout="vertical"
          style={{ marginTop: 16 }}
        >
          {/* 菜单类型 */}
          <Form.Item
            label="菜单类型"
            field="type"
            rules={[{ required: true, message: '请选择菜单类型' }]}
          >
            <Radio.Group>
              <Radio value="目录">目录</Radio>
              <Radio value="菜单">菜单</Radio>
              <Radio value="Tab">Tab</Radio>
            </Radio.Group>
          </Form.Item>

          {/* 父级菜单 */}
          <Form.Item
            label={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>父级菜单</span>
                <Checkbox 
                  checked={isTopLevel}
                  onChange={(checked) => {
                    setIsTopLevel(checked);
                    form.setFieldValue('isTopLevel', checked);
                    if (checked) {
                      form.setFieldValue('parentId', undefined);
                    }
                  }}
                >
                  顶级
                </Checkbox>
              </div>
            }
            field="parentId"
          >
            <Cascader
              placeholder="请选择父级菜单"
              options={getParentMenuOptions()}
              disabled={isTopLevel}
              changeOnSelect={false}
              expandTrigger="hover"
            />
          </Form.Item>

          {/* 菜单名称和英文名 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item
              label="菜单名称"
              field="name"
              rules={[{ required: true, message: '请输入菜单名称' }]}
            >
              <Input placeholder="请输入菜单名称" />
            </Form.Item>

            <Form.Item
              label="英文名"
              field="nameEn"
              rules={[{ required: true, message: '请输入英文名' }]}
            >
              <Input placeholder="请输入英文名" />
            </Form.Item>
          </div>

          {/* 菜单图标 */}
          <Form.Item
            label="菜单图标"
            field="icon"
          >
            <Input 
              placeholder="搜索图标"
              suffix={<IconClose style={{ cursor: 'pointer' }} />}
            />
          </Form.Item>

          {/* 路由路径 */}
          <Form.Item
            label="路由路径"
            field="path"
            rules={[{ required: true, message: '请输入路由路径' }]}
          >
            <Input placeholder="请输入路由路径" />
            <div style={{ fontSize: 12, color: '#86909c', marginTop: 4 }}>
              访问的路由地址，如：`admin`，如外网地址需内链访问则以`http(s)://`开头
            </div>
          </Form.Item>

          {/* 权限标志 */}
          <Form.Item
            label="权限标志"
            field="permission"
            rules={[{ required: true, message: '请输入权限标志' }]}
          >
            <Input placeholder="请输入权限标志" />
            <div style={{ fontSize: 12, color: '#86909c', marginTop: 4 }}>
              控制菜单权限的标识符，如：platform:user:manage
            </div>
          </Form.Item>

          {/* 菜单状态 */}
          <Form.Item
            label="菜单状态"
            field="status"
          >
            <Radio.Group>
              <Radio value={true}>正常</Radio>
              <Radio value={false}>停用</Radio>
            </Radio.Group>
            <div style={{ fontSize: 12, color: '#86909c', marginTop: 4 }}>
              选择停用则路由将不会出现在侧边栏，也不能被访问
            </div>
          </Form.Item>

          {/* 排序 */}
          <Form.Item
            label="排序"
            field="sort"
          >
            <InputNumber 
              placeholder="0"
              min={0}
              style={{ width: '100%' }}
            />
            <div style={{ fontSize: 12, color: '#86909c', marginTop: 4 }}>
              数值为0，数值越大越靠前
            </div>
          </Form.Item>
        </Form>
      </Drawer>

      {/* 租户授权弹窗 */}
      <Modal
        title="授权租户菜单"
        visible={tenantAuthVisible}
        onOk={handleTenantAuthOk}
        onCancel={handleTenantAuthCancel}
        style={{ width: 600 }}
        okText="确定"
        cancelText="取消"
      >
        <div style={{ marginBottom: 16 }}>
          <div style={{ marginBottom: 16 }}>
            <Input
              placeholder="搜索租户编号或名称"
              value={tenantSearchValue}
              onChange={(value) => setTenantSearchValue(value)}
            />
          </div>
          
          {/* 搜索结果下拉列表 */}
          {tenantSearchValue && (
            <div style={{ 
              border: '1px solid #d9d9d9', 
              borderRadius: 4, 
              maxHeight: 200, 
              overflowY: 'auto',
              backgroundColor: 'white',
              marginBottom: 16
            }}>
              {getFilteredTenants().map(tenant => (
                <div
                  key={tenant.id}
                  style={{
                    padding: '8px 12px',
                    cursor: 'pointer',
                    borderBottom: '1px solid #f0f0f0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                  onClick={() => handleAddTenant(tenant)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f5f5f5';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{tenant.code}</div>
                    <div style={{ color: '#666', fontSize: '12px' }}>{tenant.name}</div>
                  </div>
                </div>
              ))}
              {getFilteredTenants().length === 0 && (
                <div style={{ padding: '16px', textAlign: 'center', color: '#999' }}>
                  未找到匹配的租户
                </div>
              )}
            </div>
          )}
        </div>

        {/* 租户列表表格 */}
        <div style={{ border: '1px solid #d9d9d9', borderRadius: 4 }}>
          <div style={{ 
            display: 'flex', 
            backgroundColor: '#f5f5f5', 
            borderBottom: '1px solid #d9d9d9',
            fontWeight: 'bold'
          }}>
            <div style={{ flex: '0 0 100px', padding: '8px 12px', borderRight: '1px solid #d9d9d9' }}>
              编号
            </div>
            <div style={{ flex: 1, padding: '8px 12px' }}>
              中文名称
            </div>
          </div>
          
          <div style={{ maxHeight: 200, overflowY: 'auto' }}>
             {selectedTenants.length === 0 ? (
               <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                 暂无选择的租户
               </div>
             ) : (
               selectedTenants.map(tenant => (
                 <div
                   key={tenant.id}
                   style={{ 
                     display: 'flex', 
                     borderBottom: '1px solid #f0f0f0',
                     position: 'relative',
                     backgroundColor: hoveredTenantId === tenant.id ? '#f5f5f5' : 'white',
                     transition: 'background-color 0.2s'
                   }}
                   onMouseEnter={() => setHoveredTenantId(tenant.id)}
                   onMouseLeave={() => setHoveredTenantId(null)}
                 >
                   <div style={{ flex: '0 0 100px', padding: '8px 12px', borderRight: '1px solid #f0f0f0' }}>
                     {tenant.code}
                   </div>
                   <div style={{ flex: 1, padding: '8px 12px', paddingRight: '40px' }}>
                     {tenant.name}
                   </div>
                   {hoveredTenantId === tenant.id && (
                     <div
                       style={{
                         position: 'absolute',
                         right: '8px',
                         top: '50%',
                         transform: 'translateY(-50%)',
                         cursor: 'pointer',
                         color: '#999',
                         fontSize: '16px',
                         width: '20px',
                         height: '20px',
                         display: 'flex',
                         alignItems: 'center',
                         justifyContent: 'center',
                         borderRadius: '2px'
                       }}
                       onClick={() => handleRemoveTenant(tenant.id)}
                       onMouseEnter={(e) => {
                         e.currentTarget.style.backgroundColor = '#ff4d4f';
                         e.currentTarget.style.color = 'white';
                       }}
                       onMouseLeave={(e) => {
                         e.currentTarget.style.backgroundColor = 'transparent';
                         e.currentTarget.style.color = '#999';
                       }}
                     >
                       ×
                     </div>
                   )}
                 </div>
               ))
             )}
           </div>
        </div>
        
        {selectedTenants.length > 0 && (
           <div style={{ marginTop: 8, fontSize: '12px', color: '#666' }}>
             已选择 {selectedTenants.length} 个租户，鼠标悬停可删除
           </div>
         )}
      </Modal>

      {/* 删除确认弹窗 */}
      <Modal
        title="确认删除"
        visible={deleteConfirmVisible}
        onOk={handleConfirmDelete}
        onCancel={handleCancelDelete}
        okText="确定"
        cancelText="取消"
        okButtonProps={{ status: 'danger' }}
      >
        <div style={{ padding: '16px 0' }}>
          {deleteType === 'single' ? (
            <p>确定要删除菜单 "{deletingMenu?.name}" 吗？</p>
          ) : (
            <p>确定要删除选中的 {tenantSelectedRowKeys.length} 个菜单吗？</p>
          )}
          <p style={{ color: '#ff4d4f', fontSize: '14px', margin: '8px 0 0 0' }}>
            删除后不可恢复，请谨慎操作！
          </p>
        </div>
      </Modal>

      <style>{`
         .menu-management {
           padding: 0;
           background: #fff;
         }

         .page-header {
           padding: 16px 24px;
           border-bottom: 1px solid #e5e6eb;
         }

         .page-header h2 {
           margin: 0;
           font-size: 16px;
           font-weight: 500;
           color: #1d2129;
         }

         .filter-section {
           padding: 16px 24px;
           background: #fff;
           border-bottom: 1px solid #e5e6eb;
         }

         .filter-row {
           display: grid;
           grid-template-columns: 1fr 1fr 1fr 1fr auto;
           gap: 16px;
           align-items: flex-end;
         }

         .tenant-filter-row {
           display: grid;
           grid-template-columns: 1fr auto;
           gap: 16px;
           align-items: flex-end;
         }

         .filter-item {
           display: flex;
           flex-direction: column;
           gap: 4px;
         }

         .filter-item label {
           font-size: 14px;
           color: #666;
           margin: 0;
           margin-bottom: 4px;
         }

         .filter-actions {
           display: flex;
           gap: 8px;
         }

         .action-bar {
           display: flex;
           justify-content: space-between;
           align-items: center;
           padding: 16px 24px;
           border-bottom: 1px solid #e5e6eb;
         }

         .action-left {
           display: flex;
           gap: 8px;
         }

         .action-right {
           display: flex;
           gap: 8px;
         }
        `}</style>
    </div>
  );
};

export default MenuManagement;