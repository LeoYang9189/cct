import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import octopusAvatar from '../../assets/octopus-avatar-new.svg';

const Hero = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('什么是沃宝？');
  const [displayedInput, setDisplayedInput] = useState('');
  const [isDialogExpanded, setIsDialogExpanded] = useState(false);
  const [isTyping, setIsTyping] = useState(true);

  // 打字机效果
  useEffect(() => {
    if (!isTyping) return;

    const text = '什么是沃宝？';
    let currentIndex = 0;

    const typingInterval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedInput(text.substring(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);

        // 重置打字机效果，循环播放
        setTimeout(() => {
          setDisplayedInput('');
          currentIndex = 0;
          setIsTyping(true);
        }, 3000);
      }
    }, 150);

    return () => clearInterval(typingInterval);
  }, [isTyping]);

  // 示例对话数据 - 修改为单个气泡
  const chatMessages = [
    {
      sender: 'bot',
      avatar: octopusAvatar,
      content: 'Hello, 我叫沃宝\n\nWallTech创造了我，赋予了我理解大家语言的能力，当然我也在快速训练、学习成长中，请各位多多支持呀~\n\n如果你想了解我们的产品，你可以这样问：',
      time: '06月13日 13:04'
    }
  ];

  // 示例问题建议
  const suggestedQuestions = [
    '什么是沃宝？有什么功能？',
    'Wo AI！包含哪些产品？或功能模块？',
    '物流可视平台的时效性能达到什么程度？数据多长时间更新一次？',
    '能识别哪些类型的单证呢？识别率是多少？',
  ];

  // 处理对话框点击
  const handleDialogClick = () => {
    setIsDialogExpanded(true);
  };

  // 处理关闭对话
  const handleCloseDialog = () => {
    setIsDialogExpanded(false);
  };

  // 处理问题选择
  const handleQuestionSelect = (question: string) => {
    setInputValue(question);
  };

  // 处理系统跳转
  const handleSystemNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="bg-gradient-to-b from-white via-accent to-white wave-bg section-padding min-h-[80vh] flex items-center relative">
      {/* 背景效果 */}
      <div className="silk-overlay"></div>
      <div className="light-shimmer"></div>

      {/* 弧形波浪线 */}
      <div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden">
        {/* 顶部左侧弧形 */}
        <div className="curved-line" style={{
          top: '-60%',
          left: '-30%',
          width: '120%',
          height: '120%',
          transform: 'rotate(15deg)'
        }}></div>

        {/* 右上角弧形 */}
        <div className="curved-line" style={{
          top: '-80%',
          right: '-50%',
          width: '140%',
          height: '140%',
          transform: 'rotate(-5deg)'
        }}></div>

        {/* 左下方弧形 */}
        <div className="curved-line" style={{
          bottom: '-70%',
          left: '-20%',
          width: '100%',
          height: '120%',
          transform: 'rotate(10deg)'
        }}></div>

        {/* 底部中央弧形 */}
        <div className="curved-line" style={{
          bottom: '-90%',
          left: '20%',
          width: '140%',
          height: '140%',
          transform: 'rotate(-15deg)'
        }}></div>

        {/* 中部弧形 */}
        <div className="curved-line" style={{
          top: '10%',
          right: '-40%',
          width: '90%',
          height: '90%',
          transform: 'rotate(5deg)',
          opacity: '0.1'
        }}></div>

        {/* 中下部弧形 */}
        <div className="curved-line" style={{
          bottom: '-30%',
          left: '5%',
          width: '80%',
          height: '80%',
          transform: 'rotate(-8deg)',
          opacity: '0.08'
        }}></div>

        {/* 小型弧形 */}
        <div className="curved-line" style={{
          top: '15%',
          left: '10%',
          width: '50%',
          height: '50%',
          transform: 'rotate(12deg)',
          opacity: '0.06',
          border: '0.5px solid rgba(237, 210, 248, 0.1)'
        }}></div>

        {/* 右侧小型弧形 */}
        <div className="curved-line" style={{
          top: '40%',
          right: '15%',
          width: '40%',
          height: '40%',
          transform: 'rotate(-20deg)',
          opacity: '0.05',
          border: '0.5px solid rgba(242, 220, 252, 0.08)'
        }}></div>
      </div>

      {/* 柔和的渐变色背景块 */}
      <div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden">
        <div className="aurora-wave aurora-wave-1"></div>
        <div className="aurora-wave aurora-wave-2"></div>
        <div className="aurora-wave aurora-wave-3"></div>
      </div>

      <div className="container-custom relative z-10 hero-content">
        <div className="flex flex-col items-center text-center">
          {/* 主标题 - 当对话框展开时上移 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
              marginTop: isDialogExpanded ? '-60px' : '0px',
              scale: isDialogExpanded ? 0.8 : 1,
            }}
            transition={{
              duration: 0.6,
              ease: [0.25, 0.1, 0.25, 1.0],
              marginTop: { duration: 0.7 },
              scale: { duration: 0.5 }
            }}
            className={`mb-8 ${isDialogExpanded ? 'mt-0' : 'mt-8'}`}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-3">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">开发同学</span>看
              <span className="text-gray-900">下面入口</span>
              <span className="text-4xl md:text-6xl">👇🏻</span>
            </h1>


          </motion.div>

          {/* AI对话区域 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              ease: [0.25, 0.1, 0.25, 1.0],
              delay: 0.1
            }}
            className={`w-full max-w-4xl mx-auto ${isDialogExpanded ? 'mb-8' : 'mb-16'}`}
          >
            {/* 对话界面 - 使用AnimatePresence处理组件的进入和退出 */}
            <AnimatePresence mode="wait">
              {isDialogExpanded ? (
                <motion.div
                  key="expanded-dialog"
                  initial={{ opacity: 0, height: 0, borderRadius: "9999px" }}
                  animate={{
                    opacity: 1,
                    height: "auto",
                    borderRadius: "0.75rem"
                  }}
                  exit={{
                    opacity: 0,
                    height: 0,
                    borderRadius: "9999px",
                    transition: { duration: 0.3 }
                  }}
                  transition={{
                    duration: 0.5,
                    ease: [0.25, 0.1, 0.25, 1.0],
                    height: { duration: 0.4 }
                  }}
                  className="bg-white/90 backdrop-blur-md rounded-xl shadow-xl p-4 overflow-hidden"
                >
                {/* 对话标题栏 */}
                <div className="flex items-center justify-center pb-3 border-b border-gray-100 relative">
                  <div className="absolute left-0">
                    <img src={octopusAvatar} alt="AI助手" className="w-8 h-8" />
                  </div>
                  <h3 className="font-medium text-gray-700">沃宝智能助手</h3>
                  <button
                    type="button"
                    className="absolute right-0 cursor-pointer bg-transparent border-0 p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
                    onClick={handleCloseDialog}
                    aria-label="关闭对话"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 6L6 18M6 6L18 18" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>

                {/* 对话时间戳 */}
                <div className="text-center my-3">
                  <span className="text-xs text-gray-400">{chatMessages[0].time}</span>
                </div>

                {/* 对话内容 - 单个气泡 */}
                <div className="max-h-[400px] overflow-y-auto py-2">
                  <div className="mb-4">
                    <div className="flex items-start">
                      <div className="mr-3 mt-1">
                        <img src={chatMessages[0].avatar} alt="AI助手" className="w-10 h-10" />
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 text-left max-w-[90%]">
                        <p className="text-gray-800 whitespace-pre-line">{chatMessages[0].content}</p>
                      </div>
                    </div>
                  </div>

                  {/* 建议问题列表 */}
                  <div className="mt-6 space-y-3">
                    {suggestedQuestions.map((question, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 hover:bg-gray-100 rounded-lg p-3 text-left cursor-pointer transition-colors"
                        onClick={() => handleQuestionSelect(question)}
                      >
                        <p className="text-primary text-sm">{question}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 底部输入框 */}
                <div className="mt-4 border-t border-gray-100 pt-4 flex items-center">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="flex-1 py-3 px-4 outline-none text-gray-700 bg-gray-50 rounded-l-full"
                    placeholder="在这里输入你的问题..."
                  />
                  <button
                    type="button"
                    className="bg-primary hover:bg-secondary transition-colors duration-300 p-3 rounded-r-full"
                    aria-label="发送消息"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path d="M22 2L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </motion.div>
              ) : (
                // 折叠的对话条
                <motion.div
                  key="collapsed-dialog"
                  initial={{ opacity: 0.9, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{
                    opacity: 0,
                    scale: 0.95,
                    transition: { duration: 0.2 }
                  }}
                  transition={{
                    duration: 0.4,
                    ease: [0.25, 0.1, 0.25, 1.0]
                  }}
                  className="bg-white/90 backdrop-blur-md rounded-full shadow-lg flex items-center p-2 pl-6 cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                  onClick={handleDialogClick}
                >
                <div className="mr-2">
                  <img src={octopusAvatar} alt="智能机器人" className="w-10 h-10" />
                </div>
                <div className="flex-1 py-3 px-4 outline-none text-gray-500 cursor-pointer bg-transparent flex items-center">
                  <span>{displayedInput}</span>
                  <span className="inline-block w-[2px] h-[1em] bg-gray-400 ml-1 animate-blink"></span>
                </div>
                <button
                  type="button"
                  className="bg-primary hover:bg-secondary transition-colors duration-300 p-3 rounded-full ml-2"
                  aria-label="发送消息"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M22 2L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* 系统入口按钮区域 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{
              opacity: 1,
              y: 0,
              marginTop: isDialogExpanded ? '20px' : '0px'
            }}
            transition={{
              duration: 0.8,
              ease: [0.25, 0.1, 0.25, 1.0],
              delay: 0.2,
              marginTop: { duration: 0.6 }
            }}
            className="w-full max-w-6xl mx-auto mb-16"
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

          {/* 特性展示 - 当对话框展开时下移 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
              marginTop: isDialogExpanded ? '620px' : '20px'
            }}
            transition={{
              duration: 0.7,
              ease: [0.25, 0.1, 0.25, 1.0],
              marginTop: { duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }
            }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full max-w-5xl mx-auto"
          >
            {[
              {
                icon: <div className="w-16 h-16 flex items-center justify-center mb-2">
                  <svg viewBox="0 0 128 128" className="w-full h-full">
                    <linearGradient id="ai-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#6366F1" />
                      <stop offset="100%" stopColor="#8B5CF6" />
                    </linearGradient>
                    <circle cx="64" cy="64" r="60" fill="white" stroke="#E5E7EB" strokeWidth="2" />
                    <path d="M64 16c-26.5 0-48 21.5-48 48s21.5 48 48 48 48-21.5 48-48-21.5-48-48-48zm-9 14c5.5 0 10 4.5 10 10s-4.5 10-10 10-10-4.5-10-10 4.5-10 10-10zm-15 48c-5.5 0-10-4.5-10-10s4.5-10 10-10 10 4.5 10 10-4.5 10-10 10zm24 18c-5.5 0-10-4.5-10-10s4.5-10 10-10 10 4.5 10 10-4.5 10-10 10zm15-28c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10-10-4.5-10-10z" fill="url(#ai-gradient)" />
                    <circle cx="55" cy="40" r="6" fill="#3B82F6" />
                    <circle cx="40" cy="64" r="6" fill="#10B981" />
                    <circle cx="64" cy="88" r="6" fill="#F59E0B" />
                    <circle cx="88" cy="64" r="6" fill="#EF4444" />
                    <circle cx="64" cy="64" r="10" fill="white" stroke="#6366F1" strokeWidth="2" />
                    <circle cx="64" cy="64" r="3" fill="#6366F1" />
                  </svg>
                </div>,
                title: "专属AI",
                description: "每个人都能拥有专属自己的智能AI伙伴。"
              },
              {
                icon: <div className="w-16 h-16 flex items-center justify-center mb-2">
                  <svg viewBox="0 0 128 128" className="w-full h-full">
                    <defs>
                      <linearGradient id="service-gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#4ADE80" />
                        <stop offset="100%" stopColor="#22C55E" />
                      </linearGradient>
                      <linearGradient id="service-gradient-2" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#2563EB" />
                        <stop offset="100%" stopColor="#3B82F6" />
                      </linearGradient>
                      <linearGradient id="service-gradient-3" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#EC4899" />
                        <stop offset="100%" stopColor="#F472B6" />
                      </linearGradient>
                      <filter id="service-shadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#0001" />
                      </filter>
                    </defs>
                    <circle cx="64" cy="64" r="60" fill="white" stroke="#E5E7EB" strokeWidth="2" />
                    <g filter="url(#service-shadow)">
                      <path d="M42 38a6 6 0 0 1 6-6h48a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6H48a6 6 0 0 1-6-6V38z" fill="url(#service-gradient-1)" />
                      <path d="M26 58a6 6 0 0 1 6-6h48a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6H32a6 6 0 0 1-6-6V58z" fill="url(#service-gradient-2)" />
                      <path d="M42 78a6 6 0 0 1 6-6h48a6 6 0 0 1 6 6v12a6 6 0 0 1-6 12H48a6 6 0 0 1-6-6V78z" fill="url(#service-gradient-3)" />
                    </g>
                    <circle cx="79" cy="44" r="3" fill="white" />
                    <circle cx="63" cy="64" r="3" fill="white" />
                    <circle cx="79" cy="84" r="3" fill="white" />
                  </svg>
                </div>,
                title: "全面服务",
                description: "产品覆盖国际物流环节的每个节点"
              },
              {
                icon: <div className="w-16 h-16 flex items-center justify-center mb-2">
                  <svg viewBox="0 0 128 128" className="w-full h-full">
                    <defs>
                      <linearGradient id="operation-gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#F59E0B" />
                        <stop offset="100%" stopColor="#F97316" />
                      </linearGradient>
                      <linearGradient id="operation-gradient-2" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3B82F6" />
                        <stop offset="100%" stopColor="#60A5FA" />
                      </linearGradient>
                      <filter id="operation-shadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#0001" />
                      </filter>
                    </defs>
                    <circle cx="64" cy="64" r="60" fill="white" stroke="#E5E7EB" strokeWidth="2" />
                    <g filter="url(#operation-shadow)">
                      <rect x="34" y="34" width="60" height="60" rx="8" fill="white" stroke="#E5E7EB" strokeWidth="2" />
                      <rect x="40" y="48" width="48" height="8" rx="4" fill="#EEF2FF" />
                      <rect x="40" y="62" width="48" height="8" rx="4" fill="#EEF2FF" />
                      <rect x="40" y="76" width="48" height="8" rx="4" fill="#EEF2FF" />
                      <circle cx="48" cy="52" r="4" fill="url(#operation-gradient-1)" />
                      <circle cx="48" cy="66" r="4" fill="url(#operation-gradient-2)" />
                      <circle cx="48" cy="80" r="4" fill="#A855F7" />
                      <circle cx="30" cy="40" r="12" fill="url(#operation-gradient-1)" opacity="0.6" />
                      <circle cx="98" cy="78" r="16" fill="url(#operation-gradient-2)" opacity="0.6" />
                    </g>
                  </svg>
                </div>,
                title: "便捷操作",
                description: "接入并深度融合货代系统，一句话完成所有操作"
              },
              {
                icon: <div className="w-16 h-16 flex items-center justify-center mb-2">
                  <svg viewBox="0 0 128 128" className="w-full h-full">
                    <defs>
                      <linearGradient id="stable-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#F43F5E" />
                        <stop offset="100%" stopColor="#FB7185" />
                      </linearGradient>
                      <filter id="stable-shadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#0001" />
                      </filter>
                    </defs>
                    <circle cx="64" cy="64" r="60" fill="white" stroke="#E5E7EB" strokeWidth="2" />
                    <g filter="url(#stable-shadow)">
                      <path d="M64 28L28 76h36l-8 24 36-48H56l8-24z" fill="url(#stable-gradient)" />
                    </g>
                  </svg>
                </div>,
                title: "专业稳定",
                description: "20年行业经验积累提供专业可靠的服务"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white/80 backdrop-blur-md rounded-xl p-8 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center h-72"
                whileHover={{
                  y: -5,
                  boxShadow: "0 10px 25px -5px rgba(116, 102, 240, 0.2)"
                }}
              >
                <div className="flex justify-center">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 my-4">{feature.title}</h3>
                <p className="text-gray-600 text-base mt-2">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;