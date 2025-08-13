import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Breadcrumb, 
  Typography, 
  Button, 
  Space, 
  Select, 
  Table, 
  Modal, 
  Grid, 
  Switch, 
  Tooltip, 
  Tabs,
  Input,
  DatePicker,
  Drawer,
  Message,
  Dropdown,
  Menu
} from '@arco-design/web-react';
import { 
  IconSearch, 
  IconRefresh, 
  IconList, 
  IconDragDotVertical, 
  IconDownload, 
  IconPlus,
  IconUp,
  IconDown,
  IconSettings
} from '@arco-design/web-react/icon';
import { useNavigate } from 'react-router-dom';
import ControlTowerSaasLayout from "./ControlTowerSaasLayout";
import SchemeSelect from './SchemeSelect';
import SchemeManagementModal, { SchemeData } from './SchemeManagementModal';
import './InquiryManagement.css';

const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
const Title = Typography.Title;
const TabPane = Tabs.TabPane;
const Row = Grid.Row;
const Col = Grid.Col;

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

// 筛选模式选项
const FilterModeOptions = [
  { label: '等于', value: FilterMode.EQUAL },
  { label: '不等于', value: FilterMode.NOT_EQUAL },
  { label: '包含', value: FilterMode.CONTAINS },
  { label: '不包含', value: FilterMode.NOT_CONTAINS },
  { label: '为空', value: FilterMode.IS_EMPTY },
  { label: '不为空', value: FilterMode.IS_NOT_EMPTY },
  { label: '批量', value: FilterMode.BATCH }
];

// 筛选字段配置接口
export interface FilterFieldConfig {
  key: string;
  label: string;
  type: 'text' | 'select' | 'dateRange' | 'number';
  options?: { label: string; value: string }[];
  placeholder?: string;
  width?: number;
}

// 筛选条件值接口
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

// 根据Tab获取筛选字段配置
const getFilterFieldsByTab = (activeTab: string): FilterFieldConfig[] => {
  const fields: FilterFieldConfig[] = [
    { key: 'quoteNo', label: '报价编号', type: 'text', placeholder: '请输入报价编号' },
    { key: 'inquiryNo', label: '询价编号', type: 'text', placeholder: '请输入询价编号' },
    { key: 'quoter', label: '报价人', type: 'text', placeholder: '请输入报价人' },
    { 
      key: 'demandSource', 
      label: '需求来源', 
      type: 'select', 
      placeholder: '请选择需求来源', 
      options: [
        { label: '外部询价', value: 'external_inquiry' },
        { label: '内部询价', value: 'internal_inquiry' },
        { label: '直接创建', value: 'direct_create' }
      ]
    },
  ];

  // 根据不同Tab类型添加不同的报价状态字段
  if (activeTab === 'precarriage') {
    // 港前报价：只有港前报价状态
    fields.push({
      key: 'firstQuoteStatus', 
      label: '港前报价状态', 
      type: 'select', 
      placeholder: '请选择港前报价状态', 
      options: [
        { label: '待报价', value: 'pending' },
        { label: '已报价', value: 'quoted' },
        { label: '拒绝报价', value: 'rejected' },
        { label: '无需报价', value: 'not_needed' }
      ]
    });
  } else if (activeTab === 'oncarriage') {
    // 尾程报价：只有尾程报价状态
    fields.push({
      key: 'lastQuoteStatus', 
      label: '尾程报价状态', 
      type: 'select', 
      placeholder: '请选择尾程报价状态', 
      options: [
        { label: '待报价', value: 'pending' },
        { label: '已报价', value: 'quoted' },
        { label: '拒绝报价', value: 'rejected' },
        { label: '无需报价', value: 'not_needed' }
      ]
    });
      } else {
      // 其他Tab：包含所有报价状态
      fields.push(
        {
          key: 'firstQuoteStatus', 
          label: '港前报价状态', 
          type: 'select', 
          placeholder: '请选择港前报价状态', 
          options: [
            { label: '待报价', value: 'pending' },
            { label: '已报价', value: 'quoted' },
            { label: '拒绝报价', value: 'rejected' },
            { label: '无需报价', value: 'not_needed' }
          ]
        },
        {
          key: 'mainQuoteStatus', 
          label: '干线报价状态', 
          type: 'select', 
          placeholder: '请选择干线报价状态', 
          options: [
            { label: '待报价', value: 'pending' },
            { label: '已报价', value: 'quoted' },
            { label: '拒绝报价', value: 'rejected' }
          ]
        },
        {
          key: 'lastQuoteStatus', 
          label: '尾程报价状态', 
          type: 'select', 
          placeholder: '请选择尾程报价状态', 
          options: [
            { label: '待报价', value: 'pending' },
            { label: '已报价', value: 'quoted' },
            { label: '拒绝报价', value: 'rejected' },
            { label: '无需报价', value: 'not_needed' }
          ]
        }
      );
    }

  // 添加常用筛选字段（在报价状态字段之后）
  const priorityFields: FilterFieldConfig[] = [
    { key: 'validityDate', label: '有效期', type: 'dateRange', placeholder: '请选择有效期' },
    { key: 'cargoReadyTime', label: '货好时间', type: 'select', placeholder: '请选择货好时间', options: [
      { label: '一周内', value: 'within_week' },
      { label: '两周内', value: 'within_two_weeks' },
      { label: '一个月内', value: 'within_month' },
      { label: '暂不确定', value: 'tbd' },
      { label: '具体日期', value: 'specific_date' }
    ]},
    { key: 'cargoNature', label: '货盘性质', type: 'select', placeholder: '请选择货盘性质', options: [
      { label: '仅询价', value: 'inquiry_only' },
      { label: '实盘', value: 'real_cargo' }
    ]},
    { key: 'route', label: '航线', type: 'select', placeholder: '请选择航线', options: [
      { label: '美加线', value: 'north_america' },
      { label: '东南亚线', value: 'southeast_asia' },
      { label: '欧洲线', value: 'europe' },
      { label: '中东线', value: 'middle_east' },
      { label: '澳洲线', value: 'australia' },
      { label: '南美线', value: 'south_america' },
      { label: '非洲线', value: 'africa' },
      { label: '日韩线', value: 'japan_korea' }
    ]},
    { key: 'transitType', label: '直达/中转', type: 'select', placeholder: '请选择直达/中转', options: [
      { label: '直达', value: 'direct' },
      { label: '中转', value: 'transit' }
    ]},
    { key: 'departurePort', label: '起运港', type: 'text', placeholder: '请输入起运港' },
    { key: 'dischargePort', label: '卸货港', type: 'text', placeholder: '请输入卸货港' },
    { key: 'remark', label: '备注', type: 'text', placeholder: '请输入备注' },
    { key: 'createdAt', label: '创建时间', type: 'dateRange', placeholder: '请选择创建时间' },
    { key: 'entryPerson', label: '创建人', type: 'text', placeholder: '请输入创建人' },
    { key: 'createDate', label: '创建日期', type: 'dateRange', placeholder: '请选择创建日期范围' },
    { key: 'rateModifier', label: '修改人', type: 'text', placeholder: '请输入修改人' },
    { key: 'modifyDate', label: '修改日期', type: 'dateRange', placeholder: '请选择修改日期范围' }
  ];

  fields.push(...priorityFields);

  // 根据不同Tab添加特定字段
  switch (activeTab) {
    case 'fcl':
      fields.push({ key: 'containerInfo', label: '箱型箱量', type: 'text', placeholder: '请输入箱型箱量' });
      break;
    case 'lcl':
    case 'air':
      fields.push(
        { key: 'weight', label: '重量', type: 'number', placeholder: '请输入重量' },
        { key: 'volume', label: '体积', type: 'number', placeholder: '请输入体积' }
      );
      break;
  }
  
  return fields;
};

