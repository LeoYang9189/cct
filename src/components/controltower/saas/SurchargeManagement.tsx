import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Space,
  Table,
  Select,
  DatePicker,
  Message,
  Typography,
  Tag,
  Dropdown,
  Tabs,
  Modal,
  Tooltip,
  Grid,
  Drawer,
  Input,
  Switch,
  Breadcrumb
} from '@arco-design/web-react';
import { useNavigate } from 'react-router-dom';
import {
  IconPlus,
  IconMore,
  IconSettings,
  IconUp,
  IconDown,
  IconDragDotVertical,
  IconSearch,
  IconRefresh,
  IconList,
  IconUpload,
  IconDownload
} from '@arco-design/web-react/icon';
import ControlTowerSaasLayout from './ControlTowerSaasLayout';
import SchemeSelect from './SchemeSelect';
import SchemeManagementModal, { SchemeData } from './SchemeManagementModal';

const { Option } = Select;
const { Title } = Typography;
const { Row, Col } = Grid;

// 生成8位随机费用ID
const generateSurchargeId = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// 筛选模式枚举
export enum FilterMode {
  EQUAL = 'equal',
  NOT_EQUAL = 'notEqual', 
  CONTAINS = 'contains',
  NOT_CONTAINS = 'notContains',
  IS_EMPTY = 'isEmpty',
  IS_NOT_EMPTY = 'isNotEmpty',
  BATCH = 'batch'
}

// 筛选字段配置接口
export interface FilterFieldConfig {
  key: string;
  label: string;
  type: 'text' | 'select' | 'dateRange' | 'number';
  options?: { label: string; value: string }[];
  placeholder?: string;
  width?: number;
}

// 筛选条件接口
export interface FilterCondition {
  key: string;
  mode: FilterMode;
  value: any;
  visible: boolean;
}

// 筛选方案接口
export interface FilterScheme {
  id: string;
  name: string;
  conditions: FilterCondition[];
  isDefault?: boolean;
}

// 获取筛选字段配置
const getFilterFields = (): FilterFieldConfig[] => {
  return [
    { key: 'code', label: '费用ID', type: 'text', placeholder: '请输入费用ID' },
    { key: 'usageLocation', label: '适用地点', type: 'select', placeholder: '请选择适用地点', options: [
      { label: 'Shanghai', value: 'Shanghai' },
      { label: 'Ningbo', value: 'Ningbo' },
      { label: 'Shenzhen', value: 'Shenzhen' }
    ]},
    { key: 'company', label: '船公司/航空公司', type: 'select', placeholder: '请选择公司', options: [
      { label: '商汇', value: '商汇' },
      { label: '阿联酋航运', value: '阿联酋航运' },
      { label: 'MAERSK', value: 'MAERSK' }
    ]},
    { key: 'usageLine', label: '适用航线', type: 'text', placeholder: '请输入适用航线' },
    { key: 'usageStatus', label: '费用状态', type: 'select', placeholder: '请选择状态', options: [
      { label: '正常', value: 'active' },
      { label: '停用', value: 'inactive' },
      { label: '过期', value: 'expired' }
    ]},
    { key: 'updateTime', label: '更新时间', type: 'dateRange', placeholder: '请选择时间范围' }
  ];
};

// 附加费类型枚举
type SurchargeType = 'fcl' | 'lcl' | 'air';

// 附加费数据接口
interface SurchargeData {
  id: string;
  code: string; // 费用ID - 8位数字字母随机组合
  usageLocation: string; // 适用地点
  company: string; // 船公司/航空公司
  usageLine: string; // 适用航线
  usageStatus: 'active' | 'inactive' | 'expired'; // 费用状态：正常、禁用、过期
  updateTime: string; // 更新时间
  type: SurchargeType; // 附加费类型
}

