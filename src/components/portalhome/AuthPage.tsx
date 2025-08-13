import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Form, Message, Modal } from '@arco-design/web-react';
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

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loginType, setLoginType] = useState<'password' | 'code'>('password');
  const [countdown, setCountdown] = useState(0);
  const [userAgreementVisible, setUserAgreementVisible] = useState(false);
  const [privacyPolicyVisible, setPrivacyPolicyVisible] = useState(false);
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

  // 模拟登录
  const handleLogin = async (values: LoginFormData) => {
    console.log('登录表单提交:', values);
    
    // 检查表单数据是否为空
    if (!values || !values.account) {
      console.error('表单数据为空或缺少账号字段');
      Message.error('请检查输入内容');
      return;
    }
    
    setLoading(true);
    try {
      console.log('登录数据:', values);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 验证虚拟账号密码
      const validAccounts = ['1', 'test@example.com', 'admin', '测试用户'];
      const validPasswords = ['1', '密码1', 'password', '123456'];
      
      if (loginType === 'password') {
        if (!validAccounts.includes(values.account) || !validPasswords.includes(values.password || '')) {
          Message.error('账号或密码错误！可用账号：1/test@example.com/admin，密码：1/密码1/password');
          setLoading(false);
          return;
        }
      } else {
        // 验证码登录模式，只验证账号
        if (!validAccounts.includes(values.account)) {
          Message.error('账号错误！可用账号：1/test@example.com/admin');
          setLoading(false);
          return;
        }
      }
      
      // 根据登录账号生成对应的用户数据
      let userData;
      if (values.account === 'test@example.com') {
        userData = {
          id: 'user_001',
          username: '测试用户',
          email: 'test@example.com',
          phone: '13800138000',
        };
      } else if (values.account === 'admin') {
        userData = {
          id: 'user_002',
          username: '管理员',
          email: 'admin@example.com',
          phone: '13900139000',
        };
      } else if (values.account === '1') {
        userData = {
          id: 'user_003',
          username: '用户1',
          email: 'user1@example.com',
          phone: '13700137000',
        };
      } else {
        userData = {
          id: 'user_004',
          username: values.account,
          email: values.account.includes('@') ? values.account : undefined,
          phone: !values.account.includes('@') ? values.account : undefined,
        };
      }
      
      // 保存用户登录状态
      login(userData);
      
      Message.success('登录成功！欢迎回来 🎉');
      
      // 确保在状态更新后导航
      setTimeout(() => {
        navigate('/portal');
      }, 100);
      
    } catch (error) {
      console.error('登录错误:', error);
      Message.error('登录失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 模拟注册
  const handleRegister = async (values: RegisterFormData) => {
    setLoading(true);
    try {
      console.log('注册数据:', values);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 模拟用户数据
      const userData = {
        id: 'user_' + Date.now(),
        username: values.username,
        email: values.email,
        phone: values.phone,
      };
      
      // 保存用户登录状态
      login(userData);
      
      Message.success('注册成功！欢迎加入我们 🌟');
      navigate('/portal');
    } catch (error) {
      Message.error('注册失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 发送验证码
  const handleSendCode = (formType: 'login' | 'register') => {
    if (countdown > 0) return;
    
    let account: string = '';
    if (formType === 'login') {
      account = loginForm.getFieldValue('account') || '';
      if (!account) {
        Message.error('请先输入手机号或邮箱');
        return;
      }
    } else {
      account = registerForm.getFieldValue('phone') || '';
      if (!account) {
        Message.error('请先输入手机号');
        return;
      }
    }
    
    Message.success('验证码已发送 📱');
    
    // 开始倒计时
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
                    <span className="text-3xl font-black">🚢</span>
                  </div>
                  <div className="logo-glow"></div>
                </div>
              </div>
            </div>
            <h1 className="text-3xl font-black text-blue-900 mb-3 tracking-tight">
              <span className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 bg-clip-text text-transparent">
                智慧物流平台
              </span>
            </h1>
            <p className="text-blue-800 text-lg font-medium">
              让国际物流更简单
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
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">欢迎回来</h2>
                    <p className="text-gray-500">登录您的账户继续使用智慧物流服务</p>
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
                      label={
                        <span className="text-gray-700 font-semibold">
                          {loginType === 'password' ? '邮箱或手机号' : '手机号或邮箱'}
                        </span>
                      }
                      rules={[{ required: true, message: '请输入账户信息' }]}
                      validateTrigger="onBlur"
                    >
                        <Input
                          placeholder={loginType === 'password' ? '请输入邮箱或手机号' : '请输入手机号或邮箱'}
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
                            onClick={() => handleSendCode('login')}
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
                      <span className="text-6xl">🌏</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-700 mb-2">全球物流网络</h3>
                    <p className="text-gray-500 text-center leading-relaxed">
                      连接全球港口，提供端到端的物流解决方案
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
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">创建账户</h2>
                    <p className="text-gray-500">开启您的智慧物流之旅</p>
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
                        label={<span className="text-gray-700 font-semibold">用户名</span>}
                        rules={[{ required: true, message: '请输入用户名' }]}
                      >
                          <Input
                            placeholder="请输入用户名"
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
                      field="phoneCode"
                      label={<span className="text-gray-700 font-semibold">手机验证码</span>}
                      rules={[{ required: true, message: '请输入手机验证码' }]}
                    >
                      <div className="flex space-x-3">
                        <div className="auth-input-container flex-1">
                          <Input
                            placeholder="请输入验证码"
                            size="large"
                            className="auth-input-field"
                          />
                        </div>
                        <button
                          type="button"
                          disabled={countdown > 0}
                          onClick={() => handleSendCode('register')}
                          className="auth-code-button"
                        >
                          {countdown > 0 ? `${countdown}s` : '发送验证码'}
                        </button>
                      </div>
                    </Form.Item>

                    <Form.Item
                      field="email"
                      label={<span className="text-gray-700 font-semibold">邮箱（可选）</span>}
                      rules={[
                        { 
                          type: 'email', 
                          message: '请输入有效的邮箱格式' 
                        }
                      ]}
                    >
                      <div className="auth-input-container">
                        <IconEmail className="auth-input-icon" />
                        <Input
                          placeholder="请输入邮箱（可选）"
                          size="large"
                          className="auth-input-field"
                        />
                      </div>
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
                        <div className="auth-input-container">
                          <IconLock className="auth-input-icon" />
                          <Input
                            type={passwordVisible ? 'text' : 'password'}
                            placeholder="至少6位密码"
                            size="large"
                            className="auth-input-field"
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
                        </div>
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
                        <div className="auth-input-container">
                          <IconLock className="auth-input-icon" />
                          <Input
                            type={confirmPasswordVisible ? 'text' : 'password'}
                            placeholder="再次输入密码"
                            size="large"
                            className="auth-input-field"
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
                        </div>
                      </Form.Item>
                    </div>

                    <div className="mb-6">
                      <label className="flex items-start text-gray-600 cursor-pointer">
                        <input type="checkbox" className="auth-checkbox mt-1" required />
                        <span className="ml-3 leading-relaxed">
                          我已阅读并同意 
                          <button 
                            type="button"
                            className="text-blue-600 hover:text-blue-700 mx-1 underline font-medium"
                            onClick={() => setUserAgreementVisible(true)}
                          >
                            用户协议
                          </button>
                          和
                          <button 
                            type="button"
                            className="text-blue-600 hover:text-blue-700 mx-1 underline font-medium"
                            onClick={() => setPrivacyPolicyVisible(true)}
                          >
                            隐私政策
                          </button>
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
                      {loading ? '创建中...' : '创建账户'}
                    </Button>
                  </Form>
                </div>

                {/* 右侧装饰 */}
                <div className="auth-right-section">
                  <div className="auth-decoration">
                    <div className="decoration-icon">
                      <span className="text-6xl">📦</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-700 mb-2">智能管理</h3>
                    <p className="text-gray-500 text-center leading-relaxed">
                      AI驱动的智能物流管理系统，提升效率降低成本
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 底部切换 */}
            <div className="auth-footer">
              <p className="text-gray-600 mb-4">
                {isLogin ? '还没有账户？' : '已有账户？'}
              </p>
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="auth-switch-button"
              >
                {isLogin ? '立即注册' : '立即登录'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 用户协议弹窗 */}
      <Modal
        title={null}
        visible={userAgreementVisible}
        onCancel={() => setUserAgreementVisible(false)}
        footer={null}
        style={{ width: '800px' }}
        className="modern-modal"
      >
        <div className="modal-header">
          <div className="modal-icon">📜</div>
          <h3 className="text-2xl font-bold text-gray-800">用户协议</h3>
          <p className="text-gray-500 mt-2">智慧物流平台服务条款</p>
        </div>
        
        <div className="modal-content">
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <section className="agreement-section">
              <h4 className="section-title">1. 服务条款的接受</h4>
              <p>欢迎使用智慧物流平台！本协议是您与本平台之间关于使用物流服务的法律协议。通过注册、访问或使用本服务，您表示同意接受本协议的所有条款和条件。</p>
            </section>

            <section className="agreement-section">
              <h4 className="section-title">2. 物流服务内容</h4>
              <p>本平台提供国际物流、货运代理、仓储管理、供应链优化等服务，具体功能以平台实际提供为准。我们致力于为客户提供高效、安全的物流解决方案。</p>
            </section>

            <section className="agreement-section">
              <h4 className="section-title">3. 用户义务与责任</h4>
              <p>您承诺提供真实、准确的货物信息和联系方式，并及时更新。您有责任确保货物的合法性，遵守相关进出口法规，配合海关检查等相关程序。</p>
            </section>

            <section className="agreement-section">
              <h4 className="section-title">4. 服务费用与结算</h4>
              <p>物流服务费用将根据货物重量、体积、运输距离、服务类型等因素确定。费用标准透明公开，支持多种结算方式，确保交易安全。</p>
            </section>

            <section className="agreement-section">
              <h4 className="section-title">5. 免责条款</h4>
              <p>在法律允许范围内，对于不可抗力、政策变化、海关扣留等因素导致的延误或损失，平台不承担责任。建议客户购买相应的货物保险。</p>
            </section>
          </div>
        </div>

        <div className="modal-footer">
          <Button 
            onClick={() => setUserAgreementVisible(false)} 
            className="modern-button"
            size="large"
          >
            我已阅读并理解
          </Button>
        </div>
      </Modal>

      {/* 隐私政策弹窗 */}
      <Modal
        title={null}
        visible={privacyPolicyVisible}
        onCancel={() => setPrivacyPolicyVisible(false)}
        footer={null}
        style={{ width: '800px' }}
        className="modern-modal"
      >
        <div className="modal-header">
          <div className="modal-icon">🔒</div>
          <h3 className="text-2xl font-bold text-gray-800">隐私政策</h3>
          <p className="text-gray-500 mt-2">我们如何保护您的个人信息</p>
        </div>
        
        <div className="modal-content">
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <section className="agreement-section">
              <h4 className="section-title">1. 信息收集与使用</h4>
              <p>我们收集您的联系信息、货物详情、交易记录等，用于提供物流服务、优化用户体验、保障交易安全。所有信息均严格保密，不会用于其他商业用途。</p>
            </section>

            <section className="agreement-section">
              <h4 className="section-title">2. 数据安全保护</h4>
              <p>采用银行级别的数据加密技术，建立多重安全防护体系，定期进行安全审计，确保您的个人信息和交易数据安全。</p>
            </section>

            <section className="agreement-section">
              <h4 className="section-title">3. 第三方合作</h4>
              <p>为完成物流服务，我们可能与承运商、海关、港口等第三方机构共享必要信息。所有合作方均签署保密协议，确保信息安全。</p>
            </section>

            <section className="agreement-section">
              <h4 className="section-title">4. 数据存储与跨境传输</h4>
              <p>您的数据主要存储在中国境内的安全服务器中。对于国际物流业务，可能涉及跨境数据传输，我们将遵循相关法律法规要求。</p>
            </section>

            <section className="agreement-section">
              <h4 className="section-title">5. 您的权利</h4>
              <p>您有权访问、更正、删除个人信息，撤回同意，以及要求数据可携带。如需行使这些权利或有任何隐私问题，请联系我们的客服团队。</p>
            </section>
          </div>
        </div>

        <div className="modal-footer">
          <Button 
            onClick={() => setPrivacyPolicyVisible(false)} 
            className="modern-button"
            size="large"
          >
            我已阅读并理解
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default AuthPage; 