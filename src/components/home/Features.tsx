import { motion } from 'framer-motion';
import { useState } from 'react';

// 导入未来需要的图片资源（暂时使用占位图）
// import featureImage1 from '../../assets/feature-ai-wabo.png';
// import featureImage2 from '../../assets/feature-file-recognition.png';
// import featureImage3 from '../../assets/feature-super-rate.png';
// import featureImage4 from '../../assets/feature-intelligent-bi.png';

// 特性数据
const featuresData = [
  {
    id: 'ai-wabo',
    title: 'AI沃宝',
    description: '智能对话助手，轻松管理您的物流业务。通过自然语言交互，实时查询、操作订单、跟踪货物，为您提供全天候的智能客服体验。',
    bulletPoints: [
      '自然语言理解，实时回答专业物流问题',
      '一键创建、修改和查询订单信息',
      '提供多语言支持，满足国际业务需求',
      '自动识别并解决常见问题，提高效率'
    ],
    imageSrc: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    color: 'from-blue-500 to-indigo-600'
  },
  {
    id: 'file-recognition',
    title: '文件识别',
    description: '先进的AI文档识别技术，自动提取和分析物流单证信息。从提单、箱单、发票到装箱单，一键识别转化为结构化数据，告别手动录入。',
    bulletPoints: [
      '高精度OCR技术，准确率达95%以上',
      '支持多种常见单证格式自动识别',
      '智能字段匹配，自动填充系统数据',
      '异常智能检测，减少人为错误'
    ],
    imageSrc: 'https://images.pexels.com/photos/6476260/pexels-photo-6476260.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    color: 'from-emerald-500 to-green-600'
  },
  {
    id: 'super-rate',
    title: '超级运价',
    description: '基于AI的智能运价引擎，整合全球承运商网络，为您提供实时、精准的运价报价。通过高级算法分析历史数据，预测价格趋势。',
    bulletPoints: [
      '实时对接全球超过50家承运商运价系统',
      '智能比对分析，一键获取最优运价方案',
      '历史价格趋势分析，辅助决策制定',
      '自动预警机制，及时把握价格波动'
    ],
    imageSrc: 'https://images.pexels.com/photos/7376/startup-photos.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    color: 'from-orange-500 to-amber-600'
  },
  {
    id: 'intelligent-bi',
    title: '智能BI',
    description: '强大的商业智能分析平台，将复杂的物流数据转化为直观可视化图表。通过AI驱动的预测模型，揭示业务趋势和优化机会。',
    bulletPoints: [
      '多维数据可视化，一目了然的业务全景',
      'AI驱动的预测分析，把握未来业务趋势',
      '自定义报表和仪表盘，满足不同角色需求',
      '异常数据自动检测，及时发现业务问题'
    ],
    imageSrc: 'https://images.pexels.com/photos/7567444/pexels-photo-7567444.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    color: 'from-purple-500 to-fuchsia-600'
  }
];

const Features = () => {
  const [activeTab, setActiveTab] = useState(featuresData[0].id);

  // 获取当前激活的特性数据
  const activeFeature = featuresData.find(feature => feature.id === activeTab) || featuresData[0];

  return (
    <section className="section-padding bg-white py-20">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            AI <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">创新场</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            我们为国际物流各个环节打造的AI解决方案，实现业务全面数字化、智能化升级
          </p>
        </motion.div>

        {/* 特性展示区域 - 左图右文本带Tab */}
        <div className="flex flex-col lg:flex-row gap-10 items-center">
          {/* 左侧图片区域 */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="lg:w-1/2"
          >
            <div className="relative aspect-video overflow-hidden rounded-xl shadow-xl bg-gray-100">
              {/* 渐变背景 */}
              <div className={`absolute inset-0 bg-gradient-to-br ${activeFeature.color} opacity-15`}></div>

              {/* 特性图片 - 添加懒加载 */}
              <img
                src={activeFeature.imageSrc}
                alt={activeFeature.title}
                className="w-full h-full object-cover rounded-xl"
                loading="lazy"
                decoding="async"
              />

              {/* 浮动元素装饰 */}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg py-2 px-4 shadow-lg">
                <span className={`bg-gradient-to-r ${activeFeature.color} bg-clip-text text-transparent font-bold text-xl`}>
                  {activeFeature.title}
                </span>
              </div>

              {/* 额外装饰元素 */}
              <div className="absolute -bottom-3 -right-3 w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary opacity-70 blur-xl"></div>
            </div>
          </motion.div>

          {/* 右侧Tab和内容区域 */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="lg:w-1/2"
          >
            {/* Tab导航 */}
            <div className="flex flex-wrap mb-8 border-b border-gray-200">
              {featuresData.map((feature) => (
                <button
                  type="button"
                  key={feature.id}
                  className={`mr-6 py-3 px-2 text-xl font-bold transition-all duration-200 border-b-3 ${
                    activeTab === feature.id
                      ? `border-primary text-primary shadow-sm`
                      : `border-transparent text-gray-400 hover:text-gray-800 hover:border-gray-300`
                  }`}
                  onClick={() => setActiveTab(feature.id)}
                >
                  {feature.title}
                </button>
              ))}
            </div>

            {/* Tab内容 */}
            <div className="feature-content">
              <motion.div
                key={activeFeature.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="mb-6"
              >
                <h3 className={`text-2xl font-bold mb-4 bg-gradient-to-r ${activeFeature.color} bg-clip-text text-transparent`}>
                  {activeFeature.title}
                </h3>
                <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                  {activeFeature.description}
                </p>

                {/* 特性要点列表 */}
                <ul className="space-y-3">
                  {activeFeature.bulletPoints.map((point, index) => (
                    <li key={index}>
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex items-start"
                      >
                        <div className={`flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-r ${activeFeature.color} flex items-center justify-center mt-1 mr-3`}>
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-700">{point}</span>
                      </motion.div>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* 行动按钮 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <button
                  type="button"
                  className={`mt-6 bg-gradient-to-r ${activeFeature.color} text-white py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 font-medium`}
                >
                  了解更多
                </button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Features;