import React, { useState } from 'react';
import { Card, Button, Table, Input, Select, Space, Tag, Modal, Form, Descriptions, Tabs } from '@arco-design/web-react';
import { IconSearch, IconPlus, IconEye, IconEdit, IconDelete } from '@arco-design/web-react/icon';

/**
 * 客户管理页面组件
 * 提供客户信息的全面管理功能
 */
const CustomerManagement: React.FC = () => {
  // const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [form] = Form.useForm();

  // 模拟客户数据
  const [data, setData] = useState([
    {
      id: 1,
      companyName: '深圳市科技有限公司',
      contactPerson: '张经理',
      phone: '13800138001',
      email: 'zhang@tech.com',
      industry: '电子科技',
      customerLevel: 'A',
      status: 'active',
      address: '深圳市南山区科技园',
      registeredCapital: '1000万',
      businessScope: '电子产品研发、生产、销售',
      createTime: '2024-01-15',
      lastOrderTime: '2024-01-20',
      totalOrders: 15,
      totalAmount: 2500000,
      creditLimit: 500000,
      paymentTerms: '30天',
      salesRep: '李销售'
    },
    {
      id: 2,
      companyName: '上海贸易集团',
      contactPerson: '李总',
      phone: '13900139002',
      email: 'li@trade.com',
      industry: '国际贸易',
      customerLevel: 'S',
      status: 'active',
      address: '上海市浦东新区陆家嘴',
      registeredCapital: '5000万',
      businessScope: '国际贸易、进出口代理',
      createTime: '2024-01-16',
      lastOrderTime: '2024-01-22',
      totalOrders: 28,
      totalAmount: 8500000,
      creditLimit: 2000000,
      paymentTerms: '15天',
      salesRep: '王销售'
    },
    {
      id: 3,
      companyName: '广州物流公司',
      contactPerson: '王主任',
      phone: '13700137003',
      email: 'wang@logistics.com',
      industry: '物流运输',
      customerLevel: 'B',
      status: 'inactive',
      address: '广州市天河区珠江新城',
      registeredCapital: '2000万',
      businessScope: '物流运输、仓储服务',
      createTime: '2024-01-17',
      lastOrderTime: '2023-12-15',
      totalOrders: 8,
      totalAmount: 1200000,
      creditLimit: 300000,
      paymentTerms: '45天',
      salesRep: '赵销售'
    }
  ]);

  const columns = [
    {
      title: '公司名称',
      dataIndex: 'companyName',
      key: 'companyName',
      width: 200,
    },
    {
      title: '联系人',
      dataIndex: 'contactPerson',
      key: 'contactPerson',
      width: 100,
    },
    {
      title: '电话',
      dataIndex: 'phone',
      key: 'phone',
      width: 120,
    },
    {
      title: '行业',
      dataIndex: 'industry',
      key: 'industry',
      width: 100,
    },
    {
      title: '客户等级',
      dataIndex: 'customerLevel',
      key: 'customerLevel',
      width: 80,
      render: (level: string) => {
        const levelMap = {
          S: { color: 'gold', text: 'S级' },
          A: { color: 'green', text: 'A级' },
          B: { color: 'blue', text: 'B级' },
          C: { color: 'gray', text: 'C级' },
        };
        const config = levelMap[level as keyof typeof levelMap];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: string) => {
        const statusMap = {
          active: { color: 'green', text: '活跃' },
          inactive: { color: 'red', text: '非活跃' },
          potential: { color: 'orange', text: '潜在' },
        };
        const config = statusMap[status as keyof typeof statusMap];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '订单数',
      dataIndex: 'totalOrders',
      key: 'totalOrders',
      width: 80,
    },
    {
      title: '总金额',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 120,
      render: (amount: number) => `¥${amount.toLocaleString()}`,
    },
    {
      title: '销售代表',
      dataIndex: 'salesRep',
      key: 'salesRep',
      width: 100,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: any) => (
        <Space>
          <Button
            type="text"
            size="small"
            icon={<IconEye />}
            onClick={() => handleViewDetail(record)}
          >
            详情
          </Button>
          <Button
            type="text"
            size="small"
            icon={<IconEdit />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button
            type="text"
            size="small"
            status="danger"
            icon={<IconDelete />}
            onClick={() => handleDelete(record)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  /**
   * 处理查看客户详情
   */
  const handleViewDetail = (record: any) => {
    setSelectedCustomer(record);
    setDetailModalVisible(true);
  };

  /**
   * 处理编辑客户信息
   */
  const handleEdit = (record: any) => {
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  /**
   * 处理删除客户
   */
  const handleDelete = (record: any) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除客户"${record.companyName}"吗？`,
      onOk: () => {
        setData(data.filter(item => item.id !== record.id));
      },
    });
  };

  /**
   * 处理添加新客户
   */
  const handleAdd = () => {
    form.resetFields();
    setModalVisible(true);
  };

  /**
   * 处理表单提交
   */
  const handleSubmit = async () => {
    try {
      await form.validate();
      // 这里应该调用API保存数据
      setModalVisible(false);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 过滤数据
  const filteredData = data.filter(item => {
    const matchSearch = !searchText || 
      item.companyName.toLowerCase().includes(searchText.toLowerCase()) ||
      item.contactPerson.toLowerCase().includes(searchText.toLowerCase());
    const matchStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-6">
      <Card>
        <div className="mb-6">
          {/* 操作栏 */}
          <div className="flex justify-between items-center mb-4">
            <Space>
              <Input
                placeholder="搜索公司名称或联系人"
                value={searchText}
                onChange={setSearchText}
                prefix={<IconSearch />}
                style={{ width: 250 }}
              />
              <Select
                placeholder="选择状态"
                value={statusFilter}
                onChange={setStatusFilter}
                style={{ width: 120 }}
              >
                <Select.Option value="all">全部状态</Select.Option>
                <Select.Option value="active">活跃</Select.Option>
                <Select.Option value="inactive">非活跃</Select.Option>
                <Select.Option value="potential">潜在</Select.Option>
              </Select>
            </Space>
            
            <Button
              type="primary"
              icon={<IconPlus />}
              onClick={handleAdd}
            >
              添加客户
            </Button>
          </div>
        </div>

        {/* 数据表格 */}
        <Table
          columns={columns}
          data={filteredData}
          pagination={{
            pageSize: 10,
            showTotal: true,
            showJumper: true,
          }}
          rowKey="id"
        />

        {/* 添加/编辑客户弹窗 */}
        <Modal
          title="客户信息"
          visible={modalVisible}
          onOk={handleSubmit}
          onCancel={() => setModalVisible(false)}
          autoFocus={false}
          focusLock={true}
          style={{ width: 600 }}
        >
          <Form form={form} layout="vertical">
            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                label="公司名称"
                field="companyName"
                rules={[{ required: true, message: '请输入公司名称' }]}
              >
                <Input placeholder="请输入公司名称" />
              </Form.Item>
              
              <Form.Item
                label="联系人"
                field="contactPerson"
                rules={[{ required: true, message: '请输入联系人' }]}
              >
                <Input placeholder="请输入联系人" />
              </Form.Item>
              
              <Form.Item
                label="电话"
                field="phone"
                rules={[{ required: true, message: '请输入电话' }]}
              >
                <Input placeholder="请输入电话" />
              </Form.Item>
              
              <Form.Item
                label="邮箱"
                field="email"
                rules={[
                  { required: true, message: '请输入邮箱' },
                  { type: 'email', message: '请输入正确的邮箱格式' }
                ]}
              >
                <Input placeholder="请输入邮箱" />
              </Form.Item>
              
              <Form.Item
                label="行业"
                field="industry"
                rules={[{ required: true, message: '请选择行业' }]}
              >
                <Select placeholder="请选择行业">
                  <Select.Option value="电子科技">电子科技</Select.Option>
                  <Select.Option value="国际贸易">国际贸易</Select.Option>
                  <Select.Option value="物流运输">物流运输</Select.Option>
                  <Select.Option value="制造业">制造业</Select.Option>
                  <Select.Option value="服务业">服务业</Select.Option>
                </Select>
              </Form.Item>
              
              <Form.Item
                label="客户等级"
                field="customerLevel"
                rules={[{ required: true, message: '请选择客户等级' }]}
              >
                <Select placeholder="请选择客户等级">
                  <Select.Option value="S">S级</Select.Option>
                  <Select.Option value="A">A级</Select.Option>
                  <Select.Option value="B">B级</Select.Option>
                  <Select.Option value="C">C级</Select.Option>
                </Select>
              </Form.Item>
            </div>
            
            <Form.Item
              label="地址"
              field="address"
            >
              <Input placeholder="请输入地址" />
            </Form.Item>
            
            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                label="注册资本"
                field="registeredCapital"
              >
                <Input placeholder="请输入注册资本" />
              </Form.Item>
              
              <Form.Item
                label="信用额度"
                field="creditLimit"
              >
                <Input placeholder="请输入信用额度" />
              </Form.Item>
            </div>
            
            <Form.Item
              label="经营范围"
              field="businessScope"
            >
              <Input.TextArea placeholder="请输入经营范围" rows={3} />
            </Form.Item>
          </Form>
        </Modal>

        {/* 客户详情弹窗 */}
        <Modal
          title="客户详情"
          visible={detailModalVisible}
          onCancel={() => setDetailModalVisible(false)}
          footer={null}
          style={{ width: 800 }}
        >
          {selectedCustomer && (
            <Tabs defaultActiveTab="basic">
              <Tabs.TabPane key="basic" title="基本信息">
                <Descriptions
                  column={2}
                  data={[
                    { label: '公司名称', value: selectedCustomer.companyName },
                    { label: '联系人', value: selectedCustomer.contactPerson },
                    { label: '电话', value: selectedCustomer.phone },
                    { label: '邮箱', value: selectedCustomer.email },
                    { label: '行业', value: selectedCustomer.industry },
                    { label: '客户等级', value: `${selectedCustomer.customerLevel}级` },
                    { label: '状态', value: selectedCustomer.status === 'active' ? '活跃' : '非活跃' },
                    { label: '地址', value: selectedCustomer.address },
                    { label: '注册资本', value: selectedCustomer.registeredCapital },
                    { label: '经营范围', value: selectedCustomer.businessScope },
                  ]}
                />
              </Tabs.TabPane>
              
              <Tabs.TabPane key="business" title="业务信息">
                <Descriptions
                  column={2}
                  data={[
                    { label: '总订单数', value: selectedCustomer.totalOrders },
                    { label: '总交易金额', value: `¥${selectedCustomer.totalAmount.toLocaleString()}` },
                    { label: '信用额度', value: `¥${selectedCustomer.creditLimit.toLocaleString()}` },
                    { label: '付款条件', value: selectedCustomer.paymentTerms },
                    { label: '销售代表', value: selectedCustomer.salesRep },
                    { label: '创建时间', value: selectedCustomer.createTime },
                    { label: '最后订单时间', value: selectedCustomer.lastOrderTime },
                  ]}
                />
              </Tabs.TabPane>
            </Tabs>
          )}
        </Modal>
      </Card>
    </div>
  );
};

export default CustomerManagement;