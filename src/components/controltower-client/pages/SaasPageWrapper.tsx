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
        padding: 24px !important;
        margin-top: 0 !important;
      }
      /* 确保包装器填充整个空间 */
      .saas-page-wrapper {
        width: 100%;
        height: 100%;
        overflow-y: auto;
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