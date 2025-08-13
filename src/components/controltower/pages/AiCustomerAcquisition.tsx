import React, { useState } from 'react';
import { Card, Button, Table, Input, Select, Space, Tag, Modal, Form, Message } from '@arco-design/web-react';
import { IconSearch, IconPlus, IconEye, IconEdit, IconDelete } from '@arco-design/web-react/icon';

/**
 * AI获客页面组件
 * 提供AI驱动的客户获取和管理功能
 */
const AiCustomerAcquisition: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  // 模拟数据
  const [data, setData] = useState([
    {
      id: 1,
      companyName: '深圳市科技有限公司',
      contactPerson: '张经理',
      phone: '13800138001',
      email: 'zhang@tech.com',
      industry: '电子科技',
      aiScore: 85,
      status: 'potential',
      source: 'AI推荐',
      createTime: '2024-01-15',
      lastContact: '2024-01-20'
    },
    {
      id: 2,
      companyName: '上海贸易集团',
      contactPerson: '李总',
      phone: '13900139002',
      email: 'li@trade.com',
      industry: '国际贸易',
      aiScore: 92,
      status: 'contacted',
      source: '网络爬虫',
      createTime: '2024-01-16',
      lastContact: '2024-01-22'
    },
    {
      id: 3,
      companyName: '广州物流公司',
      contactPerson: '王主任',
      phone: '13700137003',
      email: 'wang@logistics.com',
      industry: '物流运输',
      aiScore: 78,
      status: 'converted',
      source: 'AI分析',
      createTime: '2024-01-17',
      lastContact: '2024-01-25'
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
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      width: 180,
    },
    {
      title: '行业',
      dataIndex: 'industry',
      key: 'industry',
      width: 100,
    },
    {
      title: 'AI评分',
      dataIndex: 'aiScore',
      key: 'aiScore',
      width: 80,
      render: (score: number) => (
        <Tag color={score >= 90 ? 'green' : score >= 80 ? 'orange' : 'red'}>
          {score}分
        </Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const statusMap = {
          potential: { color: 'blue', text: '潜在客户' },
          contacted: { color: 'orange', text: '已联系' },
          converted: { color: 'green', text: '已转化' },
        };
        const config = statusMap[status as keyof typeof statusMap];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '来源',
      dataIndex: 'source',
      key: 'source',
      width: 100,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 120,
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
            onClick={() => handleView(record)}
          >
            查看
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
  const handleView = (record: any) => {
    Message.info(`查看客户：${record.companyName}`);
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
        Message.success('删除成功');
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
      Message.success('保存成功');
      setModalVisible(false);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  /**
   * AI智能获客
   */
  const handleAiAcquisition = () => {
    setLoading(true);
    // 模拟AI获客过程
    setTimeout(() => {
      Message.success('AI获客完成，发现3个新的潜在客户');
      setLoading(false);
    }, 2000);
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
                <Select.Option value="potential">潜在客户</Select.Option>
                <Select.Option value="contacted">已联系</Select.Option>
                <Select.Option value="converted">已转化</Select.Option>
              </Select>
            </Space>
            
            <Space>
              <Button
                type="primary"
                icon={<IconPlus />}
                onClick={handleAdd}
              >
                添加客户
              </Button>
              <Button
                type="primary"
                status="success"
                loading={loading}
                onClick={handleAiAcquisition}
              >
                AI智能获客
              </Button>
            </Space>
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
        >
          <Form form={form} layout="vertical">
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
              label="状态"
              field="status"
              rules={[{ required: true, message: '请选择状态' }]}
            >
              <Select placeholder="请选择状态">
                <Select.Option value="potential">潜在客户</Select.Option>
                <Select.Option value="contacted">已联系</Select.Option>
                <Select.Option value="converted">已转化</Select.Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  );
};

export default AiCustomerAcquisition;