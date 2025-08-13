import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Tag,
  Checkbox,
  Modal,
  Input,
  Select,
  Message,
  Popconfirm,
  Typography
} from '@arco-design/web-react';
import {
  IconPlus,
  IconSearch,
  IconRefresh
} from '@arco-design/web-react/icon';

const { Option } = Select;

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
  const [addTermModalVisible, setAddTermModalVisible] = useState(false);
  const [termLibraryData, setTermLibraryData] = useState<TransportTerm[]>([]);
  const [filteredTermLibrary, setFilteredTermLibrary] = useState<TransportTerm[]>([]);
  const [selectedTermIds, setSelectedTermIds] = useState<string[]>([]);
  const [addSearchParams, setAddSearchParams] = useState({
    keyword: ''
  });
  const [searchParams, setSearchParams] = useState<SearchParams>({
    keyword: '',
    status: ''
  });

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

    // 创建运输条款库数据
    const termLibraryMockData: TransportTerm[] = [
      {
        id: 'lib1',
        code: 'HOOK-HOOK',
        name: '吊钩到吊钩（空运）',
        status: 'enabled'
      },
      {
        id: 'lib2',
        code: 'AIRPORT-AIRPORT',
        name: '机场到机场',
        status: 'enabled'
      },
      {
        id: 'lib3',
        code: 'TERMINAL-TERMINAL',
        name: '航站楼到航站楼',
        status: 'enabled'
      },
      {
        id: 'lib4',
        code: 'GATE-GATE',
        name: '登机口到登机口',
        status: 'enabled'
      },
      {
        id: 'lib5',
        code: 'STATION-STATION',
        name: '车站到车站',
        status: 'enabled'
      },
      {
        id: 'lib6',
        code: 'DEPOT-DEPOT',
        name: '仓储站到仓储站',
        status: 'enabled'
      },
      {
        id: 'lib7',
        code: 'PICKUP-DELIVERY',
        name: '提货到派送',
        status: 'enabled'
      },
      {
        id: 'lib8',
        code: 'ORIGIN-DESTINATION',
        name: '起点到终点',
        status: 'enabled'
      },
      {
        id: 'lib9',
        code: 'LOADING-UNLOADING',
        name: '装货点到卸货点',
        status: 'enabled'
      },
      {
        id: 'lib10',
        code: 'COLLECTION-DELIVERY',
        name: '收货到交货',
        status: 'enabled'
      }
    ];

    setTermLibraryData(termLibraryMockData);
    setFilteredTermLibrary(termLibraryMockData);
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

  // 处理新增（改为选择模式）
  const handleAdd = () => {
    setSelectedTermIds([]);
    setAddSearchParams({ keyword: '' });
    // 过滤掉已经存在的运输条款
    const availableTerms = termLibraryData.filter(term => 
      !transportTerms.some(existingTerm => existingTerm.code === term.code)
    );
    setFilteredTermLibrary(availableTerms);
    setAddTermModalVisible(true);
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

  // 运输条款库搜索列定义
  const termLibraryColumns = [
    {
      title: (
        <Checkbox
          indeterminate={selectedTermIds.length > 0 && selectedTermIds.length < filteredTermLibrary.length}
          checked={selectedTermIds.length === filteredTermLibrary.length && filteredTermLibrary.length > 0}
          onChange={(checked) => {
            if (checked) {
              setSelectedTermIds(filteredTermLibrary.map(item => item.id));
            } else {
              setSelectedTermIds([]);
            }
          }}
        />
      ),
      dataIndex: 'checkbox',
      width: 60,
      headerStyle: { whiteSpace: 'nowrap' },
      render: (_: unknown, record: TransportTerm) => (
        <Checkbox
          checked={selectedTermIds.includes(record.id)}
          onChange={(checked) => {
            if (checked) {
              setSelectedTermIds([...selectedTermIds, record.id]);
            } else {
              setSelectedTermIds(selectedTermIds.filter(id => id !== record.id));
            }
          }}
        />
      ),
    },
    {
      title: '代码',
      dataIndex: 'code',
      width: 200,
      headerStyle: { whiteSpace: 'nowrap' },
    },
    {
      title: '名称',
      dataIndex: 'name',
      width: 250,
      headerStyle: { whiteSpace: 'nowrap' },
    }
  ];

  // 运输条款库搜索功能
  const handleTermLibrarySearch = () => {
    let filtered = termLibraryData.filter(term => 
      !transportTerms.some(existingTerm => existingTerm.code === term.code)
    );

    // 关键词搜索
    if (addSearchParams.keyword) {
      filtered = filtered.filter(term => 
        term.code.toLowerCase().includes(addSearchParams.keyword.toLowerCase()) ||
        term.name.toLowerCase().includes(addSearchParams.keyword.toLowerCase())
      );
    }

    setFilteredTermLibrary(filtered);
  };

  // 重置运输条款库搜索
  const handleTermLibraryReset = () => {
    setAddSearchParams({ keyword: '' });
    const availableTerms = termLibraryData.filter(term => 
      !transportTerms.some(existingTerm => existingTerm.code === term.code)
    );
    setFilteredTermLibrary(availableTerms);
  };

  // 确认添加选中的运输条款
  const handleConfirmAddTerms = () => {
    if (selectedTermIds.length === 0) {
      Message.warning('请选择要添加的运输条款');
      return;
    }

    const termsToAdd = filteredTermLibrary.filter(term => 
      selectedTermIds.includes(term.id)
    ).map(term => ({
      ...term,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      status: 'enabled' as const
    }));

    setTransportTerms(prev => [...prev, ...termsToAdd]);
    setAddTermModalVisible(false);
    setSelectedTermIds([]);
    filterData();
    Message.success(`成功添加 ${termsToAdd.length} 个运输条款`);
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
      headerStyle: { whiteSpace: 'nowrap' },
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
      width: 150,
      sorter: (a: TransportTerm, b: TransportTerm) => a.code.localeCompare(b.code),
      headerStyle: { whiteSpace: 'nowrap' },
    },
    {
      title: '名称',
      dataIndex: 'name',
      width: 200,
      sorter: (a: TransportTerm, b: TransportTerm) => a.name.localeCompare(b.name),
      headerStyle: { whiteSpace: 'nowrap' },
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      sorter: (a: TransportTerm, b: TransportTerm) => a.status.localeCompare(b.status),
      headerStyle: { whiteSpace: 'nowrap' },
      render: (_: unknown, record: TransportTerm) => (
        <Tag color={record.status === 'enabled' ? 'green' : 'red'}>
          {record.status === 'enabled' ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: 120,
      fixed: 'right' as const,
      headerStyle: { whiteSpace: 'nowrap' },
      render: (_: unknown, record: TransportTerm) => (
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
      ),
    }
  ];

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
              新增运输条款
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
        scroll={{ x: 700 }}
        pagination={{
          pageSize: 10,
          showTotal: true,
          showJumper: true,
          sizeCanChange: true,
        }}
      />

      {/* 新增运输条款选择弹窗 */}
      <Modal
        title="选择运输条款"
        visible={addTermModalVisible}
        onOk={handleConfirmAddTerms}
        onCancel={() => setAddTermModalVisible(false)}
        style={{ width: 800 }}
        okText={`确认添加 (${selectedTermIds.length})`}
        okButtonProps={{ disabled: selectedTermIds.length === 0 }}
      >
        {/* 运输条款库搜索区域 */}
        <Card style={{ marginBottom: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '16px', alignItems: 'flex-end' }}>
            <div>
              <div style={{ marginBottom: '4px', fontSize: '14px', color: '#666' }}>关键词搜索</div>
              <Input
                placeholder="代码、名称"
                value={addSearchParams.keyword}
                onChange={(value) => setAddSearchParams(prev => ({ ...prev, keyword: value }))}
              />
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button type="primary" icon={<IconSearch />} onClick={handleTermLibrarySearch}>
                搜索
              </Button>
              <Button icon={<IconRefresh />} onClick={handleTermLibraryReset}>
                重置
              </Button>
            </div>
          </div>
        </Card>

        <div style={{ marginBottom: '12px', fontSize: '14px', color: '#666' }}>
          已选择 {selectedTermIds.length} 个运输条款，共 {filteredTermLibrary.length} 个可选
        </div>

        <Table
          columns={termLibraryColumns}
          data={filteredTermLibrary}
          rowKey="id"
          scroll={{ x: 600, y: 400 }}
          pagination={{
            pageSize: 8,
            showTotal: true,
            showJumper: true,
            simple: true,
          }}
        />
      </Modal>
    </Card>
  );
};

export default TransportTermsManagement; 