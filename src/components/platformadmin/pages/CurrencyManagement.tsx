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
  IconEye
} from '@arco-design/web-react/icon';

const { Title } = Typography;
const { Option } = Select;

// 币种数据接口
interface Currency {
  id: string;
  code: string; // 币种代码
  nameEn: string; // 名称（英文）
  nameCn: string; // 名称（中文）
  symbol: string; // 符号
  currencyDecimals: number; // 币种小数位数
  exchangeRateDecimals: number; // 汇率小数位数
  roundingRule: 'round_up' | 'round_down' | 'round_half'; // 进位规则
  status: 'enabled' | 'disabled';
}

// 搜索筛选参数
interface SearchParams {
  keyword: string;
  status: string;
}

const CurrencyManagement: React.FC = () => {
  const [currencyData, setCurrencyData] = useState<Currency[]>([]);
  const [filteredData, setFilteredData] = useState<Currency[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [currentCurrency, setCurrentCurrency] = useState<Currency | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    keyword: '',
    status: ''
  });
  const [editForm] = Form.useForm();

  // 初始化示例数据
  useEffect(() => {
    const mockData: Currency[] = [
      {
        id: '1',
        code: 'USD',
        nameEn: 'United States Dollar',
        nameCn: '美元',
        symbol: '$',
        currencyDecimals: 2,
        exchangeRateDecimals: 6,
        roundingRule: 'round_half',
        status: 'enabled'
      },
      {
        id: '2',
        code: 'CNY',
        nameEn: 'Chinese Yuan',
        nameCn: '人民币',
        symbol: '¥',
        currencyDecimals: 2,
        exchangeRateDecimals: 6,
        roundingRule: 'round_half',
        status: 'enabled'
      },
      {
        id: '3',
        code: 'EUR',
        nameEn: 'Euro',
        nameCn: '欧元',
        symbol: '€',
        currencyDecimals: 2,
        exchangeRateDecimals: 6,
        roundingRule: 'round_half',
        status: 'enabled'
      },
      {
        id: '4',
        code: 'JPY',
        nameEn: 'Japanese Yen',
        nameCn: '日元',
        symbol: '¥',
        currencyDecimals: 0,
        exchangeRateDecimals: 8,
        roundingRule: 'round_up',
        status: 'enabled'
      },
      {
        id: '5',
        code: 'GBP',
        nameEn: 'British Pound',
        nameCn: '英镑',
        symbol: '£',
        currencyDecimals: 2,
        exchangeRateDecimals: 6,
        roundingRule: 'round_down',
        status: 'disabled'
      }
    ];

    setCurrencyData(mockData);
    setFilteredData(mockData);
  }, []);

  // 搜索筛选功能
  const handleSearch = () => {
    let filtered = currencyData;

    // 关键词搜索
    if (searchParams.keyword) {
      filtered = filtered.filter(currency => 
        currency.code.toLowerCase().includes(searchParams.keyword.toLowerCase()) ||
        currency.nameEn.toLowerCase().includes(searchParams.keyword.toLowerCase()) ||
        currency.nameCn.includes(searchParams.keyword) ||
        currency.symbol.includes(searchParams.keyword)
      );
    }

    // 状态筛选
    if (searchParams.status) {
      filtered = filtered.filter(currency => currency.status === searchParams.status);
    }

    setFilteredData(filtered);
  };

  // 重置搜索
  const handleReset = () => {
    setSearchParams({
      keyword: '',
      status: ''
    });
    setFilteredData(currencyData);
  };

  // 表格列定义
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
      render: (_: unknown, record: Currency) => (
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
      title: '币种代码',
      dataIndex: 'code',
      width: 120,
    },
    {
      title: '名称（英文）',
      dataIndex: 'nameEn',
      width: 200,
    },
    {
      title: '名称（中文）',
      dataIndex: 'nameCn',
      width: 150,
    },
    {
      title: '符号',
      dataIndex: 'symbol',
      width: 100,
    },
    {
      title: '币种小数位数',
      dataIndex: 'currencyDecimals',
      width: 120,
      render: (decimals: number) => `${decimals}位`,
    },
    {
      title: '汇率小数位数',
      dataIndex: 'exchangeRateDecimals',
      width: 120,
      render: (decimals: number) => `${decimals}位`,
    },
    {
      title: '进位规则',
      dataIndex: 'roundingRule',
      width: 120,
      render: (rule: string) => {
        const ruleMap = {
          'round_up': '进位',
          'round_down': '舍位',
          'round_half': '四舍五入'
        };
        return ruleMap[rule as keyof typeof ruleMap] || rule;
      },
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
      width: 200,
      fixed: 'right' as const,
      render: (_: unknown, record: Currency) => (
        <Space>
          <Button
            type="text"
            size="small"
            icon={<IconEye />}
            onClick={() => handleDetail(record)}
          >
            详情
          </Button>
          <Button
            type="text"
            size="small"
            icon={<IconEdit />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title={`确定要${record.status === 'enabled' ? '禁用' : '启用'}此币种吗？`}
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
    },
  ];

  // 处理详情
  const handleDetail = (record: Currency) => {
    setCurrentCurrency(record);
    setDetailModalVisible(true);
  };

  // 处理编辑
  const handleEdit = (record: Currency) => {
    setCurrentCurrency(record);
    setIsEditing(true);
    editForm.setFieldsValue({
      code: record.code,
      nameEn: record.nameEn,
      nameCn: record.nameCn,
      symbol: record.symbol,
      currencyDecimals: record.currencyDecimals,
      exchangeRateDecimals: record.exchangeRateDecimals,
      roundingRule: record.roundingRule
    });
    setEditModalVisible(true);
  };

  // 处理新增
  const handleAdd = () => {
    setCurrentCurrency(null);
    setIsEditing(false);
    editForm.resetFields();
    setEditModalVisible(true);
  };

  // 处理状态切换
  const handleToggleStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'enabled' ? 'disabled' : 'enabled';
    setCurrencyData(prev => prev.map(currency => 
      currency.id === id ? { ...currency, status: newStatus } : currency
    ));
    setFilteredData(prev => prev.map(currency => 
      currency.id === id ? { ...currency, status: newStatus } : currency
    ));
    Message.success(`币种已${newStatus === 'enabled' ? '启用' : '禁用'}`);
  };

  // 批量启用
  const handleBatchEnable = () => {
    if (selectedRowKeys.length === 0) {
      Message.warning('请选择要启用的币种');
      return;
    }
    
    setCurrencyData(prev => prev.map(currency => 
      selectedRowKeys.includes(currency.id) ? { ...currency, status: 'enabled' } : currency
    ));
    setFilteredData(prev => prev.map(currency => 
      selectedRowKeys.includes(currency.id) ? { ...currency, status: 'enabled' } : currency
    ));
    
    setSelectedRowKeys([]);
    Message.success(`已启用 ${selectedRowKeys.length} 个币种`);
  };

  // 批量禁用
  const handleBatchDisable = () => {
    if (selectedRowKeys.length === 0) {
      Message.warning('请选择要禁用的币种');
      return;
    }
    
    setCurrencyData(prev => prev.map(currency => 
      selectedRowKeys.includes(currency.id) ? { ...currency, status: 'disabled' } : currency
    ));
    setFilteredData(prev => prev.map(currency => 
      selectedRowKeys.includes(currency.id) ? { ...currency, status: 'disabled' } : currency
    ));
    
    setSelectedRowKeys([]);
    Message.success(`已禁用 ${selectedRowKeys.length} 个币种`);
  };

  // 保存币种编辑
  const handleSaveCurrency = async () => {
    try {
      const values = await editForm.validate();
      
      const currencyItem = {
        ...values,
        id: isEditing ? currentCurrency?.id : Date.now().toString(),
        currencyDecimals: parseInt(values.currencyDecimals) || 2,
        exchangeRateDecimals: parseInt(values.exchangeRateDecimals) || 6,
        roundingRule: values.roundingRule || 'round_half',
        status: isEditing ? currentCurrency?.status : 'enabled' as const
      };

      if (isEditing) {
        // 更新现有币种
        setCurrencyData(prev => prev.map(currency => 
          currency.id === currentCurrency?.id ? { ...currency, ...currencyItem } : currency
        ));
        setFilteredData(prev => prev.map(currency => 
          currency.id === currentCurrency?.id ? { ...currency, ...currencyItem } : currency
        ));
        Message.success('币种信息已更新');
      } else {
        // 新增币种
        const newCurrency = { ...currencyItem, id: Date.now().toString() };
        setCurrencyData(prev => [...prev, newCurrency]);
        setFilteredData(prev => [...prev, newCurrency]);
        Message.success('币种已添加');
      }

      setEditModalVisible(false);
      editForm.resetFields();
    } catch (error) {
      console.error('保存失败:', error);
    }
  };

  return (
    <Card>
      <div style={{ marginBottom: '20px' }}>
        <Title heading={4} style={{ margin: 0 }}>币种管理</Title>
      </div>

      {/* 搜索筛选区域 */}
      <Card style={{ marginBottom: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '16px', alignItems: 'flex-end' }}>
          <div>
            <div style={{ marginBottom: '4px', fontSize: '14px', color: '#666' }}>关键词搜索</div>
            <Input
              placeholder="币种代码、名称、符号"
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
              新增币种
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
        scroll={{ x: 1400 }}
        pagination={{
          pageSize: 10,
          showTotal: true,
          showJumper: true,
          sizeCanChange: true,
        }}
      />

      {/* 详情弹窗 */}
      <Modal
        title="币种详情"
        visible={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={
          <Button onClick={() => setDetailModalVisible(false)}>
            关闭
          </Button>
        }
        style={{ width: 500 }}
      >
        {currentCurrency && (
          <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '12px 16px', alignItems: 'center' }}>
            <span style={{ fontWeight: 500 }}>币种代码：</span>
            <span>{currentCurrency.code}</span>
            
            <span style={{ fontWeight: 500 }}>名称（英文）：</span>
            <span>{currentCurrency.nameEn}</span>
            
            <span style={{ fontWeight: 500 }}>名称（中文）：</span>
            <span>{currentCurrency.nameCn}</span>
            
            <span style={{ fontWeight: 500 }}>符号：</span>
            <span>{currentCurrency.symbol}</span>
            
            <span style={{ fontWeight: 500 }}>币种小数位数：</span>
            <span>{currentCurrency.currencyDecimals}位</span>
            
            <span style={{ fontWeight: 500 }}>汇率小数位数：</span>
            <span>{currentCurrency.exchangeRateDecimals}位</span>
            
            <span style={{ fontWeight: 500 }}>进位规则：</span>
            <span>
              {currentCurrency.roundingRule === 'round_up' && '进位'}
              {currentCurrency.roundingRule === 'round_down' && '舍位'}
              {currentCurrency.roundingRule === 'round_half' && '四舍五入'}
            </span>
            
            <span style={{ fontWeight: 500 }}>状态：</span>
            <Tag color={currentCurrency.status === 'enabled' ? 'green' : 'red'}>
              {currentCurrency.status === 'enabled' ? '启用' : '禁用'}
            </Tag>
          </div>
        )}
      </Modal>

      {/* 新增/编辑币种弹窗 */}
      <Modal
        title={isEditing ? '编辑币种' : '新增币种'}
        visible={editModalVisible}
        onOk={handleSaveCurrency}
        onCancel={() => setEditModalVisible(false)}
        style={{ width: 600 }}
      >
        <Form form={editForm} layout="vertical">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Form.Item
              field="code"
              label="币种代码"
              rules={[
                { required: true, message: '请输入币种代码' },
                { 
                  validator: (value, callback) => {
                    if (value && !/^[A-Z]{3}$/.test(value)) {
                      callback('币种代码必须为3位大写字母');
                    } else {
                      callback();
                    }
                  }
                }
              ]}
            >
              <Input placeholder="请输入3位代码，如：USD" maxLength={3} style={{ textTransform: 'uppercase' }} />
            </Form.Item>
            
            <Form.Item
              field="symbol"
              label="符号"
              rules={[{ required: true, message: '请输入符号' }]}
            >
              <Input placeholder="请输入符号，如：$" />
            </Form.Item>
            
            <Form.Item
              field="nameEn"
              label="名称（英文）"
              rules={[{ required: true, message: '请输入英文名称' }]}
            >
              <Input placeholder="请输入英文名称，如：US Dollar" />
            </Form.Item>
            
            <Form.Item
              field="nameCn"
              label="名称（中文）"
              rules={[{ required: true, message: '请输入中文名称' }]}
            >
              <Input placeholder="请输入中文名称，如：美元" />
            </Form.Item>
            
            <Form.Item
              field="currencyDecimals"
              label="币种小数位数"
              rules={[{ required: true, message: '请选择币种小数位数' }]}
              initialValue={2}
            >
              <Select placeholder="请选择币种小数位数">
                <Option value={0}>0位</Option>
                <Option value={1}>1位</Option>
                <Option value={2}>2位</Option>
              </Select>
            </Form.Item>
            
            <Form.Item
              field="exchangeRateDecimals"
              label="汇率小数位数"
              rules={[{ required: true, message: '请选择汇率小数位数' }]}
              initialValue={6}
            >
              <Select placeholder="请选择汇率小数位数">
                <Option value={2}>2位</Option>
                <Option value={3}>3位</Option>
                <Option value={4}>4位</Option>
                <Option value={5}>5位</Option>
                <Option value={6}>6位</Option>
                <Option value={7}>7位</Option>
                <Option value={8}>8位</Option>
              </Select>
            </Form.Item>
            
            <Form.Item
              field="roundingRule"
              label="进位规则"
              rules={[{ required: true, message: '请选择进位规则' }]}
              initialValue="round_half"
            >
              <Select placeholder="请选择进位规则">
                <Option value="round_up">进位</Option>
                <Option value="round_down">舍位</Option>
                <Option value="round_half">四舍五入</Option>
              </Select>
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </Card>
  );
};

export default CurrencyManagement; 