import React, { useState } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Card, 
  Grid,
  Tag,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Message
} from '@arco-design/web-react';
import { 
  IconDownload,
  IconList,
  IconCheck,
  IconClose,
  IconSearch,
  IconRefresh
} from '@arco-design/web-react/icon';

const { Row, Col } = Grid;
const { RangePicker } = DatePicker;

interface BillingItem {
  key: string;
  billNo: string;
  status: string;
  type: string;
  amount: number;
  currency: string;
  dueDate: string;
  createTime: string;
  updateTime: string;
}

const BillingManagement: React.FC = () => {
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
      title: '账单编号',
      dataIndex: 'billNo',
      width: 150,
      render: (value: string) => <a href="#" className="text-blue-600">{value}</a>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 120,
      render: (value: string) => {
        const colorMap: Record<string, string> = {
          '待确认': 'orange',
          '已确认': 'green',
          '已驳回': 'red',
          '已支付': 'blue'
        };
        return <Tag color={colorMap[value]}>{value}</Tag>;
      },
    },
    {
      title: '账单类型',
      dataIndex: 'type',
      width: 120,
    },
    {
      title: '金额',
      dataIndex: 'amount',
      width: 120,
      render: (value: number, record: BillingItem) => `${record.currency} ${value.toFixed(2)}`,
    },
    {
      title: '到期日',
      dataIndex: 'dueDate',
      width: 120,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 180,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      width: 180,
    },
    {
      title: '操作',
      width: 200,
      fixed: 'right' as const,
      render: (record: BillingItem) => (
        <Space>
          <Button 
            type="text" 
            size="small" 
            icon={<IconCheck />} 
            status="success"
            onClick={() => Message.info(`确认账单：${record.billNo}`)}
          >
            确认
          </Button>
          <Button 
            type="text" 
            size="small" 
            icon={<IconClose />} 
            status="danger"
            onClick={() => Message.info(`驳回账单：${record.billNo}`)}
          >
            驳回
          </Button>
        </Space>
      ),
    }
  ];

  // 模拟数据
  const data: BillingItem[] = Array(10).fill(null).map((_, index) => ({
    key: `${index}`,
    billNo: `BILL${String(index + 1).padStart(6, '0')}`,
    status: ['待确认', '已确认', '已驳回', '已支付'][Math.floor(Math.random() * 4)],
    type: ['海运费', '关税', '港杂费', '拖车费'][Math.floor(Math.random() * 4)],
    amount: Math.floor(Math.random() * 10000) + 1000,
    currency: ['USD', 'EUR', 'CNY'][Math.floor(Math.random() * 3)],
    dueDate: `2024-${String(Math.floor(Math.random() * 3) + 4).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
    createTime: '2024-03-15 14:30:00',
    updateTime: '2024-03-15 15:45:00',
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
              <Form.Item label="账单编号" field="billNo">
                <Input placeholder="请输入账单编号" allowClear />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="状态" field="status">
                <Select
                  placeholder="请选择状态"
                  allowClear
                  options={[
                    { label: '待确认', value: '待确认' },
                    { label: '已确认', value: '已确认' },
                    { label: '已驳回', value: '已驳回' },
                    { label: '已支付', value: '已支付' }
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="账单类型" field="type">
                <Select
                  placeholder="请选择账单类型"
                  allowClear
                  options={[
                    { label: '海运费', value: '海运费' },
                    { label: '关税', value: '关税' },
                    { label: '港杂费', value: '港杂费' },
                    { label: '拖车费', value: '拖车费' }
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item label="金额范围" field="amountRange">
                <Space>
                  <InputNumber
                    placeholder="最小金额"
                    style={{ width: '120px' }}
                  />
                  <span>-</span>
                  <InputNumber
                    placeholder="最大金额"
                    style={{ width: '120px' }}
                  />
                </Space>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="币种" field="currency">
                <Select
                  placeholder="请选择币种"
                  allowClear
                  options={[
                    { label: 'USD', value: 'USD' },
                    { label: 'EUR', value: 'EUR' },
                    { label: 'CNY', value: 'CNY' }
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="到期日期" field="dueDateRange">
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

export default BillingManagement; 