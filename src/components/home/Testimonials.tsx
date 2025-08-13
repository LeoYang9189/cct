import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Testimonial {
  id: number;
  content: string;
  author: string;
  role: string;
  company: string;
  focus: string;
}

const Testimonials = () => {
  const testimonials: Testimonial[] = [
    {
      id: 1,
      content: "海关专区的AMS/ISF申报系统帮助我们优化了美国航线的申报流程，将申报时间缩短70%，合规性提高到99.8%，大幅降低了滞港风险。",
      author: "张明",
      role: "合规总监",
      company: "中远海运",
      focus: "海关专区"
    },
    {
      id: 2,
      content: "智慧物流系统的Web门户与小程序无缝衔接，我们的客户可随时查询货物状态，提单操作效率提升了40%，客户满意度显著提高。",
      author: "李华",
      role: "运营经理",
      company: "顺丰国际",
      focus: "智慧物流系统"
    },
    {
      id: 3,
      content: "订舱门户系统让我司一键对接多家船公司，实现批量订舱和自动比价，每月为我们节省约20万人民币的运营成本和8名全职员工的工作量。",
      author: "王芳",
      role: "物流主管",
      company: "海尔物流",
      focus: "订舱门户"
    },
    {
      id: 4,
      content: "NVOCC注册和商务部货代备案的代理服务帮助我们快速取得各项资质，省去了繁琐流程，让我们能专注于业务扩展，半年内业务量提升30%。",
      author: "赵强",
      role: "总经理",
      company: "环球速达",
      focus: "经纪代理"
    },
    {
      id: 5,
      content: "工具箱中的全链路跟踪功能太强大了，让我们能实时掌握全球货物动态，主动预警异常情况，客户投诉率下降了60%，运营效率提升显著。",
      author: "刘洋",
      role: "供应链总监",
      company: "京东物流",
      focus: "工具箱"
    }
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const ROTATION_INTERVAL = 5000; // 每5秒轮播一次

  // 自动轮播逻辑
  useEffect(() => {
    const startAutoRotation = () => {
      intervalRef.current = window.setInterval(() => {
        if (!isPaused) {
          setActiveIndex((prev) => (prev + 1) % testimonials.length);
        }
      }, ROTATION_INTERVAL);
    };

    startAutoRotation();

    // 清理定时器
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused, testimonials.length]);

  const nextTestimonial = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
    }
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
    // 手动切换后，重新开始自动轮播
    setTimeout(() => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
      intervalRef.current = window.setInterval(() => {
        if (!isPaused) {
          setActiveIndex((prev) => (prev + 1) % testimonials.length);
        }
      }, ROTATION_INTERVAL);
    }, 100);
  };

  const prevTestimonial = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
    }
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    // 手动切换后，重新开始自动轮播
    setTimeout(() => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
      intervalRef.current = window.setInterval(() => {
        if (!isPaused) {
          setActiveIndex((prev) => (prev + 1) % testimonials.length);
        }
      }, ROTATION_INTERVAL);
    }, 100);
  };

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            客户<span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">评价</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            了解我们的客户如何运用我们的解决方案提升物流效率
          </p>
        </motion.div>

        <div
          className="max-w-4xl mx-auto relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="bg-accent rounded-2xl p-8 md:p-12 shadow-lg relative overflow-hidden"
          >
            {/* 波浪装饰 */}
            <div className="absolute top-0 left-0 w-full h-16 opacity-50 bg-wave-pattern"></div>

            {/* 引号装饰 */}
            <div className="absolute top-6 left-6 text-primary opacity-20 text-6xl font-serif">"</div>

            {/* 功能标签 */}
            <div className="absolute top-4 right-6">
              <span className="inline-block bg-gradient-to-r from-primary/10 to-secondary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                {testimonials[activeIndex].focus}
              </span>
            </div>

            {/* 内容区域 */}
            <div className="relative z-10">
              <blockquote className="text-lg md:text-xl text-gray-700 mb-6">
                {testimonials[activeIndex].content}
              </blockquote>

              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {testimonials[activeIndex].author.charAt(0)}
                </div>
                <div className="ml-4">
                  <p className="font-semibold text-gray-800">{testimonials[activeIndex].author}</p>
                  <p className="text-gray-600 text-sm">{testimonials[activeIndex].role}, {testimonials[activeIndex].company}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 导航按钮及进度条 */}
          <div className="flex flex-col items-center mt-8">
            {/* 进度指示器 */}
            <div className="flex justify-center space-x-2 mb-2 w-full">
              {testimonials.map((_, index) => (
                <div
                  key={index}
                  className="h-1 bg-gray-200 rounded-full flex-1 max-w-16 cursor-pointer"
                  onClick={() => {
                    setActiveIndex(index);
                    // 重置轮播计时器
                    if (intervalRef.current !== null) {
                      clearInterval(intervalRef.current);
                    }
                    intervalRef.current = window.setInterval(() => {
                      if (!isPaused) {
                        setActiveIndex((prev) => (prev + 1) % testimonials.length);
                      }
                    }, ROTATION_INTERVAL);
                  }}
                >
                  {index === activeIndex && (
                    <motion.div
                      className="h-full bg-primary rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: ROTATION_INTERVAL / 1000, ease: "linear" }}
                      key={`progress-${activeIndex}`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 左右箭头 */}
          <button
            type="button"
            onClick={prevTestimonial}
            className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-5 bg-white rounded-full p-2 shadow-md text-primary hover:bg-gray-50 hidden md:block"
            aria-label="查看上一个客户评价"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            type="button"
            onClick={nextTestimonial}
            className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-5 bg-white rounded-full p-2 shadow-md text-primary hover:bg-gray-50 hidden md:block"
            aria-label="查看下一个客户评价"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;