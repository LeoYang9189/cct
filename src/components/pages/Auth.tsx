import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import octopusAvatar from '../../assets/octopus-avatar-new.svg';
import './Auth.css';

const Auth = () => {
  // 状态控制登录/注册切换
  const [isLogin, setIsLogin] = useState(true);

  // 表单状态
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    agreeTerms: false
  });

  // 租户选择相关状态
  const [tenantSelectionVisible, setTenantSelectionVisible] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState('personal');

  // 处理表单输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // 处理表单提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 特殊处理：账号1密码1显示租户选择
    if (formData.email === '1' && formData.password === '1') {
      setTenantSelectionVisible(true);
      return;
    }
    
    // 这里添加表单验证和提交逻辑
    console.log('表单提交', formData);
    alert('登录成功！');
  };

  // 处理租户确认
  const handleTenantConfirm = () => {
    setTenantSelectionVisible(false);
    
    if (selectedTenant === 'personal') {
      alert('登录成功！欢迎使用个人账号 👤');
      // 个人账号跳转到控制塔，但只显示用户中心
      window.location.href = '/controltower?mode=personal';
    } else {
      alert('登录成功！欢迎进入企业控制塔 🏢');
      // 企业账号跳转到完整的控制塔
      window.location.href = '/controltower';
    }
  };



  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* 返回首页按钮 */}
      <Link
        to="/"
        className="fixed top-4 left-4 flex items-center text-gray-600 hover:text-primary transition-colors duration-300 z-50"
      >
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>返回首页</span>
      </Link>

      {/* 确保背景装饰在底层 */}
      {/* 背景装饰 */}
      <div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden">
        <div className="aurora-wave aurora-wave-1"></div>
        <div className="aurora-wave aurora-wave-2"></div>
        <div className="aurora-wave aurora-wave-3"></div>

        {/* 添加弧形波浪 */}
        <div className="curved-line auth-curved-line"></div>

        <div className="light-shimmer"></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <Link to="/" className="inline-block">
            <div className="flex items-center justify-center mb-2">
              <img src={octopusAvatar} alt="AI沃宝" className="h-12 w-12" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              Wo <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">AI</span> ！
            </h2>
          </Link>
          <p className="mt-2 text-sm text-gray-600">
            AI驱动的国际物流智能平台
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white py-8 px-6 shadow-xl rounded-xl wave-bg relative z-20"
        >
          {/* 登录/注册切换标签 */}
          <div className="flex mb-6 bg-gray-100 p-1 rounded-lg shadow-sm relative z-20">
            <button
              type="button"
              className={`flex-1 py-3 text-sm font-medium rounded-md transition-all duration-300 cursor-pointer ${
                isLogin
                  ? 'bg-white text-primary shadow-md'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setIsLogin(true)}
            >
              登录
            </button>
            <button
              type="button"
              className={`flex-1 py-3 text-sm font-medium rounded-md transition-all duration-300 cursor-pointer ${
                !isLogin
                  ? 'bg-white text-primary shadow-md'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setIsLogin(false)}
            >
              注册
            </button>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            {isLogin ? '欢迎回来' : '创建新账户'}
          </h2>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* 邮箱输入 */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                邮箱
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary text-sm"
                placeholder="请输入您的邮箱"
              />
            </div>

            {/* 密码输入 */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                密码
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary text-sm"
                placeholder={isLogin ? "请输入密码" : "请设置密码（至少8位）"}
              />
            </div>

            {/* 注册时的额外字段 */}
            {!isLogin && (
              <>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    确认密码
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary text-sm"
                    placeholder="请再次输入密码"
                  />
                </div>

                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                    公司名称
                  </label>
                  <input
                    id="companyName"
                    name="companyName"
                    type="text"
                    autoComplete="organization"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary text-sm"
                    placeholder="请输入公司名称（选填）"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    id="agreeTerms"
                    name="agreeTerms"
                    type="checkbox"
                    required
                    checked={formData.agreeTerms}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="agreeTerms" className="ml-2 block text-sm text-gray-700">
                    我已阅读并同意 <Link to="/terms" className="text-primary hover:text-secondary">服务条款</Link> 和 <Link to="/privacy" className="text-primary hover:text-secondary">隐私政策</Link>
                  </label>
                </div>
              </>
            )}

            {/* 登录时的记住我和忘记密码 */}
            {isLogin && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    记住我
                  </label>
                </div>

                <div className="text-sm">
                  <Link to="#" className="font-medium text-primary hover:text-secondary">
                    忘记密码?
                  </Link>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300 cursor-pointer relative z-20"
              >
                {isLogin ? '登录' : '注册'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">或</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 relative z-20">
              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-300 cursor-pointer relative z-20"
              >
                <svg className="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
                <span>Facebook</span>
              </button>
              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-300 cursor-pointer relative z-20"
              >
                <svg className="w-5 h-5 mr-2" fill="#EA4335" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                </svg>
                <span>Google</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* 租户选择弹窗 */}
        {tenantSelectionVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full relative overflow-hidden"
            >
              {/* 装饰性头部 */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 pt-6 pb-4 relative">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12"></div>
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-3">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">选择租户</h3>
                  <p className="text-blue-100 text-sm">当前账号归属于多个租户，请选择您要登录的租户</p>
                </div>
              </div>
              
              {/* 表单内容 */}
              <div className="p-6">
                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-3">租户列表</label>
                  <select 
                    value={selectedTenant}
                    onChange={(e) => setSelectedTenant(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  >
                    <option value="personal">个人账号</option>
                    <option value="company1">上海物流科技有限公司</option>
                    <option value="company2">深圳国际货运代理有限公司</option>
                    <option value="company3">北京供应链管理有限公司</option>
                    <option value="company4">广州跨境电商物流有限公司</option>
                    <option value="company5">青岛港口物流有限公司</option>
                  </select>
                </div>
                
                <div className="flex gap-3">
                  <button 
                    onClick={() => setTenantSelectionVisible(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    取消
                  </button>
                  <button 
                    onClick={handleTenantConfirm}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-medium"
                  >
                    确认
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Auth;
