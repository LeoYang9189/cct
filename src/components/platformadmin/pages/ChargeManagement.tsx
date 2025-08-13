import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  Message,
  Popconfirm,
  Typography
} from '@arco-design/web-react';
import {
  IconPlus,
  IconEdit,
  IconSearch,
  IconRefresh,
  IconUpload,
  IconDownload
} from '@arco-design/web-react/icon';

const { Option } = Select;
const { Title } = Typography;

// 费用数据接口
interface Charge {
  id: string;
  chargeCode: string;
  chargeName: string;
  chargeNameEn: string;
  currency: string;
  billingUnit: string;
  status: 'enabled' | 'disabled';
}

// 搜索筛选参数
interface SearchParams {
  keyword: string;
  currency: string;
  status: string;
}

// 币种选项
const currencyOptions = [
  { value: 'CNY', label: '人民币' },
  { value: 'USD', label: '美元' },
  { value: 'EUR', label: '欧元' },
  { value: 'JPY', label: '日元' },
  { value: 'GBP', label: '英镑' },
  { value: 'HKD', label: '港币' }
];

// 计费单位选项
const billingUnitOptions = [
  { value: '票', label: '票' },
  { value: '箱', label: '箱' },
  { value: '20GP', label: '20GP' },
  { value: '40GP', label: '40GP' },
  { value: '40HC', label: '40HC' },
  { value: '20RF', label: '20RF' },
  { value: '40RF', label: '40RF' },
  { value: '20DG', label: '20DG' },
  { value: '40DG', label: '40DG' },
  { value: '20FR', label: '20FR' },
  { value: '40FR', label: '40FR' }
];

