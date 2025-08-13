import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Input,
  Select,
  Table,
  Tag,
  Modal,
  Message,
  Switch,
  Space,
  Typography,
  Dropdown,
  Tooltip,
  Grid,
  Drawer,
  DatePicker
} from '@arco-design/web-react';
import {
  IconSearch,
  IconRefresh,
  IconPlus,
  IconMore,
  IconUp,
  IconDown,
  IconSettings
} from '@arco-design/web-react/icon';
import { useNavigate } from 'react-router-dom';
import SchemeSelect from './SchemeSelect';
import SchemeManagementModal, { SchemeData } from './SchemeManagementModal';

const { Option } = Select;
const RangePicker = DatePicker.RangePicker;
const { Title } = Typography;
const Row = Grid.Row;
const Col = Grid.Col;

// 合约数据接口
interface Contract {
  id: string;
  shipCompanyNumber: string; // 船公司约号
  applicableRoute: string[]; // 适用航线（改为数组支持多选）
  shipCompany: string; // 船公司
  contractNature: string; // 约价性质
  destinationName: string; // 适用品名
  nacs: string[]; // NAC列表（新增字段）
  mqc: string; // MQC
  configuration: string; // 舱保
  effectiveDate: string; // 有效期
  status: 'enabled' | 'disabled'; // 状态
}

// 船公司选项
const shipCompanyOptions = [
  { value: 'MSC', label: 'MSC | 地中海' },
  { value: 'COSCO', label: 'COSCO | 中远海运' },
  { value: 'OOCL', label: 'OOCL | 东方海外' },
  { value: 'CMA', label: 'CMA | 达飞轮船' },
  { value: 'ONE', label: 'ONE | 海洋网联' },
  { value: 'HAPAG', label: 'HAPAG | 赫伯罗特' },
  { value: 'ZIM', label: 'ZIM | 以星轮船' },
  { value: 'MAERSK', label: 'MAERSK | 马士基' },
  { value: 'EVERGREEN', label: 'EVERGREEN | 长荣海运' }
];

// 约价性质选项（按截图更新）
const contractNatureOptions = [
  { value: '自有约价', label: '自有约价' },
  { value: '客户约价', label: '客户约价' },
  { value: '海外代理约价', label: '海外代理约价' },
  { value: '无约价', label: '无约价' },
  { value: '同行约价', label: '同行约价' },
  { value: 'AFC约价', label: 'AFC约价' },
  { value: 'AFG约价', label: 'AFG约价' }
];

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

// 筛选字段配置
const getFilterFields = (): FilterFieldConfig[] => {
  return [
    { key: 'shipCompanyNumber', label: '船公司约号', type: 'text', placeholder: '请输入船公司约号' },
    { key: 'shipCompany', label: '船公司', type: 'select', placeholder: '请选择船公司', options: shipCompanyOptions },
    { key: 'contractNature', label: '约价性质', type: 'select', placeholder: '请选择约价性质', options: contractNatureOptions },
    { key: 'applicableRoute', label: '适用航线', type: 'text', placeholder: '请输入适用航线' },
    { key: 'destinationName', label: '适用品名', type: 'text', placeholder: '请输入适用品名' },
    { key: 'nacs', label: 'NAC', type: 'text', placeholder: '请输入NAC' },
    { key: 'mqc', label: 'MQC', type: 'text', placeholder: '请输入MQC' },
    { key: 'configuration', label: '舱保', type: 'text', placeholder: '请输入舱保' },
    { key: 'effectiveDate', label: '有效期', type: 'dateRange', placeholder: '请选择有效期' },
    { key: 'status', label: '状态', type: 'select', placeholder: '请选择状态', options: [
      { label: '启用', value: 'enabled' },
      { label: '禁用', value: 'disabled' }
    ]}
  ];
};

