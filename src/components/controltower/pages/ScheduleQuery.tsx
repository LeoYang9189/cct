import React, { useState } from 'react';
import './ScheduleQuery.css';
import {
  Card,
  Button,
  Space,
  Select,
  Table,
  Tag,
  Typography,
  Grid,
  Empty,
  Message,
  Tooltip
} from '@arco-design/web-react';
import {
  IconSearch,
  IconRefresh,
  IconLocation,
  IconCalendarClock,
  IconStar,
  IconPhone,
  IconQuestionCircle,
  IconClockCircle
} from '@arco-design/web-react/icon';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { Row, Col } = Grid;
const Option = Select.Option;

// 接口定义
interface PortOption {
  value: string;
  label: string;
  country: string;
}

// 共舱方信息接口
interface SpaceSharingInfo {
  carrier: string;
  internalVoyage: string;
  spaceAgent: string;
  dangerousAgent: string;
}

// 操船方信息接口
interface OperatingCarrierInfo {
  carrier: string;
  internalVoyage: string;
  spaceAgent: string;
  dangerousAgent: string;
}

interface RouteSchedule {
  id: string;
  routeCode: string;
  alliance: string;
  spaceSharing: SpaceSharingInfo[];
  operatingCarrier: OperatingCarrierInfo;
  originPort: {
    port: string;
    portName: string;
    portNameEn: string;
    eta: string;
    etd: string;
  };
  destinationPort: {
    port: string;
    portName: string;
    portNameEn: string;
    eta: string;
    etd: string;
  };
  transitDays: number;
  serviceType: 'direct' | 'transit';
  transitPorts?: {
    port: string;
    portName: string;
    eta: string;
    etd: string;
  }[];
  cutoffTimes?: {
    cargo: string;
    doc: string;
    vgm: string;
    dangerous?: string;
  };
  hasRates: boolean;
  rateCount?: number;
  minPrice?: number;
  currency?: string;
  shipName: string;
  operatingVoyage: string;
}

// 模拟港口数据
const mockPorts: PortOption[] = [
  { value: 'CNSHA', label: '上海港 Shanghai', country: 'CN' },
  { value: 'CNNGB', label: '宁波港 Ningbo', country: 'CN' },
  { value: 'CNSZX', label: '深圳港 Shenzhen', country: 'CN' },
  { value: 'CNYTN', label: '烟台港 Yantai', country: 'CN' },
  { value: 'SGSIN', label: '新加坡港 Singapore', country: 'SG' },
  { value: 'DEHAM', label: '汉堡港 Hamburg', country: 'DE' },
  { value: 'NLRTM', label: '鹿特丹港 Rotterdam', country: 'NL' },
  { value: 'USNYC', label: '纽约港 New York', country: 'US' },
  { value: 'USLAX', label: '洛杉矶港 Los Angeles', country: 'US' },
  { value: 'USOAK', label: '奥克兰港 Oakland', country: 'US' },
  { value: 'GBFXT', label: '费力克斯托港 Felixstowe', country: 'GB' },
  { value: 'BEBRU', label: '布鲁日港 Bruges', country: 'BE' },
  { value: 'FRLEZ', label: '勒阿弗尔港 Le Havre', country: 'FR' },
  { value: 'ITGIT', label: '焦亚陶罗港 Gioia Tauro', country: 'IT' },
  { value: 'AEPZA', label: '萨义德港 Port Said', country: 'AE' }
];

