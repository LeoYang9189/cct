import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import octopusAvatar from '../../assets/octopus-avatar-new.svg';

const Terms = () => {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">服务条款</h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600">
              欢迎使用Wo AI！平台（以下简称"本平台"）。本服务条款（以下简称"条款"）是您与本平台之间关于您使用本平台服务的法律协议。请您在使用本平台服务前仔细阅读本条款。
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">1. 接受条款</h2>
            <p className="text-gray-600">
              通过访问或使用本平台，您确认您已阅读、理解并同意受本条款的约束。如果您不同意本条款的任何部分，请勿使用本平台。
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">2. 服务描述</h2>
            <p className="text-gray-600">
              Wo AI！是一个AI驱动的国际物流智能平台，提供包括但不限于AI沃宝智能助手、文件识别、超级运价、智能BI等功能和服务。本平台保留随时修改、暂停或终止部分或全部服务的权利，且无需事先通知用户。
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">3. 用户账户</h2>
            <p className="text-gray-600">
              3.1 注册要求：您必须完成注册流程才能使用本平台的完整功能。您同意提供准确、完整和最新的信息，并及时更新相关信息。
            </p>
            <p className="text-gray-600">
              3.2 账户安全：您负责维护您的账户安全，包括保护您的密码和限制对您计算机的访问。您同意对您账户下发生的所有活动承担责任。
            </p>
            <p className="text-gray-600">
              3.3 账户终止：本平台保留在您违反本条款的情况下，暂停或终止您的账户的权利，且无需事先通知。
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">4. 用户行为规范</h2>
            <p className="text-gray-600">
              您同意不会：
            </p>
            <ul className="list-disc pl-6 text-gray-600">
              <li>违反任何适用的法律法规；</li>
              <li>侵犯他人的知识产权、隐私权或其他权利；</li>
              <li>上传、发布或传输任何包含病毒、木马或其他有害代码的内容；</li>
              <li>干扰或破坏本平台的正常运行；</li>
              <li>未经授权访问本平台的系统或网络；</li>
              <li>使用本平台从事任何非法或不道德的活动。</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">5. 知识产权</h2>
            <p className="text-gray-600">
              5.1 平台内容：本平台及其内容（包括但不限于文本、图像、标志、按钮图标、软件等）受著作权、商标权及其他知识产权法律保护，归本平台或其许可方所有。
            </p>
            <p className="text-gray-600">
              5.2 用户内容：您保留您上传至本平台的内容的所有权利。但您授予本平台全球范围内、免费、非独占、可转让的许可，允许本平台使用、复制、修改、创建衍生作品、分发和展示该等内容，以提供和改进本平台服务。
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">6. 免责声明</h2>
            <p className="text-gray-600">
              6.1 服务"按现状"提供：本平台及其服务按"现状"和"可用"的基础提供，不作任何明示或暗示的保证。
            </p>
            <p className="text-gray-600">
              6.2 责任限制：在法律允许的最大范围内，本平台不对任何直接、间接、附带、特殊、后果性或惩罚性损害承担责任，包括但不限于利润损失、商誉损失、数据损失或其他无形损失。
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">7. 条款修改</h2>
            <p className="text-gray-600">
              本平台保留随时修改本条款的权利。修改后的条款将在本平台上发布，并自发布之日起生效。您继续使用本平台将被视为接受修改后的条款。
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">8. 适用法律</h2>
            <p className="text-gray-600">
              本条款受中华人民共和国法律管辖，并按其解释。与本条款相关的任何争议应提交至本平台所在地有管辖权的法院解决。
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">9. 联系我们</h2>
            <p className="text-gray-600">
              如果您对本条款有任何疑问，请通过以下方式联系我们：
            </p>
            <p className="text-gray-600">
              电话：400-0682-666<br />
              邮箱：support@woai.com<br />
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

export default Terms;
