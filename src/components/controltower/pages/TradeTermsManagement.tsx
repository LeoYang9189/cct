import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Checkbox,
  Modal,
  Input,
  Message,
  Popconfirm,
  Typography
} from '@arco-design/web-react';
import {
  IconPlus,
  IconSearch,
  IconRefresh
} from '@arco-design/web-react/icon';

const { Title } = Typography;

// 贸易条款数据接口
interface TradeTerm {
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

// 贸易条款数据库
const TRADE_TERMS_DATABASE: TradeTerm[] = [
  // 国际贸易术语 Incoterms 2020
  { id: 'term_1', code: 'EXW', name: '工厂交货', status: 'enabled' },
  { id: 'term_2', code: 'FCA', name: '货交承运人', status: 'enabled' },
  { id: 'term_3', code: 'CPT', name: '运费付至', status: 'enabled' },
  { id: 'term_4', code: 'CIP', name: '运费、保险费付至', status: 'enabled' },
  { id: 'term_5', code: 'DAP', name: '目的地交货', status: 'enabled' },
  { id: 'term_6', code: 'DPU', name: '目的地卸货交货', status: 'enabled' },
  { id: 'term_7', code: 'DDP', name: '完税后交货', status: 'enabled' },
  { id: 'term_8', code: 'FAS', name: '船边交货', status: 'enabled' },
  { id: 'term_9', code: 'FOB', name: '船上交货', status: 'enabled' },
  { id: 'term_10', code: 'CFR', name: '成本加运费', status: 'enabled' },
  { id: 'term_11', code: 'CIF', name: '成本、保险费加运费', status: 'enabled' },
  
  // 已废止但仍在使用的贸易术语
  { id: 'term_12', code: 'DAT', name: '目的地码头交货（已废止）', status: 'disabled' },
  { id: 'term_13', code: 'DAF', name: '边境交货（已废止）', status: 'disabled' },
  { id: 'term_14', code: 'DES', name: '目的港船上交货（已废止）', status: 'disabled' },
  { id: 'term_15', code: 'DEQ', name: '目的港码头交货（已废止）', status: 'disabled' },
  { id: 'term_16', code: 'DDU', name: '未完税交货（已废止）', status: 'disabled' },
  
  // 其他常用贸易术语
  { id: 'term_17', code: 'C&F', name: '成本加运费（CFR别称）', status: 'enabled' },
  { id: 'term_18', code: 'CNF', name: '成本加运费（CFR别称）', status: 'enabled' },
  { id: 'term_19', code: 'CIF&C', name: '成本保险费加运费及佣金', status: 'enabled' },
  { id: 'term_20', code: 'FOB&C', name: '船上交货含佣金', status: 'enabled' }
];

// 添加全局样式，强制表头不换行
const tableHeaderStyle = `
  .arco-table-th {
    white-space: nowrap !important;
  }
`;

const TradeTermsManagement: React.FC = () => {
  const [tradeTerms, setTradeTerms] = useState<TradeTerm[]>([]);
  const [filteredData, setFilteredData] = useState<TradeTerm[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [selectModalVisible, setSelectModalVisible] = useState(false);
  const [selectableTerms, setSelectableTerms] = useState<TradeTerm[]>([]);
  const [selectedTerms, setSelectedTerms] = useState<string[]>([]);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    keyword: '',
    status: ''
  });
  const [selectSearchParams, setSelectSearchParams] = useState<SearchParams>({
    keyword: '',
    status: ''
  });

