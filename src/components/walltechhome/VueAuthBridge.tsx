import React, { useEffect, useRef } from 'react';
import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';

// 导入Vue3登录组件
import SSOAuthPage from './vue3/SSOAuthPage.vue';
import AuthPageWrapper from './vue3/AuthPageWrapper.vue';

interface VueAuthBridgeProps {
  className?: string;
  authType?: 'sso' | 'auth';
  provider?: string;
}

const VueAuthBridge: React.FC<VueAuthBridgeProps> = ({ 
  className, 
  authType = 'sso',
  provider = 'etower'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const vueAppRef = useRef<any>(null);

  useEffect(() => {
    if (containerRef.current && !vueAppRef.current) {
      // 根据authType选择对应的组件
      let component;
      let initialRoute = '/';
      
      switch (authType) {
        case 'sso':
          component = SSOAuthPage;
          initialRoute = `/sso/auth/${provider}`;
          break;
        case 'auth':
          component = AuthPageWrapper;
          initialRoute = '/auth';
          break;
        default:
          component = SSOAuthPage;
      }

      // 创建Vue Router
      const router = createRouter({
        history: createWebHistory(),
        routes: [
          {
            path: '/',
            redirect: initialRoute
          },
          {
            path: '/sso/auth/:provider',
            component: SSOAuthPage
          },
          {
            path: '/auth',
            component: AuthPageWrapper
          }
        ]
      });

      // 创建Vue3应用实例
      vueAppRef.current = createApp(component);
      
      // 使用路由
      vueAppRef.current.use(router);
      
      // 挂载Vue应用到容器
      vueAppRef.current.mount(containerRef.current);

      // 导航到初始路由
      router.push(initialRoute);
    }

    // 清理函数：卸载Vue应用
    return () => {
      if (vueAppRef.current) {
        vueAppRef.current.unmount();
        vueAppRef.current = null;
      }
    };
  }, [authType, provider]);

  return <div ref={containerRef} className={className} />;
};

export default VueAuthBridge; 