import React, { useEffect, useRef } from 'react';
import { createApp } from 'vue';
import Portal from './vue3/Portal.vue';

interface VuePortalBridgeProps {
  className?: string;
}

const VuePortalBridge: React.FC<VuePortalBridgeProps> = ({ className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const vueAppRef = useRef<any>(null);

  useEffect(() => {
    if (containerRef.current && !vueAppRef.current) {
      // 创建Vue3应用实例
      vueAppRef.current = createApp(Portal);
      
      // 挂载Vue应用到容器
      vueAppRef.current.mount(containerRef.current);
    }

    // 清理函数：卸载Vue应用
    return () => {
      if (vueAppRef.current) {
        vueAppRef.current.unmount();
        vueAppRef.current = null;
      }
    };
  }, []);

  return <div ref={containerRef} className={className} />;
};

export default VuePortalBridge; 