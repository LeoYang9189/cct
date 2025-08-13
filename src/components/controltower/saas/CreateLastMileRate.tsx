import React, { useState } from 'react';
import { 
  Card, 
  Breadcrumb, 
  Typography, 
  Button, 
  Space, 
  Input, 
  Select, 
  Form, 
  Grid, 
  Radio,
  DatePicker,
  Modal,
  Message,
  Table,
  Switch
} from '@arco-design/web-react';
import { IconSave, IconDelete, IconRobot, IconPlus, IconMinus, IconSettings, IconUpload } from '@arco-design/web-react/icon';
import { useNavigate } from 'react-router-dom';
import ControlTowerSaasLayout from "./ControlTowerSaasLayout";
import './CreateFclInquiry.css'; // 复用已有的CSS

const { Title } = Typography;
const { Row, Col } = Grid;
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const RangePicker = DatePicker.RangePicker;

// 选项类型定义
interface OptionItem {
  value: string;
  label: string;
}

// 州数据
const stateOptions: OptionItem[] = [
  { value: 'CA', label: 'California (CA)' },
  { value: 'TX', label: 'Texas (TX)' },
  { value: 'FL', label: 'Florida (FL)' },
  { value: 'NY', label: 'New York (NY)' },
  { value: 'PA', label: 'Pennsylvania (PA)' },
  { value: 'IL', label: 'Illinois (IL)' },
  { value: 'OH', label: 'Ohio (OH)' },
  { value: 'GA', label: 'Georgia (GA)' },
  { value: 'NC', label: 'North Carolina (NC)' },
  { value: 'MI', label: 'Michigan (MI)' },
  { value: 'WA', label: 'Washington (WA)' },
  { value: 'AZ', label: 'Arizona (AZ)' },
  { value: 'MA', label: 'Massachusetts (MA)' },
  { value: 'TN', label: 'Tennessee (TN)' },
  { value: 'IN', label: 'Indiana (IN)' },
  { value: 'MD', label: 'Maryland (MD)' },
  { value: 'MO', label: 'Missouri (MO)' },
  { value: 'WI', label: 'Wisconsin (WI)' },
  { value: 'CO', label: 'Colorado (CO)' },
  { value: 'MN', label: 'Minnesota (MN)' }
];

// 省/大城市数据 (按州分组)
const provinceOptions: Record<string, OptionItem[]> = {
  'CA': [
    { value: 'Los Angeles County', label: 'Los Angeles County' },
    { value: 'San Diego County', label: 'San Diego County' },
    { value: 'Orange County', label: 'Orange County' },
    { value: 'Riverside County', label: 'Riverside County' },
    { value: 'San Bernardino County', label: 'San Bernardino County' },
    { value: 'Santa Clara County', label: 'Santa Clara County' },
    { value: 'Alameda County', label: 'Alameda County' },
    { value: 'Sacramento County', label: 'Sacramento County' },
    { value: 'Contra Costa County', label: 'Contra Costa County' },
    { value: 'Fresno County', label: 'Fresno County' }
  ],
  'TX': [
    { value: 'Harris County', label: 'Harris County' },
    { value: 'Dallas County', label: 'Dallas County' },
    { value: 'Tarrant County', label: 'Tarrant County' },
    { value: 'Bexar County', label: 'Bexar County' },
    { value: 'Travis County', label: 'Travis County' },
    { value: 'Collin County', label: 'Collin County' },
    { value: 'Hidalgo County', label: 'Hidalgo County' },
    { value: 'Fort Bend County', label: 'Fort Bend County' }
  ],
  'FL': [
    { value: 'Miami-Dade County', label: 'Miami-Dade County' },
    { value: 'Broward County', label: 'Broward County' },
    { value: 'Palm Beach County', label: 'Palm Beach County' },
    { value: 'Hillsborough County', label: 'Hillsborough County' },
    { value: 'Orange County', label: 'Orange County' },
    { value: 'Pinellas County', label: 'Pinellas County' },
    { value: 'Duval County', label: 'Duval County' }
  ],
  'NY': [
    { value: 'New York County', label: 'New York County (Manhattan)' },
    { value: 'Kings County', label: 'Kings County (Brooklyn)' },
    { value: 'Queens County', label: 'Queens County' },
    { value: 'Bronx County', label: 'Bronx County' },
    { value: 'Richmond County', label: 'Richmond County (Staten Island)' },
    { value: 'Nassau County', label: 'Nassau County' },
    { value: 'Suffolk County', label: 'Suffolk County' },
    { value: 'Westchester County', label: 'Westchester County' }
  ],
  'WA': [
    { value: 'King County', label: 'King County' },
    { value: 'Pierce County', label: 'Pierce County' },
    { value: 'Snohomish County', label: 'Snohomish County' },
    { value: 'Spokane County', label: 'Spokane County' },
    { value: 'Clark County', label: 'Clark County' }
  ],
  'GA': [
    { value: 'Fulton County', label: 'Fulton County' },
    { value: 'Gwinnett County', label: 'Gwinnett County' },
    { value: 'Dekalb County', label: 'Dekalb County' },
    { value: 'Cobb County', label: 'Cobb County' },
    { value: 'Clayton County', label: 'Clayton County' }
  ]
};

