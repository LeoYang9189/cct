import React, { useState } from 'react';
import {
  Typography,
  Card,
  Button,
  Table,
  Space,
  Tabs,
  Statistic,
  Message,
  Spin,
  Tag,
  Divider,
  Grid
} from '@arco-design/web-react';
import {
  IconDownload,
  IconRefresh,
  IconCalendar,
  IconFile,
  IconDesktop,
  IconBook,
  IconLocation,
  IconHome
} from '@arco-design/web-react/icon';

const { Title } = Typography;
const TabPane = Tabs.TabPane;

// 报表类型枚举
enum ReportType {
  DAILY_INVENTORY = 'daily_inventory',
  LONG_STAY_CONTAINERS = 'long_stay_containers',
  REPAIR_WASH_CONTAINERS = 'repair_wash_containers',
  CONTAINER_FLOW = 'container_flow',
  YARD_UTILIZATION = 'yard_utilization'
}

// 报表配置
const REPORT_CONFIG = {
  [ReportType.DAILY_INVENTORY]: {
    title: '当日库存表',
    description: '显示各港口、堆场的集装箱库存情况',
    icon: <IconDesktop />
  },
  [ReportType.LONG_STAY_CONTAINERS]: {
    title: '长期滞留箱',
    description: '显示长期滞留在堆场的集装箱',
    icon: <IconCalendar />
  },
  [ReportType.REPAIR_WASH_CONTAINERS]: {
    title: '修洗箱统计',
    description: '显示修洗箱的统计报表',
    icon: <IconFile />
  },
  [ReportType.CONTAINER_FLOW]: {
    title: '集装箱流水',
    description: '显示集装箱进出港流水记录',
    icon: <IconBook />
  },
  [ReportType.YARD_UTILIZATION]: {
    title: '堆场利用率',
    description: '显示各堆场的利用率统计',
    icon: <IconHome />
  }
};

// 箱型枚举
enum ContainerType {
  GP20 = '20GP',
  GP40 = '40GP',
  HC40 = '40HC',
  GP45 = '45GP',
  RF20 = '20RF',
  RF40 = '40RF',
  OT20 = '20OT',
  OT40 = '40OT'
}

// 库存数据接口
interface InventoryData {
  key: string;
  port: string;
  yard: string;
  containerType: ContainerType;
  emptyCount: number;
  fullCount: number;
  totalCount: number;
  lastUpdated: string;
}

// 统计数据接口
interface InventorySummary {
  totalContainers: number;
  emptyContainers: number;
  fullContainers: number;
  totalYards: number;
}

const { Row, Col } = Grid;

