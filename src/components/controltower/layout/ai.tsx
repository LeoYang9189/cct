import React, { useState } from 'react';
import { Drawer, Button, Input, Dropdown, Menu, Tag } from '@arco-design/web-react';
import { IconSync, IconApps, IconFile, IconAttachment, IconClose, IconSearch, IconUpload, IconMessage, IconMore, IconSend, IconCopy, IconRefresh, IconThumbUp, IconThumbDown } from '@arco-design/web-react/icon';

interface AIAssistantProps {
  visible: boolean;
  onClose: () => void;
  onFullscreen?: () => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ visible, onClose, onFullscreen }) => {
  const [aiMessages, setAiMessages] = useState<{text: string, isUser: boolean}[]>([]);
  const [userInput, setUserInput] = useState('');
  const [skillPrefix, setSkillPrefix] = useState('');

  // 处理AI对话
  const handleSendMessage = () => {
    const fullInput = skillPrefix ? `${skillPrefix} ${userInput}` : userInput;
    if (!fullInput.trim()) return;
    
    // 添加用户消息
    setAiMessages([...aiMessages, {text: fullInput, isUser: true}]);
    
    // 模拟AI回复
    setTimeout(() => {
      setAiMessages(prev => [...prev, {
        text: `我已收到你的问题："${fullInput}"。作为自定义名字的AI助手，我正在处理中，请稍候...`,
        isUser: false
      }]);
      setUserInput('');
      setSkillPrefix('');
    }, 500);
  };

  // 处理快捷按钮点击
  const handleQuickAction = (action: string) => {
    setSkillPrefix(action);
    setUserInput('');
  };

  // 处理示例问题点击
  const handleExampleClick = (question: string) => {
    setAiMessages([...aiMessages, {text: question, isUser: true}]);
    
    setTimeout(() => {
      setAiMessages(prev => [...prev, {
        text: `我已收到你的问题："${question}"。作为自定义名字的AI助手，我正在处理中，请稍候...`,
        isUser: false
      }]);
    }, 500);
  };

  // 处理消息操作
  const handleMessageAction = (action: string, messageText: string) => {
    switch(action) {
      case 'copy':
        navigator.clipboard.writeText(messageText);
        break;
      case 'regenerate':
        // 重新生成回答
        break;
      case 'like':
        // 点赞
        break;
      case 'dislike':
        // 吐槽
        break;
    }
  };

  // 清空技能标签
  const clearSkillPrefix = () => {
    setSkillPrefix('');
  };

  // 开启新对话
  const startNewConversation = () => {
    setAiMessages([]);
    setUserInput('');
    setSkillPrefix('');
  };

  // 更多功能下拉菜单
  const moreMenuDroplist = (
    <Menu onClickMenuItem={(key) => handleQuickAction(key)}>
      <Menu.Item key="生成报价">生成报价</Menu.Item>
      <Menu.Item key="订单跟踪">订单跟踪</Menu.Item>
      <Menu.Item key="船期查询">船期查询</Menu.Item>
      <Menu.Item key="系统配置">系统配置</Menu.Item>
    </Menu>
  );

  return (
    <Drawer
      title={null}
      visible={visible}
      onCancel={onClose}
      placement="right"
      width={420}
      footer={null}
      mask={false}
      closable={false}
      autoFocus={false}
      focusLock={false}
      escToExit={false}
      style={{
        position: 'fixed',
        right: '20px',
        top: '80px',
        height: 'calc(100vh - 100px)',
        borderRadius: '16px',
        boxShadow: '0 8px 40px rgba(79, 70, 229, 0.15)',
        border: '1px solid rgba(79, 70, 229, 0.1)',
        zIndex: 1000
      }}
      bodyStyle={{
        padding: 0,
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* 头部 */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center mr-3 shadow-sm">
            <img src="/assets/g6qmm-vsolk.gif" alt="自定义名字的AI助手" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="text-base font-medium text-gray-800">自定义名字的AI助手</div>
            <div className="text-xs text-purple-600">你的工作，可以更简单</div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            type="text" 
            size="small"
            className="text-purple-600"
            icon={<IconSync style={{ color: '#7C3AED' }} />}
            title="开启新对话"
            onClick={startNewConversation}
          />
          <Button 
            type="text" 
            size="small"
            className="text-purple-600"
            icon={<IconApps style={{ color: '#7C3AED' }} />}
            title="全屏模式"
            onClick={onFullscreen}
          />
          <Button 
            type="text" 
            size="small"
            className="text-gray-500 hover:text-gray-700"
            icon={<IconClose />}
            onClick={onClose}
            title="关闭"
          />
        </div>
      </div>

      {/* 消息区域 */}
      <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-white via-blue-50/30 to-purple-50/20">
        <div className="flex mb-4">
          <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center mr-3 flex-shrink-0 shadow-sm">
            <img src="/assets/g6qmm-vsolk.gif" alt="自定义名字的AI助手" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
            <div className="mb-2">
              <span className="text-purple-600 font-medium">👋 你好，我是自定义名字的AI助手</span>
            </div>
            <div className="text-gray-700 text-sm leading-relaxed">
              你好，我是你的AI助理。我汇集了控制塔各项智能服务，可以帮你处理导入运价、询价报价、系统配置、订单操作等问题，虽然我初出茅庐，但是我每天都在进步哦！
            </div>
            
            <div className="mt-4">
              <div className="font-medium mb-3 text-sm">你可以试试这样问我</div>
              <div className="space-y-2">
                <div 
                  className="p-2 text-xs flex items-center cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-lg transition-all border border-purple-100"
                  onClick={() => handleExampleClick('查看今日新增客户数量和注册情况')}
                >
                  <span className="text-purple-500 mr-2">›</span>
                  <span className="text-gray-700">查看今日新增客户数量和注册情况</span>
                </div>
                <div 
                  className="p-2 text-xs flex items-center cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-lg transition-all border border-purple-100"
                  onClick={() => handleExampleClick('分析本月询价转化率和热门航线')}
                >
                  <span className="text-purple-500 mr-2">›</span>
                  <span className="text-gray-700">分析本月询价转化率和热门航线</span>
                </div>
                <div 
                  className="p-2 text-xs flex items-center cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-lg transition-all border border-purple-100"
                  onClick={() => handleExampleClick('批量更新Shanghai到Bangkok的运价')}
                >
                  <span className="text-purple-500 mr-2">›</span>
                  <span className="text-gray-700">批量更新Shanghai到Bangkok的运价</span>
                </div>
                <div 
                  className="p-2 text-xs flex items-center cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-lg transition-all border border-purple-100"
                  onClick={() => handleExampleClick('查询 宁波到洛杉矶 下周的空运价格')}
                >
                  <span className="text-purple-500 mr-2">›</span>
                  <span className="text-gray-700">查询 宁波到洛杉矶 下周的空运价格</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 显示对话消息 */}
        {aiMessages.map((message, index) => (
          <div key={index} className={`flex mb-3 ${message.isUser ? 'justify-end' : 'justify-start'}`}>
            {!message.isUser && (
              <div className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center mr-2 flex-shrink-0">
                <img src="/assets/g6qmm-vsolk.gif" alt="AI" className="w-full h-full object-cover" />
              </div>
            )}
            <div className={`max-w-[80%] ${message.isUser ? 'flex justify-end' : ''}`}>
              <div className={`p-2 rounded-lg text-sm ${
                message.isUser 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-br-none' 
                  : 'bg-white text-gray-700 border border-gray-200 rounded-bl-none shadow-sm'
              }`}>
                {message.text}
              </div>
              {!message.isUser && (
                <div className="flex items-center gap-1 mt-1 ml-1">
                  <Button
                    type="text"
                    size="mini"
                    className="text-gray-400 hover:text-gray-600"
                    icon={<IconCopy style={{ fontSize: '12px' }} />}
                    onClick={() => handleMessageAction('copy', message.text)}
                    title="复制"
                  />
                  <Button
                    type="text"
                    size="mini"
                    className="text-gray-400 hover:text-gray-600"
                    icon={<IconRefresh style={{ fontSize: '12px' }} />}
                    onClick={() => handleMessageAction('regenerate', message.text)}
                    title="重新回答"
                  />
                  <Button
                    type="text"
                    size="mini"
                    className="text-gray-400 hover:text-green-600"
                    icon={<IconThumbUp style={{ fontSize: '12px' }} />}
                    onClick={() => handleMessageAction('like', message.text)}
                    title="点赞"
                  />
                  <Button
                    type="text"
                    size="mini"
                    className="text-gray-400 hover:text-red-600"
                    icon={<IconThumbDown style={{ fontSize: '12px' }} />}
                    onClick={() => handleMessageAction('dislike', message.text)}
                    title="吐槽"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* 常用技能区域 */}
      <div className="border-t border-gray-200 px-4 py-3 bg-white">
        <div className="flex items-center gap-2.5 justify-center">
          <Button 
            size="mini" 
            type="outline"
            className="text-purple-600 border-purple-200 text-xs"
            icon={<IconSearch style={{ color: '#7C3AED', fontSize: '12px' }} />}
            onClick={() => handleQuickAction('运价查询')}
            style={{ padding: '2px 6px', minWidth: 'auto' }}
          >
            运价查询
          </Button>
          <Button 
            size="mini" 
            type="outline"
            className="text-blue-600 border-blue-200 text-xs"
            icon={<IconUpload style={{ color: '#3B82F6', fontSize: '12px' }} />}
            onClick={() => handleQuickAction('运价导入')}
            style={{ padding: '2px 6px', minWidth: 'auto' }}
          >
            运价导入
          </Button>
          <Button 
            size="mini" 
            type="outline"
            className="text-pink-600 border-pink-200 text-xs"
            icon={<IconFile style={{ color: '#EC4899', fontSize: '12px' }} />}
            onClick={() => handleQuickAction('ChatBI')}
            style={{ padding: '2px 6px', minWidth: 'auto' }}
          >
            ChatBI
          </Button>
          <Button 
            size="mini" 
            type="outline"
            className="text-indigo-600 border-indigo-200 text-xs"
            icon={<IconMessage style={{ color: '#6366F1', fontSize: '12px' }} />}
            onClick={() => handleQuickAction('内部询价')}
            style={{ padding: '2px 6px', minWidth: 'auto' }}
          >
            内部询价
          </Button>
          <Dropdown 
            droplist={moreMenuDroplist} 
            position="top" 
            trigger="click"
          >
            <div 
              className="w-5 h-5 rounded-full flex items-center justify-center cursor-pointer border border-gray-200 hover:border-gray-300 transition-colors"
              style={{ color: '#6B7280' }}
            >
              <IconMore style={{ fontSize: '10px' }} />
            </div>
          </Dropdown>
        </div>
      </div>
      
      {/* 底部输入区域 */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <div className="relative">
          <div 
            className="relative overflow-hidden"
            style={{ 
              background: 'linear-gradient(to right, #EFF6FF, #F3E8FF, #FDF2F8)', 
              borderRadius: '16px', 
              border: '1px solid #C7D2FE'
            }}
          >
            {/* 技能标签区域 */}
            {skillPrefix && (
              <div className="px-3 pt-2 pb-1">
                <Tag
                  color="purple"
                  size="small"
                  closable
                  onClose={clearSkillPrefix}
                  style={{ cursor: 'default' }}
                >
                  {skillPrefix}
                </Tag>
              </div>
            )}
            
            {/* 输入框和按钮容器 */}
            <div className="relative">
              <Input.TextArea
                value={userInput}
                onChange={value => setUserInput(value)}
                placeholder={skillPrefix ? "继续输入你的具体需求..." : "需要我帮你处理什么工作呢？"}
                className="text-sm resize-none"
                style={{ 
                  background: 'transparent',
                  border: 'none',
                  borderRadius: 0,
                  minHeight: '36px',
                  paddingLeft: '12px',
                  paddingRight: '80px',
                  paddingTop: skillPrefix ? '4px' : '8px',
                  paddingBottom: '8px',
                  boxShadow: 'none'
                }}
                autoSize={{ minRows: 1, maxRows: 4 }}
                onPressEnter={(e) => {
                  if (!e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              
              {/* 按钮组 */}
              <div className="absolute right-2 top-1 flex items-center gap-1">
                <Button
                  type="text"
                  size="mini"
                  style={{ 
                    height: '28px',
                    width: '28px',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  icon={<IconAttachment style={{ color: '#86909C', fontSize: '14px' }} />}
                />
                <Button 
                  type="primary" 
                  size="small"
                  style={{ 
                    borderRadius: '12px', 
                    height: '28px',
                    width: '28px',
                    padding: 0,
                    background: 'linear-gradient(to right, #3B82F6, #7C3AED)',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onClick={handleSendMessage}
                  icon={<IconSend style={{ fontSize: '14px' }} />}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default AIAssistant; 