// 邮编数据库 (邮编 -> 地址信息映射)
const zipCodeDatabase: Record<string, {state: string; province: string; region: string}> = {
  // 加利福尼亚州
  '90210': { state: 'CA', province: 'Los Angeles County', region: 'Beverly Hills' },
  '90401': { state: 'CA', province: 'Los Angeles County', region: 'Santa Monica' },
  '90001': { state: 'CA', province: 'Los Angeles County', region: 'Los Angeles' },
  '90028': { state: 'CA', province: 'Los Angeles County', region: 'Hollywood' },
  '92101': { state: 'CA', province: 'San Diego County', region: 'San Diego' },
  '92037': { state: 'CA', province: 'San Diego County', region: 'La Jolla' },
  '92110': { state: 'CA', province: 'San Diego County', region: 'Mission Bay' },
  '92019': { state: 'CA', province: 'San Diego County', region: 'El Cajon' },
  '92627': { state: 'CA', province: 'Orange County', region: 'Costa Mesa' },
  '92806': { state: 'CA', province: 'Orange County', region: 'Anaheim' },
  '92602': { state: 'CA', province: 'Orange County', region: 'Irvine' },
  '92648': { state: 'CA', province: 'Orange County', region: 'Huntington Beach' },
  '91761': { state: 'CA', province: 'San Bernardino County', region: 'Ontario' },
  '95014': { state: 'CA', province: 'Santa Clara County', region: 'Cupertino' },
  '94105': { state: 'CA', province: 'San Francisco County', region: 'San Francisco' },
  
  // 纽约州
  '10001': { state: 'NY', province: 'New York County', region: 'Manhattan' },
  '10021': { state: 'NY', province: 'New York County', region: 'Upper East Side' },
  '11201': { state: 'NY', province: 'Kings County', region: 'Brooklyn Heights' },
  '11101': { state: 'NY', province: 'Queens County', region: 'Long Island City' },
  '10451': { state: 'NY', province: 'Bronx County', region: 'South Bronx' },
  
  // 德克萨斯州
  '77001': { state: 'TX', province: 'Harris County', region: 'Houston' },
  '77002': { state: 'TX', province: 'Harris County', region: 'Downtown Houston' },
  '75201': { state: 'TX', province: 'Dallas County', region: 'Dallas' },
  '75202': { state: 'TX', province: 'Dallas County', region: 'Downtown Dallas' },
  '78701': { state: 'TX', province: 'Travis County', region: 'Austin' },
  
  // 佛罗里达州
  '33101': { state: 'FL', province: 'Miami-Dade County', region: 'Miami' },
  '33139': { state: 'FL', province: 'Miami-Dade County', region: 'Miami Beach' },
  '33156': { state: 'FL', province: 'Miami-Dade County', region: 'Kendall' },
  '32801': { state: 'FL', province: 'Orange County', region: 'Orlando' },
  
  // 华盛顿州
  '98101': { state: 'WA', province: 'King County', region: 'Seattle' },
  '98004': { state: 'WA', province: 'King County', region: 'Bellevue' },
  '98032': { state: 'WA', province: 'King County', region: 'Kent' },
  '98055': { state: 'WA', province: 'King County', region: 'Renton' },
  
  // 乔治亚州
  '30309': { state: 'GA', province: 'Fulton County', region: 'Atlanta' },
  '30328': { state: 'GA', province: 'Fulton County', region: 'Sandy Springs' },
  '30075': { state: 'GA', province: 'Fulton County', region: 'Roswell' }
};

// 区域/城市数据 (按省分组)
const regionOptions: Record<string, OptionItem[]> = {
  'Los Angeles County': [
    { value: 'Los Angeles', label: 'Los Angeles' },
    { value: 'Long Beach', label: 'Long Beach' },
    { value: 'Glendale', label: 'Glendale' },
    { value: 'Santa Monica', label: 'Santa Monica' },
    { value: 'Pasadena', label: 'Pasadena' },
    { value: 'Torrance', label: 'Torrance' },
    { value: 'Pomona', label: 'Pomona' },
    { value: 'El Monte', label: 'El Monte' },
    { value: 'Downey', label: 'Downey' },
    { value: 'Inglewood', label: 'Inglewood' }
  ],
  'San Diego County': [
    { value: 'San Diego', label: 'San Diego' },
    { value: 'Chula Vista', label: 'Chula Vista' },
    { value: 'Oceanside', label: 'Oceanside' },
    { value: 'Escondido', label: 'Escondido' },
    { value: 'Carlsbad', label: 'Carlsbad' },
    { value: 'El Cajon', label: 'El Cajon' },
    { value: 'Vista', label: 'Vista' }
  ],
  'Orange County': [
    { value: 'Anaheim', label: 'Anaheim' },
    { value: 'Santa Ana', label: 'Santa Ana' },
    { value: 'Irvine', label: 'Irvine' },
    { value: 'Huntington Beach', label: 'Huntington Beach' },
    { value: 'Garden Grove', label: 'Garden Grove' },
    { value: 'Orange', label: 'Orange' },
    { value: 'Fullerton', label: 'Fullerton' },
    { value: 'Costa Mesa', label: 'Costa Mesa' }
  ],
  'Harris County': [
    { value: 'Houston', label: 'Houston' },
    { value: 'Pasadena', label: 'Pasadena' },
    { value: 'Baytown', label: 'Baytown' },
    { value: 'Pearland', label: 'Pearland' },
    { value: 'League City', label: 'League City' }
  ],
  'Dallas County': [
    { value: 'Dallas', label: 'Dallas' },
    { value: 'Irving', label: 'Irving' },
    { value: 'Garland', label: 'Garland' },
    { value: 'Mesquite', label: 'Mesquite' },
    { value: 'Richardson', label: 'Richardson' },
    { value: 'Carrollton', label: 'Carrollton' }
  ],
  'King County': [
    { value: 'Seattle', label: 'Seattle' },
    { value: 'Bellevue', label: 'Bellevue' },
    { value: 'Kent', label: 'Kent' },
    { value: 'Renton', label: 'Renton' },
    { value: 'Federal Way', label: 'Federal Way' },
    { value: 'Auburn', label: 'Auburn' }
  ],
  'Fulton County': [
    { value: 'Atlanta', label: 'Atlanta' },
    { value: 'Sandy Springs', label: 'Sandy Springs' },
    { value: 'Roswell', label: 'Roswell' },
    { value: 'Johns Creek', label: 'Johns Creek' },
    { value: 'Alpharetta', label: 'Alpharetta' }
  ]
};

// 配送地址项接口定义
interface DeliveryAddressItem {
  key: number;
  addressType: string;
  state: string;
  province: string;
  region: string;
  zipCode: string;
  warehouseCode: string;
}

// 集装箱运价项目接口
interface RateItem {
  key: number;
  feeName: string;
  currency: string;
  '20gp': string;
  '40gp': string;
  '40hc': string;
  '45hc': string;
  '40nor': string;
  specialNote: string;
}

