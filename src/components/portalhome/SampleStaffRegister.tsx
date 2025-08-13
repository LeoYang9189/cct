import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Form, Message } from '@arco-design/web-react';
import { IconUser, IconLock, IconEmail, IconPhone, IconArrowLeft, IconEye, IconEyeInvisible } from '@arco-design/web-react/icon';
import { useUser } from './UserContext';
import './PortalStyles.css';

interface RegisterFormData {
  username: string;
  phone: string;
  email?: string;
  password: string;
  confirmPassword: string;
}

const SampleStaffRegister: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();
  const { login } = useUser();

  const [registerForm] = Form.useForm<RegisterFormData>();

  useEffect(() => {
    setMounted(true);
    // 设置预填的邮箱
    registerForm.setFieldsValue({
      email: 'Samplestaff@123.com'
    });
  }, [registerForm]);

  // 模拟员工注册
  const handleRegister = async (values: RegisterFormData) => {
    setLoading(true);
    try {
      console.log('演示员工注册数据:', values);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 模拟用户数据
      const userData = {
        id: 'sample_staff_' + Date.now(),
        username: values.username,
        email: values.email,
        phone: values.phone,
      };
      
      // 保存用户登录状态
      login(userData);
      
      Message.success('演示员工注册成功！欢迎加入控制塔系统 🌟');
      navigate('/controltower');
    } catch (error) {
      Message.error('注册失败，请重试');
    } finally {
      setLoading(false);
    }
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
          type="button"
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
            {/* 注册页面 */}
            <div className="auth-content-grid">
              {/* 左侧内容 */}
              <div className="auth-left-section">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">邀请注册</h2>
                  <p className="text-gray-500">邀请注册</p>
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
                    label={<span className="text-gray-700 font-semibold">企业邮箱（邀请邮箱）</span>}
                    rules={[
                      { required: true, message: '请输入企业邮箱' },
                      { 
                        type: 'email', 
                        message: '请输入有效的邮箱格式' 
                      }
                    ]}
                  >
                    <Input
                      placeholder="邀请时填写的邮箱"
                      size="large"
                      className="auth-input-field"
                      prefix={<IconEmail className="auth-input-icon" />}
                      disabled
                      style={{ 
                        backgroundColor: '#f5f5f5',
                        color: '#666',
                        cursor: 'not-allowed'
                      }}
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
                    {loading ? '创建中...' : '完成注册'}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default SampleStaffRegister;
