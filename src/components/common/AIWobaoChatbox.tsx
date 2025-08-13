import { useState } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  variant?: 'default' | 'operator' | 'client'; // 新增变体类型
}

const AIWobaoChatbox: React.FC<Props> = ({ isOpen, onClose, variant = 'default' }) => {
  const [inputText, setInputText] = useState('');

  if (!isOpen) return null;

  // 根据变体配置不同的样式和内容
  const getVariantConfig = () => {
    switch (variant) {
      case 'operator':
        return {
          title: '运营智能助手',
          primaryColor: '#FF7D00',
          backgroundColor: '#FFF7ED',
          borderColor: '#FFD4A3',
          greeting: '你好，我是运营版智能助手',
          description: '我专门为运营团队设计，可以帮你管理客户、维护基础数据、配置运价、分析业务数据等运营工作。',
          hotTopics: [
            '运营数据分析报告如何生成',
            '如何批量更新运价配置',
            '客户管理最佳实践指南'
          ],
          feedbacks: [
            { icon: '✦', label: '运营功能建议', color: '#FFB100' },
            { icon: '⊙', label: '数据分析需求', color: '#F56C6C' },
            { icon: '○', label: '联系技术支持', color: '#409EFF' }
          ],
          examples: [
            '帮我分析本月客户增长趋势',
            '批量更新Shanghai到LA的运价',
            '生成运营效率分析报告'
          ],
          skills: [
            { icon: '👥', label: '客户管理', color: '#FF7D00' },
            { icon: '📊', label: '数据分析', color: '#F53F3F' },
            { icon: '⚙️', label: '系统配置', color: '#722ED1' },
            { icon: '📋', label: '报表生成', color: '#14C9C9' }
          ]
        };
      case 'client':
        return {
          title: '智能助手卡卡',
          primaryColor: '#1677FF',
          backgroundColor: '#F0F8FF',
          borderColor: '#91D5FF',
          greeting: '你好，我是智能助手卡卡',
          description: '我专门为客户设计，可以帮你查询运价、跟踪货物、管理订单、获取物流信息等。',
          hotTopics: [
            '如何快速查询货物状态',
            '运价查询最新功能介绍',
            '订单管理操作指南'
          ],
          feedbacks: [
            { icon: '✦', label: '服务体验反馈', color: '#FFB100' },
            { icon: '⊙', label: '功能改进建议', color: '#F56C6C' },
            { icon: '○', label: '联系客服咨询', color: '#409EFF' }
          ],
          examples: [
            '查询订单CT1234567状态',
            '上海到洛杉矶运费多少',
            '我的货物现在到哪了'
          ],
          skills: [
            { icon: '📦', label: '订单查询', color: '#1677FF' },
            { icon: '💰', label: '运价查询', color: '#00B42A' },
            { icon: '🚛', label: '货物追踪', color: '#722ED1' },
            { icon: '👁️', label: '状态查看', color: '#14C9C9' }
          ]
        };
      default:
        return {
          title: 'AI 沃宝',
          primaryColor: '#1677ff',
          backgroundColor: '#f9f9f9',
          borderColor: '#e6e6e6',
          greeting: '你好，我是 AI 沃宝',
          description: '基于Cargoware 云物流平台设计的智能助手方案，我可以帮你操作订单、查询运价、跟踪订单等。',
          hotTopics: [
            'AI沃宝全新升级了什么功能',
            '如何开启AI沃宝对话',
            'AI沃宝有什么更新计划'
          ],
          feedbacks: [
            { icon: '✦', label: '许愿新功能', color: '#FFB100' },
            { icon: '⊙', label: '吐槽产品经理', color: '#F56C6C' },
            { icon: '○', label: '联系客服了解更多', color: '#409EFF' }
          ],
          examples: [
            '给我查一下我创建的E...',
            '给我查一下 Shanghai ...',
            '给我查一下SHSE1234...'
          ],
          skills: [
            { icon: '📋', label: '订单操作', color: '#409EFF' },
            { icon: '⊕', label: '智能运价', color: '#67C23A' },
            { icon: '⊛', label: '订单跟踪', color: '#B065E4' },
            { icon: '⊗', label: 'Cargoware FAQ', color: '#F56C6C' }
          ]
        };
    }
  };

  const config = getVariantConfig();

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '800px',
      maxWidth: '90vw',
      height: '700px',
      maxHeight: '90vh',
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      boxShadow: `0 4px 20px ${config.primaryColor}20`,
      display: 'flex',
      flexDirection: 'column',
      zIndex: 2000,
    }}>
      {/* 头部 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '16px 20px',
        borderBottom: '1px solid #f0f0f0',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/assets/g6qmm-vsolk.gif" alt={config.title} style={{ width: '32px', height: '32px' }} />
          <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{config.title}</div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px' }}>
          <button
            type="button"
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '6px 12px',
              border: `1px solid ${config.borderColor}`,
              borderRadius: '20px',
              backgroundColor: 'white',
              color: config.primaryColor,
              fontSize: '14px',
            }}
            aria-label="开启新对话"
          >
            <span style={{ marginRight: '6px' }}>⟳</span>
            开启新对话
          </button>
          <button
            type="button"
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '6px 12px',
              border: `1px solid ${config.borderColor}`,
              borderRadius: '20px',
              backgroundColor: 'white',
              color: config.primaryColor,
              fontSize: '14px',
            }}
            aria-label="切换助手模式"
          >
            <span style={{ marginRight: '6px' }}>⇱</span>
            切换助手模式
          </button>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              color: '#999',
            }}
            aria-label="关闭对话框"
          >
            ×
          </button>
        </div>
      </div>

      {/* 内容区 - 顶部部分包含三个卡片 */}
      <div style={{
        padding: '20px',
        borderBottom: '1px solid #f0f0f0'
      }}>
        <div style={{
          display: 'flex',
          gap: '12px',
        }}>
          {/* 热门话题 */}
          <div style={{
            flex: 1,
            backgroundColor: variant === 'operator' ? '#fff2f4' : variant === 'client' ? '#e6f7ff' : '#fff2f4',
            backgroundImage: variant === 'operator' 
              ? 'linear-gradient(to bottom right, #fff2f4, #ffe6e8)'
              : variant === 'client'
              ? 'linear-gradient(to bottom right, #e6f7ff, #bae7ff)'
              : 'linear-gradient(to bottom right, #fff2f4, #ffe6e8)',
            padding: '16px',
            borderRadius: '12px'
          }}>
            <div style={{ marginBottom: '16px', fontWeight: 'bold' }}>热门话题</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {config.hotTopics.map((item, index) => (
                <div key={index} style={{
                  padding: '12px',
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  fontSize: '14px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer'
                }}>
                  {item}
                  <span>›</span>
                </div>
              ))}
            </div>
          </div>

          {/* 使用反馈 */}
          <div style={{
            flex: 1,
            backgroundColor: '#e8f8ee',
            backgroundImage: 'linear-gradient(to bottom right, #e8f8ee, #d3f6d8)',
            padding: '16px',
            borderRadius: '12px'
          }}>
            <div style={{ marginBottom: '16px', fontWeight: 'bold' }}>使用反馈</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {config.feedbacks.map((item, index) => (
                <div key={index} style={{
                  padding: '12px',
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer'
                }}>
                  <span style={{ marginRight: '8px', color: item.color }}>{item.icon}</span>
                  {item.label}
                  <span style={{ marginLeft: 'auto' }}>›</span>
                </div>
              ))}
            </div>
          </div>

          {/* 样例提问 */}
          <div style={{
            flex: 1,
            backgroundColor: '#e0f7ee',
            backgroundImage: 'linear-gradient(to bottom right, #e0f7ee, #c2efdf)',
            padding: '16px',
            borderRadius: '12px'
          }}>
            <div style={{ marginBottom: '16px', fontWeight: 'bold' }}>你可以这样问</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {config.examples.map((item, index) => (
                <div key={index} style={{
                  padding: '12px',
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer'
                }}>
                  {item}
                  <span style={{ marginLeft: 'auto' }}>›</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 对话内容 */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{ display: 'flex', marginBottom: '20px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            marginRight: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <img src="/assets/g6qmm-vsolk.gif" alt={config.title} style={{ width: '32px', height: '32px' }} />
          </div>
          <div style={{
            backgroundColor: config.backgroundColor,
            padding: '12px 16px',
            borderRadius: '0 8px 8px 8px',
            maxWidth: '80%'
          }}>
            <div style={{ marginBottom: '8px' }}>
              <span role="img" aria-label="thumbs up" style={{ marginRight: '8px' }}>👍</span>
              {config.greeting}
            </div>
            <div>
              {config.description}
            </div>
          </div>
        </div>
      </div>

      {/* 底部工具栏和输入框 */}
      <div style={{ padding: '16px', borderTop: '1px solid #f0f0f0' }}>
        <div style={{
          display: 'flex',
          marginBottom: '10px',
          alignItems: 'center',
          color: '#666',
          fontSize: '14px'
        }}>
          <span style={{ marginRight: '10px' }}>常用技能：</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            {config.skills.map((skill, index) => (
              <div key={index} style={{
                padding: '6px 10px',
                border: '1px solid #e6e6e6',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer'
              }}>
                <span style={{ color: skill.color }}>{skill.icon}</span>
                {skill.label}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex' }}>
          <div style={{
            flex: 1,
            border: `1px solid ${config.borderColor}`,
            borderRadius: '24px',
            padding: '10px 16px',
            display: 'flex'
          }}>
            <input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={variant === 'operator' ? '需要我帮你处理什么运营工作呢？' : variant === 'client' ? '需要我帮你查询什么信息呢？' : '输入消息...'}
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                fontSize: '16px',
                backgroundColor: 'transparent'
              }}
            />
            <button
              type="button"
              style={{
                background: 'none',
                border: 'none',
                color: '#999',
                fontSize: '18px',
                cursor: 'pointer'
              }}
              aria-label="附件"
            >
              📎
            </button>
          </div>
          <button
            type="button"
            style={{
              marginLeft: '10px',
              backgroundColor: config.primaryColor,
              color: 'white',
              border: 'none',
              borderRadius: '24px',
              padding: '0 24px',
              fontSize: '16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            aria-label="发送消息"
          >
            <span style={{ marginRight: '4px' }}>⟰</span>
            发送
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIWobaoChatbox;