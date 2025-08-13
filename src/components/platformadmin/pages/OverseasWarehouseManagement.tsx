import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Checkbox,
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
const { TextArea } = Input;

// 海外仓库数据接口
interface OverseasWarehouse {
  id: string;
  warehouseCode: string;
  nameCn: string;
  nameEn: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;
  detailAddress: string;
  warehouseType: 'amazon' | 'yicang' | 'other';
  status: 'enabled' | 'disabled';
}

// 仓库类型选项
const warehouseTypeOptions = [
  { value: 'amazon', label: '亚马逊仓' },
  { value: 'yicang', label: '易仓' },
  { value: 'other', label: '其他' }
];

// 国家选项（示例）
const countryOptions = [
  { value: 'US', label: '美国' },
  { value: 'CA', label: '加拿大' },
  { value: 'GB', label: '英国' },
  { value: 'DE', label: '德国' },
  { value: 'FR', label: '法国' },
  { value: 'JP', label: '日本' },
  { value: 'AU', label: '澳大利亚' }
];

// 搜索筛选参数
interface SearchParams {
  keyword: string;
  country: string;
  warehouseType: string;
  status: string;
}

const OverseasWarehouseManagement: React.FC = () => {
  const [warehouseData, setWarehouseData] = useState<OverseasWarehouse[]>([]);
  const [filteredData, setFilteredData] = useState<OverseasWarehouse[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentWarehouse, setCurrentWarehouse] = useState<OverseasWarehouse | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    keyword: '',
    country: '',
    warehouseType: '',
    status: ''
  });
  const [editForm] = Form.useForm();

  // 初始化示例数据
  useEffect(() => {
    const mockData: OverseasWarehouse[] = [
      {
        id: '1',
        warehouseCode: 'US-AMZ-001',
        nameCn: '亚马逊洛杉矶仓',
        nameEn: 'Amazon Los Angeles Warehouse',
        country: 'US',
        state: 'California',
        city: 'Los Angeles',
        zipCode: '90001',
        detailAddress: '1234 Main Street, Los Angeles, CA',
        warehouseType: 'amazon',
        status: 'enabled'
      },
      {
        id: '2',
        warehouseCode: 'US-YC-002',
        nameCn: '易仓纽约仓',
        nameEn: 'ECargo New York Warehouse',
        country: 'US',
        state: 'New York',
        city: 'New York',
        zipCode: '10001',
        detailAddress: '5678 Broadway, New York, NY',
        warehouseType: 'yicang',
        status: 'enabled'
      },
      {
        id: '3',
        warehouseCode: 'GB-OTH-003',
        nameCn: '伦敦第三方仓',
        nameEn: 'London Third Party Warehouse',
        country: 'GB',
        state: 'England',
        city: 'London',
        zipCode: 'SW1A 1AA',
        detailAddress: '10 Downing Street, London',
        warehouseType: 'other',
        status: 'enabled'
      },
      {
        id: '4',
        warehouseCode: 'DE-AMZ-004',
        nameCn: '亚马逊柏林仓',
        nameEn: 'Amazon Berlin Warehouse',
        country: 'DE',
        state: 'Berlin',
        city: 'Berlin',
        zipCode: '10115',
        detailAddress: 'Unter den Linden 1, Berlin',
        warehouseType: 'amazon',
        status: 'disabled'
      },
      {
        id: '5',
        warehouseCode: 'JP-YC-005',
        nameCn: '易仓东京仓',
        nameEn: 'ECargo Tokyo Warehouse',
        country: 'JP',
        state: 'Tokyo',
        city: 'Tokyo',
        zipCode: '100-0001',
        detailAddress: '1-1-1 Chiyoda, Tokyo',
        warehouseType: 'yicang',
        status: 'enabled'
      }
    ];

    setWarehouseData(mockData);
    setFilteredData(mockData);
  }, []);

  // 搜索筛选功能
  const handleSearch = () => {
    let filtered = warehouseData;

    // 关键词搜索
    if (searchParams.keyword) {
      filtered = filtered.filter(warehouse => 
        warehouse.warehouseCode.toLowerCase().includes(searchParams.keyword.toLowerCase()) ||
        warehouse.nameCn.includes(searchParams.keyword) ||
        warehouse.nameEn.toLowerCase().includes(searchParams.keyword.toLowerCase()) ||
        warehouse.city.toLowerCase().includes(searchParams.keyword.toLowerCase())
      );
    }

    // 国家筛选
    if (searchParams.country) {
      filtered = filtered.filter(warehouse => warehouse.country === searchParams.country);
    }

    // 仓库类型筛选
    if (searchParams.warehouseType) {
      filtered = filtered.filter(warehouse => warehouse.warehouseType === searchParams.warehouseType);
    }

    // 状态筛选
    if (searchParams.status) {
      filtered = filtered.filter(warehouse => warehouse.status === searchParams.status);
    }

    setFilteredData(filtered);
  };

  // 重置搜索
  const handleReset = () => {
    setSearchParams({
      keyword: '',
      country: '',
      warehouseType: '',
      status: ''
    });
    setFilteredData(warehouseData);
  };

  // 表格列定义
  const columns = [
    {
      title: (
        <Checkbox
          indeterminate={selectedRowKeys.length > 0 && selectedRowKeys.length < filteredData.length}
          checked={selectedRowKeys.length === filteredData.length && filteredData.length > 0}
          onChange={(checked) => {
            if (checked) {
              setSelectedRowKeys(filteredData.map(item => item.id));
            } else {
              setSelectedRowKeys([]);
            }
          }}
        />
      ),
      dataIndex: 'checkbox',
      width: 60,
      render: (_: unknown, record: OverseasWarehouse) => (
        <Checkbox
          checked={selectedRowKeys.includes(record.id)}
          onChange={(checked) => {
            if (checked) {
              setSelectedRowKeys([...selectedRowKeys, record.id]);
            } else {
              setSelectedRowKeys(selectedRowKeys.filter(key => key !== record.id));
            }
          }}
        />
      ),
    },
    {
      title: '仓库编码',
      dataIndex: 'warehouseCode',
      width: 150,
    },
    {
      title: '中文名',
      dataIndex: 'nameCn',
      width: 200,
    },
    {
      title: '英文名',
      dataIndex: 'nameEn',
      width: 250,
    },
    {
      title: '国家',
      dataIndex: 'country',
      width: 100,
      render: (country: string) => {
        const countryOption = countryOptions.find(option => option.value === country);
        return countryOption ? countryOption.label : country;
      }
    },
    {
      title: '州',
      dataIndex: 'state',
      width: 120,
    },
    {
      title: '城市',
      dataIndex: 'city',
      width: 120,
    },
    {
      title: '邮编',
      dataIndex: 'zipCode',
      width: 100,
    },
    {
      title: '仓库类型',
      dataIndex: 'warehouseType',
      width: 120,
      render: (type: string) => {
        const typeOption = warehouseTypeOptions.find(option => option.value === type);
        const colorMap = {
          amazon: 'orange',
          yicang: 'blue',
          other: 'gray'
        };
        return (
          <Tag color={colorMap[type as keyof typeof colorMap]}>
            {typeOption ? typeOption.label : type}
          </Tag>
        );
      }
    },
    {
      title: '详细地址',
      dataIndex: 'detailAddress',
      width: 300,
      render: (address: string) => (
        <div style={{ 
          maxWidth: '280px', 
          overflow: 'hidden', 
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }} title={address}>
          {address}
        </div>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={status === 'enabled' ? 'green' : 'red'}>
          {status === 'enabled' ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: 180,
      fixed: 'right' as const,
      render: (_: unknown, record: OverseasWarehouse) => (
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
            title={`确定要${record.status === 'enabled' ? '禁用' : '启用'}此仓库吗？`}
            onOk={() => handleToggleStatus(record.id, record.status)}
          >
            <Button 
              type="text" 
              size="small" 
              status={record.status === 'enabled' ? 'warning' : 'success'}
            >
              {record.status === 'enabled' ? '禁用' : '启用'}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 处理编辑
  const handleEdit = (record: OverseasWarehouse) => {
    setCurrentWarehouse(record);
    setIsEditing(true);
    editForm.setFieldsValue({
      warehouseCode: record.warehouseCode,
      nameCn: record.nameCn,
      nameEn: record.nameEn,
      country: record.country,
      state: record.state,
      city: record.city,
      zipCode: record.zipCode,
      detailAddress: record.detailAddress,
      warehouseType: record.warehouseType
    });
    setEditModalVisible(true);
  };

  // 处理新增
  const handleAdd = () => {
    setCurrentWarehouse(null);
    setIsEditing(false);
    editForm.resetFields();
    setEditModalVisible(true);
  };

  // 处理状态切换
  const handleToggleStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'enabled' ? 'disabled' : 'enabled';
    setWarehouseData(prev => prev.map(warehouse => 
      warehouse.id === id ? { ...warehouse, status: newStatus } : warehouse
    ));
    setFilteredData(prev => prev.map(warehouse => 
      warehouse.id === id ? { ...warehouse, status: newStatus } : warehouse
    ));
    Message.success(`仓库已${newStatus === 'enabled' ? '启用' : '禁用'}`);
  };

  // 批量启用
  const handleBatchEnable = () => {
    if (selectedRowKeys.length === 0) {
      Message.warning('请选择要启用的仓库');
      return;
    }
    
    setWarehouseData(prev => prev.map(warehouse => 
      selectedRowKeys.includes(warehouse.id) ? { ...warehouse, status: 'enabled' } : warehouse
    ));
    setFilteredData(prev => prev.map(warehouse => 
      selectedRowKeys.includes(warehouse.id) ? { ...warehouse, status: 'enabled' } : warehouse
    ));
    
    setSelectedRowKeys([]);
    Message.success(`已启用 ${selectedRowKeys.length} 个仓库`);
  };

  // 批量禁用
  const handleBatchDisable = () => {
    if (selectedRowKeys.length === 0) {
      Message.warning('请选择要禁用的仓库');
      return;
    }
    
    setWarehouseData(prev => prev.map(warehouse => 
      selectedRowKeys.includes(warehouse.id) ? { ...warehouse, status: 'disabled' } : warehouse
    ));
    setFilteredData(prev => prev.map(warehouse => 
      selectedRowKeys.includes(warehouse.id) ? { ...warehouse, status: 'disabled' } : warehouse
    ));
    
    setSelectedRowKeys([]);
    Message.success(`已禁用 ${selectedRowKeys.length} 个仓库`);
  };

  // 保存仓库编辑
  const handleSaveWarehouse = async () => {
    try {
      const values = await editForm.validate();
      
      const warehouseItem = {
        ...values,
        id: isEditing ? currentWarehouse?.id : Date.now().toString(),
        status: isEditing ? currentWarehouse?.status : 'enabled' as const
      };

      if (isEditing) {
        // 更新现有仓库
        setWarehouseData(prev => prev.map(warehouse => 
          warehouse.id === currentWarehouse?.id ? { ...warehouse, ...warehouseItem } : warehouse
        ));
        setFilteredData(prev => prev.map(warehouse => 
          warehouse.id === currentWarehouse?.id ? { ...warehouse, ...warehouseItem } : warehouse
        ));
        Message.success('仓库信息已更新');
      } else {
        // 新增仓库
        const newWarehouse = { ...warehouseItem, id: Date.now().toString() };
        setWarehouseData(prev => [...prev, newWarehouse]);
        setFilteredData(prev => [...prev, newWarehouse]);
        Message.success('仓库已添加');
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
        <Title heading={4} style={{ margin: 0 }}>海外仓库管理</Title>
      </div>

      {/* 搜索筛选区域 */}
      <Card style={{ marginBottom: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: '16px', alignItems: 'flex-end' }}>
          <div>
            <div style={{ marginBottom: '4px', fontSize: '14px', color: '#666' }}>关键词搜索</div>
            <Input
              placeholder="仓库编码、名称、城市"
              value={searchParams.keyword}
              onChange={(value) => setSearchParams(prev => ({ ...prev, keyword: value }))}
            />
          </div>
          <div>
            <div style={{ marginBottom: '4px', fontSize: '14px', color: '#666' }}>国家</div>
            <Select
              placeholder="选择国家"
              value={searchParams.country}
              onChange={(value) => setSearchParams(prev => ({ ...prev, country: value }))}
              allowClear
            >
              {countryOptions.map(option => (
                <Option key={option.value} value={option.value}>{option.label}</Option>
              ))}
            </Select>
          </div>
          <div>
            <div style={{ marginBottom: '4px', fontSize: '14px', color: '#666' }}>仓库类型</div>
            <Select
              placeholder="选择仓库类型"
              value={searchParams.warehouseType}
              onChange={(value) => setSearchParams(prev => ({ ...prev, warehouseType: value }))}
              allowClear
            >
              {warehouseTypeOptions.map(option => (
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
              新增仓库
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
        scroll={{ x: 1600 }}
        pagination={{
          pageSize: 10,
          showTotal: true,
          showJumper: true,
          sizeCanChange: true,
        }}
      />

      {/* 新增/编辑仓库弹窗 */}
      <Modal
        title={isEditing ? '编辑仓库' : '新增仓库'}
        visible={editModalVisible}
        onOk={handleSaveWarehouse}
        onCancel={() => setEditModalVisible(false)}
        style={{ width: 700 }}
      >
        <Form form={editForm} layout="vertical">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Form.Item
              field="warehouseCode"
              label="仓库编码"
              rules={[{ required: true, message: '请输入仓库编码' }]}
            >
              <Input placeholder="请输入仓库编码" />
            </Form.Item>
            
            <Form.Item
              field="warehouseType"
              label="仓库类型"
              rules={[{ required: true, message: '请选择仓库类型' }]}
            >
              <Select placeholder="请选择仓库类型">
                {warehouseTypeOptions.map(option => (
                  <Option key={option.value} value={option.value}>{option.label}</Option>
                ))}
              </Select>
            </Form.Item>
            
            <Form.Item
              field="nameCn"
              label="中文名"
              rules={[{ required: true, message: '请输入中文名' }]}
            >
              <Input placeholder="请输入中文名" />
            </Form.Item>
            
            <Form.Item
              field="nameEn"
              label="英文名"
              rules={[{ required: true, message: '请输入英文名' }]}
            >
              <Input placeholder="请输入英文名" />
            </Form.Item>
            
            <Form.Item
              field="country"
              label="国家"
              rules={[{ required: true, message: '请选择国家' }]}
            >
              <Select placeholder="请选择国家">
                {countryOptions.map(option => (
                  <Option key={option.value} value={option.value}>{option.label}</Option>
                ))}
              </Select>
            </Form.Item>
            
            <Form.Item
              field="state"
              label="州"
              rules={[{ required: true, message: '请输入州' }]}
            >
              <Input placeholder="请输入州/省份" />
            </Form.Item>
            
            <Form.Item
              field="city"
              label="城市"
              rules={[{ required: true, message: '请输入城市' }]}
            >
              <Input placeholder="请输入城市" />
            </Form.Item>
            
            <Form.Item
              field="zipCode"
              label="邮编"
              rules={[{ required: true, message: '请输入邮编' }]}
            >
              <Input placeholder="请输入邮编" />
            </Form.Item>
          </div>
          
          <Form.Item
            field="detailAddress"
            label="详细地址"
            rules={[{ required: true, message: '请输入详细地址' }]}
          >
            <TextArea placeholder="请输入详细地址" rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default OverseasWarehouseManagement; 