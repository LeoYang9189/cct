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
  Switch,
  Descriptions
} from '@arco-design/web-react';
import {
  IconPlus,
  IconEdit,
  IconSettings,
  IconMinus,
  IconSearch,
  IconRefresh
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
  
  // 新增海港搜索选择相关状态
  const [addPortModalVisible, setAddPortModalVisible] = useState(false);
  const [portLibraryData, setPortLibraryData] = useState<SeaPort[]>([]);
  const [filteredPortLibrary, setFilteredPortLibrary] = useState<SeaPort[]>([]);
  const [selectedPortIds, setSelectedPortIds] = useState<string[]>([]);
  const [addSearchParams, setAddSearchParams] = useState({
    keyword: '',
    country: '',
    isBasePort: ''
  });
  
  // 新增空港搜索选择相关状态
  const [addAirportModalVisible, setAddAirportModalVisible] = useState(false);
  const [airportLibraryData, setAirportLibraryData] = useState<Airport[]>([]);
  const [filteredAirportLibrary, setFilteredAirportLibrary] = useState<Airport[]>([]);
  const [selectedAirportIds, setSelectedAirportIds] = useState<string[]>([]);
  const [addAirportSearchParams, setAddAirportSearchParams] = useState({
    keyword: '',
    country: ''
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

    // 初始化港口库数据（包含更多港口供选择）
    const portLibraryMockData: SeaPort[] = [
      ...mockData, // 包含当前已有的港口
      {
        id: 'lib1',
        portNameEn: 'Shenzhen Port',
        portNameCn: '深圳港',
        unLocation: 'CNSZX',
        country: 'CN',
        isBasePort: true,
        relatedRoutes: ['asia_europe', 'intra_asia'],
        ediCodes: [],
        amsPortCode: '2729',
        status: 'enabled' as const,
        longitude: '114.0579',
        latitude: '22.5431',
        relatedTerminals: ['yantian', 'shekou']
      },
      {
        id: 'lib2',
        portNameEn: 'Guangzhou Port',
        portNameCn: '广州港',
        unLocation: 'CNGZH',
        country: 'CN',
        isBasePort: false,
        relatedRoutes: ['intra_asia'],
        ediCodes: [],
        amsPortCode: '2730',
        status: 'enabled' as const,
        longitude: '113.2644',
        latitude: '23.1291',
        relatedTerminals: ['nansha']
      },
      {
        id: 'lib3',
        portNameEn: 'Hong Kong Port',
        portNameCn: '香港港',
        unLocation: 'HKHKG',
        country: 'HK',
        isBasePort: true,
        relatedRoutes: ['asia_europe', 'trans_pacific', 'intra_asia'],
        ediCodes: [],
        amsPortCode: '2731',
        status: 'enabled' as const,
        longitude: '114.1694',
        latitude: '22.3193',
        relatedTerminals: ['kwai_tsing']
      },
      {
        id: 'lib4',
        portNameEn: 'Singapore Port',
        portNameCn: '新加坡港',
        unLocation: 'SGSIN',
        country: 'SG',
        isBasePort: true,
        relatedRoutes: ['asia_europe', 'intra_asia'],
        ediCodes: [],
        amsPortCode: '2732',
        status: 'enabled' as const,
        longitude: '103.8198',
        latitude: '1.3521',
        relatedTerminals: ['psa']
      },
      {
        id: 'lib5',
        portNameEn: 'Hamburg Port',
        portNameCn: '汉堡港',
        unLocation: 'DEHAM',
        country: 'DE',
        isBasePort: true,
        relatedRoutes: ['asia_europe'],
        ediCodes: [],
        amsPortCode: '2733',
        status: 'enabled' as const,
        longitude: '9.9937',
        latitude: '53.5511',
        relatedTerminals: ['eurogate']
      },
      {
        id: 'lib6',
        portNameEn: 'Rotterdam Port',
        portNameCn: '鹿特丹港',
        unLocation: 'NLRTM',
        country: 'NL',
        isBasePort: true,
        relatedRoutes: ['asia_europe'],
        ediCodes: [],
        amsPortCode: '2734',
        status: 'enabled' as const,
        longitude: '4.4777',
        latitude: '51.9244',
        relatedTerminals: ['maasvlakte']
      },
      {
        id: 'lib7',
        portNameEn: 'Long Beach Port',
        portNameCn: '长滩港',
        unLocation: 'USLGB',
        country: 'US',
        isBasePort: false,
        relatedRoutes: ['trans_pacific'],
        ediCodes: [],
        amsPortCode: '2735',
        status: 'enabled' as const,
        longitude: '-118.2164',
        latitude: '33.7701',
        relatedTerminals: ['long_beach']
      },
      {
        id: 'lib8',
        portNameEn: 'Yokohama Port',
        portNameCn: '横滨港',
        unLocation: 'JPYOK',
        country: 'JP',
        isBasePort: true,
        relatedRoutes: ['trans_pacific', 'intra_asia'],
        ediCodes: [],
        amsPortCode: '2736',
        status: 'enabled' as const,
        longitude: '139.6380',
        latitude: '35.4437',
        relatedTerminals: ['honmoku']
      },
      {
        id: 'lib9',
        portNameEn: 'Busan Port',
        portNameCn: '釜山港',
        unLocation: 'KRPUS',
        country: 'KR',
        isBasePort: true,
        relatedRoutes: ['trans_pacific', 'intra_asia'],
        ediCodes: [],
        amsPortCode: '2737',
        status: 'enabled' as const,
        longitude: '129.0756',
        latitude: '35.1796',
        relatedTerminals: ['pnit']
      }
    ];
    setPortLibraryData(portLibraryMockData);
    setFilteredPortLibrary(portLibraryMockData);

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

      // 初始化空港库数据（包含更多机场供选择）
      const airportLibraryMockData: Airport[] = [
        ...mockAirportData, // 包含当前已有的机场
        {
          id: 'air1',
          portNameEn: 'Shanghai Hongqiao International Airport',
          portNameCn: '上海虹桥国际机场',
          iataCode: 'SHA',
          country: 'CN',
          relatedRoutes: ['intra_asia'],
          ediCodes: [],
          amsPortCode: '5004',
          status: 'enabled' as const,
          longitude: '121.3364',
          latitude: '31.1979'
        },
        {
          id: 'air2',
          portNameEn: 'Guangzhou Baiyun International Airport',
          portNameCn: '广州白云国际机场',
          iataCode: 'CAN',
          country: 'CN',
          relatedRoutes: ['asia_europe', 'intra_asia'],
          ediCodes: [],
          amsPortCode: '5005',
          status: 'enabled' as const,
          longitude: '113.2986',
          latitude: '23.3924'
        },
        {
          id: 'air3',
          portNameEn: 'Shenzhen Bao\'an International Airport',
          portNameCn: '深圳宝安国际机场',
          iataCode: 'SZX',
          country: 'CN',
          relatedRoutes: ['intra_asia'],
          ediCodes: [],
          amsPortCode: '5006',
          status: 'enabled' as const,
          longitude: '113.8106',
          latitude: '22.6393'
        },
        {
          id: 'air4',
          portNameEn: 'Hong Kong International Airport',
          portNameCn: '香港国际机场',
          iataCode: 'HKG',
          country: 'HK',
          relatedRoutes: ['asia_europe', 'trans_pacific', 'intra_asia'],
          ediCodes: [],
          amsPortCode: '5007',
          status: 'enabled' as const,
          longitude: '113.9148',
          latitude: '22.3080'
        },
        {
          id: 'air5',
          portNameEn: 'Singapore Changi Airport',
          portNameCn: '新加坡樟宜机场',
          iataCode: 'SIN',
          country: 'SG',
          relatedRoutes: ['asia_europe', 'intra_asia'],
          ediCodes: [],
          amsPortCode: '5008',
          status: 'enabled' as const,
          longitude: '103.9915',
          latitude: '1.3644'
        },
        {
          id: 'air6',
          portNameEn: 'Tokyo Narita International Airport',
          portNameCn: '东京成田国际机场',
          iataCode: 'NRT',
          country: 'JP',
          relatedRoutes: ['trans_pacific', 'intra_asia'],
          ediCodes: [],
          amsPortCode: '5009',
          status: 'enabled' as const,
          longitude: '140.3929',
          latitude: '35.7647'
        },
        {
          id: 'air7',
          portNameEn: 'Seoul Incheon International Airport',
          portNameCn: '首尔仁川国际机场',
          iataCode: 'ICN',
          country: 'KR',
          relatedRoutes: ['trans_pacific', 'intra_asia'],
          ediCodes: [],
          amsPortCode: '5010',
          status: 'enabled' as const,
          longitude: '126.4505',
          latitude: '37.4602'
        },
        {
          id: 'air8',
          portNameEn: 'Frankfurt Airport',
          portNameCn: '法兰克福机场',
          iataCode: 'FRA',
          country: 'DE',
          relatedRoutes: ['asia_europe'],
          ediCodes: [],
          amsPortCode: '5011',
          status: 'enabled' as const,
          longitude: '8.5622',
          latitude: '50.0379'
        },
        {
          id: 'air9',
          portNameEn: 'Amsterdam Airport Schiphol',
          portNameCn: '阿姆斯特丹史基浦机场',
          iataCode: 'AMS',
          country: 'NL',
          relatedRoutes: ['asia_europe'],
          ediCodes: [],
          amsPortCode: '5012',
          status: 'enabled' as const,
          longitude: '4.7683',
          latitude: '52.3105'
        },
        {
          id: 'air10',
          portNameEn: 'John F. Kennedy International Airport',
          portNameCn: '肯尼迪国际机场',
          iataCode: 'JFK',
          country: 'US',
          relatedRoutes: ['trans_pacific'],
          ediCodes: [],
          amsPortCode: '5013',
          status: 'enabled' as const,
          longitude: '-73.7781',
          latitude: '40.6413'
        }
      ];
      setAirportLibraryData(airportLibraryMockData);
      setFilteredAirportLibrary(airportLibraryMockData);
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
      headerStyle: { whiteSpace: 'nowrap' },
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
      width: 260,
      sorter: (a: SeaPort, b: SeaPort) => a.portNameEn.localeCompare(b.portNameEn),
      headerStyle: { whiteSpace: 'nowrap' },
    },
    {
      title: '港口全称（中文）',
      dataIndex: 'portNameCn',
      width: 180,
      sorter: (a: SeaPort, b: SeaPort) => a.portNameCn.localeCompare(b.portNameCn),
      headerStyle: { whiteSpace: 'nowrap' },
    },
    {
      title: 'UN Location',
      dataIndex: 'unLocation',
      width: 140,
      sorter: (a: SeaPort, b: SeaPort) => a.unLocation.localeCompare(b.unLocation),
      headerStyle: { whiteSpace: 'nowrap' },
    },
    {
      title: '国家（地区）',
      dataIndex: 'country',
      width: 140,
      sorter: (a: SeaPort, b: SeaPort) => {
        const countryA = countryOptions.find(option => option.value === a.country)?.label || a.country;
        const countryB = countryOptions.find(option => option.value === b.country)?.label || b.country;
        return countryA.localeCompare(countryB);
      },
      headerStyle: { whiteSpace: 'nowrap' },
      render: (country: string) => {
        const countryOption = countryOptions.find(option => option.value === country);
        return countryOption ? countryOption.label : country;
      }
    },
    {
      title: '是否基港',
      dataIndex: 'isBasePort',
      width: 120,
      sorter: (a: SeaPort, b: SeaPort) => Number(a.isBasePort) - Number(b.isBasePort),
      headerStyle: { whiteSpace: 'nowrap' },
      render: (isBasePort: boolean) => (
        <Tag color={isBasePort ? 'green' : 'gray'}>
          {isBasePort ? '是' : '否'}
        </Tag>
      ),
    },
    {
      title: '关联航线',
      dataIndex: 'relatedRoutes',
      width: 240,
      headerStyle: { whiteSpace: 'nowrap' },
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
      width: 120,
      headerStyle: { whiteSpace: 'nowrap' },
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
        width: 150,
        sorter: (a: SeaPort, b: SeaPort) => a.amsPortCode.localeCompare(b.amsPortCode),
        headerStyle: { whiteSpace: 'nowrap' },
      },
      {
        title: '经度',
        dataIndex: 'longitude',
        width: 100,
        sorter: (a: SeaPort, b: SeaPort) => parseFloat(a.longitude) - parseFloat(b.longitude),
        headerStyle: { whiteSpace: 'nowrap' },
      },
      {
        title: '纬度',
        dataIndex: 'latitude',
        width: 100,
        sorter: (a: SeaPort, b: SeaPort) => parseFloat(a.latitude) - parseFloat(b.latitude),
        headerStyle: { whiteSpace: 'nowrap' },
      },
      {
        title: '关联码头',
        dataIndex: 'relatedTerminals',
        width: 120,
        headerStyle: { whiteSpace: 'nowrap' },
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
        sorter: (a: SeaPort, b: SeaPort) => a.status.localeCompare(b.status),
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
      width: 240,
      fixed: 'right' as const,
      headerStyle: { whiteSpace: 'nowrap' },
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
    headerStyle: { whiteSpace: 'nowrap' },
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
    width: 280,
    sorter: (a: Airport, b: Airport) => a.portNameEn.localeCompare(b.portNameEn),
    headerStyle: { whiteSpace: 'nowrap' },
  },
  {
    title: '机场全称（中文）',
    dataIndex: 'portNameCn',
    width: 200,
    sorter: (a: Airport, b: Airport) => a.portNameCn.localeCompare(b.portNameCn),
    headerStyle: { whiteSpace: 'nowrap' },
  },
  {
    title: 'IATA代码',
    dataIndex: 'iataCode',
    width: 120,
    sorter: (a: Airport, b: Airport) => a.iataCode.localeCompare(b.iataCode),
    headerStyle: { whiteSpace: 'nowrap' },
  },
  {
    title: '国家（地区）',
    dataIndex: 'country',
    width: 140,
    sorter: (a: Airport, b: Airport) => {
      const countryA = countryOptions.find(option => option.value === a.country)?.label || a.country;
      const countryB = countryOptions.find(option => option.value === b.country)?.label || b.country;
      return countryA.localeCompare(countryB);
    },
    headerStyle: { whiteSpace: 'nowrap' },
    render: (country: string) => {
      const countryOption = countryOptions.find(option => option.value === country);
      return countryOption ? countryOption.label : country;
    }
  },
  {
    title: '关联航线',
    dataIndex: 'relatedRoutes',
    width: 240,
    headerStyle: { whiteSpace: 'nowrap' },
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
    width: 120,
    headerStyle: { whiteSpace: 'nowrap' },
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
      width: 150,
      sorter: (a: Airport, b: Airport) => a.amsPortCode.localeCompare(b.amsPortCode),
      headerStyle: { whiteSpace: 'nowrap' },
    },
    {
      title: '经度',
      dataIndex: 'longitude',
      width: 100,
      sorter: (a: Airport, b: Airport) => parseFloat(a.longitude) - parseFloat(b.longitude),
      headerStyle: { whiteSpace: 'nowrap' },
    },
    {
      title: '纬度',
      dataIndex: 'latitude',
      width: 100,
      sorter: (a: Airport, b: Airport) => parseFloat(a.latitude) - parseFloat(b.latitude),
      headerStyle: { whiteSpace: 'nowrap' },
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      sorter: (a: Airport, b: Airport) => a.status.localeCompare(b.status),
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
    width: 240,
    fixed: 'right' as const,
    headerStyle: { whiteSpace: 'nowrap' },
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

  // 处理新增（海港和空港都使用搜索选择模式）
  const handleAdd = () => {
    if (activeTab === 'seaport') {
      // 海港：打开搜索选择弹窗
      setSelectedPortIds([]);
      setAddSearchParams({ keyword: '', country: '', isBasePort: '' });
      // 过滤掉已经存在的港口
      const availablePorts = portLibraryData.filter(port => 
        !seaPortData.some(existingPort => existingPort.id === port.id)
      );
      setFilteredPortLibrary(availablePorts);
      setAddPortModalVisible(true);
    } else if (activeTab === 'airport') {
      // 空港：打开搜索选择弹窗
      setSelectedAirportIds([]);
      setAddAirportSearchParams({ keyword: '', country: '' });
      // 过滤掉已经存在的机场
      const availableAirports = airportLibraryData.filter(airport => 
        !airportData.some(existingAirport => existingAirport.id === airport.id)
      );
      setFilteredAirportLibrary(availableAirports);
      setAddAirportModalVisible(true);
    }
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
        if (isEditing) {
          // 海港编辑时只更新可编辑字段（关联航线和关联码头）
          const updatedPortData: SeaPort = {
            ...(currentPort as SeaPort),
            relatedRoutes: values.relatedRoutes || [],
            relatedTerminals: values.relatedTerminals || []
          };

          setSeaPortData(prev => prev.map(port => 
            port.id === currentPort?.id ? updatedPortData : port
          ));
          setFilteredData(prev => prev.map(port => 
            port.id === currentPort?.id ? updatedPortData : port
          ));
          Message.success('港口信息已更新');
        } else {
          // 新增港口时使用所有字段
          const portData = {
            ...values,
            relatedRoutes: values.relatedRoutes || [],
            relatedTerminals: values.relatedTerminals || [],
            id: Date.now().toString(),
            ediCodes: [],
            status: 'enabled' as const
          };

          const newPort = { ...portData, id: Date.now().toString(), ediCodes: [] };
          setSeaPortData(prev => [...prev, newPort]);
          setFilteredData(prev => [...prev, newPort]);
          Message.success('港口已添加');
        }
      } else if (activeTab === 'airport') {
        if (isEditing) {
          // 空港编辑时只更新可编辑字段（关联航线）
          const updatedAirportData: Airport = {
            ...(currentPort as Airport),
            relatedRoutes: values.relatedRoutes || []
          };

          setAirportData(prev => prev.map(airport => 
            airport.id === currentPort?.id ? updatedAirportData : airport
          ));
          setFilteredAirportData(prev => prev.map(airport => 
            airport.id === currentPort?.id ? updatedAirportData : airport
          ));
          Message.success('机场信息已更新');
        } else {
          // 新增机场时使用所有字段
          const airportData = {
            ...values,
            relatedRoutes: values.relatedRoutes || [],
            id: Date.now().toString(),
            ediCodes: [],
            status: 'enabled' as const
          };

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

  // 搜索选择弹窗相关功能
  // 处理港口库搜索
  const handlePortLibrarySearch = () => {
    let filtered = portLibraryData.filter(port => 
      !seaPortData.some(existingPort => existingPort.id === port.id)
    );

    // 关键词搜索
    if (addSearchParams.keyword) {
      filtered = filtered.filter(port => 
        port.portNameEn.toLowerCase().includes(addSearchParams.keyword.toLowerCase()) ||
        port.portNameCn.includes(addSearchParams.keyword) ||
        port.unLocation.toLowerCase().includes(addSearchParams.keyword.toLowerCase())
      );
    }

    // 国家筛选
    if (addSearchParams.country) {
      filtered = filtered.filter(port => port.country === addSearchParams.country);
    }

    // 基港筛选
    if (addSearchParams.isBasePort) {
      filtered = filtered.filter(port => 
        port.isBasePort === (addSearchParams.isBasePort === 'true')
      );
    }

    setFilteredPortLibrary(filtered);
  };

  // 重置港口库搜索
  const handlePortLibraryReset = () => {
    setAddSearchParams({ keyword: '', country: '', isBasePort: '' });
    const availablePorts = portLibraryData.filter(port => 
      !seaPortData.some(existingPort => existingPort.id === port.id)
    );
    setFilteredPortLibrary(availablePorts);
  };

  // 确认添加选中的港口
  const handleConfirmAddPorts = () => {
    if (selectedPortIds.length === 0) {
      Message.warning('请选择要添加的港口');
      return;
    }

    const portsToAdd = portLibraryData.filter(port => selectedPortIds.includes(port.id));
    
    // 添加到海港数据中
    setSeaPortData(prev => [...prev, ...portsToAdd]);
    setFilteredData(prev => [...prev, ...portsToAdd]);
    
    setAddPortModalVisible(false);
    setSelectedPortIds([]);
    Message.success(`成功添加 ${portsToAdd.length} 个海港`);
  };

  // 空港搜索选择弹窗相关功能
  // 处理机场库搜索
  const handleAirportLibrarySearch = () => {
    let filtered = airportLibraryData.filter(airport => 
      !airportData.some(existingAirport => existingAirport.id === airport.id)
    );

    // 关键词搜索
    if (addAirportSearchParams.keyword) {
      filtered = filtered.filter(airport => 
        airport.portNameEn.toLowerCase().includes(addAirportSearchParams.keyword.toLowerCase()) ||
        airport.portNameCn.includes(addAirportSearchParams.keyword) ||
        airport.iataCode.toLowerCase().includes(addAirportSearchParams.keyword.toLowerCase())
      );
    }

    // 国家筛选
    if (addAirportSearchParams.country) {
      filtered = filtered.filter(airport => airport.country === addAirportSearchParams.country);
    }

    setFilteredAirportLibrary(filtered);
  };

  // 重置机场库搜索
  const handleAirportLibraryReset = () => {
    setAddAirportSearchParams({ keyword: '', country: '' });
    const availableAirports = airportLibraryData.filter(airport => 
      !airportData.some(existingAirport => existingAirport.id === airport.id)
    );
    setFilteredAirportLibrary(availableAirports);
  };

  // 确认添加选中的机场
  const handleConfirmAddAirports = () => {
    if (selectedAirportIds.length === 0) {
      Message.warning('请选择要添加的机场');
      return;
    }

    const airportsToAdd = airportLibraryData.filter(airport => selectedAirportIds.includes(airport.id));
    
    // 添加到空港数据中
    setAirportData(prev => [...prev, ...airportsToAdd]);
    setFilteredAirportData(prev => [...prev, ...airportsToAdd]);
    
    setAddAirportModalVisible(false);
    setSelectedAirportIds([]);
    Message.success(`成功添加 ${airportsToAdd.length} 个空港`);
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
            columns={seaPortColumns}
            data={filteredData}
            rowKey="id"
            scroll={{ x: 2140 }}
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
            columns={airportColumns}
            data={filteredAirportData}
            rowKey="id"
            scroll={{ x: 1750 }}
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
        {/* 海港编辑时使用只读 + 可编辑混合模式 */}
        {activeTab === 'seaport' && isEditing ? (
          <div>
            {/* 基本信息展示（只读） */}
            <div style={{ marginBottom: '24px' }}>
              <Typography.Title heading={6} style={{ marginBottom: '16px', color: '#1D2129' }}>
                基本信息
              </Typography.Title>
              <Descriptions 
                column={2} 
                labelStyle={{ fontWeight: 'bold', color: '#4E5969' }}
                valueStyle={{ color: '#1D2129' }}
                data={[
                  {
                    label: '港口全称（英文）',
                    value: currentPort?.portNameEn || '-'
                  },
                  {
                    label: '港口全称（中文）',
                    value: currentPort?.portNameCn || '-'
                  },
                  {
                    label: 'UN Location',
                    value: (currentPort as SeaPort)?.unLocation || '-'
                  },
                  {
                    label: '国家（地区）',
                    value: (() => {
                      const countryOption = countryOptions.find(option => option.value === currentPort?.country);
                      return countryOption ? countryOption.label : currentPort?.country || '-';
                    })()
                  },
                  {
                    label: 'AMS港口代码',
                    value: (currentPort as SeaPort)?.amsPortCode || '-'
                  },
                  {
                    label: '经度',
                    value: currentPort?.longitude || '-'
                  },
                  {
                    label: '纬度',
                    value: currentPort?.latitude || '-'
                  },
                  {
                    label: '是否基港',
                    value: (
                      <Tag color={(currentPort as SeaPort)?.isBasePort ? 'green' : 'gray'}>
                        {(currentPort as SeaPort)?.isBasePort ? '是' : '否'}
                      </Tag>
                    )
                  }
                ]}
              />
            </div>

            {/* 可编辑字段 */}
            <div style={{ marginBottom: '16px' }}>
              <Typography.Title heading={6} style={{ marginBottom: '16px', color: '#1D2129' }}>
                可编辑信息
              </Typography.Title>
              <Form form={editForm} layout="vertical">
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
              </Form>
            </div>
          </div>
        ) : activeTab === 'airport' && isEditing ? (
          /* 空港编辑时使用只读 + 可编辑混合模式 */
          <div>
            {/* 基本信息展示（只读） */}
            <div style={{ marginBottom: '24px' }}>
              <Typography.Title heading={6} style={{ marginBottom: '16px', color: '#1D2129' }}>
                基本信息
              </Typography.Title>
              <Descriptions 
                column={2} 
                labelStyle={{ fontWeight: 'bold', color: '#4E5969' }}
                valueStyle={{ color: '#1D2129' }}
                data={[
                  {
                    label: '机场全称（英文）',
                    value: currentPort?.portNameEn || '-'
                  },
                  {
                    label: '机场全称（中文）',
                    value: currentPort?.portNameCn || '-'
                  },
                  {
                    label: 'IATA代码',
                    value: (currentPort as Airport)?.iataCode || '-'
                  },
                  {
                    label: '国家（地区）',
                    value: (() => {
                      const countryOption = countryOptions.find(option => option.value === currentPort?.country);
                      return countryOption ? countryOption.label : currentPort?.country || '-';
                    })()
                  },
                  {
                    label: 'AMS港口代码',
                    value: (currentPort as Airport)?.amsPortCode || '-'
                  },
                  {
                    label: '经度',
                    value: currentPort?.longitude || '-'
                  },
                  {
                    label: '纬度',
                    value: currentPort?.latitude || '-'
                  }
                ]}
              />
            </div>

            {/* 可编辑字段 */}
            <div style={{ marginBottom: '16px' }}>
              <Typography.Title heading={6} style={{ marginBottom: '16px', color: '#1D2129' }}>
                可编辑信息
              </Typography.Title>
              <Form form={editForm} layout="vertical">
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
              </Form>
            </div>
          </div>
        ) : (
          /* 新增时使用原来的表单模式 */
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
        )}
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

      {/* 新增海港搜索选择弹窗 */}
      <Modal
        title="新增海港"
        visible={addPortModalVisible}
        onOk={handleConfirmAddPorts}
        onCancel={() => setAddPortModalVisible(false)}
        style={{ width: 1000 }}
        okText="确认增加"
        cancelText="取消"
      >
        {/* 搜索筛选区域 */}
        <Card style={{ marginBottom: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '16px', alignItems: 'flex-end' }}>
            <div>
              <div style={{ marginBottom: '4px', fontSize: '14px', color: '#666' }}>关键词搜索</div>
              <Input
                placeholder="港口名称、UN Location"
                value={addSearchParams.keyword}
                onChange={(value) => setAddSearchParams(prev => ({ ...prev, keyword: value }))}
              />
            </div>
            <div>
              <div style={{ marginBottom: '4px', fontSize: '14px', color: '#666' }}>国家地区</div>
              <Select
                placeholder="选择国家"
                value={addSearchParams.country}
                onChange={(value) => setAddSearchParams(prev => ({ ...prev, country: value }))}
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
                value={addSearchParams.isBasePort}
                onChange={(value) => setAddSearchParams(prev => ({ ...prev, isBasePort: value }))}
                allowClear
              >
                <Option value="true">是</Option>
                <Option value="false">否</Option>
              </Select>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button type="primary" icon={<IconSearch />} onClick={handlePortLibrarySearch}>
                搜索
              </Button>
              <Button icon={<IconRefresh />} onClick={handlePortLibraryReset}>
                重置
              </Button>
            </div>
          </div>
        </Card>

        {/* 港口选择表格 */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
            已选择 {selectedPortIds.length} 个港口，共 {filteredPortLibrary.length} 个可选港口
          </div>
        </div>
        
        <Table
          rowKey="id"
          data={filteredPortLibrary}
          pagination={{
            pageSize: 8,
            showTotal: true,
            showJumper: true,
            sizeCanChange: false,
          }}
          scroll={{ x: 800, y: 400 }}
          columns={[
            {
              title: (
                <Checkbox
                  indeterminate={selectedPortIds.length > 0 && selectedPortIds.length < filteredPortLibrary.length}
                  checked={selectedPortIds.length === filteredPortLibrary.length && filteredPortLibrary.length > 0}
                  onChange={(checked) => {
                    if (checked) {
                      setSelectedPortIds(filteredPortLibrary.map(item => item.id));
                    } else {
                      setSelectedPortIds([]);
                    }
                  }}
                />
              ),
              dataIndex: 'checkbox',
              width: 60,
              render: (_: any, record: SeaPort) => (
                <Checkbox
                  checked={selectedPortIds.includes(record.id)}
                  onChange={(checked) => {
                    if (checked) {
                      setSelectedPortIds([...selectedPortIds, record.id]);
                    } else {
                      setSelectedPortIds(selectedPortIds.filter(id => id !== record.id));
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
          ]}
                 />
       </Modal>

       {/* 新增空港搜索选择弹窗 */}
       <Modal
         title="新增空港"
         visible={addAirportModalVisible}
         onOk={handleConfirmAddAirports}
         onCancel={() => setAddAirportModalVisible(false)}
         style={{ width: 1000 }}
         okText="确认增加"
         cancelText="取消"
       >
         {/* 搜索筛选区域 */}
         <Card style={{ marginBottom: '16px' }}>
           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '16px', alignItems: 'flex-end' }}>
             <div>
               <div style={{ marginBottom: '4px', fontSize: '14px', color: '#666' }}>关键词搜索</div>
               <Input
                 placeholder="机场名称、IATA代码"
                 value={addAirportSearchParams.keyword}
                 onChange={(value) => setAddAirportSearchParams(prev => ({ ...prev, keyword: value }))}
               />
             </div>
             <div>
               <div style={{ marginBottom: '4px', fontSize: '14px', color: '#666' }}>国家地区</div>
               <Select
                 placeholder="选择国家"
                 value={addAirportSearchParams.country}
                 onChange={(value) => setAddAirportSearchParams(prev => ({ ...prev, country: value }))}
                 allowClear
               >
                 {countryOptions.map(option => (
                   <Option key={option.value} value={option.value}>{option.label}</Option>
                 ))}
               </Select>
             </div>
             <div style={{ display: 'flex', gap: '8px' }}>
               <Button type="primary" icon={<IconSearch />} onClick={handleAirportLibrarySearch}>
                 搜索
               </Button>
               <Button icon={<IconRefresh />} onClick={handleAirportLibraryReset}>
                 重置
               </Button>
             </div>
           </div>
         </Card>

         {/* 机场选择表格 */}
         <div style={{ marginBottom: '16px' }}>
           <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
             已选择 {selectedAirportIds.length} 个机场，共 {filteredAirportLibrary.length} 个可选机场
           </div>
         </div>
         
         <Table
           rowKey="id"
           data={filteredAirportLibrary}
           pagination={{
             pageSize: 8,
             showTotal: true,
             showJumper: true,
             sizeCanChange: false,
           }}
           scroll={{ x: 800, y: 400 }}
           columns={[
             {
               title: (
                 <Checkbox
                   indeterminate={selectedAirportIds.length > 0 && selectedAirportIds.length < filteredAirportLibrary.length}
                   checked={selectedAirportIds.length === filteredAirportLibrary.length && filteredAirportLibrary.length > 0}
                   onChange={(checked) => {
                     if (checked) {
                       setSelectedAirportIds(filteredAirportLibrary.map(item => item.id));
                     } else {
                       setSelectedAirportIds([]);
                     }
                   }}
                 />
               ),
               dataIndex: 'checkbox',
               width: 60,
               render: (_: any, record: Airport) => (
                 <Checkbox
                   checked={selectedAirportIds.includes(record.id)}
                   onChange={(checked) => {
                     if (checked) {
                       setSelectedAirportIds([...selectedAirportIds, record.id]);
                     } else {
                       setSelectedAirportIds(selectedAirportIds.filter(id => id !== record.id));
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
           ]}
         />
       </Modal>
    </Card>
  );
};

export default PortManagement; 