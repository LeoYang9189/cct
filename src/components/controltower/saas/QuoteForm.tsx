import React, { useState } from 'react';
import {
  Form,
  Card,
  Grid,
  Input,
  Select,
  Button,
  DatePicker,
  InputNumber,
  Radio,
  Space,
  Checkbox,
  Message,
  Breadcrumb,
  Modal
} from '@arco-design/web-react';
import { IconPlus, IconMinus, IconSave, IconUpload, IconDelete, IconRobot } from '@arco-design/web-react/icon';
import { useNavigate, useParams } from 'react-router-dom';
import ControlTowerSaasLayout from "./ControlTowerSaasLayout";

const { Row, Col } = Grid;
const { Option } = Select;
const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

// 定义表单状态接口
interface FormState {
  // 基本信息
  quoteNo: string;
  inquiryNo: string;
  quoter: string;
  clientType: string;
  clientCompany: string;
  clientName: string;
  cargoNature: string;
  cargoReadyTime: string;
  cargoReadyTimeType: string;
  cargoReadyDate: any;
  
  // 货物信息
  transitType: string;
  route: string;
  departurePort: string;
  dischargePort: string;
  transitPort: string;
  shipCompany: string;
  remark: string;
  
  // 箱型箱量
  weight: string;
  
  // 勾选状态
  precarriageChecked: boolean;
  mainlineChecked: boolean;
  lastmileChecked: boolean;
  
  // 装箱门点（港前勾选时显示）
  loadingPointDetail: string;
  
  // 配送地址（尾程勾选时显示）
  addressType: string;
  zipCode: string;
  address: string;
  warehouseCode: string;
}

// 地区选择接口
interface AreaItem {
  key: number;
  province: string;
  city: string;
  district: string;
  street: string;
}

// 箱型项目接口
interface ContainerItem {
  id: number;
  type: string;
  count: number;
}

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

