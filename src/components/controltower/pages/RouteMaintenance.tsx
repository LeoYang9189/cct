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
  Space,
  Typography,
  Dropdown,
  Tooltip,
  Grid,
  Drawer,
  Switch
} from '@arco-design/web-react';
import {
  IconSearch,
  IconRefresh,
  IconPlus,
  IconMore,
  IconUp,
  IconDown,
  IconSettings,
  IconDragDotVertical,

} from '@arco-design/web-react/icon';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;
// const { Title } = Typography;
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

// 船代信息接口
interface AgentInfo {
  spaceSharing: string; // 共舱方
  slotAgent: string; // 舱位船代
  dangerousAgent: string; // 危险品船代
}

// 时间信息接口
interface TimeInfo {
  weekday: string; // 周几 (1-7)
  time: string; // 时间 (HH:mm)
}

// 港口信息接口
interface PortInfo {
  id: string; // 唯一标识
  port: string; // 港口
  terminal: string; // 挂靠码头
  cutoffDate: TimeInfo; // 截关日
  sailingDate: TimeInfo; // 开船日
  terrorismCutoff: TimeInfo; // 截反恐申报
  siCutoff: TimeInfo; // 截单
  vgmCutoff: TimeInfo; // 截VGM
  oogCutoff: TimeInfo; // 截OOG List
  dangerousCutoff: TimeInfo; // 截危申报
  agents: AgentInfo[]; // 船代信息列表
}

// 航线数据接口
interface RouteData {
  id: string;
  routeCode: string; // 主航线代码
  routeName: string; // 航线名称
  alliance: string; // 归属联盟
  spaceSharing: string[]; // 共舱方（多选）- 保留用于基础信息
  ports: PortInfo[]; // 港口信息列表
  status: 'enabled' | 'disabled'; // 状态
  createTime: string; // 创建时间
  updateTime: string; // 更新时间
}

// 联盟选项
const allianceOptions = [
  { value: 'GEMINI', label: '双子星联盟（Gemini）' },
  { value: 'OCEAN_ALLIANCE', label: '海洋OA联盟（Ocean Alliance）' },
  { value: 'PREMIER_ALLIANCE', label: 'PA联盟 (Premier Alliance)' },
  { value: 'INDEPENDENT', label: '独立运营' }
];



// 筛选字段配置
const getFilterFields = (): FilterFieldConfig[] => {
  return [
    { key: 'routeCode', label: '主航线代码', type: 'text', placeholder: '请输入航线代码' },
    { key: 'routeName', label: '航线名称', type: 'text', placeholder: '请输入航线名称' },
    { key: 'alliance', label: '归属联盟', type: 'select', placeholder: '请选择联盟', options: allianceOptions },
    { key: 'ports', label: '挂靠港口', type: 'text', placeholder: '请输入港口代码' },
    { key: 'spaceSharing', label: '共舱方', type: 'text', placeholder: '请输入共舱方' },
    { key: 'slotAgent', label: '舱位船代', type: 'text', placeholder: '请输入舱位船代' },
    { key: 'status', label: '状态', type: 'select', placeholder: '请选择状态', options: [
      { label: '启用', value: 'enabled' },
      { label: '禁用', value: 'disabled' }
    ]}
  ];
};

