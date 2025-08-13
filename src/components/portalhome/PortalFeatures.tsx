import React from 'react';
import { 
  IconDashboard, 
  IconRobot, 
  IconSearch,
  IconSafe,
  IconCloud,
  IconThunderbolt
} from '@arco-design/web-react/icon';

const PortalFeatures: React.FC = () => {
  const features = [
    {
      icon: <IconDashboard className="text-white text-3xl" />,
      title: '智能控制面板',
      description: '直观的数据可视化，实时监控业务状况，智能决策支持系统。',
      color: 'from-blue-300 to-blue-400',
      bgColor: 'bg-blue-50'
    },
    {
      icon: <IconRobot className="text-white text-3xl" />,
      title: 'AI助手实时回复',
      description: '24/7智能客服机器人，即时响应客户询价，提供专业运价咨询服务。',
      color: 'from-green-300 to-green-400',
      bgColor: 'bg-green-50'
    },
    {
      icon: <IconSearch className="text-white text-3xl" />,
      title: '海量运价实时查询',
      description: '覆盖全球航线运价数据库，毫秒级查询响应，实时市场价格更新。',
      color: 'from-purple-300 to-purple-400',
      bgColor: 'bg-purple-50'
    },
    {
      icon: <IconCloud className="text-white text-3xl" />,
      title: '端到端全流程线上化',
      description: '从询价到订舱全流程数字化，无纸化操作，提升业务效率。',
      color: 'from-orange-300 to-orange-400',
      bgColor: 'bg-orange-50'
    },
    {
      icon: <IconThunderbolt className="text-white text-3xl" />,
      title: 'AI识别解放双手',
      description: '智能文档识别，自动提取合约信息，OCR技术释放人力资源。',
      color: 'from-cyan-300 to-cyan-400',
      bgColor: 'bg-cyan-50'
    },
    {
      icon: <IconSafe className="text-white text-3xl" />,
      title: '企业级数据安全',
      description: '银行级安全保障，数据加密传输存储，完善的权限管理体系。',
      color: 'from-red-300 to-red-400',
      bgColor: 'bg-red-50'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-100 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-purple-100 rounded-full opacity-40 animate-bounce"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-green-100 rounded-full opacity-20 animate-ping"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold text-sm uppercase tracking-wider">
              核心功能
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            系统功能
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">特点</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            智能化物流管理平台，为您的业务提供全方位的功能支持，让工作更高效、更智能
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden ${feature.bgColor} border border-gray-100`}
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              {/* 渐变背景装饰 */}
              <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${feature.color} opacity-10 rounded-bl-full transition-all duration-500 group-hover:scale-110`}></div>
              
              <div className="relative p-8">
                {/* 图标容器 */}
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                  {feature.icon}
                </div>
                
                {/* 内容 */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
                
                {/* 悬停时的底部装饰线 */}
                <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${feature.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortalFeatures; 