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

const { Title } = Typography;

// 运输条款数据接口
interface TransportTerm {
  id: string;
  code: string;
  name: string;
  status: 'enabled' | 'disabled';
}

// 搜索筛选参数
interface SearchParams {
  keyword: string;
  status: string;
}

const TransportTermsManagement: React.FC = () => {
  const [transportTerms, setTransportTerms] = useState<TransportTerm[]>([]);
  const [filteredData, setFilteredData] = useState<TransportTerm[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentTerm, setCurrentTerm] = useState<TransportTerm | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    keyword: '',
    status: ''
  });
  const [editForm] = Form.useForm();

  // 初始化示例数据
  useEffect(() => {
        const mockData: TransportTerm[] = [
      {
        id: '1',
        code: 'CY-CY',
        name: '场到场',
        status: 'enabled'
      },
      {
        id: '2',
        code: 'CY-DOOR',
        name: '场到门',
        status: 'enabled'
      },
      {
        id: '3',
        code: 'DOOR-CY',
        name: '门到场',
        status: 'enabled'
      },
      {
        id: '4',
        code: 'DOOR-DOOR',
        name: '门到门',
        status: 'enabled'
      },
      {
        id: '5',
        code: 'CFS-CFS',
        name: '拼箱站到拼箱站',
        status: 'enabled'
      },
      {
        id: '6',
        code: 'CFS-CY',
        name: '拼箱站到场',
        status: 'enabled'
      },
      {
        id: '7',
        code: 'CY-CFS',
        name: '场到拼箱站',
        status: 'enabled'
      },
      {
        id: '8',
        code: 'PIER-PIER',
        name: '码头到码头',
        status: 'enabled'
      },
      {
        id: '9',
        code: 'RAMP-RAMP',
        name: '坡道到坡道',
        status: 'enabled'
      },
      {
        id: '10',
        code: 'TACKLE-TACKLE',
        name: '吊钩到吊钩',
        status: 'enabled'
      },
      {
        id: '11',
        code: 'WAREHOUSE-WAREHOUSE',
        name: '仓库到仓库',
        status: 'enabled'
      }
    ];

    setTransportTerms(mockData);
    filterData(mockData);
  }, []);

  // 筛选数据
  const filterData = (data = transportTerms) => {
    let filtered = [...data];
    
    // 应用搜索条件
    if (searchParams.keyword) {
      filtered = filtered.filter(item => 
        item.code.toLowerCase().includes(searchParams.keyword.toLowerCase()) ||
        item.name.toLowerCase().includes(searchParams.keyword.toLowerCase())
      );
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
      status: ''
    };
    setSearchParams(newSearchParams);
    
    // 重置后重新筛选数据
    setFilteredData(transportTerms);
  };

  // 处理编辑
  const handleEdit = (record: TransportTerm) => {
    setCurrentTerm(record);
    setIsEditing(true);
    editForm.setFieldsValue({
      code: record.code,
      name: record.name
    });
    setEditModalVisible(true);
  };

  // 处理新增
  const handleAdd = () => {
    setCurrentTerm(null);
    setIsEditing(false);
    editForm.resetFields();
    setEditModalVisible(true);
  };

  // 处理状态切换
  const handleToggleStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'enabled' ? 'disabled' : 'enabled';
    setTransportTerms(prev => prev.map(item => 
      item.id === id ? { ...item, status: newStatus } : item
    ));
    filterData();
    Message.success(`运输条款已${newStatus === 'enabled' ? '启用' : '禁用'}`);
  };

  // 批量启用
  const handleBatchEnable = () => {
    if (selectedRowKeys.length === 0) {
      Message.warning('请选择要启用的运输条款');
      return;
    }
    
    setTransportTerms(prev => prev.map(item => 
      selectedRowKeys.includes(item.id) ? { ...item, status: 'enabled' } : item
    ));
    
    setSelectedRowKeys([]);
    filterData();
    Message.success(`已启用 ${selectedRowKeys.length} 个运输条款`);
  };

  // 批量禁用
  const handleBatchDisable = () => {
    if (selectedRowKeys.length === 0) {
      Message.warning('请选择要禁用的运输条款');
      return;
    }
    
    setTransportTerms(prev => prev.map(item => 
      selectedRowKeys.includes(item.id) ? { ...item, status: 'disabled' } : item
    ));
    
    setSelectedRowKeys([]);
    filterData();
    Message.success(`已禁用 ${selectedRowKeys.length} 个运输条款`);
  };

  // 保存运输条款编辑
  const handleSaveTerm = async () => {
    try {
      const values = await editForm.validate();
      
      const termItem = {
        ...values,
        id: isEditing ? currentTerm?.id : Date.now().toString(),
        status: isEditing ? currentTerm?.status : 'enabled' as const
      };

      if (isEditing) {
        // 更新现有运输条款
        setTransportTerms(prev => prev.map(item => 
          item.id === currentTerm?.id ? { ...item, ...termItem } : item
        ));
        Message.success('运输条款信息已更新');
      } else {
        // 新增运输条款
        const newTerm = { ...termItem, id: Date.now().toString() } as TransportTerm;
        setTransportTerms(prev => [...prev, newTerm]);
        Message.success('运输条款已添加');
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
      render: (_: unknown, record: TransportTerm) => (
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
      title: '代码',
      dataIndex: 'code',
      width: 150
    },
    {
      title: '名称',
      dataIndex: 'name',
      width: 200
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (_: unknown, record: TransportTerm) => (
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
      render: (_: unknown, record: TransportTerm) => (
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
            title={`确定要${record.status === 'enabled' ? '禁用' : '启用'}此运输条款吗？`}
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
        <Title heading={4} style={{ margin: 0 }}>运输条款</Title>
      </div>

      {/* 搜索筛选区域 */}
      <Card style={{ marginBottom: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '16px', alignItems: 'flex-end' }}>
          <div>
            <div style={{ marginBottom: '4px', fontSize: '14px', color: '#666' }}>关键词搜索</div>
            <Input
              placeholder="代码、名称"
              value={searchParams.keyword}
              onChange={(value) => setSearchParams(prev => ({ ...prev, keyword: value }))}
            />
          </div>
          <div>
            <div style={{ marginBottom: '4px', fontSize: '14px', color: '#666' }}>状态</div>
            <select
              value={searchParams.status}
              onChange={(e) => setSearchParams(prev => ({ ...prev, status: e.target.value }))}
              style={{
                width: '100%',
                height: '32px',
                border: '1px solid #d9d9d9',
                borderRadius: '4px',
                padding: '0 8px',
                fontSize: '14px'
              }}
            >
              <option value="">选择状态</option>
              <option value="enabled">启用</option>
              <option value="disabled">禁用</option>
            </select>
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
              新增运输条款
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
        scroll={{ x: 800 }}
        pagination={{
          pageSize: 10,
          showTotal: true,
          showJumper: true,
          sizeCanChange: true,
        }}
      />

      {/* 新增/编辑运输条款弹窗 */}
      <Modal
        title={isEditing ? '编辑运输条款' : '新增运输条款'}
        visible={editModalVisible}
        onOk={handleSaveTerm}
        onCancel={() => setEditModalVisible(false)}
        style={{ width: 500 }}
      >
        <Form form={editForm} layout="vertical">
          <Form.Item
            field="code"
            label="代码"
            rules={[{ required: true, message: '请输入代码' }]}
          >
            <Input placeholder="例如：CY-CY" />
          </Form.Item>
          
          <Form.Item
            field="name"
            label="名称"
            rules={[{ required: true, message: '请输入名称' }]}
          >
            <Input placeholder="例如：场到场" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default TransportTermsManagement; 