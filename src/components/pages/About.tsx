import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faShip, 
  faUsers, 
  faGlobe, 
  faTrophy,
  faLightbulb,
  faHeart,
  faShield,
  faRocket,
  faHandshake,
  faStar,
  faArrowLeft
} from '@fortawesome/free-solid-svg-icons';

const About: React.FC = () => {
  const coreValues = [
    {
      icon: faLightbulb,
      title: '创新驱动',
      description: '持续技术创新，为客户提供智能化物流解决方案',
      color: 'from-yellow-400 to-orange-500'
    },
    {
      icon: faHeart,
      title: '客户至上',
      description: '以客户需求为中心，提供贴心专业的服务体验',
      color: 'from-red-400 to-pink-500'
    },
    {
      icon: faShield,
      title: '诚信可靠',
      description: '诚实守信，为客户提供安全可靠的物流保障',
      color: 'from-blue-400 to-indigo-500'
    },
    {
      icon: faRocket,
      title: '高效执行',
      description: '追求卓越，以高效的执行力创造最大价值',
      color: 'from-purple-400 to-violet-500'
    },
    {
      icon: faHandshake,
      title: '合作共赢',
      description: '与合作伙伴携手共进，实现互利共赢',
      color: 'from-green-400 to-emerald-500'
    },
    {
      icon: faStar,
      title: '追求卓越',
      description: '不断提升服务标准，追求行业领先地位',
      color: 'from-cyan-400 to-teal-500'
    }
  ];

  const milestones = [
    {
      year: '2018',
      title: '公司成立',
      description: '在上海成立，专注于智慧物流平台开发'
    },
    {
      year: '2019',
      title: '产品发布',
      description: '推出第一代超级运价系统，服务百家企业'
    },
    {
      year: '2020',
      title: '技术突破',
      description: '引入AI技术，实现智能运价分析和预测'
    },
    {
      year: '2021',
      title: '业务扩展',
      description: '拓展控制塔和智慧箱管产品线'
    },
    {
      year: '2022',
      title: '规模增长',
      description: '服务客户超过1000家，覆盖全球主要航线'
    },
    {
      year: '2023',
      title: '平台升级',
      description: '推出新一代智慧物流生态平台'
    }
  ];

  const teamMembers = [
    {
      name: '张伟',
      position: '首席执行官',
      description: '15年物流行业经验，曾任大型船公司亚洲区总监',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
    },
    {
      name: '李敏',
      position: '技术总监',
      description: '前阿里巴巴技术专家，专注于物流信息化技术',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b734?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
    },
    {
      name: '王强',
      position: '产品总监',
      description: '10年产品设计经验，深度理解物流业务场景',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
    },
    {
      name: '刘晓',
      position: '运营总监',
      description: '资深物流专家，拥有丰富的客户服务经验',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
    }
  ];

  const stats = [
    { number: '1000+', label: '服务企业', icon: faUsers },
    { number: '50+', label: '覆盖国家', icon: faGlobe },
    { number: '500万+', label: '处理订单', icon: faShip },
    { number: '99.9%', label: '系统稳定性', icon: faTrophy }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 返回首页按钮 */}
      <Link
        to="/"
        className="fixed top-6 left-6 z-50 flex items-center px-4 py-2 bg-white/90 backdrop-blur-sm text-gray-700 hover:text-blue-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
        返回首页
      </Link>

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-black/20"></div>
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 bg-white/10 rounded-full animate-bounce"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/10 rounded-full animate-ping"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              关于
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent"> 我们</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 leading-relaxed">
              致力于打造全球领先的智慧物流生态平台，<br />
              用科技重新定义物流行业的未来
            </p>
          </motion.div>
        </div>

        {/* 装饰性波浪 */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <svg
            className="relative block w-full h-20"
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
              fill="rgb(249 250 251)"
            ></path>
          </svg>
        </div>
      </section>

      {/* 公司介绍 */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-8">
              我们的
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> 故事</span>
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              作为物流科技领域的创新者，我们始终相信技术的力量能够改变传统物流行业。
              自2018年成立以来，我们专注于为全球物流企业提供智能化、数字化的解决方案，
              通过超级运价系统、控制塔平台、智慧箱管等产品，帮助客户提升运营效率，降低成本，
              实现业务的快速增长。
            </p>
          </motion.div>

          {/* 统计数据 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FontAwesomeIcon icon={stat.icon} className="text-white text-2xl" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 核心价值观 */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-8">
              核心
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> 价值观</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              我们的价值观指引着我们的每一个决策和行动，这些价值观塑造了我们的企业文化
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreValues.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${value.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <FontAwesomeIcon icon={value.icon} className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 发展历程 */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-8">
              发展
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> 历程</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              从初创公司到行业领导者，见证我们的成长足迹
            </p>
          </motion.div>

          <div className="relative">
            {/* 时间线 */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>

            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className={`relative flex items-center mb-12 ${
                  index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                }`}
              >
                <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                  <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="text-2xl font-bold text-blue-600 mb-2">{milestone.year}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{milestone.title}</h3>
                    <p className="text-gray-600">{milestone.description}</p>
                  </div>
                </div>

                {/* 时间点 */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-4 border-blue-500 rounded-full"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 团队介绍 */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-8">
              核心
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> 团队</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              汇聚行业精英，用专业和热忱推动物流科技创新
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                <div className="text-center">
                  <div className="relative mb-6">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-24 h-24 rounded-full mx-auto object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 w-24 h-24 rounded-full mx-auto bg-gradient-to-r from-blue-500/20 to-purple-600/20 group-hover:scale-110 transition-transform duration-300"></div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                    {member.name}
                  </h3>
                  <div className="text-blue-600 font-medium mb-3">{member.position}</div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {member.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 联系我们 */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-4xl font-bold text-white mb-8">
              加入我们的
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent"> 生态</span>
            </h2>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              如果您对我们的产品感兴趣，或希望成为我们的合作伙伴，
              我们很乐意与您交流探讨
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/portal/auth"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                体验产品
              </Link>
              <button className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-300">
                联系我们
              </button>
            </div>

            <div className="mt-12 text-blue-100">
              <p className="mb-2">📧 contact@walltech.com</p>
              <p className="mb-2">📞 400-0682-666</p>
              <p>📍 上海市浦东新区张江高科技园区</p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About; 