// 模拟船期数据
const mockSchedules: RouteSchedule[] = [
  {
    id: '1',
    routeCode: 'AE7',
    alliance: '双子星联盟（Gemini）',
    spaceSharing: [
      {
        carrier: 'MAERSK',
        internalVoyage: 'AE7-001W',
        spaceAgent: '马士基(中国)有限公司',
        dangerousAgent: '马士基危险品部'
      },
      {
        carrier: 'MSC',
        internalVoyage: 'MSC-AE7-001',
        spaceAgent: '地中海航运(上海)有限公司',
        dangerousAgent: '地中海危险品代理'
      }
    ],
    operatingCarrier: {
      carrier: 'EVERGREEN',
      internalVoyage: 'EV001W',
      spaceAgent: '长荣海运(上海)有限公司',
      dangerousAgent: '长荣危险品代理'
    },
    originPort: {
      port: 'CNSHA',
      portName: '上海港',
      portNameEn: 'Shanghai',
      eta: '2025-01-15 16:00',
      etd: '2025-01-15 18:00'
    },
    destinationPort: {
      port: 'DEHAM',
      portName: '汉堡港', 
      portNameEn: 'Hamburg', 
      eta: '2025-02-18 08:00',
      etd: '2025-02-18 12:00'
    },
    transitDays: 34,
    serviceType: 'transit',
    transitPorts: [
      {
        port: 'SGSIN',
        portName: '新加坡港',
        eta: '2025-01-22 14:00',
        etd: '2025-01-24 10:00'
      },
      {
        port: 'AEPZA',
        portName: '萨义德港',
        eta: '2025-02-05 16:00',
        etd: '2025-02-06 20:00'
      }
    ],
    cutoffTimes: {
      cargo: '2025-01-13 17:00',
      doc: '2025-01-14 12:00',
      vgm: '2025-01-14 16:00',
      dangerous: '2025-01-12 17:00'
    },
    hasRates: true,
    rateCount: 12,
    minPrice: 2850,
    currency: 'USD',
    shipName: 'EVER LOGIC',
    operatingVoyage: 'EV001W'
  },
  {
    id: '2',
    routeCode: 'AE8',
    alliance: '双子星联盟（Gemini）',
    spaceSharing: [
      {
        carrier: 'MAERSK',
        internalVoyage: 'AE8-002W',
        spaceAgent: '马士基(中国)有限公司',
        dangerousAgent: '马士基危险品部'
      },
      {
        carrier: 'MSC',
        internalVoyage: 'MSC-AE8-002',
        spaceAgent: '地中海航运(上海)有限公司',
        dangerousAgent: '地中海危险品代理'
      }
    ],
    operatingCarrier: {
      carrier: 'MSC',
      internalVoyage: 'MSC002W',
      spaceAgent: '地中海航运(上海)有限公司',
      dangerousAgent: '地中海危险品代理'
    },
    originPort: {
      port: 'CNSHA',
      portName: '上海港',
      portNameEn: 'Shanghai',
      eta: '2025-01-20 14:00',
      etd: '2025-01-20 16:00'
    },
    destinationPort: {
      port: 'DEHAM',
      portName: '汉堡港',
      portNameEn: 'Hamburg',
      eta: '2025-02-25 10:00',
      etd: '2025-02-25 14:00'
    },
    transitDays: 36,
    serviceType: 'transit',
    transitPorts: [
      {
        port: 'SGSIN',
        portName: '新加坡港',
        eta: '2025-01-27 12:00',
        etd: '2025-01-29 08:00'
      },
      {
        port: 'NLRTM',
        portName: '鹿特丹港',
        eta: '2025-02-20 14:00',
        etd: '2025-02-22 16:00'
      }
    ],
    cutoffTimes: {
      cargo: '2025-01-18 17:00',
      doc: '2025-01-19 12:00',
      vgm: '2025-01-19 16:00'
    },
    hasRates: false,
    shipName: 'MSC ZIVA',
    operatingVoyage: 'MSC002W'
  },
  {
    id: '3',
    routeCode: 'TP1',
    alliance: 'PA联盟 (Premier Alliance)',
    spaceSharing: [
      {
        carrier: 'HAPAG',
        internalVoyage: 'TP1-003E',
        spaceAgent: '赫伯罗特(上海)有限公司',
        dangerousAgent: '赫伯罗特危险品部'
      },
      {
        carrier: 'ONE',
        internalVoyage: 'ONE-TP1-003',
        spaceAgent: '海洋网联船务(中国)有限公司',
        dangerousAgent: 'ONE危险品代理'
      },
      {
        carrier: 'YANG_MING',
        internalVoyage: 'YM-TP1-003',
        spaceAgent: '阳明海运(中国)有限公司',
        dangerousAgent: '阳明危险品部'
      }
    ],
    operatingCarrier: {
      carrier: 'COSCO',
      internalVoyage: 'COSCO003E',
      spaceAgent: '中远海运集装箱运输有限公司',
      dangerousAgent: '中远海运危险品部'
    },
    originPort: {
      port: 'CNSHA',
      portName: '上海港',
      portNameEn: 'Shanghai',
      eta: '2025-01-18 18:00',
      etd: '2025-01-18 20:00'
    },
    destinationPort: {
      port: 'USLAX',
      portName: '洛杉矶港',
      portNameEn: 'Los Angeles',
      eta: '2025-02-02 14:00',
      etd: '2025-02-02 18:00'
    },
    transitDays: 15,
    serviceType: 'direct',
    cutoffTimes: {
      cargo: '2025-01-16 17:00',
      doc: '2025-01-17 12:00',
      vgm: '2025-01-17 16:00',
      dangerous: '2025-01-15 17:00'
    },
    hasRates: true,
    rateCount: 8,
    minPrice: 1650,
    currency: 'USD',
    shipName: 'COSCO SHIPPING UNIVERSE',
    operatingVoyage: 'COSCO003E'
  },
  {
    id: '4',
    routeCode: 'AE19',
    alliance: '海洋OA联盟（Ocean Alliance）',
    spaceSharing: [
      {
        carrier: 'COSCO',
        internalVoyage: 'AE19-004W',
        spaceAgent: '中远海运集装箱运输有限公司',
        dangerousAgent: '中远海运危险品部'
      },
      {
        carrier: 'EVERGREEN',
        internalVoyage: 'EMC-AE19-004',
        spaceAgent: '长荣海运(上海)有限公司',
        dangerousAgent: '长荣危险品代理'
      },
      {
        carrier: 'OOCL',
        internalVoyage: 'OOCL-AE19-004',
        spaceAgent: '东方海外货柜航运(中国)有限公司',
        dangerousAgent: 'OOCL危险品部'
      }
    ],
    operatingCarrier: {
      carrier: 'EVERGREEN',
      internalVoyage: 'EMC004W',
      spaceAgent: '长荣海运(上海)有限公司',
      dangerousAgent: '长荣危险品代理'
    },
    originPort: {
      port: 'CNNGB',
      portName: '宁波港',
      portNameEn: 'Ningbo',
      eta: '2025-01-22 12:00',
      etd: '2025-01-22 14:00'
    },
    destinationPort: {
      port: 'DEHAM',
      portName: '汉堡港',
      portNameEn: 'Hamburg',
      eta: '2025-02-28 12:00',
      etd: '2025-02-28 16:00'
    },
    transitDays: 37,
    serviceType: 'transit',
    transitPorts: [
      {
        port: 'SGSIN',
        portName: '新加坡港',
        eta: '2025-01-29 10:00',
        etd: '2025-01-31 16:00'
      },
      {
        port: 'AEPZA',
        portName: '萨义德港',
        eta: '2025-02-10 12:00',
        etd: '2025-02-11 18:00'
      },
      {
        port: 'NLRTM',
        portName: '鹿特丹港',
        eta: '2025-02-24 08:00',
        etd: '2025-02-26 14:00'
      }
    ],
    cutoffTimes: {
      cargo: '2025-01-20 17:00',
      doc: '2025-01-21 12:00',
      vgm: '2025-01-21 16:00',
      dangerous: '2025-01-19 17:00'
    },
    hasRates: true,
    rateCount: 15,
    minPrice: 2680,
    currency: 'USD',
    shipName: 'EVER GIVEN',
    operatingVoyage: 'EMC004W'
  },
  {
    id: '5',
    routeCode: 'TP3',
    alliance: 'PA联盟 (Premier Alliance)',
    spaceSharing: [
      {
        carrier: 'HAPAG',
        internalVoyage: 'TP3-005E',
        spaceAgent: '赫伯罗特(上海)有限公司',
        dangerousAgent: '赫伯罗特危险品部'
      },
      {
        carrier: 'ONE',
        internalVoyage: 'ONE-TP3-005',
        spaceAgent: '海洋网联船务(中国)有限公司',
        dangerousAgent: 'ONE危险品代理'
      },
      {
        carrier: 'YANG_MING',
        internalVoyage: 'YM-TP3-005',
        spaceAgent: '阳明海运(中国)有限公司',
        dangerousAgent: '阳明危险品部'
      }
    ],
    operatingCarrier: {
      carrier: 'OOCL',
      internalVoyage: 'OOCL005E',
      spaceAgent: '东方海外货柜航运(中国)有限公司',
      dangerousAgent: 'OOCL危险品部'
    },
    originPort: {
      port: 'CNSZX',
      portName: '深圳港',
      portNameEn: 'Shenzhen',
      eta: '2025-01-25 16:00',
      etd: '2025-01-25 18:00'
    },
    destinationPort: {
      port: 'USLAX',
      portName: '洛杉矶港',
      portNameEn: 'Los Angeles',
      eta: '2025-02-10 16:00',
      etd: '2025-02-10 20:00'
    },
    transitDays: 16,
    serviceType: 'direct',
    cutoffTimes: {
      cargo: '2025-01-23 17:00',
      doc: '2025-01-24 12:00',
      vgm: '2025-01-24 16:00'
    },
    hasRates: false,
    shipName: 'OOCL EUROPE',
    operatingVoyage: 'OOCL005E'
  }
];