  // 初始化示例数据
  useEffect(() => {
    const mockData: TradeTerm[] = [
      {
        id: '1',
        code: 'EXW',
        name: '工厂交货',
        status: 'enabled'
      },
      {
        id: '2',
        code: 'FCA',
        name: '货交承运人',
        status: 'enabled'
      },
      {
        id: '3',
        code: 'CPT',
        name: '运费付至',
        status: 'enabled'
      },
      {
        id: '4',
        code: 'CIP',
        name: '运费、保险费付至',
        status: 'enabled'
      },
      {
        id: '5',
        code: 'DAP',
        name: '目的地交货',
        status: 'enabled'
      },
      {
        id: '6',
        code: 'DPU',
        name: '目的地卸货交货',
        status: 'enabled'
      },
      {
        id: '7',
        code: 'DDP',
        name: '完税后交货',
        status: 'enabled'
      },
      {
        id: '8',
        code: 'FAS',
        name: '船边交货',
        status: 'enabled'
      },
      {
        id: '9',
        code: 'FOB',
        name: '船上交货',
        status: 'enabled'
      },
      {
        id: '10',
        code: 'CFR',
        name: '成本加运费',
        status: 'enabled'
      },
      {
        id: '11',
        code: 'CIF',
        name: '成本、保险费加运费',
        status: 'enabled'
      }
    ];

    setTradeTerms(mockData);
    filterData(mockData);
  }, []);

  // 筛选数据
  const filterData = (data = tradeTerms) => {
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
    setFilteredData(tradeTerms);
  };

  // 处理新增（改为选择模式）
  const handleAdd = () => {
    // 获取已存在的代码列表
    const existingCodes = tradeTerms.map(item => item.code);
    
    // 过滤出未添加的贸易条款
    const available = TRADE_TERMS_DATABASE.filter(term => 
      !existingCodes.includes(term.code)
    );
    
    setSelectableTerms(available);
    setSelectedTerms([]);
    setSelectSearchParams({ keyword: '', status: '' });
    setSelectModalVisible(true);
  };

  // 处理选择贸易条款
  const handleSelectTerms = () => {
    if (selectedTerms.length === 0) {
      Message.warning('请选择至少一个贸易条款');
      return;
    }

    const newTerms = TRADE_TERMS_DATABASE
      .filter(term => selectedTerms.includes(term.id))
      .map(term => ({
        ...term,
        id: Date.now().toString() + '_' + term.id,
        status: 'enabled' as const
      }));

    setTradeTerms(prev => [...prev, ...newTerms]);
    filterData([...tradeTerms, ...newTerms]);
    
    setSelectModalVisible(false);
    Message.success(`已添加 ${newTerms.length} 个贸易条款`);
  };

  // 筛选可选择的贸易条款
  const filterSelectableTerms = () => {
    let filtered = [...selectableTerms];
    
    if (selectSearchParams.keyword) {
      filtered = filtered.filter(item => 
        item.code.toLowerCase().includes(selectSearchParams.keyword.toLowerCase()) ||
        item.name.toLowerCase().includes(selectSearchParams.keyword.toLowerCase())
      );
    }

    return filtered;
  };