// 模拟数据
const mockData: SurchargeData[] = [
  // 整箱附加费
  {
    id: 'LESE00000048',
    code: generateSurchargeId(),
    usageLocation: 'Shanghai',
    company: '商汇',
    usageLine: '东南亚线,日韩线,东南亚干线,泰国线,越南线',
    usageStatus: 'active',
    updateTime: '2025-04-16 14:05',
    type: 'fcl'
  },
  {
    id: 'LESE00000047',
    code: generateSurchargeId(),
    usageLocation: 'Shanghai',
    company: '阿联酋航运',
    usageLine: '地中海线,欧洲线,地中海东线,地中海西线,黑海线,北非线',
    usageStatus: 'active',
    updateTime: '2025-03-06 14:40',
    type: 'fcl'
  },
  {
    id: 'LESE00000046',
    code: generateSurchargeId(),
    usageLocation: 'Ningbo',
    company: 'MAERSK',
    usageLine: '欧洲线,北欧线',
    usageStatus: 'expired',
    updateTime: '2025-03-01 10:20',
    type: 'fcl'
  },
  {
    id: 'LESE00000060',
    code: generateSurchargeId(),
    usageLocation: 'Shenzhen',
    company: 'EVERGREEN',
    usageLine: '美西线,美东线,美国内陆线,加拿大线,墨西哥线,南美西线,南美东线',
    usageStatus: 'active',
    updateTime: '2025-04-18 09:30',
    type: 'fcl'
  },
  {
    id: 'LESE00000061',
    code: generateSurchargeId(),
    usageLocation: 'Tianjin',
    company: 'CMA CGM',
    usageLine: '中东线',
    usageStatus: 'active',
    updateTime: '2025-04-17 16:45',
    type: 'fcl'
  },
  // 拼箱附加费
  {
    id: 'LESE00000049',
    code: generateSurchargeId(),
    usageLocation: 'Ningbo',
    company: '马士基',
    usageLine: '欧洲线,地中海线,北欧线,西地中海线,东地中海线,意大利线',
    usageStatus: 'active',
    updateTime: '2025-04-15 10:30',
    type: 'lcl'
  },
  {
    id: 'LESE00000050',
    code: generateSurchargeId(),
    usageLocation: 'Shenzhen',
    company: 'COSCO',
    usageLine: '美西线,美东线',
    usageStatus: 'inactive',
    updateTime: '2025-04-14 16:20',
    type: 'lcl'
  },
  {
    id: 'LESE00000045',
    code: generateSurchargeId(),
    usageLocation: 'Shanghai',
    company: 'CMA CGM',
    usageLine: '地中海线,西非线,东非线,南非线',
    usageStatus: 'expired',
    updateTime: '2025-02-28 15:30',
    type: 'lcl'
  },
  {
    id: 'LESE00000062',
    code: generateSurchargeId(),
    usageLocation: 'Guangzhou',
    company: 'ONE',
    usageLine: '澳洲线,新西兰线,澳洲内陆线,塔斯马尼亚线,太平洋岛国线',
    usageStatus: 'active',
    updateTime: '2025-04-16 11:20',
    type: 'lcl'
  },
  {
    id: 'LESE00000063',
    code: generateSurchargeId(),
    usageLocation: 'Xiamen',
    company: 'YANG MING',
    usageLine: '印度线,巴基斯坦线,孟加拉线',
    usageStatus: 'active',
    updateTime: '2025-04-15 14:10',
    type: 'lcl'
  },
  // 空运附加费
  {
    id: 'LESE00000051',
    code: generateSurchargeId(),
    usageLocation: 'Shanghai',
    company: '国航货运',
    usageLine: '欧洲航线,德国航线,法国航线,英国航线,意大利航线,西班牙航线,荷兰航线',
    usageStatus: 'active',
    updateTime: '2025-04-13 14:15',
    type: 'air'
  },
  {
    id: 'LESE00000052',
    code: generateSurchargeId(),
    usageLocation: 'Beijing',
    company: '东航货运',
    usageLine: '美洲航线,美西航线,美东航线',
    usageStatus: 'active',
    updateTime: '2025-04-12 09:45',
    type: 'air'
  },
  {
    id: 'LESE00000044',
    code: generateSurchargeId(),
    usageLocation: 'Guangzhou',
    company: '南航货运',
    usageLine: '澳洲航线,新西兰航线',
    usageStatus: 'inactive',
    updateTime: '2025-04-10 11:20',
    type: 'air'
  },
  {
    id: 'LESE00000064',
    code: generateSurchargeId(),
    usageLocation: 'Chengdu',
    company: '川航货运',
    usageLine: '东南亚航线,泰国航线,越南航线,新加坡航线,马来西亚航线,印尼航线',
    usageStatus: 'active',
    updateTime: '2025-04-14 13:30',
    type: 'air'
  },
  {
    id: 'LESE00000065',
    code: generateSurchargeId(),
    usageLocation: 'Shenzhen',
    company: '顺丰航空',
    usageLine: '日韩航线',
    usageStatus: 'active',
    updateTime: '2025-04-13 10:15',
    type: 'air'
  },
  {
    id: 'LESE00000066',
    code: generateSurchargeId(),
    usageLocation: 'Hangzhou',
    company: '长龙航空',
    usageLine: '中东航线,迪拜航线,卡塔尔航线,沙特航线,科威特航线',
    usageStatus: 'active',
    updateTime: '2025-04-12 15:45',
    type: 'air'
  }
];

