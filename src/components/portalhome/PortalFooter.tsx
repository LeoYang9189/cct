import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faWeixin, 
  faTiktok, 
  faFacebook, 
  faInstagram, 
  faYoutube, 
  faLinkedin, 
  faXTwitter 
} from '@fortawesome/free-brands-svg-icons';
import { faBookOpen } from '@fortawesome/free-solid-svg-icons';

const PortalFooter = () => {
  const navigate = useNavigate();
  const [hoveredSocial, setHoveredSocial] = useState<string | null>(null);

  const footerLinks = [
    {
      title: '产品',
      links: [
        { label: '控制塔', href: '/portal/auth', onClick: () => navigate('/portal/auth') },
        { label: '超级运价', href: '/portal/auth', onClick: () => navigate('/portal/auth') }
      ]
    },
    {
      title: '解决方案',
      links: [
        { label: '海运服务', href: '#' },
        { label: '空运服务', href: '#' },
        { label: '仓储服务', href: '#' },
        { label: '关务服务', href: '#' }
      ]
    },
    {
      title: '公司',
      links: [
        { label: '关于我们', href: '/about' },
        { label: '资讯中心', href: '/portal/news', onClick: () => navigate('/portal/news') },
        { label: '联系我们', href: '#' },
        { label: '员工登录', href: '/staff/auth', onClick: () => navigate('/staff/auth') }
      ]
    }
  ];

  return (
    <footer className="bg-gray-50 pt-16 pb-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
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
            <div className="flex space-x-3 flex-wrap gap-y-2">
              {/* 微信 */}
              <div 
                className="relative"
                onMouseEnter={() => setHoveredSocial('wechat')}
                onMouseLeave={() => setHoveredSocial(null)}
              >
                <button className="text-gray-400 hover:text-green-500 transition-colors duration-300" title="微信" aria-label="关注我们的微信">
                  <FontAwesomeIcon icon={faWeixin} className="h-5 w-5" />
                </button>
                {hoveredSocial === 'wechat' && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-50">
                    <div className="text-center">
                      <img 
                        src="/WX20250623-164557@2x.png" 
                        alt="微信二维码" 
                        className="w-32 h-32 mx-auto object-contain rounded-lg"
                      />
                      <p className="text-xs text-gray-600 mt-3">扫码关注微信公众号</p>
                    </div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-white"></div>
                  </div>
                )}
              </div>

              {/* 抖音/TikTok */}
              <div 
                className="relative"
                onMouseEnter={() => setHoveredSocial('tiktok')}
                onMouseLeave={() => setHoveredSocial(null)}
              >
                <button className="text-gray-400 hover:text-pink-500 transition-colors duration-300" title="抖音/TikTok" aria-label="关注我们的抖音">
                  <FontAwesomeIcon icon={faTiktok} className="h-5 w-5" />
                </button>
                {hoveredSocial === 'tiktok' && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-50">
                    <div className="text-center">
                      <img 
                        src="/assets/qrcodes/douyin-qr.svg" 
                        alt="抖音二维码" 
                        className="w-32 h-32 mx-auto object-contain rounded-lg"
                      />
                      <p className="text-xs text-gray-600 mt-3">扫码关注我们的抖音</p>
                    </div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-white"></div>
                  </div>
                )}
              </div>

              {/* 小红书 */}
              <div 
                className="relative"
                onMouseEnter={() => setHoveredSocial('xiaohongshu')}
                onMouseLeave={() => setHoveredSocial(null)}
              >
                <button className="text-gray-400 hover:text-red-500 transition-colors duration-300" title="小红书" aria-label="关注我们的小红书">
                  <FontAwesomeIcon icon={faBookOpen} className="h-5 w-5" />
                </button>
                {hoveredSocial === 'xiaohongshu' && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-50">
                    <div className="text-center">
                      <img 
                        src="/assets/qrcodes/xiaohongshu-qr.svg" 
                        alt="小红书二维码" 
                        className="w-32 h-32 mx-auto object-contain rounded-lg"
                      />
                      <p className="text-xs text-gray-600 mt-3">扫码关注我们的小红书</p>
                    </div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-white"></div>
                  </div>
                )}
              </div>

              {/* Facebook */}
              <div className="relative">
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-600 transition-colors duration-300" 
                  title="Facebook" 
                  aria-label="关注我们的Facebook"
                >
                  <FontAwesomeIcon icon={faFacebook} className="h-5 w-5" />
                </a>
              </div>

              {/* Instagram */}
              <div className="relative">
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-pink-600 transition-colors duration-300" 
                  title="Instagram" 
                  aria-label="关注我们的Instagram"
                >
                  <FontAwesomeIcon icon={faInstagram} className="h-5 w-5" />
                </a>
              </div>

              {/* YouTube */}
              <div className="relative">
                <a 
                  href="https://youtube.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-red-600 transition-colors duration-300" 
                  title="YouTube" 
                  aria-label="关注我们的YouTube"
                >
                  <FontAwesomeIcon icon={faYoutube} className="h-5 w-5" />
                </a>
              </div>

              {/* LinkedIn */}
              <div className="relative">
                <a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-700 transition-colors duration-300" 
                  title="LinkedIn" 
                  aria-label="关注我们的LinkedIn"
                >
                  <FontAwesomeIcon icon={faLinkedin} className="h-5 w-5" />
                </a>
              </div>

              {/* X (Twitter) */}
              <div className="relative">
                <a 
                  href="https://x.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-black transition-colors duration-300" 
                  title="X (Twitter)" 
                  aria-label="关注我们的X"
                >
                  <FontAwesomeIcon icon={faXTwitter} className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          {/* 链接列表 */}
          {footerLinks.map((column, index) => (
            <div key={index} className="md:col-span-1">
              <h3 className="text-gray-800 font-semibold mb-4">{column.title}</h3>
              <ul className="space-y-2">
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    {link.onClick ? (
                      <button
                        onClick={link.onClick}
                        className="text-gray-600 hover:text-primary text-sm text-left"
                      >
                        {link.label}
                      </button>
                    ) : (
                      <a href={link.href} className="text-gray-600 hover:text-primary text-sm">
                        {link.label}
                      </a>
                    )}
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

export default PortalFooter; 