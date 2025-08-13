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

// 航线数据接口
interface Route {
  id: string;
  routeCode: string;
  routeNameCn: string;
  routeNameEn: string;
  routeType: 'sea' | 'air';
  status: 'enabled' | 'disabled';
}

// 航线类型选项
const routeTypeOptions = [
  { value: 'sea', label: '海运航线', color: 'blue' },
  { value: 'air', label: '空运航线', color: 'orange' }
];

// 搜索筛选参数
interface SearchParams {
  keyword: string;
  routeType: string;
  status: string;
}

const RouteManagement: React.FC = () => {
  const [routeData, setRouteData] = useState<Route[]>([]);
  const [filteredData, setFilteredData] = useState<Route[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentRoute, setCurrentRoute] = useState<Route | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    keyword: '',
    routeType: '',
    status: ''
  });
  const [editForm] = Form.useForm();

  // 新增选择模式相关状态
  const [addRouteModalVisible, setAddRouteModalVisible] = useState(false);
  const [selectedRouteIds, setSelectedRouteIds] = useState<string[]>([]);
  const [addSearchParams, setAddSearchParams] = useState<{ keyword: string; routeType: string }>({
    keyword: '',
    routeType: ''
  });
  const [filteredRouteLibrary, setFilteredRouteLibrary] = useState<Route[]>([]);

  // 航线库数据 - 可选择的航线
  const routeLibraryData: Route[] = [
    {
      id: 'lib-1',
      routeCode: 'SEA-001',
      routeNameCn: '东南亚航线',
      routeNameEn: 'Southeast Asia Route',
      routeType: 'sea',
      status: 'enabled'
    },
    {
      id: 'lib-2',
      routeCode: 'EUR-001',
      routeNameCn: '欧地线',
      routeNameEn: 'Europe Mediterranean Route',
      routeType: 'sea',
      status: 'enabled'
    },
    {
      id: 'lib-3',
      routeCode: 'NAM-001',
      routeNameCn: '北美航线',
      routeNameEn: 'North America Route',
      routeType: 'sea',
      status: 'enabled'
    },
    {
      id: 'lib-4',
      routeCode: 'MEA-001',
      routeNameCn: '中东航线',
      routeNameEn: 'Middle East Route',
      routeType: 'sea',
      status: 'enabled'
    },
    {
      id: 'lib-5',
      routeCode: 'AFR-001',
      routeNameCn: '非洲航线',
      routeNameEn: 'Africa Route',
      routeType: 'sea',
      status: 'enabled'
    },
    {
      id: 'lib-6',
      routeCode: 'SAM-001',
      routeNameCn: '南美航线',
      routeNameEn: 'South America Route',
      routeType: 'sea',
      status: 'enabled'
    },
    {
      id: 'lib-7',
      routeCode: 'AIR-001',
      routeNameCn: '亚洲空运航线',
      routeNameEn: 'Asia Air Route',
      routeType: 'air',
      status: 'enabled'
    },
    {
      id: 'lib-8',
      routeCode: 'AIR-002',
      routeNameCn: '欧洲空运航线',
      routeNameEn: 'Europe Air Route',
      routeType: 'air',
      status: 'enabled'
    },
    {
      id: 'lib-9',
      routeCode: 'AIR-003',
      routeNameCn: '北美空运航线',
      routeNameEn: 'North America Air Route',
      routeType: 'air',
      status: 'enabled'
    },
    {
      id: 'lib-10',
      routeCode: 'INTRA-001',
      routeNameCn: '亚洲内部航线',
      routeNameEn: 'Intra Asia Route',
      routeType: 'sea',
      status: 'enabled'
    }
  ];

  // 初始化示例数据
  useEffect(() => {
    const mockData: Route[] = [
      {
        id: '1',
        routeCode: 'SEA-001',
        routeNameCn: '东南亚航线',
        routeNameEn: 'Southeast Asia Route',
        routeType: 'sea',
        status: 'enabled'
      },
      {
        id: '2',
        routeCode: 'EUR-001',
        routeNameCn: '欧地线',
        routeNameEn: 'Europe Mediterranean Route',
        routeType: 'sea',
        status: 'enabled'
      },
      {
        id: '3',
        routeCode: 'NAM-001',
        routeNameCn: '北美航线',
        routeNameEn: 'North America Route',
        routeType: 'sea',
        status: 'enabled'
      },
      {
        id: '4',
        routeCode: 'MEA-001',
        routeNameCn: '中东航线',
        routeNameEn: 'Middle East Route',
        routeType: 'sea',
        status: 'enabled'
      },
      {
        id: '5',
        routeCode: 'AFR-001',
        routeNameCn: '非洲航线',
        routeNameEn: 'Africa Route',
        routeType: 'sea',
        status: 'disabled'
      },
      {
        id: '6',
        routeCode: 'SAM-001',
        routeNameCn: '南美航线',
        routeNameEn: 'South America Route',
        routeType: 'sea',
        status: 'enabled'
      },
      {
        id: '7',
        routeCode: 'ASI-001',
        routeNameCn: '亚洲航线',
        routeNameEn: 'Asia Route',
        routeType: 'air',
        status: 'enabled'
      },
      {
        id: '8',
        routeCode: 'EUR-002',
        routeNameCn: '欧洲航线',
        routeNameEn: 'Europe Route',
        routeType: 'air',
        status: 'enabled'
      },
      {
        id: '9',
        routeCode: 'NAM-002',
        routeNameCn: '北美空运航线',
        routeNameEn: 'North America Air Route',
        routeType: 'air',
        status: 'disabled'
      },
      {
        id: '10',
        routeCode: 'OCE-001',
        routeNameCn: '大洋洲航线',
        routeNameEn: 'Oceania Route',
        routeType: 'sea',
        status: 'enabled'
      }
    ];

    setRouteData(mockData);
    filterData(mockData);
  }, []);

  // 筛选数据
  const filterData = (data = routeData) => {
    let filtered = [...data];
    
    // 应用搜索条件
    if (searchParams.keyword) {
      filtered = filtered.filter(item => 
        item.routeCode.toLowerCase().includes(searchParams.keyword.toLowerCase()) ||
        item.routeNameCn.includes(searchParams.keyword) ||
        item.routeNameEn.toLowerCase().includes(searchParams.keyword.toLowerCase())
      );
    }
    
    if (searchParams.routeType) {
      filtered = filtered.filter(item => item.routeType === searchParams.routeType);
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
      routeType: '',
      status: ''
    };
    setSearchParams(newSearchParams);
    
    // 重置后重新筛选数据
    setFilteredData(routeData);
  };

  // 处理编辑
  const handleEdit = (record: Route) => {
    setCurrentRoute(record);
    setIsEditing(true);
    editForm.setFieldsValue({
      routeCode: record.routeCode,
      routeNameCn: record.routeNameCn,
      routeNameEn: record.routeNameEn,
      routeType: record.routeType
    });
    setEditModalVisible(true);
  };

  // 处理新增 - 改为选择模式
  const handleAdd = () => {
    setSelectedRouteIds([]);
    setAddSearchParams({ keyword: '', routeType: '' });
    // 过滤掉已经存在的航线
    const availableRoutes = routeLibraryData.filter(route =>
      !routeData.some(existingRoute => existingRoute.routeCode === route.routeCode)
    );
    setFilteredRouteLibrary(availableRoutes);
    setAddRouteModalVisible(true);
  };

  // 选择弹窗搜索功能
  const handleAddSearch = () => {
    let filtered = routeLibraryData.filter(route =>
      !routeData.some(existingRoute => existingRoute.routeCode === route.routeCode)
    );

    // 关键词搜索
    if (addSearchParams.keyword) {
      filtered = filtered.filter(route =>
        route.routeCode.toLowerCase().includes(addSearchParams.keyword.toLowerCase()) ||
        route.routeNameCn.includes(addSearchParams.keyword) ||
        route.routeNameEn.toLowerCase().includes(addSearchParams.keyword.toLowerCase())
      );
    }

    // 航线类型筛选
    if (addSearchParams.routeType) {
      filtered = filtered.filter(route => route.routeType === addSearchParams.routeType);
    }

    setFilteredRouteLibrary(filtered);
  };

  // 重置选择弹窗搜索
  const handleAddReset = () => {
    setAddSearchParams({ keyword: '', routeType: '' });
    const availableRoutes = routeLibraryData.filter(route =>
      !routeData.some(existingRoute => existingRoute.routeCode === route.routeCode)
    );
    setFilteredRouteLibrary(availableRoutes);
  };

  // 确认添加选中的航线
  const handleConfirmAddRoutes = () => {
    const selectedRoutes = filteredRouteLibrary.filter(route =>
      selectedRouteIds.includes(route.id)
    );

    if (selectedRoutes.length === 0) {
      Message.warning('请选择要添加的航线');
      return;
    }

    // 添加到航线数据中
    const newRoutes = selectedRoutes.map(route => ({
      ...route,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    }));

    setRouteData(prev => [...prev, ...newRoutes]);
    setAddRouteModalVisible(false);
    setSelectedRouteIds([]);
    filterData();
    Message.success(`已添加 ${selectedRoutes.length} 条航线`);
  };

  // 处理状态切换
  const handleToggleStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'enabled' ? 'disabled' : 'enabled';
    setRouteData(prev => prev.map(item => 
      item.id === id ? { ...item, status: newStatus } : item
    ));
    filterData();
    Message.success(`航线已${newStatus === 'enabled' ? '启用' : '禁用'}`);
  };

  // 批量启用
  const handleBatchEnable = () => {
    if (selectedRowKeys.length === 0) {
      Message.warning('请选择要启用的航线');
      return;
    }
    
    setRouteData(prev => prev.map(item => 
      selectedRowKeys.includes(item.id) ? { ...item, status: 'enabled' } : item
    ));
    
    setSelectedRowKeys([]);
    filterData();
    Message.success(`已启用 ${selectedRowKeys.length} 条航线`);
  };

  // 批量禁用
  const handleBatchDisable = () => {
    if (selectedRowKeys.length === 0) {
      Message.warning('请选择要禁用的航线');
      return;
    }
    
    setRouteData(prev => prev.map(item => 
      selectedRowKeys.includes(item.id) ? { ...item, status: 'disabled' } : item
    ));
    
    setSelectedRowKeys([]);
    filterData();
    Message.success(`已禁用 ${selectedRowKeys.length} 条航线`);
  };

  // 保存航线编辑
  const handleSaveRoute = async () => {
    try {
      const values = await editForm.validate();
      
      const routeItem = {
        ...values,
        id: isEditing ? currentRoute?.id : Date.now().toString(),
        status: isEditing ? currentRoute?.status : 'enabled' as const
      };

      if (isEditing) {
        // 更新现有航线
        setRouteData(prev => prev.map(item => 
          item.id === currentRoute?.id ? { ...item, ...routeItem } : item
        ));
        Message.success('航线信息已更新');
      } else {
        // 新增航线
        const newRoute = { ...routeItem, id: Date.now().toString() } as Route;
        setRouteData(prev => [...prev, newRoute]);
        Message.success('航线已添加');
      }

      setEditModalVisible(false);
      editForm.resetFields();
      filterData();
    } catch (error) {
      console.error('保存失败:', error);
    }
  };

  // 获取航线类型配置
  const getRouteTypeConfig = (type: string) => {
    return routeTypeOptions.find(option => option.value === type);
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
      render: (_: unknown, record: Route) => (
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
      title: '航线代码',
      dataIndex: 'routeCode',
      width: 150,
      render: (text: string) => (
        <span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{text}</span>
      )
    },
    {
      title: '航线名称（中文）',
      dataIndex: 'routeNameCn',
      width: 200,
    },
    {
      title: '航线名称（英文）',
      dataIndex: 'routeNameEn',
      width: 250,
      render: (text: string) => (
        <span style={{ fontStyle: 'italic' }}>{text}</span>
      )
    },
    {
      title: '航线类型',
      dataIndex: 'routeType',
      width: 120,
      render: (_: unknown, record: Route) => {
        const config = getRouteTypeConfig(record.routeType);
        return (
          <Tag color={config?.color}>
            {config?.label}
          </Tag>
        );
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (_: unknown, record: Route) => (
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
      render: (_: unknown, record: Route) => (
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
            title={`确定要${record.status === 'enabled' ? '禁用' : '启用'}此航线吗？`}
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
        <Title heading={4} style={{ margin: 0 }}>航线管理</Title>
      </div>

      {/* 搜索筛选区域 */}
      <Card style={{ marginBottom: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '16px', alignItems: 'flex-end' }}>
          <div>
            <div style={{ marginBottom: '4px', fontSize: '14px', color: '#666' }}>关键词搜索</div>
            <Input
              placeholder="航线代码、中文名、英文名"
              value={searchParams.keyword}
              onChange={(value) => setSearchParams(prev => ({ ...prev, keyword: value }))}
            />
          </div>
          <div>
            <div style={{ marginBottom: '4px', fontSize: '14px', color: '#666' }}>航线类型</div>
            <Select
              placeholder="选择航线类型"
              value={searchParams.routeType}
              onChange={(value) => setSearchParams(prev => ({ ...prev, routeType: value }))}
              allowClear
            >
              {routeTypeOptions.map(option => (
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
              新增航线
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
        scroll={{ x: 1100 }}
        pagination={{
          pageSize: 10,
          showTotal: true,
          showJumper: true,
          sizeCanChange: true,
        }}
      />

      {/* 新增/编辑航线弹窗 */}
      <Modal
        title={isEditing ? '编辑航线' : '新增航线'}
        visible={editModalVisible}
        onOk={handleSaveRoute}
        onCancel={() => setEditModalVisible(false)}
        style={{ width: 600 }}
      >
        <Form form={editForm} layout="vertical">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Form.Item
              field="routeCode"
              label="航线代码"
              rules={[{ required: true, message: '请输入航线代码' }]}
            >
              <Input placeholder="例如：SEA-001" />
            </Form.Item>
            
            <Form.Item
              field="routeType"
              label="航线类型"
              rules={[{ required: true, message: '请选择航线类型' }]}
            >
              <Select placeholder="请选择航线类型">
                {routeTypeOptions.map(option => (
                  <Option key={option.value} value={option.value}>{option.label}</Option>
                ))}
              </Select>
            </Form.Item>
          </div>
          
          <Form.Item
            field="routeNameCn"
            label="航线名称（中文）"
            rules={[{ required: true, message: '请输入中文航线名称' }]}
          >
            <Input placeholder="例如：东南亚航线" />
          </Form.Item>
          
          <Form.Item
            field="routeNameEn"
            label="航线名称（英文）"
            rules={[{ required: true, message: '请输入英文航线名称' }]}
          >
            <Input placeholder="例如：Southeast Asia Route" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 选择航线弹窗 */}
      <Modal
        title="选择航线"
        visible={addRouteModalVisible}
        onOk={handleConfirmAddRoutes}
        onCancel={() => setAddRouteModalVisible(false)}
        style={{ width: 1000 }}
        okText={`确认添加 (${selectedRouteIds.length})`}
        cancelText="取消"
      >
        {/* 搜索筛选区域 */}
        <Card style={{ marginBottom: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '16px', alignItems: 'flex-end' }}>
            <div>
              <div style={{ marginBottom: '4px', fontSize: '14px', color: '#666' }}>关键词搜索</div>
              <Input
                placeholder="航线代码、中文名、英文名"
                value={addSearchParams.keyword}
                onChange={(value) => setAddSearchParams(prev => ({ ...prev, keyword: value }))}
              />
            </div>
            <div>
              <div style={{ marginBottom: '4px', fontSize: '14px', color: '#666' }}>航线类型</div>
              <Select
                placeholder="请选择航线类型"
                value={addSearchParams.routeType}
                onChange={(value) => setAddSearchParams(prev => ({ ...prev, routeType: value }))}
                allowClear
              >
                {routeTypeOptions.map(option => (
                  <Option key={option.value} value={option.value}>{option.label}</Option>
                ))}
              </Select>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button type="primary" icon={<IconSearch />} onClick={handleAddSearch}>
                搜索
              </Button>
              <Button icon={<IconRefresh />} onClick={handleAddReset}>
                重置
              </Button>
            </div>
          </div>
        </Card>

        {/* 航线选择表格 */}
        <Table
          columns={[
            {
              title: '航线代码',
              dataIndex: 'routeCode',
              width: 120,
              render: (text: string) => (
                <span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{text}</span>
              )
            },
            {
              title: '中文名称',
              dataIndex: 'routeNameCn',
              width: 200
            },
            {
              title: '英文名称',
              dataIndex: 'routeNameEn',
              width: 250,
              render: (text: string) => (
                <span style={{ fontStyle: 'italic' }}>{text}</span>
              )
            },
            {
              title: '航线类型',
              dataIndex: 'routeType',
              width: 100,
              render: (type: string) => {
                const option = routeTypeOptions.find(opt => opt.value === type);
                return option ? <Tag color={option.color}>{option.label}</Tag> : type;
              }
            }
          ]}
          data={filteredRouteLibrary}
          rowKey="id"
          scroll={{ x: 800, y: 400 }}
          pagination={{
            pageSize: 10,
            showTotal: true,
            showJumper: true,
          }}
          rowSelection={{
            type: 'checkbox',
            selectedRowKeys: selectedRouteIds,
            onChange: (selectedRowKeys) => {
              setSelectedRouteIds(selectedRowKeys as string[]);
            },
            checkAll: true,
          }}
        />
      </Modal>
    </Card>
  );
};

export default RouteManagement;