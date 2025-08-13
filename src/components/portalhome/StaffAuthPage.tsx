import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Form, Message } from '@arco-design/web-react';
import { IconUser, IconLock, IconEmail, IconPhone, IconArrowLeft, IconEye, IconEyeInvisible } from '@arco-design/web-react/icon';
import { useUser } from './UserContext';
import './PortalStyles.css';

interface LoginFormData {
  account: string; // 邮箱或手机号
  password?: string;
  code?: string;
}

interface RegisterFormData {
  username: string;
  phone: string;
  email?: string;
  password: string;
  confirmPassword: string;
  phoneCode: string;
}

const StaffAuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loginType, setLoginType] = useState<'password' | 'code'>('password');
  const [countdown, setCountdown] = useState(0);
  const [, ] = useState(false); // userAgreementVisible状态
  const [, ] = useState(false); // privacyPolicyVisible状态
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();
  const { login } = useUser();

  const [loginForm] = Form.useForm<LoginFormData>();
  const [registerForm] = Form.useForm<RegisterFormData>();

  useEffect(() => {
    setMounted(true);
  }, []);

  // 模拟员工登录
  const handleLogin = async (values: LoginFormData) => {
    console.log('员工登录表单提交:', values);
    
    if (!values || !values.account) {
      Message.error('请检查输入内容');
      return;
    }
    
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 验证员工账号密码
      const validStaffAccounts = ['staff', 'admin', 'manager', 'control-tower'];
      const validPasswords = ['1', '密码1', 'password', '123456', 'staff123'];
      
      if (loginType === 'password') {
        if (!validStaffAccounts.includes(values.account) || !validPasswords.includes(values.password || '')) {
          Message.error('邮箱/手机号或密码错误！可用账号：staff/admin/manager，密码：1/staff123');
          setLoading(false);
          return;
        }
      } else {
        if (!validStaffAccounts.includes(values.account)) {
          Message.error('邮箱/手机号错误！可用账号：staff/admin/manager');
          setLoading(false);
          return;
        }
      }
      
      // 根据员工账号生成对应的用户数据
      let userData;
      if (values.account === 'staff') {
        userData = {
          id: 'staff_001',
          username: '员工账号',
          email: 'staff@controltower.com',
          phone: '13800000001',
        };
      } else if (values.account === 'admin') {
        userData = {
          id: 'staff_002',
          username: '管理员',
          email: 'admin@controltower.com',
          phone: '13800000002',
        };
      } else if (values.account === 'manager') {
        userData = {
          id: 'staff_003',
          username: '系统管理员',
          email: 'manager@controltower.com',
          phone: '13800000003',
        };
      } else {
        userData = {
          id: 'staff_004',
          username: values.account,
          email: `${values.account}@controltower.com`,
          phone: undefined,
        };
      }
      
      login(userData);
      Message.success('员工登录成功！欢迎使用控制塔系统 🎉');
      
      setTimeout(() => {
        navigate('/controltower');
      }, 100);
      
    } catch (error) {
      console.error('员工登录错误:', error);
      Message.error('登录失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 模拟员工注册
  const handleRegister = async (values: RegisterFormData) => {
    setLoading(true);
    try {
      console.log('员工注册数据:', values);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 模拟用户数据
      const userData = {
        id: 'staff_' + Date.now(),
        username: values.username,
        email: values.email,
        phone: values.phone,
      };
      
      // 保存用户登录状态
      login(userData);
      
      Message.success('员工注册成功！欢迎加入控制塔系统 🌟');
      navigate('/controltower');
    } catch (error) {
      Message.error('注册失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 发送验证码
  const handleSendCode = () => {
    if (countdown > 0) return;
    
    const account = loginForm.getFieldValue('account') || '';
    if (!account) {
      Message.error('请先输入邮箱或手机号');
      return;
    }
    
    Message.success('验证码已发送 📱');
    
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // SSO登录
  const handleSSOLogin = (provider: string) => {
    navigate(`/sso/auth/${provider}`);
  };

  // 返回Portal首页
  const handleBackToPortal = () => {
    navigate('/portal');
  };

  return (
    <div className="min-h-screen relative overflow-hidden auth-container">
      {/* 动态背景 */}
      <div className="fixed inset-0 auth-background">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-sky-400/20 to-blue-300/20"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          {/* 浮动圆球 */}
          <div className="floating-orb orb-1"></div>
          <div className="floating-orb orb-2"></div>
          <div className="floating-orb orb-3"></div>
          <div className="floating-orb orb-4"></div>
          <div className="floating-orb orb-5"></div>
        </div>
        {/* 网格背景 */}
        <div className="absolute inset-0 grid-background"></div>
      </div>

      {/* 返回首页按钮 */}
      <div className="absolute top-8 left-8 z-50">
        <button 
          onClick={handleBackToPortal}
          className="group flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-blue-800/30 text-blue-800 hover:bg-white/20 hover:border-blue-800/50 transition-all duration-300 hover:scale-105"
        >
          <IconArrowLeft className="text-lg group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="font-medium">返回首页</span>
        </button>
      </div>

      {/* 主内容区域 */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className={`w-full max-w-4xl transition-all duration-1000 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          
          {/* Logo区域 */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <div className="logo-container group">
                  <div className="logo-inner">
                    <span className="text-3xl font-black">🏗️</span>
                  </div>
                  <div className="logo-glow"></div>
                </div>
              </div>
            </div>
            <h1 className="text-3xl font-black text-blue-900 mb-3 tracking-tight">
              <span className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 bg-clip-text text-transparent">
                控制塔系统
              </span>
            </h1>
            <p className="text-blue-800 text-lg font-medium">
              员工专用管理平台
            </p>
          </div>

          {/* 主卡片 */}
          <div className="auth-main-card-wide">
            {/* 登录页面 */}
            {isLogin ? (
              <div className="auth-content-grid">
                {/* 左侧内容 */}
                <div className="auth-left-section">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">员工登录</h2>
                    <p className="text-gray-500">使用您的员工账户登录控制塔系统</p>
                  </div>

                                  {/* SSO登录按钮 */}
                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-3 text-center">快速登录</p>
                  <div className="flex justify-center gap-8">
                    <button
                      onClick={() => handleSSOLogin('etower')}
                      className="sso-button sso-etower"
                      title="eTower登录"
                    >
                      <div className="sso-icon">
                        <img 
                          src="/assets/111.png" 
                          alt="eTower" 
                          className="w-8 h-8 object-contain"
                        />
                      </div>
                      <span className="sso-text">eTower</span>
                    </button>
                    <button
                      onClick={() => handleSSOLogin('cargoware')}
                      className="sso-button sso-cargoware"
                      title="CargoWare登录"
                    >
                      <div className="sso-icon">
                        <img 
                          src="/assets/v2_snyjmq-Lh_sDSg4.png" 
                          alt="CargoWare" 
                          className="w-8 h-8 object-contain"
                        />
                      </div>
                      <span className="sso-text">CargoWare</span>
                    </button>
                  </div>
                </div>

                  {/* 分割线 */}
                  <div className="flex items-center mb-6">
                    <div className="flex-1 h-px bg-gray-300"></div>
                    <span className="px-3 text-sm text-gray-500">或使用账号登录</span>
                    <div className="flex-1 h-px bg-gray-300"></div>
                  </div>

                  {/* 登录方式切换 */}
                  <div className="auth-tab-container mb-6">
                    <button
                      className={`auth-tab ${loginType === 'password' ? 'active' : ''}`}
                      onClick={() => setLoginType('password')}
                    >
                      <span>密码登录</span>
                    </button>
                    <button
                      className={`auth-tab ${loginType === 'code' ? 'active' : ''}`}
                      onClick={() => setLoginType('code')}
                    >
                      <span>验证码登录</span>
                    </button>
                  </div>

                  <Form
                    form={loginForm}
                    layout="vertical"
                    onSubmit={handleLogin}
                    className="space-y-4"
                    validateTrigger="onSubmit"
                  >
                    <Form.Item
                      field="account"
                      label={<span className="text-gray-700 font-semibold">邮箱或手机号</span>}
                      rules={[{ required: true, message: '请输入邮箱或手机号' }]}
                      validateTrigger="onBlur"
                    >
                      <Input
                        placeholder="请输入邮箱或手机号"
                        size="large"
                        className="auth-input-field"
                        prefix={<IconUser className="auth-input-icon" />}
                      />
                    </Form.Item>

                    {loginType === 'password' ? (
                      <Form.Item
                        field="password"
                        label={<span className="text-gray-700 font-semibold">密码</span>}
                        rules={[{ required: true, message: '请输入密码' }]}
                        validateTrigger="onBlur"
                      >
                        <Input
                          type={passwordVisible ? 'text' : 'password'}
                          placeholder="请输入密码"
                          size="large"
                          className="auth-input-field"
                          prefix={<IconLock className="auth-input-icon" />}
                          suffix={
                            <button
                              type="button"
                              onClick={() => setPasswordVisible(!passwordVisible)}
                              className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              {passwordVisible ? <IconEyeInvisible /> : <IconEye />}
                            </button>
                          }
                        />
                      </Form.Item>
                    ) : (
                      <Form.Item
                        field="code"
                        label={<span className="text-gray-700 font-semibold">验证码</span>}
                        rules={[{ required: true, message: '请输入验证码' }]}
                        validateTrigger="onBlur"
                      >
                        <div className="flex space-x-3">
                          <Input
                            placeholder="请输入验证码"
                            size="large"
                            className="auth-input-field flex-1"
                          />
                          <button
                            type="button"
                            disabled={countdown > 0}
                            onClick={handleSendCode}
                            className="auth-code-button"
                          >
                            {countdown > 0 ? `${countdown}s` : '发送验证码'}
                          </button>
                        </div>
                      </Form.Item>
                    )}

                    {loginType === 'password' && (
                      <div className="flex justify-between items-center mb-4">
                        <label className="flex items-center text-gray-600 cursor-pointer">
                          <input type="checkbox" className="auth-checkbox" />
                          <span className="ml-3">记住我</span>
                        </label>
                        <button type="button" className="text-blue-600 hover:text-blue-700 font-medium">
                          忘记密码？
                        </button>
                      </div>
                    )}

                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      loading={loading}
                      className="auth-submit-button"
                    >
                      {loading ? '登录中...' : '立即登录'}
                    </Button>
                  </Form>
                </div>

                {/* 右侧装饰 */}
                <div className="auth-right-section">
                  <div className="auth-decoration">
                    <div className="decoration-icon">
                      <span className="text-6xl">🏗️</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-700 mb-2">控制塔系统</h3>
                    <p className="text-gray-500 text-center leading-relaxed">
                      集中管理、实时监控、智能决策的企业级平台
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              /* 注册页面 */
              <div className="auth-content-grid">
                {/* 左侧内容 */}
                <div className="auth-left-section">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">员工注册</h2>
                    <p className="text-gray-500">创建员工账户加入控制塔系统</p>
                  </div>

                  <Form
                    form={registerForm}
                    layout="vertical"
                    onSubmit={handleRegister}
                    className="space-y-4"
                    validateTrigger="onSubmit"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Form.Item
                        field="username"
                        label={<span className="text-gray-700 font-semibold">员工姓名</span>}
                        rules={[{ required: true, message: '请输入员工姓名' }]}
                      >
                        <Input
                          placeholder="请输入员工姓名"
                          size="large"
                          className="auth-input-field"
                          prefix={<IconUser className="auth-input-icon" />}
                        />
                      </Form.Item>

                      <Form.Item
                        field="phone"
                        label={<span className="text-gray-700 font-semibold">手机号</span>}
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
                        <Input
                          placeholder="请输入手机号"
                          size="large"
                          className="auth-input-field"
                          prefix={<IconPhone className="auth-input-icon" />}
                        />
                      </Form.Item>
                    </div>

                    <Form.Item
                      field="email"
                      label={<span className="text-gray-700 font-semibold">企业邮箱</span>}
                      rules={[
                        { required: true, message: '请输入企业邮箱' },
                        { 
                          type: 'email', 
                          message: '请输入有效的邮箱格式' 
                        }
                      ]}
                    >
                      <Input
                        placeholder="请输入企业邮箱"
                        size="large"
                        className="auth-input-field"
                        prefix={<IconEmail className="auth-input-icon" />}
                      />
                    </Form.Item>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Form.Item
                        field="password"
                        label={<span className="text-gray-700 font-semibold">设置密码</span>}
                        rules={[
                          { required: true, message: '请输入密码' },
                          { minLength: 6, message: '密码至少6位' }
                        ]}
                      >
                        <Input
                          type={passwordVisible ? 'text' : 'password'}
                          placeholder="至少6位密码"
                          size="large"
                          className="auth-input-field"
                          prefix={<IconLock className="auth-input-icon" />}
                          suffix={
                            <button
                              type="button"
                              onClick={() => setPasswordVisible(!passwordVisible)}
                              className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              {passwordVisible ? <IconEyeInvisible /> : <IconEye />}
                            </button>
                          }
                        />
                      </Form.Item>

                      <Form.Item
                        field="confirmPassword"
                        label={<span className="text-gray-700 font-semibold">确认密码</span>}
                        rules={[
                          { required: true, message: '请确认密码' },
                          {
                            validator: (value, callback) => {
                              const password = registerForm.getFieldValue('password');
                              if (value && value !== password) {
                                callback('两次输入的密码不一致');
                              } else {
                                callback();
                              }
                            }
                          }
                        ]}
                      >
                        <Input
                          type={confirmPasswordVisible ? 'text' : 'password'}
                          placeholder="再次输入密码"
                          size="large"
                          className="auth-input-field"
                          prefix={<IconLock className="auth-input-icon" />}
                          suffix={
                            <button
                              type="button"
                              onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                              className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              {confirmPasswordVisible ? <IconEyeInvisible /> : <IconEye />}
                            </button>
                          }
                        />
                      </Form.Item>
                    </div>

                    <div className="mb-6">
                      <label className="flex items-start text-gray-600 cursor-pointer">
                        <input type="checkbox" className="auth-checkbox mt-1" required />
                        <span className="ml-3 leading-relaxed">
                          我已阅读并同意企业内部管理规定和保密协议
                        </span>
                      </label>
                    </div>

                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      loading={loading}
                      className="auth-submit-button"
                    >
                      {loading ? '创建中...' : '创建员工账户'}
                    </Button>
                  </Form>
                </div>

                {/* 右侧装饰 */}
                <div className="auth-right-section">
                  <div className="auth-decoration">
                    <div className="decoration-icon">
                      <span className="text-6xl">👥</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-700 mb-2">团队协作</h3>
                    <p className="text-gray-500 text-center leading-relaxed">
                      高效的团队协作平台，提升工作效率
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 底部切换 */}
            <div className="auth-footer">
              <p className="text-gray-600 mb-4">
                {isLogin ? '还没有员工账户？' : '已有员工账户？'}
              </p>
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="auth-switch-button"
              >
                {isLogin ? '员工注册' : '员工登录'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffAuthPage; 