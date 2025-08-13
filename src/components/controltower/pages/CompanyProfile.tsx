import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  Typography, 
  Grid, 
  Button,
  Space,
  Empty,
  Modal,
  Form,
  Input,
  Message,
  Radio,
  Tag,

  Table,
  Tabs,
  Tooltip
} from '@arco-design/web-react';
import {
  IconBulb,
  IconUserAdd,
  IconHome,
  IconLink,
  IconPlus,
  IconUser,
  IconLock,
  IconCopy,
  IconDelete,
  IconExclamationCircle,

} from '@arco-design/web-react/icon';

const { Title, Text } = Typography;
const { Row, Col } = Grid;
const FormItem = Form.Item;
const { Group: RadioGroup } = Radio;
const { TabPane } = Tabs;

// 认证状态类型
type CertificationStatus = 'uncertified' | 'pending' | 'rejected' | 'approved';

// 邀请状态类型  
type InviteStatus = 'pending' | 'expired' | 'cancelled' | 'joined';

// 邀请记录接口
interface InviteRecord {
  id: string;
  inviteCode: string;
  inviteLink: string;
  createTime: string;
  expireTime: string;
  status: InviteStatus;
  invitedEmail?: string;
  joinedTime?: string;
}

// 加入申请记录接口
interface JoinApplicationRecord {
  id: string;
  userName: string;
  phone: string;
  email: string;
  applyTime: string;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectReason?: string;
}

