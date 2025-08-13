import React from 'react';

interface ControlTowerSaasLayoutProps {
  children: React.ReactNode;
  menuSelectedKey?: string;
  breadcrumb?: React.ReactNode;
}

/**
 * 控制塔SAAS系统布局组件
 * 这个组件只渲染内容区域，不包含侧边栏和头部
 * 因为它们已经在控制塔主布局中了
 */
const ControlTowerSaasLayout: React.FC<ControlTowerSaasLayoutProps> = ({ 
  children 
  // menuSelectedKey 和 breadcrumb 参数保留用于兼容性，但不在此处使用
}) => {
  return (
    <div>
      {/* 如果提供了面包屑，渲染面包屑 - 但现在由控制塔布局处理，所以注释掉 */}
      {/* 
      {breadcrumb && (
        <div className="mb-4">
          {breadcrumb}
        </div>
      )}
      */}
      
      {/* 页面内容 */}
      <div>
        {children}
      </div>
    </div>
  );
};

export default ControlTowerSaasLayout; 
 
 
 
 