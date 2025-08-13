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
  Grid,
  InputNumber,
  Modal,
  Radio
} from '@arco-design/web-react';
import { 
  IconDownload,
  IconList,
  IconEdit,
  IconDelete,
  IconSearch,
  IconRefresh,
  IconEye,
  IconPlus
} from '@arco-design/web-react/icon';
import AIAssistant from '../layout/ai-client';
import { useNavigate } from 'react-router-dom';

const { Row, Col } = Grid;
const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

interface OrderItem {
  key: string;
  orderNo: string;
  status: string;
  type: string;
  customerName: string;
  origin: string;
  destination: string;
  amount: number;
  currency: string;
  createTime: string;
  estimatedDeliveryTime: string;
}

const OrderManagement: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>([]);
  const [form] = Form.useForm();
  const [createForm] = Form.useForm();
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [orderType, setOrderType] = useState<string>('');
  const [aiVisible, setAiVisible] = useState(false);
  const navigate = useNavigate();

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

  const handleCreateOrder = async () => {
    try {
      const values = await createForm.validate();
      console.log('创建订单:', { ...values, orderType });
      Message.info('创建订单功能开发中...');
      setCreateModalVisible(false);
      createForm.resetFields();
      setOrderType('');
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const handleOrderTypeChange = (value: string) => {
    setOrderType(value);
    if (value !== 'hasQuote') {
      createForm.setFieldValue('quoteNo', undefined);
    }
  };

  // 表格列定义
  const columns = [
    {
      title: '订单编号',
      dataIndex: 'orderNo',
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
          '运输中': 'blue',
          '已完成': 'cyan',
          '已取消': 'red'
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
      title: '客户名称',
      dataIndex: 'customerName',
      width: 150,
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
      title: '订单金额',
      dataIndex: 'amount',
      width: 150,
      render: (value: number, record: OrderItem) => `${record.currency} ${value.toFixed(2)}`,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 180,
    },
    {
      title: '预计送达',
      dataIndex: 'estimatedDeliveryTime',
      width: 180,
    },
    {
      title: '操作',
      width: 200,
      fixed: 'right' as const,
      render: (_: unknown, record: OrderItem) => (
        <Space>
          <Button 
            type="text" 
            size="small" 
            icon={<IconEye />}
            onClick={() => {
              navigate(`/controltower/order-detail/${record.orderNo}`);
            }}
          >
            查看
          </Button>
          <Button 
            type="text" 
            size="small" 
            icon={<IconEdit />}
            onClick={() => {
              Message.info(`编辑订单：${record.orderNo}`);
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
              Message.info(`删除订单：${record.orderNo}`);
            }}
          >
            删除
          </Button>
        </Space>
      ),
    }
  ];

  // 模拟数据
  const data: OrderItem[] = Array(10).fill(null).map((_, index) => ({
    key: `${index}`,
    orderNo: `ORD${String(index + 1).padStart(6, '0')}`,
    status: ['待确认', '已确认', '运输中', '已完成', '已取消'][Math.floor(Math.random() * 5)],
    type: ['海运', '空运', '铁运', '公路'][Math.floor(Math.random() * 4)],
    customerName: ['上海贸易有限公司', '深圳科技公司', '广州物流有限公司', '北京国际贸易'][Math.floor(Math.random() * 4)],
    origin: ['深圳', '上海', '广州', '青岛'][Math.floor(Math.random() * 4)],
    destination: ['汉堡', '鹿特丹', '洛杉矶', '迪拜'][Math.floor(Math.random() * 4)],
    amount: Math.floor(Math.random() * 100000) + 10000,
    currency: ['USD', 'EUR', 'CNY'][Math.floor(Math.random() * 3)],
    createTime: '2024-03-15 14:30:00',
    estimatedDeliveryTime: '2024-04-15 23:59:59',
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
              <FormItem label="订单编号" field="orderNo">
                <Input placeholder="请输入订单编号" allowClear />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="状态" field="status">
                <Select
                  placeholder="请选择状态"
                  allowClear
                  options={[
                    { label: '待确认', value: '待确认' },
                    { label: '已确认', value: '已确认' },
                    { label: '运输中', value: '运输中' },
                    { label: '已完成', value: '已完成' },
                    { label: '已取消', value: '已取消' }
                  ]}
                />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="运输类型" field="type">
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
              </FormItem>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={8}>
              <FormItem label="客户名称" field="customerName">
                <Input placeholder="请输入客户名称" allowClear />
              </FormItem>
            </Col>
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
              <FormItem label="创建日期" field="dateRange">
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
            <Button type="primary" icon={<IconPlus />} onClick={() => setCreateModalVisible(true)}>
              新增订单
            </Button>
            <Button icon={<IconDownload />}>导出数据</Button>
          </Space>
          <Space>
            <Button 
              icon={<IconList />}
              onClick={() => {
                Message.info('自定义表格功能开发中...');
              }}
            >
              自定义表格
            </Button>
            <Button 
              type="primary" 
              shape="circle"
              className="flex items-center justify-center shadow-md hover:shadow-lg ml-3"
              onClick={() => setAiVisible(true)}
              style={{ 
                width: '36px', 
                height: '36px', 
                background: 'linear-gradient(135deg, #e0f2ff 0%, #d6e8ff 100%)',
                border: '1px solid #7eb9ff',
              }}
            >
              AI
            </Button>
          </Space>
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

      {/* 新增订单弹窗 */}
      <Modal
        title="新增订单"
        visible={createModalVisible}
        onOk={handleCreateOrder}
        onCancel={() => {
          setCreateModalVisible(false);
          createForm.resetFields();
          setOrderType('');
        }}
        autoFocus={false}
        focusLock={true}
        maskClosable={false}
      >
        <Form
          form={createForm}
          layout="vertical"
        >
          <FormItem
            label="订单类型"
            field="orderType"
            rules={[{ required: true, message: '请选择订单类型' }]}
          >
            <RadioGroup onChange={handleOrderTypeChange}>
              <Radio value="needQuote">需要报价</Radio>
              <Radio value="hasQuote">已有报价</Radio>
              <Radio value="booking">代订舱</Radio>
            </RadioGroup>
          </FormItem>

          {orderType === 'hasQuote' && (
            <FormItem
              label="报价单号"
              field="quoteNo"
              rules={[{ required: true, message: '请输入报价单号' }]}
            >
              <Input placeholder="请输入报价单号" allowClear />
            </FormItem>
          )}
        </Form>
      </Modal>

      {/* AI助手弹窗 */}
      <AIAssistant 
        visible={aiVisible} 
        onClose={() => setAiVisible(false)} 
      />
    </>
  );
};

export default OrderManagement; 