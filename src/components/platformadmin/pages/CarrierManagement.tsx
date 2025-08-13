import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Tabs,
  Space,
  Tag,
  Checkbox,
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

const { TabPane } = Tabs;
const { Option } = Select;
const { Title } = Typography;

// 船公司数据接口
interface ShippingCompany {
  id: string;
  companyNameCn: string;
  companyNameEn: string;
  companyCode: string;
  scacCode: string;
  eoriNumber: string;
  nineKCode: string;
  naccsCode: string;
  ediCodes: EDICode[];
  status: 'enabled' | 'disabled';
}

// 航空公司数据接口
interface AirlineCompany {
  id: string;
  companyNameCn: string;
  companyNameEn: string;
  iataCode: string;
  hawbPrefix: string;
  ediCodes: EDICode[];
  status: 'enabled' | 'disabled';
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

// 搜索筛选参数
interface SearchParams {
  keyword: string;
  status: string;
}

const CarrierManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('shipping');
  const [shippingData, setShippingData] = useState<ShippingCompany[]>([]);
  const [airlineData, setAirlineData] = useState<AirlineCompany[]>([]);
  const [filteredShippingData, setFilteredShippingData] = useState<ShippingCompany[]>([]);
  const [filteredAirlineData, setFilteredAirlineData] = useState<AirlineCompany[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [ediModalVisible, setEdiModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentCarrier, setCurrentCarrier] = useState<ShippingCompany | AirlineCompany | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    keyword: '',
    status: ''
  });
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  // 初始化示例数据
  useEffect(() => {
    const mockShippingData: ShippingCompany[] = [
      {
        id: '1',
        companyNameCn: '中远海运',
        companyNameEn: 'COSCO SHIPPING',
        companyCode: 'COSCO',
        scacCode: 'COSU',
        eoriNumber: 'GB123456789000',
        nineKCode: '9000001',
        naccsCode: 'COSCO',
        ediCodes: [
          { id: '1', platform: '亿通', ediCode: 'COSCO001' },
          { id: '2', platform: 'INTTRA', ediCode: 'COSU' }
        ],
        status: 'enabled' as const
      },
      {
        id: '2',
        companyNameCn: '马士基',
        companyNameEn: 'MAERSK',
        companyCode: 'MAERSK',
        scacCode: 'MAEU',
        eoriNumber: 'GB987654321000',
        nineKCode: '9000002',
        naccsCode: 'MAERSK',
        ediCodes: [
          { id: '3', platform: 'CargoSmart', ediCode: 'MAEU001' }
        ],
        status: 'enabled' as const
      },
      {
        id: '3',
        companyNameCn: '地中海航运',
        companyNameEn: 'MSC',
        companyCode: 'MSC',
        scacCode: 'MSCU',
        eoriNumber: 'GB456789123000',
        nineKCode: '9000003',
        naccsCode: 'MSC',
        ediCodes: [
          { id: '4', platform: '乐域', ediCode: 'MSC001' },
          { id: '5', platform: '亿通', ediCode: 'MSCU' }
        ],
        status: 'disabled' as const
      }
    ];

    const mockAirlineData: AirlineCompany[] = [
      {
        id: '1',
        companyNameCn: '中国国际航空',
        companyNameEn: 'Air China',
        iataCode: 'CA',
        hawbPrefix: '999',
        ediCodes: [
          { id: '1', platform: '亿通', ediCode: 'CA001' }
        ],
        status: 'enabled' as const
      },
      {
        id: '2',
        companyNameCn: '中国东方航空',
        companyNameEn: 'China Eastern Airlines',
        iataCode: 'MU',
        hawbPrefix: '781',
        ediCodes: [
          { id: '2', platform: 'INTTRA', ediCode: 'MU001' }
        ],
        status: 'enabled' as const
      }
    ];

    setShippingData(mockShippingData);
    setFilteredShippingData(mockShippingData);
    setAirlineData(mockAirlineData);
    setFilteredAirlineData(mockAirlineData);
  }, []);

  // 搜索筛选功能
  const handleSearch = () => {
    if (activeTab === 'shipping') {
      let filtered = shippingData;

      // 关键词搜索
      if (searchParams.keyword) {
        filtered = filtered.filter(company => 
          company.companyNameCn.includes(searchParams.keyword) ||
          company.companyNameEn.toLowerCase().includes(searchParams.keyword.toLowerCase()) ||
          company.companyCode.toLowerCase().includes(searchParams.keyword.toLowerCase()) ||
          company.scacCode.toLowerCase().includes(searchParams.keyword.toLowerCase())
        );
      }

      // 状态筛选
      if (searchParams.status) {
        filtered = filtered.filter(company => company.status === searchParams.status);
      }

      setFilteredShippingData(filtered);
    } else if (activeTab === 'airline') {
      let filtered = airlineData;

      // 关键词搜索
      if (searchParams.keyword) {
        filtered = filtered.filter(company => 
          company.companyNameCn.includes(searchParams.keyword) ||
          company.companyNameEn.toLowerCase().includes(searchParams.keyword.toLowerCase()) ||
          company.iataCode.toLowerCase().includes(searchParams.keyword.toLowerCase())
        );
      }

      // 状态筛选
      if (searchParams.status) {
        filtered = filtered.filter(company => company.status === searchParams.status);
      }

      setFilteredAirlineData(filtered);
    }
  };

  // 重置搜索
  const handleReset = () => {
    setSearchParams({
      keyword: '',
      status: ''
    });
    if (activeTab === 'shipping') {
      setFilteredShippingData(shippingData);
    } else if (activeTab === 'airline') {
      setFilteredAirlineData(airlineData);
    }
  };

  // 船公司表格列定义
  const shippingColumns = [
    {
      title: (
        <Checkbox
          indeterminate={selectedRowKeys.length > 0 && selectedRowKeys.length < filteredShippingData.length}
          checked={selectedRowKeys.length === filteredShippingData.length && filteredShippingData.length > 0}
          onChange={(checked) => {
            if (checked) {
              setSelectedRowKeys(filteredShippingData.map(item => item.id));
            } else {
              setSelectedRowKeys([]);
            }
          }}
        />
      ),
      dataIndex: 'checkbox',
      width: 60,
      render: (_: unknown, record: ShippingCompany) => (
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
      title: '船公司名称（中文）',
      dataIndex: 'companyNameCn',
      width: 150,
    },
    {
      title: '船公司名称（英文）',
      dataIndex: 'companyNameEn',
      width: 200,
    },
    {
      title: '船公司代码',
      dataIndex: 'companyCode',
      width: 120,
    },
    {
      title: 'SCAC CODE',
      dataIndex: 'scacCode',
      width: 120,
    },
    {
      title: 'EORI Number',
      dataIndex: 'eoriNumber',
      width: 150,
    },
    {
      title: '9000 CODE',
      dataIndex: 'nineKCode',
      width: 120,
    },
    {
      title: 'NACCS CODE',
      dataIndex: 'naccsCode',
      width: 120,
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
      render: (_: unknown, record: ShippingCompany) => (
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
            title={`确定要${record.status === 'enabled' ? '禁用' : '启用'}此船公司吗？`}
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

  // 航空公司表格列定义
  const airlineColumns = [
    {
      title: (
        <Checkbox
          indeterminate={selectedRowKeys.length > 0 && selectedRowKeys.length < filteredAirlineData.length}
          checked={selectedRowKeys.length === filteredAirlineData.length && filteredAirlineData.length > 0}
          onChange={(checked) => {
            if (checked) {
              setSelectedRowKeys(filteredAirlineData.map(item => item.id));
            } else {
              setSelectedRowKeys([]);
            }
          }}
        />
      ),
      dataIndex: 'checkbox',
      width: 60,
      render: (_: unknown, record: AirlineCompany) => (
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
      title: '航空公司名称（中文）',
      dataIndex: 'companyNameCn',
      width: 150,
    },
    {
      title: '航空公司名称（英文）',
      dataIndex: 'companyNameEn',
      width: 200,
    },
          {
        title: 'IATA CODE',
        dataIndex: 'iataCode',
        width: 120,
      },
      {
        title: '主单号前缀',
        dataIndex: 'hawbPrefix',
        width: 120,
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
      render: (_: unknown, record: AirlineCompany) => (
        <Space>
          <Button
            type="text"
            size="small"
            icon={<IconEdit />}
            onClick={() => handleEditAirline(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title={`确定要${record.status === 'enabled' ? '禁用' : '启用'}此航空公司吗？`}
            onOk={() => handleToggleAirlineStatus(record.id, record.status)}
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
            onClick={() => handleAirlineEdiCodeSetting(record)}
          >
            EDI代码设置
          </Button>
        </Space>
      ),
    },
  ];

  // 处理编辑
  const handleEdit = (record: ShippingCompany) => {
    setCurrentCarrier(record);
    setIsEditing(true);
    editForm.setFieldsValue({
      companyNameCn: record.companyNameCn,
      companyNameEn: record.companyNameEn,
      companyCode: record.companyCode,
      scacCode: record.scacCode,
      eoriNumber: record.eoriNumber,
      nineKCode: record.nineKCode,
      naccsCode: record.naccsCode
    });
    setEditModalVisible(true);
  };

  // 处理航空公司编辑
  const handleEditAirline = (record: AirlineCompany) => {
    setCurrentCarrier(record);
    setIsEditing(true);
    editForm.setFieldsValue({
      companyNameCn: record.companyNameCn,
      companyNameEn: record.companyNameEn,
      iataCode: record.iataCode,
      hawbPrefix: record.hawbPrefix
    });
    setEditModalVisible(true);
  };

  // 处理新增
  const handleAdd = () => {
    setCurrentCarrier(null);
    setIsEditing(false);
    editForm.resetFields();
    setEditModalVisible(true);
  };

  // 处理状态切换
  const handleToggleStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'enabled' ? 'disabled' : 'enabled';
    setShippingData(prev => prev.map(company => 
      company.id === id ? { ...company, status: newStatus } : company
    ));
    setFilteredShippingData(prev => prev.map(company => 
      company.id === id ? { ...company, status: newStatus } : company
    ));
    Message.success(`船公司已${newStatus === 'enabled' ? '启用' : '禁用'}`);
  };

  // 处理航空公司状态切换
  const handleToggleAirlineStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'enabled' ? 'disabled' : 'enabled';
    setAirlineData(prev => prev.map(company => 
      company.id === id ? { ...company, status: newStatus } : company
    ));
    setFilteredAirlineData(prev => prev.map(company => 
      company.id === id ? { ...company, status: newStatus } : company
    ));
    Message.success(`航空公司已${newStatus === 'enabled' ? '启用' : '禁用'}`);
  };

  // 批量启用
  const handleBatchEnable = () => {
    if (selectedRowKeys.length === 0) {
      Message.warning(`请选择要启用的${activeTab === 'shipping' ? '船公司' : '航空公司'}`);
      return;
    }
    
    if (activeTab === 'shipping') {
      setShippingData(prev => prev.map(company => 
        selectedRowKeys.includes(company.id) ? { ...company, status: 'enabled' } : company
      ));
      setFilteredShippingData(prev => prev.map(company => 
        selectedRowKeys.includes(company.id) ? { ...company, status: 'enabled' } : company
      ));
    } else if (activeTab === 'airline') {
      setAirlineData(prev => prev.map(company => 
        selectedRowKeys.includes(company.id) ? { ...company, status: 'enabled' } : company
      ));
      setFilteredAirlineData(prev => prev.map(company => 
        selectedRowKeys.includes(company.id) ? { ...company, status: 'enabled' } : company
      ));
    }
    
    setSelectedRowKeys([]);
    Message.success(`已启用 ${selectedRowKeys.length} 个${activeTab === 'shipping' ? '船公司' : '航空公司'}`);
  };

  // 批量禁用
  const handleBatchDisable = () => {
    if (selectedRowKeys.length === 0) {
      Message.warning(`请选择要禁用的${activeTab === 'shipping' ? '船公司' : '航空公司'}`);
      return;
    }
    
    if (activeTab === 'shipping') {
      setShippingData(prev => prev.map(company => 
        selectedRowKeys.includes(company.id) ? { ...company, status: 'disabled' } : company
      ));
      setFilteredShippingData(prev => prev.map(company => 
        selectedRowKeys.includes(company.id) ? { ...company, status: 'disabled' } : company
      ));
    } else if (activeTab === 'airline') {
      setAirlineData(prev => prev.map(company => 
        selectedRowKeys.includes(company.id) ? { ...company, status: 'disabled' } : company
      ));
      setFilteredAirlineData(prev => prev.map(company => 
        selectedRowKeys.includes(company.id) ? { ...company, status: 'disabled' } : company
      ));
    }
    
    setSelectedRowKeys([]);
    Message.success(`已禁用 ${selectedRowKeys.length} 个${activeTab === 'shipping' ? '船公司' : '航空公司'}`);
  };

  // 处理EDI代码设置
  const handleEdiCodeSetting = (record: ShippingCompany) => {
    setCurrentCarrier(record);
    form.setFieldsValue({
      ediCodes: record.ediCodes
    });
    setEdiModalVisible(true);
  };

  // 处理航空公司EDI代码设置
  const handleAirlineEdiCodeSetting = (record: AirlineCompany) => {
    setCurrentCarrier(record);
    form.setFieldsValue({
      ediCodes: record.ediCodes
    });
    setEdiModalVisible(true);
  };

  // 保存承运人编辑
  const handleSaveCarrier = async () => {
    try {
      const values = await editForm.validate();
      
      if (activeTab === 'shipping') {
        const carrierData = {
          ...values,
          id: isEditing ? currentCarrier?.id : Date.now().toString(),
          ediCodes: isEditing ? (currentCarrier as ShippingCompany)?.ediCodes || [] : [],
          status: isEditing ? currentCarrier?.status : 'enabled' as const
        };

        if (isEditing) {
          // 更新现有船公司
          setShippingData(prev => prev.map(company => 
            company.id === currentCarrier?.id ? { ...company, ...carrierData } : company
          ));
          setFilteredShippingData(prev => prev.map(company => 
            company.id === currentCarrier?.id ? { ...company, ...carrierData } : company
          ));
          Message.success('船公司信息已更新');
        } else {
          // 新增船公司
          const newCompany = { ...carrierData, id: Date.now().toString(), ediCodes: [] };
          setShippingData(prev => [...prev, newCompany]);
          setFilteredShippingData(prev => [...prev, newCompany]);
          Message.success('船公司已添加');
        }
      } else if (activeTab === 'airline') {
        const carrierData = {
          ...values,
          id: isEditing ? currentCarrier?.id : Date.now().toString(),
          ediCodes: isEditing ? (currentCarrier as AirlineCompany)?.ediCodes || [] : [],
          status: isEditing ? currentCarrier?.status : 'enabled' as const
        };

        if (isEditing) {
          // 更新现有航空公司
          setAirlineData(prev => prev.map(company => 
            company.id === currentCarrier?.id ? { ...company, ...carrierData } : company
          ));
          setFilteredAirlineData(prev => prev.map(company => 
            company.id === currentCarrier?.id ? { ...company, ...carrierData } : company
          ));
          Message.success('航空公司信息已更新');
        } else {
          // 新增航空公司
          const newCompany = { ...carrierData, id: Date.now().toString(), ediCodes: [] };
          setAirlineData(prev => [...prev, newCompany]);
          setFilteredAirlineData(prev => [...prev, newCompany]);
          Message.success('航空公司已添加');
        }
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

      if (activeTab === 'shipping') {
        setShippingData(prev => prev.map(company => 
          company.id === currentCarrier?.id ? { ...company, ediCodes } : company
        ));
        setFilteredShippingData(prev => prev.map(company => 
          company.id === currentCarrier?.id ? { ...company, ediCodes } : company
        ));
      } else if (activeTab === 'airline') {
        setAirlineData(prev => prev.map(company => 
          company.id === currentCarrier?.id ? { ...company, ediCodes } : company
        ));
        setFilteredAirlineData(prev => prev.map(company => 
          company.id === currentCarrier?.id ? { ...company, ediCodes } : company
        ));
      }

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
        <Title heading={4} style={{ margin: 0 }}>承运人管理</Title>
      </div>

      <Tabs activeTab={activeTab} onChange={(tab) => {
        setActiveTab(tab);
        setSelectedRowKeys([]); // 切换Tab时清空选择
      }}>
        <TabPane key="shipping" title="船公司">
          {/* 搜索筛选区域 */}
          <Card style={{ marginBottom: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '16px', alignItems: 'flex-end' }}>
              <div>
                <div style={{ marginBottom: '4px', fontSize: '14px', color: '#666' }}>关键词搜索</div>
                <Input
                  placeholder="公司名称、公司代码、SCAC CODE"
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

          {/* 操作按钮区域 */}
          <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Button type="primary" icon={<IconPlus />} onClick={handleAdd}>
                  新增船公司
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
            columns={shippingColumns}
            data={filteredShippingData}
            rowKey="id"
            scroll={{ x: 1600 }}
            pagination={{
              pageSize: 10,
              showTotal: true,
              showJumper: true,
              sizeCanChange: true,
            }}
          />
        </TabPane>

        <TabPane key="airline" title="航空公司">
          {/* 搜索筛选区域 */}
          <Card style={{ marginBottom: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '16px', alignItems: 'flex-end' }}>
              <div>
                <div style={{ marginBottom: '4px', fontSize: '14px', color: '#666' }}>关键词搜索</div>
                <Input
                  placeholder="公司名称、IATA CODE"
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

          {/* 操作按钮区域 */}
          <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Button type="primary" icon={<IconPlus />} onClick={handleAdd}>
                  新增航空公司
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
            columns={airlineColumns}
            data={filteredAirlineData}
            rowKey="id"
            scroll={{ x: 1600 }}
            pagination={{
              pageSize: 10,
              showTotal: true,
              showJumper: true,
              sizeCanChange: true,
            }}
          />
        </TabPane>
      </Tabs>

      {/* 新增/编辑承运人弹窗 */}
      <Modal
        title={
          activeTab === 'shipping' 
            ? (isEditing ? '编辑船公司' : '新增船公司')
            : (isEditing ? '编辑航空公司' : '新增航空公司')
        }
        visible={editModalVisible}
        onOk={handleSaveCarrier}
        onCancel={() => setEditModalVisible(false)}
        style={{ width: 800 }}
      >
        <Form form={editForm} layout="vertical">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Form.Item
              field="companyNameCn"
              label={activeTab === 'shipping' ? '船公司名称（中文）' : '航空公司名称（中文）'}
              rules={[{ required: true, message: '请输入中文名称' }]}
            >
              <Input placeholder="请输入中文名称" />
            </Form.Item>
            
            <Form.Item
              field="companyNameEn"
              label={activeTab === 'shipping' ? '船公司名称（英文）' : '航空公司名称（英文）'}
              rules={[{ required: true, message: '请输入英文名称' }]}
            >
              <Input placeholder="请输入英文名称" />
            </Form.Item>
            
            {activeTab === 'shipping' ? (
              <>
                <Form.Item
                  field="companyCode"
                  label="船公司代码"
                  rules={[{ required: true, message: '请输入船公司代码' }]}
                >
                  <Input placeholder="请输入船公司代码" />
                </Form.Item>
                
                <Form.Item
                  field="scacCode"
                  label="SCAC CODE"
                  rules={[{ required: true, message: '请输入SCAC CODE' }]}
                >
                  <Input placeholder="请输入SCAC CODE" />
                </Form.Item>
                
                <Form.Item
                  field="eoriNumber"
                  label="EORI Number"
                  rules={[{ required: true, message: '请输入EORI Number' }]}
                >
                  <Input placeholder="请输入EORI Number" />
                </Form.Item>
                
                <Form.Item
                  field="nineKCode"
                  label="9000 CODE"
                  rules={[{ required: true, message: '请输入9000 CODE' }]}
                >
                  <Input placeholder="请输入9000 CODE" />
                </Form.Item>
                
                <Form.Item
                  field="naccsCode"
                  label="NACCS CODE"
                  rules={[{ required: true, message: '请输入NACCS CODE' }]}
                >
                  <Input placeholder="请输入NACCS CODE" />
                </Form.Item>
              </>
            ) : (
              <>
                <Form.Item
                  field="iataCode"
                  label="IATA CODE"
                  rules={[{ required: true, message: '请输入IATA CODE' }]}
                >
                  <Input placeholder="请输入IATA CODE，如：CA" />
                </Form.Item>
                
                <Form.Item
                  field="hawbPrefix"
                  label="主单号前缀"
                  rules={[
                    { required: true, message: '请输入主单号前缀' },
                    { 
                      validator: (value, callback) => {
                        if (value && !/^\d{3}$/.test(value)) {
                          callback('主单号前缀必须为3位数字');
                        } else {
                          callback();
                        }
                      }
                    }
                  ]}
                >
                  <Input placeholder="请输入3位数字，如：999" maxLength={3} />
                </Form.Item>
              </>
            )}
          </div>
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

export default CarrierManagement; 