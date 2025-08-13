import React, { useState, useEffect } from 'react';
import { Tabs, Button } from '@arco-design/web-react';
import { IconClose, IconRefresh, IconCloseCircle } from '@arco-design/web-react/icon';
import { useNavigate, useLocation } from 'react-router-dom';
import './TabsComponent.css';

const { TabPane } = Tabs;

/**
 * 页签项接口定义
 */
interface TabItem {
  key: string;
  title: string;
  path: string;
  closable?: boolean;
}

/**
 * 页签组件属性接口
 */
interface TabsComponentProps {
  className?: string;
}

/**
 * 已打开页签组件
 * 用于显示和管理用户已打开的页面标签
 */
const TabsComponent: React.FC<TabsComponentProps> = ({ className }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [tabs, setTabs] = useState<TabItem[]>([]);
  const [activeTab, setActiveTab] = useState<string>('');
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [rightClickedTab, setRightClickedTab] = useState<string>('');

  /**
   * 根据路径获取页面标题
   * @param path 页面路径
   * @returns 页面标题
   */
  const getPageTitle = (path: string): string => {
    const pathTitleMap: Record<string, string> = {
      '/controltower': '仪表盘',
      '/controltower/ui-standards': '通用规范约定',
      '/controltower/control-tower-panel': '控制塔面板',
      '/controltower/control-tower-panel-temp': '控制塔面板-临时',
      '/controltower/application-center': '应用中心',
      '/controltower/saas/fcl-rates': '运价维护',
      '/controltower/saas/rate-query': '运价查询',
      '/controltower/saas/inquiry-management': '询价管理',
      '/controltower/saas/quote-management': '报价管理',
      '/controltower/order-management': '订单管理',
      '/controltower/bl-addition': 'BL补料',
      '/controltower/task-management': '任务管理',
      '/controltower/user-profile': '个人信息',
      '/controltower/company-profile': '企业信息',
    };

    // 处理动态路由
    if (path.includes('/controltower/order-detail/')) {
      return '订单详情';
    }
    if (path.includes('/controltower/saas/quote-form/')) {
      return '报价编辑';
    }
    if (path.includes('/controltower/bl-addition/')) {
      return 'BL补料';
    }

    return pathTitleMap[path] || '未知页面';
  };

  /**
   * 添加新页签
   * @param path 页面路径
   */
  const addTab = (path: string) => {
    const title = getPageTitle(path);
    const key = path;
    
    // 使用函数式更新来避免闭包问题
    setTabs(prevTabs => {
      // 检查页签是否已存在
      const existingTab = prevTabs.find(tab => tab.key === key);
      if (existingTab) {
        // 如果页签已存在，只更新激活状态
        setActiveTab(key);
        return prevTabs;
      }

      // 添加新页签
      const newTab: TabItem = {
        key,
        title,
        path,
        closable: path !== '/controltower' // 仪表盘页签不可关闭
      };

      setActiveTab(key);
      return [...prevTabs, newTab];
    });
  };

  /**
   * 关闭页签
   * @param targetKey 要关闭的页签key
   */
  const removeTab = (targetKey: string) => {
    const targetIndex = tabs.findIndex(tab => tab.key === targetKey);
    const newTabs = tabs.filter(tab => tab.key !== targetKey);
    
    if (newTabs.length && targetKey === activeTab) {
      // 如果关闭的是当前激活的页签，需要切换到其他页签
      const nextActiveKey = newTabs[targetIndex] || newTabs[targetIndex - 1];
      setActiveTab(nextActiveKey.key);
      navigate(nextActiveKey.path);
    }
    
    setTabs(newTabs);
  };

  /**
   * 刷新页签
   * @param targetKey 要刷新的页签key
   */
  const refreshTab = (targetKey: string) => {
    const tab = tabs.find(t => t.key === targetKey);
    if (tab) {
      // 如果不是当前激活的页签，先切换到该页签
      if (targetKey !== activeTab) {
        setActiveTab(targetKey);
        navigate(tab.path);
      }
      // 强制刷新页面
      window.location.reload();
    }
  };

  /**
   * 关闭其他页签
   * @param targetKey 保留的页签key
   */
  const closeOtherTabs = (targetKey: string) => {
    const targetTab = tabs.find(tab => tab.key === targetKey);
    if (!targetTab) return;
    
    // 保留目标页签和不可关闭的页签（仪表盘）
    const newTabs = tabs.filter(tab => 
      tab.key === targetKey || !tab.closable
    );
    
    setTabs(newTabs);
    
    // 如果当前激活的页签被关闭了，切换到目标页签
    if (!newTabs.find(tab => tab.key === activeTab)) {
      setActiveTab(targetKey);
      navigate(targetTab.path);
    }
  };

  /**
   * 关闭右边的页签
   * @param targetKey 起始页签key
   */
  const closeRightTabs = (targetKey: string) => {
    const targetIndex = tabs.findIndex(tab => tab.key === targetKey);
    if (targetIndex === -1) return;
    
    // 保留目标页签及其左边的页签，以及不可关闭的页签
    const newTabs = tabs.filter((tab, index) => 
      index <= targetIndex || !tab.closable
    );
    
    setTabs(newTabs);
    
    // 如果当前激活的页签被关闭了，切换到目标页签
    if (!newTabs.find(tab => tab.key === activeTab)) {
      const targetTab = tabs.find(tab => tab.key === targetKey);
      if (targetTab) {
        setActiveTab(targetKey);
        navigate(targetTab.path);
      }
    }
  };

  /**
   * 关闭全部页签
   */
  const closeAllTabs = () => {
    // 只保留不可关闭的页签（仪表盘）
    const newTabs = tabs.filter(tab => !tab.closable);
    setTabs(newTabs);
    
    // 切换到仪表盘
    const dashboardTab = newTabs.find(tab => tab.key === '/controltower');
    if (dashboardTab) {
      setActiveTab(dashboardTab.key);
      navigate(dashboardTab.path);
    }
  };

  /**
   * 处理页签右键点击
   * @param e 鼠标事件
   * @param tabKey 页签key
   */
  const handleTabRightClick = (e: React.MouseEvent, tabKey: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    setRightClickedTab(tabKey);
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setContextMenuVisible(true);
  };

  /**
   * 获取右键菜单项
   */
  const getContextMenuItems = () => {
    const tab = tabs.find(t => t.key === rightClickedTab);
    if (!tab) return [];
    
    const items = [
      {
        key: 'refresh',
        title: '刷新',
        icon: <IconRefresh />,
        onClick: () => {
          refreshTab(rightClickedTab);
          setContextMenuVisible(false);
        }
      }
    ];
    
    // 如果页签可关闭，添加关闭相关选项
    if (tab.closable) {
      items.push(
        {
          key: 'close',
          title: '关闭',
          icon: <IconClose />,
          onClick: () => {
            removeTab(rightClickedTab);
            setContextMenuVisible(false);
          }
        },
        {
          key: 'closeOthers',
          title: '关闭其他',
          icon: <IconCloseCircle />,
          onClick: () => {
            closeOtherTabs(rightClickedTab);
            setContextMenuVisible(false);
          }
        },
        {
          key: 'closeRight',
          title: '关闭右边',
          icon: <IconCloseCircle />,
          onClick: () => {
            closeRightTabs(rightClickedTab);
            setContextMenuVisible(false);
          }
        },
        {
          key: 'closeAll',
          title: '关闭全部',
          icon: <IconCloseCircle />,
          onClick: () => {
            closeAllTabs();
            setContextMenuVisible(false);
          }
        }
      );
    }
    
    return items;
  };

  /**
   * 处理点击其他地方关闭右键菜单
   */
  useEffect(() => {
    const handleClickOutside = () => {
      setContextMenuVisible(false);
    };
    
    if (contextMenuVisible) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [contextMenuVisible]);

  /**
   * 页签切换处理
   * @param key 页签key
   */
  const handleTabChange = (key: string) => {
    const tab = tabs.find(t => t.key === key);
    if (tab) {
      setActiveTab(key);
      navigate(tab.path);
    }
  };

  /**
   * 监听路由变化，自动添加页签
   */
  useEffect(() => {
    const currentPath = location.pathname;
    
    // 只处理controltower路由
    if (currentPath.startsWith('/controltower')) {
      addTab(currentPath);
    }
  }, [location.pathname]);

  /**
   * 初始化默认页签
   */
  useEffect(() => {
    if (tabs.length === 0 && location.pathname.startsWith('/controltower')) {
      // 如果当前就在controltower路由下，直接添加当前页面
      addTab(location.pathname);
    } else if (tabs.length === 0) {
      // 否则添加默认仪表盘页签
      addTab('/controltower');
    }
  }, [tabs.length, location.pathname]);

  // 如果没有页签，不渲染组件
  if (tabs.length === 0) {
    return null;
  }

  return (
    <>
      <div className={`tabs-component ${className || ''}`}>
        <Tabs
          activeTab={activeTab}
          onChange={handleTabChange}
          type="card-gutter"
          size="small"
          className="tabs-container"
        >
          {tabs.map(tab => (
            <TabPane
              key={tab.key}
              title={
                <div 
                  className="tab-title"
                  onContextMenu={(e) => handleTabRightClick(e, tab.key)}
                >
                  <span className="tab-text">{tab.title}</span>
                  {tab.closable && (
                    <Button
                      type="text"
                      size="mini"
                      icon={<IconClose />}
                      className="tab-close-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeTab(tab.key);
                      }}
                    />
                  )}
                </div>
              }
            />
          ))}
        </Tabs>
      </div>
      
      {/* 右键菜单 */}
      {contextMenuVisible && (
        <div
          className="tab-context-menu"
          style={{
            position: 'fixed',
            left: contextMenuPosition.x,
            top: contextMenuPosition.y,
            zIndex: 9999,
            background: '#ffffff',
            border: '1px solid #e5e6eb',
            borderRadius: '6px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            padding: '4px 0',
            minWidth: '120px'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {getContextMenuItems().map(item => (
            <div
              key={item.key}
              className="context-menu-item"
              onClick={item.onClick}
              style={{
                padding: '8px 12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                color: '#1d2129',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f7f8fa';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              {item.icon}
              <span>{item.title}</span>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default TabsComponent;