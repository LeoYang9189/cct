import React, { useState } from 'react';
import { 
  Card, 
  Breadcrumb, 
  Button, 
  Space, 
  Input, 
  Select, 
  Form, 
  Grid, 
  Checkbox,
  Radio, 
  Table,
  Message,
  Modal,
  DatePicker
} from '@arco-design/web-react';
import { IconSave, IconDelete, IconUpload, IconRobot } from '@arco-design/web-react/icon';
import { useNavigate } from 'react-router-dom';
import ControlTowerSaasLayout from "./ControlTowerSaasLayout";
import './CreateFclInquiry.css';

const { Row, Col } = Grid;
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

// 邮编地址映射数据
const zipCodeAddressMap: {[key: string]: string} = {
  '90001': 'Los Angeles, CA',
  '90210': 'Beverly Hills, CA',
  '10001': 'New York, NY',
  '33101': 'Miami, FL',
  '60601': 'Chicago, IL',
  '98101': 'Seattle, WA',
  '94101': 'San Francisco, CA',
  '02101': 'Boston, MA',
  '77001': 'Houston, TX',
  '19101': 'Philadelphia, PA'
};

// 空运干线运价表格数据示例
const airMainlineRateData = [
  {
    id: '1',
    rateNo: 'AR20240601',
    shipCompany: '南方航空',
    departurePort: 'PVG | Shanghai Pudong',
    dischargePort: 'LAX | Los Angeles',
    validPeriod: '2024-06-01 ~ 2024-07-01',
    '+45': '150',
    '+100': '145',
    '+300': '140',
    '+500': '135',
    '+1000': '130',
  },
  {
    id: '2',
    rateNo: 'AR20240701',
    shipCompany: '东方航空',
    departurePort: 'PEK | Beijing Capital',
    dischargePort: 'JFK | New York',
    validPeriod: '2024-07-01 ~ 2024-08-01',
    '+45': '155',
    '+100': '150',
    '+300': '145',
    '+500': '140',
    '+1000': '135',
  }
];

