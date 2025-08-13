import React from 'react';
import { Typography } from '@arco-design/web-react';

const { Title, Text } = Typography;

const AnnouncementDogPage: React.FC = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '80vh',
      textAlign: 'center',
      padding: '40px'
    }}>
      {/* 超大可爱小狗 */}
      <div style={{
        fontSize: '200px',
        lineHeight: '1',
        marginBottom: '30px',
        filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.1))',
        animation: 'float 3s ease-in-out infinite'
      }}>
        <div style={{
          position: 'relative',
          display: 'inline-block'
        }}>
          {/* 小狗身体 */}
          <span style={{
            background: 'linear-gradient(135deg, #FF6B6B, #FFE66D)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            🐶
          </span>
          
          {/* 喇叭装饰 */}
          <span style={{
            position: 'absolute',
            top: '-20px',
            right: '-30px',
            fontSize: '60px',
            color: '#FF6B6B',
            animation: 'heartbeat 2s ease-in-out infinite'
          }}>
            📢
          </span>
        </div>
      </div>

      {/* 文字内容 */}
      <div style={{ maxWidth: '600px' }}>
        <Title 
          heading={2} 
          style={{ 
            marginBottom: '20px',
            background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontSize: '36px'
          }}
        >
          公告板管理开发中~
        </Title>
        
        <Text 
          style={{ 
            fontSize: '18px',
            color: '#666',
            lineHeight: '1.6'
          }}
        >
          汪汪~ 小主人，公告板管理页面还在准备重要通知呢 📋<br/>
          很快就能发布超棒的公告啦！📢✨
        </Text>
      </div>

      {/* 装饰性元素 */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '10%',
        fontSize: '40px',
        opacity: '0.3',
        animation: 'float 4s ease-in-out infinite reverse'
      }}>
        📌
      </div>
      
      <div style={{
        position: 'absolute',
        top: '30%',
        right: '15%',
        fontSize: '35px',
        opacity: '0.3',
        animation: 'float 3.5s ease-in-out infinite'
      }}>
        📝
      </div>
      
      <div style={{
        position: 'absolute',
        bottom: '20%',
        left: '20%',
        fontSize: '45px',
        opacity: '0.3',
        animation: 'float 4.5s ease-in-out infinite reverse'
      }}>
        📣
      </div>
      
      <div style={{
        position: 'absolute',
        bottom: '25%',
        right: '25%',
        fontSize: '30px',
        opacity: '0.3',
        animation: 'float 3.8s ease-in-out infinite'
      }}>
        📄
      </div>

      <style>
        {`
          @keyframes float {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-10px);
            }
          }
          
          @keyframes heartbeat {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.2);
            }
          }
        `}
      </style>
    </div>
  );
};

export default AnnouncementDogPage; 