const QuoteForm: React.FC = () => {
  const navigate = useNavigate();
  const { inquiryId } = useParams<{ type: string; inquiryId: string }>();
  const [form] = Form.useForm();
  
  // 表单状态
  const [formState, setFormState] = useState<FormState>({
    quoteNo: 'QT' + Date.now().toString().slice(-8),
    inquiryNo: inquiryId || '',
    quoter: '当前用户',
    clientType: '正式客户',
    clientCompany: '',
    clientName: '',
    cargoNature: '询价',
    cargoReadyTime: '一周内',
    cargoReadyTimeType: '区间',
    cargoReadyDate: null,
    
    transitType: '不指定',
    route: '',
    departurePort: '',
    dischargePort: '',
    transitPort: '',
    shipCompany: '不指定',
    remark: '',
    
    weight: '',
    
    precarriageChecked: true,
    mainlineChecked: true,
    lastmileChecked: true,
    
    loadingPointDetail: '',
    
    addressType: '第三方地址',
    zipCode: '',
    address: '',
    warehouseCode: ''
  });

  // 地区数据
  const [areaList, setAreaList] = useState<AreaItem[]>([
    { key: 1, province: '', city: '', district: '', street: '' }
  ]);

  // 箱型箱量数据
  const [containerList, setContainerList] = useState<ContainerItem[]>([
    { id: 1, type: '20GP', count: 1 }
  ]);

  // 已选择的箱型列表（用于避免重复选择）
  const selectedContainerTypes = containerList.map(item => item.type).filter(Boolean);

  // 运价明细数据
  const [mainlineRates, setMainlineRates] = useState<MainlineRateDetail[]>([]);
  const [precarriageRates, setPrecarriageRates] = useState<PrecarriageRateDetail[]>([]);
  const [oncarriageRates, setOncarriageRates] = useState<OncarriageRateDetail[]>([]);

  // 拒绝报价弹窗状态
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  // 省份选项
  const provinceOptions = [
    { label: '上海市', value: '上海市' },
    { label: '江苏省', value: '江苏省' },
    { label: '浙江省', value: '浙江省' },
    { label: '广东省', value: '广东省' },
    { label: '山东省', value: '山东省' }
  ];

  // 费用名称选项和对应币种
  const feeNameOptions = [
    { label: '海运费', value: '海运费', currency: 'USD' },
    { label: '港杂费', value: '港杂费', currency: 'USD' },
    { label: '拖车费', value: '拖车费', currency: 'CNY' },
    { label: '报关费', value: '报关费', currency: 'CNY' },
    { label: '商检费', value: '商检费', currency: 'CNY' },
    { label: '文件费', value: '文件费', currency: 'CNY' },
    { label: '设备交接单费', value: '设备交接单费', currency: 'CNY' },
    { label: '滞箱费', value: '滞箱费', currency: 'USD' },
    { label: '滞港费', value: '滞港费', currency: 'USD' },
    { label: '燃油附加费', value: '燃油附加费', currency: 'USD' },
    { label: '港安费', value: '港安费', currency: 'USD' },
    { label: '码头费', value: '码头费', currency: 'USD' },
    { label: '铅封费', value: '铅封费', currency: 'CNY' },
    { label: '掏箱费', value: '掏箱费', currency: 'CNY' },
    { label: '装箱费', value: '装箱费', currency: 'CNY' },
    { label: '配送费', value: '配送费', currency: 'USD' },
    { label: '仓储费', value: '仓储费', currency: 'USD' },
    { label: '操作费', value: '操作费', currency: 'USD' }
  ];

  // 添加船公司选项
  const shipCompanyOptions = [
    { value: 'COSCO', label: 'COSCO | 中远海运' },
    { value: 'MSC', label: 'MSC | 地中海' },
    { value: 'MAERSK', label: 'MAERSK | 马士基' },
    { value: 'EVERGREEN', label: 'EVERGREEN | 长荣' },
    { value: 'HMM', label: 'HMM | 现代商船' },
    { value: 'ONE', label: 'ONE | 海洋网联' },
    { value: 'CMA CGM', label: 'CMA CGM | 达飞' },
    { value: 'HAPAG-LLOYD', label: 'HAPAG-LLOYD | 赫伯罗特' },
    { value: 'YANG MING', label: 'YANG MING | 阳明' },
    { value: 'PIL', label: 'PIL | 太平船务' },
    { value: 'OOCL', label: 'OOCL | 东方海外' },
    { value: 'APL', label: 'APL | 美总轮船' },
    { value: 'K LINE', label: 'K LINE | 川崎汽船' },
    { value: 'MOL', label: 'MOL | 商船三井' },
    { value: 'NYK', label: 'NYK | 日本邮船' },
    { value: 'WANHAI', label: 'WANHAI | 万海' },
    { value: 'SITC', label: 'SITC | 海丰国际' },
    { value: 'TS LINES', label: 'TS LINES | 德翔' },
    { value: 'HEUNG-A', label: 'HEUNG-A | 兴亚' },
    { value: 'ZIM', label: 'ZIM | 以星' }
  ];

  // 处理表单字段变化
  const handleFormChange = (key: string, value: any) => {
    setFormState(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // 处理checkbox变化
  const handleCheckboxChange = (key: string, checked: boolean) => {
    const newCheckedState = {
      ...formState,
      [key]: checked
    };

    // 如果取消勾选港前，清除装箱门点数据
    if (key === 'precarriageChecked' && !checked) {
      newCheckedState.loadingPointDetail = '';
      setAreaList([{ key: 1, province: '', city: '', district: '', street: '' }]);
    }

    // 如果取消勾选尾程，清除配送地址数据
    if (key === 'lastmileChecked' && !checked) {
      newCheckedState.addressType = '第三方地址';
      newCheckedState.zipCode = '';
      newCheckedState.address = '';
      newCheckedState.warehouseCode = '';
    }

    setFormState(newCheckedState);
  };

  // 添加箱型
  const addContainerItem = () => {
    const newId = Math.max(...containerList.map(item => item.id)) + 1;
    setContainerList([...containerList, { id: newId, type: '', count: 1 }]);
  };

  // 更新箱型
  const updateContainerItem = (id: number, field: 'type' | 'count', value: string | number) => {
    setContainerList(containerList.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  // 删除箱型
  const removeContainerItem = (id: number) => {
    if (containerList.length > 1) {
      setContainerList(containerList.filter(item => item.id !== id));
    }
  };

  // 更新地区字段
  const updateAreaField = (key: number, field: string, value: string) => {
    setAreaList(areaList.map(area => 
      area.key === key ? { ...area, [field]: value } : area
    ));
  };

  // 保存草稿
  const handleSaveDraft = () => {
    Message.success('草稿保存成功');
  };

  // 提交报价
  const handleSubmit = () => {
    Message.success('报价创建成功');
    navigate(-1);
  };

  // 取消
  const handleCancel = () => {
    navigate(-1);
  };

  // 打开拒绝报价弹窗
  const handleRejectQuote = () => {
    setRejectModalVisible(true);
  };

  // 确认拒绝报价
  const handleConfirmReject = () => {
    if (!rejectReason.trim()) {
      Message.error('请填写拒绝原因');
      return;
    }
    
    Message.success('报价已拒绝');
    setRejectModalVisible(false);
    setRejectReason('');
    navigate(-1);
  };

  // 取消拒绝报价
  const handleCancelReject = () => {
    setRejectModalVisible(false);
    setRejectReason('');
  };

  // 添加干线运价
  const addMainlineRate = () => {
    const newRate: MainlineRateDetail = {
      id: Date.now(),
      shipCompany: '',
      validPeriod: ['', ''],
      transitType: '直达',
      transitTime: '',
      freeBox: '',
      freeStorage: '',
      rateItems: []
    };
    setMainlineRates([...mainlineRates, newRate]);
  };

  // 删除干线运价
  const removeMainlineRate = (id: number) => {
    setMainlineRates(mainlineRates.filter(rate => rate.id !== id));
  };

  // 更新干线运价字段
  const updateMainlineRateField = (rateId: number, field: string, value: any) => {
    setMainlineRates(mainlineRates.map(rate => 
      rate.id === rateId ? { ...rate, [field]: value } : rate
    ));
  };

  // 更新港前运价字段  // 更新港前运价字段 - 暂时保留，后续可能使用
  // const updatePrecarriageRateField = (rateId: number, field: string, value: any) => {
  //   setPrecarriageRates(precarriageRates.map(rate => 
  //     rate.id === rateId ? { ...rate, [field]: value } : rate
  //   ));
  // };

  // 更新尾程运价字段
  const updateOncarriageRateField = (rateId: number, field: string, value: any) => {
    setOncarriageRates(oncarriageRates.map(rate => 
      rate.id === rateId ? { ...rate, [field]: value } : rate
    ));
  };

  // 获取当前可用的箱型列表（基于基本信息模块中设置的箱型，过滤掉空值）
  const getAvailableContainerTypes = () => {
    return containerList.map(container => container.type).filter(type => type !== '');
  };

  // 获取港前运价子类型选项
  const getPrecarriageSubTypeOptions = (type: string) => {
    if (type === '支线') {
      return [
        { value: '乍浦支线', label: '乍浦支线' },
        { value: '温州支线', label: '温州支线' },
        { value: '九江支线', label: '九江支线' }
      ];
    } else if (type === '海铁') {
      return [
        { value: '湖州海铁', label: '湖州海铁' },
        { value: '义乌海铁', label: '义乌海铁' }
      ];
    }
    return [];
  };

  // 添加港前运价
  const addPrecarriageRate = () => {
    const newRate: PrecarriageRateDetail = {
      id: Date.now(),
      type: '',
      subType: '',
      vendor: '',
      validPeriod: ['', ''],
      rateItems: []
    };
    setPrecarriageRates([...precarriageRates, newRate]);
  };

  // 删除港前运价
  const removePrecarriageRate = (id: number) => {
    setPrecarriageRates(precarriageRates.filter(rate => rate.id !== id));
  };

  // 添加尾程运价
  const addOncarriageRate = () => {
    const newRate: OncarriageRateDetail = {
      id: Date.now(),
      agentName: '',
      validPeriod: ['', ''],
      rateItems: []
    };
    setOncarriageRates([...oncarriageRates, newRate]);
  };

  // 删除尾程运价
  const removeOncarriageRate = (id: number) => {
    setOncarriageRates(oncarriageRates.filter(rate => rate.id !== id));
  };

  // 添加费用明细（箱型计费）
  const addContainerRateItem = (rateType: 'mainline' | 'precarriage' | 'oncarriage', rateId: number) => {
    const newItem: RateItem = {
      id: Date.now(),
      feeType: 'container',
      feeName: '',
      currency: '', // 初始为空，等待用户选择费用名称后自动设置
      unit: '箱',
      remark: '',
      containerRates: {
        '20GP': '',
        '40GP': '',
        '40HC': '',
        '45HC': ''
      }
    };

    if (rateType === 'mainline') {
      setMainlineRates(mainlineRates.map(rate => 
        rate.id === rateId ? { ...rate, rateItems: [...rate.rateItems, newItem] } : rate
      ));
    } else if (rateType === 'precarriage') {
      setPrecarriageRates(precarriageRates.map(rate => 
        rate.id === rateId ? { ...rate, rateItems: [...rate.rateItems, newItem] } : rate
      ));
    } else {
      setOncarriageRates(oncarriageRates.map(rate => 
        rate.id === rateId ? { ...rate, rateItems: [...rate.rateItems, newItem] } : rate
      ));
    }
  };

  // 添加费用明细（非箱型计费）
  const addNonContainerRateItem = (rateType: 'mainline' | 'precarriage' | 'oncarriage', rateId: number) => {
    const newItem: RateItem = {
      id: Date.now(),
      feeType: 'non-container',
      feeName: '',
      currency: '', // 初始为空，等待用户选择费用名称后自动设置
      unit: '票',
      remark: '',
      unitPrice: ''
    };

    if (rateType === 'mainline') {
      setMainlineRates(mainlineRates.map(rate => 
        rate.id === rateId ? { ...rate, rateItems: [...rate.rateItems, newItem] } : rate
      ));
    } else if (rateType === 'precarriage') {
      setPrecarriageRates(precarriageRates.map(rate => 
        rate.id === rateId ? { ...rate, rateItems: [...rate.rateItems, newItem] } : rate
      ));
    } else {
      setOncarriageRates(oncarriageRates.map(rate => 
        rate.id === rateId ? { ...rate, rateItems: [...rate.rateItems, newItem] } : rate
      ));
    }
  };

  // 删除费用明细
  const removeRateItem = (rateType: 'mainline' | 'precarriage' | 'oncarriage', rateId: number, itemId: number) => {
    if (rateType === 'mainline') {
      setMainlineRates(mainlineRates.map(rate => 
        rate.id === rateId ? { ...rate, rateItems: rate.rateItems.filter(item => item.id !== itemId) } : rate
      ));
    } else if (rateType === 'precarriage') {
      setPrecarriageRates(precarriageRates.map(rate => 
        rate.id === rateId ? { ...rate, rateItems: rate.rateItems.filter(item => item.id !== itemId) } : rate
      ));
    } else {
      setOncarriageRates(oncarriageRates.map(rate => 
        rate.id === rateId ? { ...rate, rateItems: rate.rateItems.filter(item => item.id !== itemId) } : rate
      ));
    }
  };

  // 更新费用明细项字段
  const updateRateItemField = (rateType: 'mainline' | 'precarriage' | 'oncarriage', rateId: number, itemId: number, field: string, value: any) => {
    if (rateType === 'mainline') {
      setMainlineRates(mainlineRates.map(rate => 
        rate.id === rateId ? { 
          ...rate, 
          rateItems: rate.rateItems.map(item => 
            item.id === itemId ? { ...item, [field]: value } : item
          ) 
        } : rate
      ));
    } else if (rateType === 'precarriage') {
      setPrecarriageRates(precarriageRates.map(rate => 
        rate.id === rateId ? { 
          ...rate, 
          rateItems: rate.rateItems.map(item => 
            item.id === itemId ? { ...item, [field]: value } : item
          ) 
        } : rate
      ));
    } else {
      setOncarriageRates(oncarriageRates.map(rate => 
        rate.id === rateId ? { 
          ...rate, 
          rateItems: rate.rateItems.map(item => 
            item.id === itemId ? { ...item, [field]: value } : item
          ) 
        } : rate
      ));
    }
  };

  // 更新箱型计费价格
  const updateContainerRatePrice = (rateType: 'mainline' | 'precarriage' | 'oncarriage', rateId: number, itemId: number, containerType: string, value: string) => {
    if (rateType === 'mainline') {
      setMainlineRates(mainlineRates.map(rate => 
        rate.id === rateId ? { 
          ...rate, 
          rateItems: rate.rateItems.map(item => 
            item.id === itemId ? { 
              ...item, 
              containerRates: { ...item.containerRates, [containerType]: value }
            } : item
          ) 
        } : rate
      ));
    } else if (rateType === 'precarriage') {
      setPrecarriageRates(precarriageRates.map(rate => 
        rate.id === rateId ? { 
          ...rate, 
          rateItems: rate.rateItems.map(item => 
            item.id === itemId ? { 
              ...item, 
              containerRates: { ...item.containerRates, [containerType]: value }
            } : item
          ) 
        } : rate
      ));
    } else {
      setOncarriageRates(oncarriageRates.map(rate => 
        rate.id === rateId ? { 
          ...rate, 
          rateItems: rate.rateItems.map(item => 
            item.id === itemId ? { 
              ...item, 
              containerRates: { ...item.containerRates, [containerType]: value }
            } : item
          ) 
        } : rate
      ));
    }
  };

  return (
    <ControlTowerSaasLayout
      menuSelectedKey="10"
      breadcrumb={
        <Breadcrumb>
          <Breadcrumb.Item>询价报价</Breadcrumb.Item>
          <Breadcrumb.Item>报价管理</Breadcrumb.Item>
          <Breadcrumb.Item>新建报价</Breadcrumb.Item>
        </Breadcrumb>
      }
    >
      <Form form={form} layout="vertical" initialValues={formState}>
        <Card className="mb-4">
          {/* 顶部checkbox区域 */}
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
              <Button icon={<IconSave />} onClick={handleSaveDraft}>保存草稿</Button>
              <Button type="primary" icon={<IconUpload />} onClick={handleSubmit}>创建报价</Button>
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
                    <FormItem label="报价编号" field="quoteNo">
                      <Input placeholder="自动生成" value={formState.quoteNo} disabled />
                    </FormItem>
                  </Col>
                  
                  <Col span={24}>
                    <FormItem label="询价编号" field="inquiryNo">
                      <Input 
                        placeholder="关联询价编号" 
                        value={formState.inquiryNo}
                        onChange={(value) => handleFormChange('inquiryNo', value)}
                      />
                    </FormItem>
                  </Col>
                  
                  <Col span={24}>
                    <FormItem label="报价人" field="quoter">
                      <Input 
                        placeholder="当前用户" 
                        value={formState.quoter}
                        onChange={(value) => handleFormChange('quoter', value)}
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
                        <Option value="实盘">实盘</Option>
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
                  
                  {/* 装箱门点区域，仅在勾选港前价格时显示 */}
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
                                size="small"
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
                  
                  {/* 尾程送货地址，仅在勾选尾程价格时显示 */}
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
                                size="small"
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
                                onChange={(value) => handleFormChange('zipCode', value)}
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
                        <Option value="美加线">美加线</Option>
                        <Option value="东南亚线">东南亚线</Option>
                        <Option value="欧洲线">欧洲线</Option>
                        <Option value="中东线">中东线</Option>
                        <Option value="澳洲线">澳洲线</Option>
                        <Option value="南美线">南美线</Option>
                        <Option value="非洲线">非洲线</Option>
                        <Option value="日韩线">日韩线</Option>
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
                    <FormItem label="卸货港" field="dischargePort">
                      <Select
                        placeholder="请选择卸货港" 
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
                    <FormItem label="重量" field="weight">
                      <InputNumber 
                        placeholder="请输入重量" 
                        style={{ width: '100%' }}
                        suffix="KGS"
                        value={formState.weight}
                        onChange={(value) => handleFormChange('weight', value)}
                      />
                    </FormItem>
                  </Col>
                  
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
              
              {/* 箱型箱量独立模块 */}
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
          
          {/* 下半部分：运价明细模块 */}
          <div className="mt-6">
            <div className="text-blue-600 font-bold border-l-4 border-blue-600 pl-2 mb-4">运价明细</div>
            
            {/* 干线运价模块 - 仅在勾选干线价格时显示 */}
            {formState.mainlineChecked && (
              <div className="border rounded p-4 mb-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-gray-800 font-medium">干线运价</div>
                  <Space>
                    <Button 
                      type="primary" 
                      size="small"
                      status="danger"
                      icon={<IconDelete />}
                      onClick={handleRejectQuote}
                    >
                      拒绝报价
                    </Button>
                    <Button 
                      type="primary" 
                      size="small"
                      icon={<IconPlus />}
                      onClick={addMainlineRate}
                    >
                      新增干线运价
                    </Button>
                  </Space>
                </div>
                
                {mainlineRates.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 bg-gray-50 rounded">
                    暂无干线运价，请点击上方按钮添加
                  </div>
                ) : (
                  <div className="space-y-4">
                    {mainlineRates.map((rate) => (
                      <div key={rate.id} className="border border-gray-200 rounded p-4">
                        <div className="flex justify-between items-center mb-3">
                          {rate.certNo ? (
                            <span className="font-medium text-blue-600">运价编号：{rate.certNo}</span>
                          ) : (
                            <span className="font-medium text-green-600">新增干线运价</span>
                          )}
                          <Button 
                            size="mini" 
                            status="danger" 
                            icon={<IconDelete />}
                            onClick={() => removeMainlineRate(rate.id)}
                          >
                            删除
                          </Button>
                        </div>
                        
                        {/* 基本信息 */}
                        <Row gutter={[16, 16]} className="mb-4">
                          <Col span={4}>
                            <Select 
                              placeholder="船公司" 
                              size="small" 
                              style={{ width: '100%' }}
                              value={rate.shipCompany}
                              onChange={(value) => updateMainlineRateField(rate.id, 'shipCompany', value)}
                            >
                              {shipCompanyOptions.map(option => (
                                <Option key={option.value} value={option.value}>
                                  {option.label}
                                </Option>
                              ))}
                            </Select>
                          </Col>
                          <Col span={4}>
                            <RangePicker 
                              placeholder={['开始日期', '结束日期']}
                              size="small" 
                              style={{ width: '100%' }}
                              value={rate.validPeriod}
                              onChange={(value: any) => updateMainlineRateField(rate.id, 'validPeriod', value)}
                            />
                          </Col>
                          <Col span={4}>
                            <Select 
                              placeholder="直达/中转" 
                              size="small" 
                              style={{ width: '100%' }}
                              value={rate.transitType}
                              onChange={(value) => updateMainlineRateField(rate.id, 'transitType', value)}
                            >
                              <Option value="直达">直达</Option>
                              <Option value="中转">中转</Option>
                            </Select>
                          </Col>
                          <Col span={4}>
                            <Input 
                              placeholder="航程(天)" 
                              size="small" 
                              value={rate.transitTime}
                              onChange={(value) => updateMainlineRateField(rate.id, 'transitTime', value)}
                            />
                          </Col>
                          <Col span={4}>
                            <Input 
                              placeholder="免用箱(天)" 
                              size="small" 
                              value={rate.freeBox}
                              onChange={(value) => updateMainlineRateField(rate.id, 'freeBox', value)}
                            />
                          </Col>
                          <Col span={4}>
                            <Input 
                              placeholder="免堆存(天)" 
                              size="small" 
                              value={rate.freeStorage}
                              onChange={(value) => updateMainlineRateField(rate.id, 'freeStorage', value)}
                            />
                          </Col>
                        </Row>
                        
                        {/* 费用明细 */}
                        <div className="bg-gray-50 p-3 rounded">
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-sm font-medium text-gray-700">费用明细</span>
                            <Space>
                              <Button 
                                size="mini" 
                                type="outline"
                                onClick={() => addContainerRateItem('mainline', rate.id)}
                              >
                                添加箱型计费条目
                              </Button>
                              <Button 
                                size="mini" 
                                type="outline"
                                onClick={() => addNonContainerRateItem('mainline', rate.id)}
                              >
                                添加非箱型计费条目
                              </Button>
                            </Space>
                          </div>
                          
                          {rate.rateItems.length === 0 ? (
                            <div className="text-center py-4 text-gray-400 text-sm">
                              暂无费用明细，请添加计费条目
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {rate.rateItems.map((item) => (
                                <div key={item.id} className="bg-white p-2 rounded border">
                                  <Row gutter={[8, 8]} align="center">
                                    <Col span={3}>
                                      <Select 
                                        placeholder="费用名称" 
                                        size="small" 
                                        style={{ width: '100%' }}
                                        value={item.feeName}
                                        onChange={(value) => {
                                          // 根据费用名称自动设置币种
                                          const selectedFee = feeNameOptions.find(opt => opt.value === value);
                                          const currency = selectedFee ? selectedFee.currency : 'USD';
                                          
                                          setMainlineRates(mainlineRates.map(r => 
                                            r.id === rate.id ? { 
                                              ...r, 
                                              rateItems: r.rateItems.map(i => 
                                                i.id === item.id ? { ...i, feeName: value, currency: currency } : i
                                              ) 
                                            } : r
                                          ));
                                        }}
                                      >
                                        {feeNameOptions.map(option => (
                                          <Option key={option.value} value={option.value}>
                                            {option.label}
                                          </Option>
                                        ))}
                                      </Select>
                                    </Col>
                                    <Col span={2}>
                                      <Input 
                                        placeholder="自动设置" 
                                        size="small" 
                                        style={{ width: '100%', color: '#666' }}
                                        value={item.currency || '请选择费用'}
                                        disabled
                                      />
                                    </Col>
                                    {item.feeType === 'container' ? (
                                      <>
                                        {/* 只显示基本信息模块中设置的箱型 */}
                                        {getAvailableContainerTypes().map(containerType => (
                                          <Col span={2} key={containerType}>
                                            <Input 
                                              placeholder={containerType} 
                                              size="small" 
                                              value={item.containerRates?.[containerType as keyof typeof item.containerRates] || ''}
                                              onChange={(value) => updateContainerRatePrice('mainline', rate.id, item.id, containerType, value)}
                                            />
                                          </Col>
                                        ))}
                                      </>
                                    ) : (
                                      <>
                                        <Col span={3}>
                                          <Input 
                                            placeholder="单价" 
                                            size="small" 
                                            value={item.unitPrice || ''}
                                            onChange={(value) => updateRateItemField('mainline', rate.id, item.id, 'unitPrice', value)}
                                          />
                                        </Col>
                                        <Col span={2}>
                                          <Select 
                                            placeholder="单位" 
                                            size="small" 
                                            style={{ width: '100%' }}
                                            value={item.unit}
                                            onChange={(value) => updateRateItemField('mainline', rate.id, item.id, 'unit', value)}
                                          >
                                            <Option value="票">票</Option>
                                            <Option value="吨">吨</Option>
                                            <Option value="CBM">CBM</Option>
                                          </Select>
                                        </Col>
                                        <Col span={1}></Col>
                                      </>
                                    )}
                                    <Col span={3}>
                                      <Input 
                                        placeholder="备注" 
                                        size="small" 
                                        value={item.remark}
                                        onChange={(value) => updateRateItemField('mainline', rate.id, item.id, 'remark', value)}
                                      />
                                    </Col>
                                    <Col span={2}>
                                      <Button 
                                        size="mini" 
                                        status="danger" 
                                        icon={<IconMinus />}
                                        onClick={() => removeRateItem('mainline', rate.id, item.id)}
                                      />
                                    </Col>
                                  </Row>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {/* 港前运价模块 - 仅在勾选港前价格时显示 */}
            {formState.precarriageChecked && (
              <div className="border rounded p-4 mb-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-gray-800 font-medium">港前运价</div>
                  <Space>
                    <Button 
                      type="primary" 
                      size="small"
                      status="danger"
                      icon={<IconDelete />}
                      onClick={handleRejectQuote}
                    >
                      拒绝报价
                    </Button>
                    <Button 
                      type="primary" 
                      size="small"
                      icon={<IconPlus />}
                      onClick={addPrecarriageRate}
                    >
                      新增港前运价
                    </Button>
                  </Space>
                </div>
                
                {precarriageRates.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 bg-gray-50 rounded">
                    暂无港前运价，请点击上方按钮添加
                  </div>
                ) : (
                  <div className="space-y-4">
                    {precarriageRates.map((rate) => (
                      <div key={rate.id} className="border border-gray-200 rounded p-4">
                        <div className="flex justify-between items-center mb-3">
                          {rate.certNo ? (
                            <span className="font-medium text-blue-600">运价编号：{rate.certNo}</span>
                          ) : (
                            <span className="font-medium text-green-600">新增港前运价</span>
                          )}
                          <Button 
                            size="mini" 
                            status="danger" 
                            icon={<IconDelete />}
                            onClick={() => removePrecarriageRate(rate.id)}
                          >
                            删除
                          </Button>
                        </div>
                        
                        {/* 基本信息 */}
                        <Row gutter={[16, 16]} className="mb-4">
                          <Col span={4}>
                            <Select 
                              placeholder="类型" 
                              size="small" 
                              style={{ width: '100%' }}
                              value={rate.type || undefined}
                              onChange={(value) => {
                                // 使用函数式更新确保状态正确更新
                                setPrecarriageRates(prevRates => prevRates.map(r => 
                                  r.id === rate.id ? { ...r, type: value, subType: '' } : r
                                ));
                              }}
                              allowClear
                            >
                              <Option value="直达">直达</Option>
                              <Option value="支线">支线</Option>
                              <Option value="海铁">海铁</Option>
                            </Select>
                          </Col>
                          {(rate.type === '支线' || rate.type === '海铁') && (
                            <Col span={4}>
                              <Select 
                                placeholder={rate.type === '支线' ? '支线类型' : '海铁类型'}
                                size="small" 
                                style={{ width: '100%' }}
                                value={rate.subType || undefined}
                                onChange={(value) => {
                                  setPrecarriageRates(prevRates => prevRates.map(r => 
                                    r.id === rate.id ? { ...r, subType: value } : r
                                  ));
                                }}
                                allowClear
                                key={`${rate.id}-${rate.type}`}
                              >
                                {getPrecarriageSubTypeOptions(rate.type).map(option => (
                                  <Option key={option.value} value={option.value}>
                                    {option.label}
                                  </Option>
                                ))}
                              </Select>
                            </Col>
                          )}
                          <Col span={rate.type === '直达' ? 8 : 6}>
                            <Input 
                              placeholder="供应商" 
                              size="small" 
                              value={rate.vendor}
                              onChange={(value) => {
                                setPrecarriageRates(prevRates => prevRates.map(r => 
                                  r.id === rate.id ? { ...r, vendor: value } : r
                                ));
                              }}
                            />
                          </Col>
                          <Col span={rate.type === '直达' ? 8 : 6}>
                            <DatePicker.RangePicker 
                              placeholder={['开始日期', '结束日期']} 
                              size="small" 
                              style={{ width: '100%' }}
                              value={rate.validPeriod}
                              onChange={(value: any) => {
                                setPrecarriageRates(prevRates => prevRates.map(r => 
                                  r.id === rate.id ? { ...r, validPeriod: value } : r
                                ));
                              }}
                            />
                          </Col>
                        </Row>
                        
                        {/* 费用明细 */}
                        <div className="bg-gray-50 p-3 rounded">
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-sm font-medium text-gray-700">费用明细</span>
                            <Space>
                              <Button 
                                size="mini" 
                                type="outline"
                                onClick={() => addContainerRateItem('precarriage', rate.id)}
                              >
                                添加箱型计费条目
                              </Button>
                              <Button 
                                size="mini" 
                                type="outline"
                                onClick={() => addNonContainerRateItem('precarriage', rate.id)}
                              >
                                添加非箱型计费条目
                              </Button>
                            </Space>
                          </div>
                          
                          {rate.rateItems.length === 0 ? (
                            <div className="text-center py-4 text-gray-400 text-sm">
                              暂无费用明细，请添加计费条目
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {rate.rateItems.map((item) => (
                                <div key={item.id} className="bg-white p-2 rounded border">
                                  <Row gutter={[8, 8]} align="center">
                                    <Col span={3}>
                                      <Select 
                                        placeholder="费用名称" 
                                        size="small" 
                                        style={{ width: '100%' }}
                                        value={item.feeName}
                                        onChange={(value) => {
                                          // 根据费用名称自动设置币种
                                          const selectedFee = feeNameOptions.find(opt => opt.value === value);
                                          const currency = selectedFee ? selectedFee.currency : 'USD';
                                          
                                          setPrecarriageRates(precarriageRates.map(r => 
                                            r.id === rate.id ? { 
                                              ...r, 
                                              rateItems: r.rateItems.map(i => 
                                                i.id === item.id ? { ...i, feeName: value, currency: currency } : i
                                              ) 
                                            } : r
                                          ));
                                        }}
                                      >
                                        {feeNameOptions.map(option => (
                                          <Option key={option.value} value={option.value}>
                                            {option.label}
                                          </Option>
                                        ))}
                                      </Select>
                                    </Col>
                                    <Col span={2}>
                                      <Input 
                                        placeholder="自动设置" 
                                        size="small" 
                                        style={{ width: '100%', color: '#666' }}
                                        value={item.currency || '请选择费用'}
                                        disabled
                                      />
                                    </Col>
                                    {item.feeType === 'container' ? (
                                      <>
                                        {/* 只显示基本信息模块中设置的箱型 */}
                                        {getAvailableContainerTypes().map(containerType => (
                                          <Col span={2} key={containerType}>
                                            <Input 
                                              placeholder={containerType} 
                                              size="small" 
                                              value={item.containerRates?.[containerType as keyof typeof item.containerRates] || ''}
                                              onChange={(value) => updateContainerRatePrice('precarriage', rate.id, item.id, containerType, value)}
                                            />
                                        </Col>
                                        ))}
                                      </>
                                    ) : (
                                      <>
                                        <Col span={3}>
                                          <Input 
                                            placeholder="单价" 
                                            size="small" 
                                            value={item.unitPrice || ''}
                                            onChange={(value) => updateRateItemField('precarriage', rate.id, item.id, 'unitPrice', value)}
                                          />
                                        </Col>
                                        <Col span={2}>
                                          <Select 
                                            placeholder="单位" 
                                            size="small" 
                                            style={{ width: '100%' }}
                                            value={item.unit}
                                            onChange={(value) => updateRateItemField('precarriage', rate.id, item.id, 'unit', value)}
                                          >
                                            <Option value="票">票</Option>
                                            <Option value="吨">吨</Option>
                                            <Option value="CBM">CBM</Option>
                                          </Select>
                                        </Col>
                                        <Col span={1}></Col>
                                      </>
                                    )}
                                    <Col span={3}>
                                      <Input 
                                        placeholder="备注" 
                                        size="small" 
                                        value={item.remark}
                                        onChange={(value) => updateRateItemField('precarriage', rate.id, item.id, 'remark', value)}
                                      />
                                    </Col>
                                    <Col span={2}>
                                      <Button 
                                        size="mini" 
                                        status="danger" 
                                        icon={<IconMinus />}
                                        onClick={() => removeRateItem('precarriage', rate.id, item.id)}
                                      />
                                    </Col>
                                  </Row>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {/* 尾程运价模块 - 仅在勾选尾程价格时显示 */}
            {formState.lastmileChecked && (
              <div className="border rounded p-4 mb-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-gray-800 font-medium">尾程运价</div>
                  <Space>
                    <Button 
                      type="primary" 
                      size="small"
                      status="danger"
                      icon={<IconDelete />}
                      onClick={handleRejectQuote}
                    >
                      拒绝报价
                    </Button>
                    <Button 
                      type="primary" 
                      size="small"
                      icon={<IconPlus />}
                      onClick={addOncarriageRate}
                    >
                      新增尾程运价
                    </Button>
                  </Space>
                </div>
                
                {oncarriageRates.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 bg-gray-50 rounded">
                    暂无尾程运价，请点击上方按钮添加
                  </div>
                ) : (
                  <div className="space-y-4">
                    {oncarriageRates.map((rate) => (
                      <div key={rate.id} className="border border-gray-200 rounded p-4">
                        <div className="flex justify-between items-center mb-3">
                          {rate.certNo ? (
                            <span className="font-medium text-blue-600">运价编号：{rate.certNo}</span>
                          ) : (
                            <span className="font-medium text-green-600">新增尾程运价</span>
                          )}
                          <Button 
                            size="mini" 
                            status="danger" 
                            icon={<IconDelete />}
                            onClick={() => removeOncarriageRate(rate.id)}
                          >
                            删除
                          </Button>
                        </div>
                        
                        {/* 基本信息 */}
                        <Row gutter={[16, 16]} className="mb-4">
                          <Col span={12}>
                            <Input 
                              placeholder="代理名称" 
                              size="small" 
                              value={rate.agentName}
                              onChange={(value) => updateOncarriageRateField(rate.id, 'agentName', value)}
                            />
                          </Col>
                          <Col span={12}>
                            <DatePicker.RangePicker 
                              placeholder={['开始日期', '结束日期']} 
                              size="small" 
                              style={{ width: '100%' }}
                              value={rate.validPeriod}
                              onChange={(value: any) => updateOncarriageRateField(rate.id, 'validPeriod', value)}
                            />
                          </Col>
                        </Row>
                        
                        {/* 费用明细 */}
                        <div className="bg-gray-50 p-3 rounded">
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-sm font-medium text-gray-700">费用明细</span>
                            <Space>
                              <Button 
                                size="mini" 
                                type="outline"
                                onClick={() => addContainerRateItem('oncarriage', rate.id)}
                              >
                                添加箱型计费条目
                              </Button>
                              <Button 
                                size="mini" 
                                type="outline"
                                onClick={() => addNonContainerRateItem('oncarriage', rate.id)}
                              >
                                添加非箱型计费条目
                              </Button>
                            </Space>
                          </div>
                          
                          {rate.rateItems.length === 0 ? (
                            <div className="text-center py-4 text-gray-400 text-sm">
                              暂无费用明细，请添加计费条目
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {rate.rateItems.map((item) => (
                                <div key={item.id} className="bg-white p-2 rounded border">
                                  <Row gutter={[8, 8]} align="center">
                                    <Col span={3}>
                                      <Select 
                                        placeholder="费用名称" 
                                        size="small" 
                                        style={{ width: '100%' }}
                                        value={item.feeName}
                                        onChange={(value) => {
                                          // 根据费用名称自动设置币种
                                          const selectedFee = feeNameOptions.find(opt => opt.value === value);
                                          const currency = selectedFee ? selectedFee.currency : 'USD';
                                          
                                          setOncarriageRates(oncarriageRates.map(r => 
                                            r.id === rate.id ? { 
                                              ...r, 
                                              rateItems: r.rateItems.map(i => 
                                                i.id === item.id ? { ...i, feeName: value, currency: currency } : i
                                              ) 
                                            } : r
                                          ));
                                        }}
                                      >
                                        {feeNameOptions.map(option => (
                                          <Option key={option.value} value={option.value}>
                                            {option.label}
                                          </Option>
                                        ))}
                                      </Select>
                                    </Col>
                                    <Col span={2}>
                                      <Input 
                                        placeholder="自动设置" 
                                        size="small" 
                                        style={{ width: '100%', color: '#666' }}
                                        value={item.currency || '请选择费用'}
                                        disabled
                                      />
                                    </Col>
                                    {item.feeType === 'container' ? (
                                      <>
                                        {/* 只显示基本信息模块中设置的箱型 */}
                                        {getAvailableContainerTypes().map(containerType => (
                                          <Col span={2} key={containerType}>
                                            <Input 
                                              placeholder={containerType} 
                                              size="small" 
                                              value={item.containerRates?.[containerType as keyof typeof item.containerRates] || ''}
                                              onChange={(value) => updateContainerRatePrice('oncarriage', rate.id, item.id, containerType, value)}
                                            />
                                        </Col>
                                        ))}
                                      </>
                                    ) : (
                                      <>
                                        <Col span={3}>
                                          <Input 
                                            placeholder="单价" 
                                            size="small" 
                                            value={item.unitPrice || ''}
                                            onChange={(value) => updateRateItemField('oncarriage', rate.id, item.id, 'unitPrice', value)}
                                          />
                                        </Col>
                                        <Col span={2}>
                                          <Select 
                                            placeholder="单位" 
                                            size="small" 
                                            style={{ width: '100%' }}
                                            value={item.unit}
                                            onChange={(value) => updateRateItemField('oncarriage', rate.id, item.id, 'unit', value)}
                                          >
                                            <Option value="票">票</Option>
                                            <Option value="吨">吨</Option>
                                            <Option value="CBM">CBM</Option>
                                          </Select>
                                        </Col>
                                        <Col span={1}></Col>
                                      </>
                                    )}
                                    <Col span={3}>
                                      <Input 
                                        placeholder="备注" 
                                        size="small" 
                                        value={item.remark}
                                        onChange={(value) => updateRateItemField('oncarriage', rate.id, item.id, 'remark', value)}
                                      />
                                    </Col>
                                    <Col span={2}>
                                      <Button 
                                        size="mini" 
                                        status="danger" 
                                        icon={<IconMinus />}
                                        onClick={() => removeRateItem('oncarriage', rate.id, item.id)}
                                      />
                                    </Col>
                                  </Row>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>
      </Form>
      
      {/* 拒绝报价弹窗 */}
      <Modal
        title="拒绝报价"
        visible={rejectModalVisible}
        onOk={handleConfirmReject}
        onCancel={handleCancelReject}
        okText="确认拒绝"
        cancelText="取消"
        okButtonProps={{ status: 'danger' }}
      >
        <div className="mb-4">
          <div className="text-gray-700 mb-2">请输入拒绝原因：</div>
          <Input.TextArea
            placeholder="请输入拒绝报价的原因..."
            value={rejectReason}
            onChange={setRejectReason}
            rows={4}
            maxLength={500}
            showWordLimit
          />
        </div>
        <div className="text-gray-500 text-sm">
          注意：拒绝报价后，此报价将无法再次编辑。
        </div>
      </Modal>
    </ControlTowerSaasLayout>
  );
};

export default QuoteForm;