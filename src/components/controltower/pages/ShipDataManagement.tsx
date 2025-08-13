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
  IconRefresh
} from '@arco-design/web-react/icon';

const { Option } = Select;
const { Title } = Typography;

// 船舶资料数据接口
interface ShipData {
  id: string;
  shipName: string;
  imoNumber: string;
  country: string;
  callSign: string;
  status: 'enabled' | 'disabled';
}

// 国家选项
const countryOptions = [
  { value: 'Panama', label: 'Panama (巴拿马)' },
  { value: 'Marshall Islands', label: 'Marshall Islands (马绍尔群岛)' },
  { value: 'Hong Kong-China', label: 'Hong Kong-China (中国香港)' },
  { value: 'Liberia', label: 'Liberia (利比里亚)' },
  { value: 'Singapore', label: 'Singapore (新加坡)' },
  { value: 'Bahamas', label: 'Bahamas (巴哈马)' },
  { value: 'Malta', label: 'Malta (马耳他)' },
  { value: 'Cyprus', label: 'Cyprus (塞浦路斯)' },
  { value: 'China', label: 'China (中国)' },
  { value: 'Greece', label: 'Greece (希腊)' }
];

// 搜索筛选参数
interface SearchParams {
  keyword: string;
  country: string;
  status: string;
}

