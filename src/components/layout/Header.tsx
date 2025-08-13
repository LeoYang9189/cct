import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiX, FiChevronDown } from 'react-icons/fi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBrain,
  faFileAlt,
  faCoins,
  faChartLine,
  faShip,
  faTruck,
  faBoxes,
  faCode,
  faLaptopCode,
  faTools,
  faUserTie,
  faBuilding,
  faHandshake
} from '@fortawesome/free-solid-svg-icons';

interface NavItem {
  label: string;
  href: string;
  dropdown?: boolean;
  subItems?: SubItem[];
}

interface SubItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  description?: string;
  subItems?: {
    label: string;
    href: string;
    isNew?: boolean;
    icon?: React.ReactNode;
  }[];
}

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeSubMenu, setActiveSubMenu] = useState<number>(0);

  const navItems: NavItem[] = [
    {
      label: '产品功能',
      href: '#',
      dropdown: true,
      subItems: [
        {
          label: 'AI创新场',
          href: '#ai-innovation',
          icon: <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-500 flex items-center justify-center"><FontAwesomeIcon icon={faBrain} size="lg" /></div>,
          description: '人工智能驱动的创新解决方案',
          subItems: [
            {
              label: 'AI沃宝',
              href: '#ai-wobo',
              icon: <FontAwesomeIcon icon={faBrain} className="mr-2 text-blue-500 w-4 h-4" />
            },
            {
              label: '文件识别',
              href: '#file-recognition',
              icon: <FontAwesomeIcon icon={faFileAlt} className="mr-2 text-blue-500 w-4 h-4" />
            },
            {
              label: '超级运价',
              href: '/super-freight',
              icon: <FontAwesomeIcon icon={faCoins} className="mr-2 text-blue-500 w-4 h-4" />
            },
            {
              label: '智能BI',
              href: '#intelligent-bi',
              isNew: true,
              icon: <FontAwesomeIcon icon={faChartLine} className="mr-2 text-blue-500 w-4 h-4" />
            },
            {
              label: '智慧集装箱',
              href: '/smartainer',
              isNew: true,
              icon: <FontAwesomeIcon icon={faBoxes} className="mr-2 text-green-500 w-4 h-4" />
            },
          ]
        },
        {
          label: '海关专区',
          href: '#customs',
          icon: <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-500 flex items-center justify-center"><FontAwesomeIcon icon={faShip} size="lg" /></div>,
          description: '海关业务专业解决方案',
          subItems: []
        },
        {
          label: '智慧物流系统',
          href: '#logistics',
          icon: <div className="w-10 h-10 rounded-lg bg-green-100 text-green-500 flex items-center justify-center"><FontAwesomeIcon icon={faTruck} size="lg" /></div>,
          description: '智能高效的物流管理系统',
          subItems: []
        },
        {
          label: '经纪代理',
          href: '#broker',
          icon: <div className="w-10 h-10 rounded-lg bg-yellow-100 text-yellow-500 flex items-center justify-center"><FontAwesomeIcon icon={faHandshake} size="lg" /></div>,
          description: '专业的经纪代理服务',
          subItems: []
        },
        {
          label: '订舱门户',
          href: '#booking-portal',
          icon: <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-500 flex items-center justify-center"><FontAwesomeIcon icon={faShip} size="lg" /></div>,
          description: '高效便捷的订舱服务平台',
          subItems: []
        },
        {
          label: '工具箱',
          href: '#tools',
          icon: <div className="w-10 h-10 rounded-lg bg-red-100 text-red-500 flex items-center justify-center"><FontAwesomeIcon icon={faTools} size="lg" /></div>,
          description: '多样化的实用工具集合',
          subItems: []
        }
      ]
    },
    {
      label: '合作与支持',
      href: '#',
      dropdown: true,
      subItems: [
        {
          label: '解决方案',
          href: '#solutions',
          icon: <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-500 flex items-center justify-center"><FontAwesomeIcon icon={faLaptopCode} size="lg" /></div>,
          description: '行业定制解决方案',
          subItems: [
            {
              label: '示例菜单',
              href: '#sample1',
              icon: <FontAwesomeIcon icon={faUserTie} className="mr-2 text-blue-500 w-4 h-4" />
            },
            {
              label: '示例菜单',
              href: '#sample2',
              icon: <FontAwesomeIcon icon={faBuilding} className="mr-2 text-blue-500 w-4 h-4" />
            },
          ]
        }
      ]
    },
    { label: '关于我们', href: '#' },
    { label: 'API接口', href: '#' },
    { label: '平台运营后台', href: '/platformadmin' }
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMouseEnter = (label: string) => {
    setActiveDropdown(label);
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };

  const handleSubMenuHover = (index: number) => {
    setActiveSubMenu(index);
  };

  const handleMobileDropdownToggle = (e: React.MouseEvent, label: string) => {
    e.preventDefault();
    if (activeDropdown === label) {
      handleMouseLeave();
    } else {
      handleMouseEnter(label);
    }
  };

  const logoStyle = {
    fontFamily: "'Montserrat', 'Segoe UI', sans-serif",
    fontWeight: "800",
    letterSpacing: "1px",
    background: "linear-gradient(45deg, #FF6B6B, #7466F0, #19D3AE)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    animation: "bounce 2s infinite",
    display: "inline-block",
    textShadow: "0 0 5px rgba(255,255,255,0.3)"
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
        `
      }} />
      <div className="container-custom py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center cursor-pointer">
          <span className="text-2xl font-bold" style={logoStyle}>Wo AI ！</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item, index) => (
            <div
              key={index}
              className="relative"
              onMouseEnter={item.dropdown ? () => handleMouseEnter(item.label) : undefined}
              onMouseLeave={handleMouseLeave}
            >
              <a
                href={item.href}
                className="text-gray-700 hover:text-primary flex items-center py-2"
              >
                {item.label}
                {item.dropdown && (
                  <FiChevronDown className="ml-1 h-4 w-4" />
                )}
              </a>

              {/* 下拉菜单 - 左右布局 */}
              {item.dropdown && item.subItems && activeDropdown === item.label && (
                <div className="absolute left-0 mt-[1px] w-[900px] bg-white rounded-lg shadow-xl z-50 flex border border-gray-200">
                  {/* 左侧一级菜单列表 */}
                  <div className="w-1/4 border-r border-gray-100 bg-gray-50">
                    {item.subItems.map((subItem, subIndex) => (
                      <div
                        key={subIndex}
                        className={`p-6 cursor-pointer transition-colors flex items-center ${activeSubMenu === subIndex ? 'bg-white' : 'hover:bg-white'}`}
                        onMouseEnter={() => handleSubMenuHover(subIndex)}
                      >
                        {subItem.icon}
                        <span className="ml-4 font-medium text-gray-700">{subItem.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* 右侧二级菜单内容 */}
                  <div className="w-3/4 p-10">
                    {item.subItems[activeSubMenu] && (
                      <>
                        <h3 className="text-xl font-medium text-gray-800 mb-4">{item.subItems[activeSubMenu].label}</h3>
                        <p className="text-sm text-gray-500 mb-8">{item.subItems[activeSubMenu].description}</p>

                        {/* 特殊处理海关专区菜单，添加分类标签 */}
                        {item.subItems[activeSubMenu].label === '海关专区' ? (
                          <div className="space-y-6">
                            {/* 美国业务分类 */}
                            <div>
                              <div className="mb-4">
                                <span className="font-bold text-gray-800 text-base pb-1 inline-block border-b-2 border-gradient-to-r from-blue-500 to-purple-500" style={{borderImage: 'linear-gradient(to right, #3b82f6, #8b5cf6) 1'}}>美加专区</span>
                              </div>
                              <div className="grid grid-cols-3 gap-4 pl-6">
                                <a href="#ams-filing" className="flex items-center py-2 text-sm text-gray-600 hover:text-primary">
                                  <FontAwesomeIcon icon={faShip} className="mr-2 text-blue-500 w-4 h-4" />
                                  <span>AMS申报</span>
                                </a>
                                <a href="#isf-filing" className="flex items-center py-2 text-sm text-gray-600 hover:text-primary">
                                  <FontAwesomeIcon icon={faFileAlt} className="mr-2 text-yellow-500 w-4 h-4" />
                                  <span>ISF申报</span>
                                </a>
                                <a href="#aci-filing" className="flex items-center py-2 text-sm text-gray-600 hover:text-primary">
                                  <FontAwesomeIcon icon={faFileAlt} className="mr-2 text-red-500 w-4 h-4" />
                                  <span>ACI申报</span>
                                </a>
                                <a href="#us-manifest" className="flex items-center py-2 text-sm text-gray-600 hover:text-primary">
                                  <FontAwesomeIcon icon={faFileAlt} className="mr-2 text-blue-500 w-4 h-4" />
                                  <span>美国换单</span>
                                </a>
                                <a href="#us-customs" className="flex items-center py-2 text-sm text-gray-600 hover:text-primary">
                                  <FontAwesomeIcon icon={faShip} className="mr-2 text-green-500 w-4 h-4" />
                                  <span>美国清关</span>
                                </a>
                              </div>
                            </div>

                            {/* 欧盟业务分类 */}
                            <div>
                              <div className="mb-4">
                                <span className="font-bold text-gray-800 text-base pb-1 inline-block border-b-2 border-gradient-to-r from-blue-500 to-purple-500" style={{borderImage: 'linear-gradient(to right, #3b82f6, #8b5cf6) 1'}}>欧盟业务</span>
                              </div>
                              <div className="grid grid-cols-3 gap-4 pl-6">
                                <a href="#ics2-filing" className="flex items-center py-2 text-sm text-gray-600 hover:text-primary">
                                  <FontAwesomeIcon icon={faFileAlt} className="mr-2 text-blue-500 w-4 h-4" />
                                  <span>ICS2申报</span>
                                </a>
                              </div>
                            </div>

                            {/* 中国业务分类 */}
                            <div>
                              <div className="mb-4">
                                <span className="font-bold text-gray-800 text-base pb-1 inline-block border-b-2 border-gradient-to-r from-blue-500 to-purple-500" style={{borderImage: 'linear-gradient(to right, #3b82f6, #8b5cf6) 1'}}>中国业务</span>
                              </div>
                              <div className="grid grid-cols-3 gap-4 pl-6">
                                <a href="#shanghai-manifest" className="flex items-center py-2 text-sm text-gray-600 hover:text-primary">
                                  <FontAwesomeIcon icon={faShip} className="mr-2 text-blue-500 w-4 h-4" />
                                  <span>上海预配舱单</span>
                                </a>
                                <a href="#qingdao-manifest" className="flex items-center py-2 text-sm text-gray-600 hover:text-primary">
                                  <FontAwesomeIcon icon={faShip} className="mr-2 text-blue-500 w-4 h-4" />
                                  <span>青岛预配舱单</span>
                                </a>
                                <a href="#south-china-manifest" className="flex items-center py-2 text-sm text-gray-600 hover:text-primary">
                                  <FontAwesomeIcon icon={faShip} className="mr-2 text-blue-500 w-4 h-4" />
                                  <span>华南预配舱单</span>
                                </a>
                                <a href="#vgm-filing" className="flex items-center py-2 text-sm text-gray-600 hover:text-primary">
                                  <FontAwesomeIcon icon={faFileAlt} className="mr-2 text-yellow-500 w-4 h-4" />
                                  <span>VGM申报</span>
                                </a>
                                <a href="#shanghai-import" className="flex items-center py-2 text-sm text-gray-600 hover:text-primary">
                                  <FontAwesomeIcon icon={faFileAlt} className="mr-2 text-orange-500 w-4 h-4" />
                                  <span>上海进口换单</span>
                                </a>
                              </div>
                            </div>

                            {/* 其他分类 */}
                            <div>
                              <div className="mb-4">
                                <span className="font-bold text-gray-800 text-base pb-1 inline-block border-b-2 border-gradient-to-r from-blue-500 to-purple-500" style={{borderImage: 'linear-gradient(to right, #3b82f6, #8b5cf6) 1'}}>其他</span>
                              </div>
                              <div className="grid grid-cols-3 gap-4 pl-6">
                                <a href="#afr-filing" className="flex items-center py-2 text-sm text-gray-600 hover:text-primary">
                                  <FontAwesomeIcon icon={faFileAlt} className="mr-2 text-teal-500 w-4 h-4" />
                                  <span>AFR申报</span>
                                </a>
                                <a href="#mexico-filing" className="flex items-center py-2 text-sm text-gray-600 hover:text-primary">
                                  <FontAwesomeIcon icon={faFileAlt} className="mr-2 text-green-500 w-4 h-4" />
                                  <span>墨西哥反恐申报</span>
                                </a>
                              </div>
                            </div>
                          </div>
                        ) : item.subItems[activeSubMenu].label === '智慧物流系统' ? (
                          <div className="space-y-6">
                            {/* 定制门户分类 */}
                            <div>
                              <div className="mb-4">
                                <span className="font-bold text-gray-800 text-base pb-1 inline-block border-b-2 border-gradient-to-r from-blue-500 to-purple-500" style={{borderImage: 'linear-gradient(to right, #3b82f6, #8b5cf6) 1'}}>定制门户</span>
                              </div>
                              <div className="grid grid-cols-3 gap-4 pl-6">
                                <Link to="/portal" className="flex items-center py-2 text-sm text-gray-600 hover:text-primary">
                                  <FontAwesomeIcon icon={faLaptopCode} className="mr-2 text-blue-500 w-4 h-4" />
                                  <span>Web门户</span>
                                </Link>
                                <a href="#mini-program" className="flex items-center py-2 text-sm text-gray-600 hover:text-primary">
                                  <FontAwesomeIcon icon={faTools} className="mr-2 text-green-500 w-4 h-4" />
                                  <span>小程序</span>
                                </a>
                                <a href="#b2b-platform" className="flex items-center py-2 text-sm text-gray-600 hover:text-primary">
                                  <FontAwesomeIcon icon={faHandshake} className="mr-2 text-indigo-500 w-4 h-4" />
                                  <span>B2B平台</span>
                                </a>
                              </div>
                            </div>

                            {/* 协作云平台分类 */}
                            <div>
                              <div className="mb-4">
                                <span className="font-bold text-gray-800 text-base pb-1 inline-block border-b-2 border-gradient-to-r from-blue-500 to-purple-500" style={{borderImage: 'linear-gradient(to right, #3b82f6, #8b5cf6) 1'}}>协作云平台</span>
                              </div>
                              <div className="grid grid-cols-3 gap-4 pl-6">
                                <a href="/controltower" className="flex items-center py-2 text-sm text-gray-600 hover:text-primary">
                                  <FontAwesomeIcon icon={faBoxes} className="mr-2 text-purple-500 w-4 h-4" />
                                  <span>控制塔协作系统</span>
                                </a>
                                <a href="#cargo-ware" className="flex items-center py-2 text-sm text-gray-600 hover:text-primary">
                                  <FontAwesomeIcon icon={faTruck} className="mr-2 text-orange-500 w-4 h-4" />
                                  <span>CargoWare</span>
                                </a>
                              </div>
                            </div>
                          </div>
                        ) : item.subItems[activeSubMenu].label === '经纪代理' ? (
                          <div className="space-y-6">
                            {/* 美国业务分类 */}
                            <div>
                              <div className="mb-4">
                                <span className="font-bold text-gray-800 text-base pb-1 inline-block border-b-2 border-gradient-to-r from-blue-500 to-purple-500" style={{borderImage: 'linear-gradient(to right, #3b82f6, #8b5cf6) 1'}}>美国业务</span>
                              </div>
                              <div className="grid grid-cols-3 gap-4 pl-6">
                                <a href="#us-company-register" className="flex items-center py-2 text-sm text-gray-600 hover:text-primary">
                                  <FontAwesomeIcon icon={faBuilding} className="mr-2 text-blue-500 w-4 h-4" />
                                  <span>美国公司注册</span>
                                </a>
                                <a href="#us-ein-apply" className="flex items-center py-2 text-sm text-gray-600 hover:text-primary">
                                  <FontAwesomeIcon icon={faFileAlt} className="mr-2 text-blue-500 w-4 h-4" />
                                  <span>美国公司EIN申请</span>
                                </a>
                                <Link to="/fmc-qualification" className="flex items-center py-2 text-sm text-gray-600 hover:text-primary">
                                  <FontAwesomeIcon icon={faHandshake} className="mr-2 text-yellow-500 w-4 h-4" />
                                  <span>美国海关Bond</span>
                                </Link>
                                <Link to="/fmc-qualification" className="flex items-center py-2 text-sm text-gray-600 hover:text-primary">
                                  <FontAwesomeIcon icon={faFileAlt} className="mr-2 text-yellow-500 w-4 h-4" />
                                  <span>美国FMC申请</span>
                                </Link>
                                <a href="#canada-customs-bond" className="flex items-center py-2 text-sm text-gray-600 hover:text-primary">
                                  <FontAwesomeIcon icon={faHandshake} className="mr-2 text-yellow-500 w-4 h-4" />
                                  <span>加拿大海关Bond</span>
                                </a>
                              </div>
                            </div>

                            {/* 欧盟业务分类 */}
                            <div>
                              <div className="mb-4">
                                <span className="font-bold text-gray-800 text-base pb-1 inline-block border-b-2 border-gradient-to-r from-blue-500 to-purple-500" style={{borderImage: 'linear-gradient(to right, #3b82f6, #8b5cf6) 1'}}>欧盟业务</span>
                              </div>
                              <div className="grid grid-cols-3 gap-4 pl-6">
                                <a href="#eori-apply" className="flex items-center py-2 text-sm text-gray-600 hover:text-primary">
                                  <FontAwesomeIcon icon={faFileAlt} className="mr-2 text-blue-500 w-4 h-4" />
                                  <span>EORI申请</span>
                                </a>
                                <a href="#vat-apply" className="flex items-center py-2 text-sm text-gray-600 hover:text-primary">
                                  <FontAwesomeIcon icon={faFileAlt} className="mr-2 text-blue-500 w-4 h-4" />
                                  <span>VAT申请</span>
                                </a>
                              </div>
                            </div>

                            {/* 中国业务分类 */}
                            <div>
                              <div className="mb-4">
                                <span className="font-bold text-gray-800 text-base pb-1 inline-block border-b-2 border-gradient-to-r from-blue-500 to-purple-500" style={{borderImage: 'linear-gradient(to right, #3b82f6, #8b5cf6) 1'}}>中国业务</span>
                              </div>
                              <div className="grid grid-cols-3 gap-4 pl-6">
                                <a href="#nvocc-register" className="flex items-center py-2 text-sm text-gray-600 hover:text-primary">
                                  <FontAwesomeIcon icon={faShip} className="mr-2 text-purple-500 w-4 h-4" />
                                  <span>NVOCC注册</span>
                                </a>
                                <a href="#import-equipment" className="flex items-center py-2 text-sm text-gray-600 hover:text-primary">
                                  <FontAwesomeIcon icon={faBoxes} className="mr-2 text-orange-500 w-4 h-4" />
                                  <span>进出口权备案</span>
                                </a>
                                <a href="#moc-proxy" className="flex items-center py-2 text-sm text-gray-600 hover:text-primary">
                                  <FontAwesomeIcon icon={faBuilding} className="mr-2 text-red-500 w-4 h-4" />
                                  <span>商务部货代备案</span>
                                </a>
                                <a href="#origin-certificate" className="flex items-center py-2 text-sm text-gray-600 hover:text-primary">
                                  <FontAwesomeIcon icon={faFileAlt} className="mr-2 text-yellow-500 w-4 h-4" />
                                  <span>原产地证</span>
                                </a>
                              </div>
                            </div>

                            {/* 其他分类 */}
                            <div>
                              <div className="mb-4">
                                <span className="font-bold text-gray-800 text-base pb-1 inline-block border-b-2 border-gradient-to-r from-blue-500 to-purple-500" style={{borderImage: 'linear-gradient(to right, #3b82f6, #8b5cf6) 1'}}>其他</span>
                              </div>
                              <div className="grid grid-cols-3 gap-4 pl-6">
                                <a href="#vessel-booking" className="flex items-center py-2 text-sm text-gray-600 hover:text-primary">
                                  <FontAwesomeIcon icon={faShip} className="mr-2 text-orange-500 w-4 h-4" />
                                  <span>船代签约</span>
                                </a>
                              </div>
                            </div>
                          </div>
                        ) : item.subItems[activeSubMenu].label === '订舱门户' ? (
                          <div className="space-y-6">
                            {/* 船东分类 */}
                            <div>
                              <div className="mb-4">
                                <span className="font-bold text-gray-800 text-base pb-1 inline-block border-b-2 border-gradient-to-r from-blue-500 to-purple-500" style={{borderImage: 'linear-gradient(to right, #3b82f6, #8b5cf6) 1'}}>船东</span>
                              </div>
                              <div className="grid grid-cols-3 gap-4 pl-6">
                                <a href="#carrier-booking" className="flex items-center py-2 text-sm text-gray-600 hover:text-primary">
                                  <FontAwesomeIcon icon={faShip} className="mr-2 text-blue-500 w-4 h-4" />
                                  <span>船司订舱</span>
                                </a>
                                <a href="#carrier-closing" className="flex items-center py-2 text-sm text-gray-600 hover:text-primary">
                                  <FontAwesomeIcon icon={faFileAlt} className="mr-2 text-blue-500 w-4 h-4" />
                                  <span>船司截单</span>
                                </a>
                              </div>
                            </div>

                            {/* 代理分类 */}
                            <div>
                              <div className="mb-4">
                                <span className="font-bold text-gray-800 text-base pb-1 inline-block border-b-2 border-gradient-to-r from-blue-500 to-purple-500" style={{borderImage: 'linear-gradient(to right, #3b82f6, #8b5cf6) 1'}}>代理</span>
                              </div>
                              <div className="grid grid-cols-3 gap-4 pl-6">
                                <a href="#agent-booking" className="flex items-center py-2 text-sm text-gray-600 hover:text-primary">
                                  <FontAwesomeIcon icon={faHandshake} className="mr-2 text-green-500 w-4 h-4" />
                                  <span>代理订舱</span>
                                </a>
                                <a href="#agent-closing" className="flex items-center py-2 text-sm text-gray-600 hover:text-primary">
                                  <FontAwesomeIcon icon={faFileAlt} className="mr-2 text-green-500 w-4 h-4" />
                                  <span>代理截单</span>
                                </a>
                              </div>
                            </div>
                          </div>
                        ) : item.subItems[activeSubMenu].label === '工具箱' ? (
                          <div className="space-y-6">
                            {/* 可视化分类 */}
                            <div>
                              <div className="mb-4">
                                <span className="font-bold text-gray-800 text-base pb-1 inline-block border-b-2 border-gradient-to-r from-blue-500 to-purple-500" style={{borderImage: 'linear-gradient(to right, #3b82f6, #8b5cf6) 1'}}>可视化</span>
                              </div>
                              <div className="grid grid-cols-3 gap-4 pl-6">
                                <a href="#track-trace" className="flex items-center py-2 text-sm text-gray-600 hover:text-primary">
                                  <FontAwesomeIcon icon={faShip} className="mr-2 text-blue-500 w-4 h-4" />
                                  <span>全链路跟踪</span>
                                </a>
                                <a href="#global-schedule" className="flex items-center py-2 text-sm text-gray-600 hover:text-primary">
                                  <FontAwesomeIcon icon={faShip} className="mr-2 text-green-500 w-4 h-4" />
                                  <span>全球船期</span>
                                </a>
                                <a href="#truck-tracking" className="flex items-center py-2 text-sm text-gray-600 hover:text-primary">
                                  <FontAwesomeIcon icon={faTruck} className="mr-2 text-orange-500 w-4 h-4" />
                                  <span>货车轨迹</span>
                                </a>
                              </div>
                            </div>

                            {/* 实用助手分类 */}
                            <div>
                              <div className="mb-4">
                                <span className="font-bold text-gray-800 text-base pb-1 inline-block border-b-2 border-gradient-to-r from-blue-500 to-purple-500" style={{borderImage: 'linear-gradient(to right, #3b82f6, #8b5cf6) 1'}}>实用助手</span>
                              </div>
                              <div className="grid grid-cols-3 gap-4 pl-6">
                                <a href="#hs-classifier" className="flex items-center py-2 text-sm text-gray-600 hover:text-primary">
                                  <FontAwesomeIcon icon={faCode} className="mr-2 text-purple-500 w-4 h-4" />
                                  <span>HS归类大师</span>
                                </a>
                                <a href="#manifest-converter" className="flex items-center py-2 text-sm text-gray-600 hover:text-primary">
                                  <FontAwesomeIcon icon={faFileAlt} className="mr-2 text-red-500 w-4 h-4" />
                                  <span>舱单转换</span>
                                </a>
                                <a href="#forwarder-directory" className="flex items-center py-2 text-sm text-gray-600 hover:text-primary">
                                  <FontAwesomeIcon icon={faBuilding} className="mr-2 text-blue-500 w-4 h-4" />
                                  <span>货代名录</span>
                                </a>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="grid grid-cols-3 gap-6">
                            {item.subItems[activeSubMenu].subItems?.map((nestedItem, nestedIndex) => (
                              <a
                                key={nestedIndex}
                                href={nestedItem.href}
                                className="flex items-center py-3 text-sm text-gray-600 hover:text-primary"
                              >
                                {nestedItem.icon}
                                <span>{nestedItem.label}</span>
                                {nestedItem.isNew && (
                                  <span className="ml-2 px-1.5 py-0.5 text-xs bg-red-100 text-red-500 rounded">NEW</span>
                                )}
                              </a>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Contact & Auth */}
        <div className="hidden md:flex items-center space-x-4">
          <span className="text-gray-700">400-0682-666</span>
          <Link to="/auth" className="btn-primary">注册/登录</Link>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={toggleMenu}>
          {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white">
          <div className="container-custom py-4 space-y-4">
            {navItems.map((item, index) => (
              <div key={index}>
                <a
                  href={item.href}
                  className="block py-2 text-gray-700 hover:text-primary flex items-center justify-between"
                  onClick={item.dropdown ? (e) => handleMobileDropdownToggle(e, item.label) : undefined}
                >
                  {item.label}
                  {item.dropdown && (
                    <FiChevronDown className="ml-1 h-4 w-4" />
                  )}
                </a>

                {/* 移动端下拉菜单 */}
                {item.dropdown && item.subItems && activeDropdown === item.label && (
                  <div className="pl-4 mt-2 space-y-2 border-l-2 border-gray-100">
                    {item.subItems.map((subItem, subIndex) => (
                      <div key={subIndex} className="py-2">
                        <div
                          className="flex items-center space-x-2 cursor-pointer"
                          onClick={() => handleSubMenuHover(subIndex)}
                        >
                          {subItem.icon}
                          <span className="font-medium text-gray-700">{subItem.label}</span>
                        </div>

                        {activeSubMenu === subIndex && (
                          <div className="pl-10 mt-2 space-y-1">
                            {subItem.subItems?.map((nestedItem, nestedIndex) => (
                              <a
                                key={nestedIndex}
                                href={nestedItem.href}
                                className="flex items-center py-1 text-sm text-gray-600 hover:text-primary"
                              >
                                {nestedItem.icon}
                                <span>{nestedItem.label}</span>
                                {nestedItem.isNew && (
                                  <span className="ml-2 px-1.5 py-0.5 text-xs bg-red-100 text-red-500 rounded">NEW</span>
                                )}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="pt-4 border-t border-gray-100 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">400-0682-666</span>
              </div>
              <div className="flex">
                <Link to="/auth" className="btn-primary flex-1 text-center">注册/登录</Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;