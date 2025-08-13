import React, { useState } from 'react';
import {
  Table,
  Button,
  Space,
  Card,
  Typography,
  Input,
  Tag,
  Empty,
  Badge,
  DatePicker,
  Select
} from '@arco-design/web-react';
import {
  IconSearch,
  IconRefresh,
  IconLocation,
  IconUser,
  IconHistory,
  IconExport
} from '@arco-design/web-react/icon';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

// 集装箱历史记录数据类型
interface ContainerHistoryRecord {
  id: string;
  containerNo: string;
  dynamicCode: string;
  dynamicName: string;
  location: string;
  operator: string;
  timestamp: string;
  remark: string;
  vessel?: string;
  voyage?: string;
  terminal?: string;
}

const DynamicQueryPage: React.FC = () => {
  const [containerNo, setContainerNo] = useState('');
  const [historyRecords, setHistoryRecords] = useState<ContainerHistoryRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState<any>(null);
  const [selectedLocation, setSelectedLocation] = useState('');

  // 模拟历史记录数据
  const mockHistoryData: ContainerHistoryRecord[] = [
    {
      id: '1',
      containerNo: 'CONU1234567',
      dynamicCode: 'NBCU',
      dynamicName: '新箱启用',
      location: '上海港制造厂',
      operator: '张三',
      timestamp: '2024-01-15 09:30:00',
      remark: '新购集装箱完成检验后启用'
    },
    {
      id: '2',
      containerNo: 'CONU1234567',
      dynamicCode: 'MOVE',
      dynamicName: '场内移动',
      location: '上海港A1堆场',
      operator: '李四',
      timestamp: '2024-01-16 14:20:00',
      remark: '从制造厂移动到A1堆场存放'
    },
    {
      id: '3',
      containerNo: 'CONU1234567',
      dynamicCode: 'GATE',
      dynamicName: '闸口作业',
      location: '上海港1号闸口',
      operator: '王五',
      timestamp: '2024-01-20 08:45:00',
      remark: '集装箱进港，准备装货',
      vessel: 'COSCO SHANGHAI',
      voyage: '001E'
    },
    {
      id: '4',
      containerNo: 'CONU1234567',
      dynamicCode: 'DCHE',
      dynamicName: '空箱卸船',
      location: '上海港B3泊位',
      operator: '赵六',
      timestamp: '2024-01-22 16:15:00',
      remark: '空箱从船舶卸载到港口',
      vessel: 'EVER GIVEN',
      voyage: '202E',
      terminal: 'B3泊位'
    },
    {
      id: '5',
      containerNo: 'CONU1234567',
      dynamicCode: 'LOAD',
      dynamicName: '装船',
      location: '上海港B3泊位',
      operator: '孙七',
      timestamp: '2024-01-25 10:30:00',
      remark: '重箱装载到出口船舶',
      vessel: 'MSC OSCAR',
      voyage: '104W',
      terminal: 'B3泊位'
    },
    {
      id: '6',
      containerNo: 'CONU1234567',
      dynamicCode: 'RELE',
      dynamicName: '放箱',
      location: '洛杉矶港',
      operator: '周八',
      timestamp: '2024-02-10 14:00:00',
      remark: '货物到达目的港，放行给收货人'
    },
    {
      id: '7',
      containerNo: 'CONU1234567',
      dynamicCode: 'INSP',
      dynamicName: '检验检疫',
      location: '洛杉矶港海关',
      operator: '海关官员',
      timestamp: '2024-02-11 09:00:00',
      remark: '海关检验检疫'
    },
    {
      id: '8',
      containerNo: 'CONU1234567',
      dynamicCode: 'PICK',
      dynamicName: '提取货物',
      location: '洛杉矶港货运站',
      operator: '货代公司',
      timestamp: '2024-02-12 15:30:00',
      remark: '货物提取完成'
    },
    {
      id: '9',
      containerNo: 'CONU1234567',
      dynamicCode: 'DELI',
      dynamicName: '货物交付',
      location: '客户仓库',
      operator: '司机',
      timestamp: '2024-02-13 11:45:00',
      remark: '货物成功交付给客户'
    },
    {
      id: '10',
      containerNo: 'CONU1234567',
      dynamicCode: 'RETU',
      dynamicName: '空箱回收',
      location: '洛杉矶空箱堆场',
      operator: '堆场管理员',
      timestamp: '2024-02-14 16:20:00',
      remark: '空箱回收到堆场'
    },
    {
      id: '11',
      containerNo: 'CONU1234567',
      dynamicCode: 'CLEA',
      dynamicName: '清洗消毒',
      location: '洛杉矶清洗站',
      operator: '清洗工',
      timestamp: '2024-02-15 10:15:00',
      remark: '集装箱清洗消毒'
    },
    {
      id: '12',
      containerNo: 'CONU1234567',
      dynamicCode: 'STOR',
      dynamicName: '堆场存储',
      location: '洛杉矶A3堆场',
      operator: '堆场操作员',
      timestamp: '2024-02-16 14:00:00',
      remark: '空箱入库存储'
    }
  ];

  // 查询历史记录
  const handleSearch = () => {
    if (!containerNo.trim()) {
      return;
    }

    setLoading(true);
    
    // 模拟API调用延迟
    setTimeout(() => {
      // 筛选指定箱号的记录
      let filteredRecords = mockHistoryData.filter(record => 
        record.containerNo.toLowerCase().includes(containerNo.toLowerCase())
      );

      // 按日期范围筛选
      if (dateRange && dateRange.length === 2) {
        const [startDate, endDate] = dateRange;
        filteredRecords = filteredRecords.filter(record => {
          const recordDate = new Date(record.timestamp);
          return recordDate >= startDate && recordDate <= endDate;
        });
      }

      // 按位置筛选
      if (selectedLocation) {
        filteredRecords = filteredRecords.filter(record =>
          record.location.includes(selectedLocation)
        );
      }

      setHistoryRecords(filteredRecords);
      setLoading(false);
    }, 800);
  };

  // 清空查询
  const handleClear = () => {
    setContainerNo('');
    setHistoryRecords([]);
    setDateRange(null);
    setSelectedLocation('');
  };

  // 导出数据
  const handleExport = () => {
    if (historyRecords.length === 0) return;
    
    const csvContent = [
      '箱号,动态代码,操作名称,位置,操作员,时间,备注,船名,航次,码头',
      ...historyRecords.map(record => 
        `${record.containerNo},${record.dynamicCode},${record.dynamicName},${record.location},${record.operator},${record.timestamp},${record.remark},${record.vessel || ''},${record.voyage || ''},${record.terminal || ''}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${containerNo}_history.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 根据动态代码获取状态颜色
  const getStatusColor = (code: string) => {
    const colorMap: Record<string, string> = {
      'NBCU': 'blue',
      'MOVE': 'purple',
      'GATE': 'orange',
      'DCHE': 'green',
      'DCHF': 'cyan',
      'LOAD': 'red',
      'RELE': 'lime',
      'INSP': 'yellow',
      'PICK': 'pink',
      'DELI': 'indigo',
      'RETU': 'teal',
      'CLEA': 'emerald',
      'STOR': 'amber'
    };
    return colorMap[code] || 'gray';
  };

  // 表格列配置
  const columns = [
    {
      title: '时间',
      dataIndex: 'timestamp',
      width: 160,
      sorter: true,
      render: (timestamp: string) => (
        <div>
          <div className="font-mono text-sm">{timestamp.split(' ')[0]}</div>
          <div className="font-mono text-xs text-gray-500">{timestamp.split(' ')[1]}</div>
        </div>
      )
    },
    {
      title: '动态代码',
      dataIndex: 'dynamicCode',
      width: 120,
      render: (code: string) => (
        <Tag color={getStatusColor(code)} className="font-mono font-semibold">
          {code}
        </Tag>
      )
    },
    {
      title: '操作名称',
      dataIndex: 'dynamicName',
      width: 120
    },
    {
      title: '位置',
      dataIndex: 'location',
      width: 150,
      render: (location: string) => (
        <div className="flex items-center">
          <IconLocation className="mr-1 text-gray-400" />
          <span>{location}</span>
        </div>
      )
    },
    {
      title: '船名/航次',
      dataIndex: 'vessel',
      width: 150,
      render: (_: any, record: ContainerHistoryRecord) => {
        if (!record.vessel) return <span className="text-gray-400">-</span>;
        return (
          <div>
            <div className="font-semibold">{record.vessel}</div>
            <div className="text-xs text-gray-500">{record.voyage}</div>
          </div>
        );
      }
    },
    {
      title: '操作员',
      dataIndex: 'operator',
      width: 100,
      render: (operator: string) => (
        <div className="flex items-center">
          <IconUser className="mr-1 text-gray-400" />
          <span>{operator}</span>
        </div>
      )
    },
    {
      title: '备注',
      dataIndex: 'remark',
      ellipsis: true
    }
  ];

  return (
    <div className="p-6">
      {/* 查询区域 */}
      <Card className="mb-6">
        <Title heading={5} className="mb-4">
          <IconHistory className="mr-2" />
          集装箱动态查询
        </Title>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <Text className="block mb-2 font-medium">箱号</Text>
            <Input
              placeholder="请输入集装箱号"
              value={containerNo}
              onChange={(value) => setContainerNo(value)}
              onPressEnter={handleSearch}
              allowClear
            />
          </div>
          
          <div>
            <Text className="block mb-2 font-medium">日期范围</Text>
            <RangePicker
              style={{ width: '100%' }}
              value={dateRange}
              onChange={setDateRange}
              allowClear
            />
          </div>
          
          <div>
            <Text className="block mb-2 font-medium">位置</Text>
            <Select
              placeholder="选择位置"
              style={{ width: '100%' }}
              value={selectedLocation}
              onChange={setSelectedLocation}
              allowClear
            >
              <Option value="上海港">上海港</Option>
              <Option value="宁波港">宁波港</Option>
              <Option value="青岛港">青岛港</Option>
              <Option value="深圳港">深圳港</Option>
              <Option value="洛杉矶港">洛杉矶港</Option>
            </Select>
          </div>
          
          <div>
            <Text className="block mb-2 font-medium">操作</Text>
            <Space>
              <Button
                type="primary"
                icon={<IconSearch />}
                onClick={handleSearch}
                loading={loading}
              >
                查询
              </Button>
              <Button icon={<IconRefresh />} onClick={handleClear}>
                清空
              </Button>
            </Space>
          </div>
        </div>
      </Card>

      {/* 查询结果 */}
      {historyRecords.length > 0 && (
        <Card>
          <div className="flex justify-between items-center mb-4">
            <Title heading={6}>
              查询结果 - {containerNo} 
              <Badge 
                count={historyRecords.length} 
                style={{ marginLeft: 8 }}
              />
            </Title>
            <Button
              icon={<IconExport />}
              onClick={handleExport}
            >
              导出记录
            </Button>
          </div>

          {/* 时间线视图 */}
          <div className="mb-6">
            <Title heading={6} className="mb-4">操作时间线</Title>
            <div 
              className="overflow-x-auto overflow-y-hidden"
              style={{ 
                cursor: 'grab',
                scrollBehavior: 'smooth'
              }}
              onMouseDown={(e) => {
                const startX = e.pageX - (e.currentTarget as HTMLElement).offsetLeft;
                const scrollLeft = (e.currentTarget as HTMLElement).scrollLeft;
                
                const handleMouseMove = (e: MouseEvent) => {
                  const x = e.pageX - (e.currentTarget as any).offsetLeft;
                  const walk = (x - startX) * 2;
                  (e.currentTarget as any).scrollLeft = scrollLeft - walk;
                };
                
                const handleMouseUp = () => {
                  document.removeEventListener('mousemove', handleMouseMove);
                  document.removeEventListener('mouseup', handleMouseUp);
                  (e.currentTarget as HTMLElement).style.cursor = 'grab';
                };
                
                (e.currentTarget as HTMLElement).style.cursor = 'grabbing';
                document.addEventListener('mousemove', handleMouseMove);
                document.addEventListener('mouseup', handleMouseUp);
              }}
            >
              <div className="flex items-start p-4 min-w-max" style={{ position: 'relative' }}>
                {/* 连续的背景连接线 */}
                {historyRecords.length > 1 && (
                  <div 
                    style={{
                      position: 'absolute',
                      width: `${(historyRecords.length - 1) * 200}px`,
                      height: '2px',
                      backgroundColor: '#d1d5db',
                      top: '8px',
                      left: '104px', // 从第一个节点中心开始 (200px/2 - 96px)
                      zIndex: 1
                    }}
                  />
                )}
                
                {historyRecords.map((record) => (
                  <div key={record.id} className="flex flex-col items-center" style={{ minWidth: '200px', position: 'relative' }}>
                    
                    {/* 时间节点 */}
                    <div className="relative flex flex-col items-center">
                      <div 
                        className={`w-4 h-4 rounded-full bg-${getStatusColor(record.dynamicCode)}-500 border-2 border-white shadow-md relative z-10`}
                        style={{ marginBottom: '12px' }}
                      />
                      
                      {/* 节点内容 */}
                      <div className="text-center space-y-2">
                        <div>
                          <Tag color={getStatusColor(record.dynamicCode)} className="font-mono font-semibold">
                            {record.dynamicCode}
                          </Tag>
                        </div>
                        
                        <div className="font-semibold text-sm">
                          {record.dynamicName}
                        </div>
                        
                        <div className="text-xs text-gray-500">
                          {record.timestamp}
                        </div>
                        
                        <div className="text-xs text-gray-600">
                          <div className="flex items-center justify-center mb-1">
                            <IconLocation className="mr-1 w-3 h-3" />
                            <span>{record.location}</span>
                          </div>
                        </div>
                        
                        {record.vessel && (
                          <div className="text-xs text-blue-600">
                            {record.vessel} / {record.voyage}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* 拖拽提示 */}
            <div className="text-center text-xs text-gray-400 mt-2">
              <span>💡 提示：可以左右拖拽查看更多节点</span>
            </div>
          </div>

          {/* 表格视图 */}
          <div>
            <Title heading={6} className="mb-4">详细记录表</Title>
            <Table
              columns={columns}
              data={historyRecords}
              pagination={{
                showTotal: true,
                pageSize: 10,
                showJumper: true
              }}
              scroll={{ x: 1000 }}
              border={{
                wrapper: true,
                cell: true
              }}
            />
          </div>
        </Card>
      )}

      {/* 空状态 */}
      {!loading && historyRecords.length === 0 && containerNo && (
        <Card>
          <Empty 
            description="未找到相关记录"
            imgSrc="//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a0082b7754fbdb2d98a5c18d0b0edd25.png~tplv-uwbnlip3yd-webp.webp"
          />
        </Card>
      )}

      {/* 初始状态 */}
      {!containerNo && historyRecords.length === 0 && (
        <Card>
          <div className="text-center py-20">
            <IconHistory className="text-6xl text-gray-300 mb-4" />
            <Title heading={4} className="text-gray-400 mb-2">
              集装箱动态查询
            </Title>
            <Text className="text-gray-500">
              请输入集装箱号查看历史状态记录
            </Text>
          </div>
        </Card>
      )}
    </div>
  );
};

export default DynamicQueryPage; 