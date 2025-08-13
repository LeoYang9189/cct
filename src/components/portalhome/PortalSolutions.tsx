import React, { useState, useEffect } from 'react';
import { Grid } from '@arco-design/web-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShip, faPlane, faWarehouse, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import LeadFormModal from './LeadFormModal';

const { Row, Col } = Grid;

const PortalSolutions: React.FC = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [showLeadForm, setShowLeadForm] = useState(false);

  const services = [
    {
      id: 'ocean',
      title: '海运服务',
      subtitle: 'Ocean Freight',
      description: '覆盖全球主要航线的海运服务，包括整箱、拼箱多种方式',
      features: ['整箱运输(FCL)', '拼箱运输(LCL)', '滚装船运输', '散杂货运输'],
      image: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      icon: faShip,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50'
    },
    {
      id: 'air',
      title: '空运服务', 
      subtitle: 'Air Freight',
      description: '快速安全的航空货运服务，连接全球主要机场和城市',
      features: ['普通货物空运', '危险品空运', '生鲜冷链运输', '快递服务'],
      image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80',
      icon: faPlane,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50'
    },
    {
      id: 'warehouse',
      title: '仓储服务',
      subtitle: 'Warehousing',
      description: '专业的仓储管理服务，提供安全可靠的货物存储解决方案',
      features: ['保税仓储', '普通仓储', '冷链仓储', '危险品仓储'],
      image: 'https://images.unsplash.com/photo-1553413077-190dd305871c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80',
      icon: faWarehouse,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50'
    },
    {
      id: 'customs',
      title: '关务服务',
      subtitle: 'Customs Service',
      description: '专业的海关事务处理，确保货物快速通关，合规操作',
      features: ['进出口报关', 'AEO认证咨询', '关税筹划', '海关稽查应对'],
      image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      icon: faFileAlt,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50'
    }
  ];

  // 自动轮播
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % services.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isAutoPlaying, services.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    // 重新启动自动播放
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + services.length) % services.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % services.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const handleConsultationClick = () => {
    setShowLeadForm(true);
  };

  const handleExperienceClick = () => {
    navigate('/portal/auth');
  };

  const handleServiceDetailClick = () => {
    navigate('/portal/business-services');
  };

  const currentService = services[currentSlide];

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-20"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-green-100 to-cyan-100 rounded-full opacity-30 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold text-sm uppercase tracking-wider">
              我们的服务
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            业务
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">介绍</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            专业的国际物流服务提供商，为您提供海运、空运、仓储、关务一站式物流解决方案
          </p>
        </div>

        {/* 轮播容器 */}
        <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          <Row gutter={0} className="items-center min-h-[480px]">
            {/* 图片区域 */}
            <Col xs={24} lg={12}>
              <div className="relative h-[480px] overflow-hidden">
                <img 
                  src={currentService.image}
                  alt={currentService.title}
                  className="w-full h-full object-cover transition-all duration-1000 ease-in-out"
                />
                
                {/* 浮动图标 */}
                <div className="absolute top-8 left-8 w-20 h-20 bg-white rounded-2xl shadow-2xl flex items-center justify-center text-3xl z-10">
                  <FontAwesomeIcon icon={currentService.icon} className="text-gray-700" />
                </div>

                {/* 轮播控制按钮 */}
                <button 
                  onClick={goToPrevious}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-lg hover:bg-opacity-100 transition-all duration-300 z-10"
                >
                  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <button 
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-lg hover:bg-opacity-100 transition-all duration-300 z-10"
                >
                  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </Col>
            
            {/* 内容区域 */}
            <Col xs={24} lg={12}>
              <div className="p-10 space-y-6">
                {/* 服务标题 */}
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className={`w-14 h-14 bg-gradient-to-br ${currentService.color} rounded-xl flex items-center justify-center text-white text-2xl shadow-lg mr-4`}>
                      <FontAwesomeIcon icon={currentService.icon} />
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-gray-900 leading-tight">
                        {currentService.title}
                      </h3>
                      <p className={`text-sm font-medium bg-gradient-to-r ${currentService.color} bg-clip-text text-transparent uppercase tracking-wider`}>
                        {currentService.subtitle}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* 服务描述 */}
                <p className="text-lg text-gray-600 leading-relaxed">
                  {currentService.description}
                </p>
                
                {/* 服务特色 */}
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-gray-900">核心服务</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentService.features.map((feature, featureIndex) => (
                      <div 
                        key={featureIndex}
                        className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300"
                      >
                        <div className={`w-2 h-2 bg-gradient-to-r ${currentService.color} rounded-full mr-4 flex-shrink-0`}></div>
                        <span className="text-gray-700 font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* 行动按钮 */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button className={`px-8 py-4 bg-gradient-to-r ${currentService.color} text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`} onClick={handleServiceDetailClick}>
                    了解详情
                  </button>
                  <button className="px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-300">
                    获取报价
                  </button>
                </div>
              </div>
            </Col>
          </Row>

          {/* 底部指示器 */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
            {services.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-white shadow-lg' 
                    : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                }`}
              />
            ))}
          </div>

          {/* 进度条 */}
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-200">
            <div 
              className={`h-full bg-gradient-to-r ${currentService.color} transition-all duration-5000 ease-linear`}
              style={{ 
                width: isAutoPlaying ? '100%' : '0%',
                transition: isAutoPlaying ? 'width 5s linear' : 'width 0.3s ease'
              }}
            />
          </div>
        </div>

        {/* 服务总览 */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <button
              key={service.id}
              onClick={() => goToSlide(index)}
              className={`p-6 rounded-2xl border-2 transition-all duration-300 text-center ${
                index === currentSlide 
                  ? `border-blue-500 bg-blue-50 shadow-lg` 
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
              }`}
            >
              <div className={`w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center text-xl ${
                index === currentSlide 
                  ? `bg-gradient-to-br ${service.color} text-white shadow-lg` 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                <FontAwesomeIcon icon={service.icon} />
              </div>
              <h4 className={`font-semibold ${
                index === currentSlide ? 'text-blue-600' : 'text-gray-700'
              }`}>
                {service.title}
              </h4>
            </button>
          ))}
        </div>

        {/* 底部总结 */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-cyan-50 rounded-2xl p-12 border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              一站式物流解决方案
            </h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              从海运到空运，从仓储到关务，我们为您提供完整的供应链管理服务，让您的货物安全、快速地到达目的地
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={handleConsultationClick}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                免费咨询方案
              </button>
              <button 
                onClick={handleExperienceClick}
                className="px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:text-blue-600 transition-all duration-300"
              >
                体验控制塔系统
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 留资弹窗 */}
      <LeadFormModal 
        visible={showLeadForm}
        onClose={() => setShowLeadForm(false)}
      />
    </section>
  );
};

export default PortalSolutions; 