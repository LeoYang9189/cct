import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  Typography, 
  Table, 
  Button, 
  Space, 
  Tag, 
  Modal, 
  Form, 
  DatePicker, 
  Message,
  Input,
  Select
} from '@arco-design/web-react';
import { 
  IconArrowLeft, 
  IconRefresh, 
  IconPlus, 
  IconEdit, 
  IconStop,
  IconCheck
} from '@arco-design/web-react/icon';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

interface AuthorizedCompany {
  id: string;
  companyName: string;
  status: 'normal' | 'disabled' | 'expired';
  authorizeStartDate: string;
  authorizeEndDate: string;
  contactPerson: string;
  contactPhone: string;
  createTime: string;
}

interface CompanyOption {
  id: string;
  name: string;
  contactPerson: string;
  contactPhone: string;
  status: 'active' | 'inactive' | 'pending' | 'rejected';
}

const ProductAuthorization: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [currentCompany, setCurrentCompany] = useState<AuthorizedCompany | null>(null);
  const [form] = Form.useForm();
  const [addForm] = Form.useForm();

  // 产品名称映射
  const productNames: { [key: string]: string } = {
    'super-freight': '超级运价',
    'control-tower': '控制塔',
    'smart-container': '智慧箱管',
    'ai-assistant': 'AI助手'
  };

  // 可选择的企业列表（只显示active状态的企业）
  const [availableCompanies] = useState<CompanyOption[]>([
    {
      id: '1',
      name: '货拉拉物流科技有限公司',
      contactPerson: '张经理',
      contactPhone: '13800138001',
      status: 'active'
    },
    {
      id: '2',
      name: '顺丰速运集团',
      contactPerson: '李总监',
      contactPhone: '13800138002',
      status: 'active'
    },
    {
      id: '5',
      name: '申通快递有限公司',
      contactPerson: '陈经理',
      contactPhone: '13800138005',
      status: 'active'
    },
    {
      id: '7',
      name: '圆通速递有限公司',
      contactPerson: '周总',
      contactPhone: '13800138007',
      status: 'active'
    },
    {
      id: '8',
      name: '极兔速递有限公司',
      contactPerson: '孙经理',
      contactPhone: '13800138008',
      status: 'active'
    },
    {
      id: '9',
      name: '丰网速运有限公司',
      contactPerson: '吴主管',
      contactPhone: '13800138009',
      status: 'active'
    }
  ]);

  // 模拟授权企业数据
  const [companies, setCompanies] = useState<AuthorizedCompany[]>([
    {
      id: 'AUTH001',
      companyName: '货拉拉物流科技有限公司',
      status: 'normal',
      authorizeStartDate: '2024-01-01',
      authorizeEndDate: '2024-12-31',
      contactPerson: '张三',
      contactPhone: '13800138001',
      createTime: '2024-01-01 10:00:00'
    },
    {
      id: 'AUTH002',
      companyName: '顺丰速运集团',
      status: 'normal',
      authorizeStartDate: '2024-02-01',
      authorizeEndDate: '2024-12-31',
      contactPerson: '李四',
      contactPhone: '13800138002',
      createTime: '2024-02-01 14:30:00'
    },
    {
      id: 'AUTH003',
      companyName: '德邦物流股份有限公司',
      status: 'disabled',
      authorizeStartDate: '2024-01-15',
      authorizeEndDate: '2024-12-31',
      contactPerson: '王五',
      contactPhone: '13800138003',
      createTime: '2024-01-15 09:15:00'
    },
    {
      id: 'AUTH004',
      companyName: '中通快递股份有限公司',
      status: 'expired',
      authorizeStartDate: '2023-06-01',
      authorizeEndDate: '2023-12-31',
      contactPerson: '赵六',
      contactPhone: '13800138004',
      createTime: '2023-06-01 16:20:00'
    }
  ]);

  const getStatusTag = (status: string) => {
    switch (status) {
      case 'normal':
        return <Tag color="green">正常</Tag>;
      case 'disabled':
        return <Tag color="red">禁用</Tag>;
      case 'expired':
        return <Tag color="orange">授权过期</Tag>;
      default:
        return <Tag color="gray">未知</Tag>;
    }
  };

  const handleToggleStatus = (company: AuthorizedCompany) => {
    const newStatus = company.status === 'normal' ? 'disabled' : 'normal';
    const actionText = newStatus === 'normal' ? '启用' : '禁用';
    
    Modal.confirm({
      title: `确认${actionText}`,
      content: `确定要${actionText}企业 ${company.companyName} 的产品授权吗？`,
      onOk: () => {
        setCompanies(prev => prev.map(c => 
          c.id === company.id ? { ...c, status: newStatus } : c
        ));
        Message.success(`已${actionText}企业授权`);
      }
    });
  };

  const handleEditAuthorization = (company: AuthorizedCompany) => {
    setCurrentCompany(company);
    form.setFieldsValue({
      authorizeDate: [company.authorizeStartDate, company.authorizeEndDate]
    });
    setEditModalVisible(true);
  };

  const handleAddAuthorization = () => {
    addForm.resetFields();
    setAddModalVisible(true);
  };

  // 获取可选择的企业（排除已授权的企业）
  const getAvailableCompanies = () => {
    const authorizedCompanyNames = companies.map(c => c.companyName);
    return availableCompanies.filter(c => !authorizedCompanyNames.includes(c.name));
  };

  const handleCompanyChange = (companyId: string) => {
    const selectedCompany = availableCompanies.find(c => c.id === companyId);
    if (selectedCompany) {
      addForm.setFieldsValue({
        contactPerson: selectedCompany.contactPerson,
        contactPhone: selectedCompany.contactPhone
      });
    }
  };

  const handleSaveEdit = () => {
    form.validate().then((values) => {
      if (currentCompany) {
        const [startDate, endDate] = values.authorizeDate;
        setCompanies(prev => prev.map(c => 
          c.id === currentCompany.id 
            ? { 
                ...c, 
                authorizeStartDate: startDate,
                authorizeEndDate: endDate 
              } 
            : c
        ));
        Message.success('授权期限修改成功');
        setEditModalVisible(false);
        setCurrentCompany(null);
      }
    });
  };

  const handleAddCompany = () => {
    addForm.validate().then((values) => {
      const [startDate, endDate] = values.authorizeDate;
      const selectedCompany = availableCompanies.find(c => c.id === values.companyId);
      
      if (!selectedCompany) {
        Message.error('请选择企业');
        return;
      }

      const newCompany: AuthorizedCompany = {
        id: `AUTH${String(companies.length + 1).padStart(3, '0')}`,
        companyName: selectedCompany.name,
        status: 'normal',
        authorizeStartDate: startDate,
        authorizeEndDate: endDate,
        contactPerson: values.contactPerson,
        contactPhone: values.contactPhone,
        createTime: new Date().toLocaleString('zh-CN')
      };
      
      setCompanies(prev => [...prev, newCompany]);
      Message.success('企业授权添加成功');
      setAddModalVisible(false);
    });
  };

  const columns = [
    {
      title: '授权ID',
      dataIndex: 'id',
      width: 100,
    },
    {
      title: '企业名称',
      dataIndex: 'companyName',
      width: 200,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (status: string) => getStatusTag(status)
    },
    {
      title: '授权期限',
      dataIndex: 'authorizeDate',
      width: 200,
      render: (_: any, record: AuthorizedCompany) => (
        <div>
          <div>{record.authorizeStartDate}</div>
          <div>至 {record.authorizeEndDate}</div>
        </div>
      )
    },
    {
      title: '联系人',
      dataIndex: 'contactPerson',
      width: 100,
    },
    {
      title: '联系电话',
      dataIndex: 'contactPhone',
      width: 120,
    },
    {
      title: '授权时间',
      dataIndex: 'createTime',
      width: 150,
    },
    {
      title: '操作',
      width: 180,
      render: (_: any, record: AuthorizedCompany) => (
        <Space>
          <Button
            type="text"
            size="small"
            icon={record.status === 'normal' ? <IconStop /> : <IconCheck />}
            onClick={() => handleToggleStatus(record)}
            disabled={record.status === 'expired'}
          >
            {record.status === 'normal' ? '禁用' : '启用'}
          </Button>
          <Button
            type="text"
            size="small"
            icon={<IconEdit />}
            onClick={() => handleEditAuthorization(record)}
          >
            修改期限
          </Button>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: '0' }}>
      {/* 页面标题 */}
      <div style={{ marginBottom: '24px' }}>
        <Space>
          <Button 
            icon={<IconArrowLeft />} 
            onClick={() => navigate('/platformadmin/product-center')}
          >
            返回
          </Button>
          <Title heading={3} style={{ margin: 0 }}>
            {productNames[productId || ''] || '未知产品'} - 授权企业管理
          </Title>
        </Space>
        <Text type="secondary" style={{ display: 'block', marginTop: '8px' }}>
          管理该产品的企业授权状态和授权期限
        </Text>
      </div>

      {/* 操作工具栏 */}
      <Card style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space>
            <Text style={{ fontWeight: 'bold' }}>授权企业列表</Text>
            <Tag color="blue">{companies.length} 家企业</Tag>
          </Space>
          
          <Space>
            <Button icon={<IconRefresh />} onClick={() => setLoading(true)}>
              刷新
            </Button>
            <Button 
              type="primary" 
              icon={<IconPlus />}
              onClick={handleAddAuthorization}
            >
              添加授权
            </Button>
          </Space>
        </div>
      </Card>

      {/* 企业列表 */}
      <Card>
        <Table
          columns={columns}
          data={companies}
          loading={loading}
          pagination={{
            sizeCanChange: true,
            showTotal: true,
            pageSize: 10,
            current: 1,
            total: companies.length
          }}
          stripe
          size="default"
        />
      </Card>

      {/* 修改授权期限弹窗 */}
      <Modal
        title="修改授权期限"
        visible={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          setCurrentCompany(null);
        }}
        onOk={handleSaveEdit}
        okText="保存"
        cancelText="取消"
      >
        {currentCompany && (
          <Form form={form} layout="vertical">
            <div style={{ 
              backgroundColor: '#F7F8FA', 
              padding: '12px', 
              borderRadius: '6px', 
              marginBottom: '16px' 
            }}>
              <Text type="secondary">企业名称：</Text>
              <Text style={{ fontWeight: 'bold' }}>{currentCompany.companyName}</Text>
            </div>
            
            <Form.Item
              label="授权期限"
              field="authorizeDate"
              rules={[{ required: true, message: '请选择授权期限' }]}
            >
              <RangePicker 
                style={{ width: '100%' }}
                placeholder={['授权开始日期', '授权结束日期']}
              />
            </Form.Item>
          </Form>
        )}
      </Modal>

      {/* 添加授权弹窗 */}
      <Modal
        title="添加企业授权"
        visible={addModalVisible}
        onCancel={() => setAddModalVisible(false)}
        onOk={handleAddCompany}
        okText="添加"
        cancelText="取消"
        style={{ width: 500 }}
      >
        <Form form={addForm} layout="vertical">
          <Form.Item
            label="企业名称"
            field="companyId"
            rules={[{ required: true, message: '请选择企业' }]}
          >
            <Select 
              placeholder="请选择企业"
              onChange={handleCompanyChange}
              showSearch
              filterOption={(inputValue, option: any) =>
                option?.children?.toLowerCase().includes(inputValue.toLowerCase())
              }
            >
              {getAvailableCompanies().map(company => (
                <Option key={company.id} value={company.id}>
                  {company.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="联系人"
            field="contactPerson"
            rules={[{ required: true, message: '请输入联系人姓名' }]}
          >
            <Input placeholder="请输入联系人姓名" disabled />
          </Form.Item>

          <Form.Item
            label="联系电话"
            field="contactPhone"
            rules={[
              { required: true, message: '请输入联系电话' },
              { match: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' }
            ]}
          >
            <Input placeholder="请输入联系电话" disabled />
          </Form.Item>

          <Form.Item
            label="授权期限"
            field="authorizeDate"
            rules={[{ required: true, message: '请选择授权期限' }]}
          >
            <RangePicker 
              style={{ width: '100%' }}
              placeholder={['授权开始日期', '授权结束日期']}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductAuthorization; 