import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Select, 
  DatePicker, 
  Card, 
  Typography,
  Tag,
  Modal,
  Message,
  Switch,
  Grid,
  Tooltip,
  Tabs,
  Input,
  Drawer
} from '@arco-design/web-react';
import { 
  IconSearch, 
  IconRefresh,
  IconList,
  IconDragDotVertical,
  IconDown,
  IconUp,
  IconSettings,
  IconDownload,
  IconEye
} from '@arco-design/web-react/icon';
import '@arco-design/web-react/dist/css/arco.css';
import './InquiryManagement.css';

// 添加双倍行高样式和对齐样式
const customTableStyle = `
  .table-row-double-height .arco-table-td {
    height: 60px !important;
    vertical-align: middle;
  }
  .table-row-double-height .arco-table-cell {
    line-height: 1.2;
    padding: 12px 16px;
  }
  .inquiry-table-nowrap .arco-table-td {
    text-align: left !important;
  }
  .inquiry-table-nowrap .arco-table-th {
    text-align: center !important;
  }
  .inquiry-table-nowrap .arco-table-cell {
    white-space: nowrap !important;
    overflow: visible !important;
    text-overflow: unset !important;
  }
  .inquiry-table-nowrap .arco-table-th .arco-table-cell {
    text-align: center !important;
    padding: 12px 16px !important;
  }
  .inquiry-table-nowrap .arco-table-td .arco-table-cell {
    text-align: left !important;
    padding: 12px 16px !important;
    white-space: nowrap !important;
    overflow: visible !important;
    text-overflow: unset !important;
  }
  .inquiry-table-nowrap .arco-table-thead .arco-table-th {
    text-align: center !important;
  }
  .inquiry-table-nowrap .arco-table-tbody .arco-table-td {
    text-align: left !important;
  }
  .no-ellipsis {
    white-space: nowrap !important;
    overflow: visible !important;
    text-overflow: unset !important;
  }
  .arco-table-selection-col {
    text-align: center !important;
  }
  .arco-table-selection-col .arco-table-cell {
    text-align: center !important;
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
  }
  .arco-table-selection-col .arco-checkbox {
    margin: 0 auto !important;
  }
  .arco-table-selection-col .arco-checkbox-wrapper {
    margin: 0 auto !important;
  }
`;

// 注入样式
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = customTableStyle;
  document.head.appendChild(styleElement);
}
import { useNavigate } from 'react-router-dom';

const Title = Typography.Title;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

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

