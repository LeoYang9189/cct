import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Space,
  Form,
  Select,
  Message,
  Typography,
  InputNumber,
  Table,
  Input,
  Radio,
  DatePicker,
  Grid
} from '@arco-design/web-react';
import {
  IconSave,
  IconArrowLeft,
  IconPlus,
  IconMinus,
  IconRobot
} from '@arco-design/web-react/icon';
import { useNavigate, useParams } from 'react-router-dom';

const { Row, Col } = Grid;

const { Option } = Select;
const { Title } = Typography;

// 生成16位数字字母随机组合的规则ID
const generateRuleId = (): string => {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < 16; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// 箱型规则接口
interface ContainerRule {
  id: string;
  containerType: string; // 箱型
  t0Price: number; // T0加价
  t1Price: number; // T1加价
  t2Price: number; // T2加价
  t3Price: number; // T3加价
  internalSalesPrice: number; // 内部销售加价
}

// 加价规则表单数据接口
interface PricingRuleFormData {
  ruleId?: string; // 规则ID - 编辑时存在，新增时不存在
  routeName?: string[]; // 航线名称 - FCL/LCL/AIR使用，支持多选
  shippingCompany?: string[]; // 船公司 - FCL/港前/尾程使用，支持多选
  originPort?: string[]; // 起运港 - FCL使用，支持多选
  chargeName?: string; // 费用名称 - FCL/港前/尾程使用
  billingUnits?: string[]; // 计费单位 - 根据费用名称自动带出
  origin?: string; // 起运地/目的港 - 港前/尾程使用
  destination?: string; // 目的港/配送地址 - 港前/尾程使用
  currency: 'USD' | 'CNY'; // 币种
  validPeriodStart?: string; // 有效期开始日期 - 仅港前/尾程使用
  validPeriodEnd?: string; // 有效期结束日期 - 仅港前/尾程使用
  priceType?: string; // 运价类型 - 港前运价使用
  branchType?: string[]; // 支线类型 - 港前运价支线类型使用
  railType?: string[]; // 海铁类型 - 港前运价海铁类型使用
  containerRules: ContainerRule[]; // 箱型规则列表
}

// 航线选项
const routeOptions = [
  { value: '亚欧航线', label: '亚欧航线' },
  { value: '跨太平洋航线', label: '跨太平洋航线' },
  { value: '亚美航线', label: '亚美航线' },
  { value: '地中海航线', label: '地中海航线' },
  { value: '亚洲区域航线', label: '亚洲区域航线' },
  { value: '中东航线', label: '中东航线' },
  { value: '非洲航线', label: '非洲航线' },
  { value: '欧美航线', label: '欧美航线' },
  { value: '波罗的海航线', label: '波罗的海航线' },
  { value: '南美航线', label: '南美航线' }
];

// 币种选项 - 暂时保留，后续可能使用
// const currencyOptions = [
//   { value: 'USD', label: 'USD' },
//   { value: 'CNY', label: 'CNY' }
// ];

// 船公司选项
const shippingCompanyOptions = [
  { value: 'COSCO', label: 'COSCO' },
  { value: 'MSC', label: 'MSC' },
  { value: 'MAERSK', label: 'MAERSK' },
  { value: 'CMA CGM', label: 'CMA CGM' },
  { value: 'EVERGREEN', label: 'EVERGREEN' },
  { value: 'HAPAG-LLOYD', label: 'HAPAG-LLOYD' },
  { value: 'ONE', label: 'ONE' },
  { value: 'YANG MING', label: 'YANG MING' },
  { value: 'HMM', label: 'HMM' },
  { value: 'PIL', label: 'PIL' }
];

// 起运港选项
const originPortOptions = [
  { value: '上海港', label: '上海港' },
  { value: '深圳港', label: '深圳港' },
  { value: '宁波港', label: '宁波港' },
  { value: '青岛港', label: '青岛港' },
  { value: '天津港', label: '天津港' },
  { value: '大连港', label: '大连港' },
  { value: '厦门港', label: '厦门港' },
  { value: '广州港', label: '广州港' },
  { value: '连云港', label: '连云港' },
  { value: '营口港', label: '营口港' }
];

// 费用名称选项（包含对应的币种和计费单位）
const chargeNameOptions = [
  { value: '基础海运费', label: '基础海运费', currency: 'USD', billingUnits: ['20GP', '40GP', '40HQ'] },
  { value: '燃油附加费', label: '燃油附加费', currency: 'USD', billingUnits: ['20GP', '40GP', '40HQ'] },
  { value: '港口费', label: '港口费', currency: 'CNY', billingUnits: ['票'] },
  { value: '文件费', label: '文件费', currency: 'USD', billingUnits: ['票'] },
  { value: '操作费', label: '操作费', currency: 'CNY', billingUnits: ['箱'] },
  { value: '设备费', label: '设备费', currency: 'USD', billingUnits: ['20GP', '40GP'] },
  { value: '安全费', label: '安全费', currency: 'USD', billingUnits: ['票'] },
  { value: '码头费', label: '码头费', currency: 'CNY', billingUnits: ['箱'] }
];

// 港前运价费用名称选项
const precarriageChargeNameOptions = [
  { value: '港前运输费', label: '港前运输费', currency: 'CNY', billingUnits: ['20GP', '40GP', '40HQ'] },
  { value: '拖车费', label: '拖车费', currency: 'CNY', billingUnits: ['20GP', '40GP'] },
  { value: '装箱费', label: '装箱费', currency: 'CNY', billingUnits: ['箱'] },
  { value: '港前操作费', label: '港前操作费', currency: 'CNY', billingUnits: ['票'] }
];

// 尾程运价费用名称选项
const lastmileChargeNameOptions = [
  { value: '尾程配送费', label: '尾程配送费', currency: 'USD', billingUnits: ['40GP', '40HQ'] },
  { value: '卸箱费', label: '卸箱费', currency: 'USD', billingUnits: ['箱'] },
  { value: '仓储费', label: '仓储费', currency: 'USD', billingUnits: ['票'] },
  { value: '尾程操作费', label: '尾程操作费', currency: 'USD', billingUnits: ['20GP', '40GP', '40HQ'] }
];



// 起运地区域接口
interface OriginRegion {
  id: string;
  regions: string[];
  province?: string;
  city?: string;
  district?: string;
  street?: string;
  village?: string;
  detailAddress?: string;
}

// 目的港选项（尾程运价）
const destinationPortOptionsLastmile = [
  { value: '洛杉矶港', label: '洛杉矶港' },
  { value: '长滩港', label: '长滩港' },
  { value: '奥克兰港', label: '奥克兰港' },
  { value: '西雅图港', label: '西雅图港' },
  { value: '纽约港', label: '纽约港' }
];

// 配送地址选项（尾程运价）
const deliveryAddressOptions = [
  { value: 'LAX9仓库', label: 'LAX9仓库' },
  { value: 'LGB2仓库', label: 'LGB2仓库' },
  { value: 'ONT8仓库', label: 'ONT8仓库' },
  { value: 'SEA8仓库', label: 'SEA8仓库' },
  { value: 'JFK8仓库', label: 'JFK8仓库' }
];

const PricingRuleForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  
  // 从URL获取费用类型，默认为整箱海运费
  const searchParams = new URLSearchParams(window.location.search);
  const feeType = searchParams.get('type') || 'fcl';
  
  const [form] = Form.useForm();
  const [formData, setFormData] = useState<PricingRuleFormData>({
    ...(feeType === 'fcl' && { routeName: [], shippingCompany: [], originPort: [], chargeName: '' }),
    ...(feeType === 'precarriage' && { destination: '', originPort: [], priceType: '', branchType: [], railType: [], chargeName: '' }),
    ...(feeType === 'lastmile' && { origin: '', destination: '', shippingCompany: [], chargeName: '', validPeriodStart: '', validPeriodEnd: '' }),
    currency: 'USD',
    containerRules: []
  });
  const [loading, setLoading] = useState(false);
  const [originRegions, setOriginRegions] = useState<OriginRegion[]>([]);

  // 初始化数据
  useEffect(() => {
    if (isEditing) {
      // 根据费用类型模拟不同的数据
      let mockData: PricingRuleFormData;
      
      if (feeType === 'fcl') {
        mockData = {
          ruleId: generateRuleId(),
          routeName: ['亚欧航线'],
          shippingCompany: ['COSCO'],
          originPort: ['上海港'],
          chargeName: '基础海运费',
          currency: 'USD',
          containerRules: [
            {
              id: '1',
              containerType: '20GP',
              t0Price: 50,
              t1Price: 100,
              t2Price: 150,
              t3Price: 200,
              internalSalesPrice: 80
            },
            {
              id: '2',
              containerType: '40GP',
              t0Price: 80,
              t1Price: 160,
              t2Price: 240,
              t3Price: 320,
              internalSalesPrice: 120
            },
            {
              id: '3',
              containerType: '40HQ',
              t0Price: 85,
              t1Price: 170,
              t2Price: 255,
              t3Price: 340,
              internalSalesPrice: 128
            }
          ]
        };
             } else if (feeType === 'precarriage') {
         mockData = {
           ruleId: generateRuleId(),
           destination: '盐田港',
           originPort: ['CNSHA | SHANGHAI'],
           priceType: '直拖',
           branchType: [],
           railType: [],
           chargeName: '港前运输费',
           currency: 'CNY',
           containerRules: [
             {
               id: '1',
               containerType: '20GP',
               t0Price: 50,
               t1Price: 100,
               t2Price: 150,
               t3Price: 200,
               internalSalesPrice: 80
             },
             {
               id: '2',
               containerType: '40GP',
               t0Price: 80,
               t1Price: 160,
               t2Price: 240,
               t3Price: 320,
               internalSalesPrice: 120
             }
           ]
         };
             } else if (feeType === 'lastmile') {
         mockData = {
           ruleId: generateRuleId(),
           origin: '洛杉矶港',
           destination: 'LAX9仓库',
           shippingCompany: ['MAERSK'],
           chargeName: '尾程配送费',
           currency: 'USD',
           validPeriodStart: '2024-01-01',
           validPeriodEnd: '2024-12-31',
           containerRules: [
             {
               id: '1',
               containerType: '40GP',
               t0Price: 30,
               t1Price: 60,
               t2Price: 90,
               t3Price: 120,
               internalSalesPrice: 45
             },
             {
               id: '2',
               containerType: '40HQ',
               t0Price: 35,
               t1Price: 70,
               t2Price: 105,
               t3Price: 140,
               internalSalesPrice: 52
             }
           ]
         };
      } else {
        // 默认FCL数据
        mockData = {
          ruleId: generateRuleId(),
          routeName: ['亚欧航线'],
          shippingCompany: ['COSCO'],
          originPort: ['上海港'],
          chargeName: '基础海运费',
          currency: 'USD',
          containerRules: []
        };
      }
      
      setFormData(mockData);
      form.setFieldsValue({
        ruleId: mockData.ruleId,
        ...(mockData.routeName && { routeName: mockData.routeName }),
        ...(mockData.shippingCompany && { shippingCompany: mockData.shippingCompany }),
        ...(mockData.originPort && { originPort: mockData.originPort }),
        ...(mockData.chargeName && { chargeName: mockData.chargeName }),
        ...(mockData.origin && { origin: mockData.origin }),
        ...(mockData.destination && { destination: mockData.destination }),
        ...(mockData.priceType && { priceType: mockData.priceType }),
        ...(mockData.branchType && { branchType: mockData.branchType }),
        ...(mockData.railType && { railType: mockData.railType }),
        currency: mockData.currency,
        ...(mockData.validPeriodStart && { validPeriodStart: mockData.validPeriodStart }),
        ...(mockData.validPeriodEnd && { validPeriodEnd: mockData.validPeriodEnd })
      });
    }
  }, [id, isEditing, form, feeType]);

  // 更新箱型规则
  const handleUpdateContainerRule = (id: string, field: keyof ContainerRule, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      containerRules: prev.containerRules.map(rule =>
        rule.id === id ? { ...rule, [field]: value } : rule
      )
    }));
  };

  // 添加起运地区域组
  const addOriginRegion = () => {
    const newRegion: OriginRegion = {
      id: Date.now().toString(),
      regions: []
    };
    setOriginRegions(prev => [...prev, newRegion]);
  };

  // 删除起运地区域组
  const removeOriginRegion = (id: string) => {
    setOriginRegions(prev => prev.filter(region => region.id !== id));
  };

  // 更新起运地区域字段
  const updateOriginRegionField = (id: string, field: keyof OriginRegion, value: string) => {
    setOriginRegions(prev => prev.map(region => 
      region.id === id ? { ...region, [field]: value } : region
    ));
  };

  // 处理运价类型变化
  const handlePriceTypeChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      priceType: value,
      // 清空支线类型和海铁类型
      branchType: [],
      railType: []
    }));
    
    // 清空表单中的支线类型和海铁类型字段
    form.setFieldValue('branchType', []);
    form.setFieldValue('railType', []);
  };

  // 处理费用名称变化，自动设置币种和计费单位
  const handleChargeNameChange = (value: string) => {
    let selectedCharge;
    if (feeType === 'precarriage') {
      selectedCharge = precarriageChargeNameOptions.find(option => option.value === value);
    } else if (feeType === 'lastmile') {
      selectedCharge = lastmileChargeNameOptions.find(option => option.value === value);
    } else {
      selectedCharge = chargeNameOptions.find(option => option.value === value);
    }
    
    if (selectedCharge) {
      const newCurrency = selectedCharge.currency as 'USD' | 'CNY';
      setFormData(prev => ({
        ...prev,
        chargeName: value,
        currency: newCurrency,
        billingUnits: selectedCharge.billingUnits,
        // 根据计费单位自动生成对应的容器规则
        containerRules: selectedCharge.billingUnits.map((unit, index) => ({
          id: (Date.now() + index).toString(),
          containerType: unit,
          t0Price: 0,
          t1Price: 0,
          t2Price: 0,
          t3Price: 0,
          internalSalesPrice: 0
        }))
      }));
      form.setFieldValue('currency', newCurrency);
    }
  };

  // 自定义验证规则：航线名称、船公司、起运港三选一至少必填一个
  const validateAtLeastOne = (_value: any, callback: (error?: string) => void) => {
    const formValues = form.getFieldsValue();
    const { routeName, shippingCompany, originPort } = formValues;
    
    // 检查数组字段是否有值
    const hasRouteName = Array.isArray(routeName) && routeName.length > 0;
    const hasShippingCompany = Array.isArray(shippingCompany) && shippingCompany.length > 0;
    const hasOriginPort = Array.isArray(originPort) && originPort.length > 0;
    
    if (!hasRouteName && !hasShippingCompany && !hasOriginPort) {
      callback('航线名称、船公司、起运港至少需要填写一个');
    } else {
      callback();
    }
  };

  // 保存数据
  const handleSave = async () => {
    try {
      const basicValues = await form.validate();
      
      // 验证计费单位规则
      if (formData.containerRules.length === 0) {
        Message.error('请至少添加一个计费单位规则');
        return;
      }

      // 验证计费单位规则完整性
      for (const rule of formData.containerRules) {
        if (!rule.containerType) {
          Message.error('请选择所有计费单位');
          return;
        }
      }

      // 检查计费单位重复
      const containerTypes = formData.containerRules.map(rule => rule.containerType);
      const uniqueTypes = new Set(containerTypes);
      if (containerTypes.length !== uniqueTypes.size) {
        Message.error('计费单位不能重复');
        return;
      }

      // 港前运价特殊验证：起运地区域
      if (feeType === 'precarriage') {
        if (originRegions.length === 0) {
          Message.error('请至少添加一个起运地区域组');
          return;
        }
        
        // 验证每个区域组都有选择的区域
        for (const region of originRegions) {
          if (region.regions.length === 0) {
            Message.error('每个起运地区域组至少需要选择一个区域');
            return;
          }
        }
      }

      setLoading(true);

      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));

      const saveData = {
        ...basicValues,
        containerRules: formData.containerRules,
        // 港前运价特有字段
        ...(feeType === 'precarriage' && {
          originRegions: originRegions
        })
      };

      console.log('保存数据:', saveData);
      
      Message.success(isEditing ? '编辑成功' : '新增成功');
      navigate('/controltower/saas/pricing-rule-management');
    } catch (error) {
      console.error('保存失败:', error);
      Message.error('保存失败，请检查表单数据');
    } finally {
      setLoading(false);
    }
  };

  // 取消操作
  const handleCancel = () => {
    navigate('/controltower/saas/pricing-rule-management');
  };

  // 箱型规则表格列定义
  const containerRuleColumns = [
    {
      title: '计费单位',
      dataIndex: 'containerType',
      width: 120,
      render: (_: unknown, record: ContainerRule) => (
        <span style={{ 
          padding: '4px 8px',
          backgroundColor: '#f2f3f5',
          borderRadius: '4px',
          fontSize: '12px',
          color: '#1d2129'
        }}>
          {record.containerType}
        </span>
      )
    },
    // 港前运价和尾程运价不再显示基础价格列
    {
      title: 'T0加价',
      dataIndex: 't0Price',
      width: 120,
      render: (_: any, record: ContainerRule) => (
        <InputNumber
          placeholder="T0加价"
          value={record.t0Price}
          onChange={(value) => handleUpdateContainerRule(record.id, 't0Price', value || 0)}
          min={0}
          precision={2}
          style={{ width: '100%' }}
        />
      )
    },
    {
      title: 'T1加价',
      dataIndex: 't1Price',
      width: 120,
      render: (_: any, record: ContainerRule) => (
        <InputNumber
          placeholder="T1加价"
          value={record.t1Price}
          onChange={(value) => handleUpdateContainerRule(record.id, 't1Price', value || 0)}
          min={0}
          precision={2}
          style={{ width: '100%' }}
        />
      )
    },
    {
      title: 'T2加价',
      dataIndex: 't2Price',
      width: 120,
      render: (_: any, record: ContainerRule) => (
        <InputNumber
          placeholder="T2加价"
          value={record.t2Price}
          onChange={(value) => handleUpdateContainerRule(record.id, 't2Price', value || 0)}
          min={0}
          precision={2}
          style={{ width: '100%' }}
        />
      )
    },
    {
      title: 'T3加价',
      dataIndex: 't3Price',
      width: 120,
      render: (_: any, record: ContainerRule) => (
        <InputNumber
          placeholder="T3加价"
          value={record.t3Price}
          onChange={(value) => handleUpdateContainerRule(record.id, 't3Price', value || 0)}
          min={0}
          precision={2}
          style={{ width: '100%' }}
        />
      )
    },
    {
      title: '内部销售',
      dataIndex: 'internalSalesPrice',
      width: 120,
      render: (_: any, record: ContainerRule) => (
        <InputNumber
          placeholder="内部销售加价"
          value={record.internalSalesPrice}
          onChange={(value) => handleUpdateContainerRule(record.id, 'internalSalesPrice', value || 0)}
          min={0}
          precision={2}
          style={{ width: '100%' }}
        />
      )
    }
  ];

  return (
    <Card>
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title heading={4} style={{ margin: 0 }}>
            {isEditing ? '编辑加价规则' : '新增加价规则'}
          </Title>
          <Space>
            <Button icon={<IconArrowLeft />} onClick={handleCancel}>
              返回
            </Button>
            <Button 
              type="primary" 
              icon={<IconSave />} 
              loading={loading}
              onClick={handleSave}
            >
              保存
            </Button>
          </Space>
        </div>
      </div>

      {/* 基础信息 */}
      <Card title="基础信息" style={{ marginBottom: '16px' }}>
        <Form form={form} layout="vertical">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {/* 规则ID - 编辑时显示，置灰不可编辑 */}
            {isEditing && (
              <Form.Item
                label="规则ID"
                field="ruleId"
              >
                <Input 
                  placeholder="规则ID"
                  disabled
                  style={{ 
                    backgroundColor: '#f7f8fa',
                    color: '#86909c',
                    fontFamily: 'monospace',
                    fontSize: '12px'
                  }}
                />
              </Form.Item>
            )}
            
            {/* 整箱海运费字段 */}
            {feeType === 'fcl' && (
              <>
                <Form.Item
                  label="航线名称"
                  field="routeName"
                  rules={[{ validator: validateAtLeastOne }]}
                >
                  <Select 
                    mode="multiple"
                    placeholder="请选择航线名称"
                    allowClear
                    onChange={() => {
                      // 触发其他字段的重新验证
                      setTimeout(() => {
                        form.validate(['shippingCompany', 'originPort']);
                      }, 0);
                    }}
                  >
                    {routeOptions.map(option => (
                      <Option key={option.value} value={option.value}>{option.label}</Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  label="船公司"
                  field="shippingCompany"
                  rules={[{ validator: validateAtLeastOne }]}
                >
                  <Select 
                    mode="multiple"
                    placeholder="请选择船公司"
                    allowClear
                    onChange={() => {
                      // 触发其他字段的重新验证
                      setTimeout(() => {
                        form.validate(['routeName', 'originPort']);
                      }, 0);
                    }}
                  >
                    {shippingCompanyOptions.map(option => (
                      <Option key={option.value} value={option.value}>{option.label}</Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  label="起运港"
                  field="originPort"
                  rules={[{ validator: validateAtLeastOne }]}
                >
                  <Select 
                    mode="multiple"
                    placeholder="请选择起运港"
                    allowClear
                    onChange={() => {
                      // 触发其他字段的重新验证
                      setTimeout(() => {
                        form.validate(['routeName', 'shippingCompany']);
                      }, 0);
                    }}
                  >
                    {originPortOptions.map(option => (
                      <Option key={option.value} value={option.value}>{option.label}</Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  label="费用名称"
                  field="chargeName"
                  rules={[{ required: true, message: '请选择费用名称' }]}
                >
                  <Select 
                    placeholder="请选择费用名称"
                    onChange={handleChargeNameChange}
                  >
                    {chargeNameOptions.map(option => (
                      <Option key={option.value} value={option.value}>{option.label}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </>
            )}

            {/* 港前运价字段 */}
            {feeType === 'precarriage' && (
              <>
                <Form.Item
                  label="起运港"
                  field="originPort"
                  rules={[{ required: true, message: '请选择起运港' }]}
                >
                  <Select mode="multiple" placeholder="请选择起运港">
                    {originPortOptions.map(option => (
                      <Option key={option.value} value={option.value}>{option.label}</Option>
                    ))}
                  </Select>
                </Form.Item>

                {/* 起运地区域维护 */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 500, color: '#1d2129' }}>起运地区域选择</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Button
                        type="outline"
                        size="mini"
                        icon={<IconRobot />}
                      >
                        AI识别
                      </Button>
                      <Button
                        type="primary"
                        size="mini"
                        icon={<IconPlus />}
                        onClick={addOriginRegion}
                      >
                        添加区域
                      </Button>
                    </div>
                  </div>
                  
                  {originRegions.length === 0 ? (
                    <div style={{ 
                      padding: '24px', 
                      textAlign: 'center', 
                      backgroundColor: '#f7f8fa', 
                      borderRadius: '6px',
                      border: '1px dashed #c9cdd4'
                    }}>
                      <div style={{ color: '#86909c', fontSize: '14px' }}>暂无起运地区域配置</div>
                      <div style={{ color: '#c9cdd4', fontSize: '12px', marginTop: '4px' }}>点击"添加区域"开始配置</div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {originRegions.map((region, index) => (
                        <div
                          key={region.id}
                          style={{
                            marginBottom: '16px',
                            border: '1px solid #e5e6eb',
                            borderRadius: '8px',
                            padding: '12px',
                            backgroundColor: '#f7f8fa'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <div style={{ fontSize: '14px', color: '#4e5969', fontWeight: 500 }}>区域 {index + 1}</div>
                            <Button
                              type="text"
                              size="small"
                              icon={<IconMinus />}
                              onClick={() => removeOriginRegion(region.id)}
                              style={{ color: '#f53f3f' }}
                              disabled={originRegions.length === 1}
                            />
                          </div>
                          
                          {/* 行政区划 */}
                          <div style={{ fontSize: '12px', color: '#86909c', marginBottom: '4px' }}>行政区划</div>
                          <Row gutter={[12, 8]} style={{ marginBottom: '12px' }}>
                            <Col span={8}>
                              <Select
                                placeholder="省份/直辖市/自治区"
                                value={region.province}
                                onChange={(value) => updateOriginRegionField(region.id, 'province', value)}
                                style={{ width: '100%' }}
                                allowClear
                              >
                                <Option value="浙江省">浙江省</Option>
                                <Option value="江苏省">江苏省</Option>
                                <Option value="上海市">上海市</Option>
                                <Option value="广东省">广东省</Option>
                              </Select>
                            </Col>
                            <Col span={8}>
                              <Select
                                placeholder="城市/地级市"
                                value={region.city}
                                onChange={(value) => updateOriginRegionField(region.id, 'city', value)}
                                style={{ width: '100%' }}
                                disabled={!region.province}
                                allowClear
                              >
                                <Option value="杭州市">杭州市</Option>
                                <Option value="宁波市">宁波市</Option>
                                <Option value="温州市">温州市</Option>
                              </Select>
                            </Col>
                            <Col span={8}>
                              <Select
                                placeholder="区/县/县级市"
                                value={region.district}
                                onChange={(value) => updateOriginRegionField(region.id, 'district', value)}
                                style={{ width: '100%' }}
                                disabled={!region.city}
                                allowClear
                              >
                                <Option value="西湖区">西湖区</Option>
                                <Option value="余杭区">余杭区</Option>
                                <Option value="萧山区">萧山区</Option>
                              </Select>
                            </Col>
                          </Row>
                          
                          {/* 详细定位 */}
                          <div style={{ fontSize: '12px', color: '#86909c', marginBottom: '4px' }}>详细定位</div>
                          <Row gutter={[12, 8]}>
                            <Col span={7}>
                              <Select
                                placeholder="街道/镇/乡"
                                value={region.street}
                                onChange={(value) => updateOriginRegionField(region.id, 'street', value)}
                                style={{ width: '100%' }}
                                disabled={!region.district}
                                allowClear
                              >
                                <Option value="文三街道">文三街道</Option>
                                <Option value="古荡街道">古荡街道</Option>
                                <Option value="转塘街道">转塘街道</Option>
                              </Select>
                            </Col>
                            <Col span={7}>
                              <Select
                                placeholder="村/社区/居委会"
                                value={region.village}
                                onChange={(value) => updateOriginRegionField(region.id, 'village', value)}
                                style={{ width: '100%' }}
                                disabled={!region.street}
                                allowClear
                              >
                                <Option value="嘉绿苑社区">嘉绿苑社区</Option>
                                <Option value="马塍路社区">马塍路社区</Option>
                                <Option value="府苑社区">府苑社区</Option>
                              </Select>
                            </Col>
                            <Col span={10}>
                              <Input
                                placeholder="详细地址（门牌号、楼栋号、房间号等）"
                                value={region.detailAddress}
                                onChange={(value) => updateOriginRegionField(region.id, 'detailAddress', value)}
                                style={{ width: '100%' }}
                                allowClear
                              />
                            </Col>
                          </Row>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Form.Item
                  label="运价类型"
                  field="priceType"
                  rules={[{ required: true, message: '请选择运价类型' }]}
                  style={{ gridColumn: '1 / -1' }}
                >
                  <Radio.Group onChange={handlePriceTypeChange}>
                    <Radio value="直拖">直拖</Radio>
                    <Radio value="支线">支线</Radio>
                    <Radio value="海铁">海铁</Radio>
                  </Radio.Group>
                </Form.Item>

                {formData.priceType === '支线' && (
                  <Form.Item
                    label="支线类型"
                    field="branchType"
                    rules={[{ required: true, message: '请选择支线类型' }]}
                    style={{ gridColumn: '1 / -1' }}
                  >
                    <Select mode="multiple" placeholder="请选择支线类型">
                      <Option value="乍浦支线">乍浦支线</Option>
                      <Option value="温州支线">温州支线</Option>
                      <Option value="海宁支线">海宁支线</Option>
                      <Option value="扬子支线">扬子支线</Option>
                      <Option value="马尾支线">马尾支线</Option>
                    </Select>
                  </Form.Item>
                )}

                {formData.priceType === '海铁' && (
                  <Form.Item
                    label="海铁类型"
                    field="railType"
                    rules={[{ required: true, message: '请选择海铁类型' }]}
                    style={{ gridColumn: '1 / -1' }}
                  >
                    <Select mode="multiple" placeholder="请选择海铁类型">
                      <Option value="义乌海铁">义乌海铁</Option>
                      <Option value="湖州海铁">湖州海铁</Option>
                      <Option value="九江海铁">九江海铁</Option>
                    </Select>
                  </Form.Item>
                )}

                <Form.Item
                  label="费用名称"
                  field="chargeName"
                  rules={[{ required: true, message: '请选择费用名称' }]}
                >
                  <Select 
                    placeholder="请选择费用名称"
                    onChange={handleChargeNameChange}
                  >
                    {precarriageChargeNameOptions.map(option => (
                      <Option key={option.value} value={option.value}>{option.label}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </>
            )}

            {/* 尾程运价字段 */}
            {feeType === 'lastmile' && (
              <>
                <Form.Item
                  label="目的港"
                  field="origin"
                  rules={[{ required: true, message: '请选择目的港' }]}
                >
                  <Select placeholder="请选择目的港">
                    {destinationPortOptionsLastmile.map(option => (
                      <Option key={option.value} value={option.value}>{option.label}</Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  label="配送地址"
                  field="destination"
                  rules={[{ required: true, message: '请选择配送地址' }]}
                >
                  <Select placeholder="请选择配送地址">
                    {deliveryAddressOptions.map(option => (
                      <Option key={option.value} value={option.value}>{option.label}</Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  label="船公司"
                  field="shippingCompany"
                  rules={[{ required: true, message: '请选择船公司' }]}
                >
                  <Select mode="multiple" placeholder="请选择船公司">
                    {shippingCompanyOptions.map(option => (
                      <Option key={option.value} value={option.value}>{option.label}</Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  label="费用名称"
                  field="chargeName"
                  rules={[{ required: true, message: '请选择费用名称' }]}
                >
                  <Select 
                    placeholder="请选择费用名称"
                    onChange={handleChargeNameChange}
                  >
                    {lastmileChargeNameOptions.map(option => (
                      <Option key={option.value} value={option.value}>{option.label}</Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  label="有效期开始"
                  field="validPeriodStart"
                  rules={[{ required: true, message: '请选择有效期开始日期' }]}
                >
                  <DatePicker 
                    placeholder="请选择开始日期"
                    style={{ width: '100%' }}
                    format="YYYY-MM-DD"
                  />
                </Form.Item>

                <Form.Item
                  label="有效期结束"
                  field="validPeriodEnd"
                  rules={[{ required: true, message: '请选择有效期结束日期' }]}
                >
                  <DatePicker 
                    placeholder="请选择结束日期"
                    style={{ width: '100%' }}
                    format="YYYY-MM-DD"
                  />
                </Form.Item>
              </>
            )}
            
            <Form.Item
              label="币种"
              field="currency"
              rules={[{ required: true, message: '币种不能为空' }]}
            >
              <Input 
                value={formData.currency || '请选择费用名称'}
                placeholder="自动设置"
                disabled={true}
                style={{ 
                  backgroundColor: '#f7f8fa',
                  color: '#86909c'
                }}
              />
            </Form.Item>

            {/* 计费单位字段 - 根据费用名称自动带出，置灰不可编辑 */}
            <Form.Item
              label="计费单位"
              field="billingUnits"
            >
              <Input 
                value={formData.billingUnits ? formData.billingUnits.join(', ') : '请选择费用名称'}
                placeholder="根据费用名称自动带出"
                disabled={true}
                style={{ 
                  backgroundColor: '#f7f8fa',
                  color: '#86909c'
                }}
              />
            </Form.Item>
          </div>
        </Form>
      </Card>

      {/* 计费单位规则配置 */}
      <Card 
        title="计费单位规则配置"
      >
        <Table
          columns={containerRuleColumns}
          data={formData.containerRules}
          rowKey="id"
          pagination={false}
          scroll={{ x: 800 }}
          noDataElement={
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
              请先选择费用名称，系统将自动生成对应的计费单位规则
            </div>
          }
        />
        
        {formData.containerRules.length > 0 && (
          <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#f7f8fa', borderRadius: '4px' }}>
            <div style={{ fontSize: '12px', color: '#666', lineHeight: '1.5' }}>
              <div>• T0-T3：表示不同客户级别的加价幅度</div>
              <div>• 内部销售：内部销售人员专用加价幅度</div>
              <div>• 所有价格单位与选择的币种一致</div>
            </div>
          </div>
        )}
      </Card>
    </Card>
  );
};

export default PricingRuleForm;