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

// 船舶代理数据接口
interface ShipAgent {
  id: string;
  agentName: string;
  ediCode: string;
  agentPort: string;
  shortNameEn: string;
  status: 'enabled' | 'disabled';
}

// 港口选项
const portOptions = [
  { value: '青岛', label: '青岛' },
  { value: '上海', label: '上海' },
  { value: '宁波', label: '宁波' },
  { value: '深圳', label: '深圳' },
  { value: '广州', label: '广州' },
  { value: '天津', label: '天津' },
  { value: '大连', label: '大连' },
  { value: '厦门', label: '厦门' },
  { value: '连云港', label: '连云港' },
  { value: '烟台', label: '烟台' }
];

// 搜索筛选参数
interface SearchParams {
  keyword: string;
  agentPort: string;
  status: string;
}

const ShipAgentManagement: React.FC = () => {
  const [shipAgents, setShipAgents] = useState<ShipAgent[]>([]);
  const [filteredData, setFilteredData] = useState<ShipAgent[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentAgent, setCurrentAgent] = useState<ShipAgent | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    keyword: '',
    agentPort: '',
    status: ''
  });
  const [editForm] = Form.useForm();

  // 初始化示例数据
  useEffect(() => {
    const mockData: ShipAgent[] = [
      {
        id: '1',
        agentName: '青岛中远海代',
        ediCode: '',
        agentPort: '青岛',
        shortNameEn: 'QDCOSCON',
        status: 'enabled'
      },
      {
        id: '2',
        agentName: '青岛中联运通',
        ediCode: '',
        agentPort: '青岛',
        shortNameEn: 'QDUNITRANS',
        status: 'enabled'
      },
      {
        id: '3',
        agentName: '青岛中和海德',
        ediCode: '',
        agentPort: '青岛',
        shortNameEn: 'QDZHSD',
        status: 'enabled'
      },
      {
        id: '4',
        agentName: '青岛振华货代',
        ediCode: '',
        agentPort: '青岛',
        shortNameEn: 'QDCIMC',
        status: 'enabled'
      },
      {
        id: '5',
        agentName: '中创物流',
        ediCode: '',
        agentPort: '青岛',
        shortNameEn: 'QDCML',
        status: 'enabled'
      },
      {
        id: '6',
        agentName: '中外运敦代',
        ediCode: '',
        agentPort: '青岛',
        shortNameEn: 'QDSINOAGENT',
        status: 'enabled'
      },
      {
        id: '7',
        agentName: '青港货运',
        ediCode: '',
        agentPort: '青岛',
        shortNameEn: 'QDPORT',
        status: 'enabled'
      },
      {
        id: '8',
        agentName: '青岛东方海外',
        ediCode: '',
        agentPort: '青岛',
        shortNameEn: 'QDOOCL',
        status: 'enabled'
      },
      {
        id: '9',
        agentName: '青岛联合',
        ediCode: '',
        agentPort: '青岛',
        shortNameEn: 'QDUNISCO',
        status: 'enabled'
      },
      {
        id: '10',
        agentName: '青岛华港',
        ediCode: '',
        agentPort: '青岛',
        shortNameEn: 'QDCHINAPORT',
        status: 'enabled'
      },
      {
        id: '11',
        agentName: '青岛海丰',
        ediCode: '',
        agentPort: '青岛',
        shortNameEn: 'QDSITC',
        status: 'enabled'
      },
      {
        id: '12',
        agentName: '青岛外代',
        ediCode: '',
        agentPort: '青岛',
        shortNameEn: 'QDPENOVICO',
        status: 'enabled'
      },
      {
        id: '13',
        agentName: '上海中远海',
        ediCode: '',
        agentPort: '上海',
        shortNameEn: 'SHCOSCON',
        status: 'enabled'
      },
      {
        id: '14',
        agentName: '上海联东',
        ediCode: '717883154',
        agentPort: '上海',
        shortNameEn: 'SHLINDO',
        status: 'enabled'
      },
      {
        id: '15',
        agentName: '上海东方海外',
        ediCode: 'OOCL',
        agentPort: '上海',
        shortNameEn: 'SHOOCL',
        status: 'enabled'
      },
      {
        id: '16',
        agentName: '上海锦江',
        ediCode: '',
        agentPort: '上海',
        shortNameEn: 'SHJI',
        status: 'enabled'
      },
      {
        id: '17',
        agentName: '上海振华',
        ediCode: '',
        agentPort: '上海',
        shortNameEn: 'SHCIMC',
        status: 'enabled'
      },
      {
        id: '18',
        agentName: '上海中联',
        ediCode: 'MA1G5D/T4',
        agentPort: '上海',
        shortNameEn: 'SHUNITRANS',
        status: 'enabled'
      },
      {
        id: '19',
        agentName: '上海鹏海',
        ediCode: '717859429',
        agentPort: '上海',
        shortNameEn: 'SHPH',
        status: 'enabled'
      },
      {
        id: '20',
        agentName: '上海嘉华',
        ediCode: '71785140-0',
        agentPort: '上海',
        shortNameEn: 'SHWALLEM',
        status: 'enabled'
      },
      {
        id: '21',
        agentName: '上海民生',
        ediCode: '132230158',
        agentPort: '上海',
        shortNameEn: 'SHMS',
        status: 'enabled'
      }
    ];

    setShipAgents(mockData);
    filterData(mockData);
  }, []);

  // 筛选数据
  const filterData = (data = shipAgents) => {
    let filtered = [...data];
    
    // 应用搜索条件
    if (searchParams.keyword) {
      filtered = filtered.filter(item => 
        item.agentName.toLowerCase().includes(searchParams.keyword.toLowerCase()) ||
        item.ediCode.toLowerCase().includes(searchParams.keyword.toLowerCase()) ||
        item.shortNameEn.toLowerCase().includes(searchParams.keyword.toLowerCase()) ||
        item.agentPort.toLowerCase().includes(searchParams.keyword.toLowerCase())
      );
    }
    
    if (searchParams.agentPort) {
      filtered = filtered.filter(item => item.agentPort === searchParams.agentPort);
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
      agentPort: '',
      status: ''
    };
    setSearchParams(newSearchParams);
    
    // 重置后重新筛选数据
    setFilteredData(shipAgents);
  };

  // 处理编辑
  const handleEdit = (record: ShipAgent) => {
    setCurrentAgent(record);
    setIsEditing(true);
    editForm.setFieldsValue({
      agentName: record.agentName,
      ediCode: record.ediCode,
      agentPort: record.agentPort,
      shortNameEn: record.shortNameEn
    });
    setEditModalVisible(true);
  };

  // 处理新增
  const handleAdd = () => {
    setCurrentAgent(null);
    setIsEditing(false);
    editForm.resetFields();
    setEditModalVisible(true);
  };

  // 处理状态切换
  const handleToggleStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'enabled' ? 'disabled' : 'enabled';
    setShipAgents(prev => prev.map(item => 
      item.id === id ? { ...item, status: newStatus } : item
    ));
    filterData();
    Message.success(`船舶代理已${newStatus === 'enabled' ? '启用' : '禁用'}`);
  };

  // 批量启用
  const handleBatchEnable = () => {
    if (selectedRowKeys.length === 0) {
      Message.warning('请选择要启用的船舶代理');
      return;
    }
    
    setShipAgents(prev => prev.map(item => 
      selectedRowKeys.includes(item.id) ? { ...item, status: 'enabled' } : item
    ));
    
    setSelectedRowKeys([]);
    filterData();
    Message.success(`已启用 ${selectedRowKeys.length} 个船舶代理`);
  };

  // 批量禁用
  const handleBatchDisable = () => {
    if (selectedRowKeys.length === 0) {
      Message.warning('请选择要禁用的船舶代理');
      return;
    }
    
    setShipAgents(prev => prev.map(item => 
      selectedRowKeys.includes(item.id) ? { ...item, status: 'disabled' } : item
    ));
    
    setSelectedRowKeys([]);
    filterData();
    Message.success(`已禁用 ${selectedRowKeys.length} 个船舶代理`);
  };

  // 保存船舶代理编辑
  const handleSaveAgent = async () => {
    try {
      const values = await editForm.validate();
      
      const agentItem = {
        ...values,
        id: isEditing ? currentAgent?.id : Date.now().toString(),
        status: isEditing ? currentAgent?.status : 'enabled' as const
      };

      if (isEditing) {
        // 更新现有船舶代理
        setShipAgents(prev => prev.map(item => 
          item.id === currentAgent?.id ? { ...item, ...agentItem } : item
        ));
        Message.success('船舶代理信息已更新');
      } else {
        // 新增船舶代理
        const newAgent = { ...agentItem, id: Date.now().toString() } as ShipAgent;
        setShipAgents(prev => [...prev, newAgent]);
        Message.success('船舶代理已添加');
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
      render: (_: unknown, record: ShipAgent) => (
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
      title: '船舶代理名称',
      dataIndex: 'agentName',
      width: 200
    },
    {
      title: 'EDI代码',
      dataIndex: 'ediCode',
      width: 150
    },
    {
      title: '船舶代理港口',
      dataIndex: 'agentPort',
      width: 150
    },
    {
      title: '简称(英文)',
      dataIndex: 'shortNameEn',
      width: 200
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (_: unknown, record: ShipAgent) => (
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
      render: (_: unknown, record: ShipAgent) => (
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
            title={`确定要${record.status === 'enabled' ? '禁用' : '启用'}此船舶代理吗？`}
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
        <Title heading={4} style={{ margin: 0 }}>船舶代理</Title>
      </div>

      {/* 搜索筛选区域 */}
      <Card style={{ marginBottom: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '16px', alignItems: 'flex-end' }}>
          <div>
            <div style={{ marginBottom: '4px', fontSize: '14px', color: '#666' }}>关键词搜索</div>
            <Input
              placeholder="代理名称、EDI代码、港口、简称"
              value={searchParams.keyword}
              onChange={(value) => setSearchParams(prev => ({ ...prev, keyword: value }))}
            />
          </div>
          <div>
            <div style={{ marginBottom: '4px', fontSize: '14px', color: '#666' }}>港口</div>
            <Select
              placeholder="选择港口"
              value={searchParams.agentPort}
              onChange={(value) => setSearchParams(prev => ({ ...prev, agentPort: value }))}
              allowClear
            >
              {portOptions.map(option => (
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
              新增船舶代理
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
        scroll={{ x: 1000 }}
        pagination={{
          pageSize: 10,
          showTotal: true,
          showJumper: true,
          sizeCanChange: true,
        }}
      />

      {/* 新增/编辑船舶代理弹窗 */}
      <Modal
        title={isEditing ? '编辑船舶代理' : '新增船舶代理'}
        visible={editModalVisible}
        onOk={handleSaveAgent}
        onCancel={() => setEditModalVisible(false)}
        style={{ width: 600 }}
      >
        <Form form={editForm} layout="vertical">
          <Form.Item
            field="agentName"
            label="船舶代理名称"
            rules={[{ required: true, message: '请输入船舶代理名称' }]}
          >
            <Input placeholder="例如：青岛中远海代" />
          </Form.Item>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Form.Item
              field="ediCode"
              label="EDI代码"
            >
              <Input placeholder="例如：717883154" />
            </Form.Item>
            
            <Form.Item
              field="agentPort"
              label="船舶代理港口"
              rules={[{ required: true, message: '请选择港口' }]}
            >
              <Select placeholder="请选择港口">
                {portOptions.map(option => (
                  <Option key={option.value} value={option.value}>{option.label}</Option>
                ))}
              </Select>
            </Form.Item>
          </div>
          
          <Form.Item
            field="shortNameEn"
            label="简称(英文)"
            rules={[{ required: true, message: '请输入英文简称' }]}
          >
            <Input placeholder="例如：QDCOSCON" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default ShipAgentManagement; 