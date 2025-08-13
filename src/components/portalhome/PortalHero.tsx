import React, { useState, useRef, useEffect } from 'react';
import { Button, Input } from '@arco-design/web-react';
import { IconSend, IconRobot, IconUser, IconLink } from '@arco-design/web-react/icon';
import { useNavigate } from 'react-router-dom';

const PortalHero: React.FC = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { type: 'ai', content: '您好！我是您的AI智能助手，有任何关于运价、订单操作或货物跟踪的问题，都可以向我咨询。' },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // 自动滚动到底部
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);
  
  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    // 添加用户消息
    setChatMessages([...chatMessages, { type: 'user', content: inputValue }]);
    
    // 显示AI正在输入
    setIsTyping(true);
    
    // 模拟AI回复
    setTimeout(() => {
      setIsTyping(false);
      let aiResponse = '';
      if (inputValue.includes('运价') || inputValue.includes('价格')) {
        aiResponse = '我可以帮您查询最新的运价信息。请告诉我您需要查询的路线和货物类型，例如"上海到洛杉矶的40GP集装箱运价"。';
      } else if (inputValue.includes('路线') || inputValue.includes('航线')) {
        aiResponse = '目前我们提供多种航线选择，包括亚洲内部航线、亚洲至北美航线、亚洲至欧洲航线等。您需要哪条航线的信息？';
      } else if (inputValue.includes('订舱') || inputValue.includes('预订')) {
        aiResponse = '您可以通过我们的系统快速预订舱位。只需提供起运港、目的地、货物信息和预计出发日期，我就能为您提供可用的舱位选项。';
      } else {
        aiResponse = '感谢您的咨询。请提供更多细节，我可以帮您查询运价、航线、订舱或跟踪货物等信息。';
      }
      setChatMessages(prev => [...prev, { type: 'ai', content: aiResponse }]);
    }, 1500);
    
    // 清空输入框
    setInputValue('');
  };
  
  return (
    <section className="relative bg-white overflow-hidden min-h-[900px]">
      {/* 背景装饰 */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 w-[1200px] h-[1200px] -translate-x-1/2 -translate-y-1/2 opacity-70">
          <div className="w-full h-full rounded-full bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 blur-xl"></div>
        </div>
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] -translate-y-1/2 translate-x-1/3 animate-float-slow">
          <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 opacity-60 blur-md"></div>
        </div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] translate-y-1/3 -translate-x-1/4 animate-float">
          <div className="w-full h-full rounded-full bg-gradient-to-tr from-blue-100 to-indigo-50 opacity-70 blur-md"></div>
        </div>
        
        {/* 装饰图形 */}
        <div className="absolute top-[20%] left-[10%] w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full opacity-80 animate-pulse-slow"></div>
        <div className="absolute top-[30%] right-[15%] w-6 h-6 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full opacity-70 animate-float-slow"></div>
        <div className="absolute bottom-[25%] left-[20%] w-10 h-10 bg-gradient-to-r from-blue-300 to-indigo-400 rounded-full opacity-50 animate-float"></div>
        <div className="absolute bottom-[15%] right-[25%] w-4 h-4 bg-gradient-to-r from-sky-400 to-blue-400 rounded-full opacity-80 animate-pulse"></div>
        
        {/* 网格装饰 */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.05]"></div>
      </div>

      <div className="container mx-auto px-4 pt-40 pb-36 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="portal-animate-fade-in">
            <h1 className="portal-heading portal-heading-xl text-gray-900 leading-tight mb-8">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700">这里是客户自定义的Slogan</span><br />
              <span className="portal-gradient-text text-4xl md:text-5xl font-bold">AI赋能的数字化货代平台</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-lg leading-relaxed">
              智能AI助手实时解答您的运价、航线和货物跟踪问题，让物流管理变得简单高效。
            </p>
            <div className="flex flex-wrap gap-5">
              <Button 
                type="primary" 
                size="large" 
                className="h-14 px-10 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 border-0 text-base shadow-xl hover:shadow-2xl transition-all hover:scale-105 rounded-full font-medium"
                onClick={() => navigate('/controltower-client')}
              >
                进入系统
              </Button>
            </div>
            
            {/* 亮点指标 */}
            <div className="mt-16 grid grid-cols-3 gap-6">
              <div className="p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="text-2xl font-bold text-blue-600 mb-1">99.9%</div>
                <div className="text-sm text-gray-600">服务可靠性</div>
              </div>
              <div className="p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="text-2xl font-bold text-blue-600 mb-1">200+</div>
                <div className="text-sm text-gray-600">全球航线</div>
              </div>
              <div className="p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="text-2xl font-bold text-blue-600 mb-1">8,500+</div>
                <div className="text-sm text-gray-600">活跃用户</div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            {/* 光效 */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-blue-400/10 via-indigo-300/5 to-purple-400/10 rounded-full blur-3xl -z-10"></div>
            
            <div className="relative z-front bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl portal-shadow overflow-hidden border border-gray-100 transform hover:scale-[1.02] transition-transform duration-500">
              {/* 玻璃拟态效果的聊天界面 */}
              
              {/* AI聊天头部 */}
              <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 p-5 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mr-4 border border-white/30">
                    <IconRobot className="text-white text-xl" />
                  </div>
                  <div className="text-white">
                    <div className="font-bold text-lg">AI智能助手</div>
                    <div className="text-xs text-blue-100 flex items-center">
                      <span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-1.5 animate-pulse"></span>
                      在线为您服务 | 实时响应
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-300"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                </div>
              </div>
              
              {/* 聊天窗口 */}
              <div ref={chatContainerRef} className="h-[450px] bg-gradient-to-b from-blue-50/50 to-white p-6 overflow-y-auto custom-scrollbar" style={{ scrollBehavior: 'smooth' }}>
                {chatMessages.map((message, index) => (
                  <div 
                    key={index} 
                    className={`mb-6 flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    style={{
                      opacity: 0,
                      animation: `fadeSlideIn 0.4s ease-out forwards ${index * 0.1}s`
                    }}
                  >
                    {message.type === 'ai' && (
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 mr-3 shadow-md border-2 border-white">
                        <IconRobot />
                      </div>
                    )}
                    <div 
                      className={`px-5 py-4 rounded-2xl max-w-sm ${
                        message.type === 'user' 
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-tr-none shadow-md' 
                          : 'bg-white text-gray-700 rounded-tl-none shadow-md border border-gray-100'
                      }`}
                    >
                      <div className="leading-relaxed">{message.content}</div>
                      <div className={`text-xs mt-2 text-right ${message.type === 'user' ? 'text-blue-100' : 'text-gray-400'}`}>
                        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    {message.type === 'user' && (
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 ml-3 shadow-md border-2 border-white">
                        <IconUser />
                      </div>
                    )}
                  </div>
                ))}
                
                {/* 正在输入指示器 */}
                {isTyping && (
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 mr-3 shadow-md border-2 border-white">
                      <IconRobot />
                    </div>
                    <div className="px-5 py-3 rounded-2xl bg-white text-gray-700 rounded-tl-none shadow-md border border-gray-100">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* 输入区域 - 精美设计 */}
              <div className="p-5 border-t border-gray-100 bg-white flex items-center backdrop-blur-sm">
                <div className="flex flex-1 bg-gray-50 rounded-full border border-gray-200 overflow-hidden pr-1 shadow-inner hover:border-blue-300 transition-colors focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100">
                  <Input 
                    placeholder="输入您的问题..." 
                    value={inputValue}
                    onChange={setInputValue}
                    onPressEnter={handleSendMessage}
                    className="flex-1 border-0 bg-transparent px-4 py-3 text-gray-700"
                  />
                  <div className="flex items-center px-2">
                    <Button 
                      type="text" 
                      icon="😊" 
                      className="mr-1 hover:bg-blue-50 text-gray-500 w-10 h-10 rounded-full"
                    />
                    <Button 
                      type="text" 
                      icon={<IconLink className="text-gray-400" />} 
                      className="mr-2 hover:bg-blue-50 text-gray-500 w-10 h-10 rounded-full"
                    />
                    <Button 
                      type="primary" 
                      icon={<IconSend />} 
                      shape="circle" 
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 border-0 shadow-md hover:shadow-lg transition-all hover:scale-105 w-12 h-12"
                      onClick={handleSendMessage}
                    />
                  </div>
                </div>
              </div>
              
              {/* 界面装饰 - 背景纹理 */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-texture-pattern"></div>
            </div>
            
            {/* 装饰元素 - 更有设计感 */}
            <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 z-20">
              <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-lg transform rotate-12 shadow-xl opacity-90"></div>
            </div>
            <div className="absolute -bottom-8 -left-10 z-0 animate-float">
              <div className="w-28 h-28 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full shadow-xl opacity-60"></div>
            </div>
            <div className="absolute top-1/4 -right-10 z-20 animate-float-slow">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg transform -rotate-12 shadow-xl opacity-70"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 自定义CSS */}
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        
        @keyframes float-slow {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
        
        @keyframes pulse-slow {
          0% { opacity: 0.5; }
          50% { opacity: 0.9; }
          100% { opacity: 0.5; }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(241, 245, 249, 0.5);
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.5);
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(148, 163, 184, 0.8);
        }
        
        .bg-grid-pattern {
          background-image: linear-gradient(to right, rgba(99, 102, 241, 0.1) 1px, transparent 1px),
                           linear-gradient(to bottom, rgba(99, 102, 241, 0.1) 1px, transparent 1px);
          background-size: 20px 20px;
        }
        
        .bg-texture-pattern {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
      `}</style>
    </section>
  );
};

export default PortalHero; 