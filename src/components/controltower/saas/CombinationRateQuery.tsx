import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Breadcrumb, 
  Button, 
  Space, 
  Input, 
  Form, 
  Grid, 
  Checkbox,
  Radio, 
  Table,
  Typography,
  Select,
  Message,
  Steps
} from '@arco-design/web-react';
import { IconDownload, IconArrowLeft, IconCopy } from '@arco-design/web-react/icon';
import { useNavigate, useLocation } from 'react-router-dom';
import ControlTowerSaasLayout from "./ControlTowerSaasLayout";
import './CreateFclInquiry.css';

const { Row, Col } = Grid;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Title = Typography.Title;
// Select.Option 用于组件内部构建
const Step = Steps.Step;

// 类型定义
interface AreaItem {
  key: number;
  province: string;
  city: string;
  district: string;
  street: string;
}

interface ContainerItem {
  id: number;
  type: string;
  count: number;
}

interface MainlineRate {
  certNo: string;
  departurePort: string;
  dischargePort: string;
  shipCompany: string;
  validPeriod: string;
  transitPort: string;
  transitType: string;
  '20GP': string;
  '40GP': string;
  '40HC': string;
  '45HC': string;
  '20NOR': string;
  '40NOR': string;
  etd: string;
  eta: string;
  transitTime: string;
  freeBox: string;
  freeStorage: string;
}

interface PrecarriageRate {
  id: string;
  certNo: string;
  type: string;
  origin: string;
  destination: string;
  vendor: string;
  currency: string;
  '20GP': string;
  '40GP': string;
  '40HC': string;
  validDate: string;
}

interface OncarriageRate {
  id: string;
  certNo: string;
  origin: string;
  addressType: string;
  zipCode: string;
  address: string;
  warehouseCode: null | string;
  agentName: string;
  validDateRange: string;
  remark: string;
  status: string;
}

// 需要AirRate接口可在后续添加

interface CombinationRate {
  key: string;
  combination: string;
  totalPrice: string;
  transitTime: string;
  precarriageRate: string;
  mainlineRate: string;
  oncarriageRate: string;
  etd: string;
  eta: string;
}