// 根据不同Tab定义不同的筛选字段配置
const getFilterFieldsByTab = (activeTab: string): FilterFieldConfig[] => {
  switch (activeTab) {
    case 'fcl':
    case 'lcl':
    case 'air':
      return [
        {
          key: 'routeCode',
          label: '运价号',
          type: 'text',
          placeholder: '请输入运价号'
        },
        {
          key: 'rateType',
          label: '运价类型',
          type: 'select',
          options: [
            { label: '合约价', value: '合约价' },
            { label: 'SPOT电商', value: 'SPOT电商' }
          ],
          placeholder: '请选择运价类型'
        },
        {
          key: 'departurePort',
          label: '起运港',
          type: 'select',
          options: [
            { label: 'CNSHA', value: 'CNSHA' },
            { label: 'CNNGB', value: 'CNNGB' },
            { label: 'CNQIN', value: 'CNQIN' },
            { label: 'CNYTN', value: 'CNYTN' }
          ],
          placeholder: '请选择起运港'
        },
        {
          key: 'dischargePort',
          label: '目的港',
          type: 'select',
          options: [
            { label: 'USLAX', value: 'USLAX' },
            { label: 'USNYC', value: 'USNYC' },
            { label: 'USLGB', value: 'USLGB' },
            { label: 'USOAK', value: 'USOAK' }
          ],
          placeholder: '请选择目的港'
        },
        {
          key: 'directTransit',
          label: '直达',
          type: 'select',
          options: [
            { label: '直达', value: '直达' },
            { label: '中转', value: '中转' }
          ],
          placeholder: '请选择直达/中转'
        },
        {
          key: 'transitPort',
          label: '中转港',
          type: 'select',
          options: [
            { label: 'SINGAPORE', value: 'SINGAPORE' },
            { label: 'HONG KONG', value: 'HONG KONG' },
            { label: 'KRPUS', value: 'KRPUS' }
          ],
          placeholder: '请选择中转港'
        },
        {
          key: 'transitType',
          label: '中转类型',
          type: 'select',
          options: [
            { label: '直达', value: '直达' },
            { label: '中转', value: '中转' }
          ],
          placeholder: '请选择中转类型'
        },
        {
          key: 'routeLine',
          label: '航线',
          type: 'select',
          options: [
            { label: '东南亚航线', value: '东南亚航线' },
            { label: '美加线', value: '美加线' },
            { label: '欧地线', value: '欧地线' },
            { label: '澳新线', value: '澳新线' },
            { label: '中东线', value: '中东线' },
            { label: '南美线', value: '南美线' },
            { label: '非洲线', value: '非洲线' }
          ],
          placeholder: '请选择航线'
        },
        {
          key: 'shipCompany',
          label: '船公司',
          type: 'select',
          options: [
            { label: 'SITC', value: 'SITC' },
            { label: 'COSCO', value: 'COSCO' },
            { label: 'MSK', value: 'MSK' },
            { label: 'ONE', value: 'ONE' },
            { label: 'MAERSK', value: 'MAERSK' },
            { label: 'EVERGREEN', value: 'EVERGREEN' }
          ],
          placeholder: '请选择船公司'
        },
        {
          key: 'contractNo',
          label: '约号',
          type: 'select',
          options: [
            { label: 'CONTRACT001', value: 'CONTRACT001' },
            { label: 'CONTRACT002', value: 'CONTRACT002' },
            { label: 'CONTRACT003', value: 'CONTRACT003' },
            { label: 'SPOT', value: 'SPOT' }
          ],
          placeholder: '请选择约号'
        },
        {
          key: 'spaceStatus',
          label: '舱位状态',
          type: 'select',
          options: [
            { label: '畅接', value: '畅接' },
            { label: '正常', value: '正常' },
            { label: '单票申请', value: '单票申请' },
            { label: '爆舱', value: '爆舱' },
            { label: '不接', value: '不接' }
          ],
          placeholder: '请选择舱位状态'
        },
        {
          key: 'priceStatus',
          label: '价格趋势',
          type: 'select',
          options: [
            { label: '价格上涨', value: '价格上涨' },
            { label: '价格下调', value: '价格下调' },
            { label: '价格稳定', value: '价格稳定' }
          ],
          placeholder: '请选择价格趋势'
        },
        {
          key: 'cargoType',
          label: '货物类型',
          type: 'select',
          options: [
            { label: '普货', value: '普货' },
            { label: '危险品', value: '危险品' },
            { label: '冷冻品', value: '冷冻品' },
            { label: '特种箱', value: '特种箱' },
            { label: '卷钢', value: '卷钢' },
            { label: '液体', value: '液体' },
            { label: '化工品', value: '化工品' },
            { label: '纺织品', value: '纺织品' }
          ],
          placeholder: '请选择货物类型'
        },
        {
          key: 'vesselSchedule',
          label: '船期',
          type: 'select',
          options: [
            { label: '周一', value: '周一' },
            { label: '周二', value: '周二' },
            { label: '周三', value: '周三' },
            { label: '周四', value: '周四' },
            { label: '周五', value: '周五' },
            { label: '周六', value: '周六' },
            { label: '周日', value: '周日' }
          ],
          placeholder: '请选择船期'
        },
        {
          key: 'voyage',
          label: '航程',
          type: 'text',
          placeholder: '请输入航程'
        },
        {
          key: 'freeStorageDays',
          label: '免柜租期',
          type: 'number',
          placeholder: '请输入免柜租期'
        },
        {
          key: 'nac',
          label: 'NAC',
          type: 'select',
          options: [
            { label: 'NAC01', value: 'NAC01' },
            { label: 'NAC02', value: 'NAC02' },
            { label: 'NAC03', value: 'NAC03' }
          ],
          placeholder: '请选择NAC'
        },
        {
          key: 'validPeriod',
          label: '有效期',
          type: 'dateRange',
          placeholder: '请选择有效期范围'
        },
        {
          key: 'etd',
          label: 'ETD',
          type: 'dateRange',
          placeholder: '请选择ETD范围'
        },
        {
          key: 'eta',
          label: 'ETA',
          type: 'dateRange',
          placeholder: '请选择ETA范围'
        },
        {
          key: 'vesselName',
          label: '船名',
          type: 'text',
          placeholder: '请输入船名'
        },
        {
          key: 'voyageNo',
          label: '航次',
          type: 'text',
          placeholder: '请输入航次'
        },
        {
          key: 'cutoffDate',
          label: '截关日',
          type: 'dateRange',
          placeholder: '请选择截关日范围'
        },
        {
          key: 'destinationRegion',
          label: '目的区域',
          type: 'text',
          placeholder: '请输入目的区域'
        },
        {
          key: 'entryPerson',
          label: '创建人',
          type: 'text',
          placeholder: '请输入创建人'
        },
        {
          key: 'createDate',
          label: '创建日期',
          type: 'dateRange',
          placeholder: '请选择创建日期范围'
        },
        {
          key: 'rateModifier',
          label: '运价修改人',
          type: 'text',
          placeholder: '请输入运价修改人'
        },
        {
          key: 'modifyDate',
          label: '修改日期',
          type: 'dateRange',
          placeholder: '请选择修改日期范围'
        },
        {
          key: 'approver',
          label: '审核人',
          type: 'text',
          placeholder: '请输入审核人'
        },
        {
          key: 'approvalDate',
          label: '审核日期',
          type: 'dateRange',
          placeholder: '请选择审核日期范围'
        }
      ];
    case 'precarriage':
      return [
        {
          key: 'code',
          label: '港前运价编号',
          type: 'text',
          placeholder: '请输入港前运价编号'
        },
        {
          key: 'rateType',
          label: '运价类型',
          type: 'select',
          options: [
            { label: '直拖', value: '直拖' },
            { label: '支线', value: '支线' }
          ],
          placeholder: '请选择运价类型'
        },
        {
          key: 'origin',
          label: '起运地',
          type: 'text',
          placeholder: '请输入起运地'
        },
        {
          key: 'destination',
          label: '起运港',
          type: 'select',
          options: [
            { label: 'CNSHA | SHANGHAI', value: 'CNSHA | SHANGHAI' },
            { label: 'CNNGB | NINGBO', value: 'CNNGB | NINGBO' }
          ],
          placeholder: '请选择起运港'
        },
        {
          key: 'terminal',
          label: '码头',
          type: 'select',
          options: [
            { label: '洋山', value: '洋山' },
            { label: '北仑', value: '北仑' }
          ],
          placeholder: '请选择码头'
        },
        {
          key: 'vendor',
          label: '供应商',
          type: 'text',
          placeholder: '请输入供应商'
        },
        {
          key: 'validDateRange',
          label: '有效期',
          type: 'dateRange',
          placeholder: '请选择有效期范围'
        },
        {
          key: 'status',
          label: '状态',
          type: 'select',
          options: [
            { label: '正常', value: '正常' },
            { label: '过期', value: '过期' },
            { label: '下架', value: '下架' }
          ],
          placeholder: '请选择状态'
        }
      ];
    case 'oncarriage':
      return [
        {
          key: 'code',
          label: '尾程运价编号',
          type: 'text',
          placeholder: '请输入尾程运价编号'
        },
        {
          key: 'origin',
          label: '目的港',
          type: 'text',
          placeholder: '请输入目的港'
        },
        {
          key: 'addressType',
          label: '配送地址类型',
          type: 'select',
          options: [
            { label: '第三方地址', value: '第三方地址' },
            { label: '亚马逊仓库', value: '亚马逊仓库' },
            { label: '易仓', value: '易仓' }
          ],
          placeholder: '请选择配送地址类型'
        },
        {
          key: 'zipCode',
          label: '邮编',
          type: 'text',
          placeholder: '请输入邮编'
        },
        {
          key: 'address',
          label: '地址',
          type: 'text',
          placeholder: '请输入地址'
        },
        {
          key: 'agentName',
          label: '代理名称',
          type: 'text',
          placeholder: '请输入代理名称'
        },
        {
          key: 'validDateRange',
          label: '有效期',
          type: 'dateRange',
          placeholder: '请选择有效期范围'
        },
        {
          key: 'status',
          label: '状态',
          type: 'select',
          options: [
            { label: '正常', value: '正常' },
            { label: '过期', value: '过期' },
            { label: '下架', value: '下架' }
          ],
          placeholder: '请选择状态'
        }
      ];
    default:
      return [];
  }
};

interface DataItem {
  key: string;
  routeCode: string; // 运价号
  departurePort: string; // 起运港
  dischargePort: string; // 目的港
  transitPort: string; // 中转港
  spaceStatus: string; // 舱位状态
  priceStatus: string; // 价格趋势
  containerType: string; // 箱种
  '20gp': number; // 20'
  '40gp': number; // 40'
  '40hc': number; // 40' HC
  '45hc': number; // 45'
  '40nor': number; // 40' NOR
  '20nor': number; // 20' NOR
  '20hc': number; // 20' HC
  '20tk': number; // 20' TK
  '40tk': number; // 40' TK
  '20ot': number; // 20' OT
  '40ot': number; // 40' OT
  '20fr': number; // 20' FR
  '40fr': number; // 40' FR
  shipCompany: string; // 船公司
  contractNo: string; // 约号
  vesselSchedule: string; // 船期
  voyage: string; // 航程
  cargoType: string; // 货物类型
  freeContainerDays: number; // 免用箱
  freeStorageDays: number; // 免堆存
  chargeSpecialNote: string; // 接货特殊说明
  nac: string; // NAC
  overweightNote: string; // 超重说明
  notes: string; // 备注
  validPeriod: string; // 有效期
  branch: string; // 分公司
  entryPerson: string; // 创建人
  createDate: string; // 创建日期
  rateModifier: string; // 运价修改人
  modifyDate: string; // 修改日期
  approver: string; // 审核人
  approvalDate: string; // 审核日期
  rateType: string; // 运价类型
  vesselName: string; // 船名
  voyageNo: string; // 航次
  etd: string; // ETD
  eta: string; // ETA
  
