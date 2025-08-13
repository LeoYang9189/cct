import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Table, 
  Button, 
  Switch, 
  Dropdown, 
  Menu, 
  Space, 
  Breadcrumb,
  Card,
  Input,
  Select,
  Modal,
  Form,
  Message
} from '@arco-design/web-react';
import { 
  IconMore, 
  IconPlus, 
  IconSearch,
  IconEdit,
  IconDelete,
  IconSettings,
  IconUser
} from '@arco-design/web-react/icon';

/**
 * 角色权限管理页面组件
 * 提供角色的增删改查功能，以及权限配置功能
 */
const RolePermissionManagement: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [form] = Form.useForm();

  // 模拟数据
  const [dataSource, setDataSource] = useState([
    {
      id: 1,
      roleName: '同行客户',
      roleCode: 'PEER_CUSTOMER',
      description: '同行业客户角色，负责同行业务合作与协调',
      status: true,
      createTime: '2024-01-15 10:30:00',
      updateTime: '2024-01-15 10:30:00'
    },
    {
      id: 2,
      roleName: '贸易公司',
      roleCode: 'TRADING_COMPANY',
      description: '贸易公司角色，负责进出口贸易业务管理',
      status: true,
      createTime: '2024-01-16 09:20:00',
      updateTime: '2024-01-16 09:20:00'
    },
    {
      id: 3,
      roleName: '工厂',
      roleCode: 'FACTORY',
      description: '工厂角色，负责生产制造相关业务',
      status: true,
      createTime: '2024-01-17 14:15:00',
      updateTime: '2024-01-17 14:15:00'
    },
    {
      id: 4,
      roleName: '电商客户',
      roleCode: 'ECOMMERCE_CUSTOMER',
      description: '电商客户角色，负责电商平台业务管理',
      status: false,
      createTime: '2024-01-18 11:30:00',
      updateTime: '2024-01-18 11:30:00'
    },
    {
      id: 5,
      roleName: '车队',
      roleCode: 'FLEET',
      description: '车队角色，负责运输车队管理与调度',
      status: true,
      createTime: '2024-01-19 08:45:00',
      updateTime: '2024-01-19 08:45:00'
    },
    {
      id: 6,
      roleName: '报关行',
      roleCode: 'CUSTOMS_BROKER',
      description: '报关行角色，负责海关报关业务处理',
      status: true,
      createTime: '2024-01-20 13:20:00',
      updateTime: '2024-01-20 13:20:00'
    },
    {
      id: 7,
      roleName: '同行一代',
      roleCode: 'PEER_AGENT',
      description: '同行一级代理角色，负责同行代理业务',
      status: false,
      createTime: '2024-01-21 16:10:00',
      updateTime: '2024-01-21 16:10:00'
    },
    {
      id: 8,
      roleName: '订舱代理',
      roleCode: 'BOOKING_AGENT',
      description: '订舱代理角色，负责船舶订舱业务代理',
      status: true,
      createTime: '2024-01-22 10:05:00',
      updateTime: '2024-01-22 10:05:00'
    },
    {
      id: 9,
      roleName: '目的港代理',
      roleCode: 'DESTINATION_AGENT',
      description: '目的港代理角色，负责目的港口业务代理',
      status: true,
      createTime: '2024-01-23 15:30:00',
      updateTime: '2024-01-23 15:30:00'
    },
    {
      id: 10,
      roleName: '海外仓',
      roleCode: 'OVERSEAS_WAREHOUSE',
      description: '海外仓角色，负责海外仓储管理与运营',
      status: false,
      createTime: '2024-01-24 12:15:00',
      updateTime: '2024-01-24 12:15:00'
    }
  ]);

  /**
   * 处理状态切换
   */
  const handleStatusChange = (checked: boolean, record: any) => {
    setDataSource(prev => 
      prev.map(item => 
        item.id === record.id 
          ? { ...item, status: checked }
          : item
      )
    );
    Message.success(`${record.roleName} 状态已${checked ? '启用' : '禁用'}`);
  };

  /**
   * 处理编辑操作
   */
  const handleEdit = (record: any) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  /**
   * 处理删除操作
   */
  const handleDelete = (record: any) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除角色 "${record.roleName}" 吗？删除后不可恢复。`,
      onOk: () => {
        setDataSource(prev => prev.filter(item => item.id !== record.id));
        Message.success('删除成功');
      }
    });
  };

  /**
   * 处理权限设置
   */
  const handlePermissionSetting = (record: any) => {
    navigate(`/controltower/role-permission-config/${record.id}`);
  };

  /**
   * 处理配置客商
   */
  const handleCustomerConfig = (record: any) => {
    navigate(`/controltower/role-customer-config/${record.id}`);
  };

  /**
   * 更多操作菜单
   */
  const getMoreMenu = (record: any) => (
    <Menu>
      <Menu.Item key="permission" onClick={() => handlePermissionSetting(record)}>
        <IconSettings className="mr-2" />
        权限设置
      </Menu.Item>
      <Menu.Item key="customer" onClick={() => handleCustomerConfig(record)}>
        <IconUser className="mr-2" />
        配置客商
      </Menu.Item>
    </Menu>
  );

  /**
   * 表格列配置
   */
  const columns = [
    {
      title: '角色代码',
      dataIndex: 'roleCode',
      key: 'roleCode',
      width: 120,
      render: (text: string) => (
        <span className="font-medium text-blue-600">{text}</span>
      )
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
      key: 'roleName',
      width: 120
    },
    {
      title: '角色描述',
      dataIndex: 'description',
      key: 'description',
      width: 200,
      ellipsis: true
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: boolean, record: any) => (
        <Switch
          checked={status}
          onChange={(checked) => handleStatusChange(checked, record)}
          checkedText="启用"
          uncheckedText="禁用"
        />
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right' as const,
      render: (_: any, record: any) => (
        <Space>
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
          <Dropdown droplist={getMoreMenu(record)} position="bottom">
            <Button
              type="text"
              size="small"
              icon={<IconMore />}
            >
              更多
            </Button>
          </Dropdown>
        </Space>
      )
    }
  ];

  /**
   * 处理新增/编辑提交
   */
  const handleSubmit = async () => {
    try {
      const values = await form.validate();
      if (editingRecord) {
        // 编辑
        setDataSource(prev =>
          prev.map(item =>
            item.id === editingRecord.id
              ? { ...item, ...values, updateTime: new Date().toLocaleString() }
              : item
          )
        );
        Message.success('编辑成功');
      } else {
        // 新增
        const newRecord = {
          id: Date.now(),
          ...values,
          status: true,
          creator: '当前用户',
          createTime: new Date().toLocaleString(),
          updater: '当前用户',
          updateTime: new Date().toLocaleString()
        };
        setDataSource(prev => [newRecord, ...prev]);
        Message.success('新增成功');
      }
      setModalVisible(false);
      setEditingRecord(null);
      form.resetFields();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  /**
   * 处理搜索
   */
  const handleSearch = () => {
    setLoading(true);
    // 模拟搜索延迟
    setTimeout(() => {
      setLoading(false);
      Message.success('搜索完成');
    }, 1000);
  };



  /**
   * 过滤数据
   */
  const filteredData = dataSource.filter(item => {
    const matchesSearch = !searchText || 
      item.roleCode?.toLowerCase().includes(searchText.toLowerCase()) ||
      item.roleName.toLowerCase().includes(searchText.toLowerCase()) ||
      item.description.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'enabled' && item.status) ||
      (statusFilter === 'disabled' && !item.status);
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6">
      {/* 面包屑导航 */}
      <Breadcrumb className="mb-4">
        <Breadcrumb.Item key="customer-center">客商中心</Breadcrumb.Item>
        <Breadcrumb.Item key="role-permission-management">角色权限管理</Breadcrumb.Item>
      </Breadcrumb>

      <Card>
        {/* 搜索和操作栏 */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            <Input
              placeholder="请输入角色代码、名称或描述"
              value={searchText}
              onChange={setSearchText}
              style={{ width: 300 }}
              prefix={<IconSearch />}
              allowClear
            />
            <Select
              placeholder="状态筛选"
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 120 }}
            >
              <Select.Option value="all">全部</Select.Option>
              <Select.Option value="enabled">启用</Select.Option>
              <Select.Option value="disabled">禁用</Select.Option>
            </Select>
            <Button
              type="primary"
              icon={<IconSearch />}
              onClick={handleSearch}
              loading={loading}
            >
              搜索
            </Button>
          </div>
          <Button
            type="primary"
            icon={<IconPlus />}
            onClick={() => {
              setEditingRecord(null);
              form.resetFields();
              setModalVisible(true);
            }}
          >
            新增角色
          </Button>
        </div>

        {/* 表格 */}
        <Table
          columns={columns}
          data={filteredData}
          loading={loading}
          pagination={{
            total: filteredData.length,
            pageSize: 10,
            showTotal: true,
            showJumper: true,
            sizeCanChange: true
          }}
          scroll={{ x: 1000 }}
          rowKey="id"
        />
      </Card>

      {/* 新增/编辑弹窗 */}
      <Modal
        title={editingRecord ? '编辑角色' : '新增角色'}
        visible={modalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setModalVisible(false);
          setEditingRecord(null);
          form.resetFields();
        }}
        autoFocus={false}
        focusLock={true}
      >
        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
        >
          <Form.Item
            label="角色代码"
            field="roleCode"
            rules={[{ required: true, message: '请输入角色代码' }]}
          >
            <Input placeholder="请输入角色代码" />
          </Form.Item>
          <Form.Item
            label="角色名称"
            field="roleName"
            rules={[{ required: true, message: '请输入角色名称' }]}
          >
            <Input placeholder="请输入角色名称" />
          </Form.Item>
          <Form.Item
            label="角色描述"
            field="description"
          >
            <Input.TextArea
              placeholder="请输入角色描述"
              rows={3}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RolePermissionManagement;