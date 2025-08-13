import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Dropdown, Menu, Avatar } from '@arco-design/web-react';
import { IconMenu, IconClose, IconUser, IconSettings, IconPoweroff } from '@arco-design/web-react/icon';
import { useUser } from './UserContext';

const PortalHeader: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, isLoggedIn, logout } = useUser();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/portal');
  };

  const handleMenuClick = (key: string) => {
    switch (key) {
      case 'profile':
        // 跳转到客户版控制塔的个人信息页面
        navigate('/controltower-client#profile');
        break;
      case 'company':
        // 跳转到客户版控制塔的企业信息页面
        navigate('/controltower-client#company');
        break;
      case 'logout':
        handleLogout();
        break;
    }
  };

  // 用户下拉菜单
  const userDropdownMenu = (
    <Menu onClickMenuItem={handleMenuClick}>
      <Menu.Item key="profile">
        <IconUser className="mr-2" />
        个人中心
      </Menu.Item>
      <Menu.Item key="company">
        <IconSettings className="mr-2" />
        企业信息
      </Menu.Item>
      <Menu.Item key="divider" disabled style={{ height: '1px', padding: 0, margin: '4px 0', backgroundColor: '#f0f0f0' }} />
      <Menu.Item key="logout">
        <IconPoweroff className="mr-2" />
        退出登录
      </Menu.Item>
    </Menu>
  );

  const navItems = [
    { label: '首页', href: '/portal' },
    { label: '控制塔', href: '/controltower-client' },
    { label: '业务介绍', href: '/portal/business-services' },
    { label: '资讯中心', href: '/portal/news' },
    { label: '关于我们', href: '/portal/about-us' },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/portal" className="flex items-center">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white w-10 h-10 rounded-lg flex items-center justify-center mr-3 relative overflow-hidden shadow-lg">
              <span className="text-xl font-bold">Y</span>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-white rounded-tl-lg flex items-center justify-center">
                <span className="text-xs text-blue-600 font-bold">L</span>
              </div>
            </div>
            <div>
              <div className="text-lg font-bold text-gray-800 leading-tight tracking-wide">Your LOGO</div>
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item, index) => (
            <Link 
              key={index}
              to={item.href} 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User Section (Desktop) */}
        <div className="hidden md:block">
          {isLoggedIn && user ? (
            <Dropdown droplist={userDropdownMenu} trigger="click" position="bottom">
              <div className="flex items-center space-x-2 cursor-pointer px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                <Avatar size={32} style={{ backgroundColor: '#3B82F6' }}>
                  {user.username.charAt(0).toUpperCase()}
                </Avatar>
                <span className="text-gray-700 font-medium">{user.username}</span>
              </div>
            </Dropdown>
          ) : (
          <Button 
            type="primary" 
            className="bg-gradient-to-r from-blue-600 to-blue-400 border-0"
            onClick={() => navigate('/portal/auth')}
          >
            注册/登录
          </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-gray-700">
            {isMenuOpen ? <IconClose /> : <IconMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="block md:hidden bg-white border-t border-gray-100 py-4">
          <div className="container mx-auto px-4 flex flex-col space-y-3">
            {navItems.map((item, index) => (
              <Link 
                key={index}
                to={item.href} 
                className="text-gray-700 hover:text-blue-600 py-2 font-medium"
                onClick={toggleMenu}
              >
                {item.label}
              </Link>
            ))}
            
            {/* Mobile User Section */}
            {isLoggedIn && user ? (
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <div className="flex items-center space-x-3 py-2">
                  <Avatar size={32} style={{ backgroundColor: '#3B82F6' }}>
                    {user.username.charAt(0).toUpperCase()}
                  </Avatar>
                  <span className="text-gray-700 font-medium">{user.username}</span>
                </div>
                <button 
                  className="w-full text-left text-gray-700 hover:text-blue-600 py-2 font-medium flex items-center"
                  onClick={() => {
                    toggleMenu();
                    navigate('/controltower-client#profile');
                  }}
                >
                  <IconUser className="mr-2" />
                  个人中心
                </button>
                <button 
                  className="w-full text-left text-gray-700 hover:text-blue-600 py-2 font-medium flex items-center"
                  onClick={() => {
                    toggleMenu();
                    navigate('/controltower-client#company');
                  }}
                >
                  <IconSettings className="mr-2" />
                  企业信息
                </button>
                <button 
                  className="w-full text-left text-red-600 hover:text-red-700 py-2 font-medium flex items-center"
                  onClick={() => {
                    toggleMenu();
                    handleLogout();
                  }}
                >
                  <IconPoweroff className="mr-2" />
                  退出登录
                </button>
              </div>
            ) : (
            <Button 
              type="primary" 
              className="bg-gradient-to-r from-blue-600 to-blue-400 border-0 mt-2"
                onClick={() => {
                  toggleMenu();
                  navigate('/portal/auth');
                }}
            >
              注册/登录
            </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default PortalHeader; 