import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faShip, 
  faPlane, 
  faWarehouse, 
  faFileInvoiceDollar,
  faCheckCircle,
  faGlobe,
  faClock,
  faShieldAlt
} from '@fortawesome/free-solid-svg-icons';
import PortalHeader from './PortalHeader';
import PortalFooter from './PortalFooter';
import { UserProvider } from './UserContext';

interface ServiceFeature {
  icon: any;
  title: string;
  description: string;
}

interface ServiceTab {
  key: string;
  title: string;
  icon: any;
  color: string;
  description: string;
  features: ServiceFeature[];
  advantages: string[];
  image: string;
}

const BusinessServicesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('sea');

  const services: ServiceTab[] = [
    {
      key: 'sea',
      title: '海运服务',
      icon: faShip,
      color: 'blue',
      description: '作为您值得信赖的国际海运合作伙伴，我们提供覆盖全球主要贸易航线的专业海运服务。凭借与全球500+船公司的深度合作关系，我们能够为您提供最具性价比的运输方案。无论是整箱运输(FCL)、拼箱运输(LCL)，还是特种货物运输，我们都有丰富的操作经验和专业的服务团队，确保您的货物安全、准时抵达目的港。我们的海运网络覆盖亚洲、欧洲、北美、南美、非洲、大洋洲等主要贸易区域，为您的全球贸易提供强有力的物流支撑。',
      features: [
        {
          icon: faGlobe,
          title: '全球航线网络',
          description: '覆盖全球300+主要港口，连接六大洲贸易枢纽，提供门到门一站式服务'
        },
        {
          icon: faClock,
          title: '准班准时',
          description: '与马士基、中远海运等知名船公司合作，严格的船期管理，99.5%准时到港率'
        },
        {
          icon: faShieldAlt,
          title: '安全保障',
          description: '专业的包装标准，全程货物跟踪，提供货物运输保险，确保货物安全'
        }
      ],
      advantages: [
        '与全球500+船公司建立合作关系，舱位资源充足',
        '99.5%的准时到港率，行业领先的时效保证',
        '24/7全程货物跟踪服务，实时掌握货物动态',
        '专业危险品运输资质，支持IMO各类危险品运输',
        '灵活的仓储配送服务，支持门到门全程物流',
        '多币种结算，支持人民币、美元、欧元等主流货币',
        '专业的单证处理团队，确保清关文件准确无误',
        '绿色环保运输，选择低碳排放的现代化船舶'
      ],
      image: 'https://images.unsplash.com/photo-1494412651409-8963ce7935a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
    },
    {
      key: 'air',
      title: '空运服务',
      icon: faPlane,
      color: 'indigo',
      description: '当您的货物需要快速抵达目的地时，我们的国际空运服务是您的最佳选择。我们与全球主要航空公司建立了战略合作关系，包括国航、南航、东航、汉莎、阿联酋航空等，能够为您提供覆盖全球的航空运输网络。我们的空运服务涵盖普通货物空运、急件专递、温控运输、危险品运输等多个领域，无论是高价值电子产品、时尚服装、精密仪器，还是生鲜食品、医药用品，我们都能提供专业的运输解决方案。凭借丰富的操作经验和专业的服务团队，我们承诺为您提供安全、快速、可靠的空运服务。',
      features: [
        {
          icon: faClock,
          title: '极速时效',
          description: '全球主要城市2-5天送达，急件服务24-48小时内到达，满足您的紧急运输需求'
        },
        {
          icon: faGlobe,
          title: '密集航线',
          description: '覆盖全球200+国际机场，每日多班次航班选择，灵活的起运时间安排'
        },
        {
          icon: faShieldAlt,
          title: '专业包装',
          description: '严格按照IATA航空包装标准，专业的包装材料和技术，确保货物运输安全'
        }
      ],
      advantages: [
        '与全球200+航空公司合作，舱位资源丰富',
        '平均3天全球到达，行业领先的运输时效',
        '专业温控运输服务，支持2-8℃医药冷链运输',
        '危险品专业处理资质，支持DGR各类危险品运输',
        '实时航班跟踪系统，随时掌握货物运输状态',
        '24小时客服支持，提供全天候咨询和问题解决',
        '灵活的取货配送服务，支持门到门、门到机场等多种方式',
        '专业的报关清关服务，简化您的通关流程'
      ],
      image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
    },
    {
      key: 'warehouse',
      title: '仓储服务',
      icon: faWarehouse,
      color: 'cyan',
      description: '我们提供现代化的智能仓储管理服务，拥有遍布全国主要城市的仓储网络，总仓储面积超过100万平方米。我们的仓库均采用先进的WMS仓储管理系统，配备自动化分拣设备、智能货架系统和环境控制系统，能够为不同类型的货物提供专业的存储解决方案。无论是普通商品仓储、保税仓储、冷链仓储，还是危险品仓储，我们都有相应的专业设施和操作规范。我们还为电商客户提供一件代发、库存管理、订单处理等增值服务，帮助您降低运营成本，提高物流效率。',
      features: [
        {
          icon: faWarehouse,
          title: '智能仓储',
          description: '采用先进WMS系统管理，配备自动化分拣包装设备，提高作业效率和准确率'
        },
        {
          icon: faShieldAlt,
          title: '安全存储',
          description: '24小时安保监控，恒温恒湿环境控制，消防安全系统，确保货物安全存储'
        },
        {
          icon: faGlobe,
          title: '网络覆盖',
          description: '全国30+主要城市设有仓储网点，就近存储配送，降低物流成本'
        }
      ],
      advantages: [
        '100万平米仓储面积，满足大规模存储需求',
        '99.9%库存准确率，先进的库存管理系统',
        '24小时内发货承诺，高效的订单处理流程',
        '专业保税仓储服务，支持进口货物保税存储',
        '电商一件代发服务，支持多平台订单对接',
        '温控仓储设施，支持2-8℃、15-25℃等多种温度需求',
        '危险品仓储资质，符合国家安全存储标准',
        '增值服务丰富，包括贴标、分装、质检等个性化服务'
      ],
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
    },
    {
      key: 'customs',
      title: '关务服务',
      icon: faFileInvoiceDollar,
      color: 'sky',
      description: '作为AEO高级认证企业，我们拥有十多年的专业关务服务经验，为您提供全方位的进出口贸易合规解决方案。我们的关务团队由资深报关师、国际贸易专家和法务顾问组成，深度了解中国及全球主要国家的海关法规和贸易政策。我们不仅提供基础的报关报检服务，还为企业提供关税筹划、贸易合规咨询、海关稽查应对等高端服务。通过我们的专业服务，可以帮助您降低贸易成本，规避合规风险，提高通关效率，让您的国际贸易更加顺畅。',
      features: [
        {
          icon: faFileInvoiceDollar,
          title: '专业报关',
          description: '拥有50+资深报关师团队，熟悉各类商品归类和申报要求，提供快速准确的通关服务'
        },
        {
          icon: faShieldAlt,
          title: '合规保障',
          description: '严格遵循各国贸易法规，提供贸易合规咨询，降低企业合规风险和法律风险'
        },
        {
          icon: faClock,
          title: '高效处理',
          description: '平均通关时间行业领先，紧急情况提供加急处理，确保货物快速通关'
        }
      ],
      advantages: [
        '15年专业关务服务经验，累计服务5000+企业客户',
        '99%一次性通关率，减少查验和滞港风险',
        '全国主要口岸均有服务网点，就近提供专业服务',
        '专业关税筹划服务，帮助企业合理降低进口成本',
        'AEO高级认证企业，享受海关便利化措施和优先通关',
        '多元化服务能力，支持一般贸易、保税、跨境电商等多种贸易方式',
        '完善的合规体系，提供贸易合规培训和风险评估服务',
        '海关稽查应对经验丰富，协助企业顺利通过各类海关检查'
      ],
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
    }
  ];

  const activeService = services.find(service => service.key === activeTab) || services[0];

  const getColorClasses = (color: string, type: 'bg' | 'text' | 'border' | 'hover') => {
    const colorMap = {
      blue: {
        bg: 'bg-blue-600',
        text: 'text-blue-600',
        border: 'border-blue-600',
        hover: 'hover:bg-blue-50'
      },
      indigo: {
        bg: 'bg-indigo-600',
        text: 'text-indigo-600',
        border: 'border-indigo-600',
        hover: 'hover:bg-indigo-50'
      },
      cyan: {
        bg: 'bg-cyan-600',
        text: 'text-cyan-600',
        border: 'border-cyan-600',
        hover: 'hover:bg-cyan-50'
      },
      sky: {
        bg: 'bg-sky-600',
        text: 'text-sky-600',
        border: 'border-sky-600',
        hover: 'hover:bg-sky-50'
      }
    };
    return colorMap[color as keyof typeof colorMap]?.[type] || colorMap.blue[type];
  };

  return (
    <UserProvider>
      <div className="min-h-screen bg-gray-50">
        <PortalHeader />
        
        {/* Tab导航 */}
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {services.map((service) => (
                <button
                  key={service.key}
                  onClick={() => setActiveTab(service.key)}
                  className={`
                    flex flex-col items-center p-6 rounded-xl border-2 transition-all duration-300
                    ${activeTab === service.key 
                      ? `${getColorClasses(service.color, 'bg')} text-white ${getColorClasses(service.color, 'border')}` 
                      : `bg-white ${getColorClasses(service.color, 'text')} border-gray-200 ${getColorClasses(service.color, 'hover')}`
                    }
                  `}
                >
                  <FontAwesomeIcon 
                    icon={service.icon} 
                    className={`text-3xl mb-3 ${activeTab === service.key ? 'text-white' : getColorClasses(service.color, 'text')}`} 
                  />
                  <span className="font-semibold text-lg">{service.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 服务详情内容 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 主要内容 */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                {/* 服务图片 */}
                <img
                  src={activeService.image}
                  alt={activeService.title}
                  className="w-full h-64 md:h-80 object-cover"
                />
                
                {/* 服务内容 */}
                <div className="p-8">
                  <div className="flex items-center mb-6">
                    <div className={`w-12 h-12 ${getColorClasses(activeService.color, 'bg')} rounded-lg flex items-center justify-center mr-4`}>
                      <FontAwesomeIcon icon={activeService.icon} className="text-white text-xl" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">{activeService.title}</h2>
                  </div>
                  
                  <p className="text-gray-600 text-lg leading-relaxed mb-8">
                    {activeService.description}
                  </p>

                  {/* 核心特色 */}
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">核心特色</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {activeService.features.map((feature, index) => (
                        <div key={index} className="text-center">
                          <div className={`w-16 h-16 ${getColorClasses(activeService.color, 'bg')} rounded-full flex items-center justify-center mx-auto mb-4`}>
                            <FontAwesomeIcon icon={feature.icon} className="text-white text-xl" />
                          </div>
                          <h4 className="font-semibold text-gray-900 mb-2">{feature.title}</h4>
                          <p className="text-gray-600 text-sm">{feature.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 服务优势 */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-6">服务优势</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {activeService.advantages.map((advantage, index) => (
                        <div key={index} className="flex items-center">
                          <FontAwesomeIcon 
                            icon={faCheckCircle} 
                            className={`${getColorClasses(activeService.color, 'text')} mr-3 flex-shrink-0`} 
                          />
                          <span className="text-gray-700">{advantage}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 侧边栏 */}
            <div className="lg:col-span-1">
              {/* 联系咨询 */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl p-6 mb-8">
                <h3 className="text-lg font-bold mb-4">专业咨询</h3>
                <p className="text-blue-100 text-sm mb-4">
                  需要了解更多服务详情？我们的专业团队为您提供一对一咨询服务
                </p>
                <div className="flex justify-center">
                  <img 
                    src="/WX20250623-164557@2x.png" 
                    alt="微信咨询二维码" 
                    className="w-32 h-32 rounded-lg bg-white p-2 object-contain"
                  />
                </div>
                <p className="text-center text-xs text-blue-100 mt-3">扫码添加专属顾问</p>
              </div>

              {/* 快速导航 */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">其他服务</h3>
                <div className="space-y-3">
                  {services.filter(service => service.key !== activeTab).map((service) => (
                    <button
                      key={service.key}
                      onClick={() => setActiveTab(service.key)}
                      className={`w-full flex items-center p-3 rounded-lg border border-gray-200 ${getColorClasses(service.color, 'hover')} transition-colors duration-300`}
                    >
                      <FontAwesomeIcon 
                        icon={service.icon} 
                        className={`${getColorClasses(service.color, 'text')} mr-3`} 
                      />
                      <span className="text-gray-700 font-medium">{service.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <PortalFooter />
      </div>
    </UserProvider>
  );
};

export default BusinessServicesPage; 