const ShipDataManagement: React.FC = () => {
  const [shipData, setShipData] = useState<ShipData[]>([]);
  const [filteredData, setFilteredData] = useState<ShipData[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentShip, setCurrentShip] = useState<ShipData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    keyword: '',
    country: '',
    status: ''
  });
  const [editForm] = Form.useForm();

  // 初始化示例数据
  useEffect(() => {
    const mockData: ShipData[] = [
      {
        id: '1',
        shipName: 'JI YUN 16',
        imoNumber: '8357332',
        country: 'Panama',
        callSign: 'HP2845',
        status: 'enabled'
      },
      {
        id: '2',
        shipName: 'SAWASDEE XIAMEN',
        imoNumber: '9940772',
        country: 'Marshall Islands',
        callSign: 'V7ZF2',
        status: 'enabled'
      },
      {
        id: '3',
        shipName: 'EVER OCEAN',
        imoNumber: '9872389',
        country: 'Hong Kong-China',
        callSign: 'VRHE8',
        status: 'enabled'
      },
      {
        id: '4',
        shipName: 'COSCO SHIPPING GALAXY',
        imoNumber: '9756432',
        country: 'China',
        callSign: 'BODU2',
        status: 'enabled'
      },
      {
        id: '5',
        shipName: 'MSC LUCINDA',
        imoNumber: '9845671',
        country: 'Liberia',
        callSign: 'A8LK4',
        status: 'enabled'
      },
      {
        id: '6',
        shipName: 'MAERSK EDINBURGH',
        imoNumber: '9632148',
        country: 'Singapore',
        callSign: '9V7892',
        status: 'disabled'
      },
      {
        id: '7',
        shipName: 'CMA CGM BOUGAINVILLE',
        imoNumber: '9454321',
        country: 'Malta',
        callSign: '9H3456',
        status: 'enabled'
      },
      {
        id: '8',
        shipName: 'HAPAG LLOYD BREMEN',
        imoNumber: '9567890',
        country: 'Cyprus',
        callSign: '5BCD7',
        status: 'enabled'
      },
      {
        id: '9',
        shipName: 'ONE INNOVATION',
        imoNumber: '9712345',
        country: 'Panama',
        callSign: 'H9AB3',
        status: 'disabled'
      },
      {
        id: '10',
        shipName: 'YANG MING EXCELLENCE',
        imoNumber: '9823456',
        country: 'Bahamas',
        callSign: 'C6EF9',
        status: 'enabled'
      }
    ];

    setShipData(mockData);
    filterData(mockData);
  }, []);

  // 筛选数据
  const filterData = (data = shipData) => {
    let filtered = [...data];
    
    // 应用搜索条件
    if (searchParams.keyword) {
      filtered = filtered.filter(item => 
        item.shipName.toLowerCase().includes(searchParams.keyword.toLowerCase()) ||
        item.imoNumber.includes(searchParams.keyword) ||
        item.callSign.toLowerCase().includes(searchParams.keyword.toLowerCase()) ||
        item.country.toLowerCase().includes(searchParams.keyword.toLowerCase())
      );
    }
    
    if (searchParams.country) {
      filtered = filtered.filter(item => item.country === searchParams.country);
    }

    if (searchParams.status) {
      filtered = filtered.filter(item => item.status === searchParams.status);
    }

    setFilteredData(filtered);
  };

  // 搜索筛选功能
  const handleSearch = () => {
    filterData();
  };

  // 重置搜索
  const handleReset = () => {
    const newSearchParams = {
      keyword: '',
      country: '',
      status: ''
    };
    setSearchParams(newSearchParams);
    
    // 重置后重新筛选数据
    setFilteredData(shipData);
  };

  // 处理编辑
  const handleEdit = (record: ShipData) => {
    setCurrentShip(record);
    setIsEditing(true);
    editForm.setFieldsValue({
      shipName: record.shipName,
      imoNumber: record.imoNumber,
      country: record.country,
      callSign: record.callSign
    });
    setEditModalVisible(true);
  };

  // 处理新增
  const handleAdd = () => {
    setCurrentShip(null);
    setIsEditing(false);
    editForm.resetFields();
    setEditModalVisible(true);
  };

  // 处理状态切换
  const handleToggleStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'enabled' ? 'disabled' : 'enabled';
    setShipData(prev => prev.map(item => 
      item.id === id ? { ...item, status: newStatus } : item
    ));
    filterData();
    Message.success(`船舶已${newStatus === 'enabled' ? '启用' : '禁用'}`);
  };

  // 批量启用
  const handleBatchEnable = () => {
    if (selectedRowKeys.length === 0) {
      Message.warning('请选择要启用的船舶');
      return;
    }
    
    setShipData(prev => prev.map(item => 
      selectedRowKeys.includes(item.id) ? { ...item, status: 'enabled' } : item
    ));
    
    setSelectedRowKeys([]);
    filterData();
    Message.success(`已启用 ${selectedRowKeys.length} 艘船舶`);
  };

  // 批量禁用
  const handleBatchDisable = () => {
    if (selectedRowKeys.length === 0) {
      Message.warning('请选择要禁用的船舶');
      return;
    }
    
    setShipData(prev => prev.map(item => 
      selectedRowKeys.includes(item.id) ? { ...item, status: 'disabled' } : item
    ));
    
    setSelectedRowKeys([]);
    filterData();
    Message.success(`已禁用 ${selectedRowKeys.length} 艘船舶`);
  };

  // 保存船舶编辑
  const handleSaveShip = async () => {
    try {
      const values = await editForm.validate();
      
      const shipItem = {
        ...values,
        id: isEditing ? currentShip?.id : Date.now().toString(),
        status: isEditing ? currentShip?.status : 'enabled' as const
      };

      if (isEditing) {
        // 更新现有船舶
        setShipData(prev => prev.map(item => 
          item.id === currentShip?.id ? { ...item, ...shipItem } : item
        ));
        Message.success('船舶信息已更新');
      } else {
        // 新增船舶
        const newShip = { ...shipItem, id: Date.now().toString() } as ShipData;
        setShipData(prev => [...prev, newShip]);
        Message.success('船舶已添加');
      }

      setEditModalVisible(false);
      editForm.resetFields();
      filterData();
    } catch (error) {
      console.error('保存失败:', error);
    }
  };

  // 表格列配置
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
      render: (_: unknown, record: ShipData) => (
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
      title: '船舶名称',
      dataIndex: 'shipName',
      width: 250
    },
    {
      title: 'IMO号',
      dataIndex: 'imoNumber',
      width: 150
    },
    {
      title: '国家',
      dataIndex: 'country',
      width: 200
    },
    {
      title: '呼号',
      dataIndex: 'callSign',
      width: 150
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (_: unknown, record: ShipData) => (
        <Tag color={record.status === 'enabled' ? 'green' : 'red'}>
          {record.status === 'enabled' ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: 180,
      fixed: 'right' as const,
      render: (_: unknown, record: ShipData) => (
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
            title={`确定要${record.status === 'enabled' ? '禁用' : '启用'}此船舶吗？`}
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
    }
  ];

  return (
    <Card>
      <div style={{ marginBottom: '20px' }}>
        <Title heading={4} style={{ margin: 0 }}>船舶资料</Title>
      </div>

      {/* 搜索筛选区域 */}
      <Card style={{ marginBottom: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '16px', alignItems: 'flex-end' }}>
          <div>
            <div style={{ marginBottom: '4px', fontSize: '14px', color: '#666' }}>关键词搜索</div>
            <Input
              placeholder="船舶名称、IMO号、呼号、国家"
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
              新增船舶
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
      />

      {/* 新增/编辑船舶弹窗 */}
      <Modal
        title={isEditing ? '编辑船舶' : '新增船舶'}
        visible={editModalVisible}
        onOk={handleSaveShip}
        onCancel={() => setEditModalVisible(false)}
        style={{ width: 600 }}
      >
        <Form form={editForm} layout="vertical">
          <Form.Item
            field="shipName"
            label="船舶名称"
            rules={[{ required: true, message: '请输入船舶名称' }]}
          >
            <Input placeholder="例如：JI YUN 16" />
          </Form.Item>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Form.Item
              field="imoNumber"
              label="IMO号"
              rules={[
                { required: true, message: '请输入IMO号' },
                { 
                  validator: (value) => {
                    if (!value) return Promise.resolve();
                    if (!/^\d{7}$/.test(value)) {
                      return Promise.reject('IMO号必须为7位数字');
                    }
                    return Promise.resolve();
                  }
                }
              ]}
            >
              <Input placeholder="例如：8357332" maxLength={7} />
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
          </div>
          
          <Form.Item
            field="callSign"
            label="呼号"
            rules={[{ required: true, message: '请输入呼号' }]}
          >
            <Input placeholder="例如：HP2845" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default ShipDataManagement; 