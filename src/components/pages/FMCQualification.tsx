
import { useState, useEffect } from 'react';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShip,
  faFileAlt,
  faGlobe,
  faClipboardCheck,
  faFileContract,
  faArrowRight,
  faCheck,
  faFileSignature,
  faNetworkWired,
  faMoneyBillWave,
  faEye,
  faEnvelope,
  faFileInvoiceDollar,
  faBriefcase,
  faCreditCard,
  faBuilding,
  faExclamationTriangle,
  faInfoCircle,
  faListAlt,
  faWarehouse,
  faShieldAlt,
  faQuestionCircle,
  faBalanceScale,
  faHandHoldingUsd,
  faClipboardList,
  faPaperPlane,
  faFileUpload,
  faPhoneAlt,
  faExchangeAlt
} from '@fortawesome/free-solid-svg-icons';

const FMCQualification = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeTab, setActiveTab] = useState<'fmc' | 'bond'>('fmc');

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        {/* 页面标题 - 炫酷版 */}
        <section className="relative overflow-hidden bg-gradient-to-r from-primary to-secondary text-white py-20">
          {/* 背景图案 */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-white"
                  style={{
                    width: Math.random() * 10 + 5 + 'px',
                    height: Math.random() * 10 + 5 + 'px',
                    top: Math.random() * 100 + '%',
                    left: Math.random() * 100 + '%',
                    opacity: Math.random() * 0.5 + 0.1
                  }}
                />
              ))}
            </div>
          </div>

          {/* 动态光效 */}
          <div
            className="absolute w-[500px] h-[500px] rounded-full bg-white opacity-10 blur-[100px] pointer-events-none"
            style={{
              left: mousePosition.x - 250 + 'px',
              top: mousePosition.y - 250 + 'px',
              transform: 'translate(-50%, -50%)'
            }}
          />

          {/* 波浪效果 */}
          <div className="absolute bottom-0 left-0 w-full">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
              <path fill="#ffffff" fillOpacity="0.1" d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,224C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto absolute bottom-0">
              <path fill="#ffffff" fillOpacity="0.2" d="M0,96L48,128C96,160,192,224,288,213.3C384,203,480,117,576,101.3C672,85,768,139,864,181.3C960,224,1056,256,1152,261.3C1248,267,1344,245,1392,234.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>
          </div>

          <div className="container-custom relative z-10">
            {/* 图标装饰 */}
            <motion.div
              className="absolute -top-10 -left-10 text-white opacity-10 hidden md:block"
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            >
              <FontAwesomeIcon icon={faShip} size="6x" />
            </motion.div>

            <motion.div
              className="absolute top-20 right-10 text-white opacity-10 hidden md:block"
              initial={{ rotate: 0 }}
              animate={{ rotate: -360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            >
              <FontAwesomeIcon icon={faGlobe} size="5x" />
            </motion.div>

            <motion.h1
              className="text-4xl md:text-5xl font-bold mb-4 relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              FMC 资质与海关Bond
              <span className="absolute -top-4 -right-4 text-yellow-300 animate-pulse">
                <FontAwesomeIcon icon={faFileContract} size="xs" />
              </span>
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl max-w-3xl mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              美国联邦海事委员会(FMC)资质申请与美国海关Bond办理服务
            </motion.p>

            <motion.div
              className="flex items-center text-yellow-200 text-sm mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <FontAwesomeIcon icon={faClipboardCheck} className="mr-2" />
              <span>专业团队 · 快速办理 · 全程服务 · 安全可靠</span>
            </motion.div>
          </div>
        </section>

        {/* 四个功能卡片 */}
        <section className="py-12 -mt-6 relative z-20">
          <div className="container-custom">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* 卡片1: 申请FMC+AMS资质 */}
              <motion.div
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="bg-gradient-to-r from-blue-300/80 to-indigo-400/80 p-4">
                  <div className="w-12 h-12 rounded-full bg-white/30 flex items-center justify-center mb-3">
                    <FontAwesomeIcon icon={faFileSignature} className="text-indigo-700 text-xl" />
                  </div>
                  <h3 className="text-indigo-800 text-lg font-bold">申请FMC+AMS资质</h3>
                  <p className="text-indigo-700 text-sm mt-1">一站式服务，同时获取两项资质</p>
                </div>
                <div className="p-5">
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-start">
                      <FontAwesomeIcon icon={faCheck} className="text-green-500 mt-1 mr-2" />
                      <span className="text-gray-700 text-sm">快速获取FMC和AMS双重资质</span>
                    </li>
                    <li className="flex items-start">
                      <FontAwesomeIcon icon={faCheck} className="text-green-500 mt-1 mr-2" />
                      <span className="text-gray-700 text-sm">专业团队全程指导</span>
                    </li>
                    <li className="flex items-start">
                      <FontAwesomeIcon icon={faCheck} className="text-green-500 mt-1 mr-2" />
                      <span className="text-gray-700 text-sm">优惠套餐价格</span>
                    </li>
                  </ul>
                  <button
                    type="button"
                    className="w-full py-2 bg-gradient-to-r from-blue-300 to-indigo-400 text-indigo-800 font-medium rounded-lg flex items-center justify-center hover:opacity-90 transition-all duration-300 hover:shadow-md"
                  >
                    立即申请 <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                  </button>
                </div>
              </motion.div>

              {/* 卡片2: 申请FMC资质 */}
              <motion.div
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="bg-gradient-to-r from-purple-300/80 to-pink-300/80 p-4">
                  <div className="w-12 h-12 rounded-full bg-white/30 flex items-center justify-center mb-3">
                    <FontAwesomeIcon icon={faFileContract} className="text-purple-700 text-xl" />
                  </div>
                  <h3 className="text-purple-800 text-lg font-bold">申请FMC资质</h3>
                  <p className="text-purple-700 text-sm mt-1">美国联邦海事委员会认证</p>
                </div>
                <div className="p-5">
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-start">
                      <FontAwesomeIcon icon={faCheck} className="text-green-500 mt-1 mr-2" />
                      <span className="text-gray-700 text-sm">合法经营海运业务的必要条件</span>
                    </li>
                    <li className="flex items-start">
                      <FontAwesomeIcon icon={faCheck} className="text-green-500 mt-1 mr-2" />
                      <span className="text-gray-700 text-sm">专业材料准备与提交</span>
                    </li>
                    <li className="flex items-start">
                      <FontAwesomeIcon icon={faCheck} className="text-green-500 mt-1 mr-2" />
                      <span className="text-gray-700 text-sm">高效审批流程</span>
                    </li>
                  </ul>
                  <button
                    type="button"
                    className="w-full py-2 bg-gradient-to-r from-purple-300 to-pink-300 text-purple-800 font-medium rounded-lg flex items-center justify-center hover:opacity-90 transition-all duration-300 hover:shadow-md"
                  >
                    立即申请 <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                  </button>
                </div>
              </motion.div>

              {/* 卡片3: 申请AMS资质 */}
              <motion.div
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="bg-gradient-to-r from-amber-300/80 to-orange-300/80 p-4">
                  <div className="w-12 h-12 rounded-full bg-white/30 flex items-center justify-center mb-3">
                    <FontAwesomeIcon icon={faNetworkWired} className="text-amber-700 text-xl" />
                  </div>
                  <h3 className="text-amber-800 text-lg font-bold">申请AMS资质</h3>
                  <p className="text-amber-700 text-sm mt-1">美国海关自动舱单系统</p>
                </div>
                <div className="p-5">
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-start">
                      <FontAwesomeIcon icon={faCheck} className="text-green-500 mt-1 mr-2" />
                      <span className="text-gray-700 text-sm">提前申报货物信息</span>
                    </li>
                    <li className="flex items-start">
                      <FontAwesomeIcon icon={faCheck} className="text-green-500 mt-1 mr-2" />
                      <span className="text-gray-700 text-sm">避免货物延误和滞港</span>
                    </li>
                    <li className="flex items-start">
                      <FontAwesomeIcon icon={faCheck} className="text-green-500 mt-1 mr-2" />
                      <span className="text-gray-700 text-sm">专业团队协助申请</span>
                    </li>
                  </ul>
                  <button
                    type="button"
                    className="w-full py-2 bg-gradient-to-r from-amber-300 to-orange-300 text-amber-800 font-medium rounded-lg flex items-center justify-center hover:opacity-90 transition-all duration-300 hover:shadow-md"
                  >
                    立即申请 <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                  </button>
                </div>
              </motion.div>

              {/* 卡片4: 申请海关Bond */}
              <motion.div
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="bg-gradient-to-r from-emerald-300/80 to-teal-300/80 p-4">
                  <div className="w-12 h-12 rounded-full bg-white/30 flex items-center justify-center mb-3">
                    <FontAwesomeIcon icon={faMoneyBillWave} className="text-emerald-700 text-xl" />
                  </div>
                  <h3 className="text-emerald-800 text-lg font-bold">申请海关Bond</h3>
                  <p className="text-emerald-700 text-sm mt-1">美国进口必备保证金</p>
                </div>
                <div className="p-5">
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-start">
                      <FontAwesomeIcon icon={faCheck} className="text-green-500 mt-1 mr-2" />
                      <span className="text-gray-700 text-sm">单次和连续Bond申请</span>
                    </li>
                    <li className="flex items-start">
                      <FontAwesomeIcon icon={faCheck} className="text-green-500 mt-1 mr-2" />
                      <span className="text-gray-700 text-sm">快速办理，高效审批</span>
                    </li>
                    <li className="flex items-start">
                      <FontAwesomeIcon icon={faCheck} className="text-green-500 mt-1 mr-2" />
                      <span className="text-gray-700 text-sm">专业咨询与指导</span>
                    </li>
                  </ul>
                  <button
                    type="button"
                    className="w-full py-2 bg-gradient-to-r from-emerald-300 to-teal-300 text-emerald-800 font-medium rounded-lg flex items-center justify-center hover:opacity-90 transition-all duration-300 hover:shadow-md"
                  >
                    立即申请 <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 主要内容区域 - 带Tab切换 */}
        <section className="py-12">
          <div className="container-custom">
            <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
              {/* Tab切换按钮 */}
              <div className="flex border-b border-gray-200 mb-8">
                <button
                  type="button"
                  className={`py-3 px-6 font-medium text-lg border-b-2 transition-colors duration-200 ${
                    activeTab === 'fmc'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('fmc')}
                >
                  FMC资质介绍
                </button>
                <button
                  type="button"
                  className={`py-3 px-6 font-medium text-lg border-b-2 transition-colors duration-200 ${
                    activeTab === 'bond'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('bond')}
                >
                  海关Bond介绍
                </button>
              </div>

              {/* FMC资质介绍内容 */}
              <div className={`space-y-8 ${activeTab === 'fmc' ? 'block' : 'hidden'}`}>
                {/* 什么是FMC部分 */}
                <div>
                  <h2 className="text-2xl font-bold text-primary mb-6">什么是FMC?</h2>
                  <div className="space-y-4">
                    <p className="text-gray-700 leading-relaxed">
                      FMC是美国联邦海事委员会(Federal Maritime Commission)的简称，总部设在华盛顿，兼具行政立法、准司法和执法三种职能，掌管和监管以美国为起点或的以集装箱海运为主的水上商业活动，海运承运人和经纪人均受其监管。
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      根据美国联邦海事委员会规定，企业在美国发起单从事进出美国港口的无船承运货运业务，须预先向美国联邦海事委员会申请并取得美国无船承运人资质。
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      目前JCtrans客户已有多家非美国公司成功申请到该资质，实现与当地船公司签订合约价、自主发送AMS/ISF等申报信息。
                    </p>
                  </div>
                </div>

                {/* 为什么要申请FMC部分 */}
                <div>
                  <h2 className="text-2xl font-bold text-primary mb-6">为什么要申请FMC?</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* 优势1 */}
                    <div className="bg-blue-500 text-white p-6 rounded-lg">
                      <div className="flex items-center justify-center h-full">
                        <p className="text-center font-medium">
                          合法合规地从事美国无船承运人业务，享受担保；
                        </p>
                      </div>
                    </div>

                    {/* 优势2 */}
                    <div className="bg-blue-400 text-white p-6 rounded-lg">
                      <div className="flex items-center justify-center h-full">
                        <p className="text-center font-medium">
                          可以直接跟船司订舱，能签发拥有自己抬头的提单，不用找一代/上层代理订舱单，可拥有更优惠的合约运价"Contract Rate"；
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-gray-700 leading-relaxed">
                      FMC资质备案有助于提升公司的信誉度和市场竞争力。在航运物流领域，信任是至关重要的。通过完成FMC资质备案，公司可以向潜在客户和合作伙伴展示其合规性和专业性，从而赢得他们的信任和青睐。此外，这也是公司展示自身实力，扩大市场份额、提升品牌形象的重要途径。
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      另外，FMC资质备案有助于公司与美国本土企业建立更紧密的合作关系。在美国市场，与当地企业建立合作关系是开展业务的关键。而拥有FMC资质备案的公司，更容易获得美国本土企业的认可和信任，从而与其建立长期稳定的合作关系。
                    </p>
                  </div>
                </div>

                {/* FMC资质及AMS资质的作用 */}
                <div>
                  <h2 className="text-2xl font-bold text-primary mb-6">FMC资质（OTI-NVOCC Lisence）及AMS资质的作用（具体业务）</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* 作用1 */}
                    <div className="bg-gray-100 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                      <div className="flex items-start mb-3">
                        <span className="text-primary font-bold text-xl mr-3">01.</span>
                        <p className="text-gray-700">
                          合法合规地从事美国无船承运人业务，为托运人签发提单，提升企业核心竞争力。
                        </p>
                      </div>
                    </div>

                    {/* 作用2 */}
                    <div className="bg-gray-100 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                      <div className="flex items-start mb-3">
                        <span className="text-primary font-bold text-xl mr-3">02.</span>
                        <p className="text-gray-700">
                          企业无需通过船代或是一代，可直接与船东以及美国资代开展业务。
                        </p>
                      </div>
                    </div>

                    {/* 作用3 */}
                    <div className="bg-gray-100 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                      <div className="flex items-start mb-3">
                        <span className="text-primary font-bold text-xl mr-3">03.</span>
                        <p className="text-gray-700">
                          企业通过运价信息，可以直接和船东询价采购到最优价格并再次销售。
                        </p>
                      </div>
                    </div>

                    {/* 作用4 */}
                    <div className="bg-gray-100 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                      <div className="flex items-start mb-3">
                        <span className="text-primary font-bold text-xl mr-3">04.</span>
                        <p className="text-gray-700">
                          与潜在发货人开发租船业务。
                        </p>
                      </div>
                    </div>

                    {/* 作用5 */}
                    <div className="bg-gray-100 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                      <div className="flex items-start mb-3">
                        <span className="text-primary font-bold text-xl mr-3">05.</span>
                        <p className="text-gray-700">
                          签发提单或同等文件。
                        </p>
                      </div>
                    </div>

                    {/* 作用6 */}
                    <div className="bg-gray-100 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                      <div className="flex items-start mb-3">
                        <span className="text-primary font-bold text-xl mr-3">06.</span>
                        <p className="text-gray-700">
                          租赁集装箱。
                        </p>
                      </div>
                    </div>

                    {/* 作用7 */}
                    <div className="bg-gray-100 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                      <div className="flex items-start mb-3">
                        <span className="text-primary font-bold text-xl mr-3">07.</span>
                        <p className="text-gray-700">
                          拥有24小时申报服务系统提交AMS/ISF等，时间更可控、更灵活。
                        </p>
                      </div>
                    </div>

                    {/* 作用8 */}
                    <div className="bg-gray-100 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                      <div className="flex items-start mb-3">
                        <span className="text-primary font-bold text-xl mr-3">08.</span>
                        <p className="text-gray-700">
                          随时掌握货物报关、清关状态、货物信息。
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* FMC所含具体项目 */}
                <div className="relative bg-gradient-to-r from-blue-50 to-blue-100 p-8 rounded-xl mb-12">
                  <h2 className="text-2xl font-bold text-gray-800 mb-8">FMC 所含具体项目</h2>

                  <div className="mb-10">
                    <p className="text-gray-700 leading-relaxed mb-4">
                      在包含以下全部项目的基础上，我们为您提供包含以下全部项目的，质优价廉的FMC申请服务
                    </p>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      费用一次收取，绝无后续隐藏费用
                    </p>
                    <p className="text-gray-700 leading-relaxed mb-8">
                      现在联系我们，为您提供超时优惠价格
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                      <div className="flex items-center">
                        <div className="w-12 h-12 flex items-center justify-center bg-blue-500 rounded-full text-white mr-4 shadow-md">
                          <FontAwesomeIcon icon={faFileAlt} />
                        </div>
                        <span className="font-medium text-gray-700">广覆盖</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-12 h-12 flex items-center justify-center bg-blue-600 rounded-full text-white mr-4 shadow-md">
                          <FontAwesomeIcon icon={faCheck} />
                        </div>
                        <span className="font-medium text-gray-700">高质量</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-12 h-12 flex items-center justify-center bg-blue-400 rounded-full text-white mr-4 shadow-md">
                          <FontAwesomeIcon icon={faMoneyBillWave} />
                        </div>
                        <span className="font-medium text-gray-700">低价格</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-12 h-12 flex items-center justify-center bg-blue-500 rounded-full text-white mr-4 shadow-md">
                          <FontAwesomeIcon icon={faEye} />
                        </div>
                        <span className="font-medium text-gray-700">透明费用</span>
                      </div>
                    </div>
                  </div>

                  {/* 便当盒式布局 - 重新设计 */}
                  <div className="grid grid-cols-12 gap-6">
                    {/* 第一行 */}
                    <div className="col-span-12 md:col-span-5 bg-white p-6 rounded-lg shadow-md">
                      <h3 className="text-lg font-bold text-gray-800 mb-4">申请项目</h3>
                      <p className="text-blue-600 font-medium">FMC资质（OTI-NVOCC Lisence）</p>
                    </div>

                    <div className="col-span-12 md:col-span-7 bg-white p-6 rounded-lg shadow-md">
                      <h3 className="text-lg font-bold text-gray-800 mb-4">申请目的</h3>
                      <p className="text-gray-700">办理完成后可以在美线业务中签发无船承运人提单</p>
                    </div>

                    {/* 第二行 */}
                    <div className="col-span-12 md:col-span-7 bg-white p-6 rounded-lg shadow-md">
                      <h3 className="text-lg font-bold text-gray-800 mb-4">具体事项及流程</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                        <div className="flex items-start">
                          <span className="text-blue-600 font-bold mr-2 w-6 text-right">01.</span>
                          <p className="text-gray-700">FMC BOND</p>
                        </div>

                        <div className="flex items-start">
                          <span className="text-blue-600 font-bold mr-2 w-6 text-right">04.</span>
                          <p className="text-gray-700">提单审核</p>
                        </div>

                        <div className="flex items-start">
                          <span className="text-blue-600 font-bold mr-2 w-6 text-right">02.</span>
                          <p className="text-gray-700">FMC登记（FMC-1/FMC-65）</p>
                        </div>

                        <div className="flex items-start">
                          <span className="text-blue-600 font-bold mr-2 w-6 text-right">05.</span>
                          <p className="text-gray-700">数据库维护年费</p>
                        </div>

                        <div className="flex items-start">
                          <span className="text-blue-600 font-bold mr-2 w-6 text-right">03.</span>
                          <p className="text-gray-700">FMC申请授权（LOA）</p>
                        </div>

                        <div className="flex items-start">
                          <span className="text-blue-600 font-bold mr-2 w-6 text-right">06.</span>
                          <p className="text-gray-700">开通运价备案系统账户</p>
                        </div>
                      </div>
                    </div>

                    <div className="col-span-12 md:col-span-5 bg-white p-6 rounded-lg shadow-md flex flex-col justify-center">
                      <h3 className="text-lg font-bold text-gray-800 mb-4">时间（参考）</h3>
                      <p className="text-gray-700 text-xl">15个工作日</p>
                    </div>
                  </div>
                </div>

                {/* AMS资质所含具体项目 */}
                <div className="relative bg-gradient-to-r from-amber-50 to-amber-100 p-8 rounded-xl mb-12">
                  <h2 className="text-2xl font-bold text-gray-800 mb-8">AMS资质所含具体项目</h2>

                  <div className="mb-10">
                    <p className="text-gray-700 leading-relaxed mb-4">
                      AMS资质是美国海关自动舱单系统的申报资质，拥有此资质可以以自己的名义直接向美国海关发送数据。
                    </p>
                    <p className="text-gray-700 leading-relaxed mb-8">
                      我们提供全套AMS申报资质申请服务，包含以下全部项目。
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
                      <div className="flex items-center">
                        <div className="w-12 h-12 flex items-center justify-center bg-amber-500 rounded-full text-white mr-4 shadow-md">
                          <FontAwesomeIcon icon={faFileContract} />
                        </div>
                        <span className="font-medium text-gray-700">C3 Bond</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-12 h-12 flex items-center justify-center bg-amber-600 rounded-full text-white mr-4 shadow-md">
                          <FontAwesomeIcon icon={faNetworkWired} />
                        </div>
                        <span className="font-medium text-gray-700">CBP Code申请</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-12 h-12 flex items-center justify-center bg-amber-400 rounded-full text-white mr-4 shadow-md">
                          <FontAwesomeIcon icon={faFileAlt} />
                        </div>
                        <span className="font-medium text-gray-700">SCAC Code申请</span>
                      </div>
                    </div>
                  </div>

                  {/* 便当盒式布局 - AMS */}
                  <div className="grid grid-cols-12 gap-6">
                    {/* 第一行 */}
                    <div className="col-span-12 md:col-span-5 bg-white p-6 rounded-lg shadow-md">
                      <h3 className="text-lg font-bold text-gray-800 mb-4">申请项目</h3>
                      <p className="text-amber-600 font-medium">全套AMS申报资质</p>
                    </div>

                    <div className="col-span-12 md:col-span-7 bg-white p-6 rounded-lg shadow-md">
                      <h3 className="text-lg font-bold text-gray-800 mb-4">申请目的</h3>
                      <p className="text-gray-700">以自己的资质发送AMS数据</p>
                    </div>

                    {/* 第二行 */}
                    <div className="col-span-12 md:col-span-7 bg-white p-6 rounded-lg shadow-md">
                      <h3 className="text-lg font-bold text-gray-800 mb-4">具体事项及流程</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                        <div className="flex items-start">
                          <span className="text-amber-600 font-bold mr-2 w-6 text-right">01.</span>
                          <p className="text-gray-700">C3 Bond申请</p>
                        </div>

                        <div className="flex items-start">
                          <span className="text-amber-600 font-bold mr-2 w-6 text-right">03.</span>
                          <p className="text-gray-700">SCAC Code申请</p>
                        </div>

                        <div className="flex items-start">
                          <span className="text-amber-600 font-bold mr-2 w-6 text-right">02.</span>
                          <p className="text-gray-700">CBP Code申请</p>
                        </div>

                        <div className="flex items-start">
                          <span className="text-amber-600 font-bold mr-2 w-6 text-right">04.</span>
                          <p className="text-gray-700">AMS系统账户开通</p>
                        </div>
                      </div>
                    </div>

                    <div className="col-span-12 md:col-span-5 bg-white p-6 rounded-lg shadow-md flex flex-col justify-center">
                      <h3 className="text-lg font-bold text-gray-800 mb-4">时间（参考）</h3>
                      <p className="text-gray-700 text-xl">10个工作日</p>
                    </div>
                  </div>
                </div>

                {/* FMC办理材料 */}
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-primary mb-8">FMC 办理材料</h2>

                  <div className="bg-white p-8 rounded-xl shadow-sm">
                    <h3 className="text-lg font-bold text-blue-600 mb-6">审核报价材料清单</h3>

                    <div className="space-y-4">
                      {/* 材料1 */}
                      <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                        <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center mr-4">
                          <FontAwesomeIcon icon={faCheck} className="text-white text-xs" />
                        </div>
                        <span className="text-gray-800 font-medium">FMC申请表（含公司信息及财报）</span>
                        <div className="ml-auto">
                          <button
                            type="button"
                            className="py-2 px-6 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors duration-300"
                          >
                            参考样例
                          </button>
                        </div>
                      </div>

                      {/* 材料2 */}
                      <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                        <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center mr-4">
                          <FontAwesomeIcon icon={faCheck} className="text-white text-xs" />
                        </div>
                        <span className="text-gray-800 font-medium">提单（正反面）</span>
                        <div className="ml-auto">
                          <button
                            type="button"
                            className="py-2 px-6 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors duration-300"
                          >
                            参考样例
                          </button>
                        </div>
                      </div>

                      {/* 材料3 */}
                      <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                        <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center mr-4">
                          <FontAwesomeIcon icon={faEye} className="text-white text-xs" />
                        </div>
                        <span className="text-gray-800 font-medium">非必要项（若您含有以下证书，将有助于申核、报价）</span>
                      </div>

                      {/* 补充说明1 */}
                      <div className="ml-10 text-gray-700 text-sm">
                        <p className="mb-2">如为FIATA或其他认可国家或国际货代公会会员，请提供证明。</p>
                        <p className="mb-4">如：国际认可协会会员（IATA / CIFA / JCtrans 等）</p>
                      </div>

                      {/* 补充说明2 */}
                      <div className="ml-10 text-gray-700 text-sm">
                        <p>如有为公司投保（涉外物流责任险）或（海运提单责任保险），请提供保单证明。</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AMS办理材料 */}
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-amber-600 mb-8">AMS 办理材料</h2>

                  <div className="bg-white p-8 rounded-xl shadow-sm">
                    <h3 className="text-lg font-bold text-amber-600 mb-6">审核报价材料清单</h3>

                    <div className="space-y-4">
                      {/* 材料1 */}
                      <div className="flex items-center p-4 bg-amber-50 rounded-lg">
                        <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center mr-4">
                          <FontAwesomeIcon icon={faCheck} className="text-white text-xs" />
                        </div>
                        <span className="text-gray-800 font-medium">AMS资质申请表</span>
                        <div className="ml-auto">
                          <button
                            type="button"
                            className="py-2 px-6 bg-amber-500 text-white font-medium rounded-lg hover:bg-amber-600 transition-colors duration-300"
                          >
                            参考样例
                          </button>
                        </div>
                      </div>

                      {/* 材料2 */}
                      <div className="flex items-center p-4 bg-amber-50 rounded-lg">
                        <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center mr-4">
                          <FontAwesomeIcon icon={faCheck} className="text-white text-xs" />
                        </div>
                        <span className="text-gray-800 font-medium">公司营业执照</span>
                        <div className="ml-auto">
                          <button
                            type="button"
                            className="py-2 px-6 bg-amber-500 text-white font-medium rounded-lg hover:bg-amber-600 transition-colors duration-300"
                          >
                            参考样例
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 申请流程部分 */}
                <div className="mb-16">
                  <h2 className="text-2xl font-bold text-gray-800 mb-12">申请流程</h2>

                  <div className="relative">
                    {/* 流程图 */}
                    <div className="flex flex-col md:flex-row justify-between items-center mb-8 relative">
                      {/* 步骤1 */}
                      <div className="flex flex-col items-center mb-8 md:mb-0 z-10">
                        <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-3 relative">
                          <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white">
                            <FontAwesomeIcon icon={faFileAlt} className="text-2xl" />
                          </div>
                          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm">
                            01
                          </div>
                        </div>
                        <p className="text-blue-600 font-bold">收集办理材料</p>
                      </div>

                      {/* 箭头1 */}
                      <div className="hidden md:block w-16 h-4 bg-blue-100 mx-2"></div>

                      {/* 步骤2 */}
                      <div className="flex flex-col items-center mb-8 md:mb-0 z-10">
                        <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-3 relative">
                          <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white">
                            <FontAwesomeIcon icon={faEnvelope} className="text-2xl" />
                          </div>
                          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm">
                            02
                          </div>
                        </div>
                        <p className="text-blue-600 font-bold">发邮件提交</p>
                      </div>

                      {/* 箭头2 */}
                      <div className="hidden md:block w-16 h-4 bg-blue-100 mx-2"></div>

                      {/* 步骤3 */}
                      <div className="flex flex-col items-center mb-8 md:mb-0 z-10">
                        <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-3 relative">
                          <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white">
                            <FontAwesomeIcon icon={faFileInvoiceDollar} className="text-2xl" />
                          </div>
                          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm">
                            03
                          </div>
                        </div>
                        <p className="text-blue-600 font-bold">等待报价</p>
                      </div>
                    </div>

                    {/* 返回箭头 */}
                    <div className="hidden md:block absolute right-0 top-10 w-4 h-40 bg-blue-100"></div>

                    {/* 流程图第二行 */}
                    <div className="flex flex-col md:flex-row-reverse justify-between items-center relative">
                      {/* 步骤6 */}
                      <div className="flex flex-col items-center mb-8 md:mb-0 z-10">
                        <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-3 relative">
                          <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white">
                            <FontAwesomeIcon icon={faBriefcase} className="text-2xl" />
                          </div>
                          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm">
                            06
                          </div>
                        </div>
                        <p className="text-blue-600 font-bold">办理成功</p>
                      </div>

                      {/* 箭头5 */}
                      <div className="hidden md:block w-16 h-4 bg-blue-100 mx-2"></div>

                      {/* 步骤5 */}
                      <div className="flex flex-col items-center mb-8 md:mb-0 z-10">
                        <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-3 relative">
                          <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white">
                            <FontAwesomeIcon icon={faClipboardCheck} className="text-2xl" />
                          </div>
                          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm">
                            05
                          </div>
                        </div>
                        <p className="text-blue-600 font-bold">开始办理</p>
                      </div>

                      {/* 箭头4 */}
                      <div className="hidden md:block w-16 h-4 bg-blue-100 mx-2"></div>

                      {/* 步骤4 */}
                      <div className="flex flex-col items-center mb-8 md:mb-0 z-10">
                        <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-3 relative">
                          <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white">
                            <FontAwesomeIcon icon={faCreditCard} className="text-2xl" />
                          </div>
                          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm">
                            04
                          </div>
                        </div>
                        <p className="text-blue-600 font-bold">签约付款</p>
                      </div>
                    </div>

                    {/* 连接箭头 */}
                    <div className="hidden md:block absolute left-0 top-10 w-4 h-40 bg-blue-100"></div>

                    {/* 底部说明 */}
                    <div className="mt-12 p-6 bg-blue-50 rounded-lg text-center">
                      <p className="text-gray-700">
                        <span className="text-blue-600 font-bold">结束：</span> 办理完成全部项目，交付，培训
                      </p>
                    </div>
                  </div>
                </div>

                {/* 联系我们部分 */}
                <div className="mt-12 bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">需要帮助？</h2>
                  <p className="text-gray-700 mb-4">
                    如果您对FMC资质申请有任何疑问，或者需要专业的申请服务，请随时联系我们。
                  </p>
                  <button
                    type="button"
                    className="btn-primary"
                  >
                    联系我们
                  </button>
                </div>
              </div>

              {/* 海关Bond介绍内容 */}
              <div className={`space-y-8 ${activeTab === 'bond' ? 'block' : 'hidden'}`}>
                {/* 什么是海关Bond部分 */}
                <div className="bg-gradient-to-r from-teal-50 to-blue-50 p-8 rounded-xl mb-8">
                  <h2 className="text-2xl font-bold text-secondary mb-6 flex items-center">
                    <span className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center text-white mr-3">
                      <FontAwesomeIcon icon={faFileContract} />
                    </span>
                    什么是海关Bond?
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                      <h3 className="text-lg font-bold text-teal-600 mb-4 border-b border-teal-100 pb-2">定义</h3>
                      <p className="text-gray-700 leading-relaxed">
                        根据美国海关与边境保护局(CBP)的规定，海关Bond是"一种确保履行法律或法规规定义务的合同"。它是一种特定类型的担保保证金，是三方之间的合同，用于保证特定义务的履行。
                      </p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm">
                      <h3 className="text-lg font-bold text-teal-600 mb-4 border-b border-teal-100 pb-2">本质</h3>
                      <p className="text-gray-700 leading-relaxed">
                        海关Bond由美国联邦海事委员会(FMC)推行，实际上是一种保险，受益人为美国政府及美国海关。当进口商因故不提领货物且不支付任何费用弃货时，美国海关可以向保险公司求偿以支付该货物在美国产生的各项费用。
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center text-white mb-4">
                        <FontAwesomeIcon icon={faBuilding} className="text-2xl" />
                      </div>
                      <h3 className="font-bold text-gray-800 mb-2">担保公司</h3>
                      <p className="text-gray-700">提供Bond财务担保</p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white mb-4">
                        <FontAwesomeIcon icon={faShip} className="text-2xl" />
                      </div>
                      <h3 className="font-bold text-gray-800 mb-2">进口商</h3>
                      <p className="text-gray-700">作为Bond主体</p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center text-white mb-4">
                        <FontAwesomeIcon icon={faGlobe} className="text-2xl" />
                      </div>
                      <h3 className="font-bold text-gray-800 mb-2">美国海关(CBP)</h3>
                      <p className="text-gray-700">作为Bond受益人</p>
                    </div>
                  </div>



                  <div className="bg-teal-50 p-6 rounded-lg border-l-4 border-teal-500">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                      <FontAwesomeIcon icon={faClipboardCheck} className="text-teal-500 mr-2" />
                      海关Bond的用途
                    </h3>
                    <p className="text-gray-700 mb-4">根据美国海关法规，进口Bond是为了确保法律法规所规定的义务的履行。Bond使用者需同意以下条款：</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start">
                        <div className="w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center text-white mr-3 mt-0.5 flex-shrink-0">
                          <span className="text-xs font-bold">1</span>
                        </div>
                        <p className="text-gray-700">同意及时支付关税、税款和相关费用</p>
                      </div>
                      <div className="flex items-start">
                        <div className="w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center text-white mr-3 mt-0.5 flex-shrink-0">
                          <span className="text-xs font-bold">2</span>
                        </div>
                        <p className="text-gray-700">同意提供单据和证明</p>
                      </div>
                      <div className="flex items-start">
                        <div className="w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center text-white mr-3 mt-0.5 flex-shrink-0">
                          <span className="text-xs font-bold">3</span>
                        </div>
                        <p className="text-gray-700">同意重运输商品</p>
                      </div>
                      <div className="flex items-start">
                        <div className="w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center text-white mr-3 mt-0.5 flex-shrink-0">
                          <span className="text-xs font-bold">4</span>
                        </div>
                        <p className="text-gray-700">同意纠正任何不符合通关条款规定之处</p>
                      </div>
                      <div className="flex items-start">
                        <div className="w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center text-white mr-3 mt-0.5 flex-shrink-0">
                          <span className="text-xs font-bold">5</span>
                        </div>
                        <p className="text-gray-700">同意检查商品</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 海关Bond的类型 */}
                <div className="bg-gradient-to-r from-blue-50 to-teal-50 p-8 rounded-xl mb-8">
                  <h2 className="text-2xl font-bold text-secondary mb-6 flex items-center">
                    <span className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white mr-3">
                      <FontAwesomeIcon icon={faFileSignature} />
                    </span>
                    海关Bond的类型
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {/* 单次进口Bond */}
                    <div className="bg-white p-6 rounded-lg shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-20 h-20">
                        <div className="absolute transform rotate-45 bg-blue-500 text-white font-bold text-xs py-1 right-[-35px] top-[20px] w-[140px] text-center">
                          单次使用
                        </div>
                      </div>
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white mr-4">
                          <FontAwesomeIcon icon={faFileContract} className="text-xl" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800">单次进口Bond</h3>
                      </div>
                      <p className="text-gray-700 mb-4">
                        <span className="text-blue-600 font-medium">Single Entry Bond</span> - 适用于偶尔进行进口的企业，每次进口都需要单独申请。
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <FontAwesomeIcon icon={faCheck} className="text-blue-500 mt-1 mr-2" />
                          <span className="text-gray-700">适合进口频率较低的企业</span>
                        </li>
                        <li className="flex items-start">
                          <FontAwesomeIcon icon={faCheck} className="text-blue-500 mt-1 mr-2" />
                          <span className="text-gray-700">每笔交易都需要提供一笔一次性担保</span>
                        </li>
                        <li className="flex items-start">
                          <FontAwesomeIcon icon={faCheck} className="text-blue-500 mt-1 mr-2" />
                          <span className="text-gray-700">保证金额必须等于或超过货物的总价值加上预估的关税和费用</span>
                        </li>
                      </ul>
                    </div>

                    {/* 连续Bond */}
                    <div className="bg-white p-6 rounded-lg shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-20 h-20">
                        <div className="absolute transform rotate-45 bg-teal-500 text-white font-bold text-xs py-1 right-[-35px] top-[20px] w-[140px] text-center">
                          推荐选择
                        </div>
                      </div>
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center text-white mr-4">
                          <FontAwesomeIcon icon={faFileContract} className="text-xl" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800">连续Bond</h3>
                      </div>
                      <p className="text-gray-700 mb-4">
                        <span className="text-teal-600 font-medium">Continuous Bond</span> - 适用于频繁进口至美国的货运商，有效期为一年，可以覆盖多次进口。
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <FontAwesomeIcon icon={faCheck} className="text-teal-500 mt-1 mr-2" />
                          <span className="text-gray-700">一年内多次使用，自动续期</span>
                        </li>
                        <li className="flex items-start">
                          <FontAwesomeIcon icon={faCheck} className="text-teal-500 mt-1 mr-2" />
                          <span className="text-gray-700">金额基于过去一年支付的关税、税费和费用的10%计算</span>
                        </li>
                        <li className="flex items-start">
                          <FontAwesomeIcon icon={faCheck} className="text-teal-500 mt-1 mr-2" />
                          <span className="text-gray-700">最低金额为50,000美元</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                      <FontAwesomeIcon icon={faInfoCircle} className="text-blue-500 mr-3" />
                      为什么选择连续Bond?
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      大多数进口商选择连续Bond，因为它更加方便，不需要为每次进口单独申请Bond。连续Bond可以涵盖一整年保证期内的所有入境和ISF申报，简化了进口程序，并免除了个别保证金等相关的行政负担。
                    </p>
                  </div>

                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <FontAwesomeIcon icon={faListAlt} className="text-teal-500 mr-3" />
                    其他类型的海关Bond
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="flex items-center mb-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white mr-3">
                          <FontAwesomeIcon icon={faGlobe} className="text-sm" />
                        </div>
                        <h4 className="font-bold text-gray-800">自由贸易区Bond</h4>
                      </div>
                      <p className="text-gray-700 text-sm">用于在自由贸易区内经营的企业</p>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="flex items-center mb-3">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white mr-3">
                          <FontAwesomeIcon icon={faMoneyBillWave} className="text-sm" />
                        </div>
                        <h4 className="font-bold text-gray-800">退税Bond</h4>
                      </div>
                      <p className="text-gray-700 text-sm">用于申请进口关税退税的企业</p>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="flex items-center mb-3">
                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white mr-3">
                          <FontAwesomeIcon icon={faWarehouse} className="text-sm" />
                        </div>
                        <h4 className="font-bold text-gray-800">保税商品保管人Bond</h4>
                      </div>
                      <p className="text-gray-700 text-sm">用于保管保税商品的企业</p>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="flex items-center mb-3">
                        <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white mr-3">
                          <FontAwesomeIcon icon={faShip} className="text-sm" />
                        </div>
                        <h4 className="font-bold text-gray-800">国际承运人Bond</h4>
                      </div>
                      <p className="text-gray-700 text-sm">用于国际货物运输的承运人</p>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="flex items-center mb-3">
                        <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white mr-3">
                          <FontAwesomeIcon icon={faShieldAlt} className="text-sm" />
                        </div>
                        <h4 className="font-bold text-gray-800">进口商安全申报Bond</h4>
                      </div>
                      <p className="text-gray-700 text-sm">用于确保进口商提交准确的安全申报信息</p>
                    </div>
                  </div>
                </div>

                {/* 为什么需要海关Bond */}
                <div className="bg-gradient-to-r from-teal-50 to-blue-50 p-8 rounded-xl mb-8">
                  <h2 className="text-2xl font-bold text-secondary mb-6 flex items-center">
                    <span className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center text-white mr-3">
                      <FontAwesomeIcon icon={faQuestionCircle} />
                    </span>
                    为什么需要海关Bond?
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* 原因1 */}
                    <div className="bg-white p-6 rounded-lg shadow-sm transform transition-transform hover:scale-105">
                      <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center text-white mx-auto mb-4">
                        <FontAwesomeIcon icon={faBalanceScale} className="text-2xl" />
                      </div>
                      <h3 className="text-lg font-bold text-center text-gray-800 mb-3">法律要求</h3>
                      <p className="text-center text-gray-700">
                        所有商业进口都必须提供海关Bond，这是美国海关法规的强制要求。
                      </p>
                    </div>

                    {/* 原因2 */}
                    <div className="bg-white p-6 rounded-lg shadow-sm transform transition-transform hover:scale-105">
                      <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white mx-auto mb-4">
                        <FontAwesomeIcon icon={faShieldAlt} className="text-2xl" />
                      </div>
                      <h3 className="text-lg font-bold text-center text-gray-800 mb-3">保障业务</h3>
                      <p className="text-center text-gray-700">
                        有了海关Bond，您的货物清关过程将更加顺畅，避免不必要的延误和风险。
                      </p>
                    </div>

                    {/* 原因3 */}
                    <div className="bg-white p-6 rounded-lg shadow-sm transform transition-transform hover:scale-105">
                      <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center text-white mx-auto mb-4">
                        <FontAwesomeIcon icon={faHandHoldingUsd} className="text-2xl" />
                      </div>
                      <h3 className="text-lg font-bold text-center text-gray-800 mb-3">财务保障</h3>
                      <p className="text-center text-gray-700">
                        确保关税和费用的支付，避免因违规而导致的罚款和货物扣留。
                      </p>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-start">
                      <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white mr-4 mt-1 flex-shrink-0">
                        <FontAwesomeIcon icon={faExclamationTriangle} className="text-xl" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-3">重要提示</h3>
                        <p className="text-gray-700 leading-relaxed">
                          海关Bond不仅是法律要求，也是保护您业务的重要工具。它确保您的进口流程符合美国海关的所有要求，避免因违规而导致的罚款和货物扣留。
                        </p>
                        <p className="text-gray-700 leading-relaxed mt-3 font-medium text-red-600">
                          没有购买Bond等于在美国海关没有备案，即使有发送ISF也是无法在美国清关进口的，这样的货物抵港会被海关拒收甚至罚款。
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 海关Bond的申请流程 */}
                <div className="bg-gradient-to-r from-blue-50 to-teal-50 p-8 rounded-xl mb-8">
                  <h2 className="text-2xl font-bold text-secondary mb-6 flex items-center">
                    <span className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white mr-3">
                      <FontAwesomeIcon icon={faClipboardList} />
                    </span>
                    海关Bond的申请流程
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
                    {/* 申请所需文件 */}
                    <div className="md:col-span-6 bg-white p-6 rounded-lg shadow-sm">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white mr-3">
                          <FontAwesomeIcon icon={faFileAlt} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800">申请所需文件</h3>
                      </div>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mr-3 mt-0.5 flex-shrink-0">
                            <span className="text-xs font-bold">1</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-800">CBP Form 301</span>
                            <p className="text-gray-600 text-sm">海关Bond申请的主要表格</p>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mr-3 mt-0.5 flex-shrink-0">
                            <span className="text-xs font-bold">2</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-800">Bond Application</span>
                            <p className="text-gray-600 text-sm">Bond申请表</p>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mr-3 mt-0.5 flex-shrink-0">
                            <span className="text-xs font-bold">3</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-800">CBP Form 5106</span>
                            <p className="text-gray-600 text-sm">进口商信息表（如适用）</p>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mr-3 mt-0.5 flex-shrink-0">
                            <span className="text-xs font-bold">4</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-800">其他文件</span>
                            <p className="text-gray-600 text-sm">如报关委托书(POA)、合伙协议等</p>
                          </div>
                        </li>
                      </ul>
                    </div>

                    {/* 申请提交方式 */}
                    <div className="md:col-span-6 bg-white p-6 rounded-lg shadow-sm">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center text-white mr-3">
                          <FontAwesomeIcon icon={faPaperPlane} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800">申请提交方式</h3>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center text-teal-500 mr-3 mt-0.5 flex-shrink-0">
                            <FontAwesomeIcon icon={faFileUpload} />
                          </div>
                          <div>
                            <p className="text-gray-700">
                              所有文件需扫描成分辨率不高于300的TIF格式，所有文档合并为一个邮件附件发送至美国海关指定邮箱。
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center text-teal-500 mr-3 mt-0.5 flex-shrink-0">
                            <FontAwesomeIcon icon={faPhoneAlt} />
                          </div>
                          <div>
                            <p className="text-gray-700">
                              对于办理流程或特殊申请等常规问题，可以直接联系美国海关相关部门。如果Bond申请被拒绝，可以联系Reject Team提交更正申请文件。
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 清关名义说明 */}
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center mb-5">
                      <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white mr-3">
                        <FontAwesomeIcon icon={faExchangeAlt} />
                      </div>
                      <h3 className="text-lg font-bold text-gray-800">清关名义说明</h3>
                    </div>
                    <p className="text-gray-700 mb-6 border-l-4 border-indigo-200 pl-4 py-2 bg-indigo-50">
                      出口到美国的货物既可以用美国收货人(CONSIGNEE)的名义清关，也可以用发货人(SHIPPER)的名义清关。<span className="font-medium text-indigo-600">用谁的Bond就以谁的名义清关。</span>
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-blue-50 p-5 rounded-lg">
                        <h4 className="font-bold text-gray-800 mb-3 flex items-center">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white mr-3 flex-shrink-0">
                            <span className="font-bold">1</span>
                          </div>
                          用美国收货人的名义清关
                        </h4>
                        <ul className="space-y-2 pl-11">
                          <li className="flex items-start">
                            <FontAwesomeIcon icon={faCheck} className="text-blue-500 mt-1 mr-2" />
                            <p className="text-gray-700">如果由货代办理清关，美国收货人需提供他们的Bond，并与货代指定的报关行签署POA</p>
                          </li>
                          <li className="flex items-start">
                            <FontAwesomeIcon icon={faCheck} className="text-blue-500 mt-1 mr-2" />
                            <p className="text-gray-700">如果由美国收货人自己的报关行清关，中国货代需及时提供10+2表格相关信息</p>
                          </li>
                        </ul>
                      </div>

                      <div className="bg-teal-50 p-5 rounded-lg">
                        <h4 className="font-bold text-gray-800 mb-3 flex items-center">
                          <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-white mr-3 flex-shrink-0">
                            <span className="font-bold">2</span>
                          </div>
                          用中国发货人的名义清关
                        </h4>
                        <ul className="space-y-2 pl-11">
                          <li className="flex items-start">
                            <FontAwesomeIcon icon={faCheck} className="text-teal-500 mt-1 mr-2" />
                            <p className="text-gray-700">通常会用美国货代指定的美国报关行办理清关</p>
                          </li>
                          <li className="flex items-start">
                            <FontAwesomeIcon icon={faCheck} className="text-teal-500 mt-1 mr-2" />
                            <p className="text-gray-700">需要提供POA(报关委托书)、中国营业执照、注册税号等文件</p>
                          </li>
                          <li className="flex items-start">
                            <FontAwesomeIcon icon={faCheck} className="text-teal-500 mt-1 mr-2" />
                            <p className="text-gray-700">需要申请购买Bond</p>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 联系我们部分 */}
                <div className="mt-12 bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">需要帮助？</h2>
                  <p className="text-gray-700 mb-4">
                    如果您对美国海关Bond申请有任何疑问，或者需要专业的申请服务，请随时联系我们。
                  </p>
                  <button
                    type="button"
                    className="btn-primary"
                  >
                    联系我们
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default FMCQualification;