// 非按箱型计费项目接口
interface NonContainerRateItem {
  key: number;
  feeName: string;
  currency: string;
  unit: string; // 计费单位
  price: string; // 单价
  specialNote: string;
}

// 目的港对应的码头选项 - 暂时未使用，保留供后续功能扩展使用
// @ts-ignore
const _terminalOptions: Record<string, { value: string; label: string }[]> = {
  'USLAX | LOS ANGELES': [
    { value: 'APM Terminals', label: 'APM Terminals' },
    { value: 'Everport Terminal', label: 'Everport Terminal' },
    { value: 'TraPac Terminal', label: 'TraPac Terminal' }
  ],
  'USNYC | NEW YORK': [
    { value: 'Maher Terminals', label: 'Maher Terminals' },
    { value: 'Port Newark Container', label: 'Port Newark Container' }
  ],
  'DEHAM | HAMBURG': [
    { value: 'HHLA Terminal', label: 'HHLA Terminal' },
    { value: 'Eurogate Container', label: 'Eurogate Container' }
  ],
  'NLRTM | ROTTERDAM': [
    { value: 'APM Terminals', label: 'APM Terminals' },
    { value: 'ECT Delta', label: 'ECT Delta' },
    { value: 'Rotterdam World Gateway', label: 'Rotterdam World Gateway' }
  ],
  'SGSIN | SINGAPORE': [
    { value: 'PSA Singapore', label: 'PSA Singapore' },
    { value: 'Tuas Terminal', label: 'Tuas Terminal' }
  ]
};

/**
 * 尾程运价表单组件
 */
