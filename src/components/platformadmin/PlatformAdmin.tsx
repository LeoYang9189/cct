import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './PlatformAdminStyles.css';
import PlatformAdminLayout from './layout/layout';
import PlatformAdminRoutes from './routes';

const PlatformAdmin: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 检查是否是登录页面
    if (location.pathname.includes('/login')) {
      setIsLoading(false);
      return;
    }

    // 检查登录状态
    const checkAuth = () => {
      try {
        const authData = localStorage.getItem('platformAdminAuth');
        if (authData) {
          const auth = JSON.parse(authData);
          const loginTime = new Date(auth.loginTime);
          const now = new Date();
          const timeDiff = now.getTime() - loginTime.getTime();
          const hoursDiff = timeDiff / (1000 * 3600);

          // 如果记住我，7天内有效；否则24小时内有效
          const maxHours = auth.rememberMe ? 24 * 7 : 24;
          
          if (hoursDiff < maxHours) {
            setIsAuthenticated(true);
          } else {
            // 登录过期，清除存储的认证信息
            localStorage.removeItem('platformAdminAuth');
            navigate('/platformadmin/login');
          }
        } else {
          // 未登录，跳转到登录页
          navigate('/platformadmin/login');
        }
      } catch (error) {
        console.error('认证检查失败:', error);
        navigate('/platformadmin/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [location.pathname, navigate]);

  // 显示加载状态
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-600">验证登录状态中...</p>
        </div>
      </div>
    );
  }

  // 如果是登录页面或已认证，显示相应内容
  if (location.pathname.includes('/login') || isAuthenticated) {
  return (
      <>
        {location.pathname.includes('/login') ? (
          <PlatformAdminRoutes />
        ) : (
    <PlatformAdminLayout>
      <PlatformAdminRoutes />
    </PlatformAdminLayout>
        )}
      </>
    );
  }

  // 其他情况显示加载状态
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
        <p className="text-gray-600">正在跳转到登录页...</p>
      </div>
    </div>
  );
};

export default PlatformAdmin; 