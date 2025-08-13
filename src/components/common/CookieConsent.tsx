import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    // 检查本地存储中是否已经有Cookie同意记录
    const hasConsented = localStorage.getItem('cookieConsent');
    
    // 如果没有同意记录，显示同意条
    if (!hasConsented) {
      // 延迟1秒显示，避免页面加载时立即弹出
      const timer = setTimeout(() => {
        setShowConsent(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  // 处理接受Cookie
  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setShowConsent(false);
  };

  // 处理拒绝Cookie
  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'false');
    setShowConsent(false);
  };

  // 处理Cookie设置
  const handleSettings = () => {
    // 这里可以打开Cookie设置模态框
    // 暂时简单处理为接受
    handleAccept();
  };

  return (
    <AnimatePresence>
      {showConsent && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed bottom-0 left-0 right-0 bg-white shadow-lg z-50 border-t border-gray-200"
        >
          <div className="container-custom py-4 px-4 md:px-6">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-4 md:mb-0 md:mr-8 text-center md:text-left">
                <p className="text-gray-700 text-sm md:text-base">
                  我们使用Cookie来改善您的浏览体验，个性化内容和广告，提供社交媒体功能并分析我们的流量。
                  <Link to="/privacy" className="text-primary hover:text-secondary ml-1">
                    了解更多
                  </Link>
                </p>
              </div>
              <div className="flex flex-wrap justify-center md:justify-end gap-2">
                <button
                  onClick={handleDecline}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-300"
                >
                  拒绝
                </button>
                <button
                  onClick={handleSettings}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-300"
                >
                  Cookie设置
                </button>
                <button
                  onClick={handleAccept}
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 rounded-md transition-colors duration-300"
                >
                  接受全部
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
