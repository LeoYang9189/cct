import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  Typography, 
  Table, 
  Button, 
  Input, 
  Select, 
  Space, 
  Tag, 
  Avatar, 
  Modal,
  Message,
  Dropdown,
  Menu,
  Tooltip
} from '@arco-design/web-react';
import { 
  IconSearch, 
  IconPlus, 
   
  IconRefresh,
  IconUser,

} from '@arco-design/web-react/icon';

const { Text } = Typography;
const { Option } = Select;

// 统计卡片样式
const cardStyles = `
  .stats-card {
    position: relative;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border: 2px solid transparent !important;
    overflow: hidden;
  }

  .stats-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(22, 93, 255, 0.1), rgba(22, 93, 255, 0.05));
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 1;
  }

  .stats-card:hover {
    transform: translateY(-4px) scale(1.02);
    box-shadow: 0 8px 25px rgba(22, 93, 255, 0.15);
    border-color: rgba(22, 93, 255, 0.3) !important;
  }

  .stats-card:hover::before {
    opacity: 1;
  }

  .stats-card:active {
    transform: translateY(-2px) scale(1.01);
    box-shadow: 0 4px 15px rgba(22, 93, 255, 0.2);
  }

  .stats-card.selected {
    border-color: #165DFF !important;
    background: linear-gradient(135deg, rgba(22, 93, 255, 0.08), rgba(22, 93, 255, 0.03));
    box-shadow: 0 6px 20px rgba(22, 93, 255, 0.12);
    transform: translateY(-2px);
  }

  .stats-card.selected::before {
    opacity: 0.7;
  }

  .stats-card .card-content {
    position: relative;
    z-index: 2;
  }

  .stats-card .stats-number {
    position: relative;
    z-index: 2;
    font-weight: bold;
    transition: all 0.3s ease;
  }

  .stats-card:hover .stats-number {
    transform: scale(1.05);
  }

  .stats-card .stats-label {
    position: relative;
    z-index: 2;
    transition: all 0.3s ease;
  }

  .stats-card:hover .stats-label {
    transform: translateY(-1px);
  }
`;

// 添加样式到文档
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = cardStyles;
  if (!document.head.querySelector('style[data-stats-cards]')) {
    styleElement.setAttribute('data-stats-cards', 'true');
    document.head.appendChild(styleElement);
  }
}

interface UserData {
  id: string;
  username: string;
  email: string;
  phone: string;
  branches: string[];
  departments: string[];
  roles: string[];
  supervisors: string[];
  status: 'active' | 'inactive' | 'pending';
  lastLogin: string;
  createTime: string;
  avatar?: string;
  thirdPartyUserIds?: {
    [systemName: string]: string;
  };
}

