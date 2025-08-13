import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Breadcrumb, Input } from '@arco-design/web-react';
import { IconSearch } from '@arco-design/web-react/icon';

interface ContainerHeaderProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  onThemeChange: (theme: string) => void;
  currentTheme: string;
}

const menuKeyToName: { [key: string]: string } = {
  dashboard: '控制台',
  'dynamic-query': '动态查询',
  'dynamic-maintenance': '动态维护',
  'container-management': '集装箱管理',
  'chassis-management': '车架管理',
  'trailer-management': '拖车管理',
  'repair-clean': '修洗箱管理',
  release: '放箱管理',
  order: '订单管理',
  cost: '费用管理',
  edi: 'EDI中心',
  customer: '客商中心',
  reporting: '报表中心',
  system: '系统设置',
};

const ContainerHeader: React.FC<ContainerHeaderProps> = () => {
  const location = useLocation();
  
  // 仅获取路径最后一段显示当前页面
  const currentPathKey = location.pathname.split('/').filter(Boolean).pop() || 'dashboard';
  const displayName = menuKeyToName[currentPathKey] || currentPathKey;

  return (
    <div className="flex items-center w-full">
      <div className="mr-4 flex-shrink-0">
        <Input.Search 
          allowClear 
          placeholder="搜索菜单" 
          style={{ width: 200 }} 
          prefix={<IconSearch />} 
        />
      </div>

      <div className="flex-grow">
        <Breadcrumb>
          <Breadcrumb.Item key="breadcrumb-home">
            <Link to="/smartainer/dashboard">首页</Link>
          </Breadcrumb.Item>
          {currentPathKey !== 'dashboard' && (
            <Breadcrumb.Item key="current-page">{displayName}</Breadcrumb.Item>
          )}
        </Breadcrumb>
      </div>
    </div>
  );
};

export default ContainerHeader;