const ContractManagement: React.FC = () => {
  const navigate = useNavigate();
  const [contractData, setContractData] = useState<Contract[]>([]);
  const [filteredData, setFilteredData] = useState<Contract[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [currentContract, setCurrentContract] = useState<Contract | null>(null);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [batchAction, setBatchAction] = useState<'enable' | 'disable'>('enable');
  const [singleConfirmModalVisible, setSingleConfirmModalVisible] = useState(false);
  const [currentToggleRecord, setCurrentToggleRecord] = useState<Contract | null>(null);

  // 新的筛选功能状态
  const [customTableModalVisible, setCustomTableModalVisible] = useState(false);
  
  // 字段可见性状态 - 包含合约管理的所有字段
  const [columnVisibility, setColumnVisibility] = useState<{[key: string]: boolean}>({
    shipCompanyNumber: true,
    shipCompany: true,
    contractNature: true,
    applicableRoute: true,
    destinationName: true,
    nacs: true,
    mqc: true,
    configuration: true,
    effectiveDate: true,
    status: true
  });

  // 列顺序状态
  const [columnOrder, setColumnOrder] = useState([
    'shipCompanyNumber', 'shipCompany', 'contractNature', 'applicableRoute',
    'destinationName', 'nacs', 'mqc', 'configuration', 'effectiveDate', 'status'
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

  // 初始化默认筛选条件
  const initializeDefaultConditions = (): FilterCondition[] => {
    const fields = getFilterFields();
    return fields.slice(0, 4).map(field => ({
      key: field.key,
      mode: FilterMode.EQUAL,
      value: '',
      visible: true
    }));
  };

  // 初始化默认筛选方案
  const initializeDefaultScheme = (): FilterScheme => {
    return {
      id: 'default',
      name: '默认方案',
      conditions: initializeDefaultConditions(),
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
    const defaultConditions = initializeDefaultConditions();
    setFilterConditions(defaultConditions);
    
    // 重置到默认方案
    setCurrentSchemeId('default');
    const defaultScheme = initializeDefaultScheme();
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
      shipCompanyNumber: '船公司约号',
      shipCompany: '船公司',
      contractNature: '约价性质',
      applicableRoute: '适用航线',
      destinationName: '适用品名',
      nacs: 'NAC',
      mqc: 'MQC',
      configuration: '舱保',
      effectiveDate: '有效期',
      status: '状态'
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

  // 初始化筛选条件和方案
  useEffect(() => {
    const defaultConditions = initializeDefaultConditions();
    const defaultScheme = initializeDefaultScheme();
    
    setFilterConditions(defaultConditions);
    setFilterSchemes([defaultScheme]);
    setCurrentSchemeId('default');
    
    // 初始化筛选字段顺序
    const allFields = getFilterFields();
    setFilterFieldOrder(allFields.map(field => field.key));
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
      name: '常用合约筛选',
      isDefault: false,
      createTime: new Date(Date.now() - 86400000).toISOString(),
      conditions: []
    };
    
    const customScheme2: SchemeData = {
      id: 'custom2',
      name: 'MSC合约',
      isDefault: false,
      createTime: new Date(Date.now() - 172800000).toISOString(),
      conditions: []
    };
    
    setAllSchemes([defaultScheme, customScheme1, customScheme2]);
  }, []);

  // 初始化示例数据（更新数据结构）
  useEffect(() => {
    const mockData = [
      {
        id: '1',
        shipCompanyNumber: '888888',
        applicableRoute: ['亚欧航线'],
        shipCompany: 'MSC',
        contractNature: '客户约价',
        destinationName: '化工品',
        nacs: ['NAC001', 'NAC002', 'NAC003'],
        mqc: '140',
        configuration: '有（20 TEU/月）',
        effectiveDate: '2024-01-01 至 2024-12-31',
        status: 'enabled'
      },
      {
        id: '2',
        shipCompanyNumber: '20240510',
        applicableRoute: ['跨太平洋航线', '亚美航线'],
        shipCompany: 'COSCO',
        contractNature: '海外代理约价',
        destinationName: 'FAK',
        nacs: ['NAC004'],
        mqc: '220',
        configuration: '无',
        effectiveDate: '2024-05-10 至 2025-05-09',
        status: 'enabled'
      },
      {
        id: '3',
        shipCompanyNumber: 'WT2383333',
        applicableRoute: ['亚美航线'],
        shipCompany: 'OOCL',
        contractNature: 'AFC约价',
        destinationName: '特种柜',
        nacs: ['NAC005', 'NAC006'],
        mqc: '140',
        configuration: '有（20 TEU/月）',
        effectiveDate: '2024-04-01 至 2024-10-31',
        status: 'enabled'
      },
      {
        id: '4',
        shipCompanyNumber: '4',
        applicableRoute: ['地中海航线'],
        shipCompany: 'CMA',
        contractNature: '自有约价',
        destinationName: '冷冻货',
        nacs: ['NAC007', 'NAC008', 'NAC009', 'NAC010'],
        mqc: '120',
        configuration: '无',
        effectiveDate: '2024-03-15 至 2024-09-14',
        status: 'disabled'
      },
      {
        id: '5',
        shipCompanyNumber: 'MJ1',
        applicableRoute: ['亚洲区域航线'],
        shipCompany: 'ONE',
        contractNature: '同行约价',
        destinationName: '纺织品',
        nacs: ['NAC011'],
        mqc: '240',
        configuration: '有（100 TEU/月）',
        effectiveDate: '2024-02-15 至 2024-08-14',
        status: 'enabled'
      }
    ];

    setContractData(mockData as Contract[]);
    setFilteredData(mockData as Contract[]);
  }, []);

  // 显示单个切换状态确认弹窗
  const handleToggleStatus = (id: string) => {
    const record = contractData.find(item => item.id === id);
    if (record) {
      setCurrentToggleRecord(record);
      setSingleConfirmModalVisible(true);
    }
  };

  // 确认单个切换状态操作
  const handleConfirmSingleToggle = () => {
    if (currentToggleRecord) {
      const newStatus = currentToggleRecord.status === 'enabled' ? 'disabled' : 'enabled';
      const newData = contractData.map(item =>
        item.id === currentToggleRecord.id ? { ...item, status: newStatus } : item
      );
      setContractData(newData as Contract[]);
      setFilteredData(newData as Contract[]);
      setSingleConfirmModalVisible(false);
      setCurrentToggleRecord(null);
      Message.success(`已${newStatus === 'enabled' ? '启用' : '禁用'}`);
    }
  };

  // NAC显示渲染函数
  const renderNacs = (nacs: string[]) => {
    if (!nacs || nacs.length === 0) {
      return <span style={{ color: '#999' }}>-</span>;
    }

    if (nacs.length === 1) {
      return <Tag color="blue">{nacs[0]}</Tag>;
    }

    const firstNac = nacs[0];
    const remainingCount = nacs.length - 1;

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <Tag color="blue">{firstNac}</Tag>
        <Tooltip
          content={
            <div style={{ maxWidth: '200px' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>所有NAC：</div>
              {nacs.map((nac, index) => (
                <div key={index} style={{ padding: '2px 0' }}>
                  <Tag color="blue" size="small">{nac}</Tag>
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
  };

  // 表格列定义
  const columns = [
    {
      title: '船公司约号',
      dataIndex: 'shipCompanyNumber',
      width: 120,
      sorter: true,
    },
    {
      title: '适用航线',
      dataIndex: 'applicableRoute',
      width: 150,
      sorter: true,
      render: (routes: string[]) => {
        if (!routes || routes.length === 0) {
          return <span style={{ color: '#999' }}>-</span>;
        }
        if (routes.length === 1) {
          return <Tag color="blue">{routes[0]}</Tag>;
        }
        const firstRoute = routes[0];
        const remainingCount = routes.length - 1;
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Tag color="blue">{firstRoute}</Tag>
            <Tooltip
              content={
                <div style={{ maxWidth: '200px' }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>所有适用航线：</div>
                  {routes.map((route, index) => (
                    <div key={index} style={{ padding: '2px 0' }}>
                      <Tag color="blue" size="small">{route}</Tag>
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
      title: '船公司',
      dataIndex: 'shipCompany',
      width: 150,
      sorter: true,
      render: (shipCompany: string) => {
        const option = shipCompanyOptions.find(opt => opt.value === shipCompany);
        return option ? option.label : shipCompany;
      }
    },
    {
      title: '约价性质',
      dataIndex: 'contractNature',
      width: 120,
      sorter: true,
    },
    {
      title: '适用品名',
      dataIndex: 'destinationName',
      width: 120,
      sorter: true,
    },
    {
      title: 'NAC',
      dataIndex: 'nacs',
      width: 150,
      sorter: true,
      render: renderNacs
    },
    {
      title: 'MQC',
      dataIndex: 'mqc',
      width: 100,
      sorter: true,
    },
    {
      title: '舱保',
      dataIndex: 'configuration',
      width: 150,
      sorter: true,
    },
    {
      title: '有效期',
      dataIndex: 'effectiveDate',
      width: 200,
      sorter: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      sorter: true,
      render: (status: 'enabled' | 'disabled') => (
        <Tag color={status === 'enabled' ? 'green' : 'red'}>
          {status === 'enabled' ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: 200,
      fixed: 'right' as const,
      render: (_: unknown, record: Contract) => (
        <Space>
          <Button
            type="text"
            size="small"
            onClick={() => handleDetail(record)}
          >
            详情
          </Button>
          <Button
            type="text"
            size="small"
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Dropdown
            droplist={
              <div style={{ 
                padding: '4px 0',
                backgroundColor: '#fff',
                border: '1px solid #e5e6e7',
                borderRadius: '4px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
              }}>
                <Button
                  type="text"
                  size="small"
                  style={{ width: '100%', justifyContent: 'flex-start' }}
                  onClick={() => handleToggleStatus(record.id)}
                >
                  {record.status === 'enabled' ? '禁用' : '启用'}
                </Button>
              </div>
            }
            trigger="click"
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
      ),
    },
  ];

  // 详情处理
  const handleDetail = (record: Contract) => {
    setCurrentContract(record);
    setDetailModalVisible(true);
  };

  // 编辑处理（跳转到页面）
  const handleEdit = (record: Contract) => {
    navigate(`/controltower/saas/contract/edit/${record.id}`);
  };

  // 新增处理（跳转到页面）
  const handleAdd = () => {
    navigate('/controltower/saas/contract/add');
  };

  // 批量启用
  const handleBatchEnable = () => {
    setBatchAction('enable');
    setConfirmModalVisible(true);
  };

  // 批量禁用
  const handleBatchDisable = () => {
    setBatchAction('disable');
    setConfirmModalVisible(true);
  };

  // 确认批量操作
  const handleConfirmBatchAction = () => {
    const newStatus = batchAction === 'enable' ? 'enabled' : 'disabled';
    const newData = contractData.map(item =>
      selectedRowKeys.includes(item.id) ? { ...item, status: newStatus as 'enabled' | 'disabled' } : item
    );
    setContractData(newData);
    setFilteredData(newData);
    setSelectedRowKeys([]);
    setConfirmModalVisible(false);
    Message.success(`已${batchAction === 'enable' ? '启用' : '禁用'} ${selectedRowKeys.length} 条记录`);
  };

  return (
    <Card>


      {/* 新版筛选区域 */}
      {renderNewFilterArea()}

      {/* 操作按钮区域 */}
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Button type="primary" icon={<IconPlus />} onClick={handleAdd}>
            新增合约
          </Button>
          {selectedRowKeys.length > 0 && (
            <div style={{ 
              display: 'flex', 
              gap: '8px', 
              paddingLeft: '12px', 
              borderLeft: '1px solid #e5e6e7',
              marginLeft: '4px'
            }}>
              <Button 
                type="outline" 
                status="success"
                onClick={handleBatchEnable}
              >
                批量启用 ({selectedRowKeys.length})
              </Button>
              <Button 
                type="outline" 
                status="warning"
                onClick={handleBatchDisable}
              >
                批量禁用 ({selectedRowKeys.length})
              </Button>
            </div>
          )}
        </div>
        
        <Button 
          type="outline"
          icon={<IconSettings />} 
          onClick={openCustomTableModal}
        >
          自定义表格
        </Button>
      </div>

      <Table
        columns={columns}
        data={filteredData}
        rowKey="id"
        scroll={{ x: 1800 }}
        rowSelection={{
          selectedRowKeys,
          onChange: (selectedRowKeys) => {
            setSelectedRowKeys(selectedRowKeys as string[]);
          },
        }}
        pagination={{
          pageSize: 10,
          showTotal: true,
          showJumper: true,
          sizeCanChange: true,
        }}
      />

      {/* 批量操作确认弹窗 */}
      <Modal
        title={`批量${batchAction === 'enable' ? '启用' : '禁用'}确认`}
        visible={confirmModalVisible}
        onCancel={() => setConfirmModalVisible(false)}
        onOk={handleConfirmBatchAction}
        okText="确认"
        cancelText="取消"
        style={{ width: '400px' }}
        mask={true}
        maskClosable={false}
        autoFocus={false}
        focusLock={true}
      >
        <div style={{ padding: '16px 0' }}>
          <p>
            确定要{batchAction === 'enable' ? '启用' : '禁用'}选中的 {selectedRowKeys.length} 条合约记录吗？
          </p>
          <p style={{ color: '#999', fontSize: '12px', marginTop: '8px' }}>
            此操作将会{batchAction === 'enable' ? '启用' : '禁用'}所有选中的合约，请确认后操作。
          </p>
        </div>
      </Modal>

      {/* 单个操作确认弹窗 */}
      <Modal
        title={`${currentToggleRecord?.status === 'enabled' ? '禁用' : '启用'}确认`}
        visible={singleConfirmModalVisible}
        onCancel={() => {
          setSingleConfirmModalVisible(false);
          setCurrentToggleRecord(null);
        }}
        onOk={handleConfirmSingleToggle}
        okText="确认"
        cancelText="取消"
        style={{ width: '400px' }}
        mask={true}
        maskClosable={false}
        autoFocus={false}
        focusLock={true}
      >
        <div style={{ padding: '16px 0' }}>
          <p>
            确定要{currentToggleRecord?.status === 'enabled' ? '禁用' : '启用'}合约记录 "{currentToggleRecord?.shipCompanyNumber}" 吗？
          </p>
          <p style={{ color: '#999', fontSize: '12px', marginTop: '8px' }}>
            此操作将会{currentToggleRecord?.status === 'enabled' ? '禁用' : '启用'}该合约，请确认后操作。
          </p>
        </div>
      </Modal>

      {/* 详情弹窗 */}
      <Modal
        title="合约详情"
        visible={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={
          <Button onClick={() => setDetailModalVisible(false)}>
            关闭
          </Button>
        }
        style={{ width: '600px' }}
      >
        {currentContract && (
          <div style={{ padding: '16px 0' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>船公司约号</div>
                <div>{currentContract.shipCompanyNumber}</div>
              </div>
              <div>
                <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>适用航线</div>
                <div>{currentContract.applicableRoute.join(', ')}</div>
              </div>
              <div>
                <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>船公司</div>
                <div>{shipCompanyOptions.find(opt => opt.value === currentContract.shipCompany)?.label || currentContract.shipCompany}</div>
              </div>
              <div>
                <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>约价性质</div>
                <div>{currentContract.contractNature}</div>
              </div>
              <div>
                <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>适用品名</div>
                <div>{currentContract.destinationName}</div>
              </div>
              <div>
                <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>NAC</div>
                <div>{renderNacs(currentContract.nacs)}</div>
              </div>
              <div>
                <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>MQC</div>
                <div>{currentContract.mqc}</div>
              </div>
              <div>
                <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>舱保</div>
                <div>{currentContract.configuration}</div>
              </div>
              <div>
                <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>状态</div>
                <div>
                  <Tag color={currentContract.status === 'enabled' ? 'green' : 'red'}>
                    {currentContract.status === 'enabled' ? '启用' : '禁用'}
                  </Tag>
                </div>
              </div>
            </div>
            <div style={{ marginTop: '16px' }}>
              <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>有效期</div>
              <div>{currentContract.effectiveDate}</div>
            </div>
          </div>
        )}
      </Modal>

      {/* 自定义表格抽屉 */}
      <Drawer
        width={480}
        title="自定义表格"
        visible={customTableModalVisible}
        onCancel={closeCustomTableModal}
        footer={
          <div className="flex justify-between">
            <Button onClick={resetColumnVisibility}>
              重置
            </Button>
            <Space>
              <Button onClick={closeCustomTableModal}>
                取消
              </Button>
              <Button type="primary" onClick={applyColumnSettings}>
                确定
              </Button>
            </Space>
          </div>
        }
      >
        <div className="column-config-content">
          <div className="mb-4">
            <span className="text-gray-600 text-sm">
              拖拽调整列的显示顺序，勾选控制列的显示/隐藏
            </span>
          </div>
          
          <div className="column-list space-y-2">
            {columnOrder.map((columnKey, index) => (
              <div
                key={columnKey}
                className={`column-item flex items-center justify-between p-3 bg-gray-50 rounded border ${
                  draggedItem === columnKey ? 'opacity-50' : ''
                } ${dragOverItem === columnKey ? 'border-blue-400 bg-blue-50' : 'border-gray-200'}`}
                draggable
                onDragStart={(e) => handleDragStart(e, columnKey)}
                onDragOver={(e) => handleDragOver(e, columnKey)}
                onDrop={(e) => handleDrop(e, columnKey)}
                onDragEnd={handleDragEnd}
                style={{ cursor: 'move' }}
              >
                <div className="flex items-center">
                  <span className="drag-handle mr-3 text-gray-400 text-lg">
                    <i className="fas fa-grip-vertical"></i>
                  </span>
                  <span className="sequence-number mr-3 text-gray-500 text-sm min-w-[20px]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="column-label text-gray-700 font-medium">
                    {getColumnLabel(columnKey)}
                  </span>
                </div>
                <Switch
                  checked={columnVisibility[columnKey]}
                  onChange={(checked) => handleColumnVisibilityChange(columnKey, checked)}
                  size="small"
                />
              </div>
            ))}
          </div>
        </div>

        {/* 自定义表格抽屉样式 */}
        <style dangerouslySetInnerHTML={{
          __html: `
            .column-config-content {
              font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
            }
            
            .column-item {
              transition: all 0.2s ease;
              user-select: none;
            }
            
            .column-item:hover {
              border-color: #3b82f6 !important;
              box-shadow: 0 2px 8px rgba(59, 130, 246, 0.15);
            }
            
            .drag-handle {
              cursor: grab;
              opacity: 0.6;
              transition: opacity 0.2s ease;
            }
            
            .column-item:hover .drag-handle {
              opacity: 1;
            }
            
            .column-item:active .drag-handle {
              cursor: grabbing;
            }
            
            .sequence-number {
              font-family: 'JetBrains Mono', 'Consolas', monospace;
              background: #e5e7eb;
              border-radius: 4px;
              padding: 2px 6px;
              font-size: 12px;
              font-weight: 600;
            }
          `
        }} />
      </Drawer>

      {/* 筛选字段设置抽屉 */}
      <Drawer
        width={480}
        title="筛选字段设置"
        visible={filterFieldModalVisible}
        onCancel={closeFilterFieldModal}
        footer={
          <div className="flex justify-end">
            <Space>
              <Button onClick={closeFilterFieldModal}>
                取消
              </Button>
              <Button type="primary" onClick={closeFilterFieldModal}>
                确定
              </Button>
            </Space>
          </div>
        }
      >
        <div className="filter-field-config-content">
          <div className="mb-4">
            <span className="text-gray-600 text-sm">
              拖拽调整筛选字段的显示顺序，勾选控制字段的显示/隐藏
            </span>
          </div>
          
          <div className="filter-field-list space-y-2">
            {filterFieldOrder.map((fieldKey, index) => {
              const fieldConfig = getFilterFields().find(f => f.key === fieldKey);
              const condition = filterConditions.find(c => c.key === fieldKey);
              if (!fieldConfig || !condition) return null;
              
              return (
                <div
                  key={fieldKey}
                  className={`filter-field-item flex items-center justify-between p-3 bg-gray-50 rounded border ${
                    draggedFilterField === fieldKey ? 'opacity-50' : ''
                  } ${dragOverFilterField === fieldKey ? 'border-blue-400 bg-blue-50' : 'border-gray-200'}`}
                  draggable
                  onDragStart={(e) => handleFilterFieldDragStart(e, fieldKey)}
                  onDragOver={(e) => handleFilterFieldDragOver(e, fieldKey)}
                  onDrop={(e) => handleFilterFieldDrop(e, fieldKey)}
                  onDragEnd={handleFilterFieldDragEnd}
                  style={{ cursor: 'move' }}
                >
                  <div className="flex items-center">
                    <span className="drag-handle mr-3 text-gray-400 text-lg">
                      <i className="fas fa-grip-vertical"></i>
                    </span>
                    <span className="sequence-number mr-3 text-gray-500 text-sm min-w-[20px]">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="field-label text-gray-700 font-medium">
                      {fieldConfig.label}
                    </span>
                  </div>
                  <Switch
                    checked={condition.visible}
                    onChange={(checked) => updateFilterConditionVisibility(fieldKey, checked)}
                    size="small"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* 筛选字段抽屉样式 */}
        <style dangerouslySetInnerHTML={{
          __html: `
            .filter-field-config-content {
              font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
            }
            
            .filter-field-item {
              transition: all 0.2s ease;
              user-select: none;
            }
            
            .filter-field-item:hover {
              border-color: #3b82f6 !important;
              box-shadow: 0 2px 8px rgba(59, 130, 246, 0.15);
            }
          `
        }} />
      </Drawer>

      {/* 保存筛选方案弹窗 */}
      <Modal
        title="保存筛选方案"
        visible={schemeModalVisible}
        onCancel={closeSchemeModal}
        onOk={saveFilterScheme}
        okText="保存"
        cancelText="取消"
        style={{ width: '400px' }}
      >
        <div className="py-4">
          <div className="mb-3">
            <span className="text-gray-700 text-sm">方案名称：</span>
          </div>
          <Input
            placeholder="请输入方案名称"
            value={newSchemeName}
            onChange={setNewSchemeName}
            onPressEnter={saveFilterScheme}
            autoFocus
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
    </Card>
  );
};

export default ContractManagement;