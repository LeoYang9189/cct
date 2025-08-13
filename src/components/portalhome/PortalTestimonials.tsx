import React from 'react';
import { Carousel } from '@arco-design/web-react';

const PortalTestimonials: React.FC = () => {
  const testimonials = [
    {
      content: "超级运价系统极大地提高了我们的工作效率。特别是AI识别功能，让我们可以快速将纸质合约中的运价提取到系统中，减少了大量手动录入的工作。",
      author: "王经理",
      role: "运营总监",
      company: "中国海运物流有限公司",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"
    },
    {
      content: "直观的控制面板和灵活的数据筛选功能，让我们可以快速找到所需的运价信息。系统的报表功能也很强大，帮助我们更好地分析业务数据。",
      author: "李总",
      role: "销售经理",
      company: "环球货运代理(上海)有限公司",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"
    },
    {
      content: "超级运价系统的询价报价流程设计得非常合理，完全符合我们的业务需求。审批流程也很清晰，大大提高了我们的报价效率和准确性。",
      author: "张女士",
      role: "客户经理",
      company: "深圳国际物流有限公司",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"
    }
  ];

  return (
    <section className="py-20 bg-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">客户评价</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            听听我们的客户如何评价超级运价系统
          </p>
        </div>

        <Carousel
          animation="fade"
          autoPlay
          indicatorType="dot"
          showArrow="hover"
          autoPlaySpeed={5000}
          style={{ width: '100%', maxWidth: '1000px', margin: '0 auto' }}
        >
          {testimonials.map((testimonial, index) => (
            <div key={index} className="px-4 py-8">
              <div className="bg-white p-8 rounded-2xl shadow-lg max-w-3xl mx-auto">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="md:w-1/4 flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full overflow-hidden mb-4">
                      <img 
                        src={testimonial.avatar}
                        alt={testimonial.author}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-center">
                      <h4 className="font-medium text-gray-900">{testimonial.author}</h4>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                      <p className="text-xs text-gray-400">{testimonial.company}</p>
                    </div>
                  </div>
                  
                  <div className="md:w-3/4">
                    <div className="relative">
                      <div className="absolute -top-5 -left-2 text-6xl text-blue-200">"</div>
                      <p className="text-gray-600 relative z-10 text-lg italic leading-relaxed">
                        {testimonial.content}
                      </p>
                      <div className="absolute -bottom-8 -right-2 text-6xl text-blue-200">"</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Carousel>

        <div className="mt-16 flex flex-wrap justify-center gap-8">
          <div className="grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Cosco_logo.svg/1200px-Cosco_logo.svg.png" alt="中远海运" className="h-12" />
          </div>
          <div className="grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/China_Shipping_Container_Lines_logo.svg/1200px-China_Shipping_Container_Lines_logo.svg.png" alt="中海集运" className="h-12" />
          </div>
          <div className="grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Maersk_Logo.svg/2560px-Maersk_Logo.svg.png" alt="马士基" className="h-12" />
          </div>
          <div className="grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/CMA_CGM_logo.svg/2560px-CMA_CGM_logo.svg.png" alt="达飞轮船" className="h-12" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PortalTestimonials; 