// 尾程运价表格数据
const oncarriageRateData = [
  {
    id: '1',
    certNo: 'O001',
    origin: 'LAX | Los Angeles',
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
    origin: 'JFK | New York',
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

const CreateAirInquiry: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  
  // 表单状态
  const [formState, setFormState] = useState({
    inquiryNo: 'AIR' + Date.now(),
    inquirer: '张三',
    precarriageChecked: false,  // 港前报价始终为false
    mainlineChecked: true,     // 干线报价
    lastmileChecked: true,     // 尾程报价
    cargoNature: '询价',
    cargoReadyTimeType: '区间',
    cargoReadyTime: '二周内',
    cargoReadyDate: '',
    cargoQuality: '实单',
    serviceTerms: 'DDP',
    customServiceTerms: '',
    clientType: '不指定',
    clientCompany: '',
    clientName: '',
    weight: '',
    volume: '',
    // 保留尾程送货地址相关字段
    addressType: '第三方地址',
    zipCode: '',
    address: '',
    warehouseCode: '',
    transitType: '不指定',
    route: '中美航线',
    lineCode: '',
    placeOfReceipt: '',
    departurePort: 'PVG | Shanghai Pudong',
    dischargePort: '',
    finalDestination: 'LAX | Los Angeles',
    transitPort: '',
    transitPort1st: '',
    transitPort2nd: '',
    transitPort3rd: '',
    etd: '',
    eta: '',
    goodsType: '普货',
    dangerLevel: '',
    unNo: '',
    temperature: '',
    humidity: '',
    hsCode: '',
    shipCompany: '',
    remark: ''
  });
  
  // 运价表格选择状态
  const [selectedMainlineRate, setSelectedMainlineRate] = useState('');
  const [selectedOncarriageRates, setSelectedOncarriageRates] = useState<string[]>([]);
  
  // 尾程送货地址AI识别相关
  const [deliveryAiModalVisible, setDeliveryAiModalVisible] = useState(false);
  const [deliveryAddressText, setDeliveryAddressText] = useState('');

  // 全局AI识别相关状态
  const [globalAiModalVisible, setGlobalAiModalVisible] = useState(false);
  const [globalAiText, setGlobalAiText] = useState('');
  const [globalAiLoading, setGlobalAiLoading] = useState(false);
  
  // 负责人弹窗
  const [managerSelectVisible, setManagerSelectVisible] = useState(false);
  const [selectedLastMileManager, setSelectedLastMileManager] = useState('');
  
  // 运价详情弹窗状态
  const [rateDetailVisible, setRateDetailVisible] = useState(false);
  const [currentRateDetail, setCurrentRateDetail] = useState('');
  const [currentRateType, setCurrentRateType] = useState<'mainline' | 'oncarriage'>('mainline');

  // 处理复选框状态变化
  const handleCheckboxChange = (key: string, checked: boolean) => {
    setFormState(prev => ({
      ...prev,
      [key]: checked
    }));

    // 在空运询价中只有尾程价格可以勾选/取消
    if (key === 'precarriageChecked') {
      // 港前价格在空运询价中始终为false，不能更改
      return;
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
  };

  // 表单字段变更处理
  const handleFormChange = (field: string, value: string | number | boolean) => {
    setFormState(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 表单校验
  const handleSaveDraft = () => {
    Message.success('草稿保存成功');
    navigate('/controltower/saas/inquiry-management');
  };

  // 确认选择负责人并提交
  const confirmManagerSelect = () => {
    if (!selectedLastMileManager) {
      Message.error('请至少选择一位负责人');
      return;
    }
    Message.success('询价单提交成功');
    setManagerSelectVisible(false);
    navigate('/controltower/saas/inquiry-management');
  };

  // 取消并返回询价管理页面
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
      const extractedInfo = parseGlobalTextForAirInquiry(globalAiText);

      // 更新表单状态
      setFormState(prev => ({
        ...prev,
        ...extractedInfo
      }));

      Message.success('AI识别完成，已自动填充相关字段');
      setGlobalAiModalVisible(false);
      setGlobalAiText('');
    } catch (error) {
      Message.error('AI识别失败，请重试');
    } finally {
      setGlobalAiLoading(false);
    }
  };

  // 空运询价文本解析函数
  const parseGlobalTextForAirInquiry = (text: string) => {
    const result: any = {};

    // 机场识别
    const airportPattern = /([A-Z]{3})\s*\|\s*([^,\n]+)/g;
    const airports = [];
    let match;
    while ((match = airportPattern.exec(text)) !== null) {
      airports.push(`${match[1]} | ${match[2].trim()}`);
    }

    if (airports.length >= 1) result.departurePort = airports[0];
    if (airports.length >= 2) result.finalDestination = airports[1];

    // 航空公司识别
    const airlineCompanies = ['国航', '东航', '南航', '海航', '厦航', 'CA', 'MU', 'CZ', 'HU', 'MF', 'Emirates', 'Lufthansa', 'Air France'];
    for (const company of airlineCompanies) {
      if (text.includes(company)) {
        result.shipCompany = company;
        break;
      }
    }

    // 重量识别
    const weightPattern = /(\d+(?:\.\d+)?)\s*(?:KGS?|公斤|千克)/i;
    const weightMatch = text.match(weightPattern);
    if (weightMatch) result.weight = weightMatch[1];

    // 体积识别
    const volumePattern = /(\d+(?:\.\d+)?)\s*(?:CBM|立方米|m³)/i;
    const volumeMatch = text.match(volumePattern);
    if (volumeMatch) result.volume = volumeMatch[1];

    // 直达/中转识别
    if (text.includes('直达') || text.includes('直航')) {
      result.transitType = '直达';
    } else if (text.includes('中转') || text.includes('转运')) {
      result.transitType = '中转';
    }

    // 航线识别
    if (text.includes('中美')) {
      result.route = '中美航线';
    } else if (text.includes('中欧')) {
      result.route = '中欧航线';
    } else if (text.includes('亚洲')) {
      result.route = '亚洲航线';
    }

    // 货物类型识别
    if (text.includes('危险品') || text.includes('危险货物')) {
      result.goodsType = '危险品';
    } else if (text.includes('冷冻') || text.includes('冷藏')) {
      result.goodsType = '冷冻品';
    } else if (text.includes('活体') || text.includes('动物')) {
      result.goodsType = '活体动物';
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

  // 尾程地址AI识别处理
  const handleDeliveryAiRecognize = () => {
    setTimeout(() => {
      if (deliveryAddressText) {
        setFormState(prev => ({ ...prev, address: deliveryAddressText }));
        Message.success('地址识别成功');
      }
      setDeliveryAiModalVisible(false);
    }, 1000);
  };

  // 打开运价详情弹窗
  const showRateDetail = (rateId: string, type: 'mainline' | 'oncarriage' = 'mainline') => {
    setCurrentRateDetail(rateId);
    setCurrentRateType(type);
    setRateDetailVisible(true);
  };

  // 关闭运价详情弹窗
  const closeRateDetail = () => {
    setRateDetailVisible(false);
  };

  // 获取运价详情数据
  interface FeeDetail {
    key: string;
    name: string;
    price: string;
    currency: string;
    unit: string;
    remark: string;
    type: 'basic' | 'origin' | 'destination';
  }

  const getRateDetail = (_rateId: string, type: 'mainline' | 'oncarriage' = 'mainline'): { basic: FeeDetail[], origin: FeeDetail[], destination: FeeDetail[] } => {
    if (type === 'oncarriage') {
      // 尾程运价详情
      return {
        basic: [
          { key: '1', name: '提货费', price: '50.00', currency: 'USD', unit: 'B/L', remark: '', type: 'basic' }
        ],
        origin: [],
        destination: []
      };
    } else {
      // 空运干线运价详情
      return {
        basic: [
          { key: '1', name: '空运费', price: '150.00', currency: 'USD', unit: '+45kg', remark: '', type: 'basic' },
          { key: '2', name: '空运费', price: '145.00', currency: 'USD', unit: '+100kg', remark: '', type: 'basic' }
        ],
        origin: [
          { key: '3', name: '文件费', price: '500.00', currency: 'CNY', unit: '票', remark: '', type: 'origin' }
        ],
        destination: [
          { key: '4', name: '燃油附加费', price: '100.00', currency: 'USD', unit: 'kg', remark: '', type: 'destination' }
        ]
      };
    }
  };

  return (
    <ControlTowerSaasLayout 
      menuSelectedKey="9" 
      breadcrumb={
        <Breadcrumb>
          <Breadcrumb.Item>询价报价</Breadcrumb.Item>
          <Breadcrumb.Item>询价管理</Breadcrumb.Item>
          <Breadcrumb.Item>新建空运询价</Breadcrumb.Item>
        </Breadcrumb>
      }
    >
      <Form form={form} layout="vertical">
        <Card className="mb-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <Checkbox 
                style={{ marginRight: 16 }} 
                checked={false}
                disabled={true}
              >
                港前价格
              </Checkbox>
              <Checkbox 
                style={{ marginRight: 16 }}
                checked={formState.mainlineChecked}
                onChange={(checked) => handleCheckboxChange('mainlineChecked', checked)}
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
              <Button type="primary" icon={<IconUpload />} onClick={() => setManagerSelectVisible(true)}>直接提交</Button>
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
                      <Input value={formState.inquiryNo} disabled />
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem label="询价人" field="inquirer">
                      <Input value={formState.inquirer} disabled />
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem label="货盘性质" field="cargoNature">
                      <Select value={formState.cargoNature} onChange={v => handleFormChange('cargoNature', v)}>
                        <Option value="询价">询价</Option>
                        <Option value="实单">实单</Option>
                      </Select>
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem label="货好时间" field="cargoReadyTime">
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Radio.Group
                          type="button"
                          name="cargoReadyTimeType"
                          value={formState.cargoReadyTimeType}
                          onChange={v => handleFormChange('cargoReadyTimeType', v)}
                        >
                          <Radio value="区间">区间</Radio>
                          <Radio value="日期">日期</Radio>
                        </Radio.Group>
                        <div style={{ flex: 1, marginLeft: 8 }}>
                          {formState.cargoReadyTimeType === '区间' ? (
                            <Select value={formState.cargoReadyTime} onChange={v => handleFormChange('cargoReadyTime', v)} style={{ width: '100%' }}>
                              <Option value="一周内">一周内</Option>
                              <Option value="二周内">二周内</Option>
                              <Option value="一个月内">一个月内</Option>
                              <Option value="一月以上">一月以上</Option>
                              <Option value="时间未知">时间未知</Option>
                            </Select>
                          ) : (
                            <DatePicker style={{ width: '100%' }} value={formState.cargoReadyDate} onChange={v => handleFormChange('cargoReadyDate', v)} />
                          )}
                        </div>
                      </div>
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem label="货盘质量" field="cargoQuality">
                      <Select value={formState.cargoQuality} onChange={v => handleFormChange('cargoQuality', v)}>
                        <Option value="实单">实单</Option>
                        <Option value="询价">询价</Option>
                      </Select>
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem label="服务条款" field="serviceTerms">
                      <Select value={formState.serviceTerms} onChange={v => handleFormChange('serviceTerms', v)} style={{ width: formState.serviceTerms === '自定义' ? '50%' : '100%' }}>
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
                        <Input style={{ width: '50%', marginLeft: 8 }} value={formState.customServiceTerms} onChange={v => handleFormChange('customServiceTerms', v)} placeholder="请输入自定义服务条款" />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem label="委托单位" field="clientType">
                      <Select value={formState.clientType} onChange={v => handleFormChange('clientType', v)}>
                        <Option value="不指定">不指定</Option>
                        <Option value="正式客户">正式客户</Option>
                        <Option value="临时客户">临时客户</Option>
                      </Select>
                      {formState.clientType === '正式客户' && (
                        <Select style={{ width: '100%', marginTop: 8 }} value={formState.clientCompany} onChange={v => handleFormChange('clientCompany', v)} placeholder="选择客户抬头">
                          <Option value="阿里巴巴集团">阿里巴巴集团</Option>
                          <Option value="京东物流有限公司">京东物流有限公司</Option>
                          <Option value="华为技术有限公司">华为技术有限公司</Option>
                          <Option value="小米科技有限公司">小米科技有限公司</Option>
                          <Option value="海尔集团公司">海尔集团公司</Option>
                          <Option value="宝钢集团有限公司">宝钢集团有限公司</Option>
                          <Option value="招商局集团">招商局集团</Option>
                          <Option value="中远海运集团">中远海运集团</Option>
                        </Select>
                      )}
                      {formState.clientType === '临时客户' && (
                        <Input style={{ width: '100%', marginTop: 8 }} value={formState.clientName} onChange={v => handleFormChange('clientName', v)} placeholder="请输入客户抬头" />
                      )}
                    </FormItem>
                  </Col>
                  {/* 拼箱询价不显示装箱门点区域 */}
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
                                onClick={() => setDeliveryAiModalVisible(true)}
                              >
                                AI识别
                              </Button>
                            </div>
                          </FormItem>
                        </div>
                        <FormItem label="配送地址类型" field="addressType" style={{ marginBottom: '12px' }}>
                          <RadioGroup 
                            value={formState.addressType}
                            onChange={v => handleFormChange('addressType', v)}
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
                                onChange={v => {
                                  handleFormChange('zipCode', v);
                                  // 如果邮编存在于映射中，自动填充地址
                                  if (v && zipCodeAddressMap[v]) {
                                    handleFormChange('address', zipCodeAddressMap[v]);
                                    Message.success(`已自动填充地址: ${zipCodeAddressMap[v]}`);
                                  }
                                }}
                                allowClear
                              />
                            </FormItem>
                            <FormItem label="地址" field="address" style={{ marginBottom: '12px' }}>
                              <Input 
                                placeholder="例如：San Diego, CA"
                                value={formState.address}
                                onChange={v => handleFormChange('address', v)}
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
                              onChange={v => handleFormChange('warehouseCode', v)}
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
                        value={formState.transitType || '不指定'}
                        onChange={(value) => handleFormChange('transitType', value)}
                      >
                        <Radio value="不指定">不指定</Radio>
                        <Radio value="直达">直达</Radio>
                        <Radio value="中转">中转</Radio>
                      </RadioGroup>
                    </FormItem>
                  </Col>
                  
                  <Col span={12}>
                    <FormItem label="航线" field="route">
                      <Select
                        placeholder="请选择航线" 
                        value={formState.route || '中美航线'}
                        onChange={(value) => handleFormChange('route', value)}
                        style={{ width: '100%' }}
                        showSearch
                        allowClear
                      >
                        <Option value="中美线">中美线</Option>
                        <Option value="中欧线">中欧线</Option>
                        <Option value="美加线">美加线</Option>
                        <Option value="欧地线">欧地线</Option>
                        <Option value="亚洲线">亚洲线</Option>
                        <Option value="澳新线">澳新线</Option>
                        <Option value="中东线">中东线</Option>
                        <Option value="非洲线">非洲线</Option>
                        <Option value="南美线">南美线</Option>
                        <Option value="中日线">中日线</Option>
                        <Option value="中韩线">中韩线</Option>
                        <Option value="东南亚线">东南亚线</Option>
                        <Option value="印巴线">印巴线</Option>
                        <Option value="红海线">红海线</Option>
                        <Option value="波斯湾线">波斯湾线</Option>
                      </Select>
                    </FormItem>
                  </Col>
                  
                  <Col span={12}>
                    <FormItem label="航线代码" field="lineCode">
                      <Input
                        placeholder="请输入航线代码" 
                        value={formState.lineCode}
                        onChange={(value) => handleFormChange('lineCode', value)}
                        style={{ width: '100%' }}
                        allowClear
                      />
                    </FormItem>
                  </Col>
                  
                  <Col span={24}>
                    <FormItem label="收货地" field="placeOfReceipt">
                      <Select
                        placeholder="请选择收货地" 
                        value={formState.placeOfReceipt}
                        onChange={(value) => handleFormChange('placeOfReceipt', value)}
                        style={{ width: '100%' }}
                        showSearch
                        allowClear
                      >
                        <Option value="PVG | Shanghai Pudong">PVG | Shanghai Pudong</Option>
                        <Option value="PEK | Beijing Capital">PEK | Beijing Capital</Option>
                        <Option value="CAN | Guangzhou Baiyun">CAN | Guangzhou Baiyun</Option>
                        <Option value="SZX | Shenzhen Baoan">SZX | Shenzhen Baoan</Option>
                        <Option value="CTU | Chengdu Shuangliu">CTU | Chengdu Shuangliu</Option>
                      </Select>
                    </FormItem>
                  </Col>
                  
                  <Col span={24}>
                    <FormItem label="起运港" field="departurePort" rules={[{ required: true, message: '请选择起运港' }]}>
                      <Select
                        placeholder="请选择起运港" 
                        value={formState.departurePort || 'PVG | Shanghai Pudong'}
                        onChange={(value) => handleFormChange('departurePort', value)}
                        style={{ width: '100%' }}
                        showSearch
                      >
                        <Option value="PVG | Shanghai Pudong">PVG | Shanghai Pudong</Option>
                        <Option value="PEK | Beijing Capital">PEK | Beijing Capital</Option>
                        <Option value="CAN | Guangzhou Baiyun">CAN | Guangzhou Baiyun</Option>
                        <Option value="SZX | Shenzhen Baoan">SZX | Shenzhen Baoan</Option>
                        <Option value="CTU | Chengdu Shuangliu">CTU | Chengdu Shuangliu</Option>
                      </Select>
                    </FormItem>
                  </Col>
                  
                  <Col span={24}>
                    <FormItem label="卸货港" field="dischargePort">
                      <Select
                        placeholder="请选择卸货港" 
                        value={formState.dischargePort}
                        onChange={(value) => handleFormChange('dischargePort', value)}
                        style={{ width: '100%' }}
                        showSearch
                        allowClear
                      >
                        <Option value="LAX | Los Angeles">LAX | Los Angeles</Option>
                        <Option value="JFK | New York">JFK | New York</Option>
                        <Option value="FRA | Frankfurt">FRA | Frankfurt</Option>
                        <Option value="LHR | London Heathrow">LHR | London Heathrow</Option>
                        <Option value="CDG | Paris Charles de Gaulle">CDG | Paris Charles de Gaulle</Option>
                      </Select>
                    </FormItem>
                  </Col>
                  
                  <Col span={24}>
                    <FormItem label="目的港" field="finalDestination" rules={[{ required: true, message: '请选择目的港' }]}>
                      <Select
                        placeholder="请选择目的港" 
                        value={formState.finalDestination || 'LAX | Los Angeles'}
                        onChange={(value) => handleFormChange('finalDestination', value)}
                        style={{ width: '100%' }}
                        showSearch
                      >
                        <Option value="LAX | Los Angeles">LAX | Los Angeles</Option>
                        <Option value="JFK | New York">JFK | New York</Option>
                        <Option value="FRA | Frankfurt">FRA | Frankfurt</Option>
                        <Option value="LHR | London Heathrow">LHR | London Heathrow</Option>
                        <Option value="CDG | Paris Charles de Gaulle">CDG | Paris Charles de Gaulle</Option>
                      </Select>
                    </FormItem>
                  </Col>
                  
                  {/* 中转港字段 - 仅在选择中转时显示 */}
                  {formState.transitType === '中转' && (
                    <>
                      <Col span={24}>
                        <FormItem label="中转港 (1st)" field="transitPort1st" rules={[{ required: true, message: '请选择第一中转港' }]}>
                          <Select
                            placeholder="请选择第一中转港" 
                            value={formState.transitPort1st}
                            onChange={(value) => handleFormChange('transitPort1st', value)}
                            style={{ width: '100%' }}
                            showSearch
                          >
                            <Option value="ICN | Seoul Incheon">ICN | Seoul Incheon</Option>
                            <Option value="NRT | Tokyo Narita">NRT | Tokyo Narita</Option>
                            <Option value="HKG | Hong Kong">HKG | Hong Kong</Option>
                            <Option value="SIN | Singapore">SIN | Singapore</Option>
                            <Option value="DXB | Dubai">DXB | Dubai</Option>
                            <Option value="AMS | Amsterdam">AMS | Amsterdam</Option>
                          </Select>
                        </FormItem>
                      </Col>
                      
                      <Col span={24}>
                        <FormItem label="中转港 (2nd)" field="transitPort2nd">
                          <Select
                            placeholder="请选择第二中转港" 
                            value={formState.transitPort2nd}
                            onChange={(value) => handleFormChange('transitPort2nd', value)}
                            style={{ width: '100%' }}
                            showSearch
                            allowClear
                          >
                            <Option value="ICN | Seoul Incheon">ICN | Seoul Incheon</Option>
                            <Option value="NRT | Tokyo Narita">NRT | Tokyo Narita</Option>
                            <Option value="HKG | Hong Kong">HKG | Hong Kong</Option>
                            <Option value="SIN | Singapore">SIN | Singapore</Option>
                            <Option value="DXB | Dubai">DXB | Dubai</Option>
                            <Option value="AMS | Amsterdam">AMS | Amsterdam</Option>
                          </Select>
                        </FormItem>
                      </Col>
                      
                      <Col span={24}>
                        <FormItem label="中转港 (3rd)" field="transitPort3rd">
                          <Select
                            placeholder="请选择第三中转港" 
                            value={formState.transitPort3rd}
                            onChange={(value) => handleFormChange('transitPort3rd', value)}
                            style={{ width: '100%' }}
                            showSearch
                            allowClear
                          >
                            <Option value="ICN | Seoul Incheon">ICN | Seoul Incheon</Option>
                            <Option value="NRT | Tokyo Narita">NRT | Tokyo Narita</Option>
                            <Option value="HKG | Hong Kong">HKG | Hong Kong</Option>
                            <Option value="SIN | Singapore">SIN | Singapore</Option>
                            <Option value="DXB | Dubai">DXB | Dubai</Option>
                            <Option value="AMS | Amsterdam">AMS | Amsterdam</Option>
                          </Select>
                        </FormItem>
                      </Col>
                    </>
                  )}
                  
                  <Col span={24}>
                    <FormItem label="货物类型" field="goodsType">
                      <Select 
                        placeholder="请选择" 
                        style={{ width: '100%' }}
                        value={formState.goodsType || '普货'}
                        onChange={(value) => handleFormChange('goodsType', value)}
                      >
                        <Option value="普货">普货</Option>
                        <Option value="危险品">危险品</Option>
                        <Option value="冷冻货">冷冻货</Option>
                        <Option value="活体动物">活体动物</Option>
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
                  
                  <Col span={12}>
                    <FormItem label="重量 (KGS)" field="weight" rules={[{ required: true, message: '请输入重量' }]}>
                      <Input 
                        placeholder="请输入重量" 
                        suffix="KGS"
                        value={formState.weight}
                        onChange={(value) => handleFormChange('weight', value)}
                      />
                    </FormItem>
                  </Col>
                  
                  <Col span={12}>
                    <FormItem label="体积 (CBM)" field="volume" rules={[{ required: true, message: '请输入体积' }]}>
                      <Input 
                        placeholder="请输入体积" 
                        suffix="CBM"
                        value={formState.volume}
                        onChange={(value) => handleFormChange('volume', value)}
                      />
                    </FormItem>
                  </Col>
                  
                  {/* 航空公司字段 */}
                  <Col span={12}>
                    <FormItem label="ETD" field="etd">
                      <DatePicker 
                        placeholder="请选择预计起飞日" 
                        style={{ width: '100%' }}
                        value={formState.etd}
                        onChange={(value) => handleFormChange('etd', value)}
                        allowClear
                      />
                    </FormItem>
                  </Col>
                  
                  <Col span={12}>
                    <FormItem label="ETA" field="eta">
                      <DatePicker 
                        placeholder="请选择预计到达日" 
                        style={{ width: '100%' }}
                        value={formState.eta}
                        onChange={(value) => handleFormChange('eta', value)}
                        allowClear
                      />
                    </FormItem>
                  </Col>
                  
                  <Col span={24}>
                    <FormItem label="航空公司" field="shipCompany">
                      <Select 
                        placeholder="不指定" 
                        style={{ width: '100%' }}
                        value={formState.shipCompany || '不指定'}
                        onChange={(value) => handleFormChange('shipCompany', value)}
                        allowClear
                      >
                        <Option value="不指定">不指定</Option>
                        <Option value="南方航空">南方航空</Option>
                        <Option value="东方航空">东方航空</Option>
                        <Option value="国际航空">国际航空</Option>
                        <Option value="海南航空">海南航空</Option>
                        <Option value="深圳航空">深圳航空</Option>
                      </Select>
                    </FormItem>
                  </Col>
                  
                  {/* 备注字段 */}
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
            </Col>
          </Row>
        </Card>

        {/* 干线运价匹配 */}
        {formState.mainlineChecked && (
          <Card className="mb-4">
            <div className="flex justify-between items-center mb-4">
              <div className="text-blue-600 font-bold border-l-4 border-blue-600 pl-2">空运干线运价匹配</div>
            </div>
            <div className="border rounded p-4">
              <Table 
                rowKey="id"
                data={airMainlineRateData}
                rowSelection={{
                  type: 'radio',
                  selectedRowKeys: selectedMainlineRate ? [selectedMainlineRate] : [],
                  onChange: (selectedRowKeys) => {
                    const selectedKey = selectedRowKeys[0]?.toString() || '';
                    setSelectedMainlineRate(selectedKey);
                  }
                }}
                columns={[
                  {
                    title: '航空公司',
                    dataIndex: 'shipCompany',
                    width: 120,
                  },
                  {
                    title: '操作',
                    width: 80,
                    render: (_, record) => (
                      <Button 
                        type="text" 
                        onClick={() => showRateDetail(record.id, 'mainline')}
                      >
                        费用明细
                      </Button>
                    ),
                  },
                  {
                    title: '运价编号',
                    dataIndex: 'rateNo',
                    width: 120,
                  },
                  {
                    title: '始发港',
                    dataIndex: 'departurePort',
                    width: 150,
                  },
                  {
                    title: '目的港',
                    dataIndex: 'dischargePort',
                    width: 150,
                  },
                  {
                    title: '有效期',
                    dataIndex: 'validPeriod',
                    width: 180,
                  },
                  {
                    title: '+45kg',
                    dataIndex: '+45',
                    width: 80,
                    render: (price) => `$${price}/kg`
                  },
                  {
                    title: '+100kg',
                    dataIndex: '+100',
                    width: 80,
                    render: (price) => `$${price}/kg`
                  },
                  {
                    title: '+300kg',
                    dataIndex: '+300',
                    width: 80,
                    render: (price) => `$${price}/kg`
                  },
                  {
                    title: '+500kg',
                    dataIndex: '+500',
                    width: 80,
                    render: (price) => `$${price}/kg`
                  },
                  {
                    title: '+1000kg',
                    dataIndex: '+1000',
                    width: 80,
                    render: (price) => `$${price}/kg`
                  }
                ]}
                pagination={false}
                className="mb-4"
              />
            </div>
          </Card>
        )}

        {/* 尾程运价匹配 */}
        {formState.lastmileChecked && (
          <Card className="mb-4">
            <div className="flex justify-between items-center mb-4">
              <div className="text-blue-600 font-bold border-l-4 border-blue-600 pl-2">尾程提货运价匹配</div>
            </div>
            <div className="border rounded p-4">
              <Table 
                rowKey="id"
                data={oncarriageRateData}
                rowSelection={{
                  type: 'checkbox',
                  selectedRowKeys: selectedOncarriageRates,
                  onChange: (selectedRowKeys) => {
                    setSelectedOncarriageRates(selectedRowKeys.map(key => key.toString()));
                  }
                }}
                columns={[
                  {
                    title: '编号',
                    dataIndex: 'certNo',
                    width: 100,
                  },
                  {
                    title: '操作',
                    width: 80,
                    render: (_, record) => (
                      <Button 
                        type="text" 
                        onClick={() => showRateDetail(record.id, 'oncarriage')}
                      >
                        费用明细
                      </Button>
                    ),
                  },
                  {
                    title: '起点',
                    dataIndex: 'origin',
                    width: 150,
                  },
                  {
                    title: '地址类型',
                    dataIndex: 'addressType',
                    width: 120,
                  },
                  {
                    title: '邮编',
                    dataIndex: 'zipCode',
                    width: 100,
                  },
                  {
                    title: '地址',
                    dataIndex: 'address',
                    width: 150,
                  },
                  {
                    title: '仓库代码',
                    dataIndex: 'warehouseCode',
                    width: 120,
                    render: (text) => text || '/'
                  },
                  {
                    title: '承运人',
                    dataIndex: 'agentName',
                    width: 150,
                  },
                  {
                    title: '有效期',
                    dataIndex: 'validDateRange',
                    width: 180,
                  }
                ]}
                pagination={false}
                className="mb-4"
              />
            </div>
          </Card>
        )}

        {/* 运价详情弹窗 */}
        <Modal
          title={`${currentRateType === 'mainline' ? '空运干线运价' : '尾程提货运价'}详情`}
          visible={rateDetailVisible}
          onOk={closeRateDetail}
          onCancel={closeRateDetail}
          autoFocus={false}
          focusLock={true}
          maskClosable={false}
          style={{ width: 800 }}
        >
          <div className="border-b mb-4 pb-2">
            <div className="text-gray-600 font-bold mb-2">基本费用</div>
            <Table
              rowKey="key"
              columns={[
                { title: '费用名称', dataIndex: 'name', width: 200 },
                { title: '费用价格', dataIndex: 'price', width: 120 },
                { title: '币种', dataIndex: 'currency', width: 80 },
                { title: '计费单位', dataIndex: 'unit', width: 100 },
                { title: '备注', dataIndex: 'remark' }
              ]}
              data={currentRateDetail ? getRateDetail(currentRateDetail, currentRateType).basic : []}
              pagination={false}
              className="mb-4"
            />
          </div>
          {currentRateType === 'mainline' && (
            <>
              <div className="border-b mb-4 pb-2">
                <div className="text-gray-600 font-bold mb-2">始发港费用</div>
                <Table
                  rowKey="key"
                  columns={[
                    { title: '费用名称', dataIndex: 'name', width: 200 },
                    { title: '费用价格', dataIndex: 'price', width: 120 },
                    { title: '币种', dataIndex: 'currency', width: 80 },
                    { title: '计费单位', dataIndex: 'unit', width: 100 },
                    { title: '备注', dataIndex: 'remark' }
                  ]}
                  data={currentRateDetail ? getRateDetail(currentRateDetail, currentRateType).origin : []}
                  pagination={false}
                  className="mb-4"
                />
              </div>
              <div>
                <div className="text-gray-600 font-bold mb-2">目的港费用</div>
                <Table
                  rowKey="key"
                  columns={[
                    { title: '费用名称', dataIndex: 'name', width: 200 },
                    { title: '费用价格', dataIndex: 'price', width: 120 },
                    { title: '币种', dataIndex: 'currency', width: 80 },
                    { title: '计费单位', dataIndex: 'unit', width: 100 },
                    { title: '备注', dataIndex: 'remark' }
                  ]}
                  data={currentRateDetail ? getRateDetail(currentRateDetail, currentRateType).destination : []}
                  pagination={false}
                  className="mb-4"
                />
              </div>
            </>
          )}
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
                支持识别：机场信息、航空公司、重量体积、直达/中转、航线、货物类型、服务条款等信息
              </p>
              <Input.TextArea
                value={globalAiText}
                onChange={(value) => setGlobalAiText(value)}
                placeholder="请粘贴需要识别的文本内容，例如：
从 PVG | Shanghai Pudong 到 LAX | Los Angeles
航空公司：国航
重量：1200 KGS
体积：3.5 CBM
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

        {/* 尾程地址AI识别弹窗 */}
        <Modal
          title="AI地址识别"
          visible={deliveryAiModalVisible}
          onOk={handleDeliveryAiRecognize}
          onCancel={() => setDeliveryAiModalVisible(false)}
          autoFocus={false}
          focusLock={true}
          maskClosable={false}
        >
          <div className="mb-4">
            <div className="text-gray-600 font-bold mb-2">请输入地址文本（中英文均可识别）</div>
            <Input.TextArea 
              placeholder="请粘贴地址文本，系统将自动识别格式化" 
              style={{ minHeight: '120px' }}
              value={deliveryAddressText}
              onChange={setDeliveryAddressText}
            />
          </div>
        </Modal>

        {/* 提交时选择负责人弹窗 */}
        <Modal
          title="选择负责人"
          visible={managerSelectVisible}
          onOk={confirmManagerSelect}
          onCancel={() => setManagerSelectVisible(false)}
          autoFocus={false}
          focusLock={true}
          maskClosable={false}
        >
          <div className="mb-4">
            <div className="text-gray-600 font-bold mb-2">尾程负责人</div>
            <Select 
              placeholder="请选择尾程负责人" 
              style={{ width: '100%' }}
              value={selectedLastMileManager}
              onChange={(value) => setSelectedLastMileManager(value)}
            >
              <Option value="王经理">王经理</Option>
              <Option value="李经理">李经理</Option>
              <Option value="张经理">张经理</Option>
              <Option value="刘经理">刘经理</Option>
            </Select>
          </div>
        </Modal>
      </Form>
    </ControlTowerSaasLayout>
  );
};

export default CreateAirInquiry; 