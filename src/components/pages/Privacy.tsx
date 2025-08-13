import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import octopusAvatar from '../../assets/octopus-avatar-new.svg';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* 返回首页按钮 */}
      <Link
        to="/"
        className="fixed top-4 left-4 flex items-center text-gray-600 hover:text-primary transition-colors duration-300 z-50"
      >
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>返回首页</span>
      </Link>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <Link to="/" className="inline-block">
            <div className="flex items-center justify-center mb-2">
              <img src={octopusAvatar} alt="AI沃宝" className="h-12 w-12" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              Wo <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">AI</span> ！
            </h2>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white py-8 px-6 shadow-xl rounded-xl"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">隐私政策</h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600">
              Wo AI！平台（以下简称"我们"或"本平台"）非常重视您的隐私保护。本隐私政策旨在向您说明我们如何收集、使用、存储和保护您的个人信息，以及您对这些信息所拥有的权利。请您在使用本平台服务前仔细阅读本隐私政策。
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">1. 信息收集</h2>
            <p className="text-gray-600">
              我们可能收集以下类型的信息：
            </p>
            <ul className="list-disc pl-6 text-gray-600">
              <li><strong>账户信息</strong>：当您注册账户时，我们会收集您的姓名、电子邮件地址、电话号码、公司名称等信息。</li>
              <li><strong>交易信息</strong>：包括您的订单信息、支付信息、物流信息等。</li>
              <li><strong>使用信息</strong>：我们会收集您如何使用我们的服务的信息，如访问时间、访问页面、停留时间等。</li>
              <li><strong>设备信息</strong>：包括您的IP地址、浏览器类型、操作系统、设备标识符等。</li>
              <li><strong>位置信息</strong>：在您授权的情况下，我们可能会收集您的位置信息。</li>
              <li><strong>通信信息</strong>：当您与我们的客服团队沟通时，我们会记录相关通信内容。</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">2. 信息使用</h2>
            <p className="text-gray-600">
              我们使用收集的信息用于以下目的：
            </p>
            <ul className="list-disc pl-6 text-gray-600">
              <li>提供、维护和改进我们的服务；</li>
              <li>处理您的订单和支付；</li>
              <li>向您发送服务通知、更新和安全提醒；</li>
              <li>响应您的请求、问题和反馈；</li>
              <li>进行数据分析，以改善用户体验和服务质量；</li>
              <li>防止欺诈和其他非法活动；</li>
              <li>遵守法律法规的要求。</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">3. 信息共享</h2>
            <p className="text-gray-600">
              我们不会出售您的个人信息。但在以下情况下，我们可能会共享您的信息：
            </p>
            <ul className="list-disc pl-6 text-gray-600">
              <li><strong>服务提供商</strong>：我们可能与帮助我们提供服务的第三方服务提供商共享信息，如支付处理商、物流公司等。这些服务提供商只能按照我们的指示处理您的信息，并受合同约束保护您的信息。</li>
              <li><strong>业务合作伙伴</strong>：在您授权的情况下，我们可能与业务合作伙伴共享信息，以提供您所请求的服务。</li>
              <li><strong>法律要求</strong>：如果法律要求或为了保护我们的权利、财产或安全，我们可能会披露您的信息。</li>
              <li><strong>业务转让</strong>：如果我们参与合并、收购或资产出售，您的信息可能作为交易的一部分被转让。</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">4. 信息安全</h2>
            <p className="text-gray-600">
              我们采取适当的技术和组织措施来保护您的个人信息，防止未经授权的访问、使用或披露。这些措施包括但不限于：
            </p>
            <ul className="list-disc pl-6 text-gray-600">
              <li>使用加密技术保护数据传输；</li>
              <li>实施访问控制机制；</li>
              <li>定期审查和更新安全措施；</li>
              <li>对员工进行隐私和安全培训。</li>
            </ul>
            <p className="text-gray-600">
              尽管我们努力保护您的信息，但请注意，没有任何安全措施是绝对安全的。
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">5. 数据保留</h2>
            <p className="text-gray-600">
              我们会在实现本隐私政策中所述目的所必需的时间内保留您的个人信息，除非法律要求或允许更长的保留期限。
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">6. 您的权利</h2>
            <p className="text-gray-600">
              根据适用的数据保护法律，您可能拥有以下权利：
            </p>
            <ul className="list-disc pl-6 text-gray-600">
              <li><strong>访问权</strong>：您有权获取我们持有的关于您的个人信息的副本。</li>
              <li><strong>更正权</strong>：您有权要求更正不准确或不完整的个人信息。</li>
              <li><strong>删除权</strong>：在某些情况下，您有权要求删除您的个人信息。</li>
              <li><strong>限制处理权</strong>：在某些情况下，您有权限制我们处理您的个人信息。</li>
              <li><strong>数据可携权</strong>：您有权以结构化、常用和机器可读的格式接收您的个人信息，并有权将这些信息传输给另一个控制者。</li>
              <li><strong>反对权</strong>：在某些情况下，您有权反对我们处理您的个人信息。</li>
            </ul>
            <p className="text-gray-600">
              如果您想行使这些权利，请通过本政策末尾提供的联系方式与我们联系。
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">7. Cookie和类似技术</h2>
            <p className="text-gray-600">
              我们使用Cookie和类似技术来收集和存储信息，以提供更好的用户体验。您可以通过浏览器设置控制Cookie的使用，但这可能会影响某些服务的功能。
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">8. 儿童隐私</h2>
            <p className="text-gray-600">
              我们的服务不面向16岁以下的儿童。我们不会故意收集16岁以下儿童的个人信息。如果您发现我们可能收集了16岁以下儿童的个人信息，请立即联系我们，我们将采取措施删除这些信息。
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">9. 隐私政策的变更</h2>
            <p className="text-gray-600">
              我们可能会不时更新本隐私政策。更新后的政策将在本平台上发布，并自发布之日起生效。我们鼓励您定期查看本隐私政策，以了解我们如何保护您的信息。
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">10. 联系我们</h2>
            <p className="text-gray-600">
              如果您对本隐私政策有任何疑问、意见或请求，请通过以下方式联系我们：
            </p>
            <p className="text-gray-600">
              电话：400-0682-666<br />
              邮箱：privacy@woai.com<br />
              地址：上海市浦东新区张江高科技园区
            </p>

            <p className="text-gray-600 mt-8">
              最后更新日期：2023年6月15日
            </p>
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/auth"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-sm transition-all duration-300"
            >
              返回注册
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Privacy;
