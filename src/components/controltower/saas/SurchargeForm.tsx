import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Space,
  Form,
  Input,
  Select,
  Message,
  Typography,
  InputNumber,
  Table,
  Popconfirm,
  DatePicker
} from '@arco-design/web-react';
import {
  IconPlus,
  IconSave,
  IconArrowLeft,
  IconDelete
} from '@arco-design/web-react/icon';
import { useNavigate, useParams } from 'react-router-dom';

const { Option } = Select;
const { Title } = Typography;

// 按箱型计费明细接口
interface ContainerSurchargeDetail {
  id: string;
  chargeType: string; // 费用类型
  currency: string; // 币种
  price20GP: number; // 20GP价格
  price40GP: number; // 40GP价格
  price40HC: number; // 40HC价格
  price45HC: number; // 45HC价格
  price40NOR: number; // 40NOR价格
  specialNote: string; // 特殊备注
}

// 非按箱型计费明细接口
interface NonContainerSurchargeDetail {
  id: string;
  chargeType: string; // 费用名称
  currency: string; // 币种
  unit: string; // 计费单位
  unitPrice: number; // 单价
  specialNote: string; // 特殊备注
}

// 附加费表单数据接口
interface SurchargeFormData {
  usageLocation: string; // 适用起运港
  company: string; // 船公司
  usageLine: string[]; // 适用航线
  usageStatus: 'active' | 'inactive'; // 费用状态
  usageUser: string; // 更新用户
  validityPeriod: [Date, Date] | null; // 有效期
  containerSurchargeDetails: ContainerSurchargeDetail[]; // 按箱型计费明细列表
  nonContainerSurchargeDetails: NonContainerSurchargeDetail[]; // 非按箱型计费明细列表
}

// 地点选项
const locationOptions = [
  { value: 'Shanghai', label: 'Shanghai' },
  { value: 'Ningbo', label: 'Ningbo' },
  { value: 'Shenzhen', label: 'Shenzhen' },
  { value: 'Qingdao', label: 'Qingdao' },
  { value: 'Tianjin', label: 'Tianjin' }
];

// 船公司选项
const companyOptions = [
  { value: '商汇', label: '商汇' },
  { value: '阿联酋航运', label: '阿联酋航运' },
  { value: '马士基', label: '马士基' },
  { value: 'MSC', label: 'MSC' },
  { value: 'CMA CGM', label: 'CMA CGM' }
];

// 航线选项
const lineOptions = [
  { value: '东南亚线', label: '东南亚线' },
  { value: '各港线', label: '各港线' },
  { value: '中东线', label: '中东线' },
  { value: '印巴线', label: '印巴线' },
  { value: '澳洲线', label: '澳洲线' },
  { value: '欧洲线', label: '欧洲线' },
  { value: '地中海线', label: '地中海线' },
  { value: '美东线', label: '美东线' },
  { value: '美西线', label: '美西线' }
];

// 费用类型选项
const chargeTypeOptions = [
  { value: '文件费', label: '文件费', currency: 'CNY' },
  { value: '操作费', label: '操作费', currency: 'CNY' },
  { value: '港杂费', label: '港杂费', currency: 'USD' },
  { value: '燃油费', label: '燃油费', currency: 'USD' },
  { value: '安全费', label: '安全费', currency: 'USD' },
  { value: '码头费', label: '码头费', currency: 'USD' }
];

// 币种选项 - 暂时保留，后续可能使用
// const currencyOptions = [
//   { value: 'CNY', label: 'CNY' },
//   { value: 'USD', label: 'USD' },
//   { value: 'EUR', label: 'EUR' }
// ];

// 计费单位选项
const unitOptions = [
  { value: '吨', label: '吨' },
  { value: '票', label: '票' },
  { value: '箱', label: '箱' },
  { value: '立方', label: '立方' }
];

const SurchargeForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = window.location;
  const isViewing = location.pathname.includes('/view/');
  const isEditing = !!id && !isViewing;
  
  const [form] = Form.useForm();
  const [formData, setFormData] = useState<SurchargeFormData>({
    usageLocation: '',
    company: '',
    usageLine: [],
    usageStatus: 'active',
    usageUser: '',
    validityPeriod: null,
    containerSurchargeDetails: [],
    nonContainerSurchargeDetails: []
  });
  const [loading, setLoading] = useState(false);

  // 初始化数据
  useEffect(() => {
    if (isEditing || isViewing) {
      // 模拟从API获取数据
      const mockData: SurchargeFormData = {
        usageLocation: 'Shanghai',
        company: '商汇',
        usageLine: ['东南亚线', '各港线'],
        usageStatus: 'active',
        usageUser: '李海峰',
        validityPeriod: [new Date('2024-11-01'), new Date('2030-12-30')],
        containerSurchargeDetails: [
          {
            id: '1',
            chargeType: '燃油费',
            currency: 'CNY',
            price20GP: 50,
            price40GP: 100,
            price40HC: 120,
            price45HC: 150,
            price40NOR: 110,
            specialNote: '请输入备注'
          }
        ],
        nonContainerSurchargeDetails: [
          {
            id: '1',
            chargeType: '文件费',
            currency: 'CNY',
            unit: '票',
            unitPrice: 50,
            specialNote: '请输入特殊备注'
          }
        ]
      };
      setFormData(mockData);
      form.setFieldsValue({
        usageLocation: mockData.usageLocation,
        company: mockData.company,
        usageLine: mockData.usageLine,
        usageStatus: mockData.usageStatus,
        usageUser: mockData.usageUser,
        validityPeriod: mockData.validityPeriod
      });
    }
  }, [id, isEditing, isViewing, form]);

  // 添加按箱型计费明细
  const handleAddContainerDetail = () => {
    const newDetail: ContainerSurchargeDetail = {
      id: Date.now().toString(),
      chargeType: '',
      currency: '',
      price20GP: 0,
      price40GP: 0,
      price40HC: 0,
      price45HC: 0,
      price40NOR: 0,
      specialNote: ''
    };
    setFormData(prev => ({
      ...prev,
      containerSurchargeDetails: [...prev.containerSurchargeDetails, newDetail]
    }));
  };

  // 删除按箱型计费明细
  const handleDeleteContainerDetail = (id: string) => {
    setFormData(prev => ({
      ...prev,
      containerSurchargeDetails: prev.containerSurchargeDetails.filter(detail => detail.id !== id)
    }));
  };

  // 更新按箱型计费明细
  const handleUpdateContainerDetail = (id: string, field: keyof ContainerSurchargeDetail, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      containerSurchargeDetails: prev.containerSurchargeDetails.map(detail =>
        detail.id === id ? { ...detail, [field]: value } : detail
      )
    }));
  };

  // 添加非按箱型计费明细
  const handleAddNonContainerDetail = () => {
    const newDetail: NonContainerSurchargeDetail = {
      id: Date.now().toString(),
      chargeType: '',
      currency: '',
      unit: '票',
      unitPrice: 0,
      specialNote: ''
    };
    setFormData(prev => ({
      ...prev,
      nonContainerSurchargeDetails: [...prev.nonContainerSurchargeDetails, newDetail]
    }));
  };

  // 删除非按箱型计费明细
  const handleDeleteNonContainerDetail = (id: string) => {
    setFormData(prev => ({
      ...prev,
      nonContainerSurchargeDetails: prev.nonContainerSurchargeDetails.filter(detail => detail.id !== id)
    }));
  };

  // 更新非按箱型计费明细
  const handleUpdateNonContainerDetail = (id: string, field: keyof NonContainerSurchargeDetail, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      nonContainerSurchargeDetails: prev.nonContainerSurchargeDetails.map(detail =>
        detail.id === id ? { ...detail, [field]: value } : detail
      )
    }));
  };

  // 处理按箱型计费明细的费用类型变化，自动设置币种
  const handleContainerChargeTypeChange = (id: string, value: string) => {
    const selectedCharge = chargeTypeOptions.find(option => option.value === value);
    if (selectedCharge) {
      // 同时更新费用类型和币种
      setFormData(prev => ({
        ...prev,
        containerSurchargeDetails: prev.containerSurchargeDetails.map(detail =>
          detail.id === id 
            ? { ...detail, chargeType: value, currency: selectedCharge.currency }
            : detail
        )
      }));
    }
  };

  // 处理非按箱型计费明细的费用类型变化，自动设置币种
  const handleNonContainerChargeTypeChange = (id: string, value: string) => {
    const selectedCharge = chargeTypeOptions.find(option => option.value === value);
    if (selectedCharge) {
      // 同时更新费用类型和币种
      setFormData(prev => ({
        ...prev,
        nonContainerSurchargeDetails: prev.nonContainerSurchargeDetails.map(detail =>
          detail.id === id 
            ? { ...detail, chargeType: value, currency: selectedCharge.currency }
            : detail
        )
      }));
    }
  };

  // 保存数据
  const handleSave = async () => {
    try {
      const basicValues = await form.validate();
      
      // 验证费用明细
      if (formData.containerSurchargeDetails.length === 0 && formData.nonContainerSurchargeDetails.length === 0) {
        Message.error('请至少添加一个费用明细');
        return;
      }

      // 验证按箱型计费明细完整性
      for (const detail of formData.containerSurchargeDetails) {
        if (!detail.chargeType) {
          Message.error('请选择所有按箱型计费的费用类型');
          return;
        }
      }

      // 验证非按箱型计费明细完整性
      for (const detail of formData.nonContainerSurchargeDetails) {
        if (!detail.chargeType) {
          Message.error('请选择所有非按箱型计费的费用类型');
          return;
        }
      }

      setLoading(true);

      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));

      const saveData = {
        ...basicValues,
        containerSurchargeDetails: formData.containerSurchargeDetails,
        nonContainerSurchargeDetails: formData.nonContainerSurchargeDetails
      };

      console.log('保存数据:', saveData);
      
      Message.success(isEditing ? '编辑成功' : '新增成功');
      
      // 保存成功后返回列表页
      setTimeout(() => {
        navigate('/controltower/saas/surcharge');
      }, 1000);

    } catch (error) {
      console.error('保存失败:', error);
      Message.error('保存失败，请检查表单数据');
    } finally {
      setLoading(false);
    }
  };

  // 取消操作
  const handleCancel = () => {
    navigate('/controltower/saas/surcharge');
  };

  // 按箱型计费明细表格列定义
  const containerDetailColumns = [
    {
      title: '费用类型',
      dataIndex: 'chargeType',
      key: 'chargeType',
      width: 120,
      render: (value: string, record: ContainerSurchargeDetail) => (
        isViewing ? (
          <span>{value}</span>
        ) : (
          <Select
            value={value}
            placeholder="请选择费用类型"
            style={{ width: '100%' }}
            onChange={(val) => handleContainerChargeTypeChange(record.id, val)}
          >
            {chargeTypeOptions.map(option => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        )
      )
    },
    {
      title: '币种',
      dataIndex: 'currency',
      key: 'currency',
      width: 100,
      render: (value: string, _record: ContainerSurchargeDetail) => (
        isViewing ? (
          <span>{value}</span>
        ) : (
          <Input
            value={value || '请选择费用类型'}
            placeholder="自动设置"
            style={{ width: '100%' }}
            disabled={true}
          />
        )
      )
    },
    {
      title: '20GP',
      dataIndex: 'price20GP',
      key: 'price20GP',
      width: 100,
      render: (value: number, record: ContainerSurchargeDetail) => (
        isViewing ? (
          <span>{value}</span>
        ) : (
          <InputNumber
            value={value}
            placeholder="请输入价格"
            style={{ width: '100%' }}
            onChange={(val) => handleUpdateContainerDetail(record.id, 'price20GP', val || 0)}
          />
        )
      )
    },
    {
      title: '40GP',
      dataIndex: 'price40GP',
      key: 'price40GP',
      width: 100,
      render: (value: number, record: ContainerSurchargeDetail) => (
        isViewing ? (
          <span>{value}</span>
        ) : (
          <InputNumber
            value={value}
            placeholder="请输入价格"
            style={{ width: '100%' }}
            onChange={(val) => handleUpdateContainerDetail(record.id, 'price40GP', val || 0)}
          />
        )
      )
    },
    {
      title: '40HC',
      dataIndex: 'price40HC',
      key: 'price40HC',
      width: 100,
      render: (value: number, record: ContainerSurchargeDetail) => (
        isViewing ? (
          <span>{value}</span>
        ) : (
          <InputNumber
            value={value}
            placeholder="请输入价格"
            style={{ width: '100%' }}
            onChange={(val) => handleUpdateContainerDetail(record.id, 'price40HC', val || 0)}
          />
        )
      )
    },
    {
      title: '45HC',
      dataIndex: 'price45HC',
      key: 'price45HC',
      width: 100,
      render: (value: number, record: ContainerSurchargeDetail) => (
        isViewing ? (
          <span>{value}</span>
        ) : (
          <InputNumber
            value={value}
            placeholder="请输入价格"
            style={{ width: '100%' }}
            onChange={(val) => handleUpdateContainerDetail(record.id, 'price45HC', val || 0)}
          />
        )
      )
    },
    {
      title: '40NOR',
      dataIndex: 'price40NOR',
      key: 'price40NOR',
      width: 100,
      render: (value: number, record: ContainerSurchargeDetail) => (
        isViewing ? (
          <span>{value}</span>
        ) : (
          <InputNumber
            value={value}
            placeholder="请输入价格"
            style={{ width: '100%' }}
            onChange={(val) => handleUpdateContainerDetail(record.id, 'price40NOR', val || 0)}
          />
        )
      )
    },
    {
      title: '特殊备注',
      dataIndex: 'specialNote',
      key: 'specialNote',
      width: 200,
      render: (value: string, record: ContainerSurchargeDetail) => (
        isViewing ? (
          <span>{value}</span>
        ) : (
          <Input
            value={value}
            placeholder="请输入特殊备注"
            onChange={(val) => handleUpdateContainerDetail(record.id, 'specialNote', val)}
          />
        )
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      render: (_: unknown, record: ContainerSurchargeDetail) => (
        !isViewing && (
          <Popconfirm
            title="确定要删除这条记录吗？"
            onOk={() => handleDeleteContainerDetail(record.id)}
          >
            <Button
              type="text"
              size="small"
              status="danger"
              icon={<IconDelete />}
            >
              删除
            </Button>
          </Popconfirm>
        )
      ),
    },
  ];

  // 非按箱型计费明细表格列定义
  const nonContainerDetailColumns = [
    {
      title: '费用名称',
      dataIndex: 'chargeType',
      key: 'chargeType',
      width: 120,
      render: (value: string, record: NonContainerSurchargeDetail) => (
        isViewing ? (
          <span>{value}</span>
        ) : (
          <Select
            value={value}
            placeholder="请选择费用类型"
            style={{ width: '100%' }}
            onChange={(val) => handleNonContainerChargeTypeChange(record.id, val)}
          >
            {chargeTypeOptions.map(option => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        )
      )
    },
    {
      title: '币种',
      dataIndex: 'currency',
      key: 'currency',
      width: 100,
      render: (value: string, _record: NonContainerSurchargeDetail) => (
        isViewing ? (
          <span>{value}</span>
        ) : (
          <Input
            value={value || '请选择费用类型'}
            placeholder="自动设置"
            style={{ width: '100%' }}
            disabled={true}
          />
        )
      )
    },
    {
      title: '计费单位',
      dataIndex: 'unit',
      key: 'unit',
      width: 100,
      render: (value: string, record: NonContainerSurchargeDetail) => (
        isViewing ? (
          <span>{value}</span>
        ) : (
          <Select
            value={value}
            style={{ width: '100%' }}
            onChange={(val) => handleUpdateNonContainerDetail(record.id, 'unit', val)}
          >
            {unitOptions.map(option => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        )
      )
    },
    {
      title: '单价',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      width: 120,
      render: (value: number, record: NonContainerSurchargeDetail) => (
        isViewing ? (
          <span>{value}</span>
        ) : (
          <InputNumber
            value={value}
            placeholder="请输入单价"
            style={{ width: '100%' }}
            onChange={(val) => handleUpdateNonContainerDetail(record.id, 'unitPrice', val || 0)}
          />
        )
      )
    },
    {
      title: '特殊备注',
      dataIndex: 'specialNote',
      key: 'specialNote',
      width: 200,
      render: (value: string, record: NonContainerSurchargeDetail) => (
        isViewing ? (
          <span>{value}</span>
        ) : (
          <Input
            value={value}
            placeholder="请输入特殊备注"
            onChange={(val) => handleUpdateNonContainerDetail(record.id, 'specialNote', val)}
          />
        )
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      render: (_: unknown, record: NonContainerSurchargeDetail) => (
        !isViewing && (
          <Popconfirm
            title="确定要删除这条记录吗？"
            onOk={() => handleDeleteNonContainerDetail(record.id)}
          >
            <Button
              type="text"
              size="small"
              status="danger"
              icon={<IconDelete />}
            >
              删除
            </Button>
          </Popconfirm>
        )
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Card>
        <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Title heading={4}>
            {isViewing ? '查看附加费' : isEditing ? '编辑附加费' : '新增附加费'}
          </Title>
          <Button
            icon={<IconArrowLeft />}
            onClick={handleCancel}
          >
            返回列表
          </Button>
        </div>

        <Form
          form={form}
          layout="vertical"
          onValuesChange={(changedValues) => {
            setFormData(prev => ({ ...prev, ...changedValues }));
          }}
        >
          {/* 基本信息 */}
          <Card title="基本信息" style={{ marginBottom: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              <Form.Item
                label="适用起运港"
                field="usageLocation"
                rules={[{ required: true, message: '请选择适用起运港' }]}
              >
                <Select placeholder="请选择适用起运港" disabled={isViewing}>
                  {locationOptions.map(option => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="船公司"
                field="company"
                rules={[{ required: true, message: '请选择船公司' }]}
              >
                <Select placeholder="请选择船公司" disabled={isViewing}>
                  {companyOptions.map(option => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="费用状态"
                field="usageStatus"
                rules={[{ required: true, message: '请选择费用状态' }]}
              >
                <Select placeholder="请选择费用状态" disabled={isViewing}>
                  <Option value="active">正常</Option>
                  <Option value="inactive">停用</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="适用航线"
                field="usageLine"
                rules={[{ required: true, message: '请选择适用航线' }]}
              >
                <Select
                  placeholder="请选择适用航线"
                  mode="multiple"
                  allowClear
                  disabled={isViewing}
                >
                  {lineOptions.map(option => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="更新用户"
                field="usageUser"
                rules={[{ required: true, message: '请输入更新用户' }]}
              >
                <Input placeholder="请输入更新用户" disabled={isViewing} />
              </Form.Item>

              <Form.Item
                label="有效期"
                field="validityPeriod"
                rules={[{ required: true, message: '请选择有效期' }]}
              >
                <DatePicker.RangePicker
                  style={{ width: '100%' }}
                  placeholder={['开始日期', '结束日期']}
                  disabled={isViewing}
                />
              </Form.Item>
            </div>
          </Card>

          {/* 按箱型计费明细 */}
          <Card 
            title="按箱型计费明细" 
            extra={
              !isViewing && (
                <Button
                  type="primary"
                  size="small"
                  icon={<IconPlus />}
                  onClick={handleAddContainerDetail}
                >
                  添加明细
                </Button>
              )
            }
            style={{ marginBottom: '20px' }}
          >
            <Table
              columns={containerDetailColumns}
              data={formData.containerSurchargeDetails}
              pagination={false}
              rowKey="id"
              scroll={{ x: 1000 }}
              noDataElement={
                <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                  暂无按箱型计费明细，请点击"添加明细"按钮添加
                </div>
              }
            />
          </Card>

          {/* 非按箱型计费明细 */}
          <Card 
            title="非按箱型计费明细" 
            extra={
              !isViewing && (
                <Button
                  type="primary"
                  size="small"
                  icon={<IconPlus />}
                  onClick={handleAddNonContainerDetail}
                >
                  添加明细
                </Button>
              )
            }
            style={{ marginBottom: '20px' }}
          >
            <Table
              columns={nonContainerDetailColumns}
              data={formData.nonContainerSurchargeDetails}
              pagination={false}
              rowKey="id"
              scroll={{ x: 800 }}
              noDataElement={
                <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                  暂无非按箱型计费明细，请点击"添加明细"按钮添加
                </div>
              }
            />
          </Card>

          {/* 操作按钮 */}
          <div style={{ textAlign: 'center' }}>
            <Space size="large">
              <Button size="large" onClick={handleCancel}>
                {isViewing ? '返回' : '取消'}
              </Button>
              {!isViewing && (
                <Button
                  type="primary"
                  size="large"
                  loading={loading}
                  icon={<IconSave />}
                  onClick={handleSave}
                >
                  {isEditing ? '保存修改' : '保存新增'}
                </Button>
              )}
            </Space>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default SurchargeForm; 