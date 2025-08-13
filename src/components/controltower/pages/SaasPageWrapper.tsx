import React, { useEffect } from 'react';

interface SaasPageWrapperProps {
  children: React.ReactNode;
}

const SaasPageWrapper: React.FC<SaasPageWrapperProps> = ({ children }) => {
  useEffect(() => {
    // 隐藏超级运价页面内部的SaasLayout侧边栏和顶栏
    const style = document.createElement('style');
    style.textContent = `
      /* 只隐藏包装器内的SaasLayout元素 */
      .saas-page-wrapper .arco-layout-sider {
        display: none !important;
      }
      .saas-page-wrapper .arco-layout-header {
        display: none !important;
      }
      /* 调整包装器内的内容区域布局 */
      .saas-page-wrapper .arco-layout .arco-layout {
        margin-left: 0 !important;
      }
      .saas-page-wrapper .arco-layout-content {
        margin-left: 0 !important;
        padding: 0 !important;
        margin-top: 0 !important;
        background: transparent !important;
        min-height: auto !important;
      }
      /* 移除多余的嵌套容器样式 */
      .saas-page-wrapper .arco-layout {
        background: transparent !important;
        height: auto !important;
      }
      /* 确保包装器不产生额外滚动 */
      .saas-page-wrapper {
        width: 100%;
        height: auto;
        overflow: visible;
        background: transparent;
      }
      /* 修复超级运价页面中Card组件的间距 */
      .saas-page-wrapper .arco-card + .arco-card {
        margin-top: 16px;
      }
      /* 确保第一层Card没有多余的margin */
      .saas-page-wrapper > div > .arco-card:first-child {
        margin-top: 0;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="saas-page-wrapper">
      {children}
    </div>
  );
};

export default SaasPageWrapper; 