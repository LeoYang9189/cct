import React, { useState, useEffect } from 'react';
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
  DatePicker,
  Modal,
  Message,
  Table,
  Switch,
  InputNumber,
  Tag
} from '@arco-design/web-react';
import { IconSave, IconDelete, IconRobot, IconPlus, IconSettings, IconUpload, IconArrowLeft, IconFile } from '@arco-design/web-react/icon';
import { useNavigate, useParams } from 'react-router-dom';
import ControlTowerSaasLayout from "./ControlTowerSaasLayout";
import './CreateFclInquiry.css'; // 复用已有的CSS

const { Title } = Typography;
const { Row, Col } = Grid;
const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

// 按箱型计费项目接口
interface ContainerRateItem {
  key: number;
  feeName: string;
  currency: string;
  '20gp': string;
  '40gp': string;
  '40hc': string;
  '45hc': string;
  '40nor': string;
  '20nor': string;
  '20hc': string;
  '20tk': string;
  '40tk': string;
  '20ot': string;
  '40ot': string;
  '20fr': string;
  '40fr': string;
  specialNote: string;
}

// 非按箱型计费项目接口
interface NonContainerRateItem {
  key: number;
  feeName: string;
  currency: string;
  unit: string;
  price: string;
  specialNote: string;
}

// 定义类型接口
interface ContainerInfo {
  type: string;
  count: number;
}

interface MainlineRate {
  id: string;
  certNo: string;
  departurePort: string;
  dischargePort: string;
  shipCompany: string;
  validPeriod: string;
  transitType: string;
  '20GP': string;
  '40GP': string;
  '40HC': string;
  transitTime: string;
  etd: string;
  eta: string;
  price: string;
  currency: string;
}

interface PrecarriageRate {
  id: string;
  certNo: string;
  type: string;
  origin: string;
  destination: string;
  vendor: string;
  '20GP': string;
  '40GP': string;
  '40HC': string;
  price: string;
  currency: string;
}

interface OncarriageRate {
  id: string;
  certNo: string;
  destination: string;
  addressType: string;
  zipCode: string;
  address: string;
  agentName: string;
  price: string;
  currency: string;
}

interface QuoteForm {
  quoteNo: string;
  inquiryNo: string;
  quoter: string;
  quoteType: 'fcl' | 'lcl' | 'air';
  cargoReadyTime: string;
  cargoNature: string;
  shipCompany: string;
  transitType: string;
  route: string;
  departurePort: string;
  dischargePort: string;
  remark: string;
  clientType: string;
  clientName: string;
  validityDate: string[];
  // 整箱特有字段
  containerInfo?: ContainerInfo[];
  // 拼箱/空运特有字段
  weight?: string;
  volume?: string;
  // 报价方案数据
  mainlineRates: MainlineRate[];
  precarriageRates: PrecarriageRate[];
  oncarriageRates: OncarriageRate[];
}

/**
 * 整箱运价新增/编辑页面
 */