  // 根据截图补充的字段
  transitType: string; // 中转类型
  routeLine: string; // 航线
  transitDays: number; // 中转天数
  bookingDeadline: string; // 订舱截止时间
  documentDeadline: string; // 单证截止时间
  portOfLoading: string; // 装货港
  portOfDischarge: string; // 卸货港
  finalDestination: string; // 最终目的地
  placeOfReceipt: string; // 收货地
  placeOfDelivery: string; // 交货地
  shippingTerms: string; // 贸易条款
  freightTerms: string; // 运费条款
  carrierName: string; // 承运人
  forwarderName: string; // 货代名称
  quotationValidDays: number; // 报价有效天数
  bookingRemarks: string; // 订舱备注
  specialRequirements: string; // 特殊要求
  insuranceRequired: boolean; // 是否需要保险
  customsClearance: string; // 清关要求
  documentRequired: string; // 单证要求
  weighingRequired: boolean; // 是否需要称重
  inspectionRequired: boolean; // 是否需要查验
  consolidationService: boolean; // 是否提供拼箱服务
  doorToDoorService: boolean; // 是否提供门到门服务
  temperatureControl: string; // 温控要求
  hazardousGoods: boolean; // 是否危险品
  oversizeGoods: boolean; // 是否超尺寸货物
  overweightGoods: boolean; // 是否超重货物
  priority: string; // 优先级
  status: string; // 状态
  publishStatus: string; // 发布状态
  isActive: boolean; // 是否激活
  isPublic: boolean; // 是否公开
  tags: string[]; // 标签
  category: string; // 分类
  subcategory: string; // 子分类
  region: string; // 区域
  lane: string; // 航线
  tradeRoute: string; // 贸易路线
  transitTime: number; // 运输时间
  frequency: string; // 班期频率
  vessel: string; // 船舶
  operatorCode: string; // 操作代码
  bookingOffice: string; // 订舱处
  salesPerson: string; // 销售员
  customerService: string; // 客服
  lastUpdated: string; // 最后更新时间
  version: string; // 版本号
  source: string; // 数据来源
  reliability: string; // 可靠性
  confidence: number; // 置信度
  updateFrequency: string; // 更新频率
  dataQuality: string; // 数据质量
  verified: boolean; // 是否已验证
  archived: boolean; // 是否已归档
  deleted: boolean; // 是否已删除
  
  // 继续根据新截图添加的字段
  validToDate: string; // 有效期止（截图中的"有效期止"）
  companyBranch: string; // 分公司（截图中的"分公司"）
  dataEntryPerson: string; // 录入人（截图中的"录入人"）
  creationDate: string; // 创建日期（截图中的"创建日期"）
  rateModifyPerson: string; // 运价修改人（截图中的"运价修改人"）
  modificationDate: string; // 修改日期（截图中的"修改日期"）
  reviewPerson: string; // 审核人（截图中的"审核人"）
  reviewDate: string; // 审核日期（截图中的"审核日期"）
  targetRegion: string; // 目的区域（截图中的"目的区域"）
  freightRateType: string; // 运价类型（截图中的"运价类型"）
  shipName: string; // 船名（截图中的"船名"）
  voyageNumber: string; // 航次（截图中的"航次"）
  container20NOR: string; // 20' NOR（截图中的"20' NOR"）
  estimatedDeparture: string; // ETD（截图中的"ETD"）
  estimatedArrival: string; // ETA（截图中的"ETA"）
}



