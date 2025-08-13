import React, { useState } from 'react';
import { Card, Button, Table, Input, Select, Space, Tag, Modal, Form, Avatar, Descriptions } from '@arco-design/web-react';
import { IconSearch, IconPlus, IconEye, IconEdit, IconDelete, IconPhone, IconEmail } from '@arco-design/web-react/icon';

/**
 * 联系人管理页面组件
 * 提供联系人信息的管理和维护功能
 */
const ContactManagement: React.FC = () => {
  // const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [form] = Form.useForm();

  // 模拟联系人数据
  const [data, setData] = useState([
    {
      id: 1,
      name: '张经理',
      company: '深圳市科技有限公司',
      position: '销售经理',
      department: '销售部',
      phone: '13800138001',
      email: 'zhang@tech.com',
      wechat: 'zhang_tech',
      qq: '123456789',
      address: '深圳市南山区科技园',
      birthday: '1985-06-15',
      gender: 'male',
      status: 'active',
      tags: ['重要客户', 'VIP'],
      notes: '主要负责华南区域业务，合作关系良好',
      createTime: '2024-01-15',
      lastContactTime: '2024-01-20',
      contactFrequency: 'weekly'
    },
    {
      id: 2,
      name: '李总',
      company: '上海贸易集团',
      position: '总经理',
      department: '管理层',
      phone: '13900139002',
      email: 'li@trade.com',
      wechat: 'li_trade',
      qq: '987654321',
      address: '上海市浦东新区陆家嘴',
      birthday: '1978-03-22',
      gender: 'male',
      status: 'active',
      tags: ['决策者', '大客户'],
      notes: '集团决策者，需要定期维护关系',
      createTime: '2024-01-16',
      lastContactTime: '2024-01-22',
      contactFrequency: 'monthly'
    },
    {
      id: 3,
      name: '王主任',
      company: '广州物流公司',
      position: '业务主任',
      department: '业务部',
      phone: '13700137003',
      email: 'wang@logistics.com',
      wechat: 'wang_logistics',
      qq: '456789123',
      address: '广州市天河区珠江新城',
      birthday: '1990-11-08',
      gender: 'female',
      status: 'inactive',
      tags: ['潜在客户'],
      notes: '业务对接人，最近联系较少',
      createTime: '2024-01-17',
      lastContactTime: '2023-12-15',
      contactFrequency: 'quarterly'
    }
  ]);

  const columns = [
    {
      title: '联系人',
      dataIndex: 'name',
      key: 'name',
      width: 120,
      render: (name: string, record: any) => (
        <div className="flex items-center">
          <Avatar size={32} style={{ backgroundColor: '#165DFF' }}>
            {name.charAt(0)}
          </Avatar>
          <div className="ml-2">
            <div className="font-medium">{name}</div>
            <div className="text-xs text-gray-500">{record.position}</div>
          </div>
        </div>
      ),
    },
    {
      title: '公司',
      dataIndex: 'company',
      key: 'company',
      width: 180,
    },
    {
      title: '部门',
      dataIndex: 'department',
      key: 'department',
      width: 100,
    },
    {
      title: '联系方式',
      key: 'contact',
      width: 200,
      render: (_: any, record: any) => (
        <div>
          <div className="flex items-center mb-1">
            <IconPhone className="mr-1 text-gray-400" />
            <span className="text-sm">{record.phone}</span>
          </div>
          <div className="flex items-center">
            <IconEmail className="mr-1 text-gray-400" />
            <span className="text-sm">{record.email}</span>
          </div>
        </div>
      ),
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      width: 150,
      render: (tags: string[]) => (
        <div>
          {tags.map((tag, index) => (
            <Tag key={index} color="blue" className="mb-1">
              {tag}
            </Tag>
          ))}
        </div>
      ),
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
      title: '最后联系',
      dataIndex: 'lastContactTime',
      key: 'lastContactTime',
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
   * 处理查看联系人详情
   */
  const handleViewDetail = (record: any) => {
    setSelectedContact(record);
    setDetailModalVisible(true);
  };

  /**
   * 处理编辑联系人信息
   */
  const handleEdit = (record: any) => {
    form.setFieldsValue({
      ...record,
      tags: record.tags.join(',')
    });
    setModalVisible(true);
  };

  /**
   * 处理删除联系人
   */
  const handleDelete = (record: any) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除联系人"${record.name}"吗？`,
      onOk: () => {
        setData(data.filter(item => item.id !== record.id));
      },
    });
  };

  /**
   * 处理添加新联系人
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
      const values = await form.validate();
      // 处理标签字符串转数组
      if (values.tags) {
        values.tags = values.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean);
      }
      // 这里应该调用API保存数据
      setModalVisible(false);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 过滤数据
  const filteredData = data.filter(item => {
    const matchSearch = !searchText || 
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.company.toLowerCase().includes(searchText.toLowerCase()) ||
      item.phone.includes(searchText);
    const matchDepartment = departmentFilter === 'all' || item.department === departmentFilter;
    return matchSearch && matchDepartment;
  });

  return (
    <div className="p-6">
      <Card>
        <div className="mb-6">
          {/* 操作栏 */}
          <div className="flex justify-between items-center mb-4">
            <Space>
              <Input
                placeholder="搜索姓名、公司或电话"
                value={searchText}
                onChange={setSearchText}
                prefix={<IconSearch />}
                style={{ width: 250 }}
              />
              <Select
                placeholder="选择部门"
                value={departmentFilter}
                onChange={setDepartmentFilter}
                style={{ width: 120 }}
              >
                <Select.Option value="all">全部部门</Select.Option>
                <Select.Option value="销售部">销售部</Select.Option>
                <Select.Option value="管理层">管理层</Select.Option>
                <Select.Option value="业务部">业务部</Select.Option>
                <Select.Option value="采购部">采购部</Select.Option>
              </Select>
            </Space>
            
            <Button
              type="primary"
              icon={<IconPlus />}
              onClick={handleAdd}
            >
              添加联系人
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

        {/* 添加/编辑联系人弹窗 */}
        <Modal
          title="联系人信息"
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
                label="姓名"
                field="name"
                rules={[{ required: true, message: '请输入姓名' }]}
              >
                <Input placeholder="请输入姓名" />
              </Form.Item>
              
              <Form.Item
                label="公司"
                field="company"
                rules={[{ required: true, message: '请输入公司' }]}
              >
                <Input placeholder="请输入公司" />
              </Form.Item>
              
              <Form.Item
                label="职位"
                field="position"
                rules={[{ required: true, message: '请输入职位' }]}
              >
                <Input placeholder="请输入职位" />
              </Form.Item>
              
              <Form.Item
                label="部门"
                field="department"
                rules={[{ required: true, message: '请选择部门' }]}
              >
                <Select placeholder="请选择部门">
                  <Select.Option value="销售部">销售部</Select.Option>
                  <Select.Option value="管理层">管理层</Select.Option>
                  <Select.Option value="业务部">业务部</Select.Option>
                  <Select.Option value="采购部">采购部</Select.Option>
                  <Select.Option value="财务部">财务部</Select.Option>
                </Select>
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
                label="微信"
                field="wechat"
              >
                <Input placeholder="请输入微信号" />
              </Form.Item>
              
              <Form.Item
                label="QQ"
                field="qq"
              >
                <Input placeholder="请输入QQ号" />
              </Form.Item>
              
              <Form.Item
                label="性别"
                field="gender"
              >
                <Select placeholder="请选择性别">
                  <Select.Option value="male">男</Select.Option>
                  <Select.Option value="female">女</Select.Option>
                </Select>
              </Form.Item>
              
              <Form.Item
                label="生日"
                field="birthday"
              >
                <Input placeholder="请输入生日 (YYYY-MM-DD)" />
              </Form.Item>
            </div>
            
            <Form.Item
              label="地址"
              field="address"
            >
              <Input placeholder="请输入地址" />
            </Form.Item>
            
            <Form.Item
              label="标签"
              field="tags"
            >
              <Input placeholder="请输入标签，多个标签用逗号分隔" />
            </Form.Item>
            
            <Form.Item
              label="备注"
              field="notes"
            >
              <Input.TextArea placeholder="请输入备注信息" rows={3} />
            </Form.Item>
          </Form>
        </Modal>

        {/* 联系人详情弹窗 */}
        <Modal
          title="联系人详情"
          visible={detailModalVisible}
          onCancel={() => setDetailModalVisible(false)}
          footer={null}
          style={{ width: 600 }}
        >
          {selectedContact && (
            <div>
              <div className="flex items-center mb-6">
                <Avatar size={64} style={{ backgroundColor: '#165DFF' }}>
                  {selectedContact.name.charAt(0)}
                </Avatar>
                <div className="ml-4">
                  <h3 className="text-xl font-bold">{selectedContact.name}</h3>
                  <p className="text-gray-600">{selectedContact.position}</p>
                  <p className="text-gray-500">{selectedContact.company}</p>
                </div>
              </div>
              
              <Descriptions
                column={2}
                data={[
                  { label: '部门', value: selectedContact.department },
                  { label: '性别', value: selectedContact.gender === 'male' ? '男' : '女' },
                  { label: '电话', value: selectedContact.phone },
                  { label: '邮箱', value: selectedContact.email },
                  { label: '微信', value: selectedContact.wechat },
                  { label: 'QQ', value: selectedContact.qq },
                  { label: '生日', value: selectedContact.birthday },
                  { label: '状态', value: selectedContact.status === 'active' ? '活跃' : '非活跃' },
                  { label: '地址', value: selectedContact.address },
                  { label: '创建时间', value: selectedContact.createTime },
                  { label: '最后联系', value: selectedContact.lastContactTime },
                  { label: '联系频率', value: selectedContact.contactFrequency },
                ]}
              />
              
              {selectedContact.tags && selectedContact.tags.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">标签</h4>
                  <div>
                    {selectedContact.tags.map((tag: string, index: number) => (
                      <Tag key={index} color="blue" className="mb-1 mr-1">
                        {tag}
                      </Tag>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedContact.notes && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">备注</h4>
                  <p className="text-gray-600">{selectedContact.notes}</p>
                </div>
              )}
            </div>
          )}
        </Modal>
      </Card>
    </div>
  );
};

export default ContactManagement;