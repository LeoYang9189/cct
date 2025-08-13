import React, { useState } from 'react';
import { Modal, Button, Input } from '@arco-design/web-react';
import { IconList, IconSync, IconApps, IconFile, IconAttachment } from '@arco-design/web-react/icon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot } from '@fortawesome/free-solid-svg-icons';

interface AIAssistantProps {
  visible: boolean;
  onClose: () => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ visible, onClose }) => {
  const [aiMessages, setAiMessages] = useState<{text: string, isUser: boolean}[]>([]);
  const [userInput, setUserInput] = useState('');

  // 处理AI对话
  const handleSendMessage = () => {
    if (!userInput.trim()) return;
    
    // 添加用户消息
    setAiMessages([...aiMessages, {text: userInput, isUser: true}]);
    
    // 模拟AI回复
    setTimeout(() => {
      setAiMessages(prev => [...prev, {
        text: `我已收到你的问题："${userInput}"。我正在处理中，请稍候...`,
        isUser: false
      }]);
      setUserInput('');
    }, 500);
  };

  return (
    <Modal
      title={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <Button type="text" icon={<IconList />} className="mr-2" />
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 mr-2 shadow-sm">
                <FontAwesomeIcon icon={faRobot} className="text-white" />
              </div>
              <span className="text-base font-medium">智能助手卡卡</span>
            </div>
          </div>
          <div className="flex items-center" style={{ marginRight: '50px' }}>
            <Button 
              type="outline" 
              className="text-blue-600 border-blue-200"
              icon={<IconSync style={{ color: '#1677FF' }} />}
              style={{ marginRight: '20px' }}
            >
              开启新对话
            </Button>
            <Button 
              type="outline" 
              className="text-blue-600 border-blue-200"
              icon={<IconApps style={{ color: '#1677FF' }} />}
            >
              切换全屏模式
            </Button>
          </div>
        </div>
      }
      visible={visible}
      onCancel={onClose}
      footer={null}
      style={{ width: '900px', maxHeight: '80vh' }}
      className="ai-chat-modal vertical-center-modal"
      getPopupContainer={() => document.body}
      alignCenter={true}
      modalRender={(modal) => (
        <div style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 12px 32px rgba(0, 0, 0, 0.1)' }}>
          {modal}
        </div>
      )}
    >
      <div className="ai-chat-container flex flex-col h-full" style={{ height: '650px' }}>
        <div className="ai-chat-messages overflow-y-auto flex-grow p-6 pb-0">
          <div className="flex mb-5">
            <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 mr-2 flex-shrink-0 shadow-sm">
              <FontAwesomeIcon icon={faRobot} className="text-white" />
            </div>
            <div className="max-w-[90%]">
              <div className="mb-1">
                <span className="text-orange-500">👋 你好，我是 AI助手卡卡</span>
              </div>
              <div className="text-gray-700">
                我可以帮你操作订单、查询运价、跟踪订单等，快和我对话试试吧！
              </div>
              
              <div className="mt-6">
                <div className="font-medium mb-3">你可以这样问</div>
                <div className="space-y-3">
                  <div className="p-2 text-sm flex items-center cursor-pointer hover:bg-gray-50 rounded-lg transition-all border border-gray-100">
                    <span className="text-blue-500 mr-2">›</span>
                    给我查一下CT1234567的报价有了没
                  </div>
                  <div className="p-2 text-sm flex items-center cursor-pointer hover:bg-gray-50 rounded-lg transition-all border border-gray-100">
                    <span className="text-blue-500 mr-2">›</span>
                    Shanghai 到 bangkok 下周海运什么价格？
                  </div>
                  <div className="p-2 text-sm flex items-center cursor-pointer hover:bg-gray-50 rounded-lg transition-all border border-gray-100">
                    <span className="text-blue-500 mr-2">›</span>
                    CT121212货到哪了
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="ai-chat-footer mt-auto border-t border-gray-200 p-4 sticky bottom-0 bg-white">
          <div className="mb-5">
            <div className="text-sm text-gray-500 mb-3">常用技能：</div>
            <div className="grid grid-cols-4 gap-2">
              <Button 
                size="small" 
                type="outline"
                className="text-blue-600 border-blue-200"
                icon={<IconFile style={{ color: '#1677FF' }} />}
              >
                订单操作
              </Button>
              <Button 
                size="small" 
                type="outline"
                className="text-green-600 border-green-200"
                icon={<IconSync style={{ color: '#00B42A' }} />}
              >
                智能运价
              </Button>
              <Button 
                size="small" 
                type="outline"
                className="text-purple-600 border-purple-200"
                icon={<IconApps style={{ color: '#722ED1' }} />}
              >
                订单跟踪
              </Button>
              <Button 
                size="small" 
                type="outline"
                className="text-cyan-600 border-cyan-200"
                icon={<IconFile style={{ color: '#14C9C9' }} />}
              >
                AI对单
              </Button>
            </div>
          </div>
          
          <div className="relative flex items-center">
            <Input
              value={userInput}
              onChange={value => setUserInput(value)}
              placeholder="需要我帮你做点什么呢？快和我来聊聊吧！"
              className="flex-1"
              style={{ 
                backgroundColor: '#F5F5F5', 
                borderRadius: '20px', 
                height: '42px',
                paddingRight: '100px', // 为回形针和发送按钮留出空间
              }}
            />
            <Button
              type="text"
              className="absolute right-[45px]"
              style={{ 
                height: '36px',
                padding: 0
              }}
              icon={<IconAttachment style={{ color: '#86909C', fontSize: '18px' }} />}
            />
            <Button 
              type="primary" 
              className="absolute right-1"
              style={{ 
                borderRadius: '4px', 
                height: '36px',
                width: '80px',
                padding: '0 12px',
                backgroundColor: '#1677FF'
              }}
              onClick={handleSendMessage}
            >
              <span style={{ marginRight: '2px' }}>发送</span> <span>&gt;&gt;</span>
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AIAssistant; 