const CreateFclRate: React.FC = () => {
  const navigate = useNavigate();
  const { type, id } = useParams<{ type?: string; id?: string }>();

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  
  // 判断是否为编辑模式
  const isEditMode = Boolean(id);
  const rateId = id;
  
  // 基本信息状态
  const [rateType, setRateType] = useState('合约价');
  const [transitType, setTransitType] = useState('直达');
  
  // 按箱型计费列表状态
  const [containerRateList, setContainerRateList] = useState<ContainerRateItem[]>([
    {
      key: 1,
      feeName: '海运费',
      currency: 'USD',
      '20gp': '',
      '40gp': '',
      '40hc': '',
      '45hc': '',
      '40nor': '',
      '20nor': '',
      '20hc': '',
      '20tk': '',
      '40tk': '',
      '20ot': '',
      '40ot': '',
      '20fr': '',
      '40fr': '',
      specialNote: ''
    }
  ]);
  
  // 非按箱型计费列表状态
  const [nonContainerRateList, setNonContainerRateList] = useState<NonContainerRateItem[]>([
    {
      key: 1,
      feeName: '订舱费',
      currency: 'USD',
      unit: '票',
      price: '',
      specialNote: ''
    }
  ]);
  
  // 箱型显示设置 - 与FclRates.tsx保持一致
  const [boxTypeVisibility, setBoxTypeVisibility] = useState({
    '20gp': true,
    '40gp': true,
    '40hc': true,
    '20nor': true,
    '40nor': true,
    '45hc': true,
    '20hc': false,
    '20tk': false,
    '40tk': false,
    '20ot': false,
    '40ot': false,
    '20fr': false,
    '40fr': false
  });
  
  // 模态框状态
  const [boxTypeModalVisible, setBoxTypeModalVisible] = useState(false);
  const [aiModalVisible, setAiModalVisible] = useState(false);
  
  // 在组件加载时检查编辑模式并加载数据
  useEffect(() => {
    if (isEditMode && rateId) {
      loadRateData(rateId);
    }
  }, [isEditMode, rateId]);

  // 加载编辑数据
  const loadRateData = async (id: string) => {
    try {
      setLoading(true);
      // 模拟API调用获取运价数据
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 模拟返回的数据
      const mockData: QuoteForm = {
        quoteNo: id,
        inquiryNo: 'INQ2024050001',
        quoter: '张三',
        quoteType: type === 'fcl' || type === 'lcl' || type === 'air' ? type : 'fcl',
        cargoReadyTime: '1周内',
        cargoNature: '实盘',
        shipCompany: '地中海',
        transitType: '直达',
        route: '美加线',
        departurePort: 'CNSHA',
        dischargePort: 'USLAX',
        remark: '电子产品 优先考虑直达航线',
        clientType: '正式客户',
        clientName: '上海测试公司',
        validityDate: ['2024-06-01', '2024-06-30'],
        containerInfo: type === 'fcl' ? [
          { type: '20GP', count: 1 },
          { type: '40HC', count: 2 }
        ] : undefined,
        weight: type === 'lcl' ? '1200' : undefined,
        volume: type === 'lcl' ? '3.5' : undefined,
        mainlineRates: [
          {
            id: '1',
            certNo: 'M001',
            departurePort: 'CNSHA | Shanghai',
            dischargePort: 'USLAX | Los Angeles',
            shipCompany: '地中海',
            validPeriod: '2024-06-01 ~ 2024-07-01',
            transitType: '直达',
            '20GP': '1500',
            '40GP': '2800',
            '40HC': '2900',
            transitTime: '14天',
            etd: '2024-07-10',
            eta: '2024-07-24',
            price: '2900',
            currency: 'USD'
          }
        ],
        precarriageRates: [
          {
            id: '1',
            certNo: 'P001',
            type: '直达',
            origin: '苏州工业园区',
            destination: '洋山港',
            vendor: '德邦专线',
            '20GP': '800',
            '40GP': '1200',
            '40HC': '1300',
            price: '1300',
            currency: 'CNY'
          }
        ],
        oncarriageRates: [
          {
            id: '1',
            certNo: 'O001',
            destination: 'San Diego, CA',
            addressType: '第三方地址',
            zipCode: '92101',
            address: 'San Diego, CA',
            agentName: 'XPO TRUCK LLC',
            price: '800',
            currency: 'USD'
          }
        ]
      };
      
      // 设置表单数据
      form.setFieldsValue(mockData);
      
      Message.success('运价数据加载成功');
    } catch (error) {
      console.error('加载运价数据失败:', error);
      Message.error('加载运价数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 保存表单
  const handleSave = async () => {
    try {
      setLoading(true);
      const values = await form.validate();
      
      // 构建提交数据
      const submitData = {
        ...values,
        containerRates: containerRateList,
        nonContainerRates: nonContainerRateList,
        boxTypeVisibility
      };
      
      console.log('提交数据:', submitData);
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Message.success(isEditMode ? '整箱运价更新并上架成功！' : '整箱运价创建并上架成功！');
      navigate('/controltower/saas/fcl-rates');
    } catch (error) {
      console.error('保存失败:', error);
      Message.error('保存失败，请检查必填项');
    } finally {
      setLoading(false);
    }
  };

  // 保存草稿
  const handleSaveDraft = async () => {
    try {
      setLoading(true);
      const values = form.getFieldsValue();
      
      // 构建草稿数据
      const draftData = {
        ...values,
        containerRates: containerRateList,
        nonContainerRates: nonContainerRateList,
        boxTypeVisibility,
        status: 'draft'
      };
      
      console.log('保存草稿:', draftData);
      
      // 模拟API调用生成运价号
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 生成运价号（仅在新增模式下）
      if (!isEditMode) {
        const generatedRouteCode = `FCL${Date.now()}`;
        form.setFieldValue('routeCode', generatedRouteCode);
      }
      
      Message.success('草稿保存成功' + (!isEditMode ? '，运价号已生成！' : '！'));
    } catch (error) {
      console.error('保存草稿失败:', error);
      Message.error('保存草稿失败');
    } finally {
      setLoading(false);
    }
  };

  // 返回列表页
  const handleGoBack = () => {
    navigate('/controltower/saas/fcl-rates');
  };

  // 添加按箱型计费项目
  const addContainerRateItem = () => {
    const newKey = containerRateList.length > 0 ? Math.max(...containerRateList.map(item => item.key)) + 1 : 1;
    setContainerRateList([...containerRateList, {
      key: newKey,
      feeName: '附加费',
      currency: 'USD',
      '20gp': '',
      '40gp': '',
      '40hc': '',
      '45hc': '',
      '40nor': '',
      '20nor': '',
      '20hc': '',
      '20tk': '',
      '40tk': '',
      '20ot': '',
      '40ot': '',
      '20fr': '',
      '40fr': '',
      specialNote: ''
    }]);
  };
  
  // 添加非按箱型计费项目
  const addNonContainerRateItem = () => {
    const newKey = nonContainerRateList.length > 0 ? Math.max(...nonContainerRateList.map(item => item.key)) + 1 : 1;
    setNonContainerRateList([...nonContainerRateList, {
      key: newKey,
      feeName: '文件费',
      currency: 'USD',
      unit: '票',
      price: '',
      specialNote: ''
    }]);
  };
  
  // 删除按箱型计费项目
  const removeContainerRateItem = (key: number) => {
    if (containerRateList.length === 1) {
      Message.warning('至少需要保留一个运价项目');
      return;
    }
    const newRateList = containerRateList.filter(item => item.key !== key);
    setContainerRateList(newRateList);
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

  // 更新按箱型计费项目字段
  const updateContainerRateItem = (key: number, field: string, value: string | number) => {
    const newRateList = containerRateList.map(item => {
      if (item.key === key) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setContainerRateList(newRateList);
  };

  // 更新非按箱型计费项目字段
  const updateNonContainerRateItem = (key: number, field: string, value: string | number) => {
    const newRateList = nonContainerRateList.map(item => {
      if (item.key === key) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setNonContainerRateList(newRateList);
  };



  return (
    <ControlTowerSaasLayout menuSelectedKey="2" breadcrumb={
      <Breadcrumb>
        <Breadcrumb.Item>控制塔</Breadcrumb.Item>
        <Breadcrumb.Item>运价维护</Breadcrumb.Item>
        <Breadcrumb.Item>整箱运价</Breadcrumb.Item>
        <Breadcrumb.Item>{isEditMode ? '编辑整箱运价' : '新增整箱运价'}</Breadcrumb.Item>
      </Breadcrumb>
    }>
      <div style={{ padding: '16px' }}>
        <Card style={{ marginBottom: '20px' }}>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <Title heading={4} style={{ margin: 0 }}>{isEditMode ? '编辑整箱运价' : '新增整箱运价'}</Title>
              <div className="flex items-center">
                <span className="text-gray-500 mr-2">运价状态：</span>
                <Tag color="orange" size="small">草稿</Tag>
              </div>
            </div>
            <Space>
               <Button onClick={handleGoBack} icon={<IconArrowLeft />}>返回</Button>
               <Button 
                 icon={<IconRobot />}
                 onClick={() => setAiModalVisible(true)}
                 style={{
                   background: 'linear-gradient(45deg, #1890ff, #4dabf5)',
                   border: 'none',
                   color: 'white'
                 }}
               >
                 AI识别
               </Button>
               <Button loading={loading} onClick={handleSaveDraft} icon={<IconFile />}>
                 保存草稿
               </Button>
               <Button type="primary" loading={loading} onClick={handleSave} icon={<IconSave />}>
                 直接上架
               </Button>
             </Space>
          </div>

                   <Form
             form={form}
             layout="vertical"
             requiredSymbol={{ position: 'start' }}
             initialValues={{
               rateType: '合约价',
               transitType: '直达',
               validFrom: new Date(),
               validToDate: new Date(new Date().setMonth(new Date().getMonth() + 6))
             }}
           >
            {/* 基本信息区域 */}
            <Card title="基本信息" className="mb-6">
              <Row gutter={24}>
                <Col span={6}>
                  <FormItem label="运价号" field="routeCode">
                    <Input 
                      placeholder={isEditMode ? "运价号" : "保存草稿后自动生成"} 
                      disabled={!isEditMode} 
                    />
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem label="运价类型" field="rateType" required>
                    <Select placeholder="请选择运价类型" value={rateType} onChange={setRateType}>
                      <Option value="合约价">合约价</Option>
                      <Option value="SPOT电商">SPOT电商</Option>
                    </Select>
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem label="货物类型" field="cargoType">
                    <Select placeholder="请选择货物类型">
                      <Option value="普货">普货</Option>
                      <Option value="危险品">危险品</Option>
                      <Option value="冷冻品">冷冻品</Option>
                      <Option value="特种箱">特种箱</Option>
                      <Option value="卷钢">卷钢</Option>
                      <Option value="液体">液体</Option>
                      <Option value="化工品">化工品</Option>
                      <Option value="纺织品">纺织品</Option>
                    </Select>
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem label="舱位状态" field="spaceStatus">
                    <Select placeholder="请选择舱位状态">
                      <Option value="畅接">畅接</Option>
                      <Option value="正常">正常</Option>
                      <Option value="单票申请">单票申请</Option>
                      <Option value="爆舱">爆舱</Option>
                      <Option value="不接">不接</Option>
                    </Select>
                  </FormItem>
                </Col>
              </Row>
              
              <Row gutter={24}>
                <Col span={6}>
                  <FormItem label="价格趋势" field="priceStatus">
                    <Select placeholder="请选择价格趋势">
                      <Option value="价格上涨">价格上涨</Option>
                      <Option value="价格下调">价格下调</Option>
                      <Option value="价格稳定">价格稳定</Option>
                    </Select>
                  </FormItem>
                </Col>
              </Row>
            </Card>

            {/* 航线信息区域 */}
            <Card title="航线信息" className="mb-6">
              <Row gutter={24}>
                <Col span={6}>
                  <FormItem label="收货地" field="placeOfReceipt">
                    <Select placeholder="请选择收货地" showSearch allowClear>
                      <Option value="CNSHA">CNSHA | 上海</Option>
                      <Option value="CNNGB">CNNGB | 宁波</Option>
                      <Option value="CNYTN">CNYTN | 烟台</Option>
                      <Option value="CNQIN">CNQIN | 青岛</Option>
                      <Option value="CNTAO">CNTAO | 青岛</Option>
                    </Select>
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem label="起运港" field="departurePort" required>
                    <Select placeholder="请选择起运港" showSearch>
                      <Option value="CNSHA">CNSHA | 上海</Option>
                      <Option value="CNNGB">CNNGB | 宁波</Option>
                      <Option value="CNYTN">CNYTN | 烟台</Option>
                      <Option value="CNQIN">CNQIN | 青岛</Option>
                      <Option value="CNTAO">CNTAO | 青岛</Option>
                    </Select>
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem label="卸货港" field="dischargePort">
                    <Select placeholder="请选择卸货港" showSearch allowClear>
                      <Option value="USLAX">USLAX | 洛杉矶</Option>
                      <Option value="USNYC">USNYC | 纽约</Option>
                      <Option value="USLGB">USLGB | 长滩</Option>
                      <Option value="USOAK">USOAK | 奥克兰</Option>
                      <Option value="USSAT">USSAT | 萨凡纳</Option>
                    </Select>
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem label="目的港" field="finalDestination" required>
                    <Select placeholder="请选择目的港" showSearch>
                      <Option value="USLAX">USLAX | 洛杉矶</Option>
                      <Option value="USNYC">USNYC | 纽约</Option>
                      <Option value="USLGB">USLGB | 长滩</Option>
                      <Option value="USOAK">USOAK | 奥克兰</Option>
                      <Option value="USSAT">USSAT | 萨凡纳</Option>
                    </Select>
                  </FormItem>
                </Col>
              </Row>
              
              <Row gutter={24}>
                <Col span={6}>
                  <FormItem label="航线" field="routeLine">
                    <Select placeholder="请选择航线" showSearch allowClear>
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
                <Col span={6}>
                  <FormItem label="航线代码" field="lineCode">
                    <Input placeholder="请输入航线代码" allowClear />
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem label="直达/中转" field="transitType" required>
                    <Select placeholder="请选择运输方式" value={transitType} onChange={setTransitType}>
                      <Option value="直达">直达</Option>
                      <Option value="中转">中转</Option>
                    </Select>
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem label={type === 'air' ? "航空公司" : "船名"} field="shipName">
                    {type === 'air' ? (
                      <Select placeholder="请选择航空公司" showSearch>
                        <Option value="CA">中国国际航空</Option>
                        <Option value="MU">中国东方航空</Option>
                        <Option value="CZ">中国南方航空</Option>
                        <Option value="HU">海南航空</Option>
                        <Option value="9C">春秋航空</Option>
                        <Option value="GJ">长龙航空</Option>
                      </Select>
                    ) : (
                      <Input placeholder="请输入船名" />
                    )}
                  </FormItem>
                </Col>
              </Row>
              
              <Row gutter={24}>
                <Col span={6}>
                  <FormItem label={type === 'air' ? "航班号" : "航次"} field="voyageNumber">
                    <Input placeholder={type === 'air' ? "请输入航班号" : "请输入航次"} />
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem label={type === 'air' ? "班期" : "船期"} field="vesselSchedule">
                    <Select placeholder={type === 'air' ? "请选择班期" : "请选择船期"} mode="multiple">
                      <Option value="周一">周一</Option>
                      <Option value="周二">周二</Option>
                      <Option value="周三">周三</Option>
                      <Option value="周四">周四</Option>
                      <Option value="周五">周五</Option>
                      <Option value="周六">周六</Option>
                      <Option value="周日">周日</Option>
                    </Select>
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem label="航程" field="voyage">
                    <InputNumber placeholder="请输入航程(天)" min={0} />
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem label="ETD" field="etd">
                    <DatePicker placeholder="请选择预计开船日" style={{ width: '100%' }} />
                  </FormItem>
                </Col>
              </Row>
              
              <Row gutter={24}>
                <Col span={6}>
                  <FormItem label="ETA" field="eta">
                    <DatePicker placeholder="请选择预计到港日" style={{ width: '100%' }} />
                  </FormItem>
                </Col>
              </Row>
              
              {transitType === '中转' && (
                <Row gutter={24}>
                  <Col span={6}>
                    <FormItem label="中转港 (1st)" field="transitPort1st" required>
                      <Select placeholder="请选择第一中转港" showSearch>
                        <Option value="KRPUS">KRPUS | 釜山</Option>
                        <Option value="SGSIN">SGSIN | 新加坡</Option>
                        <Option value="HKHKG">HKHKG | 香港</Option>
                        <Option value="JPYOK">JPYOK | 横滨</Option>
                        <Option value="JPKOB">JPKOB | 神户</Option>
                        <Option value="MYTPP">MYTPP | 巴生港</Option>
                      </Select>
                    </FormItem>
                  </Col>
                  <Col span={6}>
                    <FormItem label="中转港 (2nd)" field="transitPort2nd">
                      <Select placeholder="请选择第二中转港" showSearch allowClear>
                        <Option value="KRPUS">KRPUS | 釜山</Option>
                        <Option value="SGSIN">SGSIN | 新加坡</Option>
                        <Option value="HKHKG">HKHKG | 香港</Option>
                        <Option value="JPYOK">JPYOK | 横滨</Option>
                        <Option value="JPKOB">JPKOB | 神户</Option>
                        <Option value="MYTPP">MYTPP | 巴生港</Option>
                      </Select>
                    </FormItem>
                  </Col>
                  <Col span={6}>
                    <FormItem label="中转港 (3rd)" field="transitPort3rd">
                      <Select placeholder="请选择第三中转港" showSearch allowClear>
                        <Option value="KRPUS">KRPUS | 釜山</Option>
                        <Option value="SGSIN">SGSIN | 新加坡</Option>
                        <Option value="HKHKG">HKHKG | 香港</Option>
                        <Option value="JPYOK">JPYOK | 横滨</Option>
                        <Option value="JPKOB">JPKOB | 神户</Option>
                        <Option value="MYTPP">MYTPP | 巴生港</Option>
                      </Select>
                    </FormItem>
                  </Col>
                </Row>
              )}
            </Card>

            {/* 船公司信息区域 */}
            <Card title="船公司信息" className="mb-6">
              <Row gutter={24}>
                <Col span={6}>
                  <FormItem label="船公司" field="shipCompany" required>
                    <Select placeholder="请选择船公司" showSearch>
                      <Option value="COSCO">中远海运</Option>
                      <Option value="MSC">地中海</Option>
                      <Option value="MAERSK">马士基</Option>
                      <Option value="EVERGREEN">长荣</Option>
                      <Option value="HMM">现代商船</Option>
                      <Option value="ONE">ONE</Option>
                    </Select>
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem label="约号" field="contractNo">
                    <Select placeholder="请选择约号" showSearch>
                      <Option value="CONTRACT001">CONTRACT001</Option>
                      <Option value="CONTRACT002">CONTRACT002</Option>
                      <Option value="CONTRACT003">CONTRACT003</Option>
                      <Option value="SPOT">SPOT</Option>
                    </Select>
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem label="NAC" field="nac">
                    <Select placeholder="请选择NAC">
                      <Option value="NAC01">NAC01</Option>
                      <Option value="NAC02">NAC02</Option>
                      <Option value="NAC03">NAC03</Option>
                    </Select>
                  </FormItem>
                </Col>
              </Row>
            </Card>

            {/* 免费期限设置 */}
            <Card title="D&D" className="mb-6">
              <Row gutter={24}>
                <Col span={8}>
                  <FormItem label="免用箱" field="freeContainerDays">
                    <InputNumber placeholder="请输入免用箱(天)" min={0} />
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="免堆存" field="freeStorageDays">
                    <InputNumber placeholder="请输入免堆存(天)" min={0} />
                  </FormItem>
                </Col>
              </Row>
            </Card>

            {/* 有效期设置 */}
            <Card title="有效期设置" className="mb-6">
              <Row gutter={24}>
                <Col span={12}>
                  <FormItem label="有效期" field="validPeriod" required>
                    <RangePicker
                      showTime={{ format: 'HH:mm' }}
                      format="YYYY-MM-DD HH:mm"
                      placeholder={['开始时间', '结束时间']}
                      style={{ width: '100%' }}
                    />
                  </FormItem>
                </Col>
              </Row>
            </Card>

            {/* 备注信息 */}
            <Card title="备注信息" className="mb-6">
              <Row gutter={24}>
                <Col span={12}>
                  <FormItem label="超重说明" field="overweightNote">
                    <Input placeholder="请输入超重说明" />
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem label="接货特殊说明" field="chargeSpecialNote">
                    <Input placeholder="请输入接货特殊说明" />
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={24}>
                  <FormItem label="备注" field="notes">
                    <Input.TextArea placeholder="请输入备注" rows={3} />
                  </FormItem>
                </Col>
              </Row>
            </Card>

            {/* 运价明细区域 */}
            <Card title="运价明细" className="mb-6">
              {/* 按箱型计费区域 */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-blue-600 font-bold border-l-4 border-blue-600 pl-2">按箱型计费</div>
                  <Space>
                    <Button 
                      size="small" 
                      icon={<IconSettings />}
                      onClick={() => setBoxTypeModalVisible(true)}
                    >
                      箱型设置
                    </Button>
                    <Button 
                      type="primary" 
                      size="small" 
                      icon={<IconPlus />}
                      onClick={addContainerRateItem}
                    >
                      添加项目
                    </Button>
                  </Space>
                </div>
                
                <Table
                  borderCell={true}
                  columns={[
                    {
                      title: '费用名称',
                      dataIndex: 'feeName',
                      width: 180,
                      render: (_: unknown, record: ContainerRateItem) => (
                        <Select 
                          value={record.feeName}
                          style={{ width: '100%' }}
                          onChange={(value) => updateContainerRateItem(record.key, 'feeName', value)}
                        >
                          <Option value="海运费">海运费</Option>
                          <Option value="附加费">附加费</Option>
                          <Option value="燃油费">燃油费</Option>
                          <Option value="港杂费">港杂费</Option>
                          <Option value="THC">THC</Option>
                          <Option value="DDC">DDC</Option>
                          <Option value="PSS">PSS</Option>
                          <Option value="EBS">EBS</Option>
                        </Select>
                      )
                    },
                    {
                      title: '币种',
                      dataIndex: 'currency',
                      width: 120,
                      render: (_: unknown, record: ContainerRateItem) => (
                        <Select 
                          value={record.currency}
                          style={{ width: '100%' }}
                          onChange={(value) => updateContainerRateItem(record.key, 'currency', value)}
                        >
                          <Option value="USD">USD</Option>
                          <Option value="CNY">CNY</Option>
                          <Option value="EUR">EUR</Option>
                        </Select>
                      )
                    },
                    ...(boxTypeVisibility['20gp'] ? [{
                      title: '20GP',
                      dataIndex: '20gp',
                      width: 120,
                      render: (_: unknown, record: ContainerRateItem) => (
                        <InputNumber
                          value={record['20gp'] || ''}
                          style={{ width: '100%' }}
                          placeholder="请输入价格"
                          onChange={(value) => updateContainerRateItem(record.key, '20gp', value || '')}
                          precision={2}
                        />
                      )
                    }] : []),
                    ...(boxTypeVisibility['40gp'] ? [{
                      title: '40GP',
                      dataIndex: '40gp',
                      width: 120,
                      render: (_: unknown, record: ContainerRateItem) => (
                        <InputNumber
                          value={record['40gp'] || ''}
                          style={{ width: '100%' }}
                          placeholder="请输入价格"
                          onChange={(value) => updateContainerRateItem(record.key, '40gp', value || '')}
                          precision={2}
                        />
                      )
                    }] : []),
                    ...(boxTypeVisibility['40hc'] ? [{
                      title: '40HC',
                      dataIndex: '40hc',
                      width: 120,
                      render: (_: unknown, record: ContainerRateItem) => (
                        <InputNumber
                          value={record['40hc'] || ''}
                          style={{ width: '100%' }}
                          placeholder="请输入价格"
                          onChange={(value) => updateContainerRateItem(record.key, '40hc', value || '')}
                          precision={2}
                        />
                      )
                    }] : []),
                    ...(boxTypeVisibility['20nor'] ? [{
                      title: '20NOR',
                      dataIndex: '20nor',
                      width: 120,
                      render: (_: unknown, record: ContainerRateItem) => (
                        <InputNumber
                          value={record['20nor'] || ''}
                          style={{ width: '100%' }}
                          placeholder="请输入价格"
                          onChange={(value) => updateContainerRateItem(record.key, '20nor', value || '')}
                          precision={2}
                        />
                      )
                    }] : []),
                    ...(boxTypeVisibility['40nor'] ? [{
                      title: '40NOR',
                      dataIndex: '40nor',
                      width: 120,
                      render: (_: unknown, record: ContainerRateItem) => (
                        <InputNumber
                          value={record['40nor'] || ''}
                          style={{ width: '100%' }}
                          placeholder="请输入价格"
                          onChange={(value) => updateContainerRateItem(record.key, '40nor', value || '')}
                          precision={2}
                        />
                      )
                    }] : []),
                    ...(boxTypeVisibility['45hc'] ? [{
                      title: '45HC',
                      dataIndex: '45hc',
                      width: 120,
                      render: (_: unknown, record: ContainerRateItem) => (
                        <InputNumber
                          value={record['45hc'] || ''}
                          style={{ width: '100%' }}
                          placeholder="请输入价格"
                          onChange={(value) => updateContainerRateItem(record.key, '45hc', value || '')}
                          precision={2}
                        />
                      )
                    }] : []),
                    ...(boxTypeVisibility['20hc'] ? [{
                      title: '20HC',
                      dataIndex: '20hc',
                      width: 120,
                      render: (_: unknown, record: ContainerRateItem) => (
                        <InputNumber
                          value={record['20hc'] || ''}
                          style={{ width: '100%' }}
                          placeholder="请输入价格"
                          onChange={(value) => updateContainerRateItem(record.key, '20hc', value || '')}
                          precision={2}
                        />
                      )
                    }] : []),
                    ...(boxTypeVisibility['20tk'] ? [{
                      title: '20TK',
                      dataIndex: '20tk',
                      width: 120,
                      render: (_: unknown, record: ContainerRateItem) => (
                        <InputNumber
                          value={record['20tk'] || ''}
                          style={{ width: '100%' }}
                          placeholder="请输入价格"
                          onChange={(value) => updateContainerRateItem(record.key, '20tk', value || '')}
                          precision={2}
                        />
                      )
                    }] : []),
                    ...(boxTypeVisibility['40tk'] ? [{
                      title: '40TK',
                      dataIndex: '40tk',
                      width: 120,
                      render: (_: unknown, record: ContainerRateItem) => (
                        <InputNumber
                          value={record['40tk'] || ''}
                          style={{ width: '100%' }}
                          placeholder="请输入价格"
                          onChange={(value) => updateContainerRateItem(record.key, '40tk', value || '')}
                          precision={2}
                        />
                      )
                    }] : []),
                    ...(boxTypeVisibility['20ot'] ? [{
                      title: '20OT',
                      dataIndex: '20ot',
                      width: 120,
                      render: (_: unknown, record: ContainerRateItem) => (
                        <InputNumber
                          value={record['20ot'] || ''}
                          style={{ width: '100%' }}
                          placeholder="请输入价格"
                          onChange={(value) => updateContainerRateItem(record.key, '20ot', value || '')}
                          precision={2}
                        />
                      )
                    }] : []),
                    ...(boxTypeVisibility['40ot'] ? [{
                      title: '40OT',
                      dataIndex: '40ot',
                      width: 120,
                      render: (_: unknown, record: ContainerRateItem) => (
                        <InputNumber
                          value={record['40ot'] || ''}
                          style={{ width: '100%' }}
                          placeholder="请输入价格"
                          onChange={(value) => updateContainerRateItem(record.key, '40ot', value || '')}
                          precision={2}
                        />
                      )
                    }] : []),
                    ...(boxTypeVisibility['20fr'] ? [{
                      title: '20FR',
                      dataIndex: '20fr',
                      width: 120,
                      render: (_: unknown, record: ContainerRateItem) => (
                        <InputNumber
                          value={record['20fr'] || ''}
                          style={{ width: '100%' }}
                          placeholder="请输入价格"
                          onChange={(value) => updateContainerRateItem(record.key, '20fr', value || '')}
                          precision={2}
                        />
                      )
                    }] : []),
                    ...(boxTypeVisibility['40fr'] ? [{
                      title: '40FR',
                      dataIndex: '40fr',
                      width: 120,
                      render: (_: unknown, record: ContainerRateItem) => (
                        <InputNumber
                          value={record['40fr'] || ''}
                          style={{ width: '100%' }}
                          placeholder="请输入价格"
                          onChange={(value) => updateContainerRateItem(record.key, '40fr', value || '')}
                          precision={2}
                        />
                      )
                    }] : []),
                    {
                      title: '特殊备注',
                      dataIndex: 'specialNote',
                      width: 200,
                      render: (_: unknown, record: ContainerRateItem) => (
                                                <Input
                        value={record.specialNote}
                        style={{ width: '100%' }}
                        placeholder="请输入特殊备注"
                        onChange={(value) => updateContainerRateItem(record.key, 'specialNote', value)}
                      />
                    )
                  },
                    {
                      title: '操作',
                      width: 80,
                      render: (_: unknown, record: ContainerRateItem) => (
                        <Button 
                          type="text" 
                          status="danger" 
                          size="small"
                          icon={<IconDelete />}
                          onClick={() => removeContainerRateItem(record.key)}
                        >
                          删除
                        </Button>
                      )
                    }
                  ]}
                  data={containerRateList}
                  pagination={false}
                  scroll={{ x: 'max-content' }}
                />
              </div>

              {/* 非按箱型计费区域 */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-green-600 font-bold border-l-4 border-green-600 pl-2">非按箱型计费</div>
                  <Button 
                    type="primary" 
                    size="small" 
                    icon={<IconPlus />}
                    onClick={addNonContainerRateItem}
                  >
                    添加项目
                  </Button>
                </div>
                
                <Table
                  borderCell={true}
                  columns={[
                    {
                      title: '费用名称',
                      dataIndex: 'feeName',
                      width: 200,
                      render: (_: unknown, record: NonContainerRateItem) => (
                        <Select 
                          value={record.feeName}
                          style={{ width: '100%' }}
                          onChange={(value) => updateNonContainerRateItem(record.key, 'feeName', value)}
                        >
                          <Option value="订舱费">订舱费</Option>
                          <Option value="文件费">文件费</Option>
                          <Option value="报关费">报关费</Option>
                          <Option value="商检费">商检费</Option>
                          <Option value="拖车费">拖车费</Option>
                          <Option value="操作费">操作费</Option>
                          <Option value="仓储费">仓储费</Option>
                        </Select>
                      )
                    },
                    {
                      title: '币种',
                      dataIndex: 'currency',
                      width: 120,
                      render: (_: unknown, record: NonContainerRateItem) => (
                        <Select 
                          value={record.currency}
                          style={{ width: '100%' }}
                          onChange={(value) => updateNonContainerRateItem(record.key, 'currency', value)}
                        >
                          <Option value="USD">USD</Option>
                          <Option value="CNY">CNY</Option>
                          <Option value="EUR">EUR</Option>
                        </Select>
                      )
                    },
                    {
                      title: '计费单位',
                      dataIndex: 'unit',
                      width: 120,
                      render: (_: unknown, record: NonContainerRateItem) => (
                        <Select 
                          value={record.unit}
                          style={{ width: '100%' }}
                          onChange={(value) => updateNonContainerRateItem(record.key, 'unit', value)}
                        >
                          <Option value="票">票</Option>
                          <Option value="单">单</Option>
                          <Option value="TEU">TEU</Option>
                          <Option value="CBM">CBM</Option>
                          <Option value="KG">KG</Option>
                          <Option value="次">次</Option>
                        </Select>
                      )
                    },
                    {
                      title: '单价',
                      dataIndex: 'price',
                      width: 150,
                      render: (_: unknown, record: NonContainerRateItem) => (
                        <InputNumber
                          value={record.price || ''}
                          style={{ width: '100%' }}
                          placeholder="请输入单价"
                          onChange={(value) => updateNonContainerRateItem(record.key, 'price', value || '')}
                          precision={2}
                        />
                      )
                    },
                    {
                      title: '特殊备注',
                      dataIndex: 'specialNote',
                      width: 250,
                      render: (_: unknown, record: NonContainerRateItem) => (
                                                <Input
                        value={record.specialNote}
                        style={{ width: '100%' }}
                        placeholder="请输入特殊备注"
                        onChange={(value) => updateNonContainerRateItem(record.key, 'specialNote', value)}
                      />
                    )
                  },
                    {
                      title: '操作',
                      width: 80,
                      render: (_: unknown, record: NonContainerRateItem) => (
                        <Button 
                          type="text" 
                          status="danger" 
                          size="small"
                          icon={<IconDelete />}
                          onClick={() => removeNonContainerRateItem(record.key)}
                        >
                          删除
                        </Button>
                      )
                    }
                  ]}
                  data={nonContainerRateList}
                  pagination={false}
                  scroll={{ x: 'max-content' }}
                />
              </div>
            </Card>
          </Form>
        </Card>

        {/* 箱型设置模态框 */}
        <Modal
          title="箱型设置"
          visible={boxTypeModalVisible}
          onCancel={() => setBoxTypeModalVisible(false)}
          footer={[
            <Button key="cancel" onClick={() => setBoxTypeModalVisible(false)}>
              取消
            </Button>,
            <Button key="confirm" type="primary" onClick={() => setBoxTypeModalVisible(false)}>
              确定
            </Button>
          ]}
          style={{ width: '600px' }}
        >
          <div style={{ padding: '16px 0' }}>
            <div style={{ marginBottom: '16px', color: '#666', fontSize: '14px' }}>
              选择要在运价表格中显示的箱型：
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              {Object.entries(boxTypeVisibility).map(([key, visible]) => (
                <div key={key} style={{ display: 'flex', alignItems: 'center' }}>
                  <Switch
                    checked={visible}
                    onChange={(checked) => setBoxTypeVisibility({ ...boxTypeVisibility, [key]: checked })}
                    style={{ marginRight: '8px' }}
                  />
                  <span style={{ fontSize: '14px' }}>
                    {key === '20gp' && '20GP'}
                    {key === '40gp' && '40GP'}
                    {key === '40hc' && '40HC'}
                    {key === '20nor' && '20NOR'}
                    {key === '40nor' && '40NOR'}
                    {key === '45hc' && '45HC'}
                    {key === '20hc' && '20HC'}
                    {key === '20tk' && '20TK'}
                    {key === '40tk' && '40TK'}
                    {key === '20ot' && '20OT'}
                    {key === '40ot' && '40OT'}
                    {key === '20fr' && '20FR'}
                    {key === '40fr' && '40FR'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Modal>

        {/* AI智能识别模态框 */}
        <Modal
          title="AI智能识别运价"
          visible={aiModalVisible}
          onCancel={() => setAiModalVisible(false)}
          footer={[
            <Button key="cancel" onClick={() => setAiModalVisible(false)}>
              取消
            </Button>,
            <Button 
              key="recognize" 
              type="primary"
              onClick={() => {
                Message.success('AI识别完成，已自动填充运价信息！');
                setAiModalVisible(false);
              }}
            >
              开始识别
            </Button>
          ]}
          style={{ width: '800px' }}
        >
          <div style={{ padding: '16px 0' }}>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>上传运价文件</div>
              <div style={{ 
                border: '2px dashed #d9d9d9', 
                borderRadius: '6px', 
                padding: '40px', 
                textAlign: 'center',
                backgroundColor: '#fafafa'
              }}>
                <div style={{ fontSize: '48px', color: '#d9d9d9', marginBottom: '16px' }}>📄</div>
                <div style={{ marginBottom: '8px' }}>点击或拖拽文件到此区域上传</div>
                <div style={{ color: '#999', fontSize: '12px' }}>
                  支持格式：PDF、Excel、Word、图片等
                </div>
                <Button 
                  type="primary" 
                  icon={<IconUpload />} 
                  style={{ marginTop: '16px' }}
                  onClick={() => Message.info('文件上传功能开发中...')}
                >
                  选择文件
                </Button>
              </div>
            </div>
            
            <div>
              <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>AI识别说明</div>
              <div style={{ color: '#666', fontSize: '14px', lineHeight: '1.6' }}>
                • AI将自动识别运价表格中的港口、船公司、价格等信息<br/>
                • 支持多种文件格式和复杂表格结构<br/>
                • 识别完成后会自动填充到对应字段中<br/>
                • 请确保上传的文件清晰可读
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </ControlTowerSaasLayout>
  );
};

export default CreateFclRate; 