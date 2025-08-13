import React, { useState } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Card, 
  Tag,
  Message,
  Form,
  Input,
  Select,
  DatePicker,
  Grid
} from '@arco-design/web-react';
import { 
  IconDownload,
  IconList,
  IconEdit,
  IconDelete,
  IconSearch,
  IconRefresh
} from '@arco-design/web-react/icon';

const { Row, Col } = Grid;
const { RangePicker } = DatePicker;

interface InquiryItem {
  key: string;
  inquiryNo: string;
  status: string;
  type: string;
  origin: string;
  destination: string;
  createTime: string;
  validUntil: string;
}

const InquiryManagement: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>([]);
  const [form] = Form.useForm();

  const handleSearch = async () => {
    try {
      const values = await form.validate();
      console.log('搜索条件:', values);
      Message.info('搜索功能开发中...');
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const handleReset = () => {
    form.resetFields();
    Message.info('重置成功');
  };

  // 表格列定义
  const columns = [
    {
      title: '询价编号',
      dataIndex: 'inquiryNo',
      width: 150,
      render: (value: string) => <a href="#" className="text-blue-600">{value}</a>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 120,
      render: (value: string) => {
        const colorMap: Record<string, string> = {
          '待报价': 'orange',
          '已报价': 'green',
          '已失效': 'red',
          '已确认': 'blue'
        };
        return <Tag color={colorMap[value]}>{value}</Tag>;
      },
    },
    {
      title: '运输类型',
      dataIndex: 'type',
      width: 120,
    },
    {
      title: '起运地',
      dataIndex: 'origin',
      width: 150,
    },
    {
      title: '目的地',
      dataIndex: 'destination',
      width: 150,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 180,
    },
    {
      title: '有效期至',
      dataIndex: 'validUntil',
      width: 180,
    },
    {
      title: '操作',
      width: 200,
      fixed: 'right' as const,
      render: (_: unknown, record: InquiryItem) => (
        <Space>
          <Button 
            type="text" 
            size="small" 
            icon={<IconEdit />}
            onClick={() => {
              Message.info(`编辑询价单：${record.inquiryNo}`);
            }}
          >
            编辑
          </Button>
          <Button 
            type="text" 
            size="small" 
            status="danger" 
            icon={<IconDelete />}
            onClick={() => {
              Message.info(`删除询价单：${record.inquiryNo}`);
            }}
          >
            删除
          </Button>
        </Space>
      ),
    }
  ];

  // 模拟数据
  const data: InquiryItem[] = Array(10).fill(null).map((_, index) => ({
    key: `${index}`,
    inquiryNo: `INQ${String(index + 1).padStart(6, '0')}`,
    status: ['待报价', '已报价', '已失效', '已确认'][Math.floor(Math.random() * 4)],
    type: ['海运', '空运', '铁运', '公路'][Math.floor(Math.random() * 4)],
    origin: ['深圳', '上海', '广州', '青岛'][Math.floor(Math.random() * 4)],
    destination: ['汉堡', '鹿特丹', '洛杉矶', '迪拜'][Math.floor(Math.random() * 4)],
    createTime: '2024-03-15 14:30:00',
    validUntil: '2024-04-15 23:59:59',
  }));

  const pagination = {
    showTotal: true,
    total: 100,
    pageSize: 10,
    current: 1,
    showJumper: true,
    sizeCanChange: true,
    pageSizeChangeResetCurrent: true,
    sizeOptions: [10, 20, 50, 100],
  };

  return (
    <>
      {/* 筛选区 */}
      <Card className="mb-4">
        <Form
          form={form}
          layout="horizontal"
          className="search-form"
        >
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item label="询价编号" field="inquiryNo">
                <Input placeholder="请输入询价编号" allowClear />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="状态" field="status">
                <Select
                  placeholder="请选择状态"
                  allowClear
                  options={[
                    { label: '待报价', value: '待报价' },
                    { label: '已报价', value: '已报价' },
                    { label: '已失效', value: '已失效' },
                    { label: '已确认', value: '已确认' }
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="运输类型" field="type">
                <Select
                  placeholder="请选择运输类型"
                  allowClear
                  options={[
                    { label: '海运', value: '海运' },
                    { label: '空运', value: '空运' },
                    { label: '铁运', value: '铁运' },
                    { label: '公路', value: '公路' }
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item label="起运地" field="origin">
                <Input placeholder="请输入起运地" allowClear />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="目的地" field="destination">
                <Input placeholder="请输入目的地" allowClear />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="创建日期" field="dateRange">
                <RangePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24} style={{ textAlign: 'right' }}>
              <Space>
                <Button type="secondary" icon={<IconRefresh />} onClick={handleReset}>
                  重置
                </Button>
                <Button type="primary" icon={<IconSearch />} onClick={handleSearch}>
                  搜索
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>

      {/* 数据表格卡片 */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <Space>
            <Button icon={<IconDownload />}>导出数据</Button>
          </Space>
          <Button 
            icon={<IconList />}
            onClick={() => {
              Message.info('自定义表格功能开发中...');
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
            onChange: (selectedRowKeys) => setSelectedRowKeys(selectedRowKeys),
          }}
          pagination={pagination}
          scroll={{ x: 1500 }}
          border={false}
          className="mt-4"
        />
      </Card>
    </>
  );
};

export default InquiryManagement; 