const CreateLastMileRate: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [aiModalVisible, setAiModalVisible] = useState(false);
  const [addressText, setAddressText] = useState('');
  
  // 配送地址列表状态
  const [deliveryAddressList, setDeliveryAddressList] = useState<DeliveryAddressItem[]>([{
    key: 1,
    addressType: '第三方地址',
    state: '',
    province: '',
    region: '',
    zipCode: '',
    warehouseCode: ''
  }]);
  
  // 省级选项状态
  const [provincesForState, setProvincesForState] = useState<Record<number, any[]>>({});
  // 区域选项状态  
  const [regionsForProvince, setRegionsForProvince] = useState<Record<number, any[]>>({});

  // 保存表单状态
  const [formState, setFormState] = useState({
    code: 'LMR' + new Date().getTime().toString().slice(-8), // 生成一个基于时间戳的编号
    origins: [], // 改为数组存储多个目的港
    agentName: '',
    validDateRange: [],
    remark: ''
  });

  // 更新保存表单状态
  const handleFormChange = (key: string, value: any) => {
    setFormState({
      ...formState,
      [key]: value
    });
  };

  // 添加新配送地址
  const addDeliveryAddress = () => {
    const newKey = deliveryAddressList.length > 0 ? Math.max(...deliveryAddressList.map(addr => addr.key)) + 1 : 1;
    setDeliveryAddressList([...deliveryAddressList, {
      key: newKey,
      addressType: '第三方地址',
      state: '',
      province: '',
      region: '',
      zipCode: '',
      warehouseCode: ''
    }]);
  };

  // 移除配送地址
  const removeDeliveryAddress = (key: number) => {
    if (deliveryAddressList.length === 1) {
      Message.warning('至少需要保留一个配送地址');
      return;
    }
    const newList = deliveryAddressList.filter(addr => addr.key !== key);
    setDeliveryAddressList(newList);
  };

  // 更新配送地址字段
  const updateDeliveryAddressField = (key: number, field: string, value: string) => {
    const newList = deliveryAddressList.map(addr => {
      if (addr.key === key) {
        const updatedAddr = { ...addr, [field]: value };
        
        // 当输入邮编时，自动查找并填充地址信息
        if (field === 'zipCode' && value.length === 5 && zipCodeDatabase[value]) {
          const addressInfo = zipCodeDatabase[value];
          updatedAddr.state = addressInfo.state;
          updatedAddr.province = addressInfo.province;
          updatedAddr.region = addressInfo.region;
          
          // 设置级联选项
          if (provinceOptions[addressInfo.state]) {
            setProvincesForState(prev => ({ ...prev, [key]: provinceOptions[addressInfo.state] }));
          }
          if (regionOptions[addressInfo.province]) {
            setRegionsForProvince(prev => ({ ...prev, [key]: regionOptions[addressInfo.province] }));
          }
        }
        
        // 当选择州时，重置下级选项
        if (field === 'state') {
          updatedAddr.province = '';
          updatedAddr.region = '';
          
          // 更新省级选项
          if (value && provinceOptions[value]) {
            setProvincesForState(prev => ({ ...prev, [key]: provinceOptions[value] }));
          }
        }
        
        // 当选择省时，重置区域
        if (field === 'province') {
          updatedAddr.region = '';
          
          // 更新区域选项
          if (value && regionOptions[value]) {
            setRegionsForProvince(prev => ({ ...prev, [key]: regionOptions[value] }));
          }
        }

        // 如果修改了地址类型，重置相关字段
        if (field === 'addressType') {
          if (value !== '亚马逊仓库' && value !== '易仓') {
            updatedAddr.warehouseCode = '';
          }
          if (value === '第三方地址') {
            // 第三方地址清空仓库代码
            updatedAddr.warehouseCode = '';
          } else {
            // 仓库类型清空地址字段
            updatedAddr.state = '';
            updatedAddr.province = '';
            updatedAddr.region = '';
            updatedAddr.zipCode = '';
          }
        }
        
        return updatedAddr;
      }
      return addr;
    });
    
    setDeliveryAddressList(newList);
  };
  
  // 集装箱运价列表状态
  const [rateList, setRateList] = useState<RateItem[]>([
    {
      key: 1,
      feeName: '尾程配送费',
      currency: 'CNY',
      '20gp': '',
      '40gp': '',
      '40hc': '',
      '45hc': '',
      '40nor': '',
      specialNote: ''
    }
  ]);
  
  // 非按箱型计费列表状态
  const [nonContainerRateList, setNonContainerRateList] = useState<NonContainerRateItem[]>([
    {
      key: 1,
      feeName: '文件费',
      currency: 'CNY',
      unit: '票',
      price: '',
      specialNote: ''
    }
  ]);
  
  // 箱型设置状态
  const [boxTypeModalVisible, setBoxTypeModalVisible] = useState(false);
  // 箱型显示设置
  const [boxTypeVisibility, setBoxTypeVisibility] = useState({
    '20gp': true,
    '40gp': true,
    '40hc': true,
    '45hc': true,
    '40nor': true
  });

  // 处理表单提交
  const handleSubmit = () => {
    form.validate().then((values) => {
      // 验证配送地址是否完整
      let hasValidAddress = false;
      for (const addr of deliveryAddressList) {
        if (addr.addressType === '第三方地址') {
          if (addr.state && addr.province && addr.region && addr.zipCode) {
            hasValidAddress = true;
            break;
          }
        } else if (addr.addressType === '亚马逊仓库' || addr.addressType === '易仓') {
          if (addr.warehouseCode) {
            hasValidAddress = true;
            break;
          }
        }
      }
      
      if (!hasValidAddress) {
        Message.error('请至少完善一个配送地址的信息');
        return;
      }
      
      // 整合表单数据
      const formData = {
        ...formState,
        ...values,
        // 确保目的港是数组形式
        origins: Array.isArray(formState.origins) ? formState.origins : [formState.origins].filter(Boolean),
        deliveryAddressList,
        rateList,
        nonContainerRateList
      };
      
      console.log('表单数据:', formData);
      // 提交表单数据
      navigate('/controltower/saas/lastmile-rates');
    }).catch(error => {
      console.error('表单错误:', error);
    });
  };

  // 返回尾程运价列表页面
  const handleCancel = () => {
    navigate('/controltower/saas/lastmile-rates');
  };

  // 打开AI识别弹窗
  const openAiModal = () => {
    setAiModalVisible(true);
  };

  // 关闭AI识别弹窗
  const closeAiModal = () => {
    setAiModalVisible(false);
  };

  // 处理AI识别
  const handleAiRecognize = () => {
    // 模拟识别过程
    setTimeout(() => {
      if (addressText && deliveryAddressList.length > 0) {
        // 更新第一个配送地址
        const firstAddr = deliveryAddressList[0];
        let isWarehouse = false;
        let warehouseType = '';
        let warehouseCode = '';
        let state = '';
        let province = '';
        let region = '';
        let zipCode = '';
        
        // 检查是否包含仓库代码
        if (addressText.includes('ONT8') || addressText.includes('BFI4')) {
          isWarehouse = true;
          warehouseType = '亚马逊仓库';
          warehouseCode = addressText.includes('ONT8') ? 'ONT8' : 'BFI4';
        } else if (addressText.includes('LAX203') || addressText.includes('ATL205')) {
          isWarehouse = true;
          warehouseType = '易仓';
          warehouseCode = addressText.includes('LAX203') ? 'LAX203' : 'ATL205';
        }
        
        // 如果是仓库类型，只设置仓库相关信息
        if (isWarehouse) {
          updateDeliveryAddressField(firstAddr.key, 'addressType', warehouseType);
          updateDeliveryAddressField(firstAddr.key, 'warehouseCode', warehouseCode);
          Message.success(`已识别为${warehouseType}，代码：${warehouseCode}`);
        } else {
          // 尝试提取邮编（美国标准5位数字邮编）
          const zipMatch = addressText.match(/\b\d{5}\b/);
          if (zipMatch) {
            zipCode = zipMatch[0];
            
            // 首先尝试通过邮编数据库查找
            if (zipCodeDatabase[zipCode]) {
              const addressInfo = zipCodeDatabase[zipCode];
              state = addressInfo.state;
              province = addressInfo.province;
              region = addressInfo.region;
            }
          }
          
          // 如果邮编查找失败，再尝试文本匹配
          if (!state) {
            if (addressText.includes('CA')) {
              state = 'CA';
              if (addressText.includes('San Diego')) {
                province = 'San Diego County';
                region = 'San Diego';
              } else if (addressText.includes('Los Angeles')) {
                province = 'Los Angeles County';
                region = 'Los Angeles';
              } else if (addressText.includes('Ontario')) {
                province = 'San Bernardino County';
                region = 'Ontario';
              } else if (addressText.includes('Anaheim')) {
                province = 'Orange County';
                region = 'Anaheim';
              }
            } else if (addressText.includes('WA')) {
              state = 'WA';
              if (addressText.includes('Seattle')) {
                province = 'King County';
                region = 'Seattle';
              }
            } else if (addressText.includes('GA')) {
              state = 'GA';
              if (addressText.includes('Atlanta')) {
                province = 'Fulton County';
                region = 'Atlanta';
              }
            } else if (addressText.includes('TX')) {
              state = 'TX';
              if (addressText.includes('Houston')) {
                province = 'Harris County';
                region = 'Houston';
              } else if (addressText.includes('Dallas')) {
                province = 'Dallas County';
                region = 'Dallas';
              }
            }
          }
          
          // 设置识别的地址信息
          if (state || zipCode) {
            updateDeliveryAddressField(firstAddr.key, 'addressType', '第三方地址');
            
            // 优先设置邮编，因为邮编会自动触发地址填充
            if (zipCode) {
              updateDeliveryAddressField(firstAddr.key, 'zipCode', zipCode);
            }
            
            // 如果通过邮编没有找到完整信息，再手动设置
            if (!zipCodeDatabase[zipCode || '']) {
              if (state) {
                updateDeliveryAddressField(firstAddr.key, 'state', state);
              }
              if (province) {
                updateDeliveryAddressField(firstAddr.key, 'province', province);
              }
              if (region) {
                updateDeliveryAddressField(firstAddr.key, 'region', region);
              }
            }
            
            Message.success(zipCode && zipCodeDatabase[zipCode] ? 
              `已通过邮编 ${zipCode} 识别地址信息` : 
              '已识别地址信息');
          } else {
            Message.info('无法识别地址，请手动输入');
          }
        }
      }
      closeAiModal();
    }, 1000);
  };

  // 添加运价项目
  const addRateItem = () => {
    const newKey = rateList.length > 0 ? Math.max(...rateList.map(item => item.key)) + 1 : 1;
    setRateList([...rateList, {
      key: newKey,
      feeName: '码头附加费',
      currency: 'CNY',
      '20gp': '',
      '40gp': '',
      '40hc': '',
      '45hc': '',
      '40nor': '',
      specialNote: ''
    }]);
  };
  
  // 添加非按箱型计费项目
  const addNonContainerRateItem = () => {
    const newKey = nonContainerRateList.length > 0 ? Math.max(...nonContainerRateList.map(item => item.key)) + 1 : 1;
    setNonContainerRateList([...nonContainerRateList, {
      key: newKey,
      feeName: '清关费',
      currency: 'CNY',
      unit: '票',
      price: '',
      specialNote: ''
    }]);
  };
  
  // 删除运价项目
  const removeRateItem = (key: number) => {
    if (rateList.length === 1) {
      Message.warning('至少需要保留一个运价项目');
      return;
    }
    const newRateList = rateList.filter(item => item.key !== key);
    setRateList(newRateList);
  };
  
  // 删除非按箱型计费项目
  const removeNonContainerRateItem = (key: number) => {
    if (nonContainerRateList.length === 1) {
      Message.warning('至少需要保留一个计费项目');
      return;
    }
    const newRateList = nonContainerRateList.filter(item => item.key !== key);
    setNonContainerRateList(newRateList);
  };
  
  // 更新运价项目字段
  const updateRateItem = (key: number, field: string, value: string) => {
    const newRateList = rateList.map(item => {
      if (item.key === key) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setRateList(newRateList);
  };
  
  // 更新非按箱型计费项目字段
  const updateNonContainerRateItem = (key: number, field: string, value: string) => {
    const newRateList = nonContainerRateList.map(item => {
      if (item.key === key) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setNonContainerRateList(newRateList);
  };
  
  // 打开箱型设置弹窗
  const openBoxTypeModal = () => {
    setBoxTypeModalVisible(true);
  };
  
  // 关闭箱型设置弹窗
  const closeBoxTypeModal = () => {
    setBoxTypeModalVisible(false);
  };
  
  // 更新箱型显示状态
  const handleBoxTypeVisibilityChange = (boxType: string, visible: boolean) => {
    setBoxTypeVisibility(prev => ({
      ...prev,
      [boxType]: visible
    }));
  };
  
  // 重置箱型显示状态
  const resetBoxTypeVisibility = () => {
    setBoxTypeVisibility({
      '20gp': true,
      '40gp': true,
      '40hc': true,
      '45hc': true,
      '40nor': true
    });
  };

  return (
    <ControlTowerSaasLayout 
      menuSelectedKey="23" 
      breadcrumb={
        <Breadcrumb>
          <Breadcrumb.Item>门点服务管理</Breadcrumb.Item>
          <Breadcrumb.Item>尾程运价</Breadcrumb.Item>
          <Breadcrumb.Item>新增尾程运价</Breadcrumb.Item>
        </Breadcrumb>
      }
    >
      <Form form={form} layout="vertical" initialValues={formState} requiredSymbol={{ position: 'start' }}>
        <Card className="mb-4">
          <div className="flex justify-between items-center mb-4">
            <Title heading={5}>新增尾程运价</Title>
            <Space>
              <Button type="primary" icon={<IconSave />} onClick={handleSubmit}>保存草稿</Button>
              <Button type="primary" status="success" icon={<IconUpload />} onClick={handleSubmit}>直接上架</Button>
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
                    <FormItem label="尾程运价编号" field="code">
                      <Input placeholder="自动生成" value={formState.code} disabled />
                    </FormItem>
                  </Col>
                  
                  <Col span={24}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-gray-800 font-medium">配送地址选择</div>
                      <div className="flex items-center gap-2">
                        <Button 
                          type="outline" 
                          icon={<IconRobot />} 
                          onClick={openAiModal}
                          size="mini"
                        >
                          AI识别
                        </Button>
                        <Button 
                          type="primary" 
                          icon={<IconPlus />} 
                          size="mini"
                          onClick={addDeliveryAddress}
                        >
                          添加地址
                        </Button>
                      </div>
                    </div>
                    
                    {deliveryAddressList.map((addr, index) => (
                      <div key={addr.key} className="mb-4 border border-gray-200 rounded-lg p-3 bg-gray-50">
                        <div className="flex justify-between items-center mb-3">
                          <div className="text-sm text-gray-600 font-medium">配送地址 {index + 1}</div>
                          <Button 
                            type="text" 
                            icon={<IconMinus />} 
                            onClick={() => removeDeliveryAddress(addr.key)} 
                            size="small"
                            status="danger"
                            disabled={deliveryAddressList.length === 1}
                          />
                        </div>
                        
                        {/* 地址类型选择 */}
                        <Row gutter={[12, 8]} style={{ marginBottom: '12px' }}>
                          <Col span={24}>
                            <div className="text-xs text-gray-400 mb-1">配送地址类型</div>
                            <RadioGroup 
                              value={addr.addressType}
                              onChange={(value) => updateDeliveryAddressField(addr.key, 'addressType', value)}
                              size="small"
                            >
                              <Radio value="第三方地址">第三方地址</Radio>
                              <Radio value="亚马逊仓库">亚马逊仓库</Radio>
                              <Radio value="易仓">易仓</Radio>
                            </RadioGroup>
                          </Col>
                        </Row>
                        
                        {/* 第三方地址：邮编优先级联选择 */}
                        {addr.addressType === '第三方地址' && (
                          <>
                            <div className="text-xs text-gray-400 mb-1">地址选择</div>
                            <Row gutter={[12, 8]} style={{ marginBottom: '8px' }}>
                              <Col span={6}>
                                <Input 
                                  placeholder="邮编"
                                  value={addr.zipCode}
                                  onChange={(value) => updateDeliveryAddressField(addr.key, 'zipCode', value)}
                                  style={{ width: '100%' }}
                                  size="small"
                                  allowClear
                                  maxLength={5}
                                />
                                <div className="text-xs text-gray-400 mt-1">输入5位邮编自动填写</div>
                              </Col>
                              <Col span={6}>
                                <Select 
                                  placeholder="选择州"
                                  options={stateOptions}
                                  value={addr.state}
                                  onChange={(value) => updateDeliveryAddressField(addr.key, 'state', value)}
                                  style={{ width: '100%' }}
                                  size="small"
                                  showSearch
                                  filterOption={(inputValue, option) =>
                                    (option as any)?.label?.toLowerCase().includes(inputValue.toLowerCase()) || false
                                  }
                                  allowClear
                                />
                              </Col>
                              <Col span={6}>
                                <Select 
                                  placeholder="选择省/县"
                                  options={provincesForState[addr.key] || []}
                                  value={addr.province}
                                  onChange={(value) => updateDeliveryAddressField(addr.key, 'province', value)}
                                  style={{ width: '100%' }}
                                  size="small"
                                  disabled={!addr.state}
                                  showSearch
                                  filterOption={(inputValue, option) =>
                                    (option as any)?.label?.toLowerCase().includes(inputValue.toLowerCase()) || false
                                  }
                                  allowClear
                                />
                              </Col>
                              <Col span={6}>
                                <Select 
                                  placeholder="选择区域/城市"
                                  options={regionsForProvince[addr.key] || []}
                                  value={addr.region}
                                  onChange={(value) => updateDeliveryAddressField(addr.key, 'region', value)}
                                  style={{ width: '100%' }}
                                  size="small"
                                  disabled={!addr.province}
                                  showSearch
                                  filterOption={(inputValue, option) =>
                                    (option as any)?.label?.toLowerCase().includes(inputValue.toLowerCase()) || false
                                  }
                                  allowClear
                                />
                              </Col>
                            </Row>
                          </>
                        )}
                        
                        {/* 仓库地址：仓库代码输入 */}
                        {(addr.addressType === '亚马逊仓库' || addr.addressType === '易仓') && (
                          <Row gutter={[12, 8]}>
                            <Col span={24}>
                              <div className="text-xs text-gray-400 mb-1">仓库代码</div>
                              <Input 
                                placeholder={addr.addressType === '亚马逊仓库' ? "例如：ONT8" : "例如：LAX203"} 
                                value={addr.warehouseCode}
                                onChange={(value) => updateDeliveryAddressField(addr.key, 'warehouseCode', value)}
                                style={{ width: '100%' }}
                                size="small"
                                allowClear
                              />
                            </Col>
                          </Row>
                        )}
                      </div>
                    ))}
                  </Col>
                </Row>
              </div>
            </Col>
                    
            {/* 右侧区域：目的港、代理 */}
            <Col span={12}>
              <div className="border rounded p-4 mb-4">
                <div className="text-blue-600 font-bold border-l-4 border-blue-600 pl-2 mb-4">目的港信息</div>
                
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <FormItem label="目的港" field="origins" rules={[{ required: true, message: '请选择目的港' }]}>
                      <Select 
                        placeholder="请选择目的港（可多选）" 
                        style={{ width: '100%' }}
                        value={formState.origins}
                        onChange={(value) => handleFormChange('origins', value)}
                        allowClear
                        mode="multiple"
                        showSearch
                      >
                        <Option value="USLAX | LOS ANGELES">USLAX | LOS ANGELES</Option>
                        <Option value="USNYC | NEW YORK">USNYC | NEW YORK</Option>
                        <Option value="DEHAM | HAMBURG">DEHAM | HAMBURG</Option>
                        <Option value="NLRTM | ROTTERDAM">NLRTM | ROTTERDAM</Option>
                        <Option value="SGSIN | SINGAPORE">SGSIN | SINGAPORE</Option>
                      </Select>
                      <div className="mt-1 text-xs text-gray-400">提示: 可选择多个目的港，表示这些目的港到同一配送地址的运价相同</div>
                    </FormItem>
                  </Col>
                  
                  <Col span={24}>
                    <FormItem label="代理名称" field="agentName" rules={[{ required: true, message: '请选择代理名称' }]}>
                      <Select 
                        placeholder="请选择代理名称" 
                        style={{ width: '100%' }}
                        value={formState.agentName}
                        onChange={(value) => handleFormChange('agentName', value)}
                        allowClear
                      >
                        <Option value="XPO TRUCK LLC">XPO TRUCK LLC</Option>
                        <Option value="DRAYEASY INC">DRAYEASY INC</Option>
                        <Option value="AMERICAN FREIGHT SOLUTIONS">AMERICAN FREIGHT SOLUTIONS</Option>
                        <Option value="WEST COAST CARRIERS LLC">WEST COAST CARRIERS LLC</Option>
                        <Option value="EAGLE EXPRESS LOGISTICS">EAGLE EXPRESS LOGISTICS</Option>
                        <Option value="INTERMODAL TRANSPORT CO">INTERMODAL TRANSPORT CO</Option>
                      </Select>
                    </FormItem>
                  </Col>
                  
                  <Col span={24}>
                    <FormItem label="ETD" field="etd">
                      <DatePicker 
                        placeholder="请选择预计开船日" 
                        style={{ width: '100%' }}
                        onChange={(value) => handleFormChange('etd', value)}
                        allowClear
                      />
                    </FormItem>
                  </Col>
                  
                  <Col span={24}>
                    <FormItem label="ETA" field="eta">
                      <DatePicker 
                        placeholder="请选择预计到港日" 
                        style={{ width: '100%' }}
                        onChange={(value) => handleFormChange('eta', value)}
                        allowClear
                      />
                    </FormItem>
                  </Col>
                  
                  <Col span={24}>
                    <FormItem label="有效期" field="validDateRange" rules={[{ required: true, message: '请选择有效期' }]}>
                      <RangePicker 
                        style={{ width: '100%' }} 
                        onChange={(value) => handleFormChange('validDateRange', value)}
                        allowClear
                      />
                    </FormItem>
                  </Col>
                  
                  <Col span={24}>
                    <FormItem label="备注" field="remark">
                      <Input.TextArea 
                        placeholder="请输入备注信息" 
                        style={{ minHeight: '80px' }}
                        value={formState.remark}
                        onChange={(value) => handleFormChange('remark', value)}
                        allowClear
                      />
                    </FormItem>
                  </Col>
                </Row>
              </div>
            </Col>
            
            {/* 运价信息模块 - 占据整行 */}
            <Col span={24}>
              <div className="border rounded p-4 mb-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-blue-600 font-bold border-l-4 border-blue-600 pl-2">运价信息</div>
                </div>
                
                {/* 按箱型计费条目 */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-gray-700 font-medium">按箱型计费条目</div>
                    <Space>
                      <Button 
                        type="secondary" 
                        icon={<IconSettings />} 
                        size="small"
                        onClick={openBoxTypeModal}
                      >
                        设置箱型
                      </Button>
                      <Button 
                        type="primary" 
                        icon={<IconPlus />} 
                        size="small"
                        onClick={addRateItem}
                      >
                        增加条目
                      </Button>
                    </Space>
                  </div>
                  
                  <Table
                    borderCell={true}
                    columns={[
                      {
                        title: '操作',
                        width: 80,
                        render: (_, record: RateItem) => (
                          <Button 
                            type="text"
                            icon={<IconMinus />}
                            onClick={() => removeRateItem(record.key)}
                            size="mini"
                          />
                        )
                      },
                      {
                        title: '费用名称',
                        dataIndex: 'feeName',
                        width: 180,
                        render: (value: string, record: RateItem) => (
                          <Select
                            placeholder="请选择费用名称"
                            value={value}
                            onChange={val => updateRateItem(record.key, 'feeName', val)}
                            style={{ width: '100%' }}
                            allowClear
                          >
                            <Select.Option value="码头附加费">码头附加费</Select.Option>
                            <Select.Option value="送货费">送货费</Select.Option>
                            <Select.Option value="燃油附加费">燃油附加费</Select.Option>
                            <Select.Option value="车架分离">车架分离</Select.Option>
                          </Select>
                        )
                      },
                      {
                        title: '币种',
                        dataIndex: 'currency',
                        width: 120,
                        render: (value: string, record: RateItem) => (
                          <Select
                            placeholder="请选择币种"
                            value={value}
                            onChange={val => updateRateItem(record.key, 'currency', val)}
                            style={{ width: '100%' }}
                            allowClear
                          >
                            <Select.Option value="CNY">CNY</Select.Option>
                            <Select.Option value="USD">USD</Select.Option>
                            <Select.Option value="EUR">EUR</Select.Option>
                          </Select>
                        )
                      },
                      ...(boxTypeVisibility['20gp'] ? [{
                        title: '20GP',
                        dataIndex: '20gp',
                        width: 120,
                        render: (value: string, record: RateItem) => (
                        <Input 
                          placeholder="请输入运价" 
                            value={value}
                            onChange={val => updateRateItem(record.key, '20gp', val)}
                            allowClear
                          />
                        )
                      }] : []),
                      ...(boxTypeVisibility['40gp'] ? [{
                        title: '40GP',
                        dataIndex: '40gp',
                        width: 120,
                        render: (value: string, record: RateItem) => (
                        <Input 
                          placeholder="请输入运价" 
                            value={value}
                            onChange={val => updateRateItem(record.key, '40gp', val)}
                            allowClear
                          />
                        )
                      }] : []),
                      ...(boxTypeVisibility['40hc'] ? [{
                        title: '40HC',
                        dataIndex: '40hc',
                        width: 120,
                        render: (value: string, record: RateItem) => (
                        <Input 
                          placeholder="请输入运价" 
                            value={value}
                            onChange={val => updateRateItem(record.key, '40hc', val)}
                            allowClear
                          />
                        )
                      }] : []),
                      ...(boxTypeVisibility['45hc'] ? [{
                        title: '45HC',
                        dataIndex: '45hc',
                        width: 120,
                        render: (value: string, record: RateItem) => (
                        <Input 
                          placeholder="请输入运价" 
                            value={value}
                            onChange={val => updateRateItem(record.key, '45hc', val)}
                            allowClear
                          />
                        )
                      }] : []),
                      ...(boxTypeVisibility['40nor'] ? [{
                        title: '40NOR',
                        dataIndex: '40nor',
                        width: 120,
                        render: (value: string, record: RateItem) => (
                        <Input 
                          placeholder="请输入运价" 
                            value={value}
                            onChange={val => updateRateItem(record.key, '40nor', val)}
                            allowClear
                          />
                        )
                      }] : []),
                      {
                        title: '特殊备注',
                        dataIndex: 'specialNote',
                        width: 180,
                        render: (value: string, record: RateItem) => (
                          <Input 
                            placeholder="请输入特殊备注" 
                            value={value}
                            onChange={val => updateRateItem(record.key, 'specialNote', val)}
                            allowClear
                          />
                        )
                      }
                    ]}
                    data={rateList}
                    pagination={false}
                    rowKey="key"
                  />
                </div>
                
                {/* 非按箱型计费条目 */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-gray-700 font-medium">非按箱型计费条目</div>
                    <Button 
                      type="primary" 
                      icon={<IconPlus />} 
                      size="small"
                      onClick={addNonContainerRateItem}
                    >
                      增加条目
                    </Button>
                  </div>
                  
                  <Table
                    borderCell={true}
                    columns={[
                      {
                        title: '操作',
                        width: 80,
                        render: (_, record: NonContainerRateItem) => (
                          <Button 
                            type="text"
                            icon={<IconMinus />}
                            onClick={() => removeNonContainerRateItem(record.key)}
                            size="mini"
                          />
                        )
                      },
                      {
                        title: '费用名称',
                        dataIndex: 'feeName',
                        width: 180,
                        render: (value: string, record: NonContainerRateItem) => (
                          <Select
                            placeholder="请选择费用名称"
                            value={value}
                            onChange={val => updateNonContainerRateItem(record.key, 'feeName', val)}
                            style={{ width: '100%' }}
                            allowClear
                          >
                            <Select.Option value="清关费">清关费</Select.Option>
                            <Select.Option value="换单费">换单费</Select.Option>
                            <Select.Option value="ISF">ISF</Select.Option>
                            <Select.Option value="文件费">文件费</Select.Option>
                            <Select.Option value="待时费">待时费</Select.Option>
                            <Select.Option value="YARD">YARD</Select.Option>
                          </Select>
                        )
                      },
                      {
                        title: '币种',
                        dataIndex: 'currency',
                        width: 120,
                        render: (value: string, record: NonContainerRateItem) => (
                          <Select
                            placeholder="请选择币种"
                            value={value}
                            onChange={val => updateNonContainerRateItem(record.key, 'currency', val)}
                            style={{ width: '100%' }}
                            allowClear
                          >
                            <Select.Option value="CNY">CNY</Select.Option>
                            <Select.Option value="USD">USD</Select.Option>
                            <Select.Option value="EUR">EUR</Select.Option>
                          </Select>
                        )
                      },
                      {
                        title: '计费单位',
                        dataIndex: 'unit',
                        width: 120,
                        render: (value: string, record: NonContainerRateItem) => (
                          <Select
                            placeholder="请选择计费单位"
                            value={value}
                            onChange={val => updateNonContainerRateItem(record.key, 'unit', val)}
                            style={{ width: '100%' }}
                            allowClear
                          >
                            <Select.Option value="票">票</Select.Option>
                            <Select.Option value="单">单</Select.Option>
                            <Select.Option value="次">次</Select.Option>
                            <Select.Option value="天">天</Select.Option>
                            <Select.Option value="小时">小时</Select.Option>
                          </Select>
                        )
                      },
                      {
                        title: '单价',
                        dataIndex: 'price',
                        width: 120,
                        render: (value: string, record: NonContainerRateItem) => (
                          <Input 
                            placeholder="请输入单价" 
                            value={value}
                            onChange={val => updateNonContainerRateItem(record.key, 'price', val)}
                            allowClear
                          />
                        )
                      },
                      {
                        title: '特殊备注',
                        dataIndex: 'specialNote',
                        width: 180,
                        render: (value: string, record: NonContainerRateItem) => (
                          <Input 
                            placeholder="请输入特殊备注" 
                            value={value}
                            onChange={val => updateNonContainerRateItem(record.key, 'specialNote', val)}
                            allowClear
                          />
                        )
                      }
                    ]}
                    data={nonContainerRateList}
                    pagination={false}
                    rowKey="key"
                  />
                </div>
              </div>
            </Col>
          </Row>
        </Card>
      </Form>

      {/* AI识别地址弹窗 */}
      <Modal
        title="AI智能识别地址"
        visible={aiModalVisible}
        onCancel={closeAiModal}
        footer={[
          <Button key="cancel" onClick={closeAiModal}>取消</Button>,
          <Button key="recognize" type="primary" onClick={handleAiRecognize}>识别</Button>
        ]}
      >
        <div className="p-4">
          <p className="mb-2 text-gray-500">请将美国地址信息粘贴到下方文本框中（将更新第一个配送地址）：</p>
          <Input.TextArea
            placeholder="例如：Ontario, CA 91761 ONT8 或 Los Angeles, CA 90001"
            style={{ minHeight: '120px' }}
            value={addressText}
            onChange={setAddressText}
          />
          <div className="mt-4 p-3 bg-gray-50 rounded">
            <p className="text-sm text-gray-500 mb-2">识别规则：</p>
            <ul className="text-sm text-gray-500 list-disc pl-5">
              <li>如包含亚马逊仓库代码(ONT8/BFI4等)，将自动设置为亚马逊仓库类型</li>
              <li>如包含易仓代码(LAX203/ATL205等)，将自动设置为易仓类型</li>
              <li>如包含5位邮编，将优先通过邮编自动填写详细地址信息</li>
              <li>支持的邮编地区：加州、纽约、德州、佛州、华盛顿州、乔治亚州等</li>
              <li>其他情况将尝试文本匹配并设置为第三方地址</li>
            </ul>
          </div>
        </div>
      </Modal>

      {/* 箱型设置弹窗 */}
      <Modal
        title="设置箱型"
        visible={boxTypeModalVisible}
        onCancel={closeBoxTypeModal}
        footer={[
          <Button key="reset" onClick={resetBoxTypeVisibility} style={{ float: 'left' }}>重置</Button>,
          <Button key="cancel" onClick={closeBoxTypeModal}>取消</Button>,
          <Button key="apply" type="primary" onClick={closeBoxTypeModal}>确认</Button>
        ]}
        style={{ width: 500 }}
      >
        <div className="p-4">
          <div className="text-gray-500 mb-4">选择需要显示的箱型</div>
          <Space direction="vertical" style={{ width: '100%' }}>
            <div className="flex items-center justify-between p-2 border-b">
              <span>20GP</span>
              <Switch 
                checked={boxTypeVisibility['20gp']} 
                onChange={checked => handleBoxTypeVisibilityChange('20gp', checked)}
              />
            </div>
            <div className="flex items-center justify-between p-2 border-b">
              <span>40GP</span>
              <Switch 
                checked={boxTypeVisibility['40gp']} 
                onChange={checked => handleBoxTypeVisibilityChange('40gp', checked)}
              />
            </div>
            <div className="flex items-center justify-between p-2 border-b">
              <span>40HC</span>
              <Switch 
                checked={boxTypeVisibility['40hc']} 
                onChange={checked => handleBoxTypeVisibilityChange('40hc', checked)}
              />
            </div>
            <div className="flex items-center justify-between p-2 border-b">
              <span>45HC</span>
              <Switch 
                checked={boxTypeVisibility['45hc']} 
                onChange={checked => handleBoxTypeVisibilityChange('45hc', checked)}
              />
            </div>
            <div className="flex items-center justify-between p-2 border-b">
              <span>40NOR</span>
              <Switch 
                checked={boxTypeVisibility['40nor']} 
                onChange={checked => handleBoxTypeVisibilityChange('40nor', checked)}
              />
            </div>
          </Space>
        </div>
      </Modal>
    </ControlTowerSaasLayout>
  );
};

export default CreateLastMileRate; 