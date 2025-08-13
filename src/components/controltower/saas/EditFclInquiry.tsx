import React, { useState, useMemo, useEffect } from 'react';
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
  Message,
  Table
} from '@arco-design/web-react';

import { IconSave, IconDelete, IconPlus, IconMinus } from '@arco-design/web-react/icon';
import { useNavigate, useParams } from 'react-router-dom';
import ControlTowerSaasLayout from "./ControlTowerSaasLayout";
import './CreateFclInquiry.css';

const { Row, Col } = Grid;
const FormItem = Form.Item;
const Option = Select.Option;

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

// 集装箱类型接口
interface ContainerItem {
  id: number;
  type: string;
  count: number;
}

/**
 * 编辑整箱询价表单组件
 */
const EditFclInquiry: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();
  
  // 保存表单状态
  const [formState, setFormState] = useState({
    inquiryNo: '',  // 询价编号
    inquirer: '',   // 询价人
    precarriageChecked: true,  // 港前报价
    mainlineChecked: true,     // 干线报价
    lastmileChecked: true,     // 尾程报价
    cargoNature: '询价',       // 货盘性质
    serviceType: '请选择',     // 服务条款
    clientType: '不指定',      // 委托单位
    clientCompany: '',         // 委托单位正式客户
    clientName: '',            // 委托单位名称
    cargoReadyTimeType: '区间', // 货好时间类型
    cargoReadyTime: '二周内',   // 货好时间
    cargoReadyDate: '',        // 货好具体日期
    transitType: '不指定',     // 直达/中转
    route: '跨太平洋东行',      // 航线
    departurePort: 'CNSHA | Shanghai',    // 起运港
    dischargePort: 'USLAX | Los Angeles', // 目的港
    transitPort: '',           // 中转港
    cargoQuality: '实单',      // 货盘性质
    shipCompany: '不指定',     // 船公司
    goodsType: '普货',         // 货物类型
    dangerLevel: '',           // 危险品等级
    unNo: '',                  // UN No
    length: '',                // 长宽高
    temperature: '',           // 温度
    humidity: '',              // 湿度量
    weight: '',                // 重量
    serviceTerms: 'DDP',       // 服务条款
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

  // 集装箱列表状态
  const [containerList, setContainerList] = useState<ContainerItem[]>([
    { id: 1, type: '20GP', count: 1 }
  ]);

  // 运价明细数据
  const [mainlineRates, setMainlineRates] = useState<MainlineRateDetail[]>([]);
  const [precarriageRates, setPrecarriageRates] = useState<PrecarriageRateDetail[]>([]);
  const [oncarriageRates, setOncarriageRates] = useState<OncarriageRateDetail[]>([]);

  // 选择框状态
  const [selectedMainlineRate, setSelectedMainlineRate] = useState('');
  const [selectedPrecarriageRate, setSelectedPrecarriageRate] = useState('');
  const [selectedOncarriageRate, setSelectedOncarriageRate] = useState('');

  // 查询匹配运价状态
  const [hasQueriedRates, setHasQueriedRates] = useState(false);
  const [isQuerying, setIsQuerying] = useState(false);

  // 导出运价相关状态


  // 已选择的箱型列表，用于禁用重复选择
  const selectedContainerTypes = useMemo(() => {
    return containerList.map(item => item.type);
  }, [containerList]);

  // 加载询价详情数据
  useEffect(() => {
    const loadInquiryDetail = async () => {
      // 这里应该调用API获取数据，暂时使用模拟数据
      const mockData = {
        inquiryNo: id || 'R20240001',
        inquirer: '张三',
        precarriageChecked: true,
        mainlineChecked: true,
        lastmileChecked: true,
        cargoNature: '询价',
        clientType: '正式客户',
        clientCompany: '上海测试',
        cargoReadyTime: '1周内',
        route: '跨太平洋东行',
        departurePort: 'CNSHA | Shanghai',
        dischargePort: 'USLAX | Los Angeles',
        shipCompany: '不指定',
        transitType: '直达',
        serviceTerms: 'DDP',
        remark: '电子产品 优先考虑直达航线'
      };
      
      setFormState(prevState => ({
        ...prevState,
        ...mockData
      }));
      
      // 模拟集装箱数据
      setContainerList([
        { id: 1, type: '20GP', count: 1 },
        { id: 2, type: '40HC', count: 2 }
      ]);
    };
    
    loadInquiryDetail();
  }, [id]);

  // 添加新的箱型
  const addContainerItem = () => {
    if (containerList.length >= 5) {
      Message.warning('最多只能添加5个箱型');
      return;
    }
    
    const newId = containerList.length > 0 ? Math.max(...containerList.map(item => item.id)) + 1 : 1;
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

  // 更新表单状态
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
  };

  // 保存编辑
  const handleSave = () => {
    const formData = {
      ...formState,
      containers: containerList,
      mainlineRates,
      precarriageRates,
      oncarriageRates
    };
    
    console.log('保存编辑数据:', formData);
    Message.success('询价信息保存成功');
    navigate('/controltower/saas/inquiry-management');
  };

  // 返回询价管理页面
  const handleCancel = () => {
    navigate('/controltower/saas/inquiry-management');
  };

  // 获取当前可用的箱型列表
  const getAvailableContainerTypes = () => {
    return containerList.map(container => container.type).filter(type => type !== '');
  };

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
          <Breadcrumb.Item>编辑整箱询价</Breadcrumb.Item>
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
              <Button icon={<IconSave />} onClick={handleSave}>保存修改</Button>
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
                      <Input placeholder="询价编号" value={formState.inquiryNo} disabled />
                    </FormItem>
                  </Col>
                  
                  <Col span={24}>
                    <FormItem label="询价人" field="inquirer">
                      <Input 
                        placeholder="询价人" 
                        value={formState.inquirer}
                        onChange={(value) => handleFormChange('inquirer', value)}
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
                              <Option value="上海测试">上海测试</Option>
                              <Option value="深圳测试">深圳测试</Option>
                              <Option value="青岛测试">青岛测试</Option>
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
                </Row>
              </div>
            </Col>

            {/* 右侧区域：货物信息 */}
            <Col span={12}>
              <div className="border rounded p-4 mb-4">
                <div className="text-blue-600 font-bold border-l-4 border-blue-600 pl-2 mb-4">货物信息</div>
                
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <FormItem label="航线" field="route">
                      <Select 
                        placeholder="请选择航线" 
                        style={{ width: '100%' }}
                        value={formState.route}
                        onChange={(value) => handleFormChange('route', value)}
                      >
                        <Option value="跨太平洋东行">跨太平洋东行</Option>
                        <Option value="跨太平洋西行">跨太平洋西行</Option>
                        <Option value="远东西行">远东西行</Option>
                        <Option value="远东东行">远东东行</Option>
                        <Option value="亚洲区域">亚洲区域</Option>
                      </Select>
                    </FormItem>
                  </Col>
                  
                  <Col span={24}>
                    <FormItem label="起运港" field="departurePort">
                      <Input 
                        placeholder="请输入起运港" 
                        value={formState.departurePort}
                        onChange={(value) => handleFormChange('departurePort', value)}
                      />
                    </FormItem>
                  </Col>
                  
                  <Col span={24}>
                    <FormItem label="卸货港" field="dischargePort">
                      <Input 
                        placeholder="请输入卸货港" 
                        value={formState.dischargePort}
                        onChange={(value) => handleFormChange('dischargePort', value)}
                      />
                    </FormItem>
                  </Col>
                  
                  <Col span={24}>
                    <FormItem label="直达/中转" field="transitType">
                      <Select 
                        placeholder="请选择" 
                        style={{ width: '100%' }}
                        value={formState.transitType}
                        onChange={(value) => handleFormChange('transitType', value)}
                        allowClear
                      >
                        <Option value="直达">直达</Option>
                        <Option value="中转">中转</Option>
                        <Option value="不指定">不指定</Option>
                      </Select>
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
          
          {/* 匹配运价模块 */}
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
    </ControlTowerSaasLayout>
  );
};

export default EditFclInquiry; 