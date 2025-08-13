import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import octopusAvatar from '../../assets/octopus-avatar-new.svg';

const CookieSettings = () => {
  // Cookie类别及其状态
  const [cookieSettings, setCookieSettings] = useState({
    necessary: true, // 必要的Cookie，不可禁用
    functional: true,
    analytics: true,
    marketing: false,
  });

  // 从本地存储加载设置
  useEffect(() => {
    const savedSettings = localStorage.getItem('cookieSettingsDetailed');
    if (savedSettings) {
      setCookieSettings(JSON.parse(savedSettings));
    }
  }, []);

  // 处理单个设置变更
  const handleSettingChange = (setting: keyof typeof cookieSettings) => {
    if (setting === 'necessary') return; // 必要的Cookie不可更改
    
    setCookieSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  // 保存所有设置
  const handleSaveSettings = () => {
    localStorage.setItem('cookieSettingsDetailed', JSON.stringify(cookieSettings));
    localStorage.setItem('cookieConsent', 'true');
    // 可以添加一个成功提示
    alert('您的Cookie设置已保存');
  };

  // 接受所有Cookie
  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    };
    setCookieSettings(allAccepted);
    localStorage.setItem('cookieSettingsDetailed', JSON.stringify(allAccepted));
    localStorage.setItem('cookieConsent', 'true');
    alert('您已接受所有Cookie');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative">
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
      
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <Link to="/" className="inline-block">
            <div className="flex items-center justify-center mb-2">
              <img src={octopusAvatar} alt="AI沃宝" className="h-12 w-12" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              Wo <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">AI</span> ！
            </h2>
          </Link>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white py-8 px-6 shadow-xl rounded-xl"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Cookie 设置</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-8">
              您可以选择启用或禁用不同类别的Cookie。请注意，禁用某些Cookie可能会影响您的浏览体验和网站功能。
            </p>
            
            <div className="space-y-6">
              {/* 必要的Cookie */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">必要的Cookie</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      这些Cookie对于网站的正常运行是必不可少的，不能被禁用。
                    </p>
                  </div>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={cookieSettings.necessary}
                      disabled
                      className="sr-only"
                      id="necessary-cookies"
                    />
                    <label
                      htmlFor="necessary-cookies"
                      className="flex items-center cursor-not-allowed"
                    >
                      <div className="relative w-10 h-5 bg-primary rounded-full shadow-inner"></div>
                      <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition"></div>
                    </label>
                  </div>
                </div>
              </div>
              
              {/* 功能性Cookie */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">功能性Cookie</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      这些Cookie使我们能够提供增强的功能和个性化设置。
                    </p>
                  </div>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={cookieSettings.functional}
                      onChange={() => handleSettingChange('functional')}
                      className="sr-only"
                      id="functional-cookies"
                    />
                    <label
                      htmlFor="functional-cookies"
                      className="flex items-center cursor-pointer"
                    >
                      <div className={`relative w-10 h-5 ${cookieSettings.functional ? 'bg-primary' : 'bg-gray-300'} rounded-full shadow-inner transition-colors duration-300`}></div>
                      <div className={`absolute ${cookieSettings.functional ? 'left-6' : 'left-1'} top-1 w-3 h-3 bg-white rounded-full transition-all duration-300`}></div>
                    </label>
                  </div>
                </div>
              </div>
              
              {/* 分析Cookie */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">分析Cookie</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      这些Cookie帮助我们了解访问者如何使用网站，以便我们可以改进我们的服务。
                    </p>
                  </div>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={cookieSettings.analytics}
                      onChange={() => handleSettingChange('analytics')}
                      className="sr-only"
                      id="analytics-cookies"
                    />
                    <label
                      htmlFor="analytics-cookies"
                      className="flex items-center cursor-pointer"
                    >
                      <div className={`relative w-10 h-5 ${cookieSettings.analytics ? 'bg-primary' : 'bg-gray-300'} rounded-full shadow-inner transition-colors duration-300`}></div>
                      <div className={`absolute ${cookieSettings.analytics ? 'left-6' : 'left-1'} top-1 w-3 h-3 bg-white rounded-full transition-all duration-300`}></div>
                    </label>
                  </div>
                </div>
              </div>
              
              {/* 营销Cookie */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">营销Cookie</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      这些Cookie用于跟踪访问者在网站上的活动，以便向他们展示相关广告。
                    </p>
                  </div>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={cookieSettings.marketing}
                      onChange={() => handleSettingChange('marketing')}
                      className="sr-only"
                      id="marketing-cookies"
                    />
                    <label
                      htmlFor="marketing-cookies"
                      className="flex items-center cursor-pointer"
                    >
                      <div className={`relative w-10 h-5 ${cookieSettings.marketing ? 'bg-primary' : 'bg-gray-300'} rounded-full shadow-inner transition-colors duration-300`}></div>
                      <div className={`absolute ${cookieSettings.marketing ? 'left-6' : 'left-1'} top-1 w-3 h-3 bg-white rounded-full transition-all duration-300`}></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={handleSaveSettings}
                className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors duration-300"
              >
                保存设置
              </button>
              <button
                onClick={handleAcceptAll}
                className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-md hover:from-primary/90 hover:to-secondary/90 transition-colors duration-300"
              >
                接受全部
              </button>
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                有关我们如何使用Cookie的更多信息，请查看我们的
                <Link to="/privacy" className="text-primary hover:text-secondary ml-1">
                  隐私政策
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CookieSettings;
