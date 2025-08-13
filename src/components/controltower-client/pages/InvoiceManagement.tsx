import React, { useState } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Card, 
  Tag,
  Form,
  Grid,
  Input,
  Select,
  InputNumber,
  DatePicker,
  Message
} from '@arco-design/web-react';
import { 
  IconDownload,
  IconList,
  IconCheck,
  IconClose,
  IconUpload,
  IconRefresh,
  IconSearch
} from '@arco-design/web-react/icon';

const { Row, Col } = Grid;
const { RangePicker } = DatePicker;
const FormItem = Form.Item;

interface InvoiceItem {
  key: string;
  invoiceNo: string;
  status: string;
  type: string;
  amount: number;
  currency: string;
  taxRate: number;
  issueDate: string;
  createTime: string;
}

const InvoiceManagement: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>([]);
  const [form] = Form.useForm();

  // 表格列定义
  const columns = [
    {
      title: '发票编号',
      dataIndex: 'invoiceNo',
      width: 150,
      render: (value: string) => <a href="#" className="text-blue-600">{value}</a>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 120,
      render: (value: string) => {
        const colorMap: Record<string, string> = {
          '待开票': 'orange',
          '已开票': 'green',
          '已作废': 'red',
          '已寄出': 'blue'
        };
        return <Tag color={colorMap[value]}>{value}</Tag>;
      },
    },
    {
      title: '发票类型',
      dataIndex: 'type',
      width: 120,
    },
    {
      title: '金额',
      dataIndex: 'amount',
      width: 120,
      render: (value: number, record: InvoiceItem) => `${record.currency} ${value.toFixed(2)}`,
    },
    {
      title: '税率',
      dataIndex: 'taxRate',
      width: 100,
      render: (value: number) => `${value}%`,
    },
    {
      title: '开票日期',
      dataIndex: 'issueDate',
      width: 120,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 180,
    },
    {
      title: '操作',
      width: 200,
      fixed: 'right' as const,
      render: (_: unknown, record: InvoiceItem) => (
        <Space>
          <Button 
            type="text" 
            size="small" 
            icon={<IconUpload />}
            onClick={() => {
              Message.info(`上传发票：${record.invoiceNo}`);
            }}
          >
            上传
          </Button>
          <Button 
            type="text" 
            size="small" 
            icon={<IconCheck />} 
            status="success"
            onClick={() => {
              Message.info(`确认发票：${record.invoiceNo}`);
            }}
          >
            确认
          </Button>
          <Button 
            type="text" 
            size="small" 
            icon={<IconClose />} 
            status="danger"
            onClick={() => {
              Message.info(`作废发票：${record.invoiceNo}`);
            }}
          >
            作废
          </Button>
        </Space>
      ),
    }
  ];

  // 模拟数据
  const data: InvoiceItem[] = Array(10).fill(null).map((_, index) => ({
    key: `${index}`,
    invoiceNo: `INV${String(index + 1).padStart(6, '0')}`,
    status: ['待开票', '已开票', '已作废', '已寄出'][Math.floor(Math.random() * 4)],
    type: ['增值税专票', '增值税普票', '电子发票'][Math.floor(Math.random() * 3)],
    amount: Math.floor(Math.random() * 10000) + 1000,
    currency: ['CNY'][Math.floor(Math.random() * 1)],
    taxRate: [6, 9, 13][Math.floor(Math.random() * 3)],
    issueDate: `2024-${String(Math.floor(Math.random() * 3) + 4).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
    createTime: '2024-03-15 14:30:00',
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
              <FormItem label="发票编号" field="invoiceNo">
                <Input placeholder="请输入发票编号" allowClear />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="状态" field="status">
                <Select
                  placeholder="请选择状态"
                  allowClear
                  options={[
                    { label: '待开票', value: '待开票' },
                    { label: '已开票', value: '已开票' },
                    { label: '已作废', value: '已作废' },
                    { label: '已寄出', value: '已寄出' }
                  ]}
                />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="发票类型" field="type">
                <Select
                  placeholder="请选择发票类型"
                  allowClear
                  options={[
                    { label: '增值税专票', value: '增值税专票' },
                    { label: '增值税普票', value: '增值税普票' },
                    { label: '电子发票', value: '电子发票' }
                  ]}
                />
              </FormItem>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={8}>
              <FormItem label="金额范围" field="amountRange">
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
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="税率" field="taxRate">
                <Select
                  placeholder="请选择税率"
                  allowClear
                  options={[
                    { label: '6%', value: 6 },
                    { label: '9%', value: 9 },
                    { label: '13%', value: 13 }
                  ]}
                />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="开票日期" field="issueDateRange">
                <RangePicker style={{ width: '100%' }} />
              </FormItem>
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

export default InvoiceManagement; 