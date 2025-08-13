import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Checkbox,
  Modal,
  Select,
  Message,
  Typography,
  Dropdown,
  Tabs,
  Tooltip,
  DatePicker,
  Drawer,
  Input,
  Grid,

  Switch
} from '@arco-design/web-react';
import {
  IconPlus,
  IconMore,
  IconSettings,
  IconSearch,
  IconRefresh,
  IconDown,
  IconUp,
  IconDragDotVertical,
  IconList
} from '@arco-design/web-react/icon';
import { useNavigate } from 'react-router-dom';
import ControlTowerSaasLayout from './ControlTowerSaasLayout';
import SchemeSelect from './SchemeSelect';
import SchemeManagementModal, { SchemeData } from './SchemeManagementModal';

const { Option } = Select;
const { Title } = Typography;
const { TabPane } = Tabs;
const { Row, Col } = Grid;
const RangePicker = DatePicker.RangePicker;

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
export const FilterModeOptions = [
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

// 生成16位数字字母随机组合的规则ID
const generateRuleId = (): string => {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < 16; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// 费用类型枚举
type FeeType = 'fcl' | 'lcl' | 'air' | 'surcharge' | 'precarriage' | 'lastmile';

// 费用类型选项
const feeTypeOptions = [
  { key: 'fcl', title: '整箱海运费' },
  { key: 'lcl', title: '拼箱海运费' },
  { key: 'air', title: '空运运费' },
  { key: 'precarriage', title: '港前运价' },
  { key: 'lastmile', title: '尾程运价' }
];

// 整箱海运费加价规则数据接口
interface FclPricingRule {
  id: string;
  ruleId: string; // 规则ID - 16位数字字母随机组合
  routeName: string; // 航线名称
  shippingCompany: string; // 船公司
  originPort: string; // 起运港
  chargeName: string; // 费用名称
  containerTypes: Array<{
    type: string; // 箱型
    t0Price: number; // T0加价
    t1Price: number; // T1加价
    t2Price: number; // T2加价
    t3Price: number; // T3加价
    internalSalesPrice: number; // 内部销售加价
  }>; // 支持的箱型及其加价信息
  currency: 'USD' | 'CNY'; // 币种
  status: 'enabled' | 'disabled' | 'expired'; // 状态
  createTime: string; // 创建时间
  updateTime: string; // 更新时间
}

// 拼箱海运费加价规则数据接口
interface LclPricingRule {
  id: string;
  routeName: string; // 航线名称
  currency: 'USD' | 'CNY'; // 币种
  weightPrice: number; // 重量加价 (per KG)
  volumePrice: number; // 体积加价 (per CBM)
  minPrice: number; // 最低加价
  t0Price: number; // T0加价
  t1Price: number; // T1加价
  t2Price: number; // T2加价
  t3Price: number; // T3加价
  internalSalesPrice: number; // 内部销售加价
  status: 'enabled' | 'disabled' | 'expired'; // 状态
  createTime: string; // 创建时间
  updateTime: string; // 更新时间
}

// 空运运费加价规则数据接口
interface AirPricingRule {
  id: string;
  routeName: string; // 航线名称
  currency: 'USD' | 'CNY'; // 币种
  weightPrice: number; // 重量加价 (per KG)
  volumePrice: number; // 体积加价 (per CBM)
  minPrice: number; // 最低加价
  t0Price: number; // T0加价
  t1Price: number; // T1加价
  t2Price: number; // T2加价
  t3Price: number; // T3加价
  internalSalesPrice: number; // 内部销售加价
  status: 'enabled' | 'disabled' | 'expired'; // 状态
  createTime: string; // 创建时间
  updateTime: string; // 更新时间
}

// 港前运价加价规则数据接口
interface PrecarriagePricingRule {
  id: string;
  ruleId: string; // 规则ID - 16位数字字母随机组合
  origin: string; // 起运地
  destination: string; // 起运港
  chargeName: string; // 费用名称
  containerTypes: Array<{
    type: string; // 箱型
    t0Price: number; // T0加价
    t1Price: number; // T1加价
    t2Price: number; // T2加价
    t3Price: number; // T3加价
    internalSalesPrice: number; // 内部销售加价
  }>; // 支持的箱型及其加价信息
  currency: 'USD' | 'CNY'; // 币种
  priceType: '直拖' | '支线' | '海铁'; // 运价类型
  branchType?: '乍浦支线' | '温州支线' | '海宁支线' | '扬子支线' | '马尾支线'; // 支线类型
  railType?: '义务海铁' | '湖州海铁' | '九江海铁'; // 海铁类型
  status: 'enabled' | 'disabled' | 'expired'; // 状态
  createTime: string; // 创建时间
  updateTime: string; // 更新时间
}

// 尾程运价加价规则数据接口
interface LastmilePricingRule {
  id: string;
  ruleId: string; // 规则ID - 16位数字字母随机组合
  origin: string; // 目的港
  destination: string; // 配送地址
  shippingCompany: string; // 船公司
  chargeName: string; // 费用名称
  containerTypes: Array<{
    type: string; // 箱型
    basePrice: number; // 基础价格
    t0Price: number; // T0加价
    t1Price: number; // T1加价
    t2Price: number; // T2加价
    t3Price: number; // T3加价
    internalSalesPrice: number; // 内部销售加价
  }>; // 支持的箱型及其加价信息
  currency: 'USD' | 'CNY'; // 币种
  validPeriod: {
    startDate: string; // 有效期开始日期
    endDate: string; // 有效期结束日期
  }; // 有效期
  status: 'enabled' | 'disabled' | 'expired'; // 状态
  createTime: string; // 创建时间
  updateTime: string; // 更新时间
}

// 统一的加价规则类型
type PricingRule = FclPricingRule | LclPricingRule | AirPricingRule | PrecarriagePricingRule | LastmilePricingRule;

// 搜索筛选参数
// interface SearchParams {
//   routeName: string;
//   shippingCompany: string; // 船公司
//   originPort: string; // 起运港
//   chargeName: string; // 费用名称
//   status: string;
//   validPeriodStart: string; // 有效期开始日期
//   validPeriodEnd: string; // 有效期结束日期
// }

// 根据Tab获取筛选字段配置
const getFilterFieldsByTab = (tab: FeeType): FilterFieldConfig[] => {
  switch (tab) {
    case 'fcl':
      return [
        { key: 'ruleId', label: '规则ID', type: 'text', placeholder: '请输入规则ID' },
        { key: 'routeName', label: '航线名称', type: 'select', options: [
          { label: '亚欧航线', value: '亚欧航线' },
          { label: '跨太平洋航线', value: '跨太平洋航线' },
          { label: '亚美航线', value: '亚美航线' }
        ], placeholder: '请选择航线名称' },
        { key: 'shippingCompany', label: '船公司', type: 'select', options: [
          { label: 'COSCO', value: 'COSCO' },
          { label: 'MSC', value: 'MSC' },
          { label: 'MAERSK', value: 'MAERSK' }
        ], placeholder: '请选择' },
        { key: 'originPort', label: '起运港', type: 'select', options: [
          { label: '上海港', value: '上海港' },
          { label: '深圳港', value: '深圳港' },
          { label: '宁波港', value: '宁波港' }
        ], placeholder: '请选择' },
        { key: 'destinationPort', label: '目的港', type: 'text', placeholder: '请输入目的地' },
        { key: 'chargeName', label: '费用名称', type: 'select', options: [
          { label: '基础海运费', value: '基础海运费' },
          { label: '燃油附加费', value: '燃油附加费' }
        ], placeholder: '请选择费用名称' },
        { key: 'currency', label: '币种', type: 'select', options: [
          { label: 'USD', value: 'USD' },
          { label: 'CNY', value: 'CNY' }
        ], placeholder: '请选择币种' },
        { key: 'containerType', label: '计费单位', type: 'select', options: [
          { label: '20GP', value: '20GP' },
          { label: '40GP', value: '40GP' },
          { label: '40HQ', value: '40HQ' },
          { label: '票', value: 'ticket' },
          { label: '箱', value: 'container' }
        ], placeholder: '请选择计费单位' },
        { key: 'status', label: '状态', type: 'select', options: [
          { label: '启用', value: 'enabled' },
          { label: '禁用', value: 'disabled' },
          { label: '过期', value: 'expired' }
        ], placeholder: '请选择状态' },
        { key: 'updateTime', label: '更新时间', type: 'dateRange', placeholder: '请选择更新时间' }
      ];
    case 'precarriage':
      return [
        { key: 'ruleId', label: '规则ID', type: 'text', placeholder: '请输入规则ID' },
        { key: 'originPort', label: '起运地', type: 'text', placeholder: '请输入起运地' },
        { key: 'destinationPort', label: '起运港', type: 'select', options: [
          { label: '盐田港', value: '盐田港' },
          { label: '南沙港', value: '南沙港' },
          { label: '蛇口港', value: '蛇口港' },
          { label: '黄埔港', value: '黄埔港' },
          { label: '珠海港', value: '珠海港' }
        ], placeholder: '请选择起运港' },
        { key: 'chargeName', label: '费用名称', type: 'select', options: [
          { label: '港前运输费', value: '港前运输费' },
          { label: '文件费', value: '文件费' },
          { label: '操作费', value: '操作费' },
          { label: '单证费', value: '单证费' }
        ], placeholder: '请选择费用名称' },
        { key: 'priceType', label: '运价类型', type: 'select', options: [
          { label: '直拖', value: '直拖' },
          { label: '支线', value: '支线' },
          { label: '海铁', value: '海铁' }
        ], placeholder: '请选择运价类型' },
        { key: 'branchType', label: '支线类型', type: 'select', options: [
          { label: '乍浦支线', value: '乍浦支线' },
          { label: '温州支线', value: '温州支线' },
          { label: '海宁支线', value: '海宁支线' },
          { label: '扬子支线', value: '扬子支线' },
          { label: '马尾支线', value: '马尾支线' }
        ], placeholder: '请选择支线类型' },
        { key: 'railType', label: '海铁类型', type: 'select', options: [
          { label: '义务海铁', value: '义务海铁' },
          { label: '湖州海铁', value: '湖州海铁' },
          { label: '九江海铁', value: '九江海铁' }
        ], placeholder: '请选择海铁类型' },
        { key: 'currency', label: '币种', type: 'select', options: [
          { label: 'USD', value: 'USD' },
          { label: 'CNY', value: 'CNY' }
        ], placeholder: '请选择币种' },
        { key: 'containerType', label: '计费单位', type: 'select', options: [
          { label: '20GP', value: '20GP' },
          { label: '40GP', value: '40GP' },
          { label: '40HQ', value: '40HQ' },
          { label: '票', value: 'ticket' },
          { label: '箱', value: 'container' }
        ], placeholder: '请选择计费单位' },
        { key: 'status', label: '状态', type: 'select', options: [
          { label: '启用', value: 'enabled' },
          { label: '禁用', value: 'disabled' },
          { label: '过期', value: 'expired' }
        ], placeholder: '请选择状态' },
        { key: 'updateTime', label: '更新时间', type: 'dateRange', placeholder: '请选择更新时间' }
      ];
    case 'lastmile':
      return [
        { key: 'ruleId', label: '规则ID', type: 'text', placeholder: '请输入规则ID' },
        { key: 'routeName', label: '航线名称', type: 'select', options: [
          { label: '亚欧航线', value: '亚欧航线' },
          { label: '跨太平洋航线', value: '跨太平洋航线' },
          { label: '亚美航线', value: '亚美航线' }
        ], placeholder: '请选择航线名称' },
        { key: 'shippingCompany', label: '目的港代理', type: 'select', options: [
          { label: 'COSCO', value: 'COSCO' },
          { label: 'MSC', value: 'MSC' },
          { label: 'MAERSK', value: 'MAERSK' }
        ], placeholder: '请选择' },
        { key: 'originPort', label: '目的港', type: 'select', options: [
          { label: '上海港', value: '上海港' },
          { label: '深圳港', value: '深圳港' },
          { label: '宁波港', value: '宁波港' }
        ], placeholder: '请选择' },
        { key: 'destinationPort', label: '配送地址', type: 'text', placeholder: '请输入目的地' },
        { key: 'chargeName', label: '费用名称', type: 'select', options: [
          { label: '基础海运费', value: '基础海运费' },
          { label: '燃油附加费', value: '燃油附加费' }
        ], placeholder: '请选择费用名称' },
        { key: 'currency', label: '币种', type: 'select', options: [
          { label: 'USD', value: 'USD' },
          { label: 'CNY', value: 'CNY' }
        ], placeholder: '请选择币种' },
        { key: 'containerType', label: '计费单位', type: 'select', options: [
          { label: '20GP', value: '20GP' },
          { label: '40GP', value: '40GP' },
          { label: '40HQ', value: '40HQ' },
          { label: '票', value: 'ticket' },
          { label: '箱', value: 'container' }
        ], placeholder: '请选择计费单位' },
        { key: 'status', label: '状态', type: 'select', options: [
          { label: '启用', value: 'enabled' },
          { label: '禁用', value: 'disabled' },
          { label: '过期', value: 'expired' }
        ], placeholder: '请选择状态' },
        { key: 'updateTime', label: '更新时间', type: 'dateRange', placeholder: '请选择更新时间' }
      ];
    case 'lcl':
    case 'air':
      return [
        { key: 'routeName', label: '航线名称', type: 'select', options: [
          { label: '亚欧航线', value: '亚欧航线' },
          { label: '跨太平洋航线', value: '跨太平洋航线' }
        ], placeholder: '请选择航线名称' },
        { key: 'currency', label: '币种', type: 'select', options: [
          { label: 'USD', value: 'USD' },
          { label: 'CNY', value: 'CNY' }
        ], placeholder: '请选择币种' },
        { key: 'weightPrice', label: '重量加价', type: 'number', placeholder: '请输入重量加价' },
        { key: 'volumePrice', label: '体积加价', type: 'number', placeholder: '请输入体积加价' },
        { key: 'minPrice', label: '最低加价', type: 'number', placeholder: '请输入最低加价' },
        { key: 't0Price', label: 'T0加价', type: 'number', placeholder: '请输入T0加价' },
        { key: 'status', label: '状态', type: 'select', options: [
          { label: '启用', value: 'enabled' },
          { label: '禁用', value: 'disabled' },
          { label: '过期', value: 'expired' }
        ], placeholder: '请选择状态' },
        { key: 'updateTime', label: '更新时间', type: 'dateRange', placeholder: '请选择更新时间' }
      ];
    default:
      return [];
  }
};

const PricingRuleManagement: React.FC = () => {
  const navigate = useNavigate();
  const [activeFeeType, setActiveFeeType] = useState<FeeType>('fcl');
  const [pricingRuleData, setPricingRuleData] = useState<PricingRule[]>([]);
  const [filteredData, setFilteredData] = useState<PricingRule[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [currentRule, setCurrentRule] = useState<PricingRule | null>(null);
  
  // 确认弹窗相关状态
  const [toggleStatusModalVisible, setToggleStatusModalVisible] = useState(false);
  const [batchToggleModalVisible, setBatchToggleModalVisible] = useState(false);
  const [pendingToggleRule, setPendingToggleRule] = useState<{ id: string; currentStatus: 'enabled' | 'disabled' | 'expired' } | null>(null);
  const [pendingBatchToggleStatus, setPendingBatchToggleStatus] = useState<'enabled' | 'disabled' | null>(null);

  // 筛选功能状态 - 按照 FclRates 的规范
  const [filterConditions, setFilterConditions] = useState<FilterCondition[]>([]);
  const [filterSchemes, setFilterSchemes] = useState<FilterScheme[]>([]);
  const [currentSchemeId, setCurrentSchemeId] = useState<string>('default');
  const [filterExpanded, setFilterExpanded] = useState(false);
  const [filterFieldModalVisible, setFilterFieldModalVisible] = useState(false);
  const [schemeModalVisible, setSchemeModalVisible] = useState(false);
  const [schemeName, setSchemeName] = useState('');
  const [filterFieldOrder, setFilterFieldOrder] = useState<string[]>([]);
  
  // 方案管理相关状态
  const [schemeManagementModalVisible, setSchemeManagementModalVisible] = useState(false);
  const [allSchemes, setAllSchemes] = useState<SchemeData[]>([]);

  // 自定义表格状态
  const [customTableModalVisible, setCustomTableModalVisible] = useState<boolean>(false);
  const [columnVisibility, setColumnVisibility] = useState<{[key: string]: boolean}>({});
  const [columnOrder, setColumnOrder] = useState<string[]>([]);

  // 拖拽状态
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragOverItem, setDragOverItem] = useState<string | null>(null);
  const [draggedFilterField, setDraggedFilterField] = useState<string | null>(null);
  const [dragOverFilterField, setDragOverFilterField] = useState<string | null>(null);

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

  // 处理费用类型切换
  const handleFeeTypeChange = (feeType: string) => {
    setActiveFeeType(feeType as FeeType);
    setSelectedRowKeys([]);
  };

  // 初始化默认筛选条件
  const initializeDefaultConditions = (activeTab: FeeType): FilterCondition[] => {
    const fields = getFilterFieldsByTab(activeTab);
    return fields.map(field => ({
      key: field.key,
      mode: FilterMode.EQUAL,
      value: undefined,
      visible: true
    }));
  };

  // 初始化默认方案
  const initializeDefaultScheme = (activeTab: FeeType): FilterScheme => {
    return {
      id: 'default',
      name: '默认方案',
      conditions: initializeDefaultConditions(activeTab),
      isDefault: true
    };
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

  // 切换筛选区展开状态
  const toggleFilterExpanded = () => {
    setFilterExpanded(!filterExpanded);
  };

  // 更新筛选条件值
  const updateFilterCondition = (key: string, mode: FilterMode, value: any) => {
    setFilterConditions(prev => prev.map(condition => 
      condition.key === key 
        ? { ...condition, mode, value }
        : condition
    ));
  };

  // 重置筛选条件
  const resetFilterConditions = () => {
    const defaultScheme = filterSchemes.find(scheme => scheme.isDefault);
    if (defaultScheme) {
      setFilterConditions(defaultScheme.conditions.map(condition => ({
        ...condition,
        value: undefined
      })));
      setCurrentSchemeId('default');
    }
  };

  // 应用筛选方案
  const applyFilterScheme = (schemeId: string) => {
    const scheme = filterSchemes.find(s => s.id === schemeId);
    if (scheme) {
      setFilterConditions([...scheme.conditions]);
      setCurrentSchemeId(schemeId);
    }
  };

  // 打开增减条件弹窗
  const openFilterFieldModal = () => {
    setFilterFieldModalVisible(true);
  };

  // 关闭增减条件弹窗
  // const closeFilterFieldModal = () => {
  //   setFilterFieldModalVisible(false);
  // };

  // 打开另存为方案弹窗
  const openSchemeModal = () => {
    setSchemeName('');
    setSchemeModalVisible(true);
  };

  // 关闭另存为方案弹窗
  const closeSchemeModal = () => {
    setSchemeModalVisible(false);
    setSchemeName('');
  };

  // 保存筛选方案
  const saveFilterScheme = () => {
    if (!schemeName.trim()) {
      return;
    }
    
    const newScheme: FilterScheme = {
      id: Date.now().toString(),
      name: schemeName.trim(),
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
    Message.success('筛选方案保存成功');
  };

  // 更新筛选条件可见性
  const updateFilterConditionVisibility = (key: string, visible: boolean) => {
    setFilterConditions(prev => prev.map(condition => 
      condition.key === key 
        ? { ...condition, visible }
        : condition
    ));
  };

  // 获取当前费用类型的示例数据
  const getMockDataByFeeType = (feeType: FeeType): PricingRule[] => {
    switch (feeType) {
      case 'fcl':
        return [
      {
        id: '1',
            ruleId: generateRuleId(),
        routeName: '亚欧航线',
            shippingCompany: 'COSCO',
            originPort: '上海港',
            chargeName: '基础海运费',
            containerTypes: [
              {
                type: '20GP',
        t0Price: 50,
        t1Price: 100,
        t2Price: 150,
        t3Price: 200,
                internalSalesPrice: 80
      },
      {
                type: '40GP',
        t0Price: 80,
        t1Price: 160,
        t2Price: 240,
        t3Price: 320,
                internalSalesPrice: 120
              },
              {
                type: '40HQ',
                t0Price: 90,
                t1Price: 180,
                t2Price: 270,
                t3Price: 360,
                internalSalesPrice: 135
              }
            ],
            currency: 'USD',
        status: 'enabled',
            createTime: '2024-01-15 10:30:00',
            updateTime: '2024-01-15 10:30:00'
      },
      {
            id: '2',
            ruleId: generateRuleId(),
        routeName: '跨太平洋航线',
            shippingCompany: 'MSC',
            originPort: '深圳港',
            chargeName: '基础海运费',
            containerTypes: [
              {
                type: '20GP',
        t0Price: 60,
        t1Price: 120,
        t2Price: 180,
        t3Price: 240,
                internalSalesPrice: 90
              },
              {
                type: '40GP',
                t0Price: 100,
                t1Price: 200,
                t2Price: 300,
                t3Price: 400,
                internalSalesPrice: 150
              }
            ],
            currency: 'USD',
        status: 'enabled',
        createTime: '2024-01-16 09:20:00',
        updateTime: '2024-01-16 09:20:00'
      },
          {
            id: '3',
            ruleId: generateRuleId(),
            routeName: '亚美航线',
            shippingCompany: 'MAERSK',
            originPort: '宁波港',
            chargeName: '基础海运费',
            containerTypes: [
              {
                type: '20RF',
                t0Price: 80,
                t1Price: 160,
                t2Price: 240,
                t3Price: 320,
                internalSalesPrice: 120
              },
              {
                type: '40RF',
                t0Price: 120,
                t1Price: 240,
                t2Price: 360,
                t3Price: 480,
                internalSalesPrice: 180
              }
            ],
            currency: 'USD',
            status: 'enabled',
            createTime: '2024-01-17 11:10:00',
            updateTime: '2024-01-17 11:10:00'
          },
          {
            id: '11',
            ruleId: generateRuleId(),
            routeName: '欧地航线',
            shippingCompany: 'CMA CGM',
            originPort: '青岛港',
            chargeName: '文件处理费',
            containerTypes: [
              {
                type: '票',
                t0Price: 25,
                t1Price: 50,
                t2Price: 75,
                t3Price: 100,
                internalSalesPrice: 40
              },
              {
                type: '箱',
                t0Price: 35,
                t1Price: 70,
                t2Price: 105,
                t3Price: 140,
                internalSalesPrice: 55
              }
            ],
            currency: 'USD',
            status: 'enabled',
            createTime: '2024-01-18 14:20:00',
            updateTime: '2024-01-18 14:20:00'
          },
          {
            id: '12',
            ruleId: generateRuleId(),
            routeName: '中东航线',
            shippingCompany: 'EVERGREEN',
            originPort: '天津港',
            chargeName: '操作费',
            containerTypes: [
              {
                type: '票',
                t0Price: 30,
                t1Price: 60,
                t2Price: 90,
                t3Price: 120,
                internalSalesPrice: 45
              }
            ],
            currency: 'USD',
            status: 'enabled',
            createTime: '2024-01-19 09:30:00',
            updateTime: '2024-01-19 09:30:00'
          },
          {
            id: '12a',
            ruleId: generateRuleId(),
            routeName: '中东航线',
            shippingCompany: 'EVERGREEN',
            originPort: '天津港',
            chargeName: '操作费',
            containerTypes: [
              {
                type: '箱',
                t0Price: 40,
                t1Price: 80,
                t2Price: 120,
                t3Price: 160,
                internalSalesPrice: 60
              }
            ],
            currency: 'USD',
            status: 'enabled',
            createTime: '2024-01-19 09:35:00',
            updateTime: '2024-01-19 09:35:00'
          },
          {
            id: '12b',
            ruleId: generateRuleId(),
            routeName: '中东航线',
            shippingCompany: 'EVERGREEN',
            originPort: '天津港',
            chargeName: '操作费',
            containerTypes: [
              {
                type: '20GP',
                t0Price: 55,
                t1Price: 110,
                t2Price: 165,
                t3Price: 220,
                internalSalesPrice: 85
              },
              {
                type: '40GP',
                t0Price: 75,
                t1Price: 150,
                t2Price: 225,
                t3Price: 300,
                internalSalesPrice: 115
              }
            ],
            currency: 'USD',
            status: 'enabled',
            createTime: '2024-01-19 09:40:00',
            updateTime: '2024-01-19 09:40:00'
          },
          {
            id: '13',
            ruleId: generateRuleId(),
            routeName: '澳新航线',
            shippingCompany: 'OOCL',
            originPort: '厦门港',
            chargeName: '单证费',
            containerTypes: [
              {
                type: '票',
                t0Price: 20,
                t1Price: 40,
                t2Price: 60,
                t3Price: 80,
                internalSalesPrice: 30
              }
            ],
            currency: 'USD',
            status: 'enabled',
            createTime: '2024-01-19 15:45:00',
            updateTime: '2024-01-19 15:45:00'
          },
          {
            id: '14',
            ruleId: generateRuleId(),
            routeName: '南美航线',
            shippingCompany: 'HAPAG-LLOYD',
            originPort: '大连港',
            chargeName: '港口费',
            containerTypes: [
              {
                type: '箱',
                t0Price: 45,
                t1Price: 90,
                t2Price: 135,
                t3Price: 180,
                internalSalesPrice: 70
              }
            ],
            currency: 'USD',
            status: 'enabled',
            createTime: '2024-01-20 11:15:00',
            updateTime: '2024-01-20 11:15:00'
          },
          {
            id: '14a',
            ruleId: generateRuleId(),
            routeName: '南美航线',
            shippingCompany: 'HAPAG-LLOYD',
            originPort: '大连港',
            chargeName: '港口费',
            containerTypes: [
              {
                type: '40GP',
                t0Price: 85,
                t1Price: 170,
                t2Price: 255,
                t3Price: 340,
                internalSalesPrice: 130
              },
              {
                type: '40HQ',
                t0Price: 95,
                t1Price: 190,
                t2Price: 285,
                t3Price: 380,
                internalSalesPrice: 145
              }
            ],
            currency: 'USD',
            status: 'enabled',
            createTime: '2024-01-20 11:20:00',
            updateTime: '2024-01-20 11:20:00'
          }
        ] as FclPricingRule[];
      case 'lcl':
        return [
      {
        id: '4',
            routeName: '亚欧航线',
        currency: 'USD',
            weightPrice: 2.5,
            volumePrice: 150,
            minPrice: 50,
            t0Price: 10,
            t1Price: 20,
            t2Price: 30,
            t3Price: 40,
            internalSalesPrice: 15,
            status: 'enabled',
        createTime: '2024-01-16 09:25:00',
        updateTime: '2024-01-16 14:15:00'
          }
        ] as LclPricingRule[];
      case 'air':
        return [
      {
        id: '5',
        routeName: '亚美航线',
            currency: 'USD',
            weightPrice: 3.5,
            volumePrice: 200,
            minPrice: 100,
            t0Price: 20,
            t1Price: 40,
            t2Price: 60,
            t3Price: 80,
            internalSalesPrice: 30,
        status: 'enabled',
        createTime: '2024-01-17 11:10:00',
        updateTime: '2024-01-17 11:10:00'
          }
        ] as AirPricingRule[];
      case 'precarriage':
        return [
      {
        id: '7',
            ruleId: generateRuleId(),
            origin: '深圳市宝安区西乡街道宝源路1号',
            destination: '盐田港',
            chargeName: '港前运输费',
            containerTypes: [
              {
                type: '20GP',
                t0Price: 50,
                t1Price: 100,
                t2Price: 150,
                t3Price: 200,
                internalSalesPrice: 80
              },
              {
                type: '40GP',
                t0Price: 80,
                t1Price: 160,
                t2Price: 240,
                t3Price: 320,
                internalSalesPrice: 120
              }
            ],
            currency: 'CNY',
            priceType: '直拖',
        status: 'enabled',
        createTime: '2024-01-18 08:45:00',
        updateTime: '2024-01-18 08:45:00'
      },
      {
        id: '8',
            ruleId: generateRuleId(),
            origin: '广州市天河区珠江新城花城大道85号',
            destination: '南沙港',
            chargeName: '港前运输费',
            containerTypes: [
              {
                type: '20GP',
                t0Price: 40,
                t1Price: 80,
                t2Price: 120,
                t3Price: 160,
                internalSalesPrice: 60
              },
              {
                type: '40HQ',
        t0Price: 70,
        t1Price: 140,
        t2Price: 210,
        t3Price: 280,
                internalSalesPrice: 105
              }
            ],
            currency: 'CNY',
            priceType: '支线',
            branchType: '乍浦支线',
            status: 'enabled',
            createTime: '2024-01-18 09:15:00',
            updateTime: '2024-01-18 09:15:00'
          },
          {
            id: '15',
            ruleId: generateRuleId(),
            origin: '东莞市南城区宏远路1号',
            destination: '蛇口港',
            chargeName: '文件费',
            containerTypes: [
              {
                type: '票',
                t0Price: 15,
                t1Price: 30,
                t2Price: 45,
                t3Price: 60,
                internalSalesPrice: 25
              },
              {
                type: '箱',
                t0Price: 20,
                t1Price: 40,
                t2Price: 60,
                t3Price: 80,
                internalSalesPrice: 30
              }
            ],
            currency: 'CNY',
            priceType: '海铁',
            railType: '义务海铁',
            status: 'enabled',
            createTime: '2024-01-20 10:30:00',
            updateTime: '2024-01-20 10:30:00'
          },
          {
            id: '16',
            ruleId: generateRuleId(),
            origin: '佛山市禅城区季华五路28号',
            destination: '黄埔港',
            chargeName: '操作费',
            containerTypes: [
              {
                type: '票',
                t0Price: 12,
                t1Price: 24,
                t2Price: 36,
                t3Price: 48,
                internalSalesPrice: 18
              }
            ],
            currency: 'CNY',
            priceType: '支线',
            branchType: '温州支线',
            status: 'enabled',
            createTime: '2024-01-21 14:20:00',
            updateTime: '2024-01-21 14:20:00'
          },
          {
            id: '16a',
            ruleId: generateRuleId(),
            origin: '佛山市南海区桂城街道南海大道北88号',
            destination: '黄埔港',
            chargeName: '操作费',
            containerTypes: [
              {
                type: '箱',
                t0Price: 18,
                t1Price: 36,
                t2Price: 54,
                t3Price: 72,
                internalSalesPrice: 27
              }
            ],
            currency: 'CNY',
            priceType: '海铁',
            railType: '湖州海铁',
            status: 'enabled',
            createTime: '2024-01-21 14:25:00',
            updateTime: '2024-01-21 14:25:00'
          },
          {
            id: '16b',
            ruleId: generateRuleId(),
            origin: '佛山市顺德区大良街道德胜东路2号',
            destination: '黄埔港',
            chargeName: '操作费',
            containerTypes: [
              {
                type: '20GP',
                t0Price: 35,
                t1Price: 70,
                t2Price: 105,
                t3Price: 140,
                internalSalesPrice: 55
              },
              {
                type: '40GP',
                t0Price: 50,
                t1Price: 100,
                t2Price: 150,
                t3Price: 200,
                internalSalesPrice: 80
              }
            ],
            currency: 'CNY',
            priceType: '直拖',
            status: 'enabled',
            createTime: '2024-01-21 14:30:00',
            updateTime: '2024-01-21 14:30:00'
          },
          {
            id: '17',
            ruleId: generateRuleId(),
            origin: '中山市东区起湾道3号',
            destination: '珠海港',
            chargeName: '单证费',
            containerTypes: [
              {
                type: '票',
                t0Price: 10,
                t1Price: 20,
                t2Price: 30,
                t3Price: 40,
                internalSalesPrice: 15
              }
            ],
            currency: 'CNY',
            priceType: '支线',
            branchType: '海宁支线',
            status: 'enabled',
            createTime: '2024-01-22 09:45:00',
            updateTime: '2024-01-22 09:45:00'
          }
        ] as PrecarriagePricingRule[];
      case 'lastmile':
        return [
      {
        id: '9',
            ruleId: generateRuleId(),
            origin: '洛杉矶港',
            destination: 'LAX9仓库',
            shippingCompany: 'MAERSK',
            chargeName: '尾程配送费',
            containerTypes: [
              {
                type: '40GP',
                basePrice: 300,
                t0Price: 30,
                t1Price: 60,
                t2Price: 90,
                t3Price: 120,
                internalSalesPrice: 45
              },
              {
                type: '40HQ',
                basePrice: 350,
                t0Price: 35,
                t1Price: 70,
                t2Price: 105,
                t3Price: 140,
                internalSalesPrice: 52
              }
            ],
            currency: 'USD',
            validPeriod: {
              startDate: '2024-01-01',
              endDate: '2024-12-31'
            },
        status: 'enabled',
            createTime: '2024-01-18 09:00:00',
            updateTime: '2024-01-18 09:00:00'
      },
      {
        id: '10',
            ruleId: generateRuleId(),
            origin: '长滩港',
            destination: 'LGB2仓库',
            shippingCompany: 'CMA CGM',
            chargeName: '尾程配送费',
            containerTypes: [
              {
                type: '20GP',
                basePrice: 250,
                t0Price: 25,
                t1Price: 50,
                t2Price: 75,
                t3Price: 100,
                internalSalesPrice: 37
              },
              {
                type: '40GP',
                basePrice: 320,
                t0Price: 32,
                t1Price: 64,
                t2Price: 96,
                t3Price: 128,
                internalSalesPrice: 48
              }
            ],
        currency: 'USD',
            validPeriod: {
              startDate: '2024-03-01',
              endDate: '2024-10-31'
            },
        status: 'enabled',
            createTime: '2024-01-18 10:30:00',
            updateTime: '2024-01-18 10:30:00'
      },
      {
        id: '18',
        ruleId: generateRuleId(),
        origin: '纽约港',
        destination: 'JFK1仓库',
        shippingCompany: 'EVERGREEN',
        chargeName: '文件处理费',
        containerTypes: [
          {
            type: '票',
            basePrice: 80,
            t0Price: 8,
            t1Price: 16,
            t2Price: 24,
            t3Price: 32,
            internalSalesPrice: 12
          }
        ],
        currency: 'USD',
        validPeriod: {
          startDate: '2024-01-20',
          endDate: '2024-12-20'
        },
        status: 'enabled',
        createTime: '2024-01-23 11:15:00',
        updateTime: '2024-01-23 11:15:00'
      },
      {
        id: '18a',
        ruleId: generateRuleId(),
        origin: '纽约港',
        destination: 'JFK1仓库',
        shippingCompany: 'EVERGREEN',
        chargeName: '文件处理费',
        containerTypes: [
          {
            type: '箱',
            basePrice: 120,
            t0Price: 12,
            t1Price: 24,
            t2Price: 36,
            t3Price: 48,
            internalSalesPrice: 18
          }
        ],
        currency: 'USD',
        validPeriod: {
          startDate: '2024-01-20',
          endDate: '2024-12-20'
        },
        status: 'enabled',
        createTime: '2024-01-23 11:20:00',
        updateTime: '2024-01-23 11:20:00'
      },
      {
        id: '19',
        ruleId: generateRuleId(),
        origin: '西雅图港',
        destination: 'SEA3仓库',
        shippingCompany: 'OOCL',
        chargeName: '操作费',
        containerTypes: [
          {
            type: '票',
            basePrice: 60,
            t0Price: 6,
            t1Price: 12,
            t2Price: 18,
            t3Price: 24,
            internalSalesPrice: 9
          }
        ],
        currency: 'USD',
        validPeriod: {
          startDate: '2024-02-15',
          endDate: '2024-11-15'
        },
        status: 'enabled',
        createTime: '2024-01-24 16:30:00',
        updateTime: '2024-01-24 16:30:00'
      },
      {
        id: '19a',
        ruleId: generateRuleId(),
        origin: '西雅图港',
        destination: 'SEA3仓库',
        shippingCompany: 'OOCL',
        chargeName: '操作费',
        containerTypes: [
          {
            type: '箱',
            basePrice: 100,
            t0Price: 10,
            t1Price: 20,
            t2Price: 30,
            t3Price: 40,
            internalSalesPrice: 15
          }
        ],
        currency: 'USD',
        validPeriod: {
          startDate: '2024-02-15',
          endDate: '2024-11-15'
        },
        status: 'enabled',
        createTime: '2024-01-24 16:35:00',
        updateTime: '2024-01-24 16:35:00'
      },
      {
        id: '19b',
        ruleId: generateRuleId(),
        origin: '西雅图港',
        destination: 'SEA3仓库',
        shippingCompany: 'OOCL',
        chargeName: '操作费',
        containerTypes: [
          {
            type: '40GP',
            basePrice: 280,
            t0Price: 28,
            t1Price: 56,
            t2Price: 84,
            t3Price: 112,
            internalSalesPrice: 42
          },
          {
            type: '40HQ',
            basePrice: 320,
            t0Price: 32,
            t1Price: 64,
            t2Price: 96,
            t3Price: 128,
            internalSalesPrice: 48
          }
        ],
        currency: 'USD',
        validPeriod: {
          startDate: '2024-02-15',
          endDate: '2024-11-15'
        },
        status: 'enabled',
        createTime: '2024-01-24 16:40:00',
        updateTime: '2024-01-24 16:40:00'
      },
      {
        id: '20',
        ruleId: generateRuleId(),
        origin: '休斯顿港',
        destination: 'IAH5仓库',
        shippingCompany: 'HAPAG-LLOYD',
        chargeName: '单证费',
        containerTypes: [
          {
            type: '票',
            basePrice: 50,
            t0Price: 5,
            t1Price: 10,
            t2Price: 15,
            t3Price: 20,
            internalSalesPrice: 7
          }
        ],
        currency: 'USD',
        validPeriod: {
          startDate: '2024-04-01',
          endDate: '2024-09-30'
        },
        status: 'enabled',
        createTime: '2024-01-25 13:45:00',
        updateTime: '2024-01-25 13:45:00'
      }
        ] as LastmilePricingRule[];
      default:
        return [];
    }
  };

  // 初始化示例数据
  useEffect(() => {
    const mockData = getMockDataByFeeType(activeFeeType);
    setPricingRuleData(mockData);
    setFilteredData(mockData);
  }, [activeFeeType]);

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
      name: '常用加价规则',
      isDefault: false,
      createTime: new Date(Date.now() - 86400000).toISOString(),
      conditions: []
    };
    
    const customScheme2: SchemeData = {
      id: 'custom2',
      name: '整箱规则',
      isDefault: false,
      createTime: new Date(Date.now() - 172800000).toISOString(),
      conditions: []
    };
    
    setAllSchemes([defaultScheme, customScheme1, customScheme2]);
  }, []);

  // 搜索处理
  const handleToggleStatus = (id: string, currentStatus: 'enabled' | 'disabled' | 'expired') => {
    setPendingToggleRule({ id, currentStatus });
    setToggleStatusModalVisible(true);
  };

  const handleConfirmToggleStatus = () => {
    if (!pendingToggleRule) return;
    
    const { id, currentStatus } = pendingToggleRule;
    const newStatus = currentStatus === 'enabled' ? 'disabled' : 'enabled';
    const newData = pricingRuleData.map(item =>
      item.id === id ? { ...item, status: newStatus, updateTime: new Date().toLocaleString('zh-CN') } : item
    );
    setPricingRuleData(newData as PricingRule[]);
    setFilteredData(newData as PricingRule[]);
    
    setToggleStatusModalVisible(false);
    setPendingToggleRule(null);
    Message.success(`已${newStatus === 'enabled' ? '启用' : '禁用'}`);
  };

  // 批量切换状态
  const handleBatchToggleStatus = (targetStatus: 'enabled' | 'disabled') => {
    setPendingBatchToggleStatus(targetStatus);
    setBatchToggleModalVisible(true);
  };

  const handleConfirmBatchToggleStatus = () => {
    if (!pendingBatchToggleStatus) return;
    
    const selectedCount = selectedRowKeys.length;
    const newData = pricingRuleData.map(item =>
      selectedRowKeys.includes(item.id) 
        ? { ...item, status: pendingBatchToggleStatus, updateTime: new Date().toLocaleString('zh-CN') } 
        : item
    );
    setPricingRuleData(newData as PricingRule[]);
    setFilteredData(newData as PricingRule[]);
    setSelectedRowKeys([]);
    
    setBatchToggleModalVisible(false);
    setPendingBatchToggleStatus(null);
    Message.success(`已批量${pendingBatchToggleStatus === 'enabled' ? '启用' : '禁用'} ${selectedCount} 条记录`);
  };

  // 根据费用类型获取表格列定义
  const getColumns = () => {
    const baseColumns = [
    {
      title: (
        <Checkbox
          indeterminate={selectedRowKeys.length > 0 && selectedRowKeys.length < filteredData.length}
          checked={selectedRowKeys.length === filteredData.length && filteredData.length > 0}
          onChange={(checked) => {
            if (checked) {
              setSelectedRowKeys(filteredData.map(item => item.id));
            } else {
              setSelectedRowKeys([]);
            }
          }}
        />
      ),
      dataIndex: 'checkbox',
      width: 60,
      render: (_: unknown, record: PricingRule) => (
        <Checkbox
          checked={selectedRowKeys.includes(record.id)}
          onChange={(checked) => {
            if (checked) {
              setSelectedRowKeys([...selectedRowKeys, record.id]);
            } else {
              setSelectedRowKeys(selectedRowKeys.filter(key => key !== record.id));
            }
          }}
        />
      ),
      }
    ];

      // 根据费用类型决定是否显示T0~T3加价列
  const shouldShowPriceColumns = activeFeeType !== 'fcl' && activeFeeType !== 'precarriage' && activeFeeType !== 'lastmile';
  
  const commonColumns = [
    // 只有拼箱、空运才显示T0~T3加价列
    ...(shouldShowPriceColumns ? [
    {
      title: 'T0加价',
      dataIndex: 't0Price',
      width: 100,
      sorter: true,
      render: (price: number, record: PricingRule) => `${price} ${record.currency}`
    },
    {
      title: 'T1加价',
      dataIndex: 't1Price',
      width: 100,
      sorter: true,
      render: (price: number, record: PricingRule) => `${price} ${record.currency}`
    },
    {
      title: 'T2加价',
      dataIndex: 't2Price',
      width: 100,
      sorter: true,
      render: (price: number, record: PricingRule) => `${price} ${record.currency}`
    },
    {
      title: 'T3加价',
      dataIndex: 't3Price',
      width: 100,
      sorter: true,
      render: (price: number, record: PricingRule) => `${price} ${record.currency}`
    },
    {
      title: '内部销售',
      dataIndex: 'internalSalesPrice',
      width: 100,
      sorter: true,
      render: (price: number, record: PricingRule) => `${price} ${record.currency}`
  }
    ] : []),
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
      title: '更新时间',
      dataIndex: 'updateTime',
      width: 160,
      sorter: true,
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: 200,
      fixed: 'right' as const,
      render: (_: unknown, record: PricingRule) => (
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
                  onClick={() => handleToggleStatus(record.id, record.status)}
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
      }
    ];

    let specificColumns: any[] = [];

    switch (activeFeeType) {
      case 'fcl':
        specificColumns = [
          {
            title: '规则ID',
            dataIndex: 'ruleId',
            width: 140,
            sorter: true,
            render: (ruleId: string) => (
              <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{ruleId}</span>
            )
          },
          {
            title: '航线名称',
            dataIndex: 'routeName',
            width: 120,
            sorter: true,
          },
          {
            title: '船公司',
            dataIndex: 'shippingCompany',
            width: 100,
            sorter: true,
          },
          {
            title: '起运港',
            dataIndex: 'originPort',
            width: 100,
            sorter: true,
          },
          {
            title: '费用名称',
            dataIndex: 'chargeName',
            width: 120,
            sorter: true,
          },
          {
            title: '计费单位',
            dataIndex: 'containerTypes',
            width: 180,
            sorter: true,
            render: (containerTypes: any[], record: any) => (
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                {containerTypes.map((container, index) => (
                  <Tooltip
                    key={index}
                    content={
                      <div style={{ padding: '8px' }}>
                        <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                          {container.type} 加价详情
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', fontSize: '12px' }}>
                          <div>T0加价: {container.t0Price} {record.currency}</div>
                          <div>T1加价: {container.t1Price} {record.currency}</div>
                          <div>T2加价: {container.t2Price} {record.currency}</div>
                          <div>T3加价: {container.t3Price} {record.currency}</div>
                          <div style={{ gridColumn: '1 / -1', marginTop: '4px', borderTop: '1px solid #eee', paddingTop: '4px' }}>
                            内部销售: {container.internalSalesPrice} {record.currency}
                          </div>
                        </div>
                      </div>
                    }
                    trigger="hover"
                  >
                    <Tag 
                      color="blue" 
                      style={{ cursor: 'pointer', margin: '2px' }}
                    >
                      {container.type}
                    </Tag>
                  </Tooltip>
                ))}
              </div>
            )
          }
        ];
        break;
      case 'lcl':
      case 'air':
        specificColumns = [
          {
            title: '航线名称',
            dataIndex: 'routeName',
            width: 140,
            sorter: true,
          },
          {
            title: '重量加价',
            dataIndex: 'weightPrice',
            width: 120,
            sorter: true,
            render: (price: number, record: PricingRule) => `${price} ${record.currency}/KG`
          },
          {
            title: '体积加价',
            dataIndex: 'volumePrice',
            width: 120,
            sorter: true,
            render: (price: number, record: PricingRule) => `${price} ${record.currency}/CBM`
          },
          {
            title: '最低加价',
            dataIndex: 'minPrice',
            width: 100,
            sorter: true,
            render: (price: number, record: PricingRule) => `${price} ${record.currency}`
          }
        ];
        break;
      case 'surcharge':
        specificColumns = [
          {
            title: '费用名称',
            dataIndex: 'chargeName',
            width: 150,
            sorter: true,
          },
          {
            title: '费用代码',
            dataIndex: 'chargeCode',
            width: 100,
            sorter: true,
          },
          {
            title: '费用类型',
            dataIndex: 'chargeType',
            width: 100,
            sorter: true,
            render: (type: string) => (
              <Tag color={type === 'fixed' ? 'blue' : 'purple'}>
                {type === 'fixed' ? '固定金额' : '百分比'}
              </Tag>
            )
          },
          {
            title: '基础费用',
            dataIndex: 'fixedAmount',
            width: 120,
            sorter: true,
            render: (amount: number, record: any) => {
              if (record.chargeType === 'fixed') {
                return `${amount || 0} ${record.currency}`;
              } else {
                return `${record.percentage || 0}%`;
              }
            }
          }
        ];
        break;
      case 'precarriage':
      case 'lastmile':
        specificColumns = [
          {
            title: '规则ID',
            dataIndex: 'ruleId',
            width: 140,
            sorter: true,
            render: (ruleId: string) => (
              <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#666' }}>
                {ruleId}
              </span>
            )
          },
          {
            title: activeFeeType === 'precarriage' ? '目的港' : '目的港',
            dataIndex: 'destination',
            width: 140,
            sorter: true,
          },
          {
            title: activeFeeType === 'precarriage' ? '起运港' : '配送地址',
            dataIndex: activeFeeType === 'precarriage' ? 'originPort' : 'destination',
            width: 140,
            sorter: true,
          },
          ...(activeFeeType === 'lastmile' ? [{
            title: '目的港代理',
            dataIndex: 'shippingCompany',
            width: 120,
            sorter: true,
          }] : []),
          {
            title: '费用名称',
            dataIndex: 'chargeName',
            width: 120,
            sorter: true,
          },
          ...(activeFeeType === 'precarriage' ? [
            {
              title: '运价类型',
              dataIndex: 'priceType',
              width: 100,
              sorter: true,
            },
            {
              title: '支线类型',
              dataIndex: 'branchType',
              width: 100,
              sorter: true,
              render: (branchType: string) => branchType || '-'
            },
            {
              title: '海铁类型',
              dataIndex: 'railType',
              width: 100,
              sorter: true,
              render: (railType: string) => railType || '-'
            }
          ] : []),
          {
            title: '计费单位',
            dataIndex: 'containerTypes',
            width: 180,
            sorter: true,
            render: (_: unknown, record: PrecarriagePricingRule | LastmilePricingRule) => (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {record.containerTypes.map((container, index) => (
                  <Tooltip
                    key={index}
                    content={
                      <div style={{ padding: '8px' }}>
                        <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#1d2129' }}>
                          {container.type} 详细信息
                        </div>
                        <div style={{ fontSize: '12px' }}>
                          {activeFeeType === 'lastmile' && 'basePrice' in container && (
                            <div>
                              <span style={{ color: '#86909c' }}>基础价格:</span>
                              <span style={{ marginLeft: '4px', fontWeight: 'bold' }}>
                                {container.basePrice} {record.currency}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    }
                  >
                    <Tag 
                      color="blue" 
                      style={{ 
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      {container.type}
                    </Tag>
                  </Tooltip>
                ))}
              </div>
            )
          },
          ...(activeFeeType === 'lastmile' ? [{
            title: '有效期',
            dataIndex: 'validPeriod',
            width: 180,
            sorter: true,
            render: (_: unknown, record: LastmilePricingRule) => (
              <span style={{ fontSize: '12px', color: '#666' }}>
                {record.validPeriod ? `${record.validPeriod.startDate} 至 ${record.validPeriod.endDate}` : '-'}
              </span>
            )
          }] : [])
        ];
        break;
    }

    return [...baseColumns, ...specificColumns, ...commonColumns];
  };

  // 详情处理
  const handleDetail = (record: PricingRule) => {
    setCurrentRule(record);
    setDetailModalVisible(true);
  };

  // 编辑处理 - 跳转到编辑页面
  const handleEdit = (record: PricingRule) => {
    navigate(`/controltower/saas/pricing-rule-management/edit/${record.id}?type=${activeFeeType}`);
  };

  // 新增处理 - 跳转到新增页面
  const handleAdd = () => {
    navigate(`/controltower/saas/pricing-rule-management/add?type=${activeFeeType}`);
  };

  // 初始化和组件生命周期
  useEffect(() => {
    const defaultScheme = initializeDefaultScheme(activeFeeType);
    setFilterSchemes([defaultScheme]);
    setFilterConditions(defaultScheme.conditions);
    setCurrentSchemeId('default');
    
    // 初始化筛选字段顺序
    const fields = getFilterFieldsByTab(activeFeeType);
    setFilterFieldOrder(fields.map(field => field.key));
  }, [activeFeeType]);

  // 拖拽处理函数
  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    setDraggedItem(itemId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, itemId: string) => {
    e.preventDefault();
    setDragOverItem(itemId);
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverItem(null);
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    
    if (!draggedItem || draggedItem === targetId) {
      return;
    }

    const newOrder = [...columnOrder];
    const draggedIndex = newOrder.indexOf(draggedItem);
    const targetIndex = newOrder.indexOf(targetId);
    
    // 移动元素
    newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, draggedItem);
    
    setColumnOrder(newOrder);
    setDraggedItem(null);
    setDragOverItem(null);
  };

  // 筛选字段拖拽处理
  const handleFilterFieldDragStart = (e: React.DragEvent, fieldKey: string) => {
    setDraggedFilterField(fieldKey);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleFilterFieldDragOver = (e: React.DragEvent, fieldKey: string) => {
    e.preventDefault();
    setDragOverFilterField(fieldKey);
    e.dataTransfer.dropEffect = 'move';
  };

  const handleFilterFieldDragEnd = () => {
    setDraggedFilterField(null);
    setDragOverFilterField(null);
  };

  const handleFilterFieldDrop = (e: React.DragEvent, targetKey: string) => {
    e.preventDefault();
    
    if (!draggedFilterField || draggedFilterField === targetKey) {
      return;
    }

    const newOrder = [...filterFieldOrder];
    const draggedIndex = newOrder.indexOf(draggedFilterField);
    const targetIndex = newOrder.indexOf(targetKey);
    
    // 移动元素
    newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, draggedFilterField);
    
    setFilterFieldOrder(newOrder);
    setDraggedFilterField(null);
    setDragOverFilterField(null);
  };

  // 表格列可见性控制
  const toggleColumnVisibility = (columnKey: string) => {
    setColumnVisibility(prev => ({
      ...prev,
      [columnKey]: !prev[columnKey]
    }));
  };

  // 全选/清空列
  const selectAllColumns = () => {
    const newVisibility: {[key: string]: boolean} = {};
    // 只处理可自定义的列
    columnOrder.filter(key => key !== 'checkbox' && key !== 'action' && key !== '').forEach(key => {
      newVisibility[key] = true;
    });
    setColumnVisibility(newVisibility);
  };

  const clearAllColumns = () => {
    const newVisibility: {[key: string]: boolean} = {};
    // 只处理可自定义的列
    columnOrder.filter(key => key !== 'checkbox' && key !== 'action' && key !== '').forEach(key => {
      newVisibility[key] = false;
    });
    setColumnVisibility(newVisibility);
  };

  // 重置默认列设置
  const resetDefaultColumns = () => {
    const allColumns = getColumns().map(col => col.dataIndex || col.key || '');
    // 排除checkbox列和操作列，这些列不参与自定义表格功能
    const defaultColumns = allColumns.filter(key => key !== 'checkbox' && key !== 'action' && key !== '');
    setColumnOrder(defaultColumns);
    
    const defaultVisibility: {[key: string]: boolean} = {};
    defaultColumns.forEach(key => {
      defaultVisibility[key] = true;
    });
    setColumnVisibility(defaultVisibility);
  };

  // 渲染单个筛选条件
  const renderFilterCondition = (condition: FilterCondition) => {
    const fieldConfig = getFilterFieldsByTab(activeFeeType).find(field => field.key === condition.key);
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
      <div className="mb-4 filter-area-card">
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
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 6px;
              padding: 16px;
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
      </div>
    );
  };



  // 初始化
  useEffect(() => {
    // 重新初始化筛选条件
    setFilterConditions(initializeDefaultConditions(activeFeeType));
    setCurrentSchemeId(initializeDefaultScheme(activeFeeType).id);
    // 初始化列设置 - 排除checkbox列和操作列
    const columns = getColumns();
    const allColumnKeys = columns.map(col => col.dataIndex || col.key || '');
    const defaultOrder = allColumnKeys.filter(key => key !== 'checkbox' && key !== 'action' && key !== '');
    setColumnOrder(defaultOrder);
    
    const defaultVisibility: {[key: string]: boolean} = {};
    defaultOrder.forEach(key => {
      defaultVisibility[key] = true;
    });
    setColumnVisibility(defaultVisibility);
  }, [activeFeeType]);

  return (
    <ControlTowerSaasLayout>
      <div style={{ padding: '16px' }}>
        <Card>
          {/* 费用类型切换Tab */}
          <div style={{ marginBottom: '16px' }}>
            <Tabs activeTab={activeFeeType} onChange={handleFeeTypeChange}>
              {feeTypeOptions.map(option => (
                <TabPane key={option.key} title={option.title} />
              ))}
            </Tabs>
          </div>

          {/* 新版筛选区域 */}
          {renderNewFilterArea()}

          {/* 操作按钮区域 */}
          <div className="flex justify-between mb-4">
            <Space>
              <Button type="primary" icon={<IconPlus />} onClick={handleAdd}>
                新增规则
              </Button>
              {selectedRowKeys.length > 0 && (
                <>
                  <Button 
                    type="outline" 
                    status="success"
                    onClick={() => handleBatchToggleStatus('enabled')}
                  >
                    批量启用 ({selectedRowKeys.length})
                  </Button>
                  <Button 
                    type="outline" 
                    status="warning"
                    onClick={() => handleBatchToggleStatus('disabled')}
                  >
                    批量禁用 ({selectedRowKeys.length})
                  </Button>
                </>
              )}
            </Space>
            <div 
              className="flex items-center text-blue-500 cursor-pointer hover:text-blue-700"
              onClick={() => setCustomTableModalVisible(true)}
            >
              <IconList className="mr-1" />
              <span>自定义表格</span>
            </div>
          </div>

          <Table
            columns={getColumns()}
            data={filteredData}
            rowKey="id"
            scroll={{ x: 1600 }}
            pagination={{
              pageSize: 10,
              showTotal: true,
              showJumper: true,
              sizeCanChange: true,
            }}
          />

          {/* 详情抽屉 */}
          <Drawer
            title="加价规则详情"
            visible={detailModalVisible}
            onCancel={() => setDetailModalVisible(false)}
            footer={
              <div style={{ textAlign: 'right', padding: '16px' }}>
                <Button onClick={() => setDetailModalVisible(false)}>
                  关闭
                </Button>
              </div>
            }
            width={600}
            placement="right"
          >
            {currentRule && (
              <div style={{ padding: '16px', height: '100%', overflow: 'auto' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {/* 根据费用类型显示不同的字段 */}
                  {activeFeeType === 'fcl' && (
                    <>
                      {/* 基本信息卡片 */}
                      <div style={{ 
                        border: '1px solid #e5e6e7', 
                        borderRadius: '8px', 
                        padding: '16px',
                        backgroundColor: '#fafbfc'
                      }}>
                        <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '16px', color: '#1d2129' }}>
                          基本信息
                        </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                          <div style={{ marginBottom: '8px', fontWeight: 'bold', color: '#4e5969' }}>规则ID</div>
                          <div style={{ fontFamily: 'monospace', fontSize: '12px', color: '#165DFF', backgroundColor: '#f2f3ff', padding: '4px 8px', borderRadius: '4px' }}>
                            {'ruleId' in currentRule ? currentRule.ruleId : '-'}
                          </div>
                </div>
                <div>
                          <div style={{ marginBottom: '8px', fontWeight: 'bold', color: '#4e5969' }}>航线名称</div>
                          <div style={{ color: '#1d2129' }}>{'routeName' in currentRule ? currentRule.routeName : '-'}</div>
                        </div>
                  <div>
                          <div style={{ marginBottom: '8px', fontWeight: 'bold', color: '#4e5969' }}>船公司</div>
                          <div style={{ color: '#1d2129' }}>{'shippingCompany' in currentRule ? currentRule.shippingCompany : '-'}</div>
                  </div>
                        <div>
                          <div style={{ marginBottom: '8px', fontWeight: 'bold', color: '#4e5969' }}>起运港</div>
                          <div style={{ color: '#1d2129' }}>{'originPort' in currentRule ? currentRule.originPort : '-'}</div>
                </div>
                <div>
                          <div style={{ marginBottom: '8px', fontWeight: 'bold', color: '#4e5969' }}>费用名称</div>
                          <div style={{ color: '#1d2129' }}>{'chargeName' in currentRule ? currentRule.chargeName : '-'}</div>
                        </div>
                      </div>
                    </div>

                    {/* 箱型及加价详情卡片 */}
                    <div style={{ 
                      border: '1px solid #e5e6e7', 
                      borderRadius: '8px', 
                      padding: '16px',
                      backgroundColor: '#fafbfc'
                    }}>
                      <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '16px', color: '#1d2129' }}>
                        计费单位及加价详情
              </div>
              <div>
                      {'containerTypes' in currentRule && currentRule.containerTypes ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          {currentRule.containerTypes.map((container: any, index: number) => (
                            <div key={index} style={{ 
                              border: '1px solid #d9d9d9', 
                              borderRadius: '6px', 
                              padding: '16px',
                              backgroundColor: '#ffffff'
                            }}>
                              <div style={{ fontWeight: 'bold', marginBottom: '12px', color: '#1890ff', fontSize: '14px' }}>
                                📦 {container.type}
                              </div>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
                                <div style={{ padding: '8px', backgroundColor: '#f6f7f9', borderRadius: '4px' }}>
                                  <span style={{ color: '#4e5969', fontWeight: 'bold' }}>T0加价: </span>
                                  <span style={{ color: '#1d2129' }}>{container.t0Price} {currentRule.currency}</span>
                                </div>
                                <div style={{ padding: '8px', backgroundColor: '#f6f7f9', borderRadius: '4px' }}>
                                  <span style={{ color: '#4e5969', fontWeight: 'bold' }}>T1加价: </span>
                                  <span style={{ color: '#1d2129' }}>{container.t1Price} {currentRule.currency}</span>
                                </div>
                                <div style={{ padding: '8px', backgroundColor: '#f6f7f9', borderRadius: '4px' }}>
                                  <span style={{ color: '#4e5969', fontWeight: 'bold' }}>T2加价: </span>
                                  <span style={{ color: '#1d2129' }}>{container.t2Price} {currentRule.currency}</span>
                                </div>
                                <div style={{ padding: '8px', backgroundColor: '#f6f7f9', borderRadius: '4px' }}>
                                  <span style={{ color: '#4e5969', fontWeight: 'bold' }}>T3加价: </span>
                                  <span style={{ color: '#1d2129' }}>{container.t3Price} {currentRule.currency}</span>
                                </div>
                                <div style={{ 
                                  gridColumn: '1 / -1', 
                                  marginTop: '8px', 
                                  paddingTop: '12px', 
                                  borderTop: '1px solid #e5e6e7',
                                  padding: '8px',
                                  backgroundColor: '#e6f7ff',
                                  borderRadius: '4px'
                                }}>
                                  <span style={{ color: '#0958d9', fontWeight: 'bold' }}>内部销售: </span>
                                  <span style={{ color: '#1d2129' }}>{container.internalSalesPrice} {currentRule.currency}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div style={{ textAlign: 'center', color: '#86909c', padding: '20px' }}>暂无计费单位信息</div>
                      )}
                    </div>
                  </div>
                </>
              )}
              
              {(activeFeeType === 'lcl' || activeFeeType === 'air') && (
                <div style={{ 
                  border: '1px solid #e5e6e7', 
                  borderRadius: '8px', 
                  padding: '16px',
                  backgroundColor: '#fafbfc'
                }}>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '16px', color: '#1d2129' }}>
                    {activeFeeType === 'lcl' ? '拼箱海运费' : '空运运费'}详情
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                      <div style={{ marginBottom: '8px', fontWeight: 'bold', color: '#4e5969' }}>航线名称</div>
                      <div style={{ color: '#1d2129' }}>{'routeName' in currentRule ? currentRule.routeName : '-'}</div>
                    </div>
                    <div>
                      <div style={{ marginBottom: '8px', fontWeight: 'bold', color: '#4e5969' }}>重量加价</div>
                      <div style={{ color: '#1d2129' }}>{'weightPrice' in currentRule ? `${currentRule.weightPrice} ${currentRule.currency}/KG` : '-'}</div>
                    </div>
                    <div>
                      <div style={{ marginBottom: '8px', fontWeight: 'bold', color: '#4e5969' }}>体积加价</div>
                      <div style={{ color: '#1d2129' }}>{'volumePrice' in currentRule ? `${currentRule.volumePrice} ${currentRule.currency}/CBM` : '-'}</div>
                    </div>
                    <div>
                      <div style={{ marginBottom: '8px', fontWeight: 'bold', color: '#4e5969' }}>最低加价</div>
                      <div style={{ color: '#1d2129' }}>{'minPrice' in currentRule ? `${currentRule.minPrice} ${currentRule.currency}` : '-'}</div>
                    </div>
                  </div>
                </div>
              )}
              
              {(activeFeeType === 'precarriage' || activeFeeType === 'lastmile') && (
                <>
                  {/* 基本信息卡片 */}
                  <div style={{ 
                    border: '1px solid #e5e6e7', 
                    borderRadius: '8px', 
                    padding: '16px',
                    backgroundColor: '#fafbfc'
                  }}>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '16px', color: '#1d2129' }}>
                      基本信息
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                        <div style={{ marginBottom: '8px', fontWeight: 'bold', color: '#4e5969' }}>规则ID</div>
                        <div style={{ fontFamily: 'monospace', fontSize: '12px', color: '#165DFF', backgroundColor: '#f2f3ff', padding: '4px 8px', borderRadius: '4px' }}>
                          {'ruleId' in currentRule ? currentRule.ruleId : '-'}
                        </div>
              </div>
              <div>
                        <div style={{ marginBottom: '8px', fontWeight: 'bold', color: '#4e5969' }}>
                          {activeFeeType === 'precarriage' ? '起运地' : '目的港'}
                        </div>
                        <div style={{ color: '#1d2129' }}>{'origin' in currentRule ? currentRule.origin : '-'}</div>
              </div>
              <div>
                        <div style={{ marginBottom: '8px', fontWeight: 'bold', color: '#4e5969' }}>
                          {activeFeeType === 'precarriage' ? '起运港' : '配送地址'}
                        </div>
                        <div style={{ color: '#1d2129' }}>{'destination' in currentRule ? currentRule.destination : '-'}</div>
                      </div>
              <div>
                        <div style={{ marginBottom: '8px', fontWeight: 'bold', color: '#4e5969' }}>费用名称</div>
                        <div style={{ color: '#1d2129' }}>{'chargeName' in currentRule ? currentRule.chargeName : '-'}</div>
              </div>
                      {activeFeeType === 'precarriage' && (
                        <>
                          <div>
                            <div style={{ marginBottom: '8px', fontWeight: 'bold', color: '#4e5969' }}>运价类型</div>
                            <div style={{ color: '#1d2129' }}>{'priceType' in currentRule ? currentRule.priceType : '-'}</div>
                          </div>
                          <div>
                            <div style={{ marginBottom: '8px', fontWeight: 'bold', color: '#4e5969' }}>支线类型</div>
                            <div style={{ color: '#1d2129' }}>{'branchType' in currentRule ? currentRule.branchType || '-' : '-'}</div>
                          </div>
                          <div>
                            <div style={{ marginBottom: '8px', fontWeight: 'bold', color: '#4e5969' }}>海铁类型</div>
                            <div style={{ color: '#1d2129' }}>{'railType' in currentRule ? currentRule.railType || '-' : '-'}</div>
                          </div>
                        </>
                      )}
                      {activeFeeType === 'lastmile' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <span style={{ fontWeight: 'bold' }}>目的港代理：</span>
                          <span>
                            {(() => {
                              const rule = pricingRuleData.find(r => r.id === pendingToggleRule!.id);
                              return rule && 'shippingCompany' in rule ? rule.shippingCompany : '-';
                            })()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 箱型详情卡片 */}
                  <div style={{ 
                    border: '1px solid #e5e6e7', 
                    borderRadius: '8px', 
                    padding: '16px',
                    backgroundColor: '#fafbfc'
                  }}>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '16px', color: '#1d2129' }}>
                      箱型详情
                    </div>
                    <div>
                      {'containerTypes' in currentRule && currentRule.containerTypes ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          {currentRule.containerTypes.map((container: any, index: number) => (
                            <div key={index} style={{ 
                              border: '1px solid #d9d9d9', 
                              borderRadius: '6px', 
                              padding: '16px',
                              backgroundColor: '#ffffff'
                            }}>
                              <div style={{ fontWeight: 'bold', marginBottom: '12px', color: '#1890ff', fontSize: '14px' }}>
                                📦 {container.type}
                              </div>
                              {activeFeeType === 'lastmile' && container.basePrice && (
                                <div style={{ fontSize: '13px' }}>
                                  <div style={{ padding: '8px', backgroundColor: '#f6f7f9', borderRadius: '4px' }}>
                                    <span style={{ color: '#4e5969', fontWeight: 'bold' }}>基础价格: </span>
                                    <span style={{ color: '#1d2129' }}>{container.basePrice} {currentRule.currency}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div style={{ textAlign: 'center', color: '#86909c', padding: '20px' }}>暂无箱型信息</div>
                      )}
                    </div>
                  </div>
                </>
              )}
              
              {/* 只有拼箱、空运才显示T0~T3加价信息 */}
              {activeFeeType !== 'fcl' && activeFeeType !== 'precarriage' && activeFeeType !== 'lastmile' && (
                <div style={{ 
                  border: '1px solid #e5e6e7', 
                  borderRadius: '8px', 
                  padding: '16px',
                  backgroundColor: '#fafbfc'
                }}>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '16px', color: '#1d2129' }}>
                    加价详情
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div style={{ padding: '12px', backgroundColor: '#f6f7f9', borderRadius: '6px' }}>
                      <div style={{ marginBottom: '8px', fontWeight: 'bold', color: '#4e5969' }}>T0加价</div>
                      <div style={{ color: '#1d2129', fontSize: '14px', fontWeight: 'bold' }}>
                        {'t0Price' in currentRule ? `${currentRule.t0Price} ${currentRule.currency}` : '-'}
                      </div>
                    </div>
                    <div style={{ padding: '12px', backgroundColor: '#f6f7f9', borderRadius: '6px' }}>
                      <div style={{ marginBottom: '8px', fontWeight: 'bold', color: '#4e5969' }}>T1加价</div>
                      <div style={{ color: '#1d2129', fontSize: '14px', fontWeight: 'bold' }}>
                        {'t1Price' in currentRule ? `${currentRule.t1Price} ${currentRule.currency}` : '-'}
                      </div>
                    </div>
                    <div style={{ padding: '12px', backgroundColor: '#f6f7f9', borderRadius: '6px' }}>
                      <div style={{ marginBottom: '8px', fontWeight: 'bold', color: '#4e5969' }}>T2加价</div>
                      <div style={{ color: '#1d2129', fontSize: '14px', fontWeight: 'bold' }}>
                        {'t2Price' in currentRule ? `${currentRule.t2Price} ${currentRule.currency}` : '-'}
                      </div>
                    </div>
                    <div style={{ padding: '12px', backgroundColor: '#f6f7f9', borderRadius: '6px' }}>
                      <div style={{ marginBottom: '8px', fontWeight: 'bold', color: '#4e5969' }}>T3加价</div>
                      <div style={{ color: '#1d2129', fontSize: '14px', fontWeight: 'bold' }}>
                        {'t3Price' in currentRule ? `${currentRule.t3Price} ${currentRule.currency}` : '-'}
                      </div>
                    </div>
                    <div style={{ 
                      gridColumn: '1 / -1', 
                      padding: '12px', 
                      backgroundColor: '#e6f7ff', 
                      borderRadius: '6px',
                      marginTop: '8px'
                    }}>
                      <div style={{ marginBottom: '8px', fontWeight: 'bold', color: '#0958d9' }}>内部销售加价</div>
                      <div style={{ color: '#1d2129', fontSize: '14px', fontWeight: 'bold' }}>
                        {'internalSalesPrice' in currentRule ? `${currentRule.internalSalesPrice} ${currentRule.currency}` : '-'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 通用字段 */}
              <div style={{ 
                border: '1px solid #e5e6e7', 
                borderRadius: '8px', 
                padding: '16px',
                backgroundColor: '#fafbfc'
              }}>
                <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '16px', color: '#1d2129' }}>
                  规则状态
                </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                    <div style={{ marginBottom: '8px', fontWeight: 'bold', color: '#4e5969' }}>币种</div>
                    <div>
                      <Tag color={currentRule.currency === 'USD' ? 'green' : 'orange'}>{currentRule.currency}</Tag>
                    </div>
                </div>
                <div>
                    <div style={{ marginBottom: '8px', fontWeight: 'bold', color: '#4e5969' }}>状态</div>
                    <div>
                      <Tag color={currentRule.status === 'enabled' ? 'green' : 'red'}>
                        {currentRule.status === 'enabled' ? '启用' : '禁用'}
                      </Tag>
                    </div>
                  </div>
                </div>
              </div>
            </div>
              {/* 时间信息 */}
              <div style={{ 
                border: '1px solid #e5e6e7', 
                borderRadius: '8px', 
                padding: '16px',
                backgroundColor: '#fafbfc'
              }}>
                <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '16px', color: '#1d2129' }}>
                  时间信息
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <div style={{ marginBottom: '8px', fontWeight: 'bold', color: '#4e5969' }}>创建时间</div>
                    <div style={{ color: '#1d2129', fontSize: '13px' }}>{currentRule.createTime}</div>
                  </div>
                  <div>
                    <div style={{ marginBottom: '8px', fontWeight: 'bold', color: '#4e5969' }}>更新时间</div>
                    <div style={{ color: '#1d2129', fontSize: '13px' }}>{currentRule.updateTime}</div>
                </div>
              </div>
              </div>
          </div>
        )}
      </Drawer>

      {/* 启用/禁用确认弹窗 */}
      <Modal
        title={pendingToggleRule ? `确定要${pendingToggleRule.currentStatus === 'enabled' ? '禁用' : '启用'}该规则吗？` : '确认操作'}
        visible={toggleStatusModalVisible}
        onCancel={() => {
          setToggleStatusModalVisible(false);
          setPendingToggleRule(null);
        }}
        onOk={handleConfirmToggleStatus}
        okText={pendingToggleRule ? `确定${pendingToggleRule.currentStatus === 'enabled' ? '禁用' : '启用'}` : '确定'}
        cancelText="取消"
        okButtonProps={{
          style: pendingToggleRule ? {
            backgroundColor: pendingToggleRule.currentStatus === 'enabled' ? '#F53F3F' : '#00B42A',
            borderColor: pendingToggleRule.currentStatus === 'enabled' ? '#F53F3F' : '#00B42A'
          } : {}
        }}
        style={{ width: 500 }}
      >
        {pendingToggleRule && (
          <div style={{ marginTop: '16px' }}>
            {/* 根据费用类型显示不同的规则信息 */}
            {activeFeeType === 'fcl' && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 'bold' }}>规则ID：</span>
                  <span style={{ fontFamily: 'monospace', color: '#165DFF' }}>
                    {(() => {
                      const rule = pricingRuleData.find(r => r.id === pendingToggleRule.id);
                      return rule && 'ruleId' in rule ? rule.ruleId : '-';
                    })()}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 'bold' }}>航线名称：</span>
                  <span>
                    {(() => {
                      const rule = pricingRuleData.find(r => r.id === pendingToggleRule.id);
                      return rule && 'routeName' in rule ? rule.routeName : '-';
                    })()}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 'bold' }}>船公司：</span>
                  <span>
                    {(() => {
                      const rule = pricingRuleData.find(r => r.id === pendingToggleRule.id);
                      return rule && 'shippingCompany' in rule ? rule.shippingCompany : '-';
                    })()}
                  </span>
                </div>
              </>
            )}
            {(activeFeeType === 'lcl' || activeFeeType === 'air') && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{ fontWeight: 'bold' }}>航线名称：</span>
                <span>
                  {(() => {
                    const rule = pricingRuleData.find(r => r.id === pendingToggleRule.id);
                    return rule && 'routeName' in rule ? rule.routeName : '-';
                  })()}
                </span>
              </div>
            )}

            {(activeFeeType === 'precarriage' || activeFeeType === 'lastmile') && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 'bold' }}>规则ID：</span>
                  <span style={{ fontFamily: 'monospace', color: '#165DFF' }}>
                    {(() => {
                      const rule = pricingRuleData.find(r => r.id === pendingToggleRule.id);
                      return rule && 'ruleId' in rule ? rule.ruleId : '-';
                    })()}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 'bold' }}>{activeFeeType === 'precarriage' ? '起运地' : '目的港'}：</span>
                  <span>
                    {(() => {
                      const rule = pricingRuleData.find(r => r.id === pendingToggleRule.id);
                      return rule && 'origin' in rule ? rule.origin : '-';
                    })()}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 'bold' }}>{activeFeeType === 'precarriage' ? '起运港' : '配送地址'}：</span>
                  <span>
                    {(() => {
                      const rule = pricingRuleData.find(r => r.id === pendingToggleRule.id);
                      return rule && 'destination' in rule ? rule.destination : '-';
                    })()}
                  </span>
                </div>
                {activeFeeType === 'precarriage' && (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span style={{ fontWeight: 'bold' }}>运价类型：</span>
                      <span>
                        {(() => {
                          const rule = pricingRuleData.find(r => r.id === pendingToggleRule.id);
                          return rule && 'priceType' in rule ? rule.priceType : '-';
                        })()}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span style={{ fontWeight: 'bold' }}>支线类型：</span>
                      <span>
                        {(() => {
                          const rule = pricingRuleData.find(r => r.id === pendingToggleRule.id);
                          return rule && 'branchType' in rule ? rule.branchType || '-' : '-';
                        })()}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span style={{ fontWeight: 'bold' }}>海铁类型：</span>
                      <span>
                        {(() => {
                          const rule = pricingRuleData.find(r => r.id === pendingToggleRule.id);
                          return rule && 'railType' in rule ? rule.railType || '-' : '-';
                        })()}
                      </span>
                    </div>
                  </>
                )}
                {activeFeeType === 'lastmile' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 'bold' }}>目的港代理：</span>
                    <span>
                      {(() => {
                        const rule = pricingRuleData.find(r => r.id === pendingToggleRule.id);
                        return rule && 'shippingCompany' in rule ? rule.shippingCompany : '-';
                      })()}
                    </span>
                  </div>
                )}
              </>
            )}
            <div style={{ 
              padding: '12px', 
              backgroundColor: pendingToggleRule.currentStatus === 'enabled' ? '#fff2f0' : '#f6ffed',
              border: `1px solid ${pendingToggleRule.currentStatus === 'enabled' ? '#F53F3F' : '#00B42A'}20`,
              borderRadius: '6px',
              marginTop: '12px'
            }}>
              <span style={{ 
                color: pendingToggleRule.currentStatus === 'enabled' ? '#F53F3F' : '#00B42A', 
                fontWeight: 'bold' 
              }}>
                {pendingToggleRule.currentStatus === 'enabled' ? '禁用' : '启用'}后，该规则将{pendingToggleRule.currentStatus === 'enabled' ? '停止生效' : '重新生效'}
              </span>
            </div>
          </div>
        )}
      </Modal>

      {/* 批量启用/禁用确认弹窗 */}
      <Modal
        title={pendingBatchToggleStatus ? `确定要批量${pendingBatchToggleStatus === 'enabled' ? '启用' : '禁用'}选中的规则吗？` : '确认批量操作'}
        visible={batchToggleModalVisible}
        onCancel={() => {
          setBatchToggleModalVisible(false);
          setPendingBatchToggleStatus(null);
        }}
        onOk={handleConfirmBatchToggleStatus}
        okText={pendingBatchToggleStatus ? `确定批量${pendingBatchToggleStatus === 'enabled' ? '启用' : '禁用'}` : '确定'}
        cancelText="取消"
        okButtonProps={{
          style: pendingBatchToggleStatus ? {
            backgroundColor: pendingBatchToggleStatus === 'enabled' ? '#00B42A' : '#F53F3F',
            borderColor: pendingBatchToggleStatus === 'enabled' ? '#00B42A' : '#F53F3F'
          } : {}
        }}
        style={{ width: 500 }}
      >
        {pendingBatchToggleStatus && (
          <div style={{ marginTop: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontWeight: 'bold' }}>选中规则数量：</span>
              <span style={{ color: '#165DFF', fontWeight: 'bold' }}>{selectedRowKeys.length} 条</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontWeight: 'bold' }}>费用类型：</span>
              <span>{feeTypeOptions.find(option => option.key === activeFeeType)?.title}</span>
            </div>
            <div style={{ 
              padding: '12px', 
              backgroundColor: pendingBatchToggleStatus === 'enabled' ? '#f6ffed' : '#fff2f0',
              border: `1px solid ${pendingBatchToggleStatus === 'enabled' ? '#00B42A' : '#F53F3F'}20`,
              borderRadius: '6px',
              marginTop: '12px'
            }}>
              <span style={{ 
                color: pendingBatchToggleStatus === 'enabled' ? '#00B42A' : '#F53F3F', 
                fontWeight: 'bold' 
              }}>
                批量{pendingBatchToggleStatus === 'enabled' ? '启用' : '禁用'}后，所选规则将{pendingBatchToggleStatus === 'enabled' ? '重新生效' : '停止生效'}
              </span>
            </div>
          </div>
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
        onCancel={() => setCustomTableModalVisible(false)}
        footer={
          <div className="flex justify-between">
            <Button onClick={resetDefaultColumns}>重置默认</Button>
            <Space>
              <Button onClick={() => setCustomTableModalVisible(false)}>取消</Button>
              <Button type="primary" onClick={() => setCustomTableModalVisible(false)}>确认</Button>
            </Space>
          </div>
        }
      >
        <div className="h-full flex flex-col">
          {/* 快捷操作 */}
          <div className="flex justify-between items-center mb-4 p-4 bg-gray-50">
            <div className="text-sm text-gray-600">
              已选择 {Object.values(columnVisibility).filter(Boolean).length}/{columnOrder.filter(key => key !== 'checkbox' && key !== 'action' && key !== '').length} 个字段
            </div>
            <Space>
              <Button size="small" onClick={selectAllColumns}>全选</Button>
              <Button size="small" onClick={clearAllColumns}>清空</Button>
            </Space>
          </div>
          
          {/* 可拖拽的字段列表 */}
          <div className="flex-1 overflow-y-auto px-4">
            {columnOrder.filter(key => key !== 'checkbox' && key !== 'action' && key !== '').map((columnKey, index) => (
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
                    <span className="text-sm font-medium">
                      {getColumns().find(col => col.dataIndex === columnKey || col.key === columnKey)?.title || columnKey}
                    </span>
                  </div>
                </div>
                <Switch 
                  size="small"
                  checked={columnVisibility[columnKey] || false} 
                  onChange={() => toggleColumnVisibility(columnKey)}
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
        onCancel={() => setFilterFieldModalVisible(false)}
        footer={
          <div className="flex justify-between">
            <Button onClick={() => {
              const fields = getFilterFieldsByTab(activeFeeType);
              setFilterFieldOrder(fields.map(field => field.key));
              fields.forEach(field => {
                updateFilterConditionVisibility(field.key, true);
              });
            }}>重置默认</Button>
            <Space>
              <Button onClick={() => setFilterFieldModalVisible(false)}>取消</Button>
              <Button type="primary" onClick={() => setFilterFieldModalVisible(false)}>确认</Button>
            </Space>
          </div>
        }
      >
        <div className="h-full flex flex-col">
          {/* 快捷操作 */}
          <div className="flex justify-between items-center mb-4 p-4 bg-gray-50">
            <div className="text-sm text-gray-600">
              已选择 {filterConditions.filter(c => c.visible).length}/{getFilterFieldsByTab(activeFeeType).length} 个字段
            </div>
            <Space>
              <Button size="small" onClick={() => {
                getFilterFieldsByTab(activeFeeType).forEach(field => {
                  updateFilterConditionVisibility(field.key, true);
                });
              }}>全选</Button>
              <Button size="small" onClick={() => {
                getFilterFieldsByTab(activeFeeType).forEach(field => {
                  updateFilterConditionVisibility(field.key, false);
                });
              }}>清空</Button>
            </Space>
          </div>
          
          {/* 可拖拽的字段列表 */}
          <div className="flex-1 overflow-y-auto px-4">
            {filterFieldOrder.map((fieldKey, index) => {
              const fieldConfig = getFilterFieldsByTab(activeFeeType).find(f => f.key === fieldKey);
              const condition = filterConditions.find(c => c.key === fieldKey);
              const isSelected = condition?.visible || false;
              
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
                    checked={isSelected} 
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
        onCancel={() => {
          setSchemeModalVisible(false);
          setSchemeName('');
        }}
        onOk={saveFilterScheme}
        okText="保存"
        cancelText="取消"
      >
        <div style={{ marginBottom: '16px' }}>
          <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>方案名称</div>
          <Input
            value={schemeName}
            onChange={setSchemeName}
            placeholder="请输入方案名称"
            maxLength={20}
          />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>当前筛选条件</div>
          <div style={{ padding: '8px', backgroundColor: '#fafbfc', borderRadius: '4px', border: '1px solid #e5e6e7' }}>
            {filterConditions.filter(c => c.visible && c.value).length > 0 ? (
              filterConditions.filter(c => c.visible && c.value).map((condition, index) => {
                const fieldConfig = getFilterFieldsByTab(activeFeeType).find(f => f.key === condition.key);
                return (
                  <div key={index} style={{ fontSize: '12px', color: '#4e5969', marginBottom: '4px' }}>
                    {fieldConfig?.label}: {condition.mode} {condition.value}
                  </div>
                );
              })
            ) : (
              <div style={{ fontSize: '12px', color: '#86909c' }}>暂无有效筛选条件</div>
            )}
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
  </div>
</ControlTowerSaasLayout>
  );
};

export default PricingRuleManagement;