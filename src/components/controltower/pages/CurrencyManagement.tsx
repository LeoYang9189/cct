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

// 币种数据库
const CURRENCY_DATABASE: Currency[] = [
  // 主要货币
  { id: 'cur_1', code: 'USD', nameEn: 'United States Dollar', nameCn: '美元', symbol: '$', currencyDecimals: 2, exchangeRateDecimals: 6, roundingRule: 'round_half', status: 'enabled' },
  { id: 'cur_2', code: 'EUR', nameEn: 'Euro', nameCn: '欧元', symbol: '€', currencyDecimals: 2, exchangeRateDecimals: 6, roundingRule: 'round_half', status: 'enabled' },
  { id: 'cur_3', code: 'CNY', nameEn: 'Chinese Yuan', nameCn: '人民币', symbol: '¥', currencyDecimals: 2, exchangeRateDecimals: 6, roundingRule: 'round_half', status: 'enabled' },
  { id: 'cur_4', code: 'JPY', nameEn: 'Japanese Yen', nameCn: '日元', symbol: '¥', currencyDecimals: 0, exchangeRateDecimals: 8, roundingRule: 'round_up', status: 'enabled' },
  { id: 'cur_5', code: 'GBP', nameEn: 'British Pound', nameCn: '英镑', symbol: '£', currencyDecimals: 2, exchangeRateDecimals: 6, roundingRule: 'round_half', status: 'enabled' },
  
  // 亚洲货币
  { id: 'cur_6', code: 'HKD', nameEn: 'Hong Kong Dollar', nameCn: '港币', symbol: 'HK$', currencyDecimals: 2, exchangeRateDecimals: 6, roundingRule: 'round_half', status: 'enabled' },
  { id: 'cur_7', code: 'KRW', nameEn: 'South Korean Won', nameCn: '韩元', symbol: '₩', currencyDecimals: 0, exchangeRateDecimals: 8, roundingRule: 'round_down', status: 'enabled' },
  { id: 'cur_8', code: 'SGD', nameEn: 'Singapore Dollar', nameCn: '新加坡元', symbol: 'S$', currencyDecimals: 2, exchangeRateDecimals: 6, roundingRule: 'round_half', status: 'enabled' },
  { id: 'cur_9', code: 'TWD', nameEn: 'Taiwan Dollar', nameCn: '新台币', symbol: 'NT$', currencyDecimals: 0, exchangeRateDecimals: 6, roundingRule: 'round_half', status: 'enabled' },
  { id: 'cur_10', code: 'THB', nameEn: 'Thai Baht', nameCn: '泰铢', symbol: '฿', currencyDecimals: 2, exchangeRateDecimals: 6, roundingRule: 'round_half', status: 'enabled' },
  { id: 'cur_11', code: 'MYR', nameEn: 'Malaysian Ringgit', nameCn: '马来西亚林吉特', symbol: 'RM', currencyDecimals: 2, exchangeRateDecimals: 6, roundingRule: 'round_half', status: 'enabled' },
  { id: 'cur_12', code: 'INR', nameEn: 'Indian Rupee', nameCn: '印度卢比', symbol: '₹', currencyDecimals: 2, exchangeRateDecimals: 6, roundingRule: 'round_half', status: 'enabled' },
  { id: 'cur_13', code: 'IDR', nameEn: 'Indonesian Rupiah', nameCn: '印尼盾', symbol: 'Rp', currencyDecimals: 0, exchangeRateDecimals: 8, roundingRule: 'round_up', status: 'enabled' },
  { id: 'cur_14', code: 'PHP', nameEn: 'Philippine Peso', nameCn: '菲律宾比索', symbol: '₱', currencyDecimals: 2, exchangeRateDecimals: 6, roundingRule: 'round_half', status: 'enabled' },
  { id: 'cur_15', code: 'VND', nameEn: 'Vietnamese Dong', nameCn: '越南盾', symbol: '₫', currencyDecimals: 0, exchangeRateDecimals: 8, roundingRule: 'round_up', status: 'enabled' },
  
  // 欧洲货币
  { id: 'cur_16', code: 'CHF', nameEn: 'Swiss Franc', nameCn: '瑞士法郎', symbol: 'CHF', currencyDecimals: 2, exchangeRateDecimals: 6, roundingRule: 'round_half', status: 'enabled' },
  { id: 'cur_17', code: 'SEK', nameEn: 'Swedish Krona', nameCn: '瑞典克朗', symbol: 'kr', currencyDecimals: 2, exchangeRateDecimals: 6, roundingRule: 'round_half', status: 'enabled' },
  { id: 'cur_18', code: 'NOK', nameEn: 'Norwegian Krone', nameCn: '挪威克朗', symbol: 'kr', currencyDecimals: 2, exchangeRateDecimals: 6, roundingRule: 'round_half', status: 'enabled' },
  { id: 'cur_19', code: 'DKK', nameEn: 'Danish Krone', nameCn: '丹麦克朗', symbol: 'kr', currencyDecimals: 2, exchangeRateDecimals: 6, roundingRule: 'round_half', status: 'enabled' },
  { id: 'cur_20', code: 'PLN', nameEn: 'Polish Zloty', nameCn: '波兰兹罗提', symbol: 'zł', currencyDecimals: 2, exchangeRateDecimals: 6, roundingRule: 'round_half', status: 'enabled' },
  { id: 'cur_21', code: 'RUB', nameEn: 'Russian Ruble', nameCn: '俄罗斯卢布', symbol: '₽', currencyDecimals: 2, exchangeRateDecimals: 6, roundingRule: 'round_half', status: 'enabled' },
  { id: 'cur_22', code: 'TRY', nameEn: 'Turkish Lira', nameCn: '土耳其里拉', symbol: '₺', currencyDecimals: 2, exchangeRateDecimals: 6, roundingRule: 'round_half', status: 'enabled' },
  
  // 美洲货币
  { id: 'cur_23', code: 'CAD', nameEn: 'Canadian Dollar', nameCn: '加拿大元', symbol: 'C$', currencyDecimals: 2, exchangeRateDecimals: 6, roundingRule: 'round_half', status: 'enabled' },
  { id: 'cur_24', code: 'MXN', nameEn: 'Mexican Peso', nameCn: '墨西哥比索', symbol: 'Mex$', currencyDecimals: 2, exchangeRateDecimals: 6, roundingRule: 'round_half', status: 'enabled' },
  { id: 'cur_25', code: 'BRL', nameEn: 'Brazilian Real', nameCn: '巴西雷亚尔', symbol: 'R$', currencyDecimals: 2, exchangeRateDecimals: 6, roundingRule: 'round_half', status: 'enabled' },
  { id: 'cur_26', code: 'ARS', nameEn: 'Argentine Peso', nameCn: '阿根廷比索', symbol: '$', currencyDecimals: 2, exchangeRateDecimals: 6, roundingRule: 'round_half', status: 'enabled' },
  { id: 'cur_27', code: 'CLP', nameEn: 'Chilean Peso', nameCn: '智利比索', symbol: '$', currencyDecimals: 0, exchangeRateDecimals: 8, roundingRule: 'round_up', status: 'enabled' },
  
  // 大洋洲货币
  { id: 'cur_28', code: 'AUD', nameEn: 'Australian Dollar', nameCn: '澳大利亚元', symbol: 'A$', currencyDecimals: 2, exchangeRateDecimals: 6, roundingRule: 'round_half', status: 'enabled' },
  { id: 'cur_29', code: 'NZD', nameEn: 'New Zealand Dollar', nameCn: '新西兰元', symbol: 'NZ$', currencyDecimals: 2, exchangeRateDecimals: 6, roundingRule: 'round_half', status: 'enabled' },
  
  // 非洲和中东货币
  { id: 'cur_30', code: 'ZAR', nameEn: 'South African Rand', nameCn: '南非兰特', symbol: 'R', currencyDecimals: 2, exchangeRateDecimals: 6, roundingRule: 'round_half', status: 'enabled' },
  { id: 'cur_31', code: 'AED', nameEn: 'UAE Dirham', nameCn: '阿联酋迪拉姆', symbol: 'د.إ', currencyDecimals: 2, exchangeRateDecimals: 6, roundingRule: 'round_half', status: 'enabled' },
  { id: 'cur_32', code: 'SAR', nameEn: 'Saudi Riyal', nameCn: '沙特里亚尔', symbol: '﷼', currencyDecimals: 2, exchangeRateDecimals: 6, roundingRule: 'round_half', status: 'enabled' },
  { id: 'cur_33', code: 'ILS', nameEn: 'Israeli Shekel', nameCn: '以色列谢克尔', symbol: '₪', currencyDecimals: 2, exchangeRateDecimals: 6, roundingRule: 'round_half', status: 'enabled' }
];

