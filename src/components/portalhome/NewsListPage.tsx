import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Select, Pagination } from '@arco-design/web-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faCalendarAlt, faEye } from '@fortawesome/free-solid-svg-icons';
import PortalHeader from './PortalHeader';
import PortalFooter from './PortalFooter';
import { UserProvider } from './UserContext';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  date: string;
  category: string;
  image: string;
  views: number;
  isHot?: boolean;
  author: string;
}

const NewsListPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('全部');

  // Mock 新闻数据（更多数据）
  const allNewsData: NewsItem[] = [
    {
      id: '1',
      title: '数字化转型助力国际物流业高质量发展',
      summary: '随着人工智能、大数据等技术的广泛应用，国际物流行业正迎来数字化转型的新机遇。智慧物流平台通过整合各类资源，优化运输路径，实现了降本增效的目标。',
      content: '详细内容...',
      date: '2025-01-15',
      category: '行业动态',
      image: 'https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      views: 1250,
      isHot: true,
      author: '李明'
    },
    {
      id: '2',
      title: '绿色物流成为全球供应链发展新趋势',
      summary: '环保意识的提升推动物流企业积极采用清洁能源运输，减少碳排放成为行业共识。新能源车辆和绿色包装材料的应用越来越广泛。',
      content: '详细内容...',
      date: '2025-01-12',
      category: '政策解读',
      image: 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      views: 980,
      author: '王芳'
    },
    {
      id: '3',
      title: '中欧班列运营效率持续提升，助力"一带一路"建设',
      summary: '2024年中欧班列开行数量创历史新高，运输时效和服务质量显著改善。通过优化运行路径和提升装卸效率，为中欧贸易提供了强有力的支撑。',
      content: '详细内容...',
      date: '2025-01-10',
      category: '国际贸易',
      image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      views: 1560,
      isHot: true,
      author: '张伟'
    },
    {
      id: '4',
      title: '港口自动化升级，智慧港口建设提速',
      summary: '全球主要港口加快自动化改造步伐，无人驾驶集装箱卡车和智能装卸设备大规模应用。5G技术的普及为港口数字化转型提供了技术支撑。',
      content: '详细内容...',
      date: '2025-01-08',
      category: '技术创新',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      views: 875,
      author: '陈晓'
    },
    {
      id: '5',
      title: '跨境电商物流服务标准化建设加速推进',
      summary: '海关总署发布新政策，简化跨境电商清关流程，提升物流时效性。标准化服务体系的建设为跨境电商发展提供了有力保障。',
      content: '详细内容...',
      date: '2025-01-05',
      category: '政策解读',
      image: 'https://images.unsplash.com/photo-1553413077-190dd305871c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      views: 1320,
      author: '刘洋'
    },
    {
      id: '6',
      title: '冷链物流市场快速增长，食品安全保障能力不断增强',
      summary: '随着消费升级和食品安全要求提高，冷链物流基础设施建设投入持续加大。温控技术和监测系统的完善确保了食品从产地到餐桌的全程质量。',
      content: '详细内容...',
      date: '2025-01-03',
      category: '市场分析',
      image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      views: 720,
      author: '赵敏'
    },
    {
      id: '7',
      title: '人工智能在物流配送中的应用不断深化',
      summary: 'AI算法优化配送路径，机器人分拣系统提升仓储效率，无人机配送在特定场景下开始商用。人工智能正在重塑物流行业的运营模式。',
      content: '详细内容...',
      date: '2025-01-01',
      category: '技术创新',
      image: 'https://images.unsplash.com/photo-1587440871875-191322ee64b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      views: 1100,
      author: '孙强'
    },
    {
      id: '8',
      title: '区块链技术助力供应链透明度提升',
      summary: '区块链技术在供应链追溯、货物认证等领域的应用越来越成熟，为提升供应链透明度和可信度提供了新的解决方案。',
      content: '详细内容...',
      date: '2024-12-28',
      category: '技术创新',
      image: 'https://images.unsplash.com/photo-1520637836862-4d197d17c983?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      views: 890,
      author: '周丽'
    }
  ];

  const categories = ['全部', '行业动态', '政策解读', '国际贸易', '技术创新', '市场分析'];
  const pageSize = 6;

  // 过滤和搜索逻辑
  const filteredNews = allNewsData.filter(news => {
    const matchesCategory = selectedCategory === '全部' || news.category === selectedCategory;
    const matchesSearch = !searchKeyword || 
      news.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      news.summary.toLowerCase().includes(searchKeyword.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalPages = Math.ceil(filteredNews.length / pageSize);
  const currentNews = filteredNews.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleNewsClick = (newsId: string) => {
    navigate(`/portal/news/${newsId}`);
  };

  return (
    <UserProvider>
      <div className="min-h-screen bg-gray-50">
        <PortalHeader />
        
        {/* 搜索和筛选区域 */}
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="搜索文章标题或内容..."
                  value={searchKeyword}
                  onChange={setSearchKeyword}
                  prefix={<FontAwesomeIcon icon={faSearch} className="text-gray-400" />}
                  size="large"
                  className="rounded-lg"
                />
              </div>
              <div className="md:w-48">
                <Select
                  placeholder="选择分类"
                  value={selectedCategory}
                  onChange={setSelectedCategory}
                  size="large"
                  className="w-full rounded-lg"
                  options={categories.map(cat => ({ label: cat, value: cat }))}
                />
              </div>
            </div>
          </div>

          {/* 文章列表 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {currentNews.map((news) => (
              <article
                key={news.id}
                onClick={() => handleNewsClick(news.id)}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer overflow-hidden"
              >
                {/* 文章图片 */}
                <div className="relative overflow-hidden">
                  <img
                    src={news.image}
                    alt={news.title}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* 文章内容 */}
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
                    {news.title}
                  </h2>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                    {news.summary}
                  </p>
                  
                  {/* 文章元信息 */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <FontAwesomeIcon icon={faCalendarAlt} className="mr-1" />
                        {news.date}
                      </span>
                      <span className="flex items-center">
                        <FontAwesomeIcon icon={faEye} className="mr-1" />
                        {news.views}
                      </span>
                    </div>
                    <span className="text-gray-600 font-medium">
                      作者：{news.author}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* 分页 */}
          {totalPages > 1 && (
            <div className="flex justify-center">
              <Pagination
                current={currentPage}
                total={filteredNews.length}
                pageSize={pageSize}
                onChange={setCurrentPage}
                showTotal
                showJumper
                className="custom-pagination"
              />
            </div>
          )}

          {/* 空状态 */}
          {currentNews.length === 0 && (
            <div className="text-center py-16">
              <div className="text-gray-400 text-6xl mb-4">📰</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">暂无相关文章</h3>
              <p className="text-gray-500">请尝试调整搜索条件或选择其他分类</p>
            </div>
          )}
        </div>

        <PortalFooter />
      </div>
    </UserProvider>
  );
};

export default NewsListPage; 