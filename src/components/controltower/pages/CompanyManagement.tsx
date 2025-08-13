import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  Typography, 
  Table, 
  Button, 
  Input, 
  Select, 
  Space, 
  Tag, 
 
  Modal,
  Form,
  Message,
  Descriptions,
  Dropdown,
  Menu
} from '@arco-design/web-react';
import { 
  IconSearch, 
  IconPlus, 
  IconRefresh,
  IconPhone,
  IconLocation,
  IconUser
} from '@arco-design/web-react/icon';

const { Text } = Typography;
const { Option } = Select;

// 统计卡片样式 - 与用户管理完全一致
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
  if (!document.head.querySelector('style[data-company-stats-cards]')) {
    styleElement.setAttribute('data-company-stats-cards', 'true');
    document.head.appendChild(styleElement);
  }
}

interface CompanyData {
  id: string;
  companyCode?: string; // 企业编码，8位随机字母数字组合，待审核和审核拒绝的没有企业编码
  name: string;
  englishName: string;
  contactPerson: string;
  contactPhone: string;
  email: string;
  address: string;
  industry: string;
  scale: string;
  businessLicense: string;
  status: 'active' | 'inactive' | 'pending' | 'rejected';
  userCount: number;
  createTime: string;
  lastActive: string;
}

const CompanyManagement: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [industryFilter, setIndustryFilter] = useState('all');
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [auditModalVisible, setAuditModalVisible] = useState(false);
  const [currentCompany, setCurrentCompany] = useState<CompanyData | null>(null);
  const [selectedCard, setSelectedCard] = useState<string>('');
  const [auditForm] = Form.useForm();

  // 模拟企业数据
  const [companyData, setCompanyData] = useState<CompanyData[]>([
    {
      id: '1',
      companyCode: 'HLL8K9M2', // 8位随机字母数字组合
      name: '货拉拉物流科技有限公司',
      englishName: 'Huolala Logistics Technology Co., Ltd.',
      contactPerson: '张经理',
      contactPhone: '13800138001',
      email: 'contact@huolala.com',
      address: '北京市朝阳区建国路88号SOHO现代城',
      industry: '物流运输',
      scale: '大型企业',
      businessLicense: '91110000123456789X',
      status: 'active',
      userCount: 156,
      createTime: '2023-03-15 09:30:00',
      lastActive: '2024-01-15 16:20:35'
    },
    {
      id: '2',
      companyCode: 'SF7X4N6Y', // 8位随机字母数字组合
      name: '顺丰速运集团',
      englishName: 'SF Express Group',
      contactPerson: '李总监',
      contactPhone: '13800138002',
      email: 'business@sf-express.com',
      address: '深圳市福田区益田路6009号新世界中心',
      industry: '快递服务',
      scale: '大型企业',
      businessLicense: '91440300987654321A',
      status: 'active',
      userCount: 2340,
      createTime: '2023-01-20 11:15:20',
      lastActive: '2024-01-15 14:45:12'
    },
    {
      id: '3',
      name: '德邦物流股份有限公司',
      englishName: 'Deppon Logistics Co., Ltd.',
      contactPerson: '王主管',
      contactPhone: '13800138003',
      email: 'service@deppon.com',
      address: '上海市青浦区徐泾镇盈港东路7799号',
      industry: '物流运输',
      scale: '中型企业',
      businessLicense: '91310000456789123B',
      status: 'pending',
      userCount: 89,
      createTime: '2024-01-10 14:22:18',
      lastActive: '2024-01-12 10:15:30'
    },
          {
        id: '4',
        name: '中通快递股份有限公司',
        englishName: 'ZTO Express Co., Ltd.',
        contactPerson: '赵副总',
        contactPhone: '13800138004',
        email: 'cooperation@zto.com',
        address: '杭州市余杭区仓前街道文一西路1378号',
        industry: '快递服务',
        scale: '大型企业',
        businessLicense: '91330000654321987C',
        status: 'rejected',
        userCount: 45,
        createTime: '2023-11-05 16:45:30',
        lastActive: '2023-12-20 09:30:15'
      },
      {
        id: '5',
        companyCode: 'ST3M8P9Q', // 8位随机字母数字组合
        name: '申通快递有限公司',
        englishName: 'STO Express Co., Ltd.',
        contactPerson: '陈经理',
        contactPhone: '13800138005',
        email: 'info@sto.cn',
        address: '上海市奉贤区青村镇申隆生态园',
        industry: '快递服务',
        scale: '中型企业',
        businessLicense: '91310000321987654D',
        status: 'inactive',
        userCount: 234,
        createTime: '2023-06-18 13:20:45',
        lastActive: '2024-01-14 11:25:40'
      },
      {
        id: '6',
        name: '韵达速递有限公司',
        englishName: 'Yunda Express Co., Ltd.',
        contactPerson: '刘总',
        contactPhone: '13800138006',
        email: 'service@yunda.com',
        address: '上海市青浦区华新镇华志路1685号',
        industry: '快递服务',
        scale: '中型企业',
        businessLicense: '91310000789456123E',
        status: 'rejected',
        userCount: 67,
        createTime: '2023-08-12 10:30:25',
        lastActive: '2023-09-15 14:20:10'
      }
  ]);

  const handleSearch = () => {
    setLoading(true);
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

  const handleViewDetail = (company: CompanyData) => {
    setCurrentCompany(company);
    setDetailModalVisible(true);
  };

  const handleToggleStatus = (company: CompanyData) => {
    const newStatus = company.status === 'active' ? 'inactive' : 'active';
    setCompanyData(prev => prev.map(c => 
      c.id === company.id ? { ...c, status: newStatus } : c
    ));
    Message.success(`企业状态已${newStatus === 'active' ? '启用' : '停用'}`);
  };

  const handleDeleteCompany = (companyId: string) => {
    setCompanyData(prev => prev.filter(c => c.id !== companyId));
    Message.success('企业已删除');
  };

  const handleCardClick = (cardType: string) => {
    setSelectedCard(selectedCard === cardType ? '' : cardType);
    
    switch (cardType) {
      case 'total':
        setStatusFilter('all');
        Message.info('已显示所有企业');
        break;
      case 'active':
        setStatusFilter('active');
        Message.info('已筛选正常企业');
        break;
      case 'inactive':
        setStatusFilter('inactive');
        Message.info('已筛选已停用企业');
        break;
      case 'pending':
        setStatusFilter('pending');
        Message.info('已筛选待审核企业');
        break;
      case 'rejected':
        setStatusFilter('rejected');
        Message.info('已筛选审核拒绝企业');
        break;
      default:
        setStatusFilter('all');
        break;
    }
  };

  const handleAuditCompany = (company: CompanyData) => {
    setCurrentCompany(company);
    auditForm.setFieldsValue({
      auditResult: '',
      auditReason: ''
    });
    setAuditModalVisible(true);
  };

  const getStatusTag = (status: string) => {
    switch (status) {
      case 'active':
        return <Tag color="green">正常</Tag>;
      case 'inactive':
        return <Tag color="red">已停用</Tag>;
      case 'pending':
        return <Tag color="orange">待审核</Tag>;
      case 'rejected':
        return <Tag color="gray">审核拒绝</Tag>;
      default:
        return <Tag color="gray">未知</Tag>;
    }
  };



  const filteredData = companyData.filter(company => {
    const matchesKeyword = !searchKeyword || 
      company.name.includes(searchKeyword) || 
      company.contactPerson.includes(searchKeyword) ||
      company.industry.includes(searchKeyword);
    const matchesStatus = statusFilter === 'all' || company.status === statusFilter;
    const matchesIndustry = industryFilter === 'all' || company.industry === industryFilter;
    
    return matchesKeyword && matchesStatus && matchesIndustry;
  });

  return (
    <div style={{ padding: '0' }}>


      {/* 搜索和筛选区域 */}
      <Card style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <Space size="medium">
            <Input
              style={{ width: 280 }}
              placeholder="搜索企业名称、联系人或行业"
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
              <Option value="inactive">已停用</Option>
              <Option value="pending">待审核</Option>
              <Option value="rejected">审核拒绝</Option>
            </Select>
            <Select
              placeholder="行业筛选"
              value={industryFilter}
              onChange={setIndustryFilter}
              style={{ width: 120 }}
            >
              <Option value="all">全部行业</Option>
              <Option value="物流运输">物流运输</Option>
              <Option value="快递服务">快递服务</Option>
              <Option value="仓储服务">仓储服务</Option>
              <Option value="供应链">供应链</Option>
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
              icon={<IconPlus />}
              onClick={() => {
                navigate('/controltower/company-management/add');
              }}
            >
              添加企业
            </Button>
          </Space>
        </div>
      </Card>

      {/* 企业统计卡片 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
        <Card 
          className={`stats-card ${selectedCard === 'total' ? 'selected' : ''}`}
          style={{ textAlign: 'center' }}
          onClick={() => handleCardClick('total')}
        >
          <div className="card-content">
            <div className="stats-number" style={{ fontSize: '24px', color: '#165DFF', marginBottom: '8px' }}>
              {companyData.length}
            </div>
            <Text type="secondary" className="stats-label">总企业数</Text>
          </div>
        </Card>
        <Card 
          className={`stats-card ${selectedCard === 'active' ? 'selected' : ''}`}
          style={{ textAlign: 'center' }}
          onClick={() => handleCardClick('active')}
        >
          <div className="card-content">
            <div className="stats-number" style={{ fontSize: '24px', color: '#00B42A', marginBottom: '8px' }}>
              {companyData.filter(c => c.status === 'active').length}
            </div>
            <Text type="secondary" className="stats-label">正常</Text>
          </div>
        </Card>
        <Card 
          className={`stats-card ${selectedCard === 'inactive' ? 'selected' : ''}`}
          style={{ textAlign: 'center' }}
          onClick={() => handleCardClick('inactive')}
        >
          <div className="card-content">
            <div className="stats-number" style={{ fontSize: '24px', color: '#F53F3F', marginBottom: '8px' }}>
              {companyData.filter(c => c.status === 'inactive').length}
            </div>
            <Text type="secondary" className="stats-label">已停用</Text>
          </div>
        </Card>
        <Card 
          className={`stats-card ${selectedCard === 'pending' ? 'selected' : ''}`}
          style={{ textAlign: 'center' }}
          onClick={() => handleCardClick('pending')}
        >
          <div className="card-content">
            <div className="stats-number" style={{ fontSize: '24px', color: '#FF7D00', marginBottom: '8px' }}>
              {companyData.filter(c => c.status === 'pending').length}
            </div>
            <Text type="secondary" className="stats-label">待审核</Text>
          </div>
        </Card>
        <Card 
          className={`stats-card ${selectedCard === 'rejected' ? 'selected' : ''}`}
          style={{ textAlign: 'center' }}
          onClick={() => handleCardClick('rejected')}
        >
          <div className="card-content">
            <div className="stats-number" style={{ fontSize: '24px', color: '#722ED1', marginBottom: '8px' }}>
              {companyData.filter(c => c.status === 'rejected').length}
            </div>
            <Text type="secondary" className="stats-label">审核拒绝</Text>
          </div>
        </Card>
      </div>

      {/* 企业列表表格 */}
      <Card title={`企业列表 (${filteredData.length})`}>
        <Table
          loading={loading}
          data={filteredData}
          columns={[
            {
              title: '企业编码',
              dataIndex: 'companyCode',
              key: 'companyCode',
              width: 120,
              sorter: true,
              render: (companyCode) => (
                companyCode ? (
                  <Text 
                    copyable={{ text: companyCode }} 
                    style={{ 
                      fontSize: '13px', 
                      fontFamily: 'monospace',
                      fontWeight: 'bold',
                      color: '#165DFF'
                    }}
                  >
                    {companyCode}
                  </Text>
                ) : (
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    待审核
                  </Text>
                )
              )
            },
            {
              title: '企业信息',
              dataIndex: 'name',
              key: 'name',
              width: 240,
              sorter: true,
              render: (_, record) => (
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '2px' }}>
                    {record.name}
                  </div>
                  <Text type="secondary" style={{ fontSize: '12px', fontStyle: 'italic' }}>
                    {record.englishName}
                  </Text>
                </div>
              )
            },
            {
              title: '营业执照',
              dataIndex: 'businessLicense',
              key: 'businessLicense',
              width: 140,
              sorter: true,
              render: (businessLicense) => (
                <Text copyable={{ text: businessLicense }} style={{ fontSize: '13px', fontFamily: 'monospace' }}>
                  {businessLicense}
                </Text>
              )
            },
            {
              title: '联系信息',
              dataIndex: 'contactPerson',
              key: 'contactPerson',
              width: 150,
              sorter: true,
              render: (_, record) => (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                    <IconUser style={{ fontSize: '12px', color: '#86909C' }} />
                    <Text style={{ fontSize: '14px' }}>{record.contactPerson}</Text>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <IconPhone style={{ fontSize: '12px', color: '#86909C' }} />
                    <Text copyable={{ text: record.contactPhone }} style={{ fontSize: '12px' }}>
                      {record.contactPhone}
                    </Text>
                  </div>
                </div>
              )
            },
            {
              title: '地址',
              dataIndex: 'address',
              key: 'address',
              width: 180,
              sorter: true,
              render: (address) => (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '4px' }}>
                  <IconLocation style={{ fontSize: '12px', color: '#86909C', marginTop: '2px' }} />
                  <Text style={{ fontSize: '12px', lineHeight: '1.4' }}>
                    {address}
                  </Text>
                </div>
              )
            },
            {
              title: '用户数',
              dataIndex: 'userCount',
              key: 'userCount',
              width: 80,
              sorter: true,
              render: (userCount, record) => (
                <div style={{ textAlign: 'left' }}>
                  <div 
                    style={{ 
                      fontSize: '16px', 
                      fontWeight: 'bold', 
                      color: '#165DFF',
                      cursor: 'pointer',
                      textDecoration: 'underline'
                    }}
                    onClick={() => {
                      // 跳转到编辑页面的关联用户tab
                      navigate(`/controltower/company-management/edit/${record.id}?tab=relatedUsers`);
                      Message.info(`正在查看 ${record.name} 的关联用户`);
                    }}
                    title="点击查看该企业的关联用户"
                  >
                    {userCount}
                  </div>
                  <Text type="secondary" style={{ fontSize: '11px' }}>用户</Text>
                </div>
              )
            },
            {
              title: '状态',
              dataIndex: 'status',
              key: 'status',
              width: 90,
              sorter: true,
              render: (status) => getStatusTag(status)
            },
            {
              title: '最后活跃',
              dataIndex: 'lastActive',
              key: 'lastActive',
              width: 140,
              sorter: true,
              render: (lastActive) => (
                <Text style={{ fontSize: '12px' }}>
                  {lastActive}
                </Text>
              )
            },
            {
              title: '操作',
              key: 'actions',
              width: 160,
              render: (_, record) => {
                const moreMenuItems = [
                  {
                    key: 'toggle-status',
                    title: record.status === 'active' ? '停用' : '启用',
                    style: { color: '#165DFF' },
                    onClick: () => handleToggleStatus(record)
                  },
                  ...(record.status === 'pending' ? [{
                    key: 'audit',
                    title: '审核认证',
                    style: { color: '#165DFF' },
                    onClick: () => handleAuditCompany(record)
                  }] : []),

                  {
                    key: 'delete',
                    title: '删除',
                    style: { color: '#F53F3F' },
                    onClick: () => {
                      Modal.confirm({
                        title: '确定要删除这家企业吗？',
                        content: '删除后将无法恢复',
                        okText: '确定',
                        cancelText: '取消',
                        onOk: () => handleDeleteCompany(record.id)
                      });
                    }
                  }
                ];

                return (
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
                      onClick={() => navigate(`/controltower/company-management/edit/${record.id}`)}
                    >
                      编辑
                    </Button>
                    <Dropdown
                      droplist={
                        <Menu>
                          {moreMenuItems.map((item) => (
                            <Menu.Item 
                              key={item.key} 
                              onClick={item.onClick}
                              style={item.style}
                            >
                              {item.title}
                            </Menu.Item>
                          ))}
                        </Menu>
                      }
                      position="bottom"
                    >
                      <Button type="text" size="small">
                        更多
                      </Button>
                    </Dropdown>
                  </Space>
                );
              }
            }
          ]}
          scroll={{ x: 1200 }}
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

      {/* 企业详情模态框 */}
      <Modal
        title="企业详情"
        visible={detailModalVisible}
        onCancel={() => {
          setDetailModalVisible(false);
          setCurrentCompany(null);
        }}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            关闭
          </Button>,
          <Button 
            key="edit" 
            type="primary"
            onClick={() => {
              setDetailModalVisible(false);
              if (currentCompany) {
                navigate(`/controltower/company-management/edit/${currentCompany.id}`);
              }
            }}
          >
            编辑
          </Button>
        ]}
        style={{ width: 800 }}
      >
        {currentCompany && (
          <Descriptions 
            column={2} 
            labelStyle={{ fontWeight: 'bold' }}
            data={[
              ...(currentCompany.companyCode ? [{
                label: '企业编码',
                value: (
                  <Text 
                    copyable={{ text: currentCompany.companyCode }} 
                    style={{ 
                      fontSize: '14px', 
                      fontFamily: 'monospace',
                      fontWeight: 'bold',
                      color: '#165DFF'
                    }}
                  >
                    {currentCompany.companyCode}
                  </Text>
                )
              }] : []),
              {
                label: '企业名称',
                value: currentCompany.name
              },
              {
                label: '营业执照号',
                value: currentCompany.businessLicense
              },
              {
                label: '联系人',
                value: currentCompany.contactPerson
              },
              {
                label: '联系电话',
                value: (
                  <Text copyable={{ text: currentCompany.contactPhone }}>
                    {currentCompany.contactPhone}
                  </Text>
                )
              },
              {
                label: '企业邮箱',
                value: (
                  <Text copyable={{ text: currentCompany.email }}>
                    {currentCompany.email}
                  </Text>
                )
              },
              {
                label: '用户数量',
                value: (
                  <Text style={{ color: '#165DFF', fontWeight: 'bold' }}>
                    {currentCompany.userCount} 个用户
                  </Text>
                )
              },
              {
                label: '创建时间',
                value: currentCompany.createTime
              },
              {
                label: '最后活跃',
                value: currentCompany.lastActive
              },
              {
                label: '企业地址',
                value: currentCompany.address,
                span: 2
              }
            ]}
                     />
         )}
       </Modal>

      {/* 审核认证模态框 */}
      <Modal
        title="企业审核认证"
        visible={auditModalVisible}
        onCancel={() => {
          setAuditModalVisible(false);
          setCurrentCompany(null);
          auditForm.resetFields();
        }}
        onOk={() => {
          auditForm.validate().then((values) => {
            if (currentCompany) {
              const newStatus = values.auditResult === 'approve' ? 'active' : 'inactive';
              setCompanyData(prev => prev.map(company => 
                company.id === currentCompany.id 
                  ? { ...company, status: newStatus }
                  : company
              ));
              Message.success(
                values.auditResult === 'approve' 
                  ? '企业审核通过，已激活' 
                  : '企业审核未通过，已停用'
              );
            }
            setAuditModalVisible(false);
            setCurrentCompany(null);
            auditForm.resetFields();
          }).catch((error) => {
            console.error('审核表单验证失败:', error);
          });
        }}
        okText="确定"
        cancelText="取消"
        style={{ width: 600 }}
      >
        {currentCompany && (
          <div>
            <div style={{ 
              background: '#f7f8fa', 
              padding: '16px', 
              borderRadius: '6px', 
              marginBottom: '16px' 
            }}>
                             <Text style={{ fontSize: '14px', fontWeight: 'bold' }}>待审核企业信息</Text>
              <div style={{ marginTop: '8px' }}>
                <Text>企业名称：{currentCompany.name}</Text>
                <br />
                <Text>营业执照：{currentCompany.businessLicense}</Text>
                <br />
                <Text>联系人：{currentCompany.contactPerson}</Text>
                <br />
                <Text>联系电话：{currentCompany.contactPhone}</Text>
              </div>
            </div>
            
            <Form
              form={auditForm}
              layout="vertical"
              autoComplete="off"
            >
              <Form.Item
                label="审核结果"
                field="auditResult"
                rules={[
                  { required: true, message: '请选择审核结果' }
                ]}
              >
                <Select placeholder="请选择审核结果">
                  <Option value="approve">
                    <span style={{ color: '#00B42A' }}>✓ 审核通过</span>
                  </Option>
                  <Option value="reject">
                    <span style={{ color: '#F53F3F' }}>✗ 审核不通过</span>
                  </Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="审核意见"
                field="auditReason"
                rules={[
                  { required: true, message: '请输入审核意见' }
                ]}
              >
                <Input.TextArea 
                  placeholder="请详细说明审核的原因和意见"
                  rows={4}
                  maxLength={500}
                  showWordLimit
                />
              </Form.Item>
            </Form>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CompanyManagement; 