import React, { useState } from 'react';
import { Card, Grid, Typography, Button, Tag } from '@arco-design/web-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faRobot, 
  faFileAlt, 
  faDatabase, 
  faChartLine, 
  faBoxes, 
  faShip, 
  faTruck, 
  faGlobe, 
  faHandshake, 
  faFileContract, 
  faClipboardList, 
  faExchangeAlt, 
  faBalanceScale, 
  faGlobeAmericas, 
  faCode, 
  faDesktop,
  faMobile,
  faUsers,
  faBuilding,
  faFileInvoice,
  faShieldAlt,
  faFileSignature,
  faLaptopCode,
  faRoute
} from '@fortawesome/free-solid-svg-icons';

const { Row, Col } = Grid;
const { Title, Text } = Typography;

interface AppItem {
  id: string;
  name: string;
  description: string;
  icon: any;
  category: string;
  subcategory?: string;
  status: 'active' | 'inactive';
  isNew?: boolean;
  url?: string;
}

const ApplicationCenter: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('ai-innovation');

  // 应用数据
  const applications: AppItem[] = [
    // AI创新场
    {
      id: '1',
      name: 'AI沃宝',
      description: '智能客服助手，提供24小时在线服务',
      icon: faRobot,
      category: 'ai-innovation',
      status: 'active'
    },
    {
      id: '2',
      name: '文件识别',
      description: '自动识别和处理各类贸易单证',
      icon: faFileAlt,
      category: 'ai-innovation',
      status: 'inactive'
    },
    {
      id: '3',
      name: '超级运价',
      description: '智能运价分析和报价系统',
      icon: faDatabase,
      category: 'ai-innovation',
      status: 'active'
    },
    {
      id: '4',
      name: '智能BI',
      description: '智能商业分析和数据洞察',
      icon: faChartLine,
      category: 'ai-innovation',
      status: 'inactive',
      isNew: true
    },
    {
      id: '5',
      name: '智慧集装箱',
      description: '智能集装箱管理和追踪系统',
      icon: faBoxes,
      category: 'ai-innovation',
      status: 'inactive',
      isNew: true
    },

    // 海关专区 - 美加专区
    {
      id: '6',
      name: 'AMS申报',
      description: '美国海关自动舱单系统申报',
      icon: faShip,
      category: 'customs',
      subcategory: 'us-canada',
      status: 'active'
    },
    {
      id: '7',
      name: 'ISF申报',
      description: '进口商安全申报系统',
      icon: faFileSignature,
      category: 'customs',
      subcategory: 'us-canada',
      status: 'active'
    },
    {
      id: '8',
      name: 'ACI申报',
      description: '加拿大预先货物信息系统',
      icon: faClipboardList,
      category: 'customs',
      subcategory: 'us-canada',
      status: 'active'
    },
    {
      id: '9',
      name: '美国换单',
      description: '美国目的港换单服务',
      icon: faFileAlt,
      category: 'customs',
      subcategory: 'us-canada',
      status: 'inactive'
    },
    {
      id: '10',
      name: '美国清关',
      description: '美国海关清关服务',
      icon: faShieldAlt,
      category: 'customs',
      subcategory: 'us-canada',
      status: 'inactive'
    },

    // 海关专区 - 欧盟业务
    {
      id: '11',
      name: 'ICS2申报',
      description: '欧盟进口控制系统2.0申报',
      icon: faFileInvoice,
      category: 'customs',
      subcategory: 'eu',
      status: 'inactive'
    },

    // 海关专区 - 中国业务
    {
      id: '12',
      name: '上海预配舱单',
      description: '上海港预配舱单申报',
      icon: faShip,
      category: 'customs',
      subcategory: 'china',
      status: 'active'
    },
    {
      id: '13',
      name: '青岛预配舱单',
      description: '青岛港预配舱单申报',
      icon: faShip,
      category: 'customs',
      subcategory: 'china',
      status: 'active'
    },
    {
      id: '14',
      name: '华南预配舱单',
      description: '华南地区预配舱单申报',
      icon: faShip,
      category: 'customs',
      subcategory: 'china',
      status: 'active'
    },
    {
      id: '15',
      name: 'VGM申报',
      description: '集装箱重量验证申报',
      icon: faBalanceScale,
      category: 'customs',
      subcategory: 'china',
      status: 'inactive'
    },
    {
      id: '16',
      name: '上海进口换单',
      description: '上海港进口换单服务',
      icon: faExchangeAlt,
      category: 'customs',
      subcategory: 'china',
      status: 'inactive'
    },

    // 海关专区 - 其他
    {
      id: '17',
      name: 'AFR申报',
      description: '日本海关申报',
      icon: faGlobeAmericas,
      category: 'customs',
      subcategory: 'other',
      status: 'inactive'
    },
    {
      id: '18',
      name: '墨西哥反恐申报',
      description: '墨西哥海关反恐申报系统',
      icon: faShieldAlt,
      category: 'customs',
      subcategory: 'other',
      status: 'inactive'
    },

    // 智慧物流系统 - 定制门户
    {
      id: '19',
      name: 'Web门户',
      description: '基于Web的物流管理门户',
      icon: faDesktop,
      category: 'smart-logistics',
      subcategory: 'portal',
      status: 'active'
    },
    {
      id: '20',
      name: '小程序',
      description: '移动端物流服务小程序',
      icon: faMobile,
      category: 'smart-logistics',
      subcategory: 'portal',
      status: 'inactive'
    },
    {
      id: '21',
      name: 'B2B平台',
      description: '企业间物流服务平台',
      icon: faBuilding,
      category: 'smart-logistics',
      subcategory: 'portal',
      status: 'active'
    },

    // 智慧物流系统 - 协作云平台
    {
      id: '22',
      name: '控制塔协作系统',
      description: '物流控制塔协作管理系统',
      icon: faUsers,
      category: 'smart-logistics',
      subcategory: 'collaboration',
      status: 'active'
    },
    {
      id: '23',
      name: 'CargoWare',
      description: '货物管理和追踪系统',
      icon: faTruck,
      category: 'smart-logistics',
      subcategory: 'collaboration',
      status: 'inactive'
    },

    // 经纪代理 - 美国业务
    {
      id: '24',
      name: '美国公司注册',
      description: '美国公司注册服务',
      icon: faBuilding,
      category: 'broker-agent',
      subcategory: 'us',
      status: 'active'
    },
    {
      id: '25',
      name: '美国公司EIN申请',
      description: '美国雇主识别号申请',
      icon: faFileAlt,
      category: 'broker-agent',
      subcategory: 'us',
      status: 'active'
    },
    {
      id: '26',
      name: '美国海关Bond',
      description: '美国海关保证金服务',
      icon: faHandshake,
      category: 'broker-agent',
      subcategory: 'us',
      status: 'active'
    },
    {
      id: '27',
      name: '美国FMC申请',
      description: '美国联邦海事委员会申请',
      icon: faFileSignature,
      category: 'broker-agent',
      subcategory: 'us',
      status: 'inactive'
    },
    {
      id: '28',
      name: '加拿大海关Bond',
      description: '加拿大海关保证金服务',
      icon: faHandshake,
      category: 'broker-agent',
      subcategory: 'us',
      status: 'inactive'
    },

    // 经纪代理 - 欧盟业务
    {
      id: '29',
      name: 'EORI申请',
      description: '欧盟经济经营者注册识别号申请',
      icon: faFileAlt,
      category: 'broker-agent',
      subcategory: 'eu',
      status: 'active'
    },
    {
      id: '30',
      name: 'VAT申请',
      description: '欧盟增值税号申请',
      icon: faFileInvoice,
      category: 'broker-agent',
      subcategory: 'eu',
      status: 'active'
    },

    // 经纪代理 - 中国业务
    {
      id: '31',
      name: 'NVOCC注册',
      description: '无船承运人注册服务',
      icon: faShip,
      category: 'broker-agent',
      subcategory: 'china',
      status: 'active'
    },
    {
      id: '32',
      name: '进出口权备案',
      description: '进出口经营权备案服务',
      icon: faBuilding,
      category: 'broker-agent',
      subcategory: 'china',
      status: 'inactive'
    },
    {
      id: '33',
      name: '商务部备代备案',
      description: '商务部备案代理服务',
      icon: faFileContract,
      category: 'broker-agent',
      subcategory: 'china',
      status: 'inactive'
    },
    {
      id: '34',
      name: '原产地证',
      description: '原产地证明申请服务',
      icon: faFileSignature,
      category: 'broker-agent',
      subcategory: 'china',
      status: 'inactive'
    },

    // 经纪代理 - 其他
    {
      id: '35',
      name: '船代签约',
      description: '船舶代理签约服务',
      icon: faShip,
      category: 'broker-agent',
      subcategory: 'other',
      status: 'inactive'
    },

    // 订舱门户 - 船东
    {
      id: '36',
      name: '船司订舱',
      description: '船公司直接订舱服务',
      icon: faShip,
      category: 'booking-portal',
      subcategory: 'carrier',
      status: 'active'
    },
    {
      id: '37',
      name: '船司截单',
      description: '船公司截单管理',
      icon: faClipboardList,
      category: 'booking-portal',
      subcategory: 'carrier',
      status: 'active'
    },

    // 订舱门户 - 代理
    {
      id: '38',
      name: '代理订舱',
      description: '代理商订舱服务',
      icon: faUsers,
      category: 'booking-portal',
      subcategory: 'agent',
      status: 'active'
    },
    {
      id: '39',
      name: '代理截单',
      description: '代理商截单管理',
      icon: faFileAlt,
      category: 'booking-portal',
      subcategory: 'agent',
      status: 'active'
    },

    // 工具箱 - 可视化
    {
      id: '40',
      name: '全链路跟踪',
      description: '全程物流链路可视化跟踪',
      icon: faRoute,
      category: 'toolbox',
      subcategory: 'visualization',
      status: 'active'
    },
    {
      id: '41',
      name: '全球船期',
      description: '全球船期信息查询',
      icon: faShip,
      category: 'toolbox',
      subcategory: 'visualization',
      status: 'active'
    },
    {
      id: '42',
      name: '货车轨迹',
      description: '货车运输轨迹追踪',
      icon: faTruck,
      category: 'toolbox',
      subcategory: 'visualization',
      status: 'active'
    },

    // 工具箱 - 实用助手
    {
      id: '43',
      name: 'HS归类大师',
      description: 'HS编码智能归类工具',
      icon: faCode,
      category: 'toolbox',
      subcategory: 'tools',
      status: 'inactive'
    },
    {
      id: '44',
      name: '舱单转换',
      description: '各种舱单格式转换工具',
      icon: faExchangeAlt,
      category: 'toolbox',
      subcategory: 'tools',
      status: 'inactive'
    },
    {
      id: '45',
      name: '货代名录',
      description: '全球货代公司信息查询',
      icon: faGlobe,
      category: 'toolbox',
      subcategory: 'tools',
      status: 'inactive'
    }
  ];

  // 分类配置
  const categories = [
    {
      key: 'ai-innovation',
      name: 'AI创新场',
      description: 'AI驱动的创新解决方案',
      icon: faRobot,
      color: '#4A90E2'
    },
    {
      key: 'customs',
      name: '海关专区',
      description: '海关业务专业解决方案',
      icon: faShieldAlt,
      color: '#9B59B6'
    },
    {
      key: 'smart-logistics',
      name: '智慧物流系统',
      description: '智能高效的物流管理系统',
      icon: faTruck,
      color: '#2ECC71'
    },
    {
      key: 'broker-agent',
      name: '经纪代理',
      description: '专业的经纪代理服务',
      icon: faHandshake,
      color: '#F39C12'
    },
    {
      key: 'booking-portal',
      name: '订舱门户',
      description: '高效便捷的订舱服务平台',
      icon: faShip,
      color: '#3498DB'
    },
    {
      key: 'toolbox',
      name: '工具箱',
      description: '多样化的实用工具集合',
      icon: faLaptopCode,
      color: '#E74C3C'
    }
  ];

  // 子分类配置
  const subcategories = {
    'customs': [
      { key: 'us-canada', name: '美加专区' },
      { key: 'eu', name: '欧盟业务' },
      { key: 'china', name: '中国业务' },
      { key: 'other', name: '其他' }
    ],
    'smart-logistics': [
      { key: 'portal', name: '定制门户' },
      { key: 'collaboration', name: '协作云平台' }
    ],
    'broker-agent': [
      { key: 'us', name: '美国业务' },
      { key: 'eu', name: '欧盟业务' },
      { key: 'china', name: '中国业务' },
      { key: 'other', name: '其他' }
    ],
    'booking-portal': [
      { key: 'carrier', name: '船东' },
      { key: 'agent', name: '代理' }
    ],
    'toolbox': [
      { key: 'visualization', name: '可视化' },
      { key: 'tools', name: '实用助手' }
    ]
  };

  // 获取当前分类的应用
  const currentApps = applications.filter(app => app.category === activeCategory);
  const currentCategory = categories.find(cat => cat.key === activeCategory);
  const currentSubcategories = subcategories[activeCategory as keyof typeof subcategories] || [];

  // 按子分类分组应用
  const groupedApps = currentSubcategories.reduce((acc, subcat) => {
    acc[subcat.key] = currentApps.filter(app => app.subcategory === subcat.key);
    return acc;
  }, {} as Record<string, AppItem[]>);

  // 处理应用操作
  const handleAppAction = (app: AppItem) => {
    if (app.status === 'active') {
      // 进入应用
      if (app.url) {
        window.open(app.url, '_blank');
      } else {
        console.log('进入应用:', app.name);
      }
    } else {
      // 申请开通
      console.log('申请开通:', app.name);
    }
  };

  return (
    <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
      {/* 分类导航 */}
      <div style={{ marginBottom: '32px' }}>
        <Row gutter={24}>
          {categories.map(category => (
            <Col key={category.key} span={4}>
              <Card
                hoverable
                style={{
                  textAlign: 'center',
                  cursor: 'pointer',
                  border: activeCategory === category.key ? `2px solid ${category.color}` : '1px solid #e5e5e5',
                  backgroundColor: activeCategory === category.key ? `${category.color}10` : 'white'
                }}
                bodyStyle={{ padding: '20px' }}
                onClick={() => setActiveCategory(category.key)}
              >
                <FontAwesomeIcon 
                  icon={category.icon} 
                  size="2x" 
                  style={{ color: category.color, marginBottom: '12px' }} 
                />
                <Title heading={6} style={{ margin: '8px 0 4px 0', color: '#1d2129' }}>
                  {category.name}
                </Title>
                <Text style={{ fontSize: '12px', color: '#86909c' }}>
                  {category.description}
                </Text>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      

      {/* 应用列表 */}
             {activeCategory === 'ai-innovation' ? (
         // AI创新场 - 直接显示应用卡片
         <Row gutter={[24, 24]}>
           {currentApps.map(app => (
             <Col key={app.id} xs={24} sm={12} md={8} lg={6}>
               <Card
                 className="app-card"
                 hoverable
                 style={{ 
                   height: '220px',
                   borderRadius: '16px',
                   border: 'none',
                   boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                   background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                   overflow: 'hidden',
                   position: 'relative'
                 }}
                 bodyStyle={{ 
                   padding: '24px', 
                   display: 'flex', 
                   flexDirection: 'column', 
                   justifyContent: 'space-between',
                   height: '100%',
                   position: 'relative'
                 }}
               >
                 {/* 背景装饰 */}
                 <div style={{
                   position: 'absolute',
                   top: '-20px',
                   right: '-20px',
                   width: '80px',
                   height: '80px',
                   background: `linear-gradient(135deg, ${currentCategory?.color}20, ${currentCategory?.color}10)`,
                   borderRadius: '50%',
                   zIndex: 0
                 }} />
                 
                 <div style={{ position: 'relative', zIndex: 1 }}>
                   <div style={{ 
                     marginBottom: '16px', 
                     display: 'flex', 
                     alignItems: 'center', 
                     justifyContent: 'space-between' 
                   }}>
                     <div style={{
                       width: '48px',
                       height: '48px',
                       borderRadius: '12px',
                       background: `linear-gradient(135deg, ${currentCategory?.color}15, ${currentCategory?.color}25)`,
                       display: 'flex',
                       alignItems: 'center',
                       justifyContent: 'center',
                       boxShadow: `0 4px 12px ${currentCategory?.color}20`
                     }}>
                       <FontAwesomeIcon 
                         icon={app.icon} 
                         size="lg" 
                         style={{ color: currentCategory?.color }} 
                       />
                     </div>
                     <div>
                       {app.isNew && (
                         <Tag 
                           color="red" 
                           style={{ 
                             fontSize: '10px',
                             borderRadius: '8px',
                             padding: '2px 8px',
                             background: 'linear-gradient(135deg, #ff6b6b, #ff5252)',
                             border: 'none',
                             color: 'white',
                             fontWeight: 'bold'
                           }}
                         >
                           NEW
                         </Tag>
                       )}
                       {app.status === 'active' && (
                         <div style={{
                           width: '8px',
                           height: '8px',
                           borderRadius: '50%',
                           background: '#52c41a',
                           marginTop: app.isNew ? '8px' : '0',
                           marginLeft: 'auto',
                           boxShadow: '0 0 8px #52c41a50'
                         }} />
                       )}
                     </div>
                   </div>
                   <Title heading={6} style={{ 
                     margin: '0 0 8px 0', 
                     fontWeight: '600',
                     color: '#1a1a1a'
                   }}>
                     {app.name}
                   </Title>
                   <Text style={{ 
                     fontSize: '13px', 
                     color: '#666666', 
                     lineHeight: '1.5',
                     display: '-webkit-box',
                     WebkitBoxOrient: 'vertical',
                     WebkitLineClamp: 2,
                     overflow: 'hidden'
                   }}>
                     {app.description}
                   </Text>
                 </div>
                 
                 <Button 
                   type={app.status === 'active' ? 'primary' : 'outline'}
                   size="small"
                   long
                   onClick={() => handleAppAction(app)}
                   style={{ 
                     marginTop: '16px',
                     borderRadius: '8px',
                     height: '36px',
                     fontWeight: '500',
                     border: app.status === 'active' ? 'none' : `1px solid ${currentCategory?.color}`,
                     background: app.status === 'active' 
                       ? `linear-gradient(135deg, ${currentCategory?.color}, ${currentCategory?.color}dd)`
                       : 'transparent',
                     color: app.status === 'active' ? 'white' : currentCategory?.color,
                     transition: 'all 0.3s ease',
                     position: 'relative',
                     zIndex: 1
                   }}
                 >
                   {app.status === 'active' ? '进入应用' : '申请开通'}
                 </Button>
               </Card>
             </Col>
           ))}
         </Row>
      ) : (
        // 其他分类 - 按子分类显示
        <div>
          {currentSubcategories.map(subcat => {
            const subcatApps = groupedApps[subcat.key] || [];
            if (subcatApps.length === 0) return null;
            
            return (
              <div key={subcat.key} style={{ marginBottom: '40px' }}>
                <Title heading={4} style={{ marginBottom: '20px', color: '#1d2129' }}>
                  {subcat.name}
                  <div style={{ 
                    width: '40px', 
                    height: '3px', 
                    backgroundColor: currentCategory?.color, 
                    marginTop: '8px' 
                  }} />
                </Title>
                                 <Row gutter={[24, 24]}>
                   {subcatApps.map(app => (
                     <Col key={app.id} xs={24} sm={12} md={8} lg={6}>
                       <Card
                         className="app-card"
                         hoverable
                         style={{ 
                           height: '220px',
                           borderRadius: '16px',
                           border: 'none',
                           boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                           background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                           overflow: 'hidden',
                           position: 'relative'
                         }}
                         bodyStyle={{ 
                           padding: '24px', 
                           display: 'flex', 
                           flexDirection: 'column', 
                           justifyContent: 'space-between',
                           height: '100%',
                           position: 'relative'
                         }}
                       >
                         {/* 背景装饰 */}
                         <div style={{
                           position: 'absolute',
                           top: '-20px',
                           right: '-20px',
                           width: '80px',
                           height: '80px',
                           background: `linear-gradient(135deg, ${currentCategory?.color}20, ${currentCategory?.color}10)`,
                           borderRadius: '50%',
                           zIndex: 0
                         }} />
                         
                         <div style={{ position: 'relative', zIndex: 1 }}>
                           <div style={{ 
                             marginBottom: '16px', 
                             display: 'flex', 
                             alignItems: 'center', 
                             justifyContent: 'space-between' 
                           }}>
                             <div style={{
                               width: '48px',
                               height: '48px',
                               borderRadius: '12px',
                               background: `linear-gradient(135deg, ${currentCategory?.color}15, ${currentCategory?.color}25)`,
                               display: 'flex',
                               alignItems: 'center',
                               justifyContent: 'center',
                               boxShadow: `0 4px 12px ${currentCategory?.color}20`
                             }}>
                               <FontAwesomeIcon 
                                 icon={app.icon} 
                                 size="lg" 
                                 style={{ color: currentCategory?.color }} 
                               />
                             </div>
                             <div>
                               {app.isNew && (
                                 <Tag 
                                   color="red" 
                                   style={{ 
                                     fontSize: '10px',
                                     borderRadius: '8px',
                                     padding: '2px 8px',
                                     background: 'linear-gradient(135deg, #ff6b6b, #ff5252)',
                                     border: 'none',
                                     color: 'white',
                                     fontWeight: 'bold'
                                   }}
                                 >
                                   NEW
                                 </Tag>
                               )}
                               {app.status === 'active' && (
                                 <div style={{
                                   width: '8px',
                                   height: '8px',
                                   borderRadius: '50%',
                                   background: '#52c41a',
                                   marginTop: app.isNew ? '8px' : '0',
                                   marginLeft: 'auto',
                                   boxShadow: '0 0 8px #52c41a50'
                                 }} />
                               )}
                             </div>
                           </div>
                           <Title heading={6} style={{ 
                             margin: '0 0 8px 0', 
                             fontWeight: '600',
                             color: '#1a1a1a'
                           }}>
                             {app.name}
                           </Title>
                           <Text style={{ 
                             fontSize: '13px', 
                             color: '#666666', 
                             lineHeight: '1.5',
                             display: '-webkit-box',
                             WebkitBoxOrient: 'vertical',
                             WebkitLineClamp: 2,
                             overflow: 'hidden'
                           }}>
                             {app.description}
                           </Text>
                         </div>
                         
                         <Button 
                           type={app.status === 'active' ? 'primary' : 'outline'}
                           size="small"
                           long
                           onClick={() => handleAppAction(app)}
                           style={{ 
                             marginTop: '16px',
                             borderRadius: '8px',
                             height: '36px',
                             fontWeight: '500',
                             border: app.status === 'active' ? 'none' : `1px solid ${currentCategory?.color}`,
                             background: app.status === 'active' 
                               ? `linear-gradient(135deg, ${currentCategory?.color}, ${currentCategory?.color}dd)`
                               : 'transparent',
                             color: app.status === 'active' ? 'white' : currentCategory?.color,
                             transition: 'all 0.3s ease',
                             position: 'relative',
                             zIndex: 1
                           }}
                                                    >
                            {app.status === 'active' ? '进入应用' : '申请开通'}
                           </Button>
                       </Card>
                     </Col>
                   ))}
                 </Row>
              </div>
            );
          })}
        </div>
      )}

      {/* 自定义样式 */}
      <style>{`
        .arco-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1) !important;
          transition: all 0.3s ease;
        }
      `}</style>
    </div>
  );
};

export default ApplicationCenter; 