const CombinationRateQuery: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 当前步骤状态
  const [currentStep, setCurrentStep] = useState<number>(0);
  
  // 判断来源tab (整箱fcl、拼箱lcl、空运air)
  const [cargoType, setCargoType] = useState<'fcl' | 'lcl' | 'air'>('fcl');
  
  // 顶部复选框状态
  const [checkedServices, setCheckedServices] = useState({
    precarriageChecked: true,  // 港前报价
    mainlineChecked: true,     // 干线报价
    lastmileChecked: true,     // 尾程报价
  });

  // 查询条件状态
  const [queryParams, setQueryParams] = useState({
    transitType: '不指定',     // 直达/中转
    route: '',                // 航线
    departurePort: '',        // 起运港/起始地
    dischargePort: '',        // 卸货港/目的地
    transitPort: '',          // 中转港
    shipCompany: '不指定',     // 船公司
    serviceTerms: 'DDP',      // 服务条款
  });

  // 装箱门点区域选择相关状态
  const [areaList, setAreaList] = useState<AreaItem[]>([{
    key: 1,
    province: '',
    city: '',
    district: '',
    street: ''
  }]);

  // 详细装箱门点
  const [loadingPointDetail, setLoadingPointDetail] = useState('');
  
  // 尾程送货地址
  const [deliveryAddress, setDeliveryAddress] = useState({
    addressType: '第三方地址',
    zipCode: '',
    address: '',
    warehouseCode: ''
  });

  // 集装箱信息 (整箱)
  const [containerList, setContainerList] = useState<ContainerItem[]>([
    { id: 1, type: '20GP', count: 1 }
  ]);

  // LCL/空运信息
  const [cargoInfo, setCargoInfo] = useState({
    weight: '', // KGS
    volume: ''  // CBM
  });

  // 表格选择状态
  const [selectedMainlineRate, setSelectedMainlineRate] = useState<string>('');
  const [selectedPrecarriageRate, setSelectedPrecarriageRate] = useState<string>('');
  const [selectedOncarriageRate, setSelectedOncarriageRate] = useState<string>('');

  // 运价匹配结果
  const [matchedRates, setMatchedRates] = useState<{
    mainlineRates: MainlineRate[];
    precarriageRates: PrecarriageRate[];
    oncarriageRates: OncarriageRate[];
  }>({
    mainlineRates: [],
    precarriageRates: [],
    oncarriageRates: []
  });

  // 组合运价列表（最终结果）
  const [combinationRates, setCombinationRates] = useState<CombinationRate[]>([]);
  
  // 判断初始来源
  useEffect(() => {
    // 根据URL参数或者其他逻辑来确定来源tab
    const searchParams = new URLSearchParams(location.search);
    const type = searchParams.get('type');
    
    if (type === 'lcl') {
      setCargoType('lcl');
    } else if (type === 'air') {
      setCargoType('air');
    } else {
      setCargoType('fcl');
    }
  }, [location]);

  // 处理复选框状态变化
  const handleCheckboxChange = (key: string, checked: boolean) => {
    setCheckedServices(prev => ({
      ...prev,
      [key]: checked
    }));
  };

  // 更新查询参数
  const handleQueryParamChange = (key: string, value: string) => {
    setQueryParams(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // 添加新的箱型
  const addContainerItem = () => {
    if (containerList.length >= 5) {
      Message.warning('最多只能添加5个箱型');
      return;
    }
    
    const newId = containerList.length > 0 ? Math.max(...containerList.map(item => item.id)) + 1 : 1;
    // 找到第一个未被选择的箱型
    const boxTypes = ['20GP', '40GP', '40HC', '45HC', '20NOR', '40NOR'];
    const selectedContainerTypes = containerList.map(item => item.type);
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

  // 更新区域字段
  const updateAreaField = (key: number, field: string, value: string) => {
    setAreaList(areaList.map(area => {
      if (area.key === key) {
        return { ...area, [field]: value };
      }
      return area;
    }));
  };
  
  // 返回上一页
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/rate-query');
    }
  };

  // 下一步 - 执行查询
  const handleNext = () => {
    // 可以在这里添加表单验证逻辑
    
    // 模拟查询操作
    setTimeout(() => {
      // 这里可以根据实际情况添加查询逻辑
      // 模拟设置查询结果
      setMatchedRates({
        mainlineRates: mainlineRateData,
        precarriageRates: precarriageRateData,
        oncarriageRates: oncarriageRateData
      });
      
      // 进入下一步
      setCurrentStep(1);
    }, 500);
  };

  // 生成组合方案
  const generateCombinations = () => {
    // 检查是否选择了必要的运价
    if (!selectedMainlineRate && checkedServices.mainlineChecked) {
      Message.warning('请选择干线运价');
      return;
    }
    
    if (!selectedPrecarriageRate && checkedServices.precarriageChecked) {
      Message.warning('请选择港前运价');
      return;
    }
    
    if (!selectedOncarriageRate && checkedServices.lastmileChecked) {
      Message.warning('请选择尾程运价');
      return;
    }
    
    // 模拟生成组合方案
    setCombinationRates(mockCombinationRates);
    
    Message.success('组合方案生成成功');
  };

  // 转委托
  const handleConvertToDelegate = () => {
    Message.success('已转为委托，即将跳转...');
    // 这里可以添加跳转到委托页面的逻辑
    // navigate('/delegate-page', { state: { selectedRates: ... } });
  };
  
  // 云仓收货
  const handleCloudWarehouseReceive = () => {
    Message.success('已选择云仓收货，即将跳转...');
    // 这里可以添加跳转到云仓收货页面的逻辑
  };

  // 模拟数据 - 干线运价
  const mainlineRateData: MainlineRate[] = [
    {
      certNo: 'M001',
      departurePort: 'CNSHA | Shanghai',
      dischargePort: 'USLAX | Los Angeles',
      shipCompany: '地中海',
      validPeriod: '2024-06-01 ~ 2024-07-01',
      transitPort: '-',
      transitType: '直达',
      '20GP': '1500.00',
      '40GP': '2800.00',
      '40HC': '2900.00',
      '45HC': '3100.00',
      '20NOR': '1400.00',
      '40NOR': '2700.00',
      etd: '2024-07-10',
      eta: '2024-07-24',
      transitTime: '14天',
      freeBox: '14天',
      freeStorage: '7天'
    },
    {
      certNo: 'M002',
      departurePort: 'CNSHA | Shanghai',
      dischargePort: 'USLAX | Los Angeles',
      shipCompany: '马士基',
      validPeriod: '2024-07-01 ~ 2024-08-01',
      transitPort: 'KRPUS | Busan',
      transitType: '中转',
      '20GP': '1450.00',
      '40GP': '2750.00',
      '40HC': '2850.00',
      '45HC': '3050.00',
      '20NOR': '1350.00',
      '40NOR': '2650.00',
      etd: '2024-08-08',
      eta: '2024-08-24',
      transitTime: '16天',
      freeBox: '21天',
      freeStorage: '10天'
    }
  ];

  // 模拟数据 - 港前运价
  const precarriageRateData: PrecarriageRate[] = [
    {
      id: '1',
      certNo: 'P001',
      type: '直达',
      origin: '苏州工业园区',
      destination: '洋山港',
      vendor: '德邦专线',
      currency: 'CNY',
      '20GP': '800.00',
      '40GP': '1200.00',
      '40HC': '1300.00',
      validDate: '2024-12-31'
    },
    {
      id: '2',
      certNo: 'P002',
      type: '支线',
      origin: '太仓港',
      destination: '洋山港',
      vendor: '速航65号',
      currency: 'CNY',
      '20GP': '400.00',
      '40GP': '700.00',
      '40HC': '750.00',
      validDate: '2024-11-30'
    }
  ];

  // 模拟数据 - 尾程运价
  const oncarriageRateData: OncarriageRate[] = [
    {
      id: '1',
      certNo: 'O001',
      origin: 'USLAX | LOS ANGELES',
      addressType: '第三方地址',
      zipCode: '92101',
      address: 'San Diego, CA',
      warehouseCode: null,
      agentName: 'XPO TRUCK LLC',
      validDateRange: '2024-05-01 至 2024-12-31',
      remark: '',
      status: '正常'
    },
    {
      id: '2',
      certNo: 'O002',
      origin: 'USNYC | NEW YORK',
      addressType: '亚马逊仓库',
      zipCode: '',
      address: '',
      warehouseCode: 'ONT8',
      agentName: 'DRAYEASY INC',
      validDateRange: '2024-05-15 至 2024-11-30',
      remark: '',
      status: '正常'
    }
  ];

  // 空运价格数据可在需要时添加

  // 模拟数据 - 最终组合方案
  const mockCombinationRates: CombinationRate[] = [
    {
      key: '1',
      combination: '组合1',
      totalPrice: '$ 3560.00',
      transitTime: '32天',
      precarriageRate: 'P001',
      mainlineRate: 'M001',
      oncarriageRate: 'O001',
      etd: '2024-06-20',
      eta: '2024-07-22'
    },
    {
      key: '2',
      combination: '组合2',
      totalPrice: '$ 3420.00',
      transitTime: '35天',
      precarriageRate: 'P002',
      mainlineRate: 'M002',
      oncarriageRate: 'O002',
      etd: '2024-06-25',
      eta: '2024-07-30'
    },
    {
      key: '3',
      combination: '组合3',
      totalPrice: '$ 3680.00',
      transitTime: '30天',
      precarriageRate: 'P001',
      mainlineRate: 'M003',
      oncarriageRate: 'O003',
      etd: '2024-06-22',
      eta: '2024-07-21'
    }
  ];

  // 表格列定义 - 组合方案表格
  const combinationColumns = [
    {
      title: '组合方案',
      dataIndex: 'combination',
      width: 100,
    },
    {
      title: '总价格',
      dataIndex: 'totalPrice',
      width: 120,
      sorter: (a: CombinationRate, b: CombinationRate) => {
        const priceA = parseFloat(a.totalPrice.replace('$', '').trim());
        const priceB = parseFloat(b.totalPrice.replace('$', '').trim());
        return priceA - priceB;
      }
    },
    {
      title: '航程',
      dataIndex: 'transitTime',
      width: 80,
      sorter: (a: CombinationRate, b: CombinationRate) => {
        const timeA = parseInt(a.transitTime.replace('天', '').trim());
        const timeB = parseInt(b.transitTime.replace('天', '').trim());
        return timeA - timeB;
      }
    },
    {
      title: '港前运价',
      dataIndex: 'precarriageRate',
      width: 100,
      render: (text: string) => checkedServices.precarriageChecked ? text : '-',
    },
    {
      title: '干线运价',
      dataIndex: 'mainlineRate',
      width: 100,
      render: (text: string) => checkedServices.mainlineChecked ? text : '-',
    },
    {
      title: '尾程运价',
      dataIndex: 'oncarriageRate',
      width: 100,
      render: (text: string) => checkedServices.lastmileChecked ? text : '-',
    },
    {
      title: 'ETD',
      dataIndex: 'etd',
      width: 120,
    },
    {
      title: 'ETA',
      dataIndex: 'eta',
      width: 120,
    },
    {
      title: '操作',
      dataIndex: 'operations',
      width: 150,
      render: () => (
        <Space>
          <Button type="text" size="mini" icon={<IconDownload />}>下载</Button>
          <Button type="text" size="mini" icon={<IconCopy />}>复制</Button>
        </Space>
      ),
    },
  ];

  // 干线运价表格列
  const mainlineColumns = [
    { title: '运价编号', dataIndex: 'certNo', width: 100 },
    { title: '起运港', dataIndex: 'departurePort', width: 150 },
    { title: '卸货港', dataIndex: 'dischargePort', width: 150 },
    { title: '船公司', dataIndex: 'shipCompany', width: 120 },
    { title: '有效期', dataIndex: 'validPeriod', width: 160 },
    { title: '中转港', dataIndex: 'transitPort', width: 120 },
    { title: '直达/中转', dataIndex: 'transitType', width: 100 },
    { title: '20GP', dataIndex: '20GP', width: 90 },
    { title: '40GP', dataIndex: '40GP', width: 90 },
    { title: '40HC', dataIndex: '40HC', width: 90 },
    { title: 'ETD', dataIndex: 'etd', width: 110 },
    { title: 'ETA', dataIndex: 'eta', width: 110 },
    { title: '航程', dataIndex: 'transitTime', width: 90 }
  ];

  // 港前运价表格列
  const precarriageColumns = [
    { title: '运价编号', dataIndex: 'certNo', width: 100 },
    { title: '类型', dataIndex: 'type', width: 100 },
    { title: '起运地', dataIndex: 'origin', width: 150 },
    { title: '目的地', dataIndex: 'destination', width: 150 },
    { title: '供应商', dataIndex: 'vendor', width: 120 },
    { title: '币种', dataIndex: 'currency', width: 80 },
    { title: '20GP', dataIndex: '20GP', width: 100 },
    { title: '40GP', dataIndex: '40GP', width: 100 },
    { title: '40HC', dataIndex: '40HC', width: 100 },
    { title: '有效期', dataIndex: 'validDate', width: 120 }
  ];

  // 尾程运价表格列
  const oncarriageColumns = [
    { title: '运价编号', dataIndex: 'certNo', width: 100 },
    { title: '目的港', dataIndex: 'origin', width: 150 },
    { title: '配送地址类型', dataIndex: 'addressType', width: 120 },
    { title: '代理名称', dataIndex: 'agentName', width: 150 },
    { title: '有效期', dataIndex: 'validDateRange', width: 180 }
  ];

  // 需要空运价格表格列可以在后续添加

  return (
    <ControlTowerSaasLayout 
      menuSelectedKey="3" 
      breadcrumb={
        <Breadcrumb>
          <Breadcrumb.Item>运价管理</Breadcrumb.Item>
          <Breadcrumb.Item>运价查询</Breadcrumb.Item>
          <Breadcrumb.Item>组合方案查询</Breadcrumb.Item>
        </Breadcrumb>
      }
    >
      <Form layout="vertical">
        <Card className="mb-4">
          <div className="flex items-center mb-4">
            <Button icon={<IconArrowLeft />} onClick={handleBack}>返回</Button>
            <Title heading={6} className="ml-4 mb-0">组合方案查询</Title>
            <div className="ml-auto">
              <Space>
                <Checkbox 
                  checked={checkedServices.precarriageChecked}
                  onChange={(checked) => handleCheckboxChange('precarriageChecked', checked)}
                >
                  港前价格
                </Checkbox>
                <Checkbox 
                  checked={checkedServices.mainlineChecked}
                  onChange={(checked) => handleCheckboxChange('mainlineChecked', checked)}
                >
                  干线价格
                </Checkbox>
                <Checkbox 
                  checked={checkedServices.lastmileChecked}
                  onChange={(checked) => handleCheckboxChange('lastmileChecked', checked)}
                >
                  尾程价格
                </Checkbox>
              </Space>
            </div>
          </div>
          
          {/* 步骤条 */}
          <div className="mb-6">
            <Steps current={currentStep}>
              <Step title="填写查询条件" />
              <Step title="选择匹配运价" />
            </Steps>
          </div>
          
          {currentStep === 0 ? (
            <>
              <Row gutter={[16, 16]}>
                {/* 左侧区域：基本信息 */}
                <Col span={12}>
                  <div className="border rounded p-4 mb-4">
                    <div className="text-blue-600 font-bold border-l-4 border-blue-600 pl-2 mb-4">基本信息</div>
                    
                    <Row gutter={[16, 16]}>
                      <Col span={24}>
                        <FormItem label="直达/中转">
                          <RadioGroup 
                            value={queryParams.transitType}
                            onChange={(value) => handleQueryParamChange('transitType', value)}
                          >
                            <Radio value="不指定">不指定</Radio>
                            <Radio value="直达">直达</Radio>
                            <Radio value="中转">中转</Radio>
                          </RadioGroup>
                        </FormItem>
                      </Col>
                      
                      <Col span={24}>
                        <FormItem label="航线">
                          <Select 
                            placeholder="请选择航线" 
                            value={queryParams.route}
                            onChange={(value) => handleQueryParamChange('route', value)}
                            allowClear
                            style={{ width: '100%' }}
                          >
                            <Select.Option value="跨太平洋东行">跨太平洋东行</Select.Option>
                            <Select.Option value="亚欧线">亚欧线</Select.Option>
                            <Select.Option value="中东航线">中东航线</Select.Option>
                            <Select.Option value="亚澳航线">亚澳航线</Select.Option>
                          </Select>
                        </FormItem>
                      </Col>
                      
                      <Col span={24}>
                        <FormItem label={cargoType === 'air' ? "起始地" : "起运港"}>
                          <Select 
                            placeholder={`请选择${cargoType === 'air' ? "起始地" : "起运港"}`}
                            value={queryParams.departurePort}
                            onChange={(value) => handleQueryParamChange('departurePort', value)}
                            allowClear
                            style={{ width: '100%' }}
                          >
                            {cargoType === 'air' ? (
                              <>
                                <Select.Option value="PVG | Shanghai Pudong">PVG | Shanghai Pudong</Select.Option>
                                <Select.Option value="PEK | Beijing Capital">PEK | Beijing Capital</Select.Option>
                                <Select.Option value="CAN | Guangzhou Baiyun">CAN | Guangzhou Baiyun</Select.Option>
                              </>
                            ) : (
                              <>
                                <Select.Option value="CNSHA | Shanghai">CNSHA | Shanghai</Select.Option>
                                <Select.Option value="CNNGB | Ningbo">CNNGB | Ningbo</Select.Option>
                                <Select.Option value="CNQIN | Qingdao">CNQIN | Qingdao</Select.Option>
                                <Select.Option value="CNDLC | Dalian">CNDLC | Dalian</Select.Option>
                              </>
                            )}
                          </Select>
                        </FormItem>
                      </Col>
                      
                      <Col span={24}>
                        <FormItem label={cargoType === 'air' ? "目的地" : "卸货港"}>
                          <Select 
                            placeholder={`请选择${cargoType === 'air' ? "目的地" : "卸货港"}`}
                            value={queryParams.dischargePort}
                            onChange={(value) => handleQueryParamChange('dischargePort', value)}
                            allowClear
                            style={{ width: '100%' }}
                          >
                            {cargoType === 'air' ? (
                              <>
                                <Select.Option value="LAX | Los Angeles">LAX | Los Angeles</Select.Option>
                                <Select.Option value="JFK | New York">JFK | New York</Select.Option>
                                <Select.Option value="CDG | Paris">CDG | Paris</Select.Option>
                              </>
                            ) : (
                              <>
                                <Select.Option value="USLAX | Los Angeles">USLAX | Los Angeles</Select.Option>
                                <Select.Option value="USNYC | New York">USNYC | New York</Select.Option>
                                <Select.Option value="NLRTM | Rotterdam">NLRTM | Rotterdam</Select.Option>
                                <Select.Option value="DEHAM | Hamburg">DEHAM | Hamburg</Select.Option>
                              </>
                            )}
                          </Select>
                        </FormItem>
                      </Col>
                      
                      {queryParams.transitType === '中转' && (
                        <Col span={24}>
                          <FormItem label="中转港">
                            <Select 
                              placeholder="请选择中转港"
                              value={queryParams.transitPort}
                              onChange={(value) => handleQueryParamChange('transitPort', value)}
                              allowClear
                              style={{ width: '100%' }}
                            >
                              <Select.Option value="KRPUS | Busan">KRPUS | Busan</Select.Option>
                              <Select.Option value="SGSIN | Singapore">SGSIN | Singapore</Select.Option>
                              <Select.Option value="HKHKG | Hong Kong">HKHKG | Hong Kong</Select.Option>
                            </Select>
                          </FormItem>
                        </Col>
                      )}
                      
                      <Col span={24}>
                        <FormItem label={cargoType === 'air' ? "航空公司" : "船公司"}>
                          <Select 
                            placeholder={`请选择${cargoType === 'air' ? "航空公司" : "船公司"}`}
                            value={queryParams.shipCompany}
                            onChange={(value) => handleQueryParamChange('shipCompany', value)}
                            allowClear
                            style={{ width: '100%' }}
                          >
                            <Select.Option value="不指定">不指定</Select.Option>
                            {cargoType === 'air' ? (
                              <>
                                <Select.Option value="南方航空">南方航空</Select.Option>
                                <Select.Option value="东方航空">东方航空</Select.Option>
                                <Select.Option value="国际航空">国际航空</Select.Option>
                              </>
                            ) : (
                              <>
                                <Select.Option value="地中海">地中海</Select.Option>
                                <Select.Option value="马士基">马士基</Select.Option>
                                <Select.Option value="达飞">达飞</Select.Option>
                                <Select.Option value="中远海运">中远海运</Select.Option>
                              </>
                            )}
                          </Select>
                        </FormItem>
                      </Col>
                      
                      <Col span={24}>
                        <FormItem label="服务条款">
                          <Select 
                            placeholder="请选择服务条款"
                            value={queryParams.serviceTerms}
                            onChange={(value) => handleQueryParamChange('serviceTerms', value)}
                            style={{ width: '100%' }}
                          >
                            <Select.Option value="DDP">DDP</Select.Option>
                            <Select.Option value="DDU">DDU</Select.Option>
                            <Select.Option value="DAP">DAP</Select.Option>
                            <Select.Option value="FOB">FOB</Select.Option>
                            <Select.Option value="CIF">CIF</Select.Option>
                          </Select>
                        </FormItem>
                      </Col>
                    </Row>
                  </div>
                </Col>
                
                {/* 右侧区域：货物信息和其他选择项 */}
                <Col span={12}>
                  <div className="border rounded p-4 mb-4">
                    <div className="text-blue-600 font-bold border-l-4 border-blue-600 pl-2 mb-4">货物信息</div>
                    
                    <FormItem label="货物类型">
                      <RadioGroup 
                        value={cargoType}
                        disabled
                      >
                        <Radio value="fcl">整箱</Radio>
                        <Radio value="lcl">拼箱</Radio>
                        <Radio value="air">空运</Radio>
                      </RadioGroup>
                    </FormItem>
                    
                    {cargoType === 'fcl' ? (
                      <div className="border rounded p-4">
                        <div className="text-blue-600 font-bold border-l-4 border-blue-600 pl-2 mb-4">箱型箱量</div>
                        
                        {containerList.map((container) => (
                          <Row gutter={[16, 16]} key={container.id} className="mb-3">
                            <Col span={12}>
                              <FormItem label="箱型">
                                <Select
                                  value={container.type}
                                  onChange={(value) => updateContainerItem(container.id, 'type', value)}
                                  style={{ width: '100%' }}
                                >
                                  <Select.Option value="20GP">20GP</Select.Option>
                                  <Select.Option value="40GP">40GP</Select.Option>
                                  <Select.Option value="40HC">40HC</Select.Option>
                                  <Select.Option value="45HC">45HC</Select.Option>
                                  <Select.Option value="20NOR">20NOR</Select.Option>
                                  <Select.Option value="40NOR">40NOR</Select.Option>
                                </Select>
                              </FormItem>
                            </Col>
                            
                            <Col span={12}>
                              <FormItem label="数量">
                                <Input
                                  type="number"
                                  min={1}
                                  max={100}
                                  value={container.count.toString()}
                                  onChange={(value) => updateContainerItem(container.id, 'count', parseInt(value) || 1)}
                                />
                              </FormItem>
                            </Col>
                            
                            {containerList.length > 1 && (
                              <Button 
                                type="text" 
                                status="danger" 
                                size="mini"
                                style={{ position: 'absolute', right: '5px', top: '5px' }}
                                onClick={() => removeContainerItem(container.id)}
                              >
                                删除
                              </Button>
                            )}
                          </Row>
                        ))}
                        
                        {containerList.length < 5 && (
                          <div className="mt-2">
                            <Button type="outline" onClick={addContainerItem}>+ 添加箱型</Button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="border rounded p-4">
                        <div className="text-blue-600 font-bold border-l-4 border-blue-600 pl-2 mb-4">
                          {cargoType === 'lcl' ? '拼箱信息' : '空运信息'}
                        </div>
                        
                        <Row gutter={[16, 16]}>
                          <Col span={12}>
                            <FormItem label="重量(KGS)">
                              <Input
                                placeholder="请输入重量"
                                value={cargoInfo.weight}
                                onChange={(value) => setCargoInfo(prev => ({ ...prev, weight: value }))}
                              />
                            </FormItem>
                          </Col>
                          
                          <Col span={12}>
                            <FormItem label="体积(CBM)">
                              <Input
                                placeholder="请输入体积"
                                value={cargoInfo.volume}
                                onChange={(value) => setCargoInfo(prev => ({ ...prev, volume: value }))}
                              />
                            </FormItem>
                          </Col>
                        </Row>
                      </div>
                    )}
                  </div>
                  
                  {/* 附加区域选择模块 */}
                  <div>
                    {/* 装箱门点区域，仅在勾选港前报价时显示 */}
                    {checkedServices.precarriageChecked && (
                      <div className="border rounded p-4 mb-4">
                        <div className="text-blue-600 font-bold border-l-4 border-blue-600 pl-2 mb-4">装箱门点</div>
                        <div className="border-b border-gray-200 pb-2 mb-2">
                          <Row gutter={[8, 0]}>
                            <Col span={6}>
                              <FormItem label="省份" style={{ marginBottom: 0 }}>
                                <Select
                                  placeholder="省份"
                                  value={areaList[0].province}
                                  onChange={(value) => updateAreaField(1, 'province', value)}
                                  style={{ width: '100%' }}
                                >
                                  <Select.Option value="浙江省">浙江省</Select.Option>
                                  <Select.Option value="江苏省">江苏省</Select.Option>
                                  <Select.Option value="上海市">上海市</Select.Option>
                                  <Select.Option value="广东省">广东省</Select.Option>
                                </Select>
                              </FormItem>
                            </Col>
                            <Col span={6}>
                              <FormItem label="城市" style={{ marginBottom: 0 }}>
                                <Select
                                  placeholder="城市"
                                  value={areaList[0].city}
                                  onChange={(value) => updateAreaField(1, 'city', value)}
                                  style={{ width: '100%' }}
                                >
                                  <Select.Option value="杭州市">杭州市</Select.Option>
                                  <Select.Option value="宁波市">宁波市</Select.Option>
                                  <Select.Option value="苏州市">苏州市</Select.Option>
                                  <Select.Option value="上海市">上海市</Select.Option>
                                </Select>
                              </FormItem>
                            </Col>
                            <Col span={6}>
                              <FormItem label="区/县" style={{ marginBottom: 0 }}>
                                <Select
                                  placeholder="区/县"
                                  value={areaList[0].district}
                                  onChange={(value) => updateAreaField(1, 'district', value)}
                                  style={{ width: '100%' }}
                                >
                                  <Select.Option value="萧山区">萧山区</Select.Option>
                                  <Select.Option value="余杭区">余杭区</Select.Option>
                                  <Select.Option value="西湖区">西湖区</Select.Option>
                                  <Select.Option value="拱墅区">拱墅区</Select.Option>
                                </Select>
                              </FormItem>
                            </Col>
                            <Col span={6}>
                              <FormItem label="街道/村镇" style={{ marginBottom: 0 }}>
                                <Select
                                  placeholder="街道/村镇"
                                  value={areaList[0].street}
                                  onChange={(value) => updateAreaField(1, 'street', value)}
                                  style={{ width: '100%' }}
                                >
                                  <Select.Option value="新塘街道">新塘街道</Select.Option>
                                  <Select.Option value="宁围街道">宁围街道</Select.Option>
                                  <Select.Option value="北干街道">北干街道</Select.Option>
                                  <Select.Option value="闻堰街道">闻堰街道</Select.Option>
                                </Select>
                              </FormItem>
                            </Col>
                          </Row>
                        </div>
                        <FormItem label="详细地址">
                          <Input.TextArea
                            placeholder="请输入详细地址"
                            value={loadingPointDetail}
                            onChange={(value) => setLoadingPointDetail(value)}
                            rows={2}
                          />
                        </FormItem>
                      </div>
                    )}
                    
                    {/* 尾程送货地址，仅在勾选尾程报价时显示 */}
                    {checkedServices.lastmileChecked && (
                      <div className="border rounded p-4 mb-4">
                        <div className="text-blue-600 font-bold border-l-4 border-blue-600 pl-2 mb-4">尾程送货地址</div>
                        <FormItem label="配送地址类型" style={{ marginBottom: '12px' }}>
                          <RadioGroup 
                            value={deliveryAddress.addressType}
                            onChange={(value) => setDeliveryAddress(prev => ({ ...prev, addressType: value }))}
                          >
                            <Radio value="第三方地址">第三方地址</Radio>
                            <Radio value="亚马逊仓库">亚马逊仓库</Radio>
                            <Radio value="易仓">易仓</Radio>
                          </RadioGroup>
                        </FormItem>
                        
                        {deliveryAddress.addressType === '第三方地址' && (
                          <>
                            <FormItem label="邮编" style={{ marginBottom: '12px' }}>
                              <Input
                                placeholder="请输入邮编"
                                value={deliveryAddress.zipCode}
                                onChange={(value) => setDeliveryAddress(prev => ({ ...prev, zipCode: value }))}
                              />
                            </FormItem>
                            
                            <FormItem label="地址" style={{ marginBottom: '12px' }}>
                              <Input.TextArea
                                placeholder="请输入详细地址"
                                value={deliveryAddress.address}
                                onChange={(value) => setDeliveryAddress(prev => ({ ...prev, address: value }))}
                                rows={2}
                              />
                            </FormItem>
                          </>
                        )}
                        
                        {(deliveryAddress.addressType === '亚马逊仓库' || deliveryAddress.addressType === '易仓') && (
                          <FormItem 
                            label="仓库代码" 
                            style={{ marginBottom: '12px' }}
                          >
                            <Input
                              placeholder="请输入仓库代码"
                              value={deliveryAddress.warehouseCode}
                              onChange={(value) => setDeliveryAddress(prev => ({ ...prev, warehouseCode: value }))}
                            />
                          </FormItem>
                        )}
                      </div>
                    )}
                  </div>
                </Col>
              </Row>
              
              <div className="flex justify-center mt-4">
                <Button type="primary" size="large" onClick={handleNext}>
                  下一步
                </Button>
              </div>
            </>
          ) : (
            <>
              {/* 第二步 - 选择匹配运价 */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-blue-600 font-bold border-l-4 border-blue-600 pl-2">干线运价匹配结果</div>
                  <Space>
                    <Button type="primary" onClick={generateCombinations}>生成组合方案</Button>
                    <Button type="primary">打印报价单</Button>
                  </Space>
                </div>
                
                {/* 干线运价表格 */}
                {checkedServices.mainlineChecked && (
                  <div className="mb-6">
                    <Table
                      rowKey="certNo"
                      columns={[
                        {
                          title: '选择',
                          width: 80,
                          render: (_, record) => (
                            <Radio
                              checked={selectedMainlineRate === record.certNo}
                              onChange={() => setSelectedMainlineRate(record.certNo)}
                            />
                          ),
                        },
                        ...mainlineColumns,
                      ]}
                      data={matchedRates.mainlineRates}
                      pagination={false}
                      border={true}
                      scroll={{ x: 1500 }}
                      className="mb-4"
                    />
                  </div>
                )}
                
                {/* 港前运价表格 */}
                {checkedServices.precarriageChecked && (
                  <div className="mb-6">
                    <div className="text-blue-600 font-bold border-l-4 border-blue-600 pl-2 mb-4">港前运价匹配结果</div>
                    <Table
                      rowKey="certNo"
                      columns={[
                        {
                          title: '选择',
                          width: 80,
                          render: (_, record) => (
                            <Radio
                              checked={selectedPrecarriageRate === record.certNo}
                              onChange={() => setSelectedPrecarriageRate(record.certNo)}
                            />
                          ),
                        },
                        ...precarriageColumns,
                      ]}
                      data={matchedRates.precarriageRates}
                      pagination={false}
                      border={true}
                      scroll={{ x: 1200 }}
                      className="mb-4"
                    />
                  </div>
                )}
                
                {/* 尾程运价表格 */}
                {checkedServices.lastmileChecked && (
                  <div className="mb-6">
                    <div className="text-blue-600 font-bold border-l-4 border-blue-600 pl-2 mb-4">尾程运价匹配结果</div>
                    <Table
                      rowKey="certNo"
                      columns={[
                        {
                          title: '选择',
                          width: 80,
                          render: (_, record) => (
                            <Radio
                              checked={selectedOncarriageRate === record.certNo}
                              onChange={() => setSelectedOncarriageRate(record.certNo)}
                            />
                          ),
                        },
                        ...oncarriageColumns,
                      ]}
                      data={matchedRates.oncarriageRates}
                      pagination={false}
                      border={true}
                      className="mb-4"
                    />
                  </div>
                )}
              </div>
              
              {/* 底部显示组合方案结果 */}
              {combinationRates.length > 0 && (
                <div className="border rounded p-4 mt-6">
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-blue-600 font-bold border-l-4 border-blue-600 pl-2">组合方案结果</div>
                    <Space>
                      <Button type="primary" onClick={handleConvertToDelegate}>转委托</Button>
                      <Button type="secondary" onClick={handleCloudWarehouseReceive}>云仓收货</Button>
                    </Space>
                  </div>
                  
                  <Table 
                    rowKey="key"
                    columns={combinationColumns}
                    data={combinationRates}
                    pagination={{
                      total: combinationRates.length,
                      pageSize: 10,
                    }}
                    border={true}
                  />
                </div>
              )}
              
              <div className="flex justify-between mt-4">
                <Button onClick={() => setCurrentStep(0)}>返回上一步</Button>
              </div>
            </>
          )}
        </Card>
      </Form>
    </ControlTowerSaasLayout>
  );
};

export default CombinationRateQuery; 