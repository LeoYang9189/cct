import React from 'react';
import { Typography } from '@arco-design/web-react';

const { Title, Text } = Typography;

const Dashboard: React.FC = () => {
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
            background: 'linear-gradient(135deg, #DEB887, #F4A460)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            🐕
          </span>
          
          {/* 爱心装饰 */}
          <span style={{
            position: 'absolute',
            top: '-20px',
            right: '-30px',
            fontSize: '60px',
            color: '#FF69B4',
            animation: 'heartbeat 2s ease-in-out infinite'
          }}>
            💕
          </span>
        </div>
      </div>

      {/* 文字内容 */}
      <div style={{ maxWidth: '600px' }}>
        <Title 
          heading={2} 
          style={{ 
            marginBottom: '20px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontSize: '36px'
          }}
        >
          这个页面先不做哦~
        </Title>
        
        <Text 
          style={{ 
            fontSize: '18px',
            color: '#666',
            lineHeight: '1.6'
          }}
        >
          汪汪~ 主人，这个控制台页面还在施工中呢 🚧<br/>
          请先去其他页面玩耍吧，我们很快就会完成哒！✨
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
        🌟
      </div>
      
      <div style={{
        position: 'absolute',
        top: '30%',
        right: '15%',
        fontSize: '35px',
        opacity: '0.3',
        animation: 'float 3.5s ease-in-out infinite'
      }}>
        ✨
      </div>
      
      <div style={{
        position: 'absolute',
        bottom: '20%',
        left: '20%',
        fontSize: '45px',
        opacity: '0.3',
        animation: 'float 4.5s ease-in-out infinite reverse'
      }}>
        🌙
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

export default Dashboard; 