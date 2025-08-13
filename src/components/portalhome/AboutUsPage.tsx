import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBuilding, 
  faHistory, 
  faGlobe, 
  faPhone,
  faEnvelope,
  faMapMarkerAlt,
  faUsers,
  faTrophy,
  faHandshake,
  faRocket,
  faUser,
  faTruck
} from '@fortawesome/free-solid-svg-icons';
import PortalHeader from './PortalHeader';
import PortalFooter from './PortalFooter';
import { UserProvider } from './UserContext';

const AboutUsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState('company');

  const sections = [
    { key: 'company', title: '公司简介', icon: faBuilding },
    { key: 'history', title: '发展历程', icon: faHistory },
    { key: 'network', title: '分公司网络', icon: faGlobe },
    { key: 'contact', title: '联系方式', icon: faPhone }
  ];

  const companyStats = [
    { number: '15+', label: '年专业经验', icon: faTrophy },
    { number: '5000+', label: '服务客户', icon: faUsers },
    { number: '300+', label: '合作港口', icon: faHandshake },
    { number: '50+', label: '城市网络', icon: faGlobe }
  ];

  return (
    <UserProvider>
      <div className="min-h-screen bg-gray-50">
        <PortalHeader />
        
        {/* 导航Tab */}
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {sections.map((section) => (
                <button
                  key={section.key}
                  onClick={() => setActiveSection(section.key)}
                  className={`
                    flex flex-col items-center p-6 rounded-xl border-2 transition-all duration-300
                    ${activeSection === section.key 
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-blue-50 hover:border-blue-300'
                    }
                  `}
                >
                  <FontAwesomeIcon 
                    icon={section.icon} 
                    className={`text-3xl mb-3 ${activeSection === section.key ? 'text-white' : 'text-blue-600'}`} 
                  />
                  <span className="font-semibold text-lg">{section.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 内容区域 */}
          {activeSection === 'company' && (
            <div className="space-y-8">
              {/* 公司简介主要内容 */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                  {/* 图片区域 */}
                  <div className="relative h-64 lg:h-auto">
                    <img
                      src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                      alt="公司总部"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-transparent"></div>
                  </div>
                  
                  {/* 内容区域 */}
                  <div className="p-8 lg:p-12">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                        <FontAwesomeIcon icon={faBuilding} className="text-white text-xl" />
                      </div>
                      <h2 className="text-3xl font-bold text-gray-900">关于我们</h2>
                    </div>
                    
                    <div className="space-y-6 text-gray-600 leading-relaxed">
                      <p className="text-lg">
                        我们是一家专业的国际物流服务提供商，成立于2009年，总部位于上海。经过15年的稳健发展，我们已成长为业内领先的综合性物流企业，致力于为全球客户提供一站式的物流解决方案。
                      </p>
                      
                      <p>
                        公司始终秉承"专业、高效、诚信、创新"的经营理念，凭借丰富的行业经验、专业的服务团队和完善的服务网络，为客户提供海运、空运、仓储、关务等全方位的物流服务。我们深耕国际物流领域，与全球500多家船公司、200多家航空公司建立了稳定的合作关系。
                      </p>
                      
                      <p>
                        作为AEO高级认证企业，我们严格遵循国际标准，建立了完善的质量管理体系和风险控制体系。公司拥有一支专业化的服务团队，包括资深的报关师、物流专家、客服人员等，为客户提供7×24小时的专业服务。
                      </p>
                      
                      <p>
                        展望未来，我们将继续深化数字化转型，利用大数据、人工智能等新技术，打造更加智能化的物流服务平台，为客户创造更大价值，成为全球领先的数字化物流服务商。
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 公司数据统计 */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">发展成果</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {companyStats.map((stat, index) => (
                    <div key={index} className="text-center group">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                        <FontAwesomeIcon icon={stat.icon} className="text-white text-xl" />
                      </div>
                      <div className="text-3xl font-bold text-blue-600 mb-2">{stat.number}</div>
                      <div className="text-gray-600 font-medium">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 企业文化 */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">企业文化</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center p-6 bg-blue-50 rounded-xl">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <span className="text-white font-bold text-lg">专</span>
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2">专业</h4>
                    <p className="text-gray-600 text-sm">专业的团队，专业的服务，为客户提供最优质的物流解决方案</p>
                  </div>
                  
                  <div className="text-center p-6 bg-indigo-50 rounded-xl">
                    <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <span className="text-white font-bold text-lg">效</span>
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2">高效</h4>
                    <p className="text-gray-600 text-sm">高效的运作流程，快速响应客户需求，节约客户时间成本</p>
                  </div>
                  
                  <div className="text-center p-6 bg-cyan-50 rounded-xl">
                    <div className="w-12 h-12 bg-cyan-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <span className="text-white font-bold text-lg">诚</span>
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2">诚信</h4>
                    <p className="text-gray-600 text-sm">诚信为本，言出必行，建立长期稳定的合作关系</p>
                  </div>
                  
                  <div className="text-center p-6 bg-sky-50 rounded-xl">
                    <div className="w-12 h-12 bg-sky-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <FontAwesomeIcon icon={faRocket} className="text-white text-lg" />
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2">创新</h4>
                    <p className="text-gray-600 text-sm">持续创新，引入新技术新理念，推动行业发展进步</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 发展历程 */}
          {activeSection === 'history' && (
            <div className="space-y-8">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center justify-center mb-8">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                    <FontAwesomeIcon icon={faHistory} className="text-white text-xl" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">发展历程</h2>
                </div>
                
                <div className="relative">
                  {/* 时间线 */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-blue-600 to-indigo-600 h-full"></div>
                  
                  <div className="space-y-12">
                    {/* 2009年 */}
                    <div className="relative flex items-center">
                      <div className="flex-1 text-right pr-8">
                        <div className="bg-blue-50 rounded-xl p-6 border-l-4 border-blue-600">
                          <h3 className="text-xl font-bold text-blue-600 mb-2">2009年</h3>
                          <h4 className="text-lg font-semibold text-gray-900 mb-2">公司成立</h4>
                          <p className="text-gray-600">
                            在上海正式成立，专注于国际物流服务，初期主要从事海运货代业务，为华东地区的进出口企业提供专业的物流服务。
                          </p>
                        </div>
                      </div>
                      <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-lg"></div>
                      <div className="flex-1 pl-8"></div>
                    </div>

                    {/* 2012年 */}
                    <div className="relative flex items-center">
                      <div className="flex-1 pr-8"></div>
                      <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-indigo-600 rounded-full border-4 border-white shadow-lg"></div>
                      <div className="flex-1 pl-8">
                        <div className="bg-indigo-50 rounded-xl p-6 border-r-4 border-indigo-600">
                          <h3 className="text-xl font-bold text-indigo-600 mb-2">2012年</h3>
                          <h4 className="text-lg font-semibold text-gray-900 mb-2">业务拓展</h4>
                          <p className="text-gray-600">
                            业务范围扩展至空运、陆运领域，在深圳设立首个分公司，开始向全国性物流企业发展，客户数量突破500家。
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* 2015年 */}
                    <div className="relative flex items-center">
                      <div className="flex-1 text-right pr-8">
                        <div className="bg-cyan-50 rounded-xl p-6 border-l-4 border-cyan-600">
                          <h3 className="text-xl font-bold text-cyan-600 mb-2">2015年</h3>
                          <h4 className="text-lg font-semibold text-gray-900 mb-2">数字化转型</h4>
                          <p className="text-gray-600">
                            启动数字化转型项目，自主研发物流管理系统，实现全流程数字化管理，提升服务效率和客户体验。
                          </p>
                        </div>
                      </div>
                      <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-cyan-600 rounded-full border-4 border-white shadow-lg"></div>
                      <div className="flex-1 pl-8"></div>
                    </div>

                    {/* 2018年 */}
                    <div className="relative flex items-center">
                      <div className="flex-1 pr-8"></div>
                      <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-sky-600 rounded-full border-4 border-white shadow-lg"></div>
                      <div className="flex-1 pl-8">
                        <div className="bg-sky-50 rounded-xl p-6 border-r-4 border-sky-600">
                          <h3 className="text-xl font-bold text-sky-600 mb-2">2018年</h3>
                          <h4 className="text-lg font-semibold text-gray-900 mb-2">资质认证</h4>
                          <p className="text-gray-600">
                            获得AEO高级认证，成为海关信任企业，在北京、广州、青岛等主要城市设立分公司，全国服务网络初步建成。
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* 2020年 */}
                    <div className="relative flex items-center">
                      <div className="flex-1 text-right pr-8">
                        <div className="bg-blue-50 rounded-xl p-6 border-l-4 border-blue-700">
                          <h3 className="text-xl font-bold text-blue-700 mb-2">2020年</h3>
                          <h4 className="text-lg font-semibold text-gray-900 mb-2">疫情挑战</h4>
                          <p className="text-gray-600">
                            面对疫情挑战，快速调整业务模式，推出线上服务平台，为客户提供无接触式物流服务，业务量逆势增长30%。
                          </p>
                        </div>
                      </div>
                      <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-700 rounded-full border-4 border-white shadow-lg"></div>
                      <div className="flex-1 pl-8"></div>
                    </div>

                    {/* 2022年 */}
                    <div className="relative flex items-center">
                      <div className="flex-1 pr-8"></div>
                      <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-indigo-700 rounded-full border-4 border-white shadow-lg"></div>
                      <div className="flex-1 pl-8">
                        <div className="bg-indigo-50 rounded-xl p-6 border-r-4 border-indigo-700">
                          <h3 className="text-xl font-bold text-indigo-700 mb-2">2022年</h3>
                          <h4 className="text-lg font-semibold text-gray-900 mb-2">智能升级</h4>
                          <p className="text-gray-600">
                            投入AI和大数据技术，推出智能物流平台，实现运输路径优化、风险预警等功能，服务客户超过3000家。
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* 2024年 */}
                    <div className="relative flex items-center">
                      <div className="flex-1 text-right pr-8">
                        <div className="bg-cyan-50 rounded-xl p-6 border-l-4 border-cyan-700">
                          <h3 className="text-xl font-bold text-cyan-700 mb-2">2024年</h3>
                          <h4 className="text-lg font-semibold text-gray-900 mb-2">新的里程碑</h4>
                          <p className="text-gray-600">
                            服务客户突破5000家，业务覆盖全球50多个国家和地区，成为华东地区最具影响力的物流企业之一。
                          </p>
                        </div>
                      </div>
                      <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-cyan-700 rounded-full border-4 border-white shadow-lg"></div>
                      <div className="flex-1 pl-8"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 发展成就 */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">发展成就</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FontAwesomeIcon icon={faTrophy} className="text-white text-xl" />
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2">行业认可</h4>
                    <p className="text-gray-600 text-sm">
                      获得AEO高级认证、ISO9001质量管理体系认证等多项权威认证，荣获"优秀物流企业"等行业奖项
                    </p>
                  </div>
                  
                  <div className="text-center p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl">
                    <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FontAwesomeIcon icon={faUsers} className="text-white text-xl" />
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2">团队建设</h4>
                    <p className="text-gray-600 text-sm">
                      拥有300多名专业员工，其中包括50多名资深报关师和物流专家，为客户提供专业服务
                    </p>
                  </div>
                  
                  <div className="text-center p-6 bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl">
                    <div className="w-16 h-16 bg-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FontAwesomeIcon icon={faRocket} className="text-white text-xl" />
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2">技术创新</h4>
                    <p className="text-gray-600 text-sm">
                      自主研发的智能物流平台获得多项软件著作权，在行业数字化转型中处于领先地位
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 分公司网络 */}
          {activeSection === 'network' && (
            <div className="space-y-8">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center justify-center mb-8">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                    <FontAwesomeIcon icon={faGlobe} className="text-white text-xl" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">分公司网络</h2>
                </div>
                
                {/* 网络概览 */}
                <div className="text-center mb-12">
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                    我们在全国主要城市和重要口岸设立了分公司，形成了覆盖全国的服务网络，
                    为客户提供就近的专业物流服务，确保快速响应和高效服务。
                  </p>
                </div>

                {/* 主要分公司 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                        <FontAwesomeIcon icon={faBuilding} className="text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-blue-900">上海总部</h3>
                    </div>
                    <p className="text-blue-800 text-sm mb-3">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                      上海市浦东新区张江高科技园区
                    </p>
                    <p className="text-blue-700 text-sm">
                      华东地区总部，负责统筹管理，海运、空运业务中心
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6 border border-indigo-200">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center mr-3">
                        <FontAwesomeIcon icon={faBuilding} className="text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-indigo-900">深圳分公司</h3>
                    </div>
                    <p className="text-indigo-800 text-sm mb-3">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                      深圳市福田区华强北商业区
                    </p>
                    <p className="text-indigo-700 text-sm">
                      华南地区中心，主要服务珠三角地区客户
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl p-6 border border-cyan-200">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-cyan-600 rounded-lg flex items-center justify-center mr-3">
                        <FontAwesomeIcon icon={faBuilding} className="text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-cyan-900">北京分公司</h3>
                    </div>
                    <p className="text-cyan-800 text-sm mb-3">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                      北京市朝阳区CBD商务中心区
                    </p>
                    <p className="text-cyan-700 text-sm">
                      华北地区中心，专注于政府企业物流服务
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-sky-50 to-sky-100 rounded-xl p-6 border border-sky-200">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-sky-600 rounded-lg flex items-center justify-center mr-3">
                        <FontAwesomeIcon icon={faBuilding} className="text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-sky-900">广州分公司</h3>
                    </div>
                    <p className="text-sky-800 text-sm mb-3">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                      广州市天河区珠江新城
                    </p>
                    <p className="text-sky-700 text-sm">
                      华南地区重要节点，服务进出口贸易企业
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-300">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center mr-3">
                        <FontAwesomeIcon icon={faBuilding} className="text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-blue-900">青岛分公司</h3>
                    </div>
                    <p className="text-blue-800 text-sm mb-3">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                      青岛市市南区青岛港附近
                    </p>
                    <p className="text-blue-700 text-sm">
                      重要港口节点，专业海运物流服务
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6 border border-indigo-300">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-indigo-700 rounded-lg flex items-center justify-center mr-3">
                        <FontAwesomeIcon icon={faBuilding} className="text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-indigo-900">宁波分公司</h3>
                    </div>
                    <p className="text-indigo-800 text-sm mb-3">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                      宁波市鄞州区东部新城
                    </p>
                    <p className="text-indigo-700 text-sm">
                      长三角重要港口，专业港口物流服务
                    </p>
                  </div>
                </div>

                {/* 海外合作伙伴 */}
                <div className="mt-12">
                  <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">海外合作网络</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 mb-2">美国</div>
                      <div className="text-gray-600 text-sm">洛杉矶、纽约</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-indigo-600 mb-2">欧洲</div>
                      <div className="text-gray-600 text-sm">汉堡、鹿特丹</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-cyan-600 mb-2">东南亚</div>
                      <div className="text-gray-600 text-sm">新加坡、曼谷</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-sky-600 mb-2">澳洲</div>
                      <div className="text-gray-600 text-sm">悉尼、墨尔本</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 联系方式 */}
          {activeSection === 'contact' && (
            <div className="space-y-8">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center justify-center mb-8">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                    <FontAwesomeIcon icon={faPhone} className="text-white text-xl" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">联系方式</h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* 联系信息 */}
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                          <FontAwesomeIcon icon={faPhone} className="text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-blue-900">客服热线</h3>
                      </div>
                      <p className="text-blue-800 text-lg font-semibold mb-2">400-888-9999</p>
                      <p className="text-blue-700 text-sm">
                        工作时间：周一至周五 8:30-18:00<br />
                        24小时紧急服务热线：138-0123-4567
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-xl p-6 border border-indigo-200">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center mr-3">
                          <FontAwesomeIcon icon={faEnvelope} className="text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-indigo-900">邮箱地址</h3>
                      </div>
                      <p className="text-indigo-800 text-lg font-semibold mb-2">info@wooo-logistics.com</p>
                      <p className="text-indigo-700 text-sm">
                        商务合作：business@wooo-logistics.com<br />
                        技术支持：support@wooo-logistics.com
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-cyan-50 to-cyan-100 rounded-xl p-6 border border-cyan-200">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-cyan-600 rounded-lg flex items-center justify-center mr-3">
                          <FontAwesomeIcon icon={faMapMarkerAlt} className="text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-cyan-900">总部地址</h3>
                      </div>
                      <p className="text-cyan-800 text-lg font-semibold mb-2">
                        上海市浦东新区张江高科技园区<br />
                        科苑路123号创新大厦15楼
                      </p>
                      <p className="text-cyan-700 text-sm">邮编：201203</p>
                    </div>
                  </div>

                  {/* 微信二维码和在线服务 */}
                  <div className="space-y-6">
                    {/* 微信二维码 */}
                    <div className="bg-gradient-to-r from-sky-50 to-sky-100 rounded-xl p-6 border border-sky-200 text-center">
                      <h3 className="text-lg font-bold text-sky-900 mb-4">微信客服</h3>
                      <div className="flex justify-center mb-4">
                        <img 
                          src="/WX20250623-164557@2x.png" 
                          alt="微信客服二维码" 
                          className="w-32 h-32 object-contain rounded-lg"
                        />
                      </div>
                      <p className="text-sky-700 text-sm">
                        扫描二维码添加客服微信<br />
                        获取专业物流咨询服务
                      </p>
                    </div>

                    {/* 在线服务 */}
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-300">
                      <h3 className="text-lg font-bold text-blue-900 mb-4">在线服务</h3>
                      <div className="space-y-3">
                        <button 
                          onClick={() => window.open('/portal/auth', '_blank')}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                        >
                          <FontAwesomeIcon icon={faUser} className="mr-2" />
                          登录客户系统
                        </button>
                                                 <button 
                           onClick={() => setActiveSection('company')}
                           className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                         >
                           <FontAwesomeIcon icon={faBuilding} className="mr-2" />
                           查看公司简介
                         </button>
                        <button 
                          onClick={() => window.open('/portal/business-services', '_blank')}
                          className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                        >
                          <FontAwesomeIcon icon={faTruck} className="mr-2" />
                          了解我们的服务
                        </button>
                      </div>
                    </div>

                    {/* 快速联系 */}
                    <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-xl p-6 border border-indigo-300">
                      <h3 className="text-lg font-bold text-indigo-900 mb-4">快速联系</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <a 
                          href="tel:400-888-9999"
                          className="bg-white hover:bg-gray-50 text-indigo-700 hover:text-indigo-800 border-2 border-indigo-600 font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center text-sm"
                        >
                          <FontAwesomeIcon icon={faPhone} className="mr-2" />
                          立即致电
                        </a>
                        <a 
                          href="mailto:info@wooo-logistics.com"
                          className="bg-white hover:bg-gray-50 text-sky-700 hover:text-sky-800 border-2 border-sky-600 font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center text-sm"
                        >
                          <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                          发送邮件
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <PortalFooter />
      </div>
    </UserProvider>
  );
};

export default AboutUsPage; 