// 港口选项
const portOptions = [
  { value: 'CNSHA', label: '上海港 Shanghai Port (CNSHA)' },
  { value: 'CNNGB', label: '宁波港 Ningbo Port (CNNGB)' },
  { value: 'CNSZN', label: '深圳港 Shenzhen Port (CNSZN)' },
  { value: 'CNQIN', label: '青岛港 Qingdao Port (CNQIN)' },
  { value: 'CNTXG', label: '天津港 Tianjin Port (CNTXG)' },
  { value: 'CNDLC', label: '大连港 Dalian Port (CNDLC)' },
  { value: 'CNXMN', label: '厦门港 Xiamen Port (CNXMN)' },
  { value: 'CNHKG', label: '香港港 Hong Kong Port (CNHKG)' },
  { value: 'SGSIN', label: '新加坡港 Singapore Port (SGSIN)' },
  { value: 'JPYOK', label: '横滨港 Yokohama Port (JPYOK)' },
  { value: 'JPTYO', label: '东京港 Tokyo Port (JPTYO)' },
  { value: 'JPKOB', label: '神户港 Kobe Port (JPKOB)' },
  { value: 'KRPUS', label: '釜山港 Busan Port (KRPUS)' },
  { value: 'USLAX', label: '洛杉矶港 Los Angeles Port (USLAX)' },
  { value: 'USLGB', label: '长滩港 Long Beach Port (USLGB)' },
  { value: 'USOAK', label: '奥克兰港 Oakland Port (USOAK)' },
  { value: 'USNYC', label: '纽约港 New York Port (USNYC)' },
  { value: 'USSAV', label: '萨凡纳港 Savannah Port (USSAV)' },
  { value: 'USCHA', label: '查尔斯顿港 Charleston Port (USCHA)' },
  { value: 'USNOR', label: '诺福克港 Norfolk Port (USNOR)' },
  { value: 'DEHAM', label: '汉堡港 Hamburg Port (DEHAM)' },
  { value: 'NLRTM', label: '鹿特丹港 Rotterdam Port (NLRTM)' },
  { value: 'BEANR', label: '安特卫普港 Antwerp Port (BEANR)' },
  { value: 'FRLEH', label: '勒阿弗尔港 Le Havre Port (FRLEH)' },
  { value: 'ITGOA', label: '热那亚港 Genoa Port (ITGOA)' },
  { value: 'ESVLC', label: '瓦伦西亚港 Valencia Port (ESVLC)' },
  { value: 'GBFEL', label: '费利克斯托港 Felixstowe Port (GBFEL)' },
  { value: 'GBLGP', label: '伦敦门户港 London Gateway Port (GBLGP)' }
];

// 周几选项
const weekdayOptions = [
  { value: '1', label: '周一' },
  { value: '2', label: '周二' },
  { value: '3', label: '周三' },
  { value: '4', label: '周四' },
  { value: '5', label: '周五' },
  { value: '6', label: '周六' },
  { value: '7', label: '周日' }
];

// 船公司选项（共舱方）
const spaceSharingOptions = [
  { value: 'MAERSK', label: 'MAERSK | 马士基' },
  { value: 'MSC', label: 'MSC | 地中海航运' },
  { value: 'COSCO', label: 'COSCO | 中远海运' },
  { value: 'EVERGREEN', label: 'EVERGREEN | 长荣海运' },
  { value: 'OOCL', label: 'OOCL | 东方海外' },
  { value: 'CMA', label: 'CMA | 达飞轮船' },
  { value: 'ONE', label: 'ONE | 海洋网联船务' },
  { value: 'HAPAG', label: 'HAPAG | 赫伯罗特' },
  { value: 'YANG_MING', label: 'YANG_MING | 阳明海运' },
  { value: 'HMM', label: 'HMM | 现代商船' },
  { value: 'ZIM', label: 'ZIM | 以星轮船' },
  { value: 'KLINE', label: 'KLINE | 川崎汽船' },
  { value: 'MOL', label: 'MOL | 商船三井' },
  { value: 'NYK', label: 'NYK | 日本邮船' },
  { value: 'PIL', label: 'PIL | 太平船务' },
  { value: 'WANHAI', label: 'WANHAI | 万海航运' },
  { value: 'TS_LINES', label: 'TS_LINES | 德翔海运' },
  { value: 'SINOTRANS', label: 'SINOTRANS | 中外运' }
];