const ScheduleQuery: React.FC = () => {
  const navigate = useNavigate();
  const [originPort, setOriginPort] = useState<string>('');
  const [destinationPort, setDestinationPort] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [schedules, setSchedules] = useState<RouteSchedule[]>([]);
  const [searched, setSearched] = useState(false);

  // 处理查询
  const handleSearch = async () => {
    if (!originPort || !destinationPort) {
      Message.warning('请选择起运港和目的港');
      return;
    }

    if (originPort === destinationPort) {
      Message.warning('起运港和目的港不能相同');
      return;
    }

    setLoading(true);
    setSearched(true);

    // 模拟API调用
    setTimeout(() => {
      const filteredSchedules = mockSchedules.filter(
        schedule => 
          schedule.originPort.port === originPort && 
          schedule.destinationPort.port === destinationPort
      );
      setSchedules(filteredSchedules);
      setLoading(false);
      
      if (filteredSchedules.length > 0) {
        Message.success(`找到 ${filteredSchedules.length} 条船期信息`);
      }
    }, 1000);
  };

  // 重置搜索
  const handleReset = () => {
    setOriginPort('');
    setDestinationPort('');
    setSchedules([]);
    setSearched(false);
  };

  // 跳转到询价页面
  const handleCreateInquiry = () => {
    navigate('/controltower/saas/create-inquiry/fcl');
  };

  // 跳转到运价查询页面
  const handleViewRates = () => {
    navigate('/controltower/saas/rate-query');
  };

  // 渲染运价匹配模块
  const renderRateModule = (schedule: RouteSchedule) => {
    if (schedule.hasRates) {
      return (
        <Card 
          className="rate-card"
          style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)'
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
              <IconStar style={{ fontSize: 20, color: '#FFD700', marginRight: 8 }} />
              <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
                匹配运价
              </Text>
            </div>
            <div style={{ marginBottom: 12 }}>
              <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 14 }}>
                找到 {schedule.rateCount} 个运价方案
              </Text>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Text className="rate-price price-animation">
                ${schedule.minPrice}
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, marginLeft: 4 }}>
                起/20GP
              </Text>
            </div>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button 
                type="primary" 
                size="small"
                className="rate-button"
                style={{ 
                  width: '100%',
                  background: 'rgba(255,255,255,0.2)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  backdropFilter: 'blur(10px)',
                  zIndex: 1
                }}
                onClick={handleViewRates}
              >
                查看运价详情
              </Button>
              <Button 
                size="small"
                className="rate-button"
                style={{ 
                  width: '100%',
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.5)',
                  color: 'white',
                  zIndex: 1
                }}
                icon={<IconPhone />}
                onClick={handleCreateInquiry}
              >
                立即询价
              </Button>
            </Space>
          </div>
        </Card>
      );
    } else {
      return (
        <Card 
          className="no-rate-card"
          style={{ 
            background: 'linear-gradient(135deg, #ff9a56 0%, #ff6b95 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(255, 154, 86, 0.3)'
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
              <IconQuestionCircle style={{ fontSize: 20, color: '#FFE135', marginRight: 8 }} />
              <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
                暂无运价
              </Text>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 14 }}>
                该船期暂无公开运价
              </Text>
            </div>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button 
                type="primary" 
                size="small"
                className="rate-button"
                style={{ 
                  width: '100%',
                  background: 'rgba(255,255,255,0.2)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  backdropFilter: 'blur(10px)',
                  zIndex: 1
                }}
                icon={<IconPhone />}
                onClick={handleCreateInquiry}
              >
                立即询价
              </Button>
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
                专属销售为您第一时间报价
              </Text>
            </Space>
          </div>
        </Card>
      );
    }
  };

  // 表格列定义
  const columns = [
    {
      title: '航线信息',
      dataIndex: 'routeInfo',
      width: 120,
      render: (_: any, record: RouteSchedule) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{record.routeCode}</Text>
          </div>
          <div style={{ marginTop: 4 }}>
            <Tag color="green" size="small">{record.alliance}</Tag>
          </div>
        </div>
      )
    },
    {
      title: '共舱方',
      dataIndex: 'spaceSharing',
      width: 140,
      render: (_: any, record: RouteSchedule) => (
        <div>
          {/* 操船方 - 使用不同的样式 */}
          <Tooltip
            content={
              <div>
                <div><strong>内部航次:</strong> {record.operatingCarrier.internalVoyage}</div>
                <div><strong>舱位船代:</strong> {record.operatingCarrier.spaceAgent}</div>
                <div><strong>危险品船代:</strong> {record.operatingCarrier.dangerousAgent}</div>
              </div>
            }
          >
            <Tag 
              color="orange" 
              size="small" 
              style={{ 
                marginBottom: 4, 
                cursor: 'pointer',
                display: 'block',
                textAlign: 'center',
                fontWeight: 'bold',
                border: '2px solid #ff9800'
              }}
            >
              {record.operatingCarrier.carrier}
            </Tag>
          </Tooltip>
          
          {/* 共舱方 */}
          {record.spaceSharing.map((sharing, index) => (
            <Tooltip
              key={index}
              content={
                <div>
                  <div><strong>内部航次:</strong> {sharing.internalVoyage}</div>
                  <div><strong>舱位船代:</strong> {sharing.spaceAgent}</div>
                  <div><strong>危险品船代:</strong> {sharing.dangerousAgent}</div>
                </div>
              }
            >
              <Tag 
                color="blue" 
                size="small" 
                style={{ 
                  marginBottom: 4, 
                  cursor: 'pointer',
                  display: 'block',
                  textAlign: 'center'
                }}
              >
                {sharing.carrier}
              </Tag>
            </Tooltip>
          ))}
        </div>
      )
    },
    {
      title: '船名航次',
      dataIndex: 'vessel',
      width: 160,
      render: (_: any, record: RouteSchedule) => (
        <div>
          <div style={{ marginBottom: 4 }}>
            <Text style={{ fontWeight: 'bold' }}>{record.shipName}</Text>
          </div>
          <div>
            <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#1890ff' }}>
              {record.operatingVoyage}
            </Text>
          </div>
        </div>
      )
    },
    {
      title: '起运港信息',
      dataIndex: 'origin',
      width: 220,
      render: (_: any, record: RouteSchedule) => (
        <div>
          {/* 截止时间按钮放在顶部 */}
          {record.cutoffTimes && (
            <div style={{ marginBottom: 8 }}>
              <Tooltip
                content={
                  <div>
                    <div><strong>截货:</strong> {record.cutoffTimes.cargo}</div>
                    <div><strong>截单:</strong> {record.cutoffTimes.doc}</div>
                    <div><strong>截VGM:</strong> {record.cutoffTimes.vgm}</div>
                    {record.cutoffTimes.dangerous && (
                      <div><strong>截危:</strong> {record.cutoffTimes.dangerous}</div>
                    )}
                  </div>
                }
              >
                <Button 
                  size="mini" 
                  type="outline"
                  icon={<IconClockCircle />}
                  style={{ fontSize: 11 }}
                  className="cutoff-button"
                >
                  截止时间
                </Button>
              </Tooltip>
            </div>
          )}
          
          <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 4 }}>
            <IconLocation style={{ color: '#52c41a', marginRight: 4, marginTop: 2 }} />
            <div>
              <div style={{ fontWeight: 'bold', fontSize: 14, lineHeight: '16px' }}>
                {record.originPort.portName}
              </div>
              <div style={{ fontSize: 12, color: '#666', lineHeight: '14px' }}>
                {record.originPort.portNameEn}
              </div>
            </div>
          </div>
          <div style={{ marginBottom: 2, whiteSpace: 'nowrap' }}>
            <Text style={{ fontSize: 12, color: '#666' }}>ETA: </Text>
            <Text style={{ fontSize: 12, fontWeight: 'bold' }}>{record.originPort.eta}</Text>
          </div>
          <div style={{ marginBottom: 2, whiteSpace: 'nowrap' }}>
            <Text style={{ fontSize: 12, color: '#666' }}>ETD: </Text>
            <Text style={{ fontSize: 12, fontWeight: 'bold' }}>{record.originPort.etd}</Text>
          </div>
        </div>
      )
    },
    {
      title: '目的港信息',
      dataIndex: 'destination',
      width: 220,
      render: (_: any, record: RouteSchedule) => (
        <div>
          {/* 添加占位空间，确保与起运港对齐 */}
          <div style={{ height: record.cutoffTimes ? '32px' : '0px', marginBottom: record.cutoffTimes ? 8 : 0 }}>
            {/* 占位空间，保持与起运港对齐 */}
          </div>
          
          <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 4 }}>
            <IconLocation style={{ color: '#1890ff', marginRight: 4, marginTop: 2 }} />
            <div>
              <div style={{ fontWeight: 'bold', fontSize: 14, lineHeight: '16px' }}>
                {record.destinationPort.portName}
              </div>
              <div style={{ fontSize: 12, color: '#666', lineHeight: '14px' }}>
                {record.destinationPort.portNameEn}
              </div>
            </div>
          </div>
          <div style={{ marginBottom: 2, whiteSpace: 'nowrap' }}>
            <Text style={{ fontSize: 12, color: '#666' }}>ETA: </Text>
            <Text style={{ fontSize: 12, fontWeight: 'bold' }}>{record.destinationPort.eta}</Text>
          </div>
          <div style={{ marginBottom: 2, whiteSpace: 'nowrap' }}>
            <Text style={{ fontSize: 12, color: '#666' }}>ETD: </Text>
            <Text style={{ fontSize: 12, fontWeight: 'bold' }}>{record.destinationPort.etd}</Text>
          </div>
        </div>
      )
    },
    {
      title: '航程 & 服务',
      dataIndex: 'transit',
      width: 120,
      render: (_: any, record: RouteSchedule) => (
        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: 8 }}>
            <Text className="transit-days">
              {record.transitDays}
            </Text>
            <Text style={{ fontSize: 12, color: '#666', marginLeft: 2 }}>天</Text>
          </div>
          <div style={{ marginBottom: 8 }}>
          <Tag 
            color={record.serviceType === 'direct' ? 'green' : 'orange'}
            style={{ fontSize: 12 }}
          >
            {record.serviceType === 'direct' ? '直达' : '中转'}
          </Tag>
          </div>
          {record.transitPorts && record.transitPorts.length > 0 && (
            <Tooltip
              content={
                <div>
                  <div><strong>中转港信息:</strong></div>
                  {record.transitPorts.map((port, index) => (
                    <div key={index} style={{ marginTop: 4 }}>
                      <div><strong>{port.portName}:</strong></div>
                      <div>ETA: {port.eta}</div>
                      <div>ETD: {port.etd}</div>
                    </div>
                  ))}
                </div>
              }
            >
              <Text style={{ fontSize: 10, color: '#999', cursor: 'pointer' }}>
                经{record.transitPorts.length}个港口
              </Text>
            </Tooltip>
          )}
        </div>
      )
    },
    {
      title: '匹配运价',
      dataIndex: 'rates',
      width: 200,
      render: (_: any, record: RouteSchedule) => renderRateModule(record)
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* 搜索区域 */}
      <Card className="search-card" style={{ marginBottom: 24 }}>
        <Title heading={5} style={{ marginBottom: 24 }}>
          <IconSearch style={{ marginRight: 8 }} />
          船期查询
        </Title>
        
        <Row gutter={24} align="center">
          <Col span={8}>
            <div style={{ marginBottom: 8 }}>
              <Text style={{ fontWeight: 'bold' }}>起运港</Text>
            </div>
            <Select
              placeholder="请选择或输入起运港"
              value={originPort}
              onChange={setOriginPort}
              style={{ width: '100%' }}
              showSearch
              filterOption={(inputValue, option) => {
                const children = (option as any)?.props?.children?.toString() || '';
                const value = (option as any)?.props?.value?.toString() || '';
                return children.toLowerCase().includes(inputValue.toLowerCase()) ||
                       value.toLowerCase().includes(inputValue.toLowerCase());
              }}
            >
              {mockPorts.map(port => (
                <Option key={port.value} value={port.value}>
                  {port.label}
                </Option>
              ))}
            </Select>
          </Col>
          
          <Col span={8}>
            <div style={{ marginBottom: 8 }}>
              <Text style={{ fontWeight: 'bold' }}>目的港</Text>
            </div>
            <Select
              placeholder="请选择或输入目的港"
              value={destinationPort}
              onChange={setDestinationPort}
              style={{ width: '100%' }}
              showSearch
              filterOption={(inputValue, option) => {
                const children = (option as any)?.props?.children?.toString() || '';
                const value = (option as any)?.props?.value?.toString() || '';
                return children.toLowerCase().includes(inputValue.toLowerCase()) ||
                       value.toLowerCase().includes(inputValue.toLowerCase());
              }}
            >
              {mockPorts.map(port => (
                <Option key={port.value} value={port.value}>
                  {port.label}
                </Option>
              ))}
            </Select>
          </Col>
          
          <Col span={8}>
            <div style={{ marginBottom: 8 }}>
              <Text>&nbsp;</Text>
            </div>
            <Space>
              <Button 
                type="primary" 
                icon={<IconSearch />}
                loading={loading}
                onClick={handleSearch}
                size="large"
              >
                查询船期
              </Button>
              <Button 
                icon={<IconRefresh />}
                onClick={handleReset}
                size="large"
              >
                重置
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 查询结果 */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Title heading={6} style={{ margin: 0 }}>
            <IconCalendarClock style={{ marginRight: 8 }} />
            查询结果
          </Title>
          
          {searched && schedules.length > 0 && (
            <div className="result-stats">
              <Text style={{ color: '#1976d2', fontWeight: 'bold' }}>
                共找到 {schedules.length} 条船期信息，其中 {schedules.filter(s => s.hasRates).length} 条有匹配运价
              </Text>
            </div>
          )}
        </div>

        {!searched ? (
          <Empty 
            description="请选择起运港和目的港进行查询"
            style={{ padding: '40px 0' }}
          />
        ) : schedules.length === 0 ? (
          <Empty 
            description="暂无匹配的船期信息，请尝试其他港口或联系客服"
            style={{ padding: '40px 0' }}
          />
        ) : (
          <Table
            columns={columns}
            data={schedules}
            rowKey="id"
            pagination={false}
            loading={loading}
            scroll={{ x: 1000 }}
          />
        )}
      </Card>
    </div>
  );
};

export default ScheduleQuery;