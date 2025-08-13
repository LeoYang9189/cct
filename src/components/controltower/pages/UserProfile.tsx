import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Avatar, 
  Typography, 
  Grid, 
  Form,
  Input,
  Button,
  Select,
  Upload,
  Message,
  Tag,
  Divider,
  Space,
  Modal,
  Steps
} from '@arco-design/web-react';
import { 
  IconUser,
  IconUpload,
  IconIdcard,
  IconPhone,
  IconEmail,
  IconHome,
  IconCalendar,
  IconEdit,
  IconDelete,
  IconPlus,
  IconExclamationCircle,
  IconLock,
  IconSafe
} from '@arco-design/web-react/icon';

const { Title, Text } = Typography;
const { Row, Col } = Grid;
const FormItem = Form.Item;
const { Step } = Steps;

// 用户数据接口，与运营版保持一致
interface UserData {
  id: string;
  username: string;
  email: string;
  phone: string;
  company: string;
  role: 'super_admin' | 'user';
  status: 'active' | 'inactive' | 'pending';
  lastLogin: string;
  createTime: string;
  avatar?: string;
  thirdPartyUserIds?: {
    [systemName: string]: string;
  };
}

// SSO提供商配置
const ssoProviders = [
  { name: 'CargoWare', displayName: 'CargoWare', color: '#14b8a6' },
  { name: 'eTower', displayName: 'eTower', color: '#3b82f6' }
];

