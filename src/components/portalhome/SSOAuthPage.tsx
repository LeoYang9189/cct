import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Input, Form, Message, Modal } from '@arco-design/web-react';
import { IconUser, IconLock, IconArrowLeft, IconEye, IconEyeInvisible } from '@arco-design/web-react/icon';
import { useUser } from './UserContext';
import './PortalStyles.css';

interface AuthFormData {
  username: string;
  password: string;
}

interface Tenant {
  id: string;
  code: string;
  name: string;
}

const SSOAuthPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showTenantModal, setShowTenantModal] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<string>('');
  const navigate = useNavigate();
  const { login } = useUser();
  const { provider } = useParams<{ provider: string }>();

  const [authForm] = Form.useForm<AuthFormData>();

  // 模拟租户列表
  const tenants: Tenant[] = [
    { id: 'tenant_001', code: 'CT001', name: 'eTower运营租户' },
    { id: 'tenant_002', code: 'CT002', name: 'CargoWare物流租户' },
    { id: 'tenant_003', code: 'CT003', name: '集团总部租户' },
    { id: 'tenant_004', code: 'CT004', name: '华东区域租户' },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  // 获取SSO提供商信息
  const getProviderInfo = () => {
    switch (provider) {
      case 'etower':
        return {
          name: 'eTower',
          logo: '/assets/111.png',
          color: 'from-blue-600 to-blue-800',
          bgColor: 'bg-blue-50'
        };
      case 'cargoware':
        return {
          name: 'CargoWare',
          logo: '/assets/v2_snyjmq-Lh_sDSg4.png',
          color: 'from-teal-600 to-teal-800',
          bgColor: 'bg-teal-50'
        };
      default:
        return {
          name: 'Unknown',
          logo: '🔐',
          color: 'from-gray-600 to-gray-800',
          bgColor: 'bg-gray-50'
        };
    }
  };

  const providerInfo = getProviderInfo();

  // 处理授权登录
  const handleAuth = async (values: AuthFormData) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 模拟授权验证
      const validCredentials = [
        { username: 'admin', password: '123456' },
        { username: 'user', password: 'password' },
        { username: 'test', password: '1' },
      ];
      
      const isValid = validCredentials.some(
        cred => cred.username === values.username && cred.password === values.password
      );
      
      if (!isValid) {
        Message.error('用户名或密码错误');
        setLoading(false);
        return;
      }
      
      Message.success(`${providerInfo.name} 授权成功！`);
      
      // 显示租户选择弹窗
      console.log('准备显示租户选择弹窗');
      setShowTenantModal(true);
      console.log('弹窗状态已设置为true:', true);
      
    } catch (error) {
      Message.error('授权失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 确认租户选择
  const handleTenantConfirm = async () => {
    if (!selectedTenant) {
      Message.error('请选择租户');
      return;
    }
    
    const tenant = tenants.find(t => t.id === selectedTenant);
    if (!tenant) return;
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 创建用户数据
      const userData = {
        id: `sso_${Date.now()}`,
        username: `${providerInfo.name}用户`,
        email: `user@${provider}.com`,
        phone: '13800000000',
        tenant: tenant,
        provider: provider,
      };
      
      login(userData);
      
      Message.success('绑定成功！正在跳转到控制塔系统...');
      
      setTimeout(() => {
        navigate('/controltower');
      }, 1000);
      
    } catch (error) {
      Message.error('绑定失败，请重试');
    }
  };

  const handleBackToStaffAuth = () => {
    navigate('/staff/auth');
  };

  return (
    <div className="min-h-screen relative overflow-hidden auth-container">
      {/* 动态背景 */}
      <div className={`fixed inset-0 auth-background ${providerInfo.bgColor}`}>
        <div className={`absolute inset-0 bg-gradient-to-br ${providerInfo.color}/20`}></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="floating-orb orb-1"></div>
          <div className="floating-orb orb-2"></div>
          <div className="floating-orb orb-3"></div>
        </div>
        <div className="absolute inset-0 grid-background"></div>
      </div>

      {/* 返回按钮 */}
      <div className="absolute top-8 left-8 z-50">
        <button 
          onClick={handleBackToStaffAuth}
          className="group flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-gray-800/30 text-gray-800 hover:bg-white/20 hover:border-gray-800/50 transition-all duration-300 hover:scale-105"
        >
          <IconArrowLeft className="text-lg group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="font-medium">返回登录</span>
        </button>
      </div>

      {/* 主内容区域 */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className={`w-full max-w-md transition-all duration-1000 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          
          {/* 授权卡片 */}
          <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/50 p-8">
            {/* Logo区域 */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${providerInfo.color} flex items-center justify-center text-white text-2xl font-bold shadow-lg`}>
                  {provider === 'etower' || provider === 'cargoware' ? (
                    <img 
                      src={providerInfo.logo} 
                      alt={providerInfo.name} 
                      className="w-10 h-10 object-contain"
                    />
                  ) : (
                    providerInfo.logo
                  )}
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                {providerInfo.name} 授权登录
              </h1>
              <p className="text-gray-500">
                请使用您的 {providerInfo.name} 账户进行授权
              </p>
            </div>

            <Form
              form={authForm}
              layout="vertical"
              onSubmit={handleAuth}
              className="space-y-4"
            >
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
                field="password"
                label={<span className="text-gray-700 font-semibold">密码</span>}
                rules={[{ required: true, message: '请输入密码' }]}
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

              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={loading}
                className="w-full mt-6 h-12 text-lg font-semibold"
                style={{
                  background: `linear-gradient(135deg, var(--primary-6), var(--primary-7))`,
                  border: 'none'
                }}
              >
                {loading ? '授权中...' : '授权登录'}
              </Button>
            </Form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                登录即表示您同意授权控制塔系统访问您的 {providerInfo.name} 账户信息
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 租户选择弹窗 */}
      <Modal
        title="🏢 选择租户"
        visible={showTenantModal}
        onCancel={() => {
          console.log('取消弹窗');
          setShowTenantModal(false);
        }}
        footer={
          <div className="flex space-x-3">
            <Button
              onClick={() => {
                console.log('点击取消按钮');
                setShowTenantModal(false);
              }}
              className="flex-1"
            >
              取消
            </Button>
            <Button
              type="primary"
              onClick={handleTenantConfirm}
              className="flex-1"
              disabled={!selectedTenant}
            >
              确认绑定
            </Button>
          </div>
        }
      >
        <div className="p-4">
          <p className="text-gray-600 mb-6">请选择要绑定的租户：</p>
          
          <div className="space-y-3">
            {tenants.map((tenant) => (
              <label
                key={tenant.id}
                className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                  selectedTenant === tenant.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="tenant"
                  value={tenant.id}
                  checked={selectedTenant === tenant.id}
                  onChange={(e) => setSelectedTenant(e.target.value)}
                  className="mr-3"
                />
                <div className="flex-1">
                  <div className="font-semibold text-gray-800">{tenant.name}</div>
                  <div className="text-sm text-gray-500">租户号：{tenant.code}</div>
                </div>
              </label>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SSOAuthPage; 