const RouteMaintenance: React.FC = () => {
  const navigate = useNavigate();
  const [routeData, setRouteData] = useState<RouteData[]>([]);
  const [filteredData, setFilteredData] = useState<RouteData[]>([]);
  // const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [currentRoute, setCurrentRoute] = useState<RouteData | null>(null);
  // const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  // const [batchAction, setBatchAction] = useState<'enable' | 'disable'>('enable');
  const [singleConfirmModalVisible, setSingleConfirmModalVisible] = useState(false);
  const [currentToggleRecord, setCurrentToggleRecord] = useState<RouteData | null>(null);

  // 筛选功能状态
  const [customTableModalVisible, setCustomTableModalVisible] = useState(false);
  
  // 字段可见性状态
  const [columnVisibility, setColumnVisibility] = useState<{[key: string]: boolean}>({
    routeCode: true,
    routeName: true,
    alliance: true,
    ports: true,
    spaceSharing: true,
    status: true
  });

  // 列顺序状态
  const [columnOrder, setColumnOrder] = useState([
    'routeCode', 'routeName', 'alliance', 'ports', 'spaceSharing', 'status'
  ]);

  // 筛选条件状态
  const [filterConditions, setFilterConditions] = useState<FilterCondition[]>([]);
  const [filterSchemes, setFilterSchemes] = useState<FilterScheme[]>([]);
  const [currentSchemeId, setCurrentSchemeId] = useState<string>('default');

  // 筛选功能状态
  const [filterExpanded, setFilterExpanded] = useState(false);
  const [filterFieldModalVisible, setFilterFieldModalVisible] = useState(false);
  const [schemeModalVisible, setSchemeModalVisible] = useState(false);
  const [newSchemeName, setNewSchemeName] = useState('');

  // 拖拽状态
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragOverItem, setDragOverItem] = useState<string | null>(null);

  // 筛选字段拖拽状态
  const [filterFieldOrder, setFilterFieldOrder] = useState<string[]>([]);
  const [draggedFilterField, setDraggedFilterField] = useState<string | null>(null);
  const [dragOverFilterField, setDragOverFilterField] = useState<string | null>(null);

  // 初始化默认筛选条件
  const initializeDefaultConditions = (): FilterCondition[] => {
    const fields = getFilterFields();
    return fields.map(field => ({
      key: field.key,
      mode: FilterMode.EQUAL,
      value: undefined,
      visible: ['routeCode', 'routeName', 'alliance', 'status'].includes(field.key)
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



  // 切换筛选区域展开状态
  const toggleFilterExpanded = () => {
    setFilterExpanded(!filterExpanded);
  };

  // 更新筛选条件
  const updateFilterCondition = (key: string, mode: FilterMode, value: any) => {
    setFilterConditions(prev => 
      prev.map(condition => 
        condition.key === key ? { ...condition, mode, value } : condition
      )
    );
  };

  // 重置筛选条件
  const resetFilterConditions = () => {
    const defaultConditions = initializeDefaultConditions();
    setFilterConditions(defaultConditions);
    // 应用默认筛选方案
    const defaultScheme = filterSchemes.find(scheme => scheme.isDefault);
    if (defaultScheme) {
      setCurrentSchemeId('default');
    }
  };

  // 应用筛选方案
  const applyFilterScheme = (schemeId: string) => {
    const scheme = filterSchemes.find(s => s.id === schemeId);
    if (scheme) {
      setFilterConditions(scheme.conditions);
      setCurrentSchemeId(schemeId);
    }
  };

  // 打开筛选字段配置
  const openFilterFieldModal = () => {
    setFilterFieldModalVisible(true);
  };

  // 关闭筛选字段配置
  const closeFilterFieldModal = () => {
    setFilterFieldModalVisible(false);
  };

  // 打开筛选方案配置
  const openSchemeModal = () => {
    setSchemeModalVisible(true);
    setNewSchemeName('');
  };

  // 关闭筛选方案配置
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
      name: newSchemeName,
      conditions: [...filterConditions],
      isDefault: false
    };
    
    setFilterSchemes(prev => [...prev, newScheme]);
    Message.success('筛选方案保存成功');
    closeSchemeModal();
  };

  // 更新筛选条件可见性
  const updateFilterConditionVisibility = (key: string, visible: boolean) => {
    setFilterConditions(prev => 
      prev.map(condition => 
        condition.key === key ? { ...condition, visible } : condition
      )
    );
  };

  // 打开自定义表格弹窗
  const openCustomTableModal = () => {
    setCustomTableModalVisible(true);
  };

  // 关闭自定义表格弹窗
  const closeCustomTableModal = () => {
    setCustomTableModalVisible(false);
  };

  // 处理表格列可见性变更
  const handleColumnVisibilityChange = (column: string, visible: boolean) => {
    setColumnVisibility({
      ...columnVisibility,
      [column]: visible
    });
  };

  // 重置表格列可见性
  const resetColumnVisibility = () => {
    setColumnVisibility({
      routeCode: true,
      routeName: true,
      alliance: true,
      ports: true,
      spaceSharing: true,
      status: true
    });
  };

  // 应用表格列设置
  const applyColumnSettings = () => {
    Message.success('表格设置已应用');
    closeCustomTableModal();
  };

  // 拖拽排序处理函数
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
    
    if (draggedItem && draggedItem !== targetColumnKey) {
      const newOrder = [...columnOrder];
      const draggedIndex = newOrder.indexOf(draggedItem);
      const targetIndex = newOrder.indexOf(targetColumnKey);
      
      // 移动元素
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

  // 筛选字段拖拽排序处理函数
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
    
    if (draggedFilterField && draggedFilterField !== targetFieldKey) {
      const newOrder = [...filterFieldOrder];
      const draggedIndex = newOrder.indexOf(draggedFilterField);
      const targetIndex = newOrder.indexOf(targetFieldKey);
      
      // 移动元素
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

  // 获取列的中文名称
  const getColumnLabel = (columnKey: string): string => {
    const columnLabels: Record<string, string> = {
      routeCode: '主航线代码',
      routeName: '航线名称',
      alliance: '归属联盟',
      ports: '挂靠港口',
      spaceSharing: '共舱方',
      status: '状态'
    };
    return columnLabels[columnKey] || columnKey;
  };

  // 获取可见的筛选条件（用于渲染）
  const getVisibleConditions = (): FilterCondition[] => {
    return filterConditions.filter(condition => condition.visible);
  };

  // 获取第一行筛选条件（用于收起状态）
  const getFirstRowConditions = (): FilterCondition[] => {
    const visibleConditions = getVisibleConditions();
    return visibleConditions.slice(0, 4); // 假设第一行显示4个条件
  };

  // 渲染单个筛选条件
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
              <Option value={FilterMode.EQUAL}>等于</Option>
              <Option value={FilterMode.NOT_EQUAL}>不等于</Option>
              <Option value={FilterMode.CONTAINS}>包含</Option>
              <Option value={FilterMode.NOT_CONTAINS}>不包含</Option>
              <Option value={FilterMode.IS_EMPTY}>为空</Option>
              <Option value={FilterMode.IS_NOT_EMPTY}>不为空</Option>
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
          <Typography.Title heading={6} className="!mb-0 !text-gray-800">
            筛选条件
          </Typography.Title>
          <div className="flex items-center gap-3">
            {/* 选择方案下拉 */}
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-sm">方案:</span>
              <Select
                value={currentSchemeId}
                onChange={applyFilterScheme}
                style={{ width: '140px' }}
                placeholder="选择方案"
                size="small"
              >
                {filterSchemes.map(scheme => (
                  <Option key={scheme.id} value={scheme.id}>
                    {scheme.name}
                  </Option>
                ))}
              </Select>
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
            .filter-input-wrapper .arco-select-view {
              border: 1px solid #d1d5db;
              transition: border-color 0.2s ease;
            }
            
            .filter-input-wrapper .arco-input:focus,
            .filter-input-wrapper .arco-select-view:focus {
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

  // 模拟数据
  const mockData: RouteData[] = [
    {
      id: '1',
      routeCode: 'AE7',
      routeName: '亚欧7号',
      alliance: 'GEMINI',
      spaceSharing: ['MAERSK'],
      ports: [
        {
          id: '1',
          port: 'CNSHA',
          terminal: '洋山深水港四期',
          cutoffDate: { weekday: '5', time: '17:00' },
          sailingDate: { weekday: '1', time: '09:30' },
          terrorismCutoff: { weekday: '4', time: '12:00' },
          siCutoff: { weekday: '6', time: '12:30' },
          vgmCutoff: { weekday: '6', time: '16:00' },
          oogCutoff: { weekday: '2', time: '17:30' },
          dangerousCutoff: { weekday: '1', time: '17:00' },
          agents: [
            { spaceSharing: 'MAERSK', slotAgent: '马士基代理（上海）有限公司', dangerousAgent: '马士基代理（上海）有限公司' }
          ]
        },
        {
          id: '2',
          port: 'SGSIN',
          terminal: 'PSA Keppel Terminal',
          cutoffDate: { weekday: '6', time: '15:30' },
          sailingDate: { weekday: '2', time: '14:00' },
          terrorismCutoff: { weekday: '5', time: '10:30' },
          siCutoff: { weekday: '1', time: '10:00' },
          vgmCutoff: { weekday: '1', time: '14:30' },
          oogCutoff: { weekday: '4', time: '15:00' },
          dangerousCutoff: { weekday: '3', time: '15:30' },
          agents: [
            { spaceSharing: 'MAERSK', slotAgent: 'Maersk Singapore Pte Ltd', dangerousAgent: 'Maersk Singapore Pte Ltd' }
          ]
        }
      ],
      status: 'enabled',
      createTime: '2024-01-15 10:30:00',
      updateTime: '2024-04-15 14:20:00'
    },
    {
      id: '2',
      routeCode: 'AE10',
      routeName: '亚欧10号',
      alliance: 'OCEAN_ALLIANCE',
      spaceSharing: ['COSCO'],
      ports: [
        {
          id: '1',
          port: 'CNSHA',
          terminal: '外高桥四期',
          cutoffDate: { weekday: '1', time: '12:00' },
          sailingDate: { weekday: '2', time: '16:00' },
          terrorismCutoff: { weekday: '7', time: '15:00' },
          siCutoff: { weekday: '1', time: '10:00' },
          vgmCutoff: { weekday: '1', time: '14:00' },
          oogCutoff: { weekday: '7', time: '17:00' },
          dangerousCutoff: { weekday: '7', time: '12:00' },
          agents: [
            { spaceSharing: 'COSCO', slotAgent: '中远海运船务代理有限公司', dangerousAgent: '中远海运船务代理有限公司' }
          ]
        }
      ],
      status: 'enabled',
      createTime: '2024-01-20 09:15:00',
      updateTime: '2024-04-10 11:45:00'
    },
    {
      id: '3',
      routeCode: 'TP1',
      routeName: '跨太平洋1号',
      alliance: 'PREMIER_ALLIANCE',
      spaceSharing: ['EVERGREEN', 'ONE'],
      ports: [
        {
          id: '1',
          port: 'CNSHA',
          terminal: '洋山深水港三期',
          cutoffDate: { weekday: '5', time: '12:00' },
          sailingDate: { weekday: '6', time: '20:00' },
          terrorismCutoff: { weekday: '4', time: '15:00' },
          siCutoff: { weekday: '5', time: '10:00' },
          vgmCutoff: { weekday: '5', time: '14:00' },
          oogCutoff: { weekday: '4', time: '17:00' },
          dangerousCutoff: { weekday: '4', time: '12:00' },
          agents: [
            { spaceSharing: 'EVERGREEN', slotAgent: '长荣海运（中国）有限公司', dangerousAgent: '长荣海运（中国）有限公司' },
            { spaceSharing: 'ONE', slotAgent: '海洋网联船务（中国）有限公司', dangerousAgent: '海洋网联船务（中国）有限公司' }
          ]
        }
      ],
      status: 'disabled',
      createTime: '2024-02-01 14:22:00',
      updateTime: '2024-04-05 16:30:00'
    }
  ];

  // 表格列定义
  const columns = [
    {
      title: '主航线代码',
      dataIndex: 'routeCode',
      width: 140,
      sorter: true,
      render: (value: string) => <Tooltip content={value} mini><span className="arco-ellipsis">{value}</span></Tooltip>,
    },
    {
      title: '航线名称',
      dataIndex: 'routeName',
      width: 170,
      sorter: true,
      render: (value: string) => <Tooltip content={value} mini><span className="arco-ellipsis">{value}</span></Tooltip>,
    },
    {
      title: '归属联盟',
      dataIndex: 'alliance',
      width: 200,
      sorter: true,
      render: (alliance: string) => {
        const colorMap: Record<string, string> = {
          'GEMINI': 'blue',
          'OCEAN_ALLIANCE': 'green',
          'PREMIER_ALLIANCE': 'orange',
          'INDEPENDENT': 'gray'
        };
        const labelMap: Record<string, string> = {
          'GEMINI': '双子星联盟（Gemini）',
          'OCEAN_ALLIANCE': '海洋OA联盟（Ocean Alliance）',
          'PREMIER_ALLIANCE': 'PA联盟 (Premier Alliance)',
          'INDEPENDENT': '独立运营'
        };
        return <Tag color={colorMap[alliance] || 'gray'}>{labelMap[alliance] || alliance}</Tag>;
      }
    },
    {
      title: '挂靠港口',
      dataIndex: 'ports',
      width: 280,
      sorter: true,
      render: (ports: PortInfo[]) => {
        if (!ports || ports.length === 0) {
          return <span style={{ color: '#999' }}>-</span>;
        }
        
        const firstPort = ports[0];
        const remainingCount = ports.length - 1;
        const portLabel = portOptions.find(opt => opt.value === firstPort.port)?.label || firstPort.port;
        
        if (ports.length === 1) {
          return <Tag color="blue">{portLabel}</Tag>;
        }
        
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Tag color="blue">{portLabel}</Tag>
            <Tooltip
              content={
                <div style={{ maxWidth: '300px' }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>所有挂靠港口：</div>
                  {ports.map((portInfo, index) => {
                    const label = portOptions.find(opt => opt.value === portInfo.port)?.label || portInfo.port;
                    return (
                      <div key={index} style={{ padding: '2px 0' }}>
                        <Tag color="blue" size="small">{label}</Tag>
                      </div>
                    );
                  })}
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
      title: '共舱方',
      dataIndex: 'spaceSharing',
      width: 140,
      sorter: true,
      render: (spaceSharing: string[]) => {
        if (!spaceSharing || spaceSharing.length === 0) {
          return <span style={{ color: '#999' }}>-</span>;
        }
        
        const firstCompany = spaceSharing[0];
        const remainingCount = spaceSharing.length - 1;
        
        if (spaceSharing.length === 1) {
          return <Tag color="purple">{firstCompany}</Tag>;
        }
        
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Tag color="purple">{firstCompany}</Tag>
            <Tooltip
              content={
                <div style={{ maxWidth: '200px' }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>所有共舱方：</div>
                  {spaceSharing.map((company, index) => (
                    <div key={index} style={{ padding: '2px 0' }}>
                      <Tag color="purple" size="small">{company}</Tag>
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
      render: (_: unknown, record: RouteData) => (
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

  // 事件处理函数
  const handleDetail = (record: RouteData) => {
    setCurrentRoute(record);
    setDetailModalVisible(true);
  };

  const handleEdit = (record: RouteData) => {
    navigate(`/controltower/route-maintenance/edit/${record.id}`);
  };

  const handleToggleStatus = (id: string) => {
    const record = routeData.find(item => item.id === id);
    if (record) {
      setCurrentToggleRecord(record);
      setSingleConfirmModalVisible(true);
    }
  };

  const handleConfirmSingleToggle = () => {
    if (currentToggleRecord) {
      const newStatus = currentToggleRecord.status === 'enabled' ? 'disabled' : 'enabled';
      const newData = routeData.map(item =>
        item.id === currentToggleRecord.id ? { ...item, status: newStatus as 'enabled' | 'disabled' } : item
      );
      setRouteData(newData);
      setFilteredData(newData);
      setSingleConfirmModalVisible(false);
      setCurrentToggleRecord(null);
      Message.success(`已${newStatus === 'enabled' ? '启用' : '禁用'}航线`);
    }
  };

  // 初始化数据
  useEffect(() => {
    setRouteData(mockData);
    setFilteredData(mockData);
    
    // 初始化筛选条件
    const defaultScheme = initializeDefaultScheme();
    setFilterSchemes([defaultScheme]);
    setFilterConditions(defaultScheme.conditions);
    
    // 初始化筛选字段顺序
    const fields = getFilterFields();
    setFilterFieldOrder(fields.map(field => field.key));
  }, []);

  return (
    <div>
      <Card>
        {/* 使用新的筛选区域 */}
        {renderNewFilterArea()}
        
        <div style={{ marginBottom: 16 }}>
          <div className="flex justify-between">
            <Space>
                              <Button 
                  type="primary" 
                  icon={<IconPlus />}
                  onClick={() => navigate('/controltower/route-maintenance/add')}
                >
                  新增航线
                </Button>
              <Button icon={<IconRefresh />}>
                刷新
              </Button>
            </Space>
            <div 
              className="flex items-center text-blue-500 cursor-pointer hover:text-blue-700"
              onClick={openCustomTableModal}
            >
              <IconSettings className="mr-1" />
              <span>自定义表格</span>
            </div>
          </div>
        </div>

        {/* 表格 */}
        <Table
          rowKey="id"
          data={filteredData}
          columns={columns}
          pagination={{
            total: filteredData.length,
            pageSize: 20,
            showTotal: true,
            showJumper: true,
            sizeCanChange: true,
            pageSizeChangeResetCurrent: true,
          }}
          scroll={{ x: 1200 }}
          border={false}
          className="mt-4"
        />
        <div className="mt-2 text-gray-500 text-sm">共 {filteredData.length} 条</div>

        {/* 详情抽屉 */}
        <Drawer
          width={800}
          title="航线详情"
          visible={detailModalVisible}
          onCancel={() => setDetailModalVisible(false)}
          footer={
            <div className="flex justify-end">
              <Button onClick={() => setDetailModalVisible(false)}>
                关闭
              </Button>
            </div>
          }
        >
          {currentRoute && (
            <div style={{ padding: '16px 0' }}>
              {/* 基础信息 */}
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ marginBottom: 16, borderLeft: '4px solid #1890ff', paddingLeft: 12, fontSize: 16, fontWeight: 'bold' }}>基础信息</h3>
                <Row gutter={24}>
                  <Col span={8}>
                    <div style={{ marginBottom: 12 }}>
                      <strong>主航线代码：</strong>
                      <span style={{ marginLeft: 8 }}>{currentRoute.routeCode}</span>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div style={{ marginBottom: 12 }}>
                      <strong>航线名称：</strong>
                      <span style={{ marginLeft: 8 }}>{currentRoute.routeName}</span>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div style={{ marginBottom: 12 }}>
                      <strong>归属联盟：</strong>
                      <span style={{ marginLeft: 8 }}>{currentRoute.alliance}</span>
                    </div>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={24}>
                    <div style={{ marginBottom: 12 }}>
                      <strong>共舱方：</strong>
                      <div style={{ marginTop: 8, display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {currentRoute.spaceSharing.map((company, index) => {
                          const companyLabel = spaceSharingOptions.find(opt => opt.value === company)?.label || company;
                          return <Tag key={index} color="purple">{companyLabel}</Tag>;
                        })}
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>

              {/* 港口信息 */}
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ marginBottom: 16, borderLeft: '4px solid #52c41a', paddingLeft: 12, fontSize: 16, fontWeight: 'bold' }}>挂靠港口信息</h3>
                {currentRoute.ports.map((portInfo, portIndex) => {
                  const portLabel = portOptions.find(opt => opt.value === portInfo.port)?.label || portInfo.port;
                  const weekdayLabel = weekdayOptions.find(opt => opt.value === portInfo.cutoffDate.weekday)?.label || `周${portInfo.cutoffDate.weekday}`;
                  const sailingWeekdayLabel = weekdayOptions.find(opt => opt.value === portInfo.sailingDate.weekday)?.label || `周${portInfo.sailingDate.weekday}`;
                  
                  return (
                    <div key={portInfo.id} style={{ marginBottom: 20, padding: 16, border: '1px solid #f0f0f0', borderRadius: 6, backgroundColor: '#fafafa' }}>
                      <div style={{ marginBottom: 12, fontSize: 14, fontWeight: 'bold', color: '#1890ff' }}>
                        港口 {portIndex + 1}：{portLabel}
                      </div>
                      
                      <Row gutter={[16, 8]}>
                        <Col span={12}>
                          <div style={{ marginBottom: 8 }}>
                            <strong>挂靠码头：</strong>
                            <span style={{ marginLeft: 8 }}>{portInfo.terminal}</span>
                          </div>
                        </Col>
                        <Col span={12}>
                          <div style={{ marginBottom: 8 }}>
                            <strong>截关日：</strong>
                            <span style={{ marginLeft: 8 }}>{weekdayLabel} {portInfo.cutoffDate.time}</span>
                          </div>
                        </Col>
                        <Col span={12}>
                          <div style={{ marginBottom: 8 }}>
                            <strong>开船日：</strong>
                            <span style={{ marginLeft: 8 }}>{sailingWeekdayLabel} {portInfo.sailingDate.time}</span>
                          </div>
                        </Col>
                        <Col span={12}>
                          <div style={{ marginBottom: 8 }}>
                            <strong>截反恐申报：</strong>
                            <span style={{ marginLeft: 8 }}>{weekdayOptions.find(opt => opt.value === portInfo.terrorismCutoff.weekday)?.label || `周${portInfo.terrorismCutoff.weekday}`} {portInfo.terrorismCutoff.time}</span>
                          </div>
                        </Col>
                        <Col span={12}>
                          <div style={{ marginBottom: 8 }}>
                            <strong>截单：</strong>
                            <span style={{ marginLeft: 8 }}>{weekdayOptions.find(opt => opt.value === portInfo.siCutoff.weekday)?.label || `周${portInfo.siCutoff.weekday}`} {portInfo.siCutoff.time}</span>
                          </div>
                        </Col>
                        <Col span={12}>
                          <div style={{ marginBottom: 8 }}>
                            <strong>截VGM：</strong>
                            <span style={{ marginLeft: 8 }}>{weekdayOptions.find(opt => opt.value === portInfo.vgmCutoff.weekday)?.label || `周${portInfo.vgmCutoff.weekday}`} {portInfo.vgmCutoff.time}</span>
                          </div>
                        </Col>
                        <Col span={12}>
                          <div style={{ marginBottom: 8 }}>
                            <strong>截OOG List：</strong>
                            <span style={{ marginLeft: 8 }}>{weekdayOptions.find(opt => opt.value === portInfo.oogCutoff.weekday)?.label || `周${portInfo.oogCutoff.weekday}`} {portInfo.oogCutoff.time}</span>
                          </div>
                        </Col>
                        <Col span={12}>
                          <div style={{ marginBottom: 8 }}>
                            <strong>截危申报：</strong>
                            <span style={{ marginLeft: 8 }}>{weekdayOptions.find(opt => opt.value === portInfo.dangerousCutoff.weekday)?.label || `周${portInfo.dangerousCutoff.weekday}`} {portInfo.dangerousCutoff.time}</span>
                          </div>
                        </Col>
                      </Row>

                      {/* 船代信息 */}
                      {portInfo.agents && portInfo.agents.length > 0 && (
                        <div style={{ marginTop: 12 }}>
                          <div style={{ marginBottom: 8, fontSize: 13, fontWeight: 'bold', color: '#722ed1' }}>船代信息：</div>
                          {portInfo.agents.map((agent, agentIndex) => {
                            const spaceSharingLabel = spaceSharingOptions.find(opt => opt.value === agent.spaceSharing)?.label || agent.spaceSharing;
                            return (
                              <div key={agentIndex} style={{ marginBottom: 6, padding: 8, backgroundColor: '#fff', border: '1px solid #e6f7ff', borderRadius: 4 }}>
                                <Row gutter={16}>
                                  <Col span={8}>
                                    <div style={{ fontSize: 12 }}>
                                      <strong>共舱方：</strong>
                                      <Tag size="small" color="purple" style={{ marginLeft: 4 }}>{spaceSharingLabel}</Tag>
                                    </div>
                                  </Col>
                                  <Col span={8}>
                                    <div style={{ fontSize: 12 }}>
                                      <strong>舱位船代：</strong>
                                      <span style={{ marginLeft: 4, fontSize: 11 }}>{agent.slotAgent}</span>
                                    </div>
                                  </Col>
                                  <Col span={8}>
                                    <div style={{ fontSize: 12 }}>
                                      <strong>危险品船代：</strong>
                                      <span style={{ marginLeft: 4, fontSize: 11 }}>{agent.dangerousAgent}</span>
                                    </div>
                                  </Col>
                                </Row>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* 状态信息 */}
              <div>
                <h3 style={{ marginBottom: 16, borderLeft: '4px solid #f5222d', paddingLeft: 12, fontSize: 16, fontWeight: 'bold' }}>状态信息</h3>
                <Row gutter={24}>
                  <Col span={8}>
                    <div style={{ marginBottom: 12 }}>
                      <strong>状态：</strong>
                      <Tag color={currentRoute.status === 'enabled' ? 'green' : 'red'} style={{ marginLeft: 8 }}>
                        {currentRoute.status === 'enabled' ? '启用' : '禁用'}
                      </Tag>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div style={{ marginBottom: 12 }}>
                      <strong>创建时间：</strong>
                      <span style={{ marginLeft: 8 }}>{currentRoute.createTime}</span>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div style={{ marginBottom: 12 }}>
                      <strong>更新时间：</strong>
                      <span style={{ marginLeft: 8 }}>{currentRoute.updateTime}</span>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          )}
        </Drawer>

        {/* 状态切换确认弹窗 */}
        <Modal
          title="确认操作"
          visible={singleConfirmModalVisible}
          onOk={handleConfirmSingleToggle}
          onCancel={() => setSingleConfirmModalVisible(false)}
          okText="确定"
          cancelText="取消"
        >
          {currentToggleRecord && (
            <p>
              确定要{currentToggleRecord.status === 'enabled' ? '禁用' : '启用'}航线 
              <strong> {currentToggleRecord.routeName} </strong>吗？
            </p>
          )}
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
            
            {/* 可拖拽的字段列表 */}
            <div className="flex-1 overflow-y-auto px-4">
              {filterFieldOrder.map((fieldKey, index) => {
                const field = getFilterFields().find(f => f.key === fieldKey);
                const condition = filterConditions.find(c => c.key === fieldKey);
                const isSelected = condition?.visible || false;
                
                if (!field) return null;
                
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
                      checked={isSelected} 
                      onChange={(checked) => updateFilterConditionVisibility(fieldKey, checked)}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </Drawer>

        {/* 另存为方案弹窗 */}
        <Modal
          title="另存为筛选方案"
          visible={schemeModalVisible}
          onCancel={closeSchemeModal}
          footer={[
            <Button key="cancel" onClick={closeSchemeModal}>取消</Button>,
            <Button key="save" type="primary" onClick={saveFilterScheme} disabled={!newSchemeName.trim()}>保存</Button>,
          ]}
          style={{ width: 400 }}
        >
          <div className="p-4">
            <div className="mb-4 text-gray-600">请输入方案名称：</div>
            <Input
              value={newSchemeName}
              onChange={setNewSchemeName}
              placeholder="请输入方案名称"
              maxLength={50}
              showWordLimit
            />
            <div className="mt-4 text-xs text-gray-500">
              保存后可在"选择方案"下拉中找到此方案
            </div>
          </div>
        </Modal>
      </Card>
    </div>
  );
};

export default RouteMaintenance;