const UserProfile: React.FC = () => {
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [verifyForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [unbindModalVisible, setUnbindModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [verifyModalVisible, setVerifyModalVisible] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [passwordStep, setPasswordStep] = useState(0);
  const [verifyStep, setVerifyStep] = useState(0);
  const [verifyType, setVerifyType] = useState<'phone' | 'email'>('phone');
  const [, ] = useState<'sms' | 'email'>('sms'); // 保留状态结构但暂不使用
  const [countdown, setCountdown] = useState(0);
  const [verifyCountdown, setVerifyCountdown] = useState(0);
  const [pendingChanges, setPendingChanges] = useState<{phone?: string, email?: string}>({});
  
  const [currentUser, setCurrentUser] = useState<UserData>({
    id: 'A3K9M2X7N8Q5',
    username: '张三',
    email: 'zhangsan@example.com',
    phone: '13800138001',
    company: '货拉拉物流科技有限公司',
    role: 'user',
    status: 'active',
    lastLogin: '2024-01-15 14:30:25',
    createTime: '2023-12-01 09:15:30',
    thirdPartyUserIds: {
      'CargoWare': 'huh768gh',
      'eTower': 'ghuhi788'
    }
  });

  useEffect(() => {
    // 设置表单初始值
    form.setFieldsValue({
      username: currentUser.username,
      email: currentUser.email,
      phone: currentUser.phone,
      company: currentUser.company
    });
  }, [currentUser, form]);

  // 倒计时效果
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (verifyCountdown > 0) {
      timer = setTimeout(() => setVerifyCountdown(verifyCountdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [verifyCountdown]);

  const onSubmit = async () => {
    try {
      setLoading(true);
      await form.validate();
      const values = await form.getFields();
      
      // 检查是否需要验证手机号或邮箱
      const needVerifyPhone = values.phone !== currentUser.phone;
      const needVerifyEmail = values.email !== currentUser.email;
      
      if (needVerifyPhone || needVerifyEmail) {
        // 存储待更改的数据
        setPendingChanges({
          phone: needVerifyPhone ? values.phone : undefined,
          email: needVerifyEmail ? values.email : undefined
        });
        
        // 打开验证弹窗
        setVerifyType(needVerifyPhone ? 'phone' : 'email');
        setVerifyModalVisible(true);
        setVerifyStep(0);
        return;
      }
      
      // 如果不需要验证，直接更新
      setCurrentUser(prev => ({
        ...prev,
        username: values.username,
        company: values.company
      }));
      
      setEditMode(false);
      Message.success('个人信息更新成功');
    } catch (error) {
      console.error('表单验证失败:', error);
      Message.error('请检查表单填写是否正确');
    } finally {
      setLoading(false);
    }
  };

  const getStatusTag = (status: string) => {
    const statusMap = {
      active: { text: '正常', color: 'green' },
      inactive: { text: '禁用', color: 'red' },
      pending: { text: '待激活', color: 'orange' }
    };
    const config = statusMap[status as keyof typeof statusMap] || { text: status, color: 'blue' };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const getRoleTag = (role: string) => {
    const roleMap = {
      super_admin: { text: '超级管理员', color: 'red' },
      user: { text: '普通用户', color: 'blue' }
    };
    const config = roleMap[role as keyof typeof roleMap] || { text: role, color: 'blue' };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // 处理解绑确认
  const handleUnbindConfirm = (providerName: string) => {
    setSelectedProvider(providerName);
    setUnbindModalVisible(true);
  };

  // 执行解绑操作
  const handleUnbind = () => {
    if (selectedProvider) {
      setCurrentUser(prev => {
        const newThirdPartyUserIds = { ...prev.thirdPartyUserIds };
        delete newThirdPartyUserIds[selectedProvider];
        return {
          ...prev,
          thirdPartyUserIds: newThirdPartyUserIds
        };
      });
      Message.success(`已成功解绑 ${selectedProvider} 账号`);
      setUnbindModalVisible(false);
      setSelectedProvider('');
    }
  };

  // 处理重新绑定
  const handleRebind = (providerName: string) => {
    // 跳转到SSO授权页面
    const ssoUrl = `/sso/auth/${providerName.toLowerCase()}`;
    window.open(ssoUrl, '_blank');
    Message.info(`正在跳转到 ${providerName} 授权页面...`);
  };

  // 获取提供商配置
  // const getProviderConfig = (providerName: string) => {
  //   return ssoProviders.find(p => p.name === providerName) || { 
  //     name: providerName, 
  //     displayName: providerName, 
  //     color: '#165DFF' 
  //   };
  // };

  // 重置密码流程
  const handleResetPassword = () => {
    setPasswordModalVisible(true);
    setPasswordStep(0);
    passwordForm.resetFields();
  };

  // 发送重置密码验证码
  const sendPasswordVerificationCode = async () => {
    try {
      const values = await passwordForm.getFields();
      if (!values.method) {
        Message.error('请选择验证方式');
        return;
      }
      
      // 模拟发送验证码
      setCountdown(60);
      const target = values.method === 'sms' ? 
        currentUser.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') : 
        currentUser.email.replace(/(.{2}).*(@.*)/, '$1****$2');
      
      Message.success(`验证码已发送至 ${target}`);
      setPasswordStep(1);
    } catch (error) {
      console.error('发送验证码失败:', error);
    }
  };

  // 验证验证码并重置密码
  const handlePasswordReset = async () => {
    try {
      await passwordForm.validate();
      const values = await passwordForm.getFields();
      
      // 模拟验证码验证
      if (values.verificationCode !== '123456') {
        Message.error('验证码错误');
        return;
      }
      
      Message.success('密码重置成功');
      setPasswordModalVisible(false);
      setPasswordStep(0);
      passwordForm.resetFields();
    } catch (error) {
      console.error('重置密码失败:', error);
    }
  };

  // 发送手机号/邮箱验证码
  const sendVerificationCode = async () => {
    try {
      // 模拟发送验证码
      setVerifyCountdown(60);
      const target = verifyType === 'phone' ? 
        (pendingChanges.phone || currentUser.phone).replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') : 
        (pendingChanges.email || currentUser.email).replace(/(.{2}).*(@.*)/, '$1****$2');
      
      Message.success(`验证码已发送至 ${target}`);
      setVerifyStep(1);
    } catch (error) {
      console.error('发送验证码失败:', error);
    }
  };

  // 验证并更新手机号/邮箱
  const handleVerifyAndUpdate = async () => {
    try {
      await verifyForm.validate();
      const values = await verifyForm.getFields();
      
      // 模拟验证码验证
      if (values.verificationCode !== '123456') {
        Message.error('验证码错误');
        return;
      }
      
      // 更新用户信息
      setCurrentUser(prev => ({
        ...prev,
        username: form.getFieldValue('username'),
        company: form.getFieldValue('company'),
        phone: pendingChanges.phone || prev.phone,
        email: pendingChanges.email || prev.email
      }));
      
      // 更新表单值
      form.setFieldsValue({
        phone: pendingChanges.phone || currentUser.phone,
        email: pendingChanges.email || currentUser.email
      });
      
      Message.success('信息更新成功');
      setVerifyModalVisible(false);
      setVerifyStep(0);
      setPendingChanges({});
      setEditMode(false);
      verifyForm.resetFields();
    } catch (error) {
      console.error('验证失败:', error);
    }
  };

  return (
    <>

      
      {/* 用户基本信息卡片 */}
      <Card className="mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Upload
              listType="picture-card"
              limit={1}
              showUploadList={false}
              onChange={(fileList) => {
                if (fileList.length > 0) {
                  Message.success('头像上传成功');
                }
              }}
              accept="image/*"
            >
              <div className="relative group cursor-pointer">
                <Avatar size={80} className="bg-blue-500 transition-all duration-200 group-hover:opacity-80">
                  <IconUser style={{ fontSize: 40 }} />
          </Avatar>
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="text-white text-center">
                    <IconUpload style={{ fontSize: 16, marginBottom: 4 }} />
                    <div style={{ fontSize: '10px' }}>更换</div>
                  </div>
                </div>
              </div>
            </Upload>
            <div className="ml-6">
              <Title heading={3} className="mb-2">{currentUser.username}</Title>
              <Space>
                {getRoleTag(currentUser.role)}
                {getStatusTag(currentUser.status)}
              </Space>
              <div className="text-gray-500 mt-2">{currentUser.company}</div>
            </div>
          </div>
          <Space>
            <Button 
              icon={<IconLock />}
              onClick={handleResetPassword}
            >
              重置密码
            </Button>
            <Button 
              type="primary" 
              icon={<IconEdit />}
              onClick={() => setEditMode(!editMode)}
            >
              {editMode ? '取消编辑' : '编辑信息'}
            </Button>
          </Space>
        </div>

        <Divider />

        {/* 基本信息展示 */}
        {!editMode && (
          <div style={{ padding: '20px 0' }}>
            <Row gutter={[32, 24]}>
              <Col span={12}>
                <div className="flex items-center mb-4">
                  <IconIdcard className="text-blue-500 mr-3" style={{ fontSize: 18 }} />
                  <div>
                    <Text type="secondary">用户ID</Text>
                    <div className="mt-1">
                      <Text 
                        copyable={{ text: currentUser.id, icon: null, tooltips: ['复制ID', '已复制'] }}
                        style={{ fontFamily: 'monospace', fontSize: '14px' }}
                      >
                        {currentUser.id}
                      </Text>
                    </div>
                  </div>
                </div>
              </Col>
              
              <Col span={12}>
                <div className="flex items-center mb-4">
                  <IconEmail className="text-blue-500 mr-3" style={{ fontSize: 18 }} />
                  <div>
                    <Text type="secondary">邮箱地址</Text>
                    <div className="mt-1">
                      <Text copyable={{ text: currentUser.email }}>
                        {currentUser.email}
                      </Text>
                    </div>
                  </div>
                </div>
              </Col>

              <Col span={12}>
                <div className="flex items-center mb-4">
                  <IconPhone className="text-blue-500 mr-3" style={{ fontSize: 18 }} />
                  <div>
                    <Text type="secondary">手机号码</Text>
                    <div className="mt-1">
                      <Text copyable={{ text: currentUser.phone }}>
                        {currentUser.phone}
                      </Text>
                    </div>
                  </div>
                </div>
              </Col>

              <Col span={12}>
                <div className="flex items-center mb-4">
                  <IconHome className="text-blue-500 mr-3" style={{ fontSize: 18 }} />
                  <div>
                    <Text type="secondary">所属公司</Text>
                    <div className="mt-1">
                      <Text>{currentUser.company}</Text>
                    </div>
                  </div>
                </div>
              </Col>

              <Col span={12}>
                <div className="flex items-center mb-4">
                  <IconCalendar className="text-blue-500 mr-3" style={{ fontSize: 18 }} />
                  <div>
                    <Text type="secondary">最后登录</Text>
                    <div className="mt-1">
                      <Text>{currentUser.lastLogin}</Text>
                    </div>
                  </div>
                </div>
              </Col>

              <Col span={12}>
                <div className="flex items-center mb-4">
                  <IconCalendar className="text-blue-500 mr-3" style={{ fontSize: 18 }} />
                  <div>
                    <Text type="secondary">注册时间</Text>
                    <div className="mt-1">
                      <Text>{currentUser.createTime}</Text>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        )}

        {/* 编辑表单 */}
        {editMode && (
        <Form
          form={form}
          layout="vertical"
            className="mt-6"
        >
          <Row gutter={24}>
            <Col span={12}>
                <FormItem 
                  label="用户名" 
                  field="username" 
                  rules={[
                    { required: true, message: '请输入用户名' },
                    { minLength: 2, message: '用户名至少2个字符' }
                  ]}
                >
                  <Input placeholder="请输入用户名" />
              </FormItem>
            </Col>
            <Col span={12}>
                <FormItem 
                  label={
                    <div className="flex items-center">
                      <span>邮箱地址</span>
                      <Tag color="orange" size="small" className="ml-2">需验证</Tag>
                    </div>
                  }
                  field="email" 
                  rules={[
                    { required: true, message: '请输入邮箱' },
                    { type: 'email', message: '请输入有效的邮箱地址' }
                  ]}
                >
                <Input placeholder="请输入邮箱" />
              </FormItem>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
                <FormItem 
                  label={
                    <div className="flex items-center">
                      <span>手机号码</span>
                      <Tag color="orange" size="small" className="ml-2">需验证</Tag>
                    </div>
                  }
                  field="phone" 
                  rules={[
                    { required: true, message: '请输入手机号' },
                    {
                      validator: (value, callback) => {
                        if (value && !/^1[3-9]\d{9}$/.test(value)) {
                          callback('请输入有效的手机号');
                        } else {
                          callback();
                        }
                      }
                    }
                  ]}
                >
                <Input placeholder="请输入手机号" />
              </FormItem>
            </Col>
            <Col span={12}>
                <FormItem 
                  label="所属公司" 
                  field="company" 
                  rules={[
                    { required: true, message: '请输入所属公司' }
                  ]}
                >
                  <Input placeholder="请输入所属公司" />
              </FormItem>
            </Col>
          </Row>

            <FormItem>
              <Space>
                <Button 
                  type="primary" 
                  onClick={onSubmit}
                  loading={loading}
                >
                  保存更改
                </Button>
                <Button onClick={() => setEditMode(false)}>
                  取消
                </Button>
              </Space>
              </FormItem>
          </Form>
        )}
      </Card>

      {/* 第三方账号绑定信息 */}
      <Card title="第三方账号绑定" className="mb-6">
        <div style={{ padding: '16px 0' }}>
          <Row gutter={[24, 16]}>
            {ssoProviders.map(provider => {
              const isBinding = currentUser.thirdPartyUserIds?.[provider.name];
              const userId = currentUser.thirdPartyUserIds?.[provider.name];
              
              return (
                <Col span={12} key={provider.name}>
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center mr-3"
                        style={{ backgroundColor: `${provider.color}20` }}
                      >
                        <Text style={{ 
                          fontSize: '12px', 
                          fontWeight: 'bold', 
                          color: provider.color 
                        }}>
                          {provider.name.charAt(0).toUpperCase()}
                        </Text>
                      </div>
                      <div>
                        <div className="font-medium">{provider.displayName}</div>
                        {isBinding ? (
                          <Text type="secondary" style={{ fontSize: '12px', fontFamily: 'monospace' }}>
                            {userId}
                          </Text>
                        ) : (
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            未绑定账号
                          </Text>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isBinding ? (
                        <>
                          <Tag color="green">已绑定</Tag>
                          <Button 
                            type="text" 
                            size="small"
                            status="danger"
                            icon={<IconDelete />}
                            onClick={() => handleUnbindConfirm(provider.name)}
                          >
                            解绑
                          </Button>
                        </>
                      ) : (
                        <>
                          <Tag color="gray">未绑定</Tag>
                          <Button 
                            type="outline" 
                            size="small"
                            icon={<IconPlus />}
                            onClick={() => handleRebind(provider.name)}
                          >
                            去绑定
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
            </Col>
              );
            })}
          </Row>
        </div>
      </Card>

      {/* 解绑确认弹窗 */}
      <Modal
        title={
          <div className="flex items-center">
            <IconExclamationCircle className="text-orange-500 mr-2" style={{ fontSize: 18 }} />
            确认解绑账号
          </div>
        }
        visible={unbindModalVisible}
        onCancel={() => {
          setUnbindModalVisible(false);
          setSelectedProvider('');
        }}
        onOk={handleUnbind}
        okText="确认解绑"
        cancelText="取消"
        okButtonProps={{ status: 'danger' }}
        style={{ width: 480 }}
      >
        <div style={{ padding: '16px 0' }}>
          <Text>
            您确定要解绑 <Text code>{selectedProvider}</Text> 账号吗？
          </Text>
          <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-md">
            <Text type="secondary" style={{ fontSize: '14px' }}>
              <IconExclamationCircle className="mr-1" style={{ fontSize: 14 }} />
              解绑后，您将无法使用该第三方账号登录系统，需要重新授权绑定。
            </Text>
          </div>
        </div>
      </Modal>

      {/* 重置密码弹窗 */}
      <Modal
        title={
          <div className="flex items-center">
            <IconSafe className="text-blue-500 mr-2" style={{ fontSize: 18 }} />
            重置密码
          </div>
        }
        visible={passwordModalVisible}
        onCancel={() => {
          setPasswordModalVisible(false);
          setPasswordStep(0);
          passwordForm.resetFields();
          setCountdown(0);
        }}
        footer={null}
        style={{ width: 500 }}
      >
        <div style={{ padding: '20px 0' }}>
          <Steps current={passwordStep} size="small" className="mb-6">
            <Step title="选择验证方式" />
            <Step title="验证身份" />
            <Step title="设置新密码" />
          </Steps>

          <Form form={passwordForm} layout="vertical">
            {passwordStep === 0 && (
              <>
                <FormItem
                  label="选择验证方式"
                  field="method"
                  rules={[{ required: true, message: '请选择验证方式' }]}
                >
                  <Select placeholder="请选择验证方式">
                    <Select.Option value="sms">
                      短信验证 ({currentUser.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')})
                    </Select.Option>
                    <Select.Option value="email">
                      邮箱验证 ({currentUser.email.replace(/(.{2}).*(@.*)/, '$1****$2')})
                    </Select.Option>
                  </Select>
                </FormItem>
                <FormItem>
                  <Button type="primary" onClick={sendPasswordVerificationCode} style={{ width: '100%' }}>
                    发送验证码
                  </Button>
                </FormItem>
              </>
            )}

            {passwordStep === 1 && (
              <>
                <FormItem
                  label="验证码"
                  field="verificationCode"
                  rules={[{ required: true, message: '请输入验证码' }]}
                >
                  <Input placeholder="请输入6位验证码" maxLength={6} />
                </FormItem>
                <div className="flex justify-between mb-4">
                  <Text type="secondary">验证码已发送</Text>
                  <Button 
                    type="text" 
                    size="small"
                    disabled={countdown > 0}
                    onClick={sendPasswordVerificationCode}
                  >
                    {countdown > 0 ? `${countdown}s后重发` : '重新发送'}
                  </Button>
                </div>
                <FormItem
                  label="新密码"
                  field="newPassword"
                  rules={[
                    { required: true, message: '请输入新密码' },
                    { minLength: 6, message: '密码至少6位' }
                  ]}
                >
                  <Input.Password placeholder="请输入新密码" />
                </FormItem>
                <FormItem
                  label="确认新密码"
                  field="confirmPassword"
                  rules={[
                    { required: true, message: '请确认新密码' },
                    {
                      validator: (value, callback) => {
                        const newPassword = passwordForm.getFieldValue('newPassword');
                        if (value && value !== newPassword) {
                          callback('两次输入的密码不一致');
                        } else {
                          callback();
                        }
                      }
                    }
                  ]}
                >
                  <Input.Password placeholder="请再次输入新密码" />
                </FormItem>
                <FormItem>
                  <Button type="primary" onClick={handlePasswordReset} style={{ width: '100%' }}>
                    重置密码
                  </Button>
          </FormItem>
              </>
            )}
          </Form>
        </div>
      </Modal>

      {/* 手机号/邮箱验证弹窗 */}
      <Modal
        title={
          <div className="flex items-center">
            <IconSafe className="text-blue-500 mr-2" style={{ fontSize: 18 }} />
            验证{verifyType === 'phone' ? '手机号' : '邮箱'}
          </div>
        }
        visible={verifyModalVisible}
        onCancel={() => {
          setVerifyModalVisible(false);
          setVerifyStep(0);
          verifyForm.resetFields();
          setVerifyCountdown(0);
          setPendingChanges({});
        }}
        footer={null}
        style={{ width: 450 }}
      >
        <div style={{ padding: '20px 0' }}>
          <Steps current={verifyStep} size="small" className="mb-6">
            <Step title="发送验证码" />
            <Step title="验证身份" />
          </Steps>

          <Form form={verifyForm} layout="vertical">
            {verifyStep === 0 && (
              <>
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <Text type="secondary" style={{ fontSize: '14px' }}>
                    <IconExclamationCircle className="mr-1" style={{ fontSize: 14 }} />
                    检测到您修改了{verifyType === 'phone' ? '手机号' : '邮箱'}，需要验证新的{verifyType === 'phone' ? '手机号' : '邮箱'}才能保存更改。
                  </Text>
                </div>
                <div className="mb-4">
                  <Text type="secondary">
                    将向以下{verifyType === 'phone' ? '手机号' : '邮箱'}发送验证码：
                  </Text>
                  <div className="mt-1">
                    <Text style={{ fontWeight: 'bold' }}>
                      {verifyType === 'phone' ? 
                        (pendingChanges.phone || '').replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') :
                        (pendingChanges.email || '').replace(/(.{2}).*(@.*)/, '$1****$2')
                      }
                    </Text>
                  </div>
              </div>
                <FormItem>
                  <Button type="primary" onClick={sendVerificationCode} style={{ width: '100%' }}>
                    发送验证码
                  </Button>
          </FormItem>
              </>
            )}

            {verifyStep === 1 && (
              <>
                <FormItem
                  label="验证码"
                  field="verificationCode"
                  rules={[{ required: true, message: '请输入验证码' }]}
                >
                  <Input placeholder="请输入6位验证码" maxLength={6} />
                </FormItem>
                <div className="flex justify-between mb-4">
                  <Text type="secondary">验证码已发送</Text>
                  <Button 
                    type="text" 
                    size="small"
                    disabled={verifyCountdown > 0}
                    onClick={sendVerificationCode}
                  >
                    {verifyCountdown > 0 ? `${verifyCountdown}s后重发` : '重新发送'}
                  </Button>
                </div>
          <FormItem>
                  <Button type="primary" onClick={handleVerifyAndUpdate} style={{ width: '100%' }}>
                    验证并保存
                  </Button>
          </FormItem>
              </>
            )}
        </Form>
    </div>
      </Modal>
    </>
  );
};

export default UserProfile; 