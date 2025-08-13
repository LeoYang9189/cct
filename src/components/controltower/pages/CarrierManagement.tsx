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
  IconSettings,
  IconMinus,
  IconSearch,
  IconRefresh
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

// 船公司库数据
interface ShippingCompanyLibrary {
  id: string;
  companyNameCn: string;
  companyNameEn: string;
  companyCode: string;
  scacCode: string;
  eoriNumber: string;
  nineKCode: string;
  naccsCode: string;
  country: string;
}

// 航空公司库数据
interface AirlineCompanyLibrary {
  id: string;
  companyNameCn: string;
  companyNameEn: string;
  iataCode: string;
  hawbPrefix: string;
  country: string;
}

// 搜索筛选参数
interface SearchParams {
  keyword: string;
  status: string;
}

// 选择弹窗搜索参数
interface SelectSearchParams {
  keyword: string;
  country: string;
}



// 船公司库数据
const shippingCompanyLibrary: ShippingCompanyLibrary[] = [
  {
    id: 'lib_shipping_1',
    companyNameCn: '中远海运集装箱运输',
    companyNameEn: 'COSCO SHIPPING Container Lines',
    companyCode: 'CSCL',
    scacCode: 'COSU',
    eoriNumber: 'GB123456789000',
    nineKCode: '9000001',
    naccsCode: 'COSCO',
    country: 'CN'
  },
  {
    id: 'lib_shipping_2',
    companyNameCn: '马士基航运',
    companyNameEn: 'Maersk Line',
    companyCode: 'MAERSK',
    scacCode: 'MAEU',
    eoriNumber: 'DK987654321000',
    nineKCode: '9000002',
    naccsCode: 'MAERSK',
    country: 'DK'
  },
  {
    id: 'lib_shipping_3',
    companyNameCn: '地中海航运公司',
    companyNameEn: 'Mediterranean Shipping Company',
    companyCode: 'MSC',
    scacCode: 'MSCU',
    eoriNumber: 'CH456789123000',
    nineKCode: '9000003',
    naccsCode: 'MSC',
    country: 'CH'
  },
  {
    id: 'lib_shipping_4',
    companyNameCn: 'CMA CGM',
    companyNameEn: 'CMA CGM',
    companyCode: 'CMACGM',
    scacCode: 'CMDU',
    eoriNumber: 'FR789123456000',
    nineKCode: '9000004',
    naccsCode: 'CMACGM',
    country: 'FR'
  },
  {
    id: 'lib_shipping_5',
    companyNameCn: '赫伯罗特',
    companyNameEn: 'Hapag-Lloyd',
    companyCode: 'HAPAG',
    scacCode: 'HLCU',
    eoriNumber: 'DE321654987000',
    nineKCode: '9000005',
    naccsCode: 'HAPAG',
    country: 'DE'
  },
  {
    id: 'lib_shipping_6',
    companyNameCn: '长荣海运',
    companyNameEn: 'Evergreen Line',
    companyCode: 'EVERGREEN',
    scacCode: 'EGLV',
    eoriNumber: 'TW654987321000',
    nineKCode: '9000006',
    naccsCode: 'EVERGREEN',
    country: 'TW'
  },
  {
    id: 'lib_shipping_7',
    companyNameCn: '阳明海运',
    companyNameEn: 'Yang Ming Marine Transport',
    companyCode: 'YANGMING',
    scacCode: 'YMLU',
    eoriNumber: 'TW987321654000',
    nineKCode: '9000007',
    naccsCode: 'YANGMING',
    country: 'TW'
  },
  {
    id: 'lib_shipping_8',
    companyNameCn: '现代商船',
    companyNameEn: 'Hyundai Merchant Marine',
    companyCode: 'HMM',
    scacCode: 'HDMU',
    eoriNumber: 'KR147258369000',
    nineKCode: '9000008',
    naccsCode: 'HMM',
    country: 'KR'
  }
];

