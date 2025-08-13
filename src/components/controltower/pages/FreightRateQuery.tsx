import React, { useState } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Select, 
  DatePicker, 
  Card, 
  Typography,
  Grid,
  Tooltip
} from '@arco-design/web-react';
import { 
  IconSearch, 
  IconRefresh, 
  IconFilter,
  IconDownload,
  IconList
} from '@arco-design/web-react/icon';
const Title = Typography.Title;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const Row = Grid.Row;
const Col = Grid.Col;

interface RateQueryItem {
  key: string;
  carrier: string;
  pol: string;
  pod: string;
  etd: string;
  transitTime: number;
  validFrom: string;
  validTo: string;
  '20gp': number;
  '40gp': number;
  '40hc': number;
  remark: string;
}

const FreightRateQuery: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>([]);

  // 表格列定义
  const columns = [
    {
      title: '承运人',
      dataIndex: 'carrier',
      width: 120,
      render: (value: string) => <Tooltip content={value}><span className="arco-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: '起运港',
      dataIndex: 'pol',
      width: 120,
      render: (value: string) => <Tooltip content={value}><span className="arco-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: '目的港',
      dataIndex: 'pod',
      width: 120,
      render: (value: string) => <Tooltip content={value}><span className="arco-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: '开航日',
      dataIndex: 'etd',
      width: 100,
      render: (value: string) => <Tooltip content={value}><span className="arco-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: '航程(天)',
      dataIndex: 'transitTime',
      width: 90,
      render: (value: number) => <Tooltip content={String(value)}><span className="arco-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: '有效期',
      dataIndex: 'validFrom',
      width: 200,
      render: (value: string, record: RateQueryItem) => (
        <Tooltip content={`${value} ~ ${record.validTo}`}>
          <span className="arco-ellipsis">{value} ~ {record.validTo}</span>
        </Tooltip>
      ),
      sorter: true,
      resizable: true,
    },
    {
      title: '20GP',
      dataIndex: '20gp',
      width: 100,
      render: (value: number) => <Tooltip content={`$ ${value}`}><span className="arco-ellipsis">$ {value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: '40GP',
      dataIndex: '40gp',
      width: 100,
      render: (value: number) => <Tooltip content={`$ ${value}`}><span className="arco-ellipsis">$ {value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: '40HC',
      dataIndex: '40hc',
      width: 100,
      render: (value: number) => <Tooltip content={`$ ${value}`}><span className="arco-ellipsis">$ {value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      width: 150,
      render: (value: string) => <Tooltip content={value}><span className="arco-ellipsis">{value}</span></Tooltip>,
      resizable: true,
    }
  ];

  // 模拟数据
  const data: RateQueryItem[] = Array(10).fill(null).map((_, index) => ({
    key: `${index}`,
    carrier: ['COSCO', 'MSC', 'MAERSK', 'ONE'][Math.floor(Math.random() * 4)],
    pol: ['SHANGHAI', 'NINGBO', 'QINGDAO', 'XIAMEN'][Math.floor(Math.random() * 4)],
    pod: ['HAMBURG', 'ROTTERDAM', 'ANTWERP', 'FELIXSTOWE'][Math.floor(Math.random() * 4)],
    etd: `2024-${String(Math.floor(Math.random() * 3) + 4).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
    transitTime: Math.floor(Math.random() * 10) + 25,
    validFrom: '2024-04-01',
    validTo: '2024-04-30',
    '20gp': Math.floor(Math.random() * 1000) + 1500,
    '40gp': Math.floor(Math.random() * 1500) + 2500,
    '40hc': Math.floor(Math.random() * 1500) + 2700,
    remark: ['含码头费', '不含BAF', '特价优惠'][Math.floor(Math.random() * 3)],
  }));

  const onSelectChange = (selectedRowKeys: (string | number)[]) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const pagination = {
    showTotal: true,
    total: 156,
    pageSize: 10,
    current: 1,
    showJumper: true,
    sizeCanChange: true,
    pageSizeChangeResetCurrent: true,
    sizeOptions: [10, 20, 50, 100],
  };

  return (
    <>
      {/* 搜索条件卡片 */}
      <Card className="mb-4">
        <Title heading={6} className="mb-4">查询条件</Title>
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <div className="text-gray-500 text-sm mb-1">承运人</div>
            <Select
              placeholder="请选择承运人"
              style={{ width: '100%' }}
              allowClear
              mode="multiple"
            >
              <Option value="COSCO">COSCO</Option>
              <Option value="MSC">MSC</Option>
              <Option value="MAERSK">MAERSK</Option>
              <Option value="ONE">ONE</Option>
            </Select>
          </Col>
          
          <Col span={6}>
            <div className="text-gray-500 text-sm mb-1">起运港</div>
            <Select
              placeholder="请选择起运港"
              style={{ width: '100%' }}
              allowClear
              showSearch
            >
              <Option value="SHANGHAI">上海 SHANGHAI</Option>
              <Option value="NINGBO">宁波 NINGBO</Option>
              <Option value="QINGDAO">青岛 QINGDAO</Option>
              <Option value="XIAMEN">厦门 XIAMEN</Option>
            </Select>
          </Col>
          
          <Col span={6}>
            <div className="text-gray-500 text-sm mb-1">目的港</div>
            <Select
              placeholder="请选择目的港"
              style={{ width: '100%' }}
              allowClear
              showSearch
            >
              <Option value="HAMBURG">汉堡 HAMBURG</Option>
              <Option value="ROTTERDAM">鹿特丹 ROTTERDAM</Option>
              <Option value="ANTWERP">安特卫普 ANTWERP</Option>
              <Option value="FELIXSTOWE">费力克斯托 FELIXSTOWE</Option>
            </Select>
          </Col>
          
          <Col span={6}>
            <div className="text-gray-500 text-sm mb-1">开航日期</div>
            <RangePicker style={{ width: '100%' }} />
          </Col>

          <Col span={6}>
            <div className="text-gray-500 text-sm mb-1">有效期</div>
            <RangePicker style={{ width: '100%' }} />
          </Col>
          
          <Col span={6}>
            <div className="text-gray-500 text-sm mb-1">集装箱类型</div>
            <Select
              placeholder="请选择箱型"
              style={{ width: '100%' }}
              allowClear
              mode="multiple"
            >
              <Option value="20GP">20GP</Option>
              <Option value="40GP">40GP</Option>
              <Option value="40HC">40HC</Option>
              <Option value="45HC">45HC</Option>
            </Select>
          </Col>
        </Row>
        
        <div className="flex justify-end mt-4">
          <Space>
            <Button type="primary" icon={<IconSearch />}>查询</Button>
            <Button icon={<IconRefresh />}>重置</Button>
            <Button icon={<IconFilter />}>收起</Button>
          </Space>
        </div>
      </Card>

      {/* 数据表格卡片 */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <Space>
            <Button type="primary" icon={<IconSearch />}>直接询价</Button>
            <Button icon={<IconDownload />}>导出数据</Button>
          </Space>
          <Button 
            icon={<IconList />}
            onClick={() => {
              // TODO: 实现自定义表格功能
            }}
          >
            自定义表格
          </Button>
        </div>
        
        <Table
          rowKey="key"
          columns={columns}
          data={data}
          rowSelection={{
            selectedRowKeys,
            onChange: onSelectChange,
          }}
          pagination={pagination}
          scroll={{ x: 1500 }}
          border={false}
          className="mt-4"
        />
        
        <div className="mt-2 text-gray-500 text-sm">共 156 条</div>
      </Card>
    </>
  );
};

export default FreightRateQuery; 