  // 处理状态切换
  const handleToggleStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'enabled' ? 'disabled' : 'enabled';
    setTradeTerms(prev => prev.map(item => 
      item.id === id ? { ...item, status: newStatus } : item
    ));
    filterData();
    Message.success(`贸易条款已${newStatus === 'enabled' ? '启用' : '禁用'}`);
  };

  // 批量启用
  const handleBatchEnable = () => {
    if (selectedRowKeys.length === 0) {
      Message.warning('请选择要启用的贸易条款');
      return;
    }
    
    setTradeTerms(prev => prev.map(item => 
      selectedRowKeys.includes(item.id) ? { ...item, status: 'enabled' } : item
    ));
    
    setSelectedRowKeys([]);
    filterData();
    Message.success(`已启用 ${selectedRowKeys.length} 个贸易条款`);
  };

  // 批量禁用
  const handleBatchDisable = () => {
    if (selectedRowKeys.length === 0) {
      Message.warning('请选择要禁用的贸易条款');
      return;
    }
    
    setTradeTerms(prev => prev.map(item => 
      selectedRowKeys.includes(item.id) ? { ...item, status: 'disabled' } : item
    ));
    
    setSelectedRowKeys([]);
    filterData();
    Message.success(`已禁用 ${selectedRowKeys.length} 个贸易条款`);
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
      render: (_: unknown, record: TradeTerm) => (
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
      sorter: (a: TradeTerm, b: TradeTerm) => a.code.localeCompare(b.code),
      headerStyle: { whiteSpace: 'nowrap' }
    },
    {
      title: '名称',
      dataIndex: 'name',
      width: 300,
      sorter: (a: TradeTerm, b: TradeTerm) => a.name.localeCompare(b.name, 'zh-CN'),
      headerStyle: { whiteSpace: 'nowrap' }
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      sorter: (a: TradeTerm, b: TradeTerm) => a.status.localeCompare(b.status),
      headerStyle: { whiteSpace: 'nowrap' },
      render: (_: unknown, record: TradeTerm) => (
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
      render: (_: unknown, record: TradeTerm) => (
        <Space>
          <Popconfirm
            title={`确定要${record.status === 'enabled' ? '禁用' : '启用'}此贸易条款吗？`}
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

  // 选择弹窗的表格列配置
  const selectColumns = [
    {
      title: (
        <Checkbox
          indeterminate={selectedTerms.length > 0 && selectedTerms.length < filterSelectableTerms().length}
          checked={selectedTerms.length === filterSelectableTerms().length && filterSelectableTerms().length > 0}
          onChange={(checked) => {
            if (checked) {
              setSelectedTerms(filterSelectableTerms().map(item => item.id));
            } else {
              setSelectedTerms([]);
            }
          }}
        />
      ),
      dataIndex: 'checkbox',
      width: 60,
      render: (_: unknown, record: TradeTerm) => (
        <Checkbox
          checked={selectedTerms.includes(record.id)}
          onChange={(checked) => {
            if (checked) {
              setSelectedTerms([...selectedTerms, record.id]);
            } else {
              setSelectedTerms(selectedTerms.filter(id => id !== record.id));
            }
          }}
        />
      ),
    },
    {
      title: '代码',
      dataIndex: 'code',
      width: 150,
      sorter: (a: TradeTerm, b: TradeTerm) => a.code.localeCompare(b.code),
      headerStyle: { whiteSpace: 'nowrap' }
    },
    {
      title: '名称',
      dataIndex: 'name',
      width: 400,
      sorter: (a: TradeTerm, b: TradeTerm) => a.name.localeCompare(b.name, 'zh-CN'),
      headerStyle: { whiteSpace: 'nowrap' }
    }
  ];

  return (
    <>
      <style>{tableHeaderStyle}</style>
      <Card>
        <div style={{ marginBottom: '20px' }}>
          <Title heading={4} style={{ margin: 0 }}>贸易条款</Title>
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
                新增贸易条款
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
          scroll={{ x: 730 }}
          pagination={{
            pageSize: 10,
            showTotal: true,
            showJumper: true,
            sizeCanChange: true,
          }}
        />

        {/* 选择贸易条款弹窗 */}
        <Modal
          title="选择贸易条款"
          visible={selectModalVisible}
          onOk={handleSelectTerms}
          onCancel={() => setSelectModalVisible(false)}
          style={{ width: 800 }}
          okText="确定"
          cancelText="取消"
        >
          {/* 搜索筛选区域 */}
          <Card style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end' }}>
              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: '4px', fontSize: '14px', color: '#666' }}>关键词搜索</div>
                <Input
                  placeholder="代码、名称"
                  value={selectSearchParams.keyword}
                  onChange={(value) => setSelectSearchParams(prev => ({ ...prev, keyword: value }))}
                />
              </div>
            </div>
          </Card>

          <Table
            columns={selectColumns}
            data={filterSelectableTerms()}
            rowKey="id"
            scroll={{ x: 600 }}
            pagination={{
              pageSize: 10,
              showTotal: true,
            }}
            style={{ marginTop: '16px' }}
          />
        </Modal>
      </Card>
    </>
  );
};

export default TradeTermsManagement; 