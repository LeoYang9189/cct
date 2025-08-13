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
  Typography,
  Checkbox
} from '@arco-design/web-react';
import {
  IconPlus,
  IconSettings,
  IconMinus,
  IconSearch,
  IconRefresh
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
  const [addPackageModalVisible, setAddPackageModalVisible] = useState(false);
  const [packageLibraryData, setPackageLibraryData] = useState<PackageUnit[]>([]);
  const [filteredPackageLibrary, setFilteredPackageLibrary] = useState<PackageUnit[]>([]);
  const [selectedPackageIds, setSelectedPackageIds] = useState<string[]>([]);
  const [addSearchParams, setAddSearchParams] = useState({
    keyword: ''
  });
  const [ediModalVisible, setEdiModalVisible] = useState(false);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    keyword: '',
    status: ''
  });

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

    // 创建包装单位库数据
    const packageLibraryMockData: PackageUnit[] = [
      {
        id: 'lib1',
        packageCode2: 'PC',
        packageCode4: 'PC01',
        packageNameCn: '件',
        packageNameEn: 'Piece',
        ediCodes: [],
        status: 'enabled' as const
      },
      {
        id: 'lib2',
        packageCode2: 'PK',
        packageCode4: 'PK01',
        packageNameCn: '包',
        packageNameEn: 'Package',
        ediCodes: [],
        status: 'enabled' as const
      },
      {
        id: 'lib3',
        packageCode2: 'BT',
        packageCode4: 'BT01',
        packageNameCn: '瓶',
        packageNameEn: 'Bottle',
        ediCodes: [],
        status: 'enabled' as const
      },
      {
        id: 'lib4',
        packageCode2: 'CN',
        packageCode4: 'CN01',
        packageNameCn: '罐',
        packageNameEn: 'Can',
        ediCodes: [],
        status: 'enabled' as const
      },
      {
        id: 'lib5',
        packageCode2: 'TB',
        packageCode4: 'TB01',
        packageNameCn: '管',
        packageNameEn: 'Tube',
        ediCodes: [],
        status: 'enabled' as const
      },
      {
        id: 'lib6',
        packageCode2: 'BD',
        packageCode4: 'BD01',
        packageNameCn: '束',
        packageNameEn: 'Bundle',
        ediCodes: [],
        status: 'enabled' as const
      },
      {
        id: 'lib7',
        packageCode2: 'CT',
        packageCode4: 'CT02',
        packageNameCn: '桶',
        packageNameEn: 'Container',
        ediCodes: [],
        status: 'enabled' as const
      },
      {
        id: 'lib8',
        packageCode2: 'ST',
        packageCode4: 'ST01',
        packageNameCn: '套',
        packageNameEn: 'Set',
        ediCodes: [],
        status: 'enabled' as const
      },
      {
        id: 'lib9',
        packageCode2: 'PR',
        packageCode4: 'PR01',
        packageNameCn: '双',
        packageNameEn: 'Pair',
        ediCodes: [],
        status: 'enabled' as const
      },
      {
        id: 'lib10',
        packageCode2: 'BL',
        packageCode4: 'BL01',
        packageNameCn: '捆',
        packageNameEn: 'Bale',
        ediCodes: [],
        status: 'enabled' as const
      }
    ];

    setPackageLibraryData(packageLibraryMockData);
    setFilteredPackageLibrary(packageLibraryMockData);
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
      headerStyle: { whiteSpace: 'nowrap' },
      render: (_: unknown, record: PackageUnit) => (
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
      title: '包装代码（2位）',
      dataIndex: 'packageCode2',
      width: 130,
      sorter: (a: PackageUnit, b: PackageUnit) => a.packageCode2.localeCompare(b.packageCode2),
      headerStyle: { whiteSpace: 'nowrap' },
    },
    {
      title: '包装代码（4位）',
      dataIndex: 'packageCode4',
      width: 130,
      sorter: (a: PackageUnit, b: PackageUnit) => a.packageCode4.localeCompare(b.packageCode4),
      headerStyle: { whiteSpace: 'nowrap' },
    },
    {
      title: '包装名称（中文）',
      dataIndex: 'packageNameCn',
      width: 150,
      sorter: (a: PackageUnit, b: PackageUnit) => a.packageNameCn.localeCompare(b.packageNameCn),
      headerStyle: { whiteSpace: 'nowrap' },
    },
    {
      title: '包装名称（英文）',
      dataIndex: 'packageNameEn',
      width: 150,
      sorter: (a: PackageUnit, b: PackageUnit) => a.packageNameEn.localeCompare(b.packageNameEn),
      headerStyle: { whiteSpace: 'nowrap' },
    },
    {
      title: 'EDI代码',
      dataIndex: 'ediCodes',
      width: 150,
      sorter: (a: PackageUnit, b: PackageUnit) => a.ediCodes.length - b.ediCodes.length,
      headerStyle: { whiteSpace: 'nowrap' },
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
      sorter: (a: PackageUnit, b: PackageUnit) => a.status.localeCompare(b.status),
      headerStyle: { whiteSpace: 'nowrap' },
      render: (status: string) => (
        <Tag color={status === 'enabled' ? 'green' : 'red'}>
          {status === 'enabled' ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: 200,
      fixed: 'right' as const,
      headerStyle: { whiteSpace: 'nowrap' },
      render: (_: unknown, record: PackageUnit) => (
        <Space>
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

  // 处理新增（改为选择模式）
  const handleAdd = () => {
    setSelectedPackageIds([]);
    setAddSearchParams({ keyword: '' });
    // 过滤掉已经存在的包装单位
    const availablePackages = packageLibraryData.filter(packageUnit => 
      !data.some(existingPackage => existingPackage.packageCode2 === packageUnit.packageCode2)
    );
    setFilteredPackageLibrary(availablePackages);
    setAddPackageModalVisible(true);
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

  // 包装单位库搜索列定义
  const packageLibraryColumns = [
    {
      title: (
        <Checkbox
          indeterminate={selectedPackageIds.length > 0 && selectedPackageIds.length < filteredPackageLibrary.length}
          checked={selectedPackageIds.length === filteredPackageLibrary.length && filteredPackageLibrary.length > 0}
          onChange={(checked) => {
            if (checked) {
              setSelectedPackageIds(filteredPackageLibrary.map(item => item.id));
            } else {
              setSelectedPackageIds([]);
            }
          }}
        />
      ),
      dataIndex: 'checkbox',
      width: 60,
      headerStyle: { whiteSpace: 'nowrap' },
      render: (_: unknown, record: PackageUnit) => (
        <Checkbox
          checked={selectedPackageIds.includes(record.id)}
          onChange={(checked) => {
            if (checked) {
              setSelectedPackageIds([...selectedPackageIds, record.id]);
            } else {
              setSelectedPackageIds(selectedPackageIds.filter(id => id !== record.id));
            }
          }}
        />
      ),
    },
    {
      title: '包装代码（2位）',
      dataIndex: 'packageCode2',
      width: 130,
      headerStyle: { whiteSpace: 'nowrap' },
    },
    {
      title: '包装代码（4位）',
      dataIndex: 'packageCode4',
      width: 130,
      headerStyle: { whiteSpace: 'nowrap' },
    },
    {
      title: '包装名称（中文）',
      dataIndex: 'packageNameCn',
      width: 150,
      headerStyle: { whiteSpace: 'nowrap' },
    },
    {
      title: '包装名称（英文）',
      dataIndex: 'packageNameEn',
      width: 150,
      headerStyle: { whiteSpace: 'nowrap' },
    }
  ];

  // 包装单位库搜索功能
  const handlePackageLibrarySearch = () => {
    let filtered = packageLibraryData.filter(packageUnit => 
      !data.some(existingPackage => existingPackage.packageCode2 === packageUnit.packageCode2)
    );

    // 关键词搜索
    if (addSearchParams.keyword) {
      filtered = filtered.filter(packageUnit => 
        packageUnit.packageCode2.toLowerCase().includes(addSearchParams.keyword.toLowerCase()) ||
        packageUnit.packageCode4.toLowerCase().includes(addSearchParams.keyword.toLowerCase()) ||
        packageUnit.packageNameCn.includes(addSearchParams.keyword) ||
        packageUnit.packageNameEn.toLowerCase().includes(addSearchParams.keyword.toLowerCase())
      );
    }

    setFilteredPackageLibrary(filtered);
  };

  // 重置包装单位库搜索
  const handlePackageLibraryReset = () => {
    setAddSearchParams({ keyword: '' });
    const availablePackages = packageLibraryData.filter(packageUnit => 
      !data.some(existingPackage => existingPackage.packageCode2 === packageUnit.packageCode2)
    );
    setFilteredPackageLibrary(availablePackages);
  };

  // 确认添加选中的包装单位
  const handleConfirmAddPackages = () => {
    if (selectedPackageIds.length === 0) {
      Message.warning('请选择要添加的包装单位');
      return;
    }

    const packagesToAdd = filteredPackageLibrary.filter(packageUnit => 
      selectedPackageIds.includes(packageUnit.id)
    ).map(packageUnit => ({
      ...packageUnit,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      status: 'enabled' as const,
      ediCodes: []
    }));

    setData(prev => [...prev, ...packagesToAdd]);
    setFilteredData(prev => [...prev, ...packagesToAdd]);
    setAddPackageModalVisible(false);
    setSelectedPackageIds([]);
    Message.success(`成功添加 ${packagesToAdd.length} 个包装单位`);
  };

  // 处理EDI代码设置
  const handleEdiCodeSetting = (record: PackageUnit) => {
    setCurrentPackageUnit(record);
    form.setFieldsValue({
      ediCodes: record.ediCodes
    });
    setEdiModalVisible(true);
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
      {/* 强制表头不换行样式 */}
      <style>{`
        .arco-table-th {
          white-space: nowrap !important;
        }
        .arco-table-th .arco-table-th-item {
          white-space: nowrap !important;
        }
        .arco-table-th .arco-table-cell-text {
          white-space: nowrap !important;
        }
        .arco-table-th .arco-table-cell {
          white-space: nowrap !important;
        }
      `}</style>

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

      {/* 新增包装单位选择弹窗 */}
      <Modal
        title="选择包装单位"
        visible={addPackageModalVisible}
        onOk={handleConfirmAddPackages}
        onCancel={() => setAddPackageModalVisible(false)}
        style={{ width: 800 }}
        okText={`确认添加 (${selectedPackageIds.length})`}
        okButtonProps={{ disabled: selectedPackageIds.length === 0 }}
      >
        {/* 包装单位库搜索区域 */}
        <Card style={{ marginBottom: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '16px', alignItems: 'flex-end' }}>
            <div>
              <div style={{ marginBottom: '4px', fontSize: '14px', color: '#666' }}>关键词搜索</div>
              <Input
                placeholder="包装代码、包装名称"
                value={addSearchParams.keyword}
                onChange={(value) => setAddSearchParams(prev => ({ ...prev, keyword: value }))}
              />
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button type="primary" icon={<IconSearch />} onClick={handlePackageLibrarySearch}>
                搜索
              </Button>
              <Button icon={<IconRefresh />} onClick={handlePackageLibraryReset}>
                重置
              </Button>
            </div>
          </div>
        </Card>

        <div style={{ marginBottom: '12px', fontSize: '14px', color: '#666' }}>
          已选择 {selectedPackageIds.length} 个包装单位，共 {filteredPackageLibrary.length} 个可选
        </div>

        <Table
          columns={packageLibraryColumns}
          data={filteredPackageLibrary}
          rowKey="id"
          scroll={{ x: 700, y: 400 }}
          pagination={{
            pageSize: 8,
            showTotal: true,
            showJumper: true,
            simple: true,
          }}
        />
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