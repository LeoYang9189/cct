import { motion } from 'framer-motion';
import { ReactNode } from 'react';

// 卡片组件接口定义
interface SolutionCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  gradient: string;
  size: 'small' | 'medium' | 'large';
  delay: number;
  gridArea: string;
}

const SolutionCard = ({ title, description, icon, gradient, size, delay, gridArea }: SolutionCardProps) => {
  // 根据尺寸确定内部padding和内容样式
  const sizeStyles = {
    small: 'p-5',
    medium: 'p-6',
    large: 'p-7'
  }[size];

  // 图标尺寸
  const iconSize = {
    small: 'w-12 h-12',
    medium: 'w-14 h-14',
    large: 'w-16 h-16'
  }[size];

  // 标题尺寸
  const titleSize = {
    small: 'text-lg',
    medium: 'text-xl',
    large: 'text-2xl'
  }[size];

  return (
    <motion.div
      style={{ gridArea }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
      viewport={{ once: true }}
      whileHover={{
        y: -5,
        boxShadow: '0 15px 30px -10px rgba(0, 0, 0, 0.1), 0 8px 10px -5px rgba(0, 0, 0, 0.04)',
        transition: { duration: 0.2 }
      }}
      className={`relative overflow-hidden rounded-2xl shadow-md group h-full ${sizeStyles}`}
    >
      {/* 背景渐变 - 使用更浅的颜色 */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-20 transition-all duration-300 group-hover:opacity-30`}></div>

      {/* 光晕效果 */}
      <div className="absolute -inset-x-1/2 -top-1/2 w-full h-full bg-gradient-to-br from-white/30 to-transparent opacity-10 transform rotate-12 group-hover:opacity-20 transition-opacity duration-500"></div>

      {/* 内容容器 */}
      <div className="relative z-10 h-full flex flex-col">
        <div className={`bg-white/10 backdrop-blur-sm ${iconSize} rounded-xl flex items-center justify-center mb-4 shadow-inner transition-all duration-300 group-hover:shadow-md`}>
          {icon}
        </div>

        <h3 className={`${titleSize} font-bold text-gray-800 mb-2`}>{title}</h3>
        <p className="text-gray-600 text-sm md:text-base flex-grow">{description}</p>

        {/* 交互指示器 */}
        <div className="mt-4">
          <span className="inline-flex items-center text-primary text-sm transition-all duration-300 opacity-80 group-hover:opacity-100 transform group-hover:translate-x-1">
            了解更多
            <svg className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </span>
        </div>
      </div>
    </motion.div>
  );
};

const Solutions = () => {
  // 卡片数据 - 更新为更浅的颜色
  const solutions = [
    {
      title: "海关专区",
      description: "全球海关合规解决方案，包含美加专区（AMS/ISF/ACI申报、美国换单/清关）、欧盟业务及中国业务（上海/青岛/华南预配舱单、VGM申报）等全方位海关申报服务。",
      icon: (
        <svg className="w-7 h-7 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
        </svg>
      ),
      gradient: "from-blue-100 to-blue-200",
      size: "medium" as const,
      gridArea: "area1"
    },
    {
      title: "经纪代理",
      description: "一站式物流经营资质办理与代理服务，包括NVOCC注册、进出口权备案、商务部货代备案、原产地证等国内外物流资质申请代理。",
      icon: (
        <svg className="w-7 h-7 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      gradient: "from-green-100 to-green-200",
      size: "small" as const,
      gridArea: "area2"
    },
    {
      title: "智慧物流系统",
      description: "融合AI与大数据的智慧物流管理系统，提供定制门户（Web门户、小程序、B2B平台）及协作云平台，打造高效数字物流生态系统。",
      icon: (
        <svg className="w-8 h-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      gradient: "from-purple-100 to-purple-200",
      size: "large" as const,
      gridArea: "area3"
    },
    {
      title: "订舱门户",
      description: "一站式高效订舱平台，覆盖船东服务（船司订舱、船司截单）及代理业务，实现多航线高效率智能订舱与无缝对接船公司系统。",
      icon: (
        <svg className="w-7 h-7 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
      gradient: "from-amber-100 to-amber-200",
      size: "medium" as const,
      gridArea: "area4"
    },
    {
      title: "工具箱",
      description: "全面实用的物流工具集合，包括可视化工具（全链路跟踪、全球船期、货车轨迹）及其他实用助手，提升日常物流运营效率。",
      icon: (
        <svg className="w-7 h-7 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      gradient: "from-rose-100 to-rose-200",
      size: "small" as const,
      gridArea: "area5"
    },
  ];

  return (
    <section className="section-padding relative overflow-hidden">
      {/* 背景装饰 - 更浅色背景 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-full h-full bg-gradient-to-br from-gray-50 via-white to-gray-50 opacity-80"></div>
        <div className="aurora-wave aurora-wave-1 opacity-10"></div>
        <div className="aurora-wave aurora-wave-2 opacity-5"></div>
      </div>

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            国际物流<span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">解决方案</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            为您的国际物流业务提供全方位的AI智能解决方案，提升效率，降低成本
          </p>
        </motion.div>

        {/* 精确计算的网格布局 形成完美矩形 */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5 solutions-grid">
          {solutions.map((solution, index) => (
            <SolutionCard
              key={index}
              title={solution.title}
              description={solution.description}
              icon={solution.icon}
              gradient={solution.gradient}
              size={solution.size}
              delay={index}
              gridArea={solution.gridArea}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <button
            type="button"
            className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white py-3 px-8 rounded-lg font-medium shadow-md hover:shadow-lg transform transition-all duration-300 hover:-translate-y-1"
            aria-label="探索全部解决方案"
          >
            探索全部解决方案
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Solutions;