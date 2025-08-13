import React, { useState, useMemo, useEffect } from 'react';
import { 
  Card, 
  Breadcrumb, 
  // Typography, 
  Button, 
  Space, 
  Input, 
  Select, 
  Form, 
  Grid, 
  Checkbox,
  Radio, 
  // Tooltip, 删除未使用的导入
  Message,
  Modal,
  DatePicker,
  Table,
  Tag
} from '@arco-design/web-react';

const { TextArea } = Input;
import { IconSave, IconDelete, IconUpload, /* IconEye, */ IconPlus, IconMinus, IconRobot, IconDownload, IconCopy, IconPrinter } from '@arco-design/web-react/icon';
import { useNavigate } from 'react-router-dom';
import ControlTowerSaasLayout from "./ControlTowerSaasLayout";
import './CreateFclInquiry.css';


const { Row, Col } = Grid;
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;


// 省份数据
const provinceOptions = [
  { value: '浙江省', label: '浙江省' },
  { value: '江苏省', label: '江苏省' },
  { value: '上海市', label: '上海市' },
  { value: '广东省', label: '广东省' },
  { value: '内蒙古自治区', label: '内蒙古自治区' },
  { value: '黑龙江省', label: '黑龙江省' },
  { value: '新疆维吾尔自治区', label: '新疆维吾尔自治区' },
];

// 选项类型定义
interface OptionItem {
  value: string;
  label: string;
}

// 城市数据 (按省份分组)
const cityOptions: Record<string, OptionItem[]> = {
  '浙江省': [
    { value: '杭州市', label: '杭州市' },
    { value: '嘉兴市', label: '嘉兴市' },
    { value: '湖州市', label: '湖州市' },
    { value: '宁波市', label: '宁波市' },
    { value: '绍兴市', label: '绍兴市' },
  ],
  '江苏省': [
    { value: '苏州市', label: '苏州市' },
    { value: '南京市', label: '南京市' },
    { value: '无锡市', label: '无锡市' },
  ],
  '上海市': [
    { value: '上海市', label: '上海市' },
  ],
  '广东省': [
    { value: '广州市', label: '广州市' },
    { value: '佛山市', label: '佛山市' },
    { value: '深圳市', label: '深圳市' },
  ],
};

// 区县数据 (按城市分组)
const districtOptions: Record<string, OptionItem[]> = {
  '杭州市': [
    { value: '萧山区', label: '萧山区' },
    { value: '西湖区', label: '西湖区' },
    { value: '余杭区', label: '余杭区' },
  ],
  '嘉兴市': [
    { value: '海宁市', label: '海宁市' },
    { value: '平湖市', label: '平湖市' },
  ],
  '苏州市': [
    { value: '工业园区', label: '工业园区' },
    { value: '姑苏区', label: '姑苏区' },
  ],
  '上海市': [
    { value: '浦东新区', label: '浦东新区' },
    { value: '黄浦区', label: '黄浦区' },
  ],
};

// 街道/村镇数据 (按区县分组)
const streetOptions: Record<string, OptionItem[]> = {
  '萧山区': [
    { value: '新塘街道', label: '新塘街道' },
    { value: '北干街道', label: '北干街道' },
  ],
  '西湖区': [
    { value: '灵隐街道', label: '灵隐街道' },
    { value: '西溪街道', label: '西溪街道' },
  ],
  '工业园区': [
    { value: '娄葑街道', label: '娄葑街道' },
    { value: '斜塘街道', label: '斜塘街道' },
  ],
  '浦东新区': [
    { value: '陆家嘴街道', label: '陆家嘴街道' },
    { value: '张江镇', label: '张江镇' },
  ],
};

// 区域项接口定义
interface AreaItem {
  key: number;
  province: string;
  city: string;
  district: string;
  street: string;
}

// 模拟邮编和地址映射数据
const zipCodeAddressMap: Record<string, string> = {
  '90001': 'Los Angeles, CA',
  '90210': 'Beverly Hills, CA',
  '10001': 'New York, NY',
  '33101': 'Miami, FL',
  '60601': 'Chicago, IL',
  '98101': 'Seattle, WA',
  '94101': 'San Francisco, CA',
  '02101': 'Boston, MA',
  '77001': 'Houston, TX',
  '19101': 'Philadelphia, PA',
  '20001': 'Washington, DC',
  '30301': 'Atlanta, GA',
  '48201': 'Detroit, MI',
  '80201': 'Denver, CO',
  '85001': 'Phoenix, AZ',
  '92101': 'San Diego, CA',
  '75201': 'Dallas, TX',
  '89101': 'Las Vegas, NV',
  '97201': 'Portland, OR',
  '37201': 'Nashville, TN'
};

// 运价条目接口
interface RateItem {
  id: number;
  feeType: string; // 费用类型
  feeName: string; // 费用名称
  currency: string; // 币种
  unit: string; // 计费单位
  remark: string; // 备注
  // 箱型计费
  containerRates?: {
    '20GP'?: string;
    '40GP'?: string;
    '40HC'?: string;
    '45HC'?: string;
    '20NOR'?: string;
    '40NOR'?: string;
    [key: string]: string | undefined;
  };
  // 非箱型计费
  unitPrice?: string; // 单价
}

// 干线运价接口
interface MainlineRateDetail {
  id: number;
  certNo?: string; // 运价编号（新增时为空）
  shipCompany: string; // 船公司
  validPeriod: string[]; // 有效期区间
  transitType: string; // 直达/中转
  transitTime: string; // 航程
  freeBox: string; // 免用箱
  freeStorage: string; // 免堆存
  rateItems: RateItem[]; // 费用明细
}

// 港前运价接口
interface PrecarriageRateDetail {
  id: number;
  certNo?: string; // 运价编号（新增时为空）
  type: string; // 类型：直达、支线、海铁
  subType?: string; // 子类型：支线类型/海铁类型
  vendor: string; // 供应商
  validPeriod: string[]; // 有效期区间
  rateItems: RateItem[]; // 费用明细
}

// 尾程运价接口
interface OncarriageRateDetail {
  id: number;
  certNo?: string; // 运价编号（新增时为空）
  agentName: string; // 代理名称
  validPeriod: string[]; // 有效期区间
  rateItems: RateItem[]; // 费用明细
}

/**
 * 整箱询价表单组件
 */