// 添加全局样式，强制表头不换行
const tableHeaderStyle = `
  .arco-table-th {
    white-space: nowrap !important;
  }
`;

const CurrencyManagement: React.FC = () => {
  const [currencyData, setCurrencyData] = useState<Currency[]>([]);
  const [filteredData, setFilteredData] = useState<Currency[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [selectModalVisible, setSelectModalVisible] = useState(false);
  const [selectableCurrencies, setSelectableCurrencies] = useState<Currency[]>([]);
  const [selectedCurrencies, setSelectedCurrencies] = useState<string[]>([]);
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

  // 处理新增（改为选择模式）
  const handleAdd = () => {
    // 获取已存在的币种代码列表
    const existingCodes = currencyData.map(item => item.code);
    
    // 过滤出未添加的币种
    const available = CURRENCY_DATABASE.filter(currency => 
      !existingCodes.includes(currency.code)
    );
    
    setSelectableCurrencies(available);
    setSelectedCurrencies([]);
    setSelectSearchParams({ keyword: '', status: '' });
    setSelectModalVisible(true);
  };

  // 处理选择币种
  const handleSelectCurrencies = () => {
    if (selectedCurrencies.length === 0) {
      Message.warning('请选择至少一种币种');
      return;
    }

    const newCurrencies = CURRENCY_DATABASE
      .filter(currency => selectedCurrencies.includes(currency.id))
      .map(currency => ({
        ...currency,
        id: Date.now().toString() + '_' + currency.id,
        status: 'enabled' as const
      }));

    setCurrencyData(prev => [...prev, ...newCurrencies]);
    setFilteredData([...currencyData, ...newCurrencies]);
    
    setSelectModalVisible(false);
    Message.success(`已添加 ${newCurrencies.length} 种币种`);
  };

  // 筛选可选择的币种
  const filterSelectableCurrencies = () => {
    let filtered = [...selectableCurrencies];
    
    if (selectSearchParams.keyword) {
      filtered = filtered.filter(item => 
        item.code.toLowerCase().includes(selectSearchParams.keyword.toLowerCase()) ||
        item.nameEn.toLowerCase().includes(selectSearchParams.keyword.toLowerCase()) ||
        item.nameCn.includes(selectSearchParams.keyword) ||
        item.symbol.includes(selectSearchParams.keyword)
      );
    }

    return filtered;
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
      sorter: (a: Currency, b: Currency) => a.code.localeCompare(b.code),
      headerStyle: { whiteSpace: 'nowrap' }
    },
    {
      title: '名称（英文）',
      dataIndex: 'nameEn',
      width: 200,
      sorter: (a: Currency, b: Currency) => a.nameEn.localeCompare(b.nameEn),
      headerStyle: { whiteSpace: 'nowrap' }
    },
    {
      title: '名称（中文）',
      dataIndex: 'nameCn',
      width: 150,
      sorter: (a: Currency, b: Currency) => a.nameCn.localeCompare(b.nameCn, 'zh-CN'),
      headerStyle: { whiteSpace: 'nowrap' }
    },
    {
      title: '符号',
      dataIndex: 'symbol',
      width: 80,
      sorter: (a: Currency, b: Currency) => a.symbol.localeCompare(b.symbol),
      headerStyle: { whiteSpace: 'nowrap' }
    },
    {
      title: '币种小数位数',
      dataIndex: 'currencyDecimals',
      width: 120,
      sorter: (a: Currency, b: Currency) => a.currencyDecimals - b.currencyDecimals,
      headerStyle: { whiteSpace: 'nowrap' },
      render: (decimals: number) => `${decimals}位`,
    },
    {
      title: '汇率小数位数',
      dataIndex: 'exchangeRateDecimals',
      width: 120,
      sorter: (a: Currency, b: Currency) => a.exchangeRateDecimals - b.exchangeRateDecimals,
      headerStyle: { whiteSpace: 'nowrap' },
      render: (decimals: number) => `${decimals}位`,
    },
    {
      title: '进位规则',
      dataIndex: 'roundingRule',
      width: 120,
      sorter: (a: Currency, b: Currency) => a.roundingRule.localeCompare(b.roundingRule),
      headerStyle: { whiteSpace: 'nowrap' },
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
      sorter: (a: Currency, b: Currency) => a.status.localeCompare(b.status),
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
      width: 120,
      fixed: 'right' as const,
      headerStyle: { whiteSpace: 'nowrap' },
      render: (_: unknown, record: Currency) => (
        <Space>
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

  // 选择弹窗的表格列配置
  const selectColumns = [
    {
      title: (
        <Checkbox
          indeterminate={selectedCurrencies.length > 0 && selectedCurrencies.length < filterSelectableCurrencies().length}
          checked={selectedCurrencies.length === filterSelectableCurrencies().length && filterSelectableCurrencies().length > 0}
          onChange={(checked) => {
            if (checked) {
              setSelectedCurrencies(filterSelectableCurrencies().map(item => item.id));
            } else {
              setSelectedCurrencies([]);
            }
          }}
        />
      ),
      dataIndex: 'checkbox',
      width: 60,
      render: (_: unknown, record: Currency) => (
        <Checkbox
          checked={selectedCurrencies.includes(record.id)}
          onChange={(checked) => {
            if (checked) {
              setSelectedCurrencies([...selectedCurrencies, record.id]);
            } else {
              setSelectedCurrencies(selectedCurrencies.filter(id => id !== record.id));
            }
          }}
        />
      ),
    },
    {
      title: '币种代码',
      dataIndex: 'code',
      width: 100,
      sorter: (a: Currency, b: Currency) => a.code.localeCompare(b.code),
      headerStyle: { whiteSpace: 'nowrap' }
    },
    {
      title: '名称（英文）',
      dataIndex: 'nameEn',
      width: 180,
      sorter: (a: Currency, b: Currency) => a.nameEn.localeCompare(b.nameEn),
      headerStyle: { whiteSpace: 'nowrap' }
    },
    {
      title: '名称（中文）',
      dataIndex: 'nameCn',
      width: 120,
      sorter: (a: Currency, b: Currency) => a.nameCn.localeCompare(b.nameCn, 'zh-CN'),
      headerStyle: { whiteSpace: 'nowrap' }
    },
    {
      title: '符号',
      dataIndex: 'symbol',
      width: 80,
      sorter: (a: Currency, b: Currency) => a.symbol.localeCompare(b.symbol),
      headerStyle: { whiteSpace: 'nowrap' }
    }
  ];

  return (
    <>
      <style>{tableHeaderStyle}</style>
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
          scroll={{ x: 1250 }}
          pagination={{
            pageSize: 10,
            showTotal: true,
            showJumper: true,
            sizeCanChange: true,
          }}
        />

        {/* 选择币种弹窗 */}
        <Modal
          title="选择币种"
          visible={selectModalVisible}
          onOk={handleSelectCurrencies}
          onCancel={() => setSelectModalVisible(false)}
          style={{ width: 700 }}
          okText="确定"
          cancelText="取消"
        >
          {/* 搜索筛选区域 */}
          <Card style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end' }}>
              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: '4px', fontSize: '14px', color: '#666' }}>关键词搜索</div>
                <Input
                  placeholder="币种代码、名称、符号"
                  value={selectSearchParams.keyword}
                  onChange={(value) => setSelectSearchParams(prev => ({ ...prev, keyword: value }))}
                />
              </div>
            </div>
          </Card>

          <Table
            columns={selectColumns}
            data={filterSelectableCurrencies()}
            rowKey="id"
            scroll={{ x: 540 }}
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

export default CurrencyManagement; 