const SurchargeManagement: React.FC = () => {
  const navigate = useNavigate();
  const [activeSurchargeType, setActiveSurchargeType] = useState<SurchargeType>('fcl');
  const [allData] = useState<SurchargeData[]>(mockData);
  const [filteredData, setFilteredData] = useState<SurchargeData[]>(mockData.filter(item => item.type === 'fcl'));
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  
  // 确认弹窗相关状态
  const [toggleStatusModalVisible, setToggleStatusModalVisible] = useState(false);
  const [batchToggleModalVisible, setBatchToggleModalVisible] = useState(false);
  const [pendingToggleRule, setPendingToggleRule] = useState<{ id: string; currentStatus: 'active' | 'inactive' | 'expired' } | null>(null);
  const [pendingBatchToggleStatus, setPendingBatchToggleStatus] = useState<'active' | 'inactive' | null>(null);

  // 自定义表格抽屉状态
  const [customTableDrawerVisible, setCustomTableDrawerVisible] = useState(false);
  
  // 字段可见性状态 - 包含附加费维护的所有字段
  const [columnVisibility, setColumnVisibility] = useState<{[key: string]: boolean}>({
    code: true,
    usageLocation: true,
    company: true,
    usageLine: true,
    usageStatus: true,
    updateTime: true,
    type: false,
  });

  // 列顺序状态
  const [columnOrder, setColumnOrder] = useState([
    'code', 'usageLocation', 'company', 'usageLine', 'usageStatus', 'updateTime', 'type'
  ]);

  // 拖拽状态
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragOverItem, setDragOverItem] = useState<string | null>(null);

  // 筛选条件状态
  const [filterConditions, setFilterConditions] = useState<FilterCondition[]>([]);
  const [filterSchemes, setFilterSchemes] = useState<FilterScheme[]>([]);
  const [currentSchemeId, setCurrentSchemeId] = useState<string>('default');

  // 筛选功能状态
  const [filterExpanded, setFilterExpanded] = useState(false);
  const [filterFieldModalVisible, setFilterFieldModalVisible] = useState(false);
  const [schemeModalVisible, setSchemeModalVisible] = useState(false);
  const [schemeName, setSchemeName] = useState('');
  
  // 方案管理相关状态
  const [schemeManagementModalVisible, setSchemeManagementModalVisible] = useState(false);
  const [allSchemes, setAllSchemes] = useState<SchemeData[]>([]);

  // 筛选字段拖拽状态
  const [filterFieldOrder, setFilterFieldOrder] = useState<string[]>([]);
  const [draggedFilterField, setDraggedFilterField] = useState<string | null>(null);
  const [dragOverFilterField, setDragOverFilterField] = useState<string | null>(null);

  // 初始化筛选功能
  const initializeDefaultConditions = (): FilterCondition[] => {
    const fields = getFilterFields();
    return fields.map(field => ({
      key: field.key,
      mode: FilterMode.EQUAL,
      value: '',
      visible: ['code', 'usageLocation', 'company'].includes(field.key) // 默认显示前3个字段
    }));
  };

  const initializeDefaultScheme = (): FilterScheme => {
    return {
      id: 'default',
      name: '默认方案',
      conditions: initializeDefaultConditions(),
      isDefault: true
    };
  };

  // 方案管理相关函数
  const openSchemeManagementModal = () => {
    setSchemeManagementModalVisible(true);
  };

  const closeSchemeManagementModal = () => {
    setSchemeManagementModalVisible(false);
  };

  const handleDeleteScheme = (id: string) => {
    setAllSchemes(prev => prev.filter(scheme => scheme.id !== id));
    // 如果删除的是当前选中的方案，切换到默认方案
    if (currentSchemeId === id) {
      setCurrentSchemeId('default');
    }
  };

  const handleSetDefaultScheme = (id: string) => {
    setAllSchemes(prev => prev.map(scheme => ({
      ...scheme,
      isDefault: scheme.id === id
    })));
  };

  const handleRenameScheme = (id: string, newName: string) => {
    setAllSchemes(prev => prev.map(scheme => 
      scheme.id === id ? { ...scheme, name: newName } : scheme
    ));
  };

  useEffect(() => {
    const defaultConditions = initializeDefaultConditions();
    const defaultScheme = initializeDefaultScheme();
    setFilterConditions(defaultConditions);
    setFilterSchemes([defaultScheme]);
    setFilterFieldOrder(getFilterFields().map(field => field.key));
  }, []);

  // 初始化方案数据
  useEffect(() => {
    const defaultScheme: SchemeData = {
      id: 'default',
      name: '系统默认方案',
      isDefault: true,
      createTime: new Date().toISOString(),
      conditions: []
    };
    
    const customScheme1: SchemeData = {
      id: 'custom1',
      name: '常用附加费筛选',
      isDefault: false,
      createTime: new Date(Date.now() - 86400000).toISOString(),
      conditions: []
    };
    
    const customScheme2: SchemeData = {
      id: 'custom2',
      name: '商汇附加费',
      isDefault: false,
      createTime: new Date(Date.now() - 172800000).toISOString(),
      conditions: []
    };
    
    setAllSchemes([defaultScheme, customScheme1, customScheme2]);
  }, []);

  // 筛选功能函数
  const getVisibleConditions = (): FilterCondition[] => {
    return filterConditions.filter(condition => condition.visible);
  };

  const getFirstRowConditions = (): FilterCondition[] => {
    return getVisibleConditions().slice(0, 3);
  };

  const toggleFilterExpanded = () => {
    setFilterExpanded(!filterExpanded);
  };

  const updateFilterCondition = (key: string, mode: FilterMode, value: any) => {
    setFilterConditions(prev => prev.map(condition => 
      condition.key === key ? { ...condition, mode, value } : condition
    ));
  };

  const resetFilterConditions = () => {
    const fields = getFilterFields();
    const resetConditions = fields.map(field => ({
      key: field.key,
      mode: FilterMode.EQUAL,
      value: '',
      visible: ['code', 'usageLocation', 'company'].includes(field.key)
    }));
    setFilterConditions(resetConditions);
  };

  const applyFilterScheme = (schemeId: string) => {
    const scheme = filterSchemes.find(s => s.id === schemeId);
    if (scheme) {
      setFilterConditions([...scheme.conditions]);
      setCurrentSchemeId(schemeId);
    }
  };

  const openFilterFieldModal = () => {
    setFilterFieldModalVisible(true);
  };

  const closeFilterFieldModal = () => {
    setFilterFieldModalVisible(false);
  };

  const openSchemeModal = () => {
    setSchemeName('');
    setSchemeModalVisible(true);
  };

  const closeSchemeModal = () => {
    setSchemeModalVisible(false);
  };

  const saveFilterScheme = () => {
    if (!schemeName.trim()) {
      Message.warning('请输入方案名称');
      return;
    }
    
    const newScheme: FilterScheme = {
      id: Date.now().toString(),
      name: schemeName,
      conditions: [...filterConditions],
      isDefault: false
    };

    const newSchemeData: SchemeData = {
      id: newScheme.id,
      name: newScheme.name,
      isDefault: false,
      createTime: new Date().toISOString(),
      conditions: newScheme.conditions
    };
    
    // 同时更新两个状态
    setFilterSchemes(prev => [...prev, newScheme]);
    setAllSchemes(prev => [...prev, newSchemeData]);
    setCurrentSchemeId(newScheme.id);
    closeSchemeModal();
    Message.success('保存成功');
  };

  const updateFilterConditionVisibility = (key: string, visible: boolean) => {
    setFilterConditions(prev => prev.map(condition => 
      condition.key === key ? { ...condition, visible } : condition
    ));
  };

  // 拖拽功能函数
  const handleDragStart = (e: React.DragEvent, columnKey: string) => {
    setDraggedItem(columnKey);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, columnKey: string) => {
    e.preventDefault();
    setDragOverItem(columnKey);
  };

  const handleDrop = (e: React.DragEvent, targetColumnKey: string) => {
    e.preventDefault();
    
    if (!draggedItem || draggedItem === targetColumnKey) {
      return;
    }

    const newOrder = [...columnOrder];
    const draggedIndex = newOrder.indexOf(draggedItem);
    const targetIndex = newOrder.indexOf(targetColumnKey);
    
    newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, draggedItem);
    
    setColumnOrder(newOrder);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverItem(null);
  };

  const handleFilterFieldDragStart = (e: React.DragEvent, fieldKey: string) => {
    setDraggedFilterField(fieldKey);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleFilterFieldDragOver = (e: React.DragEvent, fieldKey: string) => {
    e.preventDefault();
    setDragOverFilterField(fieldKey);
  };

  const handleFilterFieldDrop = (e: React.DragEvent, targetFieldKey: string) => {
    e.preventDefault();
    
    if (!draggedFilterField || draggedFilterField === targetFieldKey) {
      return;
    }

    const newOrder = [...filterFieldOrder];
    const draggedIndex = newOrder.indexOf(draggedFilterField);
    const targetIndex = newOrder.indexOf(targetFieldKey);
    
    newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, draggedFilterField);
    
    setFilterFieldOrder(newOrder);
  };

  const handleFilterFieldDragEnd = () => {
    setDraggedFilterField(null);
    setDragOverFilterField(null);
  };

  // 自定义表格功能函数
  const openCustomTableDrawer = () => {
    setCustomTableDrawerVisible(true);
  };

  const closeCustomTableDrawer = () => {
    setCustomTableDrawerVisible(false);
  };

  const handleColumnVisibilityChange = (column: string, visible: boolean) => {
    setColumnVisibility(prev => ({
      ...prev,
      [column]: visible
    }));
  };

  const resetColumnVisibility = () => {
    setColumnVisibility({
      code: true,
      usageLocation: true,
      company: true,
      usageLine: true,
      usageStatus: true,
      updateTime: true,
      type: false,
    });
  };

  const applyColumnSettings = () => {
    closeCustomTableDrawer();
    Message.success('设置已应用');
  };

  const getColumnLabel = (columnKey: string): string => {
    const columnMap: { [key: string]: string } = {
      code: '费用ID',
      usageLocation: activeSurchargeType === 'air' ? '适用机场' : '适用起运港',
      company: activeSurchargeType === 'air' ? '航空公司' : '船公司',
      usageLine: '适用航线',
      usageStatus: '费用状态',
      updateTime: '更新时间',
      type: '附加费类型'
    };
    return columnMap[columnKey] || columnKey;
  };

  // Tab切换处理
  const handleSurchargeTypeChange = (type: string) => {
    const surchargeType = type as SurchargeType;
    setActiveSurchargeType(surchargeType);
    const typeData = allData.filter(item => item.type === surchargeType);
    setFilteredData(typeData);
    setSelectedRowKeys([]); // 重置选中项
  };

  // 查看详情
  const handleView = (id: string) => {
    navigate(`/controltower/saas/surcharge/view/${id}?type=${activeSurchargeType}`);
  };

  // 编辑附加费
  const handleEdit = (id: string) => {
    navigate(`/controltower/saas/surcharge/edit/${id}?type=${activeSurchargeType}`);
  };

  // 切换状态（禁用/启用）- 显示确认弹窗
  const handleToggleStatus = (id: string, currentStatus: 'active' | 'inactive' | 'expired') => {
    setPendingToggleRule({ id, currentStatus });
    setToggleStatusModalVisible(true);
  };

  // 确认切换状态
  const handleConfirmToggleStatus = () => {
    if (!pendingToggleRule) return;
    
    const newStatus = pendingToggleRule.currentStatus === 'active' ? 'inactive' : 'active';
    setFilteredData(prev => prev.map(item => 
      item.id === pendingToggleRule.id ? { ...item, usageStatus: newStatus } : item
    ));
    
    setToggleStatusModalVisible(false);
    setPendingToggleRule(null);
    Message.success(newStatus === 'active' ? '启用成功' : '禁用成功');
  };

  // 批量切换状态
  const handleBatchToggleStatus = (targetStatus: 'active' | 'inactive') => {
    setPendingBatchToggleStatus(targetStatus);
    setBatchToggleModalVisible(true);
  };

  // 确认批量切换状态
  const handleConfirmBatchToggleStatus = () => {
    if (!pendingBatchToggleStatus) return;
    
    setFilteredData(prev => prev.map(item => 
      selectedRowKeys.includes(item.id) ? { ...item, usageStatus: pendingBatchToggleStatus } : item
    ));
    
    setBatchToggleModalVisible(false);
    setPendingBatchToggleStatus(null);
    setSelectedRowKeys([]);
    Message.success(`批量${pendingBatchToggleStatus === 'active' ? '启用' : '禁用'}成功`);
  };

  // 新增附加费
  const handleAdd = () => {
    navigate(`/controltower/saas/surcharge/add?type=${activeSurchargeType}`);
  };

  // 表格列定义
  const getColumns = () => {
    const baseColumns = [
      {
        title: '费用ID',
        dataIndex: 'code',
        key: 'code',
        width: 120,
        sorter: true,
      },
      {
        title: activeSurchargeType === 'air' ? '适用机场' : '适用起运港',
        dataIndex: 'usageLocation',
        key: 'usageLocation',
        width: 120,
        sorter: true,
      },
      {
        title: activeSurchargeType === 'air' ? '航空公司' : '船公司',
        dataIndex: 'company',
        key: 'company',
        width: 120,
        sorter: true,
      },
      {
        title: activeSurchargeType === 'air' ? '适用航线' : '适用航线',
        dataIndex: 'usageLine',
        key: 'usageLine',
        width: 150,
        sorter: true,
        render: (text: string) => {
          const lines = text.split(',').filter(line => line.trim());
          const firstLine = lines[0] || '';
          const remainingCount = lines.length - 1;

          if (lines.length <= 1) {
            return <Tag color="blue">{firstLine}</Tag>;
          }

          return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Tag color="blue">{firstLine}</Tag>
              <Tooltip
                content={
                  <div style={{ maxWidth: '200px' }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>所有适用航线：</div>
                    {lines.map((line, index) => (
                      <div key={index} style={{ padding: '2px 0' }}>
                        <Tag color="blue" size="small">{line.trim()}</Tag>
                      </div>
                    ))}
                  </div>
                }
                position="top"
              >
                <Tag color="gray" style={{ cursor: 'pointer' }}>
                  +{remainingCount}
                </Tag>
              </Tooltip>
            </div>
          );
        }
      },
      {
        title: '费用状态',
        dataIndex: 'usageStatus',
        key: 'usageStatus',
        width: 100,
        sorter: true,
        render: (status: string) => (
          <Tag color={status === 'active' ? 'green' : status === 'inactive' ? 'red' : 'orange'}>
            {status === 'active' ? '正常' : status === 'inactive' ? '停用' : '过期'}
          </Tag>
        )
      },
      {
        title: '更新时间',
        dataIndex: 'updateTime',
        key: 'updateTime',
        width: 150,
        sorter: true,
      },
      {
        title: '操作',
        key: 'action',
        width: 200,
        render: (_: unknown, record: SurchargeData) => {
          const moreMenuItems = [
            {
              key: 'toggle-status',
              title: record.usageStatus === 'active' ? '禁用' : '启用',
              onClick: () => handleToggleStatus(record.id, record.usageStatus)
            }
          ];

          return (
            <Space>
              <Button
                type="text"
                size="small"
                onClick={() => handleView(record.id)}
              >
                详情
              </Button>
              <Button
                type="text"
                size="small"
                onClick={() => handleEdit(record.id)}
              >
                编辑
              </Button>
              <Dropdown
                droplist={
                  <div style={{ padding: '4px 0', backgroundColor: '#fff' }}>
                    {moreMenuItems.map(item => (
                      <div
                        key={item.key}
                        style={{
                          padding: '8px 12px',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                        onClick={item.onClick}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#f5f5f5';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        {item.title}
                      </div>
                    ))}
                  </div>
                }
                position="bottom"
              >
                <Button
                  type="text"
                  size="small"
                  icon={<IconMore />}
                >
                  更多
                </Button>
              </Dropdown>
            </Space>
          );
        },
      },
    ];

    return baseColumns;
  };

  // 渲染筛选条件
  const renderFilterCondition = (condition: FilterCondition) => {
    const fieldConfig = getFilterFields().find(field => field.key === condition.key);
    if (!fieldConfig) return null;

    const handleModeChange = (mode: FilterMode) => {
      updateFilterCondition(condition.key, mode, condition.value);
    };

    const handleValueChange = (value: any) => {
      updateFilterCondition(condition.key, condition.mode, value);
    };

    // 根据筛选模式决定是否禁用输入框
    const isInputDisabled = condition.mode === FilterMode.IS_EMPTY || condition.mode === FilterMode.IS_NOT_EMPTY;

    return (
      <Col span={6} key={condition.key} className="mb-4">
        <div className="filter-condition-wrapper">
          {/* 字段标签和筛选模式 */}
          <div className="filter-label-row mb-2 flex items-center justify-between">
            <span className="text-gray-700 text-sm font-medium">{fieldConfig.label}</span>
            <Select
              value={condition.mode}
              onChange={handleModeChange}
              style={{ width: '80px' }}
              size="small"
              className="filter-mode-select"
            >
              <Option value={FilterMode.EQUAL}>等于</Option>
              <Option value={FilterMode.NOT_EQUAL}>不等于</Option>
              <Option value={FilterMode.CONTAINS}>包含</Option>
              <Option value={FilterMode.NOT_CONTAINS}>不包含</Option>
              <Option value={FilterMode.IS_EMPTY}>为空</Option>
              <Option value={FilterMode.IS_NOT_EMPTY}>不为空</Option>
            </Select>
          </div>
          
          {/* 筛选输入框 */}
          <div className="filter-input-wrapper">
            {fieldConfig.type === 'select' && (
              <Select
                value={condition.value}
                onChange={handleValueChange}
                placeholder="请选择"
                allowClear
                style={{ width: '100%' }}
                disabled={isInputDisabled}
                size="small"
              >
                {fieldConfig.options?.map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            )}
            
            {fieldConfig.type === 'text' && (
              <Input
                value={condition.value}
                onChange={handleValueChange}
                placeholder={fieldConfig.placeholder}
                disabled={isInputDisabled}
                size="small"
              />
            )}
            
            {fieldConfig.type === 'dateRange' && (
              <DatePicker.RangePicker
                value={condition.value}
                onChange={handleValueChange}
                style={{ width: '100%' }}
                disabled={isInputDisabled}
                size="small"
              />
            )}
          </div>
        </div>
      </Col>
    );
  };

  // 渲染新版筛选区域
  const renderNewFilterArea = () => {
    const conditionsToShow = filterExpanded ? getVisibleConditions() : getFirstRowConditions();
    
    return (
      <Card className="mb-4 filter-area-card">
        {/* 筛选区头部 - 标题和所有操作按钮在同一行 */}
        <div className="filter-header flex justify-between items-center mb-6">
          <Title heading={6} className="!mb-0 !text-gray-800">
            筛选条件
          </Title>
          <div className="flex items-center gap-3">
            {/* 选择方案下拉 */}
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-sm">方案:</span>
              <SchemeSelect
                value={currentSchemeId}
                onChange={applyFilterScheme}
                schemes={allSchemes}
                onSchemeManagement={openSchemeManagementModal}
                placeholder="选择方案"
                style={{ width: '180px' }}
                size="small"
              />
            </div>
            
            {/* 所有操作按钮 */}
            <Space size="medium">
              <Button 
                type="primary" 
                icon={<IconSearch />}
                className="search-btn"
                size="small"
              >
                查询
              </Button>
              <Button 
                icon={<IconRefresh />} 
                onClick={resetFilterConditions}
                className="reset-btn"
                size="small"
              >
                重置
              </Button>
              <Button 
                type="outline"
                icon={<IconSettings />} 
                onClick={openFilterFieldModal}
                className="settings-btn"
                size="small"
              >
                增减条件
              </Button>
              <Button 
                type="outline"
                onClick={openSchemeModal}
                className="save-scheme-btn"
                size="small"
              >
                另存为方案
              </Button>
              <Button 
                type="text" 
                icon={filterExpanded ? <IconUp /> : <IconDown />}
                onClick={toggleFilterExpanded}
                className="expand-btn text-blue-500 hover:text-blue-700"
                size="small"
              >
                {filterExpanded ? '收起' : '展开'}
              </Button>
            </Space>
          </div>
        </div>
        
        {/* 筛选条件网格 - 直接放置，无额外包装 */}
        <Row gutter={[20, 20]}>
          {conditionsToShow.map((condition) => renderFilterCondition(condition))}
        </Row>

        {/* 添加自定义样式 */}
        <style dangerouslySetInnerHTML={{
          __html: `
            .filter-area-card {
              background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
              border: 1px solid #e2e8f0;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
            }
            
            .filter-label-row {
              min-height: 24px;
            }
            
            .filter-mode-select .arco-select-view {
              background: #f1f5f9;
              border: 1px solid #cbd5e1;
            }
            
            .filter-input-wrapper .arco-input,
            .filter-input-wrapper .arco-select-view,
            .filter-input-wrapper .arco-picker {
              border: 1px solid #d1d5db;
              transition: border-color 0.2s ease;
            }
            
            .filter-input-wrapper .arco-input:focus,
            .filter-input-wrapper .arco-select-view:focus,
            .filter-input-wrapper .arco-picker:focus {
              border-color: #3b82f6;
              box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
            }
            
            .search-btn {
              background: linear-gradient(45deg, #3b82f6, #1d4ed8);
              border: none;
              font-weight: 500;
            }
            
            .reset-btn {
              border: 1px solid #e2e8f0;
              background: white;
              transition: all 0.2s ease;
            }
            
            .reset-btn:hover {
              border-color: #3b82f6;
              color: #3b82f6;
            }
            
            .expand-btn {
              font-weight: 500;
            }
          `
        }} />
      </Card>
    );
  };

  return (
    <ControlTowerSaasLayout menuSelectedKey="1" breadcrumb={
      <Breadcrumb>
        <Breadcrumb.Item>运价管理</Breadcrumb.Item>
        <Breadcrumb.Item>附加费维护</Breadcrumb.Item>
      </Breadcrumb>
    }>
      <Card>
        <Tabs activeTab={activeSurchargeType} onChange={handleSurchargeTypeChange} className="mb-4">
          <Tabs.TabPane key="fcl" title="整箱附加费" />
          <Tabs.TabPane key="lcl" title="拼箱附加费" />
          <Tabs.TabPane key="air" title="空运附加费" />
        </Tabs>
        
        {/* 使用新的筛选区域 */}
        {renderNewFilterArea()}
        
        <Card>
          <div className="flex justify-between mb-4">
            <Space>
              <Button type="primary" icon={<IconPlus />} onClick={handleAdd}>新增附加费</Button>
              <Button icon={<IconUpload />}>批量导入</Button>
              <Button icon={<IconDownload />}>导出列表</Button>
              {selectedRowKeys.length > 0 && (
                <>
                  <Button 
                    type="outline" 
                    status="success"
                    onClick={() => handleBatchToggleStatus('active')}
                  >
                    批量启用 ({selectedRowKeys.length})
                  </Button>
                  <Button 
                    type="outline" 
                    status="warning"
                    onClick={() => handleBatchToggleStatus('inactive')}
                  >
                    批量禁用 ({selectedRowKeys.length})
                  </Button>
                </>
              )}
            </Space>
            <div 
              className="flex items-center text-blue-500 cursor-pointer hover:text-blue-700"
              onClick={openCustomTableDrawer}
            >
              <IconList className="mr-1" />
              <span>自定义表格</span>
            </div>
          </div>
          <Table
            columns={getColumns()}
            data={filteredData}
            loading={false}
            rowKey="id"
            scroll={{ x: 1000 }}
            border={false}
            className="mt-4 inquiry-table-nowrap"
            pagination={{
              total: filteredData.length,
              pageSize: 10,
              showTotal: true,
              showJumper: true,
              sizeCanChange: true,
            }}
            rowSelection={{
              selectedRowKeys,
              onChange: (selectedRowKeys: (string | number)[]) => {
                setSelectedRowKeys(selectedRowKeys as string[]);
              },
            }}
          />
          <div className="mt-2 text-gray-500 text-sm">共 {filteredData.length} 条</div>
        </Card>
      </Card>

      {/* 单个状态切换确认弹窗 */}
      <Modal
        title="确认操作"
        visible={toggleStatusModalVisible}
        onOk={handleConfirmToggleStatus}
        onCancel={() => {
          setToggleStatusModalVisible(false);
          setPendingToggleRule(null);
        }}
        okText="确认"
        cancelText="取消"
      >
        <div>
          {pendingToggleRule && (
            <div>
              确定要{pendingToggleRule.currentStatus === 'active' ? '禁用' : '启用'}该附加费吗？
              <div style={{ marginTop: '8px', padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 'bold' }}>费用ID：</span>
                  <span style={{ fontFamily: 'monospace', color: '#165DFF' }}>
                    {(() => {
                      const rule = filteredData.find(r => r.id === pendingToggleRule.id);
                      return rule ? rule.code : '-';
                    })()}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontWeight: 'bold' }}>适用航线：</span>
                  <span>
                    {(() => {
                      const rule = filteredData.find(r => r.id === pendingToggleRule.id);
                      return rule ? rule.usageLine : '-';
                    })()}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* 批量状态切换确认弹窗 */}
      <Modal
        title="确认批量操作"
        visible={batchToggleModalVisible}
        onOk={handleConfirmBatchToggleStatus}
        onCancel={() => {
          setBatchToggleModalVisible(false);
          setPendingBatchToggleStatus(null);
        }}
        okText="确认"
        cancelText="取消"
      >
        <div>
          确定要批量{pendingBatchToggleStatus === 'active' ? '启用' : '禁用'} {selectedRowKeys.length} 个附加费吗？
        </div>
      </Modal>

      {/* 自定义表格抽屉 */}
      <Drawer
        width={480}
        title={
          <div className="flex items-center">
            <IconSettings className="mr-2" />
            <span>自定义表格设置</span>
          </div>
        }
        visible={customTableDrawerVisible}
        onCancel={closeCustomTableDrawer}
        footer={
          <div className="flex justify-between">
            <Button onClick={resetColumnVisibility}>重置默认</Button>
            <Space>
              <Button onClick={closeCustomTableDrawer}>取消</Button>
              <Button type="primary" onClick={applyColumnSettings}>确认</Button>
            </Space>
          </div>
        }
      >
        <div className="h-full flex flex-col">
          {/* 快捷操作 */}
          <div className="flex justify-between items-center mb-4 p-4 bg-gray-50">
            <div className="text-sm text-gray-600">
              已选择 {Object.values(columnVisibility).filter(Boolean).length}/{Object.keys(columnVisibility).length} 个字段
            </div>
            <Space>
              <Button size="small" onClick={() => {
                const newVisibility = {...columnVisibility};
                Object.keys(newVisibility).forEach(key => {
                  (newVisibility as any)[key] = true;
                });
                setColumnVisibility(newVisibility);
              }}>全选</Button>
              <Button size="small" onClick={() => {
                const newVisibility = {...columnVisibility};
                Object.keys(newVisibility).forEach(key => {
                  (newVisibility as any)[key] = false;
                });
                setColumnVisibility(newVisibility);
              }}>清空</Button>
            </Space>
          </div>
          
          {/* 可拖拽的字段列表 */}
          <div className="flex-1 overflow-y-auto px-4">
            {columnOrder.map((columnKey, index) => (
              <div
                key={columnKey}
                className={`
                  flex items-center justify-between p-3 mb-2 bg-white border cursor-move
                  hover:shadow-sm transition-all duration-200
                  ${draggedItem === columnKey ? 'opacity-50' : ''}
                  ${dragOverItem === columnKey ? 'border-blue-400 bg-blue-50' : 'border-gray-200'}
                `}
                draggable
                onDragStart={(e) => handleDragStart(e, columnKey)}
                onDragOver={(e) => handleDragOver(e, columnKey)}
                onDrop={(e) => handleDrop(e, columnKey)}
                onDragEnd={handleDragEnd}
              >
                <div className="flex items-center flex-1">
                  <IconDragDotVertical className="text-gray-400 mr-3 cursor-grab" />
                  <div className="flex items-center">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 mr-3 min-w-[30px] text-center">
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium">{getColumnLabel(columnKey)}</span>
                  </div>
                </div>
                <Switch 
                  size="small"
                  checked={columnVisibility[columnKey] || false} 
                  onChange={(checked) => handleColumnVisibilityChange(columnKey, checked)}
                />
              </div>
            ))}
          </div>
        </div>
      </Drawer>

      {/* 增减条件抽屉 - 与自定义表格一致的样式 */}
      <Drawer
        width={480}
        title={
          <div className="flex items-center">
            <IconSettings className="mr-2" />
            <span>筛选字段设置</span>
          </div>
        }
        visible={filterFieldModalVisible}
        onCancel={closeFilterFieldModal}
        footer={
          <div className="flex justify-between">
            <Button onClick={() => {
              const fields = getFilterFields();
              setFilterFieldOrder(fields.map(field => field.key));
              fields.forEach(field => {
                updateFilterConditionVisibility(field.key, true);
              });
            }}>重置默认</Button>
            <Space>
              <Button onClick={closeFilterFieldModal}>取消</Button>
              <Button type="primary" onClick={closeFilterFieldModal}>确认</Button>
            </Space>
          </div>
        }
      >
        <div className="h-full flex flex-col">
          {/* 快捷操作 */}
          <div className="flex justify-between items-center mb-4 p-4 bg-gray-50">
            <div className="text-sm text-gray-600">
              已选择 {filterConditions.filter(c => c.visible).length}/{getFilterFields().length} 个字段
            </div>
            <Space>
              <Button size="small" onClick={() => {
                getFilterFields().forEach(field => {
                  updateFilterConditionVisibility(field.key, true);
                });
              }}>全选</Button>
              <Button size="small" onClick={() => {
                getFilterFields().forEach(field => {
                  updateFilterConditionVisibility(field.key, false);
                });
              }}>清空</Button>
            </Space>
          </div>
          
          {/* 可拖拽的筛选字段列表 */}
          <div className="flex-1 overflow-y-auto px-4">
            {filterFieldOrder.map((fieldKey, index) => {
              const condition = filterConditions.find(c => c.key === fieldKey);
              const field = getFilterFields().find(f => f.key === fieldKey);
              if (!condition || !field) return null;

              return (
                <div
                  key={fieldKey}
                  className={`
                    flex items-center justify-between p-3 mb-2 bg-white border cursor-move
                    hover:shadow-sm transition-all duration-200
                    ${draggedFilterField === fieldKey ? 'opacity-50' : ''}
                    ${dragOverFilterField === fieldKey ? 'border-blue-400 bg-blue-50' : 'border-gray-200'}
                  `}
                  draggable
                  onDragStart={(e) => handleFilterFieldDragStart(e, fieldKey)}
                  onDragOver={(e) => handleFilterFieldDragOver(e, fieldKey)}
                  onDrop={(e) => handleFilterFieldDrop(e, fieldKey)}
                  onDragEnd={handleFilterFieldDragEnd}
                >
                  <div className="flex items-center flex-1">
                    <IconDragDotVertical className="text-gray-400 mr-3 cursor-grab" />
                    <div className="flex items-center">
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 mr-3 min-w-[30px] text-center">
                        {index + 1}
                      </span>
                      <span className="text-sm font-medium">{field.label}</span>
                    </div>
                  </div>
                  <Switch 
                    size="small"
                    checked={condition.visible} 
                    onChange={(checked) => updateFilterConditionVisibility(fieldKey, checked)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </Drawer>

      {/* 保存方案弹窗 */}
      <Modal
        title="保存筛选方案"
        visible={schemeModalVisible}
        onOk={saveFilterScheme}
        onCancel={closeSchemeModal}
        okText="保存"
        cancelText="取消"
      >
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            方案名称
          </label>
          <Input
            value={schemeName}
            onChange={setSchemeName}
            placeholder="请输入方案名称"
            maxLength={50}
          />
        </div>
      </Modal>

      {/* 方案管理弹窗 */}
      <SchemeManagementModal
        visible={schemeManagementModalVisible}
        onCancel={closeSchemeManagementModal}
        schemes={allSchemes}
        onDeleteScheme={handleDeleteScheme}
        onSetDefault={handleSetDefaultScheme}
        onRenameScheme={handleRenameScheme}
      />
    </ControlTowerSaasLayout>
  );
};

export default SurchargeManagement;