const ReportingPage: React.FC = () => {
  const [selectedReportType, setSelectedReportType] = useState<ReportType | null>(null);
  const [loading, setLoading] = useState(false);
  const [inventoryData, setInventoryData] = useState<InventoryData[]>([]);
  const [inventorySummary, setInventorySummary] = useState<InventorySummary | null>(null);
  const [activeTab, setActiveTab] = useState('byYard');

  // 模拟库存数据
  const mockInventoryData: InventoryData[] = [
    {
      key: '1',
      port: '上海港',
      yard: '长胜2堆场',
      containerType: ContainerType.GP20,
      emptyCount: 150,
      fullCount: 80,
      totalCount: 230,
      lastUpdated: '2024-02-01 16:30:00'
    },
    {
      key: '2',
      port: '上海港',
      yard: '长胜2堆场',
      containerType: ContainerType.GP40,
      emptyCount: 120,
      fullCount: 60,
      totalCount: 180,
      lastUpdated: '2024-02-01 16:30:00'
    },
    {
      key: '3',
      port: '上海港',
      yard: '东海物流园',
      containerType: ContainerType.GP20,
      emptyCount: 200,
      fullCount: 120,
      totalCount: 320,
      lastUpdated: '2024-02-01 16:25:00'
    },
    {
      key: '4',
      port: '上海港',
      yard: '东海物流园',
      containerType: ContainerType.GP40,
      emptyCount: 180,
      fullCount: 100,
      totalCount: 280,
      lastUpdated: '2024-02-01 16:25:00'
    },
    {
      key: '5',
      port: '上海港',
      yard: '东海物流园',
      containerType: ContainerType.HC40,
      emptyCount: 90,
      fullCount: 50,
      totalCount: 140,
      lastUpdated: '2024-02-01 16:25:00'
    },
    {
      key: '6',
      port: '宁波港',
      yard: '宝山重箱堆场',
      containerType: ContainerType.GP20,
      emptyCount: 180,
      fullCount: 90,
      totalCount: 270,
      lastUpdated: '2024-02-01 16:20:00'
    },
    {
      key: '7',
      port: '宁波港',
      yard: '宝山重箱堆场',
      containerType: ContainerType.GP40,
      emptyCount: 160,
      fullCount: 80,
      totalCount: 240,
      lastUpdated: '2024-02-01 16:20:00'
    },
    {
      key: '8',
      port: '宁波港',
      yard: '洋山港堆场',
      containerType: ContainerType.RF20,
      emptyCount: 30,
      fullCount: 20,
      totalCount: 50,
      lastUpdated: '2024-02-01 16:15:00'
    }
  ];

  // 生成报表
  const generateReport = (reportType: ReportType) => {
    setLoading(true);
    setSelectedReportType(reportType);
    
    // 模拟API调用
    setTimeout(() => {
      if (reportType === ReportType.DAILY_INVENTORY) {
        setInventoryData(mockInventoryData);
        
        // 计算统计数据
        const summary: InventorySummary = {
          totalContainers: mockInventoryData.reduce((sum, item) => sum + item.totalCount, 0),
          emptyContainers: mockInventoryData.reduce((sum, item) => sum + item.emptyCount, 0),
          fullContainers: mockInventoryData.reduce((sum, item) => sum + item.fullCount, 0),
          totalYards: new Set(mockInventoryData.map(item => item.yard)).size
        };
        setInventorySummary(summary);
      }
      setLoading(false);
      Message.success('报表生成成功！');
    }, 1000);
  };

  // 导出报表
  const exportReport = () => {
    if (!inventoryData.length) {
      Message.warning('没有数据可导出');
      return;
    }
    
    // 模拟导出功能
    const csvContent = generateCSV();
    downloadCSV(csvContent, `库存报表_${new Date().toISOString().split('T')[0]}.csv`);
    Message.success('报表导出成功！');
  };

  // 生成CSV内容
  const generateCSV = () => {
    const headers = ['港口', '堆场', '箱型', '空箱数量', '重箱数量', '总计', '更新时间'];
    const rows = inventoryData.map(item => [
      item.port,
      item.yard,
      item.containerType,
      item.emptyCount,
      item.fullCount,
      item.totalCount,
      item.lastUpdated
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  // 下载CSV文件
  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob(['\ufeff' + content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 按堆场分组的表格列
  const yardColumns = [
    {
      title: '港口',
      dataIndex: 'port',
      width: 120,
      render: (port: string) => (
        <div className="flex items-center">
          <IconLocation className="mr-1 text-blue-500 w-3 h-3" />
          <span className="font-medium">{port}</span>
        </div>
      )
    },
    {
      title: '堆场',
      dataIndex: 'yard',
      width: 150,
      render: (yard: string) => (
        <div className="flex items-center">
          <IconHome className="mr-1 text-green-500 w-3 h-3" />
          <span>{yard}</span>
        </div>
      )
    },
    {
      title: '箱型',
      dataIndex: 'containerType',
      width: 100,
      render: (type: ContainerType) => (
        <Tag color="blue" size="small">{type}</Tag>
      )
    },
    {
      title: '空箱数量',
      dataIndex: 'emptyCount',
      width: 100,
      render: (count: number) => (
        <span className="text-orange-600 font-medium">{count}</span>
      )
    },
    {
      title: '重箱数量',
      dataIndex: 'fullCount',
      width: 100,
      render: (count: number) => (
        <span className="text-green-600 font-medium">{count}</span>
      )
    },
    {
      title: '总计',
      dataIndex: 'totalCount',
      width: 100,
      render: (count: number) => (
        <span className="text-blue-600 font-bold">{count}</span>
      )
    },
    {
      title: '更新时间',
      dataIndex: 'lastUpdated',
      width: 160,
      render: (time: string) => (
        <div className="text-sm text-gray-500 flex items-center">
          <IconCalendar className="mr-1 w-3 h-3" />
          {time}
        </div>
      )
    }
  ];

  // 按港口汇总数据
  const getPortSummary = () => {
    const portMap = new Map();
    inventoryData.forEach(item => {
      const key = item.port;
      if (!portMap.has(key)) {
        portMap.set(key, {
          port: item.port,
          emptyCount: 0,
          fullCount: 0,
          totalCount: 0,
          yardCount: new Set()
        });
      }
      const summary = portMap.get(key);
      summary.emptyCount += item.emptyCount;
      summary.fullCount += item.fullCount;
      summary.totalCount += item.totalCount;
      summary.yardCount.add(item.yard);
    });
    
    return Array.from(portMap.values()).map((item, index) => ({
      key: index.toString(),
      ...item,
      yardCount: item.yardCount.size
    }));
  };

  // 按箱型汇总数据
  const getContainerTypeSummary = () => {
    const typeMap = new Map();
    inventoryData.forEach(item => {
      const key = item.containerType;
      if (!typeMap.has(key)) {
        typeMap.set(key, {
          containerType: item.containerType,
          emptyCount: 0,
          fullCount: 0,
          totalCount: 0
        });
      }
      const summary = typeMap.get(key);
      summary.emptyCount += item.emptyCount;
      summary.fullCount += item.fullCount;
      summary.totalCount += item.totalCount;
    });
    
    return Array.from(typeMap.values()).map((item, index) => ({
      key: index.toString(),
      ...item
    }));
  };

  // 港口汇总表格列
  const portSummaryColumns = [
    {
      title: '港口',
      dataIndex: 'port',
      render: (port: string) => (
        <div className="flex items-center">
          <IconLocation className="mr-1 text-blue-500 w-3 h-3" />
          <span className="font-medium">{port}</span>
        </div>
      )
    },
    {
      title: '堆场数量',
      dataIndex: 'yardCount',
      render: (count: number) => (
        <span className="text-purple-600 font-medium">{count}</span>
      )
    },
    {
      title: '空箱总计',
      dataIndex: 'emptyCount',
      render: (count: number) => (
        <span className="text-orange-600 font-medium">{count}</span>
      )
    },
    {
      title: '重箱总计',
      dataIndex: 'fullCount',
      render: (count: number) => (
        <span className="text-green-600 font-medium">{count}</span>
      )
    },
    {
      title: '总计',
      dataIndex: 'totalCount',
      render: (count: number) => (
        <span className="text-blue-600 font-bold">{count}</span>
      )
    }
  ];

  // 箱型汇总表格列
  const containerTypeSummaryColumns = [
    {
      title: '箱型',
      dataIndex: 'containerType',
      render: (type: ContainerType) => (
        <Tag color="blue" size="small">{type}</Tag>
      )
    },
    {
      title: '空箱总计',
      dataIndex: 'emptyCount',
      render: (count: number) => (
        <span className="text-orange-600 font-medium">{count}</span>
      )
    },
    {
      title: '重箱总计',
      dataIndex: 'fullCount',
      render: (count: number) => (
        <span className="text-green-600 font-medium">{count}</span>
      )
    },
    {
      title: '总计',
      dataIndex: 'totalCount',
      render: (count: number) => (
        <span className="text-blue-600 font-bold">{count}</span>
      )
    }
  ];

  return (
    <div className="p-6">
      {/* 页面标题 */}
      <Card className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <Title heading={5}>
            <IconDesktop className="mr-2" />
            报表中心
          </Title>
          {selectedReportType && (
            <Space>
              <Button icon={<IconRefresh />} onClick={() => generateReport(selectedReportType)}>
                刷新数据
              </Button>
              <Button type="primary" icon={<IconDownload />} onClick={exportReport}>
                导出报表
              </Button>
            </Space>
          )}
        </div>

        {/* 报表类型选择 */}
        <div className="mb-4">
          <div className="mb-2 text-sm font-medium text-gray-700">选择要生成的报表类型：</div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Object.entries(REPORT_CONFIG).map(([key, config]) => (
              <Card
                key={key}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedReportType === key ? 'border-blue-500 bg-blue-50' : ''
                }`}
                size="small"
                onClick={() => generateReport(key as ReportType)}
              >
                <div className="text-center">
                  <div className="text-xl mb-2">{config.icon}</div>
                  <div className="font-medium text-sm mb-1">{config.title}</div>
                  <div className="text-xs text-gray-500">{config.description}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Card>

      {/* 报表内容区域 */}
      {selectedReportType && (
        <Card>
          <Spin loading={loading}>
            {selectedReportType === ReportType.DAILY_INVENTORY && (
              <div>
                {/* 统计概览 */}
                {inventorySummary && (
                  <div className="mb-6">
                    <Title heading={6} className="mb-4">库存概览</Title>
                    <Row gutter={16}>
                      <Col span={6}>
                        <Statistic
                          title="总库存"
                          value={inventorySummary.totalContainers}
                          suffix="TEU"
                        />
                      </Col>
                      <Col span={6}>
                        <Statistic
                          title="空箱数量"
                          value={inventorySummary.emptyContainers}
                          suffix="TEU"
                        />
                      </Col>
                      <Col span={6}>
                        <Statistic
                          title="重箱数量"
                          value={inventorySummary.fullContainers}
                          suffix="TEU"
                        />
                      </Col>
                      <Col span={6}>
                        <Statistic
                          title="堆场数量"
                          value={inventorySummary.totalYards}
                          suffix="个"
                        />
                      </Col>
                    </Row>
                    <Divider />
                  </div>
                )}

                {/* 分组查看 */}
                <Tabs activeTab={activeTab} onChange={setActiveTab}>
                  <TabPane key="byYard" title="按堆场明细">
                    <Table
                      columns={yardColumns}
                      data={inventoryData}
                      pagination={{
                        showTotal: true,
                        pageSize: 10,
                        showJumper: true
                      }}
                      scroll={{ x: 800 }}
                      border={{
                        wrapper: true,
                        cell: true
                      }}
                    />
                  </TabPane>
                  
                  <TabPane key="byPort" title="按港口汇总">
                    <Table
                      columns={portSummaryColumns}
                      data={getPortSummary()}
                      pagination={false}
                      border={{
                        wrapper: true,
                        cell: true
                      }}
                    />
                  </TabPane>
                  
                  <TabPane key="byType" title="按箱型汇总">
                    <Table
                      columns={containerTypeSummaryColumns}
                      data={getContainerTypeSummary()}
                      pagination={false}
                      border={{
                        wrapper: true,
                        cell: true
                      }}
                    />
                  </TabPane>
                </Tabs>
              </div>
            )}

            {selectedReportType === ReportType.LONG_STAY_CONTAINERS && (
              <div className="text-center py-20">
                <div className="text-gray-500 text-lg mb-4">长期滞留箱报表</div>
                <div className="text-gray-400">功能开发中，敬请期待...</div>
              </div>
            )}

            {selectedReportType === ReportType.REPAIR_WASH_CONTAINERS && (
              <div className="text-center py-20">
                <div className="text-gray-500 text-lg mb-4">修洗箱统计报表</div>
                <div className="text-gray-400">功能开发中，敬请期待...</div>
              </div>
            )}

            {selectedReportType === ReportType.CONTAINER_FLOW && (
              <div className="text-center py-20">
                <div className="text-gray-500 text-lg mb-4">集装箱流水报表</div>
                <div className="text-gray-400">功能开发中，敬请期待...</div>
              </div>
            )}

            {selectedReportType === ReportType.YARD_UTILIZATION && (
              <div className="text-center py-20">
                <div className="text-gray-500 text-lg mb-4">堆场利用率报表</div>
                <div className="text-gray-400">功能开发中，敬请期待...</div>
              </div>
            )}
          </Spin>
        </Card>
      )}

      {!selectedReportType && (
        <Card>
          <div className="text-center py-20">
            <div className="text-gray-500 text-lg mb-4">请选择要生成的报表类型</div>
            <div className="text-gray-400">从上方报表类型中选择一个开始生成报表</div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ReportingPage; 