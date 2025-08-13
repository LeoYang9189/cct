import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Message } from '@arco-design/web-react';
import octopusAvatar from '../../../assets/octopus-avatar-new.svg';
import './AdminLogin.css';

const AdminLogin = () => {
  const navigate = useNavigate();
  
  // 表单状态
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false
  });

  const [isLoading, setIsLoading] = useState(false);

  // 处理表单输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 验证账号密码
      if (formData.username === '1' && formData.password === '1') {
        // 模拟登录延迟
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 保存登录状态
        localStorage.setItem('platformAdminAuth', JSON.stringify({
          username: formData.username,
          loginTime: new Date().toISOString(),
          rememberMe: formData.rememberMe
        }));

        Message.success('登录成功！正在跳转...');
        
        // 延迟跳转到平台运营端首页
        setTimeout(() => {
          navigate('/platformadmin/dashboard');
        }, 1000);
      } else {
        Message.error('账号或密码错误，请检查后重试');
      }
    } catch (error) {
      Message.error('登录失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* 返回首页按钮 */}
      <Link
        to="/"
        className="fixed top-4 left-4 flex items-center text-gray-600 hover:text-amber-600 transition-colors duration-300 z-50"
      >
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>返回首页</span>
      </Link>

      {/* 背景装饰 */}
      <div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden">
        {/* 琥珀色渐变背景 */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50"></div>
        
        {/* 动态波浪效果 */}
        <div className="absolute top-0 left-0 right-0 bottom-0">
          <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-r from-amber-200/20 via-orange-200/20 to-yellow-200/20 rounded-full animate-spin-slow"></div>
          <div className="absolute bottom-[-50%] right-[-50%] w-[200%] h-[200%] bg-gradient-to-l from-amber-300/15 via-orange-300/15 to-yellow-300/15 rounded-full animate-spin-reverse"></div>
        </div>

        {/* 弧形装饰线 */}
        <div className="absolute top-10 left-10 w-32 h-32 border border-amber-300/30 rounded-full"></div>
        <div className="absolute top-20 right-20 w-24 h-24 border border-orange-300/30 rounded-full"></div>
        <div className="absolute bottom-20 left-20 w-20 h-20 border border-yellow-300/30 rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-28 h-28 border border-amber-400/20 rounded-full"></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <Link to="/" className="inline-block">
            <div className="flex items-center justify-center mb-4">
              <div className="relative">
                <img src={octopusAvatar} alt="AI沃宝" className="h-16 w-16" />
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">平台运营端</span>
            </h2>
          </Link>
          <p className="mt-2 text-sm text-gray-600">
            系统管理后台 - 管理员登录
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white py-8 px-6 shadow-xl rounded-xl relative"
        >
          {/* 装饰性渐变边框 */}
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 rounded-xl opacity-20 blur-sm"></div>
          <div className="relative bg-white rounded-xl p-6 -m-6">
            
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">管理员登录</h3>
              <p className="text-sm text-gray-500">请输入您的管理员凭据</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* 用户名输入 */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  管理员账号
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    required
                    value={formData.username}
                    onChange={handleInputChange}
                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm transition-all duration-200"
                    placeholder="请输入管理员账号"
                  />
                </div>
              </div>

              {/* 密码输入 */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  密码
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm transition-all duration-200"
                    placeholder="请输入密码"
                  />
                </div>
              </div>

              {/* 记住我 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                  />
                  <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                    记住登录状态
                  </label>
                </div>
              </div>

              {/* 登录按钮 */}
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      登录中...
                    </>
                  ) : (
                    '登录'
                  )}
                </button>
              </div>
            </form>

            {/* 提示信息 */}
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-amber-800">
                    测试账号
                  </h3>
                  <div className="mt-2 text-sm text-amber-700">
                    <p>账号：<code className="bg-amber-100 px-1 rounded">1</code></p>
                    <p>密码：<code className="bg-amber-100 px-1 rounded">1</code></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>


    </div>
  );
};

export default AdminLogin; 