const CreateFclInquiry: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  
  // 保存表单状态
  const [formState, setFormState] = useState({
    inquiryNo: 'R43597505',  // 询价编号，自动生成
    inquirer: '张三',        // 询价人，自动生成
    precarriageChecked: true,  // 港前报价
    mainlineChecked: true,     // 干线报价
    lastmileChecked: true,     // 尾程报价
    cargoNature: '询价',       // 货盘性质
    serviceType: '请选择',     // 服务条款
    clientType: '不指定',      // 委托单位，默认不指定
    clientCompany: '',         // 委托单位正式客户
    clientName: '',            // 委托单位名称
    cargoReadyTimeType: '区间', // 货好时间类型：区间或日期
    cargoReadyTime: '二周内',   // 货好时间
    cargoReadyDate: '',        // 货好具体日期
    transitType: '不指定',     // 直达/中转，默认不指定
    route: '跨太平洋东行',      // 航线，默认为跨太平洋东行
    departurePort: 'CNSHA | Shanghai',    // 起运港
    dischargePort: 'USLAX | Los Angeles', // 目的港
    transitPort: '',           // 中转港
    cargoQuality: '实单',      // 货盘性质
    shipCompany: '不指定',     // 船公司，默认为不指定
    goodsType: '普货',         // 货物类型
    dangerLevel: '',           // 危险品等级
    unNo: '',                  // UN No
    length: '',                // 长宽高
    temperature: '',           // 温度
    humidity: '',              // 湿度量
    weight: '',                // 重量
    serviceTerms: 'DDP',       // 服务条款，默认为DDP (因为默认勾选了港前和尾程)
    customServiceTerms: '',    // 自定义服务条款
    hsCode: '',                // 品名（HS Code）
    remark: '',                // 备注
    containerType: '20GP',     // 箱型
    containerCount: 1,         // 箱量
    loadingPointDetail: '',    // 装箱门点详细地址
    // 尾程送货地址相关
    addressType: '第三方地址',  // 配送地址类型
    zipCode: '',               // 邮编
    address: '',               // 详细地址
    warehouseCode: ''          // 仓库代码
  });

  // 装箱门点区域选择相关状态
  const [areaList, setAreaList] = useState<AreaItem[]>([{
    key: 1,
    province: '',
    city: '',
    district: '',
    street: ''
  }]);
  
  // 城市选项状态
  const [citiesForProvince, setCitiesForProvince] = useState<Record<number, any[]>>({});
  // 区县选项状态
  const [districtsForCity, setDistrictsForCity] = useState<Record<number, any[]>>({});
  // 街道选项状态
  const [streetsForDistrict, setStreetsForDistrict] = useState<Record<number, any[]>>({});
  
  // 详细地址是否可编辑状态
  const [isLoadingPointDetailDisabled, setIsLoadingPointDetailDisabled] = useState(false);

  // 集装箱类型接口
  interface ContainerItem {
    id: number;
    type: string;
    count: number;
  }

  // 集装箱列表状态
  const [containerList, setContainerList] = useState<ContainerItem[]>([
    { id: 1, type: '20GP', count: 1 }
  ]);

  // 已选择的箱型列表，用于禁用重复选择
  const selectedContainerTypes = useMemo(() => {
    return containerList.map(item => item.type);
  }, [containerList]);

  // 运价明细数据
  const [mainlineRates, setMainlineRates] = useState<MainlineRateDetail[]>([]);
  const [precarriageRates, setPrecarriageRates] = useState<PrecarriageRateDetail[]>([]);
  const [oncarriageRates, setOncarriageRates] = useState<OncarriageRateDetail[]>([]);

  // AI识别相关状态
  const [loadingPointAiModalVisible, setLoadingPointAiModalVisible] = useState(false);
  const [loadingPointAddressText, setLoadingPointAddressText] = useState('');
  
  const [deliveryAiModalVisible, setDeliveryAiModalVisible] = useState(false);
  const [deliveryAddressText, setDeliveryAddressText] = useState('');

  // 全局AI识别相关状态
  const [globalAiModalVisible, setGlobalAiModalVisible] = useState(false);
  const [globalAiText, setGlobalAiText] = useState('');
  const [globalAiLoading, setGlobalAiLoading] = useState(false);



  // 添加新的箱型
  const addContainerItem = () => {
    // 如果已经有5个箱型，则不允许再添加
    if (containerList.length >= 5) {
      Message.warning('最多只能添加5个箱型');
      return;
    }
    
    const newId = containerList.length > 0 ? Math.max(...containerList.map(item => item.id)) + 1 : 1;
    // 找到第一个未被选择的箱型
    const boxTypes = ['20GP', '40GP', '40HC', '45HC', '20NOR', '40NOR'];
    const availableBoxType = boxTypes.find(type => !selectedContainerTypes.includes(type)) || '20GP';
    setContainerList([...containerList, { id: newId, type: availableBoxType, count: 1 }]);
  };

  // 更新箱型信息
  const updateContainerItem = (id: number, field: 'type' | 'count', value: string | number) => {
    setContainerList(
      containerList.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  // 移除箱型
  const removeContainerItem = (id: number) => {
    if (containerList.length > 1) {
      setContainerList(containerList.filter(item => item.id !== id));
    } else {
      Message.warning('至少需要保留一个箱型');
    }
  };

  // 更新保存表单状态
  const handleFormChange = (key: string, value: any) => {
    setFormState({
      ...formState,
      [key]: value
    });
  };

  // 处理复选框状态变化
  const handleCheckboxChange = (key: string, checked: boolean) => {
    setFormState(prev => ({
      ...prev,
      [key]: checked
    }));

    // 如果取消了港前价格勾选，则清空装箱门点相关数据
    if (key === 'precarriageChecked' && !checked) {
      // 重置装箱门点数据
      setAreaList([{
        key: 1,
        province: '',
        city: '',
        district: '',
        street: ''
      }]);
      
      // 清空装箱门点详细地址
      setFormState(prev => ({
        ...prev,
        [key]: checked,
        loadingPointDetail: ''
      }));
    }
    
    // 如果取消了尾程价格勾选，则清空送货地址相关数据
    if (key === 'lastmileChecked' && !checked) {
      setFormState(prev => ({
        ...prev,
        [key]: checked,
        addressType: '第三方地址',
        zipCode: '',
        address: '',
        warehouseCode: ''
      }));
    }
    
    // 更新服务条款默认值
    // 当只选了干线价格时，默认为CIF
    // 当选了港前或尾程时，默认为DDP
    const newCheckedState = {
      ...formState,
      [key]: checked
    };
    
    // 如果当前是自定义，不改变
    if (formState.serviceTerms === '自定义') {
      return;
    }
    
    if (key.includes('Checked')) {
      if (newCheckedState.precarriageChecked || newCheckedState.lastmileChecked) {
        setFormState(prev => ({
          ...prev,
          [key]: checked,
          serviceTerms: 'DDP'
        }));
      } else if (newCheckedState.mainlineChecked && !newCheckedState.precarriageChecked && !newCheckedState.lastmileChecked) {
        setFormState(prev => ({
          ...prev,
          [key]: checked,
          serviceTerms: 'CIF'
        }));
      }
    }
  };

  // 处理表单提交

  // 保存草稿
  const handleSaveDraft = () => {
    // 收集表单数据（不进行表单验证）
    const formData = {
      ...formState,
      status: 'draft', // 标记为草稿状态
      containers: containerList,
      loadingPoints: formState.precarriageChecked ? areaList : [], // 保存装箱门点数据
      deliveryAddress: formState.lastmileChecked ? {
        addressType: formState.addressType,
        zipCode: formState.zipCode,
        address: formState.address,
        warehouseCode: formState.warehouseCode
      } : null, // 保存尾程送货地址数据
      mainlineRates,
      precarriageRates,
      oncarriageRates
    };
    
    console.log('保存草稿数据:', formData);
    Message.success('草稿保存成功');
    navigate('/controltower/saas/inquiry-management');
  };

  // 提交询价
  const handleSubmit = () => {
    // 整合所有状态
    const formData = {
      ...formState,
      status: 'submitted', // 标记为已提交状态
      containers: containerList,
      mainlineRates,
      precarriageRates,
      oncarriageRates
    };
    
    console.log('提交表单数据:', formData);
    Message.success('询价单提交成功');
    navigate('/controltower/saas/inquiry-management');
  };

  // 返回询价管理页面
  const handleCancel = () => {
    navigate('/controltower/saas/inquiry-management');
  };

  // 全局AI识别处理函数
  const handleGlobalAiRecognition = async () => {
    if (!globalAiText.trim()) {
      Message.warning('请输入需要识别的文本');
      return;
    }

    setGlobalAiLoading(true);

    try {
      // 模拟AI识别过程
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 解析文本并提取信息
      const extractedInfo = parseGlobalTextForInquiry(globalAiText);

      // 更新表单状态
      setFormState(prev => ({
        ...prev,
        ...extractedInfo
      }));

      // 更新箱型信息
      if (extractedInfo.containerInfo && extractedInfo.containerInfo.length > 0) {
        const newContainerList = extractedInfo.containerInfo.map((container: any, index: number) => ({
          id: index + 1,
          type: container.type,
          count: container.count
        }));
        setContainerList(newContainerList);
      }

      Message.success('AI识别完成，已自动填充相关字段');
      setGlobalAiModalVisible(false);
      setGlobalAiText('');
    } catch (error) {
      Message.error('AI识别失败，请重试');
    } finally {
      setGlobalAiLoading(false);
    }
  };

  // 全局文本解析函数
  const parseGlobalTextForInquiry = (text: string) => {
    const result: any = {};

    // 港口识别
    const portPattern = /([A-Z]{5,6})\s*\|\s*([^,\n]+)/g;
    const ports = [];
    let match;
    while ((match = portPattern.exec(text)) !== null) {
      ports.push(`${match[1]} | ${match[2].trim()}`);
    }

    if (ports.length >= 1) result.departurePort = ports[0];
    if (ports.length >= 2) result.dischargePort = ports[1];

    // 船公司识别
    const shipCompanies = ['马士基', '地中海', 'MSC', 'MAERSK', 'COSCO', '中远海运', 'EVERGREEN', '长荣', 'HAPAG', 'ONE'];
    for (const company of shipCompanies) {
      if (text.includes(company)) {
        result.shipCompany = company;
        break;
      }
    }

    // 箱型识别
    const containerPattern = /(\d+)\s*[x×]\s*(20GP|40GP|40HC|45HC|20NOR|40NOR)/gi;
    const containerInfo: any[] = [];
    let containerMatch;
    while ((containerMatch = containerPattern.exec(text)) !== null) {
      containerInfo.push({
        type: containerMatch[2].toUpperCase(),
        count: parseInt(containerMatch[1])
      });
    }
    if (containerInfo.length > 0) result.containerInfo = containerInfo;

    // 重量识别
    const weightPattern = /(\d+(?:\.\d+)?)\s*(?:KGS?|公斤|千克)/i;
    const weightMatch = text.match(weightPattern);
    if (weightMatch) result.weight = weightMatch[1];

    // 直达/中转识别
    if (text.includes('直达') || text.includes('直航')) {
      result.transitType = '直达';
    } else if (text.includes('中转') || text.includes('转运')) {
      result.transitType = '中转';
    }

    // 航线识别
    if (text.includes('跨太平洋')) {
      result.route = '跨太平洋东行';
    } else if (text.includes('欧洲')) {
      result.route = '远东-欧洲';
    } else if (text.includes('地中海')) {
      result.route = '远东-地中海';
    }

    // 货物类型识别
    if (text.includes('危险品') || text.includes('危险货物')) {
      result.goodsType = '危险品';
    } else if (text.includes('冷冻') || text.includes('冷藏')) {
      result.goodsType = '冷冻品';
    } else if (text.includes('超重') || text.includes('重货')) {
      result.goodsType = '超重货';
    }

    // 服务条款识别
    const serviceTerms = ['EXW', 'FCA', 'FAS', 'FOB', 'CFR', 'CIF', 'CPT', 'CIP', 'DAP', 'DPU', 'DDP'];
    for (const term of serviceTerms) {
      if (text.toUpperCase().includes(term)) {
        result.serviceTerms = term;
        break;
      }
    }

    return result;
  };

  // 获取当前可用的箱型列表（基于基本信息模块中设置的箱型，过滤掉空值）
  const getAvailableContainerTypes = () => {
    return containerList.map(container => container.type).filter(type => type !== '');
  };

  // 导出运价
  const handleExportRate = () => {
    // 检查运价完整性
    const incompleteRates = checkRateCompleteness();
    
    if (incompleteRates.length > 0) {
      setIncompleteModalVisible(true);
    } else {
      setExportModalVisible(true);
    }
  };

  // 检查运价完整性
  const checkRateCompleteness = () => {
    const incomplete: string[] = [];
    
    // 检查干线运价
    if (formState.mainlineChecked && !selectedMainlineRate) {
      incomplete.push('干线运价：未选择');
    }
    
    // 检查港前运价
    if (formState.precarriageChecked && !selectedPrecarriageRate) {
      incomplete.push('港前运价：未选择');
    }
    
    // 检查尾程运价
    if (formState.lastmileChecked && !selectedOncarriageRate) {
      incomplete.push('尾程运价：未选择');
    }
    
    return incomplete;
  };

  // 生成快捷报价文本
  const generateQuotationText = () => {
    const containerInfo = containerList.map(c => `${c.count}*${c.type}`).join(' + ');
    
    // 获取选中的运价
    const selectedMainline = mainlineRates.find(rate => rate.id.toString() === selectedMainlineRate);
    const selectedPrecarriage = precarriageRates.find(rate => rate.id.toString() === selectedPrecarriageRate);
    const selectedOncarriage = oncarriageRates.find(rate => rate.id.toString() === selectedOncarriageRate);
    
    // 计算总价格
    let totalCost = 0;
    const costDetails: string[] = [];
    
    // 计算干线费用
    if (selectedMainline) {
      selectedMainline.rateItems.forEach(item => {
        containerList.forEach(container => {
          const rate = item.containerRates?.[container.type];
          if (rate) {
            const cost = parseFloat(rate) * container.count;
            totalCost += cost;
          }
        });
      });
      costDetails.push(`干线运价：${selectedMainline.certNo || 'M' + String(selectedMainline.id).padStart(3, '0')} - ${selectedMainline.shipCompany}`);
    }
    
    // 计算港前费用
    if (selectedPrecarriage) {
      selectedPrecarriage.rateItems.forEach(item => {
        containerList.forEach(container => {
          const rate = item.containerRates?.[container.type];
          if (rate) {
            const cost = parseFloat(rate) * container.count;
            totalCost += cost;
          }
        });
      });
      costDetails.push(`港前运价：${selectedPrecarriage.certNo || 'P' + String(selectedPrecarriage.id).padStart(3, '0')} - ${selectedPrecarriage.vendor}`);
    }
    
    // 计算尾程费用
    if (selectedOncarriage) {
      selectedOncarriage.rateItems.forEach(item => {
        if (item.unitPrice) {
          const cost = parseFloat(item.unitPrice) * containerList.length; // 简化计算
          totalCost += cost;
        }
      });
      costDetails.push(`尾程运价：${selectedOncarriage.certNo || 'O' + String(selectedOncarriage.id).padStart(3, '0')} - ${selectedOncarriage.agentName}`);
    }

    const text = `
【询价单】

询价编号：${formState.inquiryNo || 'INQ' + Date.now()}
委托单位：${formState.clientType === '正式客户' ? formState.clientCompany : formState.clientName}

航线信息：
${formState.departurePort} → ${formState.dischargePort}
船公司：${formState.shipCompany}
航线：${formState.route}
直达/中转：${formState.transitType}

箱型箱量：${containerInfo}

运价方案：
${costDetails.join('\n')}

预估总计：USD ${totalCost.toFixed(2)}

备注：${formState.remark || '无'}

※ 以上价格仅供参考，实际价格以正式合同为准
※ 如有任何疑问，请联系我们的客服团队
    `.trim();

    setQuotationText(text);
    setExportModalVisible(false);
    setCopyTextModalVisible(true);
  };

  // 复制到剪贴板
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(quotationText);
      Message.success('运价文本已复制到剪贴板');
      setCopyTextModalVisible(false);
    } catch (err) {
      Message.error('复制失败，请手动复制');
    }
  };

  // 生成并预览PDF
  const generatePDF = () => {
    setExportModalVisible(false);
    setPdfPreviewVisible(true);
  };

  // 航线负责人表格数据


  // 检查区域选择是否重复
  const isAreaDuplicate = (currentKey: number, province: string, city: string, district: string, street: string): boolean => {
    if (!province || !city || !district) return false;
    
    return areaList.some(area => 
      area.key !== currentKey && 
      area.province === province && 
      area.city === city && 
      area.district === district && 
      ((street && area.street === street) || (!street && !area.street))
    );
  };
  
  // 获取已选择的街道列表（用于禁用已选择的街道）

  // 更新区域字段
  const updateAreaField = (key: number, field: string, value: string) => {
    const newAreaList = areaList.map(area => {
      if (area.key === key) {
        const updatedArea = { ...area, [field]: value };
        
        // 当选择省份时，重置下级选项
        if (field === 'province') {
          updatedArea.city = '';
          updatedArea.district = '';
          updatedArea.street = '';
          
          // 更新城市选项
          if (value && cityOptions[value]) {
            setCitiesForProvince(prev => ({ ...prev, [key]: cityOptions[value] }));
          }
        }
        
        // 当选择城市时，重置下级选项
        if (field === 'city') {
          updatedArea.district = '';
          updatedArea.street = '';
          
          // 更新区县选项
          if (value && districtOptions[value]) {
            setDistrictsForCity(prev => ({ ...prev, [key]: districtOptions[value] }));
          }
        }
        
        // 当选择区县时，重置街道
        if (field === 'district') {
          updatedArea.street = '';
          
          // 更新街道选项
          if (value && streetOptions[value]) {
            setStreetsForDistrict(prev => ({ ...prev, [key]: streetOptions[value] }));
          }
        }
        
        // 检查是否重复选择
        if (isAreaDuplicate(
          key, 
          field === 'province' ? value : updatedArea.province,
          field === 'city' ? value : updatedArea.city,
          field === 'district' ? value : updatedArea.district,
          field === 'street' ? value : updatedArea.street
        )) {
          Message.warning('不能选择重复的区域');
          return area; // 保持原值不变
        }
        
        return updatedArea;
      }
      return area;
    });
    
    setAreaList(newAreaList);
    
    // 检查详细地址输入框状态
    checkLoadingPointDetailStatus(newAreaList);
  };

  // 检查详细地址输入框状态
  const checkLoadingPointDetailStatus = (areas: AreaItem[]) => {
    // 计算有多少个街道被选择了
    const streetSelectedCount = areas.filter(area => area.street).length;
    
    // 如果选择了2个或以上的街道，则禁用详细地址
    const shouldDisable = streetSelectedCount >= 2;
    
    if (shouldDisable) {
      // 如果之前是启用状态，现在要禁用，清空详细地址
      if (!isLoadingPointDetailDisabled) {
        setFormState(prev => ({
          ...prev,
          loadingPointDetail: ''
        }));
      }
    }
    
    setIsLoadingPointDetailDisabled(shouldDisable);
  };

  // 初始化组件时设置第一个区域的城市选项
  useEffect(() => {
    if (areaList[0].province && cityOptions[areaList[0].province]) {
      setCitiesForProvince({ 1: cityOptions[areaList[0].province] });
    }
  }, []);

  // 处理邮编变化自动带出地址
  const handleZipCodeChange = (zipCode: string) => {
    // 更新邮编
    setFormState(prev => ({
      ...prev,
      zipCode
    }));

    // 如果邮编存在于映射中，自动填充地址
    if (zipCode && zipCodeAddressMap[zipCode]) {
      setFormState(prev => ({
        ...prev,
        zipCode,
        address: zipCodeAddressMap[zipCode]
      }));
      Message.success(`已自动填充地址: ${zipCodeAddressMap[zipCode]}`);
    }
  };

  // 打开装箱门点AI识别弹窗
  const openLoadingPointAiModal = () => {
    setLoadingPointAiModalVisible(true);
  };

  // 关闭装箱门点AI识别弹窗
  const closeLoadingPointAiModal = () => {
    setLoadingPointAiModalVisible(false);
  };

  // 打开尾程送货地址AI识别弹窗
  const openDeliveryAiModal = () => {
    setDeliveryAiModalVisible(true);
  };

  // 关闭尾程送货地址AI识别弹窗
  const closeDeliveryAiModal = () => {
    setDeliveryAiModalVisible(false);
  };

  // 处理装箱门点AI识别
  const handleLoadingPointAiRecognize = () => {
    // 模拟识别过程
    setTimeout(() => {
      if (loadingPointAddressText) {
        const recognizedArea: AreaItem = {
          key: 1,
          province: '',
          city: '',
          district: '',
          street: ''
        };
        
        // 解析地址文本
        if (loadingPointAddressText.includes('浙江')) {
          recognizedArea.province = '浙江省';
          
          if (loadingPointAddressText.includes('杭州')) {
            recognizedArea.city = '杭州市';
            
            if (loadingPointAddressText.includes('萧山')) {
              recognizedArea.district = '萧山区';
              
              if (loadingPointAddressText.includes('新塘')) {
                recognizedArea.street = '新塘街道';
              }
            } else if (loadingPointAddressText.includes('西湖')) {
              recognizedArea.district = '西湖区';
              
              if (loadingPointAddressText.includes('灵隐')) {
                recognizedArea.street = '灵隐街道';
              }
            }
          }
        } else if (loadingPointAddressText.includes('江苏')) {
          recognizedArea.province = '江苏省';
          
          if (loadingPointAddressText.includes('苏州')) {
            recognizedArea.city = '苏州市';
            
            if (loadingPointAddressText.includes('园区') || loadingPointAddressText.includes('工业园')) {
              recognizedArea.district = '工业园区';
              
              if (loadingPointAddressText.includes('娄葑')) {
                recognizedArea.street = '娄葑街道';
              }
            }
          }
        }
        
        // 如果识别成功
        if (recognizedArea.province) {
          // 更新区域
          setAreaList([recognizedArea]);
          
          // 更新城市选项
          if (recognizedArea.province && cityOptions[recognizedArea.province]) {
            setCitiesForProvince({ 1: cityOptions[recognizedArea.province] });
          }
          
          // 更新区县选项
          if (recognizedArea.city && districtOptions[recognizedArea.city]) {
            setDistrictsForCity({ 1: districtOptions[recognizedArea.city] });
          }
          
          // 更新街道选项
          if (recognizedArea.district && streetOptions[recognizedArea.district]) {
            setStreetsForDistrict({ 1: streetOptions[recognizedArea.district] });
          }
          
          // 更新详细地址
          setFormState(prev => ({
            ...prev,
            loadingPointDetail: loadingPointAddressText.replace(/浙江省|江苏省|杭州市|苏州市|萧山区|西湖区|工业园区|新塘街道|灵隐街道|娄葑街道/g, '').trim()
          }));
          
          Message.success('地址识别成功');
        } else {
          Message.error('无法识别地址信息，请手动选择');
        }
      }
      closeLoadingPointAiModal();
    }, 1000);
  };

  // 处理尾程送货地址AI识别
  const handleDeliveryAiRecognize = () => {
    // 模拟识别过程
    setTimeout(() => {
      if (deliveryAddressText) {
        // 模拟美国地址识别
        let zipCode = '';
        let address = '';
        let isWarehouse = false;
        let warehouseType = '';
        let warehouseCode = '';
        
        // 检查是否包含仓库代码
        if (deliveryAddressText.includes('ONT8') || deliveryAddressText.includes('BFI4')) {
          isWarehouse = true;
          warehouseType = '亚马逊仓库';
          warehouseCode = deliveryAddressText.includes('ONT8') ? 'ONT8' : 'BFI4';
        } else if (deliveryAddressText.includes('LAX203') || deliveryAddressText.includes('ATL205')) {
          isWarehouse = true;
          warehouseType = '易仓';
          warehouseCode = deliveryAddressText.includes('LAX203') ? 'LAX203' : 'ATL205';
        }
        
        // 如果是仓库类型，只设置仓库相关信息
        if (isWarehouse) {
          setFormState(prev => ({
            ...prev,
            addressType: warehouseType,
            warehouseCode: warehouseCode,
            // 清空不需要的字段
            zipCode: '',
            address: ''
          }));
          
          Message.success(`已识别为${warehouseType}，代码：${warehouseCode}`);
        } else {
          // 尝试提取邮编（美国标准5位数字邮编）
          const zipMatch = deliveryAddressText.match(/\b\d{5}\b/);
          if (zipMatch) {
            zipCode = zipMatch[0];
          }
          
          // 从文本中提取地址信息
          if (deliveryAddressText.includes('CA')) {
            // 识别加利福尼亚州的地址
            if (deliveryAddressText.includes('San Diego')) {
              address = 'San Diego, CA';
            } else if (deliveryAddressText.includes('Los Angeles')) {
              address = 'Los Angeles, CA';
            } else if (deliveryAddressText.includes('Ontario')) {
              address = 'Ontario, CA';
            } else {
              address = deliveryAddressText.replace(/\d{5}/, '').trim();
            }
          } else if (deliveryAddressText.includes('NY')) {
            address = 'New York, NY';
          } else {
            address = deliveryAddressText.replace(/\d{5}/, '').trim();
          }
          
          // 如果找到了地址和邮编
          if (address) {
            setFormState(prev => ({
              ...prev,
              addressType: '第三方地址',
              address: address,
              zipCode: zipCode || '',
              // 清空仓库代码
              warehouseCode: ''
            }));
            
            Message.success('已识别地址信息');
          } else {
            Message.info('无法识别地址，请手动输入');
          }
        }
      }
      closeDeliveryAiModal();
    }, 1000);
  };

  // 选择框状态
  const [selectedMainlineRate, setSelectedMainlineRate] = useState('');
  const [selectedPrecarriageRate, setSelectedPrecarriageRate] = useState('');
  const [selectedOncarriageRate, setSelectedOncarriageRate] = useState('');

  // 导出运价相关状态
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [incompleteModalVisible, setIncompleteModalVisible] = useState(false);
  const [copyTextModalVisible, setCopyTextModalVisible] = useState(false);
  const [pdfPreviewVisible, setPdfPreviewVisible] = useState(false);
  const [quotationText, setQuotationText] = useState('');

  // 查询匹配运价状态
  const [hasQueriedRates, setHasQueriedRates] = useState(false);
  const [isQuerying, setIsQuerying] = useState(false);

  // 查询匹配运价
  const handleQueryRates = () => {
    setIsQuerying(true);
    
    // 模拟查询过程
    setTimeout(() => {
      // 添加示例干线运价
      setMainlineRates([
        {
          id: 1,
          certNo: 'M001',
          shipCompany: '地中海',
          validPeriod: ['2024-06-01', '2024-07-01'],
          transitType: '直达',
          transitTime: '14天',
          freeBox: '14天',
          freeStorage: '7天',
          rateItems: [
            {
              id: 1,
              feeType: 'container',
              feeName: '海运费',
              currency: 'USD',
              unit: '箱',
              remark: '',
              containerRates: {
                '20GP': '1500',
                '40GP': '2800',
                '40HC': '2900'
              }
            },
            {
              id: 2,
              feeType: 'non-container',
              feeName: '文件费',
              currency: 'CNY',
              unit: '票',
              remark: '',
              unitPrice: '500'
            }
          ]
        },
        {
          id: 2,
          certNo: 'M002',
          shipCompany: '马士基',
          validPeriod: ['2024-07-01', '2024-08-01'],
          transitType: '中转',
          transitTime: '16天',
          freeBox: '21天',
          freeStorage: '10天',
          rateItems: [
            {
              id: 3,
              feeType: 'container',
              feeName: '海运费',
              currency: 'USD',
              unit: '箱',
              remark: '',
              containerRates: {
                '20GP': '1450',
                '40GP': '2750',
                '40HC': '2850'
              }
            }
          ]
        }
      ]);

      // 添加示例港前运价
      setPrecarriageRates([
        {
          id: 1,
          certNo: 'P001',
          type: '直达',
          vendor: '德邦专线',
          validPeriod: ['2024-06-01', '2024-12-31'],
          rateItems: [
            {
              id: 4,
              feeType: 'container',
              feeName: '拖车费',
              currency: 'CNY',
              unit: '箱',
              remark: '',
              containerRates: {
                '20GP': '800',
                '40GP': '1200',
                '40HC': '1300'
              }
            }
          ]
        }
      ]);

      // 添加示例尾程运价
      setOncarriageRates([
        {
          id: 1,
          certNo: 'O001',
          agentName: 'XPO TRUCK LLC',
          validPeriod: ['2024-05-01', '2024-12-31'],
          rateItems: [
            {
              id: 5,
              feeType: 'non-container',
              feeName: 'ISF CHARGE',
              currency: 'USD',
              unit: 'B/L',
              remark: '',
              unitPrice: '50'
            }
          ]
        }
      ]);

      setHasQueriedRates(true);
      setIsQuerying(false);
      Message.success('匹配运价查询完成');
    }, 1500);
  };

  // 渲染费用明细表格
  const renderRateTable = (rateItems: RateItem[], containerTypes: string[]) => {
    // 按费用类型分组
    const containerRateItems = rateItems.filter(item => item.feeType === 'container');
    const unitRateItems = rateItems.filter(item => item.feeType === 'non-container');

    // 按箱计费表格列
    const containerColumns = [
      {
        title: '费用名称',
        dataIndex: 'feeName',
        width: 120,
      },
      {
        title: '币种',
        dataIndex: 'currency',
        width: 80,
      },
      ...containerTypes.map(type => ({
        title: type.toUpperCase(),
        dataIndex: type,
        width: 100,
        render: (_: string, record: RateItem) => {
          return record.containerRates?.[type as keyof typeof record.containerRates] || '-';
        }
      })),
      {
        title: '备注',
        dataIndex: 'remark',
        width: 120,
        render: (value: string) => value || '-'
      }
    ];

    // 非按箱计费表格列
    const unitColumns = [
      {
        title: '费用名称',
        dataIndex: 'feeName',
        width: 120,
      },
      {
        title: '币种',
        dataIndex: 'currency',
        width: 80,
      },
      {
        title: '单价',
        dataIndex: 'unitPrice',
        width: 100,
      },
      {
        title: '单位',
        dataIndex: 'unit',
        width: 80,
      },
      {
        title: '备注',
        dataIndex: 'remark',
        width: 120,
        render: (value: string) => value || '-'
      }
    ];

    return (
      <div className="space-y-4">
        {/* 按箱计费表格 */}
        {containerRateItems.length > 0 && (
          <div>
            <div className="text-sm font-medium text-gray-600 mb-2">按箱计费</div>
            <Table
              columns={containerColumns}
              data={containerRateItems}
              rowKey="id"
              pagination={false}
              size="small"
              border={{
                wrapper: true,
                cell: true
              }}
            />
          </div>
        )}

        {/* 非按箱计费表格 */}
        {unitRateItems.length > 0 && (
          <div>
            <div className="text-sm font-medium text-gray-600 mb-2">非按箱计费</div>
            <Table
              columns={unitColumns}
              data={unitRateItems}
              rowKey="id"
              pagination={false}
              size="small"
              border={{
                wrapper: true,
                cell: true
              }}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <ControlTowerSaasLayout 
      menuSelectedKey="9" 
      breadcrumb={
        <Breadcrumb>
          <Breadcrumb.Item>询价报价</Breadcrumb.Item>
          <Breadcrumb.Item>询价管理</Breadcrumb.Item>
          <Breadcrumb.Item>新建整箱询价</Breadcrumb.Item>
        </Breadcrumb>
      }
    >
      <Form form={form} layout="vertical" initialValues={formState}>
        <Card className="mb-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <Checkbox 
                checked={formState.precarriageChecked} 
                onChange={(checked) => handleCheckboxChange('precarriageChecked', checked)}
                style={{ marginRight: 16 }}
              >
                港前价格
              </Checkbox>
              <Checkbox 
                checked={formState.mainlineChecked}
                onChange={(checked) => handleCheckboxChange('mainlineChecked', checked)}
                style={{ marginRight: 16 }}
              >
                干线价格
              </Checkbox>
              <Checkbox 
                checked={formState.lastmileChecked}
                onChange={(checked) => handleCheckboxChange('lastmileChecked', checked)}
              >
                尾程价格
              </Checkbox>
            </div>
            <Space>
              <Button
                icon={<IconRobot />}
                onClick={() => setGlobalAiModalVisible(true)}
                style={{
                  backgroundColor: '#1890ff',
                  borderColor: '#1890ff',
                  color: 'white'
                }}
              >
                AI识别
              </Button>
              <Button icon={<IconSave />} onClick={handleSaveDraft}>保存草稿</Button>
              <Button icon={<IconDownload />} onClick={handleExportRate}>导出运价</Button>
              <Button type="primary" icon={<IconUpload />} onClick={handleSubmit}>直接提交</Button>
              <Button icon={<IconDelete />} onClick={handleCancel}>取消</Button>
            </Space>
          </div>
          
          <Row gutter={[16, 16]}>
            {/* 左侧区域：基本信息 */}
            <Col span={12}>
              <div className="border rounded p-4 mb-4">
                <div className="text-blue-600 font-bold border-l-4 border-blue-600 pl-2 mb-4">基本信息</div>
                
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <FormItem label="询价编号" field="inquiryNo">
                      <Input placeholder="R43597505" value={formState.inquiryNo} disabled />
                    </FormItem>
                  </Col>
                  
                  <Col span={24}>
                    <FormItem label="询价人" field="inquirer">
                      <Input 
                        placeholder="自动生成" 
                        value={formState.inquirer}
                        onChange={(value) => handleFormChange('inquirer', value)}
                        disabled
                      />
                    </FormItem>
                  </Col>
                  
                  <Col span={24}>
                    <FormItem label="货盘性质" field="cargoNature">
                      <Select 
                        placeholder="请选择" 
                        style={{ width: '100%' }}
                        value={formState.cargoNature}
                        onChange={(value) => handleFormChange('cargoNature', value)}
                      >
                        <Option value="询价">询价</Option>
                        <Option value="实单">实单</Option>
                      </Select>
                    </FormItem>
                  </Col>
                  
                  <Col span={24}>
                    <FormItem label="货好时间" field="cargoReadyTime">
                      <div className="flex items-center">
                        <div className="mr-3 flex items-center">
                          <Radio.Group
                            type="button"
                            name="cargoReadyTimeType"
                            value={formState.cargoReadyTimeType}
                            onChange={(value) => handleFormChange('cargoReadyTimeType', value)}
                          >
                            <Radio value="区间">区间</Radio>
                            <Radio value="日期">日期</Radio>
                          </Radio.Group>
                        </div>
                        <div className="flex-1">
                          {formState.cargoReadyTimeType === '区间' ? (
                            <Select 
                              placeholder="请选择" 
                              style={{ width: '100%' }}
                              value={formState.cargoReadyTime}
                              onChange={(value) => handleFormChange('cargoReadyTime', value)}
                            >
                              <Option value="一周内">一周内</Option>
                              <Option value="二周内">二周内</Option>
                              <Option value="一个月内">一个月内</Option>
                              <Option value="一月以上">一月以上</Option>
                              <Option value="时间未知">时间未知</Option>
                            </Select>
                          ) : (
                            <DatePicker 
                              style={{ width: '100%' }}
                              value={formState.cargoReadyDate ? formState.cargoReadyDate : undefined}
                              onChange={(dateString) => handleFormChange('cargoReadyDate', dateString)}
                              placeholder="请选择货好日期"
                            />
                          )}
                        </div>
                      </div>
                    </FormItem>
                  </Col>
                  
                  <Col span={24}>
                    <FormItem label="货盘质量" field="cargoQuality">
                      <Select 
                        placeholder="请选择" 
                        style={{ width: '100%' }}
                        value={formState.cargoQuality}
                        onChange={(value) => handleFormChange('cargoQuality', value)}
                      >
                        <Option value="实单">实单</Option>
                        <Option value="询价">询价</Option>
                      </Select>
                    </FormItem>
                  </Col>
                  
                  <Col span={24}>
                    <FormItem label="服务条款" field="serviceTerms">
                      <div className="flex items-center">
                        <Select 
                          placeholder="请选择" 
                          style={{ width: formState.serviceTerms === '自定义' ? 'calc(50% - 8px)' : '100%' }}
                          value={formState.serviceTerms}
                          onChange={(value) => {
                            if (value === '自定义') {
                              handleFormChange('serviceTerms', value);
                            } else {
                              // 清空自定义内容
                              setFormState(prev => ({
                                ...prev,
                                serviceTerms: value,
                                customServiceTerms: ''
                              }));
                            }
                          }}
                        >
                          <Option value="CIF">CIF</Option>
                          <Option value="FOB">FOB</Option>
                          <Option value="DDP">DDP</Option>
                          <Option value="DDU">DDU</Option>
                          <Option value="EXW">EXW</Option>
                          <Option value="DAP">DAP</Option>
                          <Option value="FBA">FBA</Option>
                          <Option value="自定义">自定义</Option>
                        </Select>
                        
                        {formState.serviceTerms === '自定义' && (
                          <Input 
                            placeholder="请输入自定义服务条款" 
                            value={formState.customServiceTerms}
                            onChange={(value) => handleFormChange('customServiceTerms', value)}
                            style={{ width: 'calc(50% - 8px)', marginLeft: 16 }}
                          />
                        )}
                      </div>
                    </FormItem>
                  </Col>
                  
                  <Col span={24}>
                    <FormItem label="委托单位" field="clientType">
                      <div className="flex items-center">
                        <div className="flex-1">
                          <Select 
                            placeholder="请选择委托单位" 
                            style={{ width: '100%' }}
                            value={formState.clientType}
                            onChange={(value) => handleFormChange('clientType', value)}
                          >
                            <Option value="不指定">不指定</Option>
                            <Option value="正式客户">正式客户</Option>
                            <Option value="临时客户">临时客户</Option>
                          </Select>
                        </div>

                        {formState.clientType === '正式客户' && (
                          <div className="ml-3" style={{ width: '50%' }}>
                            <Select 
                              placeholder="选择客户抬头" 
                              style={{ width: '100%' }}
                              value={formState.clientCompany}
                              onChange={(value) => handleFormChange('clientCompany', value)}
                            >
                              <Option value="阿里巴巴集团">阿里巴巴集团</Option>
                              <Option value="京东物流有限公司">京东物流有限公司</Option>
                              <Option value="华为技术有限公司">华为技术有限公司</Option>
                              <Option value="小米科技有限公司">小米科技有限公司</Option>
                              <Option value="海尔集团公司">海尔集团公司</Option>
                              <Option value="宝钢集团有限公司">宝钢集团有限公司</Option>
                              <Option value="招商局集团">招商局集团</Option>
                              <Option value="中远海运集团">中远海运集团</Option>
                            </Select>
                          </div>
                        )}

                        {formState.clientType === '临时客户' && (
                          <div className="ml-3" style={{ width: '50%' }}>
                            <Input 
                              placeholder="请输入客户抬头" 
                              value={formState.clientName}
                              onChange={(value) => handleFormChange('clientName', value)}
                            />
                          </div>
                        )}
                      </div>
                    </FormItem>
                  </Col>
                  
                  {/* 装箱门点区域，仅在勾选港前报价时显示 */}
                  {formState.precarriageChecked && (
                    <Col span={24}>
                      <div className="mb-4">
                        <div className="text-gray-800 font-medium mb-2">装箱门点</div>
                        <div className="flex items-center justify-between mb-2">
                          <FormItem label="" style={{ width: '100%', marginBottom: 0 }}>
                            <div className="flex items-center w-full">
                              <div className="text-xs text-gray-500 mr-auto">选择装箱门点区域</div>
                              <Button 
                                type="primary" 
                                icon={<IconRobot />} 
                                onClick={openLoadingPointAiModal}
                              >
                                AI识别
                              </Button>
                            </div>
                          </FormItem>
                        </div>
                        
                        {areaList.map((area, _index) => (
                          <div key={area.key} className="mb-3 border-b border-gray-200 pb-2">
                            <Row gutter={[8, 0]}>
                              <Col span={6}>
                                <FormItem label="" required style={{ marginBottom: 0 }}>
                                  <Select 
                                    placeholder="省份"
                                    options={provinceOptions}
                                    value={area.province}
                                    onChange={(value) => updateAreaField(area.key, 'province', value)}
                                    style={{ width: '100%' }}
                                    size="default"
                                    allowClear
                                  />
                                </FormItem>
                              </Col>
                              <Col span={6}>
                                <FormItem label="" required style={{ marginBottom: 0 }}>
                                  <Select 
                                    placeholder="城市"
                                    options={citiesForProvince[_index] || []}
                                    value={area.city}
                                    onChange={(value) => updateAreaField(area.key, 'city', value)}
                                    style={{ width: '100%' }}
                                    size="default"
                                    disabled={!area.province}
                                    allowClear
                                  />
                                </FormItem>
                              </Col>
                              <Col span={6}>
                                <FormItem label="" required style={{ marginBottom: 0 }}>
                                  <Select 
                                    placeholder="区/县"
                                    options={districtsForCity[_index] || []}
                                    value={area.district}
                                    onChange={(value) => updateAreaField(area.key, 'district', value)}
                                    style={{ width: '100%' }}
                                    size="default"
                                    disabled={!area.city}
                                    allowClear
                                  />
                                </FormItem>
                              </Col>
                              <Col span={6}>
                                <FormItem label="" style={{ marginBottom: 0 }}>
                                  <Select 
                                    placeholder="街道/村镇"
                                    options={streetsForDistrict[_index] ? streetsForDistrict[_index] : []}
                                    value={area.street}
                                    onChange={(value) => updateAreaField(area.key, 'street', value)}
                                    style={{ width: '100%' }}
                                    size="default"
                                    disabled={!area.district}
                                    allowClear
                                  />
                                </FormItem>
                              </Col>
                            </Row>
                          </div>
                        ))}

                        <FormItem label="详细地址" field="loadingPointDetail">
                          <Input.TextArea
                            placeholder="请输入详细地址"
                            value={formState.loadingPointDetail}
                            onChange={(value) => handleFormChange('loadingPointDetail', value)}
                            style={{ minHeight: '60px' }}
                            allowClear
                          />
                        </FormItem>
                      </div>
                    </Col>
                  )}
                  
                  {/* 尾程送货地址，仅在勾选尾程报价时显示 */}
                  {formState.lastmileChecked && (
                    <Col span={24}>
                      <div className="mb-4">
                        <div className="text-gray-800 font-medium mb-2">尾程送货地址</div>
                        <div className="flex items-center justify-between mb-2">
                          <FormItem label="" style={{ width: '100%', marginBottom: 0 }}>
                            <div className="flex items-center w-full">
                              <div className="text-xs text-gray-500 mr-auto">配送地址信息</div>
                              <Button 
                                type="primary" 
                                icon={<IconRobot />} 
                                onClick={openDeliveryAiModal}
                              >
                                AI识别
                              </Button>
                            </div>
                          </FormItem>
                        </div>
                        
                        <FormItem label="配送地址类型" field="addressType" style={{ marginBottom: '12px' }}>
                          <RadioGroup 
                            value={formState.addressType}
                            onChange={(value) => handleFormChange('addressType', value)}
                          >
                            <Radio value="第三方地址">第三方地址</Radio>
                            <Radio value="亚马逊仓库">亚马逊仓库</Radio>
                            <Radio value="易仓">易仓</Radio>
                          </RadioGroup>
                        </FormItem>
                        
                        {formState.addressType === '第三方地址' && (
                          <>
                            <FormItem label="邮编" field="zipCode" style={{ marginBottom: '12px' }}>
                              <Input 
                                placeholder="请输入邮编" 
                                value={formState.zipCode}
                                onChange={(value) => handleZipCodeChange(value)}
                                allowClear
                              />
                            </FormItem>
                            
                            <FormItem label="地址" field="address" style={{ marginBottom: '12px' }}>
                              <Input 
                                placeholder="例如：San Diego, CA" 
                                value={formState.address}
                                onChange={(value) => handleFormChange('address', value)}
                                allowClear
                              />
                            </FormItem>
                          </>
                        )}
                        
                        {(formState.addressType === '亚马逊仓库' || formState.addressType === '易仓') && (
                          <FormItem 
                            label="仓库代码" 
                            field="warehouseCode"
                            style={{ marginBottom: '12px' }}
                          >
                            <Input 
                              placeholder={formState.addressType === '亚马逊仓库' ? "例如：ONT8" : "例如：LAX203"} 
                              value={formState.warehouseCode}
                              onChange={(value) => handleFormChange('warehouseCode', value)}
                              allowClear
                            />
                          </FormItem>
                        )}
                      </div>
                    </Col>
                  )}
                </Row>
              </div>
            </Col>
            
            {/* 右侧区域：货物信息 */}
            <Col span={12}>
              <div className="border rounded p-4 mb-4">
                <div className="text-blue-600 font-bold border-l-4 border-blue-600 pl-2 mb-4">货物信息</div>
                
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <FormItem label="直达/中转" field="transitType">
                      <RadioGroup 
                        value={formState.transitType}
                        onChange={(value) => handleFormChange('transitType', value)}
                      >
                        <Radio value="不指定">不指定</Radio>
                        <Radio value="直达">直达</Radio>
                        <Radio value="中转">中转</Radio>
                      </RadioGroup>
                    </FormItem>
                  </Col>
                  
                  <Col span={24}>
                    <FormItem label="航线" field="route">
                      <Select
                        placeholder="请选择航线" 
                        value={formState.route}
                        onChange={(value) => handleFormChange('route', value)}
                        style={{ width: '100%' }}
                        showSearch
                      >
                        <Option value="跨太平洋东行">跨太平洋东行</Option>
                        <Option value="跨太平洋西行">跨太平洋西行</Option>
                        <Option value="远东西行">远东西行</Option>
                        <Option value="远东东行">远东东行</Option>
                        <Option value="欧地线">欧地线</Option>
                        <Option value="亚洲区域">亚洲区域</Option>
                        <Option value="中东印巴线">中东印巴线</Option>
                      </Select>
                    </FormItem>
                  </Col>
                  
                  <Col span={24}>
                    <FormItem label="起运港" field="departurePort">
                      <Select
                        placeholder="请选择起运港" 
                        value={formState.departurePort}
                        onChange={(value) => handleFormChange('departurePort', value)}
                        style={{ width: '100%' }}
                        showSearch
                      >
                        <Option value="CNSHA | Shanghai">CNSHA | Shanghai</Option>
                        <Option value="CNNGB | Ningbo">CNNGB | Ningbo</Option>
                        <Option value="CNQIN | Qingdao">CNQIN | Qingdao</Option>
                        <Option value="CNTXG | Tianjin">CNTXG | Tianjin</Option>
                        <Option value="CNCAN | Guangzhou">CNCAN | Guangzhou</Option>
                      </Select>
                    </FormItem>
                  </Col>
                  
                  <Col span={24}>
                    <FormItem label="目的港" field="dischargePort">
                      <Select
                        placeholder="请选择目的港" 
                        value={formState.dischargePort}
                        onChange={(value) => handleFormChange('dischargePort', value)}
                        style={{ width: '100%' }}
                        showSearch
                      >
                        <Option value="USLAX | Los Angeles">USLAX | Los Angeles</Option>
                        <Option value="USNYC | New York">USNYC | New York</Option>
                        <Option value="DEHAM | Hamburg">DEHAM | Hamburg</Option>
                        <Option value="NLRTM | Rotterdam">NLRTM | Rotterdam</Option>
                        <Option value="SGSIN | Singapore">SGSIN | Singapore</Option>
                      </Select>
                    </FormItem>
                  </Col>
                  
                  {/* 中转港字段 - 仅在选择中转时显示 */}
                  {formState.transitType === '中转' && (
                    <Col span={24}>
                      <FormItem label="中转港" field="transitPort">
                        <Select
                          placeholder="请选择中转港" 
                          value={formState.transitPort}
                          onChange={(value) => handleFormChange('transitPort', value)}
                          style={{ width: '100%' }}
                          showSearch
                        >
                          <Option value="KRPUS | Busan">KRPUS | Busan</Option>
                          <Option value="SGSIN | Singapore">SGSIN | Singapore</Option>
                          <Option value="HKHKG | Hong Kong">HKHKG | Hong Kong</Option>
                          <Option value="TWKHH | Kaohsiung">TWKHH | Kaohsiung</Option>
                          <Option value="MYPKG | Port Klang">MYPKG | Port Klang</Option>
                        </Select>
                      </FormItem>
                    </Col>
                  )}
                  
                  <Col span={24}>
                    <FormItem label="货物类型" field="goodsType">
                      <Select 
                        placeholder="请选择" 
                        style={{ width: '100%' }}
                        value={formState.goodsType}
                        onChange={(value) => handleFormChange('goodsType', value)}
                      >
                        <Option value="普货">普货</Option>
                        <Option value="危险品">危险品</Option>
                        <Option value="冷冻货">冷冻货</Option>
                        <Option value="卷钢">卷钢</Option>
                        <Option value="化工品">化工品</Option>
                      </Select>
                    </FormItem>
                  </Col>
                  
                  {formState.goodsType === '危险品' && (
                    <>
                      <Col span={24}>
                        <FormItem label="危险品等级" field="dangerLevel">
                          <Input
                            placeholder="请输入危险品等级"
                            value={formState.dangerLevel}
                            onChange={(value) => handleFormChange('dangerLevel', value)}
                          />
                        </FormItem>
                      </Col>
                      
                      <Col span={24}>
                        <FormItem label="UN No" field="unNo">
                          <Input
                            placeholder="请输入UN No"
                            value={formState.unNo}
                            onChange={(value) => handleFormChange('unNo', value)}
                          />
                        </FormItem>
                      </Col>
                    </>
                  )}
                  
                  {formState.goodsType === '冷冻货' && (
                    <>
                      <Col span={24}>
                        <FormItem label="温度" field="temperature">
                          <Input
                            placeholder="请输入温度"
                            value={formState.temperature}
                            onChange={(value) => handleFormChange('temperature', value)}
                            suffix="°C"
                          />
                        </FormItem>
                      </Col>
                      
                      <Col span={24}>
                        <FormItem label="通风量" field="humidity">
                          <Input
                            placeholder="请输入通风量"
                            value={formState.humidity}
                            onChange={(value) => handleFormChange('humidity', value)}
                            suffix="%"
                          />
                        </FormItem>
                      </Col>
                    </>
                  )}
                  
                  <Col span={24}>
                    <FormItem label="品名（HS Code）" field="hsCode">
                      <Input 
                        placeholder="请输入品名或HS Code" 
                        value={formState.hsCode}
                        onChange={(value) => handleFormChange('hsCode', value)}
                      />
                    </FormItem>
                  </Col>
                  
                  <Col span={24}>
                    <FormItem label="重量" field="weight">
                      <Input 
                        placeholder="请输入重量" 
                        suffix="KGS"
                        value={formState.weight}
                        onChange={(value) => handleFormChange('weight', value)}
                      />
                    </FormItem>
                  </Col>
                  
                  {/* 移动船公司到货物信息区域 */}
                  <Col span={24}>
                    <FormItem label="船公司" field="shipCompany">
                      <Select 
                        placeholder="不指定" 
                        style={{ width: '100%' }}
                        value={formState.shipCompany}
                        onChange={(value) => handleFormChange('shipCompany', value)}
                        allowClear
                      >
                        <Option value="不指定">不指定</Option>
                        <Option value="MSC | 地中海">MSC | 地中海</Option>
                        <Option value="COSCO | 中远海运">COSCO | 中远海运</Option>
                        <Option value="MAERSK | 马士基">MAERSK | 马士基</Option>
                        <Option value="OOCL | 东方海外">OOCL | 东方海外</Option>
                        <Option value="CMA | 达飞轮船">CMA | 达飞轮船</Option>
                      </Select>
                    </FormItem>
                  </Col>
                  
                  {/* 移动备注到货物信息区域 */}
                  <Col span={24}>
                    <FormItem label="备注" field="remark">
                      <Input.TextArea 
                        placeholder="请输入备注信息" 
                        value={formState.remark}
                        onChange={(value) => handleFormChange('remark', value)}
                        style={{ minHeight: '60px' }}
                      />
                    </FormItem>
                  </Col>
                </Row>
              </div>
              
              <div className="border rounded p-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-blue-600 font-bold border-l-4 border-blue-600 pl-2">箱型箱量</div>
                  {containerList.length < 5 && (
                    <Button type="text" className="text-blue-600" icon={<IconPlus />} onClick={addContainerItem}>
                      添加箱型
                    </Button>
                  )}
                </div>
                
                {containerList.map((container, index) => (
                  <Row gutter={[16, 16]} key={container.id} className="mb-3">
                    <Col span={15}>
                      <FormItem label={index === 0 ? "箱型" : ""} rules={[{ required: true, message: '箱型必填' }]}>
                        <Select 
                          placeholder="请选择" 
                          style={{ width: '100%' }}
                          value={container.type}
                          onChange={(value) => updateContainerItem(container.id, 'type', value)}
                        >
                          {['20GP', '40GP', '40HC', '45HC', '20NOR', '40NOR'].map(boxType => (
                            <Option 
                              key={boxType} 
                              value={boxType} 
                              disabled={selectedContainerTypes.includes(boxType) && container.type !== boxType}
                            >
                              {boxType}
                            </Option>
                          ))}
                        </Select>
                      </FormItem>
                    </Col>
                    
                    <Col span={7}>
                      <FormItem label={index === 0 ? "数量" : ""} rules={[{ required: true, message: '箱量必填' }]}>
                        <Input 
                          type="number" 
                          placeholder="请输入数量" 
                          min={1} 
                          value={String(container.count)}
                          onChange={(value) => updateContainerItem(container.id, 'count', Number(value) || 1)}
                        />
                      </FormItem>
                    </Col>
                    
                    <Col span={2} className="flex items-center">
                      {index === 0 ? (
                        <div style={{ height: '32px' }}></div>
                      ) : (
                        <Button 
                          type="text" 
                          icon={<IconMinus />} 
                          onClick={() => removeContainerItem(container.id)}
                          className="text-red-500"
                        />
                      )}
                    </Col>
                  </Row>
                ))}
              </div>
            </Col>
          </Row>
          
          {/* 下半部分：匹配运价模块 */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <div className="text-blue-600 font-bold border-l-4 border-blue-600 pl-2">匹配运价</div>
              <Button 
                type="primary" 
                onClick={handleQueryRates}
                loading={isQuerying}
                disabled={isQuerying}
              >
                {isQuerying ? '查询中...' : '查询匹配运价'}
              </Button>
            </div>
            
            {/* 干线运价模块 - 仅在勾选干线价格时显示 */}
            {formState.mainlineChecked && (
              <div className="mb-6">
                <div className="text-gray-800 font-medium mb-4">干线运价</div>
                {!hasQueriedRates ? (
                  <div className="text-center py-8 border border-gray-200 rounded bg-gray-50">
                    <p className="text-gray-500">请点击"查询匹配运价"按钮获取运价信息</p>
                  </div>
                ) : mainlineRates.length > 0 ? (
                  <div className="space-y-4">
                    {mainlineRates.map((rate) => (
                      <Card key={rate.id} className="border border-gray-200">
                        <div className="flex items-start gap-4">
                          {/* 选择框 */}
                          <div className="mt-2">
                            <Radio
                              checked={selectedMainlineRate === rate.id.toString()}
                              onChange={() => setSelectedMainlineRate(rate.id.toString())}
                            />
                          </div>
                          
                          {/* 运价内容 */}
                          <div className="flex-1">
                            {/* 基本信息 */}
                            <div className="flex items-center gap-4 mb-4">
                              <span className="font-medium text-blue-600">运价编号：{rate.certNo || 'M' + String(rate.id).padStart(3, '0')}</span>
                              <span className="font-medium">船公司：{rate.shipCompany}</span>
                              <span>有效期：{rate.validPeriod.join(' ~ ')}</span>
                              <span>直达/中转：{rate.transitType}</span>
                              <span>航程：{rate.transitTime}</span>
                            </div>
                            
                            {/* 免用箱免堆存 */}
                            <div className="flex gap-4 mb-4 text-sm text-gray-600">
                              <span>免用箱：{rate.freeBox}</span>
                              <span>免堆存：{rate.freeStorage}</span>
                            </div>
                            
                            {/* 费用明细表格 */}
                            {renderRateTable(rate.rateItems, getAvailableContainerTypes())}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 border border-gray-200 rounded bg-gray-50">
                    <p className="text-gray-500">暂无干线运价方案</p>
                  </div>
                )}
              </div>
            )}
            
            {/* 港前运价模块 - 仅在勾选港前价格时显示 */}
            {formState.precarriageChecked && (
              <div className="mb-6">
                <div className="text-gray-800 font-medium mb-4">港前运价</div>
                {!hasQueriedRates ? (
                  <div className="text-center py-8 border border-gray-200 rounded bg-gray-50">
                    <p className="text-gray-500">请点击"查询匹配运价"按钮获取运价信息</p>
                  </div>
                ) : precarriageRates.length > 0 ? (
                  <div className="space-y-4">
                    {precarriageRates.map((rate) => (
                      <Card key={rate.id} className="border border-gray-200">
                        <div className="flex items-start gap-4">
                          {/* 选择框 */}
                          <div className="mt-2">
                            <Radio
                              checked={selectedPrecarriageRate === rate.id.toString()}
                              onChange={() => setSelectedPrecarriageRate(rate.id.toString())}
                            />
                          </div>
                          
                          {/* 运价内容 */}
                          <div className="flex-1">
                            {/* 基本信息 */}
                            <div className="flex items-center gap-4 mb-4">
                              <span className="font-medium text-blue-600">运价编号：{rate.certNo || 'P' + String(rate.id).padStart(3, '0')}</span>
                              <span className="font-medium">类型：{rate.type}</span>
                              {rate.subType && <span>子类型：{rate.subType}</span>}
                              <span>供应商：{rate.vendor}</span>
                              <span>有效期：{rate.validPeriod.join(' ~ ')}</span>
                            </div>
                            
                            {/* 费用明细表格 */}
                            {renderRateTable(rate.rateItems, getAvailableContainerTypes())}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 border border-gray-200 rounded bg-gray-50">
                    <p className="text-gray-500">暂无港前运价方案</p>
                  </div>
                )}
              </div>
            )}
            
            {/* 尾程运价模块 - 仅在勾选尾程价格时显示 */}
            {formState.lastmileChecked && (
              <div className="mb-6">
                <div className="text-gray-800 font-medium mb-4">尾程运价</div>
                {!hasQueriedRates ? (
                  <div className="text-center py-8 border border-gray-200 rounded bg-gray-50">
                    <p className="text-gray-500">请点击"查询匹配运价"按钮获取运价信息</p>
                  </div>
                ) : oncarriageRates.length > 0 ? (
                  <div className="space-y-4">
                    {oncarriageRates.map((rate) => (
                      <Card key={rate.id} className="border border-gray-200">
                        <div className="flex items-start gap-4">
                          {/* 选择框 */}
                          <div className="mt-2">
                            <Radio
                              checked={selectedOncarriageRate === rate.id.toString()}
                              onChange={() => setSelectedOncarriageRate(rate.id.toString())}
                            />
                          </div>
                          
                          {/* 运价内容 */}
                          <div className="flex-1">
                            {/* 基本信息 */}
                            <div className="flex items-center gap-4 mb-4">
                              <span className="font-medium text-blue-600">运价编号：{rate.certNo || 'O' + String(rate.id).padStart(3, '0')}</span>
                              <span className="font-medium">代理名称：{rate.agentName}</span>
                              <span>有效期：{rate.validPeriod.join(' ~ ')}</span>
                            </div>
                            
                            {/* 费用明细表格 */}
                            {renderRateTable(rate.rateItems, getAvailableContainerTypes())}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 border border-gray-200 rounded bg-gray-50">
                    <p className="text-gray-500">暂无尾程运价方案</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>
      </Form>



      {/* 装箱门点AI识别弹窗 */}
      <Modal
        title="AI智能识别地址"
        visible={loadingPointAiModalVisible}
        onCancel={closeLoadingPointAiModal}
        footer={[
          <Button key="cancel" onClick={closeLoadingPointAiModal}>取消</Button>,
          <Button key="recognize" type="primary" onClick={handleLoadingPointAiRecognize}>识别</Button>
        ]}
      >
        <div className="p-4">
          <p className="mb-2 text-gray-500">请将地址信息粘贴到下方文本框中：</p>
          <Input.TextArea
            placeholder="例如：浙江省杭州市萧山区新塘街道萧山经济技术开发区红垦路535号"
            style={{ minHeight: '120px' }}
            value={loadingPointAddressText}
            onChange={setLoadingPointAddressText}
          />
          <div className="mt-4 p-3 bg-gray-50 rounded">
            <p className="text-sm text-gray-500">提示：系统将自动解析省市区街道信息，详细地址将填入详细地址栏</p>
          </div>
        </div>
      </Modal>

      {/* 尾程送货地址AI识别弹窗 */}
      <Modal
        title="AI智能识别地址"
        visible={deliveryAiModalVisible}
        onCancel={closeDeliveryAiModal}
        footer={[
          <Button key="cancel" onClick={closeDeliveryAiModal}>取消</Button>,
          <Button key="recognize" type="primary" onClick={handleDeliveryAiRecognize}>识别</Button>
        ]}
      >
        <div className="p-4">
          <p className="mb-2 text-gray-500">请将美国地址信息粘贴到下方文本框中：</p>
          <Input.TextArea
            placeholder="例如：Ontario, CA 91761 ONT8 或 Los Angeles, CA 90001"
            style={{ minHeight: '120px' }}
            value={deliveryAddressText}
            onChange={setDeliveryAddressText}
          />
          <div className="mt-4 p-3 bg-gray-50 rounded">
            <p className="text-sm text-gray-500 mb-2">识别规则：</p>
            <ul className="text-sm text-gray-500 list-disc pl-5">
              <li>如包含亚马逊仓库代码(ONT8/BFI4等)，将自动设置为亚马逊仓库类型</li>
              <li>如包含易仓代码(LAX203/ATL205等)，将自动设置为易仓类型</li>
              <li>其他情况将设置为第三方地址，并解析地址和邮编</li>
            </ul>
          </div>
        </div>
      </Modal>

      {/* 运价不完整提示弹窗 */}
      <Modal
        title="运价不完整提示"
        visible={incompleteModalVisible}
        onOk={() => {
          setIncompleteModalVisible(false);
          setExportModalVisible(true);
        }}
        onCancel={() => setIncompleteModalVisible(false)}
        okText="确认"
        cancelText="取消"
      >
        <div className="space-y-4">
          <p>当前运价尚不完整，存在以下运价信息缺失：</p>
          <ul className="list-disc list-inside space-y-1">
            {checkRateCompleteness().map((item, index) => (
              <li key={index} className="text-red-500">{item}</li>
            ))}
          </ul>
          <p>是否仅导出已有的运价？</p>
        </div>
      </Modal>

      {/* 导出运价弹窗 */}
      <Modal
        title="导出运价"
        visible={exportModalVisible}
        onCancel={() => setExportModalVisible(false)}
        footer={null}
        style={{ width: 600 }}
      >
        <div className="space-y-6">
          {/* 已选择的运价方案 */}
          <div>
            <h4 className="text-lg font-medium mb-4">已选择的运价方案</h4>
            <div className="space-y-2 bg-gray-50 p-4 rounded">
              {selectedMainlineRate && mainlineRates.find(r => r.id.toString() === selectedMainlineRate) && (
                <div className="flex justify-between">
                  <span>干线运价：{mainlineRates.find(r => r.id.toString() === selectedMainlineRate)?.certNo || 'M' + selectedMainlineRate.padStart(3, '0')} - {mainlineRates.find(r => r.id.toString() === selectedMainlineRate)?.shipCompany}</span>
                  <Tag color="green">已选择</Tag>
                </div>
              )}
              {selectedPrecarriageRate && precarriageRates.find(r => r.id.toString() === selectedPrecarriageRate) && (
                <div className="flex justify-between">
                  <span>港前运价：{precarriageRates.find(r => r.id.toString() === selectedPrecarriageRate)?.certNo || 'P' + selectedPrecarriageRate.padStart(3, '0')} - {precarriageRates.find(r => r.id.toString() === selectedPrecarriageRate)?.vendor}</span>
                  <Tag color="green">已选择</Tag>
                </div>
              )}
              {selectedOncarriageRate && oncarriageRates.find(r => r.id.toString() === selectedOncarriageRate) && (
                <div className="flex justify-between">
                  <span>尾程运价：{oncarriageRates.find(r => r.id.toString() === selectedOncarriageRate)?.certNo || 'O' + selectedOncarriageRate.padStart(3, '0')} - {oncarriageRates.find(r => r.id.toString() === selectedOncarriageRate)?.agentName}</span>
                  <Tag color="green">已选择</Tag>
                </div>
              )}
              {!selectedMainlineRate && !selectedPrecarriageRate && !selectedOncarriageRate && (
                <div className="text-gray-500 text-center">暂未选择任何运价方案</div>
              )}
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex justify-center gap-4">
            <Button
              type="primary"
              icon={<IconCopy />}
              onClick={generateQuotationText}
              size="large"
            >
              复制快捷询价文本
            </Button>
            <Button
              type="primary"
              icon={<IconPrinter />}
              onClick={generatePDF}
              size="large"
            >
              打印询价单文件
            </Button>
          </div>
        </div>
      </Modal>

      {/* 全局AI识别弹窗 */}
      <Modal
        title="AI识别"
        visible={globalAiModalVisible}
        onCancel={() => {
          setGlobalAiModalVisible(false);
          setGlobalAiText('');
        }}
        footer={
          <div className="flex justify-end space-x-2">
            <Button
              onClick={() => {
                setGlobalAiModalVisible(false);
                setGlobalAiText('');
              }}
              disabled={globalAiLoading}
            >
              取消
            </Button>
            <Button
              type="primary"
              onClick={handleGlobalAiRecognition}
              loading={globalAiLoading}
            >
              确认
            </Button>
          </div>
        }
        style={{ width: 600 }}
      >
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-3">
              请粘贴需要识别的文本内容，AI将自动提取其中的物流信息并填充到相应字段中。
            </p>
            <p className="text-xs text-gray-500 mb-4">
              支持识别：港口信息、船公司、箱型箱量、重量、直达/中转、航线、货物类型、服务条款等信息
            </p>
            <TextArea
              value={globalAiText}
              onChange={(value) => setGlobalAiText(value)}
              placeholder="请粘贴需要识别的文本内容，例如：
从 CNSHA | Shanghai 到 USLAX | Los Angeles
船公司：马士基
箱型：2x20GP + 1x40HC
重量：1200 KGS
直达航线
服务条款：DDP
货物类型：普货"
              rows={12}
              disabled={globalAiLoading}
            />
          </div>
          {globalAiLoading && (
            <div className="text-center py-4">
              <div className="text-blue-600">AI正在识别中，请稍候...</div>
            </div>
          )}
        </div>
      </Modal>

      {/* 快捷询价文本弹窗 */}
      <Modal
        title="快捷询价文本"
        visible={copyTextModalVisible}
        onCancel={() => setCopyTextModalVisible(false)}
        footer={
          <div className="flex justify-end space-x-2">
            <Button onClick={() => setCopyTextModalVisible(false)}>
              关闭
            </Button>
            <Button type="primary" icon={<IconCopy />} onClick={copyToClipboard}>
              复制文本
            </Button>
          </div>
        }
        style={{ width: 700 }}
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            以下是根据您选择的运价方案生成的询价文本，您可以复制后发送给客户：
          </p>
          <TextArea
            value={quotationText}
            readOnly
            rows={15}
            style={{ fontFamily: 'monospace' }}
          />
        </div>
      </Modal>

      {/* PDF预览弹窗 */}
      <Modal
        title="询价单预览"
        visible={pdfPreviewVisible}
        onCancel={() => setPdfPreviewVisible(false)}
        footer={
          <div className="flex justify-end space-x-2">
            <Button onClick={() => setPdfPreviewVisible(false)}>
              关闭
            </Button>
            <Button type="primary" icon={<IconDownload />}>
              下载PDF
            </Button>
          </div>
        }
        style={{ width: 900, top: 20 }}
      >
        <div className="space-y-4" style={{ height: '600px', overflow: 'auto' }}>
          {/* PDF预览内容 */}
          <div className="bg-white p-8 shadow-sm border" style={{ fontFamily: 'SimSun, serif' }}>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2">询价单</h1>
              <p className="text-gray-600">Inquiry</p>
            </div>

            {/* 基本信息 */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 pb-2 border-b">基本信息</h3>
              <Row gutter={[16, 8]}>
                <Col span={8}>询价编号：{formState.inquiryNo || 'INQ' + Date.now()}</Col>
                <Col span={8}>委托单位：{formState.clientType === '正式客户' ? formState.clientCompany : formState.clientName}</Col>
                <Col span={8}>货盘性质：{formState.cargoNature}</Col>
                <Col span={8}>货好时间：{formState.cargoReadyTime}</Col>
                <Col span={8}>服务条款：{formState.serviceTerms}</Col>
              </Row>
            </div>

            {/* 货物信息 */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 pb-2 border-b">货物信息</h3>
              <Row gutter={[16, 8]}>
                <Col span={8}>起运港：{formState.departurePort}</Col>
                <Col span={8}>目的港：{formState.dischargePort}</Col>
                <Col span={8}>船公司：{formState.shipCompany}</Col>
                <Col span={8}>航线：{formState.route}</Col>
                <Col span={8}>直达/中转：{formState.transitType}</Col>
                {formState.weight && <Col span={8}>重量：{formState.weight} KGS</Col>}
              </Row>
            </div>

            {/* 箱型箱量 */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 pb-2 border-b">箱型箱量</h3>
              <div className="grid grid-cols-3 gap-4">
                {containerList.map(container => (
                  <div key={container.id} className="border p-3 text-center">
                    <div className="font-medium">{container.type}</div>
                    <div className="text-xl font-bold text-blue-600">{container.count} 箱</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 运价明细 - 后续步骤实现 */}
            <div className="text-center py-8 text-gray-500">
              运价明细部分将在后续步骤完善
            </div>
          </div>
        </div>
      </Modal>
    </ControlTowerSaasLayout>
  );
};

export default CreateFclInquiry; 