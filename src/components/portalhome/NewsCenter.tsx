import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faNewspaper, faCalendarAlt, faEye, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  date: string;
  category: string;
  image: string;
  views: number;
  isHot?: boolean;
}

const NewsCenter: React.FC = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Mock 新闻数据
  const newsData: NewsItem[] = [
    {
      id: '1',
      title: '数字化转型助力国际物流业高质量发展',
      summary: '随着人工智能、大数据等技术的广泛应用，国际物流行业正迎来数字化转型的新机遇...',
      date: '2025-01-15',
      category: '行业动态',
      image: 'https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      views: 1250,
      isHot: true
    },
    {
      id: '2',
      title: '绿色物流成为全球供应链发展新趋势',
      summary: '环保意识的提升推动物流企业积极采用清洁能源运输，减少碳排放成为行业共识...',
      date: '2025-01-12',
      category: '政策解读',
      image: 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      views: 980,
    },
    {
      id: '3',
      title: '中欧班列运营效率持续提升，助力"一带一路"建设',
      summary: '2024年中欧班列开行数量创历史新高，运输时效和服务质量显著改善...',
      date: '2025-01-10',
      category: '国际贸易',
      image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      views: 1560,
      isHot: true
    },
    {
      id: '4',
      title: '港口自动化升级，智慧港口建设提速',
      summary: '全球主要港口加快自动化改造步伐，无人驾驶集装箱卡车和智能装卸设备大规模应用...',
      date: '2025-01-08',
      category: '技术创新',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      views: 875,
    },
    {
      id: '5',
      title: '跨境电商物流服务标准化建设加速推进',
      summary: '海关总署发布新政策，简化跨境电商清关流程，提升物流时效性...',
      date: '2025-01-05',
      category: '政策解读',
      image: 'https://images.unsplash.com/photo-1553413077-190dd305871c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      views: 1320,
    },
    {
      id: '6',
      title: '冷链物流市场快速增长，食品安全保障能力不断增强',
      summary: '随着消费升级和食品安全要求提高，冷链物流基础设施建设投入持续加大...',
      date: '2025-01-03',
      category: '市场分析',
      image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      views: 720,
    }
  ];

  const itemsPerSlide = 3;
  const totalSlides = Math.ceil(newsData.length / itemsPerSlide);

  // 自动轮播
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 4000);

    return () => clearInterval(timer);
  }, [isAutoPlaying, totalSlides]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  const handleNewsClick = (newsId: string) => {
    navigate(`/portal/news/${newsId}`);
  };

  const handleMoreClick = () => {
    navigate('/portal/news');
  };

  const getCurrentSlideItems = () => {
    const startIndex = currentSlide * itemsPerSlide;
    return newsData.slice(startIndex, startIndex + itemsPerSlide);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-32 h-32 bg-blue-100 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-purple-100 rounded-full opacity-30 animate-bounce"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* 标题区域 */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold text-sm uppercase tracking-wider">
              资讯中心
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            行业
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">资讯</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            紧跟物流行业前沿动态，为您带来最新的政策解读、技术创新和市场分析
          </p>
        </div>

        {/* 轮播容器 */}
        <div className="relative bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="p-8">
            {/* 轮播内容 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-h-[400px]">
              {getCurrentSlideItems().map((news) => (
                <div
                  key={news.id}
                  onClick={() => handleNewsClick(news.id)}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer overflow-hidden border border-gray-100"
                >
                  {/* 图片区域 */}
                  <div className="relative overflow-hidden">
                    <img
                      src={news.image}
                      alt={news.title}
                      className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* 内容区域 */}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
                      {news.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                      {news.summary}
                    </p>
                    
                    {/* 底部信息 */}
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
                      <span className="text-blue-600 font-medium group-hover:text-blue-700">
                        阅读更多 →
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 轮播控制 */}
            <div className="flex items-center justify-between mt-8">
              {/* 左侧指示器 */}
              <div className="flex gap-3">
                {Array.from({ length: totalSlides }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentSlide 
                        ? 'bg-blue-600 shadow-lg' 
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>

              {/* 右侧控制按钮 */}
              <div className="flex items-center gap-4">
                <button
                  onClick={goToPrevious}
                  className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-300"
                >
                  <FontAwesomeIcon icon={faChevronLeft} className="text-gray-600" />
                </button>
                <button
                  onClick={goToNext}
                  className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-300"
                >
                  <FontAwesomeIcon icon={faChevronRight} className="text-gray-600" />
                </button>
                <div className="ml-2">
                  <button
                    onClick={handleMoreClick}
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center"
                  >
                    <FontAwesomeIcon icon={faNewspaper} className="mr-2" />
                    查看更多
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 进度条 */}
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-200">
            <div 
              className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-4000 ease-linear"
              style={{ 
                width: isAutoPlaying ? '100%' : '0%',
                transition: isAutoPlaying ? 'width 4s linear' : 'width 0.3s ease'
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsCenter; 