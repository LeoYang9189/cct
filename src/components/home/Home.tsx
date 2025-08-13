import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  // 处理系统跳转
  const handleSystemNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-white">
      <main>
        {/* 简化的主要内容区域 */}
        <div className="bg-gradient-to-b from-white via-accent to-white section-padding min-h-screen flex items-center relative">
          <div className="container-custom relative z-10">
            <div className="flex flex-col items-center text-center">
              {/* 修改后的标题 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1.0] }}
                className="mb-16"
              >
                <h1 className="text-4xl md:text-6xl font-bold text-black mb-6">
                  这个页面是集成原型入口方便跳转，没有实际功能意义！！！！！
                </h1>
              </motion.div>

              {/* 系统入口按钮区域 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1.0], delay: 0.2 }}
                className="w-full max-w-6xl mx-auto"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
                  {[
                    {
                      title: "租户Portal",
                      description: "企业门户管理系统",
                      path: "/portal",
                      icon: (
                        <svg viewBox="0 0 64 64" className="w-12 h-12">
                          <defs>
                            <linearGradient id="portal-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#3B82F6" />
                              <stop offset="100%" stopColor="#1D4ED8" />
                            </linearGradient>
                          </defs>
                          <rect x="8" y="12" width="48" height="40" rx="4" fill="url(#portal-gradient)" />
                          <rect x="12" y="16" width="40" height="4" rx="2" fill="white" opacity="0.9" />
                          <rect x="12" y="24" width="16" height="20" rx="2" fill="white" opacity="0.8" />
                          <rect x="32" y="24" width="20" height="8" rx="2" fill="white" opacity="0.7" />
                          <rect x="32" y="36" width="20" height="8" rx="2" fill="white" opacity="0.6" />
                        </svg>
                      ),
                      gradient: "from-blue-500 to-blue-700",
                      hoverGradient: "from-blue-600 to-blue-800"
                    },
                    {
                      title: "运营版控制塔",
                      description: "全方位运营管理平台",
                      path: "/controltower",
                      icon: (
                        <svg viewBox="0 0 64 64" className="w-12 h-12">
                          <defs>
                            <linearGradient id="control-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#10B981" />
                              <stop offset="100%" stopColor="#047857" />
                            </linearGradient>
                          </defs>
                          <circle cx="32" cy="32" r="24" fill="url(#control-gradient)" />
                          <circle cx="32" cy="32" r="16" fill="white" opacity="0.2" />
                          <circle cx="32" cy="32" r="8" fill="white" opacity="0.4" />
                          <circle cx="32" cy="32" r="4" fill="white" />
                          <rect x="30" y="8" width="4" height="12" fill="url(#control-gradient)" />
                          <rect x="44" y="30" width="12" height="4" fill="url(#control-gradient)" />
                          <rect x="30" y="44" width="4" height="12" fill="url(#control-gradient)" />
                          <rect x="8" y="30" width="12" height="4" fill="url(#control-gradient)" />
                        </svg>
                      ),
                      gradient: "from-emerald-500 to-emerald-700",
                      hoverGradient: "from-emerald-600 to-emerald-800"
                    },
                    {
                      title: "客户端控制塔",
                      description: "客户专属操作界面",
                      path: "/controltower-client",
                      icon: (
                        <svg viewBox="0 0 64 64" className="w-12 h-12">
                          <defs>
                            <linearGradient id="client-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#8B5CF6" />
                              <stop offset="100%" stopColor="#5B21B6" />
                            </linearGradient>
                          </defs>
                          <rect x="12" y="16" width="40" height="32" rx="4" fill="url(#client-gradient)" />
                          <rect x="16" y="20" width="32" height="2" rx="1" fill="white" opacity="0.8" />
                          <rect x="16" y="26" width="24" height="2" rx="1" fill="white" opacity="0.6" />
                          <rect x="16" y="32" width="28" height="2" rx="1" fill="white" opacity="0.6" />
                          <rect x="16" y="38" width="20" height="2" rx="1" fill="white" opacity="0.6" />
                          <circle cx="44" cy="28" r="6" fill="white" opacity="0.3" />
                          <circle cx="44" cy="28" r="3" fill="white" opacity="0.8" />
                        </svg>
                      ),
                      gradient: "from-purple-500 to-purple-700",
                      hoverGradient: "from-purple-600 to-purple-800"
                    },
                    {
                      title: "平台运营端",
                      description: "系统管理后台",
                      path: "/platformadmin/login",
                      icon: (
                        <svg viewBox="0 0 64 64" className="w-12 h-12">
                          <defs>
                            <linearGradient id="admin-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#F59E0B" />
                              <stop offset="100%" stopColor="#D97706" />
                            </linearGradient>
                          </defs>
                          <rect x="8" y="12" width="48" height="40" rx="4" fill="url(#admin-gradient)" />
                          <rect x="12" y="16" width="40" height="6" rx="2" fill="white" opacity="0.9" />
                          <rect x="12" y="26" width="18" height="22" rx="2" fill="white" opacity="0.2" />
                          <rect x="34" y="26" width="18" height="10" rx="2" fill="white" opacity="0.3" />
                          <rect x="34" y="38" width="18" height="10" rx="2" fill="white" opacity="0.3" />
                          <circle cx="21" cy="31" r="3" fill="white" opacity="0.8" />
                          <rect x="16" y="36" width="10" height="2" rx="1" fill="white" opacity="0.6" />
                          <rect x="16" y="40" width="8" height="2" rx="1" fill="white" opacity="0.6" />
                        </svg>
                      ),
                      gradient: "from-amber-500 to-amber-700",
                      hoverGradient: "from-amber-600 to-amber-800"
                    },
                    {
                      title: "WallTech首页",
                      description: "WallTech产品展示首页",
                      path: "/walltech",
                      icon: (
                        <svg viewBox="0 0 64 64" className="w-12 h-12">
                          <defs>
                            <linearGradient id="walltech-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#EC4899" />
                              <stop offset="100%" stopColor="#BE185D" />
                            </linearGradient>
                          </defs>
                          <rect x="8" y="16" width="48" height="32" rx="6" fill="url(#walltech-gradient)" />
                          <rect x="12" y="20" width="40" height="24" rx="4" fill="white" opacity="0.2" />
                          <circle cx="32" cy="32" r="8" fill="white" opacity="0.9" />
                          <path d="M32 26l3 3-3 3-3-3 3-3z" fill="url(#walltech-gradient)" />
                          <path d="M32 34l3 3-3 3-3-3 3-3z" fill="url(#walltech-gradient)" />
                          <rect x="16" y="24" width="8" height="2" rx="1" fill="white" opacity="0.6" />
                          <rect x="40" y="24" width="8" height="2" rx="1" fill="white" opacity="0.6" />
                          <rect x="16" y="38" width="8" height="2" rx="1" fill="white" opacity="0.6" />
                          <rect x="40" y="38" width="8" height="2" rx="1" fill="white" opacity="0.6" />
                        </svg>
                      ),
                      gradient: "from-pink-500 to-pink-700",
                      hoverGradient: "from-pink-600 to-pink-800"
                    }
                  ].map((system, index) => (
                    <motion.button
                      key={index}
                      onClick={() => handleSystemNavigation(system.path)}
                      className={`bg-gradient-to-br ${system.gradient} hover:${system.hoverGradient} text-white rounded-2xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 group relative overflow-hidden min-h-[200px] sm:min-h-[220px]`}
                      whileHover={{
                        scale: 1.05,
                        y: -8,
                        transition: { duration: 0.2 }
                      }}
                      whileTap={{
                        scale: 0.98,
                        transition: { duration: 0.1 }
                      }}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.6,
                        delay: 0.1 * index,
                        ease: [0.25, 0.1, 0.25, 1.0]
                      }}
                    >
                      {/* 背景光效 */}
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none"></div>
                      
                      {/* 内容 */}
                      <div className="relative z-10 flex flex-col items-center text-center space-y-4 pointer-events-none">
                        <div className="transform group-hover:scale-110 transition-transform duration-300">
                          {system.icon}
                        </div>
                        <div>
                          <h3 className="text-lg sm:text-xl font-bold mb-2 group-hover:text-white transition-colors duration-300">
                            {system.title}
                          </h3>
                          <p className="text-xs sm:text-sm opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                            {system.description}
                          </p>
                        </div>
                        
                        {/* 箭头图标 */}
                        <div className="mt-4 transform group-hover:translate-x-1 transition-transform duration-300">
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </div>
                      </div>

                      {/* 底部装饰线 */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left pointer-events-none"></div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
             </div>
           </div>
         </div>
       </main>
     </div>
   );
 };

export default Home;