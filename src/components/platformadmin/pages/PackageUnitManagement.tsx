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

// 包装单位数据接口
interface PackageUnit {
  id: string;
  packageCode2: string;
  packageCode4: string;
  packageNameCn: string;
  packageNameEn: string;
  ediCodes: EDICode[];
  status: 'enabled' | 'disabled';
}

// EDI代码接口
interface EDICode {
  id: string;
  platform: string;
  ediCode: string;
}

// 搜索筛选参数
interface SearchParams {
  keyword: string;
  status: string;
}

// 平台选项
const platformOptions = [
  { value: '亿通', label: '亿通' },
  { value: 'INTTRA', label: 'INTTRA' },
  { value: '乐域', label: '乐域' },
  { value: 'CargoSmart', label: 'CargoSmart' }
];

const PackageUnitManagement: React.FC = () => {
  const [data, setData] = useState<PackageUnit[]>([]);
  const [filteredData, setFilteredData] = useState<PackageUnit[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [currentPackageUnit, setCurrentPackageUnit] = useState<PackageUnit | null>(null);
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
    const mockData: PackageUnit[] = [
      {
        id: '1',
        packageCode2: 'CT',
        packageCode4: 'CT01',
        packageNameCn: '纸箱',
        packageNameEn: 'Carton',
        ediCodes: [
          { id: '1', platform: '亿通', ediCode: 'CT001' },
          { id: '2', platform: 'INTTRA', ediCode: 'CT01' }
        ],
        status: 'enabled' as const
      },
      {
        id: '2',
        packageCode2: 'PL',
        packageCode4: 'PL01',
        packageNameCn: '托盘',
        packageNameEn: 'Pallet',
        ediCodes: [
          { id: '3', platform: 'CargoSmart', ediCode: 'PL001' }
        ],
        status: 'enabled' as const
      },
      {
        id: '3',
        packageCode2: 'BG',
        packageCode4: 'BG01',
        packageNameCn: '袋装',
        packageNameEn: 'Bag',
        ediCodes: [
          { id: '4', platform: '乐域', ediCode: 'BG001' },
          { id: '5', platform: '亿通', ediCode: 'BG01' }
        ],
        status: 'disabled' as const
      },
      {
        id: '4',
        packageCode2: 'DR',
        packageCode4: 'DR01',
        packageNameCn: '桶装',
        packageNameEn: 'Drum',
        ediCodes: [
          { id: '6', platform: 'INTTRA', ediCode: 'DR001' }
        ],
        status: 'enabled' as const
      },
      {
        id: '5',
        packageCode2: 'CS',
        packageCode4: 'CS01',
        packageNameCn: '箱装',
        packageNameEn: 'Case',
        ediCodes: [
          { id: '7', platform: '亿通', ediCode: 'CS001' },
          { id: '8', platform: 'CargoSmart', ediCode: 'CS01' }
        ],
        status: 'enabled' as const
      },
      {
        id: '6',
        packageCode2: 'RL',
        packageCode4: 'RL01',
        packageNameCn: '卷装',
        packageNameEn: 'Roll',
        ediCodes: [
          { id: '9', platform: '乐域', ediCode: 'RL001' }
        ],
        status: 'enabled' as const
      },
      {
        id: '7',
        packageCode2: 'BX',
        packageCode4: 'BX01',
        packageNameCn: '盒装',
        packageNameEn: 'Box',
        ediCodes: [
          { id: '10', platform: 'INTTRA', ediCode: 'BX001' }
        ],
        status: 'disabled' as const
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
      filtered = filtered.filter(packageUnit =>
        packageUnit.packageCode2.toLowerCase().includes(searchParams.keyword.toLowerCase()) ||
        packageUnit.packageCode4.toLowerCase().includes(searchParams.keyword.toLowerCase()) ||
        packageUnit.packageNameCn.includes(searchParams.keyword) ||
        packageUnit.packageNameEn.toLowerCase().includes(searchParams.keyword.toLowerCase())
      );
    }

    if (searchParams.status) {
      filtered = filtered.filter(packageUnit => packageUnit.status === searchParams.status);
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
      title: '包装代码（2位）',
      dataIndex: 'packageCode2',
      width: 130,
      sorter: (a: PackageUnit, b: PackageUnit) => a.packageCode2.localeCompare(b.packageCode2),
    },
    {
      title: '包装代码（4位）',
      dataIndex: 'packageCode4',
      width: 130,
      sorter: (a: PackageUnit, b: PackageUnit) => a.packageCode4.localeCompare(b.packageCode4),
    },
    {
      title: '包装名称（中文）',
      dataIndex: 'packageNameCn',
      width: 150,
    },
    {
      title: '包装名称（英文）',
      dataIndex: 'packageNameEn',
      width: 150,
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
      render: (_: unknown, record: PackageUnit) => (
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
            title={`确定要${record.status === 'enabled' ? '禁用' : '启用'}此包装单位吗？`}
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
  const handleEdit = (record: PackageUnit) => {
    setCurrentPackageUnit(record);
    setIsEditing(true);
    editForm.setFieldsValue({
      packageCode2: record.packageCode2,
      packageCode4: record.packageCode4,
      packageNameCn: record.packageNameCn,
      packageNameEn: record.packageNameEn
    });
    setEditModalVisible(true);
  };

  // 处理新增
  const handleAdd = () => {
    setCurrentPackageUnit(null);
    setIsEditing(false);
    editForm.resetFields();
    setEditModalVisible(true);
  };

  // 处理状态切换
  const handleToggleStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'enabled' ? 'disabled' : 'enabled';
    setData(prev => prev.map(packageUnit => 
      packageUnit.id === id ? { ...packageUnit, status: newStatus } : packageUnit
    ));
    setFilteredData(prev => prev.map(packageUnit => 
      packageUnit.id === id ? { ...packageUnit, status: newStatus } : packageUnit
    ));
    Message.success(`包装单位已${newStatus === 'enabled' ? '启用' : '禁用'}`);
  };

  // 批量启用
  const handleBatchEnable = () => {
    if (selectedRowKeys.length === 0) {
      Message.warning('请选择要启用的包装单位');
      return;
    }
    
    setData(prev => prev.map(packageUnit => 
      selectedRowKeys.includes(packageUnit.id) ? { ...packageUnit, status: 'enabled' } : packageUnit
    ));
    setFilteredData(prev => prev.map(packageUnit => 
      selectedRowKeys.includes(packageUnit.id) ? { ...packageUnit, status: 'enabled' } : packageUnit
    ));
    
    setSelectedRowKeys([]);
    Message.success(`已启用 ${selectedRowKeys.length} 个包装单位`);
  };

  // 批量禁用
  const handleBatchDisable = () => {
    if (selectedRowKeys.length === 0) {
      Message.warning('请选择要禁用的包装单位');
      return;
    }
    
    setData(prev => prev.map(packageUnit => 
      selectedRowKeys.includes(packageUnit.id) ? { ...packageUnit, status: 'disabled' } : packageUnit
    ));
    setFilteredData(prev => prev.map(packageUnit => 
      selectedRowKeys.includes(packageUnit.id) ? { ...packageUnit, status: 'disabled' } : packageUnit
    ));
    
    setSelectedRowKeys([]);
    Message.success(`已禁用 ${selectedRowKeys.length} 个包装单位`);
  };

  // 处理EDI代码设置
  const handleEdiCodeSetting = (record: PackageUnit) => {
    setCurrentPackageUnit(record);
    form.setFieldsValue({
      ediCodes: record.ediCodes
    });
    setEdiModalVisible(true);
  };

  // 保存包装单位编辑
  const handleSavePackageUnit = async () => {
    try {
      const values = await editForm.validate();
      
      const packageUnitData = {
        ...values,
        id: isEditing ? currentPackageUnit?.id : Date.now().toString(),
        ediCodes: isEditing ? currentPackageUnit?.ediCodes || [] : [],
        status: isEditing ? currentPackageUnit?.status : 'enabled' as const
      };

      if (isEditing) {
        // 更新现有包装单位
        setData(prev => prev.map(packageUnit => 
          packageUnit.id === currentPackageUnit?.id ? { ...packageUnit, ...packageUnitData } : packageUnit
        ));
        setFilteredData(prev => prev.map(packageUnit => 
          packageUnit.id === currentPackageUnit?.id ? { ...packageUnit, ...packageUnitData } : packageUnit
        ));
        Message.success('包装单位信息已更新');
      } else {
        // 新增包装单位
        const newPackageUnit = { ...packageUnitData, id: Date.now().toString(), ediCodes: [] };
        setData(prev => [...prev, newPackageUnit]);
        setFilteredData(prev => [...prev, newPackageUnit]);
        Message.success('包装单位已添加');
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

      setData(prev => prev.map(packageUnit => 
        packageUnit.id === currentPackageUnit?.id ? { ...packageUnit, ediCodes } : packageUnit
      ));
      setFilteredData(prev => prev.map(packageUnit => 
        packageUnit.id === currentPackageUnit?.id ? { ...packageUnit, ediCodes } : packageUnit
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
        <Title heading={4} style={{ margin: 0 }}>包装单位管理</Title>
      </div>

      {/* 搜索筛选区域 */}
      <Card style={{ marginBottom: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '16px', alignItems: 'flex-end' }}>
          <div>
            <div style={{ marginBottom: '4px', fontSize: '14px', color: '#666' }}>关键词搜索</div>
            <Input
              placeholder="包装代码、包装名称"
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
              新增包装单位
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
        scroll={{ x: 1300 }}
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

      {/* 新增/编辑包装单位弹窗 */}
      <Modal
        title={isEditing ? '编辑包装单位' : '新增包装单位'}
        visible={editModalVisible}
        onOk={handleSavePackageUnit}
        onCancel={() => setEditModalVisible(false)}
        style={{ width: 600 }}
      >
        <Form form={editForm} layout="vertical">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Form.Item
              field="packageCode2"
              label="包装代码（2位）"
              rules={[
                { required: true, message: '请输入包装代码（2位）' },
                { 
                  validator: (value, callback) => {
                    if (value && value.length !== 2) {
                      callback('包装代码必须为2位字符');
                    } else {
                      callback();
                    }
                  }
                }
              ]}
            >
              <Input placeholder="请输入2位包装代码，如：CT" maxLength={2} />
            </Form.Item>
            
            <Form.Item
              field="packageCode4"
              label="包装代码（4位）"
              rules={[
                { required: true, message: '请输入包装代码（4位）' },
                { 
                  validator: (value, callback) => {
                    if (value && value.length !== 4) {
                      callback('包装代码必须为4位字符');
                    } else {
                      callback();
                    }
                  }
                }
              ]}
            >
              <Input placeholder="请输入4位包装代码，如：CT01" maxLength={4} />
            </Form.Item>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Form.Item
              field="packageNameCn"
              label="包装名称（中文）"
              rules={[{ required: true, message: '请输入中文包装名称' }]}
            >
              <Input placeholder="请输入中文包装名称，如：纸箱" />
            </Form.Item>
            
            <Form.Item
              field="packageNameEn"
              label="包装名称（英文）"
              rules={[{ required: true, message: '请输入英文包装名称' }]}
            >
              <Input placeholder="请输入英文包装名称，如：Carton" />
            </Form.Item>
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

export default PackageUnitManagement; 