// 航空公司库数据
const airlineCompanyLibrary: AirlineCompanyLibrary[] = [
  {
    id: 'lib_airline_1',
    companyNameCn: '中国国际航空股份有限公司',
    companyNameEn: 'Air China Limited',
    iataCode: 'CA',
    hawbPrefix: '999',
    country: 'CN'
  },
  {
    id: 'lib_airline_2',
    companyNameCn: '中国东方航空股份有限公司',
    companyNameEn: 'China Eastern Airlines',
    iataCode: 'MU',
    hawbPrefix: '781',
    country: 'CN'
  },
  {
    id: 'lib_airline_3',
    companyNameCn: '中国南方航空股份有限公司',
    companyNameEn: 'China Southern Airlines',
    iataCode: 'CZ',
    hawbPrefix: '784',
    country: 'CN'
  },
  {
    id: 'lib_airline_4',
    companyNameCn: '汉莎航空公司',
    companyNameEn: 'Deutsche Lufthansa AG',
    iataCode: 'LH',
    hawbPrefix: '020',
    country: 'DE'
  },
  {
    id: 'lib_airline_5',
    companyNameCn: '大韩航空',
    companyNameEn: 'Korean Air',
    iataCode: 'KE',
    hawbPrefix: '180',
    country: 'KR'
  },
  {
    id: 'lib_airline_6',
    companyNameCn: '新加坡航空公司',
    companyNameEn: 'Singapore Airlines',
    iataCode: 'SQ',
    hawbPrefix: '618',
    country: 'SG'
  },
  {
    id: 'lib_airline_7',
    companyNameCn: '阿联酋航空公司',
    companyNameEn: 'Emirates',
    iataCode: 'EK',
    hawbPrefix: '176',
    country: 'AE'
  },
  {
    id: 'lib_airline_8',
    companyNameCn: '国泰航空有限公司',
    companyNameEn: 'Cathay Pacific Airways Limited',
    iataCode: 'CX',
    hawbPrefix: '160',
    country: 'HK'
  },
  {
    id: 'lib_airline_9',
    companyNameCn: '全日本空输株式会社',
    companyNameEn: 'All Nippon Airways',
    iataCode: 'NH',
    hawbPrefix: '205',
    country: 'JP'
  },
  {
    id: 'lib_airline_10',
    companyNameCn: '日本航空株式会社',
    companyNameEn: 'Japan Airlines',
    iataCode: 'JL',
    hawbPrefix: '131',
    country: 'JP'
  }
];

const CarrierManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('shipping');
  const [shippingData, setShippingData] = useState<ShippingCompany[]>([]);
  const [airlineData, setAirlineData] = useState<AirlineCompany[]>([]);
  const [filteredShippingData, setFilteredShippingData] = useState<ShippingCompany[]>([]);
  const [filteredAirlineData, setFilteredAirlineData] = useState<AirlineCompany[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [ediModalVisible, setEdiModalVisible] = useState(false);
  const [currentCarrier, setCurrentCarrier] = useState<ShippingCompany | AirlineCompany | null>(null);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    keyword: '',
    status: ''
  });
  
  // 新增选择弹窗相关状态
  const [selectModalVisible, setSelectModalVisible] = useState(false);
  const [selectSearchParams, setSelectSearchParams] = useState<SelectSearchParams>({
    keyword: '',
    country: ''
  });
  const [selectedCarrierKeys, setSelectedCarrierKeys] = useState<string[]>([]);
  const [filteredLibraryData, setFilteredLibraryData] = useState<any[]>([]);
  
  const [form] = Form.useForm();

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
      headerStyle: { whiteSpace: 'nowrap' },
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
      width: 180,
      sorter: true,
      headerStyle: { whiteSpace: 'nowrap' },
    },
    {
      title: '船公司名称（英文）',
      dataIndex: 'companyNameEn',
      width: 260,
      sorter: true,
      headerStyle: { whiteSpace: 'nowrap' },
    },
    {
      title: '船公司代码',
      dataIndex: 'companyCode',
      width: 140,
      sorter: true,
      headerStyle: { whiteSpace: 'nowrap' },
    },
    {
      title: 'SCAC CODE',
      dataIndex: 'scacCode',
      width: 140,
      sorter: true,
      headerStyle: { whiteSpace: 'nowrap' },
    },
    {
      title: 'EORI Number',
      dataIndex: 'eoriNumber',
      width: 160,
      sorter: true,
      headerStyle: { whiteSpace: 'nowrap' },
    },
    {
      title: '9000 CODE',
      dataIndex: 'nineKCode',
      width: 140,
      sorter: true,
      headerStyle: { whiteSpace: 'nowrap' },
    },
    {
      title: 'NACCS CODE',
      dataIndex: 'naccsCode',
      width: 140,
      sorter: true,
      headerStyle: { whiteSpace: 'nowrap' },
    },
    {
      title: 'EDI代码',
      dataIndex: 'ediCodes',
      width: 120,
      sorter: true,
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
      sorter: true,
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
      render: (_: unknown, record: ShippingCompany) => (
        <Space>
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
      sorter: true,
    },
    {
      title: '航空公司名称（英文）',
      dataIndex: 'companyNameEn',
      width: 200,
      sorter: true,
    },
          {
        title: 'IATA CODE',
        dataIndex: 'iataCode',
        width: 120,
        sorter: true,
      },
      {
        title: '主单号前缀',
        dataIndex: 'hawbPrefix',
        width: 120,
        sorter: true,
      },
    {
      title: 'EDI代码',
      dataIndex: 'ediCodes',
      width: 150,
      sorter: true,
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
      sorter: true,
      render: (status: string) => (
        <Tag color={status === 'enabled' ? 'green' : 'red'}>
          {status === 'enabled' ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: 180,
      fixed: 'right' as const,
      render: (_: unknown, record: AirlineCompany) => (
        <Space>
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



  // 处理新增 - 打开选择弹窗
  const handleAdd = () => {
    setSelectModalVisible(true);
    setSelectedCarrierKeys([]);
    setSelectSearchParams({ keyword: '', country: '' });
    
    // 初始化筛选数据
    if (activeTab === 'shipping') {
      // 过滤掉已存在的船公司
      const existingCodes = shippingData.map(item => item.companyCode);
      const availableData = shippingCompanyLibrary.filter(item => 
        !existingCodes.includes(item.companyCode)
      );
      setFilteredLibraryData(availableData);
    } else if (activeTab === 'airline') {
      // 过滤掉已存在的航空公司
      const existingCodes = airlineData.map(item => item.iataCode);
      const availableData = airlineCompanyLibrary.filter(item => 
        !existingCodes.includes(item.iataCode)
      );
      setFilteredLibraryData(availableData);
    }
  };

  // 选择弹窗搜索功能
  const handleSelectSearch = () => {
    let sourceData: any[];
    if (activeTab === 'shipping') {
      const existingCodes = shippingData.map(item => item.companyCode);
      sourceData = shippingCompanyLibrary.filter(item => 
        !existingCodes.includes(item.companyCode)
      );
    } else {
      const existingCodes = airlineData.map(item => item.iataCode);
      sourceData = airlineCompanyLibrary.filter(item => 
        !existingCodes.includes(item.iataCode)
      );
    }

    let filtered = sourceData;

    // 关键词搜索
    if (selectSearchParams.keyword) {
      filtered = filtered.filter(item => 
        item.companyNameCn.includes(selectSearchParams.keyword) ||
        item.companyNameEn.toLowerCase().includes(selectSearchParams.keyword.toLowerCase()) ||
        (activeTab === 'shipping' 
          ? (item as ShippingCompanyLibrary).companyCode.toLowerCase().includes(selectSearchParams.keyword.toLowerCase()) ||
            (item as ShippingCompanyLibrary).scacCode.toLowerCase().includes(selectSearchParams.keyword.toLowerCase())
          : (item as AirlineCompanyLibrary).iataCode.toLowerCase().includes(selectSearchParams.keyword.toLowerCase())
        )
      );
    }



    setFilteredLibraryData(filtered);
  };

  // 重置选择搜索
  const handleSelectReset = () => {
    setSelectSearchParams({ keyword: '', country: '' });
    if (activeTab === 'shipping') {
      const existingCodes = shippingData.map(item => item.companyCode);
      const availableData = shippingCompanyLibrary.filter(item => 
        !existingCodes.includes(item.companyCode)
      );
      setFilteredLibraryData(availableData);
    } else {
      const existingCodes = airlineData.map(item => item.iataCode);
      const availableData = airlineCompanyLibrary.filter(item => 
        !existingCodes.includes(item.iataCode)
      );
      setFilteredLibraryData(availableData);
    }
  };

  // 确认选择添加
  const handleConfirmSelection = () => {
    if (selectedCarrierKeys.length === 0) {
      Message.warning(`请选择要添加的${activeTab === 'shipping' ? '船公司' : '航空公司'}`);
      return;
    }

    const selectedItems = filteredLibraryData.filter(item => 
      selectedCarrierKeys.includes(item.id)
    );

    if (activeTab === 'shipping') {
      const newShippingCompanies: ShippingCompany[] = selectedItems.map((item) => {
        const shippingItem = item as ShippingCompanyLibrary;
        return {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          companyNameCn: shippingItem.companyNameCn,
          companyNameEn: shippingItem.companyNameEn,
          companyCode: shippingItem.companyCode,
          scacCode: shippingItem.scacCode,
          eoriNumber: shippingItem.eoriNumber,
          nineKCode: shippingItem.nineKCode,
          naccsCode: shippingItem.naccsCode,
          ediCodes: [],
          status: 'enabled' as const
        };
      });

      setShippingData(prev => [...prev, ...newShippingCompanies]);
      setFilteredShippingData(prev => [...prev, ...newShippingCompanies]);
    } else if (activeTab === 'airline') {
      const newAirlineCompanies: AirlineCompany[] = selectedItems.map((item) => {
        const airlineItem = item as AirlineCompanyLibrary;
        return {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          companyNameCn: airlineItem.companyNameCn,
          companyNameEn: airlineItem.companyNameEn,
          iataCode: airlineItem.iataCode,
          hawbPrefix: airlineItem.hawbPrefix,
          ediCodes: [],
          status: 'enabled' as const
        };
      });

      setAirlineData(prev => [...prev, ...newAirlineCompanies]);
      setFilteredAirlineData(prev => [...prev, ...newAirlineCompanies]);
    }

    setSelectModalVisible(false);
    setSelectedCarrierKeys([]);
    Message.success(`已成功添加 ${selectedItems.length} 个${activeTab === 'shipping' ? '船公司' : '航空公司'}`);
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
            columns={shippingColumns}
            data={filteredShippingData}
            rowKey="id"
            scroll={{ x: 1640 }}
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
            columns={airlineColumns}
            data={filteredAirlineData}
            rowKey="id"
            scroll={{ x: 1560 }}
            pagination={{
              pageSize: 10,
              showTotal: true,
              showJumper: true,
              sizeCanChange: true,
            }}
          />
        </TabPane>
      </Tabs>



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

      {/* 选择承运人弹窗 */}
      <Modal
        title={`选择${activeTab === 'shipping' ? '船公司' : '航空公司'}`}
        visible={selectModalVisible}
        onOk={handleConfirmSelection}
        onCancel={() => setSelectModalVisible(false)}
        style={{ width: 1000 }}
        okText={`确认添加 (${selectedCarrierKeys.length})`}
        cancelText="取消"
      >
        {/* 搜索筛选区域 */}
        <Card style={{ marginBottom: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '16px', alignItems: 'flex-end' }}>
            <div>
              <div style={{ marginBottom: '4px', fontSize: '14px', color: '#666' }}>关键词搜索</div>
              <Input
                placeholder={
                  activeTab === 'shipping' 
                    ? '公司名称、公司代码、SCAC CODE' 
                    : '公司名称、IATA CODE'
                }
                value={selectSearchParams.keyword}
                onChange={(value) => setSelectSearchParams(prev => ({ ...prev, keyword: value }))}
              />
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button type="primary" icon={<IconSearch />} onClick={handleSelectSearch}>
                搜索
              </Button>
              <Button icon={<IconRefresh />} onClick={handleSelectReset}>
                重置
              </Button>
            </div>
          </div>
        </Card>

        {/* 选择表格 */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ marginBottom: '8px', color: '#666' }}>
            可选{activeTab === 'shipping' ? '船公司' : '航空公司'} ({filteredLibraryData.length})
            {selectedCarrierKeys.length > 0 && (
              <span style={{ color: '#1890ff', marginLeft: '8px' }}>
                已选择 {selectedCarrierKeys.length} 个
              </span>
            )}
          </div>
        </div>

        <Table
          columns={
            (activeTab === 'shipping' 
              ? [
                  {
                    title: (
                      <Checkbox
                        indeterminate={selectedCarrierKeys.length > 0 && selectedCarrierKeys.length < filteredLibraryData.length}
                        checked={selectedCarrierKeys.length === filteredLibraryData.length && filteredLibraryData.length > 0}
                        onChange={(checked) => {
                          if (checked) {
                            setSelectedCarrierKeys(filteredLibraryData.map(item => item.id));
                          } else {
                            setSelectedCarrierKeys([]);
                          }
                        }}
                      />
                    ),
                    dataIndex: 'checkbox',
                    width: 60,
                    render: (_: any, record: ShippingCompanyLibrary) => (
                      <Checkbox
                        checked={selectedCarrierKeys.includes(record.id)}
                        onChange={(checked) => {
                          if (checked) {
                            setSelectedCarrierKeys([...selectedCarrierKeys, record.id]);
                          } else {
                            setSelectedCarrierKeys(selectedCarrierKeys.filter(key => key !== record.id));
                          }
                        }}
                      />
                    ),
                  },
                  {
                    title: '船公司名称（中文）',
                    dataIndex: 'companyNameCn',
                    width: 180,
                    headerStyle: { whiteSpace: 'nowrap' },
                  },
                  {
                    title: '船公司名称（英文）',
                    dataIndex: 'companyNameEn',
                    width: 240,
                    headerStyle: { whiteSpace: 'nowrap' },
                  },
                  {
                    title: '船公司代码',
                    dataIndex: 'companyCode',
                    width: 120,
                    headerStyle: { whiteSpace: 'nowrap' },
                  },
                  {
                    title: 'SCAC CODE',
                    dataIndex: 'scacCode',
                    width: 120,
                    headerStyle: { whiteSpace: 'nowrap' },
                  }
                ]
              : [
                  {
                    title: (
                      <Checkbox
                        indeterminate={selectedCarrierKeys.length > 0 && selectedCarrierKeys.length < filteredLibraryData.length}
                        checked={selectedCarrierKeys.length === filteredLibraryData.length && filteredLibraryData.length > 0}
                        onChange={(checked) => {
                          if (checked) {
                            setSelectedCarrierKeys(filteredLibraryData.map(item => item.id));
                          } else {
                            setSelectedCarrierKeys([]);
                          }
                        }}
                      />
                    ),
                    dataIndex: 'checkbox',
                    width: 60,
                    render: (_: any, record: AirlineCompanyLibrary) => (
                      <Checkbox
                        checked={selectedCarrierKeys.includes(record.id)}
                        onChange={(checked) => {
                          if (checked) {
                            setSelectedCarrierKeys([...selectedCarrierKeys, record.id]);
                          } else {
                            setSelectedCarrierKeys(selectedCarrierKeys.filter(key => key !== record.id));
                          }
                        }}
                      />
                    ),
                  },
                  {
                    title: '航空公司名称（中文）',
                    dataIndex: 'companyNameCn',
                    width: 180,
                    headerStyle: { whiteSpace: 'nowrap' },
                  },
                  {
                    title: '航空公司名称（英文）',
                    dataIndex: 'companyNameEn',
                    width: 280,
                    headerStyle: { whiteSpace: 'nowrap' },
                  },
                  {
                    title: 'IATA CODE',
                    dataIndex: 'iataCode',
                    width: 120,
                    headerStyle: { whiteSpace: 'nowrap' },
                  },
                  {
                    title: '主单号前缀',
                    dataIndex: 'hawbPrefix',
                    width: 120,
                    headerStyle: { whiteSpace: 'nowrap' },
                  }
                ]
            ) as any
          }
          data={filteredLibraryData}
          rowKey="id"
          scroll={{ x: activeTab === 'shipping' ? 760 : 720 }}
          pagination={{
            pageSize: 8,
            showTotal: true,
            showJumper: true,
            sizeCanChange: true,
          }}
        />
      </Modal>
    </Card>
  );
};

export default CarrierManagement; 