const CompanyProfile: React.FC = () => {
  const navigate = useNavigate();
  const [certifyModalVisible, setCertifyModalVisible] = useState(false);
  const [joinModalVisible, setJoinModalVisible] = useState(false);
  const [bindModalVisible, setBindModalVisible] = useState(false);
  const [certifyForm] = Form.useForm();
  const [joinForm] = Form.useForm();
  const [bindForm] = Form.useForm();

  // 演示状态切换
  const [demoStatus, setDemoStatus] = useState<CertificationStatus>('uncertified');
  
  // 加入企业相关状态
  const [hasInviteCode, setHasInviteCode] = useState<boolean | null>(null);
  const [companyNotFoundModalVisible, setCompanyNotFoundModalVisible] = useState(false);
  const [joinApplicationSuccessModalVisible, setJoinApplicationSuccessModalVisible] = useState(false);
  
  // 员工管理Tab相关状态
  const [activeManagementTab, setActiveManagementTab] = useState('invite');
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectingApplication, setRejectingApplication] = useState<JoinApplicationRecord | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  
  // 加入申请记录数据
  const [joinApplications, setJoinApplications] = useState<JoinApplicationRecord[]>([
    {
      id: '1',
      userName: '张小明',
      phone: '13800138001',
      email: 'zhangxm@email.com',
      applyTime: '2024-01-18 14:30:00',
      message: '我是贵公司的新员工，希望加入企业系统进行日常工作。',
      status: 'pending'
    },
    {
      id: '2',
      userName: '李小红',
      phone: '13800138002', 
      email: 'lixh@email.com',
      applyTime: '2024-01-19 09:15:00',
      message: '我在公司负责物流运营工作，需要使用系统管理订单。',
      status: 'approved'
    },
    {
      id: '3',
      userName: '王小军',
      phone: '13800138003',
      email: 'wangxj@email.com', 
      applyTime: '2024-01-19 16:45:00',
      message: '申请加入企业账户，配合团队完成项目工作。',
      status: 'rejected',
      rejectReason: '提供的信息不完整，请补充工作证明材料。'
    }
  ]);
  
  // 认证申请数据
  const [certificationData] = useState({
    companyName: 'WallTech科技有限公司',
    englishName: 'WallTech Technology Co., Ltd.',
    businessLicense: 'ABC123456789012345',
    submitTime: '2024-01-15 14:30:00',
    rejectReason: '营业执照图片不清晰，请重新上传高清版本。企业英文名称与营业执照不符，请核实后重新填写。'
  });
  
  // 邀请相关状态
  const [inviteModalVisible, setInviteModalVisible] = useState(false);
  const [generatedInvite, setGeneratedInvite] = useState<{code: string, link: string} | null>(null);
  const [inviteSuccessModalVisible, setInviteSuccessModalVisible] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [emailExistsModalVisible, setEmailExistsModalVisible] = useState(false);
  const [inviteRecords, setInviteRecords] = useState<InviteRecord[]>([
    {
      id: '1',
      inviteCode: 'WTD2024001',
      inviteLink: 'https://wo.com/join?code=WTD2024001',
      createTime: '2024-01-16 10:30:00',
      expireTime: '2024-01-18 10:30:00',
      status: 'joined',
      invitedEmail: 'employee1@company.com',
      joinedTime: '2024-01-16 15:20:00'
    },
    {
      id: '2', 
      inviteCode: 'WTD2024002',
      inviteLink: 'https://wo.com/join?code=WTD2024002',
      createTime: '2024-01-17 09:15:00',
      expireTime: '2024-01-19 09:15:00',
      status: 'pending'
    },
    {
      id: '3',
      inviteCode: 'WTD2024003', 
      inviteLink: 'https://wo.com/join?code=WTD2024003',
      createTime: '2024-01-17 16:45:00',
      expireTime: '2024-01-19 16:45:00',
      status: 'expired'
    }
  ]);

  // 页面加载时检查URL参数，处理从其他页面跳转回来的情况
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const fromCertification = urlParams.get('from') === 'certification';
    
    // 如果是从企业认证页面跳转回来，重置为未认证状态
    if (fromCertification) {
      setDemoStatus('uncertified');
      // 清理URL参数
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  // 认证新企业
  const handleCertifyCompany = () => {
    // 跳转到企业认证页面
    window.location.href = '/controltower/company-certification';
  };

  // 加入已有企业
  const handleJoinCompany = () => {
    setHasInviteCode(null); // 重置邀请码选择状态
    joinForm.resetFields(); // 重置表单
    setJoinModalVisible(true);
  };

  // 绑定第三方租户
  const handleBindTenant = () => {
    // 直接跳转到SSO授权页面（默认跳转到etower）
    navigate('/sso/auth/etower');
  };

  // 提交认证申请
  const submitCertifyApplication = async () => {
    try {
      await certifyForm.validate();
      const values = await certifyForm.getFields();
      console.log('认证申请:', values);
      Message.success('企业认证申请已提交，我们将在3个工作日内完成审核');
      setCertifyModalVisible(false);
      certifyForm.resetFields();
    } catch (error) {
      console.error('表单验证失败:', error);
      Message.error('请检查表单填写是否正确');
    }
  };

  // 提交加入申请
  const submitJoinApplication = async () => {
    try {
      await joinForm.validate();
      const values = await joinForm.getFields();
      
      if (hasInviteCode) {
        // 有邀请码的情况，直接加入成功
        Message.success('邀请码验证成功，已加入企业');
        setJoinModalVisible(false);
        setDemoStatus('approved'); // 切换到已认证状态
      } else {
        // 没有邀请码的情况，先显示企业不存在弹窗
        console.log('加入申请:', values);
        setJoinModalVisible(false);
        setCompanyNotFoundModalVisible(true);
      }
    } catch (error) {
      console.error('表单验证失败:', error);
      Message.error('请检查表单填写是否正确');
    }
  };

  // 提交绑定申请
  const submitBindApplication = async () => {
    try {
      await bindForm.validate();
      const values = await bindForm.getFields();
      console.log('绑定申请:', values);
      Message.success('第三方租户绑定申请已提交，我们将在1个工作日内完成审核');
      setBindModalVisible(false);
      bindForm.resetFields();
    } catch (error) {
      console.error('表单验证失败:', error);
      Message.error('请检查表单填写是否正确');
    }
  };

  // 获取状态标签
  const getStatusTag = (status: CertificationStatus) => {
    const statusConfig = {
      uncertified: { color: 'gray', text: '未认证' },
      pending: { color: 'orange', text: '待审核' },
      rejected: { color: 'red', text: '审核拒绝' }, 
      approved: { color: 'green', text: '审核通过' }
    };
    const config = statusConfig[status];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // 获取邀请状态标签
  const getInviteStatusTag = (status: InviteStatus) => {
    const statusConfig = {
      pending: { color: 'blue', text: '待加入' },
      expired: { color: 'gray', text: '超时' },
      cancelled: { color: 'red', text: '作废' },
      joined: { color: 'green', text: '已加入' }
    };
    const config = statusConfig[status];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // 生成邀请
  const handleGenerateInvite = () => {
    const inviteCode = `WTD${Date.now()}`;
    const inviteLink = `https://wo.com/join?code=${inviteCode}`;
    
    setGeneratedInvite({ code: inviteCode, link: inviteLink });
    setInviteEmail(''); // 重置邮箱输入
    setInviteModalVisible(true);
  };

  // 确认创建邀请
  const handleConfirmInvite = () => {
    if (generatedInvite && inviteEmail) {
      const newRecord: InviteRecord = {
        id: Date.now().toString(),
        inviteCode: generatedInvite.code,
        inviteLink: generatedInvite.link,
        createTime: new Date().toLocaleString('zh-CN'),
        expireTime: new Date(Date.now() + 48 * 60 * 60 * 1000).toLocaleString('zh-CN'),
        status: 'pending',
        invitedEmail: inviteEmail
      };
      
      setInviteRecords(prev => [newRecord, ...prev]);
      setInviteModalVisible(false);
      
      // 显示成功弹窗
      setInviteSuccessModalVisible(true);
    }
  };

  // 复制到剪贴板
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      Message.success(`${label}已复制到剪贴板`);
    }).catch(() => {
      Message.error('复制失败，请手动复制');
    });
  };

  // 作废邀请
  const handleCancelInvite = (id: string) => {
    Modal.confirm({
      title: '确认作废邀请',
      content: '作废后该邀请链接将无法使用，确定要作废吗？',
      onOk: () => {
        setInviteRecords(prev => 
          prev.map(record => 
            record.id === id ? { ...record, status: 'cancelled' as InviteStatus } : record
          )
        );
        Message.success('邀请已作废');
      }
    });
  };

  // 处理企业不存在弹窗关闭
  const handleCompanyNotFoundClose = () => {
    setCompanyNotFoundModalVisible(false);
    setJoinApplicationSuccessModalVisible(true);
  };

  // 处理申请成功弹窗关闭
  const handleJoinSuccessClose = () => {
    setJoinApplicationSuccessModalVisible(false);
    setDemoStatus('pending'); // 切换到审核中状态
  };

  // 演示邮箱已存在
  const handleDemoEmailExists = () => {
    setEmailExistsModalVisible(true);
  };

  // 获取申请状态标签
  const getApplicationStatusTag = (status: 'pending' | 'approved' | 'rejected') => {
    const statusConfig = {
      pending: { color: 'orange', text: '待审核' },
      approved: { color: 'green', text: '审核通过' },
      rejected: { color: 'red', text: '已拒绝' }
    };
    const config = statusConfig[status];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // 审核通过申请
  const handleApproveApplication = (id: string) => {
    setJoinApplications(prev => 
      prev.map(app => 
        app.id === id ? { ...app, status: 'approved' as const } : app
      )
    );
    Message.success('申请已审核通过');
  };

  // 打开拒绝申请弹窗
  const handleOpenRejectModal = (application: JoinApplicationRecord) => {
    setRejectingApplication(application);
    setRejectReason('');
    setRejectModalVisible(true);
  };

  // 确认拒绝申请
  const handleConfirmReject = () => {
    if (!rejectingApplication || !rejectReason.trim()) {
      Message.error('请填写拒绝原因');
      return;
    }
    
    const updatedApplications = joinApplications.map(app => {
      if (app.id === rejectingApplication.id) {
        return {
          ...app,
          status: 'rejected' as const,
          rejectReason: rejectReason
        };
      }
      return app;
    });
    
    setJoinApplications(updatedApplications);
    setRejectModalVisible(false);
    setRejectingApplication(null);
    setRejectReason('');
    Message.success('申请已拒绝');
  };

  // 企业信息管理
  const handleCompanyManagement = () => {
    navigate('/controltower/company-data-management');
  };

  // 邀请记录表格列定义
  const inviteColumns = [
    {
      title: '邀请信息',
      dataIndex: 'inviteCode',
      key: 'inviteCode',
      render: (_: any, record: InviteRecord) => (
        <div>
          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
            邀请码：{record.inviteCode}
          </div>
          {record.invitedEmail && (
            <div style={{ fontSize: '12px', color: '#165DFF', marginBottom: '2px' }}>
              邀请邮箱：{record.invitedEmail}
            </div>
          )}
          <div style={{ fontSize: '12px', color: '#86909C' }}>
            创建时间：{record.createTime}
          </div>
          {record.joinedTime && (
            <div style={{ fontSize: '12px', color: '#00B42A' }}>
              加入时间：{record.joinedTime}
            </div>
          )}
        </div>
      )
    },
    {
      title: '邀请链接',
      dataIndex: 'inviteLink', 
      key: 'inviteLink',
      render: (inviteLink: string) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Text style={{ fontSize: '12px', fontFamily: 'monospace', maxWidth: '200px' }} ellipsis>
            {inviteLink}
          </Text>
          <Button 
            type="text" 
            size="small" 
            icon={<IconCopy />}
            onClick={() => copyToClipboard(inviteLink, '邀请链接')}
          />
        </div>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status', 
      width: 100,
      render: (status: InviteStatus) => getInviteStatusTag(status)
    },
    {
      title: '有效期至',
      dataIndex: 'expireTime',
      key: 'expireTime',
      width: 140,
      render: (expireTime: string) => (
        <Text style={{ fontSize: '12px' }}>{expireTime}</Text>
      )
    },
    {
      title: '操作',
      key: 'actions',
      width: 100,
      render: (_: any, record: InviteRecord) => (
        record.status === 'pending' ? (
          <Button 
            type="text" 
            size="small" 
            status="danger"
            icon={<IconDelete />}
            onClick={() => handleCancelInvite(record.id)}
          >
            作废
          </Button>
        ) : null
      )
    }
  ];

  // 申请记录表格列定义
  const applicationColumns = [
    {
      title: '用户信息',
      dataIndex: 'userName',
      key: 'userName',
      render: (_: any, record: JoinApplicationRecord) => (
        <div>
          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
            {record.userName}
          </div>
          <div style={{ fontSize: '12px', color: '#165DFF', marginBottom: '2px' }}>
            手机：{record.phone}
          </div>
          <div style={{ fontSize: '12px', color: '#165DFF' }}>
            邮箱：{record.email}
          </div>
        </div>
      )
    },
    {
      title: '申请信息',
      dataIndex: 'message',
      key: 'message',
      render: (_: any, record: JoinApplicationRecord) => (
        <div>
          <div style={{ fontSize: '12px', color: '#86909C', marginBottom: '4px' }}>
            申请时间：{record.applyTime}
          </div>
          <Tooltip content={record.message}>
            <div style={{ 
              fontSize: '14px', 
              maxWidth: '200px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              cursor: 'help'
            }}>
              {record.message}
            </div>
          </Tooltip>
          {record.rejectReason && (
            <div style={{ 
              fontSize: '12px', 
              color: '#FF4D4F',
              marginTop: '4px',
              padding: '4px 8px',
              backgroundColor: '#FFF2F0',
              borderRadius: '4px',
              maxWidth: '200px'
            }}>
              拒绝原因：{record.rejectReason}
            </div>
          )}
        </div>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: 'pending' | 'approved' | 'rejected') => getApplicationStatusTag(status)
    },
    {
      title: '操作',
      key: 'actions',
      width: 140,
      render: (_: any, record: JoinApplicationRecord) => (
        record.status === 'pending' ? (
          <Space size="small">
            <Button 
              type="primary"
              size="small"
              onClick={() => handleApproveApplication(record.id)}
            >
              审核通过
            </Button>
            <Button 
              type="primary"
              status="danger"
              size="small"
              onClick={() => handleOpenRejectModal(record)}
            >
              审核拒绝
            </Button>
          </Space>
        ) : null
      )
    }
  ];

  return (
    <div>
      {/* 状态演示切换 */}
      <div className="mb-6" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '12px' }}>
        <Text style={{ fontSize: '14px', color: '#86909C' }}>演示状态：</Text>
        <RadioGroup
          value={demoStatus}
          onChange={setDemoStatus}
          type="button"
          size="small"
        >
          <Radio value="uncertified">未认证</Radio>
          <Radio value="pending">审核中</Radio>
          <Radio value="rejected">审核拒绝</Radio>
          <Radio value="approved">审核通过</Radio>
        </RadioGroup>

        <Button
          type="primary"
          status="warning"
          size="small"
          onClick={() => navigate('/sample-staff-register')}
          style={{
            backgroundColor: '#FF7D00',
            borderColor: '#FF7D00',
            color: 'white',
            marginLeft: '16px'
          }}
        >
          演示邀请链接打开
        </Button>

        <Button
          type="primary"
          status="danger"
          size="small"
          onClick={() => navigate('/sample-expired-link')}
          style={{
            backgroundColor: '#F53F3F',
            borderColor: '#F53F3F',
            color: 'white',
            marginLeft: '8px'
          }}
        >
          演示链接过期无效
        </Button>
      </div>

      {/* 根据演示状态显示不同内容 */}
      {demoStatus === 'uncertified' ? (
        <div>
          {/* 无企业状态展示 */}
          <Card className="mb-6">
            <div className="text-center py-12">
              <Empty 
                icon={<IconBulb style={{ fontSize: 64, color: '#165DFF' }} />}
                description={
                  <div className="mt-4">
                    <Title heading={5} className="mb-2 text-gray-700">尚未认证企业</Title>
                    <Text type="secondary" className="text-base">
                      暂无法使用相关功能，请先认证或加入企业
                    </Text>
                  </div>
                }
              />
            </div>
          </Card>

          {/* 引导操作卡片 */}
          <Row gutter={24} className="mb-6">
            {/* 认证新企业 */}
            <Col span={8}>
              <Card 
                className="h-full transition-all duration-200 hover:shadow-lg cursor-pointer border-2 hover:border-blue-300"
                onClick={handleCertifyCompany}
              >
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconPlus style={{ fontSize: 24, color: '#165DFF' }} />
                  </div>
                  <Title heading={5} className="mb-3">认证新企业</Title>
                  <Text type="secondary" className="text-sm leading-relaxed">
                    提交认证资料，创建全新的企业账户，成为企业管理员
                  </Text>
                  <div className="mt-6">
                    <Button type="primary" size="small">
                      立即认证
                    </Button>
                  </div>
                </div>
              </Card>
            </Col>

            {/* 加入已有企业 */}
            <Col span={8}>
              <Card 
                className="h-full transition-all duration-200 hover:shadow-lg cursor-pointer border-2 hover:border-green-300"
                onClick={handleJoinCompany}
              >
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconUserAdd style={{ fontSize: 24, color: '#00B42A' }} />
                  </div>
                  <Title heading={5} className="mb-3">加入已有企业</Title>
                  <Text type="secondary" className="text-sm leading-relaxed">
                    通过企业邀请码或管理员邀请，加入已认证的企业组织
                  </Text>
                  <div className="mt-6">
                    <Button type="primary" status="success" size="small">
                      申请加入
                    </Button>
                  </div>
                </div>
              </Card>
            </Col>

            {/* 绑定第三方租户 */}
            <Col span={8}>
              <Card 
                className="h-full transition-all duration-200 hover:shadow-lg cursor-pointer border-2 hover:border-orange-300"
                onClick={handleBindTenant}
              >
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconLink style={{ fontSize: 24, color: '#FF7D00' }} />
                  </div>
                  <Title heading={5} className="mb-3">绑定第三方租户</Title>
                  <Text type="secondary" className="text-sm leading-relaxed">
                    关联已有的第三方系统租户，快速同步企业信息和权限
                  </Text>
                  <div className="mt-6">
                    <Button 
                      type="primary" 
                      status="warning" 
                      size="small"
                      onClick={handleBindTenant}
                    >
                      开始绑定
                    </Button>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      ) : (
        <div>
          {/* 认证申请卡片 */}
          <Card className="mb-6">
            <div style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <Title heading={5} style={{ margin: 0, marginBottom: '8px' }}>
                    企业认证申请
                  </Title>
                  <Text type="secondary" style={{ fontSize: '14px' }}>
                    申请时间：{certificationData.submitTime}
                  </Text>
                </div>
                <div>
                  {getStatusTag(demoStatus)}
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '24px', marginBottom: '16px' }}>
                <div>
                  <Text style={{ fontWeight: 'bold' }}>企业名称：</Text>
                  <Text>{certificationData.companyName}</Text>
                </div>
                <div>
                  <Text style={{ fontWeight: 'bold' }}>英文名称：</Text>
                  <Text>{certificationData.englishName}</Text>
                </div>
                <div>
                  <Text style={{ fontWeight: 'bold' }}>营业执照号：</Text>
                  <Text>{certificationData.businessLicense}</Text>
                </div>
              </div>
              
              {/* 审核拒绝显示拒绝原因 */}
              {demoStatus === 'rejected' && (
                <div style={{ 
                  padding: '12px', 
                  backgroundColor: '#FFF2F0', 
                  border: '1px solid #FFCCC7',
                  borderRadius: '6px',
                  marginTop: '16px'
                }}>
                  <div style={{ color: '#FF4D4F', fontWeight: '500', marginBottom: '8px' }}>
                    审核拒绝原因：
                  </div>
                  <Text style={{ color: '#FF4D4F', fontSize: '14px' }}>
                    {certificationData.rejectReason}
                  </Text>
                  <div style={{ marginTop: '12px' }}>
                    <Button 
                      type="primary" 
                      status="danger"
                      size="small"
                      onClick={handleCompanyManagement}
                    >
                      重新提交认证
                    </Button>
                  </div>
                </div>
              )}

              {/* 审核通过显示企业信息管理按钮 */}
              {demoStatus === 'approved' && (
                <div style={{ 
                  padding: '12px', 
                  backgroundColor: '#F6FFED', 
                  border: '1px solid #B7EB8F',
                  borderRadius: '6px',
                  marginTop: '16px'
                }}>
                  <div style={{ color: '#52C41A', fontWeight: '500', marginBottom: '8px' }}>
                    ✅ 恭喜！企业认证已通过
                  </div>
                  <Text style={{ color: '#52C41A', fontSize: '14px', marginBottom: '12px', display: 'block' }}>
                    您的企业已成功认证，现在可以管理企业信息和邀请员工加入。
                  </Text>
                  <div style={{ marginTop: '12px' }}>
                    <Button 
                      type="primary" 
                      status="success"
                      size="small"
                      onClick={handleCompanyManagement}
                    >
                      企业信息管理
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>
          
          {/* 审核通过显示员工管理功能 */}
          {demoStatus === 'approved' && (
            <div>
              <Card className="mb-6">
                <div style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <Title heading={5} style={{ margin: 0 }}>
                      员工管理
                    </Title>
                    {activeManagementTab === 'invite' && (
                      <Button 
                        type="primary" 
                        icon={<IconPlus />}
                        onClick={handleGenerateInvite}
                      >
                        邀请员工
                      </Button>
                    )}
                  </div>
                  
                  {/* Tab切换 */}
                  <Tabs 
                    activeTab={activeManagementTab} 
                    onChange={setActiveManagementTab}
                    style={{ marginBottom: '16px' }}
                  >
                    <TabPane key="invite" title="邀请管理">
                      <div>
                        <Text type="secondary" style={{ fontSize: '14px', marginBottom: '16px', display: 'block' }}>
                          生成邀请链接邀请员工加入企业，每个邀请链接有效期为48小时
                        </Text>
                        
                        {/* 邀请记录表格 */}
                        <Table 
                          columns={inviteColumns}
                          data={inviteRecords}
                          pagination={{ pageSize: 5 }}
                          size="small"
                        />
                      </div>
                    </TabPane>
                    
                    <TabPane key="application" title="审核申请">
                      <div>
                        <Text type="secondary" style={{ fontSize: '14px', marginBottom: '16px', display: 'block' }}>
                          审核用户主动提交的加入申请，通过审核后用户即可加入企业
                        </Text>
                        
                        {/* 申请记录表格 */}
                        <Table 
                          columns={applicationColumns}
                          data={joinApplications}
                          pagination={{ pageSize: 5 }}
                          size="small"
                        />
                      </div>
                    </TabPane>
                  </Tabs>
                </div>
              </Card>
            </div>
          )}
        </div>
      )}

      {/* 认证新企业弹窗 */}
      <Modal
        title={
          <div className="flex items-center">
            <IconHome className="text-blue-500 mr-2" style={{ fontSize: 18 }} />
            认证新企业
          </div>
        }
        visible={certifyModalVisible}
        onCancel={() => {
          setCertifyModalVisible(false);
          certifyForm.resetFields();
        }}
        onOk={submitCertifyApplication}
        okText="提交认证"
        cancelText="取消"
        style={{ width: 600 }}
      >
        <div style={{ padding: '20px 0' }}>
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <Text type="secondary" style={{ fontSize: '14px' }}>
              <IconBulb className="mr-1" style={{ fontSize: 14 }} />
              请确保提供的企业信息真实有效，认证通过后您将成为该企业的管理员。
            </Text>
          </div>
          
          <Form form={certifyForm} layout="vertical">
            <FormItem
              label="企业名称"
              field="companyName"
              rules={[
                { required: true, message: '请输入企业名称' },
                { minLength: 2, message: '企业名称至少2个字符' }
              ]}
            >
              <Input placeholder="请输入完整的企业名称" />
            </FormItem>
            
            <FormItem
              label="统一社会信用代码"
              field="creditCode"
              rules={[
                { required: true, message: '请输入统一社会信用代码' },
                { length: 18, message: '统一社会信用代码应为18位' }
              ]}
            >
              <Input placeholder="请输入18位统一社会信用代码" />
            </FormItem>
            
            <FormItem
              label="法定代表人"
              field="legalPerson"
              rules={[
                { required: true, message: '请输入法定代表人姓名' }
              ]}
            >
                <Input placeholder="请输入法定代表人姓名" />
              </FormItem>
            
            <FormItem
              label="申请理由"
              field="reason"
              rules={[
                { required: true, message: '请说明申请认证的理由' }
              ]}
            >
              <Input.TextArea 
                placeholder="请简要说明您申请认证该企业的理由" 
                maxLength={200}
                showWordLimit
              />
            </FormItem>
          </Form>
        </div>
      </Modal>

      {/* 加入已有企业弹窗 */}
      <Modal
        title={
          <div className="flex items-center">
            <IconUser className="text-green-500 mr-2" style={{ fontSize: 18 }} />
            加入已有企业
          </div>
        }
        visible={joinModalVisible}
        onCancel={() => {
          setJoinModalVisible(false);
          joinForm.resetFields();
        }}
        onOk={submitJoinApplication}
        okText="提交申请"
        cancelText="取消"
        okButtonProps={{
          disabled: hasInviteCode === null
        }}
        style={{ width: 500 }}
      >
        <div style={{ padding: '20px 0' }}>
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
            <Text type="secondary" style={{ fontSize: '14px' }}>
              <IconBulb className="mr-1" style={{ fontSize: 14 }} />
              请选择您的加入方式，有邀请码可以直接加入，没有邀请码需要申请审核。
            </Text>
          </div>
          
          <Form form={joinForm} layout="vertical">
            <FormItem label="加入方式" required>
              <Radio.Group 
                value={hasInviteCode} 
                onChange={setHasInviteCode}
              >
                <Radio value={true}>我有邀请码</Radio>
                <Radio value={false}>我没有邀请码</Radio>
              </Radio.Group>
            </FormItem>
            
            {hasInviteCode === true && (
              <FormItem
                label="邀请码"
                field="inviteCode"
                rules={[
                  { required: true, message: '请输入邀请码' }
                ]}
              >
                <Input placeholder="请输入企业邀请码" />
              </FormItem>
            )}
            
            {hasInviteCode === false && (
              <>
                <FormItem
                  label="企业全称"
                  field="companyName"
                  rules={[
                    { required: true, message: '请输入企业全称' }
                  ]}
                >
                  <Input placeholder="请输入完整的企业名称（需精确匹配）" />
              </FormItem>
                
                <FormItem
                  label="申请留言"
                  field="message"
                  rules={[
                    { required: true, message: '请填写申请留言' }
                  ]}
                >
                  <Input.TextArea 
                    placeholder="请简要说明您申请加入该企业的理由" 
                    maxLength={200}
                    showWordLimit
                  />
              </FormItem>
              </>
            )}
          </Form>
        </div>
      </Modal>

      {/* 绑定第三方租户弹窗 */}
      <Modal
        title={
          <div className="flex items-center">
            <IconLock className="text-orange-500 mr-2" style={{ fontSize: 18 }} />
            绑定第三方租户
          </div>
        }
        visible={bindModalVisible}
        onCancel={() => {
          setBindModalVisible(false);
          bindForm.resetFields();
        }}
        onOk={submitBindApplication}
        okText="提交绑定"
        cancelText="取消"
        style={{ width: 500 }}
      >
        <div style={{ padding: '20px 0' }}>
          <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-md">
            <Text type="secondary" style={{ fontSize: '14px' }}>
              <IconBulb className="mr-1" style={{ fontSize: 14 }} />
              绑定第三方系统租户后，将自动同步企业信息和用户权限。
            </Text>
          </div>
          
          <Form form={bindForm} layout="vertical">
            <FormItem
              label="第三方系统"
              field="thirdPartySystem"
              rules={[
                { required: true, message: '请选择第三方系统' }
              ]}
            >
              <Input placeholder="如：CargoWare、eTower等" />
              </FormItem>
            
            <FormItem
              label="租户ID"
              field="tenantId"
              rules={[
                { required: true, message: '请输入租户ID' }
              ]}
            >
              <Input placeholder="请输入第三方系统的租户ID" />
              </FormItem>

            <FormItem
              label="租户名称"
              field="tenantName"
              rules={[
                { required: true, message: '请输入租户名称' }
              ]}
            >
              <Input placeholder="请输入租户显示名称" />
          </FormItem>

            <FormItem
              label="联系人信息"
              field="contactInfo"
              rules={[
                { required: true, message: '请提供联系人信息' }
              ]}
            >
              <Input.TextArea 
                placeholder="请提供租户管理员联系方式，以便我们核实绑定权限" 
                maxLength={200}
                showWordLimit
              />
            </FormItem>
          </Form>
        </div>
      </Modal>

      {/* 邀请弹窗 */}
      <Modal
        title={
          <div className="flex items-center">
            <IconLink className="text-blue-500 mr-2" style={{ fontSize: 18 }} />
            邀请员工
          </div>
        }
        visible={inviteModalVisible}
        onCancel={() => {
          setInviteModalVisible(false);
          setGeneratedInvite(null);
          setInviteEmail('');
        }}
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button
              type="primary"
              status="warning"
              size="small"
              onClick={handleDemoEmailExists}
              style={{
                backgroundColor: '#FF7D00',
                borderColor: '#FF7D00',
                color: 'white'
              }}
            >
              演示邮箱已存在
            </Button>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button
                onClick={() => {
                  setInviteModalVisible(false);
                  setGeneratedInvite(null);
                  setInviteEmail('');
                }}
              >
                取消
              </Button>
              <Button
                type="primary"
                onClick={handleConfirmInvite}
                disabled={!inviteEmail || !generatedInvite}
              >
                发送邀请
              </Button>
            </div>
          </div>
        }
        style={{ width: 500 }}
      >
        <div style={{ padding: '20px 0' }}>
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <Text type="secondary" style={{ fontSize: '14px' }}>
              <IconBulb className="mr-1" style={{ fontSize: 14 }} />
              邀请链接和邀请码48小时有效，请及时提醒员工查看邮件并完成加入。
            </Text>
          </div>
          
          <Form layout="vertical">
            <FormItem
              label="员工邮箱"
              required
            >
              <Input 
                placeholder="请输入员工邮箱地址"
                value={inviteEmail}
                onChange={setInviteEmail}
              />
            </FormItem>
            
            {generatedInvite && (
              <>
                <FormItem label="邀请码">
                  <Input 
                    value={generatedInvite.code}
                    readOnly
                    suffix={
                      <Button 
                        type="text"
                        size="small"
                        icon={<IconCopy />}
                        onClick={() => copyToClipboard(generatedInvite.code, '邀请码')}
                      />
                    }
                  />
                </FormItem>
                
                <FormItem label="邀请链接">
                  <div style={{ position: 'relative' }}>
                    <Input.TextArea 
                      value={generatedInvite.link}
                      readOnly
                      autoSize={{ minRows: 2, maxRows: 3 }}
                      style={{ 
                        paddingRight: '40px'
                      }}
                    />
                    <Button 
                      type="text"
                      size="small"
                      icon={<IconCopy />}
                      onClick={() => copyToClipboard(generatedInvite.link, '邀请链接')}
                      style={{ 
                        position: 'absolute',
                        right: '8px',
                        top: '8px',
                        zIndex: 1
                      }}
                    />
                  </div>
                </FormItem>
              </>
            )}
          </Form>
        </div>
      </Modal>
      
      {/* 邀请发送成功弹窗 */}
      <Modal
        title={
          <div className="flex items-center">
            <IconLink className="text-green-500 mr-2" style={{ fontSize: 18 }} />
            邀请已发送
          </div>
        }
        visible={inviteSuccessModalVisible}
        onCancel={() => {
          setInviteSuccessModalVisible(false);
          setGeneratedInvite(null);
          setInviteEmail('');
        }}
        footer={
          <Button 
            type="primary" 
            onClick={() => {
              setInviteSuccessModalVisible(false);
              setGeneratedInvite(null);
              setInviteEmail('');
            }}
          >
            关闭
          </Button>
        }
        style={{ width: 500 }}
      >
        <div style={{ padding: '20px 0' }}>
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
            <Text style={{ fontSize: '14px', color: '#00B42A' }}>
              ✅ 邀请已发送，请提醒员工查看邮件。
            </Text>
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <Text style={{ fontSize: '14px', color: '#86909C' }}>
              邀请信息已发送至：<Text style={{ fontWeight: 'bold' }}>{inviteEmail}</Text>
            </Text>
          </div>
          
          {generatedInvite && (
            <div>
              <div style={{ marginBottom: '12px' }}>
                <Text style={{ fontWeight: 'bold', marginBottom: '8px', display: 'block' }}>邀请码：</Text>
                <Input 
                  value={generatedInvite.code}
                  readOnly
                  style={{ 
                    backgroundColor: '#F7F8FA', 
                    border: '1px solid #E5E6EB',
                    fontFamily: 'monospace'
                  }}
                  suffix={
                    <Button 
                      type="text" 
                      size="small"
                      icon={<IconCopy />}
                      onClick={() => copyToClipboard(generatedInvite.code, '邀请码')}
                    />
                  }
                />
              </div>
              
              <div>
                <Text style={{ fontWeight: 'bold', marginBottom: '8px', display: 'block' }}>邀请链接：</Text>
                <div style={{ position: 'relative' }}>
                  <Input.TextArea 
                    value={generatedInvite.link}
                    readOnly
                    autoSize={{ minRows: 2, maxRows: 3 }}
                    style={{ 
                      backgroundColor: '#F7F8FA', 
                      border: '1px solid #E5E6EB',
                      fontFamily: 'monospace',
                      fontSize: '12px',
                      lineHeight: '1.4',
                      paddingRight: '40px'
                    }}
                  />
                  <Button 
                    type="text" 
                    size="small"
                    icon={<IconCopy />}
                    onClick={() => copyToClipboard(generatedInvite.link, '邀请链接')}
                    style={{ 
                      position: 'absolute',
                      right: '8px',
                      top: '8px',
                      zIndex: 1
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>
      
      {/* 企业不存在弹窗 */}
      <Modal
        title={
          <div className="flex items-center">
            <IconUser className="text-red-500 mr-2" style={{ fontSize: 18 }} />
            企业不存在
          </div>
        }
        visible={companyNotFoundModalVisible}
        onCancel={() => setCompanyNotFoundModalVisible(false)}
        footer={
          <Button 
            type="primary" 
            onClick={handleCompanyNotFoundClose}
          >
            关闭
          </Button>
        }
        style={{ width: 400 }}
      >
        <div style={{ padding: '20px 0' }}>
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <Text style={{ fontSize: '14px', color: '#FF4D4F' }}>
              ❌ 企业不存在，请选择新建企业。
            </Text>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <Text style={{ fontSize: '14px', color: '#86909C' }}>
              系统中未找到您输入的企业，建议您选择"认证新企业"来创建企业账户。
            </Text>
          </div>
        </div>
      </Modal>
      
      {/* 申请成功弹窗 */}
      <Modal
        title={
          <div className="flex items-center">
            <IconUser className="text-green-500 mr-2" style={{ fontSize: 18 }} />
            申请成功
          </div>
        }
        visible={joinApplicationSuccessModalVisible}
        onCancel={() => setJoinApplicationSuccessModalVisible(false)}
        footer={
          <Button 
            type="primary" 
            onClick={handleJoinSuccessClose}
          >
            关闭
          </Button>
        }
        style={{ width: 400 }}
      >
        <div style={{ padding: '20px 0' }}>
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
            <Text style={{ fontSize: '14px', color: '#00B42A' }}>
              ✅ 申请成功，请等待管理员审核。
            </Text>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <Text style={{ fontSize: '14px', color: '#86909C' }}>
              您的加入申请已提交，企业管理员将在收到申请后进行审核，请耐心等待。
            </Text>
          </div>
        </div>
      </Modal>
      
      {/* 拒绝申请弹窗 */}
      <Modal
        title={
          <div className="flex items-center">
            <IconUser className="text-red-500 mr-2" style={{ fontSize: 18 }} />
            拒绝申请
          </div>
        }
        visible={rejectModalVisible}
        onCancel={() => {
          setRejectModalVisible(false);
          setRejectingApplication(null);
          setRejectReason('');
        }}
        onOk={handleConfirmReject}
        okText="确认拒绝"
        cancelText="取消"
        okButtonProps={{
          disabled: !rejectReason.trim()
        }}
        style={{ width: 500 }}
      >
        <div style={{ padding: '20px 0' }}>
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <Text style={{ fontSize: '14px', color: '#FF4D4F' }}>
              ⚠️ 拒绝后该用户将无法通过此次申请加入企业，请谨慎操作。
            </Text>
          </div>
          
          {rejectingApplication && (
            <div style={{ marginBottom: '16px' }}>
              <Text style={{ fontSize: '14px', color: '#86909C' }}>
                申请人：<Text style={{ fontWeight: 'bold' }}>{rejectingApplication.userName}</Text>
              </Text>
            </div>
          )}
          
          <Form layout="vertical">
            <FormItem
              label="拒绝原因"
              required
            >
              <Input.TextArea 
                placeholder="请填写拒绝理由，将会通知申请人"
                value={rejectReason}
                onChange={setRejectReason}
                maxLength={200}
                showWordLimit
                autoSize={{ minRows: 3, maxRows: 5 }}
              />
          </FormItem>
        </Form>
        </div>
      </Modal>

      {/* 邮箱已存在弹窗 */}
      <Modal
        title={
          <div className="flex items-center">
            <IconExclamationCircle className="text-orange-500 mr-2" style={{ fontSize: 18 }} />
            邮箱已存在
          </div>
        }
        visible={emailExistsModalVisible}
        onCancel={() => setEmailExistsModalVisible(false)}
        footer={
          <Button
            type="primary"
            onClick={() => setEmailExistsModalVisible(false)}
          >
            知道了
          </Button>
        }
        style={{ width: 400 }}
      >
        <div style={{ padding: '20px 0' }}>
          <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-md">
            <Text style={{ fontSize: '14px', color: '#FF7D00' }}>
              ⚠️ 该邮箱已存在员工列表中，无法邀请
            </Text>
          </div>

          <div style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
            <p>可能的原因：</p>
            <ul style={{ marginLeft: '16px', marginTop: '8px' }}>
              <li>该邮箱对应的员工已经加入企业</li>
              <li>该邮箱已有待处理的邀请</li>
              <li>该邮箱已被其他企业使用</li>
            </ul>
            <p style={{ marginTop: '12px', color: '#999' }}>
              请检查邮箱地址或联系管理员处理。
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CompanyProfile; 