const EmployeeManagement: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedCard, setSelectedCard] = useState('total');
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [toggleStatusModalVisible, setToggleStatusModalVisible] = useState(false);
  const [resetConfirmModalVisible, setResetConfirmModalVisible] = useState(false);
  const navigate = useNavigate();

  // 模拟用户数据
  const [userData, setUserData] = useState<UserData[]>([
    {
      id: 'A3K9M2X7N8Q5',
      username: '张三',
      email: 'zhangsan@example.com',
      phone: '13800138001',
      branches: ['货拉拉物流科技有限公司', '货拉拉华南分公司'],
      departments: ['物流部门', '技术部门'],
      roles: ['超级管理员', '部门经理'],
      supervisors: [],
      status: 'active',
      lastLogin: '2024-01-15 14:30:25',
      createTime: '2023-12-01 09:15:30',
      thirdPartyUserIds: {
        'CargoWare': 'huh768gh',
        'eTower': 'ghuhi788'
      }
    },
    {
      id: 'B7H4P1Y6R9L2',
      username: '李四',
      email: 'lisi@example.com',
      phone: '13800138002',
      branches: ['顺丰速运集团'],
      departments: ['客服部门', '市场部门'],
      roles: ['客服经理'],
      supervisors: ['张三'],
      status: 'active',
      lastLogin: '2024-01-14 16:22:18',
      createTime: '2023-11-15 11:20:45',
      thirdPartyUserIds: {
        'CargoWare': 'sf987xyz',
        'eTower': 'tower456'
      }
    },
    {
      id: 'C8F5T3W9E1K4',
      username: '王五',
      email: 'wangwu@example.com',
      phone: '13800138003',
      branches: ['德邦物流股份有限公司', '德邦华东分公司'],
      departments: ['运营部门'],
      roles: ['普通用户', '运营专员'],
      supervisors: ['李四', '赵六'],
      status: 'inactive',
      lastLogin: '2024-01-10 10:15:32',
      createTime: '2023-10-20 15:30:15',
      thirdPartyUserIds: {
        'CargoWare': 'db123qwe',
        'eTower': 'etw789asd'
      }
    },
    {
      id: 'D2J6V8S3G7N1',
      username: '赵六',
      email: 'zhaoliu@example.com',
      phone: '13800138004',
      branches: ['中通快递股份有限公司'],
      departments: ['财务部门', '审计部门'],
      roles: ['财务经理'],
      supervisors: ['张三'],
      status: 'pending',
      lastLogin: '从未登录',
      createTime: '2023-09-10 14:25:50',
      thirdPartyUserIds: {
        'CargoWare': 'zt456def',
        'eTower': 'ztower123'
      }
    },
    {
      id: 'E5L9Q2T8K6M3',
      username: '陈七',
      email: 'chenqi@example.com',
      phone: '13800138005',
      branches: ['货拉拉物流科技有限公司'],
      departments: ['人事部门'],
      roles: ['人事专员', '普通用户'],
      supervisors: ['张三', '李四'],
      status: 'active',
      lastLogin: '2024-01-13 09:45:12',
      createTime: '2023-08-05 16:10:25',
      thirdPartyUserIds: {
        'CargoWare': 'hr789ghi',
        'eTower': 'hrtower456'
      }
    },
    {
      id: 'F7N4P8R1S9W6',
      username: '孙八',
      email: 'sunba@example.com',
      phone: '13800138006',
      branches: ['顺丰速运集团', '顺丰华北分公司'],
      departments: ['技术部门', '产品部门'],
      roles: ['技术主管', '产品经理'],
      supervisors: ['张三'],
      status: 'active',
      lastLogin: '2024-01-12 11:30:18',
      createTime: '2023-07-20 10:55:40',
      thirdPartyUserIds: {
        'CargoWare': 'tech123jkl',
        'eTower': 'techsfexpress'
      }
    },
    {
      id: 'G1H8J3K5L7M9',
      username: '周九',
      email: 'zhoujiu@example.com',
      phone: '13800138007',
      branches: ['申通快递有限公司'],
      departments: ['市场部门'],
      roles: ['市场专员'],
      supervisors: ['李四', '孙八'],
      status: 'active',
      lastLogin: '2024-01-11 13:22:45',
      createTime: '2023-06-15 12:40:30',
      thirdPartyUserIds: {
        'CargoWare': 'mkt456nop',
        'eTower': 'shentongtower'
      }
    }
  ]);

  // 处理从企业管理页面传递过来的筛选条件
  useEffect(() => {
    const companyFilter = searchParams.get('company');
    if (companyFilter) {
      setSearchKeyword(companyFilter);
      Message.info(`已自动筛选企业：${companyFilter}`);
    }
  }, [searchParams]);

  // 根据当前筛选状态设置选中的卡片
  useEffect(() => {
    if (searchKeyword || roleFilter !== 'all') {
      setSelectedCard('');
    } else {
      switch (statusFilter) {
        case 'all':
          setSelectedCard('total');
          break;
        case 'active':
          setSelectedCard('active');
          break;
        case 'inactive':
          setSelectedCard('inactive');
          break;
        case 'pending':
          setSelectedCard('pending');
          break;
        default:
          setSelectedCard('');
      }
    }
  }, [statusFilter, roleFilter, searchKeyword]);

  const handleSearch = () => {
    setLoading(true);
    // 模拟搜索延迟
    setTimeout(() => {
      setLoading(false);
      Message.success('搜索完成');
    }, 800);
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Message.success('数据已刷新');
    }, 500);
  };

  const handleViewDetail = (user: UserData) => {
    setCurrentUser(user);
    setDetailModalVisible(true);
  };

  const handleEditUser = (user: UserData) => {
    navigate(`/controltower/edit-employee/${user.id}`);
  };

  const handleToggleStatus = (user: UserData) => {
    setCurrentUser(user);
    setToggleStatusModalVisible(true);
  };

  const confirmToggleStatus = () => {
    if (currentUser) {
      const newStatus = currentUser.status === 'active' ? 'inactive' : 'active';
      const statusText = newStatus === 'active' ? '启用' : '禁用';
      
      setUserData(prev => prev.map(user => 
        user.id === currentUser.id 
          ? { ...user, status: newStatus as 'active' | 'inactive' | 'pending' }
          : user
      ));
      
      Message.success(`用户 ${currentUser.username} 已${statusText}`);
      setToggleStatusModalVisible(false);
      setCurrentUser(null);
    }
  };

  const handleDeleteUser = (userId: string) => {
    setUserData(prev => prev.filter(u => u.id !== userId));
    Message.success('用户已删除');
  };

  const handleResetPassword = (user: UserData) => {
    setCurrentUser(user);
    setResetConfirmModalVisible(true);
  };

  const confirmResetPassword = () => {
    if (currentUser) {
      // 生成8位随机密码
      const generatePassword = () => {
        const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
        let password = '';
        for (let i = 0; i < 8; i++) {
          password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
      };

      generatePassword();
      setCurrentUser(prev => prev ? { ...prev, lastLogin: new Date().toLocaleString() } : null);
      setResetConfirmModalVisible(false);
    }
  };

  const handleCardClick = (cardType: string) => {
    setSelectedCard(cardType);
    
    switch (cardType) {
      case 'total':
        setStatusFilter('all');
        setRoleFilter('all');
        setSearchKeyword('');
        Message.info('显示全部用户');
        break;
      case 'active':
        setStatusFilter('active');
        setRoleFilter('all');
        setSearchKeyword('');
        Message.info('筛选活跃用户');
        break;
      case 'inactive':
        setStatusFilter('inactive');
        setRoleFilter('all');
        setSearchKeyword('');
        Message.info('筛选禁用用户');
        break;
      case 'pending':
        setStatusFilter('pending');
        setRoleFilter('all');
        setSearchKeyword('');
        Message.info('筛选待激活用户');
        break;
    }
  };

  const getStatusTag = (status: string) => {
    switch (status) {
      case 'active':
        return <Tag color="green">正常</Tag>;
      case 'inactive':
        return <Tag color="red">禁用</Tag>;
      case 'pending':
        return <Tag color="orange">待激活</Tag>;
      default:
        return <Tag color="gray">未知</Tag>;
    }
  };

  const getRoleTag = (role: string) => {
    const roleConfig = {
      'super_admin': { color: 'red', text: '超级管理员' },
      'user': { color: 'blue', text: '普通用户' },
      '超级管理员': { color: 'red', text: '超级管理员' },
      '部门经理': { color: 'orange', text: '部门经理' },
      '客服经理': { color: 'green', text: '客服经理' },
      '普通用户': { color: 'blue', text: '普通用户' },
      '运营专员': { color: 'cyan', text: '运营专员' },
      '财务经理': { color: 'purple', text: '财务经理' },
      '人事专员': { color: 'lime', text: '人事专员' },
      '技术主管': { color: 'magenta', text: '技术主管' },
      '产品经理': { color: 'gold', text: '产品经理' },
      '市场专员': { color: 'geekblue', text: '市场专员' }
    };
    
    const config = roleConfig[role as keyof typeof roleConfig] || { color: 'gray', text: role };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // 多选字段显示辅助函数
  const renderMultiSelectField = (items: string[], maxDisplay: number = 1) => {
    if (!items || items.length === 0) {
      return <Text type="secondary">-</Text>;
    }

    if (items.length <= maxDisplay) {
      return <Text>{items.join(', ')}</Text>;
    }

    const remaining = items.length - maxDisplay;
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <Text>{items[0]}</Text>
        <Tooltip content={items.join(', ')}>
          <Tag color="blue" style={{ cursor: 'pointer' }}>
            +{remaining}
          </Tag>
        </Tooltip>
      </div>
    );
  };

  const filteredData = userData.filter(user => {
    const matchesKeyword = !searchKeyword || 
      user.username.includes(searchKeyword) || 
      user.email.includes(searchKeyword) ||
      user.branches.some(branch => branch.includes(searchKeyword)) ||
      user.departments.some(department => department.includes(searchKeyword));
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesRole = roleFilter === 'all' || user.roles.some(role => role === roleFilter);
    
    return matchesKeyword && matchesStatus && matchesRole;
  });

  return (
    <div style={{ padding: '0' }}>


      {/* 搜索和筛选区域 */}
      <Card style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <Space size="medium">
            <Input
              style={{ width: 280 }}
              placeholder="搜索用户名、邮箱或公司"
              value={searchKeyword}
              onChange={(value) => setSearchKeyword(value)}
              prefix={<IconSearch />}
              allowClear
            />
            <Select
              placeholder="状态筛选"
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 120 }}
            >
              <Option value="all">全部状态</Option>
              <Option value="active">正常</Option>
              <Option value="inactive">禁用</Option>
              <Option value="pending">待激活</Option>
            </Select>
            <Select
              placeholder="角色筛选"
              value={roleFilter}
              onChange={setRoleFilter}
              style={{ width: 120 }}
            >
              <Option value="all">全部角色</Option>
              <Option value="super_admin">超级管理员</Option>
              <Option value="user">普通用户</Option>
            </Select>
            <Button type="primary" icon={<IconSearch />} onClick={handleSearch}>
              搜索
            </Button>
          </Space>
          
          <Space>
            <Button icon={<IconRefresh />} onClick={handleRefresh}>
              刷新
            </Button>
            <Button
              type="primary"
              size="large"
              icon={<IconPlus />}
              onClick={() => navigate('/controltower/add-employee')}
            >
              添加用户
            </Button>
          </Space>
        </div>
      </Card>

      {/* 用户统计卡片 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
        <Card 
          className={`stats-card ${selectedCard === 'total' ? 'selected' : ''}`}
          style={{ textAlign: 'center' }}
          onClick={() => handleCardClick('total')}
        >
          <div className="card-content">
            <div className="stats-number" style={{ fontSize: '24px', color: '#165DFF', marginBottom: '8px' }}>
              {userData.length}
            </div>
            <Text type="secondary" className="stats-label">总用户数</Text>
          </div>
        </Card>
        <Card 
          className={`stats-card ${selectedCard === 'active' ? 'selected' : ''}`}
          style={{ textAlign: 'center' }}
          onClick={() => handleCardClick('active')}
        >
          <div className="card-content">
            <div className="stats-number" style={{ fontSize: '24px', color: '#00B42A', marginBottom: '8px' }}>
              {userData.filter(u => u.status === 'active').length}
            </div>
            <Text type="secondary" className="stats-label">活跃用户</Text>
          </div>
        </Card>
        <Card 
          className={`stats-card ${selectedCard === 'inactive' ? 'selected' : ''}`}
          style={{ textAlign: 'center' }}
          onClick={() => handleCardClick('inactive')}
        >
          <div className="card-content">
            <div className="stats-number" style={{ fontSize: '24px', color: '#F53F3F', marginBottom: '8px' }}>
              {userData.filter(u => u.status === 'inactive').length}
            </div>
            <Text type="secondary" className="stats-label">禁用用户</Text>
          </div>
        </Card>
        <Card 
          className={`stats-card ${selectedCard === 'pending' ? 'selected' : ''}`}
          style={{ textAlign: 'center' }}
          onClick={() => handleCardClick('pending')}
        >
          <div className="card-content">
            <div className="stats-number" style={{ fontSize: '24px', color: '#FF7D00', marginBottom: '8px' }}>
              {userData.filter(u => u.status === 'pending').length}
            </div>
            <Text type="secondary" className="stats-label">待激活</Text>
          </div>
        </Card>
      </div>

      {/* 用户列表表格 */}
      <Card title={`用户列表 (${filteredData.length})`}>
        <Table
          loading={loading}
          data={filteredData}
          scroll={{ x: 1600 }}
          columns={[
            {
              title: '用户ID',
              dataIndex: 'id',
              key: 'id',
              width: 150,
              sorter: true,
              render: (id) => (
                <Text 
                  copyable={{ text: id, icon: null, tooltips: ['复制ID', '已复制'] }}
                  style={{ fontFamily: 'monospace', fontSize: '12px', whiteSpace: 'nowrap' }}
                >
                  {id}
                </Text>
              )
            },
            {
              title: '用户信息',
              dataIndex: 'username',
              key: 'username',
              width: 220,
              sorter: true,
              render: (_, record) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', whiteSpace: 'nowrap' }}>
                  <Avatar size={40} style={{ backgroundColor: '#165DFF', flexShrink: 0 }}>
                    <IconUser />
                  </Avatar>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 'bold', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {record.username}
                    </div>
                    <Text type="secondary" style={{ fontSize: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {record.email}
                    </Text>
                  </div>
                </div>
              )
            },
            {
              title: '联系方式',
              dataIndex: 'phone',
              key: 'phone',
              width: 140,
              sorter: true,
              render: (phone) => (
                <Text 
                  copyable={{ text: phone, icon: null, tooltips: ['复制手机号', '已复制'] }}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  {phone}
                </Text>
              )
            },
            {
              title: '归属分公司',
              dataIndex: 'branches',
              key: 'branches',
              width: 200,
              sorter: true,
              render: (branches: string[]) => (
                <div style={{ whiteSpace: 'nowrap' }}>
                  {renderMultiSelectField(branches, 1)}
                </div>
              )
            },
            {
              title: '归属部门',
              dataIndex: 'departments', 
              key: 'departments',
              width: 160,
              sorter: true,
              render: (departments: string[]) => (
                <div style={{ whiteSpace: 'nowrap' }}>
                  {renderMultiSelectField(departments, 1)}
                </div>
              )
            },
            {
              title: '授权角色',
              dataIndex: 'roles',
              key: 'roles',
              width: 160,
              sorter: true,
              render: (roles: string[]) => {
                if (!roles || roles.length === 0) {
                  return <Text type="secondary">-</Text>;
                }
                if (roles.length === 1) {
                  return <div style={{ whiteSpace: 'nowrap' }}>{getRoleTag(roles[0])}</div>;
                }
                return (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
                    {getRoleTag(roles[0])}
                    <Tooltip content={roles.join(', ')}>
                      <Tag color="blue" style={{ cursor: 'pointer' }}>
                        +{roles.length - 1}
                      </Tag>
                    </Tooltip>
                  </div>
                );
              }
            },
            {
              title: '上级主管',
              dataIndex: 'supervisors',
              key: 'supervisors', 
              width: 130,
              sorter: true,
              render: (supervisors: string[]) => (
                <div style={{ whiteSpace: 'nowrap' }}>
                  {renderMultiSelectField(supervisors, 1)}
                </div>
              )
            },
            {
              title: '状态',
              dataIndex: 'status',
              key: 'status',
              width: 90,
              sorter: true,
              render: (status) => (
                <div style={{ whiteSpace: 'nowrap' }}>
                  {getStatusTag(status)}
                </div>
              )
            },
            {
              title: '最后登录',
              dataIndex: 'lastLogin',
              key: 'lastLogin',
              width: 160,
              sorter: true,
              render: (lastLogin) => (
                <Text style={{ fontSize: '12px', whiteSpace: 'nowrap' }}>
                  {lastLogin}
                </Text>
              )
            },
            {
              title: '创建时间',
              dataIndex: 'createTime',
              key: 'createTime',
              width: 160,
              sorter: true,
              render: (createTime) => (
                <Text style={{ fontSize: '12px', whiteSpace: 'nowrap' }}>
                  {createTime}
                </Text>
              )
            },
            {
              title: '操作',
              key: 'actions',
              width: 200,
              fixed: 'right',
              render: (_, record) => (
                <div style={{ whiteSpace: 'nowrap' }}>
                  <Space>
                    <Button
                      type="text"
                      size="small"
                      onClick={() => handleViewDetail(record)}
                    >
                      详情
                    </Button>
                    <Button
                      type="text"
                      size="small"
                      onClick={() => handleEditUser(record)}
                    >
                      编辑
                    </Button>
                    <Dropdown
                      droplist={
                        <Menu>
                          <Menu.Item
                            key="toggle"
                            onClick={() => handleToggleStatus(record)}
                            style={{ color: '#165DFF' }}
                          >
                            {record.status === 'active' ? '禁用用户' : '启用用户'}
                          </Menu.Item>

                          <Menu.Item
                            key="resetPassword"
                            onClick={() => handleResetPassword(record)}
                            style={{ color: '#FF7D00' }}
                          >
                            重置密码
                          </Menu.Item>
                          <Menu.Item
                            key="delete"
                            onClick={() => {
                              Modal.confirm({
                                title: '确定要删除这个用户吗？',
                                content: `删除后用户 ${record.username} 的所有信息将无法恢复`,
                                okText: '确定删除',
                                cancelText: '取消',
                                onOk: () => handleDeleteUser(record.id)
                              });
                            }}
                            style={{ color: '#F53F3F' }}
                          >
                            删除用户
                          </Menu.Item>
                        </Menu>
                      }
                      position="bottom"
                      trigger="click"
                    >
                      <Button type="text" size="small">
                        更多
                      </Button>
                    </Dropdown>
                  </Space>
                </div>
              )
            }
          ]}
                     pagination={{
             total: filteredData.length,
             pageSize: 10,
             showTotal: (total, range) => 
               `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
             showJumper: true,
             sizeCanChange: true,
             sizeOptions: [10, 20, 50]
           }}
          rowKey="id"
          stripe
          border
        />
      </Card>

      {/* 用户详情查看模态框 */}
      <Modal
        title="用户详情"
        visible={detailModalVisible}
        onCancel={() => {
          setDetailModalVisible(false);
          setCurrentUser(null);
        }}
        footer={
          <Button type="primary" onClick={() => setDetailModalVisible(false)}>
            确定
          </Button>
        }
        style={{ width: 600 }}
      >
        {currentUser && (
          <div style={{ padding: '16px 0' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '16px 24px', alignItems: 'center' }}>
              <Text type="secondary">用户头像：</Text>
              <div>
                <Avatar size={60} style={{ backgroundColor: '#165DFF' }}>
                  <IconUser />
                </Avatar>
              </div>

              <Text type="secondary">用户名：</Text>
              <Text style={{ fontSize: '16px', fontWeight: 'bold' }}>{currentUser.username}</Text>

              <Text type="secondary">邮箱地址：</Text>
              <Text copyable={{ text: currentUser.email }}>{currentUser.email}</Text>

              <Text type="secondary">手机号：</Text>
              <Text copyable={{ text: currentUser.phone }}>{currentUser.phone}</Text>

              <Text type="secondary">所属公司：</Text>
              <Text>{currentUser.branches.join(', ')}</Text>

              <Text type="secondary">用户角色：</Text>
              <div>
                <Space>
                  {currentUser.roles.map((role, index) => (
                    <span key={index}>{getRoleTag(role)}</span>
                  ))}
                </Space>
              </div>

              <Text type="secondary">用户状态：</Text>
              <div>{getStatusTag(currentUser.status)}</div>

              <Text type="secondary">最后登录：</Text>
              <Text>{currentUser.lastLogin}</Text>

              <Text type="secondary">创建时间：</Text>
              <Text>{currentUser.createTime}</Text>

              <Text type="secondary">用户ID：</Text>
              <Text copyable={{ text: currentUser.id }} style={{ fontFamily: 'monospace' }}>
                {currentUser.id}
              </Text>
            </div>
          </div>
        )}
      </Modal>

      {/* 禁用/启用用户确认弹窗 */}
      <Modal
        title={currentUser?.status === 'active' ? '禁用用户确认' : '启用用户确认'}
        visible={toggleStatusModalVisible}
        onCancel={() => {
          setToggleStatusModalVisible(false);
          setCurrentUser(null);
        }}
        onOk={confirmToggleStatus}
        okText="确认"
        cancelText="取消"
        style={{ width: 480 }}
      >
        {currentUser && (
          <div style={{ padding: '16px 0' }}>
            <div style={{ 
              backgroundColor: currentUser.status === 'active' ? '#FFF2F0' : '#F6FFED', 
              border: `1px solid ${currentUser.status === 'active' ? '#FFCCC7' : '#B7EB8F'}`, 
              borderRadius: '6px', 
              padding: '16px',
              marginBottom: '16px'
            }}>
              <Text style={{ 
                fontSize: '16px', 
                color: currentUser.status === 'active' ? '#FF4D4F' : '#52C41A', 
                fontWeight: 'bold' 
              }}>
                {currentUser.status === 'active' ? '⚠️ 禁用确认' : '✅ 启用确认'}
              </Text>
            </div>
            
            <Text style={{ fontSize: '16px', lineHeight: '24px' }}>
              {currentUser.status === 'active' 
                ? <>将会禁用用户 <Text style={{ fontWeight: 'bold', color: '#165DFF' }}>{currentUser.username}</Text>，禁用后该用户将无法登录系统，是否确认？</>
                : <>将会启用用户 <Text style={{ fontWeight: 'bold', color: '#165DFF' }}>{currentUser.username}</Text>，启用后该用户可正常登录系统，是否确认？</>
              }
            </Text>
            
            <div style={{ 
              backgroundColor: '#F6F6F6', 
              borderRadius: '6px', 
              padding: '12px',
              marginTop: '16px'
            }}>
              <Text type="secondary" style={{ fontSize: '14px' }}>
                {currentUser.status === 'active' 
                  ? '注意：禁用后用户无法访问系统，但用户数据仍会保留'
                  : '注意：启用后用户将恢复正常的系统访问权限'
                }
              </Text>
            </div>
          </div>
        )}
      </Modal>

      {/* 重置密码确认弹窗 */}
      <Modal
        title="重置密码确认"
        visible={resetConfirmModalVisible}
        onCancel={() => {
          setResetConfirmModalVisible(false);
          setCurrentUser(null);
        }}
        onOk={confirmResetPassword}
        okText="确认重置"
        cancelText="取消"
        style={{ width: 480 }}
      >
        {currentUser && (
          <div style={{ padding: '16px 0' }}>
            <div style={{ 
              backgroundColor: '#FFF7E6', 
              border: '1px solid #FFD591', 
              borderRadius: '6px', 
              padding: '16px',
              marginBottom: '16px'
            }}>
              <Text style={{ fontSize: '16px', color: '#FA8C16', fontWeight: 'bold' }}>
                ⚠️ 操作确认
              </Text>
            </div>
            
            <Text style={{ fontSize: '16px', lineHeight: '24px' }}>
              将会重置用户 <Text style={{ fontWeight: 'bold', color: '#165DFF' }}>{currentUser.username}</Text> 的登录密码，是否确认？
            </Text>
            
            <div style={{ 
              backgroundColor: '#F6F6F6', 
              borderRadius: '6px', 
              padding: '12px',
              marginTop: '16px'
            }}>
              <Text type="secondary" style={{ fontSize: '14px' }}>
                注意：密码重置后将生成随机8位密码，并自动发送至用户邮箱
              </Text>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default EmployeeManagement; 