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
  Typography,
  Switch
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

// 海港数据接口
interface SeaPort {
  id: string;
  portNameEn: string;
  portNameCn: string;
  unLocation: string;
  country: string;
  isBasePort: boolean;
  relatedRoutes: string[];
  ediCodes: EDICode[];
  amsPortCode: string;
  status: 'enabled' | 'disabled';
  longitude: string;
  latitude: string;
  relatedTerminals: string[];
}

// EDI代码接口
interface EDICode {
  id: string;
  carrier: string;
  ediCode: string;
}

// 空港数据接口
interface Airport {
  id: string;
  portNameEn: string;
  portNameCn: string;
  iataCode: string;
  country: string;
  relatedRoutes: string[];
  ediCodes: EDICode[];
  amsPortCode: string;
  status: 'enabled' | 'disabled';
  longitude: string;
  latitude: string;
}

// 承运人选项
const carrierOptions = [
  { value: 'COSCO', label: '中远海运 (COSCO)' },
  { value: 'MSC', label: '地中海航运 (MSC)' },
  { value: 'MAERSK', label: '马士基 (MAERSK)' },
  { value: 'CMA', label: '达飞轮船 (CMA CGM)' },
  { value: 'EVERGREEN', label: '长荣海运 (EVERGREEN)' },
  { value: 'HAPAG', label: '赫伯罗特 (HAPAG-LLOYD)' },
  { value: 'ONE', label: '海洋网联船务 (ONE)' },
  { value: 'YANG_MING', label: '阳明海运 (YANG MING)' }
];

// 国家地区选项
const countryOptions = [
  { value: 'CN', label: '中国' },
  { value: 'US', label: '美国' },
  { value: 'DE', label: '德国' },
  { value: 'NL', label: '荷兰' },
  { value: 'SG', label: '新加坡' },
  { value: 'HK', label: '香港' },
  { value: 'JP', label: '日本' },
  { value: 'KR', label: '韩国' }
];

// 航线选项
const routeOptions = [
  { value: 'asia_europe', label: '亚欧航线' },
  { value: 'trans_pacific', label: '跨太平洋航线' },
  { value: 'asia_america', label: '亚美航线' },
  { value: 'europe_america', label: '欧美航线' },
  { value: 'intra_asia', label: '亚洲区域航线' },
  { value: 'middle_east', label: '中东航线' },
  { value: 'africa', label: '非洲航线' },
  { value: 'mediterranean', label: '地中海航线' },
  { value: 'baltic', label: '波罗的海航线' },
  { value: 'south_america', label: '南美航线' }
];

// 码头选项
const terminalOptions = [
  // 上海港码头
  { value: 'yangshan', label: '洋山深水港' },
  { value: 'waigaoqiao', label: '外高桥码头' },
  { value: 'wusong', label: '吴淞码头' },
  { value: 'zhanghuabang', label: '张华浜码头' },
  
  // 宁波港码头
  { value: 'beilun', label: '北仑码头' },
  { value: 'daxie', label: '大榭码头' },
  { value: 'chuanshan', label: '穿山码头' },
  
  // 洛杉矶码头
  { value: 'long_beach', label: 'Long Beach Terminal' },
  { value: 'san_pedro', label: 'San Pedro Terminal' },
  { value: 'pier_400', label: 'Pier 400 Terminal' },
  
  // 其他常见码头
  { value: 'apmt', label: 'APM Terminals' },
  { value: 'cosco_shipping', label: 'COSCO SHIPPING Terminals' },
  { value: 'hutchison', label: 'Hutchison Ports' },
  { value: 'psa', label: 'PSA International' },
  { value: 'eurogate', label: 'EUROGATE' },
  { value: 'dp_world', label: 'DP World' }
];

// 搜索筛选参数
interface SearchParams {
  keyword: string;
  country: string;
  isBasePort: string;
  status: string;
}

const PortManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('seaport');
  const [seaPortData, setSeaPortData] = useState<SeaPort[]>([]);
  const [airportData, setAirportData] = useState<Airport[]>([]);
  const [filteredData, setFilteredData] = useState<SeaPort[]>([]);
  const [filteredAirportData, setFilteredAirportData] = useState<Airport[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [ediModalVisible, setEdiModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentPort, setCurrentPort] = useState<SeaPort | Airport | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    keyword: '',
    country: '',
    isBasePort: '',
    status: ''
  });
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

    // 初始化示例数据
  useEffect(() => {
    const mockData: SeaPort[] = [
      {
        id: '1',
        portNameEn: 'Shanghai Port',
        portNameCn: '上海港',
        unLocation: 'CNSHA',
        country: 'CN',
        isBasePort: true,
        relatedRoutes: ['asia_europe', 'trans_pacific'],
        ediCodes: [
          { id: '1', carrier: 'COSCO', ediCode: 'SHA001' },
          { id: '2', carrier: 'MAERSK', ediCode: 'CNSHA' }
        ],
        amsPortCode: '2704',
        status: 'enabled' as const,
        longitude: '121.4737',
        latitude: '31.2304',
        relatedTerminals: ['yangshan', 'waigaoqiao', 'wusong']
      },
      {
        id: '2',
        portNameEn: 'Ningbo Port',
        portNameCn: '宁波港',
        unLocation: 'CNNGB',
        country: 'CN',
        isBasePort: true,
        relatedRoutes: ['asia_europe'],
        ediCodes: [
          { id: '3', carrier: 'MSC', ediCode: 'NGB001' }
        ],
        amsPortCode: '2728',
        status: 'enabled' as const,
        longitude: '121.5500',
        latitude: '29.8683',
        relatedTerminals: ['beilun', 'daxie']
      },
      {
        id: '3',
        portNameEn: 'Los Angeles',
        portNameCn: '洛杉矶',
        unLocation: 'USLAX',
        country: 'US',
        isBasePort: true,
        relatedRoutes: ['trans_pacific'],
        ediCodes: [
          { id: '4', carrier: 'EVERGREEN', ediCode: 'LAX001' },
          { id: '5', carrier: 'YANG_MING', ediCode: 'USLAX' }
        ],
        amsPortCode: '2704',
        status: 'disabled' as const,
        longitude: '-118.2437',
        latitude: '34.0522',
        relatedTerminals: ['long_beach', 'san_pedro']
      }
    ];
      setSeaPortData(mockData);
      setFilteredData(mockData);

      // 空港示例数据
      const mockAirportData: Airport[] = [
        {
          id: '1',
          portNameEn: 'Shanghai Pudong International Airport',
          portNameCn: '上海浦东国际机场',
          iataCode: 'PVG',
          country: 'CN',
          relatedRoutes: ['asia_europe', 'trans_pacific'],
          ediCodes: [
            { id: '1', carrier: 'COSCO', ediCode: 'PVG001' },
            { id: '2', carrier: 'MAERSK', ediCode: 'CNPVG' }
          ],
          amsPortCode: '5001',
          status: 'enabled' as const,
          longitude: '121.8057',
          latitude: '31.1434'
        },
        {
          id: '2',
          portNameEn: 'Beijing Capital International Airport',
          portNameCn: '北京首都国际机场',
          iataCode: 'PEK',
          country: 'CN',
          relatedRoutes: ['asia_europe', 'intra_asia'],
          ediCodes: [
            { id: '3', carrier: 'MSC', ediCode: 'PEK001' }
          ],
          amsPortCode: '5002',
          status: 'enabled' as const,
          longitude: '116.5974',
          latitude: '40.0799'
        },
        {
          id: '3',
          portNameEn: 'Los Angeles International Airport',
          portNameCn: '洛杉矶国际机场',
          iataCode: 'LAX',
          country: 'US',
          relatedRoutes: ['trans_pacific'],
          ediCodes: [
            { id: '4', carrier: 'EVERGREEN', ediCode: 'LAX002' },
            { id: '5', carrier: 'YANG_MING', ediCode: 'USLAX2' }
          ],
          amsPortCode: '5003',
          status: 'disabled' as const,
          longitude: '-118.4085',
          latitude: '33.9425'
        }
      ];
      setAirportData(mockAirportData);
      setFilteredAirportData(mockAirportData);
    }, []);

    // 搜索筛选功能
    const handleSearch = () => {
      if (activeTab === 'seaport') {
        let filtered = seaPortData;

        // 关键词搜索
        if (searchParams.keyword) {
          filtered = filtered.filter(port => 
            port.portNameEn.toLowerCase().includes(searchParams.keyword.toLowerCase()) ||
            port.portNameCn.includes(searchParams.keyword) ||
            port.unLocation.toLowerCase().includes(searchParams.keyword.toLowerCase())
          );
        }

        // 国家筛选
        if (searchParams.country) {
          filtered = filtered.filter(port => port.country === searchParams.country);
        }

        // 基港筛选
        if (searchParams.isBasePort) {
          filtered = filtered.filter(port => 
            port.isBasePort === (searchParams.isBasePort === 'true')
          );
        }

        // 状态筛选
        if (searchParams.status) {
          filtered = filtered.filter(port => port.status === searchParams.status);
        }

        setFilteredData(filtered);
      } else if (activeTab === 'airport') {
        let filteredAirports = airportData;

        // 关键词搜索
        if (searchParams.keyword) {
          filteredAirports = filteredAirports.filter(airport => 
            airport.portNameEn.toLowerCase().includes(searchParams.keyword.toLowerCase()) ||
            airport.portNameCn.includes(searchParams.keyword) ||
            airport.iataCode.toLowerCase().includes(searchParams.keyword.toLowerCase())
          );
        }

        // 国家筛选
        if (searchParams.country) {
          filteredAirports = filteredAirports.filter(airport => airport.country === searchParams.country);
        }

        // 状态筛选
        if (searchParams.status) {
          filteredAirports = filteredAirports.filter(airport => airport.status === searchParams.status);
        }

        setFilteredAirportData(filteredAirports);
      }
    };

    // 重置搜索
    const handleReset = () => {
      setSearchParams({
        keyword: '',
        country: '',
        isBasePort: '',
        status: ''
      });
      if (activeTab === 'seaport') {
        setFilteredData(seaPortData);
      } else if (activeTab === 'airport') {
        setFilteredAirportData(airportData);
      }
    };

      // 海港表格列定义
    const seaPortColumns = [
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
      render: (_: any, record: SeaPort) => (
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
      title: '港口全称（英文）',
      dataIndex: 'portNameEn',
      width: 200,
    },
    {
      title: '港口全称（中文）',
      dataIndex: 'portNameCn',
      width: 150,
    },
    {
      title: 'UN Location',
      dataIndex: 'unLocation',
      width: 120,
    },
    {
      title: '国家（地区）',
      dataIndex: 'country',
      width: 120,
      render: (country: string) => {
        const countryOption = countryOptions.find(option => option.value === country);
        return countryOption ? countryOption.label : country;
      }
    },
    {
      title: '是否基港',
      dataIndex: 'isBasePort',
      width: 100,
      render: (isBasePort: boolean) => (
        <Tag color={isBasePort ? 'green' : 'gray'}>
          {isBasePort ? '是' : '否'}
        </Tag>
      ),
    },
    {
      title: '关联航线',
      dataIndex: 'relatedRoutes',
      width: 200,
      render: (routes: string[]) => (
        <Space wrap>
          {routes.map((route, index) => {
            const routeOption = routeOptions.find(option => option.value === route);
            return (
              <Tag key={index} color="blue">
                {routeOption ? routeOption.label : route}
              </Tag>
            );
          })}
        </Space>
      ),
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
                  <strong>{code.carrier}:</strong> {code.ediCode}
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
        title: 'AMS港口代码',
        dataIndex: 'amsPortCode',
        width: 130,
      },
      {
        title: '经度',
        dataIndex: 'longitude',
        width: 120,
      },
      {
        title: '纬度',
        dataIndex: 'latitude',
        width: 120,
      },
      {
        title: '关联码头',
        dataIndex: 'relatedTerminals',
        width: 150,
        render: (terminals: string[]) => (
          <Tooltip
            content={
              <div>
                {terminals.map((terminal, index) => {
                  const terminalOption = terminalOptions.find(option => option.value === terminal);
                  return (
                    <div key={index} style={{ marginBottom: '4px' }}>
                      {terminalOption ? terminalOption.label : terminal}
                    </div>
                  );
                })}
              </div>
            }
          >
            <Tag color="cyan" style={{ cursor: 'pointer' }}>
              {terminals.length} 个码头
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
      width: 200,
      fixed: 'right' as const,
      render: (_: any, record: SeaPort) => (
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
            title={`确定要${record.status === 'enabled' ? '禁用' : '启用'}此港口吗？`}
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

  // 空港表格列定义
  const airportColumns = [
    {
      title: (
        <Checkbox
          indeterminate={selectedRowKeys.length > 0 && selectedRowKeys.length < filteredAirportData.length}
          checked={selectedRowKeys.length === filteredAirportData.length && filteredAirportData.length > 0}
          onChange={(checked) => {
            if (checked) {
              setSelectedRowKeys(filteredAirportData.map(item => item.id));
            } else {
              setSelectedRowKeys([]);
            }
          }}
        />
      ),
    dataIndex: 'checkbox',
    width: 60,
    render: (_: any, record: Airport) => (
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
    title: '机场全称（英文）',
    dataIndex: 'portNameEn',
    width: 200,
  },
  {
    title: '机场全称（中文）',
    dataIndex: 'portNameCn',
    width: 150,
  },
  {
    title: 'IATA代码',
    dataIndex: 'iataCode',
    width: 120,
  },
  {
    title: '国家（地区）',
    dataIndex: 'country',
    width: 120,
    render: (country: string) => {
      const countryOption = countryOptions.find(option => option.value === country);
      return countryOption ? countryOption.label : country;
    }
  },
  {
    title: '关联航线',
    dataIndex: 'relatedRoutes',
    width: 200,
    render: (routes: string[]) => (
      <Space wrap>
        {routes.map((route, index) => {
          const routeOption = routeOptions.find(option => option.value === route);
          return (
            <Tag key={index} color="blue">
              {routeOption ? routeOption.label : route}
            </Tag>
          );
        })}
      </Space>
    ),
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
                <strong>{code.carrier}:</strong> {code.ediCode}
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
      title: 'AMS港口代码',
      dataIndex: 'amsPortCode',
      width: 130,
    },
    {
      title: '经度',
      dataIndex: 'longitude',
      width: 120,
    },
    {
      title: '纬度',
      dataIndex: 'latitude',
      width: 120,
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
    render: (_: any, record: Airport) => (
      <Space>
        <Button
          type="text"
          size="small"
          icon={<IconEdit />}
          onClick={() => handleEditAirport(record)}
        >
          编辑
        </Button>
        <Popconfirm
          title={`确定要${record.status === 'enabled' ? '禁用' : '启用'}此机场吗？`}
          onOk={() => handleToggleAirportStatus(record.id, record.status)}
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
          onClick={() => handleAirportEdiCodeSetting(record)}
        >
          EDI代码设置
        </Button>
      </Space>
    ),
  },
];

  // 处理编辑
  const handleEdit = (record: SeaPort) => {
    setCurrentPort(record);
    setIsEditing(true);
    editForm.setFieldsValue({
      portNameEn: record.portNameEn,
      portNameCn: record.portNameCn,
      unLocation: record.unLocation,
      country: record.country,
      isBasePort: record.isBasePort,
      relatedRoutes: record.relatedRoutes,
      amsPortCode: record.amsPortCode,
      longitude: record.longitude,
      latitude: record.latitude,
      relatedTerminals: record.relatedTerminals
    });
    setEditModalVisible(true);
  };

  // 处理新增
  const handleAdd = () => {
    setCurrentPort(null);
    setIsEditing(false);
    editForm.resetFields();
    setEditModalVisible(true);
  };

  // 处理状态切换
  const handleToggleStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'enabled' ? 'disabled' : 'enabled';
    setSeaPortData(prev => prev.map(port => 
      port.id === id ? { ...port, status: newStatus } : port
    ));
    setFilteredData(prev => prev.map(port => 
      port.id === id ? { ...port, status: newStatus } : port
    ));
    Message.success(`港口已${newStatus === 'enabled' ? '启用' : '禁用'}`);
  };

  // 批量启用
  const handleBatchEnable = () => {
    if (selectedRowKeys.length === 0) {
      Message.warning(`请选择要启用的${activeTab === 'seaport' ? '港口' : '机场'}`);
      return;
    }
    
    if (activeTab === 'seaport') {
      setSeaPortData(prev => prev.map(port => 
        selectedRowKeys.includes(port.id) ? { ...port, status: 'enabled' } : port
      ));
      setFilteredData(prev => prev.map(port => 
        selectedRowKeys.includes(port.id) ? { ...port, status: 'enabled' } : port
      ));
    } else if (activeTab === 'airport') {
      setAirportData(prev => prev.map(airport => 
        selectedRowKeys.includes(airport.id) ? { ...airport, status: 'enabled' } : airport
      ));
      setFilteredAirportData(prev => prev.map(airport => 
        selectedRowKeys.includes(airport.id) ? { ...airport, status: 'enabled' } : airport
      ));
    }
    
    setSelectedRowKeys([]);
    Message.success(`已启用 ${selectedRowKeys.length} 个${activeTab === 'seaport' ? '港口' : '机场'}`);
  };

  // 批量禁用
  const handleBatchDisable = () => {
    if (selectedRowKeys.length === 0) {
      Message.warning(`请选择要禁用的${activeTab === 'seaport' ? '港口' : '机场'}`);
      return;
    }
    
    if (activeTab === 'seaport') {
      setSeaPortData(prev => prev.map(port => 
        selectedRowKeys.includes(port.id) ? { ...port, status: 'disabled' } : port
      ));
      setFilteredData(prev => prev.map(port => 
        selectedRowKeys.includes(port.id) ? { ...port, status: 'disabled' } : port
      ));
    } else if (activeTab === 'airport') {
      setAirportData(prev => prev.map(airport => 
        selectedRowKeys.includes(airport.id) ? { ...airport, status: 'disabled' } : airport
      ));
      setFilteredAirportData(prev => prev.map(airport => 
        selectedRowKeys.includes(airport.id) ? { ...airport, status: 'disabled' } : airport
      ));
    }
    
    setSelectedRowKeys([]);
    Message.success(`已禁用 ${selectedRowKeys.length} 个${activeTab === 'seaport' ? '港口' : '机场'}`);
  };



  // 处理EDI代码设置
  const handleEdiCodeSetting = (record: SeaPort) => {
    setCurrentPort(record);
    form.setFieldsValue({
      ediCodes: record.ediCodes
    });
    setEdiModalVisible(true);
  };

  // 保存港口编辑
  const handleSavePort = async () => {
    try {
      const values = await editForm.validate();
      
      if (activeTab === 'seaport') {
        const portData = {
          ...values,
          relatedRoutes: values.relatedRoutes || [],
          relatedTerminals: values.relatedTerminals || [],
          id: isEditing ? currentPort?.id : Date.now().toString(),
          ediCodes: isEditing ? currentPort?.ediCodes || [] : [],
          status: isEditing ? currentPort?.status : 'enabled' as const
        };

        if (isEditing) {
          // 更新现有港口
          setSeaPortData(prev => prev.map(port => 
            port.id === currentPort?.id ? { ...port, ...portData } : port
          ));
          setFilteredData(prev => prev.map(port => 
            port.id === currentPort?.id ? { ...port, ...portData } : port
          ));
          Message.success('港口信息已更新');
        } else {
          // 新增港口
          const newPort = { ...portData, id: Date.now().toString(), ediCodes: [] };
          setSeaPortData(prev => [...prev, newPort]);
          setFilteredData(prev => [...prev, newPort]);
          Message.success('港口已添加');
        }
      } else if (activeTab === 'airport') {
        const airportData = {
          ...values,
          relatedRoutes: values.relatedRoutes || [],
          id: isEditing ? currentPort?.id : Date.now().toString(),
          ediCodes: isEditing ? currentPort?.ediCodes || [] : [],
          status: isEditing ? currentPort?.status : 'enabled' as const
        };

        if (isEditing) {
          // 更新现有机场
          setAirportData(prev => prev.map(airport => 
            airport.id === currentPort?.id ? { ...airport, ...airportData } : airport
          ));
          setFilteredAirportData(prev => prev.map(airport => 
            airport.id === currentPort?.id ? { ...airport, ...airportData } : airport
          ));
          Message.success('机场信息已更新');
        } else {
          // 新增机场
          const newAirport = { ...airportData, id: Date.now().toString(), ediCodes: [] };
          setAirportData(prev => [...prev, newAirport]);
          setFilteredAirportData(prev => [...prev, newAirport]);
          Message.success('机场已添加');
        }
      }
      
      setEditModalVisible(false);
    } catch (error) {
      console.error('保存失败:', error);
    }
  };

  // 保存EDI代码设置
  const handleSaveEdiCodes = async () => {
    try {
      const values = await form.validate();
      const ediCodes = values.ediCodes || [];
      
      // 根据当前激活的Tab更新相应的数据
      if (activeTab === 'seaport') {
        setSeaPortData(prev => prev.map(port => 
          port.id === currentPort?.id 
            ? { ...port, ediCodes }
            : port
        ));
        setFilteredData(prev => prev.map(port => 
          port.id === currentPort?.id 
            ? { ...port, ediCodes }
            : port
        ));
      } else if (activeTab === 'airport') {
        setAirportData(prev => prev.map(airport => 
          airport.id === currentPort?.id 
            ? { ...airport, ediCodes }
            : airport
        ));
        setFilteredAirportData(prev => prev.map(airport => 
          airport.id === currentPort?.id 
            ? { ...airport, ediCodes }
            : airport
        ));
      }
      
      setEdiModalVisible(false);
      Message.success('EDI代码设置已保存');
    } catch (error) {
      console.error('保存失败:', error);
    }
  };

  // 空港相关处理函数
  // 处理空港编辑
  const handleEditAirport = (record: Airport) => {
    setCurrentPort(record);
    setIsEditing(true);
    editForm.setFieldsValue({
      portNameEn: record.portNameEn,
      portNameCn: record.portNameCn,
      iataCode: record.iataCode,
      country: record.country,
      relatedRoutes: record.relatedRoutes,
      amsPortCode: record.amsPortCode,
      longitude: record.longitude,
      latitude: record.latitude
    });
    setEditModalVisible(true);
  };

  // 处理空港状态切换
  const handleToggleAirportStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'enabled' ? 'disabled' : 'enabled';
    setAirportData(prev => prev.map(airport => 
      airport.id === id ? { ...airport, status: newStatus } : airport
    ));
    setFilteredAirportData(prev => prev.map(airport => 
      airport.id === id ? { ...airport, status: newStatus } : airport
    ));
    Message.success(`机场已${newStatus === 'enabled' ? '启用' : '禁用'}`);
  };

  // 处理空港EDI代码设置
  const handleAirportEdiCodeSetting = (record: Airport) => {
    setCurrentPort(record);
    form.setFieldsValue({
      ediCodes: record.ediCodes
    });
    setEdiModalVisible(true);
  };

  return (
    <Card>
      <div style={{ marginBottom: '20px' }}>
        <Title heading={4} style={{ margin: 0 }}>港口管理</Title>
      </div>

      <Tabs activeTab={activeTab} onChange={(tab) => {
        setActiveTab(tab);
        setSelectedRowKeys([]); // 切换Tab时清空选择
      }}>
        <TabPane key="seaport" title="海港">
          {/* 搜索筛选区域 */}
          <Card style={{ marginBottom: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: '16px', alignItems: 'flex-end' }}>
              <div>
                <div style={{ marginBottom: '4px', fontSize: '14px', color: '#666' }}>关键词搜索</div>
                <Input
                  placeholder="港口名称、UN Location"
                  value={searchParams.keyword}
                  onChange={(value) => setSearchParams(prev => ({ ...prev, keyword: value }))}
                />
              </div>
              <div>
                <div style={{ marginBottom: '4px', fontSize: '14px', color: '#666' }}>国家地区</div>
                <Select
                  placeholder="选择国家"
                  value={searchParams.country}
                  onChange={(value) => setSearchParams(prev => ({ ...prev, country: value }))}
                  allowClear
                >
                  {countryOptions.map(option => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
                  ))}
                </Select>
              </div>
              <div>
                <div style={{ marginBottom: '4px', fontSize: '14px', color: '#666' }}>是否基港</div>
                <Select
                  placeholder="选择"
                  value={searchParams.isBasePort}
                  onChange={(value) => setSearchParams(prev => ({ ...prev, isBasePort: value }))}
                  allowClear
                >
                  <Option value="true">是</Option>
                  <Option value="false">否</Option>
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
                  新增海港
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
            columns={seaPortColumns}
            data={filteredData}
            rowKey="id"
            scroll={{ x: 1940 }}
            pagination={{
              pageSize: 10,
              showTotal: true,
              showJumper: true,
              sizeCanChange: true,
            }}
          />
        </TabPane>

        <TabPane key="airport" title="空港">
          {/* 搜索筛选区域 */}
          <Card style={{ marginBottom: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '16px', alignItems: 'flex-end' }}>
              <div>
                <div style={{ marginBottom: '4px', fontSize: '14px', color: '#666' }}>关键词搜索</div>
                <Input
                  placeholder="机场名称、IATA代码"
                  value={searchParams.keyword}
                  onChange={(value) => setSearchParams(prev => ({ ...prev, keyword: value }))}
                />
              </div>
              <div>
                <div style={{ marginBottom: '4px', fontSize: '14px', color: '#666' }}>国家地区</div>
                <Select
                  placeholder="选择国家"
                  value={searchParams.country}
                  onChange={(value) => setSearchParams(prev => ({ ...prev, country: value }))}
                  allowClear
                >
                  {countryOptions.map(option => (
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
                  新增空港
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
            columns={airportColumns}
            data={filteredAirportData}
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

        <TabPane key="railway" title="铁路站点">
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '200px',
            color: '#999'
          }}>
            铁路站点管理功能开发中...
          </div>
        </TabPane>
      </Tabs>

      {/* 新增/编辑港口弹窗 */}
      <Modal
        title={
          activeTab === 'seaport' 
            ? (isEditing ? '编辑海港' : '新增海港')
            : (isEditing ? '编辑空港' : '新增空港')
        }
        visible={editModalVisible}
        onOk={handleSavePort}
        onCancel={() => setEditModalVisible(false)}
        style={{ width: 800 }}
      >
        <Form form={editForm} layout="vertical">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Form.Item
              field="portNameEn"
              label={activeTab === 'seaport' ? '港口全称（英文）' : '机场全称（英文）'}
              rules={[{ required: true, message: activeTab === 'seaport' ? '请输入港口英文名称' : '请输入机场英文名称' }]}
            >
              <Input placeholder={activeTab === 'seaport' ? '请输入港口英文名称' : '请输入机场英文名称'} />
            </Form.Item>
            
            <Form.Item
              field="portNameCn"
              label={activeTab === 'seaport' ? '港口全称（中文）' : '机场全称（中文）'}
              rules={[{ required: true, message: activeTab === 'seaport' ? '请输入港口中文名称' : '请输入机场中文名称' }]}
            >
              <Input placeholder={activeTab === 'seaport' ? '请输入港口中文名称' : '请输入机场中文名称'} />
            </Form.Item>
            
            {activeTab === 'seaport' ? (
              <Form.Item
                field="unLocation"
                label="UN Location"
                rules={[{ required: true, message: '请输入UN Location' }]}
              >
                <Input placeholder="请输入UN Location代码" />
              </Form.Item>
            ) : (
              <Form.Item
                field="iataCode"
                label="IATA代码"
                rules={[{ required: true, message: '请输入IATA代码' }]}
              >
                <Input placeholder="请输入IATA代码，如：PVG" />
              </Form.Item>
            )}
            
            <Form.Item
              field="country"
              label="国家（地区）"
              rules={[{ required: true, message: '请选择国家' }]}
            >
              <Select placeholder="请选择国家">
                {countryOptions.map(option => (
                  <Option key={option.value} value={option.value}>{option.label}</Option>
                ))}
              </Select>
            </Form.Item>
            
            <Form.Item
              field="amsPortCode"
              label="AMS港口代码"
              rules={[{ required: true, message: '请输入AMS港口代码' }]}
            >
              <Input placeholder="请输入AMS港口代码" />
            </Form.Item>
            
            <Form.Item
              field="longitude"
              label="经度"
              rules={[{ required: true, message: '请输入经度' }]}
            >
              <Input placeholder="请输入经度，如：121.4737" />
            </Form.Item>
            
            <Form.Item
              field="latitude"
              label="纬度"
              rules={[{ required: true, message: '请输入纬度' }]}
            >
              <Input placeholder="请输入纬度，如：31.2304" />
            </Form.Item>
          </div>
          
          <Form.Item
            field="relatedRoutes"
            label="关联航线"
          >
            <Select
              placeholder="请选择关联航线"
              mode="multiple"
              allowClear
            >
              {routeOptions.map(option => (
                <Option key={option.value} value={option.value}>{option.label}</Option>
              ))}
            </Select>
          </Form.Item>
          
          {activeTab === 'seaport' && (
            <>
              <Form.Item
                field="relatedTerminals"
                label="关联码头"
              >
                <Select
                  placeholder="请选择关联码头"
                  mode="multiple"
                  allowClear
                >
                  {terminalOptions.map(option => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
                  ))}
                </Select>
              </Form.Item>
              
              <Form.Item
                field="isBasePort"
                label="是否基港"
                triggerPropName="checked"
              >
                <Switch />
              </Form.Item>
            </>
          )}
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
          <Form.List field="ediCodes">
            {(fields, { add, remove }) => (
              <div>
                {fields.map((field, index) => (
                  <div key={field.key} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    marginBottom: '16px',
                    padding: '12px',
                    border: '1px solid #e5e6eb',
                    borderRadius: '6px'
                  }}>
                    <Form.Item
                      field={`${field.field}.carrier`}
                      label="承运人"
                      style={{ marginRight: '16px', marginBottom: 0, width: '200px' }}
                      rules={[{ required: true, message: '请选择承运人' }]}
                    >
                      <Select placeholder="选择承运人">
                        {carrierOptions.map(option => (
                          <Option key={option.value} value={option.value}>
                            {option.label}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    
                    <Form.Item
                      field={`${field.field}.ediCode`}
                      label="EDI代码"
                      style={{ marginRight: '16px', marginBottom: 0, flex: 1 }}
                      rules={[{ required: true, message: '请输入EDI代码' }]}
                    >
                      <Input placeholder="输入EDI代码" />
                    </Form.Item>

                    <Button
                      type="text"
                      icon={<IconMinus />}
                      status="danger"
                      onClick={() => remove(index)}
                      style={{ marginTop: '20px' }}
                    />
                  </div>
                ))}
                
                <Button
                  type="dashed"
                  icon={<IconPlus />}
                  onClick={() => add({ id: Date.now().toString(), carrier: '', ediCode: '' })}
                  style={{ width: '100%' }}
                >
                  添加EDI代码
                </Button>
              </div>
            )}
          </Form.List>
        </Form>
      </Modal>
    </Card>
  );
};

export default PortManagement; 