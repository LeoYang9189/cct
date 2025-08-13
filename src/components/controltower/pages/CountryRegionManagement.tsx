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

// 国家（地区）数据接口
interface CountryRegion {
  id: string;
  nameEn: string;
  nameCn: string;
  code: string;
  continent: string;
  areaCode: string;
  status: 'enabled' | 'disabled';
}

// 大洲选项
const continentOptions = [
  { value: 'Asia', label: '亚洲' },
  { value: 'Europe', label: '欧洲' },
  { value: 'North America', label: '北美洲' },
  { value: 'South America', label: '南美洲' },
  { value: 'Africa', label: '非洲' },
  { value: 'Oceania', label: '大洋洲' },
  { value: 'Antarctica', label: '南极洲' }
];

// 搜索筛选参数
interface SearchParams {
  keyword: string;
  continent: string;
  status: string;
}

const CountryRegionManagement: React.FC = () => {
  const [countryData, setCountryData] = useState<CountryRegion[]>([]);
  const [filteredData, setFilteredData] = useState<CountryRegion[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [addCountryModalVisible, setAddCountryModalVisible] = useState(false);
  const [countryLibraryData, setCountryLibraryData] = useState<CountryRegion[]>([]);
  const [filteredCountryLibrary, setFilteredCountryLibrary] = useState<CountryRegion[]>([]);
  const [selectedCountryIds, setSelectedCountryIds] = useState<string[]>([]);
  const [addSearchParams, setAddSearchParams] = useState({
    keyword: '',
    continent: ''
  });
  const [searchParams, setSearchParams] = useState<SearchParams>({
    keyword: '',
    continent: '',
    status: ''
  });

  // 初始化示例数据
  useEffect(() => {
    const mockData: CountryRegion[] = [
      {
        id: '1',
        nameEn: 'China',
        nameCn: '中国',
        code: 'CN',
        continent: 'Asia',
        areaCode: '+86',
        status: 'enabled' as const
      },
      {
        id: '2',
        nameEn: 'United States',
        nameCn: '美国',
        code: 'US',
        continent: 'North America',
        areaCode: '+1',
        status: 'enabled' as const
      },
      {
        id: '3',
        nameEn: 'United Kingdom',
        nameCn: '英国',
        code: 'GB',
        continent: 'Europe',
        areaCode: '+44',
        status: 'enabled' as const
      },
      {
        id: '4',
        nameEn: 'Germany',
        nameCn: '德国',
        code: 'DE',
        continent: 'Europe',
        areaCode: '+49',
        status: 'disabled' as const
      },
      {
        id: '5',
        nameEn: 'Japan',
        nameCn: '日本',
        code: 'JP',
        continent: 'Asia',
        areaCode: '+81',
        status: 'enabled' as const
      }
    ];

    setCountryData(mockData);
    setFilteredData(mockData);

    // 创建国家库数据
    const countryLibraryMockData: CountryRegion[] = [
      // 亚洲国家
      { id: 'lib1', nameEn: 'South Korea', nameCn: '韩国', code: 'KR', continent: 'Asia', areaCode: '+82', status: 'enabled' },
      { id: 'lib2', nameEn: 'Singapore', nameCn: '新加坡', code: 'SG', continent: 'Asia', areaCode: '+65', status: 'enabled' },
      { id: 'lib3', nameEn: 'Thailand', nameCn: '泰国', code: 'TH', continent: 'Asia', areaCode: '+66', status: 'enabled' },
      { id: 'lib4', nameEn: 'Malaysia', nameCn: '马来西亚', code: 'MY', continent: 'Asia', areaCode: '+60', status: 'enabled' },
      { id: 'lib5', nameEn: 'India', nameCn: '印度', code: 'IN', continent: 'Asia', areaCode: '+91', status: 'enabled' },
      { id: 'lib6', nameEn: 'Indonesia', nameCn: '印度尼西亚', code: 'ID', continent: 'Asia', areaCode: '+62', status: 'enabled' },
      { id: 'lib7', nameEn: 'Philippines', nameCn: '菲律宾', code: 'PH', continent: 'Asia', areaCode: '+63', status: 'enabled' },
      { id: 'lib8', nameEn: 'Vietnam', nameCn: '越南', code: 'VN', continent: 'Asia', areaCode: '+84', status: 'enabled' },

      // 欧洲国家
      { id: 'lib9', nameEn: 'France', nameCn: '法国', code: 'FR', continent: 'Europe', areaCode: '+33', status: 'enabled' },
      { id: 'lib10', nameEn: 'Italy', nameCn: '意大利', code: 'IT', continent: 'Europe', areaCode: '+39', status: 'enabled' },
      { id: 'lib11', nameEn: 'Spain', nameCn: '西班牙', code: 'ES', continent: 'Europe', areaCode: '+34', status: 'enabled' },
      { id: 'lib12', nameEn: 'Netherlands', nameCn: '荷兰', code: 'NL', continent: 'Europe', areaCode: '+31', status: 'enabled' },
      { id: 'lib13', nameEn: 'Belgium', nameCn: '比利时', code: 'BE', continent: 'Europe', areaCode: '+32', status: 'enabled' },
      { id: 'lib14', nameEn: 'Sweden', nameCn: '瑞典', code: 'SE', continent: 'Europe', areaCode: '+46', status: 'enabled' },
      { id: 'lib15', nameEn: 'Norway', nameCn: '挪威', code: 'NO', continent: 'Europe', areaCode: '+47', status: 'enabled' },
      { id: 'lib16', nameEn: 'Denmark', nameCn: '丹麦', code: 'DK', continent: 'Europe', areaCode: '+45', status: 'enabled' },

      // 北美洲国家
      { id: 'lib17', nameEn: 'Canada', nameCn: '加拿大', code: 'CA', continent: 'North America', areaCode: '+1', status: 'enabled' },
      { id: 'lib18', nameEn: 'Mexico', nameCn: '墨西哥', code: 'MX', continent: 'North America', areaCode: '+52', status: 'enabled' },

      // 南美洲国家
      { id: 'lib19', nameEn: 'Brazil', nameCn: '巴西', code: 'BR', continent: 'South America', areaCode: '+55', status: 'enabled' },
      { id: 'lib20', nameEn: 'Argentina', nameCn: '阿根廷', code: 'AR', continent: 'South America', areaCode: '+54', status: 'enabled' },
      { id: 'lib21', nameEn: 'Chile', nameCn: '智利', code: 'CL', continent: 'South America', areaCode: '+56', status: 'enabled' },

      // 非洲国家
      { id: 'lib22', nameEn: 'South Africa', nameCn: '南非', code: 'ZA', continent: 'Africa', areaCode: '+27', status: 'enabled' },
      { id: 'lib23', nameEn: 'Egypt', nameCn: '埃及', code: 'EG', continent: 'Africa', areaCode: '+20', status: 'enabled' },
      { id: 'lib24', nameEn: 'Nigeria', nameCn: '尼日利亚', code: 'NG', continent: 'Africa', areaCode: '+234', status: 'enabled' },

      // 大洋洲国家
      { id: 'lib25', nameEn: 'Australia', nameCn: '澳大利亚', code: 'AU', continent: 'Oceania', areaCode: '+61', status: 'enabled' },
      { id: 'lib26', nameEn: 'New Zealand', nameCn: '新西兰', code: 'NZ', continent: 'Oceania', areaCode: '+64', status: 'enabled' }
    ];

    setCountryLibraryData(countryLibraryMockData);
    setFilteredCountryLibrary(countryLibraryMockData);
  }, []);

  // 搜索筛选功能
  const handleSearch = () => {
    let filtered = countryData;

    // 关键词搜索
    if (searchParams.keyword) {
      filtered = filtered.filter(country => 
        country.nameEn.toLowerCase().includes(searchParams.keyword.toLowerCase()) ||
        country.nameCn.includes(searchParams.keyword) ||
        country.code.toLowerCase().includes(searchParams.keyword.toLowerCase())
      );
    }

    // 大洲筛选
    if (searchParams.continent) {
      filtered = filtered.filter(country => country.continent === searchParams.continent);
    }

    // 状态筛选
    if (searchParams.status) {
      filtered = filtered.filter(country => country.status === searchParams.status);
    }

    setFilteredData(filtered);
  };

  // 重置搜索
  const handleReset = () => {
    setSearchParams({
      keyword: '',
      continent: '',
      status: ''
    });
    setFilteredData(countryData);
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
      headerStyle: { whiteSpace: 'nowrap' },
      render: (_: unknown, record: CountryRegion) => (
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
      title: '英文名',
      dataIndex: 'nameEn',
      width: 200,
      sorter: (a: CountryRegion, b: CountryRegion) => a.nameEn.localeCompare(b.nameEn),
      headerStyle: { whiteSpace: 'nowrap' },
    },
    {
      title: '中文名',
      dataIndex: 'nameCn',
      width: 150,
      sorter: (a: CountryRegion, b: CountryRegion) => a.nameCn.localeCompare(b.nameCn),
      headerStyle: { whiteSpace: 'nowrap' },
    },
    {
      title: '代码',
      dataIndex: 'code',
      width: 100,
      sorter: (a: CountryRegion, b: CountryRegion) => a.code.localeCompare(b.code),
      headerStyle: { whiteSpace: 'nowrap' },
    },
    {
      title: '大洲',
      dataIndex: 'continent',
      width: 120,
      sorter: (a: CountryRegion, b: CountryRegion) => {
        const continentA = continentOptions.find(option => option.value === a.continent)?.label || a.continent;
        const continentB = continentOptions.find(option => option.value === b.continent)?.label || b.continent;
        return continentA.localeCompare(continentB);
      },
      headerStyle: { whiteSpace: 'nowrap' },
      render: (continent: string) => {
        const continentOption = continentOptions.find(option => option.value === continent);
        return continentOption ? continentOption.label : continent;
      }
    },
    {
      title: '区号',
      dataIndex: 'areaCode',
      width: 100,
      sorter: (a: CountryRegion, b: CountryRegion) => a.areaCode.localeCompare(b.areaCode),
      headerStyle: { whiteSpace: 'nowrap' },
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      sorter: (a: CountryRegion, b: CountryRegion) => a.status.localeCompare(b.status),
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
      render: (_: unknown, record: CountryRegion) => (
        <Popconfirm
          title={`确定要${record.status === 'enabled' ? '禁用' : '启用'}此国家（地区）吗？`}
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
    },
  ];

  // 国家库搜索列定义
  const countryLibraryColumns = [
    {
      title: (
        <Checkbox
          indeterminate={selectedCountryIds.length > 0 && selectedCountryIds.length < filteredCountryLibrary.length}
          checked={selectedCountryIds.length === filteredCountryLibrary.length && filteredCountryLibrary.length > 0}
          onChange={(checked) => {
            if (checked) {
              setSelectedCountryIds(filteredCountryLibrary.map(item => item.id));
            } else {
              setSelectedCountryIds([]);
            }
          }}
        />
      ),
      dataIndex: 'checkbox',
      width: 60,
      headerStyle: { whiteSpace: 'nowrap' },
      render: (_: unknown, record: CountryRegion) => (
        <Checkbox
          checked={selectedCountryIds.includes(record.id)}
          onChange={(checked) => {
            if (checked) {
              setSelectedCountryIds([...selectedCountryIds, record.id]);
            } else {
              setSelectedCountryIds(selectedCountryIds.filter(id => id !== record.id));
            }
          }}
        />
      ),
    },
    {
      title: '英文名',
      dataIndex: 'nameEn',
      width: 200,
      headerStyle: { whiteSpace: 'nowrap' },
    },
    {
      title: '中文名',
      dataIndex: 'nameCn',
      width: 150,
      headerStyle: { whiteSpace: 'nowrap' },
    },
    {
      title: '代码',
      dataIndex: 'code',
      width: 100,
      headerStyle: { whiteSpace: 'nowrap' },
    },
    {
      title: '大洲',
      dataIndex: 'continent',
      width: 120,
      headerStyle: { whiteSpace: 'nowrap' },
      render: (continent: string) => {
        const continentOption = continentOptions.find(option => option.value === continent);
        return continentOption ? continentOption.label : continent;
      }
    },
    {
      title: '区号',
      dataIndex: 'areaCode',
      width: 100,
      headerStyle: { whiteSpace: 'nowrap' },
    }
  ];

  // 处理新增（改为选择模式）
  const handleAdd = () => {
    setSelectedCountryIds([]);
    setAddSearchParams({ keyword: '', continent: '' });
    // 过滤掉已经存在的国家
    const availableCountries = countryLibraryData.filter(country => 
      !countryData.some(existingCountry => existingCountry.code === country.code)
    );
    setFilteredCountryLibrary(availableCountries);
    setAddCountryModalVisible(true);
  };

  // 处理状态切换
  const handleToggleStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'enabled' ? 'disabled' : 'enabled';
    setCountryData(prev => prev.map(country => 
      country.id === id ? { ...country, status: newStatus } : country
    ));
    setFilteredData(prev => prev.map(country => 
      country.id === id ? { ...country, status: newStatus } : country
    ));
    Message.success(`国家（地区）已${newStatus === 'enabled' ? '启用' : '禁用'}`);
  };

  // 批量启用
  const handleBatchEnable = () => {
    if (selectedRowKeys.length === 0) {
      Message.warning('请选择要启用的国家（地区）');
      return;
    }
    
    setCountryData(prev => prev.map(country => 
      selectedRowKeys.includes(country.id) ? { ...country, status: 'enabled' } : country
    ));
    setFilteredData(prev => prev.map(country => 
      selectedRowKeys.includes(country.id) ? { ...country, status: 'enabled' } : country
    ));
    
    setSelectedRowKeys([]);
    Message.success(`已启用 ${selectedRowKeys.length} 个国家（地区）`);
  };

  // 批量禁用
  const handleBatchDisable = () => {
    if (selectedRowKeys.length === 0) {
      Message.warning('请选择要禁用的国家（地区）');
      return;
    }
    
    setCountryData(prev => prev.map(country => 
      selectedRowKeys.includes(country.id) ? { ...country, status: 'disabled' } : country
    ));
    setFilteredData(prev => prev.map(country => 
      selectedRowKeys.includes(country.id) ? { ...country, status: 'disabled' } : country
    ));
    
    setSelectedRowKeys([]);
    Message.success(`已禁用 ${selectedRowKeys.length} 个国家（地区）`);
  };

  // 国家库搜索功能
  const handleCountryLibrarySearch = () => {
    let filtered = countryLibraryData.filter(country => 
      !countryData.some(existingCountry => existingCountry.code === country.code)
    );

    // 关键词搜索
    if (addSearchParams.keyword) {
      filtered = filtered.filter(country => 
        country.nameEn.toLowerCase().includes(addSearchParams.keyword.toLowerCase()) ||
        country.nameCn.includes(addSearchParams.keyword) ||
        country.code.toLowerCase().includes(addSearchParams.keyword.toLowerCase())
      );
    }

    // 大洲筛选
    if (addSearchParams.continent) {
      filtered = filtered.filter(country => country.continent === addSearchParams.continent);
    }

    setFilteredCountryLibrary(filtered);
  };

  // 重置国家库搜索
  const handleCountryLibraryReset = () => {
    setAddSearchParams({ keyword: '', continent: '' });
    const availableCountries = countryLibraryData.filter(country => 
      !countryData.some(existingCountry => existingCountry.code === country.code)
    );
    setFilteredCountryLibrary(availableCountries);
  };

  // 确认添加选中的国家
  const handleConfirmAddCountries = () => {
    if (selectedCountryIds.length === 0) {
      Message.warning('请选择要添加的国家（地区）');
      return;
    }

    const countriesToAdd = filteredCountryLibrary.filter(country => 
      selectedCountryIds.includes(country.id)
    ).map(country => ({
      ...country,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      status: 'enabled' as const
    }));

    setCountryData(prev => [...prev, ...countriesToAdd]);
    setFilteredData(prev => [...prev, ...countriesToAdd]);
    setAddCountryModalVisible(false);
    setSelectedCountryIds([]);
    Message.success(`成功添加 ${countriesToAdd.length} 个国家（地区）`);
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
        <Title heading={4} style={{ margin: 0 }}>国家（地区）管理</Title>
      </div>

      {/* 搜索筛选区域 */}
      <Card style={{ marginBottom: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '16px', alignItems: 'flex-end' }}>
          <div>
            <div style={{ marginBottom: '4px', fontSize: '14px', color: '#666' }}>关键词搜索</div>
            <Input
              placeholder="国家名称、代码"
              value={searchParams.keyword}
              onChange={(value) => setSearchParams(prev => ({ ...prev, keyword: value }))}
            />
          </div>
          <div>
            <div style={{ marginBottom: '4px', fontSize: '14px', color: '#666' }}>大洲</div>
            <Select
              placeholder="选择大洲"
              value={searchParams.continent}
              onChange={(value) => setSearchParams(prev => ({ ...prev, continent: value }))}
              allowClear
            >
              {continentOptions.map(option => (
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
              新增国家（地区）
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
        scroll={{ x: 1000 }}
        pagination={{
          pageSize: 10,
          showTotal: true,
          showJumper: true,
          sizeCanChange: true,
        }}
      />

      {/* 新增国家选择弹窗 */}
      <Modal
        title="选择国家（地区）"
        visible={addCountryModalVisible}
        onOk={handleConfirmAddCountries}
        onCancel={() => setAddCountryModalVisible(false)}
        style={{ width: 900 }}
        okText={`确认添加 (${selectedCountryIds.length})`}
        okButtonProps={{ disabled: selectedCountryIds.length === 0 }}
      >
        {/* 国家库搜索区域 */}
        <Card style={{ marginBottom: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '16px', alignItems: 'flex-end' }}>
            <div>
              <div style={{ marginBottom: '4px', fontSize: '14px', color: '#666' }}>关键词搜索</div>
              <Input
                placeholder="国家名称、代码"
                value={addSearchParams.keyword}
                onChange={(value) => setAddSearchParams(prev => ({ ...prev, keyword: value }))}
              />
            </div>
            <div>
              <div style={{ marginBottom: '4px', fontSize: '14px', color: '#666' }}>大洲</div>
              <Select
                placeholder="选择大洲"
                value={addSearchParams.continent}
                onChange={(value) => setAddSearchParams(prev => ({ ...prev, continent: value }))}
                allowClear
              >
                {continentOptions.map(option => (
                  <Option key={option.value} value={option.value}>{option.label}</Option>
                ))}
              </Select>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button type="primary" icon={<IconSearch />} onClick={handleCountryLibrarySearch}>
                搜索
              </Button>
              <Button icon={<IconRefresh />} onClick={handleCountryLibraryReset}>
                重置
              </Button>
            </div>
          </div>
        </Card>

        <div style={{ marginBottom: '12px', fontSize: '14px', color: '#666' }}>
          已选择 {selectedCountryIds.length} 个国家（地区），共 {filteredCountryLibrary.length} 个可选
        </div>

        <Table
          columns={countryLibraryColumns}
          data={filteredCountryLibrary}
          rowKey="id"
          scroll={{ x: 750, y: 400 }}
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

export default CountryRegionManagement; 