// 定义报价项接口
interface QuoteItem {
  quoteNo: string;
  inquiryNo: string;
  quoter: string;
  demandSource: string; // 需求来源
  firstQuoteStatus: string;
  mainQuoteStatus: string;
  lastQuoteStatus: string;
  validityDate: string;
  cargoReadyTime: string;
  cargoNature: string;
  transitType: string;
  route: string;
  departurePort: string;
  dischargePort: string;
  remark: string;
  createdAt: string;
  // 新增字段
  entryPerson: string; // 创建人
  createDate: string; // 创建时间
  rateModifier: string; // 修改人
  modifyDate: string; // 修改时间
  // FCL特有
  containerInfo?: string;
  // LCL/Air特有
  weight?: string;
  volume?: string;
}

// 定义列类型接口
interface ColumnItem {
  title: string;
  dataIndex?: string;
  width?: number;
  sorter?: boolean;
  resizable?: boolean;
  fixed?: 'left' | 'right';
  className?: string;
  render?: (value: string, record: QuoteItem) => React.ReactNode;
}

const QuoteManagement: React.FC = () => {
  // 基础状态
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate();
  
  // 当前选中的Tab
  const [activeTab, setActiveTab] = useState<string>('fcl');

  // 自定义表格状态
  const [customTableModalVisible, setCustomTableModalVisible] = useState(false);
  
  // 字段可见性状态 - 包含报价管理的所有字段
  const [columnVisibility, setColumnVisibility] = useState({
    quoteNo: true,
    inquiryNo: true,
    quoter: true,
    demandSource: true,
    firstQuoteStatus: true,
    mainQuoteStatus: true,
    lastQuoteStatus: true,
    validityDate: true,
    containerInfo: true,
    cargoReadyTime: true,
    cargoNature: true,
    transitType: true,
    route: true,
    departurePort: true,
    dischargePort: true,
    remark: true,
    createdAt: true,
    weight: true,
    volume: true,
    entryPerson: false,
    createDate: false,
    rateModifier: false,
    modifyDate: false
  });

  // 列顺序状态
  const [columnOrder, setColumnOrder] = useState([
    'quoteNo', 'inquiryNo', 'quoter', 'demandSource',
    'firstQuoteStatus', 'mainQuoteStatus', 'lastQuoteStatus', 'validityDate',
    'containerInfo', 'cargoReadyTime', 'cargoNature', 'transitType', 'route', 'departurePort', 
    'dischargePort', 'remark', 'createdAt',
    'weight', 'volume', 'entryPerson', 'createDate', 
    'rateModifier', 'modifyDate'
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
  const [newSchemeName, setNewSchemeName] = useState('');
  
  // 方案管理相关状态
  const [schemeManagementModalVisible, setSchemeManagementModalVisible] = useState(false);
  const [allSchemes, setAllSchemes] = useState<SchemeData[]>([]);

  // 筛选字段拖拽状态
  const [filterFieldOrder, setFilterFieldOrder] = useState<string[]>([]);
  const [draggedFilterField, setDraggedFilterField] = useState<string | null>(null);
  const [dragOverFilterField, setDragOverFilterField] = useState<string | null>(null);

  // 初始化筛选条件和方案
  useEffect(() => {
    const defaultConditions = initializeDefaultConditions(activeTab);
    const defaultScheme = initializeDefaultScheme(activeTab);
    
    setFilterConditions(defaultConditions);
    setFilterSchemes([defaultScheme]);
    setCurrentSchemeId('default');
    
    // 初始化筛选字段顺序
    const allFields = getFilterFieldsByTab(activeTab);
    setFilterFieldOrder(allFields.map(field => field.key));
  }, [activeTab]);

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
      name: '常用报价筛选',
      isDefault: false,
      createTime: new Date(Date.now() - 86400000).toISOString(),
      conditions: []
    };
    
    const customScheme2: SchemeData = {
      id: 'custom2',
      name: '美线报价',
      isDefault: false,
      createTime: new Date(Date.now() - 172800000).toISOString(),
      conditions: []
    };
    
    setAllSchemes([defaultScheme, customScheme1, customScheme2]);
  }, []);

  // 导航到报价页面
  const navigateToQuoteForm = () => {
    // 根据当前选中的Tab类型跳转到对应页面
    switch(activeTab) {
      case 'fcl':
        navigate('/controltower/saas/quote-form/fcl');
        break;
      case 'lcl':
        navigate('/controltower/saas/quote-form/lcl');
        break;
      case 'air':
        navigate('/controltower/saas/quote-form/air');
        break;
      case 'precarriage':
        navigate('/controltower/saas/quote-form/precarriage');
        break;
      case 'oncarriage':
        navigate('/controltower/saas/quote-form/oncarriage');
        break;
      default:
        navigate('/controltower/saas/quote-form/fcl');
    }
  };

  // 导航到编辑报价页面
  const navigateToEditQuote = (quoteNo: string) => {
    // 根据当前选中的Tab类型跳转到对应编辑页面
    switch(activeTab) {
      case 'fcl':
        navigate(`/controltower/saas/quote-form/fcl/${quoteNo}`);
        break;
      case 'lcl':
        navigate(`/controltower/saas/quote-form/lcl/${quoteNo}`);
        break;
      case 'air':
        navigate(`/controltower/saas/quote-form/air/${quoteNo}`);
        break;
      case 'precarriage':
        navigate(`/controltower/saas/quote-form/precarriage/${quoteNo}`);
        break;
      case 'oncarriage':
        navigate(`/controltower/saas/quote-form/oncarriage/${quoteNo}`);
        break;
      default:
        navigate(`/controltower/saas/quote-form/fcl/${quoteNo}`);
    }
  };

  // 处理Tab切换
  const handleTabChange = (key: string) => {
    setActiveTab(key);
    // 重置分页
    setCurrent(1);
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

  // 初始化默认筛选条件
  const initializeDefaultConditions = (activeTab: string): FilterCondition[] => {
    const fields = getFilterFieldsByTab(activeTab);
    
    // 创建所有字段的筛选条件
    const conditions: FilterCondition[] = fields.map((field, index) => ({
      key: field.key,
      mode: FilterMode.EQUAL,
      value: '',
      visible: index < 4 // 前4个字段默认可见
    }));
    
    return conditions;
  };

  // 初始化默认筛选方案
  const initializeDefaultScheme = (activeTab: string): FilterScheme => {
    return {
      id: 'default',
      name: '默认方案',
      conditions: initializeDefaultConditions(activeTab),
      isDefault: true
    };
  };

  // 获取可见的筛选条件
  const getVisibleConditions = (): FilterCondition[] => {
    return filterConditions.filter(condition => condition.visible);
  };

  // 获取第一行筛选条件（收起状态下显示的条件）
  const getFirstRowConditions = (): FilterCondition[] => {
    return getVisibleConditions().slice(0, 4);
  };

  // 切换筛选区展开/收起
  const toggleFilterExpanded = () => {
    setFilterExpanded(!filterExpanded);
  };

  // 更新筛选条件
  const updateFilterCondition = (key: string, mode: FilterMode, value: any) => {
    setFilterConditions(prev => prev.map(condition =>
      condition.key === key ? { ...condition, mode, value } : condition
    ));
  };

  // 重置筛选条件
  const resetFilterConditions = () => {
    const defaultConditions = initializeDefaultConditions(activeTab);
    setFilterConditions(defaultConditions);
    
    // 重置到默认方案
    setCurrentSchemeId('default');
    const defaultScheme = initializeDefaultScheme(activeTab);
    setFilterSchemes(prev => prev.map(scheme => 
      scheme.id === 'default' ? defaultScheme : scheme
    ));
  };

  // 应用筛选方案
  const applyFilterScheme = (schemeId: string) => {
    setCurrentSchemeId(schemeId);
    const scheme = filterSchemes.find(s => s.id === schemeId);
    if (scheme) {
      setFilterConditions(scheme.conditions);
    }
  };

  // 打开筛选字段Modal
  const openFilterFieldModal = () => {
    setFilterFieldModalVisible(true);
  };

  // 关闭筛选字段Modal
  const closeFilterFieldModal = () => {
    setFilterFieldModalVisible(false);
  };

  // 打开保存方案Modal
  const openSchemeModal = () => {
    setNewSchemeName('');
    setSchemeModalVisible(true);
  };

  // 关闭保存方案Modal
  const closeSchemeModal = () => {
    setSchemeModalVisible(false);
    setNewSchemeName('');
  };

  // 保存筛选方案
  const saveFilterScheme = () => {
    if (!newSchemeName.trim()) {
      Message.error('请输入方案名称');
      return;
    }

    const newScheme: FilterScheme = {
      id: Date.now().toString(),
      name: newSchemeName.trim(),
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
    closeSchemeModal();
    Message.success('筛选方案保存成功');
  };

  // 更新筛选条件可见性
  const updateFilterConditionVisibility = (key: string, visible: boolean) => {
    setFilterConditions(prev => prev.map(condition =>
      condition.key === key ? { ...condition, visible } : condition
    ));
  };

  // 拖拽功能
  const handleDragStart = (_e: React.DragEvent, columnKey: string) => {
    setDraggedItem(columnKey);
  };

  const handleDragOver = (e: React.DragEvent, columnKey: string) => {
    e.preventDefault();
    setDragOverItem(columnKey);
  };

  const handleDrop = (e: React.DragEvent, targetColumnKey: string) => {
    e.preventDefault();
    if (draggedItem && draggedItem !== targetColumnKey) {
      const newOrder = [...columnOrder];
      const draggedIndex = newOrder.indexOf(draggedItem);
      const targetIndex = newOrder.indexOf(targetColumnKey);
      
      newOrder.splice(draggedIndex, 1);
      newOrder.splice(targetIndex, 0, draggedItem);
      
      setColumnOrder(newOrder);
    }
    setDraggedItem(null);
    setDragOverItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverItem(null);
  };

  // 筛选字段拖拽功能
  const handleFilterFieldDragStart = (_e: React.DragEvent, fieldKey: string) => {
    setDraggedFilterField(fieldKey);
  };

  const handleFilterFieldDragOver = (e: React.DragEvent, fieldKey: string) => {
    e.preventDefault();
    setDragOverFilterField(fieldKey);
  };

  const handleFilterFieldDrop = (e: React.DragEvent, targetFieldKey: string) => {
    e.preventDefault();
    if (draggedFilterField && draggedFilterField !== targetFieldKey) {
      const newOrder = [...filterFieldOrder];
      const draggedIndex = newOrder.indexOf(draggedFilterField);
      const targetIndex = newOrder.indexOf(targetFieldKey);
      
      newOrder.splice(draggedIndex, 1);
      newOrder.splice(targetIndex, 0, draggedFilterField);
      
      setFilterFieldOrder(newOrder);
    }
    setDraggedFilterField(null);
    setDragOverFilterField(null);
  };

  const handleFilterFieldDragEnd = () => {
    setDraggedFilterField(null);
    setDragOverFilterField(null);
  };

  // 获取列标签（中文名称）
  const getColumnLabel = (columnKey: string): string => {
    const labelMap: { [key: string]: string } = {
      quoteNo: '报价编号',
      inquiryNo: '询价编号',
      quoter: '报价人',
      demandSource: '需求来源',
      firstQuoteStatus: '港前报价状态',
      mainQuoteStatus: '干线报价状态',
      lastQuoteStatus: '尾程报价状态',
      validityDate: '有效期',
      containerInfo: '箱型箱量',
      cargoReadyTime: '货好时间',
      cargoNature: '货盘性质',
      transitType: '直达/中转',
      route: '航线',
      departurePort: '起运港',
      dischargePort: '卸货港',
      remark: '备注',
      createdAt: '创建时间',
      weight: '重量',
      volume: '体积',
      entryPerson: '创建人',
      createDate: '创建日期',
      rateModifier: '修改人',
      modifyDate: '修改日期'
    };
    
    return labelMap[columnKey] || columnKey;
  };

  // 自定义表格Modal控制
  const openCustomTableModal = () => {
    setCustomTableModalVisible(true);
  };

  const closeCustomTableModal = () => {
    setCustomTableModalVisible(false);
  };

  // 处理列可见性变化
  const handleColumnVisibilityChange = (column: string, visible: boolean) => {
    setColumnVisibility(prev => ({
      ...prev,
      [column]: visible
    }));
  };

  // 重置列可见性
  const resetColumnVisibility = () => {
    const resetVisibility = Object.keys(columnVisibility).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {} as any);
    setColumnVisibility(resetVisibility);
  };

  // 应用表格设置
  const applyColumnSettings = () => {
    closeCustomTableModal();
    Message.success('表格设置已保存');
  };

  // 渲染筛选条件
  const renderFilterCondition = (condition: FilterCondition) => {
    const fieldConfig = getFilterFieldsByTab(activeTab).find(field => field.key === condition.key);
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
              style={{ width: '90px' }}
              size="mini"
              className="filter-mode-select"
            >
              {FilterModeOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </div>
          
          {/* 输入控件 - 占满整个宽度 */}
          <div className="filter-input-wrapper">
            {fieldConfig.type === 'text' && (
              <Input
                placeholder={isInputDisabled ? '（自动判断）' : fieldConfig.placeholder}
                value={condition.value || ''}
                onChange={handleValueChange}
                disabled={isInputDisabled}
                allowClear
                style={{ width: '100%' }}
              />
            )}
            {fieldConfig.type === 'select' && (
              <Select
                placeholder={isInputDisabled ? '（自动判断）' : fieldConfig.placeholder}
                value={condition.value}
                onChange={handleValueChange}
                disabled={isInputDisabled}
                allowClear
                style={{ width: '100%' }}
              >
                {fieldConfig.options?.map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            )}
            {fieldConfig.type === 'dateRange' && (
              <RangePicker
                value={condition.value}
                onChange={handleValueChange}
                disabled={isInputDisabled}
                style={{ width: '100%' }}
                placeholder={isInputDisabled ? ['（自动判断）', ''] : ['开始日期', '结束日期']}
              />
            )}
            {fieldConfig.type === 'number' && (
              <Input
                placeholder={isInputDisabled ? '（自动判断）' : fieldConfig.placeholder}
                value={condition.value || ''}
                onChange={handleValueChange}
                disabled={isInputDisabled}
                allowClear
                style={{ width: '100%' }}
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

    // 根据Tab获取当前要显示的列
  const getColumns = () => {
    // 基础列（所有类型共有）
    const baseColumns: ColumnItem[] = [
      { title: '报价编号', dataIndex: 'quoteNo', width: 140, sorter: true, resizable: true, render: (val: string) => <Tooltip content={val} mini><span className="no-ellipsis">{val}</span></Tooltip> },
      { title: '询价编号', dataIndex: 'inquiryNo', width: 140, sorter: true, resizable: true, render: (val: string) => <Tooltip content={val} mini><span className="no-ellipsis">{val}</span></Tooltip> },
      { title: '报价人', dataIndex: 'quoter', width: 100, sorter: true, resizable: true, render: (val: string) => <Tooltip content={val} mini><span className="no-ellipsis">{val}</span></Tooltip> },
      { title: '需求来源', dataIndex: 'demandSource', width: 120, sorter: true, resizable: true, render: (val: string) => <Tooltip content={val} mini><span className="no-ellipsis">{val}</span></Tooltip> },
    ];

    // 根据不同Tab添加不同的报价状态列
    if (activeTab === 'precarriage') {
      // 港前报价：只显示港前报价状态
      baseColumns.push({
        title: '港前报价状态', 
        dataIndex: 'firstQuoteStatus', 
        sorter: true, 
        resizable: true, 
        width: 150,
        render: (val: string) => {
          let color = '';
          switch(val) {
            case '待报价':
              color = '#F7BA1E'; // 黄色
              break;
            case '已报价':
              color = '#00B42A'; // 绿色
              break;
            case '拒绝报价':
              color = '#F53F3F'; // 红色
              break;
            case '无需报价':
              color = '#86909C'; // 灰色
              break;
            default:
              color = '#86909C'; // 默认灰色
          }
          return (
            <Tooltip content={val} mini>
              <div className="flex items-center">
                <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: color, marginRight: 8 }}></div>
                <span className="no-ellipsis">{val}</span>
              </div>
            </Tooltip>
          );
        }
      });
    } else if (activeTab === 'oncarriage') {
      // 尾程报价：只显示尾程报价状态
      baseColumns.push({
        title: '尾程报价状态', 
        dataIndex: 'lastQuoteStatus', 
        sorter: true, 
        resizable: true, 
        width: 150,
        render: (val: string) => {
          let color = '';
          switch(val) {
            case '待报价':
              color = '#F7BA1E'; // 黄色
              break;
            case '已报价':
              color = '#00B42A'; // 绿色
              break;
            case '拒绝报价':
              color = '#F53F3F'; // 红色
              break;
            case '无需报价':
              color = '#86909C'; // 灰色
              break;
            default:
              color = '#86909C'; // 默认灰色
          }
          return (
            <Tooltip content={val} mini>
              <div className="flex items-center">
                <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: color, marginRight: 8 }}></div>
                <span className="no-ellipsis">{val}</span>
              </div>
            </Tooltip>
          );
        }
      });
    } else {
      // 其他Tab：显示所有报价状态
      baseColumns.push(
        { 
          title: '港前报价状态', 
          dataIndex: 'firstQuoteStatus', 
          sorter: true, 
          resizable: true, 
          width: 150,
          render: (val: string) => {
            let color = '';
            switch(val) {
              case '待报价':
                color = '#F7BA1E'; // 黄色
                break;
              case '已报价':
                color = '#00B42A'; // 绿色
                break;
              case '拒绝报价':
                color = '#F53F3F'; // 红色
                break;
              case '无需报价':
                color = '#86909C'; // 灰色
                break;
              default:
                color = '#86909C'; // 默认灰色
            }
            return (
              <Tooltip content={val} mini>
                <div className="flex items-center">
                  <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: color, marginRight: 8 }}></div>
                  <span className="no-ellipsis">{val}</span>
                </div>
              </Tooltip>
            );
          }
        },
        { 
          title: '干线报价状态', 
          dataIndex: 'mainQuoteStatus', 
          sorter: true, 
          resizable: true, 
          width: 150,
          render: (val: string) => {
            let color = '';
            switch(val) {
              case '待报价':
                color = '#F7BA1E'; // 黄色
                break;
              case '已报价':
                color = '#00B42A'; // 绿色
                break;
              case '拒绝报价':
                color = '#F53F3F'; // 红色
                break;
              default:
                color = '#86909C'; // 默认灰色
            }
            return (
              <Tooltip content={val} mini>
                <div className="flex items-center">
                  <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: color, marginRight: 8 }}></div>
                  <span className="no-ellipsis">{val}</span>
                </div>
              </Tooltip>
            );
          }
        },
        { 
          title: '尾程报价状态', 
          dataIndex: 'lastQuoteStatus', 
          sorter: true, 
          resizable: true, 
          width: 150,
          render: (val: string) => {
            let color = '';
            switch(val) {
              case '待报价':
                color = '#F7BA1E'; // 黄色
                break;
              case '已报价':
                color = '#00B42A'; // 绿色
                break;
              case '拒绝报价':
                color = '#F53F3F'; // 红色
                break;
              case '无需报价':
                color = '#86909C'; // 灰色
                break;
              default:
                color = '#86909C'; // 默认灰色
            }
            return (
              <Tooltip content={val} mini>
                <div className="flex items-center">
                  <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: color, marginRight: 8 }}></div>
                  <span className="no-ellipsis">{val}</span>
                </div>
              </Tooltip>
            );
          }
        }
      );
    }

    // 添加后续通用列
    baseColumns.push(
      { title: '有效期', dataIndex: 'validityDate', width: 160, sorter: true, resizable: true, render: (val: string) => {
          const parts = val.split(' 至 ');
          return (
            <Tooltip content={val} mini>
              <div className="flex flex-col text-xs leading-tight">
                <span className="no-ellipsis">{parts[0]}</span>
                {parts[1] && <span className="no-ellipsis text-gray-500">至 {parts[1]}</span>}
              </div>
            </Tooltip>
          );
        }
      },
      { title: '货好时间', dataIndex: 'cargoReadyTime', width: 160, sorter: true, resizable: true, render: (val: string) => {
          // 如果是具体日期（包含数字），则按日期处理，否则直接显示枚举值
          if (val && val.match(/\d{4}-\d{2}-\d{2}/)) {
            // 具体日期格式处理
            return (
              <Tooltip content={val} mini>
                <div className="flex flex-col text-xs leading-tight">
                  <span className="no-ellipsis">{val}</span>
                </div>
              </Tooltip>
            );
          } else {
            // 枚举值直接显示
            return (
              <Tooltip content={val} mini>
                <span className="no-ellipsis">{val}</span>
              </Tooltip>
            );
          }
        }
      },
      { title: '货盘性质', dataIndex: 'cargoNature', width: 100, sorter: true, resizable: true, render: (val: string) => <Tooltip content={val} mini><span className="no-ellipsis">{val}</span></Tooltip> },
      { title: '直达/中转', dataIndex: 'transitType', width: 100, sorter: true, resizable: true, render: (val: string) => <Tooltip content={val} mini><span className="no-ellipsis">{val}</span></Tooltip> },
      { title: '航线', dataIndex: 'route', width: 150, sorter: true, resizable: true, render: (val: string) => <Tooltip content={val} mini><span className="no-ellipsis">{val}</span></Tooltip> },
      { title: '起运港', dataIndex: 'departurePort', width: 160, sorter: true, resizable: true, render: (val: string) => <Tooltip content={val} mini><span className="no-ellipsis">{val}</span></Tooltip> },
      { title: '卸货港', dataIndex: 'dischargePort', width: 160, sorter: true, resizable: true, render: (val: string) => <Tooltip content={val} mini><span className="no-ellipsis">{val}</span></Tooltip> },
      { title: '备注', dataIndex: 'remark', width: 200, sorter: true, resizable: true, render: (val: string) => <Tooltip content={val} mini><span className="no-ellipsis">{val}</span></Tooltip> },
      { title: '创建时间', dataIndex: 'createdAt', width: 140, sorter: true, resizable: true, render: (val: string) => {
          const [date, time] = val.split(' ');
          return (
            <Tooltip content={val} mini>
              <div className="flex flex-col text-xs leading-tight">
                <span className="no-ellipsis">{date}</span>
                <span className="no-ellipsis text-gray-500">{time}</span>
              </div>
            </Tooltip>
          );
        }
      },
      { title: '创建人', dataIndex: 'entryPerson', width: 100, sorter: true, resizable: true, render: (val: string) => <Tooltip content={val} mini><span className="no-ellipsis">{val}</span></Tooltip> },
      { title: '创建日期', dataIndex: 'createDate', width: 140, sorter: true, resizable: true, render: (val: string) => {
          const [date, time] = val.split(' ');
          return (
            <Tooltip content={val} mini>
              <div className="flex flex-col text-xs leading-tight">
                <span className="no-ellipsis">{date}</span>
                <span className="no-ellipsis text-gray-500">{time}</span>
              </div>
            </Tooltip>
          );
        }
      },
      { title: '修改人', dataIndex: 'rateModifier', width: 100, sorter: true, resizable: true, render: (val: string) => <Tooltip content={val} mini><span className="no-ellipsis">{val}</span></Tooltip> },
      { title: '修改日期', dataIndex: 'modifyDate', width: 140, sorter: true, resizable: true, render: (val: string) => {
          const [date, time] = val.split(' ');
          return (
            <Tooltip content={val} mini>
              <div className="flex flex-col text-xs leading-tight">
                <span className="no-ellipsis">{date}</span>
                <span className="no-ellipsis text-gray-500">{time}</span>
              </div>
            </Tooltip>
          );
        }
      },
      { 
        title: '操作', 
        width: 210, 
        fixed: 'right' as const,
        className: 'action-column',
        render: (_: any, record: QuoteItem) => (
          <Space size={0}>
            <Button 
              type="text" 
              size="small" 
              onClick={() => navigate(`/controltower/saas/view-quote/${record.quoteNo}`)}
            >
              详情
            </Button>
            <Button 
              type="text" 
              size="small" 
              onClick={() => navigateToEditQuote(record.quoteNo)}
            >
              编辑
            </Button>
            <Dropdown
              droplist={
                <Menu>
                  <Menu.Item 
                    key="withdraw"
                    onClick={() => console.log('撤回', record.quoteNo)}
                  >
                    撤回
                  </Menu.Item>
                  <Menu.Item 
                    key="delete"
                    onClick={() => console.log('删除', record.quoteNo)}
                    style={{ color: '#F53F3F' }}
                  >
                    删除
                  </Menu.Item>
                </Menu>
              }
              trigger="click"
              position="bottom"
            >
              <Button 
                type="text" 
                size="small"
              >
                更多
              </Button>
            </Dropdown>
          </Space>
        )
      }
    );
    
    // 根据Tab类型插入特定列到有效期后面
    const insertIndex = baseColumns.findIndex(col => col.dataIndex === 'validityDate') + 1;
    
    if (activeTab === 'fcl') {
      baseColumns.splice(insertIndex, 0, 
        { title: '箱型箱量', dataIndex: 'containerInfo', width: 160, sorter: true, resizable: true, render: (val: string) => <Tooltip content={val} mini><span className="no-ellipsis">{val}</span></Tooltip> }
      );
    } else if (activeTab === 'lcl' || activeTab === 'air') {
      baseColumns.splice(insertIndex, 0, 
        { title: '重量(KGS)', dataIndex: 'weight', width: 120, sorter: true, resizable: true, render: (val: string) => <Tooltip content={val} mini><span className="no-ellipsis">{val}</span></Tooltip> },
        { title: '体积(CBM)', dataIndex: 'volume', width: 120, sorter: true, resizable: true, render: (val: string) => <Tooltip content={val} mini><span className="no-ellipsis">{val}</span></Tooltip> }
      );
    }
    
    return baseColumns;
  };

  const columns = getColumns();

  // Mock数据
  const mockData: QuoteItem[] = [
    {
      quoteNo: 'QT2024050001',
      inquiryNo: 'INQ2024050001',
      quoter: '张三',
      demandSource: '外部询价',
      firstQuoteStatus: '已报价',
      mainQuoteStatus: '已报价',
      lastQuoteStatus: '无需报价',
      validityDate: '2024-06-01 至 2024-06-30',
      cargoReadyTime: '2024-05-20',
      cargoNature: '实盘',
      transitType: '直达',
      route: '美加线',
      departurePort: 'CNSHA',
      dischargePort: 'USLAX',
      remark: '客户要求快船，自提货物',
      createdAt: '2024-05-01 10:30:00',
      containerInfo: '20GP*2, 40HC*1',
      entryPerson: '张三',
      createDate: '2024-05-01 10:30:00',
      rateModifier: '李四',
      modifyDate: '2024-05-01 12:30:00',
    },
    {
      quoteNo: 'QT2024050002',
      inquiryNo: 'INQ2024050002',
      quoter: '李四',
      demandSource: '内部询价',
      firstQuoteStatus: '无需报价',
      mainQuoteStatus: '已报价',
      lastQuoteStatus: '已报价',
      validityDate: '2024-07-01 至 2024-07-15',
      cargoReadyTime: '一周内',
      cargoNature: '仅询价',
      transitType: '中转',
      route: '欧洲线',
      departurePort: 'CNNGB',
      dischargePort: 'DEHAM',
      remark: '客户自己安排港前运输',
      createdAt: '2024-05-02 14:20:00',
      weight: '15.5吨',
      volume: '25.8立方米',
      entryPerson: '李四',
      createDate: '2024-05-02 14:20:00',
      rateModifier: '王五',
      modifyDate: '2024-05-02 16:20:00',
    },
    {
      quoteNo: 'QT2024050003',
      inquiryNo: 'INQ2024050003',
      quoter: '王五',
      demandSource: '直接创建',
      firstQuoteStatus: '已报价',
      mainQuoteStatus: '已报价',
      lastQuoteStatus: '拒绝报价',
      validityDate: '2024-05-10 至 2024-05-20',
      cargoReadyTime: '两周内',
      cargoNature: '实盘',
      transitType: '直达',
      route: '日韩线',
      departurePort: 'CNSHA',
      dischargePort: 'JPTYO',
      remark: '价格敏感客户',
      createdAt: '2024-05-03 09:15:00',
      containerInfo: '40HC*3',
      entryPerson: '王五',
      createDate: '2024-05-03 09:15:00',
      rateModifier: '赵六',
      modifyDate: '2024-05-03 11:15:00',
    },
    {
      quoteNo: 'QT2024050004',
      inquiryNo: 'INQ2024050004',
      quoter: '赵六',
      demandSource: '外部询价',
      firstQuoteStatus: '待报价',
      mainQuoteStatus: '待报价',
      lastQuoteStatus: '无需报价',
      validityDate: '2024-08-01 至 2024-08-15',
      cargoReadyTime: '一个月内',
      cargoNature: '仅询价',
      transitType: '中转',
      route: '澳洲线',
      departurePort: 'CNQIN',
      dischargePort: 'AUSYD',
      remark: '目的港自提货物',
      createdAt: '2024-05-04 16:45:00',
      weight: '22.3吨',
      volume: '18.5立方米',
      entryPerson: '赵六',
      createDate: '2024-05-04 16:45:00',
      rateModifier: '钱七',
      modifyDate: '2024-05-04 18:45:00',
    },
    {
      quoteNo: 'QT2024050005',
      inquiryNo: 'INQ2024050005',
      quoter: '钱七',
      demandSource: '内部询价',
      firstQuoteStatus: '无需报价',
      mainQuoteStatus: '已报价',
      lastQuoteStatus: '无需报价',
      validityDate: '2024-09-01 至 2024-09-15',
      cargoReadyTime: '暂不确定',
      cargoNature: '实盘',
      transitType: '直达',
      route: '东南亚线',
      departurePort: 'CNSZX',
      dischargePort: 'SGSIN',
      remark: '客户自安排首末端运输',
      createdAt: '2024-05-05 11:20:00',
      containerInfo: '20GP*5',
      entryPerson: '钱七',
      createDate: '2024-05-05 11:20:00',
      rateModifier: '孙八',
      modifyDate: '2024-05-05 13:20:00',
    },
    {
      quoteNo: 'QT2024050006',
      inquiryNo: 'INQ2024050006',
      quoter: '孙八',
      demandSource: '直接创建',
      firstQuoteStatus: '已报价',
      mainQuoteStatus: '已报价',
      lastQuoteStatus: '待报价',
      validityDate: '2024-10-01 至 2024-10-31',
      cargoReadyTime: '2024-09-25',
      cargoNature: '仅询价',
      transitType: '中转',
      route: '中东线',
      departurePort: 'CNSHA',
      dischargePort: 'AEJEA',
      remark: '需要特殊包装',
      createdAt: '2024-05-06 15:45:00',
      weight: '32.1吨',
      volume: '45.6立方米',
      entryPerson: '孙八',
      createDate: '2024-05-06 15:45:00',
      rateModifier: '周九',
      modifyDate: '2024-05-06 17:45:00',
    },
  ];

  const getCurrentData = () => {
    return mockData;
  };

  const data = getCurrentData();

  const pagination = {
    showTotal: true,
    total: data.length,
    pageSize,
    current,
    showJumper: true,
    sizeCanChange: true,
    pageSizeChangeResetCurrent: true,
    sizeOptions: [10, 20, 50, 100],
    onChange: (page: number) => setCurrent(page),
    onPageSizeChange: (size: number) => setPageSize(size),
  };

  return (
    <ControlTowerSaasLayout menuSelectedKey="10" breadcrumb={
      <Breadcrumb>
        <Breadcrumb.Item>询价报价</Breadcrumb.Item>
        <Breadcrumb.Item>报价管理</Breadcrumb.Item>
      </Breadcrumb>
    }>
      <Card>
        <Tabs activeTab={activeTab} onChange={handleTabChange} className="mb-4">
          <TabPane key="fcl" title="整箱报价" />
          <TabPane key="lcl" title="拼箱报价" />
          <TabPane key="air" title="空运报价" />
          <TabPane key="precarriage" title="港前报价" />
          <TabPane key="oncarriage" title="尾程报价" />
        </Tabs>
        {renderNewFilterArea()}
        <Card>
          <div className="flex justify-between mb-4">
            <Space>
              {/* 新增报价按钮 - 直接使用当前Tab类型 */}
              <Button 
                type="primary" 
                icon={<IconPlus />} 
                onClick={navigateToQuoteForm}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                {activeTab === 'fcl' ? '新增整箱报价' : 
                 activeTab === 'lcl' ? '新增拼箱报价' : 
                 activeTab === 'air' ? '新增空运报价' :
                 activeTab === 'precarriage' ? '新增港前报价' : '新增尾程报价'}
              </Button>
              
              {/* 导出列表按钮 */}
              <Button icon={<IconDownload />}>导出列表</Button>
            </Space>
            <div 
              className="flex items-center text-blue-500 cursor-pointer hover:text-blue-700"
              onClick={openCustomTableModal}
            >
              <IconList className="mr-1" />
              <span>自定义表格</span>
            </div>
          </div>
          <Table
            rowKey="quoteNo"
            loading={false}
            columns={columns}
            data={data}
            pagination={pagination}
            scroll={{ x: 2850 }}
            border={false}
            className="mt-4 inquiry-table-nowrap"
          />
          <div className="mt-2 text-gray-500 text-sm">共 {data.length} 条记录，每页 {pageSize} 条，共 {Math.ceil(data.length / pageSize)} 页</div>
        </Card>
        
        {/* 自定义表格抽屉 */}
        <Drawer
          width={480}
          title={
            <div className="flex items-center">
              <IconSettings className="mr-2" />
              <span>自定义表格设置</span>
            </div>
          }
          visible={customTableModalVisible}
          onCancel={closeCustomTableModal}
          footer={
            <div className="flex justify-between">
              <Button onClick={resetColumnVisibility}>重置默认</Button>
              <Space>
                <Button onClick={closeCustomTableModal}>取消</Button>
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
                    checked={(columnVisibility as any)[columnKey] || false} 
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
                const allFields = getFilterFieldsByTab(activeTab);
                const newConditions = allFields.map(field => ({
                  key: field.key,
                  mode: FilterMode.EQUAL,
                  value: '',
                  visible: true
                }));
                setFilterConditions(newConditions);
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
                已选择 {getVisibleConditions().length}/{getFilterFieldsByTab(activeTab).length} 个字段
              </div>
              <Space>
                <Button size="small" onClick={() => {
                  const allFields = getFilterFieldsByTab(activeTab);
                  setFilterConditions(prev => prev.map(condition => ({
                    ...condition,
                    visible: allFields.some(field => field.key === condition.key)
                  })));
                }}>全选</Button>
                <Button size="small" onClick={() => {
                  setFilterConditions(prev => prev.map(condition => ({
                    ...condition,
                    visible: false
                  })));
                }}>清空</Button>
              </Space>
            </div>
            
            {/* 可拖拽的筛选字段列表 */}
            <div className="flex-1 overflow-y-auto px-4">
              {filterFieldOrder.map((fieldKey, index) => {
                const condition = filterConditions.find(c => c.key === fieldKey);
                const fieldConfig = getFilterFieldsByTab(activeTab).find(f => f.key === fieldKey);
                if (!fieldConfig) return null;
                
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
                        <span className="text-sm font-medium">{fieldConfig.label}</span>
                      </div>
                    </div>
                    <Switch 
                      size="small"
                      checked={condition?.visible || false} 
                      onChange={(checked) => updateFilterConditionVisibility(fieldKey, checked)}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </Drawer>

        {/* 保存筛选方案弹窗 */}
        <Modal
          title="保存筛选方案"
          visible={schemeModalVisible}
          onCancel={closeSchemeModal}
          footer={[
            <Button key="cancel" onClick={closeSchemeModal}>取消</Button>,
            <Button key="save" type="primary" onClick={saveFilterScheme}>保存</Button>,
          ]}
          style={{ width: 400 }}
        >
          <div className="py-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">方案名称</label>
              <Input
                placeholder="请输入方案名称"
                value={newSchemeName}
                onChange={setNewSchemeName}
                maxLength={50}
              />
            </div>
            <div className="text-sm text-gray-500">
              将保存当前的筛选条件配置为新方案
            </div>
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
      </Card>
    </ControlTowerSaasLayout>
  );
};

export default QuoteManagement;