const ChargeManagement: React.FC = () => {
  const [data, setData] = useState<Charge[]>([]);
  const [filteredData, setFilteredData] = useState<Charge[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [currentCharge, setCurrentCharge] = useState<Charge | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    keyword: '',
    currency: '',
    status: ''
  });

  const [editForm] = Form.useForm();

  // 初始化示例数据
  useEffect(() => {
    const mockData: Charge[] = [
      {
        id: '1',
        chargeCode: 'DGSBF',
        chargeName: '危险品申报费',
        chargeNameEn: 'Dangerous Goods Declaration Fee',
        currency: 'CNY',
        billingUnit: '20DG / 40DG',
        status: 'enabled' as const
      },
      {
        id: '2',
        chargeCode: 'LSS',
        chargeName: '低硫附加费',
        chargeNameEn: 'Low Sulphur Surcharge',
        currency: 'USD',
        billingUnit: '20GP / 40GP / 40HC',
        status: 'enabled' as const
      },
      {
        id: '3',
        chargeCode: 'CDF',
        chargeName: '船舶费',
        chargeNameEn: 'Container Deposit Fee',
        currency: 'CNY',
        billingUnit: '票',
        status: 'enabled' as const
      },
      {
        id: '4',
        chargeCode: 'QTDFF',
        chargeName: '其他的港电费',
        chargeNameEn: 'Other Terminal Dues & Facilities Fee',
        currency: 'CNY',
        billingUnit: '票',
        status: 'enabled' as const
      },
      {
        id: '5',
        chargeCode: 'AZCCF',
        chargeName: '澳洲操作费',
        chargeNameEn: 'Australia Container Cleaning Fee',
        currency: 'CNY',
        billingUnit: '20GP / 20RF / 40RF / 20DG / 40DG / 20FR / 40FR',
        status: 'enabled' as const
      },
      {
        id: '6',
        chargeCode: 'ZDYBCZF',
        chargeName: '中东印巴操作费',
        chargeNameEn: 'Middle East India Pakistan Operation Fee',
        currency: 'CNY',
        billingUnit: '20GP / 20RF / 40RF / 20DG / 40DG / 20FR / 40FR',
        status: 'enabled' as const
      },
      {
        id: '7',
        chargeCode: 'MJCZF',
        chargeName: '美加操作费',
        chargeNameEn: 'US Canada Operation Fee',
        currency: 'CNY',
        billingUnit: '20GP / 20RF / 40RF / 20DG / 40DG / 20FR / 40FR',
        status: 'enabled' as const
      },
      {
        id: '8',
        chargeCode: 'SBGLF',
        chargeName: '设备管理费',
        chargeNameEn: 'Equipment Management Fee',
        currency: 'CNY',
        billingUnit: '箱',
        status: 'enabled' as const
      },
      {
        id: '9',
        chargeCode: 'MFF',
        chargeName: '目的港放单费',
        chargeNameEn: 'Manifest Filing Fee',
        currency: 'CNY',
        billingUnit: '票',
        status: 'enabled' as const
      },
      {
        id: '10',
        chargeCode: 'CDFF',
        chargeName: '拆单费',
        chargeNameEn: 'Container Discharge Fee',
        currency: 'CNY',
        billingUnit: '票',
        status: 'disabled' as const
      },
      {
        id: '11',
        chargeCode: 'BDF',
        chargeName: '并单费',
        chargeNameEn: 'Bill Discharge Fee',
        currency: 'CNY',
        billingUnit: '票',
        status: 'enabled' as const
      },
      {
        id: '12',
        chargeCode: 'FDF',
        chargeName: '放单费',
        chargeNameEn: 'File Discharge Fee',
        currency: 'CNY',
        billingUnit: '箱',
        status: 'enabled' as const
      },
      {
        id: '13',
        chargeCode: 'THCTWXG',
        chargeName: 'THC台湾香港',
        chargeNameEn: 'Terminal Handling Charge Taiwan Hong Kong',
        currency: 'CNY',
        billingUnit: '20GP / 40GP',
        status: 'enabled' as const
      },
      {
        id: '14',
        chargeCode: 'YBXDFF',
        chargeName: '印巴线电放费',
        chargeNameEn: 'India Pakistan Line Electronic Release Fee',
        currency: 'CNY',
        billingUnit: '票',
        status: 'enabled' as const
      }
    ];

    setData(mockData);
    filterData(mockData);
  }, []);

  // 筛选数据
  const filterData = (dataToFilter = data) => {
    let filtered = [...dataToFilter];
    
    // 应用搜索条件
    if (searchParams.keyword) {
      filtered = filtered.filter(charge =>
        charge.chargeCode.toLowerCase().includes(searchParams.keyword.toLowerCase()) ||
        charge.chargeName.includes(searchParams.keyword) ||
        charge.chargeNameEn.toLowerCase().includes(searchParams.keyword.toLowerCase()) ||
        charge.billingUnit.toLowerCase().includes(searchParams.keyword.toLowerCase())
      );
    }

    if (searchParams.currency) {
      filtered = filtered.filter(charge => charge.currency === searchParams.currency);
    }

    if (searchParams.status) {
      filtered = filtered.filter(charge => charge.status === searchParams.status);
    }

    setFilteredData(filtered);
  };

  // 当数据或搜索参数变化时重新筛选
  useEffect(() => {
    filterData();
  }, [data, searchParams]);

  // 搜索筛选功能
  const handleSearch = () => {
    filterData();
  };

  // 重置搜索
  const handleReset = () => {
    const newSearchParams = {
      keyword: '',
      currency: '',
      status: ''
    };
    setSearchParams(newSearchParams);
  };

  const columns = [
    {
      title: '费用代码',
      dataIndex: 'chargeCode',
      width: 120,
      sorter: (a: Charge, b: Charge) => a.chargeCode.localeCompare(b.chargeCode),
    },
    {
      title: '费用名称',
      dataIndex: 'chargeName',
      width: 180,
    },
    {
      title: '费用名称（英文）',
      dataIndex: 'chargeNameEn',
      width: 220,
    },
    {
      title: '币种',
      dataIndex: 'currency',
      width: 80,
      render: (currency: string) => {
        const currencyMap: Record<string, string> = {
          'CNY': '人民币',
          'USD': '美元',
          'EUR': '欧元',
          'JPY': '日元',
          'GBP': '英镑',
          'HKD': '港币'
        };
        return currencyMap[currency] || currency;
      }
    },
    {
      title: '计费单位',
      dataIndex: 'billingUnit',
      width: 200,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 80,
      render: (status: string) => (
        <Tag color={status === 'enabled' ? 'green' : 'red'}>
          {status === 'enabled' ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      width: 150,
      render: (_: unknown, record: Charge) => (
        <Space>
          <Button 
            type="text" 
            size="small" 
            icon={<IconEdit />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title={`确定要${record.status === 'enabled' ? '禁用' : '启用'}该费用吗？`}
            onOk={() => handleToggleStatus(record.id, record.status)}
          >
            <Button type="text" size="small">
              {record.status === 'enabled' ? '禁用' : '启用'}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 处理编辑
  const handleEdit = (record: Charge) => {
    setCurrentCharge(record);
    setIsEditing(true);
    editForm.setFieldsValue({
      chargeCode: record.chargeCode,
      chargeName: record.chargeName,
      chargeNameEn: record.chargeNameEn,
      currency: record.currency,
      billingUnit: record.billingUnit
    });
    setEditModalVisible(true);
  };

  // 处理新增
  const handleAdd = () => {
    setCurrentCharge(null);
    setIsEditing(false);
    editForm.resetFields();
    setEditModalVisible(true);
  };

  // 处理状态切换
  const handleToggleStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'enabled' ? 'disabled' : 'enabled';
    setData(prev => prev.map(charge => 
      charge.id === id ? { ...charge, status: newStatus } : charge
    ));
    setFilteredData(prev => prev.map(charge => 
      charge.id === id ? { ...charge, status: newStatus } : charge
    ));
    Message.success(`费用已${newStatus === 'enabled' ? '启用' : '禁用'}`);
  };

  // 批量启用
  const handleBatchEnable = () => {
    if (selectedRowKeys.length === 0) {
      Message.warning('请选择要启用的费用');
      return;
    }
    
    setData(prev => prev.map(charge => 
      selectedRowKeys.includes(charge.id) ? { ...charge, status: 'enabled' } : charge
    ));
    setFilteredData(prev => prev.map(charge => 
      selectedRowKeys.includes(charge.id) ? { ...charge, status: 'enabled' } : charge
    ));
    
    setSelectedRowKeys([]);
    Message.success(`已启用 ${selectedRowKeys.length} 个费用`);
  };

  // 批量禁用
  const handleBatchDisable = () => {
    if (selectedRowKeys.length === 0) {
      Message.warning('请选择要禁用的费用');
      return;
    }
    
    setData(prev => prev.map(charge => 
      selectedRowKeys.includes(charge.id) ? { ...charge, status: 'disabled' } : charge
    ));
    setFilteredData(prev => prev.map(charge => 
      selectedRowKeys.includes(charge.id) ? { ...charge, status: 'disabled' } : charge
    ));
    
    setSelectedRowKeys([]);
    Message.success(`已禁用 ${selectedRowKeys.length} 个费用`);
  };

  // 保存费用编辑
  const handleSaveCharge = async () => {
    try {
      const values = await editForm.validate();
      
      const chargeData = {
        ...values,
        id: isEditing ? currentCharge?.id : Date.now().toString(),
        status: isEditing ? currentCharge?.status : 'enabled' as const
      };

      if (isEditing) {
        // 更新现有费用
        setData(prev => prev.map(charge => 
          charge.id === currentCharge?.id ? { ...charge, ...chargeData } : charge
        ));
        setFilteredData(prev => prev.map(charge => 
          charge.id === currentCharge?.id ? { ...charge, ...chargeData } : charge
        ));
        Message.success('费用信息已更新');
      } else {
        // 新增费用
        const newCharge = { ...chargeData, id: Date.now().toString() };
        setData(prev => [...prev, newCharge]);
        setFilteredData(prev => [...prev, newCharge]);
        Message.success('费用已添加');
      }

      setEditModalVisible(false);
      editForm.resetFields();
    } catch (error) {
      console.error('保存失败:', error);
    }
  };

  return (
    <Card>
      <div style={{ marginBottom: '20px' }}>
        <Title heading={4} style={{ margin: 0 }}>费用管理</Title>
      </div>

      {/* 搜索筛选区域 */}
      <Card style={{ marginBottom: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '16px', alignItems: 'flex-end' }}>
          <div>
            <div style={{ marginBottom: '4px', fontSize: '14px', color: '#666' }}>关键词搜索</div>
            <Input
              placeholder="费用代码、费用名称、计费单位"
              value={searchParams.keyword}
              onChange={(value) => setSearchParams(prev => ({ ...prev, keyword: value }))}
            />
          </div>
          <div>
            <div style={{ marginBottom: '4px', fontSize: '14px', color: '#666' }}>币种</div>
            <Select
              placeholder="选择币种"
              value={searchParams.currency}
              onChange={(value) => setSearchParams(prev => ({ ...prev, currency: value }))}
              allowClear
            >
              {currencyOptions.map(option => (
                <Option key={option.value} value={option.value}>{option.label}</Option>
              ))}
            </Select>
          </div>
          <div>
            <div style={{ marginBottom: '4px', fontSize: '14px', color: '#666' }}>状态</div>
            <Select
              placeholder="选择状态"
              value={searchParams.status}
              onChange={(value) => setSearchParams(prev => ({ ...prev, status: value }))}
              allowClear
            >
              <Option value="enabled">启用</Option>
              <Option value="disabled">禁用</Option>
            </Select>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button type="primary" icon={<IconSearch />} onClick={handleSearch}>
              搜索
            </Button>
            <Button icon={<IconRefresh />} onClick={handleReset}>
              重置
            </Button>
          </div>
        </div>
      </Card>

      {/* 操作按钮区域 */}
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button type="primary" icon={<IconPlus />} onClick={handleAdd}>
              新增费用
            </Button>
            <Button icon={<IconUpload />}>
              批量导入
            </Button>
          </div>
          {selectedRowKeys.length > 0 && (
            <div style={{ 
              display: 'flex', 
              gap: '8px', 
              paddingLeft: '12px', 
              borderLeft: '1px solid #e5e6e7',
              marginLeft: '4px'
            }}>
              <Button type="outline" onClick={handleBatchEnable}>
                批量启用 ({selectedRowKeys.length})
              </Button>
              <Button type="outline" status="warning" onClick={handleBatchDisable}>
                批量禁用 ({selectedRowKeys.length})
              </Button>
            </div>
          )}
        </div>
        <Button icon={<IconDownload />}>
          导出数据
        </Button>
      </div>

      <Table
        columns={columns}
        data={filteredData}
        rowKey="id"
        scroll={{ x: 1200 }}
        pagination={{
          pageSize: 10,
          showTotal: true,
          showJumper: true,
          sizeCanChange: true,
        }}
        rowSelection={{
          selectedRowKeys,
          onChange: (selectedKeys) => setSelectedRowKeys(selectedKeys as string[]),
          type: 'checkbox',
        }}
      />

      {/* 新增/编辑费用弹窗 */}
      <Modal
        title={isEditing ? '编辑费用' : '新增费用'}
        visible={editModalVisible}
        onOk={handleSaveCharge}
        onCancel={() => setEditModalVisible(false)}
        style={{ width: 600 }}
      >
        <Form form={editForm} layout="vertical">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Form.Item
              field="chargeCode"
              label="费用代码"
              rules={[{ required: true, message: '请输入费用代码' }]}
            >
              <Input placeholder="请输入费用代码，如：DGSBF" />
            </Form.Item>
            
            <Form.Item
              field="currency"
              label="币种"
              rules={[{ required: true, message: '请选择币种' }]}
            >
              <Select placeholder="请选择币种">
                {currencyOptions.map(option => (
                  <Option key={option.value} value={option.value}>{option.label}</Option>
                ))}
              </Select>
            </Form.Item>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Form.Item
              field="chargeName"
              label="费用名称（中文）"
              rules={[{ required: true, message: '请输入中文费用名称' }]}
            >
              <Input placeholder="请输入中文费用名称，如：危险品申报费" />
            </Form.Item>
            
            <Form.Item
              field="chargeNameEn"
              label="费用名称（英文）"
              rules={[{ required: true, message: '请输入英文费用名称' }]}
            >
              <Input placeholder="请输入英文费用名称，如：Dangerous Goods Declaration Fee" />
            </Form.Item>
          </div>
          
          <Form.Item
            field="billingUnit"
            label="计费单位"
            rules={[{ required: true, message: '请选择计费单位' }]}
          >
            <Select placeholder="请选择计费单位" mode="tags">
              {billingUnitOptions.map(option => (
                <Option key={option.value} value={option.value}>{option.label}</Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default ChargeManagement; 