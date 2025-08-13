const Footer = () => {
  const footerLinks = [
    {
      title: '产品',
      links: [
        { label: '功能介绍', href: '#' },
        { label: '定价', href: '#' },
        { label: '安全说明', href: '#' },
        { label: '下载客户端', href: '#' }
      ]
    },
    {
      title: '解决方案',
      links: [
        { label: '国际货运', href: '#' },
        { label: '航空物流', href: '#' },
        { label: '供应链管理', href: '#' },
        { label: '跨境电商', href: '#' }
      ]
    },
    {
      title: '支持',
      links: [
        { label: '帮助中心', href: '#' },
        { label: '专业支持', href: '#' },
        { label: '运维服务', href: '#' },
        { label: '常见问题', href: '#' }
      ]
    },
    {
      title: '公司',
      links: [
        { label: '关于我们', href: '/about' },
        { label: '新闻中心', href: '#' },
        { label: '加入我们', href: '#' },
        { label: '联系我们', href: '#' }
      ]
    }
  ];

  return (
    <footer className="bg-gray-50 pt-16 pb-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          {/* 公司信息 */}
          <div className="md:col-span-1">
            <div className="flex items-center mb-4">
              <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white w-10 h-10 rounded-lg flex items-center justify-center mr-3 relative overflow-hidden shadow-lg">
                <span className="text-xl font-bold">Y</span>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-white rounded-tl-lg flex items-center justify-center">
                  <span className="text-xs text-blue-600 font-bold">L</span>
                </div>
              </div>
              <div>
                <div className="text-lg font-bold text-gray-800 leading-tight tracking-wide">Your LOGO</div>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              为全球国际物流提供智能化解决方案
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary" title="YouTube" aria-label="访问我们的YouTube频道">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.441 16.892c-2.102.144-6.784.144-8.883 0-2.276-.156-2.541-1.27-2.558-4.892.017-3.629.285-4.736 2.558-4.892 2.099-.144 6.782-.144 8.883 0 2.277.156 2.541 1.27 2.559 4.892-.018 3.629-.285 4.736-2.559 4.892zm-6.441-7.234l4.917 2.338-4.917 2.346v-4.684z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-primary" title="Instagram" aria-label="访问我们的Instagram账号">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2.917 18.339c-2.209 0-4-1.791-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.209-1.791 4-4 4zm8.342-8.248c-1.105 0-2-0.895-2-2 0-1.105 0.895-2 2-2 1.104 0 2 0.895 2 2 0 1.105-0.896 2-2 2z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-primary" title="LinkedIn" aria-label="访问我们的LinkedIn主页">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.109 0-.612.492-1.109 1.1-1.109s1.1.497 1.1 1.109c0 .613-.493 1.109-1.1 1.109zm8 6.891h-1.998v-2.861c0-1.881-2.002-1.722-2.002 0v2.861h-2v-6h2v1.093c.872-1.616 4-1.736 4 1.548v3.359z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* 链接列表 */}
          {footerLinks.map((column, index) => (
            <div key={index} className="md:col-span-1">
              <h3 className="text-gray-800 font-semibold mb-4">{column.title}</h3>
              <ul className="space-y-2">
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a href={link.href} className="text-gray-600 hover:text-primary text-sm">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* 底部版权信息 */}
        <div className="pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center mb-4">
            <p className="text-gray-500 text-sm">
              © 2025 WallTech. 保留所有权利.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="/privacy" className="text-gray-500 hover:text-primary text-sm">隐私政策</a>
              <a href="/terms" className="text-gray-500 hover:text-primary text-sm">服务条款</a>
              <a href="/cookie-settings" className="text-gray-500 hover:text-primary text-sm">Cookie 设置</a>
            </div>
          </div>

          {/* 备案信息 */}
          <div className="flex flex-col md:flex-row justify-center items-center space-y-2 md:space-y-0 md:space-x-4 text-xs text-gray-400">
            <a
              href="https://beian.miit.gov.cn/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center hover:text-primary transition-colors duration-300"
            >
              <span>沪ICP备20230512号-1</span>
            </a>
            <a
              href="http://www.beian.gov.cn/portal/registerSystemInfo"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center hover:text-primary transition-colors duration-300"
            >
              <img
                src="/gongan.png"
                alt="公安备案图标"
                className="h-4 mr-1"
              />
              <span>沪公网安备31010402005432号</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;