const FclRates: React.FC = () => {
  const [customTableModalVisible, setCustomTableModalVisible] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState({
    routeCode: true,
    rateType: true,
    departurePort: true,
    dischargePort: true,
    transitPort: true,
    transitType: true,
    routeLine: true,
    shipCompany: true,
    contractNo: false,
    spaceStatus: true,
    priceStatus: true,
    cargoType: false,
    '20gp': true,
    '40gp': true,
    '40hc': true,
    '20nor': false,
    '40nor': false,
    '45hc': true,
    '20hc': false,
    '20tk': false,
    '40tk': false,
    '20ot': false,
    '40ot': false,
    '20fr': false,
    '40fr': false,
    vesselSchedule: true,
    voyage: false,
    freeContainerDays: true,
    freeStorageDays: true,
    chargeSpecialNote: false,
    nac: false,
    overweightNote: false,
    notes: false,
    validPeriod: true,
    etd: false,
    eta: false,
    vesselName: false,
    voyageNo: false,
    entryPerson: false,
    createDate: false,
    rateModifier: false,
    modifyDate: false,
    approver: false,
    approvalDate: false
  });
  const [columnOrder, setColumnOrder] = useState([
    'routeCode', 'rateType', 'departurePort', 'dischargePort', 'transitPort',
    'transitType', 'routeLine', 'shipCompany', 'contractNo', 'spaceStatus', 'priceStatus', 'cargoType',
    '20gp', '40gp', '40hc', '20nor', '40nor', '45hc', '20hc', '20tk', '40tk', '20ot', '40ot', '20fr', '40fr',
    'vesselSchedule', 'voyage', 'freeContainerDays', 'freeStorageDays', 'chargeSpecialNote', 'nac',
    'overweightNote', 'notes', 'validPeriod', 'etd', 'eta', 'vesselName', 'voyageNo',
    'entryPerson', 'createDate', 'rateModifier', 'modifyDate', 
    'approver', 'approvalDate'
  ]);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragOverItem, setDragOverItem] = useState<string | null>(null);
  
  // 筛选字段拖拽相关状态
  const [draggedFilterField, setDraggedFilterField] = useState<string | null>(null);
  const [dragOverFilterField, setDragOverFilterField] = useState<string | null>(null);
  const [filterFieldOrder, setFilterFieldOrder] = useState<string[]>([]);
  
  // 添加缺失的状态变量
  const [activeTab, setActiveTab] = useState<string>('fcl');
  const [filterConditions, setFilterConditions] = useState<FilterCondition[]>([]);
  const [filterSchemes, setFilterSchemes] = useState<FilterScheme[]>([]);
  const [currentSchemeId, setCurrentSchemeId] = useState<string>('default');
  const [filterExpanded, setFilterExpanded] = useState(false);
  const [filterFieldModalVisible, setFilterFieldModalVisible] = useState(false);
  const [schemeModalVisible, setSchemeModalVisible] = useState(false);
  const [schemeName, setSchemeName] = useState('');
  
  const navigate = useNavigate();

  // 操作处理函数  
  const handleViewDetail = (key: string) => {
    navigate(`/controltower-client/view-fcl-rate/${key}`);
  };

  // 处理查看港前运价详情
  const handleViewPrecarriageRate = (key: string) => {
    navigate(`/controltower-client/view-precarriage-rate/${key}`);
  };

  // 处理查看尾程运价详情
  const handleViewOncarriageRate = (key: string) => {
    navigate(`/controltower-client/view-oncarriage-rate/${key}`);
  };





  // 打开组合方案查询页面
  const openCombinationQuery = () => {
    navigate('/controltower-client/combination-rate-query');
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
      rateType: true,
      departurePort: true,
      dischargePort: true,
      transitPort: true,
      transitType: true,
      routeLine: true,
      shipCompany: true,
      contractNo: false,
      spaceStatus: true,
      priceStatus: true,
      cargoType: false,
      '20gp': true,
      '40gp': true,
      '40hc': true,
      '20nor': false,
      '40nor': false,
      '45hc': true,
      '20hc': false,
      '20tk': false,
      '40tk': false,
      '20ot': false,
      '40ot': false,
      '20fr': false,
      '40fr': false,
      vesselSchedule: true,
      voyage: false,
      freeContainerDays: true,
      freeStorageDays: true,
      chargeSpecialNote: false,
      nac: false,
      overweightNote: false,
      notes: false,
      validPeriod: true,
      etd: false,
      eta: false,
      vesselName: false,
      voyageNo: false,
      entryPerson: false,
      createDate: false,
      rateModifier: false,
      modifyDate: false,
      approver: false,
      approvalDate: false
    });
  };

  // 应用表格列设置
  const applyColumnSettings = () => {
    // 这里可以添加保存设置的逻辑
    Message.success('表格设置已应用');
    closeCustomTableModal();
  };

  const columns = [
    {
      title: '运价号',
      dataIndex: 'routeCode',
      width: 180,
      render: (value: string) => <Tooltip content={value} mini><span className="no-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: '运价类型',
      dataIndex: 'rateType',
      width: 140,
      render: (value: string) => <Tooltip content={value} mini><span className="no-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: '起运港',
      dataIndex: 'departurePort',
      width: 180,
      render: (value: string) => {
        const [code, name] = value.split('|');
        return (
          <Tooltip content={value} mini>
            <div className="text-left">
              <div className="text-xs font-mono">{code}</div>
              <div className="text-xs text-gray-600">{name}</div>
            </div>
          </Tooltip>
        );
      },
      sorter: true,
      resizable: true,
    },
    {
      title: '目的港',
      dataIndex: 'dischargePort',
      width: 200,
      render: (value: string) => {
        const [code, name] = value.split('|');
        return (
          <Tooltip content={value} mini>
            <div className="text-left">
              <div className="text-xs font-mono">{code}</div>
              <div className="text-xs text-gray-600">{name}</div>
            </div>
          </Tooltip>
        );
      },
      sorter: true,
      resizable: true,
    },
    {
      title: '中转港',
      dataIndex: 'transitPort',
      width: 180,
      render: (value: string) => {
        const [code, name] = value.split('|');
        return (
          <Tooltip content={value} mini>
            <div className="text-left">
              <div className="text-xs font-mono">{code}</div>
              <div className="text-xs text-gray-600">{name}</div>
            </div>
          </Tooltip>
        );
      },
      sorter: true,
      resizable: true,
    },
    {
      title: '中转类型',
      dataIndex: 'transitType',
      width: 120,
      render: (value: string) => <Tooltip content={value} mini><span className="no-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: '航线',
      dataIndex: 'routeLine',
      width: 140,
      render: (value: string) => <Tooltip content={value} mini><span className="no-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: '船公司',
      dataIndex: 'shipCompany',
      width: 220,
      render: (value: string) => <Tooltip content={value} mini><span className="no-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: '约号',
      dataIndex: 'contractNo',
      width: 160,
      render: (value: string) => <Tooltip content={value} mini><span className="no-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: '舱位状态',
      dataIndex: 'spaceStatus',
      width: 120,
      render: (value: string) => {
        const colorMap: Record<string, string> = {
          '畅接': 'green',
          '正常': 'blue', 
          '单票申请': 'orange',
          '爆舱': 'red',
          '不接': 'gray'
        };
        return (
        <Tooltip content={value} mini>
            <Tag color={colorMap[value] || 'blue'} size="small">
            {value}
          </Tag>
        </Tooltip>
        );
      },
      sorter: true,
      resizable: true,
    },
    {
      title: '价格趋势',
      dataIndex: 'priceStatus',
      width: 120,
      render: (value: string) => (
        <Tooltip content={value} mini>
          <Tag color={value === '价格上涨' ? 'red' : value === '价格下调' ? 'green' : 'blue'} size="small">
            {value}
          </Tag>
        </Tooltip>
      ),
      sorter: true,
      resizable: true,
    },
    {
      title: '货物类型',
      dataIndex: 'cargoType',
      width: 120,
      render: (value: string) => <Tooltip content={value} mini><span className="no-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: "20GP",
      dataIndex: '20gp',
      width: 100,
      render: (value: number) => <Tooltip content={value.toString()} mini><span className="no-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: "40GP",
      dataIndex: '40gp',
      width: 100,
      render: (value: number) => <Tooltip content={value.toString()} mini><span className="no-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: "40HC",
      dataIndex: '40hc',
      width: 100,
      render: (value: number) => <Tooltip content={value.toString()} mini><span className="no-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: "20NOR",
      dataIndex: '20nor',
      width: 100,
      render: (value: number) => <Tooltip content={value.toString()} mini><span className="no-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: "40NOR",
      dataIndex: '40nor',
      width: 100,
      render: (value: number) => <Tooltip content={value.toString()} mini><span className="no-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: "45HC",
      dataIndex: '45hc',
      width: 100,
      render: (value: number) => <Tooltip content={value.toString()} mini><span className="no-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: "20HC",
      dataIndex: '20hc',
      width: 100,
      render: (value: number) => <Tooltip content={value.toString()} mini><span className="no-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: "20TK",
      dataIndex: '20tk',
      width: 100,
      render: (value: number) => <Tooltip content={value.toString()} mini><span className="no-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: "40TK",
      dataIndex: '40tk',
      width: 100,
      render: (value: number) => <Tooltip content={value.toString()} mini><span className="no-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: "20OT",
      dataIndex: '20ot',
      width: 100,
      render: (value: number) => <Tooltip content={value.toString()} mini><span className="no-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: "40OT",
      dataIndex: '40ot',
      width: 100,
      render: (value: number) => <Tooltip content={value.toString()} mini><span className="no-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: "20FR",
      dataIndex: '20fr',
      width: 100,
      render: (value: number) => <Tooltip content={value.toString()} mini><span className="no-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: "40FR",
      dataIndex: '40fr',
      width: 100,
      render: (value: number) => <Tooltip content={value.toString()} mini><span className="no-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: '船期',
      dataIndex: 'vesselSchedule',
      width: 120,
      render: (value: string) => <Tooltip content={value} mini><span className="no-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: '航程',
      dataIndex: 'voyage',
      width: 100,
      render: (value: string) => <Tooltip content={value} mini><span className="no-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: '免用箱',
      dataIndex: 'freeContainerDays',
      width: 120,
      render: (value: number) => <Tooltip content={`${value}天`} mini><span className="no-ellipsis">{value}天</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: '免堆存',
      dataIndex: 'freeStorageDays',
      width: 120,
      render: (value: number) => <Tooltip content={`${value}天`} mini><span className="no-ellipsis">{value}天</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: '接货特殊说明',
      dataIndex: 'chargeSpecialNote',
      width: 200,
      render: (value: string) => <Tooltip content={value} mini><span className="no-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: 'NAC',
      dataIndex: 'nac',
      width: 120,
      render: (value: string) => <Tooltip content={value} mini><span className="no-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: '超重说明',
      dataIndex: 'overweightNote',
      width: 140,
      render: (value: string) => <Tooltip content={value} mini><span className="no-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: '备注',
      dataIndex: 'notes',
      width: 180,
      render: (value: string) => <Tooltip content={value} mini><span className="no-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: '有效期',
      dataIndex: 'validPeriod',
      width: 240,
      render: (value: string) => <Tooltip content={value} mini><span className="no-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: 'ETD',
      dataIndex: 'etd',
      width: 120,
      render: (value: string) => <Tooltip content={value} mini><span className="no-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: 'ETA',
      dataIndex: 'eta',
      width: 120,
      render: (value: string) => <Tooltip content={value} mini><span className="no-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: '船名',
      dataIndex: 'vesselName',
      width: 200,
      render: (value: string) => <Tooltip content={value} mini><span className="no-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: '航次',
      dataIndex: 'voyageNo',
      width: 120,
      render: (value: string) => <Tooltip content={value} mini><span className="no-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: '创建人',
      dataIndex: 'entryPerson',
      width: 120,
      render: (value: string) => <Tooltip content={value} mini><span className="no-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: '创建日期',
      dataIndex: 'createDate',
      width: 120,
      render: (value: string) => <Tooltip content={value} mini><span className="no-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: '运价修改人',
      dataIndex: 'rateModifier',
      width: 160,
      render: (value: string) => <Tooltip content={value} mini><span className="no-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: '修改日期',
      dataIndex: 'modifyDate',
      width: 120,
      render: (value: string) => <Tooltip content={value} mini><span className="no-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: '审核人',
      dataIndex: 'approver',
      width: 120,
      render: (value: string) => <Tooltip content={value} mini><span className="no-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: '审核日期',
      dataIndex: 'approvalDate',
      width: 120,
      render: (value: string) => <Tooltip content={value} mini><span className="no-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: '操作',
      dataIndex: 'actions',
      width: 100,
      fixed: 'right' as const,
      render: (_: unknown, record: DataItem) => (
        <Button type="text" size="small" onClick={() => handleViewDetail(record.key)}>
          查看
        </Button>
      ),
    }
  ];

  const data: DataItem[] = Array(12).fill(null).map((_, index) => {
    const random20gp = [-30, 510, 560, 865, 1130, 530].sort(() => Math.random() - 0.5)[0];
    const random40gp = random20gp === -30 ? -60 : random20gp === 510 ? 1020 : random20gp === 560 ? 1120 : random20gp === 865 ? 1730 : random20gp === 1130 ? 2260 : 1060;

    const vesselNames = ['MEDKON QUO', 'SITC PENANG', 'SITC YOKOHAMA', 'SITC XINCHENG'];
    const departurePorts = [
      { code: 'CNSHA', fullName: 'SHANGHAI', name: '上海' },
      { code: 'CNNGB', fullName: 'NINGBO', name: '宁波' },
      { code: 'CNQIN', fullName: 'QINGDAO', name: '青岛' },
      { code: 'CNYTN', fullName: 'YANTAI', name: '烟台' }
    ];
    const dischargePorts = [
      { code: 'USLAX', fullName: 'LOS ANGELES', name: '洛杉矶' },
      { code: 'USNYC', fullName: 'NEW YORK', name: '纽约' },
      { code: 'USLGB', fullName: 'LONG BEACH', name: '长滩' },
      { code: 'USOAK', fullName: 'OAKLAND', name: '奥克兰' },
      { code: 'PHMNL', fullName: 'MANILA', name: '马尼拉' },
      { code: 'SGSIN', fullName: 'SINGAPORE', name: '新加坡' }
    ];
    const transitPorts = [
      { code: 'SGSIN', fullName: 'SINGAPORE', name: '新加坡' },
      { code: 'HKHKG', fullName: 'HONG KONG', name: '香港' },
      { code: 'KRPUS', fullName: 'PUSAN', name: '釜山' }
    ];
    
    const selectedDeparturePort = departurePorts[Math.floor(Math.random() * departurePorts.length)];
    const selectedDischargePort = dischargePorts[Math.floor(Math.random() * dischargePorts.length)];
    const selectedTransitPort = transitPorts[Math.floor(Math.random() * transitPorts.length)];
    
    return {
      key: `${index}`,
      routeCode: `FCL${2024}${String(index + 1).padStart(4, '0')}`,
      departurePort: `${selectedDeparturePort.fullName} (${selectedDeparturePort.code})|${selectedDeparturePort.name}`,
      dischargePort: `${selectedDischargePort.fullName} (${selectedDischargePort.code})|${selectedDischargePort.name}`,
      transitPort: `${selectedTransitPort.fullName} (${selectedTransitPort.code})|${selectedTransitPort.name}`,
      spaceStatus: ['畅接', '正常', '单票申请', '爆舱', '不接'][Math.floor(Math.random() * 5)],
      priceStatus: ['价格稳定', '价格上涨', '价格下调'][Math.floor(Math.random() * 3)],
      containerType: ['普通箱', '冷冻箱', '开顶箱'][Math.floor(Math.random() * 3)],
      '20gp': random20gp,
      '40gp': random40gp,
      '40hc': random40gp + 50,
      '40nor': random40gp - 20,
      '20nor': random20gp - 10,
      '20hc': random20gp + 20,
      '20tk': random20gp + 30,
      '40tk': random40gp + 40,
      '20ot': random20gp + 50,
      '40ot': random40gp + 60,
      '20fr': random20gp + 70,
      '40fr': random40gp + 80,
      '45hc': random40gp + 100,
      shipCompany: ['MSK-马士基', 'SITC-海丰国际', 'COSCO-中远海运', 'ONE-海洋网联', 'EMC-长荣海运'][Math.floor(Math.random() * 5)],
      contractNo: Math.random() > 0.3 ? ['CONTRACT001', 'CONTRACT002', 'CONTRACT003', 'SPOT'][Math.floor(Math.random() * 4)] : '',
      vesselSchedule: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'][Math.floor(Math.random() * 7)],
      voyage: `${4 + Math.floor(Math.random() * 6)}天`,
      cargoType: ['普货', '危险品', '冷冻品', '特种箱', '卷钢', '液体', '化工品', '纺织品'][Math.floor(Math.random() * 8)],
      freeContainerDays: 5 + Math.floor(Math.random() * 8),
      freeStorageDays: 7 + Math.floor(Math.random() * 8),
      chargeSpecialNote: '需提前预约',
      nac: Math.random() > 0.4 ? ['NAC01', 'NAC02', 'NAC03'][Math.floor(Math.random() * 3)] : '',
      overweightNote: '超重另计',
      notes: 'LSE已含',
      validPeriod: '2024-05-01 至 2024-12-31',
      branch: '上海分公司',
      entryPerson: '张三',
      createDate: '2024-05-15',
      rateModifier: '李四',
      modifyDate: '2024-05-16',
      approver: '王五',
      approvalDate: '2024-05-17',
      rateType: ['合约价', 'SPOT电商'][Math.floor(Math.random() * 2)],
      vesselName: Math.random() > 0.3 ? vesselNames[Math.floor(Math.random() * vesselNames.length)] : '',
      voyageNo: Math.random() > 0.3 ? `25${10 + Math.floor(Math.random() * 9)}S` : '',
      etd: Math.random() > 0.3 ? `05-${15 + Math.floor(Math.random() * 4)}` : '',
      eta: Math.random() > 0.3 ? `06-${1 + Math.floor(Math.random() * 10)}` : '',
      
      // 根据截图补充的字段
      transitType: Math.random() > 0.5 ? '中转' : '直达',
      routeLine: ['东南亚航线', '美加线', '欧地线', '澳新线', '中东线', '南美线', '非洲线'][Math.floor(Math.random() * 7)],
      transitDays: Math.floor(Math.random() * 10) + 1,
      bookingDeadline: `2024-05-${15 + Math.floor(Math.random() * 10)}`,
      documentDeadline: `2024-05-${15 + Math.floor(Math.random() * 10)}`,
      portOfLoading: Math.random() > 0.5 ? '上海' : '宁波',
      portOfDischarge: Math.random() > 0.5 ? '洛杉矶' : '纽约',
      finalDestination: Math.random() > 0.5 ? '美国' : '欧洲',
      placeOfReceipt: Math.random() > 0.5 ? '上海' : '宁波',
      placeOfDelivery: Math.random() > 0.5 ? '上海' : '宁波',
      shippingTerms: ['FOB', 'CIF', 'CFR'][Math.floor(Math.random() * 3)],
      freightTerms: ['LCL', 'FCL', '拼箱'][Math.floor(Math.random() * 3)],
      carrierName: ['COSCO', 'MSC', 'HMM'][Math.floor(Math.random() * 3)],
      forwarderName: ['德邦物流', '顺丰物流', '中远海运'][Math.floor(Math.random() * 3)],
      quotationValidDays: Math.floor(Math.random() * 30) + 1,
      bookingRemarks: '无特殊要求',
      specialRequirements: '无特殊要求',
      insuranceRequired: Math.random() > 0.5,
      customsClearance: '无特殊要求',
      documentRequired: '无特殊要求',
      weighingRequired: Math.random() > 0.5,
      inspectionRequired: Math.random() > 0.5,
      consolidationService: Math.random() > 0.5,
      doorToDoorService: Math.random() > 0.5,
      temperatureControl: ['恒温', '常温', '冷藏'][Math.floor(Math.random() * 3)],
      hazardousGoods: Math.random() > 0.5,
      oversizeGoods: Math.random() > 0.5,
      overweightGoods: Math.random() > 0.5,
      priority: ['高', '中', '低'][Math.floor(Math.random() * 3)],
      status: ['正常', '过期', '下架'][Math.floor(Math.random() * 3)],
      publishStatus: ['已发布', '未发布', '已下架'][Math.floor(Math.random() * 3)],
      isActive: Math.random() > 0.5,
      isPublic: Math.random() > 0.5,
      tags: [['标签1'], ['标签2'], ['标签3']][Math.floor(Math.random() * 3)],
      category: ['分类1', '分类2', '分类3'][Math.floor(Math.random() * 3)],
      subcategory: ['子分类1', '子分类2', '子分类3'][Math.floor(Math.random() * 3)],
      region: ['区域1', '区域2', '区域3'][Math.floor(Math.random() * 3)],
      lane: ['航线1', '航线2', '航线3'][Math.floor(Math.random() * 3)],
      tradeRoute: ['贸易路线1', '贸易路线2', '贸易路线3'][Math.floor(Math.random() * 3)],
      transitTime: Math.floor(Math.random() * 10) + 1,
      frequency: ['每周一', '每周二', '每周三'][Math.floor(Math.random() * 3)],
      vessel: ['船舶1', '船舶2', '船舶3'][Math.floor(Math.random() * 3)],
      operatorCode: ['操作代码1', '操作代码2', '操作代码3'][Math.floor(Math.random() * 3)],
      bookingOffice: ['订舱处1', '订舱处2', '订舱处3'][Math.floor(Math.random() * 3)],
      salesPerson: ['销售员1', '销售员2', '销售员3'][Math.floor(Math.random() * 3)],
      customerService: ['客服1', '客服2', '客服3'][Math.floor(Math.random() * 3)],
      lastUpdated: '2024-05-15',
      version: '1.0',
      source: '数据来源1',
      reliability: '可靠性1',
      confidence: Math.random() * 100,
      updateFrequency: ['每日更新', '每周更新', '每月更新'][Math.floor(Math.random() * 3)],
      dataQuality: ['高质量', '中等质量', '低质量'][Math.floor(Math.random() * 3)],
      verified: Math.random() > 0.5,
      archived: Math.random() > 0.5,
      deleted: Math.random() > 0.5,
      
      // 继续根据新截图添加的字段
      validToDate: '2024-12-31',
      companyBranch: '上海分公司',
      dataEntryPerson: '张三',
      creationDate: '2024-05-15',
      rateModifyPerson: '李四',
      modificationDate: '2024-05-16',
      reviewPerson: '王五',
      reviewDate: '2024-05-17',
      targetRegion: '东南亚',
      freightRateType: '整箱运价',
      shipName: 'COSCO SHIPPING UNIVERSE',
      voyageNumber: '25S',
      container20NOR: '20NOR',
      estimatedDeparture: '05-15',
      estimatedArrival: '06-01',
    };
  });



  // 分页配置
  const pagination = {
    sizeCanChange: true,
    showTotal: true,
    pageSize: 20,
    current: 1,
    pageSizeChangeResetCurrent: true,
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
      routeCode: '运价号',
      rateType: '运价类型',
      departurePort: '起运港',
      dischargePort: '目的港',
      transitPort: '中转港',
      transitType: '中转类型',
      routeLine: '航线',
      shipCompany: '船公司',
      contractNo: '约号',
      spaceStatus: '舱位状态',
      priceStatus: '价格趋势',
      cargoType: '货物类型',
      '20gp': "20GP",
      '40gp': "40GP",
      '40hc': "40HC",
      '20nor': "20NOR",
      '40nor': "40NOR",
      '45hc': "45HC",
      '20hc': "20HC",
      '20tk': "20TK",
      '40tk': "40TK",
      '20ot': "20OT",
      '40ot': "40OT",
      '20fr': "20FR",
      '40fr': "40FR",
      vesselSchedule: '船期',
      voyage: '航程',
      freeContainerDays: '免用箱',
      freeStorageDays: '免堆存',
      chargeSpecialNote: '接货特殊说明',
      nac: 'NAC',
      overweightNote: '超重说明',
      notes: '备注',
      validPeriod: '有效期',
      etd: 'ETD',
      eta: 'ETA',
      vesselName: '船名',
      voyageNo: '航次',
      cutoffDate: '截关日',
      destinationRegion: '目的区域',
      entryPerson: '创建人',
      createDate: '创建日期',
      rateModifier: '运价修改人',
      modifyDate: '修改日期',
      approver: '审核人',
      approvalDate: '审核日期'
    };
    return columnLabels[columnKey] || columnKey;
  };

  // ====== 港前运价 columns & data ======
  const precarriageColumns = [
    { title: '港前运价编号', dataIndex: 'code', width: 120 },
    { title: '运价类型', dataIndex: 'rateType', width: 100 },
    { title: '支线类型', dataIndex: 'sublineType', width: 120, render: (v: string|null) => v || '-' },
    { title: '起运地', dataIndex: 'origin', width: 180 },
    { title: '起运港', dataIndex: 'destination', width: 150 },
    { title: '码头', dataIndex: 'terminal', width: 120 },
    { title: '供应商', dataIndex: 'vendor', width: 150 },
    { title: '20GP', dataIndex: '20gp', width: 100 },
    { title: '40GP', dataIndex: '40gp', width: 100 },
    { title: '40HC', dataIndex: '40hc', width: 100 },
    { title: '40NOR', dataIndex: '40nor', width: 100 },
    { title: '45HC', dataIndex: '45hc', width: 100 },
    { title: '有效期', dataIndex: 'validDateRange', width: 180 },
    { title: '状态', dataIndex: 'status', width: 100 },
    { title: '备注', dataIndex: 'remark', width: 150 },
    {
      title: '操作',
      dataIndex: 'operations',
      fixed: 'right' as const,
      width: 80,
      render: (_: any, record: any) => (
        <Button type="text" size="mini" icon={<IconEye />} onClick={() => handleViewPrecarriageRate(record.key)}>
          查看
        </Button>
      ),
    },
  ];
  const precarriageData = [
    { key: '1', code: 'PCR2024050001', rateType: '直拖', sublineType: null, origin: '浙江省杭州市萧山区', destination: 'CNSHA | SHANGHAI', terminal: '洋山', vendor: '安吉物流', '20gp': 800, '40gp': 1200, '40hc': 1300, '40nor': 1250, '45hc': 1500, validDateRange: '2024-05-01 至 2024-12-31', status: '正常', remark: '' },
    { key: '2', code: 'PCR2024050002', rateType: '支线', sublineType: '湖州海铁', origin: '浙江省湖州市吴兴区', destination: 'CNNGB | NINGBO', terminal: '北仑', vendor: '中远海运', '20gp': 400, '40gp': 700, '40hc': 750, '40nor': 720, '45hc': 850, validDateRange: '2024-05-15 至 2024-11-30', status: '正常', remark: '' },
    { key: '3', code: 'PCR2024050003', rateType: '直拖', sublineType: null, origin: '江苏省苏州市工业园区', destination: 'CNSHA | SHANGHAI', terminal: '外高桥', vendor: '德邦物流', '20gp': 850, '40gp': 1250, '40hc': 1350, '40nor': 1300, '45hc': 1550, validDateRange: '2024-04-01 至 2024-12-15', status: '正常', remark: '需提前24小时预约' },
    { key: '4', code: 'PCR2024040001', rateType: '直拖', sublineType: null, origin: '上海市嘉定区', destination: 'CNSHA | SHANGHAI', terminal: '洋山', vendor: '顺丰物流', '20gp': 750, '40gp': 1150, '40hc': 1250, '40nor': 1200, '45hc': 1450, validDateRange: '2024-03-01 至 2024-05-31', status: '过期', remark: '' },
    { key: '5', code: 'PCR2024050004', rateType: '支线', sublineType: '乍浦支线', origin: '浙江省嘉兴市平湖市', destination: 'CNSHA | SHANGHAI', terminal: '洋山', vendor: '海得航运', '20gp': 450, '40gp': 750, '40hc': 800, '40nor': 780, '45hc': 920, validDateRange: '2024-05-01 至 2024-10-31', status: '正常', remark: '周一、周四发船' },
    { key: '6', code: 'PCR2024030001', rateType: '支线', sublineType: '海宁支线', origin: '浙江省嘉兴市海宁市', destination: 'CNNGB | NINGBO', terminal: '北仑', vendor: '浙江海洋航运', '20gp': 500, '40gp': 800, '40hc': 850, '40nor': 830, '45hc': 950, validDateRange: '2024-03-15 至 2024-04-30', status: '下架', remark: '已停运' },
  ];
  // ====== 尾程运价 columns & data ======
  const oncarriageColumns = [
    { title: '尾程运价编号', dataIndex: 'code', width: 120 },
    { title: '目的港', dataIndex: 'origin', width: 150 },
    { title: '配送地址类型', dataIndex: 'addressType', width: 120 },
    { title: '邮编', dataIndex: 'zipCode', width: 100 },
    { title: '地址', dataIndex: 'address', width: 180 },
    { title: '仓库代码', dataIndex: 'warehouseCode', width: 120, render: (v: string|null) => v || '-' },
    { title: '代理名称', dataIndex: 'agentName', width: 150 },
    { title: '20GP', dataIndex: '20gp', width: 100 },
    { title: '40GP', dataIndex: '40gp', width: 100 },
    { title: '40HC', dataIndex: '40hc', width: 100 },
    { title: '40NOR', dataIndex: '40nor', width: 100 },
    { title: '45HC', dataIndex: '45hc', width: 100 },
    { title: '有效期', dataIndex: 'validDateRange', width: 180 },
    { title: '状态', dataIndex: 'status', width: 100 },
    { title: '备注', dataIndex: 'remark', width: 150 },
    {
      title: '操作',
      dataIndex: 'operations',
      fixed: 'right' as const,
      width: 80,
      render: (_: any, record: any) => (
        <Button type="text" size="mini" icon={<IconEye />} onClick={() => handleViewOncarriageRate(record.key)}>
          查看
        </Button>
      ),
    },
  ];
  const oncarriageData = [
    { key: '1', code: 'LMR2024050001', origin: 'USLAX | LOS ANGELES', addressType: '第三方地址', zipCode: '92101', address: 'San Diego, CA', warehouseCode: null, agentName: 'XPO TRUCK LLC', validDateRange: '2024-05-01 至 2024-12-31', remark: '', status: '正常', '20gp': 1200, '40gp': 1800, '40hc': 1900, '45hc': 2200, '40nor': 2000 },
    { key: '2', code: 'LMR2024050002', origin: 'USNYC | NEW YORK', addressType: '亚马逊仓库', zipCode: '', address: '', warehouseCode: 'ONT8', agentName: 'DRAYEASY INC', validDateRange: '2024-05-15 至 2024-11-30', remark: '', status: '正常', '20gp': 980, '40gp': 1650, '40hc': 1750, '45hc': 2050, '40nor': 1800 },
    { key: '3', code: 'LMR2024050003', origin: 'DEHAM | HAMBURG', addressType: '易仓', zipCode: '', address: '', warehouseCode: 'LAX203', agentName: 'AMERICAN FREIGHT SOLUTIONS', validDateRange: '2024-04-01 至 2024-12-15', remark: '需提前24小时预约', status: '正常', '20gp': 1300, '40gp': 1950, '40hc': 2050, '45hc': 2400, '40nor': 2100 },
    { key: '4', code: 'LMR2024040001', origin: 'NLRTM | ROTTERDAM', addressType: '第三方地址', zipCode: '96001', address: 'Redding, CA', warehouseCode: null, agentName: 'WEST COAST CARRIERS LLC', validDateRange: '2024-03-01 至 2024-05-31', remark: '', status: '过期', '20gp': 1100, '40gp': 1700, '40hc': 1800, '45hc': 2150, '40nor': 1950 },
  ];



  // 修改内容区渲染逻辑
  const renderContent = () => {
    if (activeTab === 'precarriage') {
      return (
        <Table
          rowKey="key"
          columns={precarriageColumns}
          data={precarriageData}
          pagination={pagination}
          scroll={{ x: 1800 }}
          border={false}
          className="mt-4 inquiry-table-nowrap"
        />
      );
    }
    if (activeTab === 'oncarriage') {
      return (
        <Table
          rowKey="key"
          columns={oncarriageColumns}
          data={oncarriageData}
          pagination={pagination}
          scroll={{ x: 1800 }}
          border={false}
          className="mt-4 inquiry-table-nowrap"
        />
      );
    }
    // 其它Tab保持原有内容
    return (
      <Table
        rowKey="key"
        loading={false}
        columns={columns}
        data={data}
        pagination={pagination}
        scroll={{ x: 3200, y: 'calc(100vh - 400px)' }}
        border={false}
        className="mt-4 inquiry-table-nowrap"
        style={{
          '--table-row-height': '60px'
        } as React.CSSProperties & { [key: string]: string }}
        rowClassName={() => 'table-row-double-height'}
      />
    );
  };

  // 初始化默认筛选条件
  const initializeDefaultConditions = (activeTab: string): FilterCondition[] => {
    const fields = getFilterFieldsByTab(activeTab);
    return fields.map(field => ({
      key: field.key,
      mode: FilterMode.EQUAL,
      value: undefined,
      visible: true
    }));
  };

  // 初始化默认方案
  const initializeDefaultScheme = (activeTab: string): FilterScheme => {
    return {
      id: 'default',
      name: '默认方案',
      conditions: initializeDefaultConditions(activeTab),
      isDefault: true
    };
  };

  // 组件初始化 - 监听activeTab变化
  useEffect(() => {
    const defaultScheme = initializeDefaultScheme(activeTab);
    setFilterSchemes([defaultScheme]);
    setFilterConditions(defaultScheme.conditions);
    setCurrentSchemeId('default');
    
    // 初始化筛选字段顺序
    const fields = getFilterFieldsByTab(activeTab);
    setFilterFieldOrder(fields.map(field => field.key));
  }, [activeTab]);

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
  const closeFilterFieldModal = () => {
    setFilterFieldModalVisible(false);
  };

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
    
    setFilterSchemes(prev => [...prev, newScheme]);
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

  // 渲染单个筛选条件
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

  // 执行查询
  const handleSearch = () => {
    // 根据筛选条件过滤数据
    console.log('执行查询，当前筛选条件：', filterConditions);
    // 这里可以添加实际的查询逻辑，比如调用API或过滤本地数据
    Message.success('查询完成');
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
                onClick={handleSearch}
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
          {conditionsToShow.map(condition => renderFilterCondition(condition))}
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
    <div>
      <Card>
        <Tabs activeTab={activeTab} onChange={setActiveTab} className="mb-4">
          <Tabs.TabPane key="fcl" title="整箱运价" />
          <Tabs.TabPane key="lcl" title="拼箱运价" />
          <Tabs.TabPane key="air" title="空运运价" />
          <Tabs.TabPane key="precarriage" title="港前运价" />
          <Tabs.TabPane key="oncarriage" title="尾程运价" />
        </Tabs>
        
        {/* 使用新的筛选区域 */}
        {renderNewFilterArea()}
        
        <Card>
          <div className="flex justify-between mb-4">
            <Space>
              {(activeTab === 'fcl' || activeTab === 'lcl' || activeTab === 'air') && (
                <Button 
                  type="primary" 
                  icon={<IconSearch />} 
                  onClick={openCombinationQuery}
                >
                  组合方案查询
                </Button>
              )}
              {(activeTab === 'precarriage' || activeTab === 'oncarriage') && (
                <Button 
                  type="primary" 
                  icon={<IconSearch />} 
                  onClick={openCombinationQuery}
                >
                  组合方案查询
                </Button>
              )}
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
          {renderContent()}
          <div className="mt-2 text-gray-500 text-sm">共 9232 条</div>
        </Card>
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
              const fields = getFilterFieldsByTab(activeTab);
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
              已选择 {filterConditions.filter(c => c.visible).length}/{getFilterFieldsByTab(activeTab).length} 个字段
            </div>
            <Space>
              <Button size="small" onClick={() => {
                getFilterFieldsByTab(activeTab).forEach(field => {
                  updateFilterConditionVisibility(field.key, true);
                });
              }}>全选</Button>
              <Button size="small" onClick={() => {
                getFilterFieldsByTab(activeTab).forEach(field => {
                  updateFilterConditionVisibility(field.key, false);
                });
              }}>清空</Button>
            </Space>
          </div>
          
          {/* 可拖拽的字段列表 */}
          <div className="flex-1 overflow-y-auto px-4">
            {filterFieldOrder.map((fieldKey, index) => {
              const field = getFilterFieldsByTab(activeTab).find(f => f.key === fieldKey);
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
          <Button key="save" type="primary" onClick={saveFilterScheme} disabled={!schemeName.trim()}>保存</Button>,
        ]}
        style={{ width: 400 }}
      >
        <div className="p-4">
          <div className="mb-4 text-gray-600">请输入方案名称：</div>
          <Input
            value={schemeName}
            onChange={setSchemeName}
            placeholder="请输入方案名称"
            maxLength={50}
            showWordLimit
          />
          <div className="mt-4 text-xs text-gray-500">
            保存后可在"选择方案"下拉中找到此方案
          </div>
        </div>
      </Modal>


    </div>
  );
};

export default FclRates; 