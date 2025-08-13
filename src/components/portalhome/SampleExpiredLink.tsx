import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconArrowLeft } from '@arco-design/web-react/icon';
import './PortalStyles.css';

const SampleExpiredLink: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  // 返回Portal首页
  const handleBackToPortal = () => {
    navigate('/portal');
  };

  return (
    <div className="min-h-screen relative overflow-hidden auth-container">
      {/* 动态背景 */}
      <div className="fixed inset-0 auth-background">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 via-red-400/20 to-red-300/20"></div>
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
          className="group flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-red-800/30 text-red-800 hover:bg-white/20 hover:border-red-800/50 transition-all duration-300 hover:scale-105"
        >
          <IconArrowLeft className="text-lg group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="font-medium">返回首页</span>
        </button>
      </div>

      {/* 主内容区域 */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className={`w-full max-w-2xl transition-all duration-1000 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          
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
            <h1 className="text-3xl font-black text-red-900 mb-3 tracking-tight">
              <span className="bg-gradient-to-r from-red-900 via-red-800 to-red-700 bg-clip-text text-transparent">
                控制塔系统
              </span>
            </h1>
            <p className="text-red-800 text-lg font-medium">
              邀请链接状态
            </p>
          </div>

          {/* 主卡片 */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-red-200/50 p-8">
            {/* 错误图标和信息 */}
            <div className="text-center">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
                  <span className="text-4xl">⚠️</span>
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-red-800 mb-4">邀请链接已过期</h2>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                <p className="text-red-700 text-lg leading-relaxed">
                  您的邀请链接已过期或无效，请联系管理员重试。
                </p>
              </div>
              
              {/* 提示信息 */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                <h3 className="text-gray-800 font-semibold mb-2">可能的原因：</h3>
                <ul className="text-gray-600 text-sm space-y-1 text-left">
                  <li>• 邀请链接已超过有效期</li>
                  <li>• 邀请链接格式不正确</li>
                  <li>• 邀请已被撤销或取消</li>
                  <li>• 该邮箱已完成注册</li>
                </ul>
              </div>
              
              {/* 操作按钮 */}
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={handleBackToPortal}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                >
                  返回首页
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SampleExpiredLink;
