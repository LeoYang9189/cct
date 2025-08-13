import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Tooltip,
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
  IconSettings,
  IconMinus,
  IconSearch,
  IconRefresh,
  IconUpload,
  IconDownload
} from '@arco-design/web-react/icon';

const { Option } = Select;
const { Title } = Typography;
const { TextArea } = Input;

// 集装箱数据接口
interface Container {
  id: string;
  containerType: string;
  isoCode: string;
  description: string;
  ediCodes: EDICode[];
  status: 'enabled' | 'disabled';
}

// 搜索筛选参数
interface SearchParams {
  keyword: string;
  status: string;
}

// EDI代码接口
interface EDICode {
  id: string;
  platform: string;
  ediCode: string;
}

// 平台选项
const platformOptions = [
  { value: '亿通', label: '亿通' },
  { value: 'INTTRA', label: 'INTTRA' },
  { value: '乐域', label: '乐域' },
  { value: 'CargoSmart', label: 'CargoSmart' }
];

const ContainerManagement: React.FC = () => {
  const [data, setData] = useState<Container[]>([]);
  const [filteredData, setFilteredData] = useState<Container[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [currentContainer, setCurrentContainer] = useState<Container | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [ediModalVisible, setEdiModalVisible] = useState(false);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    keyword: '',
    status: ''
  });

  const [editForm] = Form.useForm();
  const [form] = Form.useForm();

  // 初始化示例数据
  useEffect(() => {
    const mockData: Container[] = [
      {
        id: '1',
        containerType: '20GP',
        isoCode: '22G1',
        description: '20英尺标准集装箱',
        ediCodes: [
          { id: '1', platform: '亿通', ediCode: '20GP01' },
          { id: '2', platform: 'INTTRA', ediCode: '22G1' }
        ],
        status: 'enabled' as const
      },
      {
        id: '2',
        containerType: '40GP',
        isoCode: '42G1',
        description: '40英尺标准集装箱',
        ediCodes: [
          { id: '3', platform: 'CargoSmart', ediCode: '40GP01' }
        ],
        status: 'enabled' as const
      },
      {
        id: '3',
        containerType: '40HC',
        isoCode: '45G1',
        description: '40英尺高箱',
        ediCodes: [
          { id: '4', platform: '乐域', ediCode: '40HC01' },
          { id: '5', platform: '亿通', ediCode: '45G1' }
        ],
        status: 'disabled' as const
      },
      {
        id: '4',
        containerType: '20RF',
        isoCode: '22R1',
        description: '20英尺冷藏集装箱',
        ediCodes: [
          { id: '6', platform: 'INTTRA', ediCode: '20RF01' }
        ],
        status: 'enabled' as const
      },
      {
        id: '5',
        containerType: '40RF',
        isoCode: '42R1',
        description: '40英尺冷藏集装箱',
        ediCodes: [
          { id: '7', platform: '亿通', ediCode: '40RF01' },
          { id: '8', platform: 'CargoSmart', ediCode: '42R1' }
        ],
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
      filtered = filtered.filter(container =>
        container.containerType.toLowerCase().includes(searchParams.keyword.toLowerCase()) ||
        container.isoCode.toLowerCase().includes(searchParams.keyword.toLowerCase()) ||
        container.description.toLowerCase().includes(searchParams.keyword.toLowerCase())
      );
    }

    if (searchParams.status) {
      filtered = filtered.filter(container => container.status === searchParams.status);
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
      status: ''
    };
    setSearchParams(newSearchParams);
  };

  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      width: 80,
      render: (_: unknown, __: unknown, index: number) => index + 1,
    },
    {
      title: '箱型',
      dataIndex: 'containerType',
      width: 120,
      sorter: (a: Container, b: Container) => a.containerType.localeCompare(b.containerType),
    },
    {
      title: 'ISO代码',
      dataIndex: 'isoCode',
      width: 120,
    },
    {
      title: '描述',
      dataIndex: 'description',
      width: 200,
    },
    {
      title: 'EDI代码',
      dataIndex: 'ediCodes',
      width: 150,
      render: (ediCodes: EDICode[]) => (
        <Tooltip
          content={
            <div>
              {ediCodes.map(code => (
                <div key={code.id} style={{ marginBottom: '4px' }}>
                  <strong>{code.platform}:</strong> {code.ediCode}
                </div>
              ))}
            </div>
          }
        >
          <Tag color="orange" style={{ cursor: 'pointer' }}>
            {ediCodes.length} 个代码
          </Tag>
        </Tooltip>
      ),
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
      width: 220,
      fixed: 'right' as const,
      render: (_: unknown, record: Container) => (
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
            title={`确定要${record.status === 'enabled' ? '禁用' : '启用'}此集装箱类型吗？`}
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
          <Button
            type="text"
            size="small"
            icon={<IconSettings />}
            onClick={() => handleEdiCodeSetting(record)}
          >
            EDI代码设置
          </Button>
        </Space>
      ),
    },
  ];

  // 处理编辑
  const handleEdit = (record: Container) => {
    setCurrentContainer(record);
    setIsEditing(true);
    editForm.setFieldsValue({
      containerType: record.containerType,
      isoCode: record.isoCode,
      description: record.description
    });
    setEditModalVisible(true);
  };

  // 处理新增
  const handleAdd = () => {
    setCurrentContainer(null);
    setIsEditing(false);
    editForm.resetFields();
    setEditModalVisible(true);
  };

  // 处理状态切换
  const handleToggleStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'enabled' ? 'disabled' : 'enabled';
    setData(prev => prev.map(container => 
      container.id === id ? { ...container, status: newStatus } : container
    ));
    setFilteredData(prev => prev.map(container => 
      container.id === id ? { ...container, status: newStatus } : container
    ));
    Message.success(`集装箱类型已${newStatus === 'enabled' ? '启用' : '禁用'}`);
  };

  // 批量启用
  const handleBatchEnable = () => {
    if (selectedRowKeys.length === 0) {
      Message.warning('请选择要启用的集装箱类型');
      return;
    }
    
    setData(prev => prev.map(container => 
      selectedRowKeys.includes(container.id) ? { ...container, status: 'enabled' } : container
    ));
    setFilteredData(prev => prev.map(container => 
      selectedRowKeys.includes(container.id) ? { ...container, status: 'enabled' } : container
    ));
    
    setSelectedRowKeys([]);
    Message.success(`已启用 ${selectedRowKeys.length} 个集装箱类型`);
  };

  // 批量禁用
  const handleBatchDisable = () => {
    if (selectedRowKeys.length === 0) {
      Message.warning('请选择要禁用的集装箱类型');
      return;
    }
    
    setData(prev => prev.map(container => 
      selectedRowKeys.includes(container.id) ? { ...container, status: 'disabled' } : container
    ));
    setFilteredData(prev => prev.map(container => 
      selectedRowKeys.includes(container.id) ? { ...container, status: 'disabled' } : container
    ));
    
    setSelectedRowKeys([]);
    Message.success(`已禁用 ${selectedRowKeys.length} 个集装箱类型`);
  };

  // 处理EDI代码设置
  const handleEdiCodeSetting = (record: Container) => {
    setCurrentContainer(record);
    form.setFieldsValue({
      ediCodes: record.ediCodes
    });
    setEdiModalVisible(true);
  };

  // 保存集装箱编辑
  const handleSaveContainer = async () => {
    try {
      const values = await editForm.validate();
      
      const containerData = {
        ...values,
        id: isEditing ? currentContainer?.id : Date.now().toString(),
        ediCodes: isEditing ? currentContainer?.ediCodes || [] : [],
        status: isEditing ? currentContainer?.status : 'enabled' as const
      };

      if (isEditing) {
        // 更新现有集装箱
        setData(prev => prev.map(container => 
          container.id === currentContainer?.id ? { ...container, ...containerData } : container
        ));
        setFilteredData(prev => prev.map(container => 
          container.id === currentContainer?.id ? { ...container, ...containerData } : container
        ));
        Message.success('集装箱类型信息已更新');
      } else {
        // 新增集装箱
        const newContainer = { ...containerData, id: Date.now().toString(), ediCodes: [] };
        setData(prev => [...prev, newContainer]);
        setFilteredData(prev => [...prev, newContainer]);
        Message.success('集装箱类型已添加');
      }

      setEditModalVisible(false);
      editForm.resetFields();
    } catch (error) {
      console.error('保存失败:', error);
    }
  };

  // 保存EDI代码
  const handleSaveEdiCodes = async () => {
    try {
      const values = await form.validate();
      const ediCodes = values.ediCodes || [];

      setData(prev => prev.map(container => 
        container.id === currentContainer?.id ? { ...container, ediCodes } : container
      ));
      setFilteredData(prev => prev.map(container => 
        container.id === currentContainer?.id ? { ...container, ediCodes } : container
      ));

      setEdiModalVisible(false);
      form.resetFields();
      Message.success('EDI代码已保存');
    } catch (error) {
      console.error('保存EDI代码失败:', error);
    }
  };

  return (
    <Card>
      <div style={{ marginBottom: '20px' }}>
        <Title heading={4} style={{ margin: 0 }}>集装箱管理</Title>
      </div>

      {/* 搜索筛选区域 */}
      <Card style={{ marginBottom: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '16px', alignItems: 'flex-end' }}>
          <div>
            <div style={{ marginBottom: '4px', fontSize: '14px', color: '#666' }}>关键词搜索</div>
            <Input
              placeholder="箱型、ISO代码、描述"
              value={searchParams.keyword}
              onChange={(value) => setSearchParams(prev => ({ ...prev, keyword: value }))}
            />
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

      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button type="primary" icon={<IconPlus />} onClick={handleAdd}>
              新增集装箱类型
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

      {/* 新增/编辑集装箱弹窗 */}
      <Modal
        title={isEditing ? '编辑集装箱类型' : '新增集装箱类型'}
        visible={editModalVisible}
        onOk={handleSaveContainer}
        onCancel={() => setEditModalVisible(false)}
        style={{ width: 600 }}
      >
        <Form form={editForm} layout="vertical">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Form.Item
              field="containerType"
              label="箱型"
              rules={[{ required: true, message: '请输入箱型' }]}
            >
              <Input placeholder="请输入箱型，如：20GP" />
            </Form.Item>
            
            <Form.Item
              field="isoCode"
              label="ISO代码"
              rules={[{ required: true, message: '请输入ISO代码' }]}
            >
              <Input placeholder="请输入ISO代码，如：22G1" />
            </Form.Item>
          </div>
          
          <Form.Item
            field="description"
            label="描述"
            rules={[{ required: true, message: '请输入描述' }]}
          >
            <TextArea 
              placeholder="请输入集装箱类型描述" 
              autoSize={{ minRows: 3, maxRows: 5 }} 
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* EDI代码设置弹窗 */}
      <Modal
        title="EDI代码设置"
        visible={ediModalVisible}
        onOk={handleSaveEdiCodes}
        onCancel={() => setEdiModalVisible(false)}
        style={{ width: 600 }}
      >
        <Form form={form} layout="vertical">
          <Form.Item field="ediCodes" label="EDI代码列表">
            <Form.List field="ediCodes">
              {(fields, { add, remove }) => (
                <div>
                  {fields.map((item, index) => (
                    <div key={item.key} style={{ display: 'flex', gap: '12px', marginBottom: '12px', alignItems: 'flex-start' }}>
                      <Form.Item
                        field={`${item.field}.platform`}
                        rules={[{ required: true, message: '请选择平台' }]}
                        style={{ flex: 1, marginBottom: 0 }}
                      >
                        <Select placeholder="选择平台">
                          {platformOptions.map(option => (
                            <Option key={option.value} value={option.value}>{option.label}</Option>
                          ))}
                        </Select>
                      </Form.Item>
                      <Form.Item
                        field={`${item.field}.ediCode`}
                        rules={[{ required: true, message: '请输入EDI代码' }]}
                        style={{ flex: 1, marginBottom: 0 }}
                      >
                        <Input placeholder="请输入EDI代码" />
                      </Form.Item>
                      <Button
                        type="text"
                        icon={<IconMinus />}
                        status="danger"
                        onClick={() => remove(index)}
                        style={{ marginTop: '4px' }}
                      />
                    </div>
                  ))}
                  <Button
                    type="dashed"
                    icon={<IconPlus />}
                    onClick={() => add({ id: Date.now().toString(), platform: '', ediCode: '' })}
                    style={{ width: '100%' }}
                  >
                    添加EDI代码
                  </Button>
                </div>
